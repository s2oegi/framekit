import { getPreset } from './presets'
import type { ProjectKind } from './presets'
import {
  createShape,
  createTextLayer,
  defaultEditorState,
  type EditorState,
} from './types'

export type LocText = { hu: string; en: string }
export type TemplateLocale = 'hu' | 'en'

export type Template = {
  id: string
  kind: ProjectKind
  label: LocText
  description: LocText
  accent: string
  custom?: boolean
  build: (locale: TemplateLocale) => EditorState
}

function L(locale: TemplateLocale, hu: string, en: string) {
  return locale === 'en' ? en : hu
}

function base(kind: ProjectKind, locale: TemplateLocale = 'hu'): EditorState {
  const state = defaultEditorState(kind, locale)
  return {
    ...state,
    overlayOpacity: 0,
    selected: null,
    activeTab: 'text',
  }
}

function thumbBold(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const bar = createShape('bar', p.width, p.height)
  const accent = createShape('triangle', p.width, p.height)
  const frame = createShape('frame', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#0B0704',
    backgroundColor2: '#4A2208',
    useGradient: true,
    gradientAngle: 145,
    vignette: 0.42,
    contrast: 118,
    saturate: 125,
    glow: 0.4,
    glowColor: '#F5A524',
    glowX: 88,
    glowY: 12,
    shapes: [
      {
        ...frame,
        x: p.width * 0.035,
        y: p.height * 0.06,
        width: p.width * 0.93,
        height: p.height * 0.88,
        fill: 'transparent',
        stroke: '#F5A524',
        strokeWidth: 6,
        opacity: 0.35,
      },
      {
        ...bar,
        x: p.width * 0.08,
        y: p.height * 0.64,
        width: p.width * 0.42,
        height: p.height * 0.04,
        fill: '#F5A524',
        shadow: true,
        shadowBlur: 22,
      },
      {
        ...accent,
        x: p.width * 0.7,
        y: p.height * 0.06,
        width: p.width * 0.3,
        height: p.height * 0.38,
        fill: '#FF7A1A',
        opacity: 0.88,
        rotation: 14,
        useGradient: true,
        fill2: '#F5A524',
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'EZ MINDENT MEGVÁLTOZTAT', 'THIS CHANGES EVERYTHING'),
        font: 'bebas',
        size: 108,
        color: '#FFFFFF',
        x: 50,
        y: 40,
        uppercase: true,
        letterSpacing: 2,
        stroke: true,
        strokeColor: '#000000',
        strokeWidth: 11,
        shadow: true,
        shadowBlur: 24,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'Nézd végig · 2026', 'Watch to the end · 2026'),
        font: 'ibm',
        size: 38,
        color: '#F5A524',
        x: 50,
        y: 74,
        shadow: true,
      }),
    ],
  }
}

function thumbMinimal(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  return {
    ...state,
    backgroundColor: '#0B0D12',
    backgroundColor2: '#1A2233',
    useGradient: true,
    gradientAngle: 180,
    vignette: 0.55,
    grain: 0.15,
    shapes: [],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'Csendes igazság', 'Quiet truth'),
        font: 'playfair',
        size: 92,
        color: '#F4F1EA',
        x: 50,
        y: 46,
        shadow: true,
        shadowBlur: 28,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'egy rövid történet', 'a short story'),
        font: 'ibm',
        size: 36,
        color: '#9AA3B5',
        x: 50,
        y: 62,
        shadow: false,
      }),
    ],
  }
}

