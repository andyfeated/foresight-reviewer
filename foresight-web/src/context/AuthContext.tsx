import axios from "axios";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode
}

interface User {
  id: string
  name: string;
  avatar: string
}

interface AuthContextType {
  isLoggedIn: boolean,
  user: User | null,
  logout: () => Promise<void>,
  setAuthStatus: (isLoggedIn: boolean, user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)

  const setAuthStatus = (isLoggedIn: boolean, user: User | null) => {
    setIsLoggedIn(isLoggedIn)
    setUser(user ?? null)
  }

  useEffect(() => {
    (async function() {
      const statusRes: any = await axios.get(
        `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/auth/status`,
        {
          withCredentials: true
        }
      )

      setAuthStatus(
        statusRes.data.isLoggedIn, 
        { 
          id: statusRes.data.id,
          name: statusRes.data.name,
          avatar: statusRes.data.avatar 
        }
      )
    })()
  }, [])

  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_GATEWAY_BASE_URL}/api/auth/logout`, {}, { withCredentials: true }
      )

      setAuthStatus(false, null)
      // remove pr url cache here
    } catch (err) {
      throw new Error('Failed logging out')
    }
  }

  const contextValues: AuthContextType = {
    isLoggedIn,
    user,
    logout,
    setAuthStatus
  }
  
  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('Context is undefined')
  }
  return context
}