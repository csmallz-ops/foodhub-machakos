'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { CheckCircle, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const subtotal = total()
  const [loading, setLoading] = useState(false)
  const [orderDone, setOrderDone] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    orderType: 'pickup' as 'pickup' | 'delivery',
    address: '',
    notes: '',
    paymentMethod: 'cash',
  })

  const deliveryFee = form.orderType === 'delivery' ? 100 : 0
  const grandTotal = subtotal + deliveryFee

  if (items.length === 0 && !orderDone) {
    router.push('/cart')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.phone) {
      toast.error('Please fill in your name and phone number.')
      return
    }
    if (form.orderType === 'delivery' && !form.address) {
      toast.error('Please enter your delivery address.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const orderNumber = `FH-${Date.now().toString().slice(-6)}`

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: form.name,
          customer_phone: form.phone,
          customer_email: form.email || null,
          delivery_address: form.address || null,
          order_type: form.orderType,
          subtotal,
          delivery_fee: deliveryFee,
          total: grandTotal,
          notes: form.notes || null,
          payment_method: form.paymentMethod,
        })
        .select()
        .single()

      if (orderError) throw orderError

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      clearCart()
      setOrderDone(orderNumber)
      toast.success('Order placed successfully!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderDone) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <CheckCircle size={72} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h1>
        <p className="text-gray-600 mb-4">
          Your order <strong className="text-green-700">#{orderDone}</strong> has been received.
          We will call you at <strong>{form.phone}</strong> to confirm.
        </p>
        <div className="bg-green-50 rounded-xl p-5 mb-6 text-sm text-gray-700">
          <div className="font-semibold text-green-800 mb-2">Order Details</div>
          <div className="flex justify-between"><span>Order Type:</span><span className="capitalize">{form.orderType}</span></div>
          <div className="flex justify-between"><span>Payment:</span><span className="capitalize">{form.paymentMethod}</span></div>
          <div className="flex justify-between font-bold mt-2 text-base"><span>Total:</span><span className="text-green-700">KSh {grandTotal.toLocaleString()}</span></div>
        </div>
        <button
          onClick={() => router.push('/')}
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Back to Home
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
                  placeholder="John Mwenda"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 block mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400"
                  placeholder="you@email.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Order Type</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(['pickup', 'delivery'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, orderType: type })}
                  className={`border-2 rounded-xl p-3 text-sm font-medium transition capitalize ${
                    form.orderType === type
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {type === 'pickup' ? '🏪 Pickup from Shop' : '🚗 Home Delivery (+KSh 100)'}
                </button>
              ))}
            </div>
            {form.orderType === 'delivery' && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Delivery Address *</label>
                <textarea
                  required
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 resize-none"
                  rows={2}
                  placeholder="Street, estate, landmark..."
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'cash', label: '💵 Cash on Delivery/Pickup' },
                { val: 'mpesa', label: '📱 M-Pesa' },
              ].map(p => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: p.val })}
                  className={`border-2 rounded-xl p-3 text-sm font-medium transition text-left ${
                    form.paymentMethod === p.val
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {form.paymentMethod === 'mpesa' && (
              <p className="mt-3 text-sm text-green-700 bg-green-50 rounded-lg p-3">
                📱 After placing your order, send M-Pesa to <strong>+254 700 000 000</strong> and use your order number as reference.
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400 resize-none"
              rows={2}
              placeholder="Any special requests or instructions..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-base hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Placing order...</> : `Place Order — KSh ${grandTotal.toLocaleString()}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sticky top-20">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[150px]">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium text-gray-800">
                    KSh {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>KSh {subtotal.toLocaleString()}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span>KSh {deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t">
                <span>Total</span>
                <span className="text-green-700">KSh {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
