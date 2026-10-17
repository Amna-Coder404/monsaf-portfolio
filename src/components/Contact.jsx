import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import {
  FiAlertCircle,
  FiArrowRight,
  FiArrowUpRight,
  FiMessageCircle,
  FiCheckCircle,
} from 'react-icons/fi'
import { ME } from '../data'

const SERVICE_ID = 'service_93evwe8'
const TEMPLATE_ID = 'template_u6z21cq'
const PUBLIC_KEY = 'gf9OfKiAGstx0sCiv'

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value || '')

const inputClass =
  'mt-2 w-full rounded-xl border border-(--line) bg-(--fog) px-4 py-3 text-sm text-(--ink) outline-none transition-colors placeholder:text-(--muted)/60 focus:border-(--blue) focus:bg-(--surface) disabled:cursor-not-allowed disabled:opacity-60'

const linkClass =
  'inline-flex items-center gap-2 text-sm text-(--muted) transition-colors hover:text-(--blue)'

function Field({
  id,
  label,
  value,
  error,
  textarea = false,
  ...props
}) {
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-(--ink)"
      >
        {label}
      </label>

      <Tag
        id={id}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} ${textarea ? 'min-h-32 resize-y' : ''
          } ${error ? 'border-red-400 focus:border-red-400' : ''}`}
        {...props}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 flex items-center gap-2 text-xs text-red-400"
        >
          <FiAlertCircle className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  })

  const [status, setStatus] = useState('idle')
  const [showErrors, setShowErrors] = useState(false)

  const updateField = (key) => (event) => {
    const value = event.target.value

    setForm((current) => ({
      ...current,
      [key]: value,
    }))

    if (status === 'error') setStatus('idle')
  }

  const errors = {
    name:
      form.name.trim().length < 2
        ? 'Please enter at least 2 characters.'
        : '',
    email: !isEmail(form.email.trim())
      ? 'Please enter a valid email address.'
      : '',
    message:
      form.message.trim().length < 4
        ? 'Please enter at least 4 characters.'
        : '',
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const isSending = status === 'sending'

  const submit = async (event) => {
    event.preventDefault()

    if (isSending) return

    setShowErrors(true)

    if (hasErrors) return

    // Honeypot field for basic bot filtering.
    if (form.website) {
      setStatus('sent')
      return
    }

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
    } catch (error) {
      console.error('Contact form submission failed:', error)
      setStatus('error')
    }
  }

  const resetForm = () => {
    setForm({
      name: '',
      email: '',
      message: '',
      website: '',
    })
    setShowErrors(false)
    setStatus('idle')
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="flex min-h-80 flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-5 grid size-14 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
          <FiCheckCircle className="size-7 text-emerald-400" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-(--ink)">
          Message sent
        </h3>

        <p className="mt-3 max-w-sm text-sm leading-6 text-(--muted)">
          Thank you for reaching out. I'll get back to you at{' '}
          <span className="break-all font-medium text-(--ink)">
            {form.email}
          </span>.
        </p>

        <button
          type="button"
          onClick={resetForm}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-(--ink) transition-colors hover:text-(--blue)"
        >
          Send another message <FiArrowRight />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="mb-7">
        <h3 className="text-xl font-semibold text-(--ink)">
          Send a message
        </h3>
        <p className="mt-2 text-sm leading-6 text-(--muted)">
          Fill in the details below and I'll get back to you.
        </p>
      </div>

      <Field
        id="contact-name"
        label="Your name"
        placeholder="Enter your name"
        value={form.name}
        onChange={updateField('name')}
        autoComplete="name"
        maxLength={80}
        disabled={isSending}
        error={showErrors ? errors.name : ''}
      />

      <Field
        id="contact-email"
        label="Email address"
        type="email"
        inputMode="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={updateField('email')}
        autoComplete="email"
        maxLength={120}
        disabled={isSending}
        error={showErrors ? errors.email : ''}
      />

      <Field
        id="contact-message"
        label="Your message"
        textarea
        rows={4}
        placeholder="Tell me a little about your idea..."
        value={form.message}
        onChange={updateField('message')}
        maxLength={1500}
        disabled={isSending}
        error={showErrors ? errors.message : ''}
      />

      <p className="text-right text-xs text-(--muted)">
        {form.message.length}/1500 characters
      </p>

      {/* Honeypot field */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          value={form.website}
          onChange={updateField('website')}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === 'error' && (
        <p role="alert" className="flex gap-2 text-sm text-red-400">
          <FiAlertCircle className="mt-0.5 shrink-0" />
          <span>
            Your message could not be sent. Please try again or email{' '}
            <a
              href={`mailto:${ME.email}`}
              className="underline underline-offset-4"
            >
              {ME.email}
            </a>.
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--blue) px-5 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
      >
        {isSending ? 'Sending message...' : 'Send message'}
        <FiArrowRight
          className={`transition-transform ${isSending ? '' : 'group-hover:translate-x-1'
            }`}
        />
      </button>

      <p className="text-xs text-(--muted)">
        Your details are used only to respond to your message.
      </p>
    </form>
  )
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="wrap grid items-start gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:gap-20"
    >
      {/* Contact information */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="min-w-0"
      >
        <p className="text-sm font-medium text-(--blue)">
          GET IN TOUCH
        </p>

        <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-(--ink) sm:text-5xl">
          Have an idea?
          <br />
          Let's{' '}
          <span className="text-(--blue)">talk.</span>
        </h2>

        <p className="mt-5 max-w-md text-base leading-7 text-(--muted)">
          Have a question or a project in mind? Send me a message.
          I'd be happy to hear from you.
        </p>

        <a
          href={`mailto:${ME.email}`}
          className="mt-8 inline-flex max-w-full items-center gap-2 break-all text-base font-medium text-(--ink) transition-colors hover:text-(--blue) sm:text-lg"
        >
          {ME.email}
          <FiArrowUpRight className="shrink-0" />
        </a>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={ME.github}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <FaGithub className="size-4" />
            GitHub
          </a>

          <a
            href={ME.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <FaLinkedinIn className="size-4" />
            LinkedIn
          </a>

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new Event('open-chat'))
            }
            className={linkClass}
          >
            <FiMessageCircle className="size-4" />
            Ask my AI
          </button>
        </div>
      </motion.div>

      {/* Contact form card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="min-w-0 rounded-2xl border border-(--line) bg-(--paper) p-5 transition-colors duration-300 sm:p-8"
      >
        <ContactForm />
      </motion.div>

      <footer className="col-span-full border-t border-(--line) pt-6 text-center text-sm text-(--muted)">
        © {new Date().getFullYear()} Monsaf Ali. All rights reserved.
      </footer>
    </section>
  )
}