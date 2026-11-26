export type FontOption = {
  id: string
  label: string
  family: string
  weight: number
  preview: string
  group: 'display' | 'sans' | 'serif' | 'script' | 'fun'
}

export const FONTS: FontOption[] = [
  {
    id: 'bricolage',
    label: 'Bricolage',
    family: '"Bricolage Grotesque", system-ui, sans-serif',
    weight: 800,
    preview: 'Bricolage Grotesque',
    group: 'display',
  },
  {
    id: 'bebas',
    label: 'Bebas',
    family: '"Bebas Neue", Impact, sans-serif',
    weight: 400,
    preview: 'Bebas Neue',
    group: 'display',
  },
  {
    id: 'anton',
    label: 'Anton',
    family: '"Anton", Impact, sans-serif',
    weight: 400,
    preview: 'Anton',
    group: 'display',
  },
  {
    id: 'oswald',
    label: 'Oswald',
    family: '"Oswald", system-ui, sans-serif',
    weight: 700,
    preview: 'Oswald',
    group: 'display',
  },
  {
    id: 'archivo',
    label: 'Archivo Black',
    family: '"Archivo Black", Impact, sans-serif',
    weight: 400,
    preview: 'Archivo Black',
    group: 'display',
  },
  {
    id: 'righteous',
    label: 'Righteous',
    family: '"Righteous", system-ui, sans-serif',
    weight: 400,
    preview: 'Righteous',
    group: 'display',
  },
  {
    id: 'russo',
    label: 'Russo One',
    family: '"Russo One", system-ui, sans-serif',
    weight: 400,
    preview: 'Russo One',
    group: 'display',
  },
  {
    id: 'teko',
    label: 'Teko',
    family: '"Teko", system-ui, sans-serif',
    weight: 600,
    preview: 'Teko',
    group: 'display',
  },
  {
    id: 'blackops',
    label: 'Black Ops',
    family: '"Black Ops One", system-ui, sans-serif',
    weight: 400,
    preview: 'Black Ops One',
    group: 'display',
  },
  {
    id: 'space',
    label: 'Space Grotesk',
    family: '"Space Grotesk", system-ui, sans-serif',
    weight: 700,
    preview: 'Space Grotesk',
    group: 'sans',
  },
  {
    id: 'ibm',
    label: 'IBM Plex',
    family: '"IBM Plex Sans", system-ui, sans-serif',
    weight: 500,
    preview: 'IBM Plex Sans',
    group: 'sans',
  },
  {
    id: 'montserrat',
    label: 'Montserrat',
    family: '"Montserrat", system-ui, sans-serif',
    weight: 800,
    preview: 'Montserrat',
    group: 'sans',
  },
  {
    id: 'rubik',
    label: 'Rubik',
    family: '"Rubik", system-ui, sans-serif',
    weight: 700,
    preview: 'Rubik',
    group: 'sans',
  },
  {
    id: 'nunito',
    label: 'Nunito',
    family: '"Nunito", system-ui, sans-serif',
    weight: 800,
    preview: 'Nunito',
    group: 'sans',
  },
  {
    id: 'playfair',
    label: 'Playfair',
    family: '"Playfair Display", Georgia, serif',
    weight: 700,
    preview: 'Playfair Display',
    group: 'serif',
  },
  {
    id: 'cinzel',
    label: 'Cinzel',
    family: '"Cinzel", Georgia, serif',
    weight: 700,
    preview: 'Cinzel',
    group: 'serif',
  },
  {
    id: 'dmserif',
    label: 'DM Serif',
    family: '"DM Serif Display", Georgia, serif',
    weight: 400,
    preview: 'DM Serif Display',
    group: 'serif',
  },
  {
    id: 'caveat',
    label: 'Caveat',
    family: '"Caveat", cursive',
    weight: 700,
    preview: 'Caveat',
    group: 'script',
  },
  {
    id: 'pacifico',
    label: 'Pacifico',
    family: '"Pacifico", cursive',
    weight: 400,
    preview: 'Pacifico',
    group: 'script',
  },
  {
    id: 'lobster',
    label: 'Lobster',
    family: '"Lobster", cursive',
    weight: 400,
    preview: 'Lobster',
    group: 'script',
  },
  {
    id: 'marker',
    label: 'Permanent Marker',
    family: '"Permanent Marker", cursive',
    weight: 400,
    preview: 'Permanent Marker',
    group: 'fun',
  },
  {
    id: 'bangers',
    label: 'Bangers',
    family: '"Bangers", system-ui, sans-serif',
    weight: 400,
    preview: 'Bangers',
    group: 'fun',
  },
  {
    id: 'pressstart',
    label: 'Press Start',
    family: '"Press Start 2P", monospace',
    weight: 400,
    preview: 'Press Start 2P',
    group: 'fun',
  },
]

export const FONT_GROUP_LABELS: Record<FontOption['group'], string> = {
  display: 'Display',
  sans: 'Sans',
  serif: 'Serif',
  script: 'Script',
  fun: 'Fun',
}

export function getFont(id: string): FontOption {
  return FONTS.find((f) => f.id === id) ?? FONTS[0]
}
