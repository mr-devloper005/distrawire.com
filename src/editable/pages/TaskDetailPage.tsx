  import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { CompactIndexCard, getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  const baseRoute = getTaskConfig(task)?.route || `/${task}`
  const website = getField(post, ['website', 'url', 'link', 'fileUrl', 'pdfUrl', 'documentUrl'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const address = getField(post, ['address', 'location', 'city'])
  const role = getField(post, ['role', 'designation', 'company'])
  const price = getField(post, ['price', 'amount', 'budget'])
  const mapSrc = mapSrcFor(post)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[36px] border border-[var(--slot4-border)] bg-white shadow-[0_24px_80px_rgba(36,88,146,0.12)]">
            <div className="grid gap-8 bg-[image:var(--slot4-hero-gradient)] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:py-12">
              <div>
                <BackLink task={task} />
                <div className="mt-8 flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.16em] text-white/78">
                  <span className="rounded-full bg-white/14 px-3 py-2">{getEditableCategory(post)}</span>
                  {published ? <time>{published}</time> : null}
                </div>
                <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
              
                <div className="mt-8 flex flex-wrap gap-3">
                  
                  {phone ? <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/25 px-5 py-3 text-sm font-black text-white"><Phone className="h-4 w-4" /> Call</a> : null}
                  {email ? <a href={`mailto:${email}`} className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/25 px-5 py-3 text-sm font-black text-white"><Mail className="h-4 w-4" /> Email</a> : null}
                </div>
              </div>

              <div className="rounded-[28px] bg-white/14 p-5 backdrop-blur">
                {images[0] ? (
                  <div className="overflow-hidden rounded-[24px]">
                    <img src={images[0]} alt={post.title} className="h-[320px] w-full object-cover sm:h-[380px]" />
                  </div>
                ) : (
                  <div className="flex h-[320px] items-center justify-center rounded-[24px] bg-white/10 sm:h-[380px]">
                    <FallbackIcon task={task} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <article className="luxury-card p-6 sm:p-8">
              <InfoRibbon task={task} post={post} role={role} address={address} price={price} />
              <BodyContent post={post} />
              {images.length > 1 ? <ImageStrip images={images.slice(1)} label="Related visuals" large={task === 'image'} /> : null}
              {(task === 'article' || task === 'mediaDistribution') ? <EditableComments slug={post.slug} comments={comments} /> : null}
            </article>

            <aside className="space-y-6">
              <div className="luxury-card p-6">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">About this post</p>
                <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--slot4-muted-text)]">
                  <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {getTaskConfig(task)?.label || task}</p>
                  <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
                  {role ? <p className="inline-flex items-center gap-2"><UserRound className="h-4 w-4" /> {role}</p> : null}
                  {address ? <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {address}</p> : null}
                  {price ? <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> {price}</p> : null}
                </div>
              </div>

              {(website || phone || email) ? <ContactAction website={website} phone={phone} email={email} /> : null}
              {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}

              {related.length ? (
                <div className="luxury-card p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
                    <Link href={baseRoute} className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)]">View all</Link>
                  </div>
                  <div className="mt-4">
                    {related.map((item, index) => <CompactIndexCard key={item.id || item.slug} post={item} href={postHref(task, item, baseRoute)} index={index} />)}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function BodyContent({ post }: { post: SitePost }) {
  return <div className="article-content mt-8 max-w-none text-lg leading-9" dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoRibbon({ task, post, role, address, price }: { task: TaskKey; post: SitePost; role: string; address: string; price: string }) {
  const items = [
    role ? { label: 'Role', value: role } : null,
    address ? { label: 'Location', value: address } : null,
    price ? { label: 'Price', value: price } : null,
    post.publishedAt ? { label: 'Published', value: new Date(post.publishedAt).toLocaleDateString() } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item))

  if (!items.length && task !== 'listing' && task !== 'classified') return null

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={`${item.label}-${item.value}`} className="rounded-[20px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)]">{item.label}</p>
          <p className="mt-2 text-sm font-bold text-[var(--slot4-muted-text)]">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[20px] object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="luxury-card overflow-hidden">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  return (
    <div className="luxury-card p-6">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <ActionLink href={website} label="Website" icon={<Globe2 className="h-4 w-4" />} filled /> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--slot4-border)] px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-[14px] border border-[var(--slot4-border)] px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function ActionLink({ href, label, icon, filled = false }: { href: string; label: string; icon: React.ReactNode; filled?: boolean }) {
  return (
    <Link href={href} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-2 rounded-[14px] px-4 py-2 text-sm font-black ${filled ? 'bg-[var(--slot4-accent)] text-white' : 'border border-[var(--slot4-border)] text-[var(--slot4-page-text)]'}`}>
      {label} {icon}
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 rounded-[28px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[18px] border border-[var(--slot4-border)] bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}

function FallbackIcon({ task }: { task: TaskKey }) {
  if (task === 'listing') return <Building2 className="h-16 w-16 text-white/75" />
  if (task === 'image') return <Camera className="h-16 w-16 text-white/75" />
  if (task === 'sbm') return <Bookmark className="h-16 w-16 text-white/75" />
  if (task === 'pdf') return <Download className="h-16 w-16 text-white/75" />
  if (task === 'profile') return <UserRound className="h-16 w-16 text-white/75" />
  return <FileText className="h-16 w-16 text-white/75" />
}
