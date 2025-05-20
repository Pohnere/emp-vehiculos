"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Battery, Car, ChevronLeft, Info, Settings, ShoppingCart, Star, Loader2 } from "lucide-react"
import { getProduct, getProducts } from "@/lib/api-client"

export default function VehicleDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const vehicleId = Number.parseInt(params.id)

  const [vehicle, setVehicle] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [relatedVehicles, setRelatedVehicles] = useState<any[]>([])

  // Cargar producto desde la API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)

        // Obtener el producto
        const data = await getProduct(vehicleId)
        console.log("[DETALLE PRODUCTO] Producto cargado:", data)

        // Asegurarse de que el producto tenga un array de imágenes
        const productWithImages = {
          ...data,
          // Si no hay imágenes o no es un array, crear un array con una imagen por defecto
          images:
            Array.isArray(data.images) && data.images.length > 0
              ? data.images
              : [data.image || "/futuristic-electric-vehicle.png"],
        }

        setVehicle(productWithImages)

        // Cargar productos relacionados
        try {
          const relatedData = await getProducts({ category: data.category })
          console.log("[DETALLE PRODUCTO] Productos relacionados:", relatedData)

          // Filtrar el producto actual de los relacionados y asegurarse de que tengan imágenes
          const filtered = relatedData
            .filter((p: any) => p.id !== vehicleId)
            .slice(0, 3)
            .map((p: any) => ({
              ...p,
              images:
                Array.isArray(p.images) && p.images.length > 0 ? p.images : [p.image || "/futuristic-electric-vehicle.png"],
            }))

          setRelatedVehicles(filtered)
        } catch (relatedErr) {
          console.error("[DETALLE PRODUCTO] Error al cargar productos relacionados:", relatedErr)
          setRelatedVehicles([])
        }
      } catch (err) {
        console.error("[DETALLE PRODUCTO] Error:", err)
        setError("No se pudo cargar la información del producto")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [vehicleId])

  const handleAddToCart = async () => {
    setAddingToCart(true)

    try {
      // En una implementación real, aquí iría la llamada a la API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Obtener el carrito actual del localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")

      // Verificar si el producto ya está en el carrito
      const existingItemIndex = cartItems.findIndex((item: any) => item.id === vehicleId)

      if (existingItemIndex >= 0) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        cartItems[existingItemIndex].quantity += 1
      } else {
        // Si no, añadir el producto al carrito
        cartItems.push({
          id: vehicle.id,
          name: vehicle.name,
          price: vehicle.price,
          image: vehicle.images[0] || "/placeholder.svg",
          quantity: 1,
        })
      }

      // Guardar el carrito actualizado en localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems))
      console.log("[CARRITO] Producto añadido:", vehicle.name)

      router.push("/carrito")
    } catch (err) {
      console.error("[CARRITO] Error al añadir al carrito:", err)
    } finally {
      setAddingToCart(false)
    }
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando información del producto...</p>
      </div>
    )
  }

  // Mostrar error si existe
  if (error || !vehicle) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Vehículo no encontrado</h1>
        <p className="text-muted-foreground mt-2">El vehículo que buscas no existe o no está disponible.</p>
        <Link href="/catalogo" className="mt-4">
          <Button>Volver al catálogo</Button>
        </Link>
      </div>
    )
  }

  // Asegurarse de que specs y features existan
  const specs = vehicle.specs || {}
  const features = vehicle.features || []

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/catalogo">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Volver al catálogo
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-lg border">
              <Image
                src={vehicle.images[selectedImage] || "/placeholder.svg?height=600&width=800&query=electric+vehicle"}
                alt={`${vehicle.name} - Imagen ${selectedImage + 1}`}
                fill
                className="object-cover"
              />
              {vehicle.badge && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary">{vehicle.badge}</Badge>
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {vehicle.images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-video cursor-pointer overflow-hidden rounded-md border ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg?height=600&width=800&query=electric+vehicle"}
                    alt={`${vehicle.name} - Miniatura ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Información del vehículo */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{vehicle.name}</h1>
              <p className="text-2xl font-semibold mt-2">${vehicle.price.toLocaleString()}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Battery className="h-5 w-5 text-muted-foreground" />
                <span>{vehicle.autonomy} km de autonomía</span>
              </div>
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-muted-foreground" />
                <span>Nivel autónomo {vehicle.autonomyLevel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>4.8/5 (120 reseñas)</span>
              </div>
            </div>

            <p className="text-muted-foreground">{vehicle.description}</p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" onClick={handleAddToCart} disabled={addingToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {addingToCart ? "Agregando..." : "Agregar al carrito"}
              </Button>
              <Link href="/contacto" className="flex-1">
                <Button variant="outline" className="w-full">
                  Agendar prueba de manejo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Pestañas de información adicional */}
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="specs" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Especificaciones
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Características
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Información adicional
            </TabsTrigger>
          </TabsList>
          <TabsContent value="specs">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <Card>
              <CardContent className="p-6">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="info">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Garantía</h3>
                    <p className="text-muted-foreground">5 años o 100,000 km, lo que ocurra primero.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Mantenimiento</h3>
                    <p className="text-muted-foreground">Primer servicio gratuito a los 10,000 km.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Financiamiento</h3>
                    <p className="text-muted-foreground">
                      Opciones de financiamiento disponibles con tasas desde 5.9% anual.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Entrega</h3>
                    <p className="text-muted-foreground">Tiempo estimado de entrega: 4-6 semanas.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Vehículos relacionados */}
        {relatedVehicles.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Vehículos relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedVehicles.map((relatedVehicle) => (
                <Card key={relatedVehicle.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image
                      src={relatedVehicle.images[0] || "/placeholder.svg?height=600&width=800&query=electric+vehicle"}
                      alt={relatedVehicle.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{relatedVehicle.name}</h3>
                        <span>${relatedVehicle.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{relatedVehicle.description}</p>
                      <Link href={`/catalogo/${relatedVehicle.id}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Ver detalles
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
