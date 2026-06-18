import type { Metadata } from 'next'
import Link from 'next/link'
import { BadgeCheck, Megaphone, PenSquare, UserPlus } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid min-h-[calc(100vh-14rem)] gap-8 lg:grid-cols-[.98fr_1.02fr]">
            <div className="luxury-card flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">Create account</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{pagesContent.auth.signup.formTitle}</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">Open your account to access the publishing workspace, prepare announcements, and manage the site’s release flow from one place.</p>
              <EditableLocalSignupForm />
              <div className="mt-6 rounded-[20px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] p-4">
                <p className="flex items-start gap-3 text-sm font-semibold text-[var(--slot4-muted-text)]">
                  <BadgeCheck className="mt-0.5 h-5 w-5 text-[var(--slot4-accent)]" />
                  Already have an account? <Link href="/login" className="font-black text-[var(--slot4-dark-bg)] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link>
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[36px] border border-[var(--slot4-border)] bg-white shadow-[0_24px_80px_rgba(36,88,146,0.12)]">
              <div className="h-full bg-[image:var(--slot4-hero-gradient)] p-8 text-white sm:p-10 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-white/75">{pagesContent.auth.signup.badge}</p>
                <h2 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.92] tracking-[-0.055em] sm:text-7xl">{pagesContent.auth.signup.title}</h2>
                <p className="mt-6 max-w-lg text-sm font-semibold leading-8 text-white/80">{pagesContent.auth.signup.description}</p>

                <div className="mt-10 rounded-[28px] bg-white/14 p-6 backdrop-blur">
                  <div className="rounded-[24px] bg-white p-6 text-[var(--slot4-page-text)]">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-dark-bg)]">What you unlock</p>
                    <div className="mt-5 grid gap-4">
                      {[
                        { icon: UserPlus, text: 'A simple account tied to your publishing and submission flow.' },
                        { icon: PenSquare, text: 'A cleaner workspace for preparing public-facing release content.' },
                        { icon: Megaphone, text: 'A site experience designed for premium media distribution.' },
                      ].map((item) => (
                        <div key={item.text} className="flex items-start gap-3 rounded-[18px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] p-4">
                          <item.icon className="mt-0.5 h-5 w-5 text-[var(--slot4-accent)]" />
                          <p className="text-sm font-semibold leading-6 text-[var(--slot4-muted-text)]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
