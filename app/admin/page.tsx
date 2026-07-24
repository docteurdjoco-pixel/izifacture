"use client";

import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, Activity, Star, Zap, Shield, Crown } from 'lucide-react';
import { getAdminDashboardData } from './actions';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [filter, setFilter] = useState('Tous');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user || authData.user.email !== 'docteurdjoco@gmail.com') {
        window.location.href = '/dashboard';
        return;
      }

      const res = await getAdminDashboardData();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.error || 'Erreur inconnue');
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center font-medium">
        {error}
      </div>
    );
  }

  const STATS = [
    { id: 1, title: 'Utilisateurs Totaux', value: data.totalUsers, icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 2, title: 'Utilisateurs Actifs', value: data.activeUsers, icon: Activity, color: 'text-green-500', bgColor: 'bg-green-50' },
    { id: 3, title: 'Revenu Mensuel (MRR)', value: data.mrr, icon: DollarSign, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { id: 4, title: 'Taux de Conversion', value: data.conversionRate, icon: TrendingUp, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  ];

  const PLAN_DISTRIBUTION = data.distribution.map((d: any) => ({
    ...d,
    icon: d.name === 'Gratuit' ? Star : d.name === 'Pro' ? Zap : Crown,
    color: d.name === 'Gratuit' ? 'text-gray-500' : d.name === 'Pro' ? 'text-blue-500' : 'text-yellow-500',
    bgColor: d.name === 'Gratuit' ? 'bg-gray-100' : d.name === 'Pro' ? 'bg-blue-100' : 'bg-yellow-100',
    barColor: d.name === 'Gratuit' ? 'bg-gray-400' : d.name === 'Pro' ? 'bg-blue-500' : 'bg-yellow-500'
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-blue-600" />
            Espace Administrateur
          </h1>
          <p className="text-gray-500">Vue globale sur les performances et les utilisateurs.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                  <Icon size={24} className={stat.color} />
                </div>
              </div>
              <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.title}</h3>
              <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Plan Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Répartition des abonnements</h3>
        <div className="space-y-6">
          {PLAN_DISTRIBUTION.map((plan: any, i: number) => {
            const Icon = plan.icon;
            return (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${plan.bgColor}`}>
                  <Icon size={20} className={plan.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">{plan.name}</span>
                    <span className="font-bold text-gray-700">{plan.count} utilisateurs <span className="text-gray-400 font-normal text-sm ml-1">({plan.percentage}%)</span></span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${plan.barColor} rounded-full`} style={{ width: `${plan.percentage}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-gray-900">Utilisateurs récents</h3>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          >
            <option value="Tous">Tous les plans</option>
            <option value="Gratuit">Gratuit</option>
            <option value="Pro">Pro</option>
            <option value="Business">Business</option>
          </select>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">UTILISATEUR</th>
                <th className="px-6 py-4">PLAN</th>
                <th className="px-6 py-4">REVENU</th>
                <th className="px-6 py-4">DATE D'INSCRIPTION</th>
                <th className="px-6 py-4">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.recentUsers.filter((u: any) => filter === 'Tous' || u.plan === filter).map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-700 shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold
                      ${user.plan === 'Business' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 
                        user.plan === 'Pro' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 
                        'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{user.revenue}</td>
                  <td className="px-6 py-4 text-gray-500">{user.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                      ${user.status === 'Actif' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Actif' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
              {data.recentUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Aucun utilisateur trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