function thumbGaming(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const ring = createShape('ring', p.width, p.height)
  const diamond = createShape('diamond', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#070B14',
    backgroundColor2: '#1A0630',
    useGradient: true,
    gradientAngle: 120,
    vignette: 0.35,
    glow: 0.55,
    glowColor: '#32F5C8',
    glowX: 20,
    glowY: 80,
    scanlines: 0.25,
    stripes: 0.2,
    stripeColor: '#A855F7',
    stripeAngle: -32,
    stripeGap: 56,
    saturate: 130,
    shapes: [
      {
        ...ring,
        x: p.width * 0.62,
        y: p.height * 0.18,
        width: p.width * 0.32,
        height: p.width * 0.32,
        stroke: '#32F5C8',
        strokeWidth: 22,
        opacity: 0.9,
      },
      {
        ...diamond,
        x: p.width * 0.05,
        y: p.height * 0.55,
        width: p.width * 0.18,
        height: p.width * 0.18,
        fill: '#A855F7',
        opacity: 0.7,
        rotation: 15,
        useGradient: true,
        fill2: '#32F5C8',
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'RANGOLÓ KÁOSZ', 'RANKED CHAOS'),
        font: 'anton',
        size: 118,
        color: '#FFFFFF',
        x: 48,
        y: 40,
        uppercase: true,
        letterSpacing: 4,
        stroke: true,
        strokeColor: '#12061F',
        strokeWidth: 12,
        shadow: true,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'ÉLŐ · 4. SZEZON', 'LIVE · SEASON 4'),
        font: 'space',
        size: 38,
        color: '#32F5C8',
        x: 48,
        y: 68,
        letterSpacing: 6,
        uppercase: true,
      }),
    ],
  }
}

function thumbNews(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const bar = createShape('bar', p.width, p.height)
  const badge = createShape('badge', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#140404',
    backgroundColor2: '#3A0A0A',
    useGradient: true,
    gradientAngle: 160,
    vignette: 0.3,
    contrast: 118,
    saturate: 125,
    shapes: [
      {
        ...bar,
        x: 0,
        y: p.height * 0.78,
        width: p.width,
        height: p.height * 0.22,
        fill: '#C8102E',
      },
      {
        ...badge,
        x: p.width * 0.04,
        y: p.height * 0.08,
        width: p.width * 0.16,
        height: p.width * 0.16,
        fill: '#FFCC00',
        stroke: '#111',
        strokeWidth: 4,
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'SÜRGŐS', 'BREAKING'),
        font: 'bebas',
        size: 96,
        color: '#FFFFFF',
        x: 50,
        y: 42,
        uppercase: true,
        letterSpacing: 6,
        stroke: true,
        strokeColor: '#000',
        strokeWidth: 8,
        shadow: true,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'Ami most történt', 'What just happened'),
        font: 'ibm',
        size: 42,
        color: '#FFFFFF',
        x: 50,
        y: 86,
        shadow: false,
      }),
    ],
  }
}

function thumbPodcast(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const circle = createShape('circle', p.width, p.height)
  const ring = createShape('ring', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#1A1224',
    backgroundColor2: '#3D2A5C',
    useGradient: true,
    gradientAngle: 135,
    vignette: 0.25,
    glow: 0.3,
    glowColor: '#C4B5FD',
    glowX: 30,
    glowY: 40,
    shapes: [
      {
        ...circle,
        x: p.width * 0.08,
        y: p.height * 0.22,
        width: p.height * 0.55,
        height: p.height * 0.55,
        fill: '#7C3AED',
        opacity: 0.9,
        shadow: true,
      },
      {
        ...ring,
        x: p.width * 0.05,
        y: p.height * 0.18,
        width: p.height * 0.62,
        height: p.height * 0.62,
        stroke: '#E9D5FF',
        strokeWidth: 10,
        opacity: 0.55,
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, '42. RÉSZ', 'EP. 42'),
        font: 'space',
        size: 64,
        color: '#E9D5FF',
        x: 68,
        y: 38,
        align: 'left',
        uppercase: true,
        letterSpacing: 4,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'Vendég beszél', 'Guest talking'),
        font: 'bricolage',
        size: 72,
        color: '#FFFFFF',
        x: 68,
        y: 58,
        align: 'left',
        shadow: true,
      }),
    ],
  }
}

