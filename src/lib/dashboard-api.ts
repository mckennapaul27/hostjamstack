import { fetchWithToken } from '@/utils/config'

// Types based on the database schema
export interface Domain {
  _id: string
  domainName: string
  userId: string
  registrationDate: string
  expirationDate: string
  autoRenew: boolean
  registrationPeriod: number
  isPremium: boolean
  status: 'active' | 'pending' | 'expired' | 'suspended' | 'transferred'
  registrar: string
  registrarDomainId: string
  nameservers: string[]
  useDefaultNameservers: boolean
  purchasePrice: number
  renewalPrice: number
  currency: string
  whoisPrivacy: boolean
  transferLock: boolean
  createdAt: string
  updatedAt: string
}

export interface DNSRecord {
  _id: string
  domainId: string
  userId: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SRV' | 'PTR'
  name: string
  value: string
  ttl: number
  priority?: number
  isActive: boolean
  isSystemRecord: boolean
  createdAt: string
  updatedAt: string
}

export interface HostingPackage {
  _id: string
  userId: string
  packageName: string
  packageType: 'shared' | 'vps' | 'dedicated' | 'serverless'
  status: 'active' | 'suspended' | 'cancelled' | 'pending'
  storage: number
  bandwidth: number
  databases: number
  emailAccounts: number
  subdomains: number
  features: string[]
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  autoRenew: boolean
  currentUsage: {
    storage: number
    bandwidth: number
    databases: number
    emailAccounts: number
  }
  serverLocation: string
  serverIp: string
  controlPanelUrl: string
  createdAt: string
  updatedAt: string
}

export interface HostingProject {
  _id: string
  hostingPackageId: string
  userId: string
  projectName: string
  displayName: string
  description: string
  repository: {
    provider: 'github' | 'gitlab' | 'bitbucket'
    url: string
    branch: string
    autoDeployEnabled: boolean
  }
  buildSettings: {
    buildCommand: string
    outputDirectory: string
    installCommand: string
    nodeVersion: string
  }
  environmentVariables: Array<{
    key: string
    value: string
    environment: 'production' | 'preview' | 'development'
  }>
  domains: Array<{
    domain: string
    type: 'production' | 'preview'
    sslEnabled: boolean
    createdAt: string
  }>
  status: 'ready' | 'building' | 'error' | 'disabled'
  lastDeployment: string
  createdAt: string
  updatedAt: string
}

export interface Deployment {
  _id: string
  projectId: string
  userId: string
  deploymentId: string
  status: 'building' | 'ready' | 'error' | 'cancelled'
  environment: 'production' | 'preview'
  source: {
    type: 'git' | 'upload'
    commitSha: string
    commitMessage: string
    branch: string
    author: string
  }
  buildLogs: string[]
  buildDuration: number
  buildStartedAt: string
  buildCompletedAt: string
  url: string
  domains: string[]
  analytics?: {
    pageViews: number
    uniqueVisitors: number
    topPages: string[]
  }
  createdAt: string
  updatedAt: string
}

export interface SupportPackage {
  _id: string
  userId: string
  packageName: string
  packageType: 'basic' | 'priority' | 'enterprise'
  status: 'active' | 'expired' | 'cancelled'
  features: string[]
  monthlyTickets: number
  responseTimeGuarantee: number
  supportChannels: string[]
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  autoRenew: boolean
  currentUsage: {
    ticketsUsed: number
    hoursUsed: number
    resetDate: string
  }
  createdAt: string
  updatedAt: string
}

export interface SupportTicket {
  _id: string
  userId: string
  supportPackageId?: string
  ticketNumber: string
  subject: string
  description: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed'
  category: 'technical' | 'billing' | 'general' | 'migration'
  subcategory: string
  assignedTo?: string
  assignedAt?: string
  firstResponseAt?: string
  lastResponseAt?: string
  resolvedAt?: string
  slaBreached: boolean
  relatedDomains: string[]
  relatedHostingPackages: string[]
  createdAt: string
  updatedAt: string
}

export interface SupportMessage {
  _id: string
  ticketId: string
  userId?: string
  content: string
  messageType: 'reply' | 'note' | 'status_change'
  isFromCustomer: boolean
  attachments: Array<{
    filename: string
    fileSize: number
    mimeType: string
    url: string
  }>
  staffInfo?: {
    name: string
    role: string
    department: string
  }
  statusChange?: {
    from: string
    to: string
  }
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  _id: string
  email: string
  firstName: string
  lastName: string
  emailVerified: boolean
  profile: {
    company?: string
    phone?: string
    timezone: string
    language: string
  }
  billing: {
    defaultPaymentMethod?: string
    billingAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  isActive: boolean
  role: 'user' | 'admin' | 'support'
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
}

// Dashboard API Functions

// Profile
export const getUserProfile = async (jwt: string): Promise<UserProfile> => {
  return fetchWithToken('/api/users/profile', jwt)
}

export const updateUserProfile = async (
  jwt: string,
  data: Partial<UserProfile>,
): Promise<UserProfile> => {
  const response = await fetch('/api/users/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(data),
  })
  return response.json()
}

// Domains
export const getUserDomains = async (jwt: string): Promise<Domain[]> => {
  return fetchWithToken('/api/domains', jwt)
}

export const getDomainById = async (
  jwt: string,
  domainId: string,
): Promise<Domain> => {
  return fetchWithToken(`/api/domains/${domainId}`, jwt)
}

