'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { Category } from '@/types'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    description: '',
    price: '',
    unit: 'piece',
    in_stock: true,
    featured: false,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.category_id || !form.name || !form.price) {
      toast.error('Please fill in all required fields.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').insert({
      category_id: form.category_id,
      name: form.name,
      description: form.description || null,
      price: parseFloat(form.price),
      unit: form.unit,
      in_stock: form.in_stock,
      featured: form.featured,
    })
    if (error) {
      toast.error('Failed to add product.')
    } else {
      toast.success('Product added!')
      router.push('/admin/products')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <Link href="/admin/products" className="text-sm text-green-600 hover:underline">&larr; Back to Products</Link>
      <h1 className="text-2xl font-bold text-gray-800 mt-2 mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Category *</label>
          <select
            required
            value={form.category_id}
            onChange={e => setForm({ ...form, category_id: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
          >
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Product Name *</label>
          <input
            required
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
            placeholder="e.g. Beef (1kg)"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 resize-none"
            rows={2}
            placeholder="Short description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Price (KSh) *</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
              placeholder="100"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Unit</label>
            <select
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
            >
              {['piece', 'kg', 'g', 'litre', 'ml', 'pack', 'serving', 'loaf', 'bag', 'dozen', 'bunch', 'bottle', 'cake'].map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={e => setForm({ ...form, in_stock: e.target.checked })}
              className="w-4 h-4 accent-green-600"
            />
            <span className="text-sm text-gray-700">In Stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={e => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-green-600"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}
