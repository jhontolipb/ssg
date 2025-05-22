"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBrowserClient } from "@/utils/supabase"
import { format } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"

interface UpcomingEventsProps {
  className?: string
}

export function UpcomingEvents({ className }: UpcomingEventsProps) {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserClient()

  useEffect(() => {
    async function fetchEvents() {
      try {
        const today = new Date().toISOString().split("T")[0]

        const { data, error } = await supabase
          .from("events")
          .select(`
            *,
            organizations (name, type)
          `)
          .gte("date", today)
          .order("date", { ascending: true })
          .limit(3)

        if (error) {
          console.error("Error fetching events:", error)
          return
        }

        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [supabase])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Events happening soon</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No upcoming events</div>
        ) : (
          <div className="space-y-6">
            {events.map((event) => (
              <Link href={`/dashboard/events/${event.id}`} key={event.id} className="block">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{event.title}</h3>
                    {event.mandatory && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Mandatory</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(`2000-01-01T${event.start_time}`), "h:mm a")} -{" "}
                        {format(new Date(`2000-01-01T${event.end_time}`), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Organized by: {event.organizations?.name || "Unknown"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
