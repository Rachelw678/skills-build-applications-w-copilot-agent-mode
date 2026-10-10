import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import './App.css'

const sections = [
  { path: '/', label: 'Overview', title: 'Overview' },
  { path: '/activities', label: 'Activities', title: 'Activity log' },
  { path: '/teams', label: 'Teams', title: 'Teams' },
  { path: '/leaderboard', label: 'Leaderboard', title: 'Leaderboard' },
  { path: '/workouts', label: 'Workouts', title: 'Workout ideas' },
]

function App() {
  const [apiStatus, setApiStatus] = useState('Checking API')

  useEffect(() => {
    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json()
      })
      .then((data) => setApiStatus(`API ${data.status} · MongoDB ${data.database}`))
      .catch(() => setApiStatus('API unavailable'))
  }, [])

  return (
    <BrowserRouter>
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
            <p className="welcome-copy">A clearer view of your movement, your team, and what comes next.</p>
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
                {sections.map((section) => (
                  <Route
                    key={section.path}
                    path={section.path}
                    element={
                      <div className="section-heading">
                        <p className="eyebrow">OCTOFIT TRACKER</p>
                        <h2>{section.title}</h2>
                      </div>
                    }
                  />
                ))}
              </Routes>
            </section>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
