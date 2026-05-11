import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Track from './pages/Track'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

function NotFound() {
  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate"
      className="min-h-[65vh] flex flex-col items-center justify-center text-center px-4"
    >
      <p className="text-8xl font-black text-gradient mb-4">404</p>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn-primary">Back to Home</a>
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"       element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Home /></motion.div>} />
        <Route path="/track"  element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Track /></motion.div>} />
        <Route path="/about"  element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><About /></motion.div>} />
        <Route path="/contact" element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Contact /></motion.div>} />
        <Route path="/admin"  element={<motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"><Admin /></motion.div>} />
        <Route path="*"       element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } },
          }}
        />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}
