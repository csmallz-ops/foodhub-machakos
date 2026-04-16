import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bakery | FoodHub Machakos',
  description: 'Fresh bread, mandazi, doughnuts, cakes and more baked daily at FoodHub Machakos.',
}

export default function BakeryPage() {
  return (
    <CategoryPage
      slug="bakery"
      title="Bakery"
      description="Freshly baked every morning — bread, mandazi, chapati, cakes, scones and more."
      icon="🍞"
      gradient="from-amber-500 to-orange-600"
    />
  )
}
