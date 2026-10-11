import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiChevronDown } from 'react-icons/fi'

/**
 * Accessible dropdown for choosing a project type.
 * Presentational only: it reports the choice through `onChange`
 * and does not know anything about routing.
 *
 * options: [{ id, label, count }]
 */
export default function TypeDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const current = options.find((o) => o.id === value) ?? options[0]

  // Close on outside click or Escape while open.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (id) => {
    setOpen(false)
    if (id !== value) onChange(id)
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-3 rounded-full border border-(--line) bg-(--paper)/80 px-5 py-2.5 font-semibold text-white backdrop-blur transition-colors hover:border-(--blue)"
      >
        <span className="text-xs font-medium uppercase tracking-wider text-(--muted)">Type</span>
        {current?.label}
        <span className="text-xs opacity-60">{current?.count}</span>
        <FiChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-30 mt-2 min-w-52 origin-top-right overflow-hidden rounded-2xl border border-(--line) bg-(--paper) p-1.5 shadow-xl backdrop-blur"
          >
            {options.map((o) => {
              const selected = o.id === value
              return (
                <li key={o.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => select(o.id)}
                    className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-2.5 text-left font-medium transition-colors ${
                      selected
                        ? 'bg-(--blue) text-white'
                        : 'text-(--muted) hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {o.label}
                      <span className="text-xs opacity-60">{o.count}</span>
                    </span>
                    {selected && <FiCheck />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
