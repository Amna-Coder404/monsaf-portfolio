import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { JOURNEY } from '../data'

const para = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

export default function About() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 24 })

  return (
    <section id="about" className="wrap relative grid items-start gap-14 lg:grid-cols-2">
      <div>
        <motion.h2 className="h2" {...para} transition={{ duration: 0.6 }}>
          Logic and creativity, one project at a time
        </motion.h2>

        <div className="mt-6 space-y-5 text-lg leading-relaxed text-(--muted)">
          <motion.p {...para} transition={{ duration: 0.6, delay: 0.05 }}>
            I'm Amna Ashraf, a passionate web and mobile app developer who enjoys building clean,
            responsive, and user-friendly digital experiences. My journey started around 2022-2023,
            and since then I've kept growing by working on real-world projects and improving my
            problem-solving.
          </motion.p>
          <motion.p {...para} transition={{ duration: 0.6, delay: 0.12 }}>
            Right now I'm working with React for the web and exploring React Native + Expo for
            mobile. Alongside that, I'm learning backend development and modern UI/UX design on my
            way to becoming a Full-Stack Developer.
          </motion.p>
          <motion.p {...para} transition={{ duration: 0.6, delay: 0.19 }}>
            Outside of development I enjoy photography, exploring creative ideas, learning new
            technologies, and spending time with friends.
          </motion.p>
        </div>
      </div>

      <ol ref={ref} className="relative ml-2 list-none pl-9">
        <span className="absolute bottom-0 left-[7px] top-0 w-0.5 rounded-full bg-(--line)" />
        <motion.span
          style={{ scaleY: line }}
          className="absolute bottom-0 left-[7px] top-0 w-0.5 origin-top rounded-full bg-linear-to-b from-(--blue) to-[#7aa2ff]"
        />

        {JOURNEY.map((j, i) => (
          <motion.li
            key={j.title}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.05 }}
            className="group relative pb-10 last:pb-0"
          >
            <motion.span
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: i * 0.05 + 0.1 }}
              className="absolute -left-9 top-1.5 size-4 rounded-full bg-(--blue) ring-4 ring-[#03040a] transition-shadow group-hover:shadow-[0_0_0_6px] group-hover:shadow-(--blue)/30"
            />
            <small className="text-xs font-bold uppercase tracking-wider text-[#7aa2ff]">
              {j.when}
            </small>
            <h3 className="mt-1 font-(family-name:--display) text-xl font-bold">{j.title}</h3>
            <p className="mt-1.5 leading-relaxed text-(--muted)">{j.text}</p>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}