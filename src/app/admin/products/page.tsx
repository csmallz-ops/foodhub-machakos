import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import ProductToggle from './ProductToggle'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name, icon)')
    .order('category_id')
    .order('name')

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
              {products?.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-800">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-400 truncate max-w-[200px]">{product.description}</div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(product.categories as any)?.icon} {(product.categories as any)?.name}
                  </td>
                  <td className="px-5 py-3 font-bold text-green-700">KSh {Number(product.price).toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-500">{product.unit}</td>
                  <td className="px-5 py-3">
                    <ProductToggle productId={product.id} field="featured" value={product.featured} />
                  </td>
                  <td className="px-5 py-3">
                    <ProductToggle productId={product.id} field="in_stock" value={product.in_stock} />
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
