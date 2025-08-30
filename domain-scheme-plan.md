# Domain Management Database Schema Plan

## 🗄️ Core Models

### 1. Users Model

```javascript
{
  _id: ObjectId,
  email: "user@example.com",
  password: "hashed_password",
  firstName: "John",
  lastName: "Doe",
  emailVerified: true,
  emailVerificationToken: "token123",
  passwordResetToken: "reset456",
  passwordResetExpires: Date,

  // Profile & Preferences
  profile: {
    company: "Acme Corp",
    phone: "+1234567890",
    timezone: "UTC",
    language: "en"
  },

  // Billing & Account
  billing: {
    defaultPaymentMethod: ObjectId, // Reference to PaymentMethods
    billingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US"
    }
  },

  // Account Management
  isActive: true,
  role: "user", // user, admin, support
  twoFactorEnabled: false,
  twoFactorSecret: "secret",

  createdAt: Date,
  updatedAt: Date
}
```

### 2. Domains Model

```javascript
{
  _id: ObjectId,
  domainName: "example.com",
  userId: ObjectId, // Reference to Users

  // Registration Info
  registrationDate: Date,
  expirationDate: Date,
  autoRenew: true,
  registrationPeriod: 1, // years
  isPremium: false,

  // Status & Management
  status: "active", // active, pending, expired, suspended, transferred
  registrar: "name.com",
  registrarDomainId: "external_id_123",

  // DNS Management
  nameservers: [
    "ns1.hostjamstack.com",
    "ns2.hostjamstack.com"
  ],
  useDefaultNameservers: true,

  // Pricing
  purchasePrice: 12.99,
  renewalPrice: 14.99,
  currency: "EUR",

  // Features
  whoisPrivacy: true,
  transferLock: true,

  createdAt: Date,
  updatedAt: Date
}
```

### 3. DNS Records Model

```javascript
{
  _id: ObjectId,
  domainId: ObjectId, // Reference to Domains
  userId: ObjectId,   // Reference to Users

  // DNS Record Details
  type: "A", // A, AAAA, CNAME, MX, TXT, NS, SRV, PTR
  name: "@",  // subdomain or @ for root
  value: "192.168.1.1",
  ttl: 3600,
  priority: 10, // for MX records

  // Management
  isActive: true,
  isSystemRecord: false, // true for automatically created records

  createdAt: Date,
  updatedAt: Date
}
```

### 4. Email Forwarding Model

```javascript
{
  _id: ObjectId,
  domainId: ObjectId, // Reference to Domains
  userId: ObjectId,   // Reference to Users

  // Email Forwarding Config
  fromEmail: "contact@example.com",
  toEmails: ["john@gmail.com", "support@company.com"],

  // Settings
  isActive: true,
  catchAll: false, // forward all unmatched emails

  // Statistics
  forwardedCount: 0,
  lastForwardedAt: Date,

  createdAt: Date,
  updatedAt: Date
}
```

### 5. Domain Transfers Model

```javascript
{
  _id: ObjectId,
  domainId: ObjectId, // Reference to Domains
  userId: ObjectId,   // Reference to Users

  // Transfer Details
  transferType: "incoming", // incoming, outgoing
  status: "pending", // pending, approved, rejected, completed, failed
  authCode: "EPP123456",

  // External Info
  currentRegistrar: "GoDaddy",
  targetRegistrar: "NameCom",

  // Timing
  initiatedAt: Date,
  completedAt: Date,
  estimatedCompletionDate: Date,

  // Communication
  notifications: [{
    type: "status_update",
    message: "Transfer approved",
    sentAt: Date
  }],

  createdAt: Date,
  updatedAt: Date
}
```

