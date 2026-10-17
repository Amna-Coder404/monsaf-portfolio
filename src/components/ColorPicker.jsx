import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiDroplet, FiSun, FiMoon } from 'react-icons/fi'

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
    const [theme, setTheme] = useState('dark')
    const [pos, setPos] = useState({ top: 0, right: 12 })

    const btnRef = useRef(null)
    const popRef = useRef(null)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        document.documentElement.style.setProperty('--blue', color)
    }, [theme, color])

    const toggle = () => {
        if (!open) {
            const r = btnRef.current.getBoundingClientRect()
            setPos({
                top: r.bottom + 12,
                right: Math.max(12, window.innerWidth - r.right),
            })
            onOpen?.()
        }
        setOpen(!open)
    }

    const pick = (c) => setColor(c)

    useEffect(() => {
        if (!open) return

        const close = () => setOpen(false)
        const onDown = (e) => {
            if (
                btnRef.current?.contains(e.target) ||
                popRef.current?.contains(e.target)
            ) return
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

    const isDark = theme === 'dark'

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={toggle}
                aria-label="Open appearance settings"
                aria-expanded={open}
                className="grid size-10 place-items-center rounded-full border border-(--line) bg-(--surface) text-lg transition-colors hover:opacity-80"
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
                            className={`fixed z-[60] w-64 max-w-[calc(100vw-1.5rem)] rounded-3xl border p-4 shadow-2xl backdrop-blur-xl ${isDark
                                    ? 'border-white/10 bg-[#04080c] text-white shadow-black/60'
                                    : 'border-gray-200 bg-white text-gray-900 shadow-gray-300/60'
                                }`}
                        >
                            <p className={`mb-3 text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                Appearance
                            </p>

                            <div className="mb-4 grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setTheme('light')}
                                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${!isDark
                                            ? 'border-(--blue) bg-(--blue)/10'
                                            : 'border-white/10 hover:bg-white/5'
                                        }`}
                                >
                                    <FiSun /> Light
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setTheme('dark')}
                                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm transition-colors ${isDark
                                            ? 'border-(--blue) bg-(--blue)/10'
                                            : 'border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    <FiMoon /> Dark
                                </button>
                            </div>

                            <p className={`mb-3 text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                Accent color
                            </p>

                            <div className="grid grid-cols-3 gap-2">
                                {SWATCHES.map((s) => {
                                    const active = color === s.color

                                    return (
                                        <motion.button
                                            key={s.color}
                                            type="button"
                                            aria-label={s.name}
                                            aria-pressed={active}
                                            onClick={() => pick(s.color)}
                                            whileTap={{ scale: 0.92 }}
                                            className={`flex touch-manipulation items-center justify-center rounded-2xl border p-2 transition-colors ${active
                                                    ? 'border-(--blue)'
                                                    : isDark
                                                        ? 'border-white/10 hover:bg-white/5'
                                                        : 'border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span
                                                style={{
                                                    background: s.color,
                                                    boxShadow: `0 0 14px ${s.color}66`,
                                                }}
                                                className="grid size-8 place-items-center rounded-full text-white"
                                            >
                                                {active && <FiCheck />}
                                            </span>
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