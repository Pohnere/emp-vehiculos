import { type NextRequest, NextResponse } from "next/server"
import { getUsers, createUser } from "@/lib/db"

// GET - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    console.log("[API] GET /api/users")

    const users = await getUsers()

    // Filtrar información sensible y asegurar formato consistente
    const safeUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status || "activo", // Asegurar que siempre haya un status
      createdAt: user.createdAt,
    }))

    console.log(`[API] Usuarios encontrados: ${safeUsers.length}`)
    return NextResponse.json(safeUsers)
  } catch (error) {
    console.error("[API] Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

// POST - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  try {
    console.log("[API] POST /api/users")

    const body = await request.json()
    console.log("[API] Datos recibidos:", body)

    // Validar datos de entrada
    if (!body.name || !body.username || !body.email || !body.role) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 })
    }

    // Crear nuevo usuario
    const newUser = await createUser({
      name: body.name,
      username: body.username,
      email: body.email,
      role: body.role,
      status: body.status || "activo",
    })

    // Filtrar información sensible
    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
    }

    console.log("[API] Usuario creado:", safeUser)
    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: safeUser,
    })
  } catch (error) {
    console.error("[API] Error al crear usuario:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