function thumbTutorial(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const pill = createShape('pill', p.width, p.height)
  const play = createShape('play', p.width, p.height)
  const frame = createShape('frame', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#0B1F17',
    backgroundColor2: '#14532D',
    useGradient: true,
    gradientAngle: 200,
    vignette: 0.2,
    shapes: [
      {
        ...frame,
        x: p.width * 0.06,
        y: p.height * 0.1,
        width: p.width * 0.88,
        height: p.height * 0.8,
        fill: 'transparent',
        stroke: '#86EFAC',
        strokeWidth: 8,
        opacity: 0.45,
      },
      {
        ...pill,
        x: p.width * 0.08,
        y: p.height * 0.12,
        width: p.width * 0.28,
        height: p.height * 0.1,
        fill: '#22C55E',
      },
      {
        ...play,
        x: p.width * 0.72,
        y: p.height * 0.55,
        width: p.width * 0.16,
        height: p.width * 0.16,
        fill: '#FFFFFF',
        opacity: 0.9,
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: 'Badge',
        text: L(locale, 'HOGYAN', 'HOW TO'),
        font: 'space',
        size: 34,
        color: '#052E16',
        x: 22,
        y: 17,
        align: 'left',
        uppercase: true,
        letterSpacing: 2,
        shadow: false,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, '5 perc alatt', 'In 5 minutes'),
        font: 'anton',
        size: 96,
        color: '#F0FDF4',
        x: 50,
        y: 48,
        uppercase: true,
        shadow: true,
      }),
    ],
  }
}

function thumbReaction(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const burst = createShape('burst', p.width, p.height)
  const lightning = createShape('lightning', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#1C0A00',
    backgroundColor2: '#7C2D12',
    useGradient: true,
    gradientAngle: 110,
    vignette: 0.25,
    contrast: 120,
    saturate: 140,
    glow: 0.4,
    glowColor: '#FBBF24',
    glowX: 75,
    glowY: 30,
    shapes: [
      {
        ...burst,
        x: p.width * 0.55,
        y: p.height * 0.05,
        width: p.width * 0.5,
        height: p.width * 0.5,
        fill: '#F59E0B',
        opacity: 0.85,
        rotation: -8,
      },
      {
        ...lightning,
        x: p.width * 0.08,
        y: p.height * 0.2,
        width: p.width * 0.18,
        height: p.height * 0.4,
        fill: '#FDE68A',
        rotation: -12,
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'MI?!', 'WAT?!'),
        font: 'bebas',
        size: 140,
        color: '#FFFFFF',
        x: 38,
        y: 55,
        uppercase: true,
        stroke: true,
        strokeColor: '#000',
        strokeWidth: 14,
        shadow: true,
      }),
    ],
  }
}

function thumbSoft(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const cloud = createShape('cloud', p.width, p.height)
  const heart = createShape('heart', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#FFF1F2',
    backgroundColor2: '#FCE7F3',
    useGradient: true,
    gradientAngle: 160,
    vignette: 0.08,
    brightness: 108,
    shapes: [
      {
        ...cloud,
        x: p.width * 0.55,
        y: p.height * 0.12,
        width: p.width * 0.4,
        height: p.height * 0.28,
        fill: '#FFFFFF',
        opacity: 0.9,
        shadow: true,
        shadowBlur: 30,
      },
      {
        ...heart,
        x: p.width * 0.08,
        y: p.height * 0.55,
        width: p.width * 0.14,
        height: p.width * 0.14,
        fill: '#FB7185',
        opacity: 0.85,
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'lágy napok', 'soft days'),
        font: 'caveat',
        size: 110,
        color: '#9F1239',
        x: 50,
        y: 48,
        shadow: false,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'vlog · életmód', 'vlog · lifestyle'),
        font: 'ibm',
        size: 36,
        color: '#BE185D',
        x: 50,
        y: 68,
      }),
    ],
  }
}

function thumbTech(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const hex = createShape('hexagon', p.width, p.height)
  const line = createShape('line', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#020617',
    backgroundColor2: '#0F172A',
    useGradient: true,
    gradientAngle: 210,
    vignette: 0.35,
    scanlines: 0.12,
    glow: 0.35,
    glowColor: '#38BDF8',
    glowX: 80,
    glowY: 70,
    shapes: [
      {
        ...hex,
        x: p.width * 0.68,
        y: p.height * 0.2,
        width: p.width * 0.26,
        height: p.width * 0.26,
        fill: 'transparent',
        stroke: '#38BDF8',
        strokeWidth: 10,
        opacity: 0.8,
      },
      {
        ...line,
        x: p.width * 0.08,
        y: p.height * 0.7,
        width: p.width * 0.4,
        height: 8,
        fill: '#38BDF8',
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'TECH TESZT', 'TECH REVIEW'),
        font: 'space',
        size: 88,
        color: '#E2E8F0',
        x: 42,
        y: 44,
        align: 'left',
        uppercase: true,
        letterSpacing: 3,
        shadow: true,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, '2026 · kipróbálva', '2026 · hands-on'),
        font: 'ibm',
        size: 36,
        color: '#38BDF8',
        x: 42,
        y: 62,
        align: 'left',
      }),
    ],
  }
}

