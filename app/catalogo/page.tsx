"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Battery, Car, Filter, Search, Loader2 } from "lucide-react"

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [autonomyRange, setAutonomyRange] = useState([300, 800])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vehiclesData, setVehiclesData] = useState<any[]>([])

  // Cargar productos desde la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/products")
        const data = await response.json()
        console.log("[CATÁLOGO] Productos cargados:", data)
        setVehiclesData(data)
      } catch (err) {
        console.error("[CATÁLOGO] Error al cargar productos:", err)
        setError("Error al cargar los productos. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filtrar vehículos según los criterios
  const filteredVehicles = vehiclesData.filter((vehicle) => {
    // Filtro por término de búsqueda
    const matchesSearch = vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtro por rango de autonomía
    const matchesAutonomy = vehicle.autonomy >= autonomyRange[0] && vehicle.autonomy <= autonomyRange[1]

    // Filtro por categoría
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(vehicle.category)

    return matchesSearch && matchesAutonomy && matchesCategory
  })

  // Manejar cambio en las categorías seleccionadas
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando productos...</p>
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
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Catálogo de Vehículos</h1>
          <p className="text-muted-foreground">
            Explora nuestra selección de vehículos eléctricos y autónomos de última generación.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por modelo o marca..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className="md:w-auto w-full flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {showFilters && (
          <Card className="w-full">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Autonomía (km)</Label>
                    <div className="pt-4">
                      <Slider
                        defaultValue={[300, 800]}
                        min={300}
                        max={800}
                        step={50}
                        value={autonomyRange}
                        onValueChange={setAutonomyRange}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{autonomyRange[0]} km</span>
                      <span>{autonomyRange[1]} km</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Categoría</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["sedan", "suv", "compact", "crossover", "mini"].map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={category} className="capitalize">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <div className="relative h-48">
                  <Image src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">{vehicle.badge}</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{vehicle.name}</CardTitle>
                  <CardDescription>${vehicle.price.toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-muted-foreground">{vehicle.description}</p>
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{vehicle.autonomy} km de autonomía</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Nivel autónomo {vehicle.autonomyLevel}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/catalogo/${vehicle.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Ver detalles
                    </Button>
                  </Link>
                  <Link href={`/carrito/agregar/${vehicle.id}`} className="flex-1">
                    <Button className="w-full">Comprar</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-medium">No se encontraron vehículos</h3>
            <p className="text-muted-foreground mt-1">Intenta ajustar los filtros o buscar con otros términos.</p>
          </div>
        )}
      </div>
    </div>
  )
}
