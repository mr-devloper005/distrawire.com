import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((value): value is string => typeof value === 'string' && Boolean(value))
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage', 'logo']
    .map((key) => content[key])
    .find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || directImage || contentImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured release' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block min-w-0 overflow-hidden rounded-[32px] bg-[var(--slot4-dark-bg)] text-white shadow-[0_24px_70px_rgba(36,88,146,0.18)]">
      <div className="relative aspect-[16/10] min-h-[420px] overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,38,67,0.08),rgba(12,38,67,0.82))]" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
          <span className="inline-flex rounded-full bg-[var(--slot4-lavender)] px-4 py-2 text-[10px] font-black uppercase tracking-[.18em] text-white">{label}</span>
          <h3 className="mt-5 max-w-4xl text-4xl font-semibold leading-[.97] tracking-[-.055em] sm:text-6xl">{post.title}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{getEditableExcerpt(post, 190)}</p>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-[28px] border ${pal.border} bg-white ${dc.motion.lift}`}>
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-black uppercase tracking-[.18em] text-[var(--slot4-dark-bg)]">
          <span>{getEditableCategory(post)}</span><span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="mt-3 line-clamp-3 text-xl font-black leading-[1.02] tracking-[-.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 grid-cols-[52px_1fr] gap-4 border-t border-[var(--slot4-border)] py-5 first:border-t-0">
      <span className="text-3xl font-black leading-none text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--slot4-muted-text)]"><Clock3 className="h-3 w-3" /> {getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-3 text-lg font-black leading-tight tracking-[-.03em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-dark-bg)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid min-w-0 overflow-hidden rounded-[30px] border border-[var(--slot4-border)] bg-white shadow-[0_18px_44px_rgba(36,88,146,0.08)] sm:grid-cols-[260px_minmax(0,1fr)] sm:gap-0">
      <div className="relative aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-6 sm:p-7">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
        <h2 className="mt-3 line-clamp-3 text-3xl font-black leading-[1.02] tracking-[-.05em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-dark-bg)]">{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-[var(--slot4-dark-bg)]">Read story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function HorizontalWireCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[28px] border border-[var(--slot4-border)] bg-white shadow-[0_18px_44px_rgba(36,88,146,0.08)] md:grid-cols-[1.1fr_.9fr]">
      <div className="p-6 sm:p-8">
        <span className="inline-flex rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)]">{getEditableCategory(post)}</span>
        <h3 className="mt-4 text-3xl font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 170)}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)]">Explore update <ArrowRight className="h-4 w-4" /></span>
      </div>
      <div className="relative min-h-[240px] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[28px] border border-[var(--slot4-border)] bg-white shadow-[0_18px_44px_rgba(36,88,146,0.08)]">
      <div className="relative aspect-[5/6] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(23,49,77,0.82))] p-5 text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/75">{getEditableCategory(post)}</span>
          <h3 className="mt-2 line-clamp-3 text-xl font-black leading-tight">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}
