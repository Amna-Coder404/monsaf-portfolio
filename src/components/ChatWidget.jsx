import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiArrowDown, FiMessageCircle, FiSend, FiX } from 'react-icons/fi'

const GREETING = "Hi! I'm Monsaf's assistant. Ask me anything about Monsaf, his skills, services or projects."
const SUGGESTIONS = ['Show me his projects', 'What are his skills?', 'What services does he offer?', 'How can I contact him?']

function TypingDots() {
    return (
        <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm border border-(--line) bg-(--fog) px-4 py-3.5">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    className="size-2 rounded-full bg-[#7aa2ff]"
                />
            ))}
        </div>
    )
}

export default function ChatWidget() {
    const [open, setOpen] = useState(false)
    const [hint, setHint] = useState(false)
    const [msgs, setMsgs] = useState([{ from: 'bot', text: GREETING }])
    const [val, setVal] = useState('')
    const [thinking, setThinking] = useState(false)
    const [atBottom, setAtBottom] = useState(true)
    const box = useRef(null)
    const inputRef = useRef(null)

    // chhota "Ask me anything" hint, 4 sec baad
    useEffect(() => {
        const t = setTimeout(() => setHint(true), 4000)
        return () => clearTimeout(t)
    }, [])

    // Contact section ka button chat kholne ke liye
    useEffect(() => {
        const openIt = () => {
            setOpen(true)
            setHint(false)
        }
        window.addEventListener('open-chat', openIt)
        return () => window.removeEventListener('open-chat', openIt)
    }, [])

    // Esc se band
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setOpen(false)
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [])

    const onScroll = () => {
        const el = box.current
        if (!el) return
        setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 80)
    }

    const toBottom = (smooth = true) => {
        const el = box.current
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
    }

    useEffect(() => {
        if (open && atBottom) requestAnimationFrame(() => toBottom(!thinking))
    }, [msgs, thinking, open])

    useEffect(() => {
        if (!open) return
        setHint(false)
        requestAnimationFrame(() => toBottom(false))
        if (window.innerWidth >= 640) setTimeout(() => inputRef.current?.focus(), 250)
    }, [open])

    const send = async (text) => {
        const next = [...msgs, { from: 'me', text }]
        setMsgs(next)
        setAtBottom(true)
        setVal('')
        inputRef.current?.focus()
        setThinking(true)

        try {
            const r = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: next.map((m) => ({
                        role: m.from === 'me' ? 'user' : 'assistant',
                        content: m.text,
                    })),
                }),
            })
            if (!r.ok) throw new Error('ai_failed ' + (await r.text()))
            const out = await r.json()
            setThinking(false)
            setMsgs((m) => [...m, { from: 'bot', text: out.reply || '...' }])
        } catch (err) {
            console.error(err)
            setThinking(false)
            setMsgs((m) => [
                ...m,
                { from: 'bot', text: 'My AI brain is offline right now. Please use the contact form on this page instead.' },
            ])
        }
    }

    const submit = (e) => {
        e.preventDefault()
        const v = val.trim()
        if (v && !thinking) send(v)
    }

    const safeBottom = 'env(safe-area-inset-bottom, 0px)'
    const onlyGreeting = msgs.length === 1

    return (
        <>
            {/* Chat panel */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="panel"
                        role="dialog"
                        aria-label="Chat with Monsaf's assistant"
                        initial={{ opacity: 0, y: 24, scale: 0.94 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 24, scale: 0.94 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                        style={{
                            bottom: `calc(${safeBottom} + 5.25rem)`,
                            height: 'min(34rem, calc(100dvh - 7.5rem))',
                        }}
                        className="fixed inset-x-3 z-50 flex origin-bottom-right flex-col overflow-hidden rounded-3xl border border-(--line) bg-[#0a0d1c] shadow-2xl shadow-black/60 sm:inset-x-auto sm:right-6 sm:w-[24rem]"
                    >
                        {/* Header */}
                        <div className="flex shrink-0 items-center gap-3 border-b border-(--line) px-4 py-3">
                            <div className="relative grid size-9 shrink-0 place-items-center rounded-full bg-(--blue) font-bold text-white">
                                A
                                <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#0a0d1c] bg-emerald-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-semibold leading-tight">Monsaf's assistant</p>
                                <p className="text-xs text-(--muted)">{thinking ? 'typing...' : 'online'}</p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close chat"
                                onClick={() => setOpen(false)}
                                className="grid size-9 place-items-center rounded-full text-lg text-(--muted) transition-colors hover:bg-(--fog) hover:text-white"
                            >
                                <FiX />
                            </button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={box}
                            onScroll={onScroll}
                            data-lenis-prevent
                            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden overscroll-contain p-3.5 text-[15px] [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin]"
                        >
                            {msgs.map((m, i) => (
                                <motion.p
                                    key={i}
                                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                                    className={
                                        m.from === 'bot'
                                            ? 'max-w-[88%] self-start whitespace-pre-line break-words rounded-2xl rounded-bl-sm border border-(--line) bg-(--fog) px-4 py-2.5'
                                            : 'max-w-[88%] self-end break-words rounded-2xl rounded-br-sm bg-(--blue) px-4 py-2.5 text-white shadow-lg shadow-(--blue)/30'
                                    }
                                >
                                    {m.text}
                                </motion.p>
                            ))}

                            {onlyGreeting && !thinking && (
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTIONS.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => send(s)}
                                            className="rounded-full border border-(--blue)/50 px-3.5 py-1.5 text-sm text-white transition-colors hover:bg-(--blue)"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {thinking && <TypingDots />}
                        </div>

                        {/* Jump to latest */}
                        <AnimatePresence>
                            {!atBottom && (
                                <motion.button
                                    type="button"
                                    onClick={() => toBottom()}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    whileTap={{ scale: 0.92 }}
                                    className="absolute inset-x-0 bottom-20 z-10 mx-auto flex w-fit items-center gap-1.5 rounded-full bg-(--blue) px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-black/40"
                                >
                                    <FiArrowDown /> Latest
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Input */}
                        <div className="shrink-0 border-t border-(--line) p-3">
                            <form onSubmit={submit} className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    value={val}
                                    onChange={(e) => setVal(e.target.value)}
                                    readOnly={thinking}
                                    maxLength={400}
                                    enterKeyHint="send"
                                    autoComplete="off"
                                    placeholder={thinking ? 'Thinking...' : 'Ask about Monsaf or her projects'}
                                    className="min-w-0 flex-1 rounded-full border border-(--line) bg-(--fog) px-4 py-3 text-base text-white outline-none transition placeholder:text-(--muted) focus:border-(--blue) focus:ring-4 focus:ring-(--blue)/20 read-only:opacity-60"
                                />
                                <motion.button
                                    type="submit"
                                    aria-label="Send"
                                    disabled={thinking}
                                    whileTap={{ scale: 0.85, rotate: -15 }}
                                    className="grid size-11 shrink-0 touch-manipulation place-items-center rounded-full bg-(--blue) text-lg text-white shadow-lg shadow-(--blue)/40 disabled:opacity-60"
                                >
                                    <FiSend />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hint bubble */}
            <AnimatePresence>
                {hint && !open && (
                    <motion.button
                        key="hint"
                        type="button"
                        onClick={() => setOpen(true)}
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        style={{ bottom: `calc(${safeBottom} + 5.25rem)` }}
                        className="fixed right-4 z-50 rounded-2xl rounded-br-sm border border-(--line) bg-[#0a0d1c] px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-black/40 sm:right-6"
                    >
                        Ask me about Monsaf
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Floating button */}
            <motion.button
                type="button"
                aria-label={open ? 'Close chat' : 'Open chat'}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.06 }}
                style={{ bottom: `calc(${safeBottom} + 1rem)` }}
                className="fixed right-4 z-50 grid size-14 place-items-center rounded-full bg-(--blue) text-2xl text-white shadow-lg shadow-(--blue)/40 sm:right-6"
            >
                {!open && (
                    <span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-(--blue) opacity-30" />
                )}
                <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                        key={open ? 'x' : 'chat'}
                        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                        transition={{ duration: 0.18 }}
                        className="relative grid place-items-center"
                    >
                        {open ? <FiX /> : <FiMessageCircle />}
                    </motion.span>
                </AnimatePresence>
            </motion.button>
        </>
    )
}