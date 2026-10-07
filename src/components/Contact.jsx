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
const SERVICE_ID = 'service_o1lvn8l'
const TEMPLATE_ID = 'template_6txi5km'
const PUBLIC_KEY = 'gf9OfKiAGstx0sCiv'

const isEmail = (v) => /^\S+@\S+\.\S+$/.test(v || '')



const fade = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { delay: i * 0.1, duration: 0.5 },
})

const SOCIALS = [
  { label: 'GitHub', href: ME.github, icon: FaGithub },
  { label: 'LinkedIn', href: ME.linkedin, icon: FaLinkedinIn },
]

/* Floating-label field */
function Field({ id, label, icon: Icon, value, error, textarea = false, counter, ...props }) {
  const [focused, setFocused] = useState(false)
  const floated = focused || value.length > 0
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div>
      <div className="relative">
        <Tag
          id={id}
          value={value}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          placeholder=""
          className={`w-full rounded-2xl border bg-(--fog) pl-12 pr-4 text-base text-white outline-none transition focus:ring-4 disabled:opacity-60 ${textarea ? 'resize-none pb-7 pt-7' : 'pb-2 pt-6'
            } ${error
              ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/20'
              : 'border-(--line) focus:border-(--blue) focus:ring-(--blue)/20'
            }`}
          {...props}
        />

        <Icon
          className={`pointer-events-none absolute left-4 top-[1.15rem] text-lg transition-colors ${focused ? 'text-(--blue)' : 'text-(--muted)'
            }`}
        />

        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-12 origin-left transition-all duration-200 ${floated ? 'top-1.5 text-xs' : 'top-[1.05rem] text-base'
            } ${focused ? 'text-(--blue)' : 'text-(--muted)'}`}
        >
          {label}
        </label>

        {counter && (
          <span className="pointer-events-none absolute bottom-2 right-4 text-xs text-(--muted)">{counter}</span>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400"
          >
            <FiAlertCircle className="shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function SuccessCheck() {
  return (
    <svg viewBox="0 0 52 52" className="size-20" fill="none">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        stroke="#10b981"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d="M15 27l8 8 14-16"
        stroke="#10b981"
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
    message: form.message.trim(),
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
          message: `Topic: ${topic}\n\n${form.message.trim()}`,
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
    setForm({ name: '', email: '', message: '', website: '' });

    setShowErrors(false);
    setStatus('idle');
  }

  const locked = status === 'sending'

  return (
    <div
      className="relative rounded-[28px] p-px shadow-2xl shadow-black/40"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgba(122,162,255,0.55), rgba(255,255,255,0.06) 40%, rgba(47,91,255,0.45))',
      }}
    >
      <div className="relative overflow-hidden rounded-[27px] bg-[#0a0d1c] p-5 sm:p-8">
        {/* glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-(--blue)/20 blur-3xl" />

        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative flex min-h-[26rem] flex-col items-center justify-center gap-4 text-center"
            >
              <SuccessCheck />
              <h3 className="text-2xl font-semibold">Message sent!</h3>
              <p className="max-w-xs text-(--muted)">
                Thanks for reaching out. I'll reply to <span className="break-all text-white">{form.email}</span>{' '}
                soon.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-2 rounded-full border-2 border-(--blue)/60 px-6 py-2.5 font-semibold transition-colors hover:bg-(--blue)"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} noValidate className="relative flex flex-col gap-5">
              {/* header */}
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-(--blue) text-xl text-white shadow-lg shadow-(--blue)/30">
                  <FiSend />
                </span>
                <div>
                  <h3 className="text-lg font-semibold leading-tight">Send me a message</h3>
                  <p className="text-sm text-(--muted)">I read every message myself</p>
                </div>
              </div>



              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="c-name"
                  label="Your name"
                  icon={FiUser}
                  value={form.name}
                  onChange={set('name')}
                  disabled={locked}
                  maxLength={80}
                  autoComplete="name"
                  error={showErrors ? errors.name : ''}
                />
                <Field
                  id="c-email"
                  label="Your email"
                  icon={FiMail}
                  type="email"
                  inputMode="email"
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
                label="Tell me about your idea or project"
                icon={FiEdit3}
                textarea
                rows={5}
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
                <p className="flex items-start gap-2 rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
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
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-(--blue) px-7 py-4 text-base font-semibold text-white shadow-lg shadow-(--blue)/40 transition-[filter] hover:brightness-110 disabled:opacity-60"
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
      <motion.div {...fade()} className="flex min-w-0 flex-col items-start gap-5 lg:sticky lg:top-28">
        <span className="rounded-full border border-(--line) bg-(--fog) px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-(--muted)">
          Contact
        </span>

        <h2 className="h2 text-balance" style={{ fontSize: 'clamp(2rem, 7vw, 3.5rem)', lineHeight: 1.1 }}>
          Let's build something{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(90deg, #7aa2ff, #2f5bff)' }}
          >
            together
          </span>
        </h2>

        <p className="max-w-md text-base text-(--muted) sm:text-lg">
          Have a question or an idea? Message me and let's collaborate. I'll reply soon!
        </p>

        <div className="flex w-full max-w-md flex-col gap-3">
          <a
            href={`mailto:${ME.email}`}
            className="group flex min-w-0 items-center gap-4 rounded-2xl border border-(--line) bg-(--fog) p-4 transition-colors hover:border-(--blue)"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--blue) text-lg text-white">
              <FiMail />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-(--muted)">Email</span>
              <span className="block truncate font-medium">{ME.email}</span>
            </span>
            <FiArrowUpRight className="shrink-0 text-(--muted) transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          </a>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-chat'))}
            className="group flex items-center gap-4 rounded-2xl border border-(--line) bg-(--fog) p-4 text-left transition-colors hover:border-(--blue)"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-(--blue) text-lg text-white">
              <FiMessageCircle />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm text-(--muted)">Have a question?</span>
              <span className="block font-medium">Ask my AI assistant</span>
            </span>
            <FiArrowUpRight className="shrink-0 text-(--muted) transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          {SOCIALS.map((s) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-(--line) bg-(--fog) py-2.5 pl-4 pr-5 text-sm font-medium transition-colors hover:border-(--blue) hover:bg-(--blue) hover:text-white"
            >
              <s.icon className="text-lg" /> {s.label}
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Right side: form */}
      <motion.div {...fade(1)} className="min-w-0">
        <ContactForm />
      </motion.div>

      <footer className="col-span-full border-t border-(--line) pt-8 text-center text-sm text-(--muted)">
        © {new Date().getFullYear()} Amna Ashraf
      </footer>
    </section>
  )
}