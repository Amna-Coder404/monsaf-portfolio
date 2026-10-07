import { motion } from 'framer-motion'
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
        title: 'Web Application Development',
        text: 'Complete MERN stack apps built from your requirements: clean code, fast pages and features that work the way users expect.',
        tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB'],
    },
    {
        icon: FiSmartphone,
        title: 'Mobile App Development',
        text: 'Cross-platform apps for Android and iOS from one codebase: smooth screens, native feel and a backend that connects to your data.',
        tags: ['React Native', 'Expo', 'Android & iOS'],
    },
    {
        icon: FiLayout,
        title: 'Responsive Web Design',
        text: 'Interfaces that feel right on phones, tablets and desktops.',
        tags: ['Tailwind CSS', 'Framer Motion'],
    },
    {
        icon: FiServer,
        title: 'Backend & REST APIs',
        text: 'Secure, well-structured servers with clear error handling.',
        tags: ['Node.js', 'Express.js'],
    },
    {
        icon: FiDatabase,
        title: 'Database Solutions',
        text: 'Data models designed so your app stays quick as it grows.',
        tags: ['MongoDB', 'Schema design'],
    },
    {
        icon: FiLink,
        title: 'API Integration',
        text: 'Connect payments, email, maps and third-party services.',
        tags: ['REST', 'Webhooks'],
    },
    {
        icon: FiCheckCircle,
        title: 'Software Testing',
        text: 'Bugs found by me, not by your users.',
        tags: ['Manual testing', 'QA'],
    },
]

const STEPS = [
    { n: '01', t: 'Discuss', d: 'We talk about your idea and goals.' },
    { n: '02', t: 'Plan', d: 'I outline the features and structure.' },
    { n: '03', t: 'Build', d: 'I code it and share progress.' },
    { n: '04', t: 'Launch', d: 'I test, fix and deploy it.' },
]

function ServiceRow({ s, i }) {
    return (
        <motion.a
            href="#contact"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: (i % 4) * 0.05 }}
            className="group grid items-start gap-4 border-t border-(--line) py-7 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:gap-8 md:px-4"
        >
            {/* number + icon */}
            <div className="flex items-center gap-4 md:col-span-1">
                <span className="font-(family-name:--display) text-sm font-semibold text-(--muted)">
                    {String(i + 1).padStart(2, '0')}
                </span>
                <s.icon className="text-xl text-(--blue) md:hidden" />
            </div>

            {/* title */}
            <div className="flex items-start gap-3 md:col-span-4">
                <s.icon className="mt-1 hidden shrink-0 text-xl text-(--blue) md:block" />
                <h3 className="font-(family-name:--display) text-xl font-semibold leading-snug transition-colors group-hover:text-(--blue)">
                    {s.title}
                </h3>
            </div>

            {/* description */}
            <p className="text-sm leading-relaxed text-(--muted) md:col-span-4 md:text-base">{s.text}</p>

            {/* tags + arrow */}
            <div className="flex items-start justify-between gap-4 md:col-span-3">
                <p className="text-xs leading-6 text-[#7aa2ff]">{s.tags.join(' · ')}</p>
                <FiArrowUpRight className="mt-1 shrink-0 text-xl text-(--muted) transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-(--blue)" />
            </div>
        </motion.a>
    )
}

export default function Services() {
    return (
        <section id="services" className="wrap relative overflow-x-clip">
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-12 max-w-2xl"
            >
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#7aa2ff]">Services</p>
                <h2 className="h2 mt-2 text-balance">How I can help you</h2>
                <p className="mt-4 text-base text-(--muted) sm:text-lg">
                    From the first idea to a finished product. Click any service to start a conversation.
                </p>
            </motion.div>

            {/* Service list */}
            <div className="border-b border-(--line)">
                {SERVICES.map((s, i) => (
                    <ServiceRow key={s.title} s={s} i={i} />
                ))}
            </div>


        </section>
    )
}