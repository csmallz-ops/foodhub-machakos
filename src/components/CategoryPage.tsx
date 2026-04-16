import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

interface Props {
  slug: string
  title: string
  description: string
  icon: string
  gradient: string
}

export default async function CategoryPage({ slug, title, description, icon, gradient }: Props) {
  let products: Product[] = []

  try {
    const supabase = await createClient()
    const { data: category } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (category) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .order('featured', { ascending: false })
        .order('name')
      products = (data as Product[]) ?? []
    }
  } catch {
    // Data will load at runtime
  }

  return (
    <div>
      {/* Header */}
      <div className={`bg-gradient-to-br ${gradient} text-white py-12 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-5xl mb-3">{icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-white/80 text-lg max-w-lg">{description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {products.length > 0 ? (
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
            <p className="text-lg">Loading products...</p>
          </div>
        )}
      </div>
    </div>
  )
}
