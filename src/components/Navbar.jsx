import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { FiArrowUpRight, FiMenu, FiX } from 'react-icons/fi'
import ColorPicker from './ColorPicker'
import { go } from './go'

const LINKS = ['about', 'skills', 'projects', 'services', 'contact']

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(null)
  const [hover, setHover] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  // Shrink the bar a little after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently visible on the page
  useEffect(() => {
    setActive(null)

    const els = ['top', ...LINKS].map((id) => document.getElementById(id)).filter(Boolean)
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id === 'top' ? null : e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close menu: Escape key, or when the screen grows to desktop size
  useEffect(() => {
    if (!open) return

    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)

    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onChange)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onChange)
    }
  }, [open])

  // If on a detail page, go home first and then scroll to the section
  const jump = (id) => {
    setOpen(false)
    if (pathname !== '/') navigate('/', { state: { scrollTo: id } })
    else go(id)
  }

  const shown = hover ?? active

  return (
    <>
      {/* Dim backdrop behind the mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:pt-4"
      >
        <motion.div
          animate={{ maxWidth: scrolled ? 900 : 1100 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28 }}
          className="relative mx-auto"
        >
          {/* The floating pill */}
          <div className="relative flex items-center justify-between gap-2 overflow-hidden rounded-full border border-white/10 bg-[#04080c]/70 p-1.5 shadow-lg shadow-black/40 backdrop-blur-xl">
            {/* Logo */}
            <button
              onClick={() => jump('top')}
              aria-label="Back to top"
              className="flex min-w-0 items-center gap-2.5 rounded-full py-0.5 pl-0.5 pr-3 transition-colors hover:bg-white/5"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-(--blue) font-(family-name:--display) text-lg font-extrabold text-white ">
                M
              </span>
              <span className="truncate font-(family-name:--display) text-base font-extrabold tracking-tight text-white sm:text-lg">
                monsaf<span className="text-(--blue)">.dev</span>
              </span>
            </button>

            {/* Center links (laptop and up) */}
            <nav
              aria-label="Main"
              onMouseLeave={() => setHover(null)}
              className="hidden items-center lg:flex"
            >
              {LINKS.map((l) => (
                <button
                  key={l}
                  onClick={() => jump(l)}
                  onMouseEnter={() => setHover(l)}
                  onFocus={() => setHover(l)}
                  onBlur={() => setHover(null)}
                  className={`relative rounded-full px-4 py-2 text-sm font-semibold capitalize transition-colors ${shown === l ? 'text-white' : 'text-(--muted)'
                    }`}
                >
                  {shown === l && (
                    <motion.span
                      layoutId="nav-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white/10"
                    />
                  )}
                  <span className="relative flex items-center gap-1.5">
                    {active === l && <span className="size-1.5 rounded-full bg-(--blue)" />}
                    {l}
                  </span>
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <ColorPicker onOpen={() => setOpen(false)} />

              <button
                onClick={() => jump('contact')}
                className="hidden items-center gap-1.5 rounded-full bg-(--blue) px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-(--blue)/30 transition-transform hover:scale-105 active:scale-95 lg:flex"
              >
                Let's Talk <FiArrowUpRight />
              </button>

              {/* Menu button (phones and tablets) */}
              <button
                onClick={() => setOpen(!open)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="mobile-menu"
                className="grid size-10 place-items-center rounded-full bg-white/10 text-xl text-white transition-colors active:bg-white/20 lg:hidden"
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

            {/* Scroll progress: thin line along the bottom edge of the pill */}
            <motion.div
              style={{ scaleX: progress }}
              className="absolute inset-x-5 bottom-0 h-[2px] origin-left rounded-full bg-(--blue) shadow-[0_0_10px] shadow-(--blue)"
            />
          </div>

          {/* Mobile menu: dropdown card with a tile grid */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                initial={{ opacity: 0, y: -12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-[#04080c]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur-2xl lg:hidden"
              >
                <div className="grid grid-cols-2 gap-2">
                  {LINKS.map((l, i) => (
                    <motion.button
                      key={l}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.05 }}
                      onClick={() => jump(l)}
                      className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors active:scale-[0.98] ${i === LINKS.length - 1 && LINKS.length % 2 ? 'col-span-2' : ''
                        } ${active === l
                          ? 'border-(--blue)/50 bg-(--blue)/15'
                          : 'border-white/5 bg-white/5'
                        }`}
                    >
                      <span className="text-xs font-bold text-(--blue)">0{i + 1}</span>
                      <span className="font-(family-name:--display) text-xl font-extrabold capitalize text-white">
                        {l}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  onClick={() => jump('contact')}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-(--blue) py-4 font-semibold text-white shadow-lg shadow-(--blue)/40 active:scale-[0.98]"
                >
                  Let's Talk <FiArrowUpRight />
                </motion.button>

                <p className="mt-4 flex items-center justify-center gap-2 pb-1 text-xs font-semibold text-(--muted)">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Available for work
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.header>
    </>
  )
}