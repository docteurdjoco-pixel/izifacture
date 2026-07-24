"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FileText, PieChart, Users, DollarSign, ArrowUpRight, Zap, PlayCircle, ShieldCheck, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PaymentPhoneModal from '@/components/PaymentPhoneModal';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');

  const initiateSubscription = (planId: string) => {
    setSelectedPlanId(planId);
    setShowPhoneModal(true);
  };

  const handleSubscribeWithPhone = async (phone: string, countryCode: string) => {
    setIsLoading(selectedPlanId);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlanId, phone, countryCode })
      });
      const data = await response.json();
      if (response.status === 401) {
        router.push(data.redirect || '/register');
      } else if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Une erreur est survenue. Veuillez réessayer.');
        setShowPhoneModal(false);
      }
    } catch (error) {
      console.error('Erreur lors de la souscription:', error);
      alert('Erreur de connexion au serveur.');
      setShowPhoneModal(false);
    } finally {
      setIsLoading(null);
    }
  };
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-200">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            <span className="font-bold text-2xl tracking-tight text-gray-900">iziFacture</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Fonctionnalités</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">Comment ça marche</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors hidden sm:block">
              Se connecter
            </Link>
            <Link href="/register" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Créer un compte
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Zap size={16} className="text-yellow-500 fill-yellow-500" />
              <span>La facturation simplifiée pour l'Afrique</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Fini les Devis et Factures sur <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Word et Excel.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
              Générez des devis et factures professionnels en quelques clics, calculez la TVA automatiquement et suivez vos paiements sans effort. Conçu spécifiquement pour les entrepreneurs africains.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
              <Link href="/register" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-base font-semibold transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Commencer gratuitement <ArrowRight size={20} />
              </Link>
              <button className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-8 py-4 rounded-full text-base font-semibold transition-all shadow-sm flex items-center justify-center gap-2">
                <PlayCircle size={20} className="text-gray-400" /> Voir la démo
              </button>
            </div>
            
            {/* Dashboard Images */}
            <div className="mt-20 relative mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
              <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <img src="/Invoice-un.png" alt="Dashboard iziFacture" className="w-full md:w-1/2 rounded-2xl shadow-2xl border border-gray-200 object-cover" />
                <img src="/Invoice-deux.png" alt="Création Facture" className="w-full md:w-1/2 rounded-2xl shadow-2xl border border-gray-200 object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PROBLEME */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pourquoi la facturation classique vous freine</h2>
              <p className="text-lg text-gray-600">La plupart des entrepreneurs africains perdent un temps précieux avec des outils inadaptés.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Factures non professionnelles",
                  desc: "Les modèles Word finissent souvent par se décaler. L'image de votre entreprise en prend un coup aux yeux des clients.",
                  icon: <FileText size={24} className="text-red-500" />
                },
                {
                  title: "Calculs manuels et erreurs",
                  desc: "Calculer la TVA manuellement sur Excel ouvre la porte aux erreurs coûteuses et aux maux de tête comptables.",
                  icon: <PieChart size={24} className="text-orange-500" />
                },
                {
                  title: "Suivi des paiements impossible",
                  desc: "Difficile de savoir qui a payé et qui est en retard quand tout est éparpillé dans des dossiers locaux ou des e-mails.",
                  icon: <Clock size={24} className="text-gray-500" />
                }
              ].map((problem, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                    {problem.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION FONCTIONNALITES */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tout ce dont vous avez besoin pour facturer</h2>
              <p className="text-lg text-gray-600">iziFacture réunit tous les outils essentiels dans une interface claire et épurée.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Factures en 2 clics",
                  desc: "Créez des factures impeccables avec votre logo en quelques secondes.",
                  icon: <FileText size={24} className="text-blue-600" />,
                  color: "bg-blue-50"
                },
                {
                  title: "TVA % Personnalisable",
                  desc: "Montant en FCFA et calculs automatisés de la TVA sans formule complexe.",
                  icon: <Zap size={24} className="text-yellow-600" />,
                  color: "bg-yellow-50"
                },
                {
                  title: "Suivi temps réel",
                  desc: "Visualisez d'un coup d'œil vos factures payées, envoyées et en retard.",
                  icon: <PieChart size={24} className="text-green-600" />,
                  color: "bg-green-50"
                },
                {
                  title: "Gestion Clients",
                  desc: "Carnet d'adresses intégré pour retrouver vos clients instantanément.",
                  icon: <Users size={24} className="text-purple-600" />,
                  color: "bg-purple-50"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:border-blue-100 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300">
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION COMMENT CA MARCHE */}
        <section id="how-it-works" className="py-24 bg-gray-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple comme bonjour</h2>
              <p className="text-lg text-gray-400">Pas de formation nécessaire. Démarrez en quelques minutes.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
              
              {[
                { step: "1", title: "Inscrivez-vous", desc: "Créez votre compte gratuitement en 30 secondes." },
                { step: "2", title: "Créer votre devis et facture", desc: "Ajoutez votre client, vos articles, et laissez-nous calculer le reste." },
                { step: "3", title: "Envoyez & Suivez", desc: "Envoyez le PDF à votre client et suivez l'état du paiement depuis le dashboard." }
              ].map((item, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-16 h-16 bg-gray-800 border-4 border-gray-900 rounded-full flex items-center justify-center text-xl font-bold text-blue-400 mx-auto mb-6 relative z-10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION TEMOIGNAGES */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">Ils gagnent du temps avec iziFacture</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Amadou D.", role: "Consultant IT, Sénégal", text: "Avant, je perdais des heures sur Excel. Maintenant, mes factures partent en 2 minutes et mes clients trouvent ça super pro." },
                { name: "Awa K.", role: "Agence Digitale, Côte d'Ivoire", text: "Le calcul automatique de la TVA et le suivi des impayés ont sauvé ma comptabilité. L'interface est incroyablement épurée." },
                { name: "Franck B.", role: "Freelance Design, Cameroun", text: "Enfin un outil pensé pour nous, avec les montants en FCFA par défaut. La simplicité est le point fort de cette application." }
              ].map((testimonial, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm relative">
                  <div className="text-4xl text-blue-200 absolute top-6 right-8 font-serif">"</div>
                  <p className="text-gray-600 mb-6 relative z-10 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center font-bold text-blue-700">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION TARIFICATION */}
        <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Des tarifs clairs, sans surprise</h2>
              <p className="text-lg text-gray-600">Choisissez le plan qui correspond à la taille de votre activité.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
              {/* Gratuit */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Gratuit</h3>
                <p className="text-gray-500 text-sm mb-6">Pour commencer</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">0</span>
                  <span className="text-gray-500"> FCFA/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle size={18} className="text-green-500" /> 2 Devis/mois</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle size={18} className="text-green-500" /> 2 Factures/mois</li>
                </ul>
                <Link href="/register" className="block w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl text-center transition-colors border border-gray-200">
                  Commencer
                </Link>
              </div>

              {/* Pro */}
              <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 shadow-2xl relative transform md:-translate-y-4">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Le plus populaire</div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <p className="text-gray-400 text-sm mb-6">Pour les freelances qui se lancent</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-white">2 900</span>
                  <span className="text-gray-400"> FCFA/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-400" /> 100 Devis/mois</li>
                  <li className="flex items-center gap-3 text-gray-300"><CheckCircle size={18} className="text-blue-400" /> 100 Factures/mois</li>
                </ul>
                <button 
                  onClick={() => initiateSubscription('Pro')}
                  disabled={isLoading === 'Pro'}
                  className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-center transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-70">
                  {isLoading === 'Pro' ? 'Chargement...' : 'Commencer'}
                </button>
              </div>

              {/* Business */}
              <div className="bg-white p-8 rounded-3xl border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Business</h3>
                <p className="text-gray-500 text-sm mb-6">Pour les professionnels établis</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">5 900</span>
                  <span className="text-gray-500"> FCFA/mois</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle size={18} className="text-green-500" /> Devis illimités/mois</li>
                  <li className="flex items-center gap-3 text-gray-600"><CheckCircle size={18} className="text-green-500" /> Factures illimitées/mois</li>
                </ul>
                <button 
                  onClick={() => initiateSubscription('Business')}
                  disabled={isLoading === 'Business'}
                  className="block w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-semibold rounded-xl text-center transition-colors border border-gray-200 disabled:opacity-70">
                  {isLoading === 'Business' ? 'Chargement...' : 'Commencer'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION CTA FINAL */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Rejoins les entrepreneurs qui facturent comme des pros</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Arrêtez de perdre du temps avec la paperasse. Créez votre première facture professionnelle dans 2 minutes.</p>
            <Link href="/register" className="inline-flex bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-bold transition-transform hover:-translate-y-1 shadow-xl">
              Commencer gratuitement
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 pt-16 pb-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">iziFacture</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGV</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} iziFacture. Tous droits réservés.</p>
            <p className="mt-2 md:mt-0 flex items-center gap-1">
              Fait avec fierté en Afrique <ShieldCheck size={16} className="text-green-500" />
            </p>
          </div>
        </div>
      </footer>

      <PaymentPhoneModal 
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSubmit={handleSubscribeWithPhone}
        isLoading={isLoading !== null}
        planName={selectedPlanId}
      />
    </div>
  );
}
