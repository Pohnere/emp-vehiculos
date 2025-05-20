"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ImagePlus, Loader2, Plus, Save, Trash2, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Funciones de validación
const validateName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 100
}

const validateDescription = (description: string): boolean => {
  return description.trim().length >= 20 && description.trim().length <= 2000
}

const validatePrice = (price: string): boolean => {
  const priceRegex = /^\d+(\.\d{1,2})?$/
  const priceValue = Number.parseFloat(price)
  return priceRegex.test(price) && priceValue > 0 && priceValue <= 1000000
}

const validateStock = (stock: string): boolean => {
  const stockValue = Number.parseInt(stock)
  return !isNaN(stockValue) && stockValue >= 0 && stockValue <= 1000
}

const validateImageUrl = (url: string): boolean => {
  return url.trim().length > 0
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState("informacion")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "10",
    category: "sedan",
    status: "activo",
    images: [""],
    specifications: {
      autonomy: "",
      maxSpeed: "",
      acceleration: "",
      power: "",
      charging: "",
      seats: "",
    },
    features: [""],
  })

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
  }

  const handleSpecificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }))

    // Limpiar error específico cuando el usuario comienza a escribir
    const errorKey = `specifications.${name}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images]
    newImages[index] = value
    setFormData((prev) => ({ ...prev, images: newImages }))

    // Limpiar error específico cuando el usuario comienza a escribir
    const errorKey = `images.${index}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addImage = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }))
  }

  const removeImage = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = [...formData.images]
      newImages.splice(index, 1)
      setFormData((prev) => ({ ...prev, images: newImages }))

      // Actualizar errores
      const newErrors = { ...errors }
      delete newErrors[`images.${index}`]

      // Reindexar errores de imágenes
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("images.")) {
          const imgIndex = Number.parseInt(key.split(".")[1])
          if (imgIndex > index) {
            const newKey = `images.${imgIndex - 1}`
            newErrors[newKey] = newErrors[key]
            delete newErrors[key]
          }
        }
      })

      setErrors(newErrors)
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: newFeatures }))

    // Limpiar error específico cuando el usuario comienza a escribir
    const errorKey = `features.${index}`
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = [...formData.features]
      newFeatures.splice(index, 1)
      setFormData((prev) => ({ ...prev, features: newFeatures }))

      // Actualizar errores
      const newErrors = { ...errors }
      delete newErrors[`features.${index}`]

      // Reindexar errores de características
      Object.keys(newErrors).forEach((key) => {
        if (key.startsWith("features.")) {
          const featureIndex = Number.parseInt(key.split(".")[1])
          if (featureIndex > index) {
            const newKey = `features.${featureIndex - 1}`
            newErrors[newKey] = newErrors[key]
            delete newErrors[key]
          }
        }
      })

      setErrors(newErrors)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // Validar información básica
    if (!formData.name) {
      newErrors.name = "El nombre del producto es obligatorio"
    } else if (!validateName(formData.name)) {
      newErrors.name = "El nombre debe tener entre 3 y 100 caracteres"
    }

    if (!formData.description) {
      newErrors.description = "La descripción es obligatoria"
    } else if (!validateDescription(formData.description)) {
      newErrors.description = "La descripción debe tener entre 20 y 2000 caracteres"
    }

    if (!formData.price) {
      newErrors.price = "El precio es obligatorio"
    } else if (!validatePrice(formData.price)) {
      newErrors.price = "Ingrese un precio válido (mayor a 0)"
    }

    if (!formData.stock) {
      newErrors.stock = "El stock es obligatorio"
    } else if (!validateStock(formData.stock)) {
      newErrors.stock = "Ingrese un valor de stock válido (0-1000)"
    }

    // Validar imágenes
    formData.images.forEach((image, index) => {
      if (!image) {
        newErrors[`images.${index}`] = "La URL de la imagen es obligatoria"
      } else if (!validateImageUrl(image)) {
        newErrors[`images.${index}`] = "Ingrese una URL válida"
      }
    })

    // Validar especificaciones
    const specs = formData.specifications
    if (!specs.autonomy) {
      newErrors["specifications.autonomy"] = "La autonomía es obligatoria"
    }

    if (!specs.maxSpeed) {
      newErrors["specifications.maxSpeed"] = "La velocidad máxima es obligatoria"
    }

    if (!specs.acceleration) {
      newErrors["specifications.acceleration"] = "La aceleración es obligatoria"
    }

    if (!specs.power) {
      newErrors["specifications.power"] = "La potencia es obligatoria"
    }

    if (!specs.charging) {
      newErrors["specifications.charging"] = "El tiempo de carga es obligatorio"
    }

    if (!specs.seats) {
      newErrors["specifications.seats"] = "El número de asientos es obligatorio"
    }

    // Validar características
    formData.features.forEach((feature, index) => {
      if (!feature) {
        newErrors[`features.${index}`] = "La característica es obligatoria"
      } else if (feature.trim().length < 3) {
        newErrors[`features.${index}`] = "La característica debe tener al menos 3 caracteres"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar formulario
    if (!validateForm()) {
      // Si hay errores, mostrar el tab con errores
      if (Object.keys(errors).some((key) => key.startsWith("specifications."))) {
        setActiveTab("especificaciones")
      } else if (Object.keys(errors).some((key) => key.startsWith("features."))) {
        setActiveTab("caracteristicas")
      } else if (Object.keys(errors).some((key) => key.startsWith("images."))) {
        setActiveTab("imagenes")
      } else {
        setActiveTab("informacion")
      }

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
      const productData = {
        name: formData.name,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        category: formData.category,
        status: formData.status,
        images: formData.images.filter((img) => img.trim() !== ""),
        specifications: formData.specifications,
        features: formData.features.filter((feature) => feature.trim() !== ""),
      }

      // Enviar datos a la API
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear el producto")
      }

      const data = await response.json()

      toast({
        title: "Producto creado",
        description: `El producto ${data.product.name} ha sido creado exitosamente.`,
      })

      // Redireccionar a la lista de productos
      router.push("/admin/productos")
    } catch (error: any) {
      console.error("Error al crear producto:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear el producto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/admin/productos">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a productos
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Nuevo Producto</h1>
          <p className="text-muted-foreground">Crea un nuevo vehículo en el catálogo</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="informacion">Información</TabsTrigger>
              <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
              <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
              <TabsTrigger value="caracteristicas">Características</TabsTrigger>
            </TabsList>

            {/* Tab: Información Básica */}
            <TabsContent value="informacion">
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Ingresa los datos básicos del vehículo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del vehículo *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Model E"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedan">Sedán</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="crossover">Crossover</SelectItem>
                          <SelectItem value="mini">Mini</SelectItem>
                          <SelectItem value="deportivo">Deportivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Descripción detallada del vehículo..."
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio (USD) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="35000"
                        value={formData.price}
                        onChange={handleChange}
                        className={errors.price ? "border-red-500" : ""}
                      />
                      {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="10"
                        value={formData.stock}
                        onChange={handleChange}
                        className={errors.stock ? "border-red-500" : ""}
                      />
                      {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado *</Label>
                      <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="inactivo">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Imágenes */}
            <TabsContent value="imagenes">
              <Card>
                <CardHeader>
                  <CardTitle>Imágenes del Vehículo</CardTitle>
                  <CardDescription>Agrega las imágenes del vehículo (URLs)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`image-${index}`}>URL de la imagen {index + 1} *</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`image-${index}`}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={image}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            className={errors[`images.${index}`] ? "border-red-500" : ""}
                          />
                          {formData.images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeImage(index)}
                              className="shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {errors[`images.${index}`] && (
                          <p className="text-sm text-red-500">{errors[`images.${index}`]}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full" onClick={addImage}>
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Agregar otra imagen
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Especificaciones */}
            <TabsContent value="especificaciones">
              <Card>
                <CardHeader>
                  <CardTitle>Especificaciones Técnicas</CardTitle>
                  <CardDescription>Ingresa las especificaciones técnicas del vehículo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="autonomy">Autonomía (km) *</Label>
                      <Input
                        id="autonomy"
                        name="autonomy"
                        placeholder="500"
                        value={formData.specifications.autonomy}
                        onChange={handleSpecificationChange}
                        className={errors["specifications.autonomy"] ? "border-red-500" : ""}
                      />
                      {errors["specifications.autonomy"] && (
                        <p className="text-sm text-red-500">{errors["specifications.autonomy"]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxSpeed">Velocidad máxima (km/h) *</Label>
                      <Input
                        id="maxSpeed"
                        name="maxSpeed"
                        placeholder="250"
                        value={formData.specifications.maxSpeed}
                        onChange={handleSpecificationChange}
                        className={errors["specifications.maxSpeed"] ? "border-red-500" : ""}
                      />
                      {errors["specifications.maxSpeed"] && (
                        <p className="text-sm text-red-500">{errors["specifications.maxSpeed"]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="acceleration">Aceleración 0-100 km/h (s) *</Label>
                      <Input
                        id="acceleration"
                        name="acceleration"
                        placeholder="3.5"
                        value={formData.specifications.acceleration}
                        onChange={handleSpecificationChange}
                        className={errors["specifications.acceleration"] ? "border-red-500" : ""}
                      />
                      {errors["specifications.acceleration"] && (
                        <p className="text-sm text-red-500">{errors["specifications.acceleration"]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="power">Potencia (kW) *</Label>
                      <Input
                        id="power"
                        name="power"
                        placeholder="300"
                        value={formData.specifications.power}
                        onChange={handleSpecificationChange}
                        className={errors["specifications.power"] ? "border-red-500" : ""}
                      />
                      {errors["specifications.power"] && (
                        <p className="text-sm text-red-500">{errors["specifications.power"]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="charging">Tiempo de carga (h) *</Label>
                      <Input
                        id="charging"
                        name="charging"
                        placeholder="1.5"
                        value={formData.specifications.charging}
                        onChange={handleSpecificationChange}
                        className={errors["specifications.charging"] ? "border-red-500" : ""}
                      />
                      {errors["specifications.charging"] && (
                        <p className="text-sm text-red-500">{errors["specifications.charging"]}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seats">Número de asientos *</Label>
                      <Input
                        id="seats"
                        name="seats"
                        placeholder="5"
                        value={formData.specifications.seats}
                        onChange={handleSpecificationChange}
                        className={errors["specifications.seats"] ? "border-red-500" : ""}
                      />
                      {errors["specifications.seats"] && (
                        <p className="text-sm text-red-500">{errors["specifications.seats"]}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Características */}
            <TabsContent value="caracteristicas">
              <Card>
                <CardHeader>
                  <CardTitle>Características</CardTitle>
                  <CardDescription>Agrega las características destacadas del vehículo</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor={`feature-${index}`}>Característica {index + 1} *</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`feature-${index}`}
                            placeholder="Piloto automático"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className={errors[`features.${index}`] ? "border-red-500" : ""}
                          />
                          {formData.features.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeFeature(index)}
                              className="shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {errors[`features.${index}`] && (
                          <p className="text-sm text-red-500">{errors[`features.${index}`]}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button type="button" variant="outline" className="w-full" onClick={addFeature}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar otra característica
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/productos")} disabled={loading}>
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
                  Guardar Producto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
