import { useEffect, useState } from 'react'
import { API_BASE_URL, readCollection } from '../config/api.js'

function Activities() {
  const [activities, setActivities] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_BASE_URL}/api/activities/`, { signal: controller.signal })
      .then(readCollection)
      .then((records) => {
        setActivities(records)
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
        <p className="eyebrow">YOUR MOVEMENT</p>
        <h2>Activity log</h2>
      </div>
      {status.loading && <p role="status">Loading activities…</p>}
      {status.error && <p className="alert alert-danger">{status.error}</p>}
      {!status.loading && !status.error && activities.length === 0 && (
        <p className="text-secondary">No activities have been logged yet.</p>
      )}
      {activities.length > 0 && (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Duration</th>
                <th scope="col">Distance</th>
                <th scope="col">Calories</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id}>
                  <td className="text-capitalize">{activity.activityType}</td>
                  <td>{activity.durationMinutes} min</td>
                  <td>{activity.distanceKm != null ? `${activity.distanceKm} km` : '—'}</td>
                  <td>{activity.calories ?? '—'}</td>
                  <td>
                    {activity.occurredAt
                      ? new Date(activity.occurredAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Activities
