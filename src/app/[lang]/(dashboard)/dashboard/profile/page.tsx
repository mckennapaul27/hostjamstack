'use client'

import type { UserProfile } from '@/lib/dashboard-api'
import { updateUserProfile } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { useCountries } from '@/utils/countries'
import {
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation('dashboard')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Form state for controlled components
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    timezone: 'UTC',
    language: 'en',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  // Get the current locale from profile or default to 'en'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentLocale = (profile?.profile?.language || 'en') as any
  const { countries, loading: countriesLoading } = useCountries(currentLocale)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.rawJwt) return

      try {
        console.log('session in profile page', session)
        const data = await demoApiProvider.getUserProfile(
          session.rawJwt,
          session.user?._id,
          session.user?.email,
        )
        console.log('data in profile page', data)
        setProfile(data)

        // Update form data with loaded profile
        const newFormData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          company: data.profile?.company || '',
          phone: data.profile?.phone || '',
          timezone: data.profile?.timezone || 'UTC',
          language: data.profile?.language || 'en',
          street: data.billing?.billingAddress?.street || '',
          city: data.billing?.billingAddress?.city || '',
          state: data.billing?.billingAddress?.state || '',
          zipCode: data.billing?.billingAddress?.zipCode || '',
          country: data.billing?.billingAddress?.country || '',
        }
        console.log('Setting form data:', newFormData)
        setFormData(newFormData)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [session?.rawJwt, session?.user?.email])

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    if (!session?.rawJwt || !profile) return

    setSaving(true)
    try {
      const updatedProfile = await updateUserProfile(session.rawJwt, updates)
      setProfile(updatedProfile)
      // Show success message
    } catch (error) {
      console.error('Failed to update profile:', error)
      // Show error message
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', name: t('profile.tabs.profile'), icon: UserCircleIcon },
    { id: 'billing', name: t('profile.tabs.billing'), icon: CreditCardIcon },
    {
      id: 'notifications',
      name: t('profile.tabs.notifications'),
      icon: BellIcon,
    },
    { id: 'security', name: t('profile.tabs.security'), icon: ShieldCheckIcon },
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('profile.title')}
        </h1>
        <p className="text-gray-600">{t('profile.subtitle')}</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="scrollbar-hide overflow-x-auto">
          <nav className="flex flex-col space-x-8 bg-white px-4 sm:flex-row">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-shrink-0 cursor-pointer items-center border-b-2 px-3 py-4 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {activeTab === 'profile' && (
          <div className="p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              {t('profile.personalInfo.title')}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleProfileUpdate({
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  profile: {
                    ...profile?.profile,
                    company: formData.company,
                    phone: formData.phone,
                    timezone: formData.timezone,
                    language: formData.language,
                  },
                })
              }}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.personalInfo.firstName')}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.personalInfo.lastName')}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.personalInfo.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t('profile.personalInfo.emailNote')}
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.personalInfo.company')}
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.personalInfo.phone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.personalInfo.timezone')}
                  </label>
                  <select
                    name="timezone"
                    id="timezone"
                    value={formData.timezone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        timezone: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="UTC">{t('profile.timezones.utc')}</option>
                    <option value="America/New_York">
                      {t('profile.timezones.eastern')}
                    </option>
                    <option value="America/Chicago">
                      {t('profile.timezones.central')}
                    </option>
                    <option value="America/Denver">
                      {t('profile.timezones.mountain')}
                    </option>
                    <option value="America/Los_Angeles">
                      {t('profile.timezones.pacific')}
                    </option>
                    <option value="Europe/London">
                      {t('profile.timezones.london')}
                    </option>
                    <option value="Europe/Paris">
                      {t('profile.timezones.paris')}
                    </option>
                    <option value="Europe/Berlin">
                      {t('profile.timezones.berlin')}
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="language"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.personalInfo.language')}
                  </label>
                  <select
                    name="language"
                    id="language"
                    value={formData.language}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="en">{t('profile.languages.en')}</option>
                    <option value="es">{t('profile.languages.es')}</option>
                    <option value="fr">{t('profile.languages.fr')}</option>
                    <option value="de">{t('profile.languages.de')}</option>
                    <option value="pl">{t('profile.languages.pl')}</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {saving ? t('profile.saving') : t('profile.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              {t('profile.billing.title')}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleProfileUpdate({
                  billing: {
                    ...profile?.billing,
                    billingAddress: {
                      street: formData.street,
                      city: formData.city,
                      state: formData.state,
                      zipCode: formData.zipCode,
                      country: formData.country,
                    },
                  },
                })
              }}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="street"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.billing.street')}
                  </label>
                  <input
                    type="text"
                    name="street"
                    id="street"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        street: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.billing.city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.billing.state')}
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.billing.zipCode')}
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    {t('profile.billing.country')}
                  </label>
                  <select
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    disabled={countriesLoading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {countriesLoading ? (
                      <option value="">{t('profile.billing.loading')}</option>
                    ) : (
                      countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {saving ? t('profile.saving') : t('profile.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              {t('profile.notifications.title')}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('profile.notifications.domainExpiry.title')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('profile.notifications.domainExpiry.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('profile.notifications.deployments.title')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('profile.notifications.deployments.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('profile.notifications.supportTickets.title')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('profile.notifications.supportTickets.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    {t('profile.notifications.marketing.title')}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {t('profile.notifications.marketing.description')}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                {t('profile.notifications.savePreferences')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              {t('profile.security.title')}
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  {t('profile.security.changePassword.title')}
                </h4>
                <button className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800">
                  {t('profile.security.changePassword.button')}
                </button>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  {t('profile.security.twoFactor.title')}
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {t('profile.security.twoFactor.description')}
                  </p>
                  <button
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      profile?.twoFactorEnabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {profile?.twoFactorEnabled
                      ? t('profile.security.twoFactor.disable')
                      : t('profile.security.twoFactor.enable')}
                  </button>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  {t('profile.security.deleteAccount.title')}
                </h4>
                <p className="mb-2 text-sm text-gray-500">
                  {t('profile.security.deleteAccount.description')}
                </p>
                <button className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
                  {t('profile.security.deleteAccount.button')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
