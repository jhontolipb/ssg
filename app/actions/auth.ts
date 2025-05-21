"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required",
    }
  }

  const supabase = getSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const studentId = formData.get("studentId") as string
  const department = formData.get("department") as string

  if (!email || !password || !name) {
    return {
      error: "Name, email and password are required",
    }
  }

  const supabase = getSupabaseServerClient()

  // Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error || !data.user) {
    return {
      error: error?.message || "Failed to create account",
    }
  }

  // Create user profile
  const { error: profileError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
    name,
    student_id: studentId || null,
    department: department || null,
    role: "student", // Default role
  })

  if (profileError) {
    return {
      error: profileError.message,
    }
  }

  redirect("/login?registered=true")
}

export async function signOut() {
  const cookieStore = cookies()
  const supabase = createServerActionClient({ cookies: () => cookieStore })
  await supabase.auth.signOut()
  redirect("/login")
}
