export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  category_id: string
  name: string
  description: string | null
  price: number
  unit: string
  image_url: string | null
  in_stock: boolean
  stock_quantity: number
  featured: boolean
  created_at: string
  updated_at: string
  categories?: Category
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_address: string | null
  order_type: 'delivery' | 'pickup'
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  subtotal: number
  delivery_fee: number
  total: number
  notes: string | null
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
  created_at: string
}
