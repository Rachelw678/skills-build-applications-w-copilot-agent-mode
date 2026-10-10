import { useEffect, useState } from 'react'
import { API_BASE_URL, readCollection } from '../config/api.js'

function Users() {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_BASE_URL}/api/users/`, { signal: controller.signal })
      .then(readCollection)
      .then((records) => {
        setUsers(records)
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
        <p className="eyebrow">THE OCTOFIT COMMUNITY</p>
        <h2>Members</h2>
      </div>
      {status.loading && <p role="status">Loading members…</p>}
      {status.error && <p className="alert alert-danger">{status.error}</p>}
      {!status.loading && !status.error && users.length === 0 && (
        <p className="text-secondary">No members have joined yet.</p>
      )}
      {users.length > 0 && (
        <div className="list-group">
          {users.map((user) => (
            <div className="list-group-item d-flex align-items-center gap-3 py-3" key={user._id}>
              <span
                className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40 }}
                aria-hidden="true"
              >
                {user.name?.charAt(0) ?? '?'}
              </span>
              <div>
                <strong>{user.name}</strong>
                <div className="small text-secondary">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Users
