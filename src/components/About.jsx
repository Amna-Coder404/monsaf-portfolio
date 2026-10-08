import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { JOURNEY } from '../data'

const HEADING = 'Building ideas into reliable digital solutions'

const ease = [0.22, 1, 0.36, 1]

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, ease, delay },
})

function Step({ j, i }) {
  return (
    <motion.li
      {...reveal()}
      className="group relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-8 last:pb-0"
    >
      {/* dot */}
      <span className="relative z-10 mt-1 grid h-6 w-6 place-items-center justify-self-center rounded-full border border-white/20 bg-[#080b14]">
        <span className="h-2 w-2 rounded-full bg-(--blue)" />
      </span>

      {/* content */}
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="font-(family-name:--display) text-lg font-semibold transition-colors duration-300 group-hover:text-(--blue)">
            {j.title}
          </h3>
          <span className="text-sm text-(--muted)">{j.when}</span>
        </div>
        <p className="mt-1.5 max-w-lg leading-relaxed text-(--muted)">{j.text}</p>
      </div>
    </motion.li>
  )
}

function Timeline() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 70%'],
  })
  const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  return (
    <div ref={ref} className="relative">
      {/* track */}
      <span className="absolute bottom-0 left-5 top-2 w-px -translate-x-1/2 bg-white/10" />
      {/* progress */}
      <motion.span
        style={{ scaleY: grow }}
        className="absolute bottom-0 left-5 top-2 w-px origin-top -translate-x-1/2 bg-(--blue)"
      />

      <ol className="list-none">
        {JOURNEY.map((j, i) => (
          <Step key={j.title} j={j} i={i} />
        ))}
      </ol>
    </div>
  )
}

export default function About() {
  return (
    <section
      id="about"
      className="wrap relative grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16"
    >
      {/* LEFT: compact timeline */}
      <Timeline />

      {/* RIGHT: intro text */}
      <div className="lg:sticky lg:top-28">
        <motion.h2 {...reveal()} className="h2 text-balance">
          {HEADING}
        </motion.h2>

        <div className="mt-5 space-y-4 leading-relaxed text-(--muted)">
          <motion.p {...reveal(0.05)}>
            I'm Monsaf Ali, a MERN Stack Developer focused on building
            high-performance, secure, and user-friendly web applications. I
            enjoy turning real-world requirements into clean and practical
            digital solutions.
          </motion.p>

          <motion.p {...reveal(0.1)}>
            My development journey started around 2022-2023. Since then, I've
            worked with React.js for modern frontend experiences and expanded
            into Node.js, Express.js, and MongoDB to build complete full-stack
            applications.
          </motion.p>

          <motion.p {...reveal(0.15)}>
            I focus on responsive web design, application development,
            database solutions, API integration, software testing, and
            creating applications that are both reliable and easy to use.
          </motion.p>
        </div>
      </div>
    </section>
  )
}