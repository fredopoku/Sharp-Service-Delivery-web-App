import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  Plane, Truck, Package, FileText, Search, ArrowRight,
  CheckCircle, Clock, Globe, Shield, Star, ChevronRight, Zap,
} from 'lucide-react'

/* ── Animated counter ───────────────────────────────────────────── */
function Counter({ to, suffix = '', duration = 1800 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * to))
      if (progress < 1) requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }, [inView, to, duration])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

/* ── Fade-up wrapper ────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Data ───────────────────────────────────────────────────────── */
const stats = [
  { value: 10000, suffix: '+', label: 'Packages Delivered', icon: Package },
  { value: 25,    suffix: '+', label: 'Countries Served',   icon: Globe   },
  { value: 99,    suffix: '%', label: 'On-Time Rate',       icon: CheckCircle },
  { value: 24,    suffix: '/7', label: 'Customer Support',  icon: Clock  },
]

const services = [
  { Icon: Plane,   title: 'International Shipping', desc: 'Door-to-door delivery across Africa, Europe, and North America with end-to-end tracking.',    color: 'from-blue-500 to-indigo-600' },
  { Icon: Truck,   title: 'Domestic Courier',       desc: 'Same-day and next-day delivery anywhere in Ghana — from Accra to Tamale.',                     color: 'from-emerald-500 to-teal-600' },
  { Icon: Package, title: 'Cargo & Freight',        desc: 'Heavy cargo, pallets, and commercial freight handled with care and full customs documentation.', color: 'from-orange-500 to-amber-600' },
  { Icon: FileText, title: 'Secure Documents',      desc: 'Legal papers, certificates, and sensitive materials with tamper-proof packaging and tracking.',  color: 'from-purple-500 to-violet-600' },
]

const steps = [
  { num: '01', Icon: FileText,  title: 'Book Online',     desc: 'Fill in shipment details in minutes. Get an instant quote.' },
  { num: '02', Icon: Package,   title: 'We Pick Up',      desc: 'Our agent arrives at your location at the agreed time.'    },
  { num: '03', Icon: Search,    title: 'Track Live',      desc: 'Monitor every milestone with your unique tracking ID.'     },
  { num: '04', Icon: CheckCircle, title: 'Delivered',     desc: 'Package arrives safely. Signed, confirmed, done.'          },
]

const testimonials = [
  { name: 'Abena Owusu',    role: 'Small Business Owner, Accra',     text: 'SharpSD completely changed how I send products to my UK customers. Real-time tracking means I never get anxious calls anymore.', rating: 5 },
  { name: 'Kwabena Asante', role: 'Diaspora, Toronto, Canada',        text: 'Finally a service that treats Ghana shipping seriously. Every package I send home arrives on time and in perfect condition.', rating: 5 },
  { name: 'Esi Boateng',    role: 'Event Planner, Kumasi',           text: 'I needed last-minute delivery of materials from Accra. SharpSD made it happen same-day. Absolute lifesavers!',                  rating: 5 },
]

const features = [
  { Icon: Zap,         title: 'Instant Quotes',        desc: 'Get a shipping price in under 30 seconds.' },
  { Icon: Shield,      title: 'Package Insurance',     desc: 'Every shipment insured up to GH₵10,000.'   },
  { Icon: Globe,       title: 'Worldwide Coverage',    desc: '25+ countries, growing every month.'       },
  { Icon: CheckCircle, title: 'Proof of Delivery',     desc: 'Digital signature and photo on delivery.'  },
]

