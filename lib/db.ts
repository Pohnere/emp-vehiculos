// Simulación de base de datos con persistencia en localStorage
import type { User, Product, Order, SupportTicket, FAQ } from "./types"

// Función para inicializar usuarios en localStorage
export function initializeUsers() {
  // Verificar si ya existen usuarios en localStorage
  const existingUsers = localStorage.getItem("users")
  if (!existingUsers) {
    // Si no existen, inicializar con los usuarios predeterminados
    const defaultUsers: User[] = [
      {
        id: "1",
        username: "Ernesto",
        password: "Ernesto.2003",
        email: "ernesto@ecodrive.com",
        role: "admin",
        name: "Ernesto Alejandro",
        lastName: "Ramos Díaz",
        phone: "+53 55123456",
        address: "Calle 23, La Habana, Cuba",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        username: "user",
        password: "user",
        email: "user@example.com",
        role: "cliente",
        name: "Usuario",
        lastName: "Ejemplo",
        phone: "+53 55987654",
        address: "Calle 10, Santiago de Cuba, Cuba",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        username: "Daisander",
        password: "Daisander.2004",
        email: "daisander@example.com",
        role: "cliente",
        name: "Daisander",
        lastName: "Cliente",
        phone: "+53 55456789",
        address: "Calle Principal, Varadero, Cuba",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  }
}

// Función para obtener todos los usuarios
export function getUsers(): User[] {
  if (typeof window !== "undefined") {
    // En el cliente, obtener de localStorage
    const usersJson = localStorage.getItem("users")
    return usersJson ? JSON.parse(usersJson) : []
  } else {
    // En el servidor, devolver un array vacío o datos predeterminados
    return []
  }
}

// Función para obtener un usuario por ID
export function getUserById(id: string): User | undefined {
  return getUsers().find((user) => user.id === id)
}

// Función para obtener un usuario por nombre de usuario
export function getUserByUsername(username: string): User | undefined {
  return getUsers().find((user) => user.username === username)
}

// Función para crear un nuevo usuario
export function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
  const users = getUsers()
  const newUser: User = {
    ...user,
    id: (users.length + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  users.push(newUser)
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(users))
  }

  return newUser
}

// Función para actualizar un usuario existente
export function updateUser(id: string, userData: Partial<User>): User | undefined {
  const users = getUsers()
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) return undefined

  const updatedUser: User = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString(),
  }

  users[userIndex] = updatedUser
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(users))
  }

  return updatedUser
}

// Función para eliminar un usuario
export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filteredUsers = users.filter((user) => user.id !== id)

  if (filteredUsers.length === users.length) return false

  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(filteredUsers))
  }

  return true
}

// Función para autenticar un usuario
export function authenticateUser(username: string, password: string): User | undefined {
  return getUsers().find((user) => user.username === username && user.password === password && user.status === "active")
}

// Intentar inicializar datos cuando se carga el módulo
try {
  if (typeof window !== "undefined") {
    initializeUsers()
  }
} catch (error) {
  console.error("Error al inicializar datos:", error)
}