function bannerBrand(locale: TemplateLocale): EditorState {
  const state = base('banner', locale)
  const p = getPreset(state.presetId)
  const bar = createShape('bar', p.width, p.height)
  const circle = createShape('circle', p.width, p.height)
  const ribbon = createShape('ribbon', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#0A0E14',
    backgroundColor2: '#1A2436',
    useGradient: true,
    gradientAngle: 95,
    vignette: 0.22,
    glow: 0.22,
    glowColor: '#F5A524',
    glowX: 78,
    glowY: 42,
    showSafeArea: true,
    shapes: [
      {
        ...circle,
        x: p.width * 0.68,
        y: p.height * 0.28,
        width: 280,
        height: 280,
        fill: '#F5A524',
        opacity: 0.12,
      },
      {
        ...bar,
        x: p.width * 0.22,
        y: p.height * 0.57,
        width: p.width * 0.26,
        height: 12,
        fill: '#F5A524',
      },
      {
        ...ribbon,
        x: p.width * 0.72,
        y: p.height * 0.48,
        width: p.width * 0.12,
        height: 44,
        fill: '#F5A524',
        opacity: 0.85,
      },
    ],
    texts: [
      createTextLayer('banner', {
        label: L(locale, 'Csatornanév', 'Channel name'),
        text: L(locale, 'FRAMEKIT STÚDIÓ', 'FRAMEKIT STUDIO'),
        font: 'bricolage',
        size: 94,
        color: '#F4F1EA',
        x: 50,
        y: 47,
        uppercase: true,
        letterSpacing: 5,
        shadow: true,
      }),
      createTextLayer('banner', {
        label: 'Tagline',
        text: L(locale, 'Banner · Miniatűr · Export', 'Banner · Thumbnail · Export'),
        font: 'ibm',
        size: 38,
        color: '#F5A524',
        x: 50,
        y: 58,
        shadow: false,
      }),
    ],
  }
}

function bannerCinematic(locale: TemplateLocale): EditorState {
  const state = base('banner', locale)
  const p = getPreset(state.presetId)
  const rect = createShape('rect', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#050505',
    backgroundColor2: '#1A1208',
    useGradient: true,
    gradientAngle: 200,
    vignette: 0.45,
    grain: 0.3,
    letterbox: 0.12,
    contrast: 110,
    showSafeArea: true,
    shapes: [
      {
        ...rect,
        x: 0,
        y: p.height * 0.42,
        width: p.width,
        height: p.height * 0.16,
        fill: '#000000',
        opacity: 0.45,
      },
    ],
    texts: [
      createTextLayer('banner', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'A KÖVETKEZŐ FEJEZET', 'THE NEXT CHAPTER'),
        font: 'oswald',
        size: 88,
        color: '#F4F1EA',
        x: 50,
        y: 48,
        uppercase: true,
        letterSpacing: 8,
        shadow: true,
      }),
      createTextLayer('banner', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'új epizódok minden héten', 'new episodes every week'),
        font: 'caveat',
        size: 52,
        color: '#F5A524',
        x: 50,
        y: 56,
        shadow: false,
      }),
    ],
  }
}

