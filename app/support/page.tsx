"use client";

import React, { useEffect } from 'react';
import { Mail, Phone, Clock, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-2 text-blue-600">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Aide & Support
          </h1>
          <p className="text-gray-500 text-lg">
            Notre équipe est là pour vous aider. Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          {/* Contact Information Cards */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-500 text-sm mt-1">Notre équipe vous répondra sous 24h.</p>
                  <a href="mailto:docteurdjoco@gmail.com" className="text-blue-600 font-medium mt-2 inline-block hover:underline">
                    docteurdjoco@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <p className="text-gray-500 text-sm mt-1">Du lundi au vendredi, de 9h à 18h.</p>
                  <a href="tel:+22891475677" className="text-green-600 font-medium mt-2 inline-block hover:underline">
                    +228 91475677
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horaires</h3>
                  <p className="text-gray-500 text-sm mt-1">Ouvert 24h/24 et 7jrs/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none z-0"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              
              <iframe 
                data-tally-src="https://tally.so/embed/LZNYdJ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
                loading="lazy" 
                width="100%" 
                height="400" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0} 
                title="Support Form"
              ></iframe>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
