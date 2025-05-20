"use client"

import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

export function MaintenanceMode() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Verificar si el modo mantenimiento está activado
    const checkMaintenanceMode = () => {
      const maintenanceMode = localStorage.getItem("maintenanceMode")
      setIsMaintenanceMode(maintenanceMode === "true")

      // Verificar si es un administrador
      try {
        const user = localStorage.getItem("user")
        if (user) {
          const userData = JSON.parse(user)
          setIsAdmin(userData.role === "admin")
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        setIsAdmin(false)
      }
    }

    // Verificar al cargar el componente
    checkMaintenanceMode()

    // Escuchar cambios en el localStorage
    const handleStorageChange = () => {
      checkMaintenanceMode()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("maintenanceModeChange", handleStorageChange)
    window.addEventListener("settingsChange", handleStorageChange)

    // También verificar cada segundo por si hay cambios desde otra pestaña
    const interval = setInterval(checkMaintenanceMode, 1000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("maintenanceModeChange", handleStorageChange)
      window.removeEventListener("settingsChange", handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (!isMaintenanceMode) {
    return null
  }

  // Si es un administrador, mostrar una barra de notificación en lugar de la pantalla completa
  if (isAdmin) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black p-2 z-50 flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <p className="font-medium">Modo mantenimiento activado. Solo los administradores pueden ver el sitio.</p>
      </div>
    )
  }

  // Para usuarios normales, mostrar pantalla completa de mantenimiento
  return (
    <div className="fixed inset-0 bg-background z-[9999] flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold">Sitio en mantenimiento</h1>
        <p className="text-muted-foreground">
          Estamos realizando mejoras en nuestro sitio. Por favor, vuelva más tarde.
        </p>
        <div className="animate-pulse flex justify-center space-x-2 pt-4">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div className="w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
