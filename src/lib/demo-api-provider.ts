import { useSession } from 'next-auth/react'
import {
  getDashboardOverview,
  getDeployments,
  getDNSRecords,
  getDomainById,
  getHostingPackages,
  getHostingProject,
  getHostingProjects,
  getPurchasedSupportPackages,
  getSupportMessages,
  getSupportPackages,
  getSupportTicket,
  getSupportTickets,
  getUserDomains,
  getUserProfile,
  type Deployment,
  type DNSRecord,
  type Domain,
  type HostingPackage,
  type HostingProject,
  type PurchasedSupportPackage,
  type SupportMessage,
  type SupportPackage,
  type SupportTicket,
  type UserProfile,
} from './dashboard-api'
import {
  demoDashboardOverview,
  demoDeployments,
  demoDNSRecords,
  demoDomains,
  demoHostingPackages,
  demoHostingProjects,
  demoPurchasedSupportPackage,
  demoSupportMessages,
  demoSupportPackage,
  demoSupportTicket,
  demoUserProfile,
  isDemoUser,
} from './demo-data'

// Re-export for convenience
export { isDemoUser } from './demo-data'

// Demo API Provider Hook
export function useDemoApiProvider() {
  const { data: session } = useSession()
  const isDemo = isDemoUser(session?.user?.email)

  return {
    isDemo,
    // Profile
    getUserProfile: async (
      jwt: string,
      userId: string,
    ): Promise<UserProfile> => {
      if (isDemo) {
        return Promise.resolve(demoUserProfile)
      }
      return getUserProfile(jwt, userId)
    },

    // Domains
    getUserDomains: async (jwt: string): Promise<Domain[]> => {
      if (isDemo) {
        return Promise.resolve(demoDomains)
      }
      return getUserDomains(jwt)
    },

    getDomainById: async (jwt: string, domainId: string): Promise<Domain> => {
      if (isDemo) {
        const domain = demoDomains.find((d) => d._id === domainId)
        if (!domain) {
          throw new Error('Domain not found')
        }
        return Promise.resolve(domain)
      }
      return getDomainById(jwt, domainId)
    },

    // DNS Records
    getDNSRecords: async (
      jwt: string,
      domainId: string,
    ): Promise<DNSRecord[]> => {
      if (isDemo) {
        const records = demoDNSRecords[domainId] || []
        return Promise.resolve(records)
      }
      return getDNSRecords(jwt, domainId)
    },

    // Hosting
    getHostingPackages: async (jwt: string): Promise<HostingPackage[]> => {
      if (isDemo) {
        return Promise.resolve(demoHostingPackages)
      }
      return getHostingPackages(jwt)
    },

    getHostingProjects: async (
      jwt: string,
      packageId?: string,
    ): Promise<HostingProject[]> => {
      if (isDemo) {
        // Filter by package ID if provided, otherwise return all
        if (packageId) {
          const filtered = demoHostingProjects.filter(
            (p) => p.hostingPackageId === packageId,
          )
          return Promise.resolve(filtered)
        }
        return Promise.resolve(demoHostingProjects)
      }
      return getHostingProjects(jwt, packageId)
    },

    getHostingProject: async (
      jwt: string,
      projectId: string,
    ): Promise<HostingProject> => {
      if (isDemo) {
        const project = demoHostingProjects.find((p) => p._id === projectId)
        if (!project) {
          throw new Error('Project not found')
        }
        return Promise.resolve(project)
      }
      return getHostingProject(jwt, projectId)
    },

    // Deployments
    getDeployments: async (
      jwt: string,
      projectId: string,
    ): Promise<Deployment[]> => {
      if (isDemo) {
        const deployments = demoDeployments[projectId] || []
        return Promise.resolve(deployments)
      }
      return getDeployments(jwt, projectId)
    },

    // Support
    getSupportPackages: async (jwt: string): Promise<SupportPackage[]> => {
      if (isDemo) {
        return Promise.resolve([demoSupportPackage])
      }
      return getSupportPackages(jwt)
    },

    getPurchasedSupportPackages: async (
      jwt: string,
    ): Promise<PurchasedSupportPackage[]> => {
      if (isDemo) {
        return Promise.resolve([demoPurchasedSupportPackage])
      }
      return getPurchasedSupportPackages(jwt)
    },

    getSupportTickets: async (
      jwt: string,
      packageId?: string,
    ): Promise<SupportTicket[]> => {
      if (isDemo) {
        // Filter by package ID if provided
        if (packageId && demoSupportTicket.supportPackageId !== packageId) {
          return Promise.resolve([])
        }
        return Promise.resolve([demoSupportTicket])
      }
      return getSupportTickets(jwt, packageId)
    },

    getSupportTicket: async (
      jwt: string,
      ticketId: string,
    ): Promise<SupportTicket> => {
      if (isDemo) {
        if (demoSupportTicket._id !== ticketId) {
          throw new Error('Ticket not found')
        }
        return Promise.resolve(demoSupportTicket)
      }
      return getSupportTicket(jwt, ticketId)
    },

    getSupportMessages: async (
      jwt: string,
      ticketId: string,
    ): Promise<SupportMessage[]> => {
      if (isDemo) {
        if (ticketId === demoSupportTicket._id) {
          return Promise.resolve(demoSupportMessages)
        }
        return Promise.resolve([])
      }
      return getSupportMessages(jwt, ticketId)
    },

    // Dashboard Overview
    getDashboardOverview: async (jwt: string) => {
      if (isDemo) {
        return Promise.resolve(demoDashboardOverview)
      }
      return getDashboardOverview(jwt)
    },
  }
}

