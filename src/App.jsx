import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Lenis from 'lenis'
import Background from './components/Background'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import ChatWidget from './components/ChatWidget'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Loader from './components/Loader'



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
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    window.__lenis = lenis
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  const [loading, setLoading] = useState(true)

  const handleDone = () => setLoading(false)


  return (
    <MotionConfig reducedMotion="never">
      <AnimatePresence>{loading && <Loader key="loader" onDone={handleDone} />}</AnimatePresence>
      <Background />
      <ScrollToTop />
      <Navbar />

      <main className="relative z-10 font-[Inter,system-ui,sans-serif]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
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