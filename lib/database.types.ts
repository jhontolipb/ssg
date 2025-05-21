export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          password_hash: string | null
          role: "ssg_admin" | "club_admin" | "department_admin" | "officer" | "student"
          department: string | null
          student_id: string | null
          qr_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password_hash?: string | null
          role: "ssg_admin" | "club_admin" | "department_admin" | "officer" | "student"
          department?: string | null
          student_id?: string | null
          qr_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password_hash?: string | null
          role?: "ssg_admin" | "club_admin" | "department_admin" | "officer" | "student"
          department?: string | null
          student_id?: string | null
          qr_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          type: "ssg" | "department" | "club"
          department: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: "ssg" | "department" | "club"
          department?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: "ssg" | "department" | "club"
          department?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          is_admin?: boolean
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          start_time: string
          end_time: string
          location: string
          organization_id: string
          mandatory: boolean
          sanction: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          start_time: string
          end_time: string
          location: string
          organization_id: string
          mandatory?: boolean
          sanction?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          start_time?: string
          end_time?: string
          location?: string
          organization_id?: string
          mandatory?: boolean
          sanction?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_officers: {
        Row: {
          id: string
          event_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          event_id: string
          user_id: string
          check_in_time: string | null
          check_out_time: string | null
          status: "present" | "late" | "absent" | "excused"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id: string
          check_in_time?: string | null
          check_out_time?: string | null
          status?: "present" | "late" | "absent" | "excused"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string
          check_in_time?: string | null
          check_out_time?: string | null
          status?: "present" | "late" | "absent" | "excused"
          created_at?: string
          updated_at?: string
        }
      }
      clearances: {
        Row: {
          id: string
          user_id: string
          organization_id: string
          status: "pending" | "approved" | "rejected"
          remarks: string | null
          transaction_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          organization_id: string
          status?: "pending" | "approved" | "rejected"
          remarks?: string | null
          transaction_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          organization_id?: string
          status?: "pending" | "approved" | "rejected"
          remarks?: string | null
          transaction_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string | null
          receiver_id: string | null
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string | null
          receiver_id?: string | null
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "event" | "attendance" | "clearance" | "message" | "system"
          read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: "event" | "attendance" | "clearance" | "message" | "system"
          read?: boolean
          related_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: "event" | "attendance" | "clearance" | "message" | "system"
          read?: boolean
          related_id?: string | null
          created_at?: string
        }
      }
      student_points: {
        Row: {
          id: string
          user_id: string
          points: number
          reason: string
          assigned_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points: number
          reason: string
          assigned_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          reason?: string
          assigned_by?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "ssg_admin" | "club_admin" | "department_admin" | "officer" | "student"
      organization_type: "ssg" | "department" | "club"
      clearance_status: "pending" | "approved" | "rejected"
      attendance_status: "present" | "late" | "absent" | "excused"
      notification_type: "event" | "attendance" | "clearance" | "message" | "system"
    }
  }
}
