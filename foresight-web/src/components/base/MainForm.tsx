import Footer from "./Footer"
import Navbar from "./Navbar"

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white">
      <Navbar />

      <main className="flex flex-1 max-w-7xl mx-auto w-full">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout