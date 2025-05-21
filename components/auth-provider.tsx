"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  name: string
  role: string
} | null

type AuthContextType = {
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string, studentId: string, department: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setUser(null)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Get user profile data
          const { data: profile, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (profileError) {
            console.error("Error getting user profile:", profileError)
            setUser(null)
          } else if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              name: profile.name || "",
              role: profile.role || "student",
            })
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Auth error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Error getting user profile:", profileError)
          setUser(null)
        } else if (profile) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: profile.name || "",
            role: profile.role || "student",
          })
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error.message)
        return false
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const register = async (email: string, password: string, name: string, studentId: string, department: string) => {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error || !data.user) {
        console.error("Registration error:", error)
        return false
      }

      // Create user profile
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        name,
        student_id: studentId,
        department,
        role: "student", // Default role
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return false
      }

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
