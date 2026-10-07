// Free backup image for old web projects saved without an image
export const mshotUrl = (url) =>
    url ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=900&h=600` : null

export function imageSources(project) {
    if (project.image_url) return [project.image_url]
    if (project.type === 'web' && project.live_url) return [mshotUrl(project.live_url)]
    return []
}