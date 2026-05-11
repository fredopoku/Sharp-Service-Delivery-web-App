import { motion } from 'framer-motion'
import { Users, Globe, Package, Award, Zap, Shield, Heart, TrendingUp } from 'lucide-react'

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

const milestones = [
  { year: '2019', title: 'Founded in Accra',        desc: 'Started with a van and a vision to modernise Ghanaian logistics.' },
  { year: '2020', title: 'First 1,000 Deliveries',  desc: 'Grew to serve businesses and individuals across the Greater Accra Region.' },
  { year: '2021', title: 'Launched International',  desc: 'Expanded to UK, USA, and Canada — serving the Ghanaian diaspora.' },
  { year: '2022', title: 'Live Package Tracking',   desc: 'Launched real-time tracking — a first for independent Ghanaian couriers.' },
  { year: '2023', title: '25 Countries',             desc: 'Partnerships across Africa, Europe, and North America completed.' },
  { year: '2025', title: '10,000+ Deliveries',       desc: 'Trusted by thousands of customers and businesses across the world.' },
]

const values = [
  { Icon: Zap,       title: 'Speed',        desc: 'We move fast without compromising accuracy or safety.',             color: 'from-amber-500 to-orange-500' },
  { Icon: Shield,    title: 'Trust',        desc: 'Every package is treated like it belongs to someone we love.',      color: 'from-blue-500 to-indigo-600'  },
  { Icon: Globe,     title: 'Reach',        desc: 'From Accra to anywhere — we connect Ghana to the world.',           color: 'from-emerald-500 to-teal-600' },
  { Icon: Heart,     title: 'Care',         desc: 'We genuinely care. Our 5-star rating reflects how we treat people.', color: 'from-pink-500 to-rose-600'    },
  { Icon: TrendingUp, title: 'Transparency', desc: 'No black boxes. You see every step, in real time.',                color: 'from-violet-500 to-purple-600'},
  { Icon: Award,     title: 'Excellence',   desc: 'We set a high bar and hold ourselves to it, every single day.',    color: 'from-brand-500 to-brand-700'  },
]

const team = [
  { name: 'Frederick Opoku', role: 'Founder & CEO',          bio: 'Logistics veteran with 10+ years in supply chain management across West Africa.',   initials: 'FO', grad: 'from-brand-600 to-indigo-600' },
  { name: 'Akua Mensah',     role: 'Head of Operations',     bio: 'Oversees day-to-day logistics, driver coordination, and service quality.',           initials: 'AM', grad: 'from-emerald-500 to-teal-600' },
  { name: 'Kwabena Asante',  role: 'International Logistics', bio: 'Manages customs, international partnerships, and freight documentation.',            initials: 'KA', grad: 'from-orange-500 to-amber-500' },
  { name: 'Esi Boateng',     role: 'Customer Experience',    bio: 'Dedicated to making every customer interaction seamless and satisfying.',             initials: 'EB', grad: 'from-purple-500 to-violet-600' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 text-white overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-5">
              Our Story
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black leading-tight mb-5"
          >
            We Started in Ghana.<br />
            <span className="text-gradient-light">We Deliver to the World.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Sharp Service Delivery was founded with one mission: make logistics simple, transparent, and reliable for everyone in Ghana and the African diaspora.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { Icon: Package,  value: '10,000+', label: 'Packages Delivered' },
            { Icon: Globe,    value: '25+',     label: 'Countries Reached'  },
            { Icon: Users,    value: '5,000+',  label: 'Happy Customers'    },
            { Icon: Award,    value: '5★',      label: 'Average Rating'     },
          ].map(({ Icon, value, label }, i) => (
            <FadeUp key={label} delay={i * 0.07}>
              <div className="card text-center group hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <p className="section-label mb-3">Our Mission</p>
            <h2 className="section-title mb-5">Logistics Shouldn't Be a Luxury</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 text-base">
              We believe that reliable logistics should be accessible to everyone — not just large corporations. Whether you're a market vendor in Kumasi shipping products abroad, or a family member sending essentials home from the UK, Sharp Service Delivery is built for you.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
              We combine technology with a human touch: real-time tracking, proactive communication, and a team that genuinely cares about every single package.
            </p>
          </FadeUp>
          {/* Timeline */}
          <FadeUp delay={0.1}>
            <div className="relative pl-6 border-l-2 border-brand-200 dark:border-brand-900 space-y-6">
              {milestones.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="relative"
                >
                  <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-brand-600 border-2 border-white dark:border-slate-950 shadow" />
                  <p className="text-xs font-bold text-brand-600 dark:text-brand-400 mb-0.5 uppercase tracking-wider">{year}</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{desc}</p>
                </motion.div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-12">
            <p className="section-label mb-2">What We Stand For</p>
            <h2 className="section-title">Our Core Values</h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map(({ Icon, title, desc, color }, i) => (
              <FadeUp key={title} delay={i * 0.07}>
                <div className="card-hover flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <FadeUp className="text-center mb-12">
          <p className="section-label mb-2">The Team</p>
          <h2 className="section-title mb-3">People Behind Every Delivery</h2>
          <p className="section-subtitle">Experienced, passionate, and committed to your package.</p>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map(({ name, role, bio, initials, grad }, i) => (
            <FadeUp key={name} delay={i * 0.08}>
              <div className="card-hover text-center group">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-black text-xl mx-auto mb-4 shadow-md group-hover:shadow-lg transition-shadow`}>
                  {initials}
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{name}</p>
                <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5 mb-3">{role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{bio}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>
    </div>
  )
}
