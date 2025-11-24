# PHP Integration Guide

## Overview

The e-clearance system now supports bidirectional synchronization with external PHP-based systems. This allows seamless data exchange between your Next.js clearance platform and your existing PHP infrastructure.

## Features

- **Bidirectional Sync**: Automatically send and receive data from PHP systems
- **Webhook Support**: Real-time event notifications from PHP system
- **Data Mapping**: Automatic conversion between Next.js and PHP data formats
- **Sync Logging**: Complete audit trail of all sync operations
- **Status Tracking**: Real-time monitoring of sync status

## Setup Instructions

### 1. Environment Variables

Add the following to your `.env.local` file:

\`\`\`env
PHP_SYSTEM_URL=https://api.your-php-system.local
PHP_API_KEY=your_api_key_here
PHP_API_SECRET=your_api_secret_here
PHP_WEBHOOK_SECRET=your_webhook_secret_here
\`\`\`

### 2. Configure PHP System

Your PHP system should implement these endpoints:

#### GET /api/health
Check system health
\`\`\`json
Response: { "status": "ok" }
\`\`\`

#### POST /api/students
Receive student data
\`\`\`json
Body: {
  "student": { student_data },
  "sync_source": "clearme",
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

#### POST /api/clearances
Receive clearance data
\`\`\`json
Body: {
  "student_id": "123",
  "clearance": { clearance_data },
  "sync_source": "clearme",
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

#### PUT /api/clearances/:id
Update clearance status
\`\`\`json
Body: {
  "status": "approved|rejected|pending",
  "signature": { signature_data },
  "sync_source": "clearme",
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

### 3. Webhook Configuration

Your PHP system should send webhooks to:
\`\`\`
POST /api/php-integration/webhook
\`\`\`

**Webhook Signature Verification:**
- All webhooks include `X-Webhook-Signature` header
- Signature is HMAC-SHA256 of the request body using `PHP_WEBHOOK_SECRET`

### 4. Available Sync Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/php-integration/sync-student` | POST | Sync student to PHP |
| `/api/php-integration/sync-clearance` | POST | Sync clearance to PHP |
| `/api/php-integration/webhook` | POST | Receive updates from PHP |
| `/api/php-integration/sync-logs` | GET | View sync history |
| `/api/php-integration/test` | POST | Test PHP connection |
| `/api/php-integration/sync-all` | POST | Trigger full sync |

## Data Format Mapping

### Student Data

**Next.js Format → PHP Format**
\`\`\`javascript
{
  id: "123" → student_id: "123"
  firstName: "John" → first_name: "John"
  lastName: "Doe" → last_name: "Doe"
  fullName: "John Doe" → full_name: "John Doe"
  // ... and so on
}
\`\`\`

### Clearance Data

**Next.js Format → PHP Format**
\`\`\`javascript
{
  id: "CLR-1" → clearance_id: "CLR-1"
  department: "Finance" → department: "Finance"
  status: "approved" → status: "approved"
  signedDate: "2025-01-01T00:00:00Z" → signed_date: "2025-01-01T00:00:00Z"
  // ... and so on
}
\`\`\`

## Webhook Events

Your PHP system can trigger these events:

### student.updated
Student information has been updated in PHP system
\`\`\`json
{
  "event": "student.updated",
  "data": { "student": {...} },
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

### clearance.approved
Clearance has been approved in PHP system
\`\`\`json
{
  "event": "clearance.approved",
  "data": { "clearance": {...} },
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

### clearance.rejected
Clearance has been rejected in PHP system
\`\`\`json
{
  "event": "clearance.rejected",
  "data": { "clearance": {...}, "reason": "..." },
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

### signature.received
New signature received from PHP system
\`\`\`json
{
  "event": "signature.received",
  "data": { "signature": {...} },
  "timestamp": "2025-01-01T00:00:00Z"
}
\`\`\`

## Monitoring

Access the PHP Integration Manager at `/admin/php-integration` to:
- Monitor sync status and history
- View sync statistics
- Test PHP connection
- Trigger manual syncs
- View detailed sync logs

## Troubleshooting

### Connection Failed
- Verify `PHP_SYSTEM_URL` is correct and accessible
- Check `PHP_API_KEY` and `PHP_API_SECRET`
- Ensure PHP system is running and responsive

### Sync Failures
- Check sync logs for error messages
- Verify webhook secret matches on both systems
- Ensure data format is correct

### Missing Data
- Verify sync type is enabled in configuration
- Check if data exists in the source system
- Review sync logs for any filtering issues

## Production Deployment

1. Replace in-memory sync logs with database storage
2. Implement retry logic for failed syncs
3. Add rate limiting for API endpoints
4. Secure API keys using Vercel environment variables
5. Enable HTTPS for all communications
6. Add comprehensive error handling and alerting
