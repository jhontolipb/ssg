"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export function UpcomingEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const supabase = getSupabaseBrowserClient()

      try {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0]

        // Fetch upcoming events
        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            organizations (name)
          `)
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(3)

        if (error) {
          throw error
        }

        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching upcoming events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUpcomingEvents()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading events...</div>
  }

  if (events.length === 0) {
    return <div className="text-center py-4">No upcoming events</div>
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="flex flex-col gap-2 pb-4 border-b last:border-0">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{event.title}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(event.date).toLocaleDateString()}, {event.start_time} - {event.end_time}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{event.location}</span>
              </div>
            </div>
            {event.mandatory && (
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Mandatory</span>
            )}
          </div>
          <div className="flex justify-end">
            <Link href={`/dashboard/events/${event.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
