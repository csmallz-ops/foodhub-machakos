'use client'

import Link from 'next/link'
import { useCart } from '@/store/cart'
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    useCart.persist.rehydrate()
    setMounted(true)
  }, [])
  const count = itemCount()
  const subtotal = total()
  if (!mounted) return null
  const deliveryFee = 0

  if (count === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add items from our sections to get started.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/fast-food', label: 'Fast Food', icon: '🍔' },
            { href: '/butchery', label: 'Butchery', icon: '🥩' },
            { href: '/bakery', label: 'Bakery', icon: '🍞' },
            { href: '/groceries', label: 'Groceries', icon: '🥦' },
          ].map(c => (
            <Link
              key={c.href}
              href={c.href}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-green-400 hover:bg-green-50 transition"
            >
              <div className="text-3xl mb-1">{c.icon}</div>
              <div className="text-sm font-medium text-gray-700">{c.label}</div>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart ({count} items)</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div
              key={item.product.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4"
            >
              <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                🍽️
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-800 truncate">{item.product.name}</h3>
                <p className="text-green-700 font-bold text-sm mt-0.5">
                  KSh {item.product.price.toLocaleString()}/{item.product.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
                >
                  <Minus size={12} />
                </button>
                <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-7 h-7 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center text-green-700"
                >
                  <Plus size={12} />
                </button>
              </div>
              <div className="text-right min-w-[70px]">
                <div className="font-bold text-sm text-gray-800">
                  KSh {(item.product.price * item.quantity).toLocaleString()}
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-red-400 hover:text-red-600 mt-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({count} items)</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span className="text-green-600">{deliveryFee === 0 ? 'TBD' : `KSh ${deliveryFee}`}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-gray-800 text-base">
                <span>Total</span>
                <span className="text-green-700">KSh {subtotal.toLocaleString()}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-5 w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              className="mt-3 w-full text-center text-sm text-green-600 hover:underline block"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
