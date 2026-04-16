'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/store/cart'

const navLinks = [
  { href: '/fast-food', label: 'Fast Food', icon: '🍔' },
  { href: '/butchery', label: 'Butchery', icon: '🥩' },
  { href: '/bakery', label: 'Bakery', icon: '🍞' },
  { href: '/groceries', label: 'Groceries', icon: '🥦' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const itemCount = useCart(s => s.itemCount())

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-green-700 text-white text-xs py-1 px-4 flex items-center justify-between">
        <span className="flex items-center gap-1"><MapPin size={12} /> Machakos Town, Machakos County, Kenya</span>
        <a href="tel:+254700000000" className="flex items-center gap-1"><Phone size={12} /> +254 700 000 000</a>
      </div>
      {/* Main navbar */}
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <div>
            <div className="font-bold text-green-700 text-lg leading-tight">FoodHub</div>
            <div className="text-xs text-gray-500 leading-tight">Machakos</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition"
            >
              <span>{link.icon}</span> {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 hover:bg-green-50 rounded-full transition">
            <ShoppingCart size={22} className="text-green-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-3 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700"
            >
              <span className="text-xl">{link.icon}</span> {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
