import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fast Food | FoodHub Machakos',
  description: 'Order chips, burgers, chicken, samosas and more hot food from FoodHub in Machakos.',
}

export default function FastFoodPage() {
  return (
    <CategoryPage
      slug="fast-food"
      title="Fast Food"
      description="Freshly cooked chips, burgers, grilled chicken, samosas and more. Hot and ready for you."
      icon="🍔"
      gradient="from-orange-500 to-red-600"
    />
  )
}
