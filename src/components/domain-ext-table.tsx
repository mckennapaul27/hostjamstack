'use client'

import { MagnifyingGlassIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { useState } from 'react'
import { Button } from './button'
import { Container } from './container'
import { Heading } from './text'

const domainExtensions = [
  {
    extension: '.accountant',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.actor',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.adult',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.ae',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.agency',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.ai',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.apartments',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.asia',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
  {
    extension: '.associates',
    registration: '€35.70',
    renewal: '€35.70',
    transfer: '€35.70',
    idProtection: '€35.70',
  },
]

export function DomainExtTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExtension, setSelectedExtension] = useState('.net')

  const filteredExtensions = domainExtensions.filter((ext) =>
    ext.extension.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-gray-50 py-24">
      <Container>
        <div className="mb-16 text-center">
          <Heading as="h2" className="text-gray-900">
            Choose from the most popular domain extensions
          </Heading>
        </div>

        {/* Search Section */}
        <div className="mx-auto mb-16 max-w-2xl">
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Extensions"
                className={clsx(
                  'block w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 text-base',
                  'focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none',
                  'bg-white text-gray-900 placeholder-gray-500',
                )}
              />
            </div>

            {/* Extension Dropdown */}
            <select
              value={selectedExtension}
              onChange={(e) => setSelectedExtension(e.target.value)}
              className={clsx(
                'rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900',
                'focus:border-transparent focus:ring-2 focus:ring-purple-500 focus:outline-none',
                'min-w-[100px]',
              )}
            >
              <option value=".net">.net</option>
              <option value=".com">.com</option>
              <option value=".org">.org</option>
              <option value=".info">.info</option>
              <option value=".biz">.biz</option>
            </select>

            {/* Search Button */}
            <Button
              className={clsx(
                'bg-purple-600 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500',
                'rounded-lg px-8 py-3 text-base font-medium text-white',
                'transition-colors duration-200',
              )}
            >
              Search
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Extension
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Registration
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Renewal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Transfer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  ID Protection
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExtensions.map((extension, index) => (
                <tr
                  key={extension.extension}
                  className={clsx(
                    'transition-colors hover:bg-gray-50',
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50',
                  )}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {extension.extension}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {extension.registration}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {extension.renewal}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {extension.transfer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {extension.idProtection}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Show more button if needed */}
        {filteredExtensions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No extensions found matching your search.
            </p>
          </div>
        )}
      </Container>
    </div>
  )
}
