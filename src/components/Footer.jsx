import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Mail, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/track', label: 'Track Package' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
  { to: '/admin', label: 'Admin' },
]

const socialLinks = [
  { label: 'Facebook',  href: '#', svg: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { label: 'Instagram', href: '#', svg: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M21.5 6.5v11a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4v-11a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4z' },
  { label: 'Twitter',   href: '#', svg: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z' },
  { label: 'LinkedIn',  href: '#', svg: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleNewsletter(e) {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
    toast.success("Subscribed! You'll get updates on new features.")
  }

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white mt-20">
      {/* Top bar */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xs">
            <p className="font-bold text-white mb-1">Stay in the Loop</p>
            <p className="text-sm text-slate-400">News, shipping tips, and feature updates — straight to your inbox.</p>
          </div>
          {subscribed ? (
            <div className="flex items-center gap-2 text-green-400 font-medium text-sm">
              <CheckCircle className="w-5 h-5" />
              You're subscribed!
            </div>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2 w-full max-w-md">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition"
              />
              <button type="submit" className="btn-primary text-sm gap-1.5 whitespace-nowrap">
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-black text-base text-white">Sharp</span>
              <span className="font-black text-base text-brand-400">SD</span>
            </div>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            Fast, reliable courier and package tracking services — connecting Ghana to the world since 2019.
          </p>
          <div className="flex gap-2">
            {socialLinks.map(({ svg, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d={svg} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2.5">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all duration-150"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Services</h3>
          <ul className="space-y-2.5">
            {['International Shipping', 'Domestic Courier', 'Cargo & Freight', 'Document Delivery', 'Same-Day Delivery', 'Customs Clearance'].map(s => (
              <li key={s} className="text-sm text-slate-400">{s}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Contact</h3>
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
              info@sharpservicedelivery.com
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
              +233 (0) 30 000 0000
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-4 h-4 mt-0.5 text-brand-400 shrink-0" />
              Ring Road Central, Accra, Ghana
            </li>
          </ul>

          <div className="mt-5 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
            <span className="text-xs text-green-400 font-medium">Support Online</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Sharp Service Delivery. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
