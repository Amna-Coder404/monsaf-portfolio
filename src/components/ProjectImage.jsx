import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const TIMEOUT_MS = 8000 // itni der mein image na aaye to agli source try karo

export default function ProjectImage({ sources = [], name = '' }) {
    const key = sources.join('|')

    // props badle to state render ke dauran reset (useEffect wali race nahi hoti)
    const [prevKey, setPrevKey] = useState(key)
    const [i, setI] = useState(0)
    const [loaded, setLoaded] = useState(false)
    if (prevKey !== key) {
        setPrevKey(key)
        setI(0)
        setLoaded(false)
    }

    const imgRef = useRef(null)
    const src = sources[i]

    // 1) cached image: onLoad miss ho gaya ho to yahan pakad lo
    // 2) timeout: image atak jaye to agli source par jao
    useEffect(() => {
        if (!src) return
        const el = imgRef.current
        if (el && el.complete && el.naturalWidth > 0) {
            setLoaded(true)
            return
        }
        const t = setTimeout(() => {
            setLoaded((ok) => {
                if (!ok) setI((n) => n + 1)
                return ok
            })
        }, TIMEOUT_MS)
        return () => clearTimeout(t)
    }, [src])

    if (!src)
        return (
            <div className="grid h-full w-full place-items-center bg-linear-to-br from-(--blue) to-[#03040a] font-(family-name:--display) text-6xl font-extrabold text-white">
                {name.charAt(0).toUpperCase()}
            </div>
        )

    return (
        <div className="relative h-full w-full overflow-hidden bg-slate-800">
            {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-700" />}
            <motion.img
                key={src}
                ref={imgRef}
                src={src}
                alt={name}
                decoding="async"
                referrerPolicy="no-referrer"
                draggable="false"
                onLoad={() => setLoaded(true)}
                onError={() => {
                    setLoaded(false)
                    setI((n) => n + 1)
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: loaded ? 1 : 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full w-full object-cover object-top"
            />
        </div>
    )
}