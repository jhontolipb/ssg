"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function getAttendanceByEventId(eventId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      users (id, name, email, student_id, department)
    `)
    .eq("event_id", eventId)

  if (error) {
    console.error(`Error fetching attendance for event ${eventId}:`, error)
    throw new Error("Failed to fetch attendance records")
  }

  return data
}

export async function getAttendanceByUserId(userId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("attendance")
    .select(`
      *,
      events (id, title, date, start_time, end_time, location, mandatory)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching attendance for user ${userId}:`, error)
    throw new Error("Failed to fetch attendance records")
  }

  return data
}

export async function recordAttendance(eventId: string, userId: string, type: "check_in" | "check_out") {
  const supabase = getSupabaseServerClient()

  // Check if attendance record exists
  const { data: existingRecord, error: fetchError } = await supabase
    .from("attendance")
    .select("*")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) {
    console.error("Error checking existing attendance record:", fetchError)
    throw new Error("Failed to check attendance record")
  }

  const now = new Date().toISOString()

  if (existingRecord) {
    // Update existing record
    const updateData =
      type === "check_in" ? { check_in_time: now, status: "present" as const } : { check_out_time: now }

    const { error: updateError } = await supabase.from("attendance").update(updateData).eq("id", existingRecord.id)

    if (updateError) {
      console.error("Error updating attendance record:", updateError)
      throw new Error("Failed to update attendance record")
    }
  } else {
    // Create new record
    const insertData = {
      event_id: eventId,
      user_id: userId,
      status: "present" as const,
    }

    if (type === "check_in") {
      Object.assign(insertData, { check_in_time: now })
    } else {
      Object.assign(insertData, { check_out_time: now })
    }

    const { error: insertError } = await supabase.from("attendance").insert(insertData)

    if (insertError) {
      console.error("Error creating attendance record:", insertError)
      throw new Error("Failed to create attendance record")
    }
  }

  // Create notification
  await supabase.from("notifications").insert({
    user_id: userId,
    title: "Attendance Recorded",
    message: `Your attendance has been recorded for an event.`,
    type: "attendance",
    related_id: eventId,
  })

  revalidatePath(`/dashboard/attendance`)
  revalidatePath(`/dashboard/events/${eventId}`)
}

export async function updateAttendanceStatus(attendanceId: string, status: "present" | "late" | "absent" | "excused") {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("attendance")
    .update({ status })
    .eq("id", attendanceId)
    .select("event_id, user_id")
    .single()

  if (error) {
    console.error(`Error updating attendance status:`, error)
    throw new Error("Failed to update attendance status")
  }

  // Create notification
  await supabase.from("notifications").insert({
    user_id: data.user_id,
    title: "Attendance Status Updated",
    message: `Your attendance status has been updated to ${status}.`,
    type: "attendance",
    related_id: data.event_id,
  })

  revalidatePath(`/dashboard/attendance`)
  revalidatePath(`/dashboard/events/${data.event_id}`)
}
