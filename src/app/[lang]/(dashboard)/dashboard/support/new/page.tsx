'use client'

import { createSupportTicket, type SupportTicket } from '@/lib/dashboard-api'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewSupportTicketPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const lang = (params?.lang as string) || 'en'

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'technical',
    priority: 'normal',
    relatedDomains: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.rawJwt) return

    setSubmitting(true)
    try {
      const ticket = await createSupportTicket(session.rawJwt, {
        subject: formData.subject,
        description: formData.description,
        category: formData.category as unknown as SupportTicket['category'],
        subcategory: '',
        priority: formData.priority as unknown as SupportTicket['priority'],
        status: 'open',
        relatedDomains: formData.relatedDomains
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
        relatedHostingPackages: [],
      })

      router.push(`/${lang}/dashboard/support/${ticket._id}`)
    } catch (error) {
      console.error('Failed to create ticket:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create Support Ticket
        </h1>
        <p className="text-gray-600">Get help from our support team</p>
      </div>

      {/* Form */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="subject"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              required
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="Brief description of your issue"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              >
                <option value="technical">Technical Support</option>
                <option value="billing">Billing & Account</option>
                <option value="migration">Site Migration</option>
                <option value="general">General Question</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Priority *
              </label>
              <select
                id="priority"
                required
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="relatedDomains"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Related Domains
            </label>
            <input
              type="text"
              id="relatedDomains"
              value={formData.relatedDomains}
              onChange={(e) =>
                setFormData({ ...formData, relatedDomains: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="example.com, another-domain.com (comma-separated)"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="Please provide detailed information about your issue, including any error messages, steps to reproduce, and what you've already tried..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
            >
              {submitting ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
