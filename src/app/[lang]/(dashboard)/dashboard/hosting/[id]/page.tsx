'use client'

import type { Deployment, HostingProject } from '@/lib/dashboard-api'
import {
  createDeployment,
  getDeployments,
  getHostingProject,
} from '@/lib/dashboard-api'
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

export default function HostingProjectPage() {
  const { data: session } = useSession()
  const params = useParams()
  const projectId = params?.id as string
  const lang = (params?.lang as string) || 'en'
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
          getHostingProject(session.rawJwt, projectId),
          getDeployments(session.rawJwt, projectId),
        ])
        setProject(projectData)
        setDeployments(deploymentsData)
      } catch (error) {
        console.error('Failed to fetch project data:', error)
        // Set mock data for development
        setProject({
          _id: projectId,
          hostingPackageId: 'pkg_1',
          userId: session.user._id,
          projectName: 'my-portfolio',
          displayName: 'My Portfolio',
          description: 'Personal portfolio website built with Next.js',
          repository: {
            provider: 'github',
            url: 'https://github.com/user/my-portfolio',
            branch: 'main',
            autoDeployEnabled: true,
          },
          buildSettings: {
            buildCommand: 'npm run build',
            outputDirectory: 'dist',
            installCommand: 'npm install',
            nodeVersion: '18.x',
          },
          environmentVariables: [
            { key: 'NODE_ENV', value: 'production', environment: 'production' },
            {
              key: 'API_URL',
              value: 'https://api.example.com',
              environment: 'production',
            },
          ],
          domains: [
            {
              domain: 'my-portfolio.dev',
              type: 'production',
              sslEnabled: true,
              createdAt: '2024-01-15T00:00:00Z',
            },
            {
              domain: 'staging-portfolio.vercel.app',
              type: 'preview',
              sslEnabled: true,
              createdAt: '2024-01-15T00:00:00Z',
            },
          ],
          status: 'ready',
          lastDeployment: 'dep_1',
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-12-07T10:30:00Z',
        })

        setDeployments([
          {
            _id: 'dep_1',
            projectId: projectId,
            userId: session.user._id,
            deploymentId: 'dpl_abc123def456',
            status: 'ready',
            environment: 'production',
            source: {
              type: 'git',
              commitSha: 'a55d6ef',
              commitMessage: 'added missing translation',
              branch: 'main',
              author: 'John Doe',
            },
            buildLogs: [],
            buildDuration: 18000,
            buildStartedAt: '2024-12-07T10:30:00Z',
            buildCompletedAt: '2024-12-07T10:30:18Z',
            url: 'https://my-portfolio-abc123.hostjamstack.app',
            domains: ['my-portfolio.dev'],
            analytics: {
              pageViews: 1250,
              uniqueVisitors: 890,
              topPages: ['/'],
            },
            createdAt: '2024-12-07T10:30:00Z',
            updatedAt: '2024-12-07T10:30:18Z',
          },
          {
            _id: 'dep_2',
            projectId: projectId,
            userId: session.user._id,
            deploymentId: 'dpl_def456ghi789',
            status: 'ready',
            environment: 'production',
            source: {
              type: 'git',
              commitSha: '319ee63',
              commitMessage: 'deploying with checkout',
              branch: 'main',
              author: 'John Doe',
            },
            buildLogs: [],
            buildDuration: 15000,
            buildStartedAt: '2024-12-06T09:15:00Z',
            buildCompletedAt: '2024-12-06T09:15:15Z',
            url: 'https://my-portfolio-def456.hostjamstack.app',
            domains: [],
            createdAt: '2024-12-06T09:15:00Z',
            updatedAt: '2024-12-06T09:15:15Z',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.rawJwt, projectId, session?.user._id])

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
    { id: 'overview', name: 'Overview' },
    { id: 'deployments', name: 'Deployments' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'settings', name: 'Settings' },
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
          Project Not Found
        </h1>
        <p className="text-gray-600">
          The requested project could not be found.
        </p>
      </div>
    )
  }

  const latestDeployment = deployments[0]

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
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

          <div className="flex items-center space-x-3">
            <a
              href={project.repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-bg-gray-950 inline-flex items-center justify-center gap-2 rounded-full border bg-transparent px-4 py-2 text-base font-medium whitespace-nowrap text-gray-950 shadow-md transition-colors hover:bg-gray-800 hover:text-white"
            >
              <CodeBracketIcon className="h-4 w-4" />
              <span>Repository</span>
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            </a>
            <button
              onClick={handleDeploy}
              disabled={deploying}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
            >
              <PlayIcon className="h-4 w-4" />
              <span>{deploying ? 'Deploying...' : 'Deploy'}</span>
            </button>
          </div>
        </div>

        {/* Production Deployment Info */}
        {latestDeployment && (
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Production Deployment
              </h3>
              <div className="flex items-center space-x-3">
                <button className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                  Build Logs
                </button>
                <button className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                  Runtime Logs
                </button>
                <button className="rounded border border-gray-300 bg-white px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-2 text-sm text-gray-500">Deployment</div>
                <div className="font-mono text-lg text-gray-900">
                  {project.projectName}-
                  {latestDeployment.deploymentId.slice(-8)}
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm text-gray-500">Domains</div>
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
                <div className="mb-2 text-sm text-gray-500">Status</div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span className="text-gray-900">Ready</span>
                  <span className="text-sm text-gray-500">
                    {formatRelativeTime(latestDeployment.createdAt)} by{' '}
                    {latestDeployment.source.author}
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-2 text-sm text-gray-500">Source</div>
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
              To update your Production Deployment, push to the{' '}
              <span className="rounded bg-gray-200 px-1 font-mono">
                {project.repository.branch}
              </span>{' '}
              branch.
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
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
                  Recent Deployments
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
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    Environment Variables
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.environmentVariables.length} variables
                  </div>
                </button>
                <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    Custom Domains
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.domains.length} domain
                    {project.domains.length !== 1 ? 's' : ''}
                  </div>
                </button>
                <button className="w-full rounded-lg p-3 text-left transition-colors hover:bg-gray-50">
                  <div className="font-medium text-gray-900">
                    Build Settings
                  </div>
                  <div className="text-sm text-gray-500">
                    Node.js {project.buildSettings.nodeVersion}
                  </div>
                </button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">Bandwidth</span>
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
                    <span className="text-gray-600">Build Time</span>
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
                All Deployments
              </h3>
              <div className="flex space-x-2">
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900">
                  <option>All Branches</option>
                  <option>main</option>
                </select>
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm text-gray-900">
                  <option>All Environments</option>
                  <option>Production</option>
                  <option>Preview</option>
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
          <h3 className="mb-4 text-lg font-medium text-gray-900">Analytics</h3>
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-400">
              <span className="font-bold text-white">📊</span>
            </div>
            <h4 className="mb-2 text-lg font-medium text-gray-900">
              Analytics Coming Soon
            </h4>
            <p className="text-gray-500">
              Track visitors and page views for your deployment
            </p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Project Settings
            </h3>
            <p className="text-gray-500">
              Project settings will be implemented in the next phase
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
