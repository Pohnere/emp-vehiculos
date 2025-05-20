import { type NextRequest, NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser } from "@/lib/db"

// GET - Obtener un usuario por ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    console.log(`[API] GET /api/users/${userId}`)

    // Buscar usuario
    const user = await getUserById(userId)

    if (!user) {
      console.log(`[API] Usuario no encontrado: ${userId}`)
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Filtrar información sensible
    const safeUser = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status || "activo", // Asegurar que siempre haya un status
      createdAt: user.createdAt,
    }

    console.log(`[API] Usuario encontrado:`, safeUser)
    return NextResponse.json(safeUser)
  } catch (error) {
    console.error(`[API] Error al obtener usuario:`, error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

// PUT - Actualizar un usuario
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    console.log(`[API] PUT /api/users/${userId}`)

    const body = await request.json()
    console.log(`[API] Datos recibidos:`, body)

    // Actualizar usuario
    const updatedUser = await updateUser(userId, {
      name: body.name,
      email: body.email,
      role: body.role,
      status: body.status,
    })

    if (!updatedUser) {
      console.log(`[API] Usuario no encontrado: ${userId}`)
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Filtrar información sensible
    const safeUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      status: updatedUser.status || "activo", // Asegurar que siempre haya un status
      createdAt: updatedUser.createdAt,
    }

    console.log(`[API] Usuario actualizado:`, safeUser)
    return NextResponse.json({
      message: "Usuario actualizado exitosamente",
      user: safeUser,
    })
  } catch (error) {
    console.error(`[API] Error al actualizar usuario:`, error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

// DELETE - Eliminar un usuario
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    console.log(`[API] DELETE /api/users/${userId}`)

    // Eliminar usuario
    const success = await deleteUser(userId)

    if (!success) {
      console.log(`[API] Usuario no encontrado: ${userId}`)
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    console.log(`[API] Usuario eliminado: ${userId}`)
    return NextResponse.json({
      message: "Usuario eliminado exitosamente",
      user: { id: userId },
    })
  } catch (error) {
    console.error(`[API] Error al eliminar usuario:`, error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
