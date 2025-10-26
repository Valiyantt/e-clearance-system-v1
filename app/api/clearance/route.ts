import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Here you would typically save to a database
    // For now, we'll just return a success response

    const clearanceRequest = {
      id: Date.now().toString(),
      ...body,
      submittedDate: new Date().toISOString(),
      status: "pending",
      approvedCount: 0,
      totalRequired: 5,
    }

    return NextResponse.json({
      success: true,
      data: clearanceRequest,
      message: "Clearance request submitted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to submit clearance request" }, { status: 500 })
  }
}

export async function GET() {
  // Mock data for demonstration
  const clearanceRequests = [
    {
      id: "1",
      studentName: "Alanna Froam Torie Co",
      studentId: "2021-001",
      program: "BSIT",
      yearLevel: "3rd year",
      submittedDate: "2025-01-15",
      status: "in-progress",
      approvedCount: 3,
      totalRequired: 5,
    },
  ]

  return NextResponse.json({
    success: true,
    data: clearanceRequests,
  })
}
