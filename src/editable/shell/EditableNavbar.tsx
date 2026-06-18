'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { isHmrRefresh } from 'next/dist/server/app-render/work-unit-async-storage.external'

const navItems: Array<{ label: string; href: string; dropdown?: boolean }> = [
  { label: 'About us', href: '/about'},
  { label: 'Newsroom', href: '/search' },
  { label: 'Help center' , href:'/contact'},
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--slot4-border)] bg-white/95 text-[var(--slot4-page-text)] backdrop-blur">
      <div className="mx-auto grid min-h-[84px] max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-8">
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] lg:hidden" aria-label="Toggle navigation">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <img src="/favicon.png" alt={SITE_CONFIG.name} className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14" />
            <span className="min-w-0">
              <span className="block truncate text-left text-3xl font-black tracking-[-0.05em] text-[var(--slot4-dark-bg)] sm:text-[2.6rem]">
                <span className="text-[var(--slot4-accent)]">D</span>{SITE_CONFIG.name.replace(/^./, '')}
              </span>
              <span className="block text-left text-[11px] font-semibold tracking-[-0.01em] text-[var(--slot4-lavender)]">
                
              </span>
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-end gap-4">
          {session ? (
            <>
               <button type="button" onClick={logout} className="hidden text-xs font-black uppercase tracking-[.12em] sm:block">Logout</button>
            </>
          ) : (
            <Link href="/login" className="hidden rounded-[12px] border border-[var(--slot4-border)] bg-[var(--slot4-dark-bg)] px-5 py-3 text-xs font-black uppercase tracking-[.12em] text-white sm:block">Log In</Link>
          )}
          <Link href={session ? '/create' : '/signup'} className="rounded-[12px] bg-[var(--slot4-accent)] px-4 py-3 text-[10px] font-black uppercase tracking-[.14em] text-white shadow-[0_12px_26px_rgba(26,200,192,0.25)] sm:px-6">
            {session ? 'Publish' : 'Get Started'}
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-[var(--slot4-border)] bg-white lg:block">
        <div className="mx-auto flex min-h-[56px] max-w-[1440px] items-center gap-7 px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className="inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-dark-bg)] hover:text-[var(--slot4-accent)]">
                {item.label}
                {item.dropdown ? <ChevronDown className="h-4 w-4" /> : null}
              </Link>
            ))}
          </nav>
          <form action="/search" className="ml-auto flex min-w-0 items-center rounded-[14px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] lg:w-[320px]">
            <Search className="ml-4 h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input name="q" type="search" placeholder="Search the archive" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-semibold outline-none placeholder:text-[var(--slot4-muted-text)]/70" />
          </form>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--slot4-border)] bg-white px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex min-w-0 items-center rounded-[14px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)]">
            <Search className="ml-4 h-4 w-4 text-[var(--slot4-muted-text)]" />
            <input name="q" type="search" placeholder="Search the archive" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-semibold outline-none" />
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => (
              <Link key={`${item.label}-${item.href}`} href={item.href} onClick={() => setOpen(false)} className="rounded-[16px] border border-[var(--slot4-border)] bg-[var(--slot4-warm)] px-4 py-3 text-sm font-black">
                {item.label}
              </Link>
            ))}
            {session ? <button type="button" onClick={logout} className="rounded-[16px] border border-[var(--slot4-border)] bg-white px-4 py-3 text-left text-sm font-black">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
