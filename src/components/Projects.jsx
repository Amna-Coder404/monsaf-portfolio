import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

import { fetchProjects } from '../lib/projects'

import ProjectCard from './ProjectCard'

export default function Projects() {
  const [projects, setProjects] = useState(null)
  const [error, setError] = useState('')
  const [type, setType] = useState('all')
  const [tag, setTag] = useState(null)

  // ───── horizontal scroller state ─────
  const scroller = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })
  const raw = useMotionValue(0)
  const progress = useSpring(raw, { stiffness: 120, damping: 24 })

  useEffect(() => {
    fetchProjects().then(setProjects).catch((e) => setError(e.message))
  }, [])

  const types = useMemo(() => {
    const all = projects || []
    const t = [{ id: 'all', label: 'All', count: all.length }]
    for (const id of ['mobile', 'web']) {
      const count = all.filter((p) => p.type === id).length
      if (count) t.push({ id, label: id === 'mobile' ? 'Mobile' : 'Web', count })
    }
    return t
  }, [projects])

  const tags = useMemo(() => {
    const map = new Map()
      ; (projects || [])
        .filter((p) => type === 'all' || p.type === type)
        .forEach((p) => (p.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1)))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [projects, type])

  const list = (projects || []).filter(
    (p) => (type === 'all' || p.type === type) && (!tag || (p.tags || []).includes(tag))
  )

  const pickType = (id) => {
    setType(id)
    setTag(null)
  }

  // ───── scroll helpers ─────
  const measure = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    raw.set(max > 0 ? el.scrollLeft / max : 0)
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < max - 4)
  }, [raw])

  // filter badle to scroll shuru par wapas
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ left: 0 })
    measure()
    const t = setTimeout(measure, 450)
    return () => clearTimeout(t)
  }, [type, tag, projects, measure])

  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const by = (dir) => {
    const el = scroller.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  // mouse se drag karke scroll
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || !scroller.current) return
    drag.current = { down: true, x: e.clientX, left: scroller.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.down) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      setDragging(true)
    }
    if (d.moved) scroller.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    drag.current.down = false
    setDragging(false)
    setTimeout(() => { drag.current.moved = false }, 0)
  }
  // drag ke baad galti se link na khul jaye
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const arrow =
    'grid size-11 place-items-center rounded-full border border-(--line) bg-(--paper)/80 text-lg backdrop-blur transition-all hover:border-(--blue) hover:bg-(--blue) hover:text-white disabled:pointer-events-none disabled:opacity-30'

  return (
    <section id="projects" className="wrap relative">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <motion.h2
          className="h2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Projects
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex rounded-full border border-(--line) bg-(--paper)/80 p-1 backdrop-blur"
          role="tablist"
        >
          {types.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={type === f.id}
              onClick={() => pickType(f.id)}
              className={`relative rounded-full px-5 py-2.5 font-semibold transition-colors ${type === f.id ? 'text-white' : 'text-(--muted) hover:text-white'
                }`}
            >
              {type === f.id && (
                <motion.span
                  layoutId="pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-(--blue) shadow-lg shadow-(--blue)/40"
                />
              )}
              <span className="relative flex items-center gap-2">
                {f.label}
                <span className="text-xs opacity-60">{f.count}</span>
              </span>
            </button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {tags.length > 0 && (
          <motion.div
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 flex flex-wrap gap-2 overflow-hidden"
          >
            <AnimatePresence mode="popLayout">
              {tags.map(([t, count]) => (
                <motion.button
                  key={t}
                  layout
                  initial={{ opacity: 0, scale: 0.7, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setTag(tag === t ? null : t)}
                  className={`rounded-full border px-3.5 py-1 text-sm font-medium transition-colors ${tag === t
                      ? 'border-(--blue) bg-(--blue) text-white'
                      : 'border-(--line) bg-(--paper)/80 text-(--muted) hover:border-(--blue) hover:text-white'
                    }`}
                >
                  {t} <span className="opacity-60">{count}</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-(--muted)">Could not load projects: {error}</p>}

      {/* Loading skeleton (row) */}
      {!projects && !error && (
        <div className="flex gap-6 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-96 w-[300px] shrink-0 animate-pulse rounded-[28px] bg-white/5 sm:w-[340px]" />
          ))}
        </div>
      )}

      {projects && (
        <>
          {/* count + arrows */}
          <div className="mb-4 flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm font-semibold text-(--muted)">
              <span className="text-white">{list.length}</span>
              {list.length === 1 ? 'project' : 'projects'}
              {list.length > 1 && (
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  className="ml-1 hidden items-center gap-1 text-(--blue) sm:flex"
                >
                  scroll <FiArrowRight />
                </motion.span>
              )}
            </p>

            <div className="flex gap-2">
              <button className={arrow} onClick={() => by(-1)} disabled={!canLeft} aria-label="Scroll left">
                <FiArrowLeft />
              </button>
              <button className={arrow} onClick={() => by(1)} disabled={!canRight} aria-label="Scroll right">
                <FiArrowRight />
              </button>
            </div>
          </div>

          {/* horizontal scroller */}
          <div
            ref={scroller}
            onScroll={measure}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            onClickCapture={onClickCapture}
            onDragStart={(e) => e.preventDefault()}
            className={`-mx-3 -my-4 flex gap-6 overflow-x-auto px-3 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${dragging ? 'cursor-grabbing select-none' : 'snap-x snap-mandatory'
              }`}
          >
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} onTag={setTag} />
              ))}
            </AnimatePresence>
          </div>

          {/* progress bar */}
          {list.length > 1 && (
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-(--line)">
              <motion.div
                style={{ scaleX: progress }}
                className="h-full origin-left rounded-full bg-linear-to-r from-(--blue) to-[#7aa2ff] shadow-[0_0_10px] shadow-(--blue)/60"
              />
            </div>
          )}

          {list.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-(--muted)">
              No projects match this filter.
            </motion.p>
          )}
        </>
      )}
    </section>
  )
}