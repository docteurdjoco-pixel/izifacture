"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, MoreHorizontal, ChevronRight } from 'lucide-react';
import { getQuotes, getClients, Quote, Client } from '@/lib/data';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Accepté': return <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200 whitespace-nowrap">Accepté</span>;
    case 'Envoyé': return <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200 whitespace-nowrap">Envoyé</span>;
    case 'Brouillon': return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200 whitespace-nowrap">Brouillon</span>;
    case 'Refusé': return <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200 whitespace-nowrap">Refusé</span>;
    default: return null;
  }
};

export default function QuotesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [qs, clis] = await Promise.all([getQuotes(), getClients()]);
      setQuotes(qs);
      setClients(clis);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredQuotes = quotes.filter(quote => {
    const client = clients.find(c => c.id === quote.clientId);
    const matchesSearch = client?.name.toLowerCase().includes(searchTerm.toLowerCase()) || quote.quoteNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Link href="/quotes/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          <Plus size={18} /> Nouveau Devis
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input 
              type="text" 
              placeholder="Rechercher par client ou N°..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface text-text rounded-md pl-10 pr-4 py-2 text-sm outline-none border border-border focus:border-blue-500 transition-colors"
            />
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted uppercase bg-background/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-semibold">N° Devis</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-semibold">Client</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-semibold">Date d'émission</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-semibold">Validité</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-semibold text-right">Montant TTC</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-semibold text-center">Détails</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted">
                    Chargement des devis...
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => {
                  const client = clients.find(c => c.id === quote.clientId);
                return (
                  <tr key={quote.id} className="border-b border-border hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3 sm:px-6 sm:py-4 font-medium text-text">{quote.quoteNumber}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 font-medium text-text">{client?.name}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-muted">{quote.dateIssue}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-muted">{quote.dateDue}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-right font-semibold text-text">{quote.total.toLocaleString('fr-FR')} FCFA</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                      <Link href={`/quotes/${quote.id}`} className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
          {(!loading && filteredQuotes.length === 0) && (
            <div className="p-8 text-center text-muted">Aucun devis trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
}
