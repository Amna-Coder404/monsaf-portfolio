import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SKILLS, LEVELS } from '../data'

export default function Skills() {
  const [active, setActive] = useState({ ...SKILLS[0].items[0], group: SKILLS[0].group })

  return (
    <section id="skills" className="wrap relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7aa2ff]">Skills</p>
        <h2 className="h2 mt-2">What I work with</h2>
      </motion.div>

      {/* Detail panel */}
      <div className="mt-10 min-h-36">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.name}
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-5 sm:flex-row sm:items-center"
          >
            <motion.span
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="grid size-20 shrink-0 place-items-center rounded-3xl bg-(--blue) text-4xl text-white shadow-lg shadow-(--blue)/40"
            >
              <active.icon />
            </motion.span>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-(--muted)">{active.group}</p>
              <h3 className="font-(family-name:--display) text-3xl font-bold">{active.name}</h3>
              <p className="mt-1 max-w-xl text-(--muted)">{active.text}</p>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-1.5 w-40 overflow-hidden rounded-full bg-(--line)">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(active.level / 3) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full rounded-full bg-linear-to-r from-(--blue) to-[#5b8cff]"
                  />
                </div>
                <span className="text-sm font-semibold text-[#7aa2ff]">{LEVELS[active.level]}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Marquee rows */}
      <div className="mt-10 flex flex-col gap-8">
        {SKILLS.map((g, gi) => {
          const loop = [...g.items, ...g.items, ...g.items, ...g.items]
          return (
            <motion.div
              key={g.group}
              initial={{ opacity: 0, x: gi % 2 ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: 'spring', stiffness: 90, damping: 18 }}
            >
              <h3 className="mb-4 font-(family-name:--display) text-lg font-bold text-(--muted)">
                {g.group}
              </h3>

              <div className="marquee-wrap overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className={`marquee-track flex w-max gap-4 ${gi % 2 ? 'reverse' : ''}`}>
                  {loop.map((s, i) => {
                    const on = active.name === s.name
                    return (
                      <button
                        key={`${s.name}-${i}`}
                        onMouseEnter={() => setActive({ ...s, group: g.group })}
                        onClick={() => setActive({ ...s, group: g.group })}
                        className={`flex shrink-0 items-center gap-3 rounded-full border px-6 py-3.5 text-lg font-semibold transition-colors duration-300 ${on
                            ? 'border-(--blue) bg-(--blue) text-white shadow-lg shadow-(--blue)/40'
                            : 'border-(--line) bg-(--fog) hover:border-(--blue)/60'
                          }`}
                      >
                        <s.icon className={on ? 'text-white' : 'text-[#7aa2ff]'} />
                        {s.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}