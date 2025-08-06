"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    return (
        
        <footer className="bg-gray-50 text-white py-8 ">
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
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Votre plateforme de lecture numérique. Découvrez des milliers de livres, 
                            vidéos et histoires pour tous les âges.
                        </p>
                    </div>

                    {/* À propos */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-blue-400">À propos</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    À propos
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Conditions d'utilisation
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Politique de confidentialité
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-blue-400">Services</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/livres" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Livres
                                </Link>
                            </li>
                            <li>
                                <Link href="/videos" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Vidéos
                                </Link>
                            </li>
                            <li>
                                <Link href="/histoires" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Histoires
                                </Link>
                            </li>
                            <li>
                                <Link href="/bibliotheque" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                    Ma Bibliothèque
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Réseaux sociaux */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-blue-400">Suivez-nous</h4>
                        <div className="flex space-x-4 mb-4">
                            <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-200">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-blue-900 transition-colors duration-200">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                                </svg>
                            </a>
                        </div>
                        <div>
                            <h5 className="text-sm font-semibold mb-2 text-gray-800">Newsletter</h5>
                            <p className="text-gray-500 text-sm mb-3">
                                Restez informés de nos nouveautés
                            </p>
                            <div className="flex">
                                <input 
                                    type="email" 
                                    placeholder="Votre email"
                                    className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                />
                                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-r-lg transition-colors duration-200">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-300 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm">
                            © 2025 Coworking Space. Tous droits réservés.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link href="/support" className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200">
                                Support
                            </Link>
                            <Link href="/faq" className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200">
                                FAQ
                            </Link>
                            <Link href="/sitemap" className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200">
                                Plan du site
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;