"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserRole } from "@/lib/types"
import { Calendar, Filter, Plus, Search } from "lucide-react"
import { EventCard } from "@/components/event-card"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import Link from "next/link"

export default function EventsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return

      const supabase = getSupabaseBrowserClient()

      try {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0]

        let query = supabase.from("events").select(`
            *,
            organizations (id, name, type)
          `)

        // Filter based on active tab
        if (activeTab === "upcoming") {
          query = query.gte("date", today)
        } else if (activeTab === "past") {
          query = query.lt("date", today)
        } else if (activeTab === "my-events" && user.role !== UserRole.STUDENT) {
          // For admins, show events they created
          query = query.eq("organization_id", user.id) // This assumes the user is associated with an organization
        } else if (activeTab === "assigned" && user.role === UserRole.OFFICER) {
          // For officers, show events they're assigned to
          const { data: officerEvents } = await supabase
            .from("event_officers")
            .select("event_id")
            .eq("user_id", user.id)

          if (officerEvents && officerEvents.length > 0) {
            const eventIds = officerEvents.map((e) => e.event_id)
            query = query.in("id", eventIds)
          } else {
            // No assigned events
            setEvents([])
            setLoading(false)
            return
          }
        }

        // Apply search filter if provided
        if (searchQuery) {
          query = query.ilike("title", `%${searchQuery}%`)
        }

        const { data, error } = await query.order("date", { ascending: true })

        if (error) {
          throw error
        }

        // Format the events for display
        const formattedEvents = data.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.date).toLocaleDateString(),
          time: `${event.start_time} - ${event.end_time}`,
          location: event.location,
          organizer: event.organizations?.name || "Unknown Organization",
          mandatory: event.mandatory,
          past: new Date(event.date) < new Date(today),
          isOrganizer:
            user.role === UserRole.SSG_ADMIN ||
            (user.role === UserRole.CLUB_ADMIN && event.organizations?.type === "club") ||
            (user.role === UserRole.DEPARTMENT_ADMIN && event.organizations?.type === "department"),
        }))

        setEvents(formattedEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [user, activeTab, searchQuery])

  if (!user) return null

  const canCreateEvents =
    user.role === UserRole.SSG_ADMIN || user.role === UserRole.CLUB_ADMIN || user.role === UserRole.DEPARTMENT_ADMIN

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Events</h2>
          <p className="text-muted-foreground">
            {canCreateEvents
              ? "Manage and create events for your organization"
              : "View and register for upcoming events"}
          </p>
        </div>
        {canCreateEvents && (
          <Link href="/dashboard/events/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          {canCreateEvents && <TabsTrigger value="my-events">My Events</TabsTrigger>}
          {user.role === UserRole.OFFICER && <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>}
        </TabsList>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Date</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">No events found</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                time={event.time}
                location={event.location}
                organizer={event.organizer}
                mandatory={event.mandatory}
                past={event.past}
                isOrganizer={event.isOrganizer}
                isOfficer={user.role === UserRole.OFFICER}
              />
            ))}
          </div>
        )}
      </Tabs>
    </div>
  )
}
