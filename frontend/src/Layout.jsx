import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export default function Layout({ children }) {
  return (
    <div data-theme="mytheme" className="min-h-screen bg-base-200">
      <nav className="navbar bg-base-100 shadow mb-4">
        <div className="container mx-auto flex justify-between">
          <Link to="/patients" className="btn btn-ghost text-xl">DietApp</Link>
          <ul className="menu menu-horizontal px-1">
            <li>
              <NavLink to="/patients" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>Patients</NavLink>
            </li>
            <li>
              <NavLink to="/admin" className={({ isActive }) => isActive ? 'active font-semibold' : ''}>Dietists</NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <main className="container mx-auto px-4 pb-10">{children}</main>
    </div>
  )
}
