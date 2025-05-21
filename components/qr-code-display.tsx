"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { generateQrCode } from "@/app/actions/users"
import { useToast } from "@/components/ui/use-toast"
import { Download, RefreshCw } from "lucide-react"

export function QrCodeDisplay() {
  const { user } = useAuth()
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user && user.qrCode) {
      setQrCode(user.qrCode)
    }
  }, [user])

  const handleGenerateQrCode = async () => {
    if (!user) return

    setLoading(true)

    try {
      const newQrCode = await generateQrCode(user.id)
      setQrCode(newQrCode)
      toast({
        title: "QR Code Generated",
        description: "Your QR code has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!qrCode) return

    const link = document.createElement("a")
    link.href = qrCode
    link.download = `qr-code-${user?.studentId || "student"}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!user) return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Your QR Code</CardTitle>
        <CardDescription>Use this QR code for event attendance</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {qrCode ? (
          <div className="border p-4 rounded-lg bg-white">
            <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="w-64 h-64" />
          </div>
        ) : (
          <div className="border p-4 rounded-lg bg-muted w-64 h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No QR code generated yet</p>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.studentId || "No Student ID"}</p>
          <p className="text-sm text-muted-foreground">{user.department || "No Department"}</p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-center">
        <Button variant="outline" onClick={handleGenerateQrCode} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>
        {qrCode && (
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
