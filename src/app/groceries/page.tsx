import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Groceries | FoodHub Machakos',
  description: 'Fresh vegetables, fruits, flour, oil and daily grocery needs in Machakos.',
}

export default function GroceriesPage() {
  return (
    <CategoryPage
      slug="groceries"
      title="Groceries"
      description="Fresh sukuma wiki, tomatoes, potatoes, maize flour, cooking oil and all your daily essentials."
      icon="🥦"
      gradient="from-green-600 to-emerald-700"
    />
  )
}
