import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Ce webhook utilise le service_role key pour pouvoir modifier la table user_subscriptions sans session utilisateur active.

export async function POST(request: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const payload = await request.json();
    
    // Vérification de la signature du webhook (à implémenter selon la doc Chariow)
    // const signature = request.headers.get('Chariow-Signature');

    // On suppose que l'event de succès s'appelle "order.paid"
    if (payload.event === 'order.paid') {
      const { metadata } = payload.data;
      const { userId, planId } = metadata;

      if (userId && planId) {
        // Mise à jour ou insertion dans la base de données
        const { error } = await supabaseAdmin
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            plan_id: planId,
            status: 'active',
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (error) {
          console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
          return NextResponse.json({ error: 'DB Error' }, { status: 500 });
        }

        return NextResponse.json({ received: true });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
  }
}
