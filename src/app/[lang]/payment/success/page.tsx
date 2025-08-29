import { initTranslations } from '@/app/i18n'
import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default async function PaymentSuccess({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const locale = (await params).lang
  const { t } = await initTranslations(locale, ['common', 'payment'])

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={locale} />
      </Container>
      <Container>
        <div className="mx-auto max-w-2xl py-16 text-center">
          <div className="mb-8 flex justify-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500" />
          </div>

          <Subheading className="text-green-600">
            {t('payment:success.title')}
          </Subheading>
          <Heading as="h1" className="mt-2">
            {t('payment:success.message')}
          </Heading>

          <div className="mt-8 rounded-lg bg-white p-6 text-left shadow-sm ring-1 ring-black/5">
            <div className="space-y-3 text-sm text-gray-600">
              <p>✓ {t('payment:success.paymentProcessed')}</p>
              <p>✓ {t('payment:success.confirmationEmail')}</p>
              <p>✓ {t('payment:success.accountActivated')}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              href={`/${locale}/dashboard`}
              className="flex-1 sm:flex-none"
            >
              {t('payment:success.goToDashboard')}
            </Button>
            <Button
              href={`/${locale}/`}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              {t('payment:success.backToHome')}
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            {t('payment:success.needHelp')}{' '}
            <a
              href="mailto:support@hostjamstack.com"
              className="text-blue-600 hover:text-blue-500"
            >
              support@hostjamstack.com
            </a>
          </p>
        </div>
      </Container>
      <Footer locale={locale} />
    </main>
  )
}
