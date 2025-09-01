import {
  type Deployment,
  type DNSRecord,
  type Domain,
  type HostingPackage,
  type HostingProject,
  type SupportMessage,
  type SupportPackage,
  type SupportTicket,
  type UserProfile,
} from './dashboard-api'

// Demo user credentials
export const DEMO_USER_EMAIL = 'demo.user@example.com'

// Helper function to check if user is demo user
export const isDemoUser = (userEmail?: string): boolean => {
  return userEmail === DEMO_USER_EMAIL
}

// Demo User Profile
export const demoUserProfile: UserProfile = {
  _id: '67f8a2c1b4e9d3f1a2b3c000',
  email: DEMO_USER_EMAIL,
  firstName: 'Alex',
  lastName: 'Johnson',
  emailVerified: true,
  profile: {
    company: 'Demo Corp',
    phone: '+1-555-123-4567',
    timezone: 'UTC',
    language: 'en',
  },
  billing: {
    defaultPaymentMethod: 'pm_demo123',
    billingAddress: {
      street: '123 Demo Street',
      city: 'Demo City',
      state: 'DC',
      zipCode: '12345',
      country: 'US',
    },
  },
  isActive: true,
  role: 'user',
  twoFactorEnabled: false,
  createdAt: '2025-08-01T09:00:00Z',
  updatedAt: '2025-08-30T14:30:00Z',
}

// Demo Domains
export const demoDomains: Domain[] = [
  {
    _id: '67f8a2c1b4e9d3f1a2b3c4d5',
    domainName: 'javaletingdetailing.com',
    userId: '67f8a2c1b4e9d3f1a2b3c000',
    registrationDate: '2025-08-08T10:00:00Z',
    expirationDate: '2026-08-08T10:00:00Z',
    autoRenew: true,
    registrationPeriod: 1,
    isPremium: false,
    status: 'active',
    registrar: 'name.com',
    registrarDomainId: 'nd_javaletingdetailing_com_123',
    nameservers: ['ns1.hostjamstack.com', 'ns2.hostjamstack.com'],
    useDefaultNameservers: true,
    purchasePrice: 12.99,
    renewalPrice: 14.99,
    currency: 'EUR',
    whoisPrivacy: true,
    transferLock: true,
    createdAt: '2025-08-08T10:00:00Z',
    updatedAt: '2025-08-08T10:00:00Z',
  },
  {
    _id: '67f8a2c1b4e9d3f1a2b3c4d6',
    domainName: 'obrierry.co.uk',
    userId: '67f8a2c1b4e9d3f1a2b3c000',
    registrationDate: '2025-08-15T14:30:00Z',
    expirationDate: '2026-08-15T14:30:00Z',
    autoRenew: true,
    registrationPeriod: 1,
    isPremium: false,
    status: 'active',
    registrar: 'name.com',
    registrarDomainId: 'nd_obrierry_co_uk_456',
    nameservers: ['ns1.hostjamstack.com', 'ns2.hostjamstack.com'],
    useDefaultNameservers: true,
    purchasePrice: 12.99,
    renewalPrice: 14.99,
    currency: 'EUR',
    whoisPrivacy: true,
    transferLock: true,
    createdAt: '2025-08-15T14:30:00Z',
    updatedAt: '2025-08-15T14:30:00Z',
  },
]

