'use client'

import LoadingSpinner from '@/components/dashboard/loading-spinner'
import type { Domain } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { cn, formatDate, getDaysUntilExpiry, getStatusColor } from '@/lib/utils'
import {
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  PlusIcon,
  ServerIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface DashboardOverview {
  domains: Domain[]
  recentActivity: Array<{
    type: 'domain' | 'hosting' | 'support'
    message: string
    timestamp: string
  }>
  alerts: Array<{
    type: 'warning' | 'error' | 'info'
    message: string
    action?: string
  }>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      if (!session?.rawJwt) return

      try {
        const data = await demoApiProvider.getDashboardOverview(
          session.rawJwt,
          session.user?.email,
        )
        setOverview(data)
      } catch (error) {
        console.error('Failed to fetch dashboard overview:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [session?.rawJwt, session?.user?.email])

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
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {session?.user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening with your account
          </p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Link
            href={`/${lang}/dashboard/domains/search`}
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Buy Domain</span>
          </Link>
        </div>
      </div>

      {/* Alerts */}
      {overview?.alerts && overview.alerts.length > 0 && (
        <div className="space-y-3">
          {overview.alerts.map((alert, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center justify-between rounded-lg border p-4',
                alert.type === 'warning' && 'border-yellow-300 bg-yellow-100',
                alert.type === 'error' && 'border-red-300 bg-red-100',
                alert.type === 'info' && 'border-purple-300 bg-purple-100',
              )}
            >
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon
                  className={cn(
                    'h-5 w-5',
                    alert.type === 'warning' && 'text-yellow-700',
                    alert.type === 'error' && 'text-red-700',
                    alert.type === 'info' && 'text-purple-700',
                  )}
                />
                <span className="text-gray-900">{alert.message}</span>
              </div>
              {alert.action && (
                <button className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-3 py-1 text-sm font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800">
                  {alert.action}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-purple-100 p-2">
              <GlobeAltIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Domains</p>
              <p className="text-2xl font-bold text-gray-900">
                {overview?.domains.length || 0}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href={`/${lang}/dashboard/domains`}
              className="text-sm text-purple-600 hover:underline"
            >
              Manage domains →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-2">
              <ServerIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href={`/${lang}/dashboard/hosting`}
              className="text-sm text-purple-600 hover:underline"
            >
              View projects →
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-purple-100 p-2">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href={`/${lang}/dashboard/support`}
              className="text-sm text-purple-600 hover:underline"
            >
              View tickets →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Domains */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Domains
            </h2>
            <Link
              href={`/${lang}/dashboard/domains`}
              className="text-sm text-purple-600 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {overview?.domains && overview.domains.length > 0 ? (
            <div className="space-y-4">
              {overview.domains.slice(0, 3).map((domain) => {
                const daysUntilExpiry = getDaysUntilExpiry(
                  domain.expirationDate,
                )
                const isExpiringSoon = daysUntilExpiry <= 30

                return (
                  <div
                    key={domain._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <GlobeAltIcon className="hidden h-8 w-8 text-gray-400 sm:block" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {domain.domainName}
                        </h3>
                        <div className="flex hidden items-center space-x-4 text-sm text-gray-500 sm:flex">
                          <span>
                            Expires {formatDate(domain.expirationDate)}
                          </span>
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 text-xs font-medium',
                              getStatusColor(domain.status),
                            )}
                          >
                            {domain.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {isExpiringSoon && (
                        <span className="flex hidden items-center text-sm text-yellow-600 sm:flex">
                          <ClockIcon className="mr-1 h-4 w-4" />
                          {daysUntilExpiry} days
                        </span>
                      )}
                      <Link
                        href={`/${lang}/dashboard/domains/${domain._id}`}
                        className="text-sm text-purple-600 hover:underline"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center">
              <GlobeAltIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No domains yet
              </h3>
              <p className="mb-4 text-gray-500">
                Get started by purchasing your first domain
              </p>
              <Link
                href={`/${lang}/dashboard/domains/search`}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Search Domains</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          {overview?.recentActivity && overview.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {overview.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div
                    className={cn(
                      'rounded-lg p-2',
                      activity.type === 'domain' && 'bg-purple-100',
                      activity.type === 'hosting' && 'bg-green-100',
                      activity.type === 'support' && 'bg-purple-100',
                    )}
                  >
                    {activity.type === 'domain' && (
                      <GlobeAltIcon className="h-4 w-4 text-purple-600" />
                    )}
                    {activity.type === 'hosting' && (
                      <ServerIcon className="h-4 w-4 text-green-600" />
                    )}
                    {activity.type === 'support' && (
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}
