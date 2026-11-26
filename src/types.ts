import type { ProjectKind } from './presets'

export type Align = 'left' | 'center' | 'right'

export type ShapeKind =
  | 'rect'
  | 'round'
  | 'pill'
  | 'circle'
  | 'ellipse'
  | 'semicircle'
  | 'triangle'
  | 'bar'
  | 'star'
  | 'star6'
  | 'star8'
  | 'burst'
  | 'sparkle'
  | 'diamond'
  | 'pentagon'
  | 'hexagon'
  | 'heptagon'
  | 'octagon'
  | 'arrow'
  | 'arrowLeft'
  | 'arrowUp'
  | 'arrowDown'
  | 'doubleArrow'
  | 'chevron'
  | 'parallelogram'
  | 'trapezoid'
  | 'cross'
  | 'plus'
  | 'heart'
  | 'bubble'
  | 'speech'
  | 'crescent'
  | 'ribbon'
  | 'banner'
  | 'tag'
  | 'ticket'
  | 'badge'
  | 'shield'
  | 'lightning'
  | 'cloud'
  | 'teardrop'
  | 'bookmark'
  | 'flag'
  | 'play'
  | 'check'
  | 'xmark'
  | 'line'
  | 'ring'
  | 'frame'
  | 'squircle'
  | 'wave'

export const SHAPE_LABELS: Record<ShapeKind, { hu: string; en: string }> = {
  rect: { hu: 'Téglalap', en: 'Rectangle' },
  round: { hu: 'Lekerekített', en: 'Rounded' },
  pill: { hu: 'Kapszula', en: 'Pill' },
  circle: { hu: 'Kör', en: 'Circle' },
  ellipse: { hu: 'Ellipszis', en: 'Ellipse' },
  semicircle: { hu: 'Félkör', en: 'Semicircle' },
  triangle: { hu: 'Háromszög', en: 'Triangle' },
  bar: { hu: 'Sáv', en: 'Bar' },
  star: { hu: 'Csillag', en: 'Star' },
  star6: { hu: '6 ágú csillag', en: '6-point star' },
  star8: { hu: '8 ágú csillag', en: '8-point star' },
  burst: { hu: 'Robbanás', en: 'Burst' },
  sparkle: { hu: 'Szikra', en: 'Sparkle' },
  diamond: { hu: 'Rombusz', en: 'Diamond' },
  pentagon: { hu: 'Ötszög', en: 'Pentagon' },
  hexagon: { hu: 'Hatszög', en: 'Hexagon' },
  heptagon: { hu: 'Hétszög', en: 'Heptagon' },
  octagon: { hu: 'Nyolcszög', en: 'Octagon' },
  arrow: { hu: 'Nyíl →', en: 'Arrow →' },
  arrowLeft: { hu: 'Nyíl ←', en: 'Arrow ←' },
  arrowUp: { hu: 'Nyíl ↑', en: 'Arrow ↑' },
  arrowDown: { hu: 'Nyíl ↓', en: 'Arrow ↓' },
  doubleArrow: { hu: 'Dupla nyíl', en: 'Double arrow' },
  chevron: { hu: 'Chevron', en: 'Chevron' },
  parallelogram: { hu: 'Paralelogramma', en: 'Parallelogram' },
  trapezoid: { hu: 'Trapéz', en: 'Trapezoid' },
  cross: { hu: 'Kereszt', en: 'Cross' },
  plus: { hu: 'Plusz', en: 'Plus' },
  heart: { hu: 'Szív', en: 'Heart' },
  bubble: { hu: 'Buborék', en: 'Bubble' },
  speech: { hu: 'Beszédbuborék', en: 'Speech' },
  crescent: { hu: 'Hold', en: 'Moon' },
  ribbon: { hu: 'Szalag', en: 'Ribbon' },
  banner: { hu: 'Banner szalag', en: 'Banner ribbon' },
  tag: { hu: 'Címke', en: 'Tag' },
  ticket: { hu: 'Jegy', en: 'Ticket' },
  badge: { hu: 'Jelvény', en: 'Badge' },
  shield: { hu: 'Pajzs', en: 'Shield' },
  lightning: { hu: 'Villám', en: 'Lightning' },
  cloud: { hu: 'Felhő', en: 'Cloud' },
  teardrop: { hu: 'Csepp', en: 'Teardrop' },
  bookmark: { hu: 'Könyvjelző', en: 'Bookmark' },
  flag: { hu: 'Zászló', en: 'Flag' },
  play: { hu: 'Play', en: 'Play' },
  check: { hu: 'Pipá', en: 'Check' },
  xmark: { hu: 'X jel', en: 'X mark' },
  line: { hu: 'Vonal', en: 'Line' },
  ring: { hu: 'Gyűrű', en: 'Ring' },
  frame: { hu: 'Keret', en: 'Frame' },
  squircle: { hu: 'Squircle', en: 'Squircle' },
  wave: { hu: 'Hullám', en: 'Wave' },
}

