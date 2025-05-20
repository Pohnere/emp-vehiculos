import { type NextRequest, NextResponse } from "next/server"
import { getOrderById, updateOrder, deleteOrder } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    console.log(`[API] GET /api/orders/${orderId}`)

    // Buscar orden
    const order = await getOrderById(orderId)

    if (!order) {
      console.log(`[API] Orden no encontrada: ${orderId}`)
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    console.log(`[API] Orden encontrada:`, order)
    return NextResponse.json(order)
  } catch (error) {
    console.error(`[API] Error al obtener orden:`, error)
    return NextResponse.json({ error: "Error al obtener la orden" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    console.log(`[API] PUT /api/orders/${orderId}`)

    const body = await request.json()
    console.log(`[API] Datos recibidos:`, body)

    // Actualizar orden
    const updatedOrder = await updateOrder(orderId, {
      status: body.status,
      // Otros campos que se puedan actualizar
    })

    if (!updatedOrder) {
      console.log(`[API] Orden no encontrada: ${orderId}`)
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    console.log(`[API] Orden actualizada:`, updatedOrder)
    return NextResponse.json({
      message: "Orden actualizada exitosamente",
      order: updatedOrder,
    })
  } catch (error) {
    console.error(`[API] Error al actualizar orden:`, error)
    return NextResponse.json({ error: "Error al actualizar la orden" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = Number.parseInt(params.id)
    console.log(`[API] DELETE /api/orders/${orderId}`)

    // Eliminar orden
    const success = await deleteOrder(orderId)

    if (!success) {
      console.log(`[API] Orden no encontrada: ${orderId}`)
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    console.log(`[API] Orden eliminada: ${orderId}`)
    return NextResponse.json({
      message: "Orden eliminada exitosamente",
      order: { id: orderId },
    })
  } catch (error) {
    console.error(`[API] Error al eliminar orden:`, error)
    return NextResponse.json({ error: "Error al eliminar la orden" }, { status: 500 })
  }
}
