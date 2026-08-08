"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu, X, LayoutDashboard, Users, FileText, HelpCircle, Settings, LogOut, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        setUserEmail(authData.user.email || null);
        if (authData.user.email === 'docteurdjoco@gmail.com') {
          setUserPlan('Admin');
        } else {
          const { data: subData } = await supabase
            .from('user_subscriptions')
            .select('plan_id')
            .eq('user_id', authData.user.id)
            .single();
          
          setUserPlan(subData?.plan_id || 'Gratuit');
        }
      }
    };
    
    fetchUserPlan();
  }, []);

  const getBreadcrumb = () => {
    if (pathname === '/dashboard') return { section: 'Dashboard', page: 'Aperçu' };
    if (pathname?.startsWith('/admin')) return { section: 'Administration', page: 'Vue d\'ensemble' };
    if (pathname?.startsWith('/clients')) return { section: 'Clients', page: 'Liste' };
    if (pathname?.startsWith('/invoices/create')) return { section: 'Factures', page: 'Création' };
    if (pathname?.startsWith('/invoices/')) return { section: 'Factures', page: 'Détails' };
    if (pathname?.startsWith('/invoices')) return { section: 'Factures', page: 'Liste' };
    if (pathname?.startsWith('/quotes/create')) return { section: 'Devis', page: 'Création' };
    if (pathname?.startsWith('/quotes/')) return { section: 'Devis', page: 'Détails' };
    if (pathname?.startsWith('/quotes')) return { section: 'Devis', page: 'Liste' };
    return { section: 'Dashboard', page: 'Aperçu' };
  };

  const breadcrumb = getBreadcrumb();

  return (
    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-8 shrink-0 relative z-50">
      <div className="flex items-center gap-4 md:hidden">
        <button 
          className="text-text hover:text-blue-600 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="font-bold text-xl text-primary">izifacture</div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted">
        <span className="text-text">{breadcrumb.section}</span>
      </div>

      <div className="flex items-center gap-4">
        {userPlan && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm border ${
            userPlan === 'Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
            userPlan === 'Business' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
            userPlan === 'Pro' ? 'bg-blue-100 text-blue-700 border-blue-200' :
            'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {userPlan}
          </span>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-surface border-b border-border shadow-lg md:hidden flex flex-col py-2 px-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/clients" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/clients') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <Users size={20} />
              Clients
            </Link>
            <Link href="/invoices" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/invoices') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <FileText size={20} />
              Factures
            </Link>
            <Link href="/quotes" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/quotes') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <FileText size={20} className="transform rotate-180" />
              Devis
            </Link>
            <div className="h-px bg-border my-2"></div>
            {userEmail === 'docteurdjoco@gmail.com' && (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/admin') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
                <Shield size={20} />
                Administrateur
              </Link>
            )}
            <Link href="/support" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/support') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <HelpCircle size={20} />
              Aide et Support
            </Link>
            <Link href="/settings" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/settings') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <Settings size={20} />
              Paramètres
            </Link>
            
            <div className="mt-2 pt-4 border-t border-border flex items-center gap-3 px-3 pb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shrink-0 uppercase">
                {userEmail ? userEmail.charAt(0) : 'U'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-sm truncate text-text capitalize">
                  {userEmail ? userEmail.split('@')[0].replace('.', ' ') : 'Utilisateur'}
                </div>
                <div className="text-xs text-muted truncate">{userEmail || 'Chargement...'}</div>
              </div>
            </div>

            <button 
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
                router.refresh();
              }} 
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Se déconnecter
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