export function shapeLabel(kind: ShapeKind, locale: 'hu' | 'en' = 'hu') {
  return SHAPE_LABELS[kind][locale]
}

export const SHAPE_GROUPS: {
  label: { hu: string; en: string }
  kinds: ShapeKind[]
}[] = [
  {
    label: { hu: 'Alap', en: 'Basics' },
    kinds: [
      'rect',
      'round',
      'squircle',
      'pill',
      'circle',
      'ellipse',
      'semicircle',
      'bar',
      'line',
      'frame',
    ],
  },
  {
    label: { hu: 'Geometria', en: 'Geometry' },
    kinds: [
      'triangle',
      'diamond',
      'pentagon',
      'hexagon',
      'heptagon',
      'octagon',
      'star',
      'star6',
      'star8',
      'burst',
      'sparkle',
      'ring',
    ],
  },
  {
    label: { hu: 'Irány & jel', en: 'Arrows & marks' },
    kinds: [
      'arrow',
      'arrowLeft',
      'arrowUp',
      'arrowDown',
      'doubleArrow',
      'chevron',
      'play',
      'check',
      'xmark',
      'cross',
      'plus',
      'parallelogram',
      'trapezoid',
    ],
  },
  {
    label: { hu: 'YouTube / badge', en: 'YouTube / badges' },
    kinds: ['banner', 'ribbon', 'tag', 'ticket', 'badge', 'bookmark', 'flag'],
  },
  {
    label: { hu: 'Dekor', en: 'Decor' },
    kinds: [
      'heart',
      'bubble',
      'speech',
      'crescent',
      'shield',
      'lightning',
      'cloud',
      'teardrop',
      'wave',
    ],
  },
]

export type CanvasShape = {
  id: string
  kind: ShapeKind
  x: number
  y: number
  width: number
  height: number
  fill: string
  fill2: string
  useGradient: boolean
  gradientAngle: number
  stroke: string
  strokeWidth: number
  cornerRadius: number
  opacity: number
  rotation: number
  shadow: boolean
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
}

export type TextLayer = {
  id: string
  label: string
  text: string
  x: number
  y: number
  font: string
  size: number
  color: string
  align: Align
  opacity: number
  rotation: number
  letterSpacing: number
  lineHeight: number
  uppercase: boolean
  italic: boolean
  underline: boolean
  /** 0 = use font default weight */
  weight: number
  stroke: boolean
  strokeColor: string
  strokeWidth: number
  shadow: boolean
  shadowBlur: number
  shadowOffsetY: number
}

export type SelectedTarget =
  | { type: 'shape'; id: string }
  | { type: 'text'; id: string }
  | null

export type ControlTab = 'bg' | 'shapes' | 'text' | 'fx' | 'files'

export type EditorState = {
  kind: ProjectKind
  presetId: string
  backgroundColor: string
  backgroundColor2: string
  useGradient: boolean
  gradientAngle: number
  backgroundImage: string | null
  imageZoom: number
  imageOffsetX: number
  imageOffsetY: number
  overlayOpacity: number
  overlayColor: string
  vignette: number
  brightness: number
  contrast: number
  saturate: number
  hueRotate: number
  invert: boolean
  grain: number
  scanlines: number
  glow: number
  glowColor: string
  glowX: number
  glowY: number
  spotlight: number
  spotlightX: number
  spotlightY: number
  spotlightSize: number
  letterbox: number
  stripes: number
  stripeColor: string
  stripeAngle: number
  stripeGap: number
  roundedCorners: number
  bgBlur: number
  frameEnabled: boolean
  frameColor: string
  frameWidth: number
  frameInset: number
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
  gridOpacity: number
  centerGuides: boolean
  shapes: CanvasShape[]
  texts: TextLayer[]
  selected: SelectedTarget
  showSafeArea: boolean
  activeTab: ControlTab
}

