import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const stats = [
  { value: '10,000+', label: 'Packages Delivered' },
  { value: '25+', label: 'Countries Served' },
  { value: '99.2%', label: 'On-Time Rate' },
  { value: '24/7', label: 'Customer Support' },
]

const services = [
  {
    icon: '✈️',
    title: 'International Shipping',
    desc: 'Door-to-door delivery across Africa, Europe, North America and beyond with real-time tracking.',
  },
  {
    icon: '🚚',
    title: 'Domestic Courier',
    desc: 'Same-day and next-day delivery within Ghana. From Accra to Tamale, we have you covered.',
  },
  {
    icon: '📦',
    title: 'Cargo & Freight',
    desc: 'Heavy cargo, pallets, and commercial freight handled with care and full documentation.',
  },
  {
    icon: '🔒',
    title: 'Secure Documents',
    desc: 'Legal documents, certificates, and sensitive materials shipped with tracked, tamper-proof packaging.',
  },
]

const steps = [
  { num: '01', title: 'Book a Shipment', desc: 'Fill out your shipment details online or visit our office.' },
  { num: '02', title: 'We Pick Up', desc: 'Our agent collects your package from your location.' },
  { num: '03', title: 'Track in Real Time', desc: 'Follow every milestone with your unique tracking ID.' },
  { num: '04', title: 'Delivered', desc: 'Your package arrives safely at its destination.' },
]

export default function Home() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  function handleTrack(e) {
    e.preventDefault()
    if (input.trim()) navigate(`/track?id=${encodeURIComponent(input.trim().toUpperCase())}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <p className="text-brand-200 text-sm font-semibold uppercase tracking-widest mb-3">Ghana's Trusted Courier</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 max-w-2xl">
            Deliver Anywhere.<br />Track Everything.
          </h1>
          <p className="text-brand-100 text-lg sm:text-xl max-w-xl mb-8 leading-relaxed">
            Sharp Service Delivery connects Ghana to the world — fast, reliable, and fully transparent logistics for individuals and businesses.
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Enter tracking number (e.g. SSD-001)"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/30 placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur"
            />
            <button type="submit" className="px-6 py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-colors whitespace-nowrap">
              Track Now
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ value, label }) => (
            <div key={label} className="card text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">{value}</p>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Our Services</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">Everything you need for seamless package delivery — local and international.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ icon, title, desc }) => (
            <div key={title} className="card hover:shadow-md transition-shadow group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">{icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Ship in four simple steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="relative text-center">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">{num}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-center py-14 px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">Ready to ship your first package?</h2>
          <p className="text-brand-100 mb-6 max-w-md mx-auto">Get in touch today and our team will handle the rest.</p>
          <a href="/contact" className="inline-block px-8 py-3 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-colors">
            Get a Quote
          </a>
        </div>
      </section>
    </div>
  )
}
