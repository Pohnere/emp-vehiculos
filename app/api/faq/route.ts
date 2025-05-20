import { type NextRequest, NextResponse } from "next/server"
import { getFAQs, createFAQ } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log(`[API] GET /api/faq`)

    // Parámetros de consulta para filtrado
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    // Obtener FAQs con filtros
    const faqs = await getFAQs(category || undefined)

    // Ordenar por el campo "order" si existe
    const sortedFaqs = [...faqs].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      return 0
    })

    console.log(`[API] FAQs encontradas: ${sortedFaqs.length}`)
    return NextResponse.json(sortedFaqs)
  } catch (error) {
    console.error(`[API] Error al obtener FAQs:`, error)
    return NextResponse.json({ error: "Error al obtener las FAQs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log(`[API] POST /api/faq`)

    const body = await request.json()
    console.log(`[API] Datos recibidos:`, body)

    // Validar datos de entrada
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Crear nueva FAQ
    const newFAQ = await createFAQ({
      question: body.question,
      answer: body.answer,
      category: body.category || "general",
      order: body.order !== undefined ? body.order : 999, // Poner al final si no se especifica
    })

    console.log(`[API] FAQ creada:`, newFAQ)
    return NextResponse.json({
      message: "FAQ creada exitosamente",
      faq: newFAQ,
    })
  } catch (error) {
    console.error(`[API] Error al crear FAQ:`, error)
    return NextResponse.json({ error: "Error al crear la FAQ" }, { status: 500 })
  }
}
