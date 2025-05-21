"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { UserRole } from "@/lib/types"

export function MainNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Base navigation items for all users
  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      allowedRoles: [
        UserRole.SSG_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.DEPARTMENT_ADMIN,
        UserRole.OFFICER,
        UserRole.STUDENT,
      ],
    },
    {
      title: "Events",
      href: "/dashboard/events",
      allowedRoles: [
        UserRole.SSG_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.DEPARTMENT_ADMIN,
        UserRole.OFFICER,
        UserRole.STUDENT,
      ],
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      allowedRoles: [
        UserRole.SSG_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.DEPARTMENT_ADMIN,
        UserRole.OFFICER,
        UserRole.STUDENT,
      ],
    },
    {
      title: "Clearance",
      href: "/dashboard/clearance",
      allowedRoles: [UserRole.SSG_ADMIN, UserRole.CLUB_ADMIN, UserRole.DEPARTMENT_ADMIN, UserRole.STUDENT],
    },
    {
      title: "Users",
      href: "/dashboard/users",
      allowedRoles: [UserRole.SSG_ADMIN, UserRole.DEPARTMENT_ADMIN],
    },
    {
      title: "Organizations",
      href: "/dashboard/organizations",
      allowedRoles: [UserRole.SSG_ADMIN],
    },
    {
      title: "Attendance",
      href: "/dashboard/attendance",
      allowedRoles: [UserRole.SSG_ADMIN, UserRole.CLUB_ADMIN, UserRole.DEPARTMENT_ADMIN, UserRole.OFFICER],
    },
  ]

  // Filter items based on user role
  const filteredItems = items.filter((item) => (user ? item.allowedRoles.includes(user.role) : false))

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {filteredItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
