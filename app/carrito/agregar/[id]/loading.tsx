import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold mb-2">Añadiendo al carrito</h1>
        <p className="text-muted-foreground">Por favor, espere un momento...</p>
      </div>
    </div>
  )
}
