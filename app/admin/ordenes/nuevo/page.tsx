"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Tipos
interface User {
  id: number
  name: string
  email: string
  username: string
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  stock: number
}

interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
  subtotal: number
}

// Funciones de validación
const validateQuantity = (quantity: string): boolean => {
  const quantityValue = Number.parseInt(quantity)
  return !isNaN(quantityValue) && quantityValue > 0 && quantityValue <= 100
}

export default function NuevaOrdenPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])

  const [formData, setFormData] = useState({
    userId: "",
    status: "pendiente",
    items: [] as OrderItem[],
    notes: "",
  })

  const [selectedProduct, setSelectedProduct] = useState("")
  const [quantity, setQuantity] = useState("1")

  // Cargar usuarios y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)

        // Obtener token del localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("No se encontró el token de autenticación")
        }

        // Cargar usuarios
        const usersResponse = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!usersResponse.ok) {
          throw new Error("Error al cargar usuarios")
        }

        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])

        // Cargar productos
        const productsResponse = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!productsResponse.ok) {
          throw new Error("Error al cargar productos")
        }

        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])
      } catch (error) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos necesarios. Intente nuevamente.",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error específico cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error específico cuando el usuario cambia un select
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(e.target.value)

    // Limpiar error de cantidad
    if (errors.quantity) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.quantity
        return newErrors
      })
    }
  }

  const handleProductChange = (value: string) => {
    setSelectedProduct(value)

    // Limpiar error de producto
    if (errors.selectedProduct) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.selectedProduct
        return newErrors
      })
    }
  }

  const addItem = () => {
    // Validar producto y cantidad
    const newErrors: { [key: string]: string } = {}

    if (!selectedProduct) {
      newErrors.selectedProduct = "Seleccione un producto"
    }

    if (!quantity || !validateQuantity(quantity)) {
      newErrors.quantity = "Ingrese una cantidad válida (1-100)"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }))
      return
    }

    // Buscar producto seleccionado
    const product = products.find((p) => p.id.toString() === selectedProduct)

    if (!product) {
      toast({
        title: "Error",
        description: "Producto no encontrado",
        variant: "destructive",
      })
      return
    }

    // Verificar si el producto ya está en la lista
    const existingItemIndex = formData.items.findIndex((item) => item.productId === product.id)

    if (existingItemIndex >= 0) {
      // Actualizar cantidad del producto existente
      const updatedItems = [...formData.items]
      const newQuantity = updatedItems[existingItemIndex].quantity + Number.parseInt(quantity)

      // Verificar stock
      if (newQuantity > product.stock) {
        toast({
          title: "Error",
          description: `No hay suficiente stock. Stock disponible: ${product.stock}`,
          variant: "destructive",
        })
        return
      }

      updatedItems[existingItemIndex].quantity = newQuantity
      updatedItems[existingItemIndex].subtotal = newQuantity * product.price

      setFormData((prev) => ({ ...prev, items: updatedItems }))
    } else {
      // Verificar stock
      if (Number.parseInt(quantity) > product.stock) {
        toast({
          title: "Error",
          description: `No hay suficiente stock. Stock disponible: ${product.stock}`,
          variant: "destructive",
        })
        return
      }

      // Agregar nuevo producto
      const newItem: OrderItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: Number.parseInt(quantity),
        subtotal: product.price * Number.parseInt(quantity),
      }

      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }))
    }

    // Limpiar selección
    setSelectedProduct("")
    setQuantity("1")
  }

  const removeItem = (index: number) => {
    const updatedItems = [...formData.items]
    updatedItems.splice(index, 1)
    setFormData((prev) => ({ ...prev, items: updatedItems }))
  }

  const calculateTotal = (): number => {
    return formData.items.reduce((total, item) => total + item.subtotal, 0)
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // Validar cliente
    if (!formData.userId) {
      newErrors.userId = "Seleccione un cliente"
    }

    // Validar items
    if (formData.items.length === 0) {
      newErrors.items = "Agregue al menos un producto a la orden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) {
      toast({
        title: "Error de validación",
        description: "Por favor, corrija los errores en el formulario.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Obtener token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      // Preparar datos para enviar
      const orderData = {
        userId: Number.parseInt(formData.userId),
        status: formData.status,
        items: formData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        total: calculateTotal(),
        notes: formData.notes,
      }

      // Enviar datos a la API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear la orden")
      }

      const data = await response.json()

      toast({
        title: "Orden creada",
        description: `La orden #${data.order.id} ha sido creada exitosamente.`,
      })

      // Redireccionar a la lista de órdenes
      router.push("/admin/ordenes")
    } catch (error: any) {
      console.error("Error al crear orden:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear la orden.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Mostrar estado de carga
  if (loadingData) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando datos...</p>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/admin/ordenes">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a órdenes
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Nueva Orden</h1>
          <p className="text-muted-foreground">Crea una nueva orden de compra</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
              <CardDescription>Selecciona el cliente para esta orden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">Cliente *</Label>
                <Select value={formData.userId} onValueChange={(value) => handleSelectChange("userId", value)}>
                  <SelectTrigger className={errors.userId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userId && <p className="text-sm text-red-500">{errors.userId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="procesando">Procesando</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
              <CardDescription>Agrega los productos a la orden</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="product">Producto</Label>
                  <Select value={selectedProduct} onValueChange={handleProductChange}>
                    <SelectTrigger className={errors.selectedProduct ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name} - ${product.price.toLocaleString()} (Stock: {product.stock})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.selectedProduct && <p className="text-sm text-red-500">{errors.selectedProduct}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad</Label>
                  <div className="flex gap-2">
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className={errors.quantity ? "border-red-500" : ""}
                    />
                    <Button type="button" onClick={addItem} className="shrink-0">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                  {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                </div>
              </div>

              {errors.items && <p className="text-sm text-red-500">{errors.items}</p>}

              {formData.items.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead className="text-right">Precio</TableHead>
                        <TableHead className="text-right">Cantidad</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">${item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.subtotal.toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              className="h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">${calculateTotal().toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="border rounded-md p-8 text-center text-muted-foreground">
                  No hay productos agregados a la orden
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Input
                  id="notes"
                  name="notes"
                  placeholder="Notas adicionales para esta orden..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/ordenes")} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Crear Orden
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
