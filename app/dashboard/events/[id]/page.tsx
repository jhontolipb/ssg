"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRole } from "@/lib/types"
import { Edit, QrCode, Users, Plus } from "lucide-react"
import { AttendanceList } from "@/components/attendance-list"
import { EventDetails } from "@/components/event-details"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const eventId = params.id

  if (!user) return null

  // Sample event data - in a real app, this would be fetched from the database
  const event = {
    id: eventId,
    title: "General Assembly",
    description:
      "Mandatory assembly for all students to discuss upcoming campus activities and initiatives. All students are required to attend and participate in the discussions.",
    date: "May 25, 2025",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    location: "Main Auditorium",
    organizer: "Supreme Student Government",
    organizerId: "1",
    mandatory: true,
    sanction: "Clearance hold",
    officerIds: ["officer-1", "officer-2"],
    createdAt: "May 10, 2025",
  }

  const isOrganizer =
    (user.role === UserRole.SSG_ADMIN && event.organizerId === "1") ||
    (user.role === UserRole.CLUB_ADMIN && event.organizerId === "5") ||
    (user.role === UserRole.DEPARTMENT_ADMIN && event.organizerId === "2")

  const isOfficer = user.role === UserRole.OFFICER && event.officerIds.includes("officer-1")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Event Details</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {isOrganizer && (
            <>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Event
              </Button>
              <Button className="gap-2">
                <Users className="h-4 w-4" />
                Manage Officers
              </Button>
            </>
          )}
          {isOfficer && (
            <Button className="gap-2">
              <QrCode className="h-4 w-4" />
              Scan Attendance
            </Button>
          )}
          {user.role === UserRole.STUDENT && <Button className="gap-2">Register for Event</Button>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <EventDetails eventId={eventId} />
          {(isOrganizer || isOfficer) && (
            <Card>
              <CardHeader>
                <CardTitle>Attendance Management</CardTitle>
                <CardDescription>Track and manage attendance for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="list">
                  <TabsList className="mb-4">
                    <TabsTrigger value="list">Attendance List</TabsTrigger>
                    <TabsTrigger value="stats">Statistics</TabsTrigger>
                  </TabsList>
                  <TabsContent value="list">
                    <AttendanceList />
                  </TabsContent>
                  <TabsContent value="stats">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">Present</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">75%</div>
                          <p className="text-xs text-muted-foreground">96 students</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">Late</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-600">15%</div>
                          <p className="text-xs text-muted-foreground">19 students</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="py-2">
                          <CardTitle className="text-sm font-medium">Absent</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">10%</div>
                          <p className="text-xs text-muted-foreground">13 students</p>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Status</CardTitle>
              <CardDescription>Current status and information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Upcoming</Badge>
              </div>
              <div>
                <h3 className="font-medium mb-2">Created</h3>
                <p className="text-sm text-muted-foreground">{event.createdAt}</p>
              </div>
              {isOrganizer && (
                <div>
                  <h3 className="font-medium mb-2">Officers-in-Charge</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Michael Johnson</span>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emily Davis</span>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Officer
                    </Button>
                  </div>
                </div>
              )}
              {user.role === UserRole.STUDENT && (
                <div>
                  <h3 className="font-medium mb-2">Your Status</h3>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                    Registered
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {isOrganizer && (
            <Card>
              <CardHeader>
                <CardTitle>Event Settings</CardTitle>
                <CardDescription>Configure event parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Registration Required</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Attendance Tracking</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Public Event</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                    Disabled
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
