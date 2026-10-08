import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const MIN_MS = 2600 // kam az kam itni der dikhega
const MAX_MS = 6000 // is se zyada kabhi nahi rukega

const SPLASH_BG = '#050b2e' // dark blue splash color (keep the same in index.html)
const MONO = "'JetBrains Mono','Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace"
const NAME = 'Monsaf Ali'
const MONOGRAM = 'MA'

// boot log: each line shows when progress reaches `at`
const STEPS = [
    { at: 0, text: 'starting workspace' },
    { at: 22, text: 'loading components' },
    { at: 46, text: 'optimizing assets' },
    { at: 72, text: 'connecting interface' },
    { at: 100, text: 'ready' },
]

// floating code symbols in the background
const TOKENS = [
    { t: '</>', x: '10%', y: '20%', d: 0, s: 'text-3xl' },
    { t: '{ }', x: '82%', y: '26%', d: 0.8, s: 'text-4xl' },
    { t: '[ ]', x: '16%', y: '72%', d: 1.4, s: 'text-2xl' },
    { t: '( )', x: '78%', y: '68%', d: 0.4, s: 'text-3xl' },
    { t: '=>', x: '50%', y: '10%', d: 1.1, s: 'text-2xl' },
    { t: '#', x: '90%', y: '48%', d: 1.8, s: 'text-2xl' },
]

const R = 90
const C = 2 * Math.PI * R // ring circumference

