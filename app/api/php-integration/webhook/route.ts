/**
 * Webhook Receiver from PHP System
 * Receives updates from PHP system and updates local clearance data
 */

import { type NextRequest, NextResponse } from "next/server"
import { mapStudentFromPhp, mapClearanceFromPhp } from "@/lib/php-integration-mapper"

// Verify webhook signature (implement proper HMAC verification in production)
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const crypto = require("crypto")
  const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return signature === expectedSignature
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-webhook-signature") || ""
    const secret = process.env.PHP_WEBHOOK_SECRET || ""

    const body = await request.text()

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)
    const { event, data, timestamp } = payload

    console.log("[v0] PHP Webhook received:", { event, timestamp })

    // Handle different webhook events
    switch (event) {
      case "student.updated":
        // Handle student update from PHP
        const updatedStudent = mapStudentFromPhp(data.student)
        console.log("[v0] Student updated from PHP:", updatedStudent)
        // TODO: Update local database or state
        break

      case "clearance.approved":
        // Handle clearance approval from PHP
        const approvedClearance = mapClearanceFromPhp(data.clearance)
        console.log("[v0] Clearance approved from PHP:", approvedClearance)
        // TODO: Update local database or state
        break

      case "clearance.rejected":
        // Handle clearance rejection from PHP
        const rejectedClearance = mapClearanceFromPhp(data.clearance)
        console.log("[v0] Clearance rejected from PHP:", rejectedClearance)
        // TODO: Update local database or state
        break

      case "signature.received":
        // Handle new signature from PHP
        console.log("[v0] Signature received from PHP:", data.signature)
        // TODO: Update signature in local system
        break

      default:
        console.log("[v0] Unknown webhook event:", event)
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      processed_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process webhook",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
