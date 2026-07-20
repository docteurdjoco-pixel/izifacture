"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Upload, Building2, Phone, Mail, MapPin, Save, CheckCircle2, Percent, AlertCircle } from 'lucide-react';
import { getCompanySettings, updateCompanySettings } from '@/lib/data';

export default function SettingsPage() {
  const [showModal, setShowModal] = useState(false);
  
  const [companyName, setCompanyName] = useState('Izifacture');
  const [phone, setPhone] = useState('+33 1 23 45 67 89');
  const [email, setEmail] = useState('contact@izifacture.com');
  const [address, setAddress] = useState('123 Avenue des Champs-Élysées, 75008 Paris');
  const [taxRate, setTaxRate] = useState<number>(18);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getCompanySettings();
      if (settings) {
        setCompanyName(settings.companyName);
        if (settings.phone) setPhone(settings.phone);
        if (settings.email) setEmail(settings.email);
        if (settings.address) setAddress(settings.address);
        if (settings.taxRate !== undefined) setTaxRate(settings.taxRate);
        if (settings.logoUrl) setLogoPreview(settings.logoUrl);
      }
      setLoading(false);
    };
    loadSettings();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024) {
        setLogoError("La taille de l'image dépasse 100 Ko.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const success = await updateCompanySettings({
      companyName,
      phone,
      email,
      address,
      taxRate,
      logoUrl: logoPreview || undefined
    });
    
    setSaving(false);
    if (success) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    } else {
      alert("Erreur lors de l'enregistrement des paramètres");
    }
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <Settings size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Paramètres</h1>
            <p className="text-gray-500 mt-1">Gérez les informations et l'identité de votre entreprise.</p>
          </div>
        </div>

        {/* Settings Form Container */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <form className="space-y-8 relative" onSubmit={handleSubmit}>
            
            {/* Logo Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Identité visuelle</h2>
              <div className="flex items-center space-x-6">
                <div className="shrink-0">
                  {logoPreview ? (
                    <div className="w-24 h-24 rounded-2xl border-2 border-gray-200 overflow-hidden bg-gray-50">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-400">
                      <Building2 size={32} />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Logo de l'entreprise</label>
                  <p className="text-xs text-gray-500">Format recommandé: PNG ou JPG, max 100 Ko. Ratio 1:1.</p>
                  {logoError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{logoError}</span>
                    </div>
                  )}
                  <div className="relative inline-block mt-2">
                    <input 
                      type="file" 
                      id="logo-upload" 
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    />
                    <div className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors pointer-events-none">
                      <Upload size={16} />
                      <span>Choisir une image</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">Informations de contact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Building2 size={18} />
                    </div>
                    <input
                      type="text"
                      id="companyName"
                      required
                      placeholder="Izifacture SAS"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      required
                      placeholder="+33 1 23 45 67 89"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email de contact <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="contact@entreprise.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Adresse postale
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <textarea
                      id="address"
                      rows={3}
                      placeholder="123 Avenue des Champs-Élysées, 75008 Paris"
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Tax Rate */}
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                    Taux de TVA (%)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Percent size={18} />
                    </div>
                    <input
                      type="number"
                      id="taxRate"
                      min="0"
                      max="100"
                      step="0.01"
                      placeholder="18"
                      value={taxRate}
                      onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-stretch justify-between md:justify-end gap-3 w-full">
              <button
                type="button"
                className="flex-1 md:flex-none flex items-center justify-center px-4 md:px-6 py-3 rounded-xl font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-[2] md:flex-none flex items-center justify-center gap-2 px-2 sm:px-4 md:px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:opacity-70"
              >
                <Save size={18} className="shrink-0 hidden sm:block" />
                <span className="text-sm sm:text-base leading-tight text-center">
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Notification (Toast) */}
      <div className={`fixed bottom-8 right-8 z-50 flex items-center space-x-3 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 ${showModal ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 size={24} className="text-green-400" />
        <span className="font-medium">Paramètres mis à jour avec succès !</span>
      </div>
    </div>
  );
}
