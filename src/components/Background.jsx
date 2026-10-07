import { useEffect } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { tsParticles } from '@tsparticles/engine'
import { loadSlim } from '@tsparticles/slim'

const PARTICLE_OPTIONS = {
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    detectRetina: true,
    interactivity: {
        detectsOn: 'window',
        events: {
            onHover: { enable: true, mode: 'grab' },
            onClick: { enable: true, mode: 'push' },
            resize: { enable: true },
        },
        modes: {
            grab: { distance: 180, links: { opacity: 0.6 } },
            push: { quantity: 3 },
        },
    },
    particles: {
        color: { value: ['#2f5bff', '#5b8cff', '#7aa2ff', '#ffffff'] },
        links: { enable: true, color: '#2f5bff', distance: 150, opacity: 0.22, width: 1 },
        move: { enable: true, speed: 0.7, direction: 'none', outModes: { default: 'out' } },
        number: {
            value: 60,
            density: { enable: true, width: 1000, height: 1000 },
            limit: { mode: 'delete', value: 120 },
        },
        opacity: { value: { min: 0.25, max: 0.85 } },
        size: { value: { min: 1, max: 3.5 } },
        shape: { type: 'circle' },
    },
}

function ParticlesLayer() {
    useEffect(() => {
        let container
        let cancelled = false

            ; (async () => {
                await loadSlim(tsParticles)
                const c = await tsParticles.load({ id: 'bg-particles', options: PARTICLE_OPTIONS })
                if (cancelled) c?.destroy()
                else container = c
            })()

        return () => {
            cancelled = true
            container?.destroy()
        }
    }, [])

    return <div id="bg-particles" className="absolute inset-0" />
}

function Shapes() {
    const { scrollYProgress } = useScroll()

    const y1 = useTransform(scrollYProgress, [0, 1], ['0vh', '-140vh'])
    const y2 = useTransform(scrollYProgress, [0, 1], ['0vh', '-70vh'])
    const y3 = useTransform(scrollYProgress, [0, 1], ['0vh', '-200vh'])
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 540])
    const rotateBack = useTransform(scrollYProgress, [0, 1], [0, -360])

    return (
        <>
            <motion.div
                style={{ y: y1, rotate }}
                className="absolute left-[8%] top-[55vh] size-24 rounded-full border-[3px] border-(--blue)/40 shadow-[0_0_40px] shadow-(--blue)/30"
            />
            <motion.div
                style={{ y: y2, rotate: rotateBack }}
                className="absolute right-[10%] top-[70vh] size-20 rounded-3xl border border-(--blue)/30 bg-linear-to-br from-(--blue)/30 to-transparent"
            />
            <motion.div
                style={{ y: y3, rotate }}
                className="absolute left-[45%] top-[110vh] size-14 rotate-45 rounded-xl border-2 border-[#7aa2ff]/40"
            />
        </>
    )
}

function CursorGlow() {
    const mx = useMotionValue(-600)
    const my = useMotionValue(-600)
    const x = useSpring(mx, { stiffness: 70, damping: 18, mass: 0.6 })
    const y = useSpring(my, { stiffness: 70, damping: 18, mass: 0.6 })

    useEffect(() => {
        const move = (e) => {
            mx.set(e.clientX - 220)
            my.set(e.clientY - 220)
        }
        window.addEventListener('mousemove', move, { passive: true })
        return () => window.removeEventListener('mousemove', move)
    }, [mx, my])

    return (
        <motion.div
            style={{ x, y }}
            className="absolute left-0 top-0 size-[440px] rounded-full bg-(--blue)/20 blur-3xl"
        />
    )
}

export default function Background() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#03040a]"
        >
            <motion.div
                className="absolute -left-40 -top-40 size-[36rem] rounded-full bg-(--blue)/30 blur-[120px]"
                animate={{ x: [0, 120, -40, 0], y: [0, 80, 140, 0], scale: [1, 1.2, 0.95, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -right-40 top-1/4 size-[32rem] rounded-full bg-[#1d4ed8]/30 blur-[120px]"
                animate={{ x: [0, -140, 30, 0], y: [0, 100, -60, 0], scale: [1.1, 0.9, 1.15, 1.1] }}
                transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-48 left-1/4 size-[34rem] rounded-full bg-[#5b8cff]/20 blur-[120px]"
                animate={{ x: [0, 160, -80, 0], y: [0, -90, 40, 0], scale: [1, 1.25, 1, 1] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(91,140,255,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(91,140,255,0.10)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

            <Shapes />
            <CursorGlow />
            <ParticlesLayer />

            <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,rgba(3,4,10,0.85)_100%)]" />
        </div>
    )
}