import { Navigate, useParams } from 'react-router-dom'

import Projects from '../components/Projects'
import { isValidType } from '../lib/projectRoutes'

/**
 * Handles both:
 *   /projects        -> all types
 *   /projects/:type  -> one type (e.g. /projects/web)
 */
export default function ProjectsPage() {
  const { type } = useParams()

  // Unknown type (/projects/foo) -> fall back to the full list.
  if (type !== undefined && !isValidType(type)) {
    return <Navigate to="/projects" replace />
  }

  return (
    <div className="pt-28">
      <Projects type={type ?? 'all'} />
    </div>
  )
}
