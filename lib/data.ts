export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  dateIssue: string;
  dateDue: string;
  status: 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  client?: Client;
};

export type CompanySettings = {
  id?: string;
  companyName: string;
  phone?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  taxRate?: number;
};

import { z } from 'zod';
import { supabase } from './supabase';

const clientSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional()
});

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(0, 'La quantité doit être positive'),
  unitPrice: z.number().min(0, 'Le prix unitaire doit être positif'),
  total: z.number().min(0)
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  clientId: z.string().uuid(),
  dateIssue: z.string(),
  dateDue: z.string(),
  status: z.enum(['Brouillon', 'Envoyée', 'Payée', 'En retard']),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0)
});

const companySettingsSchema = z.object({
  companyName: z.string().min(1, 'Le nom est requis'),
  phone: z.string().optional().nullable(),
  email: z.string().email('Email invalide').optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  logoUrl: z.string().optional().nullable(),
  taxRate: z.number().min(0).max(100).optional()
});

export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return data as Client[];
};

export const getInvoices = async () => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (*),
      invoice_items (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
  
  // Format to match the Invoice type
  return data.map((inv: any) => ({
    id: inv.id,
    invoiceNumber: inv.invoice_number,
    clientId: inv.client_id,
    dateIssue: inv.date_issue,
    dateDue: inv.date_due,
    status: inv.status,
    subtotal: inv.subtotal,
    tax: inv.tax,
    total: inv.total,
    items: inv.invoice_items.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total
    })),
    client: inv.clients
  })) as Invoice[];
};

export const getInvoiceById = async (id: string) => {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      clients (*),
      invoice_items (*)
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching invoice:', error);
    return null;
  }
  
  return {
    id: data.id,
    invoiceNumber: data.invoice_number,
    clientId: data.client_id,
    dateIssue: data.date_issue,
    dateDue: data.date_due,
    status: data.status,
    subtotal: data.subtotal,
    tax: data.tax,
    total: data.total,
    items: data.invoice_items.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total
    })),
    client: data.clients
  } as Invoice;
};

export const createInvoice = async (
  invoiceData: Omit<Invoice, 'id' | 'items'>,
  items: Omit<InvoiceItem, 'id'>[]
) => {
  try {
    invoiceSchema.parse(invoiceData);
    z.array(invoiceItemSchema).parse(items);
  } catch (err) {
    console.error("Erreur de validation:", err);
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  // Insert invoice
  const { data: invData, error: invError } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceData.invoiceNumber,
      client_id: invoiceData.clientId,
      date_issue: invoiceData.dateIssue,
      date_due: invoiceData.dateDue,
      status: invoiceData.status,
      subtotal: invoiceData.subtotal,
      tax: invoiceData.tax,
      total: invoiceData.total,
      user_id: userData.user.id
    })
    .select()
    .single();

  if (invError) {
    console.error('Action impossible');
    return null;
  }

  // Insert items
  const itemsToInsert = items.map(item => ({
    invoice_id: invData.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total: item.total
  }));

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(itemsToInsert);

  if (itemsError) {
    console.error('Action impossible');
    return null;
  }

  return invData;
};

export const updateInvoiceStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', id);
    
  if (error) {
    console.error('Error updating status:', error);
    return false;
  }
  return true;
};

export const deleteInvoice = async (id: string) => {
  const { error } = await supabase
    .from('invoices')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting invoice:', error);
    return false;
  }
  return true;
};

export const createClient = async (clientData: Omit<Client, 'id'>) => {
  try {
    clientSchema.parse(clientData);
  } catch (err) {
    console.error("Erreur de validation:", err);
    throw new Error("Données invalides");
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('clients')
    .insert([{ ...clientData, user_id: userData.user.id }])
    .select()
    .single();

  if (error) {
    console.error('Action impossible');
    throw new Error("Action impossible");
  }
  return data as Client;
};

export const updateClient = async (id: string, clientData: Partial<Client>) => {
  try {
    clientSchema.partial().parse(clientData);
  } catch (err) {
    console.error("Erreur de validation:", err);
    return null;
  }

  const { data, error } = await supabase
    .from('clients')
    .update(clientData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Action impossible');
    return null;
  }
  return data as Client;
};

export const deleteClient = async (id: string) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting client:', error);
    return false;
  }
  return true;
};

