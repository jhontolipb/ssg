"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@/lib/types"
import { QrScanner } from "@/components/qr-scanner"
import { AttendanceList } from "@/components/attendance-list"
import { Camera, CheckCircle, Clock, Download, Search, Upload } from "lucide-react"

export default function AttendancePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("scan")
  const [scanMode, setScanMode] = useState<"in" | "out">("in")

  if (!user) return null

  // Only SSG Admin, Club Admin, Department Admin, and Officers can access this page
  if (
    user.role !== UserRole.SSG_ADMIN &&
    user.role !== UserRole.CLUB_ADMIN &&
    user.role !== UserRole.DEPARTMENT_ADMIN &&
    user.role !== UserRole.OFFICER
  ) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to access the attendance management page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance Management</h2>
          <p className="text-muted-foreground">Manage event attendance and view attendance records</p>
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
        </div>
      </div>

      <Tabs defaultValue="scan" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="scan">Scan QR Code</TabsTrigger>
          <TabsTrigger value="records">Attendance Records</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scan Student QR Code</CardTitle>
              <CardDescription>Use your device camera to scan student QR codes for attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="mb-4">
                    <Label htmlFor="event">Select Event</Label>
                    <Select defaultValue="1">
                      <SelectTrigger id="event">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">General Assembly (May 25, 2025)</SelectItem>
                        <SelectItem value="2">Campus Cleanup (May 28, 2025)</SelectItem>
                        <SelectItem value="3">Leadership Workshop (June 2, 2025)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={scanMode === "in" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setScanMode("in")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                    <Button
                      variant={scanMode === "out" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setScanMode("out")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Check Out
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="manual-id">Manual Entry</Label>
                    <div className="flex gap-2">
                      <Input id="manual-id" placeholder="Enter student ID" />
                      <Button variant="outline">
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full max-w-[300px] aspect-square bg-muted rounded-lg overflow-hidden">
                    <QrScanner scanMode={scanMode} />
                  </div>
                  <Button className="mt-4 gap-2">
                    <Camera className="h-4 w-4" />
                    Start Camera
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <h3 className="font-medium mb-2">Recent Scans</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <div>
                      <p className="font-medium">John Doe (2023-CS-001)</p>
                      <p className="text-xs text-muted-foreground">Computer Science</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Checked In: 2:15 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <div>
                      <p className="font-medium">Jane Smith (2023-BUS-042)</p>
                      <p className="text-xs text-muted-foreground">Business Administration</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-green-500">Checked In: 2:10 PM</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-background rounded">
                    <div>
                      <p className="font-medium">Michael Johnson (2023-ENG-103)</p>
                      <p className="text-xs text-muted-foreground">Engineering</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-red-500">Checked Out: 2:05 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>View and manage attendance records for events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="filter-event">Event</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="filter-event">
                        <SelectValue placeholder="All events" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="1">General Assembly (May 25, 2025)</SelectItem>
                        <SelectItem value="2">Campus Cleanup (May 28, 2025)</SelectItem>
                        <SelectItem value="3">Leadership Workshop (June 2, 2025)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="filter-status">Status</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="filter-status">
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="excused">Excused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="search">Search</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="search" type="search" placeholder="Search by name or ID..." className="pl-8" />
                    </div>
                  </div>
                </div>

                <AttendanceList />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Reports</CardTitle>
              <CardDescription>Generate and download attendance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="report-event">Event</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="report-event">
                        <SelectValue placeholder="All events" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="1">General Assembly (May 25, 2025)</SelectItem>
                        <SelectItem value="2">Campus Cleanup (May 28, 2025)</SelectItem>
                        <SelectItem value="3">Leadership Workshop (June 2, 2025)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="report-format">Format</Label>
                    <Select defaultValue="excel">
                      <SelectTrigger id="report-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Download className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">Recent Reports</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-background rounded">
                      <div>
                        <p className="font-medium">General Assembly Attendance</p>
                        <p className="text-xs text-muted-foreground">Generated on May 16, 2025</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-background rounded">
                      <div>
                        <p className="font-medium">Campus Cleanup Attendance</p>
                        <p className="text-xs text-muted-foreground">Generated on May 11, 2025</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-background rounded">
                      <div>
                        <p className="font-medium">Monthly Attendance Summary</p>
                        <p className="text-xs text-muted-foreground">Generated on May 1, 2025</p>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
