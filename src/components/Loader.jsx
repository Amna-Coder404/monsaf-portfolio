import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const MIN_MS = 2600 // kam az kam itni der dikhega
const MAX_MS = 6000 // is se zyada kabhi nahi rukega

const SPLASH_BG = '#050b2e' // dark blue splash color (keep the same in index.html)
const MONO = "'JetBrains Mono','Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace"
const NAME = 'Monsaf Ali'

// boot log: each line appears when progress reaches `at`
const STEPS = [
    { at: 0, text: 'starting workspace' },
    { at: 22, text: 'loading components' },
    { at: 46, text: 'optimizing assets' },
    { at: 72, text: 'connecting interface' },
    { at: 100, text: 'ready' },
]

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

        // page ready: "ready" line shows, curtain opens, then portfolio
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
    const visible = STEPS.filter((s) => p >= s.at)
    const curtain = { duration: 0.85, ease: [0.76, 0, 0.24, 1] }

    return (
        <motion.div
            role="status"
            aria-label="Loading"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-[100] overflow-hidden"
        >
            {/* two curtain halves: they slide apart when loading is done */}
            <motion.div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{ background: SPLASH_BG }}
                animate={{ y: open ? '-100%' : '0%' }}
                transition={curtain}
            />
            <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{ background: SPLASH_BG }}
                animate={{ y: open ? '100%' : '0%' }}
                transition={curtain}
            />

            {/* everything on top of the curtain fades out as it opens */}
            <motion.div
                className="absolute inset-0"
                animate={{ opacity: open ? 0 : 1, scale: open ? 1.03 : 1 }}
                transition={{ duration: 0.4, ease: 'easeIn' }}
            >
                {/* faint grid + glow, same language as the site background */}
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
                <div className="pointer-events-none absolute left-1/2 top-[42%] size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--blue)/25 blur-3xl sm:size-[28rem]" />

                {/* top bar */}
                <div
                    className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 text-xs text-(--muted) sm:px-10"
                    style={{ fontFamily: MONO }}
                >
                    <span>monsaf.dev</span>
                    <span className="flex items-center gap-2">
                        <span
                            className="size-1.5 rounded-full"
                            style={{ background: p >= 100 ? '#40bed6' : 'var(--blue)', boxShadow: '0 0 10px var(--blue)' }}
                        />
                        {p >= 100 ? 'ready' : 'loading'}
                    </span>
                </div>

                {/* centre: name + boot log */}
                <div className="absolute inset-0 grid place-items-center px-6">
                    <div className="w-full max-w-md">
                        <h1 className="flex overflow-hidden pb-1 font-(family-name:--display) text-5xl font-bold tracking-tight text-white sm:text-7xl">
                            {NAME.split('').map((ch, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ y: '110%' }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.15 + i * 0.045, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                    className="inline-block whitespace-pre"
                                >
                                    {ch}
                                </motion.span>
                            ))}
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.5 }}
                            className="mt-2 text-sm text-(--muted) sm:text-base"
                        >
                            Web &amp; Mobile Developer
                        </motion.p>

                        <div
                            className="mt-8 flex min-h-[7.5rem] flex-col gap-1.5 text-xs sm:text-sm"
                            style={{ fontFamily: MONO }}
                        >
                            {visible.map((s, i) => {
                                const done = i < visible.length - 1 || p >= 100
                                return (
                                    <motion.div
                                        key={s.text}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="flex items-center gap-3"
                                        style={{ color: done ? '#c9d2f5' : '#8c96c4' }}
                                    >
                                        <span className="grid w-3 place-items-center">
                                            {done ? (
                                                <span style={{ color: '#40bed6' }}>✓</span>
                                            ) : (
                                                <motion.span
                                                    animate={{ opacity: [1, 0.25, 1] }}
                                                    transition={{ duration: 0.9, repeat: Infinity }}
                                                    className="size-1.5 rounded-full bg-(--blue)"
                                                />
                                            )}
                                        </span>
                                        {s.text}
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* big counter + progress line */}
                <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10 sm:pb-8">
                    <div className="mb-4 flex items-end justify-between">
                        <p className="font-(family-name:--display) text-7xl font-bold leading-none tabular-nums text-white sm:text-9xl">
                            {p}
                            <span className="ml-1 text-3xl text-(--muted) sm:text-5xl">%</span>
                        </p>
                    </div>
                    <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-(--blue) transition-[width] duration-100 ease-linear"
                            style={{ width: `${p}%`, boxShadow: '0 0 12px var(--blue)' }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}