"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, LogIn } from "lucide-react"

export default function NoAutorizadoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(10)
  const from = searchParams.get("from") || ""

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const getMessage = () => {
    switch (from) {
      case "admin":
        return "No tienes permisos de administrador para acceder a esta sección."
      default:
        return "No tienes permisos para acceder a esta sección."
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Acceso Denegado</CardTitle>
          <CardDescription>{getMessage()}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Serás redirigido a la página principal en <span className="font-bold">{countdown}</span> segundos.
          </p>
          <p className="text-sm text-muted-foreground">
            Si crees que esto es un error, por favor contacta con el administrador del sistema.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
          <Link href="/login">
            <Button className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
