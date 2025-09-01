'use client'

import LoadingSpinner from '@/components/dashboard/loading-spinner'
import type { HostingPackage, HostingProject } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { cn, formatRelativeTime, getStatusColor } from '@/lib/utils'
import { Menu, Transition } from '@headlessui/react'
import {
  CheckCircleIcon,
  ClockIcon,
  CodeBracketIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  PlusIcon,
  ServerIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'

export default function HostingPage() {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  const [projects, setProjects] = useState<HostingProject[]>([])
  const [packages, setPackages] = useState<HostingPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.rawJwt) return

      try {
        const [projectsData, packagesData] = await Promise.all([
          demoApiProvider.getHostingProjects(
            session.rawJwt,
            undefined,
            session.user?.email,
          ),
          demoApiProvider.getHostingPackages(
            session.rawJwt,
            session.user?.email,
          ),
        ])
        setProjects(projectsData)
        setPackages(packagesData)
      } catch (error) {
        console.error('Failed to fetch hosting data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.rawJwt, session?.user?.email])

  const filteredProjects =
    selectedPackage === 'all'
      ? projects
      : projects.filter((p) => p.hostingPackageId === selectedPackage)

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hosting Projects</h1>
          <p className="text-gray-600">Manage your deployed applications</p>
        </div>
        <div className="mt-4 flex space-x-3 sm:mt-0">
          <Link
            href={`/${lang}/dashboard/hosting/packages`}
            className="border-bg-gray-950 inline-flex items-center justify-center rounded-full border bg-transparent px-4 py-2 text-base font-medium whitespace-nowrap text-gray-950 shadow-md transition-colors hover:bg-gray-800 hover:text-white"
          >
            View Packages
          </Link>
          <Link
            href={`/${lang}/dashboard/hosting/new`}
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
          >
            <PlusIcon className="h-4 w-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Package Filter */}
      {packages.length > 1 && (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedPackage('all')}
            className={cn(
              'rounded-full px-3 py-1 text-sm font-medium transition-colors',
              selectedPackage === 'all'
                ? 'bg-purple-200 text-purple-800'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            )}
          >
            All Projects ({projects.length})
          </button>
          {packages.map((pkg) => (
            <button
              key={pkg._id}
              onClick={() => setSelectedPackage(pkg._id)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-colors',
                selectedPackage === pkg._id
                  ? 'bg-purple-200 text-purple-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
              )}
            >
              {pkg.packageName} (
              {projects.filter((p) => p.hostingPackageId === pkg._id).length})
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              className="rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                      <CodeBracketIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.displayName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {project.projectName}
                      </p>
                    </div>
                  </div>

                  <Menu as="div" className="relative">
                    <Menu.Button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                      <EllipsisHorizontalIcon className="h-5 w-5" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={`/${lang}/dashboard/hosting/${project._id}`}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } group flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                View Project
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={`/${lang}/dashboard/hosting/${project._id}/deployments`}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } group flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                Deployments
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href={`/${lang}/dashboard/hosting/${project._id}/settings`}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } group flex items-center px-4 py-2 text-sm text-gray-700`}
                              >
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Project Status */}
                <div className="mb-4 flex items-center space-x-2">
                  {project.status === 'ready' && (
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  )}
                  {project.status === 'building' && (
                    <ClockIcon className="h-4 w-4 animate-spin text-yellow-500" />
                  )}
                  {project.status === 'error' && (
                    <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      getStatusColor(project.status),
                    )}
                  >
                    {project.status === 'ready'
                      ? 'Ready'
                      : project.status === 'building'
                        ? 'Building'
                        : 'Error'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(project.updatedAt)}
                  </span>
                </div>

                {/* Project Description */}
                {project.description && (
                  <p className="mb-4 text-sm text-gray-600">
                    {project.description}
                  </p>
                )}

                {/* Domains */}
                {project.domains.length > 0 && (
                  <div className="mb-4">
                    <div className="mb-2 flex items-center space-x-1 text-sm text-gray-500">
                      <GlobeAltIcon className="h-4 w-4" />
                      <span>Domains</span>
                    </div>
                    <div className="space-y-1">
                      {project.domains.map((domain, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <a
                            href={`https://${domain.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline"
                          >
                            {domain.domain}
                          </a>
                          <span
                            className={cn(
                              'rounded-full px-2 py-1 text-xs',
                              domain.type === 'production'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-yellow-200 text-yellow-800',
                            )}
                          >
                            {domain.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Repository */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CodeBracketIcon className="h-4 w-4" />
                  <span className="capitalize">
                    {project.repository.provider}
                  </span>
                  <span>•</span>
                  <span>{project.repository.branch}</span>
                </div>
              </div>

              <div className="rounded-b-lg border-t border-gray-200 bg-gray-50 px-6 py-3">
                <Link
                  href={`/${lang}/dashboard/hosting/${project._id}`}
                  className="text-sm text-purple-600 hover:underline"
                >
                  View project →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <ServerIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No projects yet
          </h3>
          <p className="mb-4 text-gray-500">
            Deploy your first project to get started
          </p>
          <Link
            href={`/${lang}/dashboard/hosting/new`}
            className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Create Project</span>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href={`/${lang}/dashboard/hosting/new`}
            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300"
          >
            <PlusIcon className="mb-2 h-6 w-6 text-purple-600" />
            <h3 className="mb-1 font-medium text-gray-900">
              Deploy New Project
            </h3>
            <p className="text-sm text-gray-500">
              Connect a Git repository and deploy
            </p>
          </Link>

          <Link
            href={`/${lang}/dashboard/hosting/packages`}
            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300"
          >
            <ServerIcon className="mb-2 h-6 w-6 text-green-600" />
            <h3 className="mb-1 font-medium text-gray-900">Manage Packages</h3>
            <p className="text-sm text-gray-500">
              View and upgrade hosting plans
            </p>
          </Link>

          <Link
            href={`/${lang}/dashboard/hosting/deployments`}
            className="rounded-lg border border-gray-200 p-4 transition-colors hover:border-purple-300"
          >
            <ClockIcon className="mb-2 h-6 w-6 text-purple-600" />
            <h3 className="mb-1 font-medium text-gray-900">
              Recent Deployments
            </h3>
            <p className="text-sm text-gray-500">View deployment history</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
