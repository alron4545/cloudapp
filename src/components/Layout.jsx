import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Landscape from './Landscape.jsx'
import UvuMark from './UvuMark.jsx'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Me' },
  { to: '/assignments', label: 'Assignments' },
  { to: '/photos', label: 'Photos' },
  { to: '/other', label: 'Other' },
]

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="scene">
      <Landscape />

      <header className="site-header">
        <NavLink to="/" className="site-header__brand">
          <UvuMark small />
          <span>
            <strong>Michael Schuler</strong>
            <small>Utah Valley University</small>
          </span>
        </NavLink>

        <nav aria-label="Main">
          <ul className="site-nav">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className="site-nav__link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="page">
        <Outlet />
      </main>

      <footer className="credit">Cloud Computing &middot; Fall 2026</footer>
    </div>
  )
}
