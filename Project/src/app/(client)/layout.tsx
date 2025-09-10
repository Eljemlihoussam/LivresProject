import Navbar from "../../components/NavBar/navbar";
import Footer from "../../components/Footer/footer";
import { ThemeProvider } from "next-themes"; // Ajout

export default function RootLayout({ children }) {
    return (
      <html lang="es">
        <head></head>
        <body>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="sticky top-0 z-50">
              <Navbar />
            </div>
            <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
              <div suppressHydrationWarning>
                {children}
              </div>
            </div>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    )
}