import Navbar from "../../components/NavBar/navbar";
import Footer from "../../components/Footer/footer";
export default function RootLayout({ children }) {
    return (
      <html lang="es">
        <head>
  
        </head>
        <body>
          <div className="sticky top-0 z-50"   >
            <Navbar  />
          </div>
            { children }
            
          <Footer/>
        </body>
      </html>
    )
  }