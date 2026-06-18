'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-16 border-t border-white/10 bg-[var(--slot4-footer-bg)] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-12 flex flex-col gap-6 rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(129,166,198,0.18),rgba(26,200,192,0.18))] p-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/65">Distribution guide</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Reach the right desks with a clearer release strategy.</h2>
          </div>
          <Link href="/signup" className="inline-flex items-center justify-center rounded-[14px] bg-[var(--slot4-accent)] px-6 py-3 text-sm font-black text-white">
            Free PR Guide
          </Link>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_.7fr_.7fr_.7fr]">
          <div>
            <Link href="/" className="flex items-center gap-4">
              <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14" />
              <span className="text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/62">{globalContent.footer?.description || SITE_CONFIG.description}</p>
            
          </div>

          

          <div>
            <h3 className="border-b border-white/25 pb-3 text-[10px] font-black uppercase tracking-[.22em] text-white/55">Resources</h3>
            <div className="mt-4 grid gap-3">
              <Link href="/search" className="text-sm font-black hover:text-[var(--slot4-accent)]">Archive</Link>
              <Link href="/about" className="text-sm font-black hover:text-[var(--slot4-accent)]">How it works</Link>
              <Link href="/contact" className="text-sm font-black hover:text-[var(--slot4-accent)]">Newsroom contact</Link>
            </div>
          </div>

          <div>
            <h3 className="border-b border-white/25 pb-3 text-[10px] font-black uppercase tracking-[.22em] text-white/55">Account</h3>
            <div className="mt-4 grid gap-3">
              {session ? (
                <>
                  <Link href="/create" className="text-sm font-black hover:text-[var(--slot4-accent)]">Publish</Link>
                  <button onClick={logout} className="text-left text-sm font-black hover:text-[var(--slot4-accent)]">Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-black hover:text-[var(--slot4-accent)]">Log in</Link>
                  <Link href="/signup" className="text-sm font-black hover:text-[var(--slot4-accent)]">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-[10px] font-black uppercase tracking-[.18em] text-white/45">© {year} {SITE_CONFIG.name}. Media distribution and public updates.</div>
    </footer>
  )
}
