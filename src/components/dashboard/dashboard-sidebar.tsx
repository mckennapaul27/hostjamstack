'use client'

import { cn } from '@/lib/utils'
import { Transition } from '@headlessui/react'
import {
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  GlobeAltIcon,
  HomeIcon,
  ServerIcon,
  UserIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'

interface DashboardSidebarProps {
  lang: string
  isOpen?: boolean
  onClose?: () => void
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNavigation = (t: any) => [
  {
    name: t('sidebar.dashboard'),
    href: '/dashboard',
    icon: HomeIcon,
    description: t('dashboard.subtitle'),
  },
  {
    name: t('sidebar.dashboard'),
    href: '/dashboard',
    icon: HomeIcon,
    description: t('dashboard.subtitle'),
  },
  {
    name: t('sidebar.profile'),
    href: '/dashboard/profile',
    icon: UserIcon,
    description: t('profile.subtitle'),
  },
  {
    name: t('sidebar.purchaseHistory'),
    href: '/dashboard/purchase-history',
    icon: CreditCardIcon,
    description: t('purchaseHistory.subtitle'),
  },
  {
    name: t('sidebar.domains'),
    href: '/dashboard/domains',
    icon: GlobeAltIcon,
    description: t('domains.subtitle'),
    submenu: [
      { name: t('sidebar.allDomains'), href: '/dashboard/domains' },
      { name: t('sidebar.searchBuy'), href: '/dashboard/domains/search' },
    ],
  },
  {
    name: t('sidebar.hosting'),
    href: '/dashboard/hosting',
    icon: ServerIcon,
    description: t('hosting.subtitle'),
    submenu: [
      { name: t('sidebar.allProjects'), href: '/dashboard/hosting' },
      { name: t('sidebar.packages'), href: '/dashboard/hosting/packages' },
      // { name: 'Deployments', href: '/dashboard/hosting/deployments' },
    ],
  },
  {
    name: t('sidebar.support'),
    href: '/dashboard/support',
    icon: ChatBubbleLeftRightIcon,
    description: t('support.subtitle'),
    submenu: [
      { name: t('sidebar.tickets'), href: '/dashboard/support' },
      { name: t('sidebar.packages'), href: '/dashboard/support/packages' },
      // { name: 'New Ticket', href: '/dashboard/support/new' },
    ],
  },
]

export default function DashboardSidebar({
  lang,
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname()

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === `/${lang}/dashboard`
    }
    return pathname.startsWith(`/${lang}${href}`)
  }

  return (
    <>
      {/* Mobile overlay */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="bg-opacity-25 fixed inset-0 z-40 bg-black lg:hidden"
          onClick={onClose}
        />
      </Transition>

      {/* Mobile sidebar */}
      <Transition
        show={isOpen}
        as={Fragment}
        enter="transition ease-in-out duration-300 transform"
        enterFrom="-translate-x-full"
        enterTo="translate-x-0"
        leave="transition ease-in-out duration-300 transform"
        leaveFrom="translate-x-0"
        leaveTo="-translate-x-full"
      >
        <div className="fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white pt-16 lg:hidden">
          {/* Mobile close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={onClose}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:ring-white focus:outline-none"
            >
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <SidebarContent lang={lang} onClose={onClose} />
        </div>
      </Transition>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-64 lg:border-r lg:border-gray-200 lg:bg-white lg:pt-16">
        <SidebarContent lang={lang} />
      </div>
    </>
  )
}

function SidebarContent({
  lang,
  onClose,
}: {
  lang: string
  onClose?: () => void
}) {
  const pathname = usePathname()
  const { t } = useTranslation('dashboard')
  const navigation = getNavigation(t)

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === `/${lang}/dashboard`
    }
    return pathname.startsWith(`/${lang}${href}`)
  }

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Logo/Brand */}
      <div className="border-b border-gray-200 px-6 py-4">
        <Link
          href={`/${lang}/dashboard`}
          className="flex items-center"
          onClick={handleLinkClick}
        >
          <div className="h-10 w-10">
            <svg
              width="40"
              height="40"
              viewBox="0 0 91 91"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45.4706 0C30.4383 0 17.0936 7.33694 8.80988 18.6126C7.57077 20.1766 6.4869 21.869 5.57937 23.6697C2.02494 30.146 0 37.5759 0 45.4706C0 70.5432 20.3979 90.9412 45.4706 90.9412C70.5433 90.9412 90.9412 70.5432 90.9412 45.4706C90.9412 20.3979 70.5433 0 45.4706 0ZM40.2909 56.6533C32.723 56.6533 26.5657 50.4184 26.5657 42.7547C26.5657 35.091 32.723 28.8561 40.2909 28.8561C47.8587 28.8561 54.016 35.091 54.016 42.7547C54.016 50.4184 47.8587 56.6533 40.2909 56.6533ZM40.2909 24.7813C30.4757 24.7813 22.4909 32.8437 22.4909 42.7547C22.4909 52.6657 30.4757 60.7281 40.2909 60.7281C40.402 60.7281 40.5094 60.7128 40.6196 60.7108C37.8174 61.8072 34.7767 62.4138 31.5969 62.4138C17.7511 62.4138 6.48594 51.0145 6.48594 37.0038C6.48594 32.905 7.45673 29.0334 9.16734 25.6007C10.0404 24.0118 11.0179 22.4881 12.0854 21.0333C16.6931 15.2805 23.7262 11.5938 31.5969 11.5938C45.024 11.5938 56.0227 22.3127 56.6773 35.7359C53.9642 29.3046 47.6422 24.7813 40.2909 24.7813ZM45.4706 86.8664C23.1292 86.8664 4.87596 69.0722 4.11121 46.9138C8.14959 58.3112 18.9442 66.4895 31.5969 66.4895C47.691 66.4895 60.7837 53.2627 60.7837 37.0048C60.7837 20.7468 47.6901 7.51997 31.596 7.51997C30.5926 7.51997 29.6007 7.57172 28.6223 7.67139C33.7723 5.36662 39.4715 4.07384 45.4696 4.07384C68.295 4.07384 86.8654 22.6443 86.8654 45.4696C86.8654 68.295 68.296 86.8664 45.4706 86.8664Z"
                fill="#111111"
              />
            </svg>
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900">
            {t('sidebar.dashboard')}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {navigation.map((item) => {
          const isActive = isActiveRoute(item.href)
          const hasSubmenu = item.submenu && item.submenu.length > 0

          return (
            <div key={item.name}>
              <Link
                href={`/${lang}${item.href}`}
                onClick={handleLinkClick}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-gray-700 hover:bg-gray-50',
                  hasSubmenu && 'mb-1',
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-purple-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                  )}
                />
                <span className="flex-1">{item.name}</span>
                {hasSubmenu && (
                  <ChevronRightIcon
                    className={cn(
                      'ml-2 h-4 w-4 transition-transform',
                      isActive && 'rotate-90',
                    )}
                  />
                )}
              </Link>

              {/* Submenu */}
              {hasSubmenu && isActive && (
                <div className="mt-1 ml-8 space-y-1">
                  {item.submenu!.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={`/${lang}${subItem.href}`}
                      onClick={handleLinkClick}
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                        pathname === `/${lang}${subItem.href}`
                          ? 'bg-purple-50 text-purple-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      )}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 px-4 py-4">
        <Link
          href={`/${lang}/dashboard/profile`}
          onClick={handleLinkClick}
          className={cn(
            'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            pathname === `/${lang}/dashboard/profile`
              ? 'bg-purple-50 text-purple-700'
              : 'text-gray-700 hover:bg-gray-50',
          )}
        >
          <Cog6ToothIcon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
          {t('sidebar.settings')}
        </Link>
      </div>
    </div>
  )
}
