import CategoryPage from '@/components/CategoryPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Butchery | FoodHub Machakos',
  description: 'Fresh beef, goat, pork and chicken from our butchery in Machakos Town.',
}

export default function ButcheryPage() {
  return (
    <CategoryPage
      slug="butchery"
      title="Butchery"
      description="Farm-fresh beef, goat, pork, and chicken. Freshly cut daily for quality and flavour."
      icon="🥩"
      gradient="from-red-600 to-rose-700"
    />
  )
}
