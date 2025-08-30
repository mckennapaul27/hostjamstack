'use client'

import { Button } from '@/components/button'
import { Link } from '@/components/link'
import { Mark } from '@/components/logo'
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface LoginFormProps {
  locale: string
}

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

export default function LoginForm({ locale }: LoginFormProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<FormData>({
    email: searchParams.get('email') || '',
    password: '',
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for messages from URL params (e.g., registration success)
  const message = searchParams.get('message')
  const showSuccessMessage = message === 'registration-success'

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null) // Clear error when user starts typing
  }

  const validateForm = (): string | null => {
    if (!formData.email.trim())
      return t('auth.login.emailRequired') || 'Email is required'
    if (!formData.email.includes('@'))
      return t('auth.login.emailInvalid') || 'Please enter a valid email'
    if (!formData.password.trim())
      return t('auth.login.passwordRequired') || 'Password is required'
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
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        // Handle specific NextAuth errors
        if (result.error === 'CredentialsSignin') {
          setError(
            t('auth.login.invalidCredentials') ||
              'Invalid email or password. Please try again.',
          )
        } else {
          setError(
            t('auth.login.loginFailed') || 'Login failed. Please try again.',
          )
        }
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Check if there's a redirect URL (e.g., from protected page)
        const callbackUrl = searchParams.get('callbackUrl')
        const redirectUrl = callbackUrl || `/${locale}/dashboard`

        // Successful login - redirect to dashboard or callback URL
        router.push(redirectUrl)
        router.refresh() // Refresh to update session state
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(
        t('auth.login.unexpectedError') ||
          'An unexpected error occurred. Please try again.',
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
      <div className="w-full max-w-md rounded-xl bg-white shadow-md ring-1 ring-black/5">
        <form onSubmit={handleSubmit} className="p-7 sm:p-11">
          <div className="flex items-start">
            <Link href={`/${locale}`} title="Home">
              <Mark />
            </Link>
          </div>

          <h1 className="mt-8 text-base/6 font-medium">
            {t('auth.login.title')}
          </h1>
          <p className="mt-1 text-sm/5 text-gray-600">
            {t('auth.login.subtitle')}
          </p>

          {/* Success message for users redirected from registration */}
          {showSuccessMessage && (
            <div className="mt-4 rounded-md bg-green-50 p-4 ring-1 ring-green-200">
              <p className="text-sm text-green-800">
                {t('auth.login.registrationSuccess') ||
                  'Registration successful! Please sign in to continue.'}
              </p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Field className="mt-8 space-y-3">
            <Label className="text-sm/5 font-medium">
              {t('auth.login.email')}
            </Label>
            <Input
              required
              autoFocus={!formData.email}
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={clsx(
                'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={isLoading}
            />
          </Field>

          <Field className="mt-8 space-y-3">
            <Label className="text-sm/5 font-medium">
              {t('auth.login.password')}
            </Label>
            <Input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={clsx(
                'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-black/10',
                'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                'data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
              disabled={isLoading}
            />
          </Field>

          <div className="mt-8 flex items-center justify-between text-sm/5">
            <Field className="flex items-center gap-3">
              <Checkbox
                name="remember-me"
                checked={formData.rememberMe}
                onChange={(checked) => handleInputChange('rememberMe', checked)}
                disabled={isLoading}
                className={clsx(
                  'group block size-4 rounded-sm border border-transparent shadow-sm ring-1 ring-black/10',
                  'data-checked:bg-black data-checked:ring-black',
                  'data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                )}
              >
                <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
              </Checkbox>
              <Label className={clsx(isLoading && 'opacity-50')}>
                {t('auth.login.rememberMe')}
              </Label>
            </Field>
            <Link
              href={`/${locale}/forgot-password`}
              className={clsx(
                'font-medium hover:text-gray-600',
                isLoading && 'pointer-events-none opacity-50',
              )}
            >
              {t('auth.login.forgotPassword')}
            </Link>
          </div>

          <div className="mt-8">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? t('auth.login.signingIn') || 'Signing in...'
                : t('auth.login.signIn')}
            </Button>
          </div>
        </form>

        <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
          {t('auth.login.notAMember')}{' '}
          <Link
            href={`/${locale}/register`}
            className={clsx(
              'font-medium hover:text-gray-600',
              isLoading && 'pointer-events-none opacity-50',
            )}
          >
            {t('auth.login.createAccount')}
          </Link>
        </div>
      </div>
    </div>
  )
}
