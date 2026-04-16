'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

interface Props {
  productId: string
  field: 'featured' | 'in_stock'
  value: boolean
}

export default function ProductToggle({ productId, field, value }: Props) {
  const [checked, setChecked] = useState(value)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ [field]: !checked })
      .eq('id', productId)

    if (error) {
      toast.error('Failed to update')
    } else {
      setChecked(!checked)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  )
}
