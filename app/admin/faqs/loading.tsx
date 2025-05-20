import { Loader2 } from "lucide-react"

export default function AdminFAQsLoading() {
  return (
    <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg">Cargando gestión de FAQs...</p>
    </div>
  )
}
