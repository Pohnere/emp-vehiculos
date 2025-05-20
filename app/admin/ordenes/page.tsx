"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Pencil, Plus, Search, Trash2, Package, Loader2, ArrowLeft, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function AdminOrdenesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para obtener el nombre del usuario - MOVIDA AQUÍ ARRIBA
  function getUserName(userId: string) {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : "Usuario desconocido"
  }

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (user.role !== "admin") {
          console.log("[ADMIN] Acceso denegado. Rol:", user.role)
          router.push("/no-autorizado?from=admin")
        }
      } catch (error) {
        console.error("[ADMIN] Error al verificar rol:", error)
        router.push("/login?redirect=/admin/ordenes")
      }
    }

    checkAuth()
  }, [router])

  // Cargar órdenes y usuarios desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Obtener token del localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No se encontró el token de autenticación")
        }

        // Cargar órdenes
        const ordersResponse = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!ordersResponse.ok) {
          throw new Error("No se pudieron cargar las órdenes")
        }

        const ordersData = await ordersResponse.json()
        setOrders(ordersData)

        // Cargar usuarios para mostrar nombres
        const usersResponse = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!usersResponse.ok) {
          throw new Error("No se pudieron cargar los usuarios")
        }

        const usersData = await usersResponse.json()
        setUsers(usersData)
      } catch (err: any) {
        console.error("Error al cargar datos:", err)
        setError(err.message || "Error al cargar los datos. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar órdenes según los criterios
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      getUserName(order.userId)?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "" || selectedStatus === "todos" || order.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  // Función para eliminar una orden
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta orden?")) {
      return
    }

    try {
      // Obtener token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      // Eliminar orden
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("No se pudo eliminar la orden")
      }

      // Actualizar lista de órdenes
      setOrders(orders.filter((order) => order.id !== orderId))
    } catch (err: any) {
      console.error("Error al eliminar orden:", err)
      alert(err.message || "Error al eliminar la orden. Por favor, intente de nuevo más tarde.")
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

  // Función para obtener el color de la insignia según el estado
  const getBadgeColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "en_proceso":
        return "bg-blue-100 text-blue-800"
      case "entregado":
        return "bg-green-100 text-green-800"
      case "cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al dashboard
            </Button>
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Órdenes</h1>
            <p className="text-muted-foreground">Administra las órdenes de compra de los clientes</p>
          </div>
          <Link href="/admin/ordenes/nuevo">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Orden
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Órdenes</CardTitle>
            <CardDescription>
              Total: {orders.length} órdenes ({filteredOrders.length} filtradas)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por ID o cliente..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_proceso">En proceso</SelectItem>
                    <SelectItem value="entregado">Entregado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Productos</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No se encontraron órdenes</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">#{order.id}</TableCell>
                        <TableCell>{getUserName(order.userId)}</TableCell>
                        <TableCell>
                          {order.items?.length || 0} {order.items?.length === 1 ? "producto" : "productos"}
                        </TableCell>
                        <TableCell>${order.total.toLocaleString()}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getBadgeColor(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/ordenes/${order.id}`} className="flex items-center cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalles
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/admin/ordenes/${order.id}/editar`}
                                  className="flex items-center cursor-pointer"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center text-red-600 cursor-pointer"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
