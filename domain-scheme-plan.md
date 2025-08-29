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
