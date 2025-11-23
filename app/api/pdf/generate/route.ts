import { type NextRequest, NextResponse } from "next/server"
import { getSignedDocument } from "@/lib/blueink-pdf-utils"

export async function POST(request: NextRequest) {
  try {
    const { studentName, clearanceId, departments, blueinkBundles } = await request.json()

    console.log("[PDF Generation] Starting with student:", studentName)

    const allSignatures = []

    // Add traditional signatures
    departments.forEach((dept: any) => {
      if (dept.signature) {
        allSignatures.push({
          type: "manual",
          department: dept.name,
          officer: dept.officer,
          signature: dept.signature,
          signedAt: dept.signedAt,
        })
      }
    })

    for (const bundle of blueinkBundles || []) {
      if (bundle.status === "completed") {
        try {
          const signedDoc = await getSignedDocument(bundle.bundleId)
          allSignatures.push({
            type: "blueink",
            bundleId: bundle.bundleId,
            signers: signedDoc.signerInfo,
            downloadUrl: signedDoc.downloadUrl,
          })
        } catch (error) {
          console.error("Error fetching BlueInk document:", error)
        }
      }
    }

    // Generate PDF with combined signatures
    const pdfData = {
      studentName,
      clearanceId,
      generatedAt: new Date().toISOString(),
      signatures: allSignatures,
      signatureCount: allSignatures.length,
    }

    console.log("[PDF Generation] Signatures collected:", pdfData.signatureCount)

    // In a real app, you would use a PDF library here to embed signatures
    // For now, return a simple response with signature metadata
    const downloadUrl = `/api/pdf/download/${Buffer.from(JSON.stringify(pdfData)).toString("base64")}`

    return NextResponse.json({
      success: true,
      downloadUrl,
      signatureCount: allSignatures.length,
      blueinkSignatures: allSignatures.filter((s) => s.type === "blueink").length,
      manualSignatures: allSignatures.filter((s) => s.type === "manual").length,
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