// Productos de ejemplo
const products: Product[] = [
  {
    id: 1,
    name: "Model E",
    price: 45000,
    description:
      "El Model E es un sedán eléctrico de última generación que combina rendimiento excepcional con un bajo impacto ambiental. Con una autonomía de 500 km y tecnología autónoma de nivel 3, este vehículo representa el futuro de la movilidad sostenible.",
    image: "/luxury-electric-sedan.png",
    images: ["/luxury-electric-sedan.png", "/placeholder-ke6ym.png", "/sleek-electric-sedan-interior.png"],
    autonomy: 500,
    autonomyLevel: 3,
    category: "sedan",
    stock: 10,
    badge: "60% menos emisiones",
    specs: {
      motor: "Eléctrico dual, 350 kW",
      bateria: "85 kWh, litio-ion",
      aceleracion: "0-100 km/h en 4.5 segundos",
      velocidadMaxima: "250 km/h",
      carga: "Supercharger (30 min al 80%)",
      dimensiones: "4.8m x 1.9m x 1.4m",
      peso: "1,950 kg",
    },
    features: [
      "Piloto automático avanzado",
      "Pantalla táctil de 15 pulgadas",
      "Sistema de sonido premium",
      "Asientos de cuero vegano",
      "Climatización de doble zona",
      "Cámaras 360°",
      "Conectividad 5G",
    ],
  },
  {
    id: 2,
    name: "Model X",
    price: 55000,
    description:
      "El Model X es un crossover versátil que combina la practicidad de un SUV con la eficiencia de un sedán. Con una autonomía de 600 km y tecnología autónoma de nivel 3, este vehículo es ideal para todo tipo de terrenos y condiciones.",
    image: "/crossover-ev.png",
    images: ["/crossover-ev.png", "/placeholder-fk3t7.png", "/crossover-ev-interior.png"],
    autonomy: 600,
    autonomyLevel: 3,
    category: "crossover",
    stock: 8,
    badge: "Versátil",
    specs: {
      motor: "Eléctrico dual, 300 kW",
      bateria: "90 kWh, litio-ion",
      aceleracion: "0-100 km/h en 5.8 segundos",
      velocidadMaxima: "210 km/h",
      carga: "Carga rápida (35 min al 80%)",
      dimensiones: "4.7m x 1.9m x 1.6m",
      peso: "2,050 kg",
    },
    features: [
      "Tracción integral",
      "Pantalla táctil de 12 pulgadas",
      "Sistema de navegación avanzado",
      "Asientos reclinables",
      "Climatización automática",
      "Portón trasero eléctrico",
      "Sensores de aparcamiento",
    ],
  },
  {
    id: 3,
    name: "Model M",
    price: 30000,
    description:
      "El Model M es un mini urbano perfecto para la ciudad, con un diseño compacto y ágil. Con una autonomía de 300 km y tecnología autónoma de nivel 2, este vehículo es ideal para desplazamientos urbanos y estacionamiento en espacios reducidos.",
    image: "/mini-electric-car.png",
    images: ["/mini-electric-car.png", "/placeholder-roimk.png", "/mini-electric-car-interior.png"],
    autonomy: 300,
    autonomyLevel: 2,
    category: "mini",
    stock: 15,
    badge: "Económico",
    specs: {
      motor: "Eléctrico, 100 kW",
      bateria: "40 kWh, litio-ion",
      aceleracion: "0-100 km/h en 8.5 segundos",
      velocidadMaxima: "150 km/h",
      carga: "Carga estándar (40 min al 80%)",
      dimensiones: "3.5m x 1.7m x 1.5m",
      peso: "1,200 kg",
    },
    features: [
      "Asistente de frenado",
      "Pantalla táctil de 8 pulgadas",
      "Sistema de audio básico",
      "Asientos compactos",
      "Aire acondicionado",
      "Cámara de visión trasera",
      "Conectividad Bluetooth",
    ],
  },
]

// Órdenes de ejemplo
const orders: Order[] = [
  {
    id: 1001,
    userId: 2,
    items: [
      {
        productId: 1,
        quantity: 1,
        price: 45000,
        name: "Model E",
        image: "/luxury-electric-sedan.png",
      },
    ],
    total: 45000,
    status: "entregado",
    createdAt: "2023-02-15T10:30:00.000Z",
    updatedAt: "2023-02-20T14:20:00.000Z",
  },
  {
    id: 1002,
    userId: 2,
    items: [
      {
        productId: 3,
        quantity: 1,
        price: 30000,
        name: "Model M",
        image: "/mini-electric-car.png",
      },
    ],
    total: 30000,
    status: "en_proceso",
    createdAt: "2023-03-10T09:15:00.000Z",
    updatedAt: "2023-03-10T09:15:00.000Z",
  },
]