### 6. Domain Orders Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users

  // Order Details
  orderNumber: "ORD-2024-001",
  status: "completed", // pending, processing, completed, failed, refunded

  // Domain Info
  domainName: "example.com",
  registrationPeriod: 1,
  isPremium: false,

  // Pricing
  subtotal: 12.99,
  taxes: 0,
  total: 12.99,
  currency: "EUR",

  // Payment
  paymentMethod: "stripe",
  paymentIntentId: "pi_123456",
  paidAt: Date,

  // Post-Purchase
  domainId: ObjectId, // Set after domain is created

  createdAt: Date,
  updatedAt: Date
}
```

### 7. Payment Methods Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users

  // Payment Details
  type: "card", // card, paypal, bank_account
  provider: "stripe", // stripe, paypal
  providerId: "pm_123456",

  // Card Info (encrypted/tokenized)
  lastFour: "4242",
  brand: "visa",
  expiryMonth: 12,
  expiryYear: 2025,

  // Status
  isDefault: true,
  isActive: true,

  createdAt: Date,
  updatedAt: Date
}
```

### 8. Hosting Packages Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users

  // Package Details
  packageName: "Starter Plan",
  packageType: "shared", // shared, vps, dedicated, serverless
  status: "active", // active, suspended, cancelled, pending

  // Resource Limits
  storage: 10, // GB
  bandwidth: 100, // GB per month
  databases: 5,
  emailAccounts: 10,
  subdomains: 25,

  // Features
  features: [
    "SSL Certificates",
    "Daily Backups",
    "24/7 Support",
    "CDN Included"
  ],

  // Billing
  price: 9.99,
  currency: "EUR",
  billingCycle: "monthly", // monthly, yearly
  nextBillingDate: Date,
  autoRenew: true,

  // Usage Stats
  currentUsage: {
    storage: 2.5, // GB used
    bandwidth: 45, // GB used this month
    databases: 2,
    emailAccounts: 3
  },

  // Server Details
  serverLocation: "Frankfurt, Germany",
  serverIp: "192.168.1.100",
  controlPanelUrl: "https://cpanel.hostjamstack.com",

  createdAt: Date,
  updatedAt: Date
}
```

### 9. Hosting Projects Model

```javascript
{
  _id: ObjectId,
  hostingPackageId: ObjectId, // Reference to HostingPackages
  userId: ObjectId, // Reference to Users

  // Project Details
  projectName: "my-awesome-site",
  displayName: "My Awesome Site",
  description: "Personal portfolio website",

  // Git Integration
  repository: {
    provider: "github", // github, gitlab, bitbucket
    url: "https://github.com/user/repo",
    branch: "main",
    autoDeployEnabled: true
  },

  // Build Settings
  buildSettings: {
    buildCommand: "npm run build",
    outputDirectory: "dist",
    installCommand: "npm install",
    nodeVersion: "18.x"
  },

  // Environment Variables
  environmentVariables: [{
    key: "API_URL",
    value: "https://api.example.com",
    environment: "production" // production, preview, development
  }],

  // Domains
  domains: [
    {
      domain: "example.com",
      type: "production", // production, preview
      sslEnabled: true,
      createdAt: Date
    }
  ],

  // Status
  status: "ready", // ready, building, error, disabled
  lastDeployment: ObjectId, // Reference to Deployments

  createdAt: Date,
  updatedAt: Date
}
```

### 10. Deployments Model

```javascript
{
  _id: ObjectId,
  projectId: ObjectId, // Reference to HostingProjects
  userId: ObjectId, // Reference to Users

  // Deployment Info
  deploymentId: "dpl_abc123def456", // Unique deployment ID
  status: "ready", // building, ready, error, cancelled
  environment: "production", // production, preview

  // Source
  source: {
    type: "git", // git, upload
    commitSha: "a1b2c3d4",
    commitMessage: "Fix header styling",
    branch: "main",
    author: "John Doe"
  },

  // Build Info
  buildLogs: [], // Array of log entries
  buildDuration: 45000, // milliseconds
  buildStartedAt: Date,
  buildCompletedAt: Date,

  // Deployment URLs
  url: "https://my-site-abc123.hostjamstack.app",
  domains: ["example.com"], // Custom domains

  // Analytics (if enabled)
  analytics: {
    pageViews: 1250,
    uniqueVisitors: 890,
    topPages: ["/", "/about", "/contact"]
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 11. Support Packages Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users

  // Package Details
  packageName: "Priority Support",
  packageType: "priority", // basic, priority, enterprise
  status: "active", // active, expired, cancelled

  // Package Features
  features: [
    "24/7 Priority Support",
    "Phone Support",
    "1-hour Response Time",
    "Technical Consultation",
    "Site Migration Assistance"
  ],

  // Limits
  monthlyTickets: 10, // -1 for unlimited
  responseTimeGuarantee: 60, // minutes
  supportChannels: ["email", "phone", "chat"],

  // Billing
  price: 29.99,
  currency: "EUR",
  billingCycle: "monthly",
  nextBillingDate: Date,
  autoRenew: true,

  // Usage This Month
  currentUsage: {
    ticketsUsed: 3,
    hoursUsed: 5.5,
    resetDate: Date // when monthly usage resets
  },

  createdAt: Date,
  updatedAt: Date
}
```

### 12. Support Tickets Model

```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  supportPackageId: ObjectId, // Reference to SupportPackages (optional)

  // Ticket Details
  ticketNumber: "TKT-2024-001",
  subject: "Help with SSL configuration",
  description: "I'm having trouble setting up SSL on my domain",
  priority: "normal", // low, normal, high, urgent
  status: "open", // open, in_progress, waiting_customer, resolved, closed

  // Classification
  category: "technical", // technical, billing, general, migration
  subcategory: "ssl_certificates",

  // Assignment
  assignedTo: ObjectId, // Reference to support staff
  assignedAt: Date,

  // SLA Tracking
  firstResponseAt: Date,
  lastResponseAt: Date,
  resolvedAt: Date,
  slaBreached: false,

  // Related Resources
  relatedDomains: ["example.com"],
  relatedHostingPackages: [ObjectId],

  createdAt: Date,
  updatedAt: Date
}
```

### 13. Support Messages Model

```javascript
{
  _id: ObjectId,
  ticketId: ObjectId, // Reference to SupportTickets
  userId: ObjectId, // Reference to Users (null if from support staff)

  // Message Details
  content: "Thanks for your help, the SSL is working now!",
  messageType: "reply", // reply, note, status_change
  isFromCustomer: true,

  // Attachments
  attachments: [{
    filename: "screenshot.png",
    fileSize: 1024567,
    mimeType: "image/png",
    url: "https://storage.hostjamstack.com/attachments/abc123.png"
  }],

  // Staff Info (if from support)
  staffInfo: {
    name: "Sarah Johnson",
    role: "Technical Support",
    department: "Support"
  },

  // Status Updates
  statusChange: {
    from: "open",
    to: "in_progress"
  },

  createdAt: Date,
  updatedAt: Date
}
```

## 🔗 Key Relationships & Considerations

### Indexing Strategy

```javascript
// Users
{ email: 1 } // unique
{ emailVerificationToken: 1 }
{ passwordResetToken: 1 }

