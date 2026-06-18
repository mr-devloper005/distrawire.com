import Link from 'next/link'
import { CheckCircle2, Globe2, Megaphone, Search } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[36px] border border-[var(--slot4-border)] bg-white shadow-[0_24px_80px_rgba(36,88,146,0.12)]">
            <div className="grid gap-8 bg-[image:var(--slot4-hero-gradient)] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:py-12">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">{pagesContent.about.badge}</p>
                <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl">
                  Strategic distribution, clearer storytelling, and a calmer newsroom experience.
                </h1>
                <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-white/82">{pagesContent.about.description}</p>
              </div>
              <div className="rounded-[28px] bg-white/14 p-6 backdrop-blur">
                <div className="rounded-[24px] bg-white p-6 text-[var(--slot4-page-text)]">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">What we focus on</p>
                  <div className="mt-5 grid gap-4">
                    {[
                      { icon: Megaphone, label: 'Distribution-ready release presentation' },
                      { icon: Search, label: 'Faster discovery across archive and categories' },
                      { icon: Globe2, label: 'A public-facing experience built for credibility' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 rounded-[18px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] p-4">
                        <item.icon className="mt-0.5 h-5 w-5 text-[var(--slot4-accent)]" />
                        <p className="text-sm font-semibold leading-6 text-[var(--slot4-muted-text)]">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8 lg:pb-16">
          <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
            <article className="luxury-card p-7 sm:p-10 lg:p-12">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--slot4-dark-bg)]">About {SITE_CONFIG.name}</p>
              <p className="mt-6 text-3xl font-semibold leading-[1.25] tracking-[-0.04em] sm:text-4xl">{pagesContent.about.title}</p>
              <div className="article-content mt-10 space-y-6">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {[
                  'Built for media distributors who need sharper presentation.',
                  'Keeps releases, supporting content, and discovery tools aligned.',
                  'Designed to feel premium without making publishing harder.',
                  'Flexible enough for announcements, updates, and campaign pages.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[20px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[var(--slot4-accent)]" />
                    <p className="text-sm font-semibold leading-6 text-[var(--slot4-muted-text)]">{item}</p>
                  </div>
                ))}
              </div>
            </article>
            <aside className="grid gap-5">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="luxury-card p-7 sm:p-8">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--slot4-dark-bg)]">0{index + 1}</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-[var(--slot4-page-text)]">{value.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[var(--slot4-dark-bg)] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Explore the platform</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-none tracking-[-0.04em] sm:text-5xl">Read the updates shaping the conversation.</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 lg:mt-0">
              <Link href="/search" className="inline-flex w-fit rounded-[14px] bg-[var(--slot4-accent)] px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-white">Explore the archive</Link>
              <Link href="/contact" className="inline-flex w-fit rounded-[14px] border border-white/20 px-6 py-4 text-xs font-black uppercase tracking-[0.18em] text-white">Contact us</Link>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