// Demo DNS Records
export const demoDNSRecords: Record<string, DNSRecord[]> = {
  '67f8a2c1b4e9d3f1a2b3c4d5': [
    {
      _id: 'dns_67f8a2c1b4e9d3f1a2b3c4d5_1',
      domainId: '67f8a2c1b4e9d3f1a2b3c4d5',
      userId: '67f8a2c1b4e9d3f1a2b3c000',
      type: 'A',
      name: '@',
      value: '192.0.2.1',
      ttl: 3600,
      isActive: true,
      isSystemRecord: false,
      createdAt: '2025-08-08T11:00:00Z',
      updatedAt: '2025-08-08T11:00:00Z',
    },
    {
      _id: 'dns_67f8a2c1b4e9d3f1a2b3c4d5_2',
      domainId: '67f8a2c1b4e9d3f1a2b3c4d5',
      userId: '67f8a2c1b4e9d3f1a2b3c000',
      type: 'CNAME',
      name: 'www',
      value: '78fa8c34050d47b0.hostjamstack-dns-016.com',
      ttl: 3600,
      isActive: true,
      isSystemRecord: false,
      createdAt: '2025-08-08T11:00:00Z',
      updatedAt: '2025-08-08T11:00:00Z',
    },
  ],
  '67f8a2c1b4e9d3f1a2b3c4d6': [
    {
      _id: 'dns_67f8a2c1b4e9d3f1a2b3c4d6_1',
      domainId: '67f8a2c1b4e9d3f1a2b3c4d6',
      userId: '67f8a2c1b4e9d3f1a2b3c000',
      type: 'A',
      name: '@',
      value: '192.0.2.2',
      ttl: 3600,
      isActive: true,
      isSystemRecord: false,
      createdAt: '2025-08-15T15:00:00Z',
      updatedAt: '2025-08-15T15:00:00Z',
    },
    {
      _id: 'dns_67f8a2c1b4e9d3f1a2b3c4d6_2',
      domainId: '67f8a2c1b4e9d3f1a2b3c4d6',
      userId: '67f8a2c1b4e9d3f1a2b3c000',
      type: 'CNAME',
      name: 'www',
      value: '78fa8c34050d47b0.hostjamstack-dns-016.com',
      ttl: 3600,
      isActive: true,
      isSystemRecord: false,
      createdAt: '2025-08-15T15:00:00Z',
      updatedAt: '2025-08-15T15:00:00Z',
    },
  ],
}

// Demo Hosting Package
export const demoHostingPackage: HostingPackage = {
  _id: '67f8a2c1b4e9d3f1a2b3c4d7',
  userId: '67f8a2c1b4e9d3f1a2b3c000',
  packageName: 'Growth Plan',
  packageType: 'serverless',
  status: 'active',
  storage: 100, // GB
  bandwidth: 1000, // GB
  databases: 5,
  emailAccounts: 20,
  subdomains: 100,
  features: [
    'Custom Domain + SSL',
    'Environment Variables',
    'Redirects & Rewrites',
    'Deploy Hooks',
    'Analytics',
    'Password Protection',
  ],
  price: 96.0, // Annual pricing with 20% discount
  currency: 'EUR',
  billingCycle: 'yearly',
  nextBillingDate: '2026-08-08T10:00:00Z',
  autoRenew: true,
  currentUsage: {
    storage: 2.4,
    bandwidth: 45.2,
    databases: 2,
    emailAccounts: 5,
  },
  serverLocation: 'eu-west-1',
  serverIp: '185.199.108.153',
  controlPanelUrl: 'https://dashboard.hostjamstack.com',
  createdAt: '2025-08-08T10:00:00Z',
  updatedAt: '2025-08-30T14:30:00Z',
}

