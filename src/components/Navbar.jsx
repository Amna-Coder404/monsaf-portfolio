import { useLocation, useNavigate } from 'react-router-dom'
import ColorPicker from './ColorPicker'

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const goHome = () => {
    if (pathname !== '/') {
      navigate('/')
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-(--line) bg-(--bg)/90 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Logo */}
        <button
          type="button"
          onClick={goHome}
          aria-label="Go to homepage"
          className="text-lg font-extrabold tracking-tight text-(--ink) transition-opacity hover:opacity-80 sm:text-xl"
        >
          monsaf<span className="text-(--blue)">.dev</span>
        </button>

        {/* Theme color picker */}
        <ColorPicker />
      </nav>
    </header>
  )
}