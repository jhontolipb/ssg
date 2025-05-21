"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRole } from "@/lib/types"
import { Calendar, CheckCircle, Clock, FileCheck, Users, XCircle } from "lucide-react"
import { DashboardCharts } from "@/components/dashboard-charts"
import { RecentEvents } from "@/components/recent-events"
import { UpcomingEvents } from "@/components/upcoming-events"
import { PendingClearances } from "@/components/pending-clearances"
import { RecentNotifications } from "@/components/recent-notifications"
import { getSupabaseBrowserClient, getSupabaseServerClient } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  const userRole = userData?.role || "student"

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeOrganizations: 0,
    upcomingEvents: 0,
    pendingClearances: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const supabaseClient = getSupabaseBrowserClient()

      try {
        // Fetch total students count
        const { count: studentsCount } = await supabaseClient
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "student")

        // Fetch organizations count
        const { count: orgsCount } = await supabaseClient
          .from("organizations")
          .select("*", { count: "exact", head: true })

        // Fetch upcoming events count
        const today = new Date().toISOString().split("T")[0]
        const { count: eventsCount } = await supabaseClient
          .from("events")
          .select("*", { count: "exact", head: true })
          .gte("date", today)

        // Fetch pending clearances count
        const { count: clearancesCount } = await supabaseClient
          .from("clearances")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending")

        setStats({
          totalStudents: studentsCount || 0,
          activeOrganizations: orgsCount || 0,
          upcomingEvents: eventsCount || 0,
          pendingClearances: clearancesCount || 0,
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
  }, [])

  // Different dashboard views based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case UserRole.SSG_ADMIN:
        return <AdminDashboard stats={stats} loading={loading} />
      case UserRole.CLUB_ADMIN:
      case UserRole.DEPARTMENT_ADMIN:
        return <OrgAdminDashboard stats={stats} loading={loading} />
      case UserRole.OFFICER:
        return <OfficerDashboard stats={stats} loading={loading} />
      case UserRole.STUDENT:
        return <StudentDashboard stats={stats} loading={loading} />
      default:
        return <StudentDashboard stats={stats} loading={loading} />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCharts />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="grid gap-4 md:grid-cols-2">
            {userRole === "student" ? (
              <>
                <UpcomingEvents />
                <RecentEvents />
              </>
            ) : (
              <>
                <RecentEvents />
                <PendingClearances />
              </>
            )}
          </div>
        </div>
        <div className="col-span-3">
          <RecentNotifications />
        </div>
      </div>
      {renderDashboard()}
    </div>
  )
}

function AdminDashboard({ stats, loading }: { stats: any; loading: boolean }) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">+12 since last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Organizations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.activeOrganizations}</div>
              <p className="text-xs text-muted-foreground">+2 new this semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Next: Campus Cleanup</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Clearances</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.pendingClearances}</div>
              <p className="text-xs text-muted-foreground">+18 in the last 24h</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Event Attendance Overview</CardTitle>
              <CardDescription>Attendance rates for recent events</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardCharts />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>Latest events and their attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentEvents />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events scheduled in the next 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingEvents />
            </CardContent>
          </Card>
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Pending Clearances</CardTitle>
              <CardDescription>Clearance requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              <PendingClearances />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="analytics" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Detailed analytics and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Analytics content will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reports" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Generate and view reports</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Reports content will be displayed here.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

function OrgAdminDashboard({ stats, loading }: { stats: any; loading: boolean }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+8 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next: General Assembly</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Clearances</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.pendingClearances}</div>
            <p className="text-xs text-muted-foreground">+5 in the last 24h</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Officers-in-Charge</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active for current events</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Member Attendance</CardTitle>
            <CardDescription>Attendance rates for recent events</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCharts />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvents />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Clearances</CardTitle>
            <CardDescription>Clearance requests awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <PendingClearances />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentNotifications />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function OfficerDashboard({ stats, loading }: { stats: any; loading: boolean }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: Campus Cleanup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Recorded</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86</div>
            <p className="text-xs text-muted-foreground">Last event: 42 students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Duty</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">May 25</div>
            <p className="text-xs text-muted-foreground">General Assembly at 2:00 PM</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events you are assigned to manage</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvents />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentNotifications />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StudentDashboard({ stats, loading }: { stats: any; loading: boolean }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Next: General Assembly</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Good</div>
            <p className="text-xs text-muted-foreground">Attended 8/10 events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clearance Status</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Pending</div>
            <p className="text-xs text-muted-foreground">2/3 organizations approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75</div>
            <p className="text-xs text-muted-foreground">+15 from last event</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Events scheduled in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvents />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Clearance Status</CardTitle>
            <CardDescription>Current clearance status by organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Computer Science Department</span>
                </div>
                <span className="text-sm text-green-500 font-medium">Approved</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Programming Club</span>
                </div>
                <span className="text-sm text-green-500 font-medium">Approved</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span>Supreme Student Government</span>
                </div>
                <span className="text-sm text-yellow-500 font-medium">Pending</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Sports Club</span>
                </div>
                <span className="text-sm text-red-500 font-medium">Rejected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest updates and notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentNotifications />
        </CardContent>
      </Card>
    </div>
  )
}
