"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, Wallet, Settings, HelpCircle, Moon, Users, Search, LogOut, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
    
    // Fetch the current user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserEmail(data.user.email || null);
      }
    };
    fetchUser();
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <aside className="w-64 bg-surface border-r border-border h-screen flex flex-col justify-between p-4 hidden md:flex shrink-0">
      <div>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-xl text-primary tracking-tight">izifacture</span>
        </div>



        <div className="text-xs font-semibold text-muted mb-4 px-2 tracking-wider">MENU</div>

        <nav className="space-y-1">
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-muted hover:bg-background hover:text-text'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link href="/clients" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname.startsWith('/clients') ? 'bg-blue-50 text-blue-600' : 'text-muted hover:bg-background hover:text-text'}`}>
            <Users size={20} />
            Clients
          </Link>
          <Link href="/invoices" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname.startsWith('/invoices') ? 'bg-blue-50 text-blue-600' : 'text-muted hover:bg-background hover:text-text'}`}>
            <FileText size={20} />
            Factures
          </Link>
          <Link href="/quotes" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname.startsWith('/quotes') ? 'bg-blue-50 text-blue-600' : 'text-muted hover:bg-background hover:text-text'}`}>
            <FileText size={20} className="transform rotate-180" />
            Devis
          </Link>
        </nav>
      </div>

      <div className="space-y-1">
        {userEmail === 'docteurdjoco@gmail.com' && (
          <Link href="/admin" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname.startsWith('/admin') ? 'bg-blue-50 text-blue-600' : 'text-muted hover:bg-background hover:text-text'}`}>
            <Shield size={20} />
            Administrateur
          </Link>
        )}
        <Link href="/support" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname.startsWith('/support') ? 'bg-blue-50 text-blue-600' : 'text-muted hover:bg-background hover:text-text'}`}>
          <HelpCircle size={20} />
          Aide et Support
        </Link>
        <Link href="/settings" className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${pathname.startsWith('/settings') ? 'bg-blue-50 text-blue-600' : 'text-muted hover:bg-background hover:text-text'}`}>
          <Settings size={20} />
          Paramètres
        </Link>
        <div className="flex items-center justify-between px-3 py-2 text-muted font-medium cursor-pointer" onClick={toggleDarkMode}>
          <div className="flex items-center gap-3">
            <Moon size={20} />
            Mode Sombre
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${isDark ? 'left-5' : 'left-0.5'}`}></div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shrink-0 uppercase">
            {userEmail ? userEmail.charAt(0) : 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-semibold text-sm truncate text-text capitalize">
              {userEmail ? userEmail.split('@')[0].replace('.', ' ') : 'Utilisateur'}
            </div>
            <div className="text-xs text-muted truncate">{userEmail || 'Chargement...'}</div>
          </div>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              router.push('/login');
              router.refresh();
            }} 
            className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0 tooltip" 
            title="Se déconnecter"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
