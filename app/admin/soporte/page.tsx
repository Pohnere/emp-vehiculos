"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search, MessageSquare, AlertCircle } from "lucide-react"

export default function AdminSupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<any[]>([])
  const [filteredTickets, setFilteredTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [sendingResponse, setSendingResponse] = useState(false)

  // Obtener tickets de soporte
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login?redirect=/admin/soporte")
          return
        }

        const response = await fetch("/api/support", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar los tickets de soporte")
        }

        const data = await response.json()
        setTickets(data)
        setFilteredTickets(data)
      } catch (error) {
        console.error("Error:", error)
        setError("No se pudieron cargar los tickets de soporte")
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [router])

  // Filtrar tickets
  useEffect(() => {
    let result = [...tickets]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (ticket) =>
          ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por estado
    if (statusFilter !== "all") {
      result = result.filter((ticket) => ticket.status === statusFilter)
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      result = result.filter((ticket) => ticket.category === categoryFilter)
    }

    setFilteredTickets(result)
  }, [tickets, searchTerm, statusFilter, categoryFilter])

  // Actualizar estado del ticket
  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      setUpdatingStatus(true)

      const token = localStorage.getItem("token")
      const response = await fetch(`/api/support/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el estado del ticket")
      }

      const data = await response.json()

      // Actualizar tickets localmente
      setTickets((prevTickets) =>
        prevTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket)),
      )

      alert("Estado del ticket actualizado correctamente")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al actualizar el estado del ticket")
    } finally {
      setUpdatingStatus(false)
    }
  }

  // Enviar respuesta al ticket (simulado)
  const handleSendResponse = async () => {
    if (!responseMessage.trim() || !selectedTicket) return

    try {
      setSendingResponse(true)

      // En una implementación real, aquí enviarías la respuesta a través de una API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Actualizar ticket a respondido
      handleStatusChange(selectedTicket.id, "respondido")

      // Cerrar diálogo y resetear campos
      setDialogOpen(false)
      setResponseMessage("")
      setSelectedTicket(null)

      alert("Respuesta enviada correctamente")
    } catch (error) {
      console.error("Error:", error)
      alert("Error al enviar la respuesta")
    } finally {
      setSendingResponse(false)
    }
  }

  // Obtener color de badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "abierto":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "en_proceso":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "respondido":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "cerrado":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  // Formato legible para estado
  const formatStatus = (status: string) => {
    switch (status) {
      case "abierto":
        return "Abierto"
      case "en_proceso":
        return "En proceso"
      case "respondido":
        return "Respondido"
      case "cerrado":
        return "Cerrado"
      default:
        return status
    }
  }

  // Formato legible para categoría
  const formatCategory = (category: string) => {
    switch (category) {
      case "technical":
        return "Soporte técnico"
      case "sales":
        return "Ventas"
      case "warranty":
        return "Garantía"
      case "other":
        return "Otro"
      default:
        return category
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando tickets de soporte...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Soporte Técnico</h1>
          <p className="text-muted-foreground">Administra y responde a los tickets de soporte de los clientes</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por asunto, mensaje, nombre o email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="whitespace-nowrap">
                Estado:
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="w-[150px]">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="abierto">Abierto</SelectItem>
                  <SelectItem value="en_proceso">En proceso</SelectItem>
                  <SelectItem value="respondido">Respondido</SelectItem>
                  <SelectItem value="cerrado">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="category-filter" className="whitespace-nowrap">
                Categoría:
              </Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger id="category-filter" className="w-[150px]">
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="technical">Soporte técnico</SelectItem>
                  <SelectItem value="sales">Ventas</SelectItem>
                  <SelectItem value="warranty">Garantía</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tickets de soporte ({filteredTickets.length})</CardTitle>
            <CardDescription>
              {filteredTickets.length === 1 ? "1 ticket encontrado" : `${filteredTickets.length} tickets encontrados`}
              {statusFilter !== "all" && ` con estado "${formatStatus(statusFilter)}"`}
              {categoryFilter !== "all" && ` en la categoría "${formatCategory(categoryFilter)}"`}
              {searchTerm && ` que coinciden con "${searchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No hay tickets que coincidan con los filtros</p>
                <p className="text-muted-foreground">Intenta con otros criterios de búsqueda</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Asunto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{ticket.name}</TableCell>
                      <TableCell>{formatCategory(ticket.category)}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getStatusColor(ticket.status)}`}>
                          {formatStatus(ticket.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTicket(ticket)
                              setDialogOpen(true)
                            }}
                          >
                            Ver
                          </Button>
                          <Select
                            disabled={updatingStatus}
                            value={ticket.status}
                            onValueChange={(value) => handleStatusChange(ticket.id, value)}
                          >
                            <SelectTrigger className="w-[130px] h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="abierto">Abierto</SelectItem>
                              <SelectItem value="en_proceso">En proceso</SelectItem>
                              <SelectItem value="respondido">Respondido</SelectItem>
                              <SelectItem value="cerrado">Cerrado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Diálogo para ver ticket y responder */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ticket #{selectedTicket?.id}</DialogTitle>
            <DialogDescription>
              Creado el {selectedTicket && new Date(selectedTicket.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Cliente</h4>
                  <p>{selectedTicket.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Email</h4>
                  <p>{selectedTicket.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Categoría</h4>
                  <p>{formatCategory(selectedTicket.category)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Estado</h4>
                  <Badge variant="outline" className={`${getStatusColor(selectedTicket.status)}`}>
                    {formatStatus(selectedTicket.status)}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Asunto</h4>
                <p className="font-medium">{selectedTicket.subject}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Mensaje</h4>
                <div className="bg-muted p-4 rounded-md">
                  <p>{selectedTicket.message}</p>
                </div>
              </div>

              <div>
                <Label htmlFor="response">Respuesta</Label>
                <Textarea
                  id="response"
                  placeholder="Escribe aquí tu respuesta..."
                  className="mt-1"
                  rows={6}
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSendResponse} disabled={!responseMessage.trim() || sendingResponse}>
              {sendingResponse ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar respuesta"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
