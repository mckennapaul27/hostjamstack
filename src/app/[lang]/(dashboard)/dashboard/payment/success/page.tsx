'use client'

import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { useParams, useRouter } from 'next/navigation'

export default function DashboardPaymentSuccess() {
  const params = useParams()
  const router = useRouter()
  const lang = (params?.lang as string) || 'en'

  const handleGoToDashboard = () => {
    router.push(`/${lang}/dashboard`)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircleIcon className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Payment Successful!
        </h1>
        <p className="mt-2 text-gray-600">Thank you for your purchase!</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          What&apos;s Next?
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>✅ Your payment has been processed successfully</p>
          <p>✅ You will receive a confirmation email shortly</p>
          <p>✅ Your domain registration is being processed</p>
          <p>✅ Your service will be activated within 24 hours</p>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full rounded-lg bg-gray-950 px-4 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-gray-800"
          >
            Go to Dashboard
          </button>

          <p className="text-sm text-gray-500">
            Need help? Contact our support team at{' '}
            <a
              href="mailto:support@hostjamstack.com"
              className="text-purple-600 hover:text-purple-800"
            >
              support@hostjamstack.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
