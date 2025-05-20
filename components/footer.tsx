import Link from "next/link"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">EcoDrive</h3>
            <p className="text-sm text-muted-foreground">
              Movilidad sostenible para un futuro mejor. Vehículos eléctricos y autónomos de última generación.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-sm text-muted-foreground hover:text-primary">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/soporte" className="text-sm text-muted-foreground hover:text-primary">
                  Soporte
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contacto</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>Calle Principal 123</p>
              <p>Ciudad, CP 12345</p>
              <p>soporte@ecodrive.com</p>
              <p>+1 (555) 123-4567</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EcoDrive. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
