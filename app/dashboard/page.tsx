import React from 'react';
import StatsCards from '@/components/StatsCards';
import RecentInvoices from '@/components/RecentInvoices';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <StatsCards />
      
      <div className="space-y-4">
        <RecentInvoices />
      </div>
    </div>
  );
}
