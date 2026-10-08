import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { FiAlertCircle, FiArrowRight, FiArrowUpRight, FiMessageCircle } from 'react-icons/fi'
import { ME } from '../data'

// EmailJS config
const SERVICE_ID = 'service_93evwe8'
const TEMPLATE_ID = 'template_u6z21cq'
const PUBLIC_KEY = 'gf9OfKiAGstx0sCiv'

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || '')

const mono = { fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace" }

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
})

/* small text links under the email */
const LINK =
  'inline-flex items-center gap-2 text-(--muted) transition-colors hover:text-cyan-300'

/* Field: numbered label, line-only input */
function Field({ id, n, label, value, error, textarea = false, counter, ...props }) {
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div>
      <label htmlFor={id} className="flex items-baseline gap-3 text-sm text-(--muted)">
        <span className="text-cyan-300" style={mono}>
          {n}
        </span>
        {label}
      </label>

      <Tag
        id={id}
        value={value}
        aria-invalid={!!error}
        className={`mt-1 w-full border-0 border-b bg-transparent px-0 py-3 text-lg text-white outline-none transition-colors placeholder:text-(--muted)/40 disabled:opacity-60 ${textarea ? 'resize-none' : ''
          } ${error ? 'border-red-400' : 'border-(--line) focus:border-cyan-300'}`}
        {...props}
      />

      <div className="mt-1.5 flex items-start justify-between gap-3">
        {error && (
          <p className="flex items-center gap-1.5 text-sm text-red-400">
            <FiAlertCircle className="shrink-0" /> {error}
          </p>
        )}
        {counter && (
          <span className="ml-auto text-xs text-(--muted)" style={mono}>
            {counter}
          </span>
        )}
      </div>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })

  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [showErrors, setShowErrors] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const errors = {
    name: form.name.trim().length < 2 ? 'Please enter your name' : '',
    email: !isEmail(form.email.trim()) ? 'Please enter a valid email' : '',
    message: form.message.trim().length < 4 ? 'Please write a few words (at least 4 characters)' : '',
  }
  const hasErrors = Object.values(errors).some(Boolean)

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (hasErrors) return setShowErrors(true)

    // honeypot: bots fill this hidden field
    if (form.website) return setStatus('sent')

    setStatus('sending')
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name.trim(),
          from_email: form.email.trim(),
          reply_to: form.email.trim(),
          message: form.message.trim(),
        },
        { publicKey: PUBLIC_KEY }
      )
      setStatus('sent')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const reset = () => {
    setForm({ name: '', email: '', message: '', website: '' })
    setShowErrors(false)
    setStatus('idle')
  }

  const locked = status === 'sending'

  if (status === 'sent') {
    return (
      <div className="flex min-h-[26rem] flex-col items-start justify-center gap-5">
        <p className="text-cyan-300" style={mono}>
          ✓ sent
        </p>
        <h3 className="font-(family-name:--display) text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Thank you.
        </h3>
        <p className="max-w-sm text-lg text-(--muted)">
          I'll reply to <span className="break-all text-white">{form.email}</span> soon.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 inline-flex items-center gap-2 border-b border-(--line) pb-1 text-white transition-colors hover:border-cyan-300 hover:text-cyan-300"
        >
          Send another <FiArrowRight />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="relative flex flex-col gap-6">
      <Field
        id="c-name"
        n="01"
        label="What's your name?"
        placeholder="Your name"
        value={form.name}
        onChange={set('name')}
        disabled={locked}
        maxLength={80}
        autoComplete="name"
        error={showErrors ? errors.name : ''}
      />

      <Field
        id="c-email"
        n="02"
        label="What's your email?"
        type="email"
        inputMode="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={set('email')}
        disabled={locked}
        maxLength={120}
        autoComplete="email"
        error={showErrors ? errors.email : ''}
      />

      <Field
        id="c-message"
        n="03"
        label="What is your message?"
        textarea
        rows={4}
        placeholder="A few words about your idea..."
        value={form.message}
        onChange={set('message')}
        disabled={locked}
        maxLength={1500}
        counter={`${form.message.length}/1500`}
        error={showErrors ? errors.message : ''}
      />

      {/* honeypot */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={set('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === 'error' && (
        <p className="flex items-start gap-2 text-sm text-red-300">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <span>
            Sending failed. Please try again, or email me at{' '}
            <a href={`mailto:${ME.email}`} className="break-all underline">
              {ME.email}
            </a>
            .
          </span>
        </p>
      )}

      <motion.button
        type="submit"
        disabled={locked}
        whileTap={{ scale: 0.97 }}
        className="group mt-2 inline-flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-(--blue) to-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-(--blue)/30 transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {locked ? 'Sending...' : 'Send message'}
        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </motion.button>
    </form>
  )
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="wrap relative grid items-start gap-16 overflow-x-clip lg:grid-cols-2 lg:gap-24"
    >
      {/* Left side */}
      <motion.div {...fade()} className="flex min-w-0 flex-col items-start gap-8">
        <p className="text-sm text-(--muted)" style={mono}>
          ( contact )
        </p>

        <h2 className="font-(family-name:--display) text-5xl font-extrabold leading-[1] tracking-tighter text-white sm:text-6xl lg:text-7xl">
          Got an idea?
          <br />
          Let's{' '}
          <span className="bg-gradient-to-r from-(--blue) via-sky-400 to-cyan-300 bg-clip-text text-transparent">
            talk.
          </span>
        </h2>

        <p className="max-w-md text-lg leading-relaxed text-(--muted)">
          Have a question or a project in mind? Send me a message and I'll reply soon.
        </p>

        {/* big email link */}
        <a
          href={`mailto:${ME.email}`}
          className="group inline-flex max-w-full items-center gap-3 border-b border-(--line) pb-2 text-xl font-medium text-white transition-colors hover:border-cyan-300 hover:text-cyan-300 sm:text-2xl"
        >
          <span className="truncate">{ME.email}</span>
          <FiArrowUpRight className="shrink-0 transition-transform duration-300 group-hover:rotate-45" />
        </a>

        {/* other ways to reach me */}
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-base">
          <a href={ME.github} target="_blank" rel="noreferrer" className={LINK}>
            <FaGithub /> GitHub
          </a>
          <a href={ME.linkedin} target="_blank" rel="noreferrer" className={LINK}>
            <FaLinkedinIn /> LinkedIn
          </a>
          <button type="button" onClick={() => window.dispatchEvent(new Event('open-chat'))} className={LINK}>
            <FiMessageCircle /> Ask my AI
          </button>
        </div>
      </motion.div>

      {/* Right side: form with animated blue glow */}
      <motion.div {...fade(1)} className="relative min-w-0 lg:pt-10">
        {/* moving blue glow */}
        <motion.div
          aria-hidden="true"
          // className="pointer-events-none absolute right-0 top-0 size-80 rounded-full blur-[90px]"
          // animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.9, 0.5], x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* second glow, cyan, moves the other way */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 left-0 size-72 rounded-full  blur-[90px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.8, 0.4], x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* glowing card around the form */}
        <motion.div
          className="relative rounded-3xl border border-cyan-300/25 p-6 backdrop-blur-md sm:p-10"

          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ContactForm />
        </motion.div>
      </motion.div>
      <footer className="col-span-full border-t border-(--line) pt-8 text-center text-sm text-(--muted)">
        © {new Date().getFullYear()} Monsaf Ali
      </footer>
    </section>
  )
}