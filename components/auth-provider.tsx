"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/supabaseBrowserClient"

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
  const pathname = usePathname()

  // Initialize Supabase client inside the component to ensure it's only created in the browser
  const supabase = typeof window !== "undefined" ? getSupabaseBrowserClient() : null

  useEffect(() => {
    // Skip if running on server or if supabase client isn't available
    if (typeof window === "undefined" || !supabase) {
      return
    }

    let mounted = true
    let authTimeout: NodeJS.Timeout | null = null

    const getUser = async () => {
      try {
        // Get session with timeout
        const sessionPromise = supabase.auth.getSession()
        const timeoutPromise = new Promise((_, reject) => {
          authTimeout = setTimeout(() => reject(new Error("Auth session timeout")), 5000)
        })

        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as any

        if (authTimeout) {
          clearTimeout(authTimeout)
          authTimeout = null
        }

        if (!session?.user) {
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        // Use session data directly without fetching profile
        if (mounted) {
          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
            role: session.user.user_metadata?.role || "student",
          }

          setUser(userData)
          setLoading(false)

          // Try to fetch profile in the background, but don't block the UI
          fetchUserProfile(session.user.id).catch(console.error)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        if (mounted) {
          // Fall back to localStorage if available
          try {
            const storedUser = localStorage.getItem("ssgdigi_user")
            if (storedUser) {
              setUser(JSON.parse(storedUser))
            } else {
              setUser(null)
            }
          } catch (e) {
            setUser(null)
          }
          setLoading(false)
        }
      }
    }

    // Fetch user profile in the background
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile } = await supabase.from("users").select("*").eq("id", userId).maybeSingle()

        if (profile && mounted) {
          const userData = {
            id: userId,
            email: profile.email || "",
            name: profile.name || "",
            role: profile.role || "student",
          }

          setUser(userData)

          // Store in localStorage as fallback
          localStorage.setItem("ssgdigi_user", JSON.stringify(userData))
        }
      } catch (error) {
        console.error("Background profile fetch error:", error)
        // Non-blocking error - we already have basic user data from session
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Use session data directly
        if (mounted) {
          const userData = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "User",
            role: session.user.user_metadata?.role || "student",
          }

          setUser(userData)

          // Store in localStorage as fallback
          localStorage.setItem("ssgdigi_user", JSON.stringify(userData))

          // Try to fetch profile in the background
          fetchUserProfile(session.user.id).catch(console.error)

          // Redirect to dashboard on sign in
          if (pathname === "/login" || pathname === "/register") {
            router.push("/dashboard")
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted) {
          setUser(null)
          localStorage.removeItem("ssgdigi_user")

          if (pathname.startsWith("/dashboard")) {
            router.push("/login")
          }
        }
      }
    })

    return () => {
      mounted = false
      if (authTimeout) {
        clearTimeout(authTimeout)
      }
      authListener.subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  // Protect routes
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"]
      const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/auth/")

      if (!user && !isPublicRoute) {
        router.push("/login")
      } else if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/dashboard")
      }
    }
  }, [user, loading, pathname, router])

  const login = async (email: string, password: string) => {
    if (!supabase) return false

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error.message)
        return false
      }

      if (data.session) {
        // Store basic user data in localStorage as fallback
        const userData = {
          id: data.user.id,
          email: data.user.email || "",
          name: data.user.user_metadata?.name || data.user.email?.split("@")[0] || "User",
          role: data.user.user_metadata?.role || "student",
        }

        localStorage.setItem("ssgdigi_user", JSON.stringify(userData))

        // Force redirect to dashboard
        router.push("/dashboard")
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      localStorage.removeItem("ssgdigi_user")
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Force logout even if there's an error
      localStorage.removeItem("ssgdigi_user")
      router.push("/login")
    }
  }

  const register = async (email: string, password: string, name: string, studentId: string, department: string) => {
    if (!supabase) return false

    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            student_id: studentId,
            department,
            role: "student",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error || !data.user) {
        console.error("Registration error:", error)
        return false
      }

      // Try to create user profile, but don't block registration if it fails
      try {
        await supabase.from("users").insert({
          id: data.user.id,
          email,
          name,
          student_id: studentId,
          department,
          role: "student", // Default role
        })
      } catch (profileError) {
        console.error("Profile creation error:", profileError)
        // Continue anyway - we'll create the profile later if needed
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
