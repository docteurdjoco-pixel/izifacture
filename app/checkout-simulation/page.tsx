"use client";

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function SimulationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const planId = searchParams.get('plan');
  const userId = searchParams.get('userId');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const simulatePayment = async () => {
    setLoading(true);
    
    // Simuler le temps de paiement
    await new Promise(r => setTimeout(r, 1500));
    
    try {
      // Directement mettre à jour l'abonnement pour la simulation
      const { error } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (err) {
      alert("Erreur lors de la simulation: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-md mx-auto p-6 text-center">
      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
        <ShieldCheck className="text-yellow-600 h-8 w-8" />
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Mode Simulation Actif</h1>
      <p className="text-gray-500 mb-8">
        Les clés API Chariow sont manquantes. Vous êtes dans l'environnement de test. Cliquez ci-dessous pour simuler un paiement réussi pour le plan <strong>{planId}</strong>.
      </p>
      
      {success ? (
        <div className="text-green-600 font-semibold p-4 bg-green-50 rounded-xl w-full">
          Paiement simulé avec succès ! Redirection...
        </div>
      ) : (
        <button 
          onClick={simulatePayment}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
        >
          {loading ? (
            <><Loader2 className="animate-spin mr-2" size={20} /> Traitement...</>
          ) : (
            `Simuler le paiement ${planId}`
          )}
        </button>
      )}
      
      <button 
        onClick={() => router.back()}
        className="mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
      >
        Annuler et retourner
      </button>
    </div>
  );
}

export default function CheckoutSimulation() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    }>
      <SimulationContent />
    </Suspense>
  );
}
