"use client"

import { useEffect } from "react"
import { initializeUsers } from "@/lib/db"

export function DataInitializer() {
  useEffect(() => {
    // Inicializar los datos solo en el cliente
    if (typeof window !== "undefined") {
      initializeUsers()
    }
  }, [])

  // Este componente no renderiza nada visible
  return null
}
