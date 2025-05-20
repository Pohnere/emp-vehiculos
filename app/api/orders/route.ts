import { type NextRequest, NextResponse } from "next/server"
import { getOrders, createOrder, getProductById } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log(`[API] GET /api/orders`)

    // Parámetros de consulta para filtrado
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") ? Number.parseInt(searchParams.get("userId")!) : undefined
    const status = searchParams.get("status")

    // Obtener órdenes con filtros
    let orders = await getOrders(userId)

    // Filtrar por status si se proporciona
    if (status) {
      orders = orders.filter((order) => order.status === status)
    }

    console.log(`[API] Órdenes encontradas: ${orders.length}`)
    return NextResponse.json(orders)
  } catch (error) {
    console.error(`[API] Error al obtener órdenes:`, error)
    return NextResponse.json({ error: "Error al obtener las órdenes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log(`[API] POST /api/orders`)

    const body = await request.json()
    console.log(`[API] Datos recibidos:`, body)

    // Validar datos de entrada
    if (!body.userId || !body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Faltan campos obligatorios o el formato es incorrecto" }, { status: 400 })
    }

    // Validar que los productos existan y tengan stock suficiente
    let total = 0
    const orderItems = []

    for (const item of body.items) {
      const product = await getProductById(item.productId)

      if (!product) {
        return NextResponse.json({ error: `El producto con ID ${item.productId} no existe` }, { status: 400 })
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insuficiente para el producto ${product.name}` }, { status: 400 })
      }

      const itemTotal = product.price * item.quantity
      total += itemTotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        name: product.name,
        image: product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null),
      })
    }

    // Crear nueva orden
    const newOrder = await createOrder({
      userId: body.userId,
      items: orderItems,
      total,
      status: "pendiente",
    })

    console.log(`[API] Orden creada:`, newOrder)
    return NextResponse.json({
      message: "Orden creada exitosamente",
      order: newOrder,
    })
  } catch (error) {
    console.error(`[API] Error al crear orden:`, error)
    return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 })
  }
}
