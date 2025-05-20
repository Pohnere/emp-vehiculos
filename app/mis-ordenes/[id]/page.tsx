"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  CreditCard,
  Car,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react"

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Estado para el diálogo de cancelación
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancellingOrder, setCancellingOrder] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)

        // Obtener token del localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          router.push(`/login?redirect=/mis-ordenes/${orderId}`)
          return
        }

        // Cargar datos de la orden
        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("No se pudo cargar la orden")
        }

        const orderData = await response.json()
        setOrder(orderData)
      } catch (error) {
        console.error("Error al cargar la orden:", error)
        setError("No se pudo cargar la orden. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, router])

  // Función para cancelar la orden
  const handleCancelOrder = async () => {
    try {
      setCancellingOrder(true)

      // Obtener token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        router.push(`/login?redirect=/mis-ordenes/${orderId}`)
        return
      }

      // Llamada a la API para cancelar la orden
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "cancelado",
        }),
      })

      if (!response.ok) {
        throw new Error("No se pudo cancelar la orden")
      }

      // Actualizar orden localmente
      setOrder((prev: any) => ({
        ...prev,
        status: "cancelado",
      }))

      // Cerrar diálogo
      setCancelDialogOpen(false)

      // Mostrar mensaje de éxito
      alert("La orden ha sido cancelada correctamente")
    } catch (error) {
      console.error("Error al cancelar la orden:", error)
      alert("Error al cancelar la orden. Por favor, inténtalo de nuevo más tarde.")
    } finally {
      setCancellingOrder(false)
    }
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando detalles de la orden...</p>
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

  // Función para obtener el icono según el estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendiente":
        return <Clock className="h-5 w-5" />
      case "en_proceso":
        return <Truck className="h-5 w-5" />
      case "entregado":
        return <CheckCircle className="h-5 w-5" />
      case "cancelado":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  if (!order) {
    return (
      <div className="container py-12">
        <div className="flex flex-col space-y-8">
          <div className="flex items-center gap-2">
            <Link href="/mis-ordenes">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver a mis órdenes
              </Button>
            </Link>
          </div>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Orden no encontrada</p>
              <p className="text-muted-foreground mb-6">
                La orden que estás buscando no existe o no tienes permisos para verla.
              </p>
              <Link href="/mis-ordenes">
                <Button>Ver mis órdenes</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/mis-ordenes">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a mis órdenes
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Orden #{order.id}</h1>
          <p className="text-muted-foreground">Realizada el {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Estado de la orden
                  <Badge variant="outline" className={`${getBadgeColor(order.status)} px-3 py-1 text-xs font-medium`}>
                    {formatStatus(order.status)}
                  </Badge>
                </CardTitle>
                <CardDescription>Seguimiento de tu pedido</CardDescription>
              </CardHeader>
              <CardContent>
                {order.status === "cancelado" ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <p className="text-lg font-medium mb-2">Orden cancelada</p>
                    <p className="text-muted-foreground">Esta orden ha sido cancelada y ya no se procesará.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />
                    <div className="space-y-8">
                      <div className="relative pl-12">
                        <div
                          className={`absolute left-0 p-2 rounded-full ${
                            ["pendiente", "en_proceso", "entregado"].includes(order.status)
                              ? "bg-green-100 text-green-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Orden recibida</p>
                          <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="relative pl-12">
                        <div
                          className={`absolute left-0 p-2 rounded-full ${
                            ["en_proceso", "entregado"].includes(order.status)
                              ? "bg-green-100 text-green-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Truck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">En proceso de envío</p>
                          <p className="text-sm text-muted-foreground">
                            {order.status === "en_proceso" || order.status === "entregado"
                              ? new Date(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleString()
                              : "Pendiente"}
                          </p>
                        </div>
                      </div>
                      <div className="relative pl-12">
                        <div
                          className={`absolute left-0 p-2 rounded-full ${
                            order.status === "entregado"
                              ? "bg-green-100 text-green-800"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Entregado</p>
                          <p className="text-sm text-muted-foreground">
                            {order.status === "entregado"
                              ? new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString()
                              : "Pendiente"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productos</CardTitle>
                <CardDescription>Detalle de los productos en tu orden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted h-16 w-16 rounded-md flex items-center justify-center">
                          <Car className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                          <p className="text-sm text-muted-foreground">
                            Precio unitario: ${item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">${order.subtotal?.toLocaleString() || order.total.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Envío</p>
                    <p className="font-medium">${order.shipping?.toLocaleString() || "0"}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Impuestos</p>
                    <p className="font-medium">${order.taxes?.toLocaleString() || "0"}</p>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <p className="font-medium">Total</p>
                    <p className="text-xl font-bold">${order.total.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de envío</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Fecha estimada de entrega</p>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "cancelado"
                          ? "N/A - Orden cancelada"
                          : new Date(
                              new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000,
                            ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de pago</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
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
              </CardContent>
            </Card>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                Descargar factura
              </Button>
              {(order.status === "pendiente" || order.status === "en_proceso") && (
                <Button variant="destructive" className="w-full" onClick={() => setCancelDialogOpen(true)}>
                  Cancelar orden
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmación para cancelar orden */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Orden</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta orden? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={cancellingOrder}>
              Volver
            </Button>
            <Button variant="destructive" onClick={handleCancelOrder} disabled={cancellingOrder}>
              {cancellingOrder ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelando...
                </>
              ) : (
                "Sí, cancelar orden"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
