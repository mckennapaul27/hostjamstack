'use client'

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './language-switcher'
import { Link } from './link'
import { Logo } from './logo'
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'

function MobileNavButton() {
  const { t } = useTranslation('common')

  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 lg:hidden"
      aria-label={t('nav.openMainMenu')}
    >
      <Bars2Icon className="size-6" />
    </DisclosureButton>
  )
}

function MobNav() {
  const { t } = useTranslation('common')

  const links = [
    { href: '/hosting', label: t('nav.hosting') },
    { href: '/domains', label: t('nav.domains') },
    { href: '/support-packages', label: t('nav.supportPackages') },
    { href: '/company', label: t('nav.company') },
    { href: '/blog', label: t('nav.blog') },
    { href: '/login', label: t('nav.login') },
  ]

  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link href={href} className="text-base font-medium text-gray-950">
              {label}
            </Link>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, rotateX: -90 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{
            duration: 0.15,
            ease: 'easeInOut',
            rotateX: { duration: 0.3, delay: links.length * 0.1 },
          }}
          className="border-t border-black/5 pt-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              {t('nav.language')}
            </span>
            <LanguageSwitcher />
          </div>
        </motion.div>
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5" />
      </div>
    </DisclosurePanel>
  )
}

export function MobileNav() {
  const { t } = useTranslation('common')

  return (
    <Disclosure as="header" className="pt-12 sm:pt-16">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title={t('nav.home')}>
                <Logo />
              </Link>
            </PlusGridItem>
          </div>
          <div className="flex items-center gap-4 lg:hidden">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <MobileNavButton />
          </div>
        </PlusGridRow>
      </PlusGrid>
      <MobNav />
    </Disclosure>
  )
}
