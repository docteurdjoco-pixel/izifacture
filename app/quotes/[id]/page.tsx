"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, Download, Send, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { getQuoteById, updateQuoteStatus, Quote, getCompanySettings, CompanySettings } from '@/lib/data';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Accepté': return <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200 whitespace-nowrap">Accepté</span>;
    case 'Envoyé': return <span className="px-3 py-1 bg-orange-50 text-orange-700 text-sm font-semibold rounded-full border border-orange-200 whitespace-nowrap">Envoyé</span>;
    case 'Brouillon': return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full border border-gray-200 whitespace-nowrap">Brouillon</span>;
    case 'Refusé': return <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-semibold rounded-full border border-red-200 whitespace-nowrap">Refusé</span>;
    default: return null;
  }
};

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const quoteId = params.id as string;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true);
      const data = await getQuoteById(quoteId);
      const settings = await getCompanySettings();
      setQuote(data);
      setCompanySettings(settings);
      setLoading(false);
    };
    fetchQuote();
  }, [quoteId]);

  useEffect(() => {
    if (quote) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        setTimeout(() => {
          handleDownloadPDF();
          router.replace(`/quotes/${quoteId}`);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  if (loading) {
    return <div className="flex justify-center py-20 text-muted">Chargement du devis...</div>;
  }

  if (!quote) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-text mb-4">Devis introuvable</h2>
        <Link href="/quotes" className="text-blue-600 hover:underline">Retour aux devis</Link>
      </div>
    );
  }

  const client = quote.client;
  
  const taxRate = quote.subtotal > 0 ? Math.round((quote.tax / quote.subtotal) * 100) : (companySettings?.taxRate ?? 18);

  const handleStatusChange = async (newStatus: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé') => {
    const success = await updateQuoteStatus(quoteId, newStatus);
    if (success) {
      setQuote({ ...quote, status: newStatus });
    } else {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('quote-content');
    if (!element) return;
    
    // Dynamically import html2pdf
    const html2pdf = (await import('html2pdf.js')).default;
    
    const opt: any = {
      margin:       10,
      filename:     `Devis_${quote.quoteNumber}.pdf`,
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
          <Link href="/quotes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-muted" />
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-text">Devis {quote.quoteNumber}</h1>
            </div>
            <p className="text-muted text-sm">Créé le {quote.dateIssue}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 print:hidden">
          <button onClick={handleDownloadPDF} className="p-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors tooltip" title="Télécharger PDF">
            <Download size={18} />
          </button>
        </div>
      </div>



      <div id="quote-content" className="bg-surface border border-border rounded-xl shadow-sm p-8">
        
        {/* Header Devis */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h2 className="text-3xl font-black text-primary mb-2">DEVIS</h2>
            <p className="text-muted text-sm">{quote.quoteNumber}</p>
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
            <h4 className="text-xs font-semibold text-muted uppercase mb-2">Devis pour</h4>
            <p className="font-bold text-text text-lg">{client?.name}</p>
            <p className="text-sm text-muted mt-1">{client?.email}</p>
            <p className="text-sm text-muted">{client?.phone}</p>
            <p className="text-sm text-muted">{client?.address}</p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase mb-2">Date d'émission</h4>
              <p className="font-medium text-text">{quote.dateIssue}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted uppercase mb-2">Validité jusqu'au</h4>
              <p className="font-medium text-text">{quote.dateDue}</p>
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
              {quote.items.map((item, idx) => (
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
              <span className="font-medium">{quote.subtotal.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">TVA ({taxRate}%)</span>
              <span className="font-medium">{quote.tax.toLocaleString('fr-FR')} FCFA</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-border pt-3">
              <span>Total TTC</span>
              <span className="text-primary">{quote.total.toLocaleString('fr-FR')} FCFA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
