'use client'

import type { Deployment, HostingProject } from '@/lib/dashboard-api'
import { createDeployment } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
import { cn, formatRelativeTime } from '@/lib/utils'
import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ClockIcon,
  CodeBracketIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  GlobeAltIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function HostingProjectPage() {
  const { data: session } = useSession()
  const params = useParams()
  const projectId = params?.id as string
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation('dashboard')
  console.log('lang in hosting/[id] page', lang)

  const [project, setProject] = useState<HostingProject | null>(null)
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [deploying, setDeploying] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.rawJwt || !projectId) return

      try {
        const [projectData, deploymentsData] = await Promise.all([
          demoApiProvider.getHostingProject(
            session.rawJwt,
            projectId,
            session.user?.email,
          ),
          demoApiProvider.getDeployments(
            session.rawJwt,
            projectId,
            session.user?.email,
          ),
        ])
        setProject(projectData)
        setDeployments(deploymentsData)
      } catch (error) {
        console.error('Failed to fetch project data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.rawJwt, projectId, session?.user?.email])

  const handleDeploy = async () => {
    if (!session?.rawJwt || !project) return

    setDeploying(true)
    try {
      const newDeployment = await createDeployment(session.rawJwt, project._id)
      setDeployments([newDeployment, ...deployments])
    } catch (error) {
      console.error('Failed to create deployment:', error)
    } finally {
      setDeploying(false)
    }
  }

  const tabs = [
    { id: 'overview', name: t('hostingDetail.tabs.overview') },
    { id: 'deployments', name: t('hostingDetail.tabs.deployments') },
    { id: 'analytics', name: t('hostingDetail.tabs.analytics') },
    { id: 'settings', name: t('hostingDetail.tabs.settings') },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200"></div>
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
            <div className="h-4 w-1/3 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          {t('hostingDetail.notFound.title')}
        </h1>
        <p className="text-gray-600">{t('hostingDetail.notFound.message')}</p>
      </div>
    )
  }

  const latestDeployment = deployments[0]

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 sm:flex">
              <CodeBracketIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {project.displayName}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{project.projectName}</span>
                <span>•</span>
                <span className="capitalize">
                  {project.repository.provider}
                </span>
                <span>•</span>
                <span>{project.repository.branch}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex space-x-3 sm:mt-0">
            <a
              href={project.repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-bg-gray-950 inline-flex items-center justify-center gap-2 rounded-full border bg-transparent px-4 py-2 text-base font-medium whitespace-nowrap text-gray-950 shadow-md transition-colors hover:bg-gray-800 hover:text-white"
            >
              <CodeBracketIcon className="h-4 w-4" />
              <span>{t('hostingDetail.repository')}</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
            >
              <PlayIcon className="h-4 w-4" />
              <span>
                {deploying
                  ? t('hostingDetail.deploying')
                  : t('hostingDetail.deploy')}
              </span>
            </button>
          </div>
        </div>

        {/* Production Deployment Info */}
        {latestDeployment && (
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('hostingDetail.productionDeployment.title')}
              </h3>
              <div className="mt-4 flex flex-col gap-2 space-x-3 sm:mt-0 sm:flex-row sm:items-center sm:justify-between">
                <button className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                  {t('hostingDetail.productionDeployment.buildLogs')}
                </button>
                <button className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                  {t('hostingDetail.productionDeployment.runtimeLogs')}
                </button>
                <button className="max-w-fit rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm text-gray-500">
                  {t('hostingDetail.productionDeployment.deployment')}
                </div>
                <div className="font-mono text-lg text-gray-900">
                  {project.projectName}-
                  {latestDeployment.deploymentId.slice(-8)}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm text-gray-500">
                  {t('hostingDetail.productionDeployment.domains')}
                </div>
                <div className="space-y-1">
                  {project.domains.map((domain, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <a
                        href={`https://${domain.domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {domain.domain}
                      </a>
                      <ArrowTopRightOnSquareIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm text-gray-500">
                  {t('hostingDetail.productionDeployment.status')}
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-gray-900">
                    {t('hostingDetail.productionDeployment.ready')}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(latestDeployment.createdAt)} by{' '}
                    {latestDeployment.source.author}
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm text-gray-500">
                  {t('hostingDetail.productionDeployment.source')}
                </div>
                <div className="flex items-center space-x-2">
                  <CodeBracketIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-mono text-gray-900">
                    {latestDeployment.source.commitSha}
                  </span>
                  <span className="text-sm text-gray-500">
                    {latestDeployment.source.commitMessage}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              {t('hostingDetail.productionDeployment.updateInfo')}{' '}
              <span className="rounded bg-gray-200 px-1 font-mono">
                {project.repository.branch}
              </span>{' '}
              {t('hostingDetail.productionDeployment.branch')}.
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex flex-col space-x-8 sm:flex-row">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`!mr-0 border-b-2 px-1 py-2 text-sm font-medium sm:!mr-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Recent Deployments */}
            <div className="rounded-lg border border-gray-200 bg-white">
              <div className="border-b border-gray-200 px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('hostingDetail.overview.recentDeployments')}
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {deployments.slice(0, 5).map((deployment) => (
                  <div key={deployment._id} className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          {deployment.status === 'ready' && (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          )}
                          {deployment.status === 'building' && (
                            <ClockIcon className="h-4 w-4 text-yellow-500" />
                          )}
                          {deployment.status === 'error' && (
                            <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {deployment.source.branch}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(deployment.createdAt)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {Math.round(deployment.buildDuration / 1000)}s
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-mono text-gray-600">
                        {deployment.source.commitSha}
                      </span>
                      <span className="text-gray-900">
                        {deployment.source.commitMessage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Project Settings Quick Access */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('hostingDetail.overview.quickActions')}
              </h3>
              <div className="space-y-3">
                <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    {t('hostingDetail.overview.environmentVariables')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.environmentVariables.length}{' '}
                    {t('hostingDetail.overview.variables')}
                  </div>
                </button>
                <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    {t('hostingDetail.overview.customDomains')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.domains.length}{' '}
                    {project.domains.length !== 1
                      ? t('hostingDetail.overview.domains')
                      : t('hostingDetail.overview.domain')}
                  </div>
                </button>
                <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    {t('hostingDetail.overview.buildSettings')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Node.js {project.buildSettings.nodeVersion}
                  </div>
                </button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                {t('hostingDetail.overview.usage')}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t('hostingDetail.overview.bandwidth')}
                    </span>
                    <span className="text-gray-900">2.1 GB / 10 GB</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: '21%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t('hostingDetail.overview.buildTime')}
                    </span>
                    <span className="text-gray-900">45 min / 100 min</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600"
                      style={{ width: '45%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deployments' && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('hostingDetail.deployments.title')}
              </h3>
              <div className="flex space-x-2">
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900">
                  <option>{t('hostingDetail.deployments.allBranches')}</option>
                  <option>{t('hostingDetail.deployments.main')}</option>
                </select>
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900">
                  <option>
                    {t('hostingDetail.deployments.allEnvironments')}
                  </option>
                  <option>{t('hostingDetail.deployments.production')}</option>
                  <option>{t('hostingDetail.deployments.preview')}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {deployments.map((deployment) => (
              <div key={deployment._id} className="p-6 hover:bg-gray-50">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {deployment.status === 'ready' && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                      {deployment.status === 'building' && (
                        <ClockIcon className="h-5 w-5 text-yellow-500" />
                      )}
                      {deployment.status === 'error' && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium text-gray-900">
                        {deployment.source.branch}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-1 text-xs font-medium',
                          deployment.environment === 'production'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800',
                        )}
                      >
                        {deployment.environment}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{Math.round(deployment.buildDuration / 1000)}s</span>
                    <span>{formatRelativeTime(deployment.createdAt)}</span>
                    <button className="text-purple-600 hover:underline">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-2 flex items-center space-x-2 text-sm">
                  <span className="font-mono text-gray-600">
                    {deployment.source.commitSha}
                  </span>
                  <span className="text-gray-900">
                    {deployment.source.commitMessage}
                  </span>
                </div>
                {deployment.domains.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                    {deployment.domains.map((domain, index) => (
                      <a
                        key={index}
                        href={`https://${domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {domain}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            {t('hostingDetail.analytics.title')}
          </h3>
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-400">
              <span className="font-bold text-white">📊</span>
            </div>
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              {t('hostingDetail.analytics.comingSoon')}
            </h4>
            <p className="text-gray-500">
              {t('hostingDetail.analytics.description')}
            </p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {t('hostingDetail.settings.environmentVariables.title')}
              </h3>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                {t('hostingDetail.settings.environmentVariables.addVariable')}
              </button>
            </div>

            {project?.environmentVariables &&
            project.environmentVariables.length > 0 ? (
              <div className="space-y-3">
                {project.environmentVariables.map((envVar, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium text-gray-900">
                          {envVar.key}
                        </span>
                        <span className="text-gray-500">•••••••••</span>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {envVar.environment}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-sm text-gray-600 hover:text-gray-900">
                        {t('hostingDetail.settings.environmentVariables.edit')}
                      </button>
                      <button className="text-sm text-red-600 hover:text-red-900">
                        {t(
                          'hostingDetail.settings.environmentVariables.delete',
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-400">
                  <span className="font-bold text-white">ENV</span>
                </div>
                <h4 className="mb-2 text-lg font-medium text-gray-900">
                  {t('hostingDetail.settings.environmentVariables.noVariables')}
                </h4>
                <p className="text-gray-500">
                  {t('hostingDetail.settings.environmentVariables.description')}
                </p>
              </div>
            )}
          </div>

          {/* Project Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              {t('hostingDetail.settings.projectConfiguration.title')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t(
                    'hostingDetail.settings.projectConfiguration.buildCommand',
                  )}
                </label>
                <input
                  type="text"
                  value={project?.buildSettings.buildCommand || ''}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t(
                    'hostingDetail.settings.projectConfiguration.outputDirectory',
                  )}
                </label>
                <input
                  type="text"
                  value={project?.buildSettings.outputDirectory || ''}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t(
                    'hostingDetail.settings.projectConfiguration.installCommand',
                  )}
                </label>
                <input
                  type="text"
                  value={project?.buildSettings.installCommand || ''}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('hostingDetail.settings.projectConfiguration.nodeVersion')}
                </label>
                <input
                  type="text"
                  value={project?.buildSettings.nodeVersion || ''}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
