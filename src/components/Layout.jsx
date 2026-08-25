import { Outlet, Link } from 'react-router-dom'
import { Menu, X, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-display text-xl font-bold flex items-center gap-2">
              <span className="bg-accent text-primary px-2 py-1 rounded text-sm font-bold">ROI</span>
              Calculadora
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="https://acrux.life" className="hover:text-accent transition-colors flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" />
                Volver a ACRUX
              </Link>
            </nav>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-2">
              <Link
                to="https://acrux.life"
                className="px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a ACRUX
              </Link>
            </nav>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-secondary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm opacity-80">
          © 2025 ACRUX Consultores.
          <Link to="https://acrux.life/privacidad" className="underline hover:opacity-100 mx-2">Privacidad</Link>
          <Link to="https://acrux.life/terminos" className="underline hover:opacity-100 mx-2">Términos</Link>
          <Link to="https://acrux.life/cookies" className="underline hover:opacity-100 mx-2">Cookies</Link>
        </div>
      </footer>
    </div>
  )
}