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
import { FiArrowUpRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'
import { go } from './go'

const FIRST = 'Monsaf'
const LAST = 'Ali'
const PHOTO = '/profile.png'
// 'frame'  -> works with ANY photo (with background, any pose)
// 'cutout' -> only for transparent-background PNGs (person pops out of the card)
const MODE = 'frame'
const ROLES = ['MERN Stack Developer', 'React.js Developer', 'Full-Stack Developer']
const STACK = ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Tailwind CSS']



export default function Hero() {
  const reduce = useReducedMotion()
  const [role, setRole] = useState(0)
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    const r = setInterval(() => setRole((x) => (x + 1) % ROLES.length), 2600)
    return () => clearInterval(r)
  }, [])

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
  const plateY = useTransform(ss, [0, 700], [0, 70 * k])
  const plateRot = useTransform(ss, [0, 700], [-6, -6 - 7 * k])
  const frameY = useTransform(ss, [0, 700], [0, -50 * k])
  const frameImgScale = useTransform(ss, [0, 700], [1.05, 1.05 + 0.18 * k])
  const frameImgY = useTransform(ss, [0, 700], [0, 30 * k])
  const badgeY = useTransform(ss, [0, 700], [0, -100 * k])
  const badgeX = useTransform(ss, [0, 700], [0, -20 * k])

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

  return (
    <section
      id="top"
      className="wrap relative z-10 grid min-h-screen items-center gap-16 pb-20 pt-32 lg:grid-cols-[1.1fr_0.9fr]"
    >
      {/* Background lives in <Background /> (aurora, cursor grid, shapes, grain) */}

      {/* ───────── Left ───────── */}
      <div>
        <motion.span
          {...rise(0.05)}
          className="inline-flex items-center gap-2.5 rounded-full border border-cyan-300/20 bg-cyan-300/5 py-1.5 pl-2 pr-4 text-sm font-medium text-cyan-50/90 backdrop-blur"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300/70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-cyan-300" />
          </span>
          Available for new projects
        </motion.span>

        <motion.p {...rise(0.12)} className="mt-8 font-mono text-base text-(--muted)">
          <span className="text-cyan-300">&lt;</span>hello world
          <span className="text-cyan-300"> /&gt;</span> I'm
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

        <motion.div {...rise(0.3)} className="mt-9 flex items-center gap-3">
          <div className="flex h-11 items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#04080c]/60 px-4 font-mono text-sm backdrop-blur-md sm:text-base">
            <span className="text-cyan-300">~/role</span>
            <span className="text-white/30">$</span>
            <div className="relative h-6 overflow-hidden" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={role}
                  initial={reduce ? false : { y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: -24, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block text-white"
                >
                  {ROLES[role]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="h-5 w-[2px] animate-pulse bg-cyan-300" />
          </div>
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

      {/* ───────── Photo ───────── */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ opacity: wrapOpacity }}
        className="relative grid place-items-center [perspective:1200px]"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <motion.div
          style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative aspect-[4/5] w-[290px] sm:w-[350px] lg:w-[410px]"
        >
          {MODE === 'frame' ? (
            <>
              {/* back plate, tilted, peeks out behind the photo */}
              <motion.div
                className="absolute inset-0 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-(--blue)/45 via-indigo-500/20 to-transparent"
                style={{ y: plateY, rotate: plateRot, x: -18, z: -40 }}
              />

              {/* photo card: any image, graded to match the site */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/15 bg-[#04080c] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)]"
                style={{ y: frameY, z: 30 }}
              >
                {imgOk ? (
                  <motion.img
                    src={PHOTO}
                    alt={`${FIRST} ${LAST}`}
                    onError={() => setImgOk(false)}
                    draggable={false}
                    className="size-full object-cover object-top"
                    style={{
                      scale: frameImgScale,
                      y: frameImgY,
                      filter: 'contrast(1.05) saturate(0.9) brightness(0.95)',
                    }}
                  />
                ) : (
                  <div className="grid size-full place-items-center font-(family-name:--display) text-7xl font-extrabold text-cyan-300">
                    {FIRST[0]}
                    {LAST[0]}
                  </div>
                )}
                {/* colour grade so every photo feels part of the page */}
                <div className="absolute inset-0 bg-(--blue)/25 mix-blend-soft-light" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04080c] via-[#04080c]/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/15 via-transparent to-transparent" />
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
              </motion.div>

              {/* glass name tag floats in front of the photo */}
              <motion.div
                className="absolute -bottom-5 -left-5 rounded-2xl border border-white/15 bg-[#04080c]/60 px-5 py-3.5 backdrop-blur-xl sm:-left-10"
                style={{ y: badgeY, x: badgeX, z: 90 }}
              >
                <p className="font-(family-name:--display) text-lg font-bold leading-tight text-white">
                  {FIRST} {LAST}
                </p>
                <p className="mt-0.5 flex items-center gap-2 font-mono text-xs text-cyan-300">
                  <span className="size-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.7)]" />
                  MERN Stack Developer
                </p>
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
    </section>
  )
}