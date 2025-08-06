
import ThemeTogglerTwo from "../../../components/common/ThemeTogglerTwo";

import { ThemeProvider } from "../../../context/ThemeContext";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
    return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
  <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col dark:bg-gray-900 sm:p-0">
    
    {/* ----------- Formulaire à gauche ----------- */}
    

    <div className="lg:w-1/2 w-full h-full hidden lg:block">
  <div
    className="w-full h-full bg-contain bg-no-repeat bg-center"
    style={{
      backgroundImage: "url('/images/logo/enfant-logo1.png')", 
    }}
  />
</div>
<div className="lg:w-1/2 w-full h-full flex items-center justify-center">
      {children}
    </div>

 {/* ----------- Image à droite ----------- */}
    <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
      <ThemeTogglerTwo />
    </div>
    
  </div>
</ThemeProvider>
    </div>
  );
}
