import { motion } from 'framer-motion'
import { JOURNEY } from '../data'

const HEADING = 'Building ideas into reliable digital solutions'

const fromRight = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-60px' },
}

function Card({ j, i }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
  }

  return (
    <motion.li
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className="sticky mb-6 last:mb-0"
      style={{ top: 110 + i * 18 }}
    >
      <div
        onMouseMove={onMove}
        className="group relative flex gap-5 overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d18] p-6 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.8)] transition-colors hover:border-(--blue)/60"
      >
        {/* mouse-follow glow (uses your accent colour) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(260px circle at var(--x) var(--y), color-mix(in srgb, var(--blue) 20%, transparent), transparent 70%)',
          }}
        />

        <span className="relative font-(family-name:--display) text-5xl font-extrabold leading-none text-(--blue)/30 transition-colors group-hover:text-(--blue)">
          {String(i + 1).padStart(2, '0')}
        </span>

        <div className="relative">
          <small className="text-xs font-bold uppercase tracking-wider text-[#7aa2ff]">
            {j.when}
          </small>
          <h3 className="mt-1 font-(family-name:--display) text-xl font-bold">
            {j.title}
          </h3>
          <p className="mt-1.5 leading-relaxed text-(--muted)">{j.text}</p>
        </div>
      </div>
    </motion.li>
  )
}

export default function About() {
  return (
    <section
      id="about"
      className="wrap relative grid items-start gap-14 lg:grid-cols-[1.1fr_1fr]"
    >
      {/* LEFT: stacking cards */}
      <ol className="list-none">
        {JOURNEY.map((j, i) => (
          <Card key={j.title} j={j} i={i} />
        ))}
      </ol>

      {/* RIGHT: text (stays fixed while cards scroll) */}
      <div className="lg:sticky lg:top-28">
        <h2 className="h2">
          {HEADING.split(' ').map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="mr-[0.25em] inline-block"
            >
              {w}
            </motion.span>
          ))}
        </h2>

        <div className="mt-6 space-y-5 text-lg leading-relaxed text-(--muted)">
          <motion.p {...fromRight} transition={{ duration: 0.6, delay: 0.1 }}>
            I'm Monsaf Ali, a MERN Stack Developer focused on building
            high-performance, secure, and user-friendly web applications. I
            enjoy turning real-world requirements into clean and practical
            digital solutions.
          </motion.p>

          <motion.p {...fromRight} transition={{ duration: 0.6, delay: 0.18 }}>
            My development journey started around 2022-2023. Since then, I've
            worked with React.js for modern frontend experiences and expanded
            into Node.js, Express.js, and MongoDB to build complete full-stack
            applications.
          </motion.p>

          <motion.p {...fromRight} transition={{ duration: 0.6, delay: 0.26 }}>
            I focus on responsive web design, application development,
            database solutions, API integration, software testing, and
            creating applications that are both reliable and easy to use.
          </motion.p>
        </div>
      </div>
    </section>
  )
}