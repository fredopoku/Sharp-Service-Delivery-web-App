import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPackageById } from '../data/packages'

const STATUS_COLOR = {
  'Delivered':        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Out for Delivery': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'In Transit':       'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'At Customs':       'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Pending Pickup':   'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  'Returned':         'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  'On Hold':          'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const STATUS_STEPS = ['Pending Pickup', 'In Transit', 'At Customs', 'Out for Delivery', 'Delivered']

function progressPercent(status) {
  const idx = STATUS_STEPS.indexOf(status)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / STATUS_STEPS.length) * 100)
}

export default function Track() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [input, setInput]   = useState(searchParams.get('id') || '')
  const [pkg, setPkg]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ssd_track_history')) || [] } catch { return [] }
  })

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) doSearch(id)
  }, [])

  function doSearch(id) {
    setLoading(true)
    setError('')
    setPkg(null)
    setTimeout(() => {
      const found = getPackageById(id)
      setLoading(false)
      if (!found) {
        setError(`No package found for "${id}". Please check the tracking number and try again.`)
      } else {
        setPkg(found)
        addToHistory(id.toUpperCase())
      }
    }, 800)
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
      const next = [id, ...prev.filter(h => h !== id)].slice(0, 5)
      localStorage.setItem('ssd_track_history', JSON.stringify(next))
      return next
    })
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem('ssd_track_history')
  }

  const pct = pkg ? progressPercent(pkg.status) : 0

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Track Your Package</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your Sharp Service Delivery tracking number below.</p>

      {/* Search form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. SSD-001"
          className="input flex-1"
        />
        <button type="submit" className="btn-primary whitespace-nowrap" disabled={loading}>
          {loading ? 'Searching…' : 'Track Package'}
        </button>
      </form>

      {/* Recent history */}
      {history.length > 0 && !pkg && !loading && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Searches</p>
            <button onClick={clearHistory} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map(id => (
              <button
                key={id}
                onClick={() => { setInput(id); setSearchParams({ id }); doSearch(id) }}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-brand-50 dark:hover:bg-brand-900/30 hover:text-brand-600 transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card flex items-center justify-center py-14">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400">
          <div className="flex gap-3 items-start">
            <span className="text-xl">❌</span>
            <div>
              <p className="font-semibold">Package Not Found</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {!loading && pkg && (
        <div className="space-y-5">
          {/* Header card */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Tracking Number</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{pkg.id}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{pkg.description} · {pkg.weight}</p>
              </div>
              <span className={`self-start sm:self-center px-4 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLOR[pkg.status] || STATUS_COLOR['Pending Pickup']}`}>
                {pkg.status}
              </span>
            </div>

            {/* Route */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-1">From</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{pkg.origin}</p>
              </div>
              <div className="flex items-center justify-center text-gray-400 text-xl">→</div>
              <div>
                <p className="text-xs text-gray-400 mb-1">To</p>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{pkg.destination}</p>
              </div>
            </div>

            {/* Progress bar */}
            {STATUS_STEPS.includes(pkg.status) && (
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="hidden sm:flex justify-between mt-2">
                  {STATUS_STEPS.map((s, i) => (
                    <span
                      key={s}
                      className={`text-[10px] font-medium ${i <= STATUS_STEPS.indexOf(pkg.status) ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400'}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
              <span>📅 Booked: {pkg.createdAt}</span>
              <span>🎯 Est. Delivery: {pkg.estimatedDelivery}</span>
              <span>👤 Recipient: {pkg.recipient}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="font-bold text-gray-900 dark:text-white mb-5">Shipment Timeline</h2>
            <ol className="relative border-l-2 border-gray-200 dark:border-gray-700 space-y-6 ml-2">
              {[...pkg.events].reverse().map((ev, i) => (
                <li key={i} className="ml-5">
                  <span className="absolute -left-3.5 flex items-center justify-center w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-900/30 text-base border-2 border-white dark:border-gray-900">
                    {ev.icon}
                  </span>
                  <div className={`${i === 0 ? 'opacity-100' : 'opacity-70'}`}>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{ev.status}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ev.location} · {ev.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
