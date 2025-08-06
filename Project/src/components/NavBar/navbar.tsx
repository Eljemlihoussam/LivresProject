"use client"
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, User, Settings, LogOut, BookOpen, Heart } from 'lucide-react';

const Navbar = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Section gauche */}
        <div className="flex items-center space-x-6">
          {/* Icône utilisateur avec dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 hover:bg-blue-200 rounded-full transition-all duration-300 group"
            >
              <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
            
            {isProfileOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div className="bg-blue-500 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">John Doe</h3>
                      <p className="text-sm opacity-90">john.doe@email.com</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200">
                    <BookOpen className="w-4 h-4 mr-3" />
                    Mes Livres
                  </button>
                  <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200">
                    <Heart className="w-4 h-4 mr-3" />
                    Favoris
                  </button>
                  <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Paramètres
                  </button>
                  <hr className="my-2" />
                  <button className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200">
                    <LogOut className="w-4 h-4 mr-3" />
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Icônes sociales */}
          <div className="flex items-center space-x-4">
            {/* Instagram */}
            <button className="hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </button>
            
            {/* TikTok */}
            <button className="hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Section centrale */}
        <div className="flex items-center space-x-8">
          <Link href="/videos" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Videos
          </Link>
          <Link href="/histoires" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Histoires
          </Link>
          
          {/* Logo */}
          <Link href="/" className="mx-8">
            <div className="flex items-center">
              <img 
                src="/images/bar/livre_site.png" 
                alt="LIVRENF Logo" 
                className="w-10 h-10 mr-2"
              />
              {/* <span className="text-2xl font-bold text-sky-600">LIVRENF</span> */}
            </div>
          </Link>
          
          <Link href="/livres" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Livres
          </Link>
          
          {/* Sélecteur de langue */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <span>Langues</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isLanguageOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Français
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    English
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    العربية
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Español
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section droite */}
        <div className="flex items-center">
          <div className="relative">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-blue-100 rounded-full transition-all duration-300 group"
            >
              <Search className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
            
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-300 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div className="bg-blue-500 p-4">
                  <h3 className="text-white font-semibold mb-3">Rechercher</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher des livres, vidéos, histoires..."
                      className="w-full px-4 py-3 pl-10 rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:outline-none text-gray-700 placeholder-white-400"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Recherches populaires</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Romans', 'Science-fiction', 'Histoire', 'Philosophie'].map((tag) => (
                        <button
                          key={tag}
                          className="px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full text-sm text-gray-600 transition-all duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  {searchQuery && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Suggestions</h4>
                      <div className="space-y-1">
                        {['Le Petit Prince', 'Harry Potter', '1984'].filter(item => 
                          item.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((suggestion) => (
                          <button
                            key={suggestion}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
            {(isLanguageOpen || isProfileOpen || isSearchOpen) && (
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => {
                  setIsLanguageOpen(false);
                  setIsProfileOpen(false);
                  setIsSearchOpen(false);
                }}
              />
            )}
      </div>
    </nav>
  );
};

export default Navbar;