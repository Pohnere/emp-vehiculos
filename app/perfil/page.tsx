"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Loader2, User, ShoppingBag, Heart, Settings } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [formLoading, setFormLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Obtener token del localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login?redirect=/perfil")
          return
        }

        // Obtener datos del usuario
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Inicializar formulario con datos del usuario
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: "1234567890", // Valor por defecto
          })
        } else {
          // Si no hay datos de usuario en localStorage, obtenerlos de la API
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            throw new Error("No se pudo obtener la información del usuario")
          }

          const userData = await response.json()
          setUser(userData)

          // Inicializar formulario con datos del usuario
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phone: "1234567890", // Valor por defecto
          })

          // Guardar datos del usuario en localStorage
          localStorage.setItem("user", JSON.stringify(userData))
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
        router.push("/login?redirect=/perfil")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    // Validación básica
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Existen campos obligatorios vacíos. Por favor, complete los mismos.")
      return
    }

    setFormLoading(true)

    try {
      // Obtener token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      // Llamada a la API para actualizar el usuario
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al actualizar el perfil")
      }

      const updatedUser = await response.json()

      // Actualizar datos del usuario en localStorage
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      const newUserData = { ...storedUser, name: formData.name, email: formData.email }
      localStorage.setItem("user", JSON.stringify(newUserData))

      // Actualizar estado del usuario
      setUser(newUserData)

      setSuccess(true)
    } catch (err: any) {
      console.error("Error al actualizar perfil:", err)
      setError(err.message || "Ha ocurrido un error al actualizar el perfil. Por favor, inténtelo de nuevo.")
    } finally {
      setFormLoading(false)
    }
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando perfil...</p>
      </div>
    )
  }

  // Obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=96`}
            />
            <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex items-center">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {user.role === "admin" ? "Administrador" : "Cliente"}
              </span>
            </div>
            {user.role === "admin" && (
              <div className="mt-4">
                <Link href="/admin">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Panel de Administración
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 text-green-800 border-green-200">
                      <AlertDescription>Tu información ha sido actualizada correctamente.</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <Button type="submit" disabled={formLoading}>
                    {formLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando cambios...
                      </>
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Mis pedidos</CardTitle>
                <CardDescription>Historial de tus compras y pedidos activos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes pedidos activos.</p>
                  <Link href="/catalogo" className="mt-4 inline-block">
                    <Button variant="outline">Explorar catálogo</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Mis favoritos</CardTitle>
                <CardDescription>Vehículos que has guardado como favoritos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No tienes vehículos favoritos.</p>
                  <Link href="/catalogo" className="mt-4 inline-block">
                    <Button variant="outline">Explorar catálogo</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
