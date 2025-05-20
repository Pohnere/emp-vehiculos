"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Heart, ShoppingCart, Trash2 } from "lucide-react"
import Image from "next/image"

export default function FavoritosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [favorites, setFavorites] = useState<any[]>([])
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
          router.push("/login?redirect=/favoritos")
          return
        }

        // Obtener datos del usuario
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Cargar favoritos del usuario (simulado)
          // En una implementación real, esto vendría de una API
          const storedFavorites = localStorage.getItem("favorites")
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites))
          } else {
            // Simulación de favoritos
            setFavorites([])
          }
        } else {
          router.push("/login?redirect=/favoritos")
        }
      } catch (error) {
        console.error("Error al cargar favoritos:", error)
        setError("No se pudieron cargar los favoritos. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Función para eliminar un favorito
  const removeFavorite = (productId: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== productId)
    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  // Función para agregar al carrito
  const addToCart = (product: any) => {
    try {
      // Obtener carrito actual
      const currentCart = JSON.parse(localStorage.getItem("cart") || "[]")

      // Verificar si el producto ya está en el carrito
      const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id)

      if (existingItemIndex >= 0) {
        // Incrementar cantidad si ya existe
        currentCart[existingItemIndex].quantity += 1
      } else {
        // Agregar nuevo item al carrito
        currentCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        })
      }

      // Guardar carrito actualizado
      localStorage.setItem("cart", JSON.stringify(currentCart))

      // Disparar evento para actualizar contador del carrito en el header
      window.dispatchEvent(new Event("storage"))

      // Mostrar mensaje de éxito (en una implementación real usaríamos un toast)
      alert("Producto agregado al carrito")
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
    }
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando favoritos...</p>
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
        <div>
          <h1 className="text-3xl font-bold">Mis Favoritos</h1>
          <p className="text-muted-foreground">Vehículos que has guardado como favoritos</p>
        </div>

        {favorites.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">No tienes vehículos favoritos</p>
              <p className="text-muted-foreground mb-6">Explora nuestro catálogo y guarda tus vehículos favoritos.</p>
              <Link href="/catalogo">
                <Button>Ver catálogo</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative">
                  <Image
                    src={product.image || "/placeholder.svg?height=200&width=400&query=car"}
                    alt={product.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeFavorite(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${product.price.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-2">{product.description}</p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Añadir al carrito
                  </Button>
                  <Link href={`/catalogo/${product.id}`} className="w-full">
                    <Button className="w-full">Ver detalles</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
