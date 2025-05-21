"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { UserRole } from "@/lib/types"
import { getPendingClearances, updateClearanceStatus } from "@/app/actions/clearances"
import { useToast } from "@/components/ui/use-toast"

export function PendingClearances() {
  const { user } = useAuth()
  const [clearances, setClearances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPendingClearances = async () => {
      if (!user) return

      try {
        const data = await getPendingClearances()
        setClearances(data)
      } catch (error) {
        console.error("Error fetching pending clearances:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingClearances()
  }, [user])

  const handleApprove = async (clearanceId: string) => {
    try {
      await updateClearanceStatus(clearanceId, "approved")
      setClearances(clearances.filter((c) => c.id !== clearanceId))
      toast({
        title: "Clearance approved",
        description: "The clearance has been approved successfully.",
      })
    } catch (error) {
      console.error("Error approving clearance:", error)
      toast({
        title: "Error",
        description: "Failed to approve clearance. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (clearanceId: string) => {
    try {
      await updateClearanceStatus(clearanceId, "rejected", "Rejected by administrator")
      setClearances(clearances.filter((c) => c.id !== clearanceId))
      toast({
        title: "Clearance rejected",
        description: "The clearance has been rejected.",
      })
    } catch (error) {
      console.error("Error rejecting clearance:", error)
      toast({
        title: "Error",
        description: "Failed to reject clearance. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) return null

  const isAdmin =
    user.role === UserRole.SSG_ADMIN || user.role === UserRole.CLUB_ADMIN || user.role === UserRole.DEPARTMENT_ADMIN

  if (loading) {
    return <div className="text-center py-4">Loading clearances...</div>
  }

  if (clearances.length === 0) {
    return <div className="text-center py-4">No pending clearances</div>
  }

  return (
    <div className="space-y-4">
      {clearances.map((clearance) => (
        <div key={clearance.id} className="flex items-center justify-between pb-4 border-b last:border-0">
          <div>
            <p className="font-medium">{clearance.users.name}</p>
            <p className="text-sm text-muted-foreground">
              {clearance.users.student_id} - {clearance.users.department}
            </p>
            <p className="text-xs text-muted-foreground">
              Requested: {new Date(clearance.created_at).toLocaleDateString()}
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => handleReject(clearance.id)}>
                Reject
              </Button>
              <Button size="sm" onClick={() => handleApprove(clearance.id)}>
                Approve
              </Button>
            </div>
          )}
          {!isAdmin && <div className="text-sm text-yellow-500 font-medium">Pending</div>}
        </div>
      ))}
    </div>
  )
}
