import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMonitor, FiSmartphone } from 'react-icons/fi'
import { BsPinAngleFill } from 'react-icons/bs'
import { imageSources } from '../lib/preview'
import { projectPath } from '../lib/projectRoutes'
import ProjectImage from './ProjectImage'

const host = (u) => {
    try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' }
}

const MAX_TAGS = 3
const ease = [0.22, 1, 0.36, 1]

/* picture area: a web project sits in a slim browser frame,
   a mobile project sits in a phone frame. flat, no shadows. */
function Media({ project: p, isWeb }) {
    const sources = imageSources(p)

    return (
        <div className="relative h-56 overflow-hidden bg-(--fog)">
            {isWeb ? (
                <div className="absolute inset-x-5 bottom-0 top-6 overflow-hidden rounded-t-lg border border-b-0 border-(--line) bg-(--paper) transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    {/* browser bar */}
                    <div className="flex h-5 items-center gap-1 border-b border-(--line) px-2">
                        <span className="size-1.5 rounded-full bg-white/20" />
                        <span className="size-1.5 rounded-full bg-white/20" />
                        <span className="size-1.5 rounded-full bg-white/20" />
                    </div>
                    <div className="h-[calc(100%-1.25rem)]">
                        <ProjectImage sources={sources} name={p.name} />
                    </div>
                </div>
            ) : (
                <div className="absolute left-1/2 top-6 h-64 w-32 -translate-x-1/2 overflow-hidden rounded-t-3xl border-4 border-b-0 border-slate-700 bg-slate-900 transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <ProjectImage sources={sources} name={p.name} />
                </div>
            )}

            {/* pinned badge */}
            {p.is_pinned && (
                <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    <BsPinAngleFill aria-hidden="true" className="text-(--blue)" /> Pinned
                </span>
            )}
        </div>
    )
}

const ProjectCard = forwardRef(function ProjectCard({ project: p, index = 0, onTag }, ref) {
    const isWeb = p.type === 'web'
    const TypeIcon = isWeb ? FiMonitor : FiSmartphone
    const tags = p.tags || []
    const shown = tags.slice(0, MAX_TAGS)
    const extra = tags.length - shown.length
    const site = isWeb ? host(p.live_url) : ''

    return (
        <motion.article
            ref={ref}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.5, ease, delay: (index % 3) * 0.05 }}
            className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--paper) transition-colors duration-300 hover:border-white/25"
        >
            <Media project={p} isWeb={isWeb} />

            {/* info */}
            <div className="flex flex-1 flex-col p-5">
                {/* type + site */}
                <div className="flex items-center gap-2 text-xs text-(--muted)">
                    <TypeIcon aria-hidden="true" className="text-(--blue)" />
                    <span>{isWeb ? 'Web app' : 'Mobile app'}</span>
                    {site && (
                        <>
                            <span aria-hidden="true">/</span>
                            <span className="truncate">{site}</span>
                        </>
                    )}
                </div>

                <h3 className="mt-2 font-(family-name:--display) text-xl font-semibold leading-snug text-white">
                    {p.name}
                </h3>

                {/* tags as plain text */}
                {/* tags as plain text */}
                {shown.length > 0 && (
                    <p className="relative z-10 mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs pt-5">
                        {shown.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onTag?.(t)
                                }}
                                className="rounded-full bg-transparent border border-white text-white px-2 py-0.5 hover:bg-white hover:text-black transition-colors"
                            >
                                {t}
                            </button>
                        ))}
                        {extra > 0 && <span className="text-(--muted)">+{extra} more</span>}
                    </p>
                )}

                {/* the whole card is clickable through this link */}
                <Link
                    to={projectPath(p)}
                    className="mt-auto flex items-center justify-between pt-5 text-sm font-medium text-white after:absolute after:inset-0 after:content-['']"
                >
                    <span className="transition-colors duration-300 group-hover:text-(--blue)">
                        View project
                    </span>
                    <FiArrowUpRight className="text-lg text-(--muted) transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--blue)" />
                </Link>
            </div>
        </motion.article>
    )
})

export default ProjectCard