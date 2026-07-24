import { supabase } from './supabase';

const LIMITS = {
  Gratuit: { invoice: 2, quote: 2 },
  Pro: { invoice: 100, quote: 100 },
  Business: { invoice: Infinity, quote: Infinity }
};

export const getUserSubscription = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('user_subscriptions')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching subscription:', error);
    return null;
  }

  // S'il n'y a pas d'abonnement explicite, on considère qu'il est en Gratuit
  if (!data) {
    return {
      plan_id: 'Gratuit',
      status: 'active'
    };
  }

  return data;
};

export const checkPlanLimit = async (type: 'invoice' | 'quote') => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;

  // L'administrateur n'a pas de limite
  if (userData.user.email === 'docteurdjoco@gmail.com') {
    return true;
  }

  const sub = await getUserSubscription();
  const planId = sub ? sub.plan_id as keyof typeof LIMITS : 'Gratuit';
  
  const limit = LIMITS[planId]?.[type] ?? 2;

  // Si l'utilisateur a un plan illimité pour ce type
  if (limit === Infinity) {
    return true; 
  }

  // Calculer le premier jour du mois courant
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Compter le nombre de documents créés ce mois-ci
  const tableName = type === 'invoice' ? 'invoices' : 'quotes';
  const { count, error } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userData.user.id)
    .gte('created_at', firstDayOfMonth);

  if (error) {
    console.error(`Error counting ${tableName}:`, error);
    return false;
  }

  return (count || 0) < limit;
};
