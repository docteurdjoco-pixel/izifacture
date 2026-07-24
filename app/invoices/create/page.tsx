"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, Send, CheckCircle, Download } from 'lucide-react';
import { getClients, createInvoice, Client, InvoiceItem, getCompanySettings } from '@/lib/data';
import { checkPlanLimit } from '@/lib/subscription';
import PlanSelectionModal from '@/components/PlanSelectionModal';
export default function CreateInvoicePage() {
  const router = useRouter();
  const [clientId, setClientId] = useState('');
  const [dateIssue, setDateIssue] = useState(new Date().toISOString().split('T')[0]);
  const [dateDue, setDateDue] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<string | null>(null);
  
  const [clients, setClients] = useState<Client[]>([]);
  
  const [taxRate, setTaxRate] = useState<number>(18);
  
  React.useEffect(() => {
    checkPlanLimit('invoice').then(async (canCreate) => {
      if (!canCreate) {
        setShowPlanModal(true);
      }
    });

    getClients().then(setClients);
    getCompanySettings().then(settings => {
      if (settings && settings.taxRate !== undefined) {
        setTaxRate(settings.taxRate);
      }
    });
  }, [router]);

  const [items, setItems] = useState<Omit<InvoiceItem, 'id' | 'total'>[]>([
    { description: '', quantity: 1, unitPrice: 0 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleSelectPlan = async (planId: string, phone: string, countryCode: string) => {
    setIsCheckoutLoading(planId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, phone, countryCode })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur lors de la redirection');
        router.push('/#pricing');
      }
    } catch (e) {
      alert('Erreur de connexion');
      router.push('/#pricing');
    } finally {
      setIsCheckoutLoading(null);
    }
  };

  const handleSubmit = async (status: 'Brouillon' | 'Envoyée') => {
    if (!clientId) return;
    
    setIsSaving(true);
    
    // Generate a temporary invoice number or let the DB handle it if it was an auto-increment,
    // but the schema says TEXT NOT NULL UNIQUE. We'll generate one here.
    const invNumber = '#INV-' + Math.floor(100000 + Math.random() * 900000);
    
    const invoiceData = {
      invoiceNumber: invNumber,
      clientId,
      dateIssue,
      dateDue: dateDue || dateIssue, // Fallback if empty
      status,
      subtotal,
      tax,
      total
    };
    
    const itemsData = items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));
    
    const result = await createInvoice(invoiceData, itemsData);
    
    setIsSaving(false);
    
    if (result) {
      setCreatedInvoiceId(result.id);
      if (status === 'Envoyée') {
        setShowSuccessModal(true);
      } else {
        router.push('/invoices');
      }
    } else {
      alert("Erreur lors de la création de la facture");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/invoices" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} className="text-muted" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text mb-1">Créer une Facture</h1>
          <p className="text-muted text-sm">Remplissez les informations ci-dessous pour générer une facture.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm p-6 space-y-8">
        
        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text mb-1">Client *</label>
            <select 
              value={clientId} 
              onChange={e => setClientId(e.target.value)}
              className="w-full bg-background rounded-md px-4 py-2.5 text-sm outline-none border border-border focus:border-blue-500"
              required
            >
              <option value="" disabled>Sélectionner un client</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">N° de Facture</label>
            <input type="text" value="#INV-AUTO" disabled className="w-full bg-gray-100 rounded-md px-4 py-2.5 text-sm text-muted border border-border cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Date d'émission *</label>
            <input type="date" value={dateIssue} onChange={e => setDateIssue(e.target.value)} className="w-full bg-background rounded-md px-4 py-2.5 text-sm outline-none border border-border focus:border-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Date d'échéance *</label>
            <input type="date" value={dateDue} onChange={e => setDateDue(e.target.value)} className="w-full bg-background rounded-md px-4 py-2.5 text-sm outline-none border border-border focus:border-blue-500" required />
          </div>
        </div>

        {/* Lignes de facture */}
        <div>
          <h3 className="text-lg font-semibold text-text mb-4">Articles / Services</h3>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start bg-gray-50/50 p-4 rounded-lg border border-border">
                <div className="flex-1 space-y-4 md:space-y-0 md:flex md:gap-4">
                  <div className="flex-[2]">
                    <label className="block text-xs font-medium text-muted mb-1">Description</label>
                    <input type="text" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} placeholder="Nom du service..." className="w-full bg-white rounded-md px-3 py-2 text-sm outline-none border border-border focus:border-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-muted mb-1">Quantité</label>
                    <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)} className="w-full bg-white rounded-md px-3 py-2 text-sm outline-none border border-border focus:border-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-muted mb-1">Prix Unitaire (FCFA)</label>
                    <input type="number" min="0" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', parseInt(e.target.value) || 0)} className="w-full bg-white rounded-md px-3 py-2 text-sm outline-none border border-border focus:border-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-muted mb-1">Total</label>
                    <div className="px-3 py-2 text-sm font-semibold text-text bg-gray-100 rounded-md border border-gray-200">
                      {(item.quantity * item.unitPrice).toLocaleString('fr-FR')} 
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => handleRemoveItem(index)} className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors" disabled={items.length === 1}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          
          <button type="button" onClick={handleAddItem} className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
            <Plus size={16} /> Ajouter une ligne
          </button>
        </div>

        {/* Totaux */}
        <div className="border-t border-border pt-6 flex justify-end">
          <div className="w-full md:w-1/3 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Sous-total</span>
              <span className="font-medium">{Math.round(subtotal).toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">TVA ({taxRate}%)</span>
              <span className="font-medium">{Math.round(tax).toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
              <span>Total TTC</span>
              <span className="text-blue-600">{Math.round(total).toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-border pt-6 flex flex-col-reverse sm:flex-row gap-4 sm:justify-end">
          <button onClick={() => handleSubmit('Brouillon')} disabled={isSaving} className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium text-text bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
            <Save size={18} /> {isSaving ? 'Sauvegarde...' : 'Sauvegarder Brouillon'}
          </button>
          <button onClick={() => handleSubmit('Envoyée')} className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2" disabled={!clientId || isSaving}>
            <Send size={18} /> {isSaving ? 'Création...' : 'Créer et Envoyer'}
          </button>
        </div>

      </div>

      {/* Modal de Succès */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Facture Créée !</h3>
              <p className="text-center text-gray-500 mb-6">
                Votre facture a été enregistrée en attente avec succès.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    if (createdInvoiceId) {
                      router.push(`/invoices/${createdInvoiceId}?download=true`);
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-xl transition-colors flex justify-center items-center gap-2"
                >
                  <Download size={18} /> Télécharger la facture
                </button>
                <button 
                  onClick={() => router.push('/invoices')}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-200"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PlanSelectionModal 
        isOpen={showPlanModal}
        onClose={() => router.push('/#pricing')}
        onSelectPlan={handleSelectPlan}
        isLoading={isCheckoutLoading}
      />
    </div>
  );
}
