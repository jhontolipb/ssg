"use server"

import { getServerClient } from "@/utils/supabase"
import { revalidatePath } from "next/cache"

export async function getEvents() {
  const supabase = getServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizations (name, type)
    `)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data
}

export async function getEventById(id: string) {
  const supabase = getServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizations (name, type)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data
}

export async function createEvent(formData: FormData) {
  const supabase = getServerClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string
  const location = formData.get("location") as string
  const organizationId = formData.get("organizationId") as string
  const mandatory = formData.get("mandatory") === "on"
  const sanction = formData.get("sanction") as string

  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      organization_id: organizationId,
      mandatory,
      sanction: sanction || null,
    })
    .select()

  if (error) {
    console.error("Error creating event:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/events")
  return { success: true, data }
}

export async function updateEvent(id: string, formData: FormData) {
  const supabase = getServerClient()

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const startTime = formData.get("startTime") as string
  const endTime = formData.get("endTime") as string
  const location = formData.get("location") as string
  const organizationId = formData.get("organizationId") as string
  const mandatory = formData.get("mandatory") === "on"
  const sanction = formData.get("sanction") as string

  const { data, error } = await supabase
    .from("events")
    .update({
      title,
      description,
      date,
      start_time: startTime,
      end_time: endTime,
      location,
      organization_id: organizationId,
      mandatory,
      sanction: sanction || null,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error("Error updating event:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/events")
  revalidatePath(`/dashboard/events/${id}`)
  return { success: true, data }
}

export async function deleteEvent(id: string) {
  const supabase = getServerClient()

  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error("Error deleting event:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/events")
  return { success: true }
}
