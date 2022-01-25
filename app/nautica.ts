import type { TypedResponse } from "~/remix-typed"

const apiUrl = "https://ksm.dev/app/songs"

export type NauticaPage = {
  data: NauticaSong[]
  links: NauticaPageLinks
  meta: NauticaPageMeta
}

export type NauticaSong = {
  id: string
  user_id: string
  title: string
  artist: string
  jacket_filename: string
  description?: string
  download_link: any
  downloads: number
  has_preview: number
  hidden: number
  mojibake: number
  uploaded_at: string
  created_at: string
  updated_at: string
  jacket_url: string
  preview_url: string
  cdn_download_url: string
  user: NauticaUser
  charts: NauticaChart[]
  tags: NauticaTag[]
}

export type NauticaUser = {
  id: string
  name: string
  urlRoute: string
  twitter?: string
  youtube?: string
  bio?: string
  created_at: string
  songCount: number
}

export type NauticaChart = {
  id: string
  user_id: string
  song_id: string
  difficulty: number
  level: number
  effector: string
  video_link?: string
  created_at: string
  updated_at: string
}

export type NauticaTag = {
  id: string
  song_id: string
  value: string
  created_at: string
  updated_at: string
}

export type NauticaPageLinks = {
  first?: string
  last?: string
  prev?: string
  next?: string
}

export type NauticaPageMeta = {
  current_page: number
  from: number
  last_page: number
  path: string
  per_page: number
  to: number
  total: number
}

export function loadSongs({
  page,
  query,
}: {
  page?: number
  query?: string
} = {}): Promise<TypedResponse<NauticaPage>> {
  const url = new URL(apiUrl)
  url.searchParams.set("level", "18")
  if (page) url.searchParams.set("page", String(page))
  if (query) url.searchParams.set("q", query)
  return fetch(url.toString())
}
