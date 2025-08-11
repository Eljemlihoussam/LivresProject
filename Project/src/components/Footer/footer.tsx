"use client";
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/images/bar/livre_site.png" 
                alt="LIVRENF Logo" 
                className="w-12 h-12 mr-3" 
              />
              <span className="text-xl font-bold text-blue-400">LIVRENF</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              Votre plateforme de lecture numérique. Découvrez des milliers de livres, 
              vidéos et histoires pour tous les âges.
            </p>
          </div>

          {/* À propos */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-blue-400">À propos</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">À propos</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Conditions d'utilisation</Link></li>
              <li><Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Politique de confidentialité</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-blue-400">Services</h4>
            <ul className="space-y-2">
              <li><Link href="/livres" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Livres</Link></li>
              <li><Link href="/videos" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Vidéos</Link></li>
              <li><Link href="/histoires" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Histoires</Link></li>
              <li><Link href="/bibliotheque" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors">Ma Bibliothèque</Link></li>
            </ul>
          </div>

          {/* Réseaux sociaux et newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-blue-400">Suivez-nous</h4>
            <div className="flex space-x-4 mb-4">
              {/* Icônes réseaux sociaux */}
            </div>
            <h5 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-200">Newsletter</h5>
            <p className="text-sm mb-3 text-gray-500 dark:text-gray-400">
              Restez informés de nos nouveautés
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Votre email"
                className="flex-1 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-r-lg transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Coworking Space. Tous droits réservés.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">Support</Link>
              <Link href="/faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">FAQ</Link>
              <Link href="/sitemap" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">Plan du site</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
