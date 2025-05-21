"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DashboardCharts() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-[300px] flex items-center justify-center">Loading charts...</div>
  }

  // Sample data for the chart
  const data = [
    {
      name: "General Assembly",
      present: 120,
      absent: 20,
      late: 15,
    },
    {
      name: "Campus Cleanup",
      present: 95,
      absent: 35,
      late: 25,
    },
    {
      name: "Leadership Workshop",
      present: 85,
      absent: 40,
      late: 30,
    },
    {
      name: "Career Fair",
      present: 110,
      absent: 25,
      late: 20,
    },
    {
      name: "Sports Fest",
      present: 130,
      absent: 15,
      late: 10,
    },
  ]

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} tickMargin={10} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill="#22c55e" name="Present" />
          <Bar dataKey="late" fill="#eab308" name="Late" />
          <Bar dataKey="absent" fill="#ef4444" name="Absent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
