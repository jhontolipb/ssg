"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { UserRole } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, School, User } from "lucide-react"
import { UserProfile } from "@/components/user-profile"
import { QrCodeDisplay } from "@/components/qr-code-display"
import { StudentPoints } from "@/components/student-points"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) return null

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.SSG_ADMIN:
        return "SSG Admin"
      case UserRole.CLUB_ADMIN:
        return "Club Admin"
      case UserRole.DEPARTMENT_ADMIN:
        return "Department Admin"
      case UserRole.OFFICER:
        return "Officer-in-Charge"
      case UserRole.STUDENT:
        return "Student"
      default:
        return "User"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">Manage your account information and settings</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your personal information and photo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={user.name} />
                <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="mt-4">
                Change Photo
              </Button>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user.studentId || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium mb-2">Role</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/10">
                {getRoleLabel(user.role)}
              </Badge>
              {user.department && (
                <div className="mt-2">
                  <h3 className="font-medium mb-1">Department</h3>
                  <span className="text-sm">{user.department}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" defaultValue={user.studentId || ""} disabled={user.role !== UserRole.STUDENT} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue={user.department || ""} disabled={user.role !== UserRole.STUDENT} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Enter your phone number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" type="tel" placeholder="Enter emergency contact" />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tell us about yourself"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-medium">Change Password</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
              </div>
              <Button variant="outline" className="mt-2">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <UserProfile />
          <StudentPoints />
        </div>
        <QrCodeDisplay />
      </div>
    </div>
  )
}
