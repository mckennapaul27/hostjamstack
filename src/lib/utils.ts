import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatting
export function formatCurrency(
  amount: number,
  currency: string = 'EUR',
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Date formatting
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Relative time formatting
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  }
}

// Calculate days until expiry
export function getDaysUntilExpiry(expirationDate: string): number {
  const expiry = new Date(expirationDate)
  const now = new Date()
  const diffInTime = expiry.getTime() - now.getTime()
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24))
  return diffInDays
}

// Status color mapping
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    active: 'text-green-800 bg-green-200',
    pending: 'text-yellow-800 bg-yellow-200',
    expired: 'text-red-800 bg-red-200',
    suspended: 'text-orange-800 bg-orange-200',
    transferred: 'text-purple-800 bg-purple-200',
    default: 'text-purple-800 bg-purple-200',
  }
  return statusColors[status.toLowerCase()] || statusColors.default
}

// Priority color mapping
export function getPriorityColor(priority: string): string {
  const priorityColors: Record<string, string> = {
    low: 'text-green-800 bg-green-200',
    normal: 'text-purple-800 bg-purple-200',
    medium: 'text-yellow-800 bg-yellow-200',
    high: 'text-orange-800 bg-orange-200',
    urgent: 'text-red-800 bg-red-200',
    default: 'text-purple-800 bg-purple-200',
  }
  return priorityColors[priority.toLowerCase()] || priorityColors.default
}
