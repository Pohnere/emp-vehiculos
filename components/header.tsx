"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Menu,
  ShoppingCart,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  Package,
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Info,
  Home,
  Car,
  LogIn,
  UserPlus,
  Settings,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Traducciones
const translations = {
  es: {
    home: "Inicio",
    catalog: "Catálogo",
    support: "Soporte",
    faq: "FAQ",
    aboutUs: "Sobre Nosotros",
    admin: {
      dashboard: "Dashboard",
      users: "Usuarios",
      products: "Productos",
      orders: "Órdenes",
      support: "Soporte",
      faqs: "FAQs",
      reports: "Reportes",
      settings: "Configuración",
      panel: "Panel de Administración",
    },
    user: {
      profile: "Mi Perfil",
      orders: "Mis Pedidos",
      favorites: "Favoritos",
      logout: "Cerrar Sesión",
      login: "Iniciar Sesión",
      register: "Registrarse",
    },
    cart: "Carrito de compras",
  },
  en: {
    home: "Home",
    catalog: "Catalog",
    support: "Support",
    faq: "FAQ",
    aboutUs: "About Us",
    admin: {
      dashboard: "Dashboard",
      users: "Users",
      products: "Products",
      orders: "Orders",
      support: "Support",
      faqs: "FAQs",
      reports: "Reports",
      settings: "Settings",
      panel: "Admin Panel",
    },
    user: {
      profile: "My Profile",
      orders: "My Orders",
      favorites: "Favorites",
      logout: "Logout",
      login: "Login",
      register: "Register",
    },
    cart: "Shopping cart",
  },
  fr: {
    home: "Accueil",
    catalog: "Catalogue",
    support: "Support",
    faq: "FAQ",
    aboutUs: "À Propos",
    admin: {
      dashboard: "Tableau de bord",
      users: "Utilisateurs",
      products: "Produits",
      orders: "Commandes",
      support: "Support",
      faqs: "FAQs",
      reports: "Rapports",
      settings: "Paramètres",
      panel: "Panneau d'administration",
    },
    user: {
      profile: "Mon Profil",
      orders: "Mes Commandes",
      favorites: "Favoris",
      logout: "Déconnexion",
      login: "Connexion",
      register: "S'inscrire",
    },
    cart: "Panier d'achat",
  },
  de: {
    home: "Startseite",
    catalog: "Katalog",
    support: "Support",
    faq: "FAQ",
    aboutUs: "Über Uns",
    admin: {
      dashboard: "Dashboard",
      users: "Benutzer",
      products: "Produkte",
      orders: "Bestellungen",
      support: "Support",
      faqs: "FAQs",
      reports: "Berichte",
      settings: "Einstellungen",
      panel: "Administrationsbereich",
    },
    user: {
      profile: "Mein Profil",
      orders: "Meine Bestellungen",
      favorites: "Favoriten",
      logout: "Abmelden",
      login: "Anmelden",
      register: "Registrieren",
    },
    cart: "Einkaufswagen",
  },
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [language, setLanguage] = useState("es")
  const [t, setT] = useState(translations.es)

  // Verificar si el usuario está autenticado al cargar el componente
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)

        // Obtener usuario del localStorage
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
        }

        // Obtener cantidad de items en el carrito
        const cart = localStorage.getItem("cart")
        if (cart) {
          const cartData = JSON.parse(cart)
          const itemCount = cartData.reduce((total: number, item: any) => total + item.quantity, 0)
          setCartItemCount(itemCount)
        }

        // Obtener idioma
        const storedLanguage = localStorage.getItem("language")
        if (storedLanguage) {
          setLanguage(storedLanguage)
        }
      } catch (error) {
        console.error("Error al verificar autenticación:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Escuchar cambios en el localStorage para actualizar el carrito
    const handleStorageChange = () => {
      const cart = localStorage.getItem("cart")
      if (cart) {
        const cartData = JSON.parse(cart)
        const itemCount = cartData.reduce((total: number, item: any) => total + item.quantity, 0)
        setCartItemCount(itemCount)
      } else {
        setCartItemCount(0)
      }

      // Actualizar idioma si cambia
      const storedLanguage = localStorage.getItem("language")
      if (storedLanguage && storedLanguage !== language) {
        setLanguage(storedLanguage)
      }
    }

    // Escuchar cambios en el idioma
    const handleLanguageChange = () => {
      const storedLanguage = localStorage.getItem("language")
      if (storedLanguage) {
        setLanguage(storedLanguage)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("languageChange", handleLanguageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languageChange", handleLanguageChange)
    }
  }, [pathname, language])

  // Actualizar traducciones cuando cambia el idioma
  useEffect(() => {
    setT(translations[language as keyof typeof translations])
  }, [language])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  // Rutas comunes para todos los usuarios
  const commonRoutes = [
    { href: "/", label: t.home, icon: <Home className="h-4 w-4 mr-2" /> },
    { href: "/catalogo", label: t.catalog, icon: <Car className="h-4 w-4 mr-2" /> },
    { href: "/soporte", label: t.support, icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { href: "/faq", label: t.faq, icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { href: "/sobre-nosotros", label: t.aboutUs, icon: <Info className="h-4 w-4 mr-2" /> },
  ]

  // Rutas específicas para administradores
  const adminRoutes = [
    { href: "/admin", label: t.admin.dashboard, icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { href: "/admin/usuarios", label: t.admin.users, icon: <User className="h-4 w-4 mr-2" /> },
    { href: "/admin/productos", label: t.admin.products, icon: <Package className="h-4 w-4 mr-2" /> },
    { href: "/admin/ordenes", label: t.admin.orders, icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
    { href: "/admin/soporte", label: t.admin.support, icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { href: "/admin/faqs", label: t.admin.faqs, icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { href: "/admin/reportes", label: t.admin.reports, icon: <HelpCircle className="h-4 w-4 mr-2" /> },
    { href: "/admin/configuracion", label: t.admin.settings, icon: <Settings className="h-4 w-4 mr-2" /> },
  ]

  // Obtener iniciales del nombre para el avatar
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6">
                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                    EcoDrive
                  </span>
                </Link>

                {user && (
                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name,
                        )}&background=random&size=40`}
                      />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-1">
                  {commonRoutes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2 rounded-md hover:bg-muted transition-colors flex items-center ${
                        pathname === route.href
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {route.icon}
                      {route.label}
                    </Link>
                  ))}

                  {user && user.role === "admin" && (
                    <>
                      <div className="mt-4 mb-2 px-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {t.admin.panel}
                        </p>
                      </div>
                      {adminRoutes.map((route) => (
                        <Link
                          key={route.href}
                          href={route.href}
                          onClick={() => setIsOpen(false)}
                          className={`px-4 py-2 rounded-md hover:bg-muted transition-colors flex items-center ${
                            pathname === route.href
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {route.icon}
                          {route.label}
                        </Link>
                      ))}
                    </>
                  )}
                </nav>

                <div className="mt-auto">
                  {!user ? (
                    <div className="flex flex-col gap-2">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <LogIn className="h-4 w-4" />
                          {t.user.login}
                        </Button>
                      </Link>
                      <Link href="/registro" onClick={() => setIsOpen(false)}>
                        <Button className="w-full flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          {t.user.register}
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      className="w-full flex items-center gap-2"
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      {t.user.logout}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 hidden sm:flex">
              <div className="absolute inset-0 rounded-full bg-primary/10 flex items-center justify-center">
                <Car className="h-6 w-6 text-primary" />
              </div>
            </div>
            <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
              EcoDrive
            </span>
          </Link>
        </div>

        {/* Navegación principal - Escritorio */}
        <nav className="hidden md:flex items-center gap-6">
          {commonRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium flex items-center ${
                pathname === route.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              } transition-colors`}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}

          {/* Menú de administración para escritorio */}
          {user && user.role === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 px-2">
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  {t.admin.panel}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t.admin.panel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {adminRoutes.map((route) => (
                  <DropdownMenuItem key={route.href} asChild>
                    <Link href={route.href} className="flex items-center cursor-pointer w-full">
                      {route.icon}
                      {route.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        {/* Acciones de usuario */}
        <div className="flex items-center gap-2">
          {/* Carrito */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/carrito" className="relative">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {cartItemCount}
                      </Badge>
                    )}
                    <span className="sr-only">{t.cart}</span>
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t.cart}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Botones de autenticación o menú de usuario */}
          {!isLoading && (
            <>
              {!user ? (
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/login">
                          <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                            <LogIn className="h-5 w-5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t.user.login}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/registro">
                          <Button size="icon" className="rounded-full hidden md:flex">
                            <UserPlus className="h-5 w-5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t.user.register}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Versión móvil combinada */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="md:hidden">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="flex items-center cursor-pointer">
                          <LogIn className="mr-2 h-4 w-4" />
                          <span>{t.user.login}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/registro" className="flex items-center cursor-pointer">
                          <UserPlus className="mr-2 h-4 w-4" />
                          <span>{t.user.register}</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name,
                          )}&background=random&size=36`}
                        />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/perfil" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>{t.user.profile}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/mis-ordenes" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>{t.user.orders}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favoritos" className="cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>{t.user.favorites}</span>
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>{t.admin.panel}</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t.user.logout}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
