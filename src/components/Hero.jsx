import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  FiUser,
  FiCode,
  FiFolder,
  FiCamera,
  FiMail,
  FiGithub,
  FiLinkedin,
  FiBattery,
  FiBell,
  FiChevronUp,
} from 'react-icons/fi'
import { go } from './go'

const ROLES = ['Mobile App Developer', 'React Native Specialist', 'Web Developer']

const APPS = [
  { id: 'about', label: 'About', icon: FiUser },
  { id: 'skills', label: 'Skills', icon: FiCode },
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'creative', label: 'Creative', icon: FiCamera },
  { id: 'contact', label: 'Contact', icon: FiMail },
]
// My Data For Links
const DOCK = [
  { label: 'GitHub', icon: FiGithub, href: 'https://github.com/Amna-Coder404' },
  { label: 'LinkedIn', icon: FiLinkedin, href: 'https://www.linkedin.com/in/amna-coder200' },
  { label: 'Email', icon: FiMail, href: 'mailto:amnaharaf272@gmail.com' },
]

const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const dateLabel = () =>
  new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' })

// Wallpaper from your /public folder. Change the file name to match yours.
const WALLPAPER = '/wallpaper.jpeg'

const NAME = ['Amna', 'Ashraf']

export default function Hero() {
  const reduce = useReducedMotion()
  const [role, setRole] = useState(0)
  const [clock, setClock] = useState(time())
  const [unlocked, setUnlocked] = useState(false)
  const [notif, setNotif] = useState(false)

  useEffect(() => {
    const r = setInterval(() => setRole((x) => (x + 1) % ROLES.length), 2600)
    const c = setInterval(() => setClock(time()), 20000)
    return () => { clearInterval(r); clearInterval(c) }
  }, [])

  // The one orchestrated moment: the phone starts locked, then swipes open
  useEffect(() => {
    const t = setTimeout(() => setUnlocked(true), reduce ? 0 : 4200)
    return () => clearTimeout(t)
  }, [reduce])

  // Notification banner: shows after unlock, stays 3.5s, repeats every 12s
  useEffect(() => {
    if (!unlocked) return
    let hide
    const show = () => {
      setNotif(true)
      hide = setTimeout(() => setNotif(false), 3500)
    }
    const first = setTimeout(show, 1800)
    const loop = setInterval(show, 12000)
    return () => { clearTimeout(first); clearTimeout(hide); clearInterval(loop) }
  }, [unlocked])

  return (
    <section
      id="top"
      className="wrap relative grid min-h-screen items-center gap-14 pb-16 pt-32 lg:grid-cols-2"
    >
      {/* ───────── Text ───────── */}
      <div>
        <p className="mb-4 text-lg font-medium text-[#7aa2ff]">Hi, I'm</p>

        <h1
          aria-label="Amna Ashraf"
          className="font-(family-name:--display) text-6xl font-extrabold leading-[1.02] tracking-tighter text-(--blue) sm:text-7xl lg:text-8xl"
        >
          {NAME.map((word, wi) => (
            <span key={word} className="mr-5 inline-block whitespace-nowrap" aria-hidden="true">
              {word.split('').map((ch, ci) => (
                <span key={ci} className="inline-block overflow-hidden pb-2 align-top">
                  <motion.span
                    initial={reduce ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.1 + (wi * 5 + ci) * 0.045,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block"
                  >
                    {ch}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div
          className="mt-5 h-9 overflow-hidden font-(family-name:--display) text-2xl font-semibold text-(--muted)"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={role}
              initial={reduce ? false : { opacity: 0, filter: 'blur(6px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)' }}
              transition={{ duration: 0.4 }}
              className="block"
            >
              {ROLES[role]}
            </motion.span>
          </AnimatePresence>
        </div>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-(--muted)">
          I build modern, responsive, user-friendly mobile apps with smooth functionality and
          thoughtful design, and bring web experience along to make complete digital products.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <button
            onClick={() => go('projects')}
            className="rounded-full bg-(--blue) px-7 py-3.5 font-semibold text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--blue)"
          >
            See my work
          </button>
          <button
            onClick={() => go('contact')}
            className="rounded-full border border-(--blue) px-7 py-3.5 font-semibold text-(--blue) transition-colors hover:bg-(--blue) hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--blue)"
          >
            Talk to me
          </button>
        </div>
      </div>

      {/* ───────── Phone ───────── */}
      <div className="grid place-items-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[9/18.5] w-[270px] rounded-[2.8rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl shadow-(--blue)/30 ring-1 ring-white/10 sm:w-[300px]"
        >
          <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[2.2rem] bg-[#03040a] px-5 pb-4 pt-3 text-white">
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${WALLPAPER})` }}
            />
            <div className="absolute inset-0 -z-10 bg-black/50" />
            {/* Status bar */}
            <div className="relative z-30 flex items-center justify-between text-xs font-semibold">
              <span>{clock}</span>
              <span className="h-5 w-20 rounded-full bg-black" />
              <span className="flex items-center gap-1">
                5G <FiBattery className="text-base" />
              </span>
            </div>

            {/* Notification banner */}
            <AnimatePresence>
              {notif && (
                <motion.button
                  key="notif"
                  onClick={() => go('contact')}
                  initial={{ y: -70, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -70, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  className="absolute inset-x-3 top-11 z-20 flex items-center gap-3 rounded-2xl bg-(--blue) px-3 py-2.5 text-left text-white shadow-xl shadow-black/40"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-white/20 text-white">
                    <FiBell className="text-sm" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-[11px] font-bold">New message</strong>
                    <span className="block truncate text-[11px] text-white/70">
                      Let's build something together
                    </span>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <p className="mt-5 text-center font-(family-name:--display) text-xl font-bold">
              Amna OS
            </p>

            {/* Status widget */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#7aa2ff] opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#7aa2ff]" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-white/60">Open to work</p>
                <p className="truncate text-sm font-bold">{ROLES[role]}</p>
              </div>
            </div>

            {/* Apps */}
            <div className="mt-5 grid grid-cols-3 gap-x-3 gap-y-4">
              {APPS.map((a, i) => (
                <motion.button
                  key={a.id}
                  onClick={() => go(a.id)}
                  whileTap={{ scale: 0.9 }}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={unlocked ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                  transition={{ duration: 0.45, delay: unlocked ? 0.25 + i * 0.07 : 0 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-(--blue) text-2xl text-white">
                    <a.icon />
                  </span>
                  <span className="text-[11px] font-medium text-white/80">{a.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Dock */}
            <div className="mt-auto flex items-center justify-center gap-4 rounded-3xl border border-white/15 px-4 py-2.5">
              {DOCK.map((d) => (
                <a
                  key={d.label}
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={d.label}
                  className="grid size-11 place-items-center rounded-2xl border border-white/20 text-xl transition-colors hover:bg-(--blue)"
                >
                  <d.icon />
                </a>
              ))}
            </div>

            {/* Lock screen: swipes up to reveal the home screen */}
            <motion.div
              initial={false}
              animate={{ y: unlocked ? '-105%' : '0%' }}
              transition={{ duration: reduce ? 0 : 0.9, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 isolate z-40 flex flex-col items-center bg-[#03040a] px-5 pb-6 pt-16 text-white"
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center"
                style={{ backgroundImage: `url(${WALLPAPER})` }}
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/30 to-black/60" />
              <p className="text-sm text-white/70">{dateLabel()}</p>
              <p className="mt-1 font-(family-name:--display) text-7xl font-extrabold tracking-tighter">
                {clock}
              </p>
              <div className="mt-auto flex flex-col items-center gap-2 text-white/60">
                <motion.span
                  animate={reduce ? undefined : { y: [0, -6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <FiChevronUp />
                </motion.span>
                <span className="h-1 w-28 rounded-full bg-white/80" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}