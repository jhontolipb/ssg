"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export function RecentEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentEvents = async () => {
      const supabase = getSupabaseBrowserClient()

      try {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0]

        // Fetch recent events (events that have already occurred)
        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            organizations (name)
          `)
          .lt("date", today)
          .order("date", { ascending: false })
          .limit(3)

        if (error) {
          throw error
        }

        // For each event, fetch attendance statistics
        const eventsWithAttendance = await Promise.all(
          (data || []).map(async (event) => {
            const { data: attendanceData, error: attendanceError } = await supabase
              .from("attendance")
              .select("status")
              .eq("event_id", event.id)

            if (attendanceError) {
              console.error("Error fetching attendance:", attendanceError)
              return {
                ...event,
                attendance: {
                  present: 0,
                  absent: 0,
                  late: 0,
                },
              }
            }

            // Count attendance by status
            const present = attendanceData.filter((a) => a.status === "present").length
            const late = attendanceData.filter((a) => a.status === "late").length
            const absent = attendanceData.filter((a) => a.status === "absent").length

            return {
              ...event,
              attendance: {
                present,
                late,
                absent,
              },
            }
          }),
        )

        setEvents(eventsWithAttendance)
      } catch (error) {
        console.error("Error fetching recent events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentEvents()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading events...</div>
  }

  if (events.length === 0) {
    return <div className="text-center py-4">No recent events</div>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex items-center justify-between pb-4 border-b last:border-0">
          <div>
            <p className="font-medium">{event.title}</p>
            <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-500">{event.attendance.present} present</span>
            <span className="text-yellow-500">{event.attendance.late} late</span>
            <span className="text-red-500">{event.attendance.absent} absent</span>
          </div>
        </div>
      ))}
    </div>
  )
}
