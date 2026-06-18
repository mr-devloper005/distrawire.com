'use client'

import { FileText, Mail, Megaphone, PhoneCall } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Release planning', body: 'Share launch timing, story packaging needs, and publishing priorities for upcoming releases.' },
  { icon: Megaphone, title: 'Distribution strategy', body: 'Discuss media visibility, campaign rollout structure, and promotional support around your announcement.' },
  { icon: Mail, title: 'General support', body: 'Reach the team for account, publishing, archive, or site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="overflow-hidden rounded-[36px] border border-[var(--slot4-border)] bg-white shadow-[0_24px_80px_rgba(36,88,146,0.12)]">
            <div className="grid gap-8 bg-[image:var(--slot4-hero-gradient)] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:py-12">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">{pagesContent.contact.eyebrow}</p>
                <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">{pagesContent.contact.title}</h1>
                <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/84">{pagesContent.contact.description}</p>
              </div>
              <div className="rounded-[28px] bg-white/14 p-6 backdrop-blur">
                <div className="rounded-[24px] bg-white p-6 text-[var(--slot4-page-text)]">
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">Best for teams that need</p>
                  <div className="mt-5 grid gap-4">
                    {[
                      'A better public-facing release presence',
                      'Help aligning message, timing, and category placement',
                      'Support with updates, archive structure, or publishing flow',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-[18px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] p-4">
                        <PhoneCall className="mt-0.5 h-5 w-5 text-[var(--slot4-accent)]" />
                        <p className="text-sm font-semibold leading-6 text-[var(--slot4-muted-text)]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
            <aside className="grid gap-5">
              {desks.map((desk, index) => (
                <div key={desk.title} className="luxury-card p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <desk.icon className="h-5 w-5 text-[var(--slot4-accent)]" />
                    <span className="text-xs font-black text-[var(--slot4-muted-text)]">0{index + 1}</span>
                  </div>
                  <h2 className="mt-6 text-3xl font-black tracking-[-0.03em] text-[var(--slot4-page-text)]">{desk.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{desk.body}</p>
                </div>
              ))}
            </aside>
            <div className="luxury-card p-6 sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">Send a message</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{pagesContent.contact.formTitle}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--slot4-muted-text)]">Tell us what you are planning, what needs to change, or what kind of release support you need. We will route it to the right next step.</p>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
