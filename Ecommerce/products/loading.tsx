import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Skeleton */}
          <div className="w-64 space-y-6 hidden lg:block">
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="w-full h-48 rounded-md mb-3" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
