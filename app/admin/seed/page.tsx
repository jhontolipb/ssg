"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { seedDatabase } from "@/app/actions/seed"
import { useAuth } from "@/components/auth-provider"
import { UserRole } from "@/lib/types"
import { redirect } from "next/navigation"

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  // Only allow SSG_ADMIN to access this page
  if (user && user.role !== UserRole.SSG_ADMIN) {
    redirect("/dashboard")
  }

  const handleSeed = async () => {
    setIsLoading(true)

    try {
      const result = await seedDatabase()

      if (result.success) {
        toast({
          title: "Success",
          description: "Database seeded successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to seed database.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error seeding database:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Seed Database</CardTitle>
          <CardDescription className="text-center">
            This will populate the database with initial data for testing purposes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>This action will:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Create demo users (admin and student)</li>
              <li>Create organizations</li>
              <li>Create events</li>
              <li>Create clearance requests</li>
              <li>Create notifications and messages</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
            <p className="font-medium">Warning</p>
            <p>This is intended for development and testing only. Do not use in production.</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSeed} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Database...
              </>
            ) : (
              "Seed Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
