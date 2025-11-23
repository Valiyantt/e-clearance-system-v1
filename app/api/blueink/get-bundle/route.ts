import { getBlueinkClient } from "@/lib/blueink"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const bundleId = searchParams.get("bundleId")

    if (!bundleId) {
      return NextResponse.json({ error: "Bundle ID is required" }, { status: 400 })
    }

    const client = getBlueinkClient()

    const bundle = await client.bundles.get(bundleId)

    return NextResponse.json({
      bundleId: bundle.id,
      status: bundle.status,
      signers: bundle.signers,
      completedAt: bundle.completedAt,
      downloadUrl: bundle.signerDownloadLink,
    })
  } catch (error) {
    console.error("Error fetching bundle:", error)
    return NextResponse.json({ error: "Failed to fetch bundle" }, { status: 500 })
  }
}
