"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isAuthPage) {
    return (
      <main className="h-full w-full bg-gray-50 flex items-center justify-center">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-8 bg-background">
          {children}
        </main>
      </div>
    </>
  );
}
