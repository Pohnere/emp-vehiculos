"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3, Download, Loader2, TrendingUp, Users, ShoppingCart, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Componente para gráfico de barras simulado
function BarChartSimulation({ data, title }: { data: any[]; title: string }) {
  const maxValue = Math.max(...data.map((item) => item.value))

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.label}</span>
              <span className="font-medium">{item.value.toLocaleString()}</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${(item.value / maxValue) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ReportesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("mes")
  const [selectedYear, setSelectedYear] = useState("2023")
  const [activeTab, setActiveTab] = useState("ventas")
  const [error, setError] = useState<string | null>(null)

  // Datos simulados para los reportes
  const [reportData, setReportData] = useState({
    ventas: {
      total: 285600,
      promedio: 9520,
      crecimiento: 15,
      porCategoria: [
        { label: "Sedán", value: 145000 },
        { label: "SUV", value: 85000 },
        { label: "Crossover", value: 35600 },
        { label: "Mini", value: 20000 },
      ],
      porMes: [
        { label: "Ene", value: 18500 },
        { label: "Feb", value: 22000 },
        { label: "Mar", value: 25600 },
        { label: "Abr", value: 19800 },
        { label: "May", value: 28500 },
        { label: "Jun", value: 32000 },
        { label: "Jul", value: 27500 },
        { label: "Ago", value: 30000 },
        { label: "Sep", value: 33500 },
        { label: "Oct", value: 29800 },
        { label: "Nov", value: 0 },
        { label: "Dic", value: 0 },
      ],
    },
    usuarios: {
      total: 124,
      nuevos: 18,
      activos: 98,
      inactivos: 26,
      porMes: [
        { label: "Ene", value: 8 },
        { label: "Feb", value: 12 },
        { label: "Mar", value: 15 },
        { label: "Abr", value: 10 },
        { label: "May", value: 14 },
        { label: "Jun", value: 18 },
        { label: "Jul", value: 12 },
        { label: "Ago", value: 16 },
        { label: "Sep", value: 19 },
        { label: "Oct", value: 0 },
        { label: "Nov", value: 0 },
        { label: "Dic", value: 0 },
      ],
    },
    productos: {
      total: 18,
      masVendidos: [
        { label: "Model E", value: 12 },
        { label: "Model X", value: 8 },
        { label: "Model M", value: 6 },
        { label: "Roadster", value: 4 },
        { label: "SUV Premium", value: 3 },
      ],
      porCategoria: [
        { label: "Sedán", value: 6 },
        { label: "SUV", value: 4 },
        { label: "Crossover", value: 3 },
        { label: "Mini", value: 3 },
        { label: "Deportivo", value: 2 },
      ],
    },
  })

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (user.role !== "admin") {
          console.log("[ADMIN] Acceso denegado. Rol:", user.role)
          router.push("/no-autorizado?from=admin")
        }
      } catch (error) {
        console.error("[ADMIN] Error al verificar rol:", error)
        router.push("/login?redirect=/admin/reportes")
      }
    }

    const loadReportData = () => {
      // Simulación de carga de datos
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    }

    checkAuth()
    loadReportData()
  }, [router])

  // Cambiar datos según el período seleccionado
  useEffect(() => {
    // En una aplicación real, aquí cargaríamos datos diferentes según el período
    // Por ahora, solo simulamos un cambio en los datos
    if (selectedPeriod === "semana") {
      setReportData({
        ...reportData,
        ventas: {
          ...reportData.ventas,
          total: 65400,
          promedio: 9342,
          crecimiento: 8,
        },
        usuarios: {
          ...reportData.usuarios,
          nuevos: 5,
        },
      })
    } else if (selectedPeriod === "mes") {
      setReportData({
        ...reportData,
        ventas: {
          ...reportData.ventas,
          total: 285600,
          promedio: 9520,
          crecimiento: 15,
        },
        usuarios: {
          ...reportData.usuarios,
          nuevos: 18,
        },
      })
    } else if (selectedPeriod === "año") {
      setReportData({
        ...reportData,
        ventas: {
          ...reportData.ventas,
          total: 3427200,
          promedio: 9520,
          crecimiento: 22,
        },
        usuarios: {
          ...reportData.usuarios,
          nuevos: 124,
        },
      })
    }
  }, [selectedPeriod])

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    try {
      let csvContent = ""
      let fileName = ""
      const data: any[] = []

      // Preparar datos según la pestaña activa
      if (activeTab === "ventas") {
        fileName = `ventas_${selectedPeriod}_${selectedYear}.csv`

        // Encabezados para ventas por categoría
        csvContent = "Categoría,Valor\n"

        // Datos de ventas por categoría
        reportData.ventas.porCategoria.forEach((item) => {
          csvContent += `${item.label},${item.value}\n`
        })

        // Agregar línea en blanco y encabezados para ventas mensuales
        csvContent += "\nMes,Valor\n"

        // Datos de ventas mensuales
        reportData.ventas.porMes.forEach((item) => {
          csvContent += `${item.label},${item.value}\n`
        })

        // Agregar resumen
        csvContent += `\nTotal,${reportData.ventas.total}\n`
        csvContent += `Promedio,${reportData.ventas.promedio}\n`
        csvContent += `Crecimiento,${reportData.ventas.crecimiento}%\n`
      } else if (activeTab === "usuarios") {
        fileName = `usuarios_${selectedPeriod}_${selectedYear}.csv`

        // Encabezados para usuarios por mes
        csvContent = "Mes,Nuevos Usuarios\n"

        // Datos de usuarios por mes
        reportData.usuarios.porMes.forEach((item) => {
          csvContent += `${item.label},${item.value}\n`
        })

        // Agregar resumen
        csvContent += `\nTotal Usuarios,${reportData.usuarios.total}\n`
        csvContent += `Nuevos Usuarios,${reportData.usuarios.nuevos}\n`
        csvContent += `Usuarios Activos,${reportData.usuarios.activos}\n`
        csvContent += `Usuarios Inactivos,${reportData.usuarios.inactivos}\n`
      } else if (activeTab === "productos") {
        fileName = `productos_${selectedYear}.csv`

        // Encabezados para productos más vendidos
        csvContent = "Producto,Unidades Vendidas\n"

        // Datos de productos más vendidos
        reportData.productos.masVendidos.forEach((item) => {
          csvContent += `${item.label},${item.value}\n`
        })

        // Agregar línea en blanco y encabezados para productos por categoría
        csvContent += "\nCategoría,Cantidad\n"

        // Datos de productos por categoría
        reportData.productos.porCategoria.forEach((item) => {
          csvContent += `${item.label},${item.value}\n`
        })

        // Agregar total
        csvContent += `\nTotal Productos,${reportData.productos.total}\n`
      }

      // Crear blob y descargar
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Exportación exitosa",
        description: `El archivo ${fileName} se ha descargado correctamente.`,
      })
    } catch (error) {
      console.error("Error al exportar datos:", error)
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar los datos. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando reportes...</p>
      </div>
    )
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al dashboard
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reportes y Estadísticas</h1>
            <p className="text-muted-foreground">Análisis de ventas, usuarios y productos</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semana">Última semana</SelectItem>
                <SelectItem value="mes">Último mes</SelectItem>
                <SelectItem value="año">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2" onClick={exportToCSV}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="ventas" className="space-y-4" onValueChange={setActiveTab} value={activeTab}>
          <TabsList>
            <TabsTrigger value="ventas" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Ventas
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="productos" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Productos
            </TabsTrigger>
          </TabsList>

          {/* Contenido de Ventas */}
          <TabsContent value="ventas" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${reportData.ventas.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-500 font-medium">+{reportData.ventas.crecimiento}%</span> desde el
                    período anterior
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Venta Promedio</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${reportData.ventas.promedio.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Por orden</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Período</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {selectedPeriod === "semana"
                      ? "Última Semana"
                      : selectedPeriod === "mes"
                        ? "Último Mes"
                        : "Último Año"}
                  </div>
                  <p className="text-xs text-muted-foreground">{selectedYear}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Ventas por Categoría</CardTitle>
                  <CardDescription>Distribución de ventas por tipo de vehículo</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartSimulation data={reportData.ventas.porCategoria} title="Ventas ($)" />
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Ventas Mensuales</CardTitle>
                  <CardDescription>Evolución de ventas durante el año</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartSimulation data={reportData.ventas.porMes} title="Ventas ($)" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contenido de Usuarios */}
          <TabsContent value="usuarios" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.usuarios.total}</div>
                  <p className="text-xs text-muted-foreground">Usuarios registrados</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nuevos Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.usuarios.nuevos}</div>
                  <p className="text-xs text-muted-foreground">En este período</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.usuarios.activos}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((reportData.usuarios.activos / reportData.usuarios.total) * 100)}% del total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.usuarios.inactivos}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round((reportData.usuarios.inactivos / reportData.usuarios.total) * 100)}% del total
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Nuevos Usuarios por Mes</CardTitle>
                <CardDescription>Evolución de registros durante el año</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChartSimulation data={reportData.usuarios.porMes} title="Nuevos usuarios" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contenido de Productos */}
          <TabsContent value="productos" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                  <CardDescription>Top 5 vehículos con más ventas</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartSimulation data={reportData.productos.masVendidos} title="Unidades vendidas" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Productos por Categoría</CardTitle>
                  <CardDescription>Distribución de productos por tipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChartSimulation data={reportData.productos.porCategoria} title="Cantidad de productos" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
