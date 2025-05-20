import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { generateToken, verifyToken } from "./jwt"
import { authenticateUser, getUserByUsername, createUser } from "./db"
import type { User } from "./types"

// Función para iniciar sesión
export async function login(credentials: { username: string; password: string }) {
  try {
    const user = await authenticateUser(credentials.username, credentials.password)

    if (!user) {
      return null
    }

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    }
  } catch (error) {
    console.error("[AUTH] Error en login:", error)
    return null
  }
}

// Función para registrar un nuevo usuario
export async function register(userData: {
  name: string
  username: string
  email: string
  password: string
}) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await getUserByUsername(userData.username)
    if (existingUser) {
      throw new Error("El nombre de usuario ya está en uso")
    }

    // Crear nuevo usuario
    const newUser = await createUser({
      ...userData,
      role: "cliente", // Por defecto, todos los usuarios nuevos son clientes
      status: "activo",
    })

    // Generar token JWT
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    })

    return {
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    }
  } catch (error) {
    console.error("[AUTH] Error en registro:", error)
    throw error
  }
}

// Función para obtener el usuario actual desde el token JWT
export async function getCurrentUser(req?: NextRequest): Promise<User | null> {
  try {
    // Obtener token de la cookie o del header Authorization
    let token: string | undefined

    if (req) {
      // Si es una solicitud del servidor, obtener de la cookie o del header
      token = req.cookies.get("auth-token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "")
    } else {
      // Si es una solicitud del cliente, obtener de la cookie
      token = cookies().get("auth-token")?.value
    }

    if (!token) {
      return null
    }

    // Verificar token JWT
    const payload = verifyToken(token)

    if (!payload) {
      return null
    }

    // Verificar que el usuario existe en la base de datos
    const user = await getUserByUsername(payload.username)

    if (!user) {
      return null
    }

    // Devolver usuario sin información sensible
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword as User
  } catch (error) {
    console.error("[AUTH] Error al obtener usuario actual:", error)
    return null
  }
}

// Middleware para verificar si el usuario está autenticado
export async function isAuthenticated(req?: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req)
  return !!user
}

// Middleware para verificar si el usuario tiene un rol específico
export async function hasRole(role: string | string[], req?: NextRequest): Promise<boolean> {
  const user = await getCurrentUser(req)

  if (!user) {
    return false
  }

  if (Array.isArray(role)) {
    return role.includes(user.role)
  }

  return user.role === role
}

// Función para cerrar sesión
export function logout() {
  cookies().delete("auth-token")
}
