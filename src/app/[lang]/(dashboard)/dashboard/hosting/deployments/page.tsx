'use client'

import type { Deployment, HostingProject } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { formatRelativeTime } from '@/lib/utils'
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function DeploymentsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation('dashboard')

  const [projects, setProjects] = useState<HostingProject[]>([])
  const [deployments, setDeployments] = useState<Record<string, Deployment[]>>(
    {},
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.rawJwt) return

      try {
        const projectsData = await demoApiProvider.getHostingProjects(
          session.rawJwt,
          undefined,
          session.user?.email,
        )
        setProjects(projectsData)

        // Fetch deployments for each project
        const deploymentsData: Record<string, Deployment[]> = {}
        for (const project of projectsData) {
          const projectDeployments = await demoApiProvider.getDeployments(
            session.rawJwt,
            project._id,
            session.user?.email,
          )
          deploymentsData[project._id] = projectDeployments
        }
        setDeployments(deploymentsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.rawJwt, session?.user?.email])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'building':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      case 'queued':
        return <ClockIcon className="h-5 w-5 text-gray-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800'
      case 'building':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'queued':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 h-4 w-1/3 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('hostingDeployments.title')}
        </h1>
        <p className="text-gray-600">{t('hostingDeployments.subtitle')}</p>
      </div>

      {/* Projects and Deployments */}
      <div className="space-y-8">
        {projects.map((project) => {
          const projectDeployments = deployments[project._id] || []

          return (
            <div key={project._id} className="space-y-4">
              {/* Project Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {project.displayName}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {project.domains.length > 0 ? (
                      <a
                        href={`https://${project.domains[0].domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-purple-600 hover:underline"
                      >
                        {project.domains[0].domain}
                        <ArrowTopRightOnSquareIcon className="ml-1 h-3 w-3" />
                      </a>
                    ) : (
                      project.projectName
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-800"
                >
                  <PlayIcon className="mr-2 h-4 w-4" />
                  {t('hostingDeployments.newDeployment')}
                </button>
              </div>

              {/* Deployments List */}
              <div className="rounded-lg border border-gray-200 bg-white">
                {projectDeployments.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {projectDeployments.map((deployment) => (
                      <div key={deployment._id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              {getStatusIcon(deployment.status)}
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">
                                    {deployment.source.commitSha?.substring(
                                      0,
                                      7,
                                    ) || t('hostingDeployments.unknown')}
                                  </span>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(deployment.status)}`}
                                  >
                                    {deployment.status}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {deployment.environment}
                                  </span>
                                </div>
                                <p className="mt-1 truncate text-sm text-gray-600">
                                  {deployment.source.commitMessage ||
                                    t('hostingDeployments.noCommitMessage')}
                                </p>
                                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                  <span>
                                    {t('hostingDeployments.by')}{' '}
                                    {deployment.source.author ||
                                      t('hostingDeployments.unknown')}
                                  </span>
                                  <span>
                                    {formatRelativeTime(deployment.createdAt)}
                                  </span>
                                  {deployment.buildDuration && (
                                    <span>
                                      {t('hostingDeployments.builtIn')}{' '}
                                      {Math.round(
                                        deployment.buildDuration / 1000,
                                      )}
                                      s
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {deployment.url && (
                              <a
                                href={deployment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                              >
                                <EyeIcon className="mr-1 h-4 w-4" />
                                {t('hostingDeployments.visit')}
                              </a>
                            )}
                            <button
                              type="button"
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              {t('hostingDeployments.viewLogs')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <PlayIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      {t('hostingDeployments.noDeployments.title')}
                    </h3>
                    <p className="mt-2 text-gray-600">
                      {t('hostingDeployments.noDeployments.description')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {projects.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <PlayIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t('hostingDeployments.noProjects.title')}
          </h3>
          <p className="mt-2 text-gray-600">
            {t('hostingDeployments.noProjects.description')}
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-sm font-medium text-white shadow-md transition-colors hover:bg-gray-800"
          >
            {t('hostingDeployments.noProjects.createProject')}
          </button>
        </div>
      )}
    </div>
  )
}
