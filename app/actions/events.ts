"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getEvents() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizations (name, type),
      event_officers (user_id, users (name, email))
    `)
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    throw new Error("Failed to fetch events")
  }

  return data
}

export async function getEventById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizations (name, type),
      event_officers (user_id, users (name, email))
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching event with ID ${id}:`, error)
    throw new Error("Failed to fetch event")
  }

  return data
}

export async function createEvent(eventData: {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizationId: string
  mandatory: boolean
  sanction?: string
}) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      location: eventData.location,
      organization_id: eventData.organizationId,
      mandatory: eventData.mandatory,
      sanction: eventData.sanction,
    })
    .select()

  if (error) {
    console.error("Error creating event:", error)
    throw new Error("Failed to create event")
  }

  revalidatePath("/dashboard/events")
  return data[0]
}

export async function updateEvent(
  id: string,
  eventData: {
    title?: string
    description?: string
    date?: string
    startTime?: string
    endTime?: string
    location?: string
    organizationId?: string
    mandatory?: boolean
    sanction?: string
  },
) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("events")
    .update({
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      start_time: eventData.startTime,
      end_time: eventData.endTime,
      location: eventData.location,
      organization_id: eventData.organizationId,
      mandatory: eventData.mandatory,
      sanction: eventData.sanction,
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating event with ID ${id}:`, error)
    throw new Error("Failed to update event")
  }

  revalidatePath("/dashboard/events")
  revalidatePath(`/dashboard/events/${id}`)
  return data[0]
}

export async function deleteEvent(id: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting event with ID ${id}:`, error)
    throw new Error("Failed to delete event")
  }

  revalidatePath("/dashboard/events")
}

export async function assignOfficerToEvent(eventId: string, userId: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("event_officers").insert({
    event_id: eventId,
    user_id: userId,
  })

  if (error) {
    console.error(`Error assigning officer to event:`, error)
    throw new Error("Failed to assign officer to event")
  }

  revalidatePath(`/dashboard/events/${eventId}`)
}

export async function removeOfficerFromEvent(eventId: string, userId: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("event_officers").delete().eq("event_id", eventId).eq("user_id", userId)

  if (error) {
    console.error(`Error removing officer from event:`, error)
    throw new Error("Failed to remove officer from event")
  }

  revalidatePath(`/dashboard/events/${eventId}`)
}
