import { Gitlab, LogOut, SearchCode } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { Link, useRouter } from '@tanstack/react-router'

const Navbar: React.FC = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const { navigate } = useRouter()

  const handleLogout = async () => {
    if (isLoggedIn) {
      await logout()
      navigate({ to: '/' })
    }
  }
  
  return (
    <header className="p-6 border-b border-gray-800">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Link to='/' className="flex">
            <p className="font-bold text-xl">Foresight Reviewer</p>
            <SearchCode className="ml-1" />
          </Link>
        </div>

        {isLoggedIn && (
          <div className="flex items-center">
            <p className="font-bold mr-4">
              {user?.name}
            </p>

            <Gitlab />

            <img
              width={28}
              className="rounded-full ml-2"
              src={user?.avatar || ''} 
              alt="user_profile_pic" 
            />

            <button className="cursor-pointer">
              <LogOut onClick={handleLogout} className="ml-6"/>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar