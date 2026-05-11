import { useState } from 'react'

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'info@sharpservicedelivery.com' },
  { icon: '📞', label: 'Phone', value: '+233 (0) 30 000 0000' },
  { icon: '📍', label: 'Address', value: 'Ring Road Central, Accra, Ghana' },
  { icon: '🕐', label: 'Hours', value: 'Mon–Fri 8am–6pm · Sat 9am–3pm' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    // Simulated send — wire up EmailJS or a backend API here:
    // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', form, 'PUBLIC_KEY')
    setTimeout(() => {
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1200)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Get in Touch</h1>
          <p className="text-brand-100 text-lg">Our team is ready to help you ship, track, and resolve any issue — fast.</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Contact info */}
        <aside className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-4">Contact Information</h2>
          {contactInfo.map(({ icon, label, value }) => (
            <div key={label} className="card flex items-start gap-4">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{value}</p>
              </div>
            </div>
          ))}

          <div className="card">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Follow Us</p>
            <div className="flex gap-3">
              {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map(s => (
                <span key={s} className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">{s}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>

          {status === 'sent' ? (
            <div className="card border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 text-center py-12">
              <div className="text-5xl mb-3">✅</div>
              <p className="font-bold text-lg">Message Sent!</p>
              <p className="text-sm mt-2">We'll get back to you within 24 hours.</p>
              <button onClick={() => setStatus(null)} className="mt-4 btn-secondary text-sm">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required placeholder="Kofi Mensah" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="kofi@example.com" className="input" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange} required className="input">
                  <option value="">Select a subject…</option>
                  <option>Track a Package</option>
                  <option>Request a Quote</option>
                  <option>Lost or Damaged Package</option>
                  <option>Business Partnership</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Describe how we can help you…"
                  className="input resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
