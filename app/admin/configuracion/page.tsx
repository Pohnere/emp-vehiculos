"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, RotateCcw, Moon, Sun, Bell } from "lucide-react"
import { Carousel, CarouselItem } from "@/components/carousel"
import Image from "next/image"

// Traducciones
const translations = {
  es: {
    title: "Configuración del Sistema",
    subtitle: "Administra las preferencias y configuraciones de la plataforma EcoDrive.",
    resetButton: "Restablecer",
    resettingButton: "Restableciendo...",
    saveButton: "Guardar cambios",
    savingButton: "Guardando...",
    tabs: {
      general: "General",
      appearance: "Apariencia",
      notifications: "Notificaciones",
      security: "Seguridad",
    },
    general: {
      title: "Configuración General",
      description: "Administra la configuración básica del sistema.",
      siteName: "Nombre del sitio",
      siteNameHelp: "Este nombre se mostrará en el título de la página y en los correos electrónicos.",
      language: "Idioma",
      languageHelp: "Idioma predeterminado para la interfaz de usuario.",
      maintenanceMode: "Modo de mantenimiento",
      maintenanceHelp: "Activa el modo de mantenimiento para realizar actualizaciones.",
    },
    appearance: {
      title: "Apariencia",
      description: "Personaliza la apariencia de la plataforma.",
      darkMode: "Modo oscuro",
      darkModeHelp: "Activa el modo oscuro para reducir la fatiga visual.",
      accentColor: "Color de acento",
      accentColorHelp: "Este color se utilizará para los elementos principales de la interfaz.",
      fontSize: "Tamaño de fuente",
      fontSizeHelp: "Tamaño de fuente predeterminado para la interfaz de usuario.",
      fontSizes: {
        small: "Pequeño",
        medium: "Mediano",
        large: "Grande",
      },
    },
    notifications: {
      title: "Notificaciones",
      description: "Configura las preferencias de notificaciones.",
      emailNotifications: "Notificaciones por correo",
      emailNotificationsHelp: "Recibe notificaciones por correo electrónico.",
      notificationTypes: "Tipos de notificaciones",
      newOrders: "Nuevas órdenes",
      newOrdersHelp: "Notificaciones cuando se realiza una nueva orden.",
      newUsers: "Nuevos usuarios",
      newUsersHelp: "Notificaciones cuando se registra un nuevo usuario.",
      supportQueries: "Consultas de soporte",
      supportQueriesHelp: "Notificaciones cuando se recibe una nueva consulta de soporte.",
      systemUpdates: "Actualizaciones del sistema",
      systemUpdatesHelp: "Notificaciones sobre actualizaciones y mantenimiento.",
    },
    security: {
      title: "Seguridad",
      description: "Configura las opciones de seguridad del sistema.",
      twoFactor: "Autenticación de dos factores",
      twoFactorHelp: "Requiere verificación adicional al iniciar sesión.",
      autoLock: "Bloqueo automático de sesión",
      autoLockHelp: "Cierra la sesión después de un período de inactividad.",
      sessionTimeout: "Tiempo de inactividad (minutos)",
      sessionTimeoutHelp: "Tiempo de inactividad antes de cerrar la sesión automáticamente.",
    },
    toasts: {
      saveSuccess: "Configuración guardada",
      saveDescription: "Los cambios han sido aplicados correctamente.",
      resetSuccess: "Configuración restablecida",
      resetDescription: "Se han restaurado los valores predeterminados.",
      maintenanceEnabled: "Modo de mantenimiento activado",
      maintenanceEnabledDesc: "El sitio ahora está en modo de mantenimiento.",
      maintenanceDisabled: "Modo de mantenimiento desactivado",
      maintenanceDisabledDesc: "El sitio ahora está disponible para todos los usuarios.",
    },
  },
  en: {
    title: "System Configuration",
    subtitle: "Manage preferences and settings for the EcoDrive platform.",
    resetButton: "Reset",
    resettingButton: "Resetting...",
    saveButton: "Save changes",
    savingButton: "Saving...",
    tabs: {
      general: "General",
      appearance: "Appearance",
      notifications: "Notifications",
      security: "Security",
    },
    general: {
      title: "General Settings",
      description: "Manage basic system settings.",
      siteName: "Site name",
      siteNameHelp: "This name will be displayed in the page title and emails.",
      language: "Language",
      languageHelp: "Default language for the user interface.",
      maintenanceMode: "Maintenance mode",
      maintenanceHelp: "Enable maintenance mode to perform updates.",
    },
    appearance: {
      title: "Appearance",
      description: "Customize the platform's appearance.",
      darkMode: "Dark mode",
      darkModeHelp: "Enable dark mode to reduce eye strain.",
      accentColor: "Accent color",
      accentColorHelp: "This color will be used for the main interface elements.",
      fontSize: "Font size",
      fontSizeHelp: "Default font size for the user interface.",
      fontSizes: {
        small: "Small",
        medium: "Medium",
        large: "Large",
      },
    },
    notifications: {
      title: "Notifications",
      description: "Configure notification preferences.",
      emailNotifications: "Email notifications",
      emailNotificationsHelp: "Receive notifications via email.",
      notificationTypes: "Notification types",
      newOrders: "New orders",
      newOrdersHelp: "Notifications when a new order is placed.",
      newUsers: "New users",
      newUsersHelp: "Notifications when a new user registers.",
      supportQueries: "Support queries",
      supportQueriesHelp: "Notifications when a new support query is received.",
      systemUpdates: "System updates",
      systemUpdatesHelp: "Notifications about updates and maintenance.",
    },
    security: {
      title: "Security",
      description: "Configure system security options.",
      twoFactor: "Two-factor authentication",
      twoFactorHelp: "Requires additional verification when logging in.",
      autoLock: "Automatic session lock",
      autoLockHelp: "Logs out after a period of inactivity.",
      sessionTimeout: "Inactivity time (minutes)",
      sessionTimeoutHelp: "Time of inactivity before automatically logging out.",
    },
    toasts: {
      saveSuccess: "Settings saved",
      saveDescription: "Changes have been successfully applied.",
      resetSuccess: "Settings reset",
      resetDescription: "Default values have been restored.",
      maintenanceEnabled: "Maintenance mode enabled",
      maintenanceEnabledDesc: "The site is now in maintenance mode.",
      maintenanceDisabled: "Maintenance mode disabled",
      maintenanceDisabledDesc: "The site is now available to all users.",
    },
  },
  fr: {
    title: "Configuration du Système",
    subtitle: "Gérez les préférences et les paramètres de la plateforme EcoDrive.",
    resetButton: "Réinitialiser",
    resettingButton: "Réinitialisation...",
    saveButton: "Enregistrer les modifications",
    savingButton: "Enregistrement...",
    tabs: {
      general: "Général",
      appearance: "Apparence",
      notifications: "Notifications",
      security: "Sécurité",
    },
    general: {
      title: "Configuration Générale",
      description: "Gérez les paramètres de base du système.",
      siteName: "Nom du site",
      siteNameHelp: "Ce nom sera affiché dans le titre de la page et les emails.",
      language: "Langue",
      languageHelp: "Langue par défaut pour l'interface utilisateur.",
      maintenanceMode: "Mode maintenance",
      maintenanceHelp: "Activez le mode maintenance pour effectuer des mises à jour.",
    },
    appearance: {
      title: "Apparence",
      description: "Personnalisez l'apparence de la plateforme.",
      darkMode: "Mode sombre",
      darkModeHelp: "Activez le mode sombre pour réduire la fatigue oculaire.",
      accentColor: "Couleur d'accent",
      accentColorHelp: "Cette couleur sera utilisée pour les éléments principaux de l'interface.",
      fontSize: "Taille de police",
      fontSizeHelp: "Taille de police par défaut pour l'interface utilisateur.",
      fontSizes: {
        small: "Petit",
        medium: "Moyen",
        large: "Grand",
      },
    },
    notifications: {
      title: "Notifications",
      description: "Configurez les préférences de notifications.",
      emailNotifications: "Notifications par email",
      emailNotificationsHelp: "Recevez des notifications par email.",
      notificationTypes: "Types de notifications",
      newOrders: "Nouvelles commandes",
      newOrdersHelp: "Notifications lorsqu'une nouvelle commande est passée.",
      newUsers: "Nouveaux utilisateurs",
      newUsersHelp: "Notifications lorsqu'un nouvel utilisateur s'inscrit.",
      supportQueries: "Demandes d'assistance",
      supportQueriesHelp: "Notifications lorsqu'une nouvelle demande d'assistance est reçue.",
      systemUpdates: "Mises à jour du système",
      systemUpdatesHelp: "Notifications concernant les mises à jour et la maintenance.",
    },
    security: {
      title: "Sécurité",
      description: "Configurez les options de sécurité du système.",
      twoFactor: "Authentification à deux facteurs",
      twoFactorHelp: "Nécessite une vérification supplémentaire lors de la connexion.",
      autoLock: "Verrouillage automatique de session",
      autoLockHelp: "Déconnecte après une période d'inactivité.",
      sessionTimeout: "Temps d'inactivité (minutes)",
      sessionTimeoutHelp: "Temps d'inactivité avant déconnexion automatique.",
    },
    toasts: {
      saveSuccess: "Configuration enregistrée",
      saveDescription: "Les modifications ont été appliquées avec succès.",
      resetSuccess: "Configuration réinitialisée",
      resetDescription: "Les valeurs par défaut ont été restaurées.",
      maintenanceEnabled: "Mode maintenance activé",
      maintenanceEnabledDesc: "Le site est maintenant en mode maintenance.",
      maintenanceDisabled: "Mode maintenance désactivé",
      maintenanceDisabledDesc: "Le site est maintenant disponible pour tous les utilisateurs.",
    },
  },
  de: {
    title: "Systemkonfiguration",
    subtitle: "Verwalten Sie die Einstellungen und Konfigurationen der EcoDrive-Plattform.",
    resetButton: "Zurücksetzen",
    resettingButton: "Zurücksetzen...",
    saveButton: "Änderungen speichern",
    savingButton: "Speichern...",
    tabs: {
      general: "Allgemein",
      appearance: "Erscheinungsbild",
      notifications: "Benachrichtigungen",
      security: "Sicherheit",
    },
    general: {
      title: "Allgemeine Einstellungen",
      description: "Verwalten Sie die grundlegenden Systemeinstellungen.",
      siteName: "Website-Name",
      siteNameHelp: "Dieser Name wird im Seitentitel und in E-Mails angezeigt.",
      language: "Sprache",
      languageHelp: "Standardsprache für die Benutzeroberfläche.",
      maintenanceMode: "Wartungsmodus",
      maintenanceHelp: "Aktivieren Sie den Wartungsmodus, um Updates durchzuführen.",
    },
    appearance: {
      title: "Erscheinungsbild",
      description: "Passen Sie das Erscheinungsbild der Plattform an.",
      darkMode: "Dunkler Modus",
      darkModeHelp: "Aktivieren Sie den dunklen Modus, um die Augenbelastung zu reduzieren.",
      accentColor: "Akzentfarbe",
      accentColorHelp: "Diese Farbe wird für die Hauptelemente der Benutzeroberfläche verwendet.",
      fontSize: "Schriftgröße",
      fontSizeHelp: "Standardschriftgröße für die Benutzeroberfläche.",
      fontSizes: {
        small: "Klein",
        medium: "Mittel",
        large: "Groß",
      },
    },
    notifications: {
      title: "Benachrichtigungen",
      description: "Konfigurieren Sie die Benachrichtigungseinstellungen.",
      emailNotifications: "E-Mail-Benachrichtigungen",
      emailNotificationsHelp: "Erhalten Sie Benachrichtigungen per E-Mail.",
      notificationTypes: "Benachrichtigungstypen",
      newOrders: "Neue Bestellungen",
      newOrdersHelp: "Benachrichtigungen, wenn eine neue Bestellung aufgegeben wird.",
      newUsers: "Neue Benutzer",
      newUsersHelp: "Benachrichtigungen, wenn sich ein neuer Benutzer registriert.",
      supportQueries: "Support-Anfragen",
      supportQueriesHelp: "Benachrichtigungen, wenn eine neue Support-Anfrage eingeht.",
      systemUpdates: "Systemupdates",
      systemUpdatesHelp: "Benachrichtigungen über Updates und Wartungsarbeiten.",
    },
    security: {
      title: "Sicherheit",
      description: "Konfigurieren Sie die Sicherheitsoptionen des Systems.",
      twoFactor: "Zwei-Faktor-Authentifizierung",
      twoFactorHelp: "Erfordert zusätzliche Verifizierung beim Anmelden.",
      autoLock: "Automatische Sitzungssperre",
      autoLockHelp: "Meldet nach einer Inaktivitätszeit ab.",
      sessionTimeout: "Inaktivitätszeit (Minuten)",
      sessionTimeoutHelp: "Zeit der Inaktivität vor automatischer Abmeldung.",
    },
    toasts: {
      saveSuccess: "Einstellungen gespeichert",
      saveDescription: "Die Änderungen wurden erfolgreich angewendet.",
      resetSuccess: "Einstellungen zurückgesetzt",
      resetDescription: "Die Standardwerte wurden wiederhergestellt.",
      maintenanceEnabled: "Wartungsmodus aktiviert",
      maintenanceEnabledDesc: "Die Website befindet sich jetzt im Wartungsmodus.",
      maintenanceDisabled: "Wartungsmodus deaktiviert",
      maintenanceDisabledDesc: "Die Website ist jetzt für alle Benutzer verfügbar.",
    },
  },
}

