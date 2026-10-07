import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiMonitor, FiSmartphone } from 'react-icons/fi'
import { BsPinAngleFill } from 'react-icons/bs'
import { imageSources } from '../lib/preview'
import ProjectImage from './ProjectImage'

const host = (u) => {
    try { return new URL(u).hostname } catch { return '' }
}

function Float({ children, delay = 0 }) {
    return (
        <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    )
}

function PhoneFrame({ project }) {
    return (
        <div className="relative aspect-[9/19] h-60 overflow-hidden rounded-[1.9rem] border-[6px] border-slate-900 bg-slate-900 shadow-2xl shadow-black/60 ring-1 ring-white/20">
            <span className="absolute left-1/2 top-1.5 z-10 h-3.5 w-14 -translate-x-1/2 rounded-full bg-slate-900" />
            <span className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-white/20 via-transparent to-transparent" />
            <ProjectImage sources={imageSources(project)} name={project.name} />
        </div>
    )
}

function BrowserFrame({ project }) {
    return (
        <div className="w-full max-w-xs overflow-hidden rounded-xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/60 ring-1 ring-white/10">
            <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-2">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-2 flex-1 truncate rounded-md bg-slate-900 px-2 py-0.5 text-[11px] text-slate-400">
                    {host(project.live_url)}
                </span>
            </div>
            <div className="relative aspect-[16/10]">
                <span className="pointer-events-none absolute inset-0 z-10 bg-linear-to-br from-white/15 via-transparent to-transparent" />
                <ProjectImage sources={imageSources(project)} name={project.name} />
            </div>
        </div>
    )
}

const ProjectCard = forwardRef(function ProjectCard({ project: p, index = 0 }, ref) {
    const isWeb = p.type === 'web'
    const TypeIcon = isWeb ? FiMonitor : FiSmartphone

    return (
        <motion.article
            ref={ref}
            layout
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: (index % 3) * 0.1 }}
            className="relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-[28px] border border-(--line) bg-(--paper)/90 shadow-lg shadow-black/40 backdrop-blur sm:w-[340px]"
        >
            {/* Device stage */}
            <div className="relative h-72 overflow-hidden bg-linear-to-br from-[#03040a] via-[#0b1240] to-(--blue) px-6 pt-10">
                <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:18px_18px]" />

                <motion.div
                    className="absolute -right-10 -top-10 size-44 rounded-full bg-white/15 blur-3xl"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute -bottom-16 -left-10 size-48 rounded-full bg-(--blue)/40 blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.9, 0.5] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                />

                <span className="absolute -bottom-6 right-3 select-none font-(family-name:--display) text-[7rem] font-extrabold leading-none text-white/[0.06]">
                    {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 flex h-full w-full items-end justify-center">
                    <Float delay={index * 0.3}>
                        {isWeb ? <BrowserFrame project={p} /> : <PhoneFrame project={p} />}
                    </Float>
                </div>

                <div className="absolute left-4 top-4 z-30 flex items-center gap-2">
                    {p.is_pinned && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/20 px-3 py-1.5 text-xs font-bold text-amber-200 backdrop-blur-md">
                            <BsPinAngleFill className="text-sm" /> Pinned
                        </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-bold capitalize text-white backdrop-blur-md">
                        <TypeIcon className="text-sm" />
                        {p.type}
                    </span>
                </div>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-linear-to-t from-black/25 to-transparent" />
            </div>

            {/* Info */}
            <div className="relative z-10 flex flex-1 flex-col p-6">
                <h3 className="font-(family-name:--display) text-xl font-bold leading-tight">
                    {p.name}
                </h3>

                <motion.div className="mt-auto pt-5" whileTap={{ scale: 0.97 }}>
                    <Link
                        to={`/project/${p.id}`}
                        className="group flex items-center justify-center gap-2 rounded-full border-2 border-(--blue)/60 px-5 py-3 font-semibold text-white transition-colors hover:bg-(--blue)"
                    >
                        See details
                        <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </div>
        </motion.article>
    )
})

export default ProjectCard