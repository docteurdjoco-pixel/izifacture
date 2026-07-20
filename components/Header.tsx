"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu, X, LayoutDashboard, Users, FileText, HelpCircle, Settings, LogOut, Moon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
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

  const getBreadcrumb = () => {
    if (pathname === '/') return { section: 'Dashboard', page: 'Aperçu' };
    if (pathname.startsWith('/clients')) return { section: 'Clients', page: 'Liste' };
    if (pathname.startsWith('/invoices/create')) return { section: 'Factures', page: 'Création' };
    if (pathname.startsWith('/invoices/')) return { section: 'Factures', page: 'Détails' };
    if (pathname.startsWith('/invoices')) return { section: 'Factures', page: 'Liste' };
    if (pathname.startsWith('/quotes/create')) return { section: 'Devis', page: 'Création' };
    if (pathname.startsWith('/quotes/')) return { section: 'Devis', page: 'Détails' };
    if (pathname.startsWith('/quotes')) return { section: 'Devis', page: 'Liste' };
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
        <button className="relative text-muted hover:text-text transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-surface border-b border-border shadow-lg md:hidden flex flex-col py-2 px-4 animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
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
            <Link href="/support" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/support') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <HelpCircle size={20} />
              Aide et Support
            </Link>
            <Link href="/settings" onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors ${pathname.startsWith('/settings') ? 'bg-blue-50 text-blue-600' : 'text-text hover:bg-background'}`}>
              <Settings size={20} />
              Paramètres
            </Link>
            
            <div className="flex items-center justify-between px-3 py-3 rounded-lg font-medium cursor-pointer text-text hover:bg-background transition-colors" onClick={toggleDarkMode}>
              <div className="flex items-center gap-3">
                <Moon size={20} />
                Mode Sombre
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all duration-300 ${isDark ? 'left-5' : 'left-0.5'}`}></div>
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
