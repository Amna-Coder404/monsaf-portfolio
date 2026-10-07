import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiCode, FiDroplet, FiHeart } from 'react-icons/fi'
import { SiReact, SiExpo, SiTailwindcss, SiFramer, SiSupabase, SiGit } from 'react-icons/si'
import bg from '/behind-the-screen.png'

const tile =
  'relative min-w-0 overflow-hidden rounded-3xl border border-(--line) bg-(--paper)/80 p-5 shadow-lg shadow-black/30 sm:rounded-[28px] sm:p-6 md:backdrop-blur'

const enter = (i) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { type: 'spring', stiffness: 110, damping: 18, delay: i * 0.1 },
})

/* ───────── 1. Tech orbit ───────── */
const INNER = [
  { label: 'React', icon: SiReact },
  { label: 'Expo', icon: SiExpo },
  { label: 'Git', icon: SiGit },
]

const OUTER = [
  { label: 'Tailwind', icon: SiTailwindcss },
  { label: 'Framer Motion', icon: SiFramer },
  { label: 'Supabase', icon: SiSupabase },
  { label: 'React Native', icon: SiReact },
]

function Ring({ items, radius, duration, reverse = false }) {
  const spin = reverse ? -360 : 360

  return (
    <>
      {/* orbit line */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/15"
        style={{ width: radius * 2, height: radius * 2 }}
      />

      <motion.div
        animate={{ rotate: spin }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 will-change-transform"
      >
        {items.map((c, i) => {
          const a = (i / items.length) * Math.PI * 2
          return (
            <div
              key={c.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `calc(50% + ${Math.cos(a) * radius}px)`,
                top: `calc(50% + ${Math.sin(a) * radius}px)`,
              }}
            >
              {/* counter-rotate so the icon stays upright */}
              <motion.div
                animate={{ rotate: -spin }}
                transition={{ duration, repeat: Infinity, ease: 'linear' }}
                title={c.label}
                className="grid size-10 place-items-center rounded-2xl border border-(--blue)/40 bg-(--fog) text-lg text-[#7aa2ff] shadow-lg shadow-black/40 sm:size-11 sm:text-xl"
              >
                <c.icon />
              </motion.div>
            </div>
          )
        })}
      </motion.div>
    </>
  )
}

function Orbit() {
  return (
    <motion.div {...enter(0)} className={`${tile} md:col-span-2 md:row-span-2`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-(family-name:--display) text-lg font-bold sm:text-xl">Tech orbit</h3>
        <span className="text-xs font-semibold text-(--muted)">my everyday stack</span>
      </div>

      <div
        className="relative h-72 overflow-hidden rounded-2xl border border-white/5 bg-cover bg-center sm:h-80 md:h-[22rem]"
        style={{ backgroundImage: `url(${bg})` }}
      >
        {/* dark overlay so the icons stay readable */}
        <div className="pointer-events-none absolute inset-0 bg-black/50" />

        {/* pulsing glow */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="pointer-events-none absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--blue)/50 blur-3xl sm:size-40"
        />

        {/* fixed-size stage, scaled down on small screens so nothing gets clipped */}
        <div className="absolute left-1/2 top-1/2 size-[280px] -translate-x-1/2 -translate-y-1/2 scale-[0.8] min-[400px]:scale-90 sm:scale-100">
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-1/2 z-10 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-(--blue) text-2xl text-white shadow-lg shadow-(--blue)/60"
          >
            <FiCode />
          </motion.div>

          <Ring items={INNER} radius={62} duration={14} />
          <Ring items={OUTER} radius={108} duration={22} reverse />
        </div>
      </div>
    </motion.div>
  )
}


/* ───────── 3. Heart burst ───────── */
function Burst() {
  const [count, setCount] = useState(0)
  const [bursts, setBursts] = useState([])

  const pop = () => {
    const id = Date.now() + Math.random()
    setCount((n) => n + 1)
    setBursts((b) => [...b, id])
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 800)
  }

  return (
    <motion.div
      {...enter(2)}
      className={`${tile} flex min-h-[13rem] flex-col items-center justify-center text-center`}
    >
      <div className="relative size-20">
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          onClick={pop}
          aria-label="Send some love"
          className="relative z-10 grid size-20 touch-manipulation place-items-center rounded-full bg-(--blue) text-3xl text-white shadow-lg shadow-(--blue)/50"
        >
          <FiHeart />
        </motion.button>

        {bursts.map((id) =>
          Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2
            return (
              <motion.span
                key={`${id}-${i}`}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: Math.cos(a) * 70, y: Math.sin(a) * 70, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="pointer-events-none absolute left-1/2 top-1/2 -ml-1 -mt-1 size-2 rounded-full bg-[#7aa2ff]"
              />
            )
          })
        )}
      </div>

      {/* fixed-height line so the counter never shifts the layout */}
      <p className="mt-5 flex h-7 items-center gap-1.5 text-sm font-semibold text-(--muted)">
        <motion.span
          key={count}
          initial={{ scale: 1.5, color: '#7aa2ff' }}
          animate={{ scale: 1, color: '#eef2ff' }}
          className="inline-block min-w-[1.5ch] text-center text-lg font-extrabold"
        >
          {count}
        </motion.span>
        {count === 1 ? 'tap' : 'taps'} of love
      </p>
    </motion.div>
  )
}

/* ───────── 4. Live code typing ───────── */
const CODE = `const App = () => (
  <Portfolio
    creative
    animated
    madeBy="Amna"
  />
)`

const preClass =
  'col-start-1 row-start-1 m-0 whitespace-pre font-mono text-[13px] leading-6 sm:text-base sm:leading-7'

function CodeTile() {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.2 })
  const [n, setN] = useState(0)

  // typing only runs while the tile is on screen
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setN((x) => (x >= CODE.length + 25 ? 0 : x + 1)), 70)
    return () => clearInterval(t)
  }, [inView])

  return (
    <motion.div ref={ref} {...enter(3)} className={`${tile} md:col-span-3`}>
      <div className="mb-4 flex items-center gap-2">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-amber-400" />
        <span className="size-3 rounded-full bg-emerald-400" />
        <span className="ml-3 truncate text-xs font-semibold text-(--muted)">Portfolio.jsx</span>
      </div>

      {/* Both layers share one grid cell, so the full code reserves the height up front:
          typing never changes the layout and the page does not jump while scrolling. */}
      <div className="grid overflow-x-auto text-[#a9c0ff] [scrollbar-width:thin]">
        <pre aria-hidden="true" className={`${preClass} invisible select-none`}>
          {CODE}
          {'\u00A0'}
        </pre>

        <pre aria-label={CODE} className={preClass}>
          {CODE.slice(0, Math.min(n, CODE.length))}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-(--blue) sm:h-5 sm:translate-y-1"
          />
        </pre>
      </div>
    </motion.div>
  )
}

/* ───────── Section ───────── */
export default function Creative() {
  return (
    <section id="creative" className="wrap relative overflow-x-clip">
      <motion.h2
        className="h2 text-balance"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Creative lab
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-8 mt-3 max-w-xl text-base text-(--muted) sm:mb-10 sm:text-lg"
      >
        Little experiments I like building. Tap, recolor and watch it move, it's all alive.
      </motion.p>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        <Orbit />

        <Burst />
        <CodeTile />
      </div>
    </section>
  )
}