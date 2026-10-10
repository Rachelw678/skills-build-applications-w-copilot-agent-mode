import { useEffect, useState } from 'react'
import { API_BASE_URL, readCollection } from '../config/api.js'

function Teams() {
  const [teams, setTeams] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_BASE_URL}/api/teams/`, { signal: controller.signal })
      .then(readCollection)
      .then((records) => {
        setTeams(records)
        setStatus({ loading: false, error: '' })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setStatus({ loading: false, error: error.message })
        }
      })

    return () => controller.abort()
  }, [])

  return (
    <div>
      <div className="section-heading mb-4">
        <p className="eyebrow">BETTER TOGETHER</p>
        <h2>Teams</h2>
      </div>
      {status.loading && <p role="status">Loading teams…</p>}
      {status.error && <p className="alert alert-danger">{status.error}</p>}
      {!status.loading && !status.error && teams.length === 0 && (
        <p className="text-secondary">No teams have been created yet.</p>
      )}
      <div className="row g-3">
        {teams.map((team) => (
          <div className="col-md-6" key={team._id}>
            <article className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h3 className="h5 card-title">{team.name}</h3>
                <p className="card-text text-secondary">
                  {team.description || 'A team ready to move together.'}
                </p>
                <span className="badge text-bg-light">
                  {team.members?.length ?? 0} members
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Teams
