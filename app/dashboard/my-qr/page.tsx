"use client"

import { useAuth } from "@/components/auth-provider"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserRole } from "@/lib/types"
import { useEffect, useState } from "react"
import { QrCodeDisplay } from "@/components/qr-code-display"

export default function MyQRPage() {
  const { user } = useAuth()
  const [qrCode, setQrCode] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role === UserRole.STUDENT) {
      // In a real app, this would be fetched from the backend
      // For demo purposes, we'll generate a QR code using an external service
      const studentId = user.studentId || "2023-CS-001"
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${studentId}`
      setQrCode(qrUrl)
    }
  }, [user])

  if (user?.role !== UserRole.STUDENT) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only students can access their QR codes.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My QR Code</h2>
      </div>
      <div className="grid gap-4">
        <QrCodeDisplay qrCode={qrCode} user={user} />
      </div>
    </div>
  )
}