export const searchDomains = async (
  jwt: string,
  query: string,
): Promise<{ available: boolean; price: number }[]> => {
  return fetchWithToken(
    `/api/domains/search?q=${encodeURIComponent(query)}`,
    jwt,
  )
}

export const purchaseDomain = async (
  jwt: string,
  domain: string,
  years: number,
): Promise<{ orderId: string }> => {
  const response = await fetch('/api/domains/purchase', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ domain, years }),
  })
  return response.json()
}

export const updateDomainSettings = async (
  jwt: string,
  domainId: string,
  settings: Partial<Domain>,
): Promise<Domain> => {
  const response = await fetch(`/api/domains/${domainId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(settings),
  })
  return response.json()
}

// DNS Records
export const getDNSRecords = async (
  jwt: string,
  domainId: string,
): Promise<DNSRecord[]> => {
  return fetchWithToken(`/api/dns-records?domainId=${domainId}`, jwt)
}

export const createDNSRecord = async (
  jwt: string,
  record: Omit<DNSRecord, '_id' | 'userId' | 'createdAt' | 'updatedAt'>,
): Promise<DNSRecord> => {
  const response = await fetch('/api/dns-records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(record),
  })
  return response.json()
}

export const updateDNSRecord = async (
  jwt: string,
  recordId: string,
  record: Partial<DNSRecord>,
): Promise<DNSRecord> => {
  const response = await fetch(`/api/dns-records/${recordId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(record),
  })
  return response.json()
}

export const deleteDNSRecord = async (
  jwt: string,
  recordId: string,
): Promise<void> => {
  await fetch(`/api/dns-records/${recordId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
}

// Hosting
export const getHostingPackages = async (
  jwt: string,
): Promise<HostingPackage[]> => {
  return fetchWithToken('/api/hosting/packages', jwt)
}

export const getHostingProjects = async (
  jwt: string,
  packageId?: string,
): Promise<HostingProject[]> => {
  const url = packageId
    ? `/api/hosting/projects?packageId=${packageId}`
    : '/api/hosting/projects'
  return fetchWithToken(url, jwt)
}

export const getHostingProject = async (
  jwt: string,
  projectId: string,
): Promise<HostingProject> => {
  return fetchWithToken(`/api/hosting/projects/${projectId}`, jwt)
}

export const createHostingProject = async (
  jwt: string,
  project: Omit<
    HostingProject,
    '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'lastDeployment'
  >,
): Promise<HostingProject> => {
  const response = await fetch('/api/hosting/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(project),
  })
  return response.json()
}

export const updateHostingProject = async (
  jwt: string,
  projectId: string,
  project: Partial<HostingProject>,
): Promise<HostingProject> => {
  const response = await fetch(`/api/hosting/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(project),
  })
  return response.json()
}

export const deleteHostingProject = async (
  jwt: string,
  projectId: string,
): Promise<void> => {
  await fetch(`/api/hosting/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
}

// Deployments
export const getDeployments = async (
  jwt: string,
  projectId: string,
): Promise<Deployment[]> => {
  return fetchWithToken(`/api/hosting/deployments?projectId=${projectId}`, jwt)
}

export const getDeployment = async (
  jwt: string,
  deploymentId: string,
): Promise<Deployment> => {
  return fetchWithToken(`/api/hosting/deployments/${deploymentId}`, jwt)
}

export const createDeployment = async (
  jwt: string,
  projectId: string,
): Promise<Deployment> => {
  const response = await fetch('/api/hosting/deployments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({ projectId }),
  })
  return response.json()
}

// Support
export const getSupportPackages = async (
  jwt: string,
): Promise<SupportPackage[]> => {
  return fetchWithToken('/api/support/packages', jwt)
}

export const getSupportTickets = async (
  jwt: string,
  packageId?: string,
): Promise<SupportTicket[]> => {
  const url = packageId
    ? `/api/support/tickets?packageId=${packageId}`
    : '/api/support/tickets'
  return fetchWithToken(url, jwt)
}

export const getSupportTicket = async (
  jwt: string,
  ticketId: string,
): Promise<SupportTicket> => {
  return fetchWithToken(`/api/support/tickets/${ticketId}`, jwt)
}

export const createSupportTicket = async (
  jwt: string,
  ticket: Omit<
    SupportTicket,
    | '_id'
    | 'userId'
    | 'ticketNumber'
    | 'assignedTo'
    | 'assignedAt'
    | 'firstResponseAt'
    | 'lastResponseAt'
    | 'resolvedAt'
    | 'slaBreached'
    | 'createdAt'
    | 'updatedAt'
  >,
): Promise<SupportTicket> => {
  const response = await fetch('/api/support/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(ticket),
  })
  return response.json()
}

export const getSupportMessages = async (
  jwt: string,
  ticketId: string,
): Promise<SupportMessage[]> => {
  return fetchWithToken(`/api/support/messages?ticketId=${ticketId}`, jwt)
}

export const createSupportMessage = async (
  jwt: string,
  message: Omit<SupportMessage, '_id' | 'userId' | 'createdAt' | 'updatedAt'>,
): Promise<SupportMessage> => {
  const response = await fetch('/api/support/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(message),
  })
  return response.json()
}

// Dashboard Overview
export const getDashboardOverview = async (
  jwt: string,
): Promise<{
  domains: Domain[]
  recentActivity: Array<{
    type: 'domain' | 'hosting' | 'support'
    message: string
    timestamp: string
  }>
  alerts: Array<{
    type: 'warning' | 'error' | 'info'
    message: string
    action?: string
  }>
}> => {
  return fetchWithToken('/api/dashboard/overview', jwt)
}
