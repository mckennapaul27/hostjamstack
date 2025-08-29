import { initTranslations } from '@/app/i18n'
import HostingCheckoutContent from '@/components/checkouts/hosting-checkout'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import TranslationsProvider from '@/components/TranslationsProvider'

export default async function HostingCheckout({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params

  // Initialize translations for the common, pricing and hosting namespaces
  const { resources } = await initTranslations(awaitedParams.lang, [
    'common',
    'pricing',
    'hosting',
  ])

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={awaitedParams.lang} />
      </Container>
      <Container>
        <TranslationsProvider
          namespaces={['common', 'pricing', 'hosting']}
          locale={awaitedParams.lang}
          resources={resources}
        >
          <HostingCheckoutContent />
        </TranslationsProvider>
      </Container>
      <Footer locale={awaitedParams.lang} />
    </main>
  )
}
