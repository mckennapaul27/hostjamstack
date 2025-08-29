import { initTranslations } from '@/app/i18n'
import SupportCheckoutContent from '@/components/checkouts/support-checkout'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import TranslationsProvider from '@/components/TranslationsProvider'

export default async function SupportCheckout({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params

  // Initialize translations for the common and support-packages namespaces
  const { resources } = await initTranslations(awaitedParams.lang, [
    'common',
    'support-packages',
  ])

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={awaitedParams.lang} />
      </Container>
      <Container>
        <TranslationsProvider
          namespaces={['common', 'support-packages']}
          locale={awaitedParams.lang}
          resources={resources}
        >
          <SupportCheckoutContent />
        </TranslationsProvider>
      </Container>
      <Footer locale={awaitedParams.lang} />
    </main>
  )
}
