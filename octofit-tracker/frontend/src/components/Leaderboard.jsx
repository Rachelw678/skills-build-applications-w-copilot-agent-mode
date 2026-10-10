import { useEffect, useState } from 'react'
import { API_BASE_URL, readCollection } from '../config/api.js'

function Leaderboard() {
  const [entries, setEntries] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_BASE_URL}/api/leaderboard/`, { signal: controller.signal })
      .then(readCollection)
      .then((records) => {
        setEntries(records)
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
        <p className="eyebrow">CELEBRATE THE EFFORT</p>
        <h2>Leaderboard</h2>
      </div>
      {status.loading && <p role="status">Loading leaderboard…</p>}
      {status.error && <p className="alert alert-danger">{status.error}</p>}
      {!status.loading && !status.error && entries.length === 0 && (
        <p className="text-secondary">The leaderboard is waiting for its first entries.</p>
      )}
      {entries.length > 0 && (
        <div className="list-group">
          {entries.map((entry) => (
            <div
              className="list-group-item d-flex align-items-center gap-3 py-3"
              key={entry._id}
            >
              <span className="badge text-bg-success rounded-pill">{entry.rank}</span>
              <div className="flex-grow-1">
                <strong>{entry.user?.name ?? 'OctoFit member'}</strong>
                {entry.user?.email && (
                  <div className="small text-secondary">{entry.user.email}</div>
                )}
              </div>
              <span className="fw-semibold">{entry.points} pts</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Leaderboard
