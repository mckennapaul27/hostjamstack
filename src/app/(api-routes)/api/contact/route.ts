import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  company?: string
  subject: string
  category: string
  message: string
}

// Email templates
const createAcknowledgmentEmail = (data: ContactFormData) => {
  const categoryNames: Record<string, string> = {
    general: 'General Inquiry',
    hosting: 'Hosting Questions',
    domains: 'Domain Registration',
    support: 'Technical Support',
    billing: 'Billing & Payments',
    partnership: 'Partnership Opportunities',
  }

  return {
    from: 'Host Jamstack <noreply@mail.hostjamstack.com>',
    to: [data.email],
    subject: 'Thank you for contacting Host Jamstack',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting us</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Thank You!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">We've received your message</p>
        </div>
        
        <div style="background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="margin: 0 0 20px 0; font-size: 16px;">Hi ${data.name},</p>
          
          <p style="margin: 0 0 20px 0; font-size: 16px;">Thank you for reaching out to Host Jamstack! We've received your inquiry and our team will get back to you within 24 hours.</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px;">Your Message Details:</h3>
            <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${data.subject}</p>
            <p style="margin: 0 0 10px 0;"><strong>Category:</strong> ${categoryNames[data.category] || data.category}</p>
            ${data.company ? `<p style="margin: 0 0 10px 0;"><strong>Company:</strong> ${data.company}</p>` : ''}
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 5px 0 0 0; padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #667eea;">${data.message}</p>
          </div>
          
          <p style="margin: 25px 0 0 0; font-size: 16px;">In the meantime, feel free to explore our:</p>
          <ul style="margin: 10px 0 20px 20px;">
            <li style="margin: 5px 0;"><a href="https://hostjamstack.com/hosting" style="color: #667eea; text-decoration: none;">Hosting Plans</a></li>
            <li style="margin: 5px 0;"><a href="https://hostjamstack.com/domains" style="color: #667eea; text-decoration: none;">Domain Registration</a></li>
            <li style="margin: 5px 0;"><a href="https://hostjamstack.com/support-packages" style="color: #667eea; text-decoration: none;">Support Packages</a></li>
          </ul>
          
          <div style="margin: 30px 0 0 0; padding: 20px 0; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Best regards,<br>The Host Jamstack Team</p>
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">If you have any urgent questions, you can reach us at support@hostjamstack.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

const createSupportNotificationEmail = (data: ContactFormData) => {
  const categoryNames: Record<string, string> = {
    general: 'General Inquiry',
    hosting: 'Hosting Questions',
    domains: 'Domain Registration',
    support: 'Technical Support',
    billing: 'Billing & Payments',
    partnership: 'Partnership Opportunities',
  }

  return {
    from: 'Contact Form <noreply@mail.hostjamstack.com>',
    to: ['support@hostjamstack.com'],
    subject: `New Contact Form Submission: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1f2937; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0 0; font-size: 14px;">Category: ${categoryNames[data.category] || data.category}</p>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 0 0 25px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Contact Information:</h3>
            <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a></p>
            ${data.company ? `<p style="margin: 0 0 8px 0;"><strong>Company:</strong> ${data.company}</p>` : ''}
            <p style="margin: 0;"><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 0 8px 8px 0; margin: 0 0 25px 0;">
            <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">Message:</h3>
            <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border: 1px solid #d1fae5;">
            <p style="margin: 0; font-size: 14px; color: #065f46;">
              <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
            </p>
          </div>
          
          <div style="margin: 25px 0 0 0; padding: 15px 0; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              Submitted on ${new Date().toLocaleString('en-US', {
                timeZone: 'Europe/Berlin',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    const { name, email, subject, category, message } = body

    if (!name || !email || !subject || !category || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    // Validate category
    const validCategories = [
      'general',
      'hosting',
      'domains',
      'support',
      'billing',
      'partnership',
    ]
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 },
      )
    }

    try {
      // Send acknowledgment email to the user
      const acknowledgmentEmail = createAcknowledgmentEmail(body)
      const userEmailResponse = await resend.emails.send(acknowledgmentEmail)

      // Send notification email to support team
      const supportEmail = createSupportNotificationEmail(body)
      const supportEmailResponse = await resend.emails.send(supportEmail)

      // Log successful submission
      console.log('Contact form submission successful:', {
        userEmailId: userEmailResponse.data?.id,
        supportEmailId: supportEmailResponse.data?.id,
        submissionData: {
          name,
          email,
          company: body.company || 'Not provided',
          subject,
          category,
          timestamp: new Date().toISOString(),
        },
      })

      return NextResponse.json(
        {
          success: true,
          message:
            'Your message has been sent successfully. We will get back to you within 24 hours.',
        },
        { status: 200 },
      )
    } catch (emailError) {
      console.error('Email sending failed:', emailError)

      // Still log the contact form submission even if email fails
      console.log('Contact form submission (email failed):', {
        name,
        email,
        company: body.company || 'Not provided',
        subject,
        category,
        message,
        timestamp: new Date().toISOString(),
        error:
          emailError instanceof Error ? emailError.message : 'Unknown error',
      })

      // Return error but don't expose email service details
      return NextResponse.json(
        {
          error:
            'Message received but there was an issue with email delivery. We will contact you shortly.',
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
