
import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMonitor, FiSmartphone } from 'react-icons/fi'
import { BsPinAngleFill } from 'react-icons/bs'
import { imageSources } from '../lib/preview'
import { projectPath } from '../lib/projectRoutes'
import ProjectImage from './ProjectImage'

const host = (u) => {
    try {
        return new URL(u).hostname.replace(/^www\./, '')
    } catch {
        return ''
    }
}

const MAX_TAGS = 3
const ease = [0.22, 1, 0.36, 1]

/* Project preview */
function Media({ project: p, isWeb }) {
    const sources = imageSources(p)

    return (
        <div className="relative h-56 overflow-hidden bg-(--fog)">
            {isWeb ? (
                <div className="absolute inset-x-5 bottom-0 top-6 overflow-hidden rounded-t-lg border border-b-0 border-(--line) bg-(--paper) transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    {/* Browser bar */}
                    <div className="flex h-5 items-center gap-1 border-b border-(--line) px-2">
                        <span className="size-1.5 rounded-full bg-(--muted)/40" />
                        <span className="size-1.5 rounded-full bg-(--muted)/40" />
                        <span className="size-1.5 rounded-full bg-(--muted)/40" />
                    </div>

                    <div className="h-[calc(100%-1.25rem)]">
                        <ProjectImage sources={sources} name={p.name} />
                    </div>
                </div>
            ) : (
                <div className="absolute left-1/2 top-6 h-64 w-32 -translate-x-1/2 overflow-hidden rounded-t-3xl border-4 border-(--line) bg-(--surface) transition-transform duration-500 ease-out group-hover:-translate-y-1">
                    <ProjectImage sources={sources} name={p.name} />
                </div>
            )}

            {/* Pinned badge */}
            {p.is_pinned && (
                <span className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-(--line) bg-(--surface)/90 px-2.5 py-1 text-xs font-medium text-(--ink) backdrop-blur">
                    <BsPinAngleFill
                        aria-hidden="true"
                        className="text-(--blue)"
                    />
                    Pinned
                </span>
            )}
        </div>
    )
}

const ProjectCard = forwardRef(function ProjectCard(
    { project: p, index = 0, onTag },
    ref
) {
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
            transition={{
                duration: 0.5,
                ease,
                delay: (index % 3) * 0.05,
            }}
            className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--paper) transition-colors duration-300 hover:border-(--blue)"
        >
            <Media project={p} isWeb={isWeb} />

            {/* Project information */}
            <div className="flex flex-1 flex-col p-5">
                {/* Type and website */}
                <div className="flex items-center gap-2 text-xs text-(--muted)">
                    <TypeIcon
                        aria-hidden="true"
                        className="shrink-0 text-(--blue)"
                    />

                    <span>{isWeb ? 'Web app' : 'Mobile app'}</span>

                    {site && (
                        <>
                            <span aria-hidden="true">/</span>
                            <span className="truncate">{site}</span>
                        </>
                    )}
                </div>

                {/* Project title */}
                <h3 className="mt-2 font-(family-name:--display) text-xl font-semibold leading-snug text-(--ink)">
                    {p.name}
                </h3>

                {/* Technology tags */}
                {shown.length > 0 && (
                    <div className="relative z-10 mt-3 flex flex-wrap gap-2 pt-2">
                        {shown.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onTag?.(t)
                                }}
                                className="rounded-full border border-(--line) bg-(--fog) px-2.5 py-1 text-xs text-(--muted) transition-colors duration-200 hover:border-(--blue) hover:bg-(--blue)/10 hover:text-(--blue)"
                            >
                                {t}
                            </button>
                        ))}

                        {extra > 0 && (
                            <span className="self-center text-xs text-(--muted)">
                                +{extra} more
                            </span>
                        )}
                    </div>
                )}

                {/* Project link */}
                <Link
                    to={projectPath(p)}
                    className="mt-auto flex items-center justify-between pt-5 text-sm font-medium text-(--ink) after:absolute after:inset-0 after:content-['']"
                >
                    <span className="transition-colors duration-300 group-hover:text-(--blue)">
                        View project
                    </span>

                    <FiArrowUpRight
                        aria-hidden="true"
                        className="text-lg text-(--muted) transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-(--blue)"
                    />
                </Link>
            </div>
        </motion.article>
    )
})

export default ProjectCard
