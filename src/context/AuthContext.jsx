// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()
export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('cv_user')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  useEffect(() => {
    try { localStorage.setItem('cv_user', JSON.stringify(user)) } catch {}
  }, [user])

  // fake login: accepts { email, password } and "authenticates" if email looks valid
  function login({ email, password }) {
    return new Promise((resolve, reject) => {
      // very simple validation for demo purposes
      if (!email || !password) {
        reject(new Error('Email and password are required'))
        return
      }
      // simulate async auth delay
      setTimeout(() => {
        // Demo: any password of length >= 4 works
        if (password.length >= 4 && email.includes('@')) {
          const u = { name: email.split('@')[0], email }
          setUser(u)
          resolve(u)
        } else {
          reject(new Error('Invalid credentials (demo)'))
        }
      }, 500)
    })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
