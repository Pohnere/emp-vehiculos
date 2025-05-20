// Implementación simplificada de JWT para el entorno de desarrollo
// En producción, se recomienda usar jose o next-auth

interface JwtPayload {
  id: number
  username: string
  name: string
  email: string
  role: string
  exp?: number
}

// Clave secreta (en producción debería estar en variables de entorno)
const JWT_SECRET = "ecovehicles_jwt_secret_key_2024"

// Función para codificar en base64
function base64Encode(str: string): string {
  if (typeof window !== "undefined") {
    return btoa(str)
  }
  return Buffer.from(str).toString("base64")
}

// Función para decodificar base64
function base64Decode(str: string): string {
  if (typeof window !== "undefined") {
    return atob(str)
  }
  return Buffer.from(str, "base64").toString()
}

// Generar token JWT simplificado
export function generateToken(payload: JwtPayload): string {
  // Añadir tiempo de expiración (7 días)
  const expiresIn = 7 * 24 * 60 * 60 // 7 días en segundos
  const now = Math.floor(Date.now() / 1000)

  const data = {
    ...payload,
    exp: now + expiresIn,
  }

  // Crear header
  const header = {
    alg: "HS256",
    typ: "JWT",
  }

  // Codificar header y payload
  const encodedHeader = base64Encode(JSON.stringify(header))
  const encodedPayload = base64Encode(JSON.stringify(data))

  // Crear firma (en una implementación real, esto sería una firma HMAC-SHA256)
  // Aquí simplificamos para evitar dependencias externas
  const signature = base64Encode(
    JSON.stringify({
      data: `${encodedHeader}.${encodedPayload}`,
      secret: JWT_SECRET,
    }),
  )

  // Devolver token JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// Verificar token JWT
export function verifyToken(token: string): JwtPayload | null {
  try {
    // Dividir token en partes
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    // Decodificar payload
    const payload = JSON.parse(base64Decode(parts[1])) as JwtPayload

    // Verificar expiración
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    // En una implementación real, verificaríamos la firma aquí

    return payload
  } catch (error) {
    console.error("Error al verificar token JWT:", error)
    return null
  }
}
