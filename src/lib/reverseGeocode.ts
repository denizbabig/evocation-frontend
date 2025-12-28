/* Public API */
export function primaryLabel(name: string) {
  const parts = name
    .split(/[,\u2013\u2014\-|·]+/g)
    .map((s) => s.trim())
    .filter(Boolean)

  const seen = new Set<string>()
  const uniq = parts.filter((p) => {
    const k = p.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  return uniq[0] || name.trim()
}

export async function reversePlaceName(lat: number, lng: number): Promise<string | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=14&addressdetails=0`

    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null

    const data = await res.json()
    const dn = data?.display_name

    return dn ? primaryLabel(String(dn)) : null
  } catch {
    return null
  }
}
