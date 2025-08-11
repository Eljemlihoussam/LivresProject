"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // ou 'next/router' pour Next.js 12 et antérieur
import { ChevronDown, Search, User, Settings, LogOut, BookOpen, Heart, Moon, Sun, UserPlus, LogIn, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Router pour la navigation
  const router = useRouter();
  
  // Simulation de l'état de session - vous pouvez le remplacer par votre logique de session
  const [user, setUser] = useState(null); // null = pas connecté, objet = connecté
  
  // Utiliser le ThemeContext au lieu de l'état local
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Fonctions de gestion de l'authentification
  const handleSignIn = () => {
    setIsProfileOpen(false); // Fermer le dropdown
    router.push('/signin'); // Redirection vers la page de connexion
  };

  const handleSignUp = () => {
    setIsProfileOpen(false); // Fermer le dropdown
    router.push('/signup'); // Redirection vers la page d'inscription
  };

  const handleGuestMode = () => {
    console.log('Connexion en tant qu\'invité');
    // Implémentez votre logique de mode invité
    setUser({ isGuest: true, name: 'Invité' });
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileOpen(false);
    // Optionnel : redirection vers la page d'accueil après déconnexion
    router.push('/');
    console.log('Déconnexion');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Section gauche */}
        <div className="flex items-center space-x-6">
          {/* Icône utilisateur avec dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full transition-all duration-300 group"
            >
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>
            
            {isProfileOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-20 overflow-hidden">
                {user ? (
                  // Menu pour utilisateur connecté
                  <>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-4 text-white">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          {user.isGuest ? (
                            <Users className="w-6 h-6" />
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.isGuest ? 'Mode Invité' : (user.name || 'John Doe')}
                          </h3>
                          <p className="text-sm opacity-90">
                            {user.isGuest ? 'Accès limité' : (user.email || 'john.doe@email.com')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      {!user.isGuest && (
                        <>
                          <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200">
                            <BookOpen className="w-4 h-4 mr-3" />
                            Mes Livres
                          </button>
                          <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200">
                            <Heart className="w-4 h-4 mr-3" />
                            Favoris
                          </button>
                          <button className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-200">
                            <Settings className="w-4 h-4 mr-3" />
                            Paramètres
                          </button>
                          <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        </>
                      )}
                      {user.isGuest && (
                        <>
                          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50">
                            Connectez-vous pour accéder à toutes les fonctionnalités
                          </div>
                          <button 
                            onClick={handleSignIn}
                            className="flex items-center w-full px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                          >
                            <LogIn className="w-4 h-4 mr-3" />
                            Se connecter
                          </button>
                          <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        </>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Se déconnecter
                      </button>
                    </div>
                  </>
                ) : (
                  // Menu pour utilisateur non connecté
                  <>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 p-6 text-white text-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-1">Bienvenue !</h3>
                      <p className="text-sm opacity-90">Connectez-vous pour une expérience personnalisée</p>
                    </div>
                    <div className="p-4 space-y-3">
                      <button 
                        onClick={handleSignIn}
                        className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Se connecter
                      </button>
                      
                      <button 
                        onClick={handleSignUp}
                        className="flex items-center justify-center w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        S'inscrire
                      </button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">ou</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleGuestMode}
                        className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Continuer en tant qu'invité
                      </button>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3 leading-relaxed">
                        En tant qu'invité, vous pouvez parcourir le contenu mais certaines fonctionnalités seront limitées.
                      </p>
                    </div>
                  </>
                )}
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
              <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Section centrale */}
        <div className="flex items-center space-x-8">
          <Link href="/videos" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Videos
          </Link>
          <Link href="/histoires" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Histoires
          </Link>
          
          {/* Logo */}
          <Link href="/" className="mx-8">
            <div className="flex items-center">
              <img 
                src="/images/bar/hikaya.png" 
                alt="LIVRENF Logo" 
                className="w-10 h-10 mr-2"
              />
              {/* <span className="text-2xl font-bold text-sky-600">LIVRENF</span> */}
            </div>
          </Link>
          
          <Link href="/livres" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
            Livres
          </Link>
          
          {/* Sélecteur de langue */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
            >
              <span>Langues</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isLanguageOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Français
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    English
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    العربية
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Español
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section droite */}
        <div className="flex items-center space-x-2">
          {/* Bouton de recherche */}
          <div className="relative">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-all duration-300 group"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </button>
            
            {/* Bouton Dark/Light Mode - utilise maintenant le ThemeContext */}
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-all duration-300 group ml-2"
              aria-label="Basculer le thème"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
              )}
            </button>
            
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl z-20 overflow-hidden">
                <div className="bg-blue-500 dark:bg-blue-600 p-4">
                  <h3 className="text-white font-semibold mb-3">Rechercher</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher des livres, vidéos, histoires..."
                      className="w-full px-4 py-3 pl-10 rounded-lg border-0 focus:ring-2 focus:ring-white/50 focus:outline-none text-gray-700 dark:text-gray-200 dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-300"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Recherches populaires</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Fairy Tales', 'Adventures', 'History', 'Animals and Nature'].map((tag) => (
                        <button
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-full text-sm text-gray-600 dark:text-gray-300 transition-all duration-200"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  {searchQuery && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Suggestions</h4>
                      <div className="space-y-1">
                        {['Le Petit Prince', 'Harry Potter', '1984'].filter(item => 
                          item.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((suggestion) => (
                          <button
                            key={suggestion}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg transition-all duration-200"
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

        {/* Overlay pour fermer les dropdowns */}
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