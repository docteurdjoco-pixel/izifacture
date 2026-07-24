import React, { useState } from 'react';
import { X, Phone } from 'lucide-react';

interface PaymentPhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phone: string, countryCode: string) => void;
  isLoading: boolean;
  planName?: string;
}

export default function PaymentPhoneModal({ isOpen, onClose, onSubmit, isLoading, planName }: PaymentPhoneModalProps) {
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim() !== '') {
      onSubmit(phone.trim(), 'TG'); // Par défaut TG si saisi dans le champ
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="relative mb-6">
            <button 
              onClick={onClose}
              className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center justify-center pt-2 w-full">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Phone className="text-blue-600 flex-shrink-0" size={24} />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center whitespace-nowrap">
                  Finaliser le paiement
                </h3>
              </div>
              {planName && (
                <div className="flex justify-center w-full mt-1">
                  <span className="text-blue-600 font-bold text-lg text-center">
                    ({planName})
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 mb-6 text-center">
            Veuillez entrer votre numéro de téléphone (avec l'indicatif de votre pays) pour procéder au paiement sécurisé.
          </p>

          <form onSubmit={handleSubmit}>
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
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || !phone.trim()}
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  'Continuer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
