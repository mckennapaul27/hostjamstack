'use client'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { Mark } from '@/components/logo'
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface RegisterFormProps {
  locale: string
  isDomainContext: boolean
  isHostingContext: boolean
  isSupportContext: boolean
  domain?: string
  domainPrice?: string
  years?: string
  premium?: string
  plan?: string
  planName?: string
  hostingPrice?: string
  billingPeriod?: string
  priceMonthly?: string
  supportPackage?: string
  packageName?: string
  supportPrice?: string
  currency?: string
  billing?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

interface ValidationError {
  field: string
  message: string
}

interface RegisterErrorResponse {
  error?: string
  message?: string
  code?: string
  errors?: ValidationError[]
}

export default function RegisterForm(props: RegisterFormProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null) // Clear error when user starts typing
  }

  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'First name is required'
    if (!formData.lastName.trim()) return 'Last name is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!formData.email.includes('@')) return 'Please enter a valid email'
    if (formData.password.length < 8)
      return 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword)
      return 'Passwords do not match'
    if (!formData.terms) return 'You must agree to the terms and conditions'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Step 1: Register user with backend
      const serverUrl =
        process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5001'

      let registerResponse: Response
      let registerData: RegisterErrorResponse

      try {
        registerResponse = await fetch(`${serverUrl}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
          }),
        })
      } catch {
        throw new Error(
          'Unable to connect to the server. Please check your internet connection and try again.',
        )
      }

      try {
        registerData = await registerResponse.json()
      } catch {
        throw new Error('Server response was invalid. Please try again.')
      }

      if (!registerResponse.ok) {
        // Handle different error response formats
        let errorMessage: string

        // Handle validation errors with specific field messages
        if (registerData.errors && Array.isArray(registerData.errors)) {
          // Format validation errors into user-friendly messages
          const validationMessages = registerData.errors.map(
            (err: ValidationError) => {
              if (err.field === 'password') {
                return err.message || 'Password validation failed'
              }
              if (err.field === 'email') {
                return err.message || 'Email validation failed'
              }
              return `${err.field}: ${err.message}`
            },
          )
          errorMessage = validationMessages.join('. ')
        } else {
          // Handle general error messages
          errorMessage =
            registerData.error || registerData.message || 'Registration failed'
        }

        // Handle specific error cases
        if (registerResponse.status === 400) {
          throw new Error(errorMessage)
        } else if (registerResponse.status === 409) {
          // Use custom message for user exists, but could also use backend message
          const message =
            registerData.code === 'USER_EXISTS'
              ? 'An account with this email already exists. Please try signing in instead.'
              : errorMessage
          throw new Error(message)
        } else if (registerResponse.status >= 500) {
          throw new Error('Server error. Please try again later.')
        } else {
          throw new Error(errorMessage)
        }
      }

      // Step 2: Auto sign-in with NextAuth using the returned user data
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (signInResult?.error) {
        // If auto sign-in fails, redirect to login page with success message
        console.warn(
          'Auto sign-in failed, redirecting to login:',
          signInResult.error,
        )
        const loginUrl = `/${props.locale}/login?message=registration-success&email=${encodeURIComponent(formData.email)}`
        router.push(loginUrl)
        return
      }

      // Step 3: Redirect to confirmation page with context
      const searchParams = new URLSearchParams()

      if (props.isDomainContext) {
        if (props.domain) searchParams.set('domain', props.domain)
        if (props.domainPrice) searchParams.set('price', props.domainPrice)
        if (props.years) searchParams.set('years', props.years)
        if (props.premium) searchParams.set('premium', props.premium)
      }

      if (props.isHostingContext) {
        if (props.plan) searchParams.set('plan', props.plan)
        if (props.planName) searchParams.set('planName', props.planName)
        if (props.hostingPrice) searchParams.set('price', props.hostingPrice)
        if (props.billingPeriod)
          searchParams.set('billingPeriod', props.billingPeriod)
        if (props.priceMonthly)
          searchParams.set('priceMonthly', props.priceMonthly)
      }

      if (props.isSupportContext) {
        if (props.supportPackage)
          searchParams.set('supportPackage', props.supportPackage)
        if (props.packageName)
          searchParams.set('packageName', props.packageName)
        if (props.supportPrice) searchParams.set('price', props.supportPrice)
        if (props.currency) searchParams.set('currency', props.currency)
        if (props.billing) searchParams.set('billing', props.billing)
      }

      const confirmationUrl = `/${props.locale}/confirmation${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      router.push(confirmationUrl)
    } catch (err) {
      console.error('Registration error:', err)

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl bg-white shadow-md ring-1 ring-black/5">
      <form onSubmit={handleSubmit} className="p-7 sm:p-11">
        <div className="flex items-start">
          <Link href="/" title="Home">
            <Mark />
          </Link>
        </div>

        {/* Mobile Context - Show only on small screens */}
        {(props.isDomainContext ||
          props.isHostingContext ||
          props.isSupportContext) && (
          <div className="mt-6 rounded-lg border border-purple-200 bg-purple-50 p-4 lg:hidden">
            {props.isDomainContext && (
              <>
                <h3 className="text-sm font-medium text-purple-900">
                  {t('auth.register.domainContext')}
                </h3>
                <p className="mt-1 text-lg font-semibold text-purple-900">
                  {props.domain}
                </p>
                {props.domainPrice && props.years && (
                  <p className="mt-1 text-sm text-purple-700">
                    €{props.domainPrice} for {props.years}{' '}
                    {parseInt(props.years) === 1
                      ? t('auth.register.year')
                      : t('auth.register.years')}
                    {props.premium === 'true' && (
                      <span className="ml-2 text-orange-600">
                        ({t('auth.register.premium')})
                      </span>
                    )}
                  </p>
                )}
              </>
            )}

            {props.isHostingContext && (
              <>
                <h3 className="text-sm font-medium text-purple-900">
                  {t(
                    'auth.register.hostingContext',
                    'Complete registration for:',
                  )}
                </h3>
                <p className="mt-1 text-lg font-semibold text-purple-900">
                  {props.planName} Plan
                </p>
                {props.hostingPrice && props.billingPeriod && (
                  <p className="mt-1 text-sm text-purple-700">
                    €{props.hostingPrice} for{' '}
                    {props.billingPeriod === '1'
                      ? '1 month'
                      : props.billingPeriod === '6'
                        ? '6 months'
                        : props.billingPeriod === '12'
                          ? '12 months'
                          : `${props.billingPeriod} months`}
                    {props.priceMonthly && (
                      <span className="ml-2 text-gray-600">
                        (€{props.priceMonthly}/month)
                      </span>
                    )}
                  </p>
                )}
              </>
            )}

            {props.isSupportContext && (
              <>
                <h3 className="text-sm font-medium text-purple-900">
                  {t(
                    'auth.register.supportContext',
                    'Complete registration for:',
                  )}
                </h3>
                <p className="mt-1 text-lg font-semibold text-purple-900">
                  {props.packageName}
                </p>
                {props.supportPrice && props.currency && (
                  <p className="mt-1 text-sm text-purple-700">
                    €{props.supportPrice} • One-time payment
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <h1 className="mt-8 text-base/6 font-medium">
          {t('auth.register.title')}
        </h1>
        <p className="mt-1 text-sm/5 text-gray-600">
          {t('auth.register.subtitle')}
        </p>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Registration Error
                </h3>
                <div className="mt-1 text-sm text-red-700">
                  {error.includes('. ') ? (
                    // Multiple errors - show as list
                    <ul className="list-inside list-disc space-y-1">
                      {error
                        .split('. ')
                        .filter(Boolean)
                        .map((errorItem, index) => (
                          <li key={index}>{errorItem}</li>
                        ))}
                    </ul>
                  ) : (
                    // Single error - show as paragraph
                    <p>{error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* First Name and Last Name */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Field className="space-y-3">
            <Label className="text-sm/5 font-medium">
              {t('auth.register.firstName')}
            </Label>
            <Input
              required
              autoFocus
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              disabled={isLoading}
              className={clsx(
                'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            />
          </Field>
          <Field className="space-y-3">
            <Label className="text-sm/5 font-medium">
              {t('auth.register.lastName')}
            </Label>
            <Input
              required
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              disabled={isLoading}
              className={clsx(
                'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            />
          </Field>
        </div>

        {/* Email */}
        <Field className="mt-2 space-y-3">
          <Label className="text-sm/5 font-medium">
            {t('auth.register.email')}
          </Label>
          <Input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={isLoading}
            className={clsx(
              'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
              'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
              'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />
        </Field>

        {/* Password */}
        <Field className="mt-6 space-y-3">
          <Label className="text-sm/5 font-medium">
            {t('auth.register.password')}
          </Label>
          <Input
            required
            type="password"
            name="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            disabled={isLoading}
            className={clsx(
              'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
              'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
              'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />
        </Field>

        {/* Confirm Password */}
        <Field className="mt-6 space-y-3">
          <Label className="text-sm/5 font-medium">
            {t('auth.register.confirmPassword')}
          </Label>
          <Input
            required
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) =>
              handleInputChange('confirmPassword', e.target.value)
            }
            disabled={isLoading}
            className={clsx(
              'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
              'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
              'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />
        </Field>

        {/* Terms and Conditions */}
        <div className="mt-6 flex items-start gap-3 text-sm/5">
          <Field className="flex items-start gap-3">
            <Checkbox
              name="terms"
              checked={formData.terms}
              onChange={(checked) => handleInputChange('terms', checked)}
              disabled={isLoading}
              className={clsx(
                'group mt-0.5 block size-4 rounded-sm border border-transparent shadow-sm ring-1 ring-black/10',
                'data-checked:bg-black data-checked:ring-black',
                'data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
            </Checkbox>
            <Label className="text-gray-600">
              {t('auth.register.termsStart')}{' '}
              <Link
                href="/legal/terms-and-conditions"
                className="font-medium hover:text-gray-900"
              >
                {t('auth.register.termsConditions')}
              </Link>{' '}
              {t('auth.register.termsAnd')}{' '}
              <Link
                href="/legal/privacy-policy"
                className="font-medium hover:text-gray-900"
              >
                {t('auth.register.privacyPolicy')}
              </Link>
            </Label>
          </Field>
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t('auth.register.creatingAccount')}
              </div>
            ) : (
              t('auth.register.createAccount')
            )}
          </Button>
        </div>
      </form>

      {/* Sign In Link */}
      <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
        {t('auth.register.alreadyHaveAccount')}{' '}
        <Link
          href={`/${props.locale}/login`}
          className="font-medium hover:text-gray-600"
        >
          {t('auth.register.signIn')}
        </Link>
      </div>
    </div>
  )
}
