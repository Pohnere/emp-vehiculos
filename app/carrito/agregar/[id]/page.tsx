"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

// Datos de ejemplo para los productos (en una aplicación real, esto vendría de una base de datos)
const vehiclesData = [
  {
    id: 1,
    name: "Model E",
    price: 45000,
    image: "/placeholder.svg?key=pkve7",
    description: "Sedán eléctrico con 500 km de autonomía y tecnología autónoma nivel 3.",
  },
  {
    id: 2,
    name: "Model H",
    price: 65000,
    image: "/placeholder.svg?key=mt1ei",
    description: "SUV híbrido con 700 km de autonomía y tecnología autónoma nivel 4.",
  },
  {
    id: 3,
    name: "Model C",
    price: 35000,
    image: "/placeholder.svg?key=yfsr8",
    description: "Compacto urbano con 400 km de autonomía y tecnología autónoma nivel 2.",
  },
  {
    id: 4,
    name: "Model S",
    price: 85000,
    image: "/luxury-electric-sedan.png",
    description: "Sedán de lujo con 800 km de autonomía y tecnología autónoma nivel 5.",
  },
  {
    id: 5,
    name: "Model X",
    price: 55000,
    image: "/crossover-ev.png",
    description: "Crossover con 600 km de autonomía y tecnología autónoma nivel 3.",
  },
  {
    id: 6,
    name: "Model M",
    price: 30000,
    image: "/mini-electric-car.png",
    description: "Mini urbano con 300 km de autonomía y tecnología autónoma nivel 2.",
  },
]

export default function AddToCartPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const addToCart = async () => {
      try {
        const productId = Number.parseInt(params.id)

        // Verificar si el producto existe
        const product = vehiclesData.find((v) => v.id === productId)
        if (!product) {
          setError("El producto no existe")
          setLoading(false)
          return
        }

        // Obtener el carrito actual del localStorage
        const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]")

        // Verificar si el producto ya está en el carrito
        const existingItemIndex = cartItems.findIndex((item: any) => item.id === productId)

        if (existingItemIndex >= 0) {
          // Si el producto ya está en el carrito, incrementar la cantidad
          cartItems[existingItemIndex].quantity += 1
        } else {
          // Si no, añadir el producto al carrito
          cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
          })
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem("cartItems", JSON.stringify(cartItems))

        // Simular un pequeño retraso para mostrar el estado de carga
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Redirigir al carrito
        router.push("/carrito")
      } catch (err) {
        console.error("Error al añadir al carrito:", err)
        setError("Ha ocurrido un error al añadir el producto al carrito")
        setLoading(false)
      }
    }

    addToCart()
  }, [params.id, router])

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
        <h1 className="text-2xl font-bold mb-2">Añadiendo al carrito</h1>
        <p className="text-muted-foreground">Por favor, espere un momento...</p>
      </div>
    </div>
  )
}
