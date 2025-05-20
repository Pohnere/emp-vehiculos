import { type NextRequest, NextResponse } from "next/server"
import { supportTickets } from "@/lib/db"

// GET - Obtener un ticket de soporte por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // En una aplicación real, aquí verificaríamos la autenticación y autorización

    const ticketId = Number.parseInt(params.id)

    // Buscar ticket
    const ticket = supportTickets.find((t) => t.id === ticketId)

    if (!ticket) {
      return NextResponse.json({ error: "Ticket de soporte no encontrado" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error al obtener ticket de soporte:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

// PUT - Actualizar un ticket de soporte
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // En una aplicación real, aquí verificaríamos la autenticación y autorización

    const ticketId = Number.parseInt(params.id)
    const body = await request.json()

    // Buscar ticket
    const ticketIndex = supportTickets.findIndex((t) => t.id === ticketId)

    if (ticketIndex === -1) {
      return NextResponse.json({ error: "Ticket de soporte no encontrado" }, { status: 404 })
    }

    // Actualizar ticket
    const updatedTicket = {
      ...supportTickets[ticketIndex],
      subject: body.subject || supportTickets[ticketIndex].subject,
      message: body.message || supportTickets[ticketIndex].message,
      category: body.category || supportTickets[ticketIndex].category,
      status: body.status || supportTickets[ticketIndex].status,
      updatedAt: new Date().toISOString(),
    }

    supportTickets[ticketIndex] = updatedTicket

    return NextResponse.json({
      message: "Ticket de soporte actualizado exitosamente",
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Error al actualizar ticket de soporte:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar un ticket de soporte
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // En una aplicación real, aquí verificaríamos la autenticación y autorización

    const ticketId = Number.parseInt(params.id)

    // Buscar ticket
    const ticketIndex = supportTickets.findIndex((t) => t.id === ticketId)

    if (ticketIndex === -1) {
      return NextResponse.json({ error: "Ticket de soporte no encontrado" }, { status: 404 })
    }

    // Eliminar ticket
    const deletedTicket = supportTickets.splice(ticketIndex, 1)[0]

    return NextResponse.json({
      message: "Ticket de soporte eliminado exitosamente",
      ticket: {
        id: deletedTicket.id,
      },
    })
  } catch (error) {
    console.error("Error al eliminar ticket de soporte:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
