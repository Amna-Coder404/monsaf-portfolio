// Single source of truth for project types and project URLs.
// Add a new type here (e.g. 'desktop') and the whole app picks it up.

export const PROJECT_TYPES = [
  { id: 'mobile', label: 'Mobile' },
  { id: 'web', label: 'Web' },
]

export const isValidType = (type) => PROJECT_TYPES.some((t) => t.id === type)

export const typeLabel = (type) =>
  PROJECT_TYPES.find((t) => t.id === type)?.label ?? 'All'

// /projects            -> all types
// /projects/web        -> only web projects
export const projectsPath = (type) =>
  type && type !== 'all' ? `/projects/${type}` : '/projects'

// /projects/web/12     -> project detail
export const projectPath = (project) => `/projects/${project.type}/${project.id}`
