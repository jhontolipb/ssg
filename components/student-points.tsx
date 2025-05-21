"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTotalStudentPoints, getStudentPoints } from "@/app/actions/points"
import { useAuth } from "@/components/auth-provider"

export function StudentPoints({ userId }: { userId?: string }) {
  const { user } = useAuth()
  const [points, setPoints] = useState<any[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  // Use the provided userId or fall back to the current user's id
  const targetUserId = userId || (user ? user.id : "")

  useEffect(() => {
    const fetchPoints = async () => {
      if (!targetUserId) return

      try {
        const [pointsData, total] = await Promise.all([
          getStudentPoints(targetUserId),
          getTotalStudentPoints(targetUserId),
        ])

        setPoints(pointsData)
        setTotalPoints(total)
      } catch (error) {
        console.error("Error fetching points:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPoints()
  }, [targetUserId])

  if (loading) {
    return <div className="text-center py-4">Loading points...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Points</CardTitle>
        <CardDescription>Points earned for participation and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">{totalPoints} points</p>
        </div>

        <div className="space-y-4">
          {points.length === 0 ? (
            <p className="text-center text-muted-foreground">No points earned yet</p>
          ) : (
            points.map((point) => (
              <div key={point.id} className="flex justify-between items-start pb-3 border-b last:border-0">
                <div>
                  <p className="font-medium">{point.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(point.created_at).toLocaleDateString()} • Awarded by{" "}
                    {point.assigned_by_user ? point.assigned_by_user.name : "System"}
                  </p>
                </div>
                <div className="text-sm font-medium">+{point.points}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
