import { type NextRequest, NextResponse } from "next/server"
import { faqs } from "@/lib/db"

// GET - Obtener una FAQ por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const faqId = Number.parseInt(params.id)

    // Buscar FAQ
    const faq = faqs.find((f) => f.id === faqId)

    if (!faq) {
      return NextResponse.json({ error: "FAQ no encontrada" }, { status: 404 })
    }

    return NextResponse.json(faq)
  } catch (error) {
    console.error("Error al obtener FAQ:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

// PUT - Actualizar una FAQ
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // En una aplicación real, aquí verificaríamos la autenticación y autorización

    const faqId = Number.parseInt(params.id)
    const body = await request.json()

    // Buscar FAQ
    const faqIndex = faqs.findIndex((f) => f.id === faqId)

    if (faqIndex === -1) {
      return NextResponse.json({ error: "FAQ no encontrada" }, { status: 404 })
    }

    // Actualizar FAQ
    const updatedFAQ = {
      ...faqs[faqIndex],
      question: body.question || faqs[faqIndex].question,
      answer: body.answer || faqs[faqIndex].answer,
      category: body.category !== undefined ? body.category : faqs[faqIndex].category,
      order: body.order !== undefined ? body.order : faqs[faqIndex].order,
    }

    faqs[faqIndex] = updatedFAQ

    return NextResponse.json({
      message: "FAQ actualizada exitosamente",
      faq: updatedFAQ,
    })
  } catch (error) {
    console.error("Error al actualizar FAQ:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar una FAQ
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // En una aplicación real, aquí verificaríamos la autenticación y autorización

    const faqId = Number.parseInt(params.id)

    // Buscar FAQ
    const faqIndex = faqs.findIndex((f) => f.id === faqId)

    if (faqIndex === -1) {
      return NextResponse.json({ error: "FAQ no encontrada" }, { status: 404 })
    }

    // Eliminar FAQ
    const deletedFAQ = faqs.splice(faqIndex, 1)[0]

    return NextResponse.json({
      message: "FAQ eliminada exitosamente",
      faq: {
        id: deletedFAQ.id,
      },
    })
  } catch (error) {
    console.error("Error al eliminar FAQ:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
