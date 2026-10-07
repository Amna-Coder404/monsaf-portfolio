import { supabase } from './supabase'

const rank = { mobile: 0, web: 1 } // mobile first, it's my main skill

export async function fetchProjects() {
  if (!supabase) throw new Error('Supabase keys missing in .env')

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  // Pinned first → then mobile → then web
  // Newest stays first within the same type
  return [...data].sort((a, b) => {
    // 1. Pinned project first
    if (a.is_pinned !== b.is_pinned) {
      return Number(b.is_pinned) - Number(a.is_pinned)
    }

    // 2. Mobile before web
    if (rank[a.type] !== rank[b.type]) {
      return rank[a.type] - rank[b.type]
    }

    // 3. Newest first
    return new Date(b.created_at) - new Date(a.created_at)
  })
}
export async function fetchProject(id) {
  if (!supabase) throw new Error('Supabase keys missing in .env')

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Supabase error:', error)
    throw error
  }

  return data // null agar nahi mila
}