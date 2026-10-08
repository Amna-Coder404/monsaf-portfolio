import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
    FiArrowUpRight,
    FiCheckCircle,
    FiDatabase,
    FiLayout,
    FiLink,
    FiMonitor,
    FiServer,
    FiSmartphone,
} from 'react-icons/fi'

const SERVICES = [
    {
        icon: FiMonitor,
        title: 'Web Apps',
        text: 'Complete MERN stack apps built from your requirements: clean code, fast pages and features that work the way users expect.',
        tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    },
    {
        icon: FiSmartphone,
        title: 'Mobile Apps',
        text: 'Cross-platform apps for Android and iOS from one codebase: smooth screens, native feel and a backend that connects to your data.',
        tags: ['React Native', 'Expo', 'Android & iOS'],
    },
    {
        icon: FiLayout,
        title: 'Responsive Design',
        text: 'Interfaces that feel right on phones, tablets and desktops.',
        tags: ['Tailwind CSS', 'Framer Motion'],
    },
    {
        icon: FiServer,
        title: 'Backend & APIs',
        text: 'Secure, well-structured servers with clear error handling.',
        tags: ['Node.js', 'Express.js'],
    },
    {
        icon: FiDatabase,
        title: 'Databases',
        text: 'Data models designed so your app stays quick as it grows.',
        tags: ['MongoDB', 'Schema design'],
    },
    {
        icon: FiLink,
        title: 'Integrations',
        text: 'Connect payments, email, maps and third-party services.',
        tags: ['REST', 'Webhooks'],
    },
    {
        icon: FiCheckCircle,
        title: 'Testing',
        text: 'Bugs found by me, not by your users.',
        tags: ['Manual testing', 'QA'],
    },
]

const STEPS = ['Discuss', 'Plan', 'Build', 'Launch']

export default function Services() {
    const [active, setActive] = useState(0)
    const s = SERVICES[active]

    return (
        <section id="services" className="wrap relative overflow-x-clip">
            {/* soft glow that follows the selected service */}
            <motion.div
                aria-hidden
                animate={{ y: active * 28 }}
                transition={{ type: 'spring', stiffness: 60, damping: 18 }}
                className="pointer-events-none absolute right-0 top-10 h-72 w-72 rounded-full bg-(--blue) opacity-20 blur-[110px]"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative mb-10"
            >
                <h2 className="h2 text-balance">How I can help you</h2>
                <p className="mt-3 max-w-xl text-(--muted)">Pick a service to see what you get.</p>
            </motion.div>

            <div className="relative grid gap-6 md:grid-cols-12">
                {/* Selector: chips on mobile, list on desktop */}
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 md:col-span-5 md:mx-0 md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0">
                    {SERVICES.map((item, i) => (
                        <button
                            key={item.title}
                            onClick={() => setActive(i)}
                            onMouseEnter={() => setActive(i)}
                            className="relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left"
                        >
                            {active === i && (
                                <motion.span
                                    layoutId="pill"
                                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                    className="absolute inset-0 rounded-xl border border-(--blue)/40 bg-(--blue)/10"
                                />
                            )}
                            <item.icon
                                className={`relative text-lg transition-colors ${active === i ? 'text-(--blue)' : 'text-(--muted)'}`}
                            />
                            <span
                                className={`relative whitespace-nowrap font-(family-name:--display) font-semibold transition-colors ${active === i ? 'text-white' : 'text-(--muted)'}`}
                            >
                                {item.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Detail card */}
                <div className="md:col-span-7">
                    <div className="relative min-h-[300px] overflow-hidden rounded-3xl border border-(--line) bg-white/[0.03] p-6 sm:p-8">
                        {/* big ghost icon */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`ghost-${active}`}
                                initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
                                animate={{ opacity: 0.07, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                className="pointer-events-none absolute -bottom-6 -right-6 text-[11rem] text-white"
                            >
                                <s.icon />
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.25 }}
                                className="relative"
                            >
                                <h3 className="font-(family-name:--display) text-2xl font-semibold sm:text-3xl">
                                    {s.title}
                                </h3>
                                <p className="mt-3 max-w-md leading-relaxed text-(--muted)">{s.text}</p>

                                <div className="mt-5 flex flex-wrap gap-2">
                                    {s.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border border-(--line) px-3 py-1 text-xs text-[#7aa2ff]"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href="#contact"
                                    className="group mt-7 inline-flex items-center gap-2 rounded-full bg-(--blue) px-5 py-2.5 text-sm font-semibold text-black transition hover:brightness-110"
                                >
                                    Start this project
                                    <FiArrowUpRight className="transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                </a>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Process, one line */}
                    <div className="mt-4 flex items-center justify-between gap-2 px-1 text-sm text-(--muted)">
                        {STEPS.map((step, i) => (
                            <div key={step} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-(--blue)" />
                                {step}
                                {i < STEPS.length - 1 && <span className="ml-2 hidden h-px w-6 bg-(--line) sm:block" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}