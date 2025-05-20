import { type NextRequest, NextResponse } from "next/server"
import { generateToken } from "@/lib/jwt"

// Usuarios predefinidos para autenticación (independiente de localStorage)
const predefinedUsers = [
  {
    id: "1",
    username: "admin",
    password: "admin123",
    email: "admin@ecodrive.com",
    role: "admin",
    name: "Administrador",
    lastName: "Sistema",
  },
  {
    id: "2",
    username: "usuario",
    password: "usuario123",
    email: "usuario@example.com",
    role: "cliente",
    name: "Usuario",
    lastName: "Prueba",
  },
  // Mantener los usuarios originales también
  {
    id: "3",
    username: "Ernesto",
    password: "Ernesto.2003",
    email: "ernesto@ecodrive.com",
    role: "admin",
    name: "Ernesto Alejandro",
    lastName: "Ramos Díaz",
  },
  {
    id: "4",
    username: "user",
    password: "user",
    email: "user@example.com",
    role: "cliente",
    name: "Usuario",
    lastName: "Ejemplo",
  },
  {
    id: "5",
    username: "Daisander",
    password: "Daisander.2004",
    email: "daisander@example.com",
    role: "cliente",
    name: "Daisander",
    lastName: "Cliente",
  },
]

// Función de autenticación independiente de localStorage
function authenticateUserDirect(username: string, password: string) {
  console.log(`[AUTH] Intentando autenticar usuario: ${username}`)
  return predefinedUsers.find((user) => user.username === username && user.password === password)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    console.log(`[AUTH] Intento de login para: ${username}`)

    if (!username || !password) {
      console.log(`[AUTH] Error: Faltan credenciales`)
      return NextResponse.json({ success: false, error: "Se requiere nombre de usuario y contraseña" }, { status: 400 })
    }

    // Usar la autenticación directa en lugar de depender de localStorage
    const user = authenticateUserDirect(username, password)

    if (!user) {
      console.log(`[AUTH] Error: Credenciales inválidas para ${username}`)
      return NextResponse.json({ success: false, error: "Nombre de usuario o contraseña incorrectos" }, { status: 401 })
    }

    console.log(`[AUTH] Usuario autenticado correctamente: ${username}, rol: ${user.role}`)

    // Generar token JWT
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    })

    // Configurar cookie con el token
    const response = NextResponse.json(
      {
        success: true,
        token: token, // Incluir el token en la respuesta para localStorage
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    )

    // Establecer cookie con configuración optimizada para producción
    response.cookies.set({
      name: "token", // Usar el mismo nombre que espera el middleware
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Permite redirecciones desde otros sitios
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response
  } catch (error) {
    console.error("[AUTH] Error en login:", error)
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 })
  }
}
