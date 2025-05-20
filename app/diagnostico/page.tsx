"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info, AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function DiagnosticoPage() {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar datos del localStorage
    try {
      const userJson = localStorage.getItem("user")
      const tokenValue = localStorage.getItem("token")

      if (userJson) {
        setUser(JSON.parse(userJson))
      }

      setToken(tokenValue)
    } catch (error) {
      console.error("Error al cargar datos:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearData = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
  }

  if (loading) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Cargando diagnóstico...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse h-8 w-full bg-gray-200 rounded mb-4"></div>
            <div className="animate-pulse h-8 w-full bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Diagnóstico de Autenticación</CardTitle>
          <CardDescription>Información sobre el estado actual de autenticación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Estado de autenticación</h3>
              {user ? (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Usuario autenticado</AlertTitle>
                  <AlertDescription>Has iniciado sesión correctamente.</AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>No autenticado</AlertTitle>
                  <AlertDescription>No has iniciado sesión o tu sesión ha expirado.</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Información del usuario</h3>
              {user ? (
                <div className="bg-gray-50 p-4 rounded-md border">
                  <pre className="whitespace-pre-wrap overflow-auto">{JSON.stringify(user, null, 2)}</pre>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sin datos de usuario</AlertTitle>
                  <AlertDescription>No se encontró información de usuario en localStorage.</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Token</h3>
              {token ? (
                <div className="bg-gray-50 p-4 rounded-md border">
                  <p className="mb-2 font-medium">Token encontrado en localStorage:</p>
                  <div className="bg-gray-100 p-2 rounded-md overflow-auto">
                    <code className="text-xs break-all">{token}</code>
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sin token</AlertTitle>
                  <AlertDescription>No se encontró token en localStorage.</AlertDescription>
                </Alert>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Rol de usuario</h3>
              {user?.role ? (
                <Alert className={user.role === "admin" ? "bg-green-50 text-green-800 border-green-200" : ""}>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Rol: {user.role}</AlertTitle>
                  <AlertDescription>
                    {user.role === "admin"
                      ? "Tienes permisos de administrador."
                      : "No tienes permisos de administrador."}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Sin rol definido</AlertTitle>
                  <AlertDescription>No se encontró información de rol en los datos del usuario.</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="destructive" onClick={clearData}>
                Limpiar datos de autenticación
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones de depuración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Si estás teniendo problemas con la autenticación, prueba lo siguiente:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Cierra sesión y vuelve a iniciar sesión</li>
              <li>Limpia los datos de autenticación con el botón de arriba</li>
              <li>Usa las cuentas de prueba proporcionadas en la página de login</li>
              <li>Verifica que el rol del usuario sea "admin" para acceder a las secciones de administración</li>
            </ol>
            <div className="mt-4">
              <h4 className="font-medium mb-2">Cuentas de prueba:</h4>
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
