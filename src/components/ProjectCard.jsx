import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMonitor, FiSmartphone } from 'react-icons/fi'
import { BsPinAngleFill } from 'react-icons/bs'
import { imageSources } from '../lib/preview'
import ProjectImage from './ProjectImage'

const host = (u) => {
    try { return new URL(u).hostname.replace(/^www\./, '') } catch { return '' }
}

const MAX_TAGS = 3
const mono = { fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace" }

/* the picture: a web screenshot slides up from the bottom edge,
   a phone peeks up from the bottom edge. no floating, no blobs. */
function Media({ project: p, isWeb }) {
    const sources = imageSources(p)

    // DEBUG: remove this line once images show up
    console.log(p.name, p.type, sources)

    return (
        <div
            className="relative h-64 overflow-hidden border-b border-(--line) bg-(--fog)"
            style={{
                backgroundImage:
                    'linear-gradient(rgba(140,150,196,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(140,150,196,0.07) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
            }}
        >
            <div className="pointer-events-none absolute -right-10 -top-16 size-52 rounded-full bg-(--blue)/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />

            {isWeb ? (
                <div className="absolute inset-x-6 top-8 bottom-0 overflow-hidden rounded-t-xl border border-b-0 border-(--line) bg-(--paper) shadow-2xl shadow-black/60 transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    <ProjectImage sources={sources} name={p.name} />
                </div>
            ) : (
                <div className="absolute left-1/2 top-8 h-72 w-[8.5rem] -translate-x-1/2 overflow-hidden rounded-t-[1.7rem] border-[5px] border-b-0 border-slate-800 bg-slate-900 shadow-2xl shadow-black/60 transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    <ProjectImage sources={sources} name={p.name} />
                </div>
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

    return (
        <motion.article
            ref={ref}
            layout
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            viewport={{ once: true, amount: 0.15 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26, delay: (index % 3) * 0.06 }}
            className="group relative flex w-[300px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-(--line) bg-(--paper) transition-[border-color,box-shadow]"
        >
            {/* line that draws across the top on hover */}
            <span className="absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 bg-(--blue) transition-transform duration-500 group-hover:scale-x-100" />

            {/* header strip */}
            <div
                className="flex items-center justify-between gap-3 border-b border-(--line) px-5 py-3 text-xs text-(--muted)"
                style={mono}
            >
                <span className="flex items-center gap-2">
                    <span className="text-white">{String(index + 1).padStart(2, '0')}</span>
                    <TypeIcon aria-hidden="true" />
                    <span className="capitalize">{p.type}</span>
                </span>

                {p.is_pinned ? (
                    <span className="flex items-center gap-1.5 text-(--blue)">
                        <BsPinAngleFill aria-hidden="true" /> pinned
                    </span>
                ) : isWeb && host(p.live_url) ? (
                    <span className="max-w-[10rem] truncate">{host(p.live_url)}</span>
                ) : null}
            </div>

            <Media project={p} isWeb={isWeb} />

            {/* info */}
            <div className="flex flex-1 flex-col gap-4 p-5">
                <h3 className="font-(family-name:--display) text-xl font-bold leading-tight text-white">
                    {p.name}
                </h3>

                {shown.length > 0 && (
                    <div className="relative z-10 flex flex-wrap gap-1.5">
                        {shown.map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onTag?.(t)
                                }}
                                className="rounded-md border border-(--line) bg-(--fog) px-2 py-0.5 text-[11px] text-(--muted) transition-colors hover:border-(--blue) hover:text-white"
                                style={mono}
                            >
                                {t}
                            </button>
                        ))}
                        {extra > 0 && (
                            <span className="px-1 py-0.5 text-[11px] text-(--muted)" style={mono}>
                                +{extra}
                            </span>
                        )}
                    </div>
                )}

                {/* the whole card is clickable through this link */}
                <Link
                    to={`/project/${p.id}`}
                    className="mt-auto flex items-center justify-between border-t border-(--line) pt-4 text-sm font-semibold text-white after:absolute after:inset-0 after:content-['']"
                >
                    See details
                    <span className="grid size-8 place-items-center rounded-full border border-(--line) transition-colors group-hover:border-(--blue) group-hover:bg-(--blue)">
                        <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                </Link>
            </div>
        </motion.article>
    )
})

export default ProjectCard