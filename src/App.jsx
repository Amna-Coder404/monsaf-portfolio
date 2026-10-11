import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import Lenis from 'lenis'

import Background from './components/Background'
import ChatWidget from './components/ChatWidget'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import ProjectsPage from './pages/ProjectsPage'

// naye page par hamesha upar se shuru
function ScrollToTop() {
  const { pathname, state } = useLocation()
  useEffect(() => {
    if (state?.scrollTo) return
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname, state])
  return null
}

function Shell() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    window.__lenis = lenis
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  return (
    <MotionConfig reducedMotion="never">
      <AnimatePresence>
        {loading && <Loader key="loader" onDone={() => setLoading(false)} />}
      </AnimatePresence>
      <Background />
      <ScrollToTop />
      <Navbar />

      <main className="relative z-10 font-[Inter,system-ui,sans-serif]">
        <Routes>
          <Route path="/" element={<Home />} />


          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:type" element={<ProjectsPage />} />
          <Route path="/projects/:type/:id" element={<ProjectDetail />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <ChatWidget />
    </MotionConfig>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
