import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, CheckCircle, FileCheck, QrCode, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl">
            <span className="text-primary">SSG</span> Digi
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Student Governance Digital Platform
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Streamline student records, event attendance, communication, and clearance processing with our
                  comprehensive digital platform.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto flex flex-col items-center space-y-4 lg:justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4">
                    <QrCode className="h-8 w-8 text-primary" />
                    <h3 className="text-center font-medium">QR Attendance</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Scan QR codes for quick and easy event attendance tracking
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4">
                    <Calendar className="h-8 w-8 text-primary" />
                    <h3 className="text-center font-medium">Event Management</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Create and manage events with detailed attendance tracking
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4">
                    <FileCheck className="h-8 w-8 text-primary" />
                    <h3 className="text-center font-medium">Digital Clearance</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Streamline the clearance process with digital approvals
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4">
                    <Users className="h-8 w-8 text-primary" />
                    <h3 className="text-center font-medium">Organization Management</h3>
                    <p className="text-center text-sm text-muted-foreground">
                      Manage student organizations and memberships
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools needed for efficient student governance and management.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="text-center font-medium">Real-time Attendance</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Track attendance in real-time with instant notifications and reports
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="text-center font-medium">Secure Authentication</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Role-based access control ensures data security and privacy
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg bg-background p-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="text-center font-medium">Comprehensive Dashboard</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Get insights with detailed analytics and reporting tools
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} SSG Digi. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