// Tickets de soporte de ejemplo
const supportTickets: SupportTicket[] = [
  {
    id: 1,
    userId: 2,
    name: "Usuario",
    email: "user@example.com",
    subject: "Problema con la carga",
    message: "Mi vehículo no está cargando correctamente. ¿Pueden ayudarme?",
    category: "technical",
    status: "en_proceso",
    createdAt: "2023-02-18T11:45:00.000Z",
    updatedAt: "2023-02-19T09:30:00.000Z",
  },
]

// FAQs de ejemplo
const faqs: FAQ[] = [
  {
    id: 1,
    question: "¿Cuál es la autonomía de los vehículos eléctricos?",
    answer:
      "La autonomía de nuestros vehículos eléctricos varía según el modelo, desde 300 km para el Model M hasta 800 km para nuestros modelos premium.",
    category: "vehiculos",
    order: 1,
  },
  {
    id: 2,
    question: "¿Cómo puedo cargar mi vehículo en casa?",
    answer:
      "Ofrecemos soluciones de carga doméstica que se adaptan a tu instalación eléctrica. Nuestros técnicos realizarán una evaluación y te recomendarán la mejor opción.",
    category: "carga",
    order: 2,
  },
  {
    id: 3,
    question: "¿Cuánto tiempo tarda en cargarse completamente?",
    answer:
      "El tiempo de carga depende del modelo y del tipo de cargador. Con un Supercharger, puedes cargar hasta el 80% en 30-40 minutos. Con un cargador doméstico, puede tardar entre 6-10 horas para una carga completa.",
    category: "carga",
    order: 3,
  },
]

// Exportar las constantes para que estén disponibles en otros archivos
export { products, orders, supportTickets, faqs }

// Funciones para productos
export function getProducts(): Product[] {
  return products
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id)
}

export async function createProduct(productData: Omit<Product, "id">): Promise<Product> {
  console.log(`[DB] Creando nuevo producto: ${productData.name}`)
  const newProduct: Product = {
    id: products.length + 1,
    ...productData,
  }
  products.push(newProduct)
  return newProduct
}

export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
  console.log(`[DB] Actualizando producto con ID: ${id}`)
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return undefined

  const updatedProduct = {
    ...products[index],
    ...productData,
  }
  products[index] = updatedProduct
  return updatedProduct
}

export async function deleteProduct(id: number): Promise<boolean> {
  console.log(`[DB] Eliminando producto con ID: ${id}`)
  const index = products.findIndex((product) => product.id === id)
  if (index === -1) return false

  products.splice(index, 1)
  return true
}

// Funciones para órdenes
export async function getOrders(userId?: number): Promise<Order[]> {
  console.log(`[DB] Obteniendo órdenes${userId ? ` para usuario ${userId}` : ""}`)
  if (userId) {
    return orders.filter((order) => order.userId === userId)
  }
  return orders
}

export async function getOrderById(id: number): Promise<Order | undefined> {
  console.log(`[DB] Buscando orden con ID: ${id}`)
  return orders.find((order) => order.id === id)
}

