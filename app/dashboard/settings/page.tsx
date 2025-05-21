"use client"

import { useAuth } from "@/components/auth-provider"
import { UserRole } from "@/lib/types"
import { useTheme } from "next-themes"
import { UserSettings } from "@/components/user-settings"

export default function SettingsPage() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  if (!user) return null

  const isAdmin =
    user.role === UserRole.SSG_ADMIN || user.role === UserRole.CLUB_ADMIN || user.role === UserRole.DEPARTMENT_ADMIN

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="grid gap-4 max-w-lg">
        <UserSettings />
      </div>
    </div>
  )
}
