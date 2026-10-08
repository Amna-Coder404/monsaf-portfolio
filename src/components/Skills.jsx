import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SKILLS, LEVELS } from '../data'

const ease = [0.22, 1, 0.36, 1]
const SHOW_MS = 3500 // time each skill stays on screen

// flat list of every skill, in order, with its group + group start index
const FLAT = SKILLS.flatMap((g, gi) => g.items.map((s) => ({ ...s, group: g.group, gi })))
const STARTS = SKILLS.map((_, gi) => FLAT.findIndex((s) => s.gi === gi))

export default function Skills() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const current = FLAT[index]
  const group = SKILLS[current.gi]
  const next = () => setIndex((i) => (i + 1) % FLAT.length)

  return (
    <section id="skills" className="wrap relative">
      {/* progress animation (also drives the auto-advance) */}
      <style>{`@keyframes skillFill { from { transform: scaleX(0) } to { transform: scaleX(1) } }`}</style>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease }}
        className="max-w-xl"
      >
        <h2 className="h2">What I work with</h2>
        <p className="mt-3 text-(--muted)">
          The tools I use to design, build and ship applications.
        </p>
      </motion.div>

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="mt-10 grid items-stretch gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-14"
      >
        {/* LEFT: groups + skill list */}
        <div>
          <div className="flex flex-wrap gap-x-7 gap-y-2 border-b border-white/10">
            {SKILLS.map((g, gi) => (
              <button
                key={g.group}
                onClick={() => setIndex(STARTS[gi])}
                className="relative pb-3 text-sm font-semibold"
              >
                <span className={`transition-colors ${current.gi === gi ? 'text-white' : 'text-(--muted) hover:text-white'}`}>
                  {g.group}
                </span>
                {current.gi === gi && (
                  <motion.span
                    layoutId="skill-underline"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-(--blue)"
                  />
                )}
              </button>
            ))}
          </div>

          <ul className="mt-3 list-none">
            {group.items.map((s, n) => {
              const flatIndex = STARTS[current.gi] + n
              const active = flatIndex === index
              return (
                <li key={s.name}>
                  <button
                    onClick={() => setIndex(flatIndex)}
                    className={`relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-3 text-left transition-colors duration-300 ${active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                      }`}
                  >
                    <s.icon className={`text-lg transition-colors ${active ? 'text-(--blue)' : 'text-(--muted)'}`} />
                    <span className={`flex-1 font-medium transition-colors ${active ? 'text-white' : 'text-(--muted)'}`}>
                      {s.name}
                    </span>
                    <span className="text-xs text-(--muted)">{LEVELS[s.level]}</span>

                    {/* timer line on the active skill; when it ends, the next skill shows */}
                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
                        <span
                          key={index}
                          onAnimationEnd={next}
                          className="block h-full origin-left bg-(--blue)"
                          style={{
                            animation: `skillFill ${SHOW_MS}ms linear forwards`,
                            animationPlayState: paused ? 'paused' : 'running',
                          }}
                        />
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* RIGHT: presentation of the active skill */}
        <div className="relative flex min-h-[320px] flex-col justify-between border-white/10 lg:border-l lg:pl-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease }}
            >
              <span className="grid size-16 place-items-center rounded-xl bg-(--blue)/10 text-3xl text-(--blue)">
                <current.icon />
              </span>

              <p className="mt-6 text-sm text-(--muted)">{current.group}</p>
              <h3 className="mt-1 font-(family-name:--display) text-3xl font-semibold sm:text-4xl">
                {current.name}
              </h3>

              <p className="mt-4 max-w-md leading-relaxed text-(--muted)">{current.text}</p>

              {/* level */}
              <div className="mt-6 max-w-xs">
                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-[#7aa2ff]">{LEVELS[current.level]}</span>
                  <span className="text-(--muted)">{current.level} / 3</span>
                </div>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((n) => (
                    <span key={n} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.span
                        initial={{ width: '0%' }}
                        animate={{ width: n < current.level ? '100%' : '0%' }}
                        transition={{ duration: 0.6, ease, delay: 0.15 + n * 0.1 }}
                        className="block h-full rounded-full bg-(--blue)"
                      />
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* counter + dots */}
          <div className="mt-8 flex items-center justify-between text-sm text-(--muted)">
            <span>
              {String(index + 1).padStart(2, '0')} / {String(FLAT.length).padStart(2, '0')}
            </span>
            <span className="text-xs">{paused ? 'Paused' : 'Auto playing'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}