// Demo Hosting Projects
export const demoHostingProjects: HostingProject[] = [
  {
    _id: '67f8a2c1b4e9d3f1a2b3c4d7',
    hostingPackageId: '67f8a2c1b4e9d3f1a2b3c4d7',
    userId: '67f8a2c1b4e9d3f1a2b3c000',
    projectName: 'javaletingdetailing-com',
    displayName: 'Javaleting Detailing',
    description: 'Professional car detailing service website',
    repository: {
      provider: 'github',
      url: 'https://github.com/alexjohnson/javaletingdetailing.com',
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
      {
        key: 'DATABASE_URL',
        value:
          'postgresql://user:pass@db.hostjamstack.com:5432/javaletingdetailing',
        environment: 'production',
      },
      {
        key: 'API_KEY',
        value: 'sk_prod_abc123def456ghi789',
        environment: 'production',
      },
      {
        key: 'STRIPE_SECRET',
        value: 'sk_live_xyz789abc123def456',
        environment: 'production',
      },
    ],
    domains: [
      {
        domain: 'javaletingdetailing.com',
        type: 'production',
        sslEnabled: true,
        createdAt: '2025-08-08T11:00:00Z',
      },
      {
        domain: 'www.javaletingdetailing.com',
        type: 'production',
        sslEnabled: true,
        createdAt: '2025-08-08T11:00:00Z',
      },
    ],
    status: 'ready',
    lastDeployment: '2025-08-30T09:15:00Z',
    createdAt: '2025-08-08T10:30:00Z',
    updatedAt: '2025-08-30T09:15:00Z',
  },
  {
    _id: '67f8a2c1b4e9d3f1a2b3c4d8',
    hostingPackageId: '67f8a2c1b4e9d3f1a2b3c4d7',
    userId: '67f8a2c1b4e9d3f1a2b3c000',
    projectName: 'obrierry-co-uk',
    displayName: "O'Brien Berry Farm",
    description: 'Organic berry farm and e-commerce store',
    repository: {
      provider: 'github',
      url: 'https://github.com/alexjohnson/obrierry.co.uk',
      branch: 'main',
      autoDeployEnabled: true,
    },
    buildSettings: {
      buildCommand: 'npm run build',
      outputDirectory: '.next',
      installCommand: 'npm install',
      nodeVersion: '18.x',
    },
    environmentVariables: [
      {
        key: 'DATABASE_URL',
        value: 'postgresql://user:pass@db.hostjamstack.com:5432/obrierry',
        environment: 'production',
      },
      {
        key: 'NEXT_PUBLIC_API_URL',
        value: 'https://api.obrierry.co.uk',
        environment: 'production',
      },
    ],
    domains: [
      {
        domain: 'obrierry.co.uk',
        type: 'production',
        sslEnabled: true,
        createdAt: '2025-08-15T15:30:00Z',
      },
      {
        domain: 'www.obrierry.co.uk',
        type: 'production',
        sslEnabled: true,
        createdAt: '2025-08-15T15:30:00Z',
      },
    ],
    status: 'ready',
    lastDeployment: '2025-08-28T16:45:00Z',
    createdAt: '2025-08-15T15:00:00Z',
    updatedAt: '2025-08-28T16:45:00Z',
  },
]

// Demo Deployments
export const demoDeployments: Record<string, Deployment[]> = {
  '67f8a2c1b4e9d3f1a2b3c4d7': [
    {
      _id: 'dep_67f8a2c1b4e9d3f1a2b3c4d7_1',
      projectId: '67f8a2c1b4e9d3f1a2b3c4d7',
      userId: '67f8a2c1b4e9d3f1a2b3c000',
      deploymentId: 'dpl_abc123def456',
      status: 'ready',
      environment: 'production',
      source: {
        type: 'git',
        commitSha: 'a1b2c3d4e5f6',
        commitMessage: 'Update pricing page and add testimonials',
        branch: 'main',
        author: 'Alex Johnson',
      },
      buildLogs: [
        'Installing dependencies...',
        'Building application...',
        'Deploy complete!',
      ],
      buildDuration: 120,
      buildStartedAt: '2025-08-30T09:13:00Z',
      buildCompletedAt: '2025-08-30T09:15:00Z',
      url: 'https://javaletingdetailing.com',
      domains: ['javaletingdetailing.com', 'www.javaletingdetailing.com'],
      analytics: {
        pageViews: 1245,
        uniqueVisitors: 892,
        topPages: ['/services', '/', '/contact', '/gallery'],
      },
      createdAt: '2025-08-30T09:13:00Z',
      updatedAt: '2025-08-30T09:15:00Z',
    },
  ],
  '67f8a2c1b4e9d3f1a2b3c4d8': [
    {
      _id: 'dep_67f8a2c1b4e9d3f1a2b3c4d8_1',
      projectId: '67f8a2c1b4e9d3f1a2b3c4d8',
      userId: '67f8a2c1b4e9d3f1a2b3c000',
      deploymentId: 'dpl_def456ghi789',
      status: 'ready',
      environment: 'production',
      source: {
        type: 'git',
        commitSha: 'f6e5d4c3b2a1',
        commitMessage: 'Fix mobile responsive issues on product pages',
        branch: 'main',
        author: 'Alex Johnson',
      },
      buildLogs: [
        'Installing dependencies...',
        'Building Next.js app...',
        'Deploy complete!',
      ],
      buildDuration: 95,
      buildStartedAt: '2025-08-28T16:43:00Z',
      buildCompletedAt: '2025-08-28T16:45:00Z',
      url: 'https://obrierry.co.uk',
      domains: ['obrierry.co.uk', 'www.obrierry.co.uk'],
      analytics: {
        pageViews: 567,
        uniqueVisitors: 234,
        topPages: ['/products', '/', '/about', '/contact'],
      },
      createdAt: '2025-08-28T16:43:00Z',
      updatedAt: '2025-08-28T16:45:00Z',
    },
  ],
}

// Demo Support Package
export const demoSupportPackage: SupportPackage = {
  _id: '67f8a2c1b4e9d3f1a2b3c4d9',
  userId: '67f8a2c1b4e9d3f1a2b3c000',
  packageName: 'Quick Fix',
  packageType: 'basic',
  status: 'active',
  features: [
    'Connect 1 custom domain + SSL',
    'Up to 3 env vars',
    'Up to 3 redirects / rewrites',
    'One deploy hook',
    'Production health check',
  ],
  monthlyTickets: 1,
  responseTimeGuarantee: 24, // hours
  supportChannels: ['email', 'chat'],
  price: 25.0,
  currency: 'EUR',
  billingCycle: 'monthly',
  nextBillingDate: '2025-09-18T00:00:00Z',
  autoRenew: false,
  currentUsage: {
    ticketsUsed: 1,
    hoursUsed: 2.5,
    resetDate: '2025-09-01T00:00:00Z',
  },
  createdAt: '2025-08-18T10:00:00Z',
  updatedAt: '2025-08-18T15:00:00Z',
}

// Demo Support Ticket
export const demoSupportTicket: SupportTicket = {
  _id: '67f8a2c1b4e9d3f1a2b3c4da',
  userId: '67f8a2c1b4e9d3f1a2b3c000',
  supportPackageId: '67f8a2c1b4e9d3f1a2b3c4d9',
  ticketNumber: 'QF-2025-0818-001',
  subject: 'Quick Fix Setup Completion - obrierry.co.uk',
  description: 'Quick Fix package setup for obrierry.co.uk domain',
  priority: 'normal',
  status: 'resolved',
  category: 'technical',
  subcategory: 'setup',
  assignedTo: 'support-team',
  assignedAt: '2025-08-18T10:30:00Z',
  firstResponseAt: '2025-08-18T10:30:00Z',
  lastResponseAt: '2025-08-18T14:41:00Z',
  resolvedAt: '2025-08-18T14:41:00Z',
  slaBreached: false,
  relatedDomains: ['obrierry.co.uk'],
  relatedHostingPackages: ['67f8a2c1b4e9d3f1a2b3c4d7'],
  createdAt: '2025-08-18T10:00:00Z',
  updatedAt: '2025-08-18T14:41:00Z',
}

// Demo Support Messages
export const demoSupportMessages: SupportMessage[] = [
  {
    _id: 'msg_67f8a2c1b4e9d3f1a2b3c4da_1',
    ticketId: '67f8a2c1b4e9d3f1a2b3c4da',
    content:
      'Quick Fix package has been successfully applied to obrierry.co.uk. We have connected your custom domain with SSL, configured 2 environment variables, set up 1 redirect rule, and added a deploy hook. Production health check is now active.',
    messageType: 'reply',
    isFromCustomer: false,
    attachments: [],
    staffInfo: {
      name: 'HostJamstack Support',
      role: 'Technical Support',
      department: 'Customer Success',
    },
    createdAt: '2025-08-18T10:30:00Z',
    updatedAt: '2025-08-18T10:30:00Z',
  },
  {
    _id: 'msg_67f8a2c1b4e9d3f1a2b3c4da_2',
    ticketId: '67f8a2c1b4e9d3f1a2b3c4da',
    userId: '67f8a2c1b4e9d3f1a2b3c000',
    content:
      "Thanks for setting everything up! However, I can't seem to find where to view my environment variables in the dashboard.",
    messageType: 'reply',
    isFromCustomer: true,
    attachments: [],
    createdAt: '2025-08-18T14:22:00Z',
    updatedAt: '2025-08-18T14:22:00Z',
  },
  {
    _id: 'msg_67f8a2c1b4e9d3f1a2b3c4da_3',
    ticketId: '67f8a2c1b4e9d3f1a2b3c4da',
    content:
      'You can find your environment variables by going to <a href="/en/dashboard/hosting/67f8a2c1b4e9d3f1a2b3c4d8" class="text-blue-600 hover:text-blue-800 underline">/en/dashboard/hosting/67f8a2c1b4e9d3f1a2b3c4d8</a> and looking under the \'Settings\' section.',
    messageType: 'reply',
    isFromCustomer: false,
    attachments: [],
    staffInfo: {
      name: 'HostJamstack Support',
      role: 'Technical Support',
      department: 'Customer Success',
    },
    createdAt: '2025-08-18T14:35:00Z',
    updatedAt: '2025-08-18T14:35:00Z',
  },
  {
    _id: 'msg_67f8a2c1b4e9d3f1a2b3c4da_4',
    ticketId: '67f8a2c1b4e9d3f1a2b3c4da',
    userId: '67f8a2c1b4e9d3f1a2b3c000',
    content: 'Ah yes, I can see them now. Thank you for your assistance!',
    messageType: 'reply',
    isFromCustomer: true,
    attachments: [],
    createdAt: '2025-08-18T14:41:00Z',
    updatedAt: '2025-08-18T14:41:00Z',
  },
]

