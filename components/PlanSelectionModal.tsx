import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle, Phone, ArrowLeft } from 'lucide-react';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (planId: string, phone: string, countryCode: string) => void;
  isLoading: string | null; // pass planId if loading
}

export default function PlanSelectionModal({ isOpen, onClose, onSelectPlan, isLoading }: PlanSelectionModalProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedPlanId(null);
    setPhone('');
    onClose();
  };

  const handlePlanClick = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanId) return;

    let p = phone.trim();
    if (p !== '') {
      let cc = 'TG';
      if (p.startsWith('+229') || p.startsWith('00229')) cc = 'BJ';
      else if (p.startsWith('+225') || p.startsWith('00225')) cc = 'CI';
      else if (p.startsWith('+221') || p.startsWith('00221')) cc = 'SN';
      else if (p.startsWith('+226') || p.startsWith('00226')) cc = 'BF';
      else if (p.startsWith('+227') || p.startsWith('00227')) cc = 'NE';
      else if (p.startsWith('+223') || p.startsWith('00223')) cc = 'ML';
      else if (p.startsWith('+237') || p.startsWith('00237')) cc = 'CM';
      else if (p.startsWith('+241') || p.startsWith('00241')) cc = 'GA';
      else if (p.startsWith('+242') || p.startsWith('00242')) cc = 'CG';
      else if (p.startsWith('+243') || p.startsWith('00243')) cc = 'CD';
      else if (p.startsWith('+33') || p.startsWith('0033')) cc = 'FR';
      
      onSelectPlan(selectedPlanId, p, cc);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="relative mb-6">
            <button 
              onClick={handleClose}
              className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>

            {!selectedPlanId ? (
              <div className="flex flex-col items-center justify-center pt-2 w-full">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <ShieldCheck className="text-blue-600 flex-shrink-0" size={28} />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
                    Choisissez votre Plan
                  </h3>
                </div>
                <p className="text-gray-500 text-center mt-2 max-w-md mx-auto">
                  Vous avez atteint la limite de votre plan actuel. Passez au niveau supérieur pour continuer à facturer en toute simplicité.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-2 w-full relative">
                <button 
                  onClick={() => setSelectedPlanId(null)}
                  className="absolute left-0 top-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Phone className="text-blue-600 flex-shrink-0" size={24} />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
                    Finaliser le paiement
                  </h3>
                </div>
                <div className="flex justify-center w-full mt-1">
                  <span className="text-blue-600 font-bold text-lg text-center">
                    ({selectedPlanId})
                  </span>
                </div>
                <p className="text-gray-600 mb-6 mt-4 text-center">
                  Veuillez entrer votre numéro de téléphone (avec l'indicatif de votre pays) pour procéder au paiement sécurisé.
                </p>
              </div>
            )}
          </div>

          {!selectedPlanId ? (
            <>
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Pro Plan */}
                <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 relative shadow-xl transform transition-transform hover:-translate-y-1">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Populaire</div>
                  <h4 className="text-xl font-bold text-white mb-1">Pro</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-white">2 900</span>
                    <span className="text-gray-400 text-sm"> FCFA/mois</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={16} className="text-blue-400" /> 100 Devis/mois</li>
                    <li className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={16} className="text-blue-400" /> 100 Factures/mois</li>
                  </ul>
                  <button 
                    onClick={() => handlePlanClick('Pro')}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors shadow-lg flex justify-center items-center h-[44px]"
                  >
                    Choisir Pro
                  </button>
                </div>

                {/* Business Plan */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 relative shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">Business</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-extrabold text-gray-900">5 900</span>
                    <span className="text-gray-500 text-sm"> FCFA/mois</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Devis illimités</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle size={16} className="text-green-500" /> Factures illimitées</li>
                  </ul>
                  <button 
                    onClick={() => handlePlanClick('Business')}
                    className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200 font-semibold rounded-xl text-sm transition-colors flex justify-center items-center h-[44px]"
                  >
                    Choisir Business
                  </button>
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleClose}
                  className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Retour
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 max-w-sm mx-auto">
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Numéro de téléphone
                </label>
                <div className="flex justify-center">
                  <input 
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: +228 90000000"
                    className="w-full max-w-[250px] p-3 text-center bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all font-medium text-gray-900"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedPlanId(null)}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                  disabled={isLoading !== null}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isLoading !== null || !phone.trim()}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
                >
                  {isLoading === selectedPlanId ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Continuer'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
