"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/password-input"

// Funciones de validación
const validateName = (name: string): boolean => {
  // Solo letras, espacios y algunos caracteres especiales como acentos
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/
  return nameRegex.test(name) && name.length >= 3 && name.length <= 50
}

const validateUsername = (username: string): boolean => {
  // Alfanumérico, guiones y guiones bajos, entre 3 y 20 caracteres
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

const validateEmail = (email: string): boolean => {
  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): boolean => {
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")

    if (token) {
      console.log("[REGISTRO] Usuario ya autenticado, redirigiendo...")
      if (userRole === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/perfil"
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // Validar nombre completo
    if (!formData.fullName) {
      newErrors.fullName = "El nombre completo es obligatorio"
    } else if (!validateName(formData.fullName)) {
      newErrors.fullName = "El nombre solo debe contener letras y espacios"
    }

    // Validar nombre de usuario
    if (!formData.username) {
      newErrors.username = "El nombre de usuario es obligatorio"
    } else if (!validateUsername(formData.username)) {
      newErrors.username = "El nombre de usuario debe tener entre 3 y 20 caracteres alfanuméricos"
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Ingrese un correo electrónico válido"
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Modificar la función handleSubmit para usar la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validar formulario
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Llamada a la API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          username: formData.username,
          email: formData.email || formData.username + "@example.com", // Usar email proporcionado o generar uno
          password: formData.password,
        }),
      })

      const data = await response.json()
      console.log("[REGISTRO] Respuesta de la API:", data)

      if (!response.ok) {
        throw new Error(data.error || "Error en el registro")
      }

      // Guardar información del usuario en localStorage
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", data.user.role)
      localStorage.setItem("userId", data.user.id.toString())
      localStorage.setItem("userName", data.user.name)
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      // Establecer cookie para el token (importante para el middleware)
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Lax`

      setSuccess(true)

      // Redireccionar después de un breve retraso
      setTimeout(() => {
        // Usar window.location.href para una redirección completa
        if (data.user.role === "admin") {
          window.location.href = "/admin"
        } else {
          window.location.href = "/perfil"
        }
      }, 1500)
    } catch (err) {
      console.error("[REGISTRO] Error:", err)
      setError("Ha ocurrido un error al registrar la cuenta. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Crear cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para registrarte en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ¡Registro exitoso! Serás redirigido a tu perfil en unos momentos...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre y apellidos</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Juan Pérez"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="usuario"
                  value={formData.username}
                  onChange={handleChange}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="juan@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                {formData.password && !errors.password && <p className="text-xs text-green-600">Contraseña segura</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registrando...
                  </div>
                ) : (
                  "Registrarse"
                )}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
