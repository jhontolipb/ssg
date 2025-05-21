"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserRole, OrganizationType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Edit, Filter, Plus, Search, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function OrganizationsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")

  if (!user) return null

  // Only SSG Admin can access this page
  if (user.role !== UserRole.SSG_ADMIN) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to access the organizations management page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">Manage departments, clubs, and student organizations</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Organization
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="clubs">Clubs</TabsTrigger>
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search organizations..." className="pl-8" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
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
                        <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Members</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Admins</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "1",
                          name: "Supreme Student Government",
                          type: OrganizationType.SSG,
                          members: 25,
                          admins: 5,
                        },
                        {
                          id: "2",
                          name: "Computer Science Department",
                          type: OrganizationType.DEPARTMENT,
                          members: 150,
                          admins: 3,
                        },
                        {
                          id: "3",
                          name: "Business Administration Department",
                          type: OrganizationType.DEPARTMENT,
                          members: 200,
                          admins: 4,
                        },
                        {
                          id: "4",
                          name: "Engineering Department",
                          type: OrganizationType.DEPARTMENT,
                          members: 180,
                          admins: 3,
                        },
                        {
                          id: "5",
                          name: "Programming Club",
                          type: OrganizationType.CLUB,
                          members: 45,
                          admins: 2,
                        },
                        {
                          id: "6",
                          name: "Environmental Club",
                          type: OrganizationType.CLUB,
                          members: 30,
                          admins: 2,
                        },
                        {
                          id: "7",
                          name: "Sports Club",
                          type: OrganizationType.CLUB,
                          members: 60,
                          admins: 3,
                        },
                      ].map((org) => (
                        <tr key={org.id} className="border-t">
                          <td className="px-4 py-3">
                            <div className="font-medium">{org.name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant="outline"
                              className={
                                org.type === OrganizationType.SSG
                                  ? "bg-purple-50 text-purple-700 hover:bg-purple-50"
                                  : org.type === OrganizationType.DEPARTMENT
                                    ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                                    : "bg-green-50 text-green-700 hover:bg-green-50"
                              }
                            >
                              {org.type === OrganizationType.SSG
                                ? "SSG"
                                : org.type === OrganizationType.DEPARTMENT
                                  ? "Department"
                                  : "Club"}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm">{org.members}</td>
                          <td className="px-4 py-3 text-sm">{org.admins}</td>
                          <td className="px-4 py-3 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Manage Members</DropdownMenuItem>
                                <DropdownMenuItem>Manage Admins</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Edit Organization</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "2",
                name: "Computer Science Department",
                members: 150,
                admins: 3,
              },
              {
                id: "3",
                name: "Business Administration Department",
                members: 200,
                admins: 4,
              },
              {
                id: "4",
                name: "Engineering Department",
                members: 180,
                admins: 3,
              },
              {
                id: "8",
                name: "Education Department",
                members: 120,
                admins: 2,
              },
              {
                id: "9",
                name: "Fine Arts Department",
                members: 90,
                admins: 2,
              },
              {
                id: "10",
                name: "Science Department",
                members: 110,
                admins: 3,
              },
            ].map((dept) => (
              <Card key={dept.id}>
                <CardHeader>
                  <CardTitle>{dept.name}</CardTitle>
                  <CardDescription>Departmental Organization</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Members:</span>
                      <span className="text-sm font-medium">{dept.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Admins:</span>
                      <span className="text-sm font-medium">{dept.admins}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Users className="h-3 w-3" />
                      Members
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "5",
                name: "Programming Club",
                members: 45,
                admins: 2,
              },
              {
                id: "6",
                name: "Environmental Club",
                members: 30,
                admins: 2,
              },
              {
                id: "7",
                name: "Sports Club",
                members: 60,
                admins: 3,
              },
              {
                id: "11",
                name: "Debate Club",
                members: 25,
                admins: 2,
              },
              {
                id: "12",
                name: "Music Club",
                members: 40,
                admins: 2,
              },
              {
                id: "13",
                name: "Photography Club",
                members: 35,
                admins: 2,
              },
            ].map((club) => (
              <Card key={club.id}>
                <CardHeader>
                  <CardTitle>{club.name}</CardTitle>
                  <CardDescription>Student Club</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Members:</span>
                      <span className="text-sm font-medium">{club.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Admins:</span>
                      <span className="text-sm font-medium">{club.admins}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Users className="h-3 w-3" />
                      Members
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
