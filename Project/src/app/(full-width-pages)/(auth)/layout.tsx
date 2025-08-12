"use client"
import ThemeTogglerTwo from "../../../components/common/ThemeTogglerTwo";
import { ThemeProvider } from "../../../context/ThemeContext";
import { ChevronLeftIcon } from "../../../icons";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
          
          {/* Styles CSS pour les animations */}
          <style jsx global>{`
            @keyframes float {
              0%, 100% { 
                transform: translateY(0px) translateX(0px) rotate(0deg); 
              }
              25% { 
                transform: translateY(-10px) translateX(3px) rotate(2deg); 
              }
              50% { 
                transform: translateY(-20px) translateX(-2px) rotate(0deg); 
              }
              75% { 
                transform: translateY(-8px) translateX(5px) rotate(-1deg); 
              }
            }
            .animate-float {
              animation: float ease-in-out infinite;
            }
          `}</style>

          {/* Livres flottants décoratifs */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Livre JavaScript */}
            <div className="absolute top-16 left-20 w-16 h-20 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-sm shadow-lg animate-float opacity-80 transform rotate-12" 
                 style={{animationDelay: '0s', animationDuration: '6s'}}>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-800 rounded-l-sm"></div>
              <div className="absolute left-2 top-1 right-1 bottom-1 bg-yellow-500 rounded-sm flex flex-col items-center justify-center p-1">
                <div className="text-xs font-bold text-yellow-900 text-center leading-tight">JS</div>
                <div className="w-full h-px bg-yellow-700 my-1"></div>
                <div className="text-xs text-yellow-800 text-center" style={{fontSize: '6px'}}>JavaScript</div>
              </div>
            </div>
            
            {/* Livre React */}
            <div className="absolute top-24 right-16 w-14 h-18 bg-gradient-to-r from-blue-600 to-blue-700 rounded-sm shadow-lg animate-float opacity-70 transform -rotate-6" 
                 style={{animationDelay: '2s', animationDuration: '7s'}}>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-800 rounded-l-sm"></div>
              <div className="absolute left-2 top-1 right-1 bottom-1 bg-blue-400 rounded-sm flex flex-col items-center justify-center p-1">
                <div className="text-xs font-bold text-blue-900 text-center">⚛</div>
                <div className="w-full h-px bg-blue-700 my-1"></div>
                <div className="text-xs text-blue-800 text-center" style={{fontSize: '6px'}}>React</div>
              </div>
            </div>
            
            {/* Livre Python */}
            <div className="absolute top-40 left-8 w-18 h-22 bg-gradient-to-r from-green-600 to-green-700 rounded-sm shadow-lg animate-float opacity-90 transform rotate-8" 
                 style={{animationDelay: '4s', animationDuration: '8s'}}>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-green-800 rounded-l-sm"></div>
              <div className="absolute left-2 top-1 right-1 bottom-1 bg-green-400 rounded-sm flex flex-col items-center justify-center p-1">
                <div className="text-sm font-bold text-green-900 text-center">🐍</div>
                <div className="w-full h-px bg-green-700 my-1"></div>
                <div className="text-xs text-green-800 text-center" style={{fontSize: '7px'}}>PYTHON</div>
                <div className="text-xs text-green-700 text-center" style={{fontSize: '5px'}}>Programming</div>
              </div>
            </div>
            
            {/* Livre Design */}
            <div className="absolute top-48 right-24 w-15 h-19 bg-gradient-to-r from-purple-600 to-purple-700 rounded-sm shadow-lg animate-float opacity-75 transform -rotate-10" 
                 style={{animationDelay: '1s', animationDuration: '9s'}}>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-purple-800 rounded-l-sm"></div>
              <div className="absolute left-2 top-1 right-1 bottom-1 bg-purple-400 rounded-sm flex flex-col items-center justify-center p-1">
                <div className="text-sm font-bold text-purple-900 text-center">🎨</div>
                <div className="w-full h-px bg-purple-700 my-1"></div>
                <div className="text-xs text-purple-800 text-center" style={{fontSize: '6px'}}>UI/UX</div>
                <div className="text-xs text-purple-700 text-center" style={{fontSize: '5px'}}>Design</div>
              </div>
            </div>
            
            {/* Livre HTML CSS */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gradient-to-r from-orange-600 to-orange-700 rounded-sm shadow-lg animate-float opacity-60 rotate-3" 
                 style={{animationDelay: '3s', animationDuration: '10s'}}>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-orange-800 rounded-l-sm"></div>
              <div className="absolute left-2 top-1 right-1 bottom-1 bg-orange-400 rounded-sm flex flex-col items-center justify-center p-1">
                <div className="text-xs font-bold text-orange-900 text-center">&lt;/&gt;</div>
                <div className="w-full h-px bg-orange-700 my-1"></div>
                <div className="text-xs text-orange-800 text-center" style={{fontSize: '6px'}}>HTML</div>
                <div className="text-xs text-orange-700 text-center" style={{fontSize: '5px'}}>& CSS</div>
              </div>
            </div>
            
            {/* Livre Node.js */}
            <div className="absolute bottom-32 left-12 w-17 h-21 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-sm shadow-lg animate-float opacity-85 transform rotate-15" 
                 style={{animationDelay: '5s', animationDuration: '7.5s'}}>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-800 rounded-l-sm"></div>
              <div className="absolute left-2 top-1 right-1 bottom-1 bg-emerald-400 rounded-sm flex flex-col items-center justify-center p-1">
                <div className="text-sm font-bold text-emerald-900 text-center">⬢</div>
                <div className="w-full h-px bg-emerald-700 my-1"></div>
                <div className="text-xs text-emerald-800 text-center" style={{fontSize: '6px'}}>NODE.JS</div>
                <div className="text-xs text-emerald-700 text-center" style={{fontSize: '5px'}}>Backend</div>
              </div>
            </div>
            
            {/* Livre AI & ML */}
            <div className="absolute bottom-28 right-20 w-16 h-20 bg-gradient-to-r from-red-600 to-red-700 rounded-sm shadow-lg animate-float opacity-70 transform -rotate-8" 
                 style={{animationDelay: '1.5s', animationDuration: '6.5s'}}>
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-800 rounded-l-sm"></div>
              <div className="absolute left-2 top-1 right-1 bottom-1 bg-red-400 rounded-sm flex flex-col items-center justify-center p-1">
                <div className="text-sm font-bold text-red-900 text-center">🤖</div>
                <div className="w-full h-px bg-red-700 my-1"></div>
                <div className="text-xs text-red-800 text-center" style={{fontSize: '6px'}}>AI & ML</div>
                <div className="text-xs text-red-700 text-center" style={{fontSize: '5px'}}>Machine</div>
              </div>
            </div>
          </div>

          {/* Lien de retour fixe en haut */}
          <div className="absolute top-10 left-1/4 transform -translate-x-1/2 z-20">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-blue-700 transition-all duration-200 hover:text-blue-800 dark:text-gray-400 dark:hover:text-gray-300 hover:translate-x-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <ChevronLeftIcon />
              Retour au dashboard
            </Link>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 flex items-center justify-center p-8 relative z-10">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
            
          {/* Toggle thème */}
          <div className="fixed bottom-6 right-6 z-50">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}