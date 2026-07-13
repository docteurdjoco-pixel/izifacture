# Izifacture - Documentation du Projet

Ce fichier documente l'état actuel du projet "Izifacture" afin de guider tout futur modèle IA ou développeur qui reprendrait le code.

## 1. Ce que le site fait
**Izifacture** est une application web SaaS (Software as a Service) de facturation complète conçue spécifiquement pour les entrepreneurs africains. Elle permet de générer, gérer et suivre des factures professionnelles avec des calculs automatisés, une gestion des clients, et un tableau de bord offrant une vue d'ensemble des revenus.

## 2. Fonctionnalités implémentées à ce jour
Le projet est actuellement à la fin de sa phase de prototypage interactif (UI/UX complètement fonctionnelle avec des données fictives stockées dans `lib/data.ts`). 

Voici les fonctionnalités actives :
*   **Tableau de Bord (Dashboard) :** 
    *   Cartes de statistiques affichant : Total des factures, Montant total facturé, Montant payé, Montant en attente.
    *   Tableau des dernières factures avec pagination (UI).
*   **Gestion des Clients (`/clients`) :**
    *   Liste complète des clients avec barre de recherche fonctionnelle.
    *   Formulaire modal pour l'ajout et la modification des informations (Nom, Email, Téléphone, Adresse).
    *   Bouton de suppression avec fenêtre de confirmation.
*   **Gestion des Factures (`/invoices`) :**
    *   Liste des factures avec recherche croisée (par client ou n° de facture) et filtre par statut (Brouillon, Envoyée, Payée, En retard).
    *   **Création de facture (`/invoices/create`) :** Formulaire complexe incluant :
        *   Sélection dynamique du client.
        *   Ajout/suppression de lignes d'articles dynamiques.
        *   Calcul automatique du sous-total, de la TVA à 18%, et du total TTC.
        *   Montants formatés en Franc CFA (FCFA) et arrondis à l'entier.
    *   **Détail d'une facture (`/invoices/[id]`) :**
        *   Affichage complet de la facture prête à être exportée.
        *   Boutons d'action rapide pour changer le statut (Marquer comme Envoyée/Payée).
        *   Menu déroulant d'actions (Modifier/Supprimer) fonctionnel au clic sur les tableaux.

## 3. Technologies utilisées
*   **Framework Core :** Next.js 14 (App Router)
*   **Langage :** TypeScript (`.tsx`)
*   **Styling :** Tailwind CSS
*   **Utilitaires de style :** `clsx` et `tailwind-merge` pour la composition dynamique des classes CSS.
*   **Icônes :** Lucide React (`lucide-react`)
*   *(À venir / Planifié)* : Supabase (Authentification & Base de données PostgreSQL), Vercel (Déploiement).

## 4. Décisions de Design et d'Architecture
*   **Layout Fixe :** La page globale (`app/layout.tsx`) utilise un `h-screen overflow-hidden` pour que la barre latérale (Sidebar) reste toujours fixe. Seule la zone principale (`main`) possède une barre de défilement verticale. Le contenu ne scrolle jamais en dépassant le profil de l'utilisateur.
*   **Esthétique Premium :** Utilisation du "Glassmorphism" léger, d'espacements aérés (gap, padding), de couleurs pastels pour les badges de statuts (Vert = Payée, Orange = Envoyée, Rouge = En retard, Gris = Brouillon) et de contours de séparation subtils (`border-border`).
*   **Navigation Intelligente :** 
    *   Sidebar responsive (cachée sur mobile, remplaçable par un menu burger).
    *   États actifs dynamiques (`usePathname`) pour surligner le menu courant en bleu.
    *   Fil d'Ariane (`Breadcrumb`) dynamique dans le Header indiquant à l'utilisateur où il se trouve sans mots superflus.
*   **Séparation des responsabilités :** Composants modulaires (`Header`, `Sidebar`, `RecentInvoices`, `StatsCards`) pour maintenir le code propre.

---
> **Note pour l'IA future :** L'interface utilisateur est entièrement finalisée et validée. La prochaine étape logique est la **Phase 4 : Intégration de Supabase**. Il faudra convertir les types et les mock datas de `lib/data.ts` en schémas de base de données, configurer les Row Level Securities (RLS) et remplacer les états locaux React par des requêtes de base de données.
