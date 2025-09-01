'use client'

import type { DNSRecord, Domain } from '@/lib/dashboard-api'
import { updateDomainSettings } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { cn, formatCurrency, formatDate, getDaysUntilExpiry } from '@/lib/utils'
import {
  ClockIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DomainDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const domainId = params?.id as string
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation('dashboard')
  console.log('lang in domains/[id] page', lang)

  const [domain, setDomain] = useState<Domain | null>(null)
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchDomain = async () => {
      if (!session?.rawJwt || !domainId) return

      try {
        const [domainData, dnsData] = await Promise.all([
          demoApiProvider.getDomainById(
            session.rawJwt,
            domainId,
            session.user?.email,
          ),
          demoApiProvider.getDNSRecords(
            session.rawJwt,
            domainId,
            session.user?.email,
          ),
        ])
        setDomain(domainData)
        setDnsRecords(dnsData)
      } catch (error) {
        console.error('Failed to fetch domain:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDomain()
  }, [session?.rawJwt, domainId, session?.user?.email])

  const handleUpdateSettings = async (updates: Partial<Domain>) => {
    if (!session?.rawJwt || !domain) return

    setSaving(true)
    try {
      const updatedDomain = await updateDomainSettings(
        session.rawJwt,
        domain._id,
        updates,
      )
      setDomain(updatedDomain)
    } catch (error) {
      console.error('Failed to update domain:', error)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'overview', name: t('domainDetail.tabs.overview') },
    { id: 'dns', name: t('domainDetail.tabs.dns') },
    { id: 'email', name: t('domainDetail.tabs.email') },
    { id: 'transfer', name: t('domainDetail.tabs.transfer') },
  ]

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

  if (!domain) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {t('domainDetail.notFound.title')}
        </h1>
        <p className="text-gray-600">{t('domainDetail.notFound.message')}</p>
      </div>
    )
  }

  const daysUntilExpiry = getDaysUntilExpiry(domain.expirationDate)
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <GlobeAltIcon className="h-8 w-8 text-gray-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {domain.domainName}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>
                {t('domainDetail.registered')}{' '}
                {formatDate(domain.registrationDate)}
              </span>
              {domain.isPremium && (
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                  {t('domainDetail.premiumDomain')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
          >
            {t('domainDetail.renewDomain')}
          </button>
        </div>
      </div>

      {/* Expiry Warning */}
      {isExpiringSoon && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center">
            <ClockIcon className="mr-3 h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {t('domainDetail.expiryWarning.title', {
                  days: daysUntilExpiry,
                })}
              </h3>
              <p className="text-sm text-yellow-700">
                {t('domainDetail.expiryWarning.message')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <>
            {/* Domain Status */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('domainDetail.status.title')}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="mb-1 text-sm text-gray-500">
                    {t('domainDetail.status.status')}
                  </div>
                  <div className="text-lg font-medium text-green-600 capitalize">
                    {domain.status}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">
                    {t('domainDetail.status.expires')}
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatDate(domain.expirationDate)}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">
                    {t('domainDetail.status.autoRenew')}
                  </div>
                  <div
                    className={cn(
                      'text-lg font-medium',
                      domain.autoRenew ? 'text-green-600' : 'text-red-600',
                    )}
                  >
                    {domain.autoRenew
                      ? t('domainDetail.status.enabled')
                      : t('domainDetail.status.disabled')}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">
                    {t('domainDetail.status.renewalPrice')}
                  </div>
                  <div className="text-lg font-medium text-gray-900">
                    {formatCurrency(domain.renewalPrice, domain.currency)}
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Settings */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('domainDetail.settings.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {t('domainDetail.settings.autoRenewal.title')}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t('domainDetail.settings.autoRenewal.description')}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({ autoRenew: !domain.autoRenew })
                    }
                    disabled={saving}
                    className={cn(
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none',
                      domain.autoRenew ? 'bg-purple-600' : 'bg-gray-200',
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        domain.autoRenew ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {t('domainDetail.settings.whoisPrivacy.title')}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t('domainDetail.settings.whoisPrivacy.description')}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({
                        whoisPrivacy: !domain.whoisPrivacy,
                      })
                    }
                    disabled={saving}
                    className={cn(
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none',
                      domain.whoisPrivacy ? 'bg-purple-600' : 'bg-gray-200',
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        domain.whoisPrivacy ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {t('domainDetail.settings.transferLock.title')}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t('domainDetail.settings.transferLock.description')}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({
                        transferLock: !domain.transferLock,
                      })
                    }
                    disabled={saving}
                    className={cn(
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none',
                      domain.transferLock ? 'bg-purple-600' : 'bg-gray-200',
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        domain.transferLock ? 'translate-x-5' : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Nameservers */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('domainDetail.nameservers.title')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {t('domainDetail.nameservers.useDefault.title')}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t('domainDetail.nameservers.useDefault.description')}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleUpdateSettings({
                        useDefaultNameservers: !domain.useDefaultNameservers,
                      })
                    }
                    disabled={saving}
                    className={cn(
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none',
                      domain.useDefaultNameservers
                        ? 'bg-purple-600'
                        : 'bg-gray-200',
                    )}
                  >
                    <span
                      className={cn(
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        domain.useDefaultNameservers
                          ? 'translate-x-5'
                          : 'translate-x-0',
                      )}
                    />
                  </button>
                </div>

                <div className="space-y-2">
                  {domain.nameservers.map((ns, index) => (
                    <div key={index} className="rounded-lg bg-gray-50 p-3">
                      <div className="text-sm font-medium text-gray-900">
                        {t('domainDetail.nameservers.nameserver')} {index + 1}
                      </div>
                      <div className="text-sm text-gray-500">{ns}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'dns' && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('domainDetail.dns.title')}
              </h3>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                {t('domainDetail.dns.addRecord')}
              </button>
            </div>

            {dnsRecords.length > 0 ? (
              <div className="space-y-4">
                {dnsRecords.map((record) => (
                  <div
                    key={record._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {record.type}
                        </span>
                        <span className="font-medium text-gray-900">
                          {record.name || '@'}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-gray-700">{record.value}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {t('domainDetail.dns.ttl')}: {record.ttl}s
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          record.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {record.isActive
                          ? t('domainDetail.dns.active')
                          : t('domainDetail.dns.inactive')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Cog6ToothIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h4 className="mb-2 text-lg font-medium text-gray-900">
                  {t('domainDetail.dns.empty.title')}
                </h4>
                <p className="text-gray-500">
                  {t('domainDetail.dns.empty.message')}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'email' && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('domainDetail.email.title')}
              </h3>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                {t('domainDetail.email.addForwarding')}
              </button>
            </div>

            {domain?.emailForwarding && domain.emailForwarding.length > 0 ? (
              <div className="space-y-4">
                {domain.emailForwarding.map((forward, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-900">
                          {forward.alias}@{domain.domainName}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-gray-700">
                          {forward.forwardTo}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          forward.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {forward.active
                          ? t('domainDetail.email.active')
                          : t('domainDetail.email.inactive')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-400">
                  <span className="font-bold text-white">@</span>
                </div>
                <h4 className="mb-2 text-lg font-medium text-gray-900">
                  {t('domainDetail.email.empty.title')}
                </h4>
                <p className="text-gray-500">
                  {t('domainDetail.email.empty.message')}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'transfer' && (
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('domainDetail.transfer.domain.title')}
              </h3>
              <p className="mb-4 text-gray-600">
                {t('domainDetail.transfer.domain.description')}
              </p>
              <button className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
                {t('domainDetail.transfer.domain.button')}
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('domainDetail.transfer.share.title')}
              </h3>
              <p className="mb-4 text-gray-600">
                {t('domainDetail.transfer.share.description')}
              </p>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                {t('domainDetail.transfer.share.button')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