// Domains
{ userId: 1 }
{ domainName: 1 } // unique
{ expirationDate: 1 } // for renewal reminders
{ status: 1 }

// DNS Records
{ domainId: 1, type: 1, name: 1 }
{ userId: 1 }

// Email Forwarding
{ domainId: 1 }
{ fromEmail: 1 } // unique per domain

// Domain Transfers
{ domainId: 1 }
{ status: 1, createdAt: 1 }

// Hosting Packages
{ userId: 1 }
{ status: 1 }
{ nextBillingDate: 1 }

// Hosting Projects
{ hostingPackageId: 1 }
{ userId: 1 }
{ "repository.url": 1 }

// Deployments
{ projectId: 1, createdAt: -1 }
{ status: 1 }
{ environment: 1 }

// Support Packages
{ userId: 1 }
{ status: 1 }
{ nextBillingDate: 1 }

// Support Tickets
{ userId: 1 }
{ supportPackageId: 1 }
{ status: 1, priority: 1 }
{ ticketNumber: 1 } // unique
{ createdAt: -1 }

// Support Messages
{ ticketId: 1, createdAt: 1 }
{ userId: 1 }
```

**Notifications**: Email reminders, renewal alerts

```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: "domain_expiring", // domain_expiring, transfer_complete, dns_changed
  title: "Domain Expiring Soon",
  message: "Your domain example.com expires in 30 days",
  isRead: false,
  emailSent: true,
  sentAt: Date,
  createdAt: Date
}
```
