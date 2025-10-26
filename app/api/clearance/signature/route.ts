import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clearanceId,
      studentName,
      studentSignature,
      witnessName,
      signatureDate,
      remarks,
      signatureImage,
      timestamp,
    } = body

    // Here you would save the signature data to your database
    const signatureRecord = {
      id: Date.now().toString(),
      clearanceId,
      studentName,
      studentSignature,
      witnessName,
      signatureDate,
      remarks,
      signatureImage,
      timestamp,
      ipAddress: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    }

    console.log("Saving e-signature:", signatureRecord)

    // Update clearance status to "signed"
    // In production, you would update your database here

    return NextResponse.json({
      success: true,
      data: signatureRecord,
      message: "E-signature submitted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to submit e-signature" }, { status: 500 })
  }
}
