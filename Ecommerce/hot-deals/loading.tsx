import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function HotDealsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4 bg-red-400" />
          <Skeleton className="h-6 w-64 mx-auto bg-red-400" />
        </div>
      </div>

      {/* Deals Grid Skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-2 border-red-200">
              <CardContent className="p-4">
                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-16 w-full mb-4" />
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
