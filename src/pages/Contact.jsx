import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ChevronDown, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

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

const contactInfo = [
  { Icon: Mail,    label: 'Email',   value: 'info@sharpservicedelivery.com', sub: 'Reply within 24 hours'  },
  { Icon: Phone,   label: 'Phone',   value: '+233 (0) 30 000 0000',          sub: 'Mon–Fri, 8am–6pm'       },
  { Icon: MapPin,  label: 'Address', value: 'Ring Road Central, Accra',      sub: 'Ghana, West Africa'      },
  { Icon: Clock,   label: 'Hours',   value: 'Mon–Fri: 8am–6pm',              sub: 'Sat: 9am–3pm'            },
]

const faqs = [
  { q: 'How do I track my package?',           a: 'Go to the Track page, enter your unique SSD tracking number (e.g. SSD-001), and click Track. You\'ll see live status updates and a full shipment timeline.' },
  { q: 'How long does international shipping take?', a: 'Transit times depend on the destination. UK: 5–10 business days. USA/Canada: 7–14 business days. Europe: 5–10 business days. All times are estimates.' },
  { q: 'Can I change my delivery address?',    a: 'Yes, contact us before your package reaches the destination country. Once it\'s out for delivery, address changes are no longer possible.' },
  { q: 'What if my package is lost or damaged?', a: 'Every shipment includes basic coverage. Report the issue within 7 days of the expected delivery date and our team will investigate immediately.' },
  { q: 'Do you offer same-day delivery?',      a: 'Yes, within Accra and select major cities in Ghana. Same-day service must be booked before 11am and is subject to availability.' },
]

function FAQ() {
  const [open, setOpen] = useState(null)
  return (
    <div className="space-y-3">
      {faqs.map(({ q, a }, i) => (
        <div key={i} className={`rounded-2xl border overflow-hidden transition-colors duration-200 ${open === i ? 'border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left"
          >
            <span className={`font-semibold text-sm ${open === i ? 'text-brand-700 dark:text-brand-300' : 'text-slate-900 dark:text-white'}`}>{q}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180 text-brand-500' : ''}`} />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

const SUBJECTS = ['Track a Package', 'Request a Quote', 'Lost or Damaged Package', 'Business Partnership', 'General Enquiry']

function validate(form) {
  const errors = {}
  if (!form.name.trim())              errors.name = 'Your name is required.'
  if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email address.'
  if (!form.subject)                  errors.subject = 'Please select a subject.'
  if (form.message.trim().length < 20) errors.message = 'Message must be at least 20 characters.'
  return errors
}

export default function Contact() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState(null)

  function change(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (touched[name]) {
      const errs = validate({ ...form, [name]: value })
      setErrors(prev => ({ ...prev, [name]: errs[name] }))
    }
  }

  function blur(e) {
    const { name } = e.target
    setTouched(t => ({ ...t, [name]: true }))
    const errs = validate(form)
    setErrors(prev => ({ ...prev, [name]: errs[name] }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setTouched({ name: true, email: true, subject: true, message: true })
    if (Object.keys(errs).length) return

    setStatus('sending')
    // Wire up EmailJS here:
    // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY').then(...)
    setTimeout(() => {
      setStatus('sent')
      toast.success("Message sent! We'll respond within 24 hours.")
      setForm({ name: '', email: '', subject: '', message: '' })
      setTouched({})
      setErrors({})
    }, 1200)
  }

  const Field = ({ name, label, children }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      <AnimatePresence>
        {errors[name] && touched[name] && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
            {errors[name]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-brand-950 to-slate-900 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-100 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider mb-5">
              <MessageSquare className="w-3 h-3" /> Get in Touch
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-black mb-4">
            We're Here to Help
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg max-w-xl mx-auto">
            Our team responds fast. Reach us for quotes, tracking issues, or partnerships.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-5 gap-10">

        {/* Contact info */}
        <aside className="lg:col-span-2 space-y-4">
          <FadeUp>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Contact Information</h2>
          </FadeUp>
          {contactInfo.map(({ Icon, label, value, sub }, i) => (
            <FadeUp key={label} delay={i * 0.07}>
              <div className="card flex items-start gap-4 group hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
                </div>
              </div>
            </FadeUp>
          ))}

          {/* Online indicator */}
          <FadeUp delay={0.32}>
            <div className="card flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-slow shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Support Online</p>
                <p className="text-xs text-slate-400">Average response time: 2 hours</p>
              </div>
            </div>
          </FadeUp>
        </aside>

        {/* Form */}
        <FadeUp className="lg:col-span-3" delay={0.1}>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Send a Message</h2>

          {status === 'sent' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-14 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/10"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}>
                <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
              </motion.div>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">Message Sent!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">We'll get back to you within 24 hours.</p>
              <button onClick={() => setStatus(null)} className="btn-secondary">Send Another Message</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field name="name" label="Full Name">
                  <input name="name" value={form.name} onChange={change} onBlur={blur}
                    placeholder="Kofi Mensah"
                    className={`input ${errors.name && touched.name ? 'input-error' : ''}`} />
                </Field>
                <Field name="email" label="Email Address">
                  <input name="email" type="email" value={form.email} onChange={change} onBlur={blur}
                    placeholder="kofi@example.com"
                    className={`input ${errors.email && touched.email ? 'input-error' : ''}`} />
                </Field>
              </div>

              <Field name="subject" label="Subject">
                <select name="subject" value={form.subject} onChange={change} onBlur={blur}
                  className={`input ${errors.subject && touched.subject ? 'input-error' : ''}`}>
                  <option value="">Choose a subject…</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </Field>

              <Field name="message" label="Message">
                <textarea name="message" value={form.message} onChange={change} onBlur={blur}
                  rows={5} placeholder="Describe how we can help you…"
                  className={`input resize-none ${errors.message && touched.message ? 'input-error' : ''}`} />
                <p className={`text-xs mt-1 text-right ${form.message.length < 20 ? 'text-slate-400' : 'text-emerald-500'}`}>
                  {form.message.length} / 20+ chars
                </p>
              </Field>

              <button type="submit" className="btn-primary w-full gap-2" disabled={status === 'sending'}>
                {status === 'sending'
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                  : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </FadeUp>
      </div>

      {/* FAQ */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FadeUp className="text-center mb-10">
            <p className="section-label mb-2">FAQ</p>
            <h2 className="section-title mb-3">Common Questions</h2>
            <p className="section-subtitle">Quick answers before you reach out.</p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <FAQ />
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
