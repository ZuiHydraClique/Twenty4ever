import { Suspense, lazy, useEffect, useState } from 'react'
import { AnimatePresence, motion as Motion, useReducedMotion } from 'framer-motion'
import './App.css'

const CityScene = lazy(() => import('./components/CityScene'))

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  const prefersReducedMotion = useReducedMotion()
  const reduceMotion = !!prefersReducedMotion

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)')
    const onChange = (event) => setIsMobile(event.matches)
    mediaQuery.addEventListener('change', onChange)
    return () => mediaQuery.removeEventListener('change', onChange)
  }, [])

  const handleSceneReady = () => {
    setTimeout(() => {
      setIsLoading(false)
    }, reduceMotion ? 250 : 900)
  }

  return (
    <div className={`landing ${reduceMotion ? 'reduced-motion' : ''} ${isLoading ? 'is-loading' : 'is-ready'}`}>
      <Suspense fallback={null}>
        <CityScene reduceMotion={reduceMotion} isMobile={isMobile} onReady={handleSceneReady} />
      </Suspense>
      <div className="city-overlay" />

      <Motion.header
        className="alert-banner neo-tokyo-header"
        initial={{ y: -42, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2.45, delay: 2.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: 'linear-gradient(120deg, rgba(35,36,58,0.68) 0%, rgba(63,231,255,0.18) 40%, rgba(255,68,220,0.18) 100%)',
          color: '#eafcff',
          textShadow: '0 2px 8px #23243a, 0 0 4px #3fe7ff',
          border: '2px solid #3fe7ff',
          boxShadow: '0 0 12px #3fe7ff33, 0 0 6px #ff44dc33',
          backdropFilter: 'blur(6px)',
          fontFamily: 'Orbitron, Montserrat, sans-serif',
          letterSpacing: '0.06em',
          fontWeight: 200,
          fontSize: 'clamp(1rem, 2.5vw, 1.18rem)',
          padding: '0.7em 1.2em',
          borderRadius: '1.2em',
        }}
      >
        <span style={{ color: '#3fe7ff', fontWeight: 600 }}>Bei Störungen bitte </span>
        <a className="phone-link" href="tel:012323312" style={{ color: '#ff44dc', fontWeight: 700, textShadow: '0 0 4px #ff44dc' }}>
          0123/23312
        </a>
        <span style={{ color: '#3fe7ff', fontWeight: 600 }}> anrufen!</span>
      </Motion.header>

      <Motion.button
        className="location-btn"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.92 : 1.1, delay: 1.68 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsModalOpen(true)}
        type="button"
      >
        <img
          src="/icons8-karten-stecknadel-96.png"
          alt="Standort Icon"
        />
      </Motion.button>

      <Motion.nav
        className="social-nav"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 1.2 : 1.5, delay: 1.45 }}
        aria-label="Social Media"
      >
        {[
          { id: 'TikTok', icon: '/icons8-tiktok-96.png', href: 'https://www.tiktok.com' },
          { id: 'Instagram', icon: '/icons8-instagram-96.png', href: 'https://www.instagram.com' },
          { id: 'Facebook', icon: '/icons8-facebook-96.png', href: 'https://www.facebook.com' },
        ].map((item, index) => (
          <Motion.a
            key={item.id}
            className="social-link"
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.id}
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: reduceMotion ? 0.92 : 1.1, delay: 1.68 + index * 0.18 }}
            whileHover={reduceMotion ? {} : { y: -4, scale: 1.09 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={item.icon}
              alt={item.id + ' Icon'}
              style={{ width: '1.7em', height: '1.7em', display: 'block' }}
            />
          </Motion.a>
        ))}
      </Motion.nav>

      <AnimatePresence>
        {isLoading && (
          <Motion.div
            className="loading-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.55 }}
          >
            <Motion.div
              className="loading-mark"
              initial={{ scale: 0.88, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ repeat: Infinity, repeatType: 'reverse', duration: reduceMotion ? 0.8 : 1.4 }}
            >
              24
            </Motion.div>
            <p>Lade Neon City...</p>
          </Motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <Motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.16 : 0.24 }}
            onClick={() => setIsModalOpen(false)}
          >
            <Motion.section
              className="location-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Standort auf Google Maps"
              initial={{ opacity: 0, scale: 0.9, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: reduceMotion ? 0.18 : 0.3 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-head">
                <h2>Standort</h2>
                <button type="button" className="modal-close" onClick={() => setIsModalOpen(false)}>
                  ✕
                </button>
              </div>
              <p className="modal-address">Beispieladresse: Alexanderplatz, Berlin</p>
              <div className="map-wrap">
                <iframe
                  title="Google Maps Standort"
                  src="https://www.google.com/maps?q=Alexanderplatz,Berlin&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Motion.section>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
