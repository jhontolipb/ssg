"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { getClearancesByUserId, requestClearance } from "@/app/actions/clearances"
import { getOrganizations } from "@/app/actions/organizations"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Clock, Download, FileCheck, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ClearanceStatus() {
  const { user } = useAuth()
  const [clearances, setClearances] = useState<any[]>([])
  const [organizations, setOrganizations] = useState<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return

      try {
        const [clearancesData, orgsData] = await Promise.all([getClearancesByUserId(user.id), getOrganizations()])

        setClearances(clearancesData)

        // Filter out organizations that already have clearance requests
        const existingOrgIds = clearancesData.map((c) => c.organization_id)
        const availableOrgs = orgsData.filter((org) => !existingOrgIds.includes(org.id))
        setOrganizations(availableOrgs)
      } catch (error) {
        console.error("Error fetching clearance data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const handleRequestClearance = async () => {
    if (!user || !selectedOrg) return

    setRequesting(true)

    try {
      await requestClearance(user.id, selectedOrg)

      // Refresh clearances
      const clearancesData = await getClearancesByUserId(user.id)
      setClearances(clearancesData)

      // Update available organizations
      const existingOrgIds = clearancesData.map((c) => c.organization_id)
      const availableOrgs = organizations.filter((org) => !existingOrgIds.includes(org.id))
      setOrganizations(availableOrgs)

      setSelectedOrg("")

      toast({
        title: "Clearance Requested",
        description: "Your clearance request has been submitted successfully.",
      })
    } catch (error) {
      console.error("Error requesting clearance:", error)
      toast({
        title: "Error",
        description: "Failed to request clearance. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRequesting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved"
      case "pending":
        return "Pending"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-500"
      case "pending":
        return "text-yellow-500"
      case "rejected":
        return "text-red-500"
      default:
        return ""
    }
  }

  if (!user) return null

  if (loading) {
    return <div className="text-center py-4">Loading clearance status...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clearance Status</CardTitle>
        <CardDescription>Track your clearance requests and approvals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {clearances.length === 0 ? (
          <p className="text-center text-muted-foreground">No clearance requests yet</p>
        ) : (
          <div className="space-y-4">
            {clearances.map((clearance) => (
              <div key={clearance.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div className="flex items-center gap-2">
                  {getStatusIcon(clearance.status)}
                  <div>
                    <p className="font-medium">{clearance.organizations.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Requested: {new Date(clearance.created_at).toLocaleDateString()}
                    </p>
                    {clearance.remarks && <p className="text-xs text-muted-foreground">Remarks: {clearance.remarks}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${getStatusColor(clearance.status)}`}>
                    {getStatusText(clearance.status)}
                  </span>
                  {clearance.status === "approved" && clearance.transaction_code && (
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {organizations.length > 0 && (
          <div className="pt-4 border-t">
            <p className="font-medium mb-2">Request New Clearance</p>
            <div className="flex gap-2">
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleRequestClearance} disabled={!selectedOrg || requesting}>
                {requesting ? "Requesting..." : "Request"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          <span className="text-sm">
            {clearances.filter((c) => c.status === "approved").length} of {clearances.length} approved
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
