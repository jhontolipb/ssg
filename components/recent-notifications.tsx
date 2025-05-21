"use client"

import { useEffect, useState } from "react"
import { Bell, Calendar, FileCheck, MessageSquare } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getNotifications } from "@/app/actions/notifications"

export function RecentNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return

      try {
        const data = await getNotifications(user.id)
        setNotifications(data)
      } catch (error) {
        console.error("Error fetching notifications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  const getIcon = (type: string) => {
    switch (type) {
      case "clearance":
        return <FileCheck className="h-4 w-4" />
      case "event":
        return <Calendar className="h-4 w-4" />
      case "message":
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading notifications...</div>
  }

  if (notifications.length === 0) {
    return <div className="text-center py-4">No notifications yet</div>
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
          <div className="mt-0.5 bg-muted p-2 rounded-full">{getIcon(notification.type)}</div>
          <div>
            <p className="font-medium">{notification.title}</p>
            <p className="text-sm text-muted-foreground">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-1">{formatTime(notification.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
