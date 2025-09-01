'use client'

import type { SupportPackage, SupportTicket } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { cn, formatRelativeTime, getStatusColor } from '@/lib/utils'
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SupportPage() {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation('dashboard')

  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [packages, setPackages] = useState<SupportPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.rawJwt) return

      try {
        const [ticketsData, packagesData] = await Promise.all([
          demoApiProvider.getSupportTickets(
            session.rawJwt,
            undefined,
            session.user?.email,
          ),
          demoApiProvider.getSupportPackages(
            session.rawJwt,
            session.user?.email,
          ),
        ])
        setTickets(ticketsData)
        setPackages(packagesData)
      } catch (error) {
        console.error('Failed to fetch support data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.rawJwt, session?.user?.email])

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || ticket.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    waiting_customer: tickets.filter((t) => t.status === 'waiting_customer')
      .length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
      case 'high':
        return <ExclamationTriangleIcon className="h-4 w-4 text-orange-500" />
      case 'normal':
        return <ClockIcon className="h-4 w-4 text-purple-500" />
      case 'low':
        return <ClockIcon className="h-4 w-4 text-gray-500" />
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
      case 'closed':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-500" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('support.title')}
          </h1>
          <p className="text-gray-600">{t('support.subtitle')}</p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0">
          <Link
            href={`/${lang}/dashboard/support/packages`}
            className="border-bg-gray-950 inline-flex items-center justify-center rounded-full border bg-transparent px-4 py-2 text-base font-medium whitespace-nowrap text-gray-950 shadow-md transition-colors hover:bg-gray-800 hover:text-white"
          >
            {t('support.packages')}
          </Link>
          <Link
            href={`/${lang}/dashboard/support/new`}
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
          >
            <PlusIcon className="h-4 w-4" />
            <span>{t('support.newTicket')}</span>
          </Link>
        </div>
      </div>

      {/* Support Package Info */}
      {packages.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col">
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {packages[0].packageName}
              </h3>
              <div className="mt-4 flex flex-col gap-2 space-x-6 text-sm text-gray-600 md:mt-0 md:flex-row md:items-center md:justify-between">
                <span>
                  {t('support.packageInfo.responseTime', {
                    time: packages[0].responseTimeGuarantee,
                  })}
                </span>
                <span>
                  {t('support.packageInfo.monthlyUsage', {
                    used: packages[0].currentUsage.ticketsUsed,
                    total: packages[0].monthlyTickets,
                  })}
                </span>
                <span>
                  {t('support.packageInfo.supportHours', {
                    hours: packages[0].currentUsage.hoursUsed.toFixed(1),
                  })}
                </span>
              </div>
            </div>
            <div className="mt-2 text-left md:text-right">
              <div className="text-sm text-gray-500">
                {t('support.packageInfo.supportLevel')}
              </div>
              <div className="text-lg font-medium text-green-600 capitalize">
                {packages[0].packageType}
              </div>
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
              placeholder={t('support.search.placeholder')}
            />
          </div>

          <div className="flex flex-col space-x-2 md:ml-8 md:flex-row">
            {[
              { key: 'all', labelKey: 'all', count: statusCounts.all },
              { key: 'open', labelKey: 'open', count: statusCounts.open },
              {
                key: 'in_progress',
                labelKey: 'inProgress',
                count: statusCounts.in_progress,
              },
              {
                key: 'waiting_customer',
                labelKey: 'waiting',
                count: statusCounts.waiting_customer,
              },
              {
                key: 'resolved',
                labelKey: 'resolved',
                count: statusCounts.resolved,
              },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={cn(
                  'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                  filterStatus === filter.key
                    ? 'bg-purple-100 text-purple-800'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                )}
              >
                {t(`support.filters.${filter.labelKey}`)} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {filteredTickets.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="p-6 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-col items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-3">
                      {getStatusIcon(ticket.status)}
                      <Link
                        href={`/${lang}/dashboard/support/${ticket._id}`}
                        className="text-lg font-medium text-gray-900 hover:text-purple-600"
                      >
                        {ticket.subject}
                      </Link>
                      <span className="font-mono text-sm text-gray-500">
                        {ticket.ticketNumber}
                      </span>
                    </div>

                    <p className="mb-3 line-clamp-2 text-gray-600">
                      {ticket.description}
                    </p>

                    <div className="flex flex-col items-start space-y-2 space-x-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div className="flex items-center space-x-1">
                        {getPriorityIcon(ticket.priority)}
                        <span className="capitalize">
                          {t(`support.priority.${ticket.priority}`)}
                        </span>
                      </div>

                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          getStatusColor(ticket.status),
                        )}
                      >
                        {t(`support.status.${ticket.status}`)}
                      </span>

                      <span className="capitalize">{ticket.category}</span>

                      <span>
                        {t('support.ticket.created', {
                          time: formatRelativeTime(ticket.createdAt),
                        })}
                      </span>

                      {ticket.lastResponseAt && (
                        <span>
                          {t('support.ticket.lastResponse', {
                            time: formatRelativeTime(ticket.lastResponseAt),
                          })}
                        </span>
                      )}
                    </div>

                    {/* Related Resources */}
                    {(ticket.relatedDomains.length > 0 ||
                      ticket.relatedHostingPackages.length > 0) && (
                      <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                        {ticket.relatedDomains.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <span>{t('support.ticket.domains')}</span>
                            <span>{ticket.relatedDomains.join(', ')}</span>
                          </div>
                        )}
                        {ticket.relatedHostingPackages.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <span>
                              {t('support.ticket.hostingPackages', {
                                count: ticket.relatedHostingPackages.length,
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex space-x-2 md:flex-row md:items-center md:justify-between">
                    {ticket.assignedTo && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <UserCircleIcon className="h-4 w-4" />
                        <span>{t('support.ticket.assigned')}</span>
                      </div>
                    )}

                    <Link
                      href={`/${lang}/dashboard/support/${ticket._id}`}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      {t('support.ticket.view')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <ChatBubbleLeftRightIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {searchQuery || filterStatus !== 'all'
                ? t('support.noResults.title')
                : t('support.empty.title')}
            </h3>
            <p className="mb-4 text-gray-500">
              {searchQuery || filterStatus !== 'all'
                ? t('support.noResults.subtitle')
                : t('support.empty.subtitle')}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <Link
                href={`/${lang}/dashboard/support/new`}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                <PlusIcon className="h-4 w-4" />
                <span>{t('support.createTicket')}</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
