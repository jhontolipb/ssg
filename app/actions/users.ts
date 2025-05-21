"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { UserRole } from "@/lib/types"

export async function getUsers() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  return data
}

export async function getUserById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching user with ID ${id}:`, error)
    throw new Error("Failed to fetch user")
  }

  return data
}

export async function updateUserRole(userId: string, role: UserRole) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("users").update({ role }).eq("id", userId)

  if (error) {
    console.error(`Error updating user role:`, error)
    throw new Error("Failed to update user role")
  }

  revalidatePath("/dashboard/users")
}

export async function updateUserProfile(
  userId: string,
  profileData: {
    name?: string
    department?: string
    student_id?: string
  },
) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("users")
    .update({
      name: profileData.name,
      department: profileData.department,
      student_id: profileData.student_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    console.error(`Error updating user profile:`, error)
    throw new Error("Failed to update user profile")
  }

  revalidatePath("/dashboard/profile")
}

export async function generateQrCode(userId: string) {
  const supabase = getSupabaseServerClient()

  // Get user's student ID
  const { data: user, error: userError } = await supabase.from("users").select("student_id").eq("id", userId).single()

  if (userError || !user) {
    console.error(`Error fetching user:`, userError)
    throw new Error("Failed to fetch user")
  }

  // Generate QR code URL (in a real app, you'd use a QR code generation service)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${user.student_id}`

  // Update user with QR code URL
  const { error } = await supabase.from("users").update({ qr_code: qrCodeUrl }).eq("id", userId)

  if (error) {
    console.error(`Error updating user QR code:`, error)
    throw new Error("Failed to update user QR code")
  }

  revalidatePath("/dashboard/my-qr")
  return qrCodeUrl
}
