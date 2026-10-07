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

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

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

  // If on a detail page, go home first and then scroll to the section
  const jump = (id) => {
    setOpen(false)
    if (pathname !== '/') navigate('/', { state: { scrollTo: id } })
    else go(id)
  }

  const glass = 'border border-white/10 bg-[#04080c]/70 backdrop-blur-xl'

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* Scroll progress: thin line at the very top of the screen */}
        <motion.div
          style={{ scaleX: progress }}
          className="h-[3px] origin-left bg-(--blue) shadow-[0_0_12px] shadow-(--blue)"
        />

        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 pt-3">
          {/* Logo block */}
          <button
            onClick={() => jump('top')}
            aria-label="Back to top"
            className={`flex items-center gap-2.5 rounded-2xl ${glass} py-2 pl-2 pr-4 font-(family-name:--display) text-lg font-extrabold tracking-tight text-white`}
          >

            <span>
              monsaf<span className="text-(--blue)">.dev</span>
            </span>
          </button>

          {/* Center links (desktop) */}
          <nav
            aria-label="Main"
            className={`hidden items-center gap-1 rounded-2xl ${glass} p-1.5 md:flex`}
          >
            {LINKS.map((l, i) => (
              <button
                key={l}
                onClick={() => jump(l)}
                className={`relative flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold capitalize transition-colors ${active === l ? 'text-white' : 'text-(--muted) hover:text-white'
                  }`}
              >
                {active === l && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 rounded-xl bg-(--blue)/20 ring-1 ring-(--blue)/40"
                  />
                )}
                <span className="relative text-[10px] font-bold text-(--blue)">
                  0{i + 1}
                </span>
                <span className="relative">{l}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className={`flex items-center gap-2 rounded-2xl ${glass} p-1.5`}>
            <span className="hidden items-center gap-2 px-3 text-xs font-semibold text-(--muted) xl:flex">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Available for work
            </span>

            <ColorPicker onOpen={() => setOpen(false)} />


            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
              className="grid size-10 place-items-center rounded-xl bg-white/10 text-xl text-white md:hidden"
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
        </div>
      </motion.header >

      {/* Mobile menu: full-screen overlay */}
      < AnimatePresence >
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-1 bg-[#04080c]/95 px-6 pt-20 backdrop-blur-2xl md:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.06 }}
                onClick={() => jump(l)}
                className="flex items-baseline gap-4 border-b border-white/10 py-4 text-left"
              >
                <span className="text-sm font-bold text-(--blue)">0{i + 1}</span>
                <span
                  className={`font-(family-name:--display) text-4xl font-extrabold capitalize ${active === l ? 'text-(--blue)' : 'text-white'
                    }`}
                >
                  {l}
                </span>
              </motion.button>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={() => jump('contact')}
              className="mt-8 flex items-center justify-center gap-2 rounded-2xl bg-(--blue) py-4 font-semibold text-white shadow-lg shadow-(--blue)/40"
            >
              Let's Talk <FiArrowUpRight />
            </motion.button>
          </motion.div>
        )
        }
      </AnimatePresence >
    </>
  )
}