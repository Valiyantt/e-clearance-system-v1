# BlueInk Integration Setup Guide

## Environment Variables Required

Add the following to your Vercel environment variables:

\`\`\`
BLUEINK_PRIVATE_API_KEY=your_private_api_key_here
\`\`\`

## Getting Your API Key

1. Sign up for BlueInk at https://www.blueink.com
2. Go to Developer Settings in your BlueInk account
3. Create a new API key
4. Copy the Private API Key and add it to your Vercel environment

## How It Works

1. **Student initiates clearance** - Student starts the clearance process
2. **Bundle created** - A BlueInk bundle is created with the clearance document and faculty/student signers
3. **Email sent** - BlueInk sends signature request emails to all parties
4. **Signature collected** - Parties sign the document through BlueInk's secure interface
5. **Webhook notification** - BlueInk notifies your app when signing is complete
6. **Clearance updated** - System updates clearance status to "signed" with embedded signatures

## API Endpoints

- `POST /api/blueink/create-bundle` - Create a new signature bundle
- `POST /api/blueink/webhook` - Receive webhook notifications from BlueInk

## Files Modified

- `lib/blueink.ts` - BlueInk client initialization and utilities
- `app/api/blueink/create-bundle/route.ts` - Create signature bundle endpoint
- `app/api/blueink/webhook/route.ts` - Handle BlueInk webhook events
