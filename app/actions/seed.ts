"use server"

import { getSupabaseServerClient } from "@/lib/supabase"
import { UserRole } from "@/lib/types"

export async function seedDatabase() {
  const supabase = getSupabaseServerClient()

  try {
    // 1. Create Super Admin user
    const { data: superAdmin, error: superAdminError } = await supabase.auth.admin.createUser({
      email: "admin@ssgdigi.edu",
      password: "password",
      email_confirm: true,
      user_metadata: {
        name: "Super Admin",
        role: UserRole.SSG_ADMIN,
      },
    })

    if (superAdminError) {
      console.error("Error creating super admin:", superAdminError)
      throw superAdminError
    }

    // Add super admin to users table
    await supabase.from("users").insert({
      id: superAdmin.user.id,
      name: "Super Admin",
      email: "admin@ssgdigi.edu",
      role: UserRole.SSG_ADMIN,
      created_at: new Date().toISOString(),
    })

    // 2. Create Student user
    const { data: student, error: studentError } = await supabase.auth.admin.createUser({
      email: "student@example.com",
      password: "password",
      email_confirm: true,
      user_metadata: {
        name: "John Student",
        role: UserRole.STUDENT,
        department: "Computer Science",
        student_id: "2023-CS-001",
      },
    })

    if (studentError) {
      console.error("Error creating student:", studentError)
      throw studentError
    }

    // Add student to users table
    await supabase.from("users").insert({
      id: student.user.id,
      name: "John Student",
      email: "student@example.com",
      role: UserRole.STUDENT,
      department: "Computer Science",
      student_id: "2023-CS-001",
      qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=2023-CS-001",
      created_at: new Date().toISOString(),
    })

    // 3. Create Organizations
    const { data: organizations, error: orgError } = await supabase
      .from("organizations")
      .insert([
        {
          name: "Supreme Student Government",
          type: "ssg",
          created_at: new Date().toISOString(),
        },
        {
          name: "Computer Science Department",
          type: "department",
          department: "Computer Science",
          created_at: new Date().toISOString(),
        },
        {
          name: "Programming Club",
          type: "club",
          department: "Computer Science",
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (orgError) {
      console.error("Error creating organizations:", orgError)
      throw orgError
    }

    // 4. Add admin as member of SSG
    await supabase.from("organization_members").insert({
      organization_id: organizations[0].id,
      user_id: superAdmin.user.id,
      is_admin: true,
    })

    // 5. Add student as member of CS Department and Programming Club
    await supabase.from("organization_members").insert([
      {
        organization_id: organizations[1].id,
        user_id: student.user.id,
        is_admin: false,
      },
      {
        organization_id: organizations[2].id,
        user_id: student.user.id,
        is_admin: false,
      },
    ])

    // 6. Create Events
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    const { data: events, error: eventError } = await supabase
      .from("events")
      .insert([
        {
          title: "General Assembly",
          description: "Semestral general assembly for all students",
          date: tomorrow.toISOString().split("T")[0],
          start_time: "14:00:00",
          end_time: "16:00:00",
          location: "Main Auditorium",
          organization_id: organizations[0].id,
          mandatory: true,
          created_at: new Date().toISOString(),
        },
        {
          title: "Campus Cleanup",
          description: "Campus-wide cleanup drive",
          date: nextWeek.toISOString().split("T")[0],
          start_time: "09:00:00",
          end_time: "12:00:00",
          location: "Campus Grounds",
          organization_id: organizations[0].id,
          mandatory: true,
          created_at: new Date().toISOString(),
        },
        {
          title: "Programming Workshop",
          description: "Introduction to Web Development",
          date: nextWeek.toISOString().split("T")[0],
          start_time: "13:00:00",
          end_time: "17:00:00",
          location: "Computer Lab",
          organization_id: organizations[2].id,
          mandatory: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (eventError) {
      console.error("Error creating events:", eventError)
      throw eventError
    }

    // 7. Create Clearance Requests
    await supabase.from("clearances").insert([
      {
        user_id: student.user.id,
        organization_id: organizations[0].id,
        status: "pending",
        created_at: new Date().toISOString(),
      },
      {
        user_id: student.user.id,
        organization_id: organizations[1].id,
        status: "approved",
        transaction_code: "CS123456",
        created_at: new Date().toISOString(),
      },
      {
        user_id: student.user.id,
        organization_id: organizations[2].id,
        status: "approved",
        transaction_code: "PC789012",
        created_at: new Date().toISOString(),
      },
    ])

    // 8. Create Notifications
    await supabase.from("notifications").insert([
      {
        user_id: student.user.id,
        title: "Welcome to SSG Digi",
        message: "Welcome to the Student Governance Digital Platform!",
        type: "system",
        created_at: new Date().toISOString(),
      },
      {
        user_id: student.user.id,
        title: "Clearance Approved",
        message: "Your clearance for Computer Science Department has been approved.",
        type: "clearance",
        related_id: organizations[1].id,
        created_at: new Date().toISOString(),
      },
      {
        user_id: student.user.id,
        title: "New Event",
        message: "General Assembly scheduled for tomorrow.",
        type: "event",
        related_id: events[0].id,
        created_at: new Date().toISOString(),
      },
    ])

    // 9. Create Messages
    await supabase.from("messages").insert([
      {
        sender_id: superAdmin.user.id,
        receiver_id: student.user.id,
        content: "Welcome to SSG Digi! Let me know if you have any questions.",
        created_at: new Date().toISOString(),
      },
    ])

    // 10. Create Student Points
    await supabase.from("student_points").insert({
      user_id: student.user.id,
      points: 75,
      reason: "Active participation in campus activities",
      assigned_by: superAdmin.user.id,
      created_at: new Date().toISOString(),
    })

    return { success: true, message: "Database seeded successfully" }
  } catch (error) {
    console.error("Error seeding database:", error)
    return { success: false, message: "Failed to seed database", error }
  }
}
