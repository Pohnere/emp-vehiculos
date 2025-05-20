import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselItem } from "@/components/carousel"

export default function SobreNosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge className="inline-flex bg-primary text-primary-foreground" variant="secondary">
                  Nuestra Historia
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Sobre EcoDrive
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Somos una empresa comprometida con la innovación sostenible y la movilidad del futuro. Desde nuestra
                  fundación en 2015, hemos trabajado para revolucionar la industria automotriz con vehículos eléctricos
                  y autónomos de alta calidad.
                </p>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[800px] overflow-hidden rounded-xl">
              <Image
                src="/sustainability-award.png"
                alt="Equipo de EcoDrive recibiendo premio de sostenibilidad"
                width={800}
                height={500}
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Misión
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Transformando la movilidad</h2>
              <p className="text-muted-foreground md:text-xl">
                Nuestra misión es acelerar la transición mundial hacia la movilidad sostenible, ofreciendo vehículos
                eléctricos y autónomos que no comprometan el rendimiento, la seguridad ni la comodidad.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Reducir las emisiones de carbono</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Democratizar la tecnología eléctrica</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Innovar constantemente en seguridad y autonomía</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Visión
              </div>
              <h2 className="text-3xl font-bold tracking-tighter">Un futuro más limpio</h2>
              <p className="text-muted-foreground md:text-xl">
                Visualizamos un mundo donde la movilidad eléctrica sea la norma, no la excepción. Donde cada vehículo en
                la carretera contribuya a un planeta más limpio y saludable para las generaciones futuras.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Liderazgo en innovación sostenible</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Infraestructura de carga global</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Conducción autónoma de nivel 5</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo - Carrusel */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground" variant="secondary">
                Nuestro Equipo
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Conoce a nuestros líderes</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Un equipo apasionado por la innovación y la sostenibilidad.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl">
            <Carousel className="w-full h-[400px]">
              <CarouselItem imageUrl="/team-member-1.jpg" imageAlt="Ernesto Alejandro Ramos Díaz - CEO">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <h3 className="text-2xl font-bold mb-2">Ernesto Alejandro Ramos Díaz</h3>
                  <p className="text-white font-medium mb-4">CEO y Fundador</p>
                  <p className="text-base">
                    Con más de 15 años de experiencia en el sector automotriz y energético, Ernesto fundó EcoDrive con
                    la visión de transformar la movilidad urbana.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem imageUrl="/team-member-2.jpg" imageAlt="Robert Alejandro Collado - CTO">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <h3 className="text-2xl font-bold mb-2">Robert Alejandro Collado</h3>
                  <p className="text-white font-medium mb-4">Director de Tecnología</p>
                  <p className="text-base">
                    Ingeniero especializado en sistemas de propulsión eléctrica y software de conducción autónoma,
                    lidera nuestro equipo de innovación.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem
                imageUrl="/team-member-3.jpg"
                imageAlt="Ernesto Alejandro Gimenes - Director de Sostenibilidad"
              >
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <h3 className="text-2xl font-bold mb-2">Ernesto Alejandro Gimenes</h3>
                  <p className="text-white font-medium mb-4">Director de Sostenibilidad</p>
                  <p className="text-base">
                    Experto en energías renovables y economía circular, asegura que cada aspecto de nuestros vehículos y
                    operaciones sea sostenible.
                  </p>
                </div>
              </CarouselItem>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Nuestras Instalaciones - Carrusel */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground" variant="secondary">
                Instalaciones
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Donde la innovación cobra vida
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Nuestras instalaciones de vanguardia donde diseñamos y fabricamos el futuro de la movilidad.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-5xl">
            <Carousel className="w-full h-[400px]">
              <CarouselItem imageUrl="/facility-1.jpg" imageAlt="Centro de Investigación y Desarrollo">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <h3 className="text-2xl font-bold mb-2">Centro de Investigación y Desarrollo</h3>
                  <p className="text-white font-medium mb-4">La Habana, Cuba</p>
                  <p className="text-base">
                    Nuestro centro principal de I+D donde diseñamos y probamos las tecnologías del futuro.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem imageUrl="/facility-2.jpg" imageAlt="Planta de Producción Principal">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <h3 className="text-2xl font-bold mb-2">Planta de Producción Principal</h3>
                  <p className="text-white font-medium mb-4">Santiago de Cuba, Cuba</p>
                  <p className="text-base">
                    Fábrica de última generación con certificación de cero emisiones y energía 100% renovable.
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem imageUrl="/facility-3.jpg" imageAlt="Centro de Pruebas">
                <div className="bg-primary/90 p-6 rounded-lg text-white">
                  <h3 className="text-2xl font-bold mb-2">Centro de Pruebas</h3>
                  <p className="text-white font-medium mb-4">Varadero, Cuba</p>
                  <p className="text-base">
                    Circuito cerrado donde ponemos a prueba el rendimiento y seguridad de nuestros vehículos.
                  </p>
                </div>
              </CarouselItem>
            </Carousel>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground" variant="secondary">
                Valores
              </Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Los principios que nos guían
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Estos valores fundamentales definen quiénes somos y cómo operamos.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Integridad</h3>
              <p className="text-muted-foreground">
                Actuamos con honestidad y transparencia en todo lo que hacemos, manteniendo los más altos estándares
                éticos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary"
                >
                  <path d="M2 12h20" />
                  <path d="M12 2v20" />
                  <path d="m4.93 4.93 14.14 14.14" />
                  <path d="m19.07 4.93-14.14 14.14" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Innovación</h3>
              <p className="text-muted-foreground">
                Buscamos constantemente nuevas formas de mejorar nuestros productos y servicios, desafiando el status
                quo.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m7 10 3 3 7-7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Excelencia</h3>
              <p className="text-muted-foreground">
                Nos esforzamos por alcanzar los más altos estándares de calidad en todo lo que hacemos, sin compromisos.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary"
                >
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Sostenibilidad</h3>
              <p className="text-muted-foreground">
                Cada decisión que tomamos considera su impacto en el medio ambiente y en las generaciones futuras.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Colaboración</h3>
              <p className="text-muted-foreground">
                Trabajamos juntos, valorando la diversidad de perspectivas para lograr objetivos comunes.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="p-3 rounded-full bg-primary/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-primary"
                >
                  <path d="M12 2v4" />
                  <path d="m6.41 6.41 2.83 2.83" />
                  <path d="M2 12h4" />
                  <path d="m6.41 17.59 2.83-2.83" />
                  <path d="M12 18v4" />
                  <path d="m17.59 17.59-2.83-2.83" />
                  <path d="M18 12h4" />
                  <path d="m17.59 6.41-2.83 2.83" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Responsabilidad</h3>
              <p className="text-muted-foreground">
                Asumimos la responsabilidad de nuestras acciones y su impacto en la sociedad y el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Únete a nuestra misión</h2>
              <p className="max-w-[900px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Descubre cómo puedes ser parte del cambio hacia un futuro más sostenible.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/catalogo">
                <Button size="lg" variant="secondary" className="gap-1">
                  Ver nuestros vehículos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/soporte">
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground">
                  Contactar con nosotros
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
