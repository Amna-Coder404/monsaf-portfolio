import { useEffect, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { go } from './go'

const FIRST = 'Monsaf'
const LAST = 'Ali'
const PHOTO = '/profile.png'
const ROLES = ['Web Developer', 'Mobile Developer']
// 'frame'  -> works with ANY photo (with background, any pose)
// 'cutout' -> only for transparent-background PNGs (person pops out of the card)
const MODE = 'frame'

export default function Hero() {
  const reduce = useReducedMotion()
  const [imgOk, setImgOk] = useState(true)

  // 3D tilt on the photo card
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 140, damping: 18 })
  const sy = useSpring(my, { stiffness: 140, damping: 18 })
  const rotateY = useTransform(sx, [-0.5, 0.5], [-7, 7])
  const rotateX = useTransform(sy, [-0.5, 0.5], [5, -5])

  // scroll parallax: each layer moves at its own speed
  const k = reduce ? 0 : 1
  const { scrollY } = useScroll()
  const ss = useSpring(scrollY, { stiffness: 90, damping: 22 })
  const photoY = useTransform(ss, [0, 700], [0, -110 * k])
  const photoScale = useTransform(ss, [0, 700], [1, 1 + 0.16 * k])
  const photoRot = useTransform(ss, [0, 700], [0, -4 * k])
  const cardY = useTransform(ss, [0, 700], [0, 70 * k])
  const cardScale = useTransform(ss, [0, 700], [1, 1 - 0.08 * k])
  const cardRot = useTransform(ss, [0, 700], [0, 5 * k])
  const markX = useTransform(ss, [0, 700], [0, -80 * k])
  const shadowScale = useTransform(ss, [0, 700], [1, 1 + 0.5 * k])
  const shadowOpacity = useTransform(ss, [0, 700], [1, 1 - 0.6 * k])
  const wrapOpacity = useTransform(ss, [350, 900], [1, 1 - 0.7 * k])
  // frame mode
  const frameY = useTransform(ss, [0, 700], [0, -50 * k])
  const frameImgScale = useTransform(ss, [0, 700], [1.05, 1.05 + 0.18 * k])
  const frameImgY = useTransform(ss, [0, 700], [0, 30 * k])

  const onMove = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const rise = (d) => ({
    initial: reduce ? false : { opacity: 0, y: 28, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: 0.8, delay: d, ease: [0.16, 1, 0.3, 1] },
  })


  const [role, setRole] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setRole((r) => (r + 1) % ROLES.length), 2000)
    return () => clearInterval(t)
  }, [])


  return (
    <section
      id="top"
      className="wrap relative z-10 grid min-h-screen items-center gap-16 pb-20 pt-32 lg:grid-cols-[0.9fr_1.1fr]"
    >
      {/* Background lives in <Background /> (aurora, cursor grid, shapes, grain) */}

      {/* ───────── Photo (left on desktop) ───────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: wrapOpacity }}
        className="relative grid place-items-center [perspective:1200px] lg:order-1"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <motion.div
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative aspect-[4/5] w-[290px] sm:w-[350px] lg:w-[410px]"
        >
          {MODE === 'frame' ? (
            <>
              {/* simple photo card: thin frame, no back plate, no name tag */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl shadow-black/50"
                style={{ y: frameY }}
              >
                <div className="relative size-full overflow-hidden rounded-2xl">
                  {imgOk ? (
                    <motion.img
                      src={PHOTO}
                      alt={`${FIRST} ${LAST}`}
                      onError={() => setImgOk(false)}
                      draggable={false}
                      className="size-full object-cover object-top"
                      style={{ scale: frameImgScale, y: frameImgY }}
                    />
                  ) : (
                    <div className="grid size-full place-items-center font-(family-name:--display) text-7xl font-extrabold text-cyan-300">
                      {FIRST[0]}
                      {LAST[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04080c]/60 via-transparent to-transparent" />
                </div>
              </motion.div>
            </>
          ) : (
            <>
              {/* back card (the cut-out pops out of its top edge) */}
              <motion.div
                className="absolute inset-x-0 bottom-0 h-[78%] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] via-white/[0.03] to-transparent backdrop-blur-sm"
                style={{ y: cardY, scale: cardScale, rotate: cardRot, z: 0 }}
              >
                <div className="absolute -bottom-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-(--blue)/35 blur-[70px]" />
                <motion.span
                  className="absolute -right-3 top-4 select-none font-(family-name:--display) text-[9rem] font-extrabold leading-none tracking-tighter text-transparent"
                  style={{ x: markX, WebkitTextStroke: '1px rgba(255,255,255,0.10)' }}
                >
                  {FIRST[0]}
                  {LAST[0]}
                </motion.span>
              </motion.div>

              <motion.div
                className="absolute -bottom-3 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl"
                style={{ scaleX: shadowScale, opacity: shadowOpacity, z: 20 }}
              />

              {imgOk ? (
                <motion.img
                  src={PHOTO}
                  alt={`${FIRST} ${LAST}`}
                  onError={() => setImgOk(false)}
                  draggable={false}
                  className="absolute bottom-0 left-0 h-[100%] w-full object-contain object-bottom"
                  style={{
                    y: photoY,
                    scale: photoScale,
                    rotate: photoRot,
                    z: 70,
                    transformOrigin: '50% 100%',
                    filter: 'drop-shadow(0 24px 28px rgba(0,0,0,0.55))',
                    WebkitMaskImage: 'linear-gradient(to bottom, #000 88%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, #000 88%, transparent 100%)',
                  }}
                />
              ) : (
                <div className="absolute bottom-0 grid h-[78%] w-full place-items-center font-(family-name:--display) text-7xl font-extrabold text-cyan-300">
                  {FIRST[0]}
                  {LAST[0]}
                </div>
              )}
            </>
          )}
        </motion.div>
      </motion.div>

      {/* ───────── Text (right on desktop) ───────── */}
      <div className="lg:order-2">
        <motion.p {...rise(0.12)} className="font-mono text-base text-(--muted)">
          Hi, I'm
        </motion.p>

        <motion.h1
          {...rise(0.2)}
          aria-label={`${FIRST} ${LAST}`}
          className="mt-2 font-(family-name:--display) text-6xl font-extrabold leading-[0.95] tracking-tighter text-white sm:text-7xl lg:text-8xl"
        >
          {FIRST}{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-(--blue) via-sky-400 to-cyan-300 bg-clip-text text-transparent">
              {LAST}
            </span>
            <svg
              viewBox="0 0 200 14"
              preserveAspectRatio="none"
              className="absolute -bottom-3 left-0 h-3 w-full"
              aria-hidden="true"
            >
              <motion.path
                d="M2 9 C 40 2, 70 14, 100 7 S 160 2, 198 8"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="3"
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
              />
            </svg>
          </span>
        </motion.h1>


        {/* role pill: switches every 2 seconds */}
        <motion.div {...rise(0.3)} className="mt-8">
          <span className="inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2 font-mono text-sm text-cyan-300 sm:text-base">
            <span className="size-1.5 rounded-full bg-cyan-300" />
            <span className="relative inline-flex h-6 items-center" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={role}
                  initial={reduce ? false : { y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: -16, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block"
                >
                  {ROLES[role]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </motion.div>

        <motion.p
          {...rise(0.4)}
          className="mt-7 max-w-xl text-lg leading-relaxed text-(--muted)"
        >
          I build secure, responsive, and high-performance web applications
          using React.js, Node.js, Express.js, and MongoDB, turning real-world
          ideas into reliable digital solutions.
        </motion.p>

        <motion.div {...rise(0.5)} className="mt-9 flex flex-wrap items-center gap-4">
          <button
            onClick={() => go('projects')}
            className="group relative flex items-center gap-2 overflow-hidden rounded-full p-[1.5px] bg-gradient-to-r from-(--blue) to-indigo-500 px-7 py-4 font-semibold text-white shadow-xl shadow-(--blue)/40 transition-transform hover:-translate-y-0.5"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">See my work</span>
            <FiArrowUpRight className="relative transition-transform duration-300 group-hover:rotate-45" />
          </button>
          <button
            onClick={() => go('contact')}
            className="rounded-full p-[1.5px] border border-white/15 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-300"
          >
            Let's talk
          </button>
        </motion.div>
      </div>
    </section>
  )
}