function bannerGaming(locale: TemplateLocale): EditorState {
  const state = base('banner', locale)
  const p = getPreset(state.presetId)
  const chevron = createShape('chevron', p.width, p.height)
  const hex = createShape('hexagon', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#050816',
    backgroundColor2: '#1E1B4B',
    useGradient: true,
    gradientAngle: 120,
    vignette: 0.3,
    glow: 0.45,
    glowColor: '#22D3EE',
    glowX: 85,
    glowY: 40,
    scanlines: 0.18,
    showSafeArea: true,
    shapes: [
      {
        ...chevron,
        x: p.width * 0.72,
        y: p.height * 0.28,
        width: p.width * 0.18,
        height: p.height * 0.4,
        fill: '#22D3EE',
        opacity: 0.35,
      },
      {
        ...hex,
        x: p.width * 0.12,
        y: p.height * 0.3,
        width: 160,
        height: 160,
        fill: 'transparent',
        stroke: '#A78BFA',
        strokeWidth: 8,
        opacity: 0.7,
      },
    ],
    texts: [
      createTextLayer('banner', {
        label: L(locale, 'Csatornanév', 'Channel name'),
        text: L(locale, 'NEON ARÉNA', 'NEON ARENA'),
        font: 'anton',
        size: 100,
        color: '#F8FAFC',
        x: 50,
        y: 46,
        uppercase: true,
        letterSpacing: 6,
        shadow: true,
      }),
      createTextLayer('banner', {
        label: 'Tagline',
        text: L(locale, 'streamek · kiemelések · rangsor', 'streams · highlights · ranked'),
        font: 'space',
        size: 36,
        color: '#22D3EE',
        x: 50,
        y: 58,
        uppercase: true,
        letterSpacing: 3,
      }),
    ],
  }
}

function bannerPodcast(locale: TemplateLocale): EditorState {
  const state = base('banner', locale)
  const p = getPreset(state.presetId)
  const circle = createShape('circle', p.width, p.height)
  const wave = createShape('wave', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#1E1033',
    backgroundColor2: '#4C1D95',
    useGradient: true,
    gradientAngle: 100,
    vignette: 0.2,
    showSafeArea: true,
    shapes: [
      {
        ...circle,
        x: p.width * 0.68,
        y: p.height * 0.22,
        width: 280,
        height: 280,
        fill: '#A855F7',
        opacity: 0.25,
      },
      {
        ...wave,
        x: p.width * 0.18,
        y: p.height * 0.62,
        width: p.width * 0.35,
        height: 48,
        fill: '#E9D5FF',
        opacity: 0.7,
      },
    ],
    texts: [
      createTextLayer('banner', {
        label: L(locale, 'Csatornanév', 'Channel name'),
        text: L(locale, 'HANGHULLÁM', 'SOUNDWAVE'),
        font: 'bricolage',
        size: 92,
        color: '#FAF5FF',
        x: 42,
        y: 46,
        align: 'left',
        uppercase: true,
        letterSpacing: 4,
        shadow: true,
      }),
      createTextLayer('banner', {
        label: 'Tagline',
        text: L(locale, 'heti beszélgetések', 'weekly conversations'),
        font: 'ibm',
        size: 40,
        color: '#D8B4FE',
        x: 42,
        y: 56,
        align: 'left',
      }),
    ],
  }
}

function bannerClean(locale: TemplateLocale): EditorState {
  const state = base('banner', locale)
  const p = getPreset(state.presetId)
  const bar = createShape('bar', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#F8FAFC',
    backgroundColor2: '#E2E8F0',
    useGradient: true,
    gradientAngle: 180,
    vignette: 0,
    brightness: 105,
    showSafeArea: true,
    shapes: [
      {
        ...bar,
        x: p.width * 0.22,
        y: p.height * 0.56,
        width: p.width * 0.2,
        height: 10,
        fill: '#0F172A',
      },
    ],
    texts: [
      createTextLayer('banner', {
        label: L(locale, 'Csatornanév', 'Channel name'),
        text: L(locale, 'Tiszta Stúdió', 'Clear Studio'),
        font: 'playfair',
        size: 92,
        color: '#0F172A',
        x: 50,
        y: 46,
        shadow: false,
      }),
      createTextLayer('banner', {
        label: 'Tagline',
        text: L(locale, 'design · tippek · eszközök', 'design · tips · tools'),
        font: 'ibm',
        size: 38,
        color: '#475569',
        x: 50,
        y: 58,
      }),
    ],
  }
}

function bannerVlog(locale: TemplateLocale): EditorState {
  const state = base('banner', locale)
  const p = getPreset(state.presetId)
  const ribbon = createShape('ribbon', p.width, p.height)
  const sun = createShape('circle', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#082F49',
    backgroundColor2: '#F97316',
    useGradient: true,
    gradientAngle: 115,
    vignette: 0.15,
    saturate: 120,
    showSafeArea: true,
    shapes: [
      {
        ...sun,
        x: p.width * 0.72,
        y: p.height * 0.15,
        width: 260,
        height: 260,
        fill: '#FDBA74',
        opacity: 0.55,
      },
      {
        ...ribbon,
        x: p.width * 0.2,
        y: p.height * 0.55,
        width: p.width * 0.28,
        height: 56,
        fill: '#FFFFFF',
        opacity: 0.9,
      },
    ],
    texts: [
      createTextLayer('banner', {
        label: L(locale, 'Csatornanév', 'Channel name'),
        text: L(locale, 'ÚTON', 'ON THE ROAD'),
        font: 'oswald',
        size: 100,
        color: '#FFF7ED',
        x: 42,
        y: 45,
        align: 'left',
        uppercase: true,
        letterSpacing: 8,
        shadow: true,
      }),
      createTextLayer('banner', {
        label: 'Tagline',
        text: L(locale, 'utazás · étel · hétköznapok', 'travel · food · everyday'),
        font: 'caveat',
        size: 48,
        color: '#FFEDD5',
        x: 42,
        y: 58,
        align: 'left',
      }),
    ],
  }
}

function thumbListicle(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const badge = createShape('badge', p.width, p.height)
  const bar = createShape('round', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#0C1220',
    backgroundColor2: '#1E3A5F',
    useGradient: true,
    gradientAngle: 155,
    vignette: 0.28,
    contrast: 112,
    shapes: [
      {
        ...badge,
        x: p.width * 0.06,
        y: p.height * 0.18,
        width: p.height * 0.42,
        height: p.height * 0.42,
        fill: '#F5A524',
        stroke: '#FFFFFF',
        strokeWidth: 8,
        shadow: true,
        shadowBlur: 28,
      },
      {
        ...bar,
        x: p.width * 0.42,
        y: p.height * 0.62,
        width: p.width * 0.5,
        height: p.height * 0.16,
        fill: '#0A84FF',
        cornerRadius: 28,
        opacity: 0.95,
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: L(locale, 'Szám', 'Number'),
        text: '7',
        font: 'bebas',
        size: 180,
        color: '#111111',
        x: 18,
        y: 39,
        align: 'left',
        shadow: false,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'TIPP AMIT TUDNOD KELL', 'TIPS YOU NEED TO KNOW'),
        font: 'anton',
        size: 64,
        color: '#FFFFFF',
        x: 66,
        y: 38,
        align: 'left',
        uppercase: true,
        stroke: true,
        strokeColor: '#000',
        strokeWidth: 8,
        shadow: true,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Alcím', 'Subtitle'),
        text: L(locale, 'gyors lista', 'quick list'),
        font: 'ibm',
        size: 36,
        color: '#E8F1FF',
        x: 67,
        y: 70,
        align: 'left',
      }),
    ],
  }
}

function thumbSubscribe(locale: TemplateLocale): EditorState {
  const state = base('thumbnail', locale)
  const p = getPreset(state.presetId)
  const play = createShape('play', p.width, p.height)
  const pill = createShape('pill', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#180000',
    backgroundColor2: '#7F1D1D',
    useGradient: true,
    gradientAngle: 130,
    vignette: 0.35,
    saturate: 120,
    glow: 0.35,
    glowColor: '#FF3B30',
    glowX: 50,
    glowY: 50,
    shapes: [
      {
        ...play,
        x: p.width * 0.38,
        y: p.height * 0.22,
        width: p.width * 0.24,
        height: p.height * 0.36,
        fill: '#FFFFFF',
        opacity: 0.95,
        shadow: true,
        shadowBlur: 30,
      },
      {
        ...pill,
        x: p.width * 0.28,
        y: p.height * 0.68,
        width: p.width * 0.44,
        height: p.height * 0.14,
        fill: '#FF3B30',
        shadow: true,
      },
    ],
    texts: [
      createTextLayer('thumbnail', {
        label: 'CTA',
        text: L(locale, 'FELIRATKOZÁS', 'SUBSCRIBE'),
        font: 'bebas',
        size: 52,
        color: '#FFFFFF',
        x: 50,
        y: 75,
        uppercase: true,
        letterSpacing: 3,
        shadow: false,
      }),
      createTextLayer('thumbnail', {
        label: L(locale, 'Cím', 'Title'),
        text: L(locale, 'NE HAGYD KI', "DON'T MISS THIS"),
        font: 'anton',
        size: 86,
        color: '#FFFFFF',
        x: 50,
        y: 18,
        uppercase: true,
        stroke: true,
        strokeColor: '#000',
        strokeWidth: 8,
        shadow: true,
      }),
    ],
  }
}

