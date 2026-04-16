import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Package, ShoppingBag, TrendingUp, Clock } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: totalProducts },
    { data: recentOrders },
    { data: revenue },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
    supabase.from('orders').select('total').neq('status', 'cancelled'),
  ])

  const totalRevenue = revenue?.reduce((sum, o) => sum + (o.total || 0), 0) ?? 0

  const stats = [
    { label: 'Total Orders', value: totalOrders ?? 0, icon: <ShoppingBag size={22} />, color: 'bg-blue-500' },
    { label: 'Pending Orders', value: pendingOrders ?? 0, icon: <Clock size={22} />, color: 'bg-orange-500' },
    { label: 'Products', value: totalProducts ?? 0, icon: <Package size={22} />, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `KSh ${totalRevenue.toLocaleString()}`, icon: <TrendingUp size={22} />, color: 'bg-green-600' },
  ]

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-green-100 text-green-800',
    delivered: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">FoodHub Machakos — Sales Management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
            All Orders
          </Link>
          <Link href="/admin/products" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition">
            Products
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className={`${s.color} text-white w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800">{s.value}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-green-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Order #</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Total</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders?.length ? recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono font-medium text-green-700">{order.order_number}</td>
                  <td className="px-5 py-3 font-medium">{order.customer_name}</td>
                  <td className="px-5 py-3 text-gray-600">{order.customer_phone}</td>
                  <td className="px-5 py-3 capitalize text-gray-600">{order.order_type}</td>
                  <td className="px-5 py-3 font-bold">KSh {Number(order.total).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-green-600 hover:underline text-xs font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
