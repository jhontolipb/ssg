"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getStudentPoints(userId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("student_points")
    .select(`
      *,
      assigned_by_user:assigned_by (name)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching points for user ${userId}:`, error)
    throw new Error("Failed to fetch student points")
  }

  return data
}

export async function getTotalStudentPoints(userId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("student_points").select("points").eq("user_id", userId)

  if (error) {
    console.error(`Error fetching total points for user ${userId}:`, error)
    throw new Error("Failed to fetch total student points")
  }

  // Calculate total points
  const totalPoints = data.reduce((sum, record) => sum + record.points, 0)

  return totalPoints
}

export async function awardPoints(userId: string, points: number, reason: string, assignedBy: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("student_points").insert({
    user_id: userId,
    points,
    reason,
    assigned_by: assignedBy,
  })

  if (error) {
    console.error("Error awarding points:", error)
    throw new Error("Failed to award points")
  }

  // Create notification
  await supabase.from("notifications").insert({
    user_id: userId,
    title: "Points Awarded",
    message: `You have been awarded ${points} points for: ${reason}`,
    type: "system",
  })

  revalidatePath("/dashboard")
  revalidatePath(`/dashboard/users/${userId}`)
}
