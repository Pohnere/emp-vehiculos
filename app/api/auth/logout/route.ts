import { NextResponse } from "next/server"

// Asegurarse de que se elimine la cookie correcta
export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete("auth-token")
  return response
}
