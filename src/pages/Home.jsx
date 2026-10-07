import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'

import Contact from '../components/Contact'
import { go } from '../components/go'

const Divider = () => (
    <div className="mx-auto h-px w-[min(1200px,100%-2.5rem)] bg-linear-to-r from-transparent via-(--blue)/40 to-transparent" />
)

export default function Home() {
    const { state } = useLocation()

    // detail page se "back" dabane par seedha Projects section par aaye
    useEffect(() => {
        if (!state?.scrollTo) return
        const t = setTimeout(() => go(state.scrollTo), 150)
        return () => clearTimeout(t)
    }, [state])

    return (
        <>
            <Hero />
            <Divider />
            <About />
            <Divider />
            <Skills />
            <Divider />
            <Projects />
            <Divider />
            <Divider />
            <Contact />
        </>
    )
}