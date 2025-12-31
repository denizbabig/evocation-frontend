<template>
  <div class="relative h-full w-full min-h-[100vh]">
    <div id="map" ref="mapEl" class="absolute inset-0 z-[1]" />
  </div>
</template>

<script setup lang="ts">
/* Imports */
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Feature, FeatureCollection, LineString, Point } from 'geojson'

/* Emits */
const emit = defineEmits<{
  (e: 'map-move', payload: { center: { lat: number; lng: number }; zoom: number }): void
  (e: 'map-click', payload: { lat: number; lng: number; screenX: number; screenY: number }): void
  (e: 'marker-click', payload: { id: number }): void
}>()

/* Props */
const props = withDefaults(
  defineProps<{
    markers: Array<{
      id: number
      lat: number
      lng: number
      title?: string
      categoryId?: number | string
      color?: string
    }>
    cluster?: boolean
    routes?: Array<{ fromId: number; toId: number }>
  }>(),
  {
    cluster: false,
    routes: () => [],
  }
)

/* Refs */
const mapEl = ref<HTMLDivElement | null>(null)
const map = ref<maplibregl.Map | null>(null)

/* Constants */
const MAP_STYLE_URL =
  'https://api.maptiler.com/maps/019b1f31-461a-7a9c-b8a0-e6f1ae8a3075/style.json?key=5F8eqXJM98ZeppviBIEG'
const DEFAULT_CENTER: [number, number] = [13.405, 52.52]
const DEFAULT_ZOOM = 2.2
const RESET_ZOOM = 3.5
const MAX_FIT_ZOOM = 13

const SRC_MARKERS = 'evoc-src-markers'
const LYR_POINTS = 'evoc-lyr-points'
const LYR_CLUSTERS = 'evoc-lyr-clusters'

const SRC_ROUTES = 'evoc-src-routes'
const LYR_ROUTES = 'evoc-lyr-routes'

const IMG_PIN = 'pin-grad'
const IMG_PIN_LG = 'pin-grad-lg'

/* Public API */
function zoomIn() {
  map.value?.zoomIn({ duration: 200 })
}
function zoomOut() {
  map.value?.zoomOut({ duration: 200 })
}
function flyTo(lat: number, lng: number, z = 12) {
  map.value?.flyTo({ center: [lng, lat], zoom: z, speed: 0.9, curve: 1.42, essential: true })
}
function resetView() {
  map.value?.flyTo({ center: DEFAULT_CENTER, zoom: RESET_ZOOM, speed: 0.9, curve: 1.2, essential: true })
}
function fitBounds(west: number, south: number, east: number, north: number, padding = 72) {
  map.value?.fitBounds([[west, south], [east, north]], { padding, duration: 3000, maxZoom: MAX_FIT_ZOOM })
}
function getZoom() {
  return map.value?.getZoom() ?? 0
}

defineExpose({ zoomIn, zoomOut, flyTo, resetView, fitBounds, getZoom })

/* GeoJSON builders */
function fcFromMarkers(list: typeof props.markers): FeatureCollection<Point, any> {
  const features: Feature<Point, any>[] = list.map((m) => ({
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [m.lng, m.lat] },
    properties: {
      id: m.id,
      title: m.title ?? '',
      categoryId: m.categoryId ?? null,
      color: m.color ?? null,
    },
  }))
  return { type: 'FeatureCollection', features }
}

function fcFromRoutes(
  routes: Array<{ fromId: number; toId: number }>,
  markerList: typeof props.markers
): FeatureCollection<LineString, any> {
  const byId = new Map<number, [number, number]>()
  markerList.forEach((m) => byId.set(m.id, [m.lng, m.lat]))

  const features: Feature<LineString, any>[] = []
  for (const r of routes) {
    const a = byId.get(r.fromId)
    const b = byId.get(r.toId)
    if (!a || !b) continue

    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [a, b] },
      properties: { fromId: r.fromId, toId: r.toId },
    })
  }

  return { type: 'FeatureCollection', features }
}

/* Pin sprites */
function makePinSVG(
  size = 44,
  withDot = true,
  fillA = '#a855f7',
  fillB = '#6366f1',
  dotCY = 15,
  dotR = 5
) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.18)}" viewBox="0 0 44 52">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${fillA}"/>
        <stop offset="1" stop-color="${fillB}"/>
      </linearGradient>
    </defs>
    <g transform="translate(22,4)">
      <path d="M0,-2c-9.94,0-18,8.06-18,18c0,11.25,18,30,18,30s18-18.75,18-30C18,6.06,9.94,-2,0,-2z"
            fill="url(#g)" stroke="white" stroke-width="2"/>
      ${withDot ? `<circle cx="0" cy="${dotCY}" r="${dotR}" fill="white" opacity="0.95"/>` : ''}
    </g>
  </svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function loadHTMLImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

async function registerPinSprites(m: maplibregl.Map) {
  const small = await loadHTMLImage(makePinSVG(64, true))
  const large = await loadHTMLImage(makePinSVG(86, true))

  if (!m.hasImage(IMG_PIN)) m.addImage(IMG_PIN, small, { sdf: false } as any)
  if (!m.hasImage(IMG_PIN_LG)) m.addImage(IMG_PIN_LG, large, { sdf: false } as any)
}

/* Sources / Layers */
function ensureRoutes() {
  const m = map.value
  if (!m) return

  if (!m.getSource(SRC_ROUTES)) {
    m.addSource(SRC_ROUTES, {
      type: 'geojson',
      data: fcFromRoutes(props.routes ?? [], props.markers),
    } as any)
  }

  if (!m.getLayer(LYR_ROUTES)) {
    m.addLayer({
      id: LYR_ROUTES,
      type: 'line',
      source: SRC_ROUTES,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#a78bfa', 'line-width': 3, 'line-opacity': 0.85 },
    } as any)
  }
}