// Purchase History
export interface PurchaseHistoryItem {
  id: string
  type: 'domain' | 'hosting' | 'support'
  item: string
  price: number
  date: string
  status: 'completed' | 'active' | 'cancelled'
  recurring?: 'monthly' | 'annually'
  nextBilling?: string
}

export const demoPurchaseHistory: PurchaseHistoryItem[] = [
  {
    id: '67f8a2c1b4e9d3f1a2b3c4da',
    type: 'domain',
    item: 'javaletingdetailing.com',
    price: 12.99,
    date: '2025-08-08T10:00:00Z',
    status: 'completed',
  },
  {
    id: '67f8a2c1b4e9d3f1a2b3c4dd',
    type: 'hosting',
    item: 'Growth Plan (Annual) - javaletingdetailing.com',
    price: 96.0,
    date: '2025-08-08T10:00:00Z',
    status: 'active',
    recurring: 'annually',
    nextBilling: '2026-08-08T10:00:00Z',
  },
  {
    id: '67f8a2c1b4e9d3f1a2b3c4db',
    type: 'domain',
    item: 'obrierry.co.uk',
    price: 12.99,
    date: '2025-08-15T14:30:00Z',
    status: 'completed',
  },
  {
    id: '67f8a2c1b4e9d3f1a2b3c4de',
    type: 'hosting',
    item: 'Growth Plan (Annual) - obrierry.co.uk',
    price: 96.0,
    date: '2025-08-15T14:30:00Z',
    status: 'active',
    recurring: 'annually',
    nextBilling: '2026-08-15T14:30:00Z',
  },
  {
    id: '67f8a2c1b4e9d3f1a2b3c4dc',
    type: 'support',
    item: 'Quick Fix - obrierry.co.uk',
    price: 25.0,
    date: '2025-08-18T10:00:00Z',
    status: 'completed',
  },
]

// Dashboard Overview Demo Data
export const demoDashboardOverview = {
  domains: demoDomains,
  recentActivity: [
    {
      type: 'support' as const,
      message: 'Quick Fix package completed for obrierry.co.uk',
      timestamp: '2025-08-18T14:41:00Z',
    },
    {
      type: 'hosting' as const,
      message: 'Deployment successful for obrierry.co.uk',
      timestamp: '2025-08-28T16:45:00Z',
    },
    {
      type: 'hosting' as const,
      message: 'Deployment successful for javaletingdetailing.com',
      timestamp: '2025-08-30T09:15:00Z',
    },
    {
      type: 'domain' as const,
      message: 'DNS records updated for javaletingdetailing.com',
      timestamp: '2025-08-08T11:00:00Z',
    },
  ],
  alerts: [
    {
      type: 'info' as const,
      message: 'Domain renewals coming up in 11 months',
      action: 'View domains',
    },
  ],
}
