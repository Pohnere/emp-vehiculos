"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Search, Plus, Pencil, Trash2, HelpCircle, AlertCircle } from "lucide-react"

export default function AdminFAQsPage() {
  const router = useRouter()
  const [faqs, setFaqs] = useState<any[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Estado para diálogo de edición
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"create" | "edit" | "delete">("create")
  const [selectedFaq, setSelectedFaq] = useState<any>(null)
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
    order: 0,
  })
  const [processing, setProcessing] = useState(false)

  // Obtener FAQs
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true)

        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login?redirect=/admin/faqs")
          return
        }

        const response = await fetch("/api/faq", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar las FAQs")
        }

        const data = await response.json()
        setFaqs(data)
        setFilteredFaqs(data)
      } catch (error) {
        console.error("Error:", error)
        setError("No se pudieron cargar las FAQs")
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [router])

  // Filtrar FAQs
  useEffect(() => {
    let result = [...faqs]

    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por categoría
    if (categoryFilter !== "all") {
      result = result.filter((faq) => faq.category === categoryFilter)
    }

    // Ordenar por el campo order
    result.sort((a, b) => (a.order || 0) - (b.order || 0))

    setFilteredFaqs(result)
  }, [faqs, searchTerm, categoryFilter])

  // Abrir diálogo para crear FAQ
  const handleCreate = () => {
    setFormData({
      question: "",
      answer: "",
      category: "general",
      order: faqs.length + 1,
    })
    setDialogType("create")
    setDialogOpen(true)
  }

  // Abrir diálogo para editar FAQ
  const handleEdit = (faq: any) => {
    setSelectedFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order || 0,
    })
    setDialogType("edit")
    setDialogOpen(true)
  }

  // Abrir diálogo para confirmar eliminación
  const handleDelete = (faq: any) => {
    setSelectedFaq(faq)
    setDialogType("delete")
    setDialogOpen(true)
  }

  // Manejar cambio en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? Number.parseInt(value) || 0 : value,
    }))
  }

  // Manejar cambio de categoría
  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }))
  }

  // Guardar FAQ (crear o editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)

    try {
      const token = localStorage.getItem("token")

      if (dialogType === "create") {
        // Crear nueva FAQ
        const response = await fetch("/api/faq", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Error al crear la FAQ")
        }

        const newFaq = await response.json()
        setFaqs((prev) => [...prev, newFaq.faq])
        alert("FAQ creada correctamente")
      } else if (dialogType === "edit" && selectedFaq) {
        // Editar FAQ existente
        const response = await fetch(`/api/faq/${selectedFaq.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Error al actualizar la FAQ")
        }

        const updatedFaq = await response.json()
        setFaqs((prev) => prev.map((faq) => (faq.id === selectedFaq.id ? updatedFaq.faq : faq)))
        alert("FAQ actualizada correctamente")
      }

      setDialogOpen(false)
    } catch (error) {
      console.error("Error:", error)
      alert("Error al procesar la FAQ")
    } finally {
      setProcessing(false)
    }
  }

  // Eliminar FAQ
  const handleConfirmDelete = async () => {
    if (!selectedFaq) return

    setProcessing(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/faq/${selectedFaq.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la FAQ")
      }

      // Eliminar localmente
      setFaqs((prev) => prev.filter((faq) => faq.id !== selectedFaq.id))
      alert("FAQ eliminada correctamente")
      setDialogOpen(false)
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar la FAQ")
    } finally {
      setProcessing(false)
    }
  }

  // Formatear categoría para mostrar
  const formatCategory = (category: string) => {
    switch (category) {
      case "general":
        return "General"
      case "vehiculos":
        return "Vehículos"
      case "carga":
        return "Carga y Autonomía"
      case "mantenimiento":
        return "Mantenimiento"
      case "compra":
        return "Compra y Financiación"
      default:
        return category
    }
  }

  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando preguntas frecuentes...</p>
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestión de FAQs</h1>
            <p className="text-muted-foreground">Administra las preguntas frecuentes de la plataforma</p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva FAQ
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por pregunta o respuesta..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="category-filter" className="whitespace-nowrap">
              Categoría:
            </Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger id="category-filter" className="w-[180px]">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="vehiculos">Vehículos</SelectItem>
                <SelectItem value="carga">Carga y Autonomía</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                <SelectItem value="compra">Compra y Financiación</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preguntas Frecuentes ({filteredFaqs.length})</CardTitle>
            <CardDescription>
              {filteredFaqs.length === 1 ? "1 pregunta encontrada" : `${filteredFaqs.length} preguntas encontradas`}
              {categoryFilter !== "all" && ` en la categoría "${formatCategory(categoryFilter)}"`}
              {searchTerm && ` que coinciden con "${searchTerm}"`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">No hay preguntas que coincidan con los filtros</p>
                <p className="text-muted-foreground">Intenta con otros criterios de búsqueda o crea una nueva FAQ</p>
                <Button onClick={handleCreate} className="mt-4">
                  Crear Nueva FAQ
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Orden</TableHead>
                    <TableHead>Pregunta</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaqs.map((faq) => (
                    <TableRow key={faq.id}>
                      <TableCell className="font-medium">{faq.order || "-"}</TableCell>
                      <TableCell className="max-w-md truncate">{faq.question}</TableCell>
                      <TableCell>{formatCategory(faq.category)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEdit(faq)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDelete(faq)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
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

      {/* Diálogo para crear/editar/eliminar FAQ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {dialogType === "delete" ? (
            <>
              <DialogHeader>
                <DialogTitle>Eliminar FAQ</DialogTitle>
                <DialogDescription>
                  ¿Estás seguro de que deseas eliminar esta pregunta frecuente? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>

              {selectedFaq && (
                <div className="py-4">
                  <p className="font-medium">{selectedFaq.question}</p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={processing}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete} disabled={processing}>
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>{dialogType === "create" ? "Crear nueva FAQ" : "Editar FAQ"}</DialogTitle>
                <DialogDescription>
                  {dialogType === "create"
                    ? "Complete el formulario para crear una nueva pregunta frecuente."
                    : "Modifique los campos para actualizar la pregunta frecuente."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="vehiculos">Vehículos</SelectItem>
                        <SelectItem value="carga">Carga y Autonomía</SelectItem>
                        <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                        <SelectItem value="compra">Compra y Financiación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="order">Orden de aparición</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Pregunta</Label>
                  <Input
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleChange}
                    placeholder="¿Cuál es la autonomía de los vehículos eléctricos?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="answer">Respuesta</Label>
                  <Textarea
                    id="answer"
                    name="answer"
                    rows={6}
                    value={formData.answer}
                    onChange={handleChange}
                    placeholder="La autonomía de nuestros vehículos varía según el modelo..."
                    required
                  />
                </div>

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setDialogOpen(false)} disabled={processing}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {dialogType === "create" ? "Creando..." : "Guardando..."}
                      </>
                    ) : dialogType === "create" ? (
                      "Crear FAQ"
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