let seq = 0
export function nextId(prefix: string) {
  seq += 1
  return `${prefix}-${Date.now()}-${seq}`
}

export function createShape(
  kind: ShapeKind,
  canvasW: number,
  canvasH: number,
): CanvasShape {
  const id = nextId('shape')
  const base: Omit<CanvasShape, 'kind' | 'width' | 'height' | 'y'> & { y: number } =
    {
      id,
      x: canvasW * 0.18,
      y: canvasH * 0.22,
      fill: '#F5A524',
      fill2: '#FF7A1A',
      useGradient: false,
      gradientAngle: 135,
      stroke: '#ffffff',
      strokeWidth: 0,
      cornerRadius: 18,
      opacity: 1,
      rotation: 0,
      shadow: false,
      shadowBlur: 24,
      shadowOffsetX: 0,
      shadowOffsetY: 12,
    }

  const s = Math.min(canvasW, canvasH)

  switch (kind) {
    case 'rect':
      return { ...base, kind, width: canvasW * 0.35, height: canvasH * 0.22 }
    case 'round':
      return {
        ...base,
        kind,
        cornerRadius: 40,
        width: canvasW * 0.32,
        height: canvasH * 0.2,
      }
    case 'pill':
      return {
        ...base,
        kind,
        cornerRadius: 50,
        width: canvasW * 0.4,
        height: canvasH * 0.12,
      }
    case 'circle':
      return { ...base, kind, width: s * 0.28, height: s * 0.28 }
    case 'ellipse':
      return { ...base, kind, width: canvasW * 0.38, height: canvasH * 0.22 }
    case 'semicircle':
      return { ...base, kind, width: s * 0.32, height: s * 0.18 }
    case 'triangle':
      return { ...base, kind, width: canvasW * 0.28, height: canvasH * 0.28 }
    case 'bar':
      return {
        ...base,
        kind,
        y: canvasH * 0.72,
        width: canvasW * 0.55,
        height: canvasH * 0.035,
      }
    case 'star':
    case 'star6':
    case 'star8':
    case 'sparkle':
      return { ...base, kind, width: s * 0.26, height: s * 0.26 }
    case 'burst':
      return { ...base, kind, width: s * 0.3, height: s * 0.3 }
    case 'diamond':
    case 'pentagon':
    case 'hexagon':
    case 'heptagon':
    case 'octagon':
    case 'shield':
    case 'badge':
    case 'play':
    case 'check':
    case 'xmark':
    case 'plus':
    case 'cross':
    case 'teardrop':
      return { ...base, kind, width: s * 0.26, height: s * 0.26 }
    case 'arrow':
    case 'arrowLeft':
    case 'doubleArrow':
      return { ...base, kind, width: canvasW * 0.32, height: canvasH * 0.12 }
    case 'arrowUp':
    case 'arrowDown':
      return { ...base, kind, width: canvasH * 0.12, height: canvasW * 0.28 }
    case 'chevron':
      return { ...base, kind, width: canvasW * 0.28, height: canvasH * 0.18 }
    case 'parallelogram':
    case 'trapezoid':
    case 'tag':
    case 'ticket':
      return { ...base, kind, width: canvasW * 0.34, height: canvasH * 0.16 }
    case 'heart':
      return { ...base, kind, width: s * 0.26, height: s * 0.24 }
    case 'bubble':
    case 'speech':
    case 'cloud':
      return { ...base, kind, width: canvasW * 0.32, height: canvasH * 0.22 }
    case 'crescent':
      return { ...base, kind, width: s * 0.26, height: s * 0.26 }
    case 'ribbon':
    case 'banner':
    case 'wave':
      return { ...base, kind, width: canvasW * 0.42, height: canvasH * 0.14 }
    case 'bookmark':
    case 'flag':
      return { ...base, kind, width: canvasW * 0.14, height: canvasH * 0.28 }
    case 'lightning':
      return { ...base, kind, width: s * 0.18, height: s * 0.32 }
    case 'squircle':
      return {
        ...base,
        kind,
        cornerRadius: 35,
        width: s * 0.28,
        height: s * 0.28,
      }
    case 'frame':
      return {
        ...base,
        kind,
        fill: 'transparent',
        stroke: '#F5A524',
        strokeWidth: 14,
        width: canvasW * 0.36,
        height: canvasH * 0.28,
      }
    case 'line':
      return {
        ...base,
        kind,
        fill: 'transparent',
        stroke: '#F5A524',
        strokeWidth: 10,
        width: canvasW * 0.4,
        height: 12,
      }
    case 'ring':
      return {
        ...base,
        kind,
        fill: 'transparent',
        stroke: '#F5A524',
        strokeWidth: 18,
        width: s * 0.3,
        height: s * 0.3,
      }
  }
}

