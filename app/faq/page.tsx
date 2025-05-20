"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [faqData, setFaqData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar FAQs desde la API
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/faq")
        const data = await response.json()
        console.log("[FAQ] FAQs cargadas:", data)
        setFaqData(data)
      } catch (err) {
        console.error("[FAQ] Error al cargar FAQs:", err)
        setError("Error al cargar las preguntas frecuentes. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  // Filtrar preguntas según el término de búsqueda
  const filteredFAQs = faqData.filter((faq) => {
    return (
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando preguntas frecuentes...</p>
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
      <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Preguntas Frecuentes</h1>
          <p className="text-muted-foreground">
            Encuentra respuestas a las preguntas más comunes sobre nuestros vehículos eléctricos y autónomos.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar preguntas..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {filteredFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No se encontraron preguntas que coincidan con tu búsqueda.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
                Mostrar todas las preguntas
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>¿No encuentras lo que buscas?</CardTitle>
            <CardDescription>
              Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta adicional.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1">Contactar soporte</Button>
            <Button variant="outline" className="flex-1">
              Ver manual de usuario
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
