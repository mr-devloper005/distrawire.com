'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Plus, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { CompactIndexCard, getEditableCategory, getEditableExcerpt, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function TextStoryCard({
  post,
  href,
  eyebrow,
  index,
  className = '',
}: {
  post: SitePost
  href: string
  eyebrow?: string
  index?: number
  className?: string
}) {
  return (
    <Link href={href} className={`group block rounded-[28px] border border-[var(--slot4-border)] bg-white p-6 shadow-[0_18px_44px_rgba(36,88,146,0.08)] ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)]">
          {eyebrow || getEditableCategory(post)}
        </span>
        {typeof index === 'number' ? <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">{String(index + 1).padStart(2, '0')}</span> : null}
      </div>
      <h3 className="mt-4 text-2xl font-semibold leading-[1.02] tracking-[-0.05em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-dark-bg)]">
        {post.title}
      </h3>
      <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">
        {getEditableExcerpt(post, 170) || 'Fresh public-facing updates and editorial-ready release details from the archive.'}
      </p>
    </Link>
  )
}

function LatestReleaseList({
  posts,
  primaryTask,
  primaryRoute,
}: {
  posts: SitePost[]
  primaryTask: TaskKey
  primaryRoute: string
}) {
  const [visibleCount, setVisibleCount] = useState(5)
  const visiblePosts = posts.slice(0, visibleCount)
  const hasMore = visibleCount < posts.length

  return (
    <div className="luxury-card p-6 sm:p-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">Latest releases</p>
      <div className="mt-4">
        {visiblePosts.map((post, index) => (
          <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
        ))}
      </div>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + 5)}
          className="mt-6 inline-flex items-center justify-center rounded-[14px] bg-[var(--slot4-dark-bg)] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:brightness-110"
        >
          Load more
        </button>
      ) : null}
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const heroCard = posts[1] || lead
  const logos = ['Trusted by growing teams', 'Distribution-first workflows', 'Faster newsroom visibility']

  return (
    <section className="overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className="bg-[var(--slot4-hero-gradient)] wire-curve">
        <div className={`${dc.shell.section} py-10 sm:py-14 lg:py-16`}>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div className="text-[var(--slot4-dark-bg)]">
              <p className="text-xs font-black uppercase tracking-[0.26em] text-[var(--slot4-dark-bg)]/75"></p>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-[5rem]">
                Press release distribution built for modern media teams.
              </h1>
              <p className="mt-7 max-w-2xl text-lg font-semibold leading-9 text-[var(--slot4-dark-bg)]/82">
                Publish updates, shape discovery, and keep your story package presentation-ready from first draft to newsroom pickup.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href='/contact' className={dc.button.accent}>Submit a release</Link>
                <Link href="/search" className="inline-flex items-center justify-center rounded-[14px] border border-[var(--slot4-dark-bg)]/20 bg-white/70 px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--slot4-dark-bg)] hover:bg-white">Explore archive</Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm font-semibold text-[var(--slot4-dark-bg)]/76">
                {logos.map((item) => (
                  <span key={item} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-dark-bg)]" /> {item}</span>
                ))}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[350px] rounded-[28px] bg-[var(--slot4-lavender)] p-4 shadow-[0_30px_80px_rgba(20,62,107,0.24)] sm:max-w-[380px]">
              <div className="rounded-[22px] bg-white/10 p-4 text-white">
                <h2 className="text-3xl font-semibold leading-tight tracking-[-0.05em]">Get your story seen in the right places.</h2>
              </div>
              <div className="mt-4 rounded-[22px] bg-white p-6 text-[var(--slot4-page-text)]">
                <p className="text-right text-sm font-semibold text-[var(--slot4-muted-text)]">Newsstream reach</p>
                <p className="mt-6 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-dark-bg)]">{getEditableCategory(heroCard)}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em]">
                  {heroCard?.title || 'Distribution visibility that keeps your updates easy to find.'}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">
                  {getEditableExcerpt(heroCard, 150) || 'Distribution snapshots and release highlights from the latest post.'}
                </p>
                <div className="mt-6 border-t border-[var(--slot4-border)] pt-4">
                  <span className="text-2xl font-semibold tracking-[-0.04em]">Monthly Reach: Billions!</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-4 rounded-[28px] bg-white/20 p-5 text-[var(--slot4-dark-bg)] backdrop-blur md:grid-cols-3">
            {logos.map((item) => (
              <div key={item} className="inline-flex items-center justify-center gap-2 text-center text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(2, 10).length ? posts.slice(2, 10) : posts
  if (!railPosts.length) return null

  return (
    <section className="bg-white">
      <div className={`${dc.shell.section} py-14 sm:py-16`}>
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">trusted by distribution teams</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-dark-bg)] sm:text-5xl">Press release distribution and multimedia services</h2>
          <p className="mt-4 max-w-3xl text-lg text-[var(--slot4-muted-text)]">Greater brand awareness, increased traffic, and a cleaner release workflow for public-facing announcements.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {railPosts.map((post, index) => (
            <TextStoryCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[0]
  const left = posts[3] || posts[1]
  const right = posts[4] || posts[2]
  const stack = posts.slice(5, 8)
  if (!feature) return null

  return (
    <section className="overflow-hidden bg-[var(--slot4-accent)] text-white">
      <div className="wire-curve">
        <div className={`${dc.shell.section} py-16 sm:py-20`}>
          <div className="text-center">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] sm:text-5xl">Press Release Optimizer</h2>
            <p className="mx-auto mt-5 max-w-3xl text-xl text-[var(--slot4-page-text)]/80">All our products and services under one subscription.</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[feature, left, right].filter(Boolean).map((post, index) => (
              <div key={post!.id || post!.slug} className="rounded-[28px] bg-white/10 p-6 backdrop-blur">
                <p className="text-center text-4xl font-black uppercase tracking-[-0.04em]">{index === 0 ? 'CONTENT PRO' : index === 1 ? 'MEDIA PRO' : 'TOTAL PRO'}</p>
                <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.04em]">{post!.title}</h3>
                <p className="mt-5 text-lg font-semibold text-white/82">{getEditableExcerpt(post, 120) || 'Built for teams that need better message packaging and distribution visibility.'}</p>
               
                <Link href={postHref(primaryTask, post!, primaryRoute)} className="mt-8 flex items-center justify-between rounded-[12px] bg-[var(--slot4-dark-bg)] px-5 py-4 text-2xl font-medium">
                  <span>Learn More</span>
                  <Plus className="h-6 w-6" />
                </Link>
                <div className="mt-8 grid gap-3">
                  {[getEditableCategory(post), 'Media visibility', 'Editorial packaging'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-3 text-lg font-semibold"><CheckCircle2 className="h-5 w-5" /> {item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {stack.length ? (
            <div className="mt-14 grid gap-5 lg:grid-cols-3">
              {stack.map((post, index) => (
                <TextStoryCard
                  key={post.id || post.slug}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  eyebrow={index === 0 ? 'Featured release' : 'More insights'}
                  className="border-white/20 bg-white/12 text-white shadow-none"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(3)
  const lead = source[0] || posts[0]
  const briefs = source.slice(1)
  if (!lead) return null

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} py-16 sm:py-20`}>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div className="luxury-card p-6 sm:p-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">Learn more about {SITE_CONFIG.name}</h2>
              <p className="mx-auto mt-5 max-w-3xl text-xl text-[var(--slot4-muted-text)]">Leverage media distribution, editorial packaging, and searchable release archives as one streamlined channel.</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-base font-semibold text-[var(--slot4-muted-text)]">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Boost visibility</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--slot4-accent)]" /> Increase response opportunities</span>
            </div>
            <div className="mt-8 text-center">
              <Link href="/signup" className={dc.button.accent}>Free PR Guide</Link>
            </div>
          </div>

          <TextStoryCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} eyebrow="Featured release" className="h-full" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_.95fr]">
          <div className="rounded-[32px] bg-[linear-gradient(135deg,rgba(129,166,198,0.18),rgba(170,205,220,0.25))] p-8">
            <h2 className="text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-5xl">Flexible press release services to fit your needs</h2>
            <p className="mt-5 max-w-3xl text-xl text-[var(--slot4-muted-text)]">Use the latest posts, category flows, and search tools to guide discovery across campaigns, clients, and news cycles.</p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {briefs.slice(0, 2).map((post, index) => (
                <TextStoryCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>

          <LatestReleaseList posts={briefs} primaryTask={primaryTask} primaryRoute={primaryRoute} />
        </div>

        <form action="/search" className="mt-12 grid gap-5 rounded-[30px] border border-[var(--slot4-border)] bg-white p-6 shadow-[0_20px_50px_rgba(36,88,146,0.10)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
          <div>
            <h3 className="text-3xl font-semibold tracking-[-0.05em] text-[var(--slot4-page-text)]">Search the full archive</h3>
            <p className="mt-2 text-sm text-[var(--slot4-muted-text)]">Explore every {taskLabel(primaryTask).toLowerCase()} published by {SITE_CONFIG.name}.</p>
          </div>
          <label className="flex overflow-hidden rounded-[14px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] sm:min-w-[420px]">
            <Search className="ml-4 mt-4 h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
            <button className="bg-[var(--slot4-dark-bg)] px-5 text-xs font-black uppercase tracking-[.14em] text-white">Search</button>
          </label>
        </form>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`${dc.shell.section} grid gap-10 py-16 lg:grid-cols-[1fr_.85fr] lg:items-center`}>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[.24em] text-[var(--slot4-accent)]">Stay informed</p>
          <h2 className="mt-4 max-w-xl text-5xl font-semibold leading-[.94] tracking-[-.06em]">The stories shaping what comes next.</h2>
        </div>
        <div className="rounded-[28px] border border-white/12 bg-white/8 p-8 backdrop-blur">
          <p className="max-w-xl text-lg leading-8 text-white/75">Fresh releases, media updates, newsroom perspectives, and useful public information in one focused publication.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className={dc.button.accent}>Send a tip</Link>
            <Link href="/signup" className="inline-flex items-center justify-center rounded-[14px] border border-white/20 px-7 py-3.5 text-xs font-black uppercase tracking-[0.12em] hover:bg-white hover:text-[var(--slot4-dark-bg)]">Join the readership</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
