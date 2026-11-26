export type ProjectKind = 'thumbnail' | 'banner'

export type Preset = {
  id: string
  kind: ProjectKind
  label: string
  width: number
  height: number
  ratioLabel: string
  description: string
  /** Optional safe-area guide (banner only), in canvas pixels */
  safeArea?: { x: number; y: number; width: number; height: number }
}

export const PRESETS: Preset[] = [
  {
    id: 'yt-thumb',
    kind: 'thumbnail',
    label: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    ratioLabel: '16:9',
    description: 'Standard YouTube videó előnézet',
  },
  {
    id: 'yt-banner',
    kind: 'banner',
    label: 'YouTube Banner',
    width: 2560,
    height: 1440,
    ratioLabel: '16:9',
    description: 'Csatorna borító — a középső sáv minden eszközön látszik',
    // YouTube “TV safe” area approx. centered strip
    safeArea: { x: 507, y: 510, width: 1546, height: 420 },
  },
]

export function presetsFor(kind: ProjectKind): Preset[] {
  return PRESETS.filter((p) => p.kind === kind)
}

export function getPreset(id: string): Preset {
  return PRESETS.find((p) => p.id === id) ?? PRESETS[0]
}
