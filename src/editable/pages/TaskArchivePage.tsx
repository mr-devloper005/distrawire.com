import Link from 'next/link'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Newspaper, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { CompactIndexCard, getEditableCategory, getEditableExcerpt, getEditablePostImage, HorizontalWireCard, ImageFirstCard, postHref, RailPostCard } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; badge: string }> = {
  mediaDistribution: { icon: Newspaper, badge: 'Newswire' },
  article: { icon: FileText, badge: 'Editorial' },
  listing: { icon: Building2, badge: 'Directory' },
  classified: { icon: Megaphone, badge: 'Classified' },
  image: { icon: Camera, badge: 'Gallery' },
  sbm: { icon: Bookmark, badge: 'Bookmark' },
  pdf: { icon: Download, badge: 'PDF' },
  profile: { icon: UserRound, badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const label = taskConfig?.label || task
  const Icon = taskDeck[task].icon
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getEditableCategory(post)
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category
  const lead = posts[0]
  const feature = posts[1] || lead
  const briefs = posts.slice(2, 8)
  const grid = posts.slice(8)
  const page = pagination.page || 1

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[36px] border border-[var(--slot4-border)] bg-white shadow-[0_24px_80px_rgba(36,88,146,0.12)]">
            <div className="grid gap-8 bg-[var(--slot4-hero-gradient)] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:px-12 lg:py-12">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.24em]"><Icon className="h-4 w-4" /> {taskDeck[task].badge}</div>
                <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
                <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/84">{voice?.description || SITE_CONFIG.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={basePath} className="inline-flex items-center justify-center rounded-[14px] bg-[var(--slot4-accent)] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white">Browse all</Link>
                  <Link href="/search" className="inline-flex items-center justify-center rounded-[14px] border border-white/25 px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white">Search posts</Link>
                </div>
              </div>

              <form action={basePath} className="self-end rounded-[28px] bg-white/14 p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em]"><Filter className="h-4 w-4" /> Filter</div>
                <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-[14px] border border-white/15 bg-white px-4 text-sm font-bold text-[var(--slot4-page-text)] outline-none">
                  <option value="all">All categories</option>
                  {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-3 h-12 w-full rounded-[14px] bg-[var(--slot4-dark-bg)] text-sm font-black text-white">Apply</button>
                <p className="mt-3 text-xs font-bold text-white/75">Showing: {categoryLabel}</p>
              </form>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={basePath} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${category === 'all' ? 'bg-[var(--slot4-dark-bg)] text-white' : 'border border-[var(--slot4-border)] bg-white text-[var(--slot4-page-text)]'}`}>All</Link>
            {dynamicCategories.slice(0, 8).map((item) => (
              <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${category === item.slug ? 'bg-[var(--slot4-accent)] text-white' : 'border border-[var(--slot4-border)] bg-white text-[var(--slot4-page-text)]'}`}>
                {item.name}
              </Link>
            ))}
          </div>

          {lead ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
              <div className="overflow-hidden rounded-[32px] bg-[var(--slot4-dark-bg)]">
                <Link href={postHref(task, lead, basePath)} className="group block">
                  <div className="relative min-h-[420px] overflow-hidden">
                    <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(23,49,77,0.82))]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                      <span className="inline-flex rounded-full bg-[var(--slot4-lavender)] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em]">{getEditableCategory(lead)}</span>
                      <h2 className="mt-4 text-4xl font-semibold leading-[0.96] tracking-[-0.05em] sm:text-5xl">{lead.title}</h2>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82">{getEditableExcerpt(lead, 180)}</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="grid gap-6">
                {feature ? <HorizontalWireCard post={feature} href={postHref(task, feature, basePath)} /> : null}
                <div className="luxury-card p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">Quick reads</p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">The briefing</h2>
                    </div>
                    <Link href="/search" className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)]">Search</Link>
                  </div>
                  <div className="mt-4">
                    {briefs.map((post, index) => <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(task, post, basePath)} index={index} />)}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {posts.length ? (
            <section className="mt-10">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">Latest releases</p>
                  <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">More from the desk</h2>
                </div>
                <form action={basePath} className="flex items-center gap-3">
                  <input type="hidden" name="category" value={category === 'all' ? '' : category} />
                  <label className="hidden items-center gap-2 rounded-[14px] border border-[var(--slot4-border)] bg-white px-4 py-3 text-sm font-semibold sm:flex">
                    <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                    <span>Scroll the latest collection</span>
                  </label>
                </form>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {grid.length ? grid.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />) : briefs.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
              </div>
            </section>
          ) : (
            <div className="mt-10 rounded-[28px] border border-dashed border-[var(--slot4-border)] bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-muted-text)]" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-[14px] border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-[14px] bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-[14px] border border-[var(--slot4-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = postHref(task, post, basePath)
  if (task === 'image') return <ImageFirstCard post={post} href={href} />
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return index % 4 === 0 ? <HorizontalWireCard post={post} href={href} /> : <RailPostCard post={post} href={href} index={index} />
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getEditablePostImage(post)
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[28px] border border-[var(--slot4-border)] bg-white p-5 shadow-[0_18px_44px_rgba(36,88,146,0.08)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[24px] bg-[var(--slot4-page-bg)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--slot4-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
        {phone ? <p className="mt-4 text-xs font-bold text-[var(--slot4-muted-text)]">Phone: {phone}</p> : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[28px] border border-[var(--slot4-border)] bg-white shadow-[0_18px_44px_rgba(36,88,146,0.08)]">
      <div className="grid min-h-64 md:grid-cols-[0.72fr_1fr]">
        <div className="bg-[var(--slot4-dark-bg)] p-6 text-white">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/75">{location || 'Details inside'}</p>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[28px] border border-[var(--slot4-border)] bg-white p-6 shadow-[0_18px_44px_rgba(36,88,146,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-[var(--slot4-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="rounded-[28px] border border-[var(--slot4-border)] bg-white p-6 shadow-[0_18px_44px_rgba(36,88,146,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[20px] bg-[var(--slot4-dark-bg)] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)]">PDF</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="rounded-[28px] border border-[var(--slot4-border)] bg-white p-6 text-center shadow-[0_18px_44px_rgba(36,88,146,0.08)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-page-bg)]">
        <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover" />
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[var(--slot4-muted-text)]">{getSummary(post)}</p>
    </Link>
  )
}
