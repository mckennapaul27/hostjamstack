'use client'

import type { SupportMessage, SupportTicket } from '@/lib/dashboard-api'
import { createSupportMessage } from '@/lib/dashboard-api'
import { demoApiProvider } from '@/lib/demo-api-provider'
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
          demoApiProvider.getSupportTicket(
            session.rawJwt,
            ticketId,
            session.user?.email,
          ),
          demoApiProvider.getSupportMessages(
            session.rawJwt,
            ticketId,
            session.user?.email,
          ),
        ])
        setTicket(ticketData)
        setMessages(messagesData)
      } catch (error) {
        console.error('Failed to fetch ticket data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session?.rawJwt, ticketId, session?.user?.email])

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
        <div className="mb-4 flex flex-col">
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

                  <div
                    className="mb-3 text-sm whitespace-pre-wrap text-gray-700"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />

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
