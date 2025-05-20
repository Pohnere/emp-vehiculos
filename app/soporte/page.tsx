"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/password-input"

// Función de validación de email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function SoportePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("contacto")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // Estado para el formulario de contacto
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // Estado para el formulario de cuenta
  const [accountForm, setAccountForm] = useState({
    email: "",
    password: "",
    issue: "acceso",
  })

  // Estado para el formulario de producto
  const [productForm, setProductForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    productModel: "",
    issue: "calidad",
    description: "",
  })

  // Errores de validación
  const [contactErrors, setContactErrors] = useState<{ [key: string]: string }>({})
  const [accountErrors, setAccountErrors] = useState<{ [key: string]: string }>({})
  const [productErrors, setProductErrors] = useState<{ [key: string]: string }>({})

  // Manejadores de cambio para cada formulario
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm((prev) => ({ ...prev, [name]: value }))

    // Limpiar error específico
    if (contactErrors[name]) {
      setContactErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAccountForm((prev) => ({ ...prev, [name]: value }))

    // Limpiar error específico
    if (accountErrors[name]) {
      setAccountErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductForm((prev) => ({ ...prev, [name]: value }))

    // Limpiar error específico
    if (productErrors[name]) {
      setProductErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Manejadores de cambio para selects
  const handleAccountSelectChange = (value: string) => {
    setAccountForm((prev) => ({ ...prev, issue: value }))
  }

  const handleProductSelectChange = (value: string) => {
    setProductForm((prev) => ({ ...prev, issue: value }))
  }

  // Validación de formularios
  const validateContactForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!contactForm.name.trim()) {
      errors.name = "El nombre es obligatorio"
    }

    if (!contactForm.email.trim()) {
      errors.email = "El correo electrónico es obligatorio"
    } else if (!validateEmail(contactForm.email)) {
      errors.email = "Ingrese un correo electrónico válido"
    }

    if (!contactForm.subject.trim()) {
      errors.subject = "El asunto es obligatorio"
    }

    if (!contactForm.message.trim()) {
      errors.message = "El mensaje es obligatorio"
    }

    setContactErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateAccountForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!accountForm.email.trim()) {
      errors.email = "El correo electrónico es obligatorio"
    } else if (!validateEmail(accountForm.email)) {
      errors.email = "Ingrese un correo electrónico válido"
    }

    if (!accountForm.password.trim()) {
      errors.password = "La contraseña es obligatoria"
    }

    setAccountErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateProductForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!productForm.name.trim()) {
      errors.name = "El nombre es obligatorio"
    }

    if (!productForm.email.trim()) {
      errors.email = "El correo electrónico es obligatorio"
    } else if (!validateEmail(productForm.email)) {
      errors.email = "Ingrese un correo electrónico válido"
    }

    if (!productForm.orderNumber.trim()) {
      errors.orderNumber = "El número de orden es obligatorio"
    }

    if (!productForm.productModel.trim()) {
      errors.productModel = "El modelo del producto es obligatorio"
    }

    if (!productForm.description.trim()) {
      errors.description = "La descripción del problema es obligatoria"
    }

    setProductErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Manejadores de envío
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateContactForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulación de envío a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En un caso real, aquí iría la llamada a la API
      // const response = await fetch('/api/support', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(contactForm)
      // });
      // if (!response.ok) throw new Error('Error al enviar el formulario');

      setSuccess(true)
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Redireccionar después de un tiempo
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      console.error("Error:", err)
      setError("Ha ocurrido un error al enviar el formulario. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateAccountForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulación de envío a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En un caso real, aquí iría la llamada a la API
      setSuccess(true)
      setAccountForm({
        email: "",
        password: "",
        issue: "acceso",
      })

      // Redireccionar después de un tiempo
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      console.error("Error:", err)
      setError("Ha ocurrido un error al enviar el formulario. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateProductForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulación de envío a API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // En un caso real, aquí iría la llamada a la API
      setSuccess(true)
      setProductForm({
        name: "",
        email: "",
        orderNumber: "",
        productModel: "",
        issue: "calidad",
        description: "",
      })

      // Redireccionar después de un tiempo
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      console.error("Error:", err)
      setError("Ha ocurrido un error al enviar el formulario. Por favor, inténtelo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">¡Solicitud Enviada!</CardTitle>
            <CardDescription className="text-center">
              Hemos recibido su solicitud de soporte. Nos pondremos en contacto con usted lo antes posible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Gracias por contactarnos. Un miembro de nuestro equipo revisará su solicitud y le responderá en un plazo
              de 24-48 horas.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Volver al inicio</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Soporte al Cliente</h1>
          <p className="text-muted-foreground mt-2">Estamos aquí para ayudarle. Seleccione una opción para comenzar.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacto">Contacto General</TabsTrigger>
            <TabsTrigger value="cuenta">Problemas de Cuenta</TabsTrigger>
            <TabsTrigger value="producto">Soporte de Producto</TabsTrigger>
          </TabsList>

          {/* Formulario de Contacto General */}
          <TabsContent value="contacto">
            <Card>
              <CardHeader>
                <CardTitle>Contacto General</CardTitle>
                <CardDescription>
                  Utilice este formulario para consultas generales, sugerencias o comentarios.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Su nombre"
                      value={contactForm.name}
                      onChange={handleContactChange}
                      className={contactErrors.name ? "border-red-500" : ""}
                    />
                    {contactErrors.name && <p className="text-sm text-red-500">{contactErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={contactForm.email}
                      onChange={handleContactChange}
                      className={contactErrors.email ? "border-red-500" : ""}
                    />
                    {contactErrors.email && <p className="text-sm text-red-500">{contactErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Asunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Asunto de su mensaje"
                      value={contactForm.subject}
                      onChange={handleContactChange}
                      className={contactErrors.subject ? "border-red-500" : ""}
                    />
                    {contactErrors.subject && <p className="text-sm text-red-500">{contactErrors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensaje</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Escriba su mensaje aquí..."
                      rows={5}
                      value={contactForm.message}
                      onChange={handleContactChange}
                      className={contactErrors.message ? "border-red-500" : ""}
                    />
                    {contactErrors.message && <p className="text-sm text-red-500">{contactErrors.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      "Enviar mensaje"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formulario de Problemas de Cuenta */}
          <TabsContent value="cuenta">
            <Card>
              <CardHeader>
                <CardTitle>Problemas de Cuenta</CardTitle>
                <CardDescription>
                  Si tiene problemas para acceder a su cuenta o necesita restablecer su contraseña.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleAccountSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-email">Correo electrónico de la cuenta</Label>
                    <Input
                      id="account-email"
                      name="email"
                      type="email"
                      placeholder="correo@ejemplo.com"
                      value={accountForm.email}
                      onChange={handleAccountChange}
                      className={accountErrors.email ? "border-red-500" : ""}
                    />
                    {accountErrors.email && <p className="text-sm text-red-500">{accountErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-password">Contraseña actual (si la recuerda)</Label>
                    <PasswordInput
                      id="account-password"
                      name="password"
                      placeholder="Su contraseña actual"
                      value={accountForm.password}
                      onChange={handleAccountChange}
                      error={!!accountErrors.password}
                    />
                    {accountErrors.password && <p className="text-sm text-red-500">{accountErrors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-issue">Tipo de problema</Label>
                    <Select value={accountForm.issue} onValueChange={handleAccountSelectChange}>
                      <SelectTrigger id="account-issue">
                        <SelectValue placeholder="Seleccione el tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acceso">No puedo acceder a mi cuenta</SelectItem>
                        <SelectItem value="contrasena">Olvidé mi contraseña</SelectItem>
                        <SelectItem value="datos">Actualizar datos personales</SelectItem>
                        <SelectItem value="eliminar">Eliminar mi cuenta</SelectItem>
                        <SelectItem value="otro">Otro problema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      "Enviar solicitud"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Formulario de Soporte de Producto */}
          <TabsContent value="producto">
            <Card>
              <CardHeader>
                <CardTitle>Soporte de Producto</CardTitle>
                <CardDescription>
                  Para problemas relacionados con productos adquiridos o en proceso de compra.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Nombre completo</Label>
                      <Input
                        id="product-name"
                        name="name"
                        placeholder="Su nombre"
                        value={productForm.name}
                        onChange={handleProductChange}
                        className={productErrors.name ? "border-red-500" : ""}
                      />
                      {productErrors.name && <p className="text-sm text-red-500">{productErrors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-email">Correo electrónico</Label>
                      <Input
                        id="product-email"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={productForm.email}
                        onChange={handleProductChange}
                        className={productErrors.email ? "border-red-500" : ""}
                      />
                      {productErrors.email && <p className="text-sm text-red-500">{productErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-order">Número de orden</Label>
                      <Input
                        id="product-order"
                        name="orderNumber"
                        placeholder="Ej: ORD-12345"
                        value={productForm.orderNumber}
                        onChange={handleProductChange}
                        className={productErrors.orderNumber ? "border-red-500" : ""}
                      />
                      {productErrors.orderNumber && <p className="text-sm text-red-500">{productErrors.orderNumber}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product-model">Modelo del producto</Label>
                      <Input
                        id="product-model"
                        name="productModel"
                        placeholder="Ej: Model E"
                        value={productForm.productModel}
                        onChange={handleProductChange}
                        className={productErrors.productModel ? "border-red-500" : ""}
                      />
                      {productErrors.productModel && (
                        <p className="text-sm text-red-500">{productErrors.productModel}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-issue">Tipo de problema</Label>
                    <Select value={productForm.issue} onValueChange={handleProductSelectChange}>
                      <SelectTrigger id="product-issue">
                        <SelectValue placeholder="Seleccione el tipo de problema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calidad">Problema de calidad</SelectItem>
                        <SelectItem value="entrega">Problema de entrega</SelectItem>
                        <SelectItem value="funcionamiento">Mal funcionamiento</SelectItem>
                        <SelectItem value="garantia">Reclamación de garantía</SelectItem>
                        <SelectItem value="devolucion">Devolución</SelectItem>
                        <SelectItem value="otro">Otro problema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-description">Descripción del problema</Label>
                    <Textarea
                      id="product-description"
                      name="description"
                      placeholder="Describa detalladamente el problema que está experimentando..."
                      rows={5}
                      value={productForm.description}
                      onChange={handleProductChange}
                      className={productErrors.description ? "border-red-500" : ""}
                    />
                    {productErrors.description && <p className="text-sm text-red-500">{productErrors.description}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      "Enviar solicitud"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-2">¿Necesita ayuda inmediata?</h2>
          <p className="text-muted-foreground">
            Llámenos al <span className="font-medium">900 123 456</span> (Lunes a Viernes, 9:00 - 18:00)
          </p>
        </div>
      </div>
    </div>
  )
}
