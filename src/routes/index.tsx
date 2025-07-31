import Footer from '../components/base/Footer'
import MainForm from '../components/base/MainForm'
import Navbar from '../components/base/Navbar'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-black text-white">
      <Navbar />
      <MainForm />
      <Footer />
    </div>
  )
}
