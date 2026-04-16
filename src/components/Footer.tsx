import Link from 'next/link'
import { MapPin, Phone, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🍽️</span>
            <div>
              <div className="font-bold text-white text-lg">FoodHub Machakos</div>
              <div className="text-xs text-gray-400">Your One-Stop Food Shop</div>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Fast food, fresh meat, bakery goods and groceries all under one roof in Machakos Town.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Our Sections</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/fast-food" className="hover:text-green-400 transition">🍔 Fast Food</Link></li>
            <li><Link href="/butchery" className="hover:text-green-400 transition">🥩 Butchery</Link></li>
            <li><Link href="/bakery" className="hover:text-green-400 transition">🍞 Bakery</Link></li>
            <li><Link href="/groceries" className="hover:text-green-400 transition">🥦 Groceries</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Find Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
              <span>Machakos Town, Machakos County, Kenya</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-green-400" />
              <a href="tel:+254700000000" className="hover:text-green-400">+254 700 000 000</a>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-green-400" />
              <span>Mon – Sun: 7:00 AM – 9:00 PM</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} FoodHub Machakos. All rights reserved.
      </div>
    </footer>
  )
}
