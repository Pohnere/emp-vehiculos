// Definición de tipos para la aplicación

// Usuario
export interface User {
  id: number
  name: string
  username: string
  email: string
  password: string
  role: "admin" | "cliente"
  status: "activo" | "inactivo"
  createdAt: string
  updatedAt?: string
}

// Producto
export interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  images: string[]
  autonomy: number
  autonomyLevel: number
  category: string
  stock: number
  badge?: string
  specs: {
    motor: string
    bateria: string
    aceleracion: string
    velocidadMaxima: string
    carga: string
    dimensiones: string
    peso: string
    [key: string]: string
  }
  features: string[]
}

// Item de orden
export interface OrderItem {
  productId: number
  quantity: number
  price: number
  name: string
  image: string
}

// Orden
export interface Order {
  id: number
  userId: number
  items: OrderItem[]
  total: number
  status: "pendiente" | "en_proceso" | "enviado" | "entregado" | "cancelado"
  createdAt: string
  updatedAt: string
  shippingAddress?: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod?: string
}

// Ticket de soporte
export interface SupportTicket {
  id: number
  userId?: number
  name: string
  email: string
  subject: string
  message: string
  category: "technical" | "billing" | "general" | "other"
  status: "abierto" | "en_proceso" | "resuelto" | "cerrado"
  createdAt: string
  updatedAt: string
  response?: string
}

// FAQ
export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  order: number
}

// Configuración del sistema
export interface SystemConfig {
  maintenanceMode: boolean
  theme: "light" | "dark"
  language: "es" | "en"
  accentColor: string
  fontSize: "small" | "medium" | "large"
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  security: {
    twoFactorAuth: boolean
    passwordExpiration: number
  }
}

// Carrito de compras
export interface CartItem {
  productId: number
  quantity: number
  name: string
  price: number
  image: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

// Respuesta de API
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Datos de pago
export interface PaymentData {
  cardNumber: string
  cardHolder: string
  expiryDate: string
  cvv: string
  billingAddress: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

// Datos de envío
export interface ShippingData {
  fullName: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}
