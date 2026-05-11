import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Package, Moon, Sun, ChevronRight } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/track', label: 'Track Package' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { dark, toggle }      = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-sm border-b border-slate-200/60 dark:border-slate-800/60'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-300">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-black text-base text-slate-900 dark:text-white tracking-tight">Sharp</span>
              <span className="font-black text-base text-brand-600 tracking-tight">SD</span>
              <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Service Delivery</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <button onClick={toggle} className="btn-icon" aria-label="Toggle dark mode">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link to="/track" className="hidden md:inline-flex btn-primary text-xs px-4 py-2 gap-1.5">
              Track Now
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <Link to="/admin" className="hidden md:inline-flex btn-ghost text-xs px-3 py-2">
              Admin
            </Link>

            <button
              onClick={() => setOpen(o => !o)}
              className="md:hidden btn-icon"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white">Menu</span>
                <button onClick={() => setOpen(false)} className="btn-icon"><X className="w-5 h-5" /></button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                {links.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    {label}
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </NavLink>
                ))}
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Admin Dashboard
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              </nav>

              <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <Link to="/track" onClick={() => setOpen(false)} className="btn-primary w-full justify-center">
                  Track a Package
                </Link>
                <button
                  onClick={() => { toggle(); }}
                  className="btn-secondary w-full gap-2"
                >
                  {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {dark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  )
}
