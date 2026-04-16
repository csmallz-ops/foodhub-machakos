'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard'
import { ArrowRight, Star, Truck, Clock, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

const categories = [
  { slug: 'fast-food', label: 'Fast Food', icon: '🍔', color: 'from-orange-400 to-red-500', desc: 'Chips, burgers, chicken & more' },
  { slug: 'butchery', label: 'Butchery', icon: '🥩', color: 'from-red-500 to-rose-600', desc: 'Fresh beef, goat, chicken & more' },
  { slug: 'bakery', label: 'Bakery', icon: '🍞', color: 'from-amber-400 to-orange-500', desc: 'Bread, mandazi, cakes & more' },
  { slug: 'groceries', label: 'Groceries', icon: '🥦', color: 'from-green-500 to-emerald-600', desc: 'Veggies, fruits & daily essentials' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('products')
      .select('*, categories(*)')
      .eq('featured', true)
      .eq('in_stock', true)
      .limit(8)
      .then(({ data }) => setFeatured((data as Product[]) ?? []))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🍽️</div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Fresh Food, Right Here<br />in Machakos Town
          </h1>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Fast food, fresh meat from our butchery, daily baked goods, and all your grocery needs — all under one roof.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(c => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white px-5 py-3 rounded-full font-medium transition"
              >
                <span>{c.icon}</span> {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: <Truck size={22} className="text-green-600" />, title: 'Delivery Available', desc: 'Within Machakos Town' },
          { icon: <Clock size={22} className="text-green-600" />, title: 'Open Daily', desc: '7:00 AM – 9:00 PM' },
          { icon: <Star size={22} className="text-green-600" />, title: 'Fresh Quality', desc: 'Farm to table daily' },
          { icon: <Shield size={22} className="text-green-600" />, title: 'Safe & Hygienic', desc: 'Health standards met' },
        ].map((f, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-3">
            <div className="mt-0.5">{f.icon}</div>
            <div>
              <div className="font-semibold text-sm text-gray-800">{f.title}</div>
              <div className="text-xs text-gray-500">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Category Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Our Sections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(c => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className={`bg-gradient-to-br ${c.color} text-white rounded-xl p-5 hover:scale-105 transition-transform shadow-md`}
            >
              <div className="text-4xl mb-2">{c.icon}</div>
              <div className="font-bold text-lg">{c.label}</div>
              <div className="text-sm opacity-90 mt-1">{c.desc}</div>
              <div className="flex items-center gap-1 mt-3 text-xs opacity-80 font-medium">
                Shop now <ArrowRight size={12} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Items</h2>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <Star size={14} className="fill-green-600 text-green-600" /> Bestsellers
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-amber-50 border-y border-amber-100 py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl mb-3">📞</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Order by Phone or Walk In</h3>
          <p className="text-gray-600 mb-4">Call us to place a bulk order or visit us at our shop in Machakos Town.</p>
          <a
            href="tel:+254700000000"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
          >
            📱 +254 700 000 000
          </a>
        </div>
      </section>
    </div>
  )
}
