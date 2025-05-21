"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRole } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, Loader2, MapPin } from "lucide-react"

export default function CreateEventPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    mandatory: false,
    sanction: "",
  })

  if (!user) return null

  // Only SSG Admin, Club Admin, and Department Admin can create events
  if (
    user.role !== UserRole.SSG_ADMIN &&
    user.role !== UserRole.CLUB_ADMIN &&
    user.role !== UserRole.DEPARTMENT_ADMIN
  ) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to create events.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, mandatory: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be a fetch to your API
      // For demo purposes, we'll simulate a successful event creation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Event created successfully",
        description: `Your event "${formData.title}" has been created.`,
      })
      router.push("/dashboard/events")
    } catch (error) {
      toast({
        title: "Failed to create event",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Event</h2>
          <p className="text-muted-foreground">Create a new event for your organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Basic information about the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter event description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    placeholder="Enter event location"
                    className="pl-8"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Date and Time</CardTitle>
              <CardDescription>When the event will take place</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    className="pl-8"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      className="pl-8"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      className="pl-8"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="mandatory">Mandatory Attendance</Label>
                    <p className="text-sm text-muted-foreground">Require all students to attend this event</p>
                  </div>
                  <Switch id="mandatory" checked={formData.mandatory} onCheckedChange={handleSwitchChange} />
                </div>
              </div>

              {formData.mandatory && (
                <div className="space-y-2">
                  <Label htmlFor="sanction">Sanction for Absence</Label>
                  <Select value={formData.sanction} onValueChange={(value) => handleSelectChange("sanction", value)}>
                    <SelectTrigger id="sanction">
                      <SelectValue placeholder="Select sanction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clearance-hold">Clearance Hold</SelectItem>
                      <SelectItem value="point-deduction">Point Deduction</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="none">No Sanction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
              <CardDescription>Additional configuration for the event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="registration">Registration Required</Label>
                  <Select defaultValue="required">
                    <SelectTrigger id="registration">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required">Required</SelectItem>
                      <SelectItem value="optional">Optional</SelectItem>
                      <SelectItem value="none">No Registration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visibility">Event Visibility</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="department">Department Only</SelectItem>
                      <SelectItem value="club">Club Members Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Maximum Capacity</Label>
                  <Input id="capacity" type="number" placeholder="Enter maximum capacity (optional)" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Attendance Points</Label>
                  <Input id="points" type="number" placeholder="Points awarded for attendance" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="officers">Assign Officers-in-Charge</Label>
                <Select>
                  <SelectTrigger id="officers">
                    <SelectValue placeholder="Select officers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="officer1">Michael Johnson</SelectItem>
                    <SelectItem value="officer2">Emily Davis</SelectItem>
                    <SelectItem value="officer3">Robert Wilson</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  You can assign more officers after creating the event.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2 flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
