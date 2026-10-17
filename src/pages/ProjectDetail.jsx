
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    FiArrowLeft,
    FiCheck,
    FiDownload,
    FiExternalLink,
    FiGithub,
    FiMonitor,
    FiPlay,
    FiSmartphone,
} from 'react-icons/fi'
import { fetchProject } from '../lib/projects'
import { imageSources } from '../lib/preview'
import ProjectImage from '../components/ProjectImage'
import { projectPath, projectsPath, typeLabel } from '../lib/projectRoutes'

const youtubeId = (u) => {
    if (typeof u !== 'string' || !u) return null
    const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
    return m ? m[1] : null
}

const host = (u) => {
    try {
        return new URL(u).hostname.replace(/^www\./, '')
    } catch {
        return ''
    }
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay },
})

/* Browser frame for web projects and phone frame for mobile projects */
function DemoFrame({ p }) {
    const isWeb = p.type === 'web'

    if (isWeb) {
        return (
            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-(--line) bg-(--paper) shadow-2xl shadow-black/10">
                <div className="flex items-center gap-1.5 border-b border-(--line) bg-(--fog) px-4 py-2.5">
                    <span className="size-2.5 rounded-full bg-red-400" />
                    <span className="size-2.5 rounded-full bg-amber-400" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 flex-1 truncate rounded-md bg-(--surface) px-3 py-1 text-xs text-(--muted)">
                        {host(p.live_url)}
                    </span>
                </div>

                <div className="relative aspect-[16/10]">
                    <ProjectImage sources={imageSources(p)} name={p.name} />
                </div>
            </div>
        )
    }

    const url = p.demo_video_url
    const yt = youtubeId(url)

    const player = yt ? (
        <iframe
            src={`https://www.youtube.com/embed/${yt}?rel=0`}
            title={`${p.name} demo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
        />
    ) : url ? (
        <video
            src={url}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full bg-black object-contain"
        />
    ) : null

    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative aspect-[9/19] w-[250px] overflow-hidden rounded-[2.6rem] border-[8px] border-(--line) bg-(--surface) shadow-2xl shadow-black/10 sm:w-[280px]"
        >
            <span className="absolute left-1/2 top-2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />

            {player || (
                <>
                    <ProjectImage sources={imageSources(p)} name={p.name} />

                    <div className="absolute inset-0 z-10 grid place-items-center bg-black/50 backdrop-blur-[2px]">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <span className="relative grid size-16 place-items-center rounded-full bg-(--blue) text-2xl text-white shadow-lg shadow-black/20">
                                <motion.span
                                    animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                                    transition={{ duration: 1.8, repeat: Infinity }}
                                    className="absolute inset-0 rounded-full bg-(--blue)"
                                />
                                <FiPlay className="relative translate-x-0.5" />
                            </span>

                            <span className="px-4 text-xs font-semibold tracking-wide text-white">
                                Demo video coming soon
                            </span>
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    )
}

/* Project detail page */
export default function ProjectDetail() {
    const { id, type } = useParams()
    const navigate = useNavigate()

    const [p, setP] = useState(undefined)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        setP(undefined)
        setError('')

        fetchProject(id)
            .then((project) => {
                if (active) setP(project)
            })
            .catch((e) => {
                if (active) setError(e.message)
            })

        return () => {
            active = false
        }
    }, [id])

    useEffect(() => {
        if (p?.name) document.title = `${p.name} | Monsaf Ali`

        return () => {
            document.title = 'Monsaf Ali'
        }
    }, [p])

    const back = () =>
        type
            ? navigate(projectsPath(type))
            : navigate('/', { state: { scrollTo: 'projects' } })

    const backLabel = type ? `${typeLabel(type)} projects` : 'All projects'

    const backBtn = (
        <button
            type="button"
            onClick={back}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--paper) px-4 py-2 text-sm font-semibold text-(--muted) transition-colors hover:border-(--blue) hover:text-(--blue)"
        >
            <FiArrowLeft />
            {backLabel}
        </button>
    )

    if (error) {
        return (
            <section className="wrap pt-32">
                {backBtn}
                <p className="text-(--muted)">
                    Could not load this project: {error}
                </p>
            </section>
        )
    }

    if (p === undefined) {
        return (
            <section className="wrap pt-32">
                <div className="h-10 w-40 animate-pulse rounded-full bg-(--fog)" />

                <div className="mt-8 grid gap-12 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="h-16 w-3/4 animate-pulse rounded-2xl bg-(--fog)" />
                        <div className="h-28 animate-pulse rounded-2xl bg-(--fog)" />
                    </div>

                    <div className="mx-auto h-[28rem] w-[250px] animate-pulse rounded-[2.6rem] bg-(--fog)" />
                </div>
            </section>
        )
    }

    if (p === null) {
        return (
            <section className="wrap pt-32">
                {backBtn}
                <h1 className="h2">Project not found</h1>
                <p className="mt-3 text-(--muted)">
                    Yeh project ab maujood nahi hai.
                </p>
            </section>
        )
    }

    if (type && p.type !== type) {
        return <Navigate to={projectPath(p)} replace />
    }

    const isWeb = p.type === 'web'

    const main = isWeb
        ? { url: p.live_url, label: 'Live link', icon: FiExternalLink }
        : { url: p.apk_url, label: 'Download APK', icon: FiDownload }

    const TypeIcon = isWeb ? FiMonitor : FiSmartphone
    const tags = p.tags || []
    const features = Array.isArray(p.features) ? p.features : []
    const shots = Array.isArray(p.screenshots) ? p.screenshots : []
    const about = p.long_description || p.description

    return (
        <article className="wrap relative pt-32 sm:pt-36">
            {/* Project information and demo */}
            <div className="grid items-start gap-14 lg:grid-cols-2">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {backBtn}
                    </motion.div>

                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-(--blue)/40 bg-(--blue)/10 px-3 py-1.5 text-xs font-bold capitalize text-(--blue)"
                    >
                        <TypeIcon className="text-sm" />
                        {p.type} project
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="mt-4 font-(family-name:--display) text-5xl font-extrabold leading-[1.05] tracking-tight text-(--ink) sm:text-6xl"
                    >
                        {p.name}
                    </motion.h1>

                    {p.description && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="mt-5 max-w-xl text-lg leading-relaxed text-(--muted)"
                        >
                            {p.description}
                        </motion.p>
                    )}

                    {tags.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.25 }}
                            className="mt-6 flex flex-wrap gap-2"
                        >
                            {tags.map((t) => (
                                <span
                                    key={t}
                                    className="rounded-full border border-(--line) bg-(--fog) px-3 py-1 text-[13px] font-medium text-(--ink)"
                                >
                                    <span className="text-(--blue)">#</span>
                                    {t}
                                </span>
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mt-9 flex flex-wrap gap-3"
                    >
                        {main.url && (
                            <motion.a
                                href={main.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-2 rounded-full bg-(--blue) px-7 py-3.5 font-semibold text-white shadow-lg shadow-black/10 transition-colors hover:opacity-90"
                            >
                                <main.icon />
                                {main.label}
                            </motion.a>
                        )}

                        {p.github_url && (
                            <motion.a
                                href={p.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--paper) px-7 py-3.5 font-semibold text-(--ink) transition-colors hover:border-(--blue) hover:bg-(--blue) hover:text-white"
                            >
                                <FiGithub />
                                Source code
                            </motion.a>
                        )}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative grid place-items-center lg:sticky lg:top-28"
                >
                    <div className="pointer-events-none absolute size-72 rounded-full bg-(--blue)/20 blur-[100px]" />
                    <div className="relative">
                        <DemoFrame p={p} />
                    </div>
                </motion.div>
            </div>

            {/* Overview */}
            {about && (
                <motion.section {...fadeUp()} className="mt-24 max-w-3xl">
                    <h2 className="font-(family-name:--display) text-3xl font-bold text-(--ink)">
                        Overview
                    </h2>

                    <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-(--muted)">
                        {about}
                    </p>
                </motion.section>
            )}

            {/* Key features */}
            {features.length > 0 && (
                <section className="mt-20">
                    <motion.h2
                        {...fadeUp()}
                        className="font-(family-name:--display) text-3xl font-bold text-(--ink)"
                    >
                        Key features
                    </motion.h2>

                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                {...fadeUp((i % 3) * 0.08)}
                                whileHover={{ y: -4 }}
                                className="flex items-start gap-3 rounded-2xl border border-(--line) bg-(--paper) p-5 transition-colors hover:border-(--blue)/50"
                            >
                                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-(--blue)/10 text-sm text-(--blue)">
                                    <FiCheck />
                                </span>

                                <p className="leading-relaxed text-(--ink)">
                                    {f}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Screenshots */}
            {shots.length > 0 && (
                <section className="mt-20">
                    <motion.h2
                        {...fadeUp()}
                        className="font-(family-name:--display) text-3xl font-bold text-(--ink)"
                    >
                        Screenshots
                    </motion.h2>

                    <div className="-mx-3 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {shots.map((src, i) => (
                            <motion.img
                                key={src}
                                src={src}
                                alt={`${p.name} screenshot ${i + 1}`}
                                loading="lazy"
                                {...fadeUp(i * 0.05)}
                                className={`shrink-0 snap-start rounded-2xl border border-(--line) bg-(--fog) object-cover object-top shadow-lg shadow-black/10 ${isWeb
                                        ? 'h-64 w-[26rem] sm:h-72 sm:w-[30rem]'
                                        : 'h-[26rem] w-[12.5rem] sm:h-[30rem] sm:w-[14rem]'
                                    }`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Bottom navigation */}
            <motion.div {...fadeUp()} className="mt-24 flex justify-center">
                <motion.button
                    type="button"
                    onClick={back}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--paper) px-8 py-4 font-semibold text-(--ink) transition-colors hover:border-(--blue) hover:bg-(--blue) hover:text-white"
                >
                    <FiArrowLeft />
                    Back to {backLabel.toLowerCase()}
                </motion.button>
            </motion.div>
        </article>
    )
}
