import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { planId, phone, countryCode } = await request.json();

    if (!['Pro', 'Business'].includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', redirect: '/register' }, { status: 401 });
    }

    const CHARIOW_API_KEY = process.env.CHARIOW_SECRET_KEY;
    const CHARIOW_PRODUCT_PRO = process.env.CHARIOW_PRODUCT_PRO_ID;
    const CHARIOW_PRODUCT_BUSINESS = process.env.CHARIOW_PRODUCT_BUSINESS_ID;

    if (!CHARIOW_API_KEY || !CHARIOW_PRODUCT_PRO || !CHARIOW_PRODUCT_BUSINESS) {
      console.warn("Clés API Chariow manquantes. Utilisation du mode simulation.");
      return NextResponse.json({ url: `/checkout-simulation?plan=${planId}&userId=${user.id}` });
    }

    const productId = planId === 'Pro' ? CHARIOW_PRODUCT_PRO : CHARIOW_PRODUCT_BUSINESS;

    // Appel à l'API Chariow pour générer une session de paiement
    const response = await fetch('https://api.chariow.com/v1/checkout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CHARIOW_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        email: user.email,
        first_name: user.user_metadata?.first_name || 'Utilisateur',
        last_name: user.user_metadata?.last_name || 'iziFacture',
        phone: {
          number: phone || "91475677",
          country_code: countryCode || "TG"
        },
        custom_metadata: { userId: user.id, planId }
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Erreur Chariow API:', result);
      let errorMsg = result.message || JSON.stringify(result);
      if (result.errors && Object.keys(result.errors).length > 0) {
        errorMsg = typeof result.errors === 'string' ? result.errors : JSON.stringify(result.errors);
      }
      return NextResponse.json({ error: `Erreur Chariow: ${errorMsg}` }, { status: 500 });
    }

    if (result.data?.step === 'payment' && result.data?.payment?.checkout_url) {
      return NextResponse.json({ url: result.data.payment.checkout_url });
    } else if (result.data?.step === 'already_purchased') {
      return NextResponse.json({ error: 'Vous possédez déjà ce plan.' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Réponse inattendue de Chariow' }, { status: 500 });

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
