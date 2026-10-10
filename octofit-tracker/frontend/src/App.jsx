import { useEffect, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import { API_BASE_URL } from './config/api.js'
import './App.css'

const sections = [
  { path: '/', label: 'Overview', title: 'Overview' },
  { path: '/activities', label: 'Activities', title: 'Activity log' },
  { path: '/leaderboard', label: 'Leaderboard', title: 'Leaderboard' },
  { path: '/teams', label: 'Teams', title: 'Teams' },
  { path: '/users', label: 'Users', title: 'Members' },
  { path: '/workouts', label: 'Workouts', title: 'Workout ideas' },
]

function Overview() {
  return (
    <div className="section-heading">
      <p className="eyebrow">OCTOFIT TRACKER</p>
      <h2>Overview</h2>
      <p className="text-secondary mt-3">
        Track your activity, find your team, and keep moving toward your goals.
      </p>
    </div>
  )
}

function App() {
  const [apiStatus, setApiStatus] = useState('Checking API')

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`API returned HTTP ${response.status}`)
        return response.json()
      })
      .then((data) => setApiStatus(`API ${data.status} · MongoDB ${data.database}`))
      .catch((error) => {
        if (error.name !== 'AbortError') setApiStatus('API unavailable')
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="OctoFit Tracker home">
          <img src={logo} alt="" />
          <span>OctoFit <strong>Tracker</strong></span>
        </NavLink>
        <span className="connection-status">
          <span className={`status-dot ${apiStatus.includes('unavailable') ? 'offline' : ''}`} />
          {apiStatus}
        </span>
      </header>

      <main className="container-fluid app-content">
        <section className="welcome-band">
          <p className="eyebrow">YOUR TRAINING DESK</p>
          <h1>Move with purpose.</h1>
          <p className="welcome-copy">
            A clearer view of your movement, your team, and what comes next.
          </p>
        </section>

        <div className="workspace row g-0">
          <nav className="section-nav col-lg-3" aria-label="Tracker sections">
            <p className="nav-heading">WORKSPACE</p>
            {sections.map((section) => (
              <NavLink
                key={section.path}
                to={section.path}
                end={section.path === '/'}
                className={({ isActive }) => `section-link${isActive ? ' active' : ''}`}
              >
                {section.label}
              </NavLink>
            ))}
          </nav>

          <section className="section-view col-lg-9">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/users" element={<Users />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="*" element={<h2>Page not found</h2>} />
            </Routes>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