export default function Loader({ onDone }) {
    const [p, setP] = useState(0)
    const [phase, setPhase] = useState('wait') // wait -> ready -> open

    // loading ke dauran scroll band
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        window.scrollTo(0, 0)
        return () => {
            document.body.style.overflow = prev
        }
    }, [])

    useEffect(() => {
        const start = performance.now()
        let loaded = document.readyState === 'complete'
        let raf
        let finished = false
        const timers = []

        const onLoad = () => {
            loaded = true
        }
        window.addEventListener('load', onLoad)

        // page ready: ring completes, then the iris closes and the portfolio shows
        const finish = () => {
            if (finished) return
            finished = true
            setP(100)
            setPhase('ready')
            timers.push(setTimeout(() => setPhase('open'), 550))
            timers.push(setTimeout(onDone, 1450))
        }

        const tick = (now) => {
            const elapsed = now - start
            const t = Math.min(elapsed / MIN_MS, 1)
            const eased = 1 - Math.pow(1 - t, 3)
            // page load na ho to 90% par ruk jao
            const value = Math.min(eased * 100, loaded ? 100 : 90)
            setP(Math.round(value))

            if ((loaded && t >= 1) || elapsed > MAX_MS) return finish()
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)

        return () => {
            cancelAnimationFrame(raf)
            timers.forEach(clearTimeout)
            window.removeEventListener('load', onLoad)
        }
    }, [onDone])

    const open = phase === 'open'
    const ready = p >= 100
    const current = [...STEPS].reverse().find((s) => p >= s.at) || STEPS[0]

    return (
        <motion.div
            role="status"
            aria-label="Loading"
            initial={{ clipPath: 'circle(150% at 50% 50%)' }}
            animate={{ clipPath: open ? 'circle(0% at 50% 50%)' : 'circle(150% at 50% 50%)' }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] overflow-hidden"
            style={{ background: SPLASH_BG }}
        >
            {/* faint grid + breathing glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(140,150,196,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(140,150,196,0.06) 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                    WebkitMaskImage: 'radial-gradient(ellipse at 50% 45%, #000 0%, transparent 70%)',
                    maskImage: 'radial-gradient(ellipse at 50% 45%, #000 0%, transparent 70%)',
                }}
            />
            <motion.div
                className="pointer-events-none absolute left-1/2 top-[42%] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--blue)/30 blur-3xl sm:size-[30rem]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* floating code symbols */}
            {TOKENS.map((k) => (
                <motion.span
                    key={k.t}
                    className={`pointer-events-none absolute select-none text-white/10 ${k.s}`}
                    style={{ left: k.x, top: k.y, fontFamily: MONO }}
                    animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
                    transition={{ duration: 5, delay: k.d, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {k.t}
                </motion.span>
            ))}

            {/* top bar */}
            <div
                className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 text-xs text-(--muted) sm:px-10"
                style={{ fontFamily: MONO }}
            >
                <span>monsaf.dev</span>
                <span className="flex items-center gap-2">
                    <span
                        className="size-1.5 rounded-full"
                        style={{ background: ready ? '#40bed6' : 'var(--blue)', boxShadow: '0 0 10px var(--blue)' }}
                    />
                    {ready ? 'ready' : 'loading'}
                </span>
            </div>

            {/* centre */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
                animate={{ opacity: open ? 0 : 1, scale: open ? 0.92 : 1 }}
                transition={{ duration: 0.4, ease: 'easeIn' }}
            >
                {/* progress ring with monogram */}
                <motion.div
                    className="relative size-56 sm:size-72"
                    animate={{ scale: phase === 'ready' ? [1, 1.07, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* slow dashed outer ring */}
                    <motion.div
                        className="absolute -inset-4 rounded-full border border-dashed border-white/15"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* orbiting dot */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: 'linear' }}
                    >
                        <span
                            className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
                            style={{ boxShadow: '0 0 14px 3px rgba(34,211,238,0.8)' }}
                        />
                    </motion.div>

                    {/* ring */}
                    <svg viewBox="0 0 200 200" className="absolute inset-0 size-full -rotate-90">
                        <defs>
                            <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#4f7bff" />
                                <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                        </defs>
                        <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                        <circle
                            cx="100"
                            cy="100"
                            r={R}
                            fill="none"
                            stroke="url(#ring-grad)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={C}
                            strokeDashoffset={C * (1 - p / 100)}
                            style={{ filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.6))' }}
                        />
                    </svg>

                    {/* monogram + percent */}
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="text-center">
                            <div className="flex justify-center font-(family-name:--display) text-6xl font-extrabold tracking-tighter sm:text-7xl">
                                {MONOGRAM.split('').map((ch, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, y: 24, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: 0.2 + i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        className="inline-block bg-gradient-to-br from-white via-sky-200 to-cyan-300 bg-clip-text text-transparent"
                                    >
                                        {ch}
                                    </motion.span>
                                ))}
                            </div>
                            <p
                                className="mt-1 text-xs tabular-nums text-(--muted) sm:text-sm"
                                style={{ fontFamily: MONO }}
                            >
                                {String(p).padStart(3, '0')}%
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* name */}
                <h1 className="mt-10 flex overflow-hidden pb-1 font-(family-name:--display) text-3xl font-bold tracking-tight text-white sm:text-5xl">
                    {NAME.split('').map((ch, i) => (
                        <motion.span
                            key={i}
                            initial={{ y: '110%' }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.6 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="inline-block whitespace-pre"
                        >
                            {ch}
                        </motion.span>
                    ))}
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="mt-1 text-sm text-(--muted) sm:text-base"
                >
                    Web &amp; Mobile Developer
                </motion.p>

                {/* one live status line */}
                <div
                    className="mt-6 flex h-6 items-center gap-2 text-xs text-cyan-300 sm:text-sm"
                    style={{ fontFamily: MONO }}
                >
                    <span className="text-white/30">&gt;</span>
                    <motion.span
                        key={current.text}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {current.text}
                    </motion.span>
                    {ready ? (
                        <span>✓</span>
                    ) : (
                        <motion.span
                            className="h-4 w-[2px] bg-cyan-300"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                        />
                    )}
                </div>
            </motion.div>

            {/* thin progress line at the bottom */}
            <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
                <div
                    className="h-full bg-gradient-to-r from-(--blue) to-cyan-300 transition-[width] duration-100 ease-linear"
                    style={{ width: `${p}%`, boxShadow: '0 0 12px var(--blue)' }}
                />
            </div>
        </motion.div>
    )
}