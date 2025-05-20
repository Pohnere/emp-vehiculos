import { type NextRequest, NextResponse } from "next/server"
import { getSupportTickets, createSupportTicket } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log(`[API] GET /api/support`)

    // Parámetros de consulta para filtrado
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") ? Number.parseInt(searchParams.get("userId")!) : undefined
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    // Obtener tickets con filtros
    let tickets = await getSupportTickets(userId)

    // Aplicar filtros adicionales
    if (status) {
      tickets = tickets.filter((ticket) => ticket.status === status)
    }

    if (category) {
      tickets = tickets.filter((ticket) => ticket.category === category)
    }

    console.log(`[API] Tickets encontrados: ${tickets.length}`)
    return NextResponse.json(tickets)
  } catch (error) {
    console.error(`[API] Error al obtener tickets de soporte:`, error)
    return NextResponse.json({ error: "Error al obtener los tickets de soporte" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log(`[API] POST /api/support`)

    const body = await request.json()
    console.log(`[API] Datos recibidos:`, body)

    // Validar datos de entrada
    if (!body.subject || !body.message || !body.category) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Crear nuevo ticket
    const newTicket = await createSupportTicket({
      userId: body.userId || null,
      name: body.name || "Anónimo",
      email: body.email || "no-email@example.com",
      subject: body.subject,
      message: body.message,
      category: body.category,
    })

    console.log(`[API] Ticket creado:`, newTicket)
    return NextResponse.json({
      message: "Ticket de soporte creado exitosamente",
      ticket: newTicket,
    })
  } catch (error) {
    console.error(`[API] Error al crear ticket de soporte:`, error)
    return NextResponse.json({ error: "Error al crear el ticket de soporte" }, { status: 500 })
  }
}
