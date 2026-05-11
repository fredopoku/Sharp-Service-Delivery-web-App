import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Package, Plus, Search, Edit2, Trash2, Download, LogOut, X, ChevronUp, ChevronDown,
  CheckCircle, AlertCircle, Clock, TrendingUp, Lock,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { getPackages, addPackage, updatePackage, deletePackage, STATUS_OPTIONS } from '../data/packages'

const ADMIN_PIN = '1234'

const STATUS_CONFIG = {
  'Delivered':        { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', dot: 'bg-emerald-500' },
  'Out for Delivery': { color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20',       dot: 'bg-blue-500'    },
  'In Transit':       { color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-900/20',     dot: 'bg-amber-500 animate-pulse' },
  'At Customs':       { color: 'text-orange-600',  bg: 'bg-orange-50 dark:bg-orange-900/20',   dot: 'bg-orange-500'  },
  'Pending Pickup':   { color: 'text-slate-600',   bg: 'bg-slate-50 dark:bg-slate-800',        dot: 'bg-slate-400'   },
  'Returned':         { color: 'text-red-600',     bg: 'bg-red-50 dark:bg-red-900/20',         dot: 'bg-red-500'     },
  'On Hold':          { color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-900/20',   dot: 'bg-purple-500'  },
}

const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

const EMPTY_FORM = { sender: '', recipient: '', origin: '', destination: '', description: '', weight: '', status: 'Pending Pickup', estimatedDelivery: '', events: [] }

/* ── PIN Gate ──────────────────────────────────────────────────── */
function PinGate({ onAuth }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  const [shaking, setShaking] = useState(false)

  function submit(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) { onAuth() }
    else {
      setErr(true)
      setShaking(true)
      setPin('')
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-sm text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mx-auto mb-4">
          <Lock className="w-7 h-7 text-brand-600 dark:text-brand-400" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">Admin Access</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Enter your PIN to access the dashboard.</p>
        <form onSubmit={submit} className="space-y-4">
          <motion.div animate={shaking ? { x: [0, -8, 8, -8, 8, 0] } : {}} transition={{ duration: 0.4 }}>
            <input
              type="password" inputMode="numeric" maxLength={8}
              value={pin} onChange={e => { setPin(e.target.value); setErr(false) }}
              placeholder="••••"
              className={`input text-center text-2xl tracking-widest ${err ? 'input-error' : ''}`}
            />
          </motion.div>
          <AnimatePresence>
            {err && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="text-sm text-red-500 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN.
              </motion.p>
            )}
          </AnimatePresence>
          <button type="submit" className="btn-primary w-full">Unlock Dashboard</button>
        </form>
        <p className="text-xs text-slate-400 mt-4">Default PIN: 1234 — change in Admin.jsx</p>
      </motion.div>
    </div>
  )
}

/* ── Package Modal ─────────────────────────────────────────────── */
function PackageModal({ pkg, onClose, onSave }) {
  const [form, setForm]       = useState(pkg ? { ...pkg } : { ...EMPTY_FORM })
  const [eventText, setEventText] = useState('')

  function change(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function addEvent() {
    const [loc, ...rest] = eventText.split('|')
    if (!loc.trim()) return
    setForm(f => ({
      ...f,
      events: [...(f.events || []), {
        location: loc.trim(),
        status:   rest[0]?.trim() || form.status,
        date:     new Date().toISOString().slice(0, 16).replace('T', ' '),
        icon:     '📍',
      }],
    }))
    setEventText('')
  }

  function submit(e) {
    e.preventDefault()
    onSave(form)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
              <Package className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="font-extrabold text-slate-900 dark:text-white">{pkg ? `Edit ${pkg.id}` : 'New Package'}</h2>
          </div>
          <button onClick={onClose} className="btn-icon"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['sender','Sender Name'],['recipient','Recipient Name'],['origin','Origin'],['destination','Destination'],['description','Package Description'],['weight','Weight (e.g. 2.3 kg)']].map(([name, label]) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">{label}</label>
                <input name={name} value={form[name] || ''} onChange={change} required className="input" placeholder={label} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Status</label>
              <select name="status" value={form.status} onChange={change} className="input">
                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">Est. Delivery Date</label>
              <input type="date" name="estimatedDelivery" value={form.estimatedDelivery || ''} onChange={change} className="input" />
            </div>
          </div>

          {/* Add event */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Add Tracking Event</label>
            <div className="flex gap-2">
              <input value={eventText} onChange={e => setEventText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addEvent())}
                placeholder="Location | Status description  (pipe-separated)"
                className="input flex-1 text-sm" />
              <button type="button" onClick={addEvent} className="btn-secondary text-sm whitespace-nowrap">Add</button>
            </div>
            {form.events?.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {form.events.map((ev, i) => (
                  <li key={i} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                    <span>{ev.icon} <strong className="text-slate-700 dark:text-slate-300">{ev.location}</strong> — {ev.status}</span>
                    <button type="button" onClick={() => setForm(f => ({ ...f, events: f.events.filter((_, j) => j !== i) }))}
                      className="text-slate-400 hover:text-red-500 transition-colors ml-2"><X className="w-3.5 h-3.5" /></button>
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
      </motion.div>
    </motion.div>
  )
}

/* ── Main Dashboard ────────────────────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed]   = useState(() => sessionStorage.getItem('ssd_admin') === '1')
  const [packages, setPackages] = useState([])
  const [modal, setModal]     = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch]   = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => { if (authed) setPackages(getPackages()) }, [authed])

  function handleAuth() { sessionStorage.setItem('ssd_admin', '1'); setAuthed(true) }
  function handleLogout() { sessionStorage.removeItem('ssd_admin'); setAuthed(false) }

  function handleSave(form) {
    if (form.id) {
      updatePackage(form.id, form)
      toast.success(`${form.id} updated successfully.`)
    } else {
      const created = addPackage(form)
      toast.success(`${created.id} created!`)
    }
    setPackages(getPackages())
    setModal(null)
  }

  function handleDelete(id) {
    deletePackage(id)
    setPackages(getPackages())
    setDeleteId(null)
    toast.success(`${id} deleted.`)
  }

  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function exportCSV() {
    const headers = ['ID', 'Sender', 'Recipient', 'Origin', 'Destination', 'Status', 'Est. Delivery', 'Created']
    const rows = packages.map(p => [p.id, p.sender, p.recipient, p.origin, p.destination, p.status, p.estimatedDelivery, p.createdAt])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `ssd-packages-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    toast.success('CSV exported!')
  }

  /* Charts data */
  const statusCounts = useMemo(() => {
    const map = {}
    packages.forEach(p => { map[p.status] = (map[p.status] || 0) + 1 })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [packages])

  const monthlyData = useMemo(() => {
    const map = {}
    packages.forEach(p => {
      const m = p.createdAt?.slice(0, 7) || 'Unknown'
      map[m] = (map[m] || 0) + 1
    })
    return Object.entries(map).sort().slice(-6).map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      count,
    }))
  }, [packages])

  /* Filtered + sorted */
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const list = packages.filter(p =>
      [p.id, p.sender, p.recipient, p.origin, p.destination, p.status].join(' ').toLowerCase().includes(q)
    )
    return [...list].sort((a, b) => {
      const va = a[sortKey] || '', vb = b[sortKey] || ''
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }, [packages, search, sortKey, sortDir])

  const SortIcon = ({ col }) => sortKey === col
    ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)
    : <ChevronDown className="w-3 h-3 opacity-30" />

  if (!authed) return <PinGate onAuth={handleAuth} />

  const delivered    = packages.filter(p => p.status === 'Delivered').length
  const inTransit    = packages.filter(p => p.status === 'In Transit').length
  const pending      = packages.filter(p => p.status === 'Pending Pickup').length
  const onTimeRate   = packages.length ? Math.round((delivered / packages.length) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{packages.length} packages in the system</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setModal('new')} className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> New Package
          </button>
          <button onClick={exportCSV} className="btn-secondary gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={handleLogout} className="btn-ghost gap-2 text-slate-500">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Packages', value: packages.length, Icon: Package,      color: 'from-brand-500 to-indigo-600'    },
          { label: 'In Transit',     value: inTransit,       Icon: TrendingUp,   color: 'from-amber-500 to-orange-500'    },
          { label: 'Delivered',      value: delivered,       Icon: CheckCircle,  color: 'from-emerald-500 to-teal-600'    },
          { label: 'On-Time Rate',   value: `${onTimeRate}%`, Icon: Clock,        color: 'from-purple-500 to-violet-600'   },
        ].map(({ label, value, Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card group hover:shadow-card-hover transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card lg:col-span-2">
          <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-sm">Packages Booked — Last 6 Months</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={28} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: 12 }}
                  cursor={{ fill: 'rgba(37,99,235,0.06)' }}
                />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Packages" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
        </motion.div>

        {/* Pie chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="card">
          <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-sm">Status Distribution</h3>
          {statusCounts.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={statusCounts} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {statusCounts.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-1.5 mt-3">
                {statusCounts.map(({ name, value }, i) => (
                  <li key={name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-slate-600 dark:text-slate-400">{name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{value}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">All Packages</h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search packages…"
              className="input pl-9 text-sm py-2" />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {[['id','ID'],['sender','Sender'],['recipient','Recipient'],['status','Status'],['estimatedDelivery','Est. Delivery']].map(([key, label]) => (
                  <th key={key}
                    onClick={() => toggleSort(key)}
                    className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 py-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">{label} <SortIcon col={key} /></div>
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">No packages found.</td></tr>
              ) : filtered.map(p => {
                const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG['Pending Pickup']
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-brand-600 dark:text-brand-400 text-sm">{p.id}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.sender}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.recipient}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.estimatedDelivery}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setModal(p)} className="btn-icon w-8 h-8 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/50">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteId(p.id)} className="btn-icon w-8 h-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <p className="text-center py-10 text-slate-400 text-sm">No packages found.</p>
          ) : filtered.map(p => {
            const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG['Pending Pickup']
            return (
              <div key={p.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">{p.id}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />{p.status}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{p.sender} → {p.recipient}</p>
                <p className="text-xs text-slate-400">Est: {p.estimatedDelivery}</p>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setModal(p)} className="btn-secondary text-xs gap-1.5 py-1.5 px-3">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="text-xs px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 font-semibold transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400">{filtered.length} of {packages.length} packages</p>
          </div>
        )}
      </div>

      {/* Package modal */}
      <AnimatePresence>
        {modal && (
          <PackageModal
            pkg={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="card max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <p className="font-bold text-slate-900 dark:text-white mb-1">Delete {deleteId}?</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
