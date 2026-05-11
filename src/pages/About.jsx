const team = [
  { name: 'Frederick Opoku', role: 'Founder & CEO', emoji: '👨‍💼' },
  { name: 'Akua Mensah', role: 'Head of Operations', emoji: '👩‍💼' },
  { name: 'Kwabena Asante', role: 'Logistics Manager', emoji: '👨‍✈️' },
  { name: 'Esi Boateng', role: 'Customer Experience', emoji: '👩‍💻' },
]

const values = [
  { icon: '⚡', title: 'Speed', desc: 'We move fast without compromising safety or accuracy.' },
  { icon: '🔍', title: 'Transparency', desc: 'Every package is visible at every step — no black boxes.' },
  { icon: '🤝', title: 'Trust', desc: 'Built on relationships. Our customers come back because we deliver.' },
  { icon: '🌍', title: 'Reach', desc: 'From Accra to anywhere — we connect Ghana to the world.' },
]

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 text-white py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-brand-200 text-sm font-semibold uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">We Started in Ghana.<br />We Deliver to the World.</h1>
          <p className="text-brand-100 text-lg leading-relaxed">
            Sharp Service Delivery was founded with one mission: make logistics simple, transparent, and reliable for everyone in Ghana and the African diaspora.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We believe that reliable logistics should not be a luxury. Whether you're a small business owner in Kumasi shipping products abroad, or a family member sending essential goods home — Sharp Service Delivery is here for you.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              We combine technology with a human touch: real-time tracking, proactive communication, and a team that genuinely cares about every single package.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '2019', l: 'Founded' },
              { n: '10,000+', l: 'Packages Delivered' },
              { n: '25+', l: 'Countries Reached' },
              { n: '5★', l: 'Average Rating' },
            ].map(({ n, l }) => (
              <div key={l} className="card text-center">
                <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{n}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-100 dark:bg-gray-900 py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">Meet the Team</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">The people behind every delivery.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map(({ name, role, emoji }) => (
            <div key={name} className="card text-center hover:shadow-md transition-shadow">
              <div className="text-5xl mb-3">{emoji}</div>
              <p className="font-bold text-gray-900 dark:text-white">{name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
