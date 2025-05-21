"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { updateAttendanceStatus } from "@/app/actions/attendance"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AttendanceList({ eventId }: { eventId?: string }) {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { toast } = useToast()
  const pageSize = 5

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const supabase = getSupabaseBrowserClient()

      try {
        let query = supabase.from("attendance").select(
          `
            *,
            users (id, name, email, student_id, department),
            events (id, title, date)
          `,
          { count: "exact" },
        )

        // If eventId is provided, filter by that event
        if (eventId) {
          query = query.eq("event_id", eventId)
        }

        // Add pagination
        const from = page * pageSize
        const to = from + pageSize - 1

        const { data, count, error } = await query.order("created_at", { ascending: false }).range(from, to)

        if (error) {
          throw error
        }

        setAttendanceRecords(data || [])
        setTotalPages(Math.ceil((count || 0) / pageSize))
      } catch (error) {
        console.error("Error fetching attendance records:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendanceRecords()
  }, [eventId, page, pageSize])

  const handleStatusChange = async (attendanceId: string, status: "present" | "late" | "absent" | "excused") => {
    try {
      await updateAttendanceStatus(attendanceId, status)

      // Update the local state
      setAttendanceRecords(
        attendanceRecords.map((record) => (record.id === attendanceId ? { ...record, status } : record)),
      )

      toast({
        title: "Status updated",
        description: "Attendance status has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating attendance status:", error)
      toast({
        title: "Error",
        description: "Failed to update attendance status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "late":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "absent":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "excused":
        return <Clock className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "present":
        return "Present"
      case "late":
        return "Late"
      case "absent":
        return "Absent"
      case "excused":
        return "Excused"
      default:
        return status
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading attendance records...</div>
  }

  if (attendanceRecords.length === 0) {
    return <div className="text-center py-4">No attendance records found</div>
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-3 text-left text-sm font-medium">Student</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Event</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Check In</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Check Out</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{record.users?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.users?.student_id || "N/A"} - {record.users?.department || "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm">{record.events?.title || "Unknown Event"}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.events?.date ? new Date(record.events.date).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {record.check_in_time ? new Date(record.check_in_time).toLocaleTimeString() : "-"}
                </td>
                <td className="px-4 py-3 text-sm">
                  {record.check_out_time ? new Date(record.check_out_time).toLocaleTimeString() : "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(record.status)}
                    <span className="text-sm">{getStatusText(record.status)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleStatusChange(record.id, "present")}>
                        Present
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(record.id, "late")}>Late</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(record.id, "absent")}>
                        Absent
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(record.id, "excused")}>
                        Excused
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <p className="text-sm text-muted-foreground">
          Showing {attendanceRecords.length} of {totalPages * pageSize} records
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
