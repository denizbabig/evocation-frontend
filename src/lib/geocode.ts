import axios from 'axios'
const base = import.meta.env.VITE_API_BASE ?? '/api'

export async function geocodeSearch(q: string, limit = 5) {
  const { data } = await axios.get(`${base}/geocode/search`, { params: { q, limit } })
  return data as Array<{ lat: string; lon: string; display_name: string }>
}

export async function geocodeReverse(lat: number, lon: number) {
  const { data } = await axios.get(`${base}/geocode/reverse`, { params: { lat, lon } })
  return data
}


export async function geocodeSuggest(q: string, limit = 5, lang = 'de') {
  const { data } = await axios.get(`${base}/geocode/suggest`, { params: { q, limit, lang } })
  return data as Array<{ lat: number; lon: number; display_name: string }>
}
