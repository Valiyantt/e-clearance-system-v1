import { getBlueinkClient } from "@/lib/blueink"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { studentEmail, studentName, department, documentUrl } = await request.json()

    if (!studentEmail || !studentName || !department || !documentUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = getBlueinkClient()

    const bundle = await client.bundles.create({
      signers: [
        {
          email: studentEmail,
          name: studentName,
          signerType: "signer",
        },
      ],
      documents: [
        {
          url: documentUrl,
          name: `${studentName}_Clearance_${department}.pdf`,
        },
      ],
      webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/blueink/webhook`,
      tags: {
        department,
        studentName,
        type: "clearance",
      },
    })

    return NextResponse.json({
      bundleId: bundle.id,
      signatureLink: bundle.signerDownloadLink,
      status: "created",
    })
  } catch (error) {
    console.error("BlueInk bundle creation error:", error)
    return NextResponse.json({ error: "Failed to create signature bundle" }, { status: 500 })
  }
}
