'use client'

import { demoApiProvider } from '@/lib/demo-api-provider'
import {
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  ServerIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PurchaseHistoryItem {
  id: string
  type: 'domain' | 'hosting' | 'support'
  title: string
  description: string
  amount: number
  currency: string
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  details?: {
    domainName?: string
    packageName?: string
    billingCycle?: string
    completionDate?: string
  }
}

export default function PurchaseHistoryPage() {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation('dashboard')

  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>(
    [],
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      if (!session?.rawJwt) return

      try {
        // Fetch all purchase data and combine into history
        const [domains, hostingPackages, supportPackages] = await Promise.all([
          demoApiProvider.getUserDomains(session.rawJwt, session.user?.email),
          demoApiProvider.getHostingPackages(
            session.rawJwt,
            session.user?.email,
          ),
          demoApiProvider.getPurchasedSupportPackages(
            session.rawJwt,
            session.user?.email,
          ),
        ])

        const history: PurchaseHistoryItem[] = []

        // Add domain purchases
        domains.forEach((domain) => {
          history.push({
            id: `domain-${domain._id}`,
            type: 'domain',
            title: t('purchaseHistory.items.domainRegistration', {
              domain: domain.domainName,
            }),
            description: t('purchaseHistory.items.yearRegistration', {
              years: domain.registrationPeriod,
            }),
            amount: domain.purchasePrice,
            currency: domain.currency,
            date: domain.registrationDate,
            status: 'completed',
            details: {
              domainName: domain.domainName,
            },
          })
        })

        // Add hosting package purchases
        hostingPackages.forEach((pkg) => {
          history.push({
            id: `hosting-${pkg._id}`,
            type: 'hosting',
            title: t('purchaseHistory.items.hostingPlan', {
              plan: pkg.packageName,
            }),
            description:
              pkg.billingCycle === 'yearly'
                ? t('purchaseHistory.items.annualPlan')
                : t('purchaseHistory.items.monthlyPlan'),
            amount: pkg.price,
            currency: pkg.currency,
            date: pkg.createdAt,
            status: 'completed',
            details: {
              packageName: pkg.packageName,
              billingCycle: pkg.billingCycle,
            },
          })
        })

        // Add support package purchases
        supportPackages.forEach((pkg) => {
          history.push({
            id: `support-${pkg._id}`,
            type: 'support',
            title: t('purchaseHistory.items.supportPackage', {
              package: pkg.packageName,
            }),
            description: t('purchaseHistory.items.onetimeSupport', {
              domain: pkg.domainName,
            }),
            amount: pkg.price,
            currency: pkg.currency,
            date: pkg.purchaseDate,
            status: 'completed',
            details: {
              domainName: pkg.domainName,
              completionDate: pkg.completionDate,
            },
          })
        })

        // Sort by date (newest first)
        history.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        setPurchaseHistory(history)
      } catch (error) {
        console.error('Failed to fetch purchase history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchaseHistory()
  }, [session?.rawJwt, session?.user?.email])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'domain':
        return <GlobeAltIcon className="h-5 w-5 text-blue-600" />
      case 'hosting':
        return <ServerIcon className="h-5 w-5 text-green-600" />
      case 'support':
        return <UserGroupIcon className="h-5 w-5 text-purple-600" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'domain':
        return 'bg-blue-100 text-blue-800'
      case 'hosting':
        return 'bg-green-100 text-green-800'
      case 'support':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'cancelled':
        return <ClockIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getTotalSpent = () => {
    return purchaseHistory.reduce((total, item) => total + item.amount, 0)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 h-4 w-1/3 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('purchaseHistory.title')}
          </h1>
          <p className="text-gray-600">{t('purchaseHistory.subtitle')}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {t('purchaseHistory.totalSpent')}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            €{getTotalSpent().toFixed(2)}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-blue-100 p-2">
              <GlobeAltIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {t('purchaseHistory.summary.domains')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  purchaseHistory.filter((item) => item.type === 'domain')
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-2">
              <ServerIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {t('purchaseHistory.summary.hostingPlans')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  purchaseHistory.filter((item) => item.type === 'hosting')
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center">
            <div className="rounded-lg bg-purple-100 p-2">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {t('purchaseHistory.summary.supportPackages')}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  purchaseHistory.filter((item) => item.type === 'support')
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase History List */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('purchaseHistory.transactionHistory')}
          </h2>
        </div>

        {purchaseHistory.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {purchaseHistory.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(item.type)}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center space-x-2">
                          <h3 className="truncate font-medium text-gray-900">
                            {item.title}
                          </h3>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeColor(item.type)}`}
                          >
                            {t(`purchaseHistory.types.${item.type}`)}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-gray-600">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                          {item.details?.completionDate && (
                            <span>
                              {t('purchaseHistory.dates.completed', {
                                date: new Date(
                                  item.details.completionDate,
                                ).toLocaleDateString(),
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        €{item.amount.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(item.status)}
                        <span className="text-xs text-gray-500 capitalize">
                          {t(`purchaseHistory.status.${item.status}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {t('purchaseHistory.empty.title')}
            </h3>
            <p className="mt-2 text-gray-600">
              {t('purchaseHistory.empty.subtitle')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
