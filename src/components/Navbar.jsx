import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi'
import ColorPicker from './ColorPicker'
import { go } from './go'

const LINKS = ['about', 'skills', 'projects', 'creative', 'contact']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const [hover, setHover] = useState(null)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  // jis section par ho woh highlight ho (page badalne par dobara chalta hai)
  useEffect(() => {
    setActive(null)
    const ids = ['top', ...LINKS]
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === 'top' ? null : e.target.id)
        }),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  // detail page par ho to pehle home par jao, phir section tak scroll
  const jump = (id) => {
    setOpen(false)
    if (pathname !== '/') navigate('/', { state: { scrollTo: id } })
    else go(id)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-3"
    >
      <div className="relative mx-auto max-w-5xl">
        {/* glow peeche */}
        <div className="pointer-events-none absolute inset-x-10 -bottom-3 h-8 rounded-full bg-(--blue)/30 blur-2xl" />

        {/* ghoomti hui light border */}
        <div className="relative overflow-hidden rounded-full shadow-2xl shadow-black/50">
          <motion.span
            aria-hidden="true"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-[150%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--blue)_70deg,#7aa2ff_100deg,transparent_160deg)]"
          />

          {/* andar ka glass bar */}
          <div className="relative m-[1.5px] flex items-center justify-between gap-3 rounded-full bg-[#05060f]/90 py-2 pl-5 pr-2 backdrop-blur-xl">
            {/* Logo */}
            <button
              onClick={() => jump('top')}
              aria-label="Back to top"
              className="flex items-center gap-2 font-(family-name:--display) text-xl font-extrabold tracking-tight text-white"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="size-2.5 rounded-full bg-(--blue) shadow-[0_0_14px] shadow-(--blue)"
              />
              <span>
                amna<span className="text-(--blue)">.dev</span>
              </span>
            </button>

            {/* Links */}
            <nav
              aria-label="Main"
              className="hidden items-center gap-0.5 md:flex"
              onMouseLeave={() => setHover(null)}
            >
              {LINKS.map((l) => (
                <button
                  key={l}
                  onClick={() => jump(l)}
                  onMouseEnter={() => setHover(l)}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${active === l ? 'text-white' : 'text-(--muted) hover:text-white'
                    }`}
                >
                  {hover === l && (
                    <motion.span
                      layoutId="nav-hover"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white/10"
                    />
                  )}
                  <span className="relative">{l}</span>

                  {active === l && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      className="absolute -bottom-0.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-(--blue) shadow-[0_0_10px] shadow-(--blue)"
                    />
                  )}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-(--muted) lg:flex">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                Available for work
              </span>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => jump('contact')}
                className="group relative hidden items-center gap-1.5 overflow-hidden rounded-full bg-(--blue) px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-(--blue)/40 md:flex"
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[330%]" />
                <span className="relative">Talk to me</span>
                <FiArrowUpRight className="relative transition-transform duration-300 group-hover:rotate-45" />

              </motion.button>
              <ColorPicker onOpen={() => setOpen(false)} />
              <button
                onClick={() => setOpen(!open)}
                aria-label="Menu"
                className="grid size-10 place-items-center rounded-full bg-white/10 text-xl text-white md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? 'x' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid place-items-center"
                  >
                    {open ? <FiX /> : <FiMenu />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>

            {/* scroll progress */}
            <motion.span
              style={{ scaleX: progress }}
              className="absolute inset-x-8 bottom-0 h-[2px] origin-left rounded-full bg-linear-to-r from-(--blue) to-[#7aa2ff] shadow-[0_0_8px] shadow-(--blue)"
            />
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-x-0 top-full mt-3 flex flex-col gap-1 rounded-3xl border border-white/10 bg-[#05060f]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl md:hidden"
            >
              {LINKS.map((l, i) => (
                <motion.button
                  key={l}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => jump(l)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left font-semibold capitalize transition-colors hover:bg-white/10 ${active === l ? 'bg-(--blue)/15 text-white' : 'text-(--muted)'
                    }`}
                >
                  {l}
                  {active === l && (
                    <span className="size-2 rounded-full bg-(--blue) shadow-[0_0_10px] shadow-(--blue)" />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}