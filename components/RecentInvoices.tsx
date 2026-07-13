"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MoreHorizontal, Trash2, Search } from 'lucide-react';

import { getInvoices, deleteInvoice, Invoice } from '@/lib/data';

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Payée':
      return <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200 whitespace-nowrap">Payée</span>;
    case 'Envoyée':
      return <span className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200 whitespace-nowrap">Envoyée</span>;
    case 'Brouillon':
      return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200 whitespace-nowrap">Brouillon</span>;
    case 'En retard':
      return <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-200 whitespace-nowrap">En retard</span>;
    default:
      return null;
  }
};

const RecentInvoices = () => {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<{id: string, num: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      const data = await getInvoices();
      setAllInvoices(data);
      setLoading(false);
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = allInvoices.filter(invoice => {
    const searchMatch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (invoice.client?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "Tous" || invoice.status === statusFilter;
    return searchMatch && statusMatch;
  });
  
  const displayInvoices = (searchTerm === "" && statusFilter === "Tous") 
    ? filteredInvoices.slice(0, 5) 
    : filteredInvoices;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden" ref={dropdownRef}>
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Dernières Factures</h2>
        <Link href="/invoices" className="text-sm text-blue-600 font-medium hover:underline">Voir tout</Link>
      </div>

      {/* FILTRES */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher une facture, client..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg outline-none focus:border-blue-500 bg-surface text-text transition-colors"
          />
        </div>
        
        <select 
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 text-sm border border-border rounded-lg outline-none focus:border-blue-500 bg-surface text-text cursor-pointer"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="Brouillon">Brouillon</option>
          <option value="Envoyée">Envoyée</option>
          <option value="Payée">Payée</option>
          <option value="En retard">En retard</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted uppercase bg-background/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold">N° Facture</th>
              <th className="px-6 py-4 font-semibold">Client</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Montant</th>
              <th className="px-6 py-4 font-semibold text-center">Statut</th>
              <th className="px-6 py-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted">
                  Chargement des factures récentes...
                </td>
              </tr>
            ) : (
              displayInvoices.map((invoice, idx) => (
                <tr key={idx} className="border-b border-border hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 font-medium text-text">{invoice.client?.name}</td>
                  <td className="px-6 py-4 text-muted">{invoice.dateIssue}</td>
                  <td className="px-6 py-4 text-right font-semibold text-text">{invoice.total.toLocaleString('fr-FR')} FCFA</td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button onClick={() => setOpenDropdown(openDropdown === idx ? null : idx)} className="inline-flex p-2 text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                    {openDropdown === idx && (
                      <div className="absolute right-8 top-10 mt-1 w-32 bg-white rounded-md shadow-lg border border-border z-10 py-1 text-left">
                        <Link href={`/invoices/${invoice.id}`} className="block px-4 py-2 text-sm text-text hover:bg-gray-100">Détails</Link>
                        <button
                          onClick={() => {
                            setInvoiceToDelete({ id: invoice.id, num: invoice.invoiceNumber });
                            setDeleteModalOpen(true);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
            {!loading && displayInvoices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-muted">
                  Aucune facture trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      


      {/* Modal Confirmation de Suppression */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Supprimer la facture</h3>
              <p className="text-center text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer la facture <span className="font-semibold text-gray-700">{invoiceToDelete?.num}</span> ? Cette action est irréversible.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={async () => {
                    if (invoiceToDelete) {
                      await deleteInvoice(invoiceToDelete.id);
                      window.location.reload();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-red-200"
                >
                  Oui, supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentInvoices;
