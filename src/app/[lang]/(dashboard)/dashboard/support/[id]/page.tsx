'use client'

import type { SupportMessage, SupportTicket } from '@/lib/dashboard-api'
import {
  createSupportMessage,
  getSupportMessages,
  getSupportTicket,
} from '@/lib/dashboard-api'
import { cn, formatDate, formatRelativeTime, getStatusColor } from '@/lib/utils'
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SupportTicketDetailPage() {
  const { data: session } = useSession()
  const params = useParams()
  const ticketId = params?.id as string
  const lang = (params?.lang as string) || 'en'
  console.log('lang in support/[id] page', lang)

  const [ticket, setTicket] = useState<SupportTicket | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.rawJwt || !ticketId) return

      try {
        const [ticketData, messagesData] = await Promise.all([
          getSupportTicket(session.rawJwt, ticketId),
          getSupportMessages(session.rawJwt, ticketId),
        ])
        setTicket(ticketData)
        setMessages(messagesData)
      } catch (error) {
        console.error('Failed to fetch ticket data:', error)
        // Set mock data for development
        setTicket({
          _id: ticketId,
          userId: session.user._id,
          supportPackageId: 'pkg_1',
          ticketNumber: 'TKT-2024-001',
          subject: 'Help with SSL configuration',
          description:
            "I'm having trouble setting up SSL certificates on my domain example.com. I followed the documentation but the SSL certificate is not being applied correctly.",
          priority: 'normal',
          status: 'in_progress',
          category: 'technical',
          subcategory: 'ssl_certificates',
          assignedTo: 'support_1',
          assignedAt: '2024-12-07T09:00:00Z',
          firstResponseAt: '2024-12-07T09:30:00Z',
          lastResponseAt: '2024-12-07T11:15:00Z',
          slaBreached: false,
          relatedDomains: ['example.com'],
          relatedHostingPackages: [],
          createdAt: '2024-12-07T08:45:00Z',
          updatedAt: '2024-12-07T11:15:00Z',
        })

        setMessages([
          {
            _id: 'msg_1',
            ticketId: ticketId,
            userId: session.user._id,
            content:
              'I\'m having trouble setting up SSL certificates on my domain example.com. I followed the documentation but the SSL certificate is not being applied correctly. When I visit my site, I still see a "Not Secure" warning in the browser.',
            messageType: 'reply',
            isFromCustomer: true,
            attachments: [],
            createdAt: '2024-12-07T08:45:00Z',
            updatedAt: '2024-12-07T08:45:00Z',
          },
          {
            _id: 'msg_2',
            ticketId: ticketId,
            content:
              "Thank you for contacting support. I understand you're having issues with SSL certificate configuration on example.com. Let me help you resolve this.\n\nCould you please check the following:\n1. Verify that your domain is pointed to our nameservers\n2. Check if there are any CNAME records that might conflict\n3. Let me know what specific error messages you're seeing\n\nI'll also check the SSL configuration from our end and get back to you shortly.",
            messageType: 'reply',
            isFromCustomer: false,
            attachments: [],
            staffInfo: {
              name: 'Sarah Johnson',
              role: 'Technical Support',
              department: 'Support',
            },
            createdAt: '2024-12-07T09:30:00Z',
            updatedAt: '2024-12-07T09:30:00Z',
          },
          {
            _id: 'msg_3',
            ticketId: ticketId,
            userId: session.user._id,
            content:
              'Hi Sarah, thanks for the quick response!\n\n1. Yes, the domain is pointed to your nameservers (ns1.hostjamstack.com and ns2.hostjamstack.com)\n2. I don\'t think there are any conflicting CNAME records, but I\'m not 100% sure how to check this\n3. The browser shows "Your connection to this site is not secure" and the URL shows "Not secure" instead of the lock icon\n\nI\'ve attached a screenshot of what I\'m seeing.',
            messageType: 'reply',
            isFromCustomer: true,
            attachments: [
              {
                filename: 'ssl-error-screenshot.png',
                fileSize: 145623,
                mimeType: 'image/png',
                url: 'https://storage.hostjamstack.com/attachments/ssl-error-screenshot.png',
              },
            ],
            createdAt: '2024-12-07T10:15:00Z',
            updatedAt: '2024-12-07T10:15:00Z',
          },
          {
            _id: 'msg_4',
            ticketId: ticketId,
            content:
              "Perfect, thank you for the details and screenshot. I can see the issue now.\n\nI've checked your domain configuration and found that the SSL certificate was generated but there was a propagation delay. I've manually triggered the SSL renewal process and your certificate should be active within the next 10-15 minutes.\n\nI've also updated your DNS configuration to ensure optimal SSL performance. You should now see:\n\n✅ Valid SSL certificate\n✅ Automatic HTTP to HTTPS redirect\n✅ HSTS headers for enhanced security\n\nPlease wait about 15 minutes and then try accessing your site again. If you're still seeing the error, try clearing your browser cache or testing in an incognito window.\n\nLet me know if you need any further assistance!",
            messageType: 'reply',
            isFromCustomer: false,
            attachments: [],
            staffInfo: {
              name: 'Sarah Johnson',
              role: 'Technical Support',
              department: 'Support',
            },
            createdAt: '2024-12-07T11:15:00Z',
            updatedAt: '2024-12-07T11:15:00Z',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.rawJwt, ticketId, session?.user._id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.rawJwt || !ticket || !newMessage.trim()) return

    setSending(true)
    try {
      const message = await createSupportMessage(session.rawJwt, {
        ticketId: ticket._id,
        content: newMessage,
        messageType: 'reply',
        isFromCustomer: true,
        attachments: [],
      })

      setMessages([...messages, message])
      setNewMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-800 bg-red-200'
      case 'high':
        return 'text-orange-800 bg-orange-200'
      case 'normal':
        return 'text-purple-800 bg-purple-200'
      case 'low':
        return 'text-gray-800 bg-gray-200'
      default:
        return 'text-gray-800 bg-gray-200'
    }
  }

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

  if (!ticket) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Ticket Not Found
        </h1>
        <p className="text-gray-600">
          The requested support ticket could not be found.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900">
                {ticket.subject}
              </h1>
              <span className="font-mono text-sm text-gray-500">
                {ticket.ticketNumber}
              </span>
            </div>
            <p className="mb-4 text-gray-600">{ticket.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-1 text-sm text-gray-500">Status</div>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                getStatusColor(ticket.status),
              )}
            >
              {ticket.status.replace('_', ' ')}
            </span>
          </div>

          <div>
            <div className="mb-1 text-sm text-gray-500">Priority</div>
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                getPriorityColor(ticket.priority),
              )}
            >
              {ticket.priority}
            </span>
          </div>

          <div>
            <div className="mb-1 text-sm text-gray-500">Category</div>
            <div className="text-sm font-medium text-gray-900 capitalize">
              {ticket.category}
            </div>
          </div>

          <div>
            <div className="mb-1 text-sm text-gray-500">Created</div>
            <div className="text-sm font-medium text-gray-900">
              {formatDate(ticket.createdAt)}
            </div>
          </div>
        </div>

        {/* Related Resources */}
        {(ticket.relatedDomains.length > 0 ||
          ticket.relatedHostingPackages.length > 0) && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="mb-2 text-sm text-gray-500">Related Resources</div>
            <div className="flex flex-wrap gap-2">
              {ticket.relatedDomains.map((domain) => (
                <span
                  key={domain}
                  className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800"
                >
                  {domain}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Conversation</h3>
        </div>

        <div className="max-h-96 divide-y divide-gray-200 overflow-y-auto">
          {messages.map((message) => (
            <div key={message._id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {message.isFromCustomer ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                      <span className="text-sm font-medium text-white">
                        {session?.user?.firstName?.[0] || 'U'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                      <UserCircleIcon className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {message.isFromCustomer
                        ? `${session?.user?.firstName} ${session?.user?.lastName}`
                        : message.staffInfo?.name || 'Support Team'}
                    </span>
                    {message.staffInfo && (
                      <span className="text-xs text-gray-500">
                        {message.staffInfo.role}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(message.createdAt)}
                    </span>
                  </div>

                  <div className="mb-3 text-sm whitespace-pre-wrap text-gray-700">
                    {message.content}
                  </div>

                  {/* Attachments */}
                  {message.attachments.length > 0 && (
                    <div className="space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 rounded border bg-gray-50 p-2"
                        >
                          <PaperClipIcon className="h-4 w-4 text-gray-400" />
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:underline"
                          >
                            {attachment.filename}
                          </a>
                          <span className="text-xs text-gray-500">
                            ({Math.round(attachment.fileSize / 1024)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {ticket.status !== 'closed' && (
          <div className="border-t border-gray-200 p-6">
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Add a reply
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <PaperClipIcon className="h-4 w-4" />
                  <span>Attach file</span>
                </button>

                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 px-4 py-2 text-base font-medium whitespace-nowrap text-white shadow-md transition-colors hover:bg-gray-800 disabled:bg-gray-400"
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>{sending ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
