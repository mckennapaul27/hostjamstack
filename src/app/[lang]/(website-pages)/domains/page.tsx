import { Container } from '@/components/container'
import { DomainExtTable } from '@/components/domain-ext-table'
import { DomainSearchBox } from '@/components/domain-search-box'
import { Footer } from '@/components/footer'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Domain Registration',
  description:
    'Register your perfect domain name with competitive pricing and instant setup. Choose from hundreds of extensions with transparent pricing.',
}

function Header() {
  return (
    <Container className="mt-16">
      <Heading as="h1">Find your perfect domain name.</Heading>
      <Lead className="mt-6 max-w-3xl">
        Register your domain with competitive pricing, instant DNS setup, and
        professional email included. Choose from hundreds of extensions to match
        your brand perfectly.
      </Lead>
    </Container>
  )
}

function Testimonial() {
  return (
    <div className="mx-2 my-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] pt-72 pb-24 lg:pt-36">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]">
          <div className="flex max-lg:mt-16 lg:col-span-2 lg:px-16">
            <figure className="mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center">
              <blockquote>
                <p className="relative text-3xl tracking-tight text-white lg:text-4xl">
                  <span
                    aria-hidden="true"
                    className="absolute -translate-x-full"
                  >
                    &quot;
                  </span>
                  Found the perfect domain in minutes. The search was fast,
                  pricing was transparent, and setup was instant.
                  <span aria-hidden="true" className="absolute">
                    &quot;
                  </span>
                </p>
              </blockquote>
              <figcaption className="mt-auto">
                <p className="text-sm/6 font-medium text-white">Alex Chen</p>
                <p className="text-sm/6 font-medium">
                  <span className="bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent">
                    Startup Founder, TechForward
                  </span>
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </div>
  )
}

function FrequentlyAskedQuestions() {
  return (
    <Container>
      <section id="faqs" className="scroll-mt-8">
        <Subheading className="text-center">
          Frequently asked questions
        </Subheading>
        <Heading as="div" className="mt-2 text-center">
          Your questions answered.
        </Heading>
        <div className="mx-auto mt-16 mb-32 max-w-xl space-y-12">
          <dl>
            <dt className="text-sm font-semibold">
              How quickly can I get my domain after registration?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Domain registration is instant for most extensions. Once payment
              is processed, your domain is immediately active and ready to use.
              DNS propagation typically takes 24-48 hours globally.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Do you provide DNS management and email forwarding?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Yes, all domain registrations include free DNS management through
              our intuitive control panel. Email forwarding is included with
              most plans, and we offer professional email hosting as an add-on.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              What happens when my domain expires?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              We send renewal reminders 90, 30, and 7 days before expiration.
              Domains can be renewed up to 30 days after expiration. After that,
              there&apos;s a grace period before the domain becomes available to
              others.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Can I transfer my existing domain to you?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Absolutely! Domain transfers are free and typically complete
              within 5-7 days. We&apos;ll handle the technical details and
              ensure no downtime during the transfer process.
            </dd>
          </dl>
          <dl>
            <dt className="text-sm font-semibold">
              Do you offer domain privacy protection?
            </dt>
            <dd className="mt-4 text-sm/6 text-gray-600">
              Yes, WHOIS privacy protection is included free with all domain
              registrations. This keeps your personal information private and
              reduces spam and unwanted contact.
            </dd>
          </dl>
        </div>
      </section>
    </Container>
  )
}

export default function Domains() {
  return (
    <main className="overflow-hidden">
      <GradientBackground />
      <Container>
        <Navbar />
      </Container>
      <Header />
      <DomainSearchBox className="mt-24" />
      <DomainExtTable />
      <Testimonial />
      <FrequentlyAskedQuestions />
      <Footer type="domains" />
    </main>
  )
}
