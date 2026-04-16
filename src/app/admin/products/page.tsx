'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import ProductToggle from './ProductToggle'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('products').select('*, categories(name, icon)').order('name')
      .then(({ data }) => {
        setProducts(data as Record<string, unknown>[] ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-sm text-green-600 hover:underline">&larr; Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Price</th>
                <th className="px-5 py-3 text-left">Unit</th>
                <th className="px-5 py-3 text-left">Featured</th>
                <th className="px-5 py-3 text-left">In Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading products...</td></tr>
              ) : products.map(product => (
                <tr key={product.id as string} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{product.name as string}</div>
                    {product.description && (
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{product.description as string}</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {(product.categories as Record<string, string>)?.icon} {(product.categories as Record<string, string>)?.name}
                  </td>
                  <td className="px-5 py-3 font-bold text-green-700">KSh {Number(product.price).toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-500">{product.unit as string}</td>
                  <td className="px-5 py-3">
                    <ProductToggle productId={product.id as string} field="featured" value={product.featured as boolean} />
                  </td>
                  <td className="px-5 py-3">
                    <ProductToggle productId={product.id as string} field="in_stock" value={product.in_stock as boolean} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
