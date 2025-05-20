import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Home, ShoppingBag } from "lucide-react"

export default function SuccessPage() {
  // Generar un número de orden aleatorio
  const orderNumber = Math.floor(100000 + Math.random() * 900000)

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">¡Compra exitosa!</CardTitle>
          <CardDescription>Tu orden ha sido procesada correctamente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Número de orden:</span>
                <span className="font-medium">#{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium text-green-500">Confirmada</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p>Hemos enviado un correo electrónico con los detalles de tu compra.</p>
            <p className="text-muted-foreground">
              Un representante se pondrá en contacto contigo en las próximas 24 horas para coordinar la entrega.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/perfil/pedidos" className="w-full">
            <Button className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Ver mis pedidos
            </Button>
          </Link>
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
