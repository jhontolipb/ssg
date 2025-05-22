"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { getServerClient } from "@/utils/supabase"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      error: "Email and password are required",
    }
  }

  const supabase = getServerClient()

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

  const supabase = getServerClient()

  // Step 1: Create auth user with Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        student_id: studentId,
        department,
      },
    },
  })

  if (error || !data.user) {
    return {
      error: error?.message || "Failed to create account",
    }
  }

  // Step 2: Create user profile in your custom users table
  // Note: We don't store the password or password hash here
  const { error: profileError } = await supabase.from("users").insert({
    id: data.user.id,
    email,
    name,
    student_id: studentId || null,
    department: department || null,
    role: "student", // Default role
    // Don't include password_hash here!
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

export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return {
      error: "Email is required",
    }
  }

  const supabase = getServerClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Password reset link sent to your email",
  }
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!password || !confirmPassword) {
    return {
      error: "Password and confirmation are required",
    }
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match",
    }
  }

  const supabase = getServerClient()

  const { error } = await supabase.auth.updateUser({
    password,
  })

  if (error) {
    return {
      error: error.message,
    }
  }

  return {
    success: true,
    message: "Password updated successfully",
  }
}
