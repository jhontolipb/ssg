"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Camera, CheckCircle, Clock } from "lucide-react"
import { recordAttendance } from "@/app/actions/attendance"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseBrowserClient } from "@/lib/supabase/supabaseBrowserClient"

interface QrScannerProps {
  scanMode: "in" | "out"
  eventId: string
}

export function QrScanner({ scanMode, eventId }: QrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null)
  const [recentScans, setRecentScans] = useState<
    Array<{
      studentId: string
      name: string
      department: string
      time: string
      type: "in" | "out"
    }>
  >([])

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setScanning(true)

        // In a real app, we would use a QR code scanning library here
        // For demo purposes, we'll simulate a successful scan after 3 seconds
        setTimeout(() => {
          handleSuccessfulScan("2023-CS-001")
        }, 3000)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access the camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setScanning(false)
    }
  }

  const handleSuccessfulScan = async (studentId: string) => {
    if (!user || !eventId) return

    // Prevent duplicate scans
    if (lastScannedCode === studentId) {
      return
    }

    setLastScannedCode(studentId)

    try {
      // Find the user by student ID
      const supabase = getSupabaseBrowserClient()
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, name, department")
        .eq("student_id", studentId)
        .single()

      if (userError || !userData) {
        toast({
          title: "Invalid QR Code",
          description: "Student not found. Please try again.",
          variant: "destructive",
        })
        return
      }

      // Record attendance
      await recordAttendance(eventId, userData.id, scanMode === "in" ? "check_in" : "check_out")

      // Add to recent scans
      const now = new Date().toLocaleTimeString()
      setRecentScans((prev) => [
        {
          studentId,
          name: userData.name,
          department: userData.department || "N/A",
          time: now,
          type: scanMode,
        },
        ...prev.slice(0, 4), // Keep only the 5 most recent scans
      ])

      toast({
        title: `${scanMode === "in" ? "Check In" : "Check Out"} Successful`,
        description: `${userData.name} (${studentId}) has been ${scanMode === "in" ? "checked in" : "checked out"}.`,
        variant: "default",
      })

      // Reset last scanned code after 5 seconds to allow rescanning
      setTimeout(() => {
        setLastScannedCode(null)
      }, 5000)
    } catch (error) {
      console.error("Error recording attendance:", error)
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-full bg-muted rounded-lg overflow-hidden">
        {scanning ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-primary/50 rounded-lg">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-primary rounded-lg"></div>
            </div>
            <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-md flex items-center gap-1">
              {scanMode === "in" ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Check In Mode
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" />
                  Check Out Mode
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Camera is not active</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={startScanner}>
              Start Camera
            </Button>
          </div>
        )}
      </div>

      {scanning && (
        <Button variant="outline" size="sm" className="mt-4" onClick={stopScanner}>
          Stop Camera
        </Button>
      )}

      {recentScans.length > 0 && (
        <div className="w-full mt-4">
          <h3 className="font-medium mb-2">Recent Scans</h3>
          <div className="space-y-2">
            {recentScans.map((scan, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                <div>
                  <p className="font-medium">
                    {scan.name} ({scan.studentId})
                  </p>
                  <p className="text-xs text-muted-foreground">{scan.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${scan.type === "in" ? "text-green-500" : "text-red-500"}`}>
                    {scan.type === "in" ? "Checked In" : "Checked Out"}: {scan.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
