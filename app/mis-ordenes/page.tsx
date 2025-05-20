"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, ShoppingBag, Car, ArrowRight, Calendar, MapPin, CreditCard } from "lucide-react"

export default function MisOrdenesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Obtener token del localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login?redirect=/mis-ordenes")
          return
        }

        // Obtener datos del usuario
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Cargar órdenes del usuario
          const response = await fetch(`/api/orders?userId=${userData.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("No se pudieron cargar las órdenes")
          }

          const ordersData = await response.json()
          setOrders(ordersData)
        } else {
          router.push("/login?redirect=/mis-ordenes")
        }
      } catch (error) {
        console.error("Error al cargar órdenes:", error)
        setError("No se pudieron cargar las órdenes. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando órdenes...</p>
      </div>
    )
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  // Función para obtener el color de la insignia según el estado
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "en_proceso":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "entregado":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "cancelado":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Función para formatear el estado
  const formatStatus = (status: string) => {
    switch (status) {
      case "pendiente":
        return "Pendiente"
      case "en_proceso":
        return "En proceso"
      case "entregado":
        return "Entregado"
      case "cancelado":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Mis Órdenes</h1>
          <p className="text-muted-foreground">Gestiona y revisa el estado de tus compras</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="processing">En proceso</TabsTrigger>
            <TabsTrigger value="delivered">Entregadas</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No tienes órdenes</p>
                  <p className="text-muted-foreground mb-6">Explora nuestro catálogo y realiza tu primera compra.</p>
                  <Link href="/catalogo">
                    <Button>Ver catálogo</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {orders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle className="text-xl">Orden #{order.id}</CardTitle>
                          <CardDescription>
                            Realizada el {new Date(order.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getBadgeColor(order.status)} px-3 py-1 text-xs font-medium`}
                        >
                          {formatStatus(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Fecha estimada de entrega</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Dirección de entrega</p>
                              <p className="text-sm text-muted-foreground">
                                {order.shippingAddress || "Av. Principal 123, Ciudad"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="font-medium">Método de pago</p>
                              <p className="text-sm text-muted-foreground">
                                {order.paymentMethod || "Tarjeta terminada en 4242"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="font-medium mb-3">Productos</p>
                          <div className="space-y-3">
                            {order.items?.map((item: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="bg-muted h-12 w-12 rounded-md flex items-center justify-center">
                                    <Car className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-medium">${item.price.toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t pt-4">
                          <div>
                            <p className="font-medium">Total</p>
                            <p className="text-2xl font-bold">${order.total.toLocaleString()}</p>
                          </div>
                          <Link href={`/mis-ordenes/${order.id}`}>
                            <Button className="w-full md:w-auto flex items-center gap-2">
                              Ver detalles
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            {orders.filter((order) => order.status === "pendiente").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No tienes órdenes pendientes</p>
                  <Link href="/catalogo">
                    <Button>Ver catálogo</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {orders
                  .filter((order) => order.status === "pendiente")
                  .map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      {/* Contenido similar al de "all" pero filtrado por estado */}
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="processing" className="mt-6">
            {orders.filter((order) => order.status === "en_proceso").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No tienes órdenes en proceso</p>
                  <Link href="/catalogo">
                    <Button>Ver catálogo</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {orders
                  .filter((order) => order.status === "en_proceso")
                  .map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      {/* Contenido similar al de "all" pero filtrado por estado */}
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivered" className="mt-6">
            {orders.filter((order) => order.status === "entregado").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">No tienes órdenes entregadas</p>
                  <Link href="/catalogo">
                    <Button>Ver catálogo</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {orders
                  .filter((order) => order.status === "entregado")
                  .map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      {/* Contenido similar al de "all" pero filtrado por estado */}
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
