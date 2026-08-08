"use client";

import React, { useState, useEffect } from 'react';
import { FileText, DollarSign, CheckCircle2, Clock, AlertCircle, FileEdit } from 'lucide-react';
import { getDashboardStats } from '@/lib/data';

type DateFilter = 'today' | '7days' | '30days' | 'all';

const StatsCards = () => {
  const [filter, setFilter] = useState<DateFilter>('today');
  const [statsData, setStatsData] = useState({
    totalInvoices: 0,
    amountBilled: 0,
    amountPaid: 0,
    amountPending: 0,
    amountDraft: 0,
    amountOverdue: 0
  });

  useEffect(() => {
    getDashboardStats(filter).then(data => {
      if (data) setStatsData(data);
    });
  }, [filter]);

  const stats = [
    {
      title: 'Total Factures',
      value: statsData.totalInvoices.toString(),
      icon: <FileText size={24} className="text-blue-600" />,
      trend: 'Nouveau',
      trendUp: true,
      bgIcon: 'bg-blue-50',
    },
    {
      title: 'Montant Facturé',
      value: `${statsData.amountBilled.toLocaleString('fr-FR')} FCFA`,
      icon: <DollarSign size={24} className="text-indigo-600" />,
      trend: 'Nouveau',
      trendUp: true,
      bgIcon: 'bg-indigo-50',
    },
    {
      title: 'Montant Payé',
      value: `${statsData.amountPaid.toLocaleString('fr-FR')} FCFA`,
      icon: <CheckCircle2 size={24} className="text-green-600" />,
      trend: 'Nouveau',
      trendUp: true,
      bgIcon: 'bg-green-50',
    },
    {
      title: 'En Attente',
      value: `${statsData.amountPending.toLocaleString('fr-FR')} FCFA`,
      icon: <Clock size={24} className="text-orange-600" />,
      trend: 'Nouveau',
      trendUp: false,
      bgIcon: 'bg-orange-50',
    },
    {
      title: 'En retard',
      value: `${statsData.amountOverdue.toLocaleString('fr-FR')} FCFA`,
      icon: <AlertCircle size={24} className="text-red-600" />,
      trend: 'Urgent',
      trendUp: false,
      bgIcon: 'bg-red-50',
    },
    {
      title: 'Brouillons',
      value: `${statsData.amountDraft.toLocaleString('fr-FR')} FCFA`,
      icon: <FileEdit size={24} className="text-gray-600" />,
      trend: 'À finaliser',
      trendUp: true,
      bgIcon: 'bg-gray-100',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-1 md:flex md:gap-2 w-full">
        <button
          onClick={() => setFilter('today')}
          className={`px-1 md:px-4 py-2 rounded-lg font-medium text-[10px] sm:text-xs md:text-sm transition-colors text-center leading-tight flex items-center justify-center ${filter === 'today' ? 'bg-blue-600 text-white shadow-sm' : 'bg-surface border border-border text-text hover:bg-gray-50'}`}
        >
          Aujourd'hui
        </button>
        <button
          onClick={() => setFilter('7days')}
          className={`px-1 md:px-4 py-2 rounded-lg font-medium text-[10px] sm:text-xs md:text-sm transition-colors text-center leading-tight flex items-center justify-center ${filter === '7days' ? 'bg-blue-600 text-white shadow-sm' : 'bg-surface border border-border text-text hover:bg-gray-50'}`}
        >
          7 derniers jours
        </button>
        <button
          onClick={() => setFilter('30days')}
          className={`px-1 md:px-4 py-2 rounded-lg font-medium text-[10px] sm:text-xs md:text-sm transition-colors text-center leading-tight flex items-center justify-center ${filter === '30days' ? 'bg-blue-600 text-white shadow-sm' : 'bg-surface border border-border text-text hover:bg-gray-50'}`}
        >
          30 derniers jours
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-1 md:px-4 py-2 rounded-lg font-medium text-[10px] sm:text-xs md:text-sm transition-colors text-center leading-tight flex items-center justify-center ${filter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-surface border border-border text-text hover:bg-gray-50'}`}
        >
          Tous
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => (
        <div key={index} className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-text">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgIcon}`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default StatsCards;
