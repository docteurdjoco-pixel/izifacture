"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, Download, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { getInvoiceById, updateInvoiceStatus, Invoice, getCompanySettings, CompanySettings } from '@/lib/data';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Payée': return <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200 whitespace-nowrap">Payée</span>;
    case 'Envoyée': return <span className="px-3 py-1 bg-orange-50 text-orange-700 text-sm font-semibold rounded-full border border-orange-200 whitespace-nowrap">Envoyée</span>;
    case 'Brouillon': return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full border border-gray-200 whitespace-nowrap">Brouillon</span>;
    case 'En retard': return <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-semibold rounded-full border border-red-200 whitespace-nowrap">En retard</span>;
    default: return null;
  }
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  // Dans une vraie application, on ferait un fetch Supabase avec l'ID
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      setLoading(true);
      const data = await getInvoiceById(invoiceId);
      const settings = await getCompanySettings();
      setInvoice(data);
      setCompanySettings(settings);
      setLoading(false);
    };
    fetchInvoice();
  }, [invoiceId]);

  useEffect(() => {
    if (invoice) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        setTimeout(() => {
          handleDownloadPDF();
          router.replace(`/invoices/${invoiceId}`);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoice]);

  if (loading) {
    return <div className="flex justify-center py-20 text-muted">Chargement de la facture...</div>;
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-text mb-4">Facture introuvable</h2>
        <Link href="/invoices" className="text-blue-600 hover:underline">Retour aux factures</Link>
      </div>
    );
  }

  const client = invoice.client;

  const handleStatusChange = async (newStatus: 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard') => {
    const success = await updateInvoiceStatus(invoiceId, newStatus);
    if (success) {
      setInvoice({ ...invoice, status: newStatus });
    } else {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;
    
    // Dynamically import html2pdf
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt: any = {
      margin:       10,
      filename:     `Facture_${invoice.invoiceNumber}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, backgroundColor: '#ffffff', useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/invoices" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-muted" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-text">Facture {invoice.invoiceNumber}</h1>
              <div className="hidden sm:block">
                {getStatusBadge(invoice.status)}
              </div>
            </div>
            <p className="text-muted text-sm">Créée le {invoice.dateIssue}</p>
            <div className="sm:hidden mt-2">
              {getStatusBadge(invoice.status)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 print:hidden">
          <button onClick={handleDownloadPDF} className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors tooltip" title="Télécharger PDF">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Actions de Statut Rapides */}
      <div className="bg-surface border border-border rounded-xl shadow-sm p-4 flex gap-3 overflow-x-auto">
        <span className="text-sm font-medium text-muted self-center mr-2">Changer le statut :</span>
        <button onClick={() => handleStatusChange('Envoyée')} className="px-4 py-2 text-sm font-medium rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 flex items-center gap-2">
          <Send size={16} /> Marquer comme Envoyée
        </button>
        <button onClick={() => handleStatusChange('Payée')} className="px-4 py-2 text-sm font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 flex items-center gap-2">
          <CheckCircle size={16} /> Marquer comme Payée
        </button>
        <button onClick={() => handleStatusChange('En retard')} className="px-4 py-2 text-sm font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-2">
          <AlertCircle size={16} /> Marquer comme En retard
        </button>
      </div>

      <div id="invoice-content" className="bg-surface border border-border rounded-xl shadow-sm p-8">
        
        {/* Header Facture */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl font-black text-primary mb-2">FACTURE</h2>
            <p className="text-muted text-sm">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            {companySettings?.logoUrl ? (
              <div className="w-16 h-16 mb-2 rounded-lg overflow-hidden border border-gray-200">
                <img src={companySettings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-lg mb-2"></div>
            )}
            <h3 className="font-bold text-lg text-text">{companySettings?.companyName || 'izifacture'}</h3>
            {companySettings?.email && <p className="text-sm text-muted">{companySettings.email}</p>}
            {companySettings?.phone && <p className="text-sm text-muted">{companySettings.phone}</p>}
            {companySettings?.address && <p className="text-sm text-muted max-w-xs">{companySettings.address}</p>}
            {!companySettings?.email && !companySettings?.phone && <p className="text-sm text-muted">contact@izifacture.com</p>}
          </div>
        </div>

        {/* Info Client & Dates */}
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
          <div>
            <h4 className="text-xs font-semibold text-muted uppercase mb-2">Facturé à</h4>
            <p className="font-bold text-text text-lg">{client?.name}</p>
            <p className="text-sm text-muted mt-1">{client?.email}</p>
            <p className="text-sm text-muted">{client?.phone}</p>
            <p className="text-sm text-muted">{client?.address}</p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase mb-2">Date d'émission</h4>
              <p className="font-medium text-text">{invoice.dateIssue}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase mb-2">Date d'échéance</h4>
              <p className="font-medium text-text">{invoice.dateDue}</p>
            </div>
          </div>
        </div>

        {/* Tableau des lignes */}
        <div className="mb-8">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase border-b-2 border-border">
              <tr>
                <th className="py-3 font-semibold">Description</th>
                <th className="py-3 font-semibold text-center">Qté</th>
                <th className="py-3 font-semibold text-right">Prix Unitaire</th>
                <th className="py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="py-4 font-medium text-text">{item.description}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">{item.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                  <td className="py-4 text-right font-semibold">{item.total.toLocaleString('fr-FR')} FCFA</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totaux */}
        <div className="flex justify-end">
          <div className="w-full md:w-1/3 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Sous-total</span>
              <span className="font-medium">{invoice.subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">TVA (18%)</span>
              <span className="font-medium">{invoice.tax.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
              <span>Total TTC</span>
              <span className="text-primary">{invoice.total.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