export default function Home() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()

  function handleTrack(e) {
    e.preventDefault()
    if (input.trim()) navigate(`/track?id=${encodeURIComponent(input.trim().toUpperCase())}`)
  }

  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 overflow-hidden">

        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Floating icons */}
        <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-16 w-16 h-16 bg-brand-600/20 backdrop-blur rounded-2xl items-center justify-center border border-brand-500/20 hidden lg:flex">
          <Plane className="w-8 h-8 text-brand-400" />
        </motion.div>
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-32 right-32 w-12 h-12 bg-indigo-600/20 backdrop-blur rounded-xl items-center justify-center border border-indigo-500/20 hidden lg:flex">
          <Package className="w-6 h-6 text-indigo-400" />
        </motion.div>
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-40 right-1/3 w-10 h-10 bg-emerald-600/20 backdrop-blur rounded-xl items-center justify-center border border-emerald-500/20 hidden xl:flex">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          {/* Text side */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Ghana's #1 Courier
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-6"
            >
              Deliver Anywhere.<br />
              <span className="text-gradient-light">Track Everything.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg"
            >
              Sharp Service Delivery connects Ghana to the world — fast, reliable, and fully transparent logistics for individuals and businesses.
            </motion.p>

            {/* Track form */}
            <motion.form
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleTrack}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mb-8"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter tracking number (e.g. SSD-001)"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/8 border border-white/12 placeholder-slate-500 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/60 focus:border-brand-500/60 backdrop-blur transition"
                />
              </div>
              <button type="submit" className="btn-accent gap-2 py-3.5 px-6 text-sm whitespace-nowrap">
                Track Now <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              {['Free tracking', 'Real-time updates', 'No signup needed'].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-slate-400">
                  <CheckCircle className="w-4 h-4 text-brand-400" />
                  {t}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats card — desktop */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {stats.map(({ value, suffix, label, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-6 text-center group hover:border-brand-500/30 transition-colors duration-300">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-600/30 transition-colors">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <p className="text-3xl font-black text-white">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-xs text-slate-400 mt-1 font-medium">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Mobile stats ────────────────────────────────────────── */}
      <section className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ value, suffix, label, icon: Icon }) => (
            <FadeUp key={label}>
              <div className="card text-center">
                <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400 mx-auto mb-2" />
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  <Counter to={value} suffix={suffix} />
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <FadeUp className="text-center mb-12">
          <p className="section-label mb-2">What We Offer</p>
          <h2 className="section-title mb-3">End-to-End Logistics Solutions</h2>
          <p className="section-subtitle max-w-md mx-auto">
            Everything you need to ship and receive packages — local and global.
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map(({ Icon, title, desc, color }, i) => (
            <FadeUp key={title} delay={i * 0.08}>
              <div className="card-hover h-full group">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-14">
            <p className="section-label mb-2">Simple Process</p>
            <h2 className="section-title mb-3">Ship in Four Steps</h2>
            <p className="section-subtitle">No complicated paperwork. No surprises.</p>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* connector line */}
            <div className="absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-brand-300 to-brand-600 hidden lg:block opacity-30" />

            {steps.map(({ num, Icon, title, desc }, i) => (
              <FadeUp key={num} delay={i * 0.1}>
                <div className="text-center relative">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 shadow-card flex items-center justify-center mx-auto mb-4 group-hover:shadow-card-hover transition-shadow">
                      <Icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-600 text-white text-[10px] font-black flex items-center justify-center">
                      {num.slice(-1)}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1.5">{title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features strip ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ Icon, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.07}>
              <div className="flex items-start gap-4 p-5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <p className="section-label mb-2">Customer Stories</p>
            <h2 className="section-title mb-3">Trusted by Thousands</h2>
            <p className="section-subtitle">Don't just take our word for it.</p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text, rating }, i) => (
              <FadeUp key={name} delay={i * 0.1}>
                <div className="card-hover h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-accent-400 text-accent-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 mb-5">"{text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
                      <p className="text-xs text-slate-400">{role}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <FadeUp>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-600 text-white text-center py-16 px-6">
            <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
            <div className="relative">
              <p className="text-brand-200 text-sm font-semibold uppercase tracking-widest mb-3">Ready to Ship?</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
                Your next package, delivered on time.
              </h2>
              <p className="text-brand-100 mb-8 max-w-md mx-auto text-lg">
                Get in touch today and our team will handle the rest — from pickup to final mile delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition-colors shadow-lg">
                  Get a Free Quote <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/track" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 border border-white/30 text-white font-bold hover:bg-white/20 transition-colors backdrop-blur">
                  Track a Package
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>
    </div>
  )
}
