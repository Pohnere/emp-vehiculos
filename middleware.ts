import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/jwt"

// Rutas que requieren autenticación
const authRoutes = ["/perfil", "/mis-ordenes", "/favoritos", "/carrito/orden/finalizar"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log(`[MIDDLEWARE] Verificando acceso a: ${pathname}`)

  // Obtener token de la cookie - IMPORTANTE: Usar "token" en lugar de "auth-token"
  const token = request.cookies.get("token")?.value

  // Si no hay token, verificar si es una ruta protegida (EXCEPTO ADMIN)
  if (!token) {
    console.log(`[MIDDLEWARE] No se encontró token de autenticación`)

    // SOLUCIÓN TEMPORAL: Ya no bloqueamos el acceso a rutas de administrador
    // La verificación se hará en el componente cliente

    // Verificar rutas que requieren autenticación (excepto admin)
    if (authRoutes.some((route) => pathname.startsWith(route))) {
      console.log(`[MIDDLEWARE] Acceso denegado a ruta protegida: ${pathname}`)
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url))
    }

    return NextResponse.next()
  }

  try {
    // Verificar token JWT
    const payload = verifyToken(token)

    if (!payload) {
      console.log(`[MIDDLEWARE] Token inválido`)
      // Token inválido, eliminar cookie y redirigir a login
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")
      return response
    }

    console.log(`[MIDDLEWARE] Usuario autenticado: ${payload.username}, rol: ${payload.role}`)

    // SOLUCIÓN TEMPORAL: Ya no redirigimos a no-autorizado
    // La verificación se hará en el componente cliente

    // Añadir información del usuario al request para que esté disponible en los componentes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-user-id", payload.id)
    requestHeaders.set("x-user-role", payload.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error("[MIDDLEWARE] Error al verificar token:", error)
    // En caso de error, redirigir a login
    const response = NextResponse.redirect(new URL("/login", request.url))
    response.cookies.delete("token")
    return response
  }
}

export const config = {
  matcher: ["/perfil/:path*", "/carrito/orden/:path*", "/mis-ordenes/:path*", "/favoritos/:path*"],
  // SOLUCIÓN TEMPORAL: Eliminamos "/admin/:path*" del matcher para permitir acceso
}