export const getDashboardStats = async () => {
  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('status, total');
    
  if (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
  
  let totalInvoices = invoices.length;
  let amountBilled = 0;
  let amountPaid = 0;
  let amountPending = 0;
  let amountDraft = 0;
  let amountOverdue = 0;
  
  for (const inv of invoices) {
    if (inv.status !== 'Brouillon') {
      amountBilled += Number(inv.total);
    }
    if (inv.status === 'Payée') {
      amountPaid += Number(inv.total);
    } else if (inv.status === 'Brouillon') {
      amountDraft += Number(inv.total);
    } else if (inv.status === 'Envoyée') {
      amountPending += Number(inv.total);
    } else if (inv.status === 'En retard') {
      amountOverdue += Number(inv.total);
    }
  }
  
  return {
    totalInvoices,
    amountBilled,
    amountPaid,
    amountPending,
    amountDraft,
    amountOverdue
  };
};

export const getCompanySettings = async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabase
    .from('company_settings')
    .select('*')
    .eq('user_id', userData.user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching company settings:', error);
    return null;
  }
  
  if (!data) return null;

  return {
    id: data.id,
    companyName: data.company_name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    logoUrl: data.logo_url,
    taxRate: data.tax_rate
  } as CompanySettings;
};

export const updateCompanySettings = async (settingsData: CompanySettings) => {
  try {
    companySettingsSchema.parse(settingsData);
  } catch (err) {
    console.error("Erreur de validation:", err);
    return false;
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  // Check if exists
  const existing = await getCompanySettings();
  
  const payload = {
    company_name: settingsData.companyName,
    phone: settingsData.phone,
    email: settingsData.email,
    address: settingsData.address,
    logo_url: settingsData.logoUrl,
    tax_rate: settingsData.taxRate ?? 18,
    user_id: userData.user.id,
    updated_at: new Date().toISOString()
  };

  let result;
  if (existing) {
    result = await supabase
      .from('company_settings')
      .update(payload)
      .eq('id', existing.id);
  } else {
    result = await supabase
      .from('company_settings')
      .insert([payload]);
  }

  if (result.error) {
    console.error('Action impossible:', result.error);
    return false;
  }
  
  return true;
};

// --- QUOTES (DEVIS) ---

export type QuoteItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type Quote = {
  id: string;
  quoteNumber: string;
  clientId: string;
  dateIssue: string;
  dateDue: string;
  status: 'Brouillon' | 'Envoyé' | 'Accepté' | 'Refusé';
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  client?: Client;
};

const quoteItemSchema = z.object({
  description: z.string().min(1, 'La description est requise'),
  quantity: z.number().min(0, 'La quantité doit être positive'),
  unitPrice: z.number().min(0, 'Le prix unitaire doit être positif'),
  total: z.number().min(0)
});

const quoteSchema = z.object({
  quoteNumber: z.string().min(1),
  clientId: z.string().uuid(),
  dateIssue: z.string(),
  dateDue: z.string(),
  status: z.enum(['Brouillon', 'Envoyé', 'Accepté', 'Refusé']),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0)
});

export const getQuotes = async () => {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      clients (*),
      quote_items (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
  
  return data.map((quote: any) => ({
    id: quote.id,
    quoteNumber: quote.quote_number,
    clientId: quote.client_id,
    dateIssue: quote.date_issue,
    dateDue: quote.date_due,
    status: quote.status,
    subtotal: quote.subtotal,
    tax: quote.tax,
    total: quote.total,
    items: quote.quote_items.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total
    })),
    client: quote.clients
  })) as Quote[];
};

export const getQuoteById = async (id: string) => {
  const { data, error } = await supabase
    .from('quotes')
    .select(`
      *,
      clients (*),
      quote_items (*)
    `)
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
  
  return {
    id: data.id,
    quoteNumber: data.quote_number,
    clientId: data.client_id,
    dateIssue: data.date_issue,
    dateDue: data.date_due,
    status: data.status,
    subtotal: data.subtotal,
    tax: data.tax,
    total: data.total,
    items: data.quote_items.map((item: any) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      total: item.total
    })),
    client: data.clients
  } as Quote;
};

export const createQuote = async (
  quoteData: Omit<Quote, 'id' | 'items'>,
  items: Omit<QuoteItem, 'id'>[]
) => {
  try {
    quoteSchema.parse(quoteData);
    z.array(quoteItemSchema).parse(items);
  } catch (err) {
    console.error("Erreur de validation:", err);
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: qData, error: qError } = await supabase
    .from('quotes')
    .insert({
      quote_number: quoteData.quoteNumber,
      client_id: quoteData.clientId,
      date_issue: quoteData.dateIssue,
      date_due: quoteData.dateDue,
      status: quoteData.status,
      subtotal: quoteData.subtotal,
      tax: quoteData.tax,
      total: quoteData.total,
      user_id: userData.user.id
    })
    .select()
    .single();

  if (qError) {
    console.error('Action impossible');
    return null;
  }

  const itemsToInsert = items.map(item => ({
    quote_id: qData.id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total: item.total
  }));

  const { error: itemsError } = await supabase
    .from('quote_items')
    .insert(itemsToInsert);

  if (itemsError) {
    console.error('Action impossible');
    return null;
  }

  return qData;
};

export const updateQuoteStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from('quotes')
    .update({ status })
    .eq('id', id);
    
  if (error) {
    console.error('Error updating status:', error);
    return false;
  }
  return true;
};

export const deleteQuote = async (id: string) => {
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting quote:', error);
    return false;
  }
  return true;
};
