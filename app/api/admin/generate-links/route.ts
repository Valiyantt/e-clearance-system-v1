import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { studentIds, sendEmail } = body

    const generatedLinks = []

    for (const studentId of studentIds) {
      const uniqueToken = generateUniqueToken()
      const clearanceLink = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/clearance/${uniqueToken}`

      // Here you would save the token to your database and associate it with the student
      const linkRecord = {
        studentId,
        uniqueToken,
        clearanceLink,
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        isActive: true,
      }

      generatedLinks.push(linkRecord)

      // If sendEmail is true, send the link to the student
      if (sendEmail) {
        // Here you would integrate with your email service
        console.log(`Sending clearance link to student ${studentId}: ${clearanceLink}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: generatedLinks,
      message: `Generated ${generatedLinks.length} clearance links`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to generate clearance links" }, { status: 500 })
  }
}

function generateUniqueToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