export default function ConfiguracionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [language, setLanguage] = useState("es")
  const [t, setT] = useState(translations.es)

  // Estados para las configuraciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [autoLockEnabled, setAutoLockEnabled] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [siteName, setSiteName] = useState("EcoDrive")
  const [accentColor, setAccentColor] = useState("#10b981") // Color primario actual
  const [fontSize, setFontSize] = useState("medium")

  // Cargar configuraciones iniciales
  useEffect(() => {
    // Cargar configuraciones desde localStorage
    const loadSettings = () => {
      const storedSiteName = localStorage.getItem("siteName")
      const storedLanguage = localStorage.getItem("language")
      const storedDarkMode = localStorage.getItem("darkMode")
      const storedAccentColor = localStorage.getItem("accentColor")
      const storedFontSize = localStorage.getItem("fontSize")
      const storedNotifications = localStorage.getItem("notificationsEnabled")
      const storedTwoFactor = localStorage.getItem("twoFactorEnabled")
      const storedAutoLock = localStorage.getItem("autoLockEnabled")
      const storedSessionTimeout = localStorage.getItem("sessionTimeout")
      const storedMaintenanceMode = localStorage.getItem("maintenanceMode")

      if (storedSiteName) setSiteName(storedSiteName)
      if (storedLanguage) setLanguage(storedLanguage)
      if (storedDarkMode) setDarkModeEnabled(storedDarkMode === "true")
      if (storedAccentColor) setAccentColor(storedAccentColor)
      if (storedFontSize) setFontSize(storedFontSize)
      if (storedNotifications) setNotificationsEnabled(storedNotifications === "true")
      if (storedTwoFactor) setTwoFactorEnabled(storedTwoFactor === "true")
      if (storedAutoLock) setAutoLockEnabled(storedAutoLock === "true")
      if (storedSessionTimeout) setSessionTimeout(Number.parseInt(storedSessionTimeout))
      if (storedMaintenanceMode) setMaintenanceMode(storedMaintenanceMode === "true")
    }

    loadSettings()
  }, [])

  // Cambiar idioma
  useEffect(() => {
    setT(translations[language as keyof typeof translations])

    // Guardar el idioma en localStorage para que otros componentes puedan acceder a él
    localStorage.setItem("language", language)

    // Disparar un evento para que otros componentes sepan que el idioma ha cambiado
    window.dispatchEvent(new Event("languageChange"))
  }, [language])

  // Cambiar tema
  useEffect(() => {
    if (darkModeEnabled) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }, [darkModeEnabled, setTheme])

  // Aplicar color de acento
  useEffect(() => {
    // Restaurar el color verde original
    document.documentElement.style.setProperty("--primary", "142.1 76.2% 36.3%")
    document.documentElement.style.setProperty("--primary-foreground", "355.7 100% 97.3%")

    // Si hay un color personalizado, aplicarlo
    if (accentColor !== "#10b981") {
      try {
        // Convertir hex a hsl
        const hexToHSL = (hex: string) => {
          // Convertir hex a rgb
          let r = 0,
            g = 0,
            b = 0

          // Eliminar el # si existe
          hex = hex.replace("#", "")

          if (hex.length === 3) {
            r = Number.parseInt(hex[0] + hex[0], 16)
            g = Number.parseInt(hex[1] + hex[1], 16)
            b = Number.parseInt(hex[2] + hex[2], 16)
          } else if (hex.length === 6) {
            r = Number.parseInt(hex.substring(0, 2), 16)
            g = Number.parseInt(hex.substring(2, 4), 16)
            b = Number.parseInt(hex.substring(4, 6), 16)
          }

          // Normalizar valores RGB
          r /= 255
          g /= 255
          b /= 255

          // Encontrar valores máximo y mínimo
          const max = Math.max(r, g, b)
          const min = Math.min(r, g, b)

          let h = 0,
            s = 0,
            l = (max + min) / 2

          if (max !== min) {
            const d = max - min
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

            switch (max) {
              case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
              case g:
                h = (b - r) / d + 2
                break
              case b:
                h = (r - g) / d + 4
                break
            }

            h /= 6
          }

          return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
          }
        }

        const hsl = hexToHSL(accentColor)
        const hslString = `${hsl.h} ${hsl.s}% ${hsl.l}%`

        document.documentElement.style.setProperty("--primary", hslString)

        // Ajustar el color de texto según la luminosidad
        const foregroundColor = hsl.l > 60 ? "0 0% 0%" : "0 0% 100%"
        document.documentElement.style.setProperty("--primary-foreground", foregroundColor)
      } catch (error) {
        console.error("Error al aplicar color de acento:", error)
      }
    }
  }, [accentColor])

  // Aplicar tamaño de fuente
  useEffect(() => {
    const html = document.documentElement

    switch (fontSize) {
      case "small":
        html.style.fontSize = "14px"
        break
      case "medium":
        html.style.fontSize = "16px"
        break
      case "large":
        html.style.fontSize = "18px"
        break
      default:
        html.style.fontSize = "16px"
    }
  }, [fontSize])

  // Modo mantenimiento
  useEffect(() => {
    // Guardar el estado del modo mantenimiento en localStorage
    localStorage.setItem("maintenanceMode", maintenanceMode.toString())

    // Disparar un evento para que otros componentes sepan que el modo mantenimiento ha cambiado
    window.dispatchEvent(new Event("maintenanceModeChange"))

    if (maintenanceMode) {
      toast({
        title: t.toasts.maintenanceEnabled,
        description: t.toasts.maintenanceEnabledDesc,
      })
    } else {
      toast({
        title: t.toasts.maintenanceDisabled,
        description: t.toasts.maintenanceDisabledDesc,
      })
    }
  }, [
    maintenanceMode,
    t.toasts.maintenanceEnabled,
    t.toasts.maintenanceEnabledDesc,
    t.toasts.maintenanceDisabled,
    t.toasts.maintenanceDisabledDesc,
    toast,
  ])

  const handleSaveSettings = async () => {
    setSaving(true)

    // Simulamos una operación de guardado
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Guardar configuraciones en localStorage
    localStorage.setItem("siteName", siteName)
    localStorage.setItem("language", language)
    localStorage.setItem("darkMode", darkModeEnabled.toString())
    localStorage.setItem("accentColor", accentColor)
    localStorage.setItem("fontSize", fontSize)
    localStorage.setItem("notificationsEnabled", notificationsEnabled.toString())
    localStorage.setItem("twoFactorEnabled", twoFactorEnabled.toString())
    localStorage.setItem("autoLockEnabled", autoLockEnabled.toString())
    localStorage.setItem("sessionTimeout", sessionTimeout.toString())
    localStorage.setItem("maintenanceMode", maintenanceMode.toString())

    // Disparar eventos para que otros componentes sepan que las configuraciones han cambiado
    window.dispatchEvent(new Event("settingsChange"))

    toast({
      title: t.toasts.saveSuccess,
      description: t.toasts.saveDescription,
    })

    setSaving(false)
  }

  const handleResetSettings = async () => {
    setLoading(true)

    // Simulamos una operación de reinicio
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Restaurar valores predeterminados
    setNotificationsEnabled(true)
    setDarkModeEnabled(false)
    setTwoFactorEnabled(false)
    setAutoLockEnabled(true)
    setMaintenanceMode(false)
    setSessionTimeout(30)
    setSiteName("EcoDrive")
    setLanguage("es")
    setAccentColor("#10b981")
    setFontSize("medium")
    setTheme("light")

    // Restaurar el color verde original
    document.documentElement.style.setProperty("--primary", "142.1 76.2% 36.3%")
    document.documentElement.style.setProperty("--primary-foreground", "355.7 100% 97.3%")

    // Restaurar el tamaño de fuente predeterminado
    document.documentElement.style.fontSize = "16px"

    toast({
      title: t.toasts.resetSuccess,
      description: t.toasts.resetDescription,
    })

    setLoading(false)
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleResetSettings} disabled={loading || saving}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.resettingButton}
                </>
              ) : (
                <>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.resetButton}
                </>
              )}
            </Button>
            <Button onClick={handleSaveSettings} disabled={loading || saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.savingButton}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t.saveButton}
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">{t.tabs.general}</TabsTrigger>
            <TabsTrigger value="appearance">{t.tabs.appearance}</TabsTrigger>
            <TabsTrigger value="notifications">{t.tabs.notifications}</TabsTrigger>
            <TabsTrigger value="security">{t.tabs.security}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.general.title}</CardTitle>
                <CardDescription>{t.general.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">{t.general.siteName}</Label>
                  <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                  <p className="text-sm text-muted-foreground">{t.general.siteNameHelp}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="language">{t.general.language}</Label>
                  <select
                    id="language"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                  <p className="text-sm text-muted-foreground">{t.general.languageHelp}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenance-mode">{t.general.maintenanceMode}</Label>
                      <p className="text-sm text-muted-foreground">{t.general.maintenanceHelp}</p>
                    </div>
                    <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vista previa</CardTitle>
                <CardDescription>Vista previa de la configuración</CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel className="w-full max-w-lg mx-auto">
                  <div className="flex transition-transform duration-500 ease-out h-full">
                    <CarouselItem>
                      <Image
                        src="/configuracion-vista-previa.png"
                        alt="Vista previa"
                        width={500}
                        height={300}
                        className="w-full object-cover rounded-lg"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <Image
                        src="/system-configuration.png"
                        alt="Vista previa"
                        width={500}
                        height={300}
                        className="w-full object-cover rounded-lg"
                      />
                    </CarouselItem>
                    <CarouselItem>
                      <Image
                        src="/panel-de-administracion.png"
                        alt="Vista previa"
                        width={500}
                        height={300}
                        className="w-full object-cover rounded-lg"
                      />
                    </CarouselItem>
                  </div>
                </Carousel>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.appearance.title}</CardTitle>
                <CardDescription>{t.appearance.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base" htmlFor="dark-mode">
                        {t.appearance.darkMode}
                      </Label>
                      <p className="text-sm text-muted-foreground">{t.appearance.darkModeHelp}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch id="dark-mode" checked={darkModeEnabled} onCheckedChange={setDarkModeEnabled} />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="accent-color">{t.appearance.accentColor}</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="accent-color"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-24 h-10 p-1"
                    />
                    <span className="text-sm text-muted-foreground">{accentColor}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.appearance.accentColorHelp}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="font-size">{t.appearance.fontSize}</Label>
                  <select
                    id="font-size"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  >
                    <option value="small">{t.appearance.fontSizes.small}</option>
                    <option value="medium">{t.appearance.fontSizes.medium}</option>
                    <option value="large">{t.appearance.fontSizes.large}</option>
                  </select>
                  <p className="text-sm text-muted-foreground">{t.appearance.fontSizeHelp}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.notifications.title}</CardTitle>
                <CardDescription>{t.notifications.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-base">{t.notifications.emailNotifications}</Label>
                        <p className="text-sm text-muted-foreground">{t.notifications.emailNotificationsHelp}</p>
                      </div>
                    </div>
                    <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>{t.notifications.notificationTypes}</Label>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">{t.notifications.newOrders}</Label>
                        <p className="text-xs text-muted-foreground">{t.notifications.newOrdersHelp}</p>
                      </div>
                      <Switch defaultChecked disabled={!notificationsEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">{t.notifications.newUsers}</Label>
                        <p className="text-xs text-muted-foreground">{t.notifications.newUsersHelp}</p>
                      </div>
                      <Switch defaultChecked disabled={!notificationsEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">{t.notifications.supportQueries}</Label>
                        <p className="text-xs text-muted-foreground">{t.notifications.supportQueriesHelp}</p>
                      </div>
                      <Switch defaultChecked disabled={!notificationsEnabled} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm">{t.notifications.systemUpdates}</Label>
                        <p className="text-xs text-muted-foreground">{t.notifications.systemUpdatesHelp}</p>
                      </div>
                      <Switch disabled={!notificationsEnabled} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.security.title}</CardTitle>
                <CardDescription>{t.security.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t.security.twoFactor}</Label>
                      <p className="text-sm text-muted-foreground">{t.security.twoFactorHelp}</p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t.security.autoLock}</Label>
                      <p className="text-sm text-muted-foreground">{t.security.autoLockHelp}</p>
                    </div>
                    <Switch checked={autoLockEnabled} onCheckedChange={setAutoLockEnabled} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">{t.security.sessionTimeout}</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(Number.parseInt(e.target.value))}
                    min="5"
                    max="120"
                    disabled={!autoLockEnabled}
                  />
                  <p className="text-sm text-muted-foreground">{t.security.sessionTimeoutHelp}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
