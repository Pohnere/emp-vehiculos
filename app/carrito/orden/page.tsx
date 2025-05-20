"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import {
  Loader2,
  CreditCard,
  Landmark,
  Truck,
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Car,
  Info,
} from "lucide-react"
import Image from "next/image"

export default function OrdenCompraPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "México",
    paymentMethod: "credit_card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardholderName: "",
    savePaymentInfo: false,
    notes: "",
    termsAccepted: false,
  })

  // Calcular totales
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 1500 // Costo fijo de envío
  const taxes = subtotal * 0.16 // 16% de impuestos
  const total = subtotal + shipping + taxes

  // Verificar si el usuario está autenticado y cargar carrito
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Obtener token del localStorage
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login?redirect=/carrito/orden")
          return
        }

        // Obtener datos del usuario
        const storedUser = localStorage.getItem("user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)

          // Pre-llenar formulario con datos del usuario
          setFormData((prev) => ({
            ...prev,
            fullName: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            state: userData.state || "",
            postalCode: userData.postalCode || "",
          }))

          // Cargar carrito
          const cart = localStorage.getItem("cart")
          if (cart) {
            const cartData = JSON.parse(cart)
            if (cartData.length === 0) {
              // Redirigir si el carrito está vacío
              router.push("/carrito")
              return
            }
            setCartItems(cartData)
          } else {
            // Redirigir si el carrito está vacío
            router.push("/carrito")
            return
          }
        } else {
          router.push("/login?redirect=/carrito/orden")
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setError("No se pudieron cargar los datos. Por favor, intente de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    // Limpiar error de validación al cambiar el valor
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: value }))

    // Limpiar errores de validación relacionados con el método de pago
    if (value !== "credit_card") {
      const newErrors = { ...validationErrors }
      delete newErrors.cardNumber
      delete newErrors.cardExpiry
      delete newErrors.cardCvc
      delete newErrors.cardholderName
      setValidationErrors(newErrors)
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    // Validar campos obligatorios
    if (!formData.fullName.trim()) errors.fullName = "El nombre completo es obligatorio"
    if (!formData.email.trim()) errors.email = "El correo electrónico es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Ingrese un correo electrónico válido"

    if (!formData.phone.trim()) errors.phone = "El teléfono es obligatorio"
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      errors.phone = "Ingrese un número de teléfono válido (10 dígitos)"

    if (!formData.address.trim()) errors.address = "La dirección es obligatoria"
    if (!formData.city.trim()) errors.city = "La ciudad es obligatoria"
    if (!formData.state.trim()) errors.state = "El estado es obligatorio"
    if (!formData.postalCode.trim()) errors.postalCode = "El código postal es obligatorio"
    else if (!/^\d{5}$/.test(formData.postalCode.replace(/\D/g, "")))
      errors.postalCode = "Ingrese un código postal válido (5 dígitos)"

    // Validar método de pago
    if (formData.paymentMethod === "credit_card") {
      if (!formData.cardholderName.trim()) errors.cardholderName = "El nombre del titular es obligatorio"

      if (!formData.cardNumber.trim()) errors.cardNumber = "El número de tarjeta es obligatorio"
      else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\D/g, "")))
        errors.cardNumber = "Ingrese un número de tarjeta válido (16 dígitos)"

      if (!formData.cardExpiry.trim()) errors.cardExpiry = "La fecha de expiración es obligatoria"
      else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.cardExpiry)) errors.cardExpiry = "Formato inválido. Use MM/AA"

      if (!formData.cardCvc.trim()) errors.cardCvc = "El código de seguridad es obligatorio"
      else if (!/^\d{3,4}$/.test(formData.cardCvc))
        errors.cardCvc = "Ingrese un código de seguridad válido (3-4 dígitos)"
    }

    // Validar aceptación de términos
    if (!formData.termsAccepted) errors.termsAccepted = "Debe aceptar los términos y condiciones"

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validar formulario
    if (!validateForm()) {
      setError("Por favor, corrija los errores en el formulario antes de continuar.")
      // Desplazarse al primer error
      const firstErrorField = Object.keys(validationErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.focus()
      }
      return
    }

    setSubmitting(true)

    try {
      // Obtener token del localStorage
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No se encontró el token de autenticación")
      }

      // Crear objeto de orden
      const orderData = {
        userId: user.id,
        items: cartItems,
        subtotal,
        shipping,
        taxes,
        total,
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails:
          formData.paymentMethod === "credit_card"
            ? {
                cardholderName: formData.cardholderName,
                cardNumber: formData.cardNumber.replace(/\D/g, "").slice(-4), // Solo guardar últimos 4 dígitos
                cardExpiry: formData.cardExpiry,
              }
            : {},
        notes: formData.notes,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      // Simular envío a la API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Limpiar carrito
      localStorage.setItem("cart", "[]")

      // Mostrar mensaje de éxito
      setSuccess(true)
      toast({
        title: "¡Orden creada con éxito!",
        description: "Tu orden ha sido procesada correctamente.",
      })

      // Redirigir a página de éxito después de un breve retraso
      setTimeout(() => {
        router.push("/compra-exitosa")
      }, 2000)
    } catch (err: any) {
      console.error("Error al crear orden:", err)
      setError(err.message || "Ha ocurrido un error al procesar la orden. Por favor, inténtelo de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Formatear fecha de expiración
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg">Cargando formulario de orden...</p>
      </div>
    )
  }

  // Mostrar mensaje de éxito
  if (success) {
    return (
      <div className="container py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-2xl font-bold mb-2">¡Orden creada con éxito!</p>
            <p className="text-center text-muted-foreground mb-6">
              Tu orden ha sido procesada correctamente. Serás redirigido en unos momentos.
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center gap-2">
          <Link href="/carrito">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al carrito
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">Finalizar Compra</h1>
          <p className="text-muted-foreground">Complete los datos para finalizar su compra</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Información de contacto</CardTitle>
                  <CardDescription>Ingrese sus datos personales</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-1">
                      Nombre completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className={validationErrors.fullName ? "border-red-500" : ""}
                    />
                    {validationErrors.fullName && <p className="text-sm text-red-500">{validationErrors.fullName}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-1">
                        Correo electrónico <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={validationErrors.email ? "border-red-500" : ""}
                      />
                      {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-1">
                        Teléfono <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="10 dígitos"
                        className={validationErrors.phone ? "border-red-500" : ""}
                      />
                      {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dirección de envío</CardTitle>
                  <CardDescription>Ingrese la dirección donde desea recibir su pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-1">
                      Dirección <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Calle, número, colonia"
                      className={validationErrors.address ? "border-red-500" : ""}
                    />
                    {validationErrors.address && <p className="text-sm text-red-500">{validationErrors.address}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="flex items-center gap-1">
                        Ciudad <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={validationErrors.city ? "border-red-500" : ""}
                      />
                      {validationErrors.city && <p className="text-sm text-red-500">{validationErrors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="flex items-center gap-1">
                        Estado <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className={validationErrors.state ? "border-red-500" : ""}
                      />
                      {validationErrors.state && <p className="text-sm text-red-500">{validationErrors.state}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="flex items-center gap-1">
                        Código postal <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        placeholder="5 dígitos"
                        className={validationErrors.postalCode ? "border-red-500" : ""}
                      />
                      {validationErrors.postalCode && (
                        <p className="text-sm text-red-500">{validationErrors.postalCode}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleChange} disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Método de pago</CardTitle>
                  <CardDescription>Seleccione cómo desea pagar su pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup value={formData.paymentMethod} onValueChange={handleRadioChange} className="space-y-4">
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-5 w-5" />
                        Tarjeta de crédito o débito
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer" className="flex items-center gap-2 cursor-pointer">
                        <Landmark className="h-5 w-5" />
                        Transferencia bancaria
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-4 rounded-md">
                      <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                      <Label htmlFor="cash_on_delivery" className="flex items-center gap-2 cursor-pointer">
                        <Truck className="h-5 w-5" />
                        Pago contra entrega
                      </Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "credit_card" && (
                    <div className="space-y-4 border-t pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName" className="flex items-center gap-1">
                          Nombre del titular <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="cardholderName"
                          name="cardholderName"
                          placeholder="Nombre como aparece en la tarjeta"
                          value={formData.cardholderName}
                          onChange={handleChange}
                          className={validationErrors.cardholderName ? "border-red-500" : ""}
                        />
                        {validationErrors.cardholderName && (
                          <p className="text-sm text-red-500">{validationErrors.cardholderName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="flex items-center gap-1">
                          Número de tarjeta <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formData.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value)
                            setFormData((prev) => ({ ...prev, cardNumber: formatted }))

                            // Limpiar error de validación
                            if (validationErrors.cardNumber) {
                              setValidationErrors((prev) => {
                                const newErrors = { ...prev }
                                delete newErrors.cardNumber
                                return newErrors
                              })
                            }
                          }}
                          maxLength={19}
                          className={validationErrors.cardNumber ? "border-red-500" : ""}
                        />
                        {validationErrors.cardNumber && (
                          <p className="text-sm text-red-500">{validationErrors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry" className="flex items-center gap-1">
                            Fecha de expiración <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="cardExpiry"
                            name="cardExpiry"
                            placeholder="MM/AA"
                            value={formData.cardExpiry}
                            onChange={(e) => {
                              const formatted = formatExpiry(e.target.value)
                              setFormData((prev) => ({ ...prev, cardExpiry: formatted }))

                              // Limpiar error de validación
                              if (validationErrors.cardExpiry) {
                                setValidationErrors((prev) => {
                                  const newErrors = { ...prev }
                                  delete newErrors.cardExpiry
                                  return newErrors
                                })
                              }
                            }}
                            maxLength={5}
                            className={validationErrors.cardExpiry ? "border-red-500" : ""}
                          />
                          {validationErrors.cardExpiry && (
                            <p className="text-sm text-red-500">{validationErrors.cardExpiry}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCvc" className="flex items-center gap-1">
                            CVC/CVV <span className="text-red-500">*</span>
                            <span className="relative group">
                              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              <span className="absolute left-full ml-2 top-0 w-48 p-2 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                El código de seguridad de 3 o 4 dígitos que se encuentra en el reverso de su tarjeta.
                              </span>
                            </span>
                          </Label>
                          <Input
                            id="cardCvc"
                            name="cardCvc"
                            placeholder="123"
                            value={formData.cardCvc}
                            onChange={handleChange}
                            maxLength={4}
                            className={validationErrors.cardCvc ? "border-red-500" : ""}
                          />
                          {validationErrors.cardCvc && (
                            <p className="text-sm text-red-500">{validationErrors.cardCvc}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="savePaymentInfo"
                          name="savePaymentInfo"
                          checked={formData.savePaymentInfo}
                          onChange={handleChange}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="savePaymentInfo" className="text-sm cursor-pointer">
                          Guardar información de pago para futuras compras
                        </Label>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === "bank_transfer" && (
                    <div className="border-t pt-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>Realice una transferencia a la siguiente cuenta bancaria:</AlertDescription>
                      </Alert>
                      <div className="mt-2 p-4 bg-muted rounded-md">
                        <p className="font-medium">Banco: EcoDrive Bank</p>
                        <p>Titular: EcoDrive S.A.</p>
                        <p>Cuenta: 1234-5678-9012-3456</p>
                        <p>CLABE: 012345678901234567</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Una vez realizada la transferencia, envíe el comprobante a pagos@ecodrive.com
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notas adicionales</CardTitle>
                  <CardDescription>Información adicional para su pedido (opcional)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Instrucciones especiales para la entrega, etc."
                    value={formData.notes}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />

                  <div className="pt-4">
                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className={`mt-1 rounded border-gray-300 ${validationErrors.termsAccepted ? "border-red-500" : ""}`}
                      />
                      <div>
                        <Label htmlFor="termsAccepted" className="cursor-pointer">
                          Acepto los{" "}
                          <Link href="#" className="text-primary hover:underline">
                            términos y condiciones
                          </Link>{" "}
                          y la{" "}
                          <Link href="#" className="text-primary hover:underline">
                            política de privacidad
                          </Link>
                        </Label>
                        {validationErrors.termsAccepted && (
                          <p className="text-sm text-red-500">{validationErrors.termsAccepted}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando orden...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Confirmar orden
                  </>
                )}
              </Button>
            </form>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen de la orden</CardTitle>
                <CardDescription>
                  {cartItems.reduce((total, item) => total + item.quantity, 0)} productos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-muted h-16 w-16 rounded-md flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="object-cover"
                          />
                        ) : (
                          <Car className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">${subtotal.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Envío</p>
                    <p className="font-medium">${shipping.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Impuestos</p>
                    <p className="font-medium">${taxes.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <p className="font-medium">Total</p>
                  <p className="text-xl font-bold">${total.toLocaleString()}</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      Pago seguro
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Envío rápido
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Al confirmar su orden, acepta nuestros términos y condiciones y política de privacidad.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