// Standalone demo API functions (for components that don't use the hook)
export const demoApiProvider = {
  isDemo: (userEmail?: string) => isDemoUser(userEmail),

  getUserProfile: async (
    jwt: string,
    userId: string,
    userEmail?: string,
  ): Promise<UserProfile> => {
    if (isDemoUser(userEmail)) {
      return Promise.resolve(demoUserProfile)
    }
    return getUserProfile(jwt, userId)
  },

  getUserDomains: async (
    jwt: string,
    userEmail?: string,
  ): Promise<Domain[]> => {
    if (isDemoUser(userEmail)) {
      return Promise.resolve(demoDomains)
    }
    return getUserDomains(jwt)
  },

  getDomainById: async (
    jwt: string,
    domainId: string,
    userEmail?: string,
  ): Promise<Domain> => {
    if (isDemoUser(userEmail)) {
      const domain = demoDomains.find((d) => d._id === domainId)
      if (!domain) {
        throw new Error('Domain not found')
      }
      return Promise.resolve(domain)
    }
    return getDomainById(jwt, domainId)
  },

  getDNSRecords: async (
    jwt: string,
    domainId: string,
    userEmail?: string,
  ): Promise<DNSRecord[]> => {
    if (isDemoUser(userEmail)) {
      const records = demoDNSRecords[domainId] || []
      return Promise.resolve(records)
    }
    return getDNSRecords(jwt, domainId)
  },

  getHostingPackages: async (
    jwt: string,
    userEmail?: string,
  ): Promise<HostingPackage[]> => {
    if (isDemoUser(userEmail)) {
      return Promise.resolve(demoHostingPackages)
    }
    return getHostingPackages(jwt)
  },

  getHostingProjects: async (
    jwt: string,
    packageId?: string,
    userEmail?: string,
  ): Promise<HostingProject[]> => {
    if (isDemoUser(userEmail)) {
      if (packageId) {
        const filtered = demoHostingProjects.filter(
          (p) => p.hostingPackageId === packageId,
        )
        return Promise.resolve(filtered)
      }
      return Promise.resolve(demoHostingProjects)
    }
    return getHostingProjects(jwt, packageId)
  },

  getHostingProject: async (
    jwt: string,
    projectId: string,
    userEmail?: string,
  ): Promise<HostingProject> => {
    if (isDemoUser(userEmail)) {
      const project = demoHostingProjects.find((p) => p._id === projectId)
      if (!project) {
        throw new Error('Project not found')
      }
      return Promise.resolve(project)
    }
    return getHostingProject(jwt, projectId)
  },

  getDeployments: async (
    jwt: string,
    projectId: string,
    userEmail?: string,
  ): Promise<Deployment[]> => {
    if (isDemoUser(userEmail)) {
      const deployments = demoDeployments[projectId] || []
      return Promise.resolve(deployments)
    }
    return getDeployments(jwt, projectId)
  },

  getSupportPackages: async (
    jwt: string,
    userEmail?: string,
  ): Promise<SupportPackage[]> => {
    if (isDemoUser(userEmail)) {
      return Promise.resolve([demoSupportPackage])
    }
    return getSupportPackages(jwt)
  },

  getPurchasedSupportPackages: async (
    jwt: string,
    userEmail?: string,
  ): Promise<PurchasedSupportPackage[]> => {
    if (isDemoUser(userEmail)) {
      return Promise.resolve([demoPurchasedSupportPackage])
    }
    return getPurchasedSupportPackages(jwt)
  },

  getSupportTickets: async (
    jwt: string,
    packageId?: string,
    userEmail?: string,
  ): Promise<SupportTicket[]> => {
    if (isDemoUser(userEmail)) {
      if (packageId && demoSupportTicket.supportPackageId !== packageId) {
        return Promise.resolve([])
      }
      return Promise.resolve([demoSupportTicket])
    }
    return getSupportTickets(jwt, packageId)
  },

  getSupportTicket: async (
    jwt: string,
    ticketId: string,
    userEmail?: string,
  ): Promise<SupportTicket> => {
    if (isDemoUser(userEmail)) {
      if (demoSupportTicket._id !== ticketId) {
        throw new Error('Ticket not found')
      }
      return Promise.resolve(demoSupportTicket)
    }
    return getSupportTicket(jwt, ticketId)
  },

  getSupportMessages: async (
    jwt: string,
    ticketId: string,
    userEmail?: string,
  ): Promise<SupportMessage[]> => {
    if (isDemoUser(userEmail)) {
      if (ticketId === demoSupportTicket._id) {
        return Promise.resolve(demoSupportMessages)
      }
      return Promise.resolve([])
    }
    return getSupportMessages(jwt, ticketId)
  },

  getDashboardOverview: async (jwt: string, userEmail?: string) => {
    if (isDemoUser(userEmail)) {
      return Promise.resolve(demoDashboardOverview)
    }
    return getDashboardOverview(jwt)
  },
}
