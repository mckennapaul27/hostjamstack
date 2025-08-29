import { initTranslations } from '@/app/i18n'
import DomainCheckoutBody from '@/components/checkouts/domain-checkout'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import TranslationsProvider from '@/components/TranslationsProvider'

export default async function DomainCheckout({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const awaitedParams = await params

  // Initialize translations for the domains namespace
  const { resources } = await initTranslations(awaitedParams.lang, ['domains'])

  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar locale={awaitedParams.lang} />
      </Container>
      <Container>
        <TranslationsProvider
          namespaces={['domains']}
          locale={awaitedParams.lang}
          resources={resources}
        >
          <DomainCheckoutBody />
        </TranslationsProvider>
      </Container>
      <Footer locale={awaitedParams.lang} />
    </main>
  )
}
