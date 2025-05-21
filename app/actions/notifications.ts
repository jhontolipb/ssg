"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getNotifications(userId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20)

  if (error) {
    console.error("Error fetching notifications:", error)
    throw new Error("Failed to fetch notifications")
  }

  return data
}

export async function getUnreadNotificationsCount(userId: string) {
  const supabase = getSupabaseServerClient()

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false)

  if (error) {
    console.error("Error fetching unread notifications count:", error)
    throw new Error("Failed to fetch unread notifications count")
  }

  return count || 0
}

export async function markNotificationAsRead(notificationId: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  if (error) {
    console.error("Error marking notification as read:", error)
    throw new Error("Failed to mark notification as read")
  }

  revalidatePath("/dashboard")
}

export async function markAllNotificationsAsRead(userId: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false)

  if (error) {
    console.error("Error marking all notifications as read:", error)
    throw new Error("Failed to mark all notifications as read")
  }

  revalidatePath("/dashboard")
}
