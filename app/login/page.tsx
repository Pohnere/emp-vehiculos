"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, Info } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setDebugInfo(null)
    setLoading(true)

    try {
      setDebugInfo(`Intentando login para usuario: ${username}`)

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setDebugInfo(`Error en login: ${data.error || "Error desconocido"}`)
        setError(data.error || "Error al iniciar sesión")
        setLoading(false)
        return
      }

      setDebugInfo(`Login exitoso. Usuario: ${data.user.username}, Rol: ${data.user.role}`)

      // Guardar información del usuario en localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          username: data.user.username,
          email: data.user.email,
          role: data.user.role, // Asegurarse de que el rol se guarde correctamente
        }),
      )

      // Guardar token en localStorage (para compatibilidad)
      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      setDebugInfo(`Datos guardados en localStorage. Redirigiendo a: ${redirect}`)

      // Redirigir al usuario
      router.push(redirect)
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setDebugInfo(`Error de excepción: ${error instanceof Error ? error.message : String(error)}`)
      setError("Error al conectar con el servidor")
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Información de depuración</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{debugInfo}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu nombre de usuario"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">Cuentas de prueba:</h3>
            <div className="space-y-2 text-sm">
              <div className="p-2 border rounded bg-white">
                <p className="font-medium">Administrador:</p>
                <p>
                  Usuario: <code className="bg-gray-100 px-1 rounded">admin</code>
                </p>
                <p>
                  Contraseña: <code className="bg-gray-100 px-1 rounded">admin123</code>
                </p>
              </div>
              <div className="p-2 border rounded bg-white">
                <p className="font-medium">Cliente:</p>
                <p>
                  Usuario: <code className="bg-gray-100 px-1 rounded">usuario</code>
                </p>
                <p>
                  Contraseña: <code className="bg-gray-100 px-1 rounded">usuario123</code>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <a href="/registro" className="text-primary hover:underline">
              Regístrate aquí
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
