import { useEffect, useState } from 'react'
import { API_BASE_URL, readCollection } from '../config/api.js'

function Workouts() {
  const [workouts, setWorkouts] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${API_BASE_URL}/api/workouts/`, { signal: controller.signal })
      .then(readCollection)
      .then((records) => {
        setWorkouts(records)
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
        <p className="eyebrow">A PLAN FOR YOUR NEXT SESSION</p>
        <h2>Workout ideas</h2>
      </div>
      {status.loading && <p role="status">Loading workouts…</p>}
      {status.error && <p className="alert alert-danger">{status.error}</p>}
      {!status.loading && !status.error && workouts.length === 0 && (
        <p className="text-secondary">No workout suggestions are available yet.</p>
      )}
      <div className="row g-3">
        {workouts.map((workout) => (
          <div className="col-md-6" key={workout._id}>
            <article className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between gap-2">
                  <h3 className="h5 card-title">{workout.title}</h3>
                  <span className="badge text-bg-light text-capitalize align-self-start">
                    {workout.difficulty}
                  </span>
                </div>
                <p className="card-text text-secondary">{workout.description}</p>
                <p className="small mb-2">
                  <span className="text-capitalize">{workout.activityType}</span>
                  {' · '}
                  {workout.durationMinutes} minutes
                </p>
                {workout.instructions?.length > 0 && (
                  <ol className="small mb-0">
                    {workout.instructions.map((instruction, index) => (
                      <li key={`${workout._id}-step-${index}`}>{instruction}</li>
                    ))}
                  </ol>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Workouts
