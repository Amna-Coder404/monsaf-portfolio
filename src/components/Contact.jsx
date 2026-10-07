import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import {
  FiAlertCircle,
  FiArrowUpRight,
  FiEdit3,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiUser,
} from 'react-icons/fi'
import { ME } from '../data'

// EmailJS config
const SERVICE_ID = 'service_93evwe8'
const TEMPLATE_ID = 'template_u6z21cq'
const PUBLIC_KEY = 'gf9OfKiAGstx0sCiv'

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || '')

const mono = { fontFamily: "'JetBrains Mono','Fira Code',ui-monospace,SFMono-Regular,Menlo,monospace" }

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
})

/* rows on the left: every way to reach me, in one list */
const ROW =
  'group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-(--fog)'

function RowIcon({ children }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-(--line) bg-(--fog) text-lg text-(--blue) transition-colors group-hover:border-(--blue) group-hover:bg-(--blue) group-hover:text-white">
      {children}
    </span>
  )
}

function Arrow() {
  return (
    <FiArrowUpRight className="shrink-0 text-(--muted) transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
  )
}

/* Field: label on top, icon inside */
function Field({ id, label, icon: Icon, value, error, textarea = false, counter, ...props }) {
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-(--muted)">
        {label}
      </label>

      <div className="relative">
        <Tag
          id={id}
          value={value}
          aria-invalid={!!error}
          className={`w-full rounded-lg border bg-(--fog) pl-11 pr-4 text-base text-white outline-none transition-colors placeholder:text-(--muted)/50 focus:ring-2 disabled:opacity-60 ${textarea ? 'resize-none py-3' : 'py-3'
            } ${error
              ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
              : 'border-(--line) focus:border-(--blue) focus:ring-(--blue)/25'
            }`}
          {...props}
        />
        <Icon className="pointer-events-none absolute left-3.5 top-3.5 text-lg text-(--muted)" />
      </div>

      <div className="mt-1.5 flex items-start justify-between gap-3">
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-sm text-red-400"
            >
              <FiAlertCircle className="shrink-0" /> {error}
            </motion.p>
          )}
        </AnimatePresence>
        {counter && (
          <span className="ml-auto text-xs text-(--muted)" style={mono}>
            {counter}
          </span>
        )}
      </div>
    </div>
  )
}

function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="size-16" fill="none">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        stroke="#40bed6"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d="M15 27l8 8 14-16"
        stroke="#40bed6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      />
    </svg>
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
    message: form.message.trim().length < 10 ? 'Please write a few words (at least 10 characters)' : '',
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

  return (
    <div className="relative overflow-hidden rounded-2xl border border-(--line) bg-(--paper) shadow-2xl shadow-black/40">
      <div className="pointer-events-none absolute -right-20 -top-24 size-60 rounded-full bg-(--blue)/15 blur-3xl" />

      {/* header strip */}
      <div
        className="relative flex items-center justify-between border-b border-(--line) px-6 py-3 text-xs text-(--muted)"
        style={mono}
      >
        <span className="flex items-center gap-2">
          <FiSend aria-hidden="true" /> new message
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-(--blue)" /> online
        </span>
      </div>

      <div className="relative p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-[24rem] flex-col items-center justify-center gap-4 text-center"
            >
              <SuccessCheck />
              <h3 className="font-(family-name:--display) text-2xl font-bold text-white">Message sent</h3>
              <p className="max-w-xs text-(--muted)">
                Thanks for reaching out. I'll reply to{' '}
                <span className="break-all text-white">{form.email}</span> soon.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-2 rounded-lg border border-(--line) bg-(--fog) px-6 py-2.5 font-semibold text-white transition-colors hover:border-(--blue) hover:bg-(--blue)"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="relative flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="c-name"
                  label="Name"
                  icon={FiUser}
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
                  label="Email"
                  icon={FiMail}
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
              </div>

              <Field
                id="c-message"
                label="Message"
                icon={FiEdit3}
                textarea
                rows={6}
                placeholder="Tell me about your idea or project"
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
                <p className="flex items-start gap-2 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
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
                whileTap={{ scale: 0.98 }}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-(--blue) px-7 py-3.5 text-base font-semibold text-white transition-[filter] hover:brightness-110 disabled:opacity-60"
              >
                {locked ? (
                  <>
                    <FiSend className="animate-pulse" /> Sending...
                  </>
                ) : (
                  <>
                    Send message
                    <FiSend className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="wrap relative grid items-start gap-10 overflow-x-clip lg:grid-cols-[1fr_1.1fr] lg:gap-14"
    >
      {/* Left side */}
      <motion.div {...fade()} className="flex min-w-0 flex-col items-start gap-6 lg:sticky lg:top-28">
        <h2 className="h2 text-balance" style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1.1 }}>
          Let's build something together
        </h2>

        <p className="max-w-md text-base text-(--muted) sm:text-lg">
          Have a question or an idea? Message me and let's collaborate. I'll reply soon!
        </p>

        {/* every way to reach me, one list */}
        <div className="w-full max-w-md divide-y divide-(--line) overflow-hidden rounded-2xl border border-(--line) bg-(--paper)">
          <a href={`mailto:${ME.email}`} className={ROW}>
            <RowIcon>
              <FiMail />
            </RowIcon>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-(--muted)">Email</span>
              <span className="block truncate font-medium text-white">{ME.email}</span>
            </span>
            <Arrow />
          </a>

          <button type="button" onClick={() => window.dispatchEvent(new Event('open-chat'))} className={ROW}>
            <RowIcon>
              <FiMessageCircle />
            </RowIcon>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-(--muted)">Have a question?</span>
              <span className="block font-medium text-white">Ask my AI assistant</span>
            </span>
            <Arrow />
          </button>

          <a href={ME.github} target="_blank" rel="noreferrer" className={ROW}>
            <RowIcon>
              <FaGithub />
            </RowIcon>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-(--muted)">Code</span>
              <span className="block font-medium text-white">GitHub</span>
            </span>
            <Arrow />
          </a>

          <a href={ME.linkedin} target="_blank" rel="noreferrer" className={ROW}>
            <RowIcon>
              <FaLinkedinIn />
            </RowIcon>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-(--muted)">Network</span>
              <span className="block font-medium text-white">LinkedIn</span>
            </span>
            <Arrow />
          </a>
        </div>
      </motion.div>

      {/* Right side: form */}
      <motion.div {...fade(1)} className="min-w-0">
        <ContactForm />
      </motion.div>

      <footer className="col-span-full border-t border-(--line) pt-8 text-center text-sm text-(--muted)">
        © {new Date().getFullYear()} Monsaf Ali
      </footer>
    </section>
  )
}