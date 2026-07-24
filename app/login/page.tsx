"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState('');

  useEffect(() => {
    const checkLockout = () => {
      const lockoutTimestamp = localStorage.getItem('lockoutTimestamp');
      if (lockoutTimestamp) {
        const timeRemaining = parseInt(lockoutTimestamp) - Date.now();
        if (timeRemaining > 0) {
          const minutes = Math.ceil(timeRemaining / 60000);
          setLockoutTimer(`Trop de tentatives. Veuillez réessayer dans ${minutes} minute(s).`);
        } else {
          localStorage.removeItem('lockoutTimestamp');
          localStorage.removeItem('loginAttempts');
          setLockoutTimer('');
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const lockoutTimestamp = localStorage.getItem('lockoutTimestamp');
    if (lockoutTimestamp && parseInt(lockoutTimestamp) > Date.now()) {
        const minutes = Math.ceil((parseInt(lockoutTimestamp) - Date.now()) / 60000);
        setError(`Trop de tentatives. Veuillez réessayer dans ${minutes} minute(s).`);
        return;
    }

    setLoading(true);
    setError('');
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      let currentAttempts = parseInt(localStorage.getItem('loginAttempts') || '0') + 1;
      
      if (currentAttempts >= 5) {
        const newLockout = Date.now() + 10 * 60 * 1000;
        localStorage.setItem('lockoutTimestamp', newLockout.toString());
        setError(`Trop de tentatives. Veuillez réessayer dans 10 minutes.`);
        setLockoutTimer(`Trop de tentatives. Veuillez réessayer dans 10 minutes.`);
      } else {
        localStorage.setItem('loginAttempts', currentAttempts.toString());
        setError(`${authError.message} (Tentative ${currentAttempts}/5)`);
      }
      setLoading(false);
    } else {
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutTimestamp');
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <span className="font-bold text-2xl text-primary tracking-tight">izifacture</span>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Bienvenue</h2>
        <p className="text-center text-gray-500 mb-8">Connectez-vous pour gérer vos factures</p>

        {error && !lockoutTimer && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {lockoutTimer && (
          <div className="mb-4 p-3 bg-orange-50 border border-orange-200 text-orange-700 text-sm rounded-lg text-center font-medium">
            {lockoutTimer}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border border-gray-200 focus:border-blue-500 transition-colors"
              placeholder="votre@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 rounded-lg px-4 py-3 text-sm outline-none border border-gray-200 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !!lockoutTimer}
            className={`w-full font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mt-2 ${
              lockoutTimer 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-lg transition-colors flex justify-center items-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Pas encore de compte ?{' '}
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
