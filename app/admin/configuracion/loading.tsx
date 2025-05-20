import { Skeleton } from "@/components/ui/skeleton"

export default function ConfiguracionLoading() {
  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-10 w-[300px] mb-2" />
            <Skeleton className="h-4 w-[400px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-[400px]" />

          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
