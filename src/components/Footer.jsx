import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">S</div>
              <span className="font-extrabold text-lg text-gray-900 dark:text-white">
                Sharp<span className="text-brand-600">SD</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Fast, reliable courier and package tracking services across Africa and worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[['/', 'Home'], ['/track', 'Track Package'], ['/about', 'About Us'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>📧 info@sharpservicedelivery.com</li>
              <li>📞 +233 (0) 30 000 0000</li>
              <li>📍 Accra, Ghana</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Sharp Service Delivery. All rights reserved.</p>
          <p>Built for real-world logistics.</p>
        </div>
      </div>
    </footer>
  )
}
