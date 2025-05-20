import { Skeleton } from "@/components/ui/skeleton"

export default function FinalizarCompraLoading() {
  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-64" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
