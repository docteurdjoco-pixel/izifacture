"use server";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function getAdminDashboardData() {
  try {
    // We use the service role key to bypass RLS and access auth.users
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Get all user subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*');

    if (subError) throw subError;

    // 2. Get all users from auth to combine data
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    const users = usersData.users;

    // 3. Get company settings for names
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('company_settings')
      .select('user_id, company_name');
    
    const settingsMap = new Map(settings?.map(s => [s.user_id, s.company_name]) || []);

    // 4. Process stats
    const totalUsers = users.length;
    let activeUsers = 0;
    
    let planCounts = { Gratuit: 0, Pro: 0, Business: 0 };
    let mrr = 0;

    const recentUsers = [];

    const subMap = new Map(subscriptions?.map(s => [s.user_id, s]) || []);

    for (const user of users) {
      const sub = subMap.get(user.id);
      const plan = sub?.plan_id || 'Gratuit';
      const status = sub?.status || 'active';
      
      if (status === 'active') activeUsers++;

      if (plan === 'Gratuit') planCounts.Gratuit++;
      else if (plan === 'Pro') planCounts.Pro++;
      else if (plan === 'Business') planCounts.Business++;

      let revenue = 0;
      if (plan === 'Pro' && status === 'active') revenue = 2900;
      if (plan === 'Business' && status === 'active') revenue = 5900;
      mrr += revenue;

      recentUsers.push({
        id: user.id,
        name: settingsMap.get(user.id) || user.user_metadata?.full_name || 'Utilisateur',
        email: user.email,
        plan: plan,
        status: status === 'active' ? 'Actif' : 'Inactif',
        date: new Date(user.created_at).toISOString().split('T')[0],
        revenue: `${revenue} FCFA`,
        rawDate: new Date(user.created_at).getTime()
      });
    }

    // Sort recent users by date descending
    recentUsers.sort((a, b) => b.rawDate - a.rawDate);
    const topRecent = recentUsers.slice(0, 10); // Show top 10

    // Plan Distribution Percentages
    const calcPct = (count: number) => totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
    const distribution = [
      { name: 'Gratuit', count: planCounts.Gratuit, percentage: calcPct(planCounts.Gratuit) },
      { name: 'Pro', count: planCounts.Pro, percentage: calcPct(planCounts.Pro) },
      { name: 'Business', count: planCounts.Business, percentage: calcPct(planCounts.Business) },
    ];

    return {
      success: true,
      data: {
        totalUsers: totalUsers.toLocaleString('fr-FR'),
        activeUsers: activeUsers.toLocaleString('fr-FR'),
        mrr: mrr.toLocaleString('fr-FR') + ' FCFA',
        conversionRate: totalUsers > 0 ? ((planCounts.Pro + planCounts.Business) / totalUsers * 100).toFixed(1) + '%' : '0%',
        distribution,
        recentUsers: topRecent
      }
    };
  } catch (error) {
    console.error("Admin data fetch error:", error);
    return { success: false, error: 'Erreur lors de la récupération des données' };
  }
}
