import { initTranslations } from '@/app/i18n'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import PaymentContent from '@/components/payment/payment-content'
import TranslationsProvider from '@/components/TranslationsProvider'

export default async function HostingPayment({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params

  const { resources } = await initTranslations(awaitedParams.lang, [
    'common',
    'payment',
  ])

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={awaitedParams.lang} />
      </Container>
      <Container>
        <TranslationsProvider
          namespaces={['common', 'payment']}
          locale={awaitedParams.lang}
          resources={resources}
        >
          <PaymentContent productType="hosting" />
        </TranslationsProvider>
      </Container>
      <Footer locale={awaitedParams.lang} />
    </main>
  )
}
