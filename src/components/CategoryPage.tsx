'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

interface Props {
  slug: string
  title: string
  description: string
  icon: string
  gradient: string
}

export default function CategoryPage({ slug, title, description, icon, gradient }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()
      .then(({ data: category }) => {
        if (!category) { setLoading(false); return }
        return supabase
          .from('products')
          .select('*')
          .eq('category_id', category.id)
          .order('featured', { ascending: false })
          .order('name')
      })
      .then(res => {
        if (res) setProducts((res.data as Product[]) ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  return (
    <div>
      <div className={`bg-gradient-to-br ${gradient} text-white py-12 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-5xl mb-3">{icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-white/80 text-lg max-w-lg">{description}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-48 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="text-gray-500 text-sm mb-6">{products.length} items available</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-lg">No products found. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