function bannerMinimalDark(locale: TemplateLocale): EditorState {
  const state = base('banner', locale)
  const p = getPreset(state.presetId)
  const line = createShape('line', p.width, p.height)
  return {
    ...state,
    backgroundColor: '#050505',
    backgroundColor2: '#171717',
    useGradient: true,
    gradientAngle: 180,
    vignette: 0.25,
    grain: 0.12,
    showSafeArea: true,
    shapes: [
      {
        ...line,
        x: p.width * 0.22,
        y: p.height * 0.54,
        width: p.width * 0.18,
        height: 6,
        fill: '#F5A524',
        stroke: '#F5A524',
        strokeWidth: 6,
      },
    ],
    texts: [
      createTextLayer('banner', {
        label: L(locale, 'Csatornanév', 'Channel name'),
        text: L(locale, 'FEKETE DOBOZ', 'BLACKBOX'),
        font: 'space',
        size: 92,
        color: '#FAFAFA',
        x: 50,
        y: 46,
        uppercase: true,
        letterSpacing: 10,
        shadow: true,
      }),
      createTextLayer('banner', {
        label: 'Tagline',
        text: L(locale, 'kevesebb zaj · több jel', 'less noise · more signal'),
        font: 'ibm',
        size: 36,
        color: '#A3A3A3',
        x: 50,
        y: 58,
      }),
    ],
  }
}

