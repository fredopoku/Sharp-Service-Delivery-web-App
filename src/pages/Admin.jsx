import { useState, useEffect } from 'react'
import { getPackages, addPackage, updatePackage, deletePackage, STATUS_OPTIONS } from '../data/packages'

const ADMIN_PIN = '1234' // Change this — ideally store hashed, or use a real auth flow

const EMPTY_FORM = {
  sender: '', recipient: '', origin: '', destination: '',
  description: '', weight: '', status: 'Pending Pickup', estimatedDelivery: '',
}

const STATUS_COLOR = {
  'Delivered':        'bg-green-100 text-green-700',
  'Out for Delivery': 'bg-blue-100 text-blue-700',
  'In Transit':       'bg-yellow-100 text-yellow-700',
  'At Customs':       'bg-orange-100 text-orange-700',
  'Pending Pickup':   'bg-gray-100 text-gray-600',
  'Returned':         'bg-red-100 text-red-700',
  'On Hold':          'bg-purple-100 text-purple-700',
}

function PinGate({ onAuth }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) { onAuth(); setErr(false) }
    else { setErr(true); setPin('') }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🔐</div>
        <h1 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">Admin Access</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter your PIN to continue.</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={e => { setPin(e.target.value); setErr(false) }}
            placeholder="••••"
            className={`input text-center text-2xl tracking-widest ${err ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {err && <p className="text-sm text-red-500">Incorrect PIN. Try again.</p>}
          <button type="submit" className="btn-primary w-full">Unlock Dashboard</button>
        </form>
        <p className="text-xs text-gray-400 mt-4">Default PIN: 1234 — change in Admin.jsx before deploying.</p>
      </div>
    </div>
  )
}

function PackageModal({ pkg, onClose, onSave }) {
  const [form, setForm] = useState(pkg ? { ...pkg } : { ...EMPTY_FORM })
  const [eventText, setEventText] = useState('')

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function addEvent(e) {
    e.preventDefault()
    const [loc, ...rest] = eventText.split('|')
    if (!loc) return
    const newEvent = {
      location: loc.trim(),
      status: rest[0]?.trim() || form.status,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      icon: '📍',
    }
    setForm(f => ({ ...f, events: [...(f.events || []), newEvent] }))
    setEventText('')
  }

  function submit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-extrabold text-gray-900 dark:text-white">{pkg ? `Edit ${pkg.id}` : 'New Package'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['sender','Sender Name'], ['recipient','Recipient Name'], ['origin','Origin'], ['destination','Destination'], ['description','Package Description'], ['weight','Weight']].map(([name, label]) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</label>
                <input name={name} value={form[name] || ''} onChange={change} required className="input" placeholder={label} />
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Status</label>
              <select name="status" value={form.status} onChange={change} className="input">
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Estimated Delivery</label>
              <input type="date" name="estimatedDelivery" value={form.estimatedDelivery || ''} onChange={change} className="input" />
            </div>
          </div>

          {/* Add event */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Add Tracking Event</label>
            <div className="flex gap-2">
              <input
                value={eventText}
                onChange={e => setEventText(e.target.value)}
                placeholder="Location | Status description (pipe separated)"
                className="input flex-1 text-sm"
              />
              <button type="button" onClick={addEvent} className="btn-secondary text-sm whitespace-nowrap">Add</button>
            </div>
            {form.events?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {form.events.map((ev, i) => (
                  <li key={i} className="flex items-center justify-between text-xs bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <span>{ev.icon} <strong>{ev.location}</strong> — {ev.status} ({ev.date})</span>
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, events: f.events.filter((_, j) => j !== i) }))}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{pkg ? 'Save Changes' : 'Create Package'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ssd_admin') === '1')
  const [packages, setPackages] = useState([])
  const [modal, setModal] = useState(null) // null | 'new' | pkg object
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    if (authed) setPackages(getPackages())
  }, [authed])

  function handleAuth() {
    sessionStorage.setItem('ssd_admin', '1')
    setAuthed(true)
  }

  function handleLogout() {
    sessionStorage.removeItem('ssd_admin')
    setAuthed(false)
  }

  function handleSave(form) {
    if (form.id) {
      updatePackage(form.id, form)
    } else {
      addPackage(form)
    }
    setPackages(getPackages())
    setModal(null)
  }

  function handleDelete(id) {
    deletePackage(id)
    setPackages(getPackages())
    setDeleteId(null)
  }

  if (!authed) return <PinGate onAuth={handleAuth} />

  const filtered = packages.filter(p =>
    [p.id, p.sender, p.recipient, p.origin, p.destination, p.status]
      .join(' ').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{packages.length} packages total</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setModal('new')} className="btn-primary">+ New Package</button>
          <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          ['Total', packages.length, 'text-gray-700 dark:text-gray-200'],
          ['In Transit', packages.filter(p => p.status === 'In Transit').length, 'text-yellow-600'],
          ['Delivered', packages.filter(p => p.status === 'Delivered').length, 'text-green-600'],
          ['Pending', packages.filter(p => p.status === 'Pending Pickup').length, 'text-gray-500'],
        ].map(([label, count, cls]) => (
          <div key={label} className="card text-center">
            <p className={`text-2xl font-extrabold ${cls}`}>{count}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by ID, sender, recipient, status…"
        className="input mb-5"
      />

      {/* Table — desktop */}
      <div className="hidden md:block card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
            <tr>
              {['ID', 'Sender', 'Recipient', 'Route', 'Status', 'Est. Delivery', 'Actions'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No packages found.</td></tr>
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-brand-600 dark:text-brand-400">{p.id}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.sender}</td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{p.recipient}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 text-xs">{p.origin} → {p.destination}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[p.status] || 'bg-gray-100 text-gray-600'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{p.estimatedDelivery}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setModal(p)} className="text-xs text-brand-600 hover:underline font-medium">Edit</button>
                    <button onClick={() => setDeleteId(p.id)} className="text-xs text-red-500 hover:underline font-medium">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No packages found.</p>
        ) : filtered.map(p => (
          <div key={p.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{p.id}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[p.status] || 'bg-gray-100 text-gray-600'}`}>{p.status}</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{p.sender} → {p.recipient}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{p.origin} → {p.destination}</p>
            <p className="text-xs text-gray-400">Est: {p.estimatedDelivery}</p>
            <div className="flex gap-4 pt-1">
              <button onClick={() => setModal(p)} className="text-sm text-brand-600 font-medium hover:underline">Edit</button>
              <button onClick={() => setDeleteId(p.id)} className="text-sm text-red-500 font-medium hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Package modal */}
      {modal && (
        <PackageModal
          pkg={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="card max-w-sm w-full text-center">
            <p className="text-xl mb-2">🗑️</p>
            <p className="font-bold text-gray-900 dark:text-white mb-2">Delete {deleteId}?</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
