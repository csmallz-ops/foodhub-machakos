'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import OrderStatusUpdater from './OrderStatusUpdater'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders(data as Record<string, unknown>[] ?? [])
        setLoading(false)
      })
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/admin" className="text-sm text-green-600 hover:underline">&larr; Dashboard</Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">All Orders</h1>
        </div>
        <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{orders.length} total</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Order #</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Phone</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-left">Total</th>
                <th className="px-5 py-3 text-left">Payment</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">Loading orders...</td></tr>
              ) : orders.length ? orders.map(order => (
                <tr key={order.id as string} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono font-medium text-green-700">{order.order_number as string}</td>
                  <td className="px-5 py-3 font-medium">{order.customer_name as string}</td>
                  <td className="px-5 py-3 text-gray-600">
                    <a href={`tel:${order.customer_phone}`} className="hover:text-green-600">{order.customer_phone as string}</a>
                  </td>
                  <td className="px-5 py-3 capitalize text-gray-600">{order.order_type as string}</td>
                  <td className="px-5 py-3 font-bold">KSh {Number(order.total).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.payment_status as string}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status as string] || 'bg-gray-100 text-gray-800'}`}>
                      {order.status as string}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">
                    {new Date(order.created_at as string).toLocaleString()}
                  </td>
                  <td className="px-5 py-3">
                    <OrderStatusUpdater orderId={order.id as string} currentStatus={order.status as string} />
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
