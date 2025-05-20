import { type NextRequest, NextResponse } from "next/server"
import { getProducts, createProduct } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    console.log(`[API] GET /api/products`)

    // Obtener parámetros de consulta
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")

    // Obtener productos (con filtro opcional por categoría)
    const products = await getProducts(category ? { category: category as any } : undefined)

    // Asegurarse de que cada producto tenga la estructura correcta
    const formattedProducts = products.map((product) => ({
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
    }))

    console.log(`[API] Productos encontrados: ${formattedProducts.length}`)

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error(`[API] Error al obtener productos:`, error)
    return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log(`[API] POST /api/products`)

    const data = await request.json()
    console.log(`[API] Datos recibidos:`, data)

    // Validar datos mínimos
    if (!data.name || !data.price || !data.description) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Crear producto con datos formateados
    const productData = {
      ...data,
      // Asegurar que images sea un array
      images: Array.isArray(data.images) ? data.images : data.image ? [data.image] : [],
      // Asegurar que specs sea un objeto
      specs: data.specs || {},
      // Asegurar que features sea un array
      features: Array.isArray(data.features) ? data.features : [],
    }

    const newProduct = await createProduct(productData)
    console.log(`[API] Producto creado:`, newProduct)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error(`[API] Error al crear producto:`, error)
    return NextResponse.json({ error: "Error al crear el producto" }, { status: 500 })
  }
}
