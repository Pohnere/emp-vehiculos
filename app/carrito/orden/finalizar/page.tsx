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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Truck, Calendar, CheckCircle, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react"

export default function FinalizarCompraPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)

  // Estados para el formulario
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [savePaymentInfo, setSavePaymentInfo] = useState(false)
  const [shippingAddress, setShippingAddress] = useState("")
  const [shippingCity, setShippingCity] = useState("")
  const [shippingState, setShippingState] = useState("")
  const [shippingZip, setShippingZip] = useState("")
  const [shippingCountry, setShippingCountry] = useState("ES")
  const [billingAddress, setBillingAddress] = useState("")
  const [billingCity, setBillingCity] = useState("")
  const [billingState, setBillingState] = useState("")
  const [billingZip, setBillingZip] = useState("")
  const [billingCountry, setBillingCountry] = useState("ES")
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [notes, setNotes] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Estados para validación
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Cargar carrito
  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = localStorage.getItem("cartItems")
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)
          setCart(parsedCart)

          // Calcular totales
          const cartSubtotal = parsedCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
          const cartTax = cartSubtotal * 0.21 // 21% IVA
          const cartShipping = cartSubtotal > 50000 ? 0 : 1500 // Envío gratis para compras mayores a 50.000€
          const cartTotal = cartSubtotal + cartTax + cartShipping

          setSubtotal(cartSubtotal)
          setTax(cartTax)
          setShipping(cartShipping)
          setTotal(cartTotal)
        } else {
          // Si no hay carrito, redirigir a la página del carrito
          router.push("/carrito")
        }
      } catch (error) {
        console.error("Error al cargar el carrito:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el carrito. Inténtelo de nuevo más tarde.",
        })
      }
    }

    loadCart()
  }, [toast, router])

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

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return value
  }

  // Manejar cambio en el número de tarjeta
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
    validateField("cardNumber", formattedValue)
  }

  // Manejar cambio en la fecha de expiración
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value)
    setCardExpiry(formattedValue)
    validateField("cardExpiry", formattedValue)
  }

  // Manejar cambio en el CVC
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 4)
    setCardCvc(value)
    validateField("cardCvc", value)
  }

  // Validar campo
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors }
    let isValid = true

    switch (field) {
      case "cardNumber":
        if (!value) {
          newErrors.cardNumber = "El número de tarjeta es obligatorio"
          isValid = false
        } else if (value.replace(/\s/g, "").length < 16) {
          newErrors.cardNumber = "El número de tarjeta debe tener 16 dígitos"
          isValid = false
        } else {
          delete newErrors.cardNumber
        }
        break
      case "cardName":
        if (!value) {
          newErrors.cardName = "El nombre del titular es obligatorio"
          isValid = false
        } else {
          delete newErrors.cardName
        }
        break
      case "cardExpiry":
        if (!value) {
          newErrors.cardExpiry = "La fecha de expiración es obligatoria"
          isValid = false
        } else if (!/^\d{2}\/\d{2}$/.test(value)) {
          newErrors.cardExpiry = "Formato inválido (MM/YY)"
          isValid = false
        } else {
          const [month, year] = value.split("/")
          const currentYear = new Date().getFullYear() % 100
          const currentMonth = new Date().getMonth() + 1

          if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
            newErrors.cardExpiry = "Mes inválido"
            isValid = false
          } else if (
            Number.parseInt(year) < currentYear ||
            (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
          ) {
            newErrors.cardExpiry = "La tarjeta ha expirado"
            isValid = false
          } else {
            delete newErrors.cardExpiry
          }
        }
        break
      case "cardCvc":
        if (!value) {
          newErrors.cardCvc = "El código de seguridad es obligatorio"
          isValid = false
        } else if (value.length < 3) {
          newErrors.cardCvc = "El código debe tener al menos 3 dígitos"
          isValid = false
        } else {
          delete newErrors.cardCvc
        }
        break
      case "shippingAddress":
        if (!value) {
          newErrors.shippingAddress = "La dirección es obligatoria"
          isValid = false
        } else {
          delete newErrors.shippingAddress
        }
        break
      case "shippingCity":
        if (!value) {
          newErrors.shippingCity = "La ciudad es obligatoria"
          isValid = false
        } else {
          delete newErrors.shippingCity
        }
        break
      case "shippingZip":
        if (!value) {
          newErrors.shippingZip = "El código postal es obligatorio"
          isValid = false
        } else if (!/^\d{5}$/.test(value)) {
          newErrors.shippingZip = "El código postal debe tener 5 dígitos"
          isValid = false
        } else {
          delete newErrors.shippingZip
        }
        break
      default:
        break
    }

    setErrors(newErrors)
    return isValid
  }

  // Marcar campo como tocado
  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
  }

  // Validar formulario completo
  const validateForm = () => {
    let isValid = true
    const newErrors: Record<string, string> = {}
    const newTouched: Record<string, boolean> = {}

    // Validar tarjeta de crédito
    if (paymentMethod === "credit-card") {
      if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "El número de tarjeta debe tener 16 dígitos"
        isValid = false
      }

      if (!cardName) {
        newErrors.cardName = "El nombre del titular es obligatorio"
        isValid = false
      }

      if (!cardExpiry) {
        newErrors.cardExpiry = "La fecha de expiración es obligatoria"
        isValid = false
      } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = "Formato inválido (MM/YY)"
        isValid = false
      } else {
        const [month, year] = cardExpiry.split("/")
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1

        if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
          newErrors.cardExpiry = "Mes inválido"
          isValid = false
        } else if (
          Number.parseInt(year) < currentYear ||
          (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
        ) {
          newErrors.cardExpiry = "La tarjeta ha expirado"
          isValid = false
        }
      }

      if (!cardCvc || cardCvc.length < 3) {
        newErrors.cardCvc = "El código de seguridad debe tener al menos 3 dígitos"
        isValid = false
      }
    }

    // Validar dirección de envío
    if (!shippingAddress) {
      newErrors.shippingAddress = "La dirección es obligatoria"
      isValid = false
    }

    if (!shippingCity) {
      newErrors.shippingCity = "La ciudad es obligatoria"
      isValid = false
    }

    if (!shippingZip) {
      newErrors.shippingZip = "El código postal es obligatorio"
      isValid = false
    } else if (!/^\d{5}$/.test(shippingZip)) {
      newErrors.shippingZip = "El código postal debe tener 5 dígitos"
      isValid = false
    }

    // Validar dirección de facturación si es diferente
    if (!sameAsShipping) {
      if (!billingAddress) {
        newErrors.billingAddress = "La dirección es obligatoria"
        isValid = false
      }

      if (!billingCity) {
        newErrors.billingCity = "La ciudad es obligatoria"
        isValid = false
      }

      if (!billingZip) {
        newErrors.billingZip = "El código postal es obligatorio"
        isValid = false
      } else if (!/^\d{5}$/.test(billingZip)) {
        newErrors.billingZip = "El código postal debe tener 5 dígitos"
        isValid = false
      }
    }

    // Validar aceptación de términos
    if (!acceptTerms) {
      newErrors.acceptTerms = "Debe aceptar los términos y condiciones"
      isValid = false
    }

    // Marcar todos los campos como tocados
    Object.keys(newErrors).forEach((key) => {
      newTouched[key] = true
    })

    setErrors(newErrors)
    setTouched({ ...touched, ...newTouched })
    return isValid
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Error en el formulario",
        description: "Por favor, corrija los errores antes de continuar.",
      })
      return
    }

    setLoading(true)

    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Crear objeto de orden
      const order = {
        items: cart,
        subtotal,
        tax,
        shipping,
        total,
        paymentMethod,
        paymentDetails:
          paymentMethod === "credit-card"
            ? {
                cardNumber: cardNumber.replace(/\s/g, "").slice(-4),
                cardName,
                cardExpiry,
                savePaymentInfo,
              }
            : {},
        shippingAddress: {
          address: shippingAddress,
          city: shippingCity,
          state: shippingState,
          zip: shippingZip,
          country: shippingCountry,
        },
        billingAddress: sameAsShipping
          ? {
              address: shippingAddress,
              city: shippingCity,
              state: shippingState,
              zip: shippingZip,
              country: shippingCountry,
            }
          : {
              address: billingAddress,
              city: billingCity,
              state: billingState,
              zip: billingZip,
              country: billingCountry,
            },
        shippingMethod,
        notes,
        date: new Date().toISOString(),
        status: "pending",
      }

      // Guardar orden en localStorage
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      orders.push(order)
      localStorage.setItem("orders", JSON.stringify(orders))

      // Limpiar carrito
      localStorage.setItem("cartItems", "[]")

      // Mostrar mensaje de éxito
      toast({
        title: "¡Compra realizada con éxito!",
        description: "Su pedido ha sido procesado correctamente.",
      })

      // Redirigir a página de compra exitosa
      router.push("/compra-exitosa")
    } catch (error) {
      console.error("Error al procesar la compra:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar la compra. Inténtelo de nuevo más tarde.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Actualizar dirección de facturación cuando cambia la de envío
  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress)
      setBillingCity(shippingCity)
      setBillingState(shippingState)
      setBillingZip(shippingZip)
      setBillingCountry(shippingCountry)
    }
  }, [sameAsShipping, shippingAddress, shippingCity, shippingState, shippingZip, shippingCountry])

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
          <h1 className="text-3xl font-bold">Finalizar compra</h1>
          <p className="text-muted-foreground">Complete los detalles para finalizar su compra</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit}>
              <Tabs defaultValue="payment" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="payment">Pago</TabsTrigger>
                  <TabsTrigger value="shipping">Envío</TabsTrigger>
                  <TabsTrigger value="review">Revisión</TabsTrigger>
                </TabsList>

                <TabsContent value="payment" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Método de pago
                      </CardTitle>
                      <CardDescription>Seleccione su método de pago preferido</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Tarjeta de crédito/débito
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal">PayPal</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                          <Label htmlFor="bank-transfer">Transferencia bancaria</Label>
                        </div>
                      </RadioGroup>

                      {paymentMethod === "credit-card" && (
                        <div className="space-y-4 mt-4 border rounded-lg p-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Número de tarjeta</Label>
                            <Input
                              id="card-number"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              onBlur={() => handleBlur("cardNumber")}
                              className={errors.cardNumber && touched.cardNumber ? "border-red-500" : ""}
                            />
                            {errors.cardNumber && touched.cardNumber && (
                              <p className="text-sm text-red-500">{errors.cardNumber}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="card-name">Nombre del titular</Label>
                            <Input
                              id="card-name"
                              placeholder="NOMBRE APELLIDOS"
                              value={cardName}
                              onChange={(e) => {
                                setCardName(e.target.value.toUpperCase())
                                validateField("cardName", e.target.value)
                              }}
                              onBlur={() => handleBlur("cardName")}
                              className={errors.cardName && touched.cardName ? "border-red-500" : ""}
                            />
                            {errors.cardName && touched.cardName && (
                              <p className="text-sm text-red-500">{errors.cardName}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="card-expiry">Fecha de expiración</Label>
                              <Input
                                id="card-expiry"
                                placeholder="MM/YY"
                                value={cardExpiry}
                                onChange={handleExpiryChange}
                                onBlur={() => handleBlur("cardExpiry")}
                                className={errors.cardExpiry && touched.cardExpiry ? "border-red-500" : ""}
                              />
                              {errors.cardExpiry && touched.cardExpiry && (
                                <p className="text-sm text-red-500">{errors.cardExpiry}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="card-cvc">Código de seguridad (CVC)</Label>
                              <Input
                                id="card-cvc"
                                placeholder="123"
                                value={cardCvc}
                                onChange={handleCvcChange}
                                onBlur={() => handleBlur("cardCvc")}
                                className={errors.cardCvc && touched.cardCvc ? "border-red-500" : ""}
                              />
                              {errors.cardCvc && touched.cardCvc && (
                                <p className="text-sm text-red-500">{errors.cardCvc}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 pt-2">
                            <Switch
                              id="save-payment-info"
                              checked={savePaymentInfo}
                              onCheckedChange={setSavePaymentInfo}
                            />
                            <Label htmlFor="save-payment-info">Guardar información de pago para futuras compras</Label>
                          </div>
                        </div>
                      )}

                      {paymentMethod === "paypal" && (
                        <div className="border rounded-lg p-4 text-center">
                          <p>Será redirigido a PayPal para completar el pago.</p>
                        </div>
                      )}

                      {paymentMethod === "bank-transfer" && (
                        <div className="border rounded-lg p-4">
                          <p className="font-medium">Datos bancarios:</p>
                          <p>Banco: Banco EcoDrive</p>
                          <p>IBAN: ES12 3456 7890 1234 5678 9012</p>
                          <p>BIC/SWIFT: ECODRIVES</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Por favor, incluya su número de pedido en la referencia de la transferencia.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="shipping" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Dirección de envío
                      </CardTitle>
                      <CardDescription>Introduzca la dirección donde desea recibir su pedido</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="shipping-address">Dirección</Label>
                        <Input
                          id="shipping-address"
                          placeholder="Calle, número, piso, puerta"
                          value={shippingAddress}
                          onChange={(e) => {
                            setShippingAddress(e.target.value)
                            validateField("shippingAddress", e.target.value)
                          }}
                          onBlur={() => handleBlur("shippingAddress")}
                          className={errors.shippingAddress && touched.shippingAddress ? "border-red-500" : ""}
                        />
                        {errors.shippingAddress && touched.shippingAddress && (
                          <p className="text-sm text-red-500">{errors.shippingAddress}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shipping-city">Ciudad</Label>
                          <Input
                            id="shipping-city"
                            placeholder="Ciudad"
                            value={shippingCity}
                            onChange={(e) => {
                              setShippingCity(e.target.value)
                              validateField("shippingCity", e.target.value)
                            }}
                            onBlur={() => handleBlur("shippingCity")}
                            className={errors.shippingCity && touched.shippingCity ? "border-red-500" : ""}
                          />
                          {errors.shippingCity && touched.shippingCity && (
                            <p className="text-sm text-red-500">{errors.shippingCity}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="shipping-state">Provincia</Label>
                          <Input
                            id="shipping-state"
                            placeholder="Provincia"
                            value={shippingState}
                            onChange={(e) => setShippingState(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="shipping-zip">Código postal</Label>
                          <Input
                            id="shipping-zip"
                            placeholder="12345"
                            value={shippingZip}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").substring(0, 5)
                              setShippingZip(value)
                              validateField("shippingZip", value)
                            }}
                            onBlur={() => handleBlur("shippingZip")}
                            className={errors.shippingZip && touched.shippingZip ? "border-red-500" : ""}
                          />
                          {errors.shippingZip && touched.shippingZip && (
                            <p className="text-sm text-red-500">{errors.shippingZip}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="shipping-country">País</Label>
                          <Select value={shippingCountry} onValueChange={setShippingCountry}>
                            <SelectTrigger id="shipping-country">
                              <SelectValue placeholder="Seleccionar país" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ES">España</SelectItem>
                              <SelectItem value="PT">Portugal</SelectItem>
                              <SelectItem value="FR">Francia</SelectItem>
                              <SelectItem value="DE">Alemania</SelectItem>
                              <SelectItem value="IT">Italia</SelectItem>
                              <SelectItem value="CU">Cuba</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Dirección de facturación</CardTitle>
                      <CardDescription>Introduzca la dirección para la facturación</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center space-x-2">
                        <Switch id="same-as-shipping" checked={sameAsShipping} onCheckedChange={setSameAsShipping} />
                        <Label htmlFor="same-as-shipping">Usar la misma dirección de envío</Label>
                      </div>

                      {!sameAsShipping && (
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="billing-address">Dirección</Label>
                            <Input
                              id="billing-address"
                              placeholder="Calle, número, piso, puerta"
                              value={billingAddress}
                              onChange={(e) => {
                                setBillingAddress(e.target.value)
                                validateField("billingAddress", e.target.value)
                              }}
                              onBlur={() => handleBlur("billingAddress")}
                              className={errors.billingAddress && touched.billingAddress ? "border-red-500" : ""}
                            />
                            {errors.billingAddress && touched.billingAddress && (
                              <p className="text-sm text-red-500">{errors.billingAddress}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="billing-city">Ciudad</Label>
                              <Input
                                id="billing-city"
                                placeholder="Ciudad"
                                value={billingCity}
                                onChange={(e) => {
                                  setBillingCity(e.target.value)
                                  validateField("billingCity", e.target.value)
                                }}
                                onBlur={() => handleBlur("billingCity")}
                                className={errors.billingCity && touched.billingCity ? "border-red-500" : ""}
                              />
                              {errors.billingCity && touched.billingCity && (
                                <p className="text-sm text-red-500">{errors.billingCity}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="billing-state">Provincia</Label>
                              <Input
                                id="billing-state"
                                placeholder="Provincia"
                                value={billingState}
                                onChange={(e) => setBillingState(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="billing-zip">Código postal</Label>
                              <Input
                                id="billing-zip"
                                placeholder="12345"
                                value={billingZip}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, "").substring(0, 5)
                                  setBillingZip(value)
                                  validateField("billingZip", value)
                                }}
                                onBlur={() => handleBlur("billingZip")}
                                className={errors.billingZip && touched.billingZip ? "border-red-500" : ""}
                              />
                              {errors.billingZip && touched.billingZip && (
                                <p className="text-sm text-red-500">{errors.billingZip}</p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="billing-country">País</Label>
                              <Select value={billingCountry} onValueChange={setBillingCountry}>
                                <SelectTrigger id="billing-country">
                                  <SelectValue placeholder="Seleccionar país" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ES">España</SelectItem>
                                  <SelectItem value="PT">Portugal</SelectItem>
                                  <SelectItem value="FR">Francia</SelectItem>
                                  <SelectItem value="DE">Alemania</SelectItem>
                                  <SelectItem value="IT">Italia</SelectItem>
                                  <SelectItem value="CU">Cuba</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Método de envío
                      </CardTitle>
                      <CardDescription>Seleccione su método de envío preferido</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-4">
                        <div className="flex items-center justify-between border rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="standard" id="standard" />
                            <Label htmlFor="standard">Estándar (3-5 días laborables)</Label>
                          </div>
                          <span className="font-medium">{subtotal > 50000 ? "Gratis" : "15,00 €"}</span>
                        </div>
                        <div className="flex items-center justify-between border rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="express" id="express" />
                            <Label htmlFor="express">Express (1-2 días laborables)</Label>
                          </div>
                          <span className="font-medium">30,00 €</span>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="review" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        Revisar pedido
                      </CardTitle>
                      <CardDescription>Revise los detalles de su pedido antes de finalizar la compra</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Resumen del pedido</h3>
                        <div className="border rounded-lg divide-y">
                          {cart.map((item: any, index: number) => (
                            <div key={index} className="flex justify-between p-4">
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                              </div>
                              <p className="font-medium">{(item.price * item.quantity).toLocaleString("es-ES")} €</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="font-medium">Método de pago</h3>
                        <div className="border rounded-lg p-4">
                          {paymentMethod === "credit-card" && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                <span>Tarjeta terminada en {cardNumber.replace(/\s/g, "").slice(-4)}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  document.querySelector('[value="payment"]')?.dispatchEvent(new MouseEvent("click"))
                                }
                              >
                                Editar
                              </Button>
                            </div>
                          )}
                          {paymentMethod === "paypal" && (
                            <div className="flex items-center justify-between">
                              <span>PayPal</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  document.querySelector('[value="payment"]')?.dispatchEvent(new MouseEvent("click"))
                                }
                              >
                                Editar
                              </Button>
                            </div>
                          )}
                          {paymentMethod === "bank-transfer" && (
                            <div className="flex items-center justify-between">
                              <span>Transferencia bancaria</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  document.querySelector('[value="payment"]')?.dispatchEvent(new MouseEvent("click"))
                                }
                              >
                                Editar
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="font-medium">Dirección de envío</h3>
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p>{shippingAddress}</p>
                              <p>
                                {shippingCity}, {shippingState} {shippingZip}
                              </p>
                              <p>
                                {shippingCountry === "ES"
                                  ? "España"
                                  : shippingCountry === "CU"
                                    ? "Cuba"
                                    : shippingCountry}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                document.querySelector('[value="shipping"]')?.dispatchEvent(new MouseEvent("click"))
                              }
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="font-medium">Método de envío</h3>
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <span>
                              {shippingMethod === "standard"
                                ? "Estándar (3-5 días laborables)"
                                : "Express (1-2 días laborables)"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                document.querySelector('[value="shipping"]')?.dispatchEvent(new MouseEvent("click"))
                              }
                            >
                              Editar
                            </Button>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                        <Textarea
                          id="notes"
                          placeholder="Instrucciones especiales para la entrega, etc."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="accept-terms"
                          checked={acceptTerms}
                          onCheckedChange={setAcceptTerms}
                          className={errors.acceptTerms && touched.acceptTerms ? "border-red-500" : ""}
                        />
                        <Label htmlFor="accept-terms" className="text-sm">
                          He leído y acepto los{" "}
                          <a href="#" className="text-primary underline">
                            términos y condiciones
                          </a>{" "}
                          y la{" "}
                          <a href="#" className="text-primary underline">
                            política de privacidad
                          </a>
                        </Label>
                      </div>
                      {errors.acceptTerms && touched.acceptTerms && (
                        <p className="text-sm text-red-500">{errors.acceptTerms}</p>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Procesando..." : "Finalizar compra"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </form>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString("es-ES")} €</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (21%)</span>
                  <span>{tax.toLocaleString("es-ES")} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>{shipping === 0 ? "Gratis" : `${shipping.toLocaleString("es-ES")} €`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{total.toLocaleString("es-ES")} €</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Pago seguro garantizado</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>Envío gratuito en pedidos superiores a 50.000 €</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>¿Necesita ayuda? Llame al 900 123 456</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
