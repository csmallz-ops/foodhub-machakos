'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled']

interface Props {
  orderId: string
  currentStatus: string
}

export default function OrderStatusUpdater({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  const handleChange = async (newStatus: string) => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)

    if (error) {
      toast.error('Failed to update status')
    } else {
      setStatus(newStatus)
      toast.success(`Status updated to ${newStatus}`)
    }
    setLoading(false)
  }

  return (
    <select
      value={status}
      onChange={e => handleChange(e.target.value)}
      disabled={loading}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-green-400 bg-white capitalize disabled:opacity-50"
    >
      {statuses.map(s => (
        <option key={s} value={s} className="capitalize">{s}</option>
      ))}
    </select>
  )
}
