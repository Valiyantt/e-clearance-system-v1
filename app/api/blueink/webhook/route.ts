import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    console.log("[BlueInk Webhook] Event received:", payload)

    const { bundleId, eventType, signerEmail, status } = payload

    if (eventType === "bundle.completed" || eventType === "bundle.signed") {
      // Update clearance status in your database
      console.log(`[BlueInk] Bundle ${bundleId} completed by ${signerEmail}`)

      // TODO: Update your database to mark clearance as signed
      // await updateClearanceStatus(bundleId, 'signed')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
