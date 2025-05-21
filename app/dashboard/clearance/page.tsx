"use client"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { UserRole } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Download, FileCheck, Printer, XCircle } from "lucide-react"
import { PendingClearances } from "@/components/pending-clearances"
import { ClearanceStatus } from "@/components/clearance-status"

export default function ClearancePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user) return null

  const isAdmin =
    user.role === UserRole.SSG_ADMIN || user.role === UserRole.CLUB_ADMIN || user.role === UserRole.DEPARTMENT_ADMIN

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clearance</h2>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage and approve student clearance requests" : "Request and track your clearance status"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {isAdmin && <TabsTrigger value="pending">Pending Requests</TabsTrigger>}
          {isAdmin && <TabsTrigger value="approved">Approved</TabsTrigger>}
          {!isAdmin && <TabsTrigger value="request">Request Clearance</TabsTrigger>}
          {!isAdmin && <TabsTrigger value="history">History</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isAdmin ? <AdminClearanceOverview /> : <StudentClearanceOverview />}
        </TabsContent>

        {isAdmin && (
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Clearance Requests</CardTitle>
                <CardDescription>Review and approve student clearance requests</CardDescription>
              </CardHeader>
              <CardContent>
                <PendingClearances />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isAdmin && (
          <TabsContent value="approved" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Approved Clearances</CardTitle>
                <CardDescription>View previously approved clearance requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample approved clearances */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
                      <div>
                        <p className="font-medium">Student Name {i}</p>
                        <p className="text-sm text-muted-foreground">2023-DEPT-{i.toString().padStart(3, "0")}</p>
                        <p className="text-xs text-muted-foreground">Approved: May {10 + i}, 2025</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Approved
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <FileCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!isAdmin && (
          <TabsContent value="request" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Request Clearance</CardTitle>
                <CardDescription>Submit clearance requests to organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Computer Science Department</p>
                        <p className="text-sm text-muted-foreground">Departmental clearance</p>
                      </div>
                      <Button>Request</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Programming Club</p>
                        <p className="text-sm text-muted-foreground">Club clearance</p>
                      </div>
                      <Button>Request</Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Supreme Student Government</p>
                        <p className="text-sm text-muted-foreground">SSG clearance</p>
                      </div>
                      <Button disabled>Request</Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>Note: You can only request SSG clearance after all other clearances have been approved.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!isAdmin && (
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clearance History</CardTitle>
                <CardDescription>View your past clearance requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-medium">Computer Science Department</p>
                      <p className="text-xs text-muted-foreground">Requested: May 15, 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      Approved
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-medium">Programming Club</p>
                      <p className="text-xs text-muted-foreground">Requested: May 16, 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                      Approved
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div>
                      <p className="font-medium">Supreme Student Government</p>
                      <p className="text-xs text-muted-foreground">Requested: May 18, 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                      Pending
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sports Club</p>
                      <p className="text-xs text-muted-foreground">Requested: May 14, 2025</p>
                    </div>
                    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                      Rejected
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {!isAdmin && (
          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clearance Status</CardTitle>
                <CardDescription>Your current clearance status across organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <ClearanceStatus />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

function AdminClearanceOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <p className="text-xs text-muted-foreground">+18 in the last 24h</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-xs text-muted-foreground">+32 this week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">-5 from last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.2 days</div>
          <p className="text-xs text-muted-foreground">-0.3 days from last month</p>
        </CardContent>
      </Card>
    </div>
  )
}

function StudentClearanceOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clearance Status</CardTitle>
        <CardDescription>Your current clearance status across organizations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">Computer Science Department</p>
              <p className="text-xs text-muted-foreground">Departmental clearance</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                Approved
              </Badge>
              <p className="text-xs text-muted-foreground">May 17, 2025</p>
            </div>
          </div>
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">Programming Club</p>
              <p className="text-xs text-muted-foreground">Club clearance</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                Approved
              </Badge>
              <p className="text-xs text-muted-foreground">May 18, 2025</p>
            </div>
          </div>
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <p className="font-medium">Supreme Student Government</p>
              <p className="text-xs text-muted-foreground">SSG clearance</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">
                Pending
              </Badge>
              <p className="text-xs text-muted-foreground">Requested: May 19, 2025</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sports Club</p>
              <p className="text-xs text-muted-foreground">Club clearance</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                Rejected
              </Badge>
              <p className="text-xs text-muted-foreground">Reason: Missed mandatory events</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-medium">Unified Clearance Document</h3>
              <p className="text-sm text-muted-foreground">Available once all clearances are approved</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" disabled className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" disabled className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
