"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ShieldAlert, Loader2, Info } from "lucide-react"

interface AdminAuthCheckProps {
  children: ReactNode
}

export function AdminAuthCheck({ children }: AdminAuthCheckProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        setDebugInfo("Verificando permisos de administrador...")

        // Obtener usuario del localStorage
        const userJson = localStorage.getItem("user")
        setDebugInfo(`Usuario en localStorage: ${userJson || "No encontrado"}`)

        if (!userJson) {
          setDebugInfo("No se encontró información de usuario en localStorage")
          setIsAuthorized(false)
          setLoading(false)
          return
        }

        const user = JSON.parse(userJson)
        setDebugInfo(`Usuario parseado: ${JSON.stringify(user)}`)

        if (!user.role) {
          setDebugInfo("El usuario no tiene un rol definido")
          setIsAuthorized(false)
          setLoading(false)
          return
        }

        setDebugInfo(`Rol del usuario: ${user.role}`)

        // Verificar si el usuario es administrador
        if (user.role === "admin") {
          setDebugInfo(`✅ Usuario autorizado como administrador: ${user.username}`)
          setIsAuthorized(true)
        } else {
          setDebugInfo(`❌ Usuario no autorizado. Rol: ${user.role}`)
          setIsAuthorized(false)
        }

        setLoading(false)
      } catch (error) {
        console.error("[ADMIN] Error al verificar rol:", error)
        setDebugInfo(`Error al verificar rol: ${error instanceof Error ? error.message : String(error)}`)
        setIsAuthorized(false)
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Verificando permisos...</p>
        {debugInfo && (
          <Alert className="mt-4 max-w-md bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Información de depuración</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">{debugInfo}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  // Si el usuario no es administrador, mostrar mensaje de no autorizado
  if (!isAuthorized) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Acceso denegado</AlertTitle>
            <AlertDescription>No tienes permisos para acceder al panel de administración.</AlertDescription>
          </Alert>

          {debugInfo && (
            <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Información de depuración</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{debugInfo}</AlertDescription>
            </Alert>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <ShieldAlert className="h-16 w-16 text-destructive" />
              </div>
              <CardTitle className="text-center">Área restringida</CardTitle>
              <CardDescription className="text-center">
                Esta sección está reservada para administradores del sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-sm text-muted-foreground mb-6">
                Si crees que deberías tener acceso, por favor contacta al administrador del sistema o inicia sesión con
                una cuenta que tenga los permisos adecuados.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => router.push("/")}>
                Volver al inicio
              </Button>
              <Button onClick={() => router.push("/login?redirect=/admin")}>Iniciar sesión</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Si el usuario es administrador, mostrar el contenido
  return (
    <>
      {debugInfo && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Acceso autorizado</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap">{debugInfo}</AlertDescription>
        </Alert>
      )}
      {children}
    </>
  )
}