export function createTextLayer(
  canvasKind: ProjectKind,
  overrides: Partial<TextLayer> = {},
): TextLayer {
  return {
    id: nextId('text'),
    label: 'Szöveg',
    text: canvasKind === 'thumbnail' ? 'ÚJ VIDEÓ' : 'Csatornád neve',
    x: 50,
    y: 45,
    font: 'bricolage',
    size: canvasKind === 'thumbnail' ? 96 : 110,
    color: '#F5A524',
    align: 'center',
    opacity: 1,
    rotation: 0,
    letterSpacing: 0,
    lineHeight: 1.15,
    uppercase: false,
    italic: false,
    underline: false,
    weight: 0,
    stroke: false,
    strokeColor: '#000000',
    strokeWidth: 8,
    shadow: true,
    shadowBlur: 18,
    shadowOffsetY: 6,
    ...overrides,
  }
}

export function duplicateShape(shape: CanvasShape): CanvasShape {
  return {
    ...shape,
    id: nextId('shape'),
    x: shape.x + 28,
    y: shape.y + 28,
  }
}

export function duplicateText(layer: TextLayer): TextLayer {
  return {
    ...layer,
    id: nextId('text'),
    label: `${layer.label} másolat`,
    x: Math.min(100, layer.x + 3),
    y: Math.min(100, layer.y + 4),
  }
}

export const defaultEditorState = (
  kind: ProjectKind,
  locale: 'hu' | 'en' = 'hu',
): EditorState => {
  const en = locale === 'en'
  return {
    kind,
    presetId: kind === 'thumbnail' ? 'yt-thumb' : 'yt-banner',
    backgroundColor: kind === 'thumbnail' ? '#1A1208' : '#0E1218',
    backgroundColor2: '#3A2208',
    useGradient: true,
    gradientAngle: 135,
    backgroundImage: null,
    imageZoom: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    overlayOpacity: 0,
    overlayColor: '#000000',
    vignette: 0.25,
    brightness: 100,
    contrast: 100,
    saturate: 100,
    hueRotate: 0,
    invert: false,
    grain: 0,
    scanlines: 0,
    glow: 0,
    glowColor: '#F5A524',
    glowX: 80,
    glowY: 20,
    spotlight: 0,
    spotlightX: 50,
    spotlightY: 40,
    spotlightSize: 55,
    letterbox: 0,
    stripes: 0,
    stripeColor: '#FFFFFF',
    stripeAngle: -28,
    stripeGap: 48,
    roundedCorners: 0,
    bgBlur: 0,
    frameEnabled: false,
    frameColor: '#F5A524',
    frameWidth: 16,
    frameInset: 24,
    showGrid: false,
    snapToGrid: true,
    gridSize: 64,
    gridOpacity: 0.35,
    centerGuides: true,
    shapes: [],
    texts: [
      createTextLayer(kind, {
        label: en ? 'Title' : 'Cím',
        text: kind === 'thumbnail'
          ? en
            ? 'NEW VIDEO'
            : 'ÚJ VIDEÓ'
          : en
            ? 'Your channel name'
            : 'Csatornád neve',
        y: 44,
        size: kind === 'thumbnail' ? 96 : 120,
      }),
      createTextLayer(kind, {
        label: en ? 'Subtitle' : 'Alcím',
        text:
          kind === 'thumbnail'
            ? en
              ? 'Your main message'
              : 'Itt a fő üzenet'
            : en
              ? 'Tagline for your banner'
              : 'Felirat / tagline a bannerhez',
        y: 58,
        font: 'ibm',
        size: kind === 'thumbnail' ? 48 : 56,
        color: '#F4F1EA',
        shadowBlur: 10,
        shadowOffsetY: 3,
      }),
    ],
    selected: null,
    showSafeArea: kind === 'banner',
    activeTab: 'files',
  }
}
