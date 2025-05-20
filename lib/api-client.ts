// Cliente API para consumir los endpoints desde el frontend

// Función para hacer peticiones a la API
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `/api${endpoint}`
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  })

  // Log para depuración
  console.log(`[API Client] ${options.method || "GET"} ${url} - Status: ${response.status}`)

  const data = await response.json()

  // Log para depuración
  console.log(`[API Client] Response data:`, data)

  if (!response.ok) {
    throw new Error(data.error || "Error en la petición")
  }

  return data
}

// Autenticación
export async function login(username: string, password: string) {
  return fetchAPI<{ user: any; token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  })
}

export async function register(userData: any) {
  return fetchAPI<{ user: any; token: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function getCurrentUser() {
  return fetchAPI<{ user: any }>("/auth/me")
}

// Usuarios
export async function getUsers() {
  return fetchAPI<any[]>("/users")
}

export async function getUser(id: number) {
  return fetchAPI<any>(`/users/${id}`)
}

export async function createUser(userData: any) {
  return fetchAPI<any>("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  })
}

export async function updateUser(id: number, userData: any) {
  return fetchAPI<any>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  })
}

export async function deleteUser(id: number) {
  return fetchAPI<any>(`/users/${id}`, {
    method: "DELETE",
  })
}

// Productos
export async function getProducts(category?: string) {
  const query = category ? `?category=${category}` : ""
  return fetchAPI<any[]>(`/products${query}`)
}

export async function getProduct(id: number) {
  return fetchAPI<any>(`/products/${id}`)
}

export async function createProduct(productData: any) {
  return fetchAPI<any>("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  })
}

export async function updateProduct(id: number, productData: any) {
  return fetchAPI<any>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  })
}

export async function deleteProduct(id: number) {
  return fetchAPI<any>(`/products/${id}`, {
    method: "DELETE",
  })
}

// Órdenes
export async function getOrders(userId?: number) {
  const query = userId ? `?userId=${userId}` : ""
  return fetchAPI<any[]>(`/orders${query}`)
}

export async function getOrder(id: number) {
  return fetchAPI<any>(`/orders/${id}`)
}

export async function createOrder(orderData: any) {
  return fetchAPI<any>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  })
}

export async function updateOrder(id: number, orderData: any) {
  return fetchAPI<any>(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(orderData),
  })
}

export async function deleteOrder(id: number) {
  return fetchAPI<any>(`/orders/${id}`, {
    method: "DELETE",
  })
}

// Soporte
export async function getSupportTickets(userId?: number) {
  const query = userId ? `?userId=${userId}` : ""
  return fetchAPI<any[]>(`/support${query}`)
}

export async function getSupportTicket(id: number) {
  return fetchAPI<any>(`/support/${id}`)
}

export async function createSupportTicket(ticketData: any) {
  return fetchAPI<any>("/support", {
    method: "POST",
    body: JSON.stringify(ticketData),
  })
}

export async function updateSupportTicket(id: number, ticketData: any) {
  return fetchAPI<any>(`/support/${id}`, {
    method: "PUT",
    body: JSON.stringify(ticketData),
  })
}

export async function deleteSupportTicket(id: number) {
  return fetchAPI<any>(`/support/${id}`, {
    method: "DELETE",
  })
}

// FAQs
export async function getFAQs(category?: string) {
  const query = category ? `?category=${category}` : ""
  return fetchAPI<any[]>(`/faq${query}`)
}

export async function getFAQ(id: number) {
  return fetchAPI<any>(`/faq/${id}`)
}

export async function createFAQ(faqData: any) {
  return fetchAPI<any>("/faq", {
    method: "POST",
    body: JSON.stringify(faqData),
  })
}

export async function updateFAQ(id: number, faqData: any) {
  return fetchAPI<any>(`/faq/${id}`, {
    method: "PUT",
    body: JSON.stringify(faqData),
  })
}

export async function deleteFAQ(id: number) {
  return fetchAPI<any>(`/faq/${id}`, {
    method: "DELETE",
  })
}
