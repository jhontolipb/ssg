"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, MapPin, QrCode, Users } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { UserRole } from "@/lib/types"

interface EventCardProps {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: string
  mandatory: boolean
  past?: boolean
  isOrganizer?: boolean
  isOfficer?: boolean
}

export function EventCard({
  id,
  title,
  description,
  date,
  time,
  location,
  organizer,
  mandatory,
  past = false,
  isOrganizer = false,
  isOfficer = false,
}: EventCardProps) {
  const { user } = useAuth()

  // Determine if the current user is an organizer or officer for this event
  const checkIsOrganizer = () => {
    if (!user) return false

    if (isOrganizer) return true

    return (
      user.role === UserRole.SSG_ADMIN ||
      (user.role === UserRole.CLUB_ADMIN && organizer.includes("Club")) ||
      (user.role === UserRole.DEPARTMENT_ADMIN && organizer.includes(user.department || ""))
    )
  }

  const userIsOrganizer = checkIsOrganizer()
  const userIsOfficer = isOfficer || user?.role === UserRole.OFFICER

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          {mandatory && (
            <Badge variant="destructive" className="ml-2">
              Mandatory
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{organizer}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        {userIsOrganizer ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            <Button size="sm" className="gap-1">
              <Users className="h-3 w-3" />
              Manage
            </Button>
          </div>
        ) : userIsOfficer ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Users className="h-3 w-3" />
              View
            </Button>
            <Button size="sm" className="gap-1">
              <QrCode className="h-3 w-3" />
              Scan
            </Button>
          </div>
        ) : past ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href={`/dashboard/events/${id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
            <Button size="sm">Register</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
