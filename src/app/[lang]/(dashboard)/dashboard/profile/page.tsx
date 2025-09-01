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

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Get the current locale from profile or default to 'en'
  const currentLocale = (profile?.profile?.language || 'en') as any
  const { countries, loading: countriesLoading } = useCountries(currentLocale)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.rawJwt) return

      try {
        const data = await demoApiProvider.getUserProfile(
          session.rawJwt,
          session.user?.email,
        )
        setProfile(data)
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
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
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
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
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
              Personal Information
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleProfileUpdate({
                  firstName: formData.get('firstName') as string,
                  lastName: formData.get('lastName') as string,
                  profile: {
                    ...profile?.profile,
                    company: formData.get('company') as string,
                    phone: formData.get('phone') as string,
                    timezone: formData.get('timezone') as string,
                    language: formData.get('language') as string,
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
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    defaultValue={profile?.firstName}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    defaultValue={profile?.lastName}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profile?.email}
                    disabled
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Email cannot be changed. Contact support if needed.
                  </p>
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    id="company"
                    defaultValue={profile?.profile.company}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    defaultValue={profile?.profile.phone}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="timezone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Timezone
                  </label>
                  <select
                    name="timezone"
                    id="timezone"
                    defaultValue={profile?.profile.timezone}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Europe/Berlin">Berlin</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="language"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Language
                  </label>
                  <select
                    name="language"
                    id="language"
                    defaultValue={profile?.profile.language}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="pl">Polski</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              Billing Information
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                handleProfileUpdate({
                  billing: {
                    ...profile?.billing,
                    billingAddress: {
                      street: formData.get('street') as string,
                      city: formData.get('city') as string,
                      state: formData.get('state') as string,
                      zipCode: formData.get('zipCode') as string,
                      country: formData.get('country') as string,
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
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    id="street"
                    defaultValue={profile?.billing.billingAddress.street}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    defaultValue={profile?.billing.billingAddress.city}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    defaultValue={profile?.billing.billingAddress.state}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="zipCode"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    defaultValue={profile?.billing.billingAddress.zipCode}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <select
                    name="country"
                    id="country"
                    defaultValue={profile?.billing.billingAddress.country}
                    disabled={countriesLoading}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                  >
                    {countriesLoading ? (
                      <option value="">Loading...</option>
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
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Domain Expiry Reminders
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified when your domains are about to expire
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
                    Deployment Notifications
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified about successful and failed deployments
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
                    Support Ticket Updates
                  </h4>
                  <p className="text-sm text-gray-500">
                    Get notified about updates to your support tickets
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
                    Marketing Emails
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive product updates and promotional emails
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
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              Security Settings
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Change Password
                </h4>
                <button className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800">
                  Change Password
                </button>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </h4>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                  <button
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      profile?.twoFactorEnabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {profile?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Account Deletion
                </h4>
                <p className="mb-2 text-sm text-gray-500">
                  Permanently delete your account and all associated data
                </p>
                <button className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
