'use client'

import { Menu, Transition } from '@headlessui/react'
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface DashboardHeaderProps {
  onMobileMenuToggle?: () => void
}

export default function DashboardHeader({
  onMobileMenuToggle,
}: DashboardHeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const { t } = useTranslation('dashboard')

  // Extract language from pathname
  const lang = pathname.split('/')[1] || 'en'

  const handleSignOut = () => {
    signOut({ callbackUrl: `/${lang}/login` })
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Mobile menu button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={onMobileMenuToggle}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Left side - Search */}
        <div className="ml-0 flex hidden max-w-md flex-1 items-center lg:ml-64 lg:flex">
          {/* <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder={t('header.searchPlaceholder')}
            />
          </div> */}
        </div>

        {/* Right side - Notifications and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          {/* <button className="relative hidden rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 lg:block">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </button> */}

          {/* User Menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center space-x-3 rounded-lg p-2 text-sm transition-colors hover:bg-gray-100">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </div>
                  <div className="hidden text-xs text-gray-500 lg:block">
                    {session?.user?.email}
                  </div>
                </div>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="ring-opacity-5 absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black focus:outline-none">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {session?.user?.firstName} {session?.user?.lastName}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={`/${lang}/dashboard/profile`}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <UserCircleIcon className="mr-3 h-4 w-4" />
                        {t('header.profileSettings')}
                      </Link>
                    )}
                  </Menu.Item>

                  {/* <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={`/${lang}/dashboard/settings`}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <CogIcon className="mr-3 h-4 w-4" />
                        Account Settings
                      </Link>
                    )}
                  </Menu.Item> */}
                </div>

                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        {t('header.signOut')}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
}
