import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function EventLoading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-6 w-[200px]" />
            <Skeleton className="h-6 w-[200px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
