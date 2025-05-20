import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselItem } from "@/components/carousel"
import { ArrowRight, Zap, Shield, Leaf } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section con Carrusel */}
      <section className="w-full py-8 md:py-12 lg:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge className="inline-flex bg-primary text-primary-foreground" variant="secondary">
                  Innovación Sostenible
                </Badge>
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl lg:text-5xl">
                  El futuro de la movilidad está aquí
                </h1>
                <p className="max-w-[600px] text-muted-foreground text-sm md:text-base lg:text-xl">
                  Descubre nuestra gama de vehículos eléctricos y autónomos. Tecnología de vanguardia con cero
                  emisiones.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Link href="/catalogo">
                  <Button size="lg" className="w-full sm:w-auto gap-1">
                    Ver catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/sobre-nosotros">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto mt-2 sm:mt-0">
                    Conoce más
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[800px] overflow-hidden rounded-xl mt-6 lg:mt-0">
              <Carousel className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
                <CarouselItem imageUrl="/electric-car-1.png" imageAlt="Vehículo eléctrico de lujo">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Modelo Luxury S</h2>
                  <p className="text-sm md:text-lg text-white">Elegancia y rendimiento en perfecta armonía</p>
                </CarouselItem>
                <CarouselItem imageUrl="/electric-car-2.png" imageAlt="SUV eléctrico">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Crossover X</h2>
                  <p className="text-sm md:text-lg text-white">Versatilidad para todas tus aventuras</p>
                </CarouselItem>
                <CarouselItem imageUrl="/electric-car-3.png" imageAlt="Compacto eléctrico">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Urban Mini</h2>
                  <p className="text-sm md:text-lg text-white">La solución perfecta para la ciudad</p>
                </CarouselItem>
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground" variant="secondary">
                Ventajas
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                ¿Por qué elegir vehículos eléctricos?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre los beneficios de la movilidad eléctrica y por qué cada vez más personas están haciendo el
                cambio.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Leaf className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Ecológico</h3>
                <p className="text-muted-foreground">Cero emisiones de CO2. Contribuye a un planeta más limpio.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Eficiente</h3>
                <p className="text-muted-foreground">Mayor eficiencia energética y menor costo de mantenimiento.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Seguro</h3>
                <p className="text-muted-foreground">Tecnología avanzada de asistencia a la conducción.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modelos Destacados */}
      <section className="w-full py-8 md:py-12 lg:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground" variant="secondary">
                Destacados
              </Badge>
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Nuestros modelos populares
              </h2>
              <p className="max-w-[900px] text-muted-foreground text-sm md:text-base lg:text-xl">
                Explora nuestra selección de vehículos más vendidos y descubre por qué son tan populares.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-6 md:py-12">
            <Carousel className="w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
              <CarouselItem imageUrl="/luxury-electric-sedan.png" imageAlt="Sedán eléctrico de lujo">
                <div className="bg-primary/90 p-3 md:p-6 rounded-lg text-white">
                  <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Luxury Electric Sedan</h2>
                  <p className="text-base md:text-lg mb-2 md:mb-4">Desde $65,000</p>
                  <Link href="/catalogo/1">
                    <Button>Ver detalles</Button>
                  </Link>
                </div>
              </CarouselItem>
              <CarouselItem imageUrl="/crossover-ev.png" imageAlt="Crossover eléctrico">
                <div className="bg-primary/90 p-3 md:p-6 rounded-lg text-white">
                  <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Crossover EV</h2>
                  <p className="text-base md:text-lg mb-2 md:mb-4">Desde $55,000</p>
                  <Link href="/catalogo/2">
                    <Button>Ver detalles</Button>
                  </Link>
                </div>
              </CarouselItem>
              <CarouselItem imageUrl="/mini-electric-car.png" imageAlt="Mini coche eléctrico">
                <div className="bg-primary/90 p-3 md:p-6 rounded-lg text-white">
                  <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">Mini Electric</h2>
                  <p className="text-base md:text-lg mb-2 md:mb-4">Desde $35,000</p>
                  <Link href="/catalogo/3">
                    <Button>Ver detalles</Button>
                  </Link>
                </div>
              </CarouselItem>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground" variant="secondary">
                Testimonios
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Lo que dicen nuestros clientes
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Experiencias reales de propietarios de vehículos EcoDrive.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl py-12">
            <Carousel className="w-full h-[300px]">
              <CarouselItem imageUrl="/team-member-1.jpg" imageAlt="Cliente satisfecho">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <p className="text-lg italic mb-4">
                    "Mi Luxury S ha superado todas mis expectativas. La autonomía es excelente y la experiencia de
                    conducción es incomparable."
                  </p>
                  <p className="font-bold">Carlos Rodríguez, La Habana</p>
                </div>
              </CarouselItem>
              <CarouselItem imageUrl="/team-member-2.jpg" imageAlt="Cliente satisfecho">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <p className="text-lg italic mb-4">
                    "Cambiar a un vehículo eléctrico ha sido la mejor decisión. Ahorro en combustible y mantenimiento, y
                    además contribuyo al medio ambiente."
                  </p>
                  <p className="font-bold">Ana Martínez, Santiago de Cuba</p>
                </div>
              </CarouselItem>
              <CarouselItem imageUrl="/team-member-3.jpg" imageAlt="Cliente satisfecho">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <p className="text-lg italic mb-4">
                    "El Urban Mini es perfecto para la ciudad. Fácil de aparcar, ágil en el tráfico y con suficiente
                    autonomía para mis desplazamientos diarios."
                  </p>
                  <p className="font-bold">Miguel Sánchez, Varadero</p>
                </div>
              </CarouselItem>
            </Carousel>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Únete a la revolución eléctrica
              </h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre nuestro catálogo completo y encuentra el vehículo perfecto para ti.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/catalogo">
                <Button size="lg" variant="secondary" className="gap-1">
                  Explorar catálogo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/soporte">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground">
                  Contactar con un asesor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
