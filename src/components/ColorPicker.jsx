import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiDroplet } from 'react-icons/fi'

const SWATCHES = [
    { name: 'Cyan', color: '#06b6d4' },
    { name: 'Violet', color: '#8b5cf6' },
    { name: 'Pink', color: '#778500' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Orange', color: '#f97316' },
]

export default function ColorPicker({ onOpen }) {
    const [open, setOpen] = useState(false)
    const [color, setColor] = useState(SWATCHES[0].color)
    const [pos, setPos] = useState({ top: 0, right: 12 })
    const btnRef = useRef(null)
    const popRef = useRef(null)

    const toggle = () => {
        if (!open) {
            const r = btnRef.current.getBoundingClientRect()
            setPos({ top: r.bottom + 12, right: Math.max(12, window.innerWidth - r.right) })
            onOpen?.()
        }
        setOpen(!open)
    }

    const pick = (c) => {
        setColor(c)
        document.documentElement.style.setProperty('--blue', c)
    }

    // close on outside tap, Escape, or resize
    useEffect(() => {
        if (!open) return
        const close = () => setOpen(false)
        const onDown = (e) => {
            if (btnRef.current?.contains(e.target) || popRef.current?.contains(e.target)) return
            close()
        }
        const onKey = (e) => e.key === 'Escape' && close()

        document.addEventListener('pointerdown', onDown)
        document.addEventListener('keydown', onKey)
        window.addEventListener('resize', close)
        return () => {
            document.removeEventListener('pointerdown', onDown)
            document.removeEventListener('keydown', onKey)
            window.removeEventListener('resize', close)
        }
    }, [open])

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={toggle}
                aria-label="Change color"
                aria-expanded={open}
                className="grid size-10 place-items-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
            >
                <FiDroplet className="text-(--blue)" />
            </button>

            {createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            ref={popRef}
                            initial={{ opacity: 0, y: -12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.97 }}
                            transition={{ duration: 0.25 }}
                            style={{ top: pos.top, right: pos.right }}
                            className="fixed z-[60] w-64 max-w-[calc(100vw-1.5rem)] rounded-3xl border border-white/10 bg-[#04080c]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl"
                        >
                            <p className="mb-3 text-xs font-semibold text-(--muted)">Pick a vibe</p>
                            <div className="grid grid-cols-3 gap-2">
                                {SWATCHES.map((s) => {
                                    const active = color === s.color
                                    return (
                                        <motion.button
                                            key={s.color}
                                            type="button"
                                            aria-label={s.name}
                                            onClick={() => pick(s.color)}
                                            whileTap={{ scale: 0.92 }}
                                            className={`flex touch-manipulation flex-col items-center gap-1.5 rounded-2xl border p-2 transition-colors ${active
                                                ? 'border-white/40 bg-white/10'
                                                : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                }`}
                                        >
                                            <span
                                                style={{
                                                    background: s.color,
                                                    boxShadow: `0 0 18px ${s.color}99`,
                                                }}
                                                className="grid size-9 place-items-center rounded-full text-white"
                                            >
                                                {active && <FiCheck />}
                                            </span>
                                            {/* <span className="text-[11px] text-white/70">{s.name}</span> */}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}