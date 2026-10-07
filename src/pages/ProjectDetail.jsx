import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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


const youtubeId = (u) => {
    if (typeof u !== 'string' || !u) return null
    const m = u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
    return m ? m[1] : null
}

const host = (u) => {
    try { return new URL(u).hostname } catch { return '' }
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.6, delay },
})

/* ───────── Phone / browser, video ke sath ───────── */
function DemoFrame({ p }) {
    const isWeb = p.type === 'web'

    /* Web project: sirf browser mein screenshot, video nahi */
    if (isWeb) {
        return (
            <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl shadow-(--blue)/30 ring-1 ring-white/10">
                <div className="flex items-center gap-1.5 bg-slate-800 px-4 py-2.5">
                    <span className="size-2.5 rounded-full bg-red-400" />
                    <span className="size-2.5 rounded-full bg-amber-400" />
                    <span className="size-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 flex-1 truncate rounded-md bg-slate-900 px-3 py-1 text-xs text-slate-400">
                        {host(p.live_url)}
                    </span>
                </div>
                <div className="relative aspect-[16/10]">
                    <ProjectImage sources={imageSources(p)} name={p.name} />
                </div>
            </div>
        )
    }

    /* Mobile project: demo_video_url ho to video, warna placeholder */
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
            className="relative aspect-[9/19] w-[250px] overflow-hidden rounded-[2.6rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl shadow-(--blue)/40 ring-1 ring-white/15 sm:w-[280px]"
        >
            <span className="absolute left-1/2 top-2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-slate-900" />

            {player || (
                <>
                    <ProjectImage sources={imageSources(p)} name={p.name} />
                    <div className="absolute inset-0 z-10 grid place-items-center bg-black/50 backdrop-blur-[2px]">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <span className="relative grid size-16 place-items-center rounded-full bg-(--blue) text-2xl text-white shadow-lg shadow-(--blue)/50">
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

/* ───────── Page ───────── */
export default function ProjectDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [p, setP] = useState(undefined) // undefined = loading, null = not found
    const [error, setError] = useState('')

    useEffect(() => {
        setP(undefined)
        setError('')
        fetchProject(id).then(setP).catch((e) => setError(e.message))
    }, [id])

    useEffect(() => {
        if (p?.name) document.title = `${p.name} | Monsaf Ali`
        return () => { document.title = 'Monsaf Ali' }
    }, [p])

    const back = () => navigate('/', { state: { scrollTo: 'projects' } })

    const backBtn = (
        <button
            onClick={back}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--paper)/80 px-4 py-2 text-sm font-semibold text-(--muted) backdrop-blur transition-colors hover:border-(--blue) hover:text-white"
        >
            <FiArrowLeft /> All projects
        </button>
    )

    if (error)
        return (
            <section className="wrap pt-32">
                {backBtn}
                <p className="text-(--muted)">Could not load this project: {error}</p>
            </section>
        )

    if (p === undefined)
        return (
            <section className="wrap pt-32">
                <div className="h-10 w-40 animate-pulse rounded-full bg-white/5" />
                <div className="mt-8 grid gap-12 lg:grid-cols-2">
                    <div className="space-y-4">
                        <div className="h-16 w-3/4 animate-pulse rounded-2xl bg-white/5" />
                        <div className="h-28 animate-pulse rounded-2xl bg-white/5" />
                    </div>
                    <div className="mx-auto h-[28rem] w-[250px] animate-pulse rounded-[2.6rem] bg-white/5" />
                </div>
            </section>
        )

    if (p === null)
        return (
            <section className="wrap pt-32">
                {backBtn}
                <h1 className="h2">Project not found</h1>
                <p className="mt-3 text-(--muted)">Yeh project ab maujood nahi hai.</p>
            </section>
        )

    const isWeb = p.type === 'web'
    const main = isWeb
        ? { url: p.live_url, label: 'Live link', icon: FiExternalLink }
        : { url: p.apk_url, label: 'Download APK', icon: FiDownload }
    const TypeIcon = isWeb ? FiMonitor : FiSmartphone;
    const tags = p.tags || [];
    const features = Array.isArray(p.features) ? p.features : [];
    const shots = Array.isArray(p.screenshots) ? p.screenshots : [];
    const about = p.long_description || p.description;



    return (
        <article className="wrap relative pt-32 sm:pt-36">
            {/* ───────── Top: info + demo ───────── */}
            <div className="grid items-start gap-14 lg:grid-cols-2">
                <div>
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        {backBtn}
                    </motion.div>

                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-(--blue)/40 bg-(--blue)/10 px-3 py-1.5 text-xs font-bold capitalize text-[#7aa2ff]"
                    >
                        <TypeIcon className="text-sm" /> {p.type} project
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.05 }}
                        className="mt-4 font-(family-name:--display) text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl"
                    >
                        <span className="bg-linear-to-r from-white via-[#a9c0ff] to-(--blue) bg-clip-text text-transparent">
                            {p.name}
                        </span>
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
                                    className="rounded-full border border-(--line) bg-(--fog) px-3 py-1 text-[13px] font-medium"
                                >
                                    <span className="opacity-50">#</span>
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
                                rel="noreferrer"
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-(--blue) to-[#5b8cff] px-7 py-3.5 font-semibold text-white shadow-lg shadow-(--blue)/40"
                            >
                                <main.icon /> {main.label}
                            </motion.a>
                        )}
                        {p.github_url && (
                            <motion.a
                                href={p.github_url}
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ y: -3, scale: 1.03 }}
                                whileTap={{ scale: 0.96 }}
                                className="inline-flex items-center gap-2 rounded-full border-2 border-(--blue)/60 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-(--blue)"
                            >
                                <FiGithub /> Source code
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
                    <div className="pointer-events-none absolute size-72 rounded-full bg-(--blue)/30 blur-[100px]" />
                    <div className="relative">
                        <DemoFrame p={p} />
                    </div>
                </motion.div>
            </div>

            {/* ───────── Overview ───────── */}
            {about && (
                <motion.section {...fadeUp()} className="mt-24 max-w-3xl">
                    <h2 className="font-(family-name:--display) text-3xl font-bold">Overview</h2>
                    <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-(--muted)">{about}</p>
                </motion.section>
            )}

            {/* ───────── Features ───────── */}
            {features.length > 0 && (
                <section className="mt-20">
                    <motion.h2 {...fadeUp()} className="font-(family-name:--display) text-3xl font-bold">
                        Key features
                    </motion.h2>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                {...fadeUp((i % 3) * 0.08)}
                                whileHover={{ y: -4 }}
                                className="flex items-start gap-3 rounded-2xl border border-(--line) bg-(--paper)/80 p-5 backdrop-blur transition-colors hover:border-(--blue)/50"
                            >
                                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-(--blue)/20 text-sm text-[#7aa2ff]">
                                    <FiCheck />
                                </span>
                                <p className="leading-relaxed">{f}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ───────── Screenshots ───────── */}
            {shots.length > 0 && (
                <section className="mt-20">
                    <motion.h2 {...fadeUp()} className="font-(family-name:--display) text-3xl font-bold">
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
                                className={`snap-start rounded-2xl border border-(--line) bg-slate-800 object-cover object-top shadow-lg shadow-black/40 ${isWeb ? 'h-64 w-[26rem] sm:h-72 sm:w-[30rem]' : 'h-[26rem] w-[12.5rem] sm:h-[30rem] sm:w-[14rem]'
                                    } shrink-0`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* ───────── Bottom ───────── */}
            <motion.div {...fadeUp()} className="mt-24 flex justify-center">
                <motion.button
                    onClick={back}
                    whileHover={{ y: -3, scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-(--blue)/60 px-8 py-4 font-semibold transition-colors hover:bg-(--blue)"
                >
                    <FiArrowLeft /> Back to all projects
                </motion.button>
            </motion.div>
        </article>
    )
}