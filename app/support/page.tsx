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
    <div className="relative">
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

        <div className="max-w-3xl mx-auto mt-12">
          
          {/* Form Section */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
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
