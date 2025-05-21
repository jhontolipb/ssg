"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import type { OrganizationType } from "@/lib/types"

export async function getOrganizations() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase.from("organizations").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching organizations:", error)
    throw new Error("Failed to fetch organizations")
  }

  return data
}

export async function getOrganizationById(id: string) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("organizations")
    .select(`
      *,
      organization_members (
        user_id,
        is_admin,
        users (id, name, email, role, department, student_id)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching organization with ID ${id}:`, error)
    throw new Error("Failed to fetch organization")
  }

  return data
}

export async function createOrganization(orgData: {
  name: string
  type: OrganizationType
  department?: string
}) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name: orgData.name,
      type: orgData.type,
      department: orgData.department,
    })
    .select()

  if (error) {
    console.error("Error creating organization:", error)
    throw new Error("Failed to create organization")
  }

  revalidatePath("/dashboard/organizations")
  return data[0]
}

export async function updateOrganization(
  id: string,
  orgData: {
    name?: string
    type?: OrganizationType
    department?: string
  },
) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("organizations")
    .update({
      name: orgData.name,
      type: orgData.type,
      department: orgData.department,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error(`Error updating organization:`, error)
    throw new Error("Failed to update organization")
  }

  revalidatePath("/dashboard/organizations")
}

export async function addMemberToOrganization(organizationId: string, userId: string, isAdmin = false) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase.from("organization_members").insert({
    organization_id: organizationId,
    user_id: userId,
    is_admin: isAdmin,
  })

  if (error) {
    console.error(`Error adding member to organization:`, error)
    throw new Error("Failed to add member to organization")
  }

  revalidatePath("/dashboard/organizations")
}

export async function removeMemberFromOrganization(organizationId: string, userId: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("organization_id", organizationId)
    .eq("user_id", userId)

  if (error) {
    console.error(`Error removing member from organization:`, error)
    throw new Error("Failed to remove member from organization")
  }

  revalidatePath("/dashboard/organizations")
}

export async function updateMemberAdminStatus(organizationId: string, userId: string, isAdmin: boolean) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from("organization_members")
    .update({ is_admin: isAdmin })
    .eq("organization_id", organizationId)
    .eq("user_id", userId)

  if (error) {
    console.error(`Error updating member admin status:`, error)
    throw new Error("Failed to update member admin status")
  }

  revalidatePath("/dashboard/organizations")
}
