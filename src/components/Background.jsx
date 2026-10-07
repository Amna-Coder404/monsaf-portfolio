import { useEffect, useMemo } from 'react'
import {
    motion,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
} from 'framer-motion'

/* ─────────────────────────────────────────────────────────────
   CALM PROFESSIONAL BACKGROUND

   • three soft light fields (teal and blue) that drift very slowly
   • a fine grid with light pulses travelling along its lines
   • two thin orbit rings with a small light circling each
   • a soft light sweep that glides across every so often
   • a few tiny motes of light rising very slowly
   • a touch of film grain so the gradients feel rich, not flat
   • mouse and scroll only nudge things a few pixels, gently
   • nothing flashes, nothing flies, text stays easy to read

   Colors come from your theme (#007185, navy, #eef2ff).
   ───────────────────────────────────────────────────────────── */

const ACCENT = '#007185'
const BG = '#03040a'

const GRAIN =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

// light pulses that run along the grid lines (positions are multiples of the 64px grid)
const H_PULSES = [
    { k: 3, dur: 14, delay: -2 },
    { k: 6, dur: 18, delay: -11 },
    { k: 9, dur: 12, delay: -5 },
    { k: 12, dur: 16, delay: -8 },
]
const V_PULSES = [
    { k: 10, dur: 15, delay: -4 },
    { k: 14, dur: 19, delay: -13 },
    { k: 17, dur: 13, delay: -7 },
    { k: 20, dur: 17, delay: -1 },
]

const seeded = (seed) => () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
}

