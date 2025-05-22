"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getBrowserClient } from "@/utils/supabase"
import { useAuth } from "@/components/auth-provider"
import { Bell, Calendar, CheckCircle, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RecentNotificationsProps {
  className?: string
}

export function RecentNotifications({ className }: RecentNotificationsProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = getBrowserClient()

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        if (error) {
          console.error("Error fetching notifications:", error)
          return
        }

        setNotifications(data || [])
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Set up real-time subscription
    const channel = supabase
      .channel("notifications-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          setNotifications((current) => [payload.new, ...current].slice(0, 5))
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, user])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-blue-500" />
      case "attendance":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "clearance":
        return <CheckCircle className="h-4 w-4 text-yellow-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
        <CardDescription>Your latest updates and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No notifications yet</div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4">
                <div className="rounded-full bg-muted p-2">{getNotificationIcon(notification.type)}</div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
