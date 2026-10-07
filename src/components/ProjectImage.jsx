import { useState } from 'react'

export default function ProjectImage({ sources = [], name = '' }) {
    const key = sources.join('|')

    const [prevKey, setPrevKey] = useState(key)
    const [i, setI] = useState(0)
    const [attempt, setAttempt] = useState(0)
    const [loaded, setLoaded] = useState(false)
    const [failed, setFailed] = useState(false)

    // props changed: reset
    if (prevKey !== key) {
        setPrevKey(key)
        setI(0)
        setAttempt(0)
        setLoaded(false)
        setFailed(false)
    }

    const src = sources[i]

    if (!src || failed)
        return (
            <div className="relative grid h-full w-full place-items-center bg-linear-to-br from-(--blue) to-[#03040a] font-(family-name:--display) text-6xl font-extrabold text-white">
                {name.charAt(0).toUpperCase()}
                {failed && (
                    <button
                        type="button"
                        onClick={() => {
                            setI(0)
                            setAttempt((a) => a + 1)
                            setLoaded(false)
                            setFailed(false)
                        }}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 font-sans text-xs font-semibold backdrop-blur"
                    >
                        Tap to retry
                    </button>
                )}
            </div>
        )

    const url = attempt ? `${src}${src.includes('?') ? '&' : '?'}r=${attempt}` : src

    return (
        <div className="relative h-full w-full overflow-hidden bg-slate-800">
            {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-700" />}

            <img
                key={url}
                ref={(el) => {
                    // image was already cached before React attached onLoad
                    if (el && el.complete && el.naturalWidth > 0) setLoaded(true)
                }}
                src={url}
                alt={name}
                decoding="async"
                referrerPolicy="no-referrer"
                draggable="false"
                onLoad={() => setLoaded(true)}
                onError={() => {
                    console.warn('Image failed to load:', url)
                    if (i + 1 < sources.length) {
                        setI(i + 1)
                        setLoaded(false)
                    } else {
                        setFailed(true)
                    }
                }}
                className="absolute inset-0 h-full w-full object-cover object-top"
            />
        </div>
    )
}