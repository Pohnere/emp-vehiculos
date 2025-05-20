import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`[API] GET /api/products/${params.id}`)

    const id = Number.parseInt(params.id)
    const product = await getProductById(id)

    if (!product) {
      console.log(`[API] Producto no encontrado: ${id}`)
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Asegurarse de que el producto tenga la estructura correcta
    const formattedProduct = {
      ...product,
      // Si no hay imágenes, crear un array con la imagen principal o un placeholder
      images:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images
          : [product.image || `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(product.name)}`],
      // Asegurarse de que specs sea un objeto
      specs: product.specs || {},
      // Asegurarse de que features sea un array
      features: product.features || [],
    }

    console.log(`[API] Producto encontrado:`, formattedProduct)

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error(`[API] Error al obtener producto:`, error)
    return NextResponse.json({ error: "Error al obtener el producto" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`[API] PUT /api/products/${params.id}`)

    const id = Number.parseInt(params.id)
    const data = await request.json()
    console.log(`[API] Datos recibidos:`, data)

    // Formatear datos para actualización
    const productData = {
      ...data,
      // Asegurar que images sea un array si se proporciona
      images: data.images ? (Array.isArray(data.images) ? data.images : [data.images]) : undefined,
    }

    const updatedProduct = await updateProduct(id, productData)

    if (!updatedProduct) {
      console.log(`[API] Producto no encontrado: ${id}`)
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    console.log(`[API] Producto actualizado:`, updatedProduct)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error(`[API] Error al actualizar producto:`, error)
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`[API] DELETE /api/products/${params.id}`)

    const id = Number.parseInt(params.id)
    const success = await deleteProduct(id)

    if (!success) {
      console.log(`[API] Producto no encontrado: ${id}`)
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    console.log(`[API] Producto eliminado: ${id}`)
    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error(`[API] Error al eliminar producto:`, error)
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 })
  }
}
