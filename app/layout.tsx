import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import Footer from "@/components/footer"
import { MaintenanceMode } from "@/components/maintenance-mode"
import { DataInitializer } from "@/components/data-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | EcoDrive",
    default: "EcoDrive - Vehículos Eléctricos y Autónomos",
  },
  description: "Descubre la nueva generación de vehículos eléctricos y autónomos con EcoDrive.",
  metadataBase: new URL("https://ecodrive.vercel.app"),
  openGraph: {
    title: "EcoDrive - Vehículos Eléctricos y Autónomos",
    description: "Descubre la nueva generación de vehículos eléctricos y autónomos con EcoDrive.",
    url: "https://ecodrive.vercel.app",
    siteName: "EcoDrive",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    title: "EcoDrive",
    card: "summary_large_image",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <DataInitializer />
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <MaintenanceMode />
        </ThemeProvider>
      </body>
    </html>
  )
}
