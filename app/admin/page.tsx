"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Users,
  Car,
  Package,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
  MessageSquare,
  Loader2,
} from "lucide-react"
import { AdminAuthCheck } from "@/components/admin-auth-check"

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  })

  // Cargar estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // En un entorno real, aquí cargaríamos las estadísticas desde la API
        // Por ahora, usamos datos de ejemplo
        setStats({
          users: 124,
          products: 18,
          orders: 56,
          revenue: 285600,
        })
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <AdminAuthCheck>
      {loading ? (
        <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg">Cargando panel de administración...</p>
        </div>
      ) : (
        <div className="container py-12">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">
                Bienvenido al panel de administración de EcoDrive. Gestiona usuarios, productos y órdenes.
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="analytics">Analíticas</TabsTrigger>
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.users}</div>
                      <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/admin/usuarios" className="w-full">
                        <Button variant="outline" className="w-full">
                          Ver Usuarios
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Productos</CardTitle>
                      <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.products}</div>
                      <p className="text-xs text-muted-foreground">+2 nuevos esta semana</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/admin/productos" className="w-full">
                        <Button variant="outline" className="w-full">
                          Ver Productos
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.orders}</div>
                      <p className="text-xs text-muted-foreground">+8 nuevas esta semana</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/admin/ordenes" className="w-full">
                        <Button variant="outline" className="w-full">
                          Ver Órdenes
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">+15% desde el mes pasado</p>
                    </CardContent>
                    <CardFooter>
                      <Link href="/admin/reportes" className="w-full">
                        <Button variant="outline" className="w-full">
                          Ver Reportes
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Acciones Rápidas</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 grid-cols-2 md:grid-cols-3">
                      <Link href="/admin/usuarios/nuevo">
                        <Button
                          variant="outline"
                          className="w-full h-24 flex flex-col gap-2 items-center justify-center"
                        >
                          <Users className="h-6 w-6" />
                          <span>Nuevo Usuario</span>
                        </Button>
                      </Link>
                      <Link href="/admin/productos/nuevo">
                        <Button
                          variant="outline"
                          className="w-full h-24 flex flex-col gap-2 items-center justify-center"
                        >
                          <Car className="h-6 w-6" />
                          <span>Nuevo Producto</span>
                        </Button>
                      </Link>
                      <Link href="/admin/ordenes/nuevo">
                        <Button
                          variant="outline"
                          className="w-full h-24 flex flex-col gap-2 items-center justify-center"
                        >
                          <ShoppingCart className="h-6 w-6" />
                          <span>Nueva Orden</span>
                        </Button>
                      </Link>
                      <Link href="/admin/soporte">
                        <Button
                          variant="outline"
                          className="w-full h-24 flex flex-col gap-2 items-center justify-center"
                        >
                          <MessageSquare className="h-6 w-6" />
                          <span>Soporte</span>
                        </Button>
                      </Link>
                      <Link href="/admin/faqs">
                        <Button
                          variant="outline"
                          className="w-full h-24 flex flex-col gap-2 items-center justify-center"
                        >
                          <HelpCircle className="h-6 w-6" />
                          <span>FAQ</span>
                        </Button>
                      </Link>
                      <Link href="/admin/configuracion">
                        <Button
                          variant="outline"
                          className="w-full h-24 flex flex-col gap-2 items-center justify-center"
                        >
                          <Settings className="h-6 w-6" />
                          <span>Configuración</span>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Actividad Reciente</CardTitle>
                      <CardDescription>Últimas acciones en el sistema</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nueva orden #1234</p>
                          <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nuevo usuario registrado</p>
                          <p className="text-xs text-muted-foreground">Hace 4 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Producto actualizado: Tesla Model Y</p>
                          <p className="text-xs text-muted-foreground">Hace 6 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Orden cancelada #1230</p>
                          <p className="text-xs text-muted-foreground">Hace 8 horas</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nueva consulta de soporte</p>
                          <p className="text-xs text-muted-foreground">Hace 12 horas</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analíticas</CardTitle>
                    <CardDescription>Visualización de datos y estadísticas</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Módulo de Analíticas</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4">
                        Accede a reportes detallados y estadísticas.
                      </p>
                      <Link href="/admin/reportes">
                        <Button>Ver Reportes Completos</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración</CardTitle>
                    <CardDescription>Administra las configuraciones del sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Módulo de Configuración</h3>
                      <p className="text-sm text-muted-foreground mt-2 mb-4">
                        Ajusta las preferencias y configuraciones del sistema.
                      </p>
                      <Link href="/admin/configuracion">
                        <Button>Ir a Configuración</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </AdminAuthCheck>
  )
}