export async function createOrder(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> {
  console.log(`[DB] Creando nueva orden para usuario: ${orderData.userId}`)
  const now = new Date().toISOString()
  const newOrder: Order = {
    id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1001,
    ...orderData,
    createdAt: now,
    updatedAt: now,
  }
  orders.push(newOrder)
  return newOrder
}

export async function updateOrder(id: number, orderData: Partial<Order>): Promise<Order | undefined> {
  console.log(`[DB] Actualizando orden con ID: ${id}`)
  const index = orders.findIndex((order) => order.id === id)
  if (index === -1) return undefined

  const updatedOrder = {
    ...orders[index],
    ...orderData,
    updatedAt: new Date().toISOString(),
  }
  orders[index] = updatedOrder
  return updatedOrder
}

export async function deleteOrder(id: number): Promise<boolean> {
  console.log(`[DB] Eliminando orden con ID: ${id}`)
  const index = orders.findIndex((order) => order.id === id)
  if (index === -1) return false

  orders.splice(index, 1)
  return true
}

// Funciones para tickets de soporte
export async function getSupportTickets(userId?: number): Promise<SupportTicket[]> {
  console.log(`[DB] Obteniendo tickets de soporte${userId ? ` para usuario ${userId}` : ""}`)
  if (userId) {
    return supportTickets.filter((ticket) => ticket.userId === userId)
  }
  return supportTickets
}

export async function getSupportTicketById(id: number): Promise<SupportTicket | undefined> {
  console.log(`[DB] Buscando ticket de soporte con ID: ${id}`)
  return supportTickets.find((ticket) => ticket.id === id)
}

export async function createSupportTicket(
  ticketData: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "status">,
): Promise<SupportTicket> {
  console.log(`[DB] Creando nuevo ticket de soporte para: ${ticketData.email}`)
  const now = new Date().toISOString()
  const newTicket: SupportTicket = {
    id: supportTickets.length + 1,
    ...ticketData,
    status: "abierto",
    createdAt: now,
    updatedAt: now,
  }
  supportTickets.push(newTicket)
  return newTicket
}

export async function updateSupportTicket(
  id: number,
  ticketData: Partial<SupportTicket>,
): Promise<SupportTicket | undefined> {
  console.log(`[DB] Actualizando ticket de soporte con ID: ${id}`)
  const index = supportTickets.findIndex((ticket) => ticket.id === id)
  if (index === -1) return undefined

  const updatedTicket = {
    ...supportTickets[index],
    ...ticketData,
    updatedAt: new Date().toISOString(),
  }
  supportTickets[index] = updatedTicket
  return updatedTicket
}

export async function deleteSupportTicket(id: number): Promise<boolean> {
  console.log(`[DB] Eliminando ticket de soporte con ID: ${id}`)
  const index = supportTickets.findIndex((ticket) => ticket.id === id)
  if (index === -1) return false

  supportTickets.splice(index, 1)
  return true
}

// Funciones para FAQs
export async function getFAQs(category?: string): Promise<FAQ[]> {
  console.log(`[DB] Obteniendo FAQs${category ? ` para categoría ${category}` : ""}`)
  if (category) {
    return faqs.filter((faq) => faq.category === category)
  }
  return faqs
}

export async function getFAQById(id: number): Promise<FAQ | undefined> {
  console.log(`[DB] Buscando FAQ con ID: ${id}`)
  return faqs.find((faq) => faq.id === id)
}

export async function createFAQ(faqData: Omit<FAQ, "id">): Promise<FAQ> {
  console.log(`[DB] Creando nueva FAQ: ${faqData.question.substring(0, 30)}...`)
  const newFAQ: FAQ = {
    id: faqs.length + 1,
    ...faqData,
  }
  faqs.push(newFAQ)
  return newFAQ
}

export async function updateFAQ(id: number, faqData: Partial<FAQ>): Promise<FAQ | undefined> {
  console.log(`[DB] Actualizando FAQ con ID: ${id}`)
  const index = faqs.findIndex((faq) => faq.id === id)
  if (index === -1) return undefined

  const updatedFAQ = {
    ...faqs[index],
    ...faqData,
  }
  faqs[index] = updatedFAQ
  return updatedFAQ
}

export async function deleteFAQ(id: number): Promise<boolean> {
  console.log(`[DB] Eliminando FAQ con ID: ${id}`)
  const index = faqs.findIndex((faq) => faq.id === id)
  if (index === -1) return false

  faqs.splice(index, 1)
  return true
}

// Función para generar un ID único
export function generateId(collection: any[]): number {
  if (collection.length === 0) return 1
  return Math.max(...collection.map((item) => item.id)) + 1
}