function removeMarkerLayersAndSource() {
  const m = map.value
  if (!m) return

  if (m.getLayer(LYR_POINTS)) m.removeLayer(LYR_POINTS)
  if (m.getLayer(LYR_CLUSTERS)) m.removeLayer(LYR_CLUSTERS)
  if (m.getSource(SRC_MARKERS)) m.removeSource(SRC_MARKERS)
}

function bindPointerCursor(layerId: string) {
  const m = map.value
  if (!m || !m.getLayer(layerId)) return
  m.on('mouseenter', layerId, () => (m.getCanvas().style.cursor = 'pointer'))
  m.on('mouseleave', layerId, () => (m.getCanvas().style.cursor = ''))
}

function bindMarkerClick() {
  const m = map.value
  if (!m || !m.getLayer(LYR_POINTS)) return

  m.on('click', LYR_POINTS, (e: any) => {
    e?.originalEvent?.stopPropagation?.()
    const f = e.features?.[0]
    const id = Number(f?.properties?.id)
    if (Number.isFinite(id)) emit('marker-click', { id })
  })
}

function bindClusterClick() {
  const m = map.value
  if (!m || !m.getLayer(LYR_CLUSTERS)) return

  m.on('click', LYR_CLUSTERS as any, async (e: any) => {
    e?.originalEvent?.stopPropagation?.()

    const f = e.features?.[0]
    if (!f) return

    const clusterId = f.properties.cluster_id
    const src = m.getSource(SRC_MARKERS) as any

    try {
      const expansionZoom: number = await src.getClusterExpansionZoom(clusterId)
      const [lng, lat] = f.geometry.coordinates as [number, number]

      const targetZoom = Math.min(expansionZoom + 1, MAX_FIT_ZOOM)

      m.easeTo({
        center: [lng, lat],
        zoom: targetZoom,
        duration: 2200,
        easing: (t) => t * (2 - t),
      })
    } catch (err) {
      console.warn('getClusterExpansionZoom failed:', err)
    }
  })
}

function rebuildMarkerSource() {
  const m = map.value
  if (!m) return

  removeMarkerLayersAndSource()

  m.addSource(SRC_MARKERS, {
    type: 'geojson',
    data: fcFromMarkers(props.markers),
    cluster: props.cluster,
    clusterRadius: 56,
    clusterMaxZoom: 13,
  } as any)

  if (!m.getLayer(LYR_POINTS)) {
    m.addLayer({
      id: LYR_POINTS,
      type: 'symbol',
      source: SRC_MARKERS,
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': IMG_PIN,
        'icon-anchor': 'bottom',
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    } as any)
  }

  if (props.cluster && !m.getLayer(LYR_CLUSTERS)) {
    m.addLayer({
      id: LYR_CLUSTERS,
      type: 'symbol',
      source: SRC_MARKERS,
      filter: ['has', 'point_count'],
      layout: {
        'icon-image': IMG_PIN_LG,
        'icon-anchor': 'bottom',
        'icon-size': 0.5,
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
      },
    } as any)
  }

  bindPointerCursor(LYR_POINTS)
  bindPointerCursor(LYR_CLUSTERS)
  bindMarkerClick()
  if (props.cluster) bindClusterClick()
}

function ensureSourcesAndLayers() {
  ensureRoutes()
  rebuildMarkerSource()
}

/* Updates */
function updateMarkersData() {
  const m = map.value
  if (!m) return
  const src = m.getSource(SRC_MARKERS) as maplibregl.GeoJSONSource | undefined
  if (!src) return
  src.setData(fcFromMarkers(props.markers))
}

function updateRoutesData() {
  const m = map.value
  if (!m) return
  const src = m.getSource(SRC_ROUTES) as maplibregl.GeoJSONSource | undefined
  if (!src) return
  src.setData(fcFromRoutes(props.routes ?? [], props.markers))
}

/* Map init */
function initMap() {
  const container = mapEl.value ?? document.getElementById('map')
  if (!container) return

  const m = new maplibregl.Map({
    container,
    style: MAP_STYLE_URL,
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    attributionControl: { compact: true },
  })

  map.value = m

  m.once('load', async () => {
    try {
      m.setProjection({ type: 'globe' })
    } catch {}

    await registerPinSprites(m)
    ensureSourcesAndLayers()
    updateMarkersData()
    updateRoutesData()
  })

  m.on('moveend', () => {
    const c = m.getCenter()
    emit('map-move', { center: { lat: c.lat, lng: c.lng }, zoom: m.getZoom() })
  })

  m.on('click', (e) => {
    const hits = m.queryRenderedFeatures(e.point)
    const clickedMarkerOrCluster = hits.some((f: any) => {
      const p = f?.properties ?? {}
      return p.id != null || p.point_count != null
    })
    if (clickedMarkerOrCluster) return

    emit('map-click', { lat: e.lngLat.lat, lng: e.lngLat.lng, screenX: e.point.x, screenY: e.point.y })
  })
}

/* Lifecycle */
onMounted(initMap)

onBeforeUnmount(() => {
  map.value?.remove()
  map.value = null
})

/* Watches */
watch(
  () => props.markers,
  () => {
    updateMarkersData()
    updateRoutesData()
  },
  { deep: true }
)

watch(
  () => props.routes,
  () => updateRoutesData(),
  { deep: true }
)

watch(
  () => props.cluster,
  () => {
    const m = map.value
    if (!m || !m.isStyleLoaded()) return
    rebuildMarkerSource()
  }
)
</script>

<style scoped>
:deep(.maplibregl-canvas) { z-index: 0 !important; cursor: grab; }
</style>
