'use client'

import {
  ArrowRightIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  CodeBracketIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const frameworks = [
  {
    id: 'nextjs',
    name: 'Next.js',
    descriptionKey: 'nextjs',
    icon: '⚛️',
    buildCommand: 'npm run build',
    outputDirectory: '.next',
    installCommand: 'npm install',
  },
  {
    id: 'react',
    name: 'React',
    descriptionKey: 'react',
    icon: '⚛️',
    buildCommand: 'npm run build',
    outputDirectory: 'build',
    installCommand: 'npm install',
  },
  {
    id: 'vue',
    name: 'Vue.js',
    descriptionKey: 'vue',
    icon: '💚',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
  },
  {
    id: 'vite',
    name: 'Vite',
    descriptionKey: 'vite',
    icon: '⚡',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
  },
  {
    id: 'astro',
    name: 'Astro',
    descriptionKey: 'astro',
    icon: '🚀',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    installCommand: 'npm install',
  },
  {
    id: 'hugo',
    name: 'Hugo',
    descriptionKey: 'hugo',
    icon: '⚡',
    buildCommand: 'hugo',
    outputDirectory: 'public',
    installCommand: '',
  },
  {
    id: 'gatsby',
    name: 'Gatsby',
    descriptionKey: 'gatsby',
    icon: '🔷',
    buildCommand: 'npm run build',
    outputDirectory: 'public',
    installCommand: 'npm install',
  },
  {
    id: 'svelte',
    name: 'SvelteKit',
    descriptionKey: 'svelte',
    icon: '🧡',
    buildCommand: 'npm run build',
    outputDirectory: 'build',
    installCommand: 'npm install',
  },
]

export default function NewHostingProjectPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'
  const { t } = useTranslation('dashboard')

  const [step, setStep] = useState(1)
  const [selectedFramework, setSelectedFramework] = useState<string | null>(
    null,
  )
  const [repoUrl, setRepoUrl] = useState('')
  const [projectName, setProjectName] = useState('')
  const [buildSettings, setBuildSettings] = useState({
    buildCommand: '',
    outputDirectory: '',
    installCommand: '',
  })

  const handleFrameworkSelect = (frameworkId: string) => {
    const framework = frameworks.find((f) => f.id === frameworkId)
    if (framework) {
      setSelectedFramework(frameworkId)
      setBuildSettings({
        buildCommand: framework.buildCommand,
        outputDirectory: framework.outputDirectory,
        installCommand: framework.installCommand,
      })
    }
  }

  const handleDeploy = () => {
    // Simulate deployment process
    router.push(`/${lang}/dashboard/hosting`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('newHostingProject.title')}
        </h1>
        <p className="text-gray-600">{t('newHostingProject.subtitle')}</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {[
          {
            step: 1,
            name: t('newHostingProject.steps.importRepository'),
            active: step >= 1,
          },
          {
            step: 2,
            name: t('newHostingProject.steps.configure'),
            active: step >= 2,
          },
          {
            step: 3,
            name: t('newHostingProject.steps.deploy'),
            active: step >= 3,
          },
        ].map((s, index) => (
          <div key={s.step} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                s.active
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s.step}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                s.active ? 'text-purple-600' : 'text-gray-500'
              }`}
            >
              {s.name}
            </span>
            {index < 2 && (
              <ArrowRightIcon className="ml-4 h-4 w-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Import Repository */}
      {step === 1 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-6 text-lg font-medium text-gray-900">
            {t('newHostingProject.importRepo.title')}
          </h3>

          <div className="mb-6">
            <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-900">
                <CodeBracketIcon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {t('newHostingProject.importRepo.github')}
                </h4>
                <p className="text-sm text-gray-500">
                  {t('newHostingProject.importRepo.githubDescription')}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
              >
                {t('newHostingProject.importRepo.connectGithub')}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="repoUrl"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t('newHostingProject.importRepo.repositoryUrl')}
              </label>
              <input
                type="url"
                id="repoUrl"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder={t(
                  'newHostingProject.importRepo.repositoryPlaceholder',
                )}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('newHostingProject.importRepo.repositoryHelp')}
              </p>
            </div>

            <div>
              <label
                htmlFor="projectName"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                {t('newHostingProject.importRepo.projectName')}
              </label>
              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder={t(
                  'newHostingProject.importRepo.projectNamePlaceholder',
                )}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!repoUrl || !projectName}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {t('newHostingProject.importRepo.continue')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Framework Selection */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              {t('newHostingProject.configure.chooseFramework')}
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {frameworks.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => handleFrameworkSelect(framework.id)}
                  className={`flex items-start space-x-3 rounded-lg border p-4 text-left transition-colors ${
                    selectedFramework === framework.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{framework.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900">
                      {framework.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {t(
                        `newHostingProject.frameworks.${framework.descriptionKey}`,
                      )}
                    </p>
                  </div>
                  {selectedFramework === framework.id && (
                    <CheckCircleIcon className="h-5 w-5 flex-shrink-0 text-purple-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Build Settings */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-6 text-lg font-medium text-gray-900">
              {t('newHostingProject.configure.buildSettings')}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('newHostingProject.configure.buildCommand')}
                </label>
                <input
                  type="text"
                  value={buildSettings.buildCommand}
                  onChange={(e) =>
                    setBuildSettings((prev) => ({
                      ...prev,
                      buildCommand: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('newHostingProject.configure.outputDirectory')}
                </label>
                <input
                  type="text"
                  value={buildSettings.outputDirectory}
                  onChange={(e) =>
                    setBuildSettings((prev) => ({
                      ...prev,
                      outputDirectory: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {t('newHostingProject.configure.installCommand')}
                </label>
                <input
                  type="text"
                  value={buildSettings.installCommand}
                  onChange={(e) =>
                    setBuildSettings((prev) => ({
                      ...prev,
                      installCommand: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-base font-medium whitespace-nowrap text-gray-700 shadow-md transition-colors hover:bg-gray-50"
              >
                {t('newHostingProject.configure.back')}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedFramework}
                className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {t('newHostingProject.configure.deploy')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Deploy */}
      {step === 3 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto mb-4 h-12 w-12 text-purple-600" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {t('newHostingProject.deployment.title')}
            </h3>
            <p className="mb-6 text-gray-500">
              {t('newHostingProject.deployment.description')}
            </p>

            <div className="mb-6 space-y-2">
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  {t('newHostingProject.deployment.repositoryCloned')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-700">
                  {t('newHostingProject.deployment.dependenciesInstalled')}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-600 border-t-transparent"></div>
                <span className="text-sm text-gray-700">
                  {t('newHostingProject.deployment.buildingProject')}
                </span>
              </div>
            </div>

            <button
              onClick={handleDeploy}
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800"
            >
              {t('newHostingProject.deployment.viewProject')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
