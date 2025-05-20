"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ChevronLeft, CreditCard, Trash2 } from "lucide-react"

// Tipo para los elementos del carrito
interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isClient, setIsClient] = useState(false)

  // Efecto para cargar los elementos del carrito desde localStorage
  useEffect(() => {
    setIsClient(true)
    const storedItems = localStorage.getItem("cartItems")
    if (storedItems) {
      setCartItems(JSON.parse(storedItems))
    }
  }, [])

  // Calcular subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Impuestos (10%)
  const tax = subtotal * 0.1

  // Total
  const total = subtotal + tax

  // Eliminar un producto del carrito
  const removeItem = (id: number) => {
    const updatedItems = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedItems)
    localStorage.setItem("cartItems", JSON.stringify(updatedItems))
  }

  // Actualizar la cantidad de un producto
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedItems = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    setCartItems(updatedItems)
    localStorage.setItem("cartItems", JSON.stringify(updatedItems))
  }

  // Modificar la función handleCheckout para redirigir directamente al formulario
  const handleCheckout = () => {
    try {
      // Verificar si el usuario está autenticado
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

      if (!isLoggedIn) {
        // Redirigir a login si no está autenticado
        router.push("/login?redirect=carrito/orden/finalizar")
        return
      }

      // Redirigir directamente al formulario de finalización
      window.location.href = "/carrito/orden/finalizar"
    } catch (err) {
      console.error("[CARRITO] Error:", err)
      setError("Ha ocurrido un error al procesar la compra. Por favor, inténtelo de nuevo.")
    }
  }

  // Si estamos en el servidor, no mostramos nada inicialmente
  if (!isClient) {
    return null
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/catalogo">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Continuar comprando
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold">Carrito de compra</h1>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-muted-foreground">${item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de la orden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuestos (10%)</span>
                    <span>${tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toLocaleString()}</span>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleCheckout} disabled={loading}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {loading ? "Procesando..." : "Finalizar compra"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">Tu carrito está vacío</h3>
            <p className="text-muted-foreground mt-1">Parece que aún no has añadido ningún vehículo a tu carrito.</p>
            <Link href="/catalogo" className="mt-4">
              <Button>Explorar catálogo</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
