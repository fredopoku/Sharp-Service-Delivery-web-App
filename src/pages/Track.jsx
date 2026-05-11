import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Copy, CheckCircle, XCircle, Clock, Package, MapPin, ArrowRight, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { getPackageById } from '../data/packages'

const STATUS_CONFIG = {
  'Delivered':        { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  'Out for Delivery': { color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-200 dark:border-blue-800',    dot: 'bg-blue-500'    },
  'In Transit':       { color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-900/20',  border: 'border-amber-200 dark:border-amber-800',  dot: 'bg-amber-500 animate-pulse'   },
  'At Customs':       { color: 'text-orange-600 dark:text-orange-400',bg: 'bg-orange-50 dark:bg-orange-900/20',border: 'border-orange-200 dark:border-orange-800',dot: 'bg-orange-500'  },
  'Pending Pickup':   { color: 'text-slate-600 dark:text-slate-400',  bg: 'bg-slate-50 dark:bg-slate-800',     border: 'border-slate-200 dark:border-slate-700',  dot: 'bg-slate-400'   },
  'Returned':         { color: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-900/20',      border: 'border-red-200 dark:border-red-800',      dot: 'bg-red-500'     },
  'On Hold':          { color: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-900/20',border: 'border-purple-200 dark:border-purple-800',dot: 'bg-purple-500'  },
}

const STATUS_STEPS = ['Pending Pickup', 'In Transit', 'At Customs', 'Out for Delivery', 'Delivered']

function progressIndex(status) {
  const i = STATUS_STEPS.indexOf(status)
  return i === -1 ? 0 : i
}

/* ── Skeleton ─────────────────────────────────────────────────── */
function SkeletonResult() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="card space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="skeleton h-3 w-24 rounded" />
            <div className="skeleton h-8 w-32 rounded-lg" />
            <div className="skeleton h-3 w-48 rounded" />
          </div>
          <div className="skeleton h-7 w-24 rounded-full" />
        </div>
        <div className="skeleton h-2.5 w-full rounded-full" />
        <div className="grid grid-cols-3 gap-4">
          {[0,1,2].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
        </div>
      </div>
      <div className="card space-y-5">
        <div className="skeleton h-5 w-40 rounded" />
        {[0,1,2].map(i => (
          <div key={i} className="flex gap-4">
            <div className="skeleton w-8 h-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3.5 w-40 rounded" />
              <div className="skeleton h-3 w-56 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [input, setInput]     = useState(searchParams.get('id') || '')
  const [pkg, setPkg]         = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [copied, setCopied]   = useState(false)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ssd_track_history')) || [] } catch { return [] }
  })

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) doSearch(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function doSearch(id) {
    setLoading(true)
    setError('')
    setPkg(null)
    setTimeout(() => {
      const found = getPackageById(id)
      setLoading(false)
      if (!found) {
        setError(id)
      } else {
        setPkg(found)
        addToHistory(id.toUpperCase())
      }
    }, 900)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const id = input.trim().toUpperCase()
    if (!id) return
    setSearchParams({ id })
    doSearch(id)
  }

  function addToHistory(id) {
    setHistory(prev => {
      const next = [id, ...prev.filter(h => h !== id)].slice(0, 6)
      localStorage.setItem('ssd_track_history', JSON.stringify(next))
      return next
    })
  }

  function copyId() {
    navigator.clipboard.writeText(pkg.id)
    setCopied(true)
    toast.success('Tracking number copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const stepIdx = pkg ? progressIndex(pkg.status) : 0
  const cfg     = pkg ? (STATUS_CONFIG[pkg.status] || STATUS_CONFIG['Pending Pickup']) : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
          Track Your Package
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Enter a Sharp Service Delivery tracking number for real-time updates.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. SSD-001"
            className="input pl-10"
          />
        </div>
        <button type="submit" className="btn-primary gap-2" disabled={loading}>
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Searching…' : 'Track'}
        </button>
      </form>

      {/* History chips */}
      {history.length > 0 && !loading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recent</p>
            <button onClick={() => { setHistory([]); localStorage.removeItem('ssd_track_history') }}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors">
              Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map(id => (
              <button
                key={id}
                onClick={() => { setInput(id); setSearchParams({ id }); doSearch(id) }}
                className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-950/50 hover:text-brand-600 dark:hover:text-brand-400 transition-colors border border-slate-200 dark:border-slate-700"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && <SkeletonResult />}

      {/* Error */}
      <AnimatePresence>
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20"
          >
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-red-700 dark:text-red-400">Package Not Found</p>
                <p className="text-sm text-red-600/80 dark:text-red-400/70 mt-1">
                  No package found for <span className="font-mono font-bold">"{error}"</span>. Please check the tracking number and try again.
                </p>
                <p className="text-xs text-red-500/60 dark:text-red-400/50 mt-2">
                  Try one of the demo IDs: SSD-001, SSD-002, SSD-003
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {!loading && pkg && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            {/* Header card */}
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Tracking Number</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{pkg.id}</p>
                    <button onClick={copyId} className="btn-icon w-7 h-7">
                      {copied
                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{pkg.description} · {pkg.weight}</p>
                </div>

                <div className={`self-start flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                  {pkg.status}
                </div>
              </div>

              {/* Route */}
              <div className="grid grid-cols-3 gap-3 mb-5 text-center">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> From
                  </p>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight">{pkg.origin}</p>
                </div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-1 text-slate-300 dark:text-slate-600">
                    <div className="h-px w-6 bg-current" />
                    <ArrowRight className="w-4 h-4" />
                    <div className="h-px w-6 bg-current" />
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> To
                  </p>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight">{pkg.destination}</p>
                </div>
              </div>

              {/* Step progress */}
              {STATUS_STEPS.includes(pkg.status) && (
                <div className="mb-5">
                  <div className="flex items-center mb-3">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex-1 flex items-center">
                        <motion.div
                          initial={{ scale: 0.6 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.07 }}
                          className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 transition-colors ${
                            i < stepIdx   ? 'bg-brand-600 border-brand-600 text-white'
                            : i === stepIdx ? 'bg-white dark:bg-slate-900 border-brand-600 text-brand-600'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                          }`}
                        >
                          {i < stepIdx ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                        </motion.div>
                        {i < STATUS_STEPS.length - 1 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: i < stepIdx ? 1 : 0 }}
                            transition={{ delay: i * 0.07 + 0.1, duration: 0.4 }}
                            className="h-0.5 flex-1 bg-brand-600 origin-left"
                            style={{ backgroundColor: i < stepIdx ? undefined : 'transparent' }}
                          >
                            <div className={`h-full ${i < stepIdx ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:flex">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex-1 text-center">
                        <p className={`text-[10px] font-semibold leading-tight ${i <= stepIdx ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {[
                  { icon: Clock,        label: 'Booked',          value: pkg.createdAt },
                  { icon: CheckCircle,  label: 'Est. Delivery',   value: pkg.estimatedDelivery },
                  { icon: Package,      label: 'Recipient',       value: pkg.recipient },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                    <Icon className="w-4 h-4 text-brand-500 shrink-0" />
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <h2 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                Shipment Timeline
              </h2>
              <ol className="space-y-0">
                {[...pkg.events].reverse().map((ev, i, arr) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`relative flex gap-4 ${i < arr.length - 1 ? 'pb-6' : ''}`}
                  >
                    {/* Line */}
                    {i < arr.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />
                    )}
                    {/* Icon */}
                    <div className={`relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-base border-2 ${
                      i === 0
                        ? 'bg-brand-600 border-brand-600 text-white shadow-glow'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    }`}>
                      <span className="text-sm leading-none">{ev.icon}</span>
                    </div>
                    {/* Content */}
                    <div className={`flex-1 pb-1 ${i > 0 ? 'opacity-65' : ''}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">{ev.status}</p>
                        {i === 0 && (
                          <span className="badge bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 text-[10px] shrink-0">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ev.location}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{ev.date}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!loading && !pkg && !error && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-600">
          <Package className="w-14 h-14 mx-auto mb-4 opacity-30" />
          <p className="font-semibold text-slate-500 dark:text-slate-400">Enter a tracking number above</p>
          <p className="text-sm mt-1">Try <span className="font-mono text-brand-500">SSD-001</span>, <span className="font-mono text-brand-500">SSD-002</span>, or <span className="font-mono text-brand-500">SSD-003</span></p>
        </div>
      )}
    </div>
  )
}
