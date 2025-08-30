'use client'

import LoadingSpinner from '@/components/dashboard/loading-spinner'
import type { Domain } from '@/lib/dashboard-api'
import { getUserDomains } from '@/lib/dashboard-api'
import {
  cn,
  formatCurrency,
  formatDate,
  getDaysUntilExpiry,
  getStatusColor,
} from '@/lib/utils'
import { Menu, Transition } from '@headlessui/react'
import {
  ClockIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

export default function DomainsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const fetchDomains = async () => {
      if (!session?.rawJwt) return

      try {
        const data = await getUserDomains(session.rawJwt)
        setDomains(data)
      } catch (error) {
        console.error('Failed to fetch domains:', error)
        // Set mock data for development
        setDomains([
          {
            _id: '1',
            domainName: 'example.com',
            userId: session.user._id,
            registrationDate: '2024-01-15T00:00:00Z',
            expirationDate: '2025-01-15T00:00:00Z',
            autoRenew: true,
            registrationPeriod: 1,
            isPremium: false,
            status: 'active',
            registrar: 'Name.com',
            registrarDomainId: 'ext_123',
            nameservers: ['ns1.hostjamstack.com', 'ns2.hostjamstack.com'],
            useDefaultNameservers: true,
            purchasePrice: 12.99,
            renewalPrice: 14.99,
            currency: 'EUR',
            whoisPrivacy: true,
            transferLock: true,
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
          },
          {
            _id: '2',
            domainName: 'my-portfolio.dev',
            userId: session.user._id,
            registrationDate: '2024-03-10T00:00:00Z',
            expirationDate: '2024-12-25T00:00:00Z',
            autoRenew: false,
            registrationPeriod: 1,
            isPremium: true,
            status: 'active',
            registrar: 'Name.com',
            registrarDomainId: 'ext_456',
            nameservers: ['ns1.hostjamstack.com', 'ns2.hostjamstack.com'],
            useDefaultNameservers: true,
            purchasePrice: 45.99,
            renewalPrice: 45.99,
            currency: 'EUR',
            whoisPrivacy: true,
            transferLock: false,
            createdAt: '2024-03-10T00:00:00Z',
            updatedAt: '2024-03-10T00:00:00Z',
          },
          {
            _id: '3',
            domainName: 'startup-idea.io',
            userId: session.user._id,
            registrationDate: '2024-02-20T00:00:00Z',
            expirationDate: '2025-02-20T00:00:00Z',
            autoRenew: true,
            registrationPeriod: 1,
            isPremium: false,
            status: 'pending',
            registrar: 'Name.com',
            registrarDomainId: 'ext_789',
            nameservers: ['ns1.hostjamstack.com', 'ns2.hostjamstack.com'],
            useDefaultNameservers: true,
            purchasePrice: 29.99,
            renewalPrice: 29.99,
            currency: 'EUR',
            whoisPrivacy: false,
            transferLock: true,
            createdAt: '2024-02-20T00:00:00Z',
            updatedAt: '2024-02-20T00:00:00Z',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDomains()
  }, [session?.rawJwt, session?.user._id])

  const filteredDomains = domains.filter((domain) => {
    const matchesSearch = domain.domainName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || domain.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: domains.length,
    active: domains.filter((d) => d.status === 'active').length,
    pending: domains.filter((d) => d.status === 'pending').length,
    expired: domains.filter((d) => d.status === 'expired').length,
  }

  const expiringDomains = domains.filter((domain) => {
    const daysUntil = getDaysUntilExpiry(domain.expirationDate)
    return daysUntil <= 30 && daysUntil > 0
  })

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Domains</h1>
          <p className="text-gray-600">Manage your domain portfolio</p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Link
            href={`/${lang}/dashboard/domains/search`}
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Search & Buy</span>
          </Link>
        </div>
      </div>

      {/* Expiring Domains Alert */}
      {expiringDomains.length > 0 && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="mr-3 h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {expiringDomains.length} domain
                {expiringDomains.length > 1 ? 's' : ''} expiring soon
              </h3>
              <p className="text-sm text-yellow-700">
                {expiringDomains.map((d) => d.domainName).join(', ')} - Consider
                renewing to avoid losing your domain
                {expiringDomains.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="relative max-w-md flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 text-sm focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="Search domains..."
            />
          </div>

          <div className="flex flex-col space-x-2 sm:flex-row">
            {[
              { key: 'all', label: 'All', count: statusCounts.all },
              { key: 'active', label: 'Active', count: statusCounts.active },
              { key: 'pending', label: 'Pending', count: statusCounts.pending },
              { key: 'expired', label: 'Expired', count: statusCounts.expired },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                  filterStatus === filter.key
                    ? 'bg-purple-200 text-purple-800'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Domains List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {filteredDomains.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="block xl:hidden">
              <div className="space-y-4 p-4">
                {filteredDomains.map((domain) => {
                  const daysUntilExpiry = getDaysUntilExpiry(
                    domain.expirationDate,
                  )
                  const isExpiringSoon =
                    daysUntilExpiry <= 30 && daysUntilExpiry > 0

                  return (
                    <div
                      key={domain._id}
                      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <GlobeAltIcon className="hidden h-8 w-8 flex-shrink-0 text-gray-400 sm:block" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900">
                                {domain.domainName}
                              </span>
                              {domain.isPremium && (
                                <span className="inline-flex items-center rounded bg-purple-200 px-2 py-0.5 text-xs font-medium text-purple-800">
                                  Premium
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Registered {formatDate(domain.registrationDate)}
                            </div>
                          </div>
                        </div>
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <Menu.Button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                            <EllipsisHorizontalIcon className="h-5 w-5" />
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
                            <Menu.Items className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href={`/${lang}/dashboard/domains/${domain._id}`}
                                      className={`${
                                        active ? 'bg-gray-100' : ''
                                      } group flex items-center px-4 py-2 text-sm text-gray-700`}
                                    >
                                      Manage Domain
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href={`/${lang}/dashboard/domains/${domain._id}/dns`}
                                      className={`${
                                        active ? 'bg-gray-100' : ''
                                      } group flex items-center px-4 py-2 text-sm text-gray-700`}
                                    >
                                      DNS Settings
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href={`/${lang}/dashboard/domains/${domain._id}/transfer`}
                                      className={`${
                                        active ? 'bg-gray-100' : ''
                                      } group flex items-center px-4 py-2 text-sm text-gray-700`}
                                    >
                                      Transfer Settings
                                    </Link>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <div className="mt-1">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                getStatusColor(domain.status),
                              )}
                            >
                              {domain.status}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-500">Expires:</span>
                          <div className="mt-1 text-gray-900">
                            {formatDate(domain.expirationDate)}
                            {isExpiringSoon && (
                              <ExclamationTriangleIcon className="ml-1 inline h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-500">Auto Renew:</span>
                          <div className="mt-1">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                domain.autoRenew
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-gray-200 text-gray-800',
                              )}
                            >
                              {domain.autoRenew ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-500">Price:</span>
                          <div className="mt-1 text-gray-900">
                            {formatCurrency(
                              domain.renewalPrice,
                              domain.currency,
                            )}
                            /year
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden xl:block">
              <div className="table-overflow-visible overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-48 px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6">
                        Domain
                      </th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6">
                        Status
                      </th>
                      <th className="w-32 px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6">
                        Expiry Date
                      </th>
                      <th className="w-28 px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6">
                        Auto Renew
                      </th>
                      <th className="w-24 px-3 py-3 text-left text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6">
                        Price
                      </th>
                      <th className="w-20 px-3 py-3 text-right text-xs font-medium tracking-wider whitespace-nowrap text-gray-500 uppercase sm:px-6">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDomains.map((domain) => {
                      const daysUntilExpiry = getDaysUntilExpiry(
                        domain.expirationDate,
                      )
                      const isExpiringSoon =
                        daysUntilExpiry <= 30 && daysUntilExpiry > 0

                      return (
                        <tr key={domain._id} className="hover:bg-gray-50">
                          <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                            <div className="flex items-center">
                              <GlobeAltIcon className="mr-3 h-8 w-8 text-gray-400" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {domain.domainName}
                                  </span>
                                  {domain.isPremium && (
                                    <span className="inline-flex items-center rounded bg-purple-200 px-2 py-0.5 text-xs font-medium text-purple-800">
                                      Premium
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Registered{' '}
                                  {formatDate(domain.registrationDate)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                            <span
                              className={cn(
                                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                getStatusColor(domain.status),
                              )}
                            >
                              {domain.status}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">
                                {formatDate(domain.expirationDate)}
                              </span>
                              {isExpiringSoon && (
                                <div className="ml-2 flex items-center text-yellow-600">
                                  <ClockIcon className="mr-1 h-4 w-4" />
                                  <span className="text-xs">
                                    {daysUntilExpiry}d
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap sm:px-6">
                            <span
                              className={cn(
                                'inline-flex items-center text-sm',
                                domain.autoRenew
                                  ? 'text-green-600'
                                  : 'text-gray-500',
                              )}
                            >
                              {domain.autoRenew ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-900 sm:px-6">
                            {formatCurrency(
                              domain.renewalPrice,
                              domain.currency,
                            )}
                            /year
                          </td>
                          <td className="dropdown-cell px-3 py-4 text-right text-sm font-medium whitespace-nowrap sm:px-6">
                            <Menu
                              as="div"
                              className="relative inline-block text-left"
                            >
                              <Menu.Button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                                <EllipsisHorizontalIcon className="h-5 w-5" />
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
                                <Menu.Items className="ring-opacity-5 absolute right-0 z-[9999] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black focus:outline-none">
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <Link
                                          href={`/${lang}/dashboard/domains/${domain._id}`}
                                          className={`${
                                            active ? 'bg-gray-100' : ''
                                          } group flex items-center px-4 py-2 text-sm text-gray-700`}
                                        >
                                          Manage Domain
                                        </Link>
                                      )}
                                    </Menu.Item>
                                    {/* <Menu.Item>
                                      {({ active }) => (
                                        <Link
                                          href={`/${lang}/dashboard/domains/${domain._id}/dns`}
                                          className={`${
                                            active ? 'bg-gray-100' : ''
                                          } group flex items-center px-4 py-2 text-sm text-gray-700`}
                                        >
                                          DNS Records
                                        </Link>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          className={`${
                                            active ? 'bg-gray-100' : ''
                                          } group flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                        >
                                          Renew Domain
                                        </button>
                                      )}
                                    </Menu.Item> */}
                                  </div>
                                  {/* <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          className={`${
                                            active ? 'bg-gray-100' : ''
                                          } group flex w-full items-center px-4 py-2 text-sm text-red-700`}
                                        >
                                          Transfer Domain
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div> */}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <GlobeAltIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {searchQuery || filterStatus !== 'all'
                ? 'No domains found'
                : 'No domains yet'}
            </h3>
            <p className="mb-4 text-gray-500">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by purchasing your first domain'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Link
                href={`/${lang}/dashboard/domains/search`}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Search Domains</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
