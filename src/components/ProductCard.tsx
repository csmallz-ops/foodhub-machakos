'use client'

import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { items, addItem, updateQuantity } = useCart()
  const cartItem = items.find(i => i.product.id === product.id)
  const qty = cartItem?.quantity ?? 0

  const handleAdd = () => {
    addItem(product)
    toast.success(`${product.name} added to cart!`, { duration: 1500 })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
      <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-6xl">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span>🍽️</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-green-700 font-bold text-lg">KSh {product.price.toLocaleString()}</span>
            <span className="text-gray-400 text-xs ml-1">/{product.unit}</span>
          </div>
          {!product.in_stock ? (
            <span className="text-xs text-red-500 font-medium">Out of stock</span>
          ) : qty === 0 ? (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              <ShoppingCart size={13} /> Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-green-50 rounded-lg border border-green-200 p-1">
              <button
                onClick={() => updateQuantity(product.id, qty - 1)}
                className="w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm font-bold w-5 text-center text-green-800">{qty}</span>
              <button
                onClick={() => updateQuantity(product.id, qty + 1)}
                className="w-6 h-6 flex items-center justify-center bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
