"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle } from 'lucide-react';
import { getClients, createClient, updateClient, deleteClient, Client } from '@/lib/data';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchClients = async () => {
    setLoading(true);
    const data = await getClients();
    setClients(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData(client);
    } else {
      setEditingClient(null);
      setFormData({ name: '', email: '', phone: '', address: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (editingClient) {
      try {
        const updated = await updateClient(editingClient.id, formData);
        if (updated) {
          setClients(clients.map(c => c.id === editingClient.id ? updated : c));
          setSuccessMessage('Client modifié avec succès !');
          setSuccessModalOpen(true);
          setIsModalOpen(false);
        }
      } catch (err: any) {
        setErrorMessage(`Erreur: ${err.message}`);
      }
    } else {
      try {
        const created = await createClient(formData);
        if (created) {
          setClients(prev => [created, ...prev]);
          setSuccessMessage('Client créé avec succès !');
          setSuccessModalOpen(true);
          setIsModalOpen(false);
        }
      } catch (err: any) {
        setErrorMessage(`Erreur: ${err.message}`);
      }
    }
  };

  const handleDelete = (id: string) => {
    setClientToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      const success = await deleteClient(clientToDelete);
      if (success) {
        setClients(clients.filter(c => c.id !== clientToDelete));
      }
    }
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Nouveau Client
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <input 
              type="text" 
              placeholder="Rechercher un client..." 
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
                <th className="px-6 py-4 font-semibold">Nom</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Téléphone</th>
                <th className="px-6 py-4 font-semibold">Adresse</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted">
                    Chargement des clients...
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="border-b border-border hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-text">{client.name}</td>
                    <td className="px-6 py-4 text-muted">{client.email}</td>
                    <td className="px-6 py-4 text-muted">{client.phone}</td>
                    <td className="px-6 py-4 text-muted max-w-[200px] truncate">{client.address}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(client)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {(!loading && filteredClients.length === 0) && (
            <div className="p-8 text-center text-muted">Aucun client trouvé.</div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingClient ? 'Modifier le client' : 'Ajouter un client'}</h2>
            </div>
            {errorMessage && (
              <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">Nom du client *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background text-text rounded-md px-4 py-2 text-sm outline-none border border-border focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Adresse Email *</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-background text-text rounded-md px-4 py-2 text-sm outline-none border border-border focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Téléphone</label>
                <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background text-text rounded-md px-4 py-2 text-sm outline-none border border-border focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-1">Adresse physique</label>
                <textarea rows={3} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-background text-text rounded-md px-4 py-2 text-sm outline-none border border-border focus:border-blue-500 resize-none"></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted hover:bg-gray-100 rounded-lg">Annuler</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmation de Suppression */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Supprimer le client</h3>
              <p className="text-center text-gray-500 mb-6">
                Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setClientToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-red-200"
                >
                  Oui, supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Succès */}
      {successModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Succès</h3>
              <p className="text-gray-500 mb-6">{successMessage}</p>
              <button 
                onClick={() => setSuccessModalOpen(false)}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
