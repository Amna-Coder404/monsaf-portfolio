import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaHandPointer } from 'react-icons/fa'

const MIN_MS = 2300 // kam az kam itni der dikhega (hand ko pohanchne ka time)
const MAX_MS = 6000 // is se zyada kabhi nahi rukega

// Want a real hand photo/illustration? Put a transparent PNG in /public (fingertip at top-center)
// and set HAND_IMG = '/hand.png'. Leave it null to use the icon hand.
const SPLASH_BG = '#050b2e' // dark blue splash color (keep the same in index.html)
const OPEN_COLOR = SPLASH_BG // icon khulte waqt poori screen isi colour ki hogi
const ICON_IMG = '/icon.png' // public/icon.png
const HAND_IMG = null
const HAND_SIZE = 76
const TIP_X = HAND_IMG ? HAND_SIZE / 2 : HAND_SIZE * 0.38 // x position of the fingertip

function Hand() {
    const shadow = 'drop-shadow-[0_14px_16px_rgba(0,0,0,0.6)]'
    return HAND_IMG ? (
        <img src={HAND_IMG} alt="" width={HAND_SIZE} draggable="false" className={shadow} />
    ) : (
        <FaHandPointer size={HAND_SIZE} className={`text-[#f6c8a4] ${shadow}`} aria-hidden="true" />
    )
}

export default function Loader({ onDone }) {
    const [p, setP] = useState(0)
    const [phase, setPhase] = useState('wait') // wait -> tap -> open

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

        // page ready: finger tap karta hai, icon khulta hai, phir portfolio
        const finish = () => {
            if (finished) return
            finished = true
            setP(100)
            setPhase('tap')
            timers.push(setTimeout(() => setPhase('open'), 450))
            timers.push(setTimeout(onDone, 1250))
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

    const tapped = phase !== 'wait'
    const open = phase === 'open'

    return (
        <motion.div
            role="status"
            aria-label="Loading"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ background: SPLASH_BG }}
            className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
        >
            {/* soft glow behind the icon */}
            <div className="pointer-events-none absolute size-72 rounded-full bg-(--blue)/25 blur-3xl sm:size-96" />

            <div className="relative flex flex-col items-center">
                {/* app icon */}
                <div className="relative">
                    {/* ripple where the finger lands */}
                    {tapped && (
                        <motion.span
                            initial={{ scale: 1, opacity: 0.7 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-(--blue) sm:rounded-[34px]"
                        />
                    )}

                    <motion.div
                        initial={{ scale: 0, rotate: -12 }}
                        animate={
                            open
                                ? { scale: 40, rotate: 0, backgroundColor: OPEN_COLOR }
                                : tapped
                                    ? { scale: 0.9, rotate: 0 }
                                    : { scale: 1, rotate: 0 }
                        }
                        transition={
                            open
                                ? { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                                : tapped
                                    ? { duration: 0.15 }
                                    : { type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }
                        }
                        className="relative grid size-28 place-items-center overflow-hidden rounded-[28px] bg-(--blue) shadow-[0_20px_60px] shadow-(--blue)/50 sm:size-32 sm:rounded-[34px]"
                    >
                        {/* icon.png */}
                        <motion.img
                            src={ICON_IMG}
                            alt=""
                            draggable="false"
                            animate={{ opacity: open ? 0 : 1 }}
                            transition={{ duration: 0.2 }}
                            className="relative size-full object-cover"
                        />
                        {/* glossy highlight */}
                        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/30 to-transparent" />
                    </motion.div>

                    {/* the hand: travels in from the corner, hovers, then taps */}
                    <motion.div
                        initial={{ x: 140, y: 240, opacity: 0, rotate: 18 }}
                        animate={{ x: 0, y: 0, opacity: open ? 0 : 1, rotate: 0 }}
                        transition={{
                            x: { delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                            y: { delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                            rotate: { delay: 0.8, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                            opacity: open ? { duration: 0.2 } : { delay: 0.8, duration: 0.3 },
                        }}
                        style={{ marginLeft: -TIP_X }}
                        className="pointer-events-none absolute left-1/2 top-1/2 z-10 mt-2"
                    >
                        <motion.div
                            animate={
                                tapped
                                    ? { y: 10, scale: 0.92 }
                                    : { y: [0, -6, 0] }
                            }
                            transition={
                                tapped
                                    ? { duration: 0.15 }
                                    : { delay: 1.8, duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                            }
                            style={{ transformOrigin: `${TIP_X}px 0px` }}
                        >
                            <Hand />
                        </motion.div>
                    </motion.div>
                </div>

                {/* app label + progress, like a phone home screen */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: tapped ? 0 : 1 }}
                    transition={{ delay: tapped ? 0 : 0.4, duration: 0.25 }}
                    className="mt-5 flex flex-col items-center"
                >
                    <p className="font-(family-name:--display) text-lg font-bold text-white">Amna</p>
                    <div className="mt-3 h-1 w-24 overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-(--blue) transition-[width] duration-100 ease-linear"
                            style={{ width: `${p}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs font-semibold tabular-nums text-(--muted)">{p}%</p>
                </motion.div>
            </div>
        </motion.div>
    )
}