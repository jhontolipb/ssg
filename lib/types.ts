// User Roles
export enum UserRole {
  SSG_ADMIN = "ssg_admin",
  CLUB_ADMIN = "club_admin",
  DEPARTMENT_ADMIN = "department_admin",
  OFFICER = "officer",
  STUDENT = "student",
}

// User Interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department: string | null
  studentId: string | null
  qrCode: string | null
  createdAt: string
}

// Organization Types
export enum OrganizationType {
  SSG = "ssg",
  DEPARTMENT = "department",
  CLUB = "club",
}

// Organization Interface
export interface Organization {
  id: string
  name: string
  type: OrganizationType
  department?: string
  adminIds: string[]
  memberIds: string[]
  createdAt: string
}

// Event Interface
export interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  organizationId: string
  officerIds: string[]
  mandatory: boolean
  sanction?: string
  createdAt: string
}

// Attendance Interface
export interface Attendance {
  id: string
  eventId: string
  studentId: string
  checkInTime: string | null
  checkOutTime: string | null
  status: "present" | "late" | "absent" | "excused"
  createdAt: string
}

// Clearance Status
export enum ClearanceStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Clearance Interface
export interface Clearance {
  id: string
  studentId: string
  organizationId: string
  status: ClearanceStatus
  remarks?: string
  transactionCode?: string
  createdAt: string
  updatedAt: string
}

// Message Interface
export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: string
}

// Notification Interface
export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "event" | "attendance" | "clearance" | "message" | "system"
  read: boolean
  relatedId?: string
  createdAt: string
}

// Student Points
export interface StudentPoints {
  id: string
  studentId: string
  points: number
  reason: string
  assignedBy: string
  createdAt: string
}
