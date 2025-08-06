import Navbar from "../../components/NavBar/navbar";
import Footer from "../../components/Footer/footer";
export default function RootLayout({ children }) {
    return (
      <html lang="es">
        <head>
  
        </head>
        <body>
            <Navbar />
          
            { children }
            
          <Footer/>
        </body>
      </html>
    )
  }