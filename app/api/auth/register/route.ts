import { type NextRequest, NextResponse } from "next/server"
import { register } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validar datos de entrada
    if (!body.name || !body.username || !body.email || !body.password) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Formato de email inválido" }, { status: 400 })
    }

    // Intentar registrar al usuario
    try {
      const result = await register({
        name: body.name,
        username: body.username,
        email: body.email,
        password: body.password,
      })

      return NextResponse.json({
        message: "Usuario registrado exitosamente",
        user: result.user,
        token: result.token,
      })
    } catch (err: any) {
      return NextResponse.json(
        { error: err.message },
        { status: 409 }, // Conflict
      )
    }
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
