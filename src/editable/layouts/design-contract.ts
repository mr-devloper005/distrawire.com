import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#eef5fb',
  '--slot4-page-text': '#17314d',
  '--slot4-panel-bg': '#dfeaf4',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#58708a',
  '--slot4-soft-muted-text': '#7e95ab',
  '--slot4-accent': '#1ac8c0',
  '--slot4-accent-fill': '#1ac8c0',
  '--slot4-accent-soft': '#d9f7f2',
  '--slot4-dark-bg': '#225eab',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#d6e5f1',
  '--slot4-cream': '#f3e3d0',
  '--slot4-warm': '#fcf8f3',
  '--slot4-lavender': '#e77fbe',
  '--slot4-gray': '#e4edf5',
  '--slot4-border': 'rgba(23,49,77,0.14)',
  '--slot4-body-gradient': 'linear-gradient(180deg, #f7fbff 0%, #eef5fb 26%, #ffffff 100%)',
  '--slot4-hero-gradient': 'linear-gradient(110deg, #2d7dcb 0%, #25a8cc 45%, #1ac8c0 100%)',
  '--slot4-footer-bg': '#1d2735',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--slot4-border)]',
  darkBorder: 'border-white/18',
  shadow: 'shadow-[0_16px_40px_rgba(36,88,146,0.10)]',
  shadowStrong: 'shadow-[0_28px_80px_rgba(29,70,119,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(15,37,62,0.02),rgba(15,37,62,0.76))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-12 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[250px] shrink-0 snap-start sm:w-[290px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.2em]',
    heroTitle: 'text-4xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-[5.3rem]',
    sectionTitle: 'text-3xl font-black leading-none tracking-[-0.045em] sm:text-4xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-[14px] bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-110`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-[14px] border border-[var(--slot4-border)] bg-white/80 px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-white`,
    accent: `inline-flex items-center justify-center gap-2 rounded-[14px] bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:brightness-95`,
  },
  media: {
    frame: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(36,88,146,0.16)]',
    fade: 'transition duration-300 hover:opacity-75',
  },
} as const

export const aiLayoutRules = [
  'All visible layout decisions belong inside src/editable; keep data, SEO, API, and route logic untouched.',
  'Use a premium press-platform style with airy gradients, soft panels, rounded editorial modules, and teal-blue accents.',
  'Keep dynamic post fetching intact and never replace backend posts with mock arrays.',
  'Use postHref() for all post links so route aliases and task-specific detail pages remain functional.',
  'Prioritize readable desktop and mobile layouts with broad story columns and a focused long-form article measure.',
  'Branding must remain dynamic from SITE_CONFIG; never hardcode a reference publication name or logo.',
] as const
