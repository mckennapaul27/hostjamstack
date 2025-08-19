'use client'

import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { useState } from 'react'
import { Button } from './button'
import { Container } from './container'
import { Heading, Subheading } from './text'

const domainExtensions = [
  { extension: '.com', price: '€9.56', period: 'Year' },
  { extension: '.co', price: '€4.56', period: 'Year' },
  { extension: '.info', price: '€9.56', period: 'Year' },
  { extension: '.org', price: '€6.56', period: 'Year' },
  { extension: '.biz', price: '€6.56', period: 'Year' },
]

export function DomainSearchBox({ className = '' }: { className?: string }) {
  const [domainName, setDomainName] = useState('')
  const [selectedExtension, setSelectedExtension] = useState('.com')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSearch = () => {
    if (domainName.trim()) {
      console.log(`Searching for: €{domainName}€{selectedExtension}`)
      // Add your domain search logic here
    }
  }

  return (
    <div className={clsx('mx-2 mt-2 rounded-4xl bg-gray-900 py-32', className)}>
      <Container>
        <div className="text-center">
          <Subheading dark>domains</Subheading>
          <Heading as="h2" dark className="mx-auto mt-2 max-w-none">
            Find your perfect domain
          </Heading>

          {/* Search Form */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              {/* Domain Input */}
              <div className="relative w-full flex-1">
                <input
                  type="text"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="Domain Name"
                  className={clsx(
                    'block w-full rounded-lg border border-transparent shadow-sm ring-1 ring-white/20',
                    'bg-white/10 px-4 py-3 text-base text-white placeholder-white/60',
                    'focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none',
                    'backdrop-blur-sm',
                  )}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Extension Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={clsx(
                    'flex min-w-[100px] items-center justify-between rounded-lg border border-transparent',
                    'bg-white/10 px-4 py-3 text-base text-white shadow-sm ring-1 ring-white/20',
                    'hover:bg-white/20 focus:ring-2 focus:ring-blue-500 focus:outline-none',
                    'backdrop-blur-sm',
                  )}
                >
                  {selectedExtension}
                  <ChevronDownIcon
                    className={clsx(
                      'ml-2 h-4 w-4 transition-transform',
                      isDropdownOpen && 'rotate-180',
                    )}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full z-10 mt-1 w-full rounded-lg bg-white shadow-lg ring-1 ring-black/5">
                    {domainExtensions.map(({ extension }) => (
                      <button
                        key={extension}
                        onClick={() => {
                          setSelectedExtension(extension)
                          setIsDropdownOpen(false)
                        }}
                        className="block w-full px-4 py-2 text-left text-gray-900 first:rounded-t-lg last:rounded-b-lg hover:bg-gray-50"
                      >
                        {extension}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <Button
                onClick={handleSearch}
                className={clsx(
                  '!leading-[24px]cursor-pointer cursor-pointer rounded-md bg-white !py-3 !text-gray-900 shadow-md shadow-sm ring-1 ring-white/20 hover:!bg-white/10 hover:bg-white/20 hover:!text-white',
                )}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Domain Extension Cards */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {domainExtensions.map(({ extension, price, period }) => (
              <div
                key={extension}
                className={clsx(
                  'rounded-lg bg-white/10 p-4 text-center backdrop-blur-sm',
                  'cursor-pointer ring-1 ring-white/20 transition-colors hover:bg-white/20',
                  'group',
                )}
                onClick={() => setSelectedExtension(extension)}
              >
                <div
                  className={clsx(
                    'mb-1 text-2xl font-bold',
                    extension === '.com' && 'text-blue-400',
                    extension === '.co' && 'text-red-400',
                    extension === '.info' && 'text-orange-400',
                    extension === '.org' && 'text-green-400',
                    extension === '.biz' && 'text-cyan-400',
                  )}
                >
                  {extension}
                </div>
                <div className="text-sm text-white">
                  <span className="font-semibold">{price}</span>
                  {/* <span className="text-white/70">/{period}</span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