export const TEMPLATES: Template[] = [
  {
    id: 'thumb-bold',
    kind: 'thumbnail',
    label: { hu: 'Bold Click', en: 'Bold Click' },
    description: {
      hu: 'Erős cím, akcent sáv, glow',
      en: 'Strong title, accent bar, glow',
    },
    accent: '#F5A524',
    build: thumbBold,
  },
  {
    id: 'thumb-minimal',
    kind: 'thumbnail',
    label: { hu: 'Minimal', en: 'Minimal' },
    description: {
      hu: 'Tiszta, sötét, elegáns',
      en: 'Clean, dark, elegant',
    },
    accent: '#9AA3B5',
    build: thumbMinimal,
  },
  {
    id: 'thumb-gaming',
    kind: 'thumbnail',
    label: { hu: 'Gaming Neon', en: 'Gaming Neon' },
    description: {
      hu: 'Neon glow, scanline, csíkok',
      en: 'Neon glow, scanlines, stripes',
    },
    accent: '#32F5C8',
    build: thumbGaming,
  },
  {
    id: 'thumb-news',
    kind: 'thumbnail',
    label: { hu: 'Hírek / Breaking', en: 'News / Breaking' },
    description: {
      hu: 'Piros sáv, sárga badge',
      en: 'Red bar, yellow badge',
    },
    accent: '#C8102E',
    build: thumbNews,
  },
  {
    id: 'thumb-podcast',
    kind: 'thumbnail',
    label: { hu: 'Podcast', en: 'Podcast' },
    description: {
      hu: 'Kör portréhely, epizód címke',
      en: 'Circle portrait slot, episode tag',
    },
    accent: '#7C3AED',
    build: thumbPodcast,
  },
  {
    id: 'thumb-tutorial',
    kind: 'thumbnail',
    label: { hu: 'Tutorial', en: 'Tutorial' },
    description: {
      hu: 'How-to badge, play ikon',
      en: 'How-to badge, play icon',
    },
    accent: '#22C55E',
    build: thumbTutorial,
  },
  {
    id: 'thumb-reaction',
    kind: 'thumbnail',
    label: { hu: 'Reakció', en: 'Reaction' },
    description: {
      hu: 'Burst, villám, nagy felirat',
      en: 'Burst, lightning, huge type',
    },
    accent: '#F59E0B',
    build: thumbReaction,
  },
  {
    id: 'thumb-soft',
    kind: 'thumbnail',
    label: { hu: 'Soft / Lifestyle', en: 'Soft / Lifestyle' },
    description: {
      hu: 'Világos, pasztell, vlog',
      en: 'Light pastel vlog look',
    },
    accent: '#FB7185',
    build: thumbSoft,
  },
  {
    id: 'thumb-tech',
    kind: 'thumbnail',
    label: { hu: 'Tech Review', en: 'Tech Review' },
    description: {
      hu: 'Sötét kék, hex, scanline',
      en: 'Dark blue, hex, scanline',
    },
    accent: '#38BDF8',
    build: thumbTech,
  },
  {
    id: 'thumb-listicle',
    kind: 'thumbnail',
    label: { hu: 'Lista / Top N', en: 'List / Top N' },
    description: {
      hu: 'Nagy szám, tipp lista vibe',
      en: 'Big number, listicle vibe',
    },
    accent: '#0A84FF',
    build: thumbListicle,
  },
  {
    id: 'thumb-subscribe',
    kind: 'thumbnail',
    label: { hu: 'Feliratkozás', en: 'Subscribe CTA' },
    description: {
      hu: 'Play + piros CTA gomb',
      en: 'Play + red CTA button',
    },
    accent: '#FF3B30',
    build: thumbSubscribe,
  },
  {
    id: 'banner-brand',
    kind: 'banner',
    label: { hu: 'Brand Banner', en: 'Brand Banner' },
    description: {
      hu: 'Safe area-barát csatorna borító',
      en: 'Safe-area friendly channel art',
    },
    accent: '#F5A524',
    build: bannerBrand,
  },
  {
    id: 'banner-cinematic',
    kind: 'banner',
    label: { hu: 'Cinematic', en: 'Cinematic' },
    description: {
      hu: 'Letterbox, grain, filmhangulat',
      en: 'Letterbox, grain, film mood',
    },
    accent: '#C4B5A0',
    build: bannerCinematic,
  },
  {
    id: 'banner-gaming',
    kind: 'banner',
    label: { hu: 'Gaming Banner', en: 'Gaming Banner' },
    description: {
      hu: 'Neon, chevron, stream vibe',
      en: 'Neon, chevron, stream vibe',
    },
    accent: '#22D3EE',
    build: bannerGaming,
  },
  {
    id: 'banner-podcast',
    kind: 'banner',
    label: { hu: 'Podcast Banner', en: 'Podcast Banner' },
    description: {
      hu: 'Lila hangulat, hullám',
      en: 'Purple mood, wave accent',
    },
    accent: '#A855F7',
    build: bannerPodcast,
  },
  {
    id: 'banner-clean',
    kind: 'banner',
    label: { hu: 'Clean Light', en: 'Clean Light' },
    description: {
      hu: 'Világos, minimal brand',
      en: 'Light, minimal brand',
    },
    accent: '#0F172A',
    build: bannerClean,
  },
  {
    id: 'banner-vlog',
    kind: 'banner',
    label: { hu: 'Vlog / Utazás', en: 'Vlog / Travel' },
    description: {
      hu: 'Naplemente, ribbon, életérzés',
      en: 'Sunset, ribbon, travel feel',
    },
    accent: '#F97316',
    build: bannerVlog,
  },
  {
    id: 'banner-minimal-dark',
    kind: 'banner',
    label: { hu: 'Minimal Dark', en: 'Minimal Dark' },
    description: {
      hu: 'Fekete, tiszta tipográfia',
      en: 'Black, clean typography',
    },
    accent: '#F5A524',
    build: bannerMinimalDark,
  },
]

export function templatesFor(kind: ProjectKind): Template[] {
  return TEMPLATES.filter((t) => t.kind === kind)
}

export function templateLabel(tmpl: Template, locale: 'hu' | 'en') {
  return tmpl.label[locale]
}

export function templateDescription(tmpl: Template, locale: 'hu' | 'en') {
  return tmpl.description[locale]
}
