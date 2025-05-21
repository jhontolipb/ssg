"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { UserRole } from "@/lib/types"

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
    <div className="md:hidden flex items-center">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <SheetHeader>
            <SheetTitle>
              <div className="flex items-center gap-2 font-bold text-xl">
                <span className="text-primary">SSG</span> Digi
              </div>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-4 mt-8">
            {filteredItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary p-2 rounded-md",
                  pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 font-bold text-lg">
        <span className="text-primary">SSG</span> Digi
      </div>
    </div>
  )
}
