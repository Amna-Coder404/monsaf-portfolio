import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiDroplet } from 'react-icons/fi'

const SWATCHES = [
    { name: 'Blue', color: '#2f5bff' },
    { name: 'Violet', color: '#7c3aed' },
    { name: 'Cyan', color: '#06b6d4' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Amber', color: '#f59e0b' },
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
            // Cleanup: remove the listeners when the picker closes or the component unmounts.
            // React doesn't remove document/window listeners, so without this they pile up (memory leak)
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
                            className="fixed z-[60] max-w-[calc(100vw-1.5rem)] rounded-3xl border border-white/10 bg-[#05060f]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl"
                        >
                            <p className="mb-3 text-xs font-semibold text-(--muted)">Pick a vibe</p>
                            <div className="flex flex-wrap gap-2.5">
                                {SWATCHES.map((s) => (
                                    <motion.button
                                        key={s.color}
                                        type="button"
                                        aria-label={s.name}
                                        title={s.name}
                                        onClick={() => pick(s.color)}
                                        whileTap={{ scale: 0.85 }}
                                        style={{ background: s.color }}
                                        className={`size-9 touch-manipulation rounded-full ring-offset-2 ring-offset-[#05060f] transition-shadow ${color === s.color ? 'ring-2 ring-white' : 'ring-0'
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    )
}