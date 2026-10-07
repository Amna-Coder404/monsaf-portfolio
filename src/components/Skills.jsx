import { forwardRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SKILLS, LEVELS } from '../data'

const SkillCard = forwardRef(function SkillCard({ s, i }, ref) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, delay: i * 0.05 }}
      whileHover={{ y: -6 }}
      onMouseMove={onMove}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-(--blue)/60"
    >
      {/* mouse-follow glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(240px circle at var(--x) var(--y), color-mix(in srgb, var(--blue) 22%, transparent), transparent 70%)',
        }}
      />

      <div className="relative flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-(--blue)/15 text-3xl text-(--blue) transition duration-300 group-hover:-rotate-12 group-hover:scale-110 group-hover:bg-(--blue) group-hover:text-white">
          <s.icon />
        </span>

        <div className="min-w-0">
          <h3 className="font-(family-name:--display) text-xl font-bold">{s.name}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7aa2ff]">
            {LEVELS[s.level]}
          </p>
        </div>
      </div>

      <p className="relative mt-4 text-sm leading-relaxed text-(--muted)">{s.text}</p>

      {/* level segments */}
      <div className="relative mt-5 flex gap-1.5">
        {[0, 1, 2].map((n) => (
          <span key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-(--line)">
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: n < s.level ? '100%' : '0%' }}
              transition={{ duration: 0.5, delay: 0.3 + n * 0.12 }}
              className="block h-full rounded-full bg-linear-to-r from-(--blue) to-[#7aa2ff]"
            />
          </span>
        ))}
      </div>
    </motion.div>
  )
})

export default function Skills() {
  const [tab, setTab] = useState(0)
  const group = SKILLS[tab]

  return (
    <section id="skills" className="wrap relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7aa2ff]">Skills</p>
        <h2 className="h2 mt-2">What I work with</h2>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
        className="mx-auto mt-10 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md"
      >
        {SKILLS.map((g, i) => (
          <button
            key={g.group}
            onClick={() => setTab(i)}
            className="relative rounded-full px-5 py-2.5 text-sm font-semibold sm:px-6"
          >
            {tab === i && (
              <motion.span
                layoutId="skill-pill"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="absolute inset-0 rounded-full bg-(--blue) shadow-lg shadow-(--blue)/40"
              />
            )}
            <span className={`relative transition-colors ${tab === i ? 'text-white' : 'text-(--muted)'}`}>
              {g.group}
              <span className="ml-2 text-xs opacity-70">{g.items.length}</span>
            </span>
          </button>
        ))}
      </motion.div>

      {/* Cards */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {group.items.map((s, i) => (
            <SkillCard key={`${group.group}-${s.name}`} s={s} i={i} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}