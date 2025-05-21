"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { getEventById } from "@/app/actions/events"
import { getAttendanceByEventId } from "@/app/actions/attendance"
import { formatDate, formatTime } from "@/lib/utils/date"
import { AttendanceList } from "@/components/attendance-list"
import { QrScanner } from "@/components/qr-scanner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-provider"
import { UserRole } from "@/lib/types"

export function EventDetails({ eventId }: { eventId: string }) {
  const [event, setEvent] = useState<any>(null)
  const [attendanceStats, setAttendanceStats] = useState({
    total: 0,
    present: 0,
    late: 0,
    absent: 0,
    excused: 0,
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventData = await getEventById(eventId)
        setEvent(eventData)

        // Fetch attendance data
        const attendanceData = await getAttendanceByEventId(eventId)

        // Calculate attendance statistics
        const total = attendanceData.length
        const present = attendanceData.filter((a) => a.status === "present").length
        const late = attendanceData.filter((a) => a.status === "late").length
        const absent = attendanceData.filter((a) => a.status === "absent").length
        const excused = attendanceData.filter((a) => a.status === "excused").length

        setAttendanceStats({
          total,
          present,
          late,
          absent,
          excused,
        })
      } catch (error) {
        console.error("Error fetching event details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [eventId])

  if (loading) {
    return <div className="text-center py-4">Loading event details...</div>
  }

  if (!event) {
    return <div className="text-center py-4">Event not found</div>
  }

  const isAdmin =
    user?.role === UserRole.SSG_ADMIN || user?.role === UserRole.CLUB_ADMIN || user?.role === UserRole.DEPARTMENT_ADMIN

  const isOfficer = user?.role === UserRole.OFFICER

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription>{event.organizations?.name}</CardDescription>
            </div>
            {event.mandatory && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Mandatory</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{event.description}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span>{attendanceStats.total} attendees</span>
            </div>
          </div>

          {event.sanction && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
              <p className="font-medium">Sanction for Non-Attendance</p>
              <p>{event.sanction}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {(isAdmin || isOfficer) && (
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Attendance List</TabsTrigger>
            <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Statistics</CardTitle>
                <CardDescription>Overview of attendance for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-green-500">{attendanceStats.present}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Late</p>
                    <p className="text-2xl font-bold text-yellow-500">{attendanceStats.late}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-red-500">{attendanceStats.absent}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Excused</p>
                    <p className="text-2xl font-bold text-blue-500">{attendanceStats.excused}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <AttendanceList eventId={eventId} />
          </TabsContent>
          <TabsContent value="scanner">
            <Card>
              <CardHeader>
                <CardTitle>QR Scanner</CardTitle>
                <CardDescription>Scan student QR codes to record attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="in">
                  <TabsList className="mb-4">
                    <TabsTrigger value="in">Check In</TabsTrigger>
                    <TabsTrigger value="out">Check Out</TabsTrigger>
                  </TabsList>
                  <TabsContent value="in">
                    <QrScanner scanMode="in" eventId={eventId} />
                  </TabsContent>
                  <TabsContent value="out">
                    <QrScanner scanMode="out" eventId={eventId} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
