import { SearchCode } from "lucide-react"

const Navbar: React.FC = () => {
  return (
    <header className="p-6 border-b border-gray-800">
      <div className="flex">
        <p className="font-bold text-xl">Foresight Reviewer</p>
        <SearchCode className="ml-1" />
      </div>
    </header>
  )
}

export default Navbar