"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserRole } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Filter, Plus, Search, Upload, XCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function UsersPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")

  if (!user) return null

  // Only SSG Admin and Department Admin can access this page
  if (user.role !== UserRole.SSG_ADMIN && user.role !== UserRole.DEPARTMENT_ADMIN) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to access the user management page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const isSsgAdmin = user.role === UserRole.SSG_ADMIN

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            {isSsgAdmin ? "Manage all users across departments" : "Manage users in your department"}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="officers">Officers</TabsTrigger>
          {isSsgAdmin && <TabsTrigger value="admins">Admins</TabsTrigger>}
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search users..." className="pl-8" />
          </div>
          <div className="flex gap-2">
            {isSsgAdmin && (
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="business">Business Administration</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Department</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "1",
                          name: "John Doe",
                          studentId: "2023-CS-001",
                          department: "Computer Science",
                          role: UserRole.STUDENT,
                          status: "active",
                        },
                        {
                          id: "2",
                          name: "Jane Smith",
                          studentId: "2023-BUS-042",
                          department: "Business Administration",
                          role: UserRole.STUDENT,
                          status: "active",
                        },
                        {
                          id: "3",
                          name: "Michael Johnson",
                          studentId: "2023-ENG-103",
                          department: "Engineering",
                          role: UserRole.OFFICER,
                          status: "active",
                        },
                        {
                          id: "4",
                          name: "Emily Davis",
                          studentId: "2023-EDU-078",
                          department: "Education",
                          role: UserRole.STUDENT,
                          status: "inactive",
                        },
                        {
                          id: "5",
                          name: "Robert Wilson",
                          studentId: "2023-CS-056",
                          department: "Computer Science",
                          role: UserRole.DEPARTMENT_ADMIN,
                          status: "active",
                        },
                      ].map((user) => (
                        <tr key={user.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">{user.name}</div>
                          </td>
                          <td className="px-4 py-3 text-sm">{user.studentId}</td>
                          <td className="px-4 py-3 text-sm">{user.department}</td>
                          <td className="px-4 py-3 text-sm">
                            {user.role === UserRole.STUDENT
                              ? "Student"
                              : user.role === UserRole.OFFICER
                                ? "Officer"
                                : user.role === UserRole.DEPARTMENT_ADMIN
                                  ? "Department Admin"
                                  : user.role === UserRole.CLUB_ADMIN
                                    ? "Club Admin"
                                    : "SSG Admin"}
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={
                                user.status === "active"
                                  ? "bg-green-50 text-green-700 hover:bg-green-50"
                                  : "bg-red-50 text-red-700 hover:bg-red-50"
                              }
                            >
                              {user.status === "active" ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit User</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === "active" ? (
                                  <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-green-600">Activate</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">Showing 5 of 100 users</p>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Account Approvals</CardTitle>
              <CardDescription>Review and approve new user account requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="font-medium">New Student {i}</p>
                      <p className="text-sm text-muted-foreground">2023-DEPT-{(100 + i).toString()}</p>
                      <p className="text-xs text-muted-foreground">Requested: May {20 + i}, 2025</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="gap-1">
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button size="sm" className="gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
