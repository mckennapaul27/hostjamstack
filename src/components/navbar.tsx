import { initTranslations } from '@/app/i18n'
import React from 'react'
import { LanguageSwitcher } from './language-switcher'
import { Link } from './link'
import { Logo } from './logo'
import { MobileNav } from './mobile-nav'
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'

async function DesktopNav({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ['common'])

  const links = [
    { href: '/hosting', label: t('nav.hosting') },
    { href: '/domains', label: t('nav.domains') },
    { href: '/support-packages', label: t('nav.supportPackages') },
    { href: '/company', label: t('nav.company') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/login', label: t('nav.login') },
  ]

  return (
    <nav className="relative hidden lg:flex">
      {links.map(({ href, label }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/2.5"
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
      <PlusGridItem className="relative flex">
        <div className="flex items-center px-4 py-3">
          <LanguageSwitcher />
        </div>
      </PlusGridItem>
    </nav>
  )
}

export async function NavbarDesktop({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ['common'])

  return (
    <header className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title={t('nav.home')}>
                <Logo />
              </Link>
            </PlusGridItem>
          </div>
          <DesktopNav locale={locale} />
        </PlusGridRow>
      </PlusGrid>
    </header>
  )
}

export function Navbar({ locale }: { locale: string }) {
  console.log('local in navbar:', locale)
  return (
    <React.Fragment>
      <div className="hidden lg:block">
        <NavbarDesktop locale={locale} />
      </div>
      <div className="lg:hidden">
        <MobileNav />
      </div>
    </React.Fragment>
  )
}
