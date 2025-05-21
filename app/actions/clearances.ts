"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function getClearancesByUserId(userId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("clearances")
    .select(`
      *,
      organizations (id, name, type, department)
    `)
    .eq("user_id", userId)

  if (error) {
    console.error(`Error fetching clearances for user ${userId}:`, error)
    throw new Error("Failed to fetch clearance records")
  }

  return data
}

export async function getClearancesByOrganizationId(organizationId: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("clearances")
    .select(`
      *,
      users (id, name, email, student_id, department)
    `)
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching clearances for organization ${organizationId}:`, error)
    throw new Error("Failed to fetch clearance records")
  }

  return data
}

export async function getPendingClearances() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("clearances")
    .select(`
      *,
      users (id, name, email, student_id, department),
      organizations (id, name, type, department)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending clearances:", error)
    throw new Error("Failed to fetch pending clearances")
  }

  return data
}

export async function requestClearance(userId: string, organizationId: string) {
  const supabase = getSupabaseServerClient()

  // Check if clearance already exists
  const { data: existingClearance, error: checkError } = await supabase
    .from("clearances")
    .select("*")
    .eq("user_id", userId)
    .eq("organization_id", organizationId)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking existing clearance:", checkError)
    throw new Error("Failed to check existing clearance")
  }

  if (existingClearance) {
    // If it exists but was rejected, allow to request again
    if (existingClearance.status === "rejected") {
      const { error: updateError } = await supabase
        .from("clearances")
        .update({
          status: "pending",
          remarks: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingClearance.id)

      if (updateError) {
        console.error("Error updating clearance request:", updateError)
        throw new Error("Failed to update clearance request")
      }
    } else {
      throw new Error("Clearance request already exists")
    }
  } else {
    // Create new clearance request
    const { error: insertError } = await supabase.from("clearances").insert({
      user_id: userId,
      organization_id: organizationId,
      status: "pending",
    })

    if (insertError) {
      console.error("Error creating clearance request:", insertError)
      throw new Error("Failed to create clearance request")
    }
  }

  // Get organization admins to notify them
  const { data: orgAdmins, error: adminsError } = await supabase
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", organizationId)
    .eq("is_admin", true)

  if (!adminsError && orgAdmins) {
    // Create notifications for organization admins
    for (const admin of orgAdmins) {
      await supabase.from("notifications").insert({
        user_id: admin.user_id,
        title: "New Clearance Request",
        message: "A student has requested clearance approval.",
        type: "clearance",
        related_id: userId,
      })
    }
  }

  revalidatePath("/dashboard/clearance")
}

export async function updateClearanceStatus(clearanceId: string, status: "approved" | "rejected", remarks?: string) {
  const supabase = getSupabaseServerClient()

  const transactionCode = status === "approved" ? uuidv4().substring(0, 8).toUpperCase() : null

  const { data, error } = await supabase
    .from("clearances")
    .update({
      status,
      remarks,
      transaction_code: transactionCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", clearanceId)
    .select("user_id, organization_id")
    .single()

  if (error) {
    console.error(`Error updating clearance status:`, error)
    throw new Error("Failed to update clearance status")
  }

  // Get organization name
  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("name")
    .eq("id", data.organization_id)
    .single()

  if (!orgError && organization) {
    // Create notification for the student
    await supabase.from("notifications").insert({
      user_id: data.user_id,
      title: `Clearance ${status === "approved" ? "Approved" : "Rejected"}`,
      message: `Your clearance for ${organization.name} has been ${status === "approved" ? "approved" : "rejected"}.`,
      type: "clearance",
      related_id: data.organization_id,
    })
  }

  revalidatePath("/dashboard/clearance")
}
