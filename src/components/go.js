// Smooth-scroll to a section id (uses Lenis when available)
export function go(id) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -70 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