export default function Background() {
    const reduce = useReducedMotion()
    const motes = useMemo(() => {
        const r = seeded(42)
        return Array.from({ length: 26 }, () => ({
            left: 36 + r() * 62,
            top: 8 + r() * 86,
            size: 2 + r() * 2.5,
            dur: 14 + r() * 14,
            delay: -r() * 28,
            rise: 70 + r() * 90,
        }))
    }, [])

    // very soft mouse + scroll movement
    const mx = useSpring(useMotionValue(0), { stiffness: 22, damping: 20 })
    const my = useSpring(useMotionValue(0), { stiffness: 22, damping: 20 })
    const { scrollY } = useScroll()
    const smooth = useSpring(scrollY, { stiffness: 40, damping: 24 })

    const aX = useTransform(mx, [-1, 1], [-18, 18])
    const aY = useTransform([my, smooth], ([m, s]) => m * -12 - s * 0.04)
    const bX = useTransform(mx, [-1, 1], [26, -26])
    const bY = useTransform([my, smooth], ([m, s]) => m * 16 - s * 0.08)
    const gridY = useTransform(smooth, (v) => -v * 0.03)

    useEffect(() => {
        const root = document.documentElement.style
        root.setProperty('--accent', ACCENT)
        root.setProperty('--bg', BG)
        if (reduce) return
        const onMove = (e) => {
            mx.set((e.clientX / window.innerWidth - 0.5) * 2)
            my.set((e.clientY / window.innerHeight - 0.5) * 2)
        }
        window.addEventListener('mousemove', onMove, { passive: true })
        return () => window.removeEventListener('mousemove', onMove)
    }, [reduce, mx, my])

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
            style={{ background: BG }}
        >
            <style>{`
                @keyframes cb-a { from { transform: translate3d(0,0,0) scale(1); }    to { transform: translate3d(-5%, 4%, 0) scale(1.1); } }
                @keyframes cb-b { from { transform: translate3d(0,0,0) scale(1.05); } to { transform: translate3d(6%, -4%, 0) scale(0.95); } }
                @keyframes cb-c { from { transform: translate3d(0,0,0) scale(1); }    to { transform: translate3d(-4%, -5%, 0) scale(1.12); } }
                .cb-a { animation: cb-a 48s ease-in-out infinite alternate; }
                .cb-b { animation: cb-b 60s ease-in-out infinite alternate; }
                .cb-c { animation: cb-c 72s ease-in-out infinite alternate; }
                @keyframes cb-hpulse { from { transform: translateX(-240px); } to { transform: translateX(130vw); } }
                @keyframes cb-vpulse { from { transform: translateY(-240px); } to { transform: translateY(130vh); } }
                @keyframes cb-sweep { 0% { transform: translateX(-80%); opacity: 0; } 12% { opacity: 1; } 55% { opacity: 1; } 70%, 100% { transform: translateX(70%); opacity: 0; } }
                @keyframes cb-mote { 0% { transform: translateY(0); opacity: 0; } 20% { opacity: .8; } 80% { opacity: .8; } 100% { transform: translateY(calc(var(--rise) * -1px)); opacity: 0; } }
                @keyframes cb-spin { to { transform: rotate(360deg); } }
                @keyframes cb-spin-rev { to { transform: rotate(-360deg); } }
                .cb-hpulse { animation: cb-hpulse var(--dur) linear var(--delay) infinite; }
                .cb-vpulse { animation: cb-vpulse var(--dur) linear var(--delay) infinite; }
                .cb-sweep { animation: cb-sweep 20s ease-in-out infinite; }
                .cb-mote { animation: cb-mote var(--dur) ease-in-out var(--delay) infinite; }
                .cb-spin { animation: cb-spin 70s linear infinite; }
                .cb-spin-rev { animation: cb-spin-rev 110s linear infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .cb-a, .cb-b, .cb-c, .cb-hpulse, .cb-vpulse, .cb-sweep, .cb-mote, .cb-spin, .cb-spin-rev { animation: none !important; }
                    .cb-hpulse, .cb-vpulse { display: none; }
                }
            `}</style>

            {/* light fields */}
            <motion.div className="absolute inset-[-8%]" style={{ x: aX, y: aY }}>
                <div
                    className="cb-a absolute"
                    style={{
                        right: '-8%', top: '-10%', width: '70vw', height: '70vw',
                        background:
                            'radial-gradient(circle, rgba(0,113,133,0.42) 0%, rgba(0,113,133,0.14) 38%, transparent 66%)',
                    }}
                />
                <div
                    className="cb-c absolute"
                    style={{
                        right: '22%', bottom: '-22%', width: '58vw', height: '58vw',
                        background:
                            'radial-gradient(circle, rgba(37,70,200,0.30) 0%, rgba(37,70,200,0.09) 40%, transparent 66%)',
                    }}
                />
            </motion.div>
            <motion.div className="absolute inset-[-8%]" style={{ x: bX, y: bY }}>
                <div
                    className="cb-b absolute"
                    style={{
                        right: '4%', top: '34%', width: '34vw', height: '34vw',
                        background:
                            'radial-gradient(circle, rgba(64,190,214,0.16) 0%, transparent 65%)',
                    }}
                />
            </motion.div>

            {/* fine grid */}
            <motion.div
                className="absolute inset-[-6%]"
                style={{
                    y: gridY,
                    backgroundImage:
                        'linear-gradient(rgba(140,150,196,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(140,150,196,0.055) 1px, transparent 1px)',
                    backgroundSize: '64px 64px',
                    WebkitMaskImage: 'radial-gradient(ellipse at 70% 45%, #000 0%, transparent 72%)',
                    maskImage: 'radial-gradient(ellipse at 70% 45%, #000 0%, transparent 72%)',
                }}
            >
                {H_PULSES.map((p, i) => (
                    <div
                        key={'h' + i}
                        className="cb-hpulse absolute left-0"
                        style={{
                            top: p.k * 64,
                            width: 220,
                            height: 1,
                            '--dur': `${p.dur}s`,
                            '--delay': `${p.delay}s`,
                            background: 'linear-gradient(90deg, transparent, rgba(64,190,214,0.9), transparent)',
                        }}
                    />
                ))}
                {V_PULSES.map((p, i) => (
                    <div
                        key={'v' + i}
                        className="cb-vpulse absolute top-0"
                        style={{
                            left: p.k * 64,
                            width: 1,
                            height: 220,
                            '--dur': `${p.dur}s`,
                            '--delay': `${p.delay}s`,
                            background: 'linear-gradient(180deg, transparent, rgba(64,190,214,0.9), transparent)',
                        }}
                    />
                ))}
            </motion.div>

            {/* orbit rings */}
            <div
                className="absolute"
                style={{ right: '8vw', top: '50%', width: 'min(46vw, 640px)', aspectRatio: '1', marginTop: 'calc(min(46vw, 640px) / -2)' }}
            >
                <div className="cb-spin absolute inset-0">
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{ border: '1px solid rgba(140,150,196,0.14)' }}
                    />
                    <span
                        className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ background: '#40bed6', boxShadow: '0 0 14px 3px rgba(64,190,214,0.7)' }}
                    />
                </div>
                <div className="cb-spin-rev absolute inset-[14%]">
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{ border: '1px dashed rgba(140,150,196,0.16)' }}
                    />
                    <span
                        className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full"
                        style={{ background: '#eef2ff', boxShadow: '0 0 12px 2px rgba(238,242,255,0.55)' }}
                    />
                </div>
            </div>

            {/* light sweep */}
            <div
                className="cb-sweep absolute right-0 top-0 h-full w-[70%]"
                style={{
                    background:
                        'linear-gradient(105deg, transparent 38%, rgba(64,190,214,0.07) 50%, transparent 62%)',
                }}
            />

            {/* rising motes */}
            {motes.map((m, i) => (
                <span
                    key={i}
                    className="cb-mote absolute rounded-full"
                    style={{
                        left: `${m.left}%`,
                        top: `${m.top}%`,
                        width: m.size,
                        height: m.size,
                        '--dur': `${m.dur}s`,
                        '--delay': `${m.delay}s`,
                        '--rise': m.rise,
                        background: i % 3 === 0 ? '#eef2ff' : '#40bed6',
                        boxShadow: '0 0 8px 1px rgba(64,190,214,0.45)',
                    }}
                />
            ))}

            {/* film grain */}
            <div
                className="absolute inset-0"
                style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px', opacity: 0.07 }}
            />

            {/* keeps the text side calm and readable */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'linear-gradient(to right, rgba(3,4,10,0.8) 0%, rgba(3,4,10,0.4) 40%, transparent 70%)',
                }}
            />
            <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(3,4,10,0.75) 100%)' }}
            />
        </div>
    )
}