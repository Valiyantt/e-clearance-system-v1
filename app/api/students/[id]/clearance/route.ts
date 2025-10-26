import { type NextRequest, NextResponse } from "next/server"

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const studentId = params.id

    // Mock student data - in production, this would query your database
    const mockStudent = {
      id: studentId,
      firstName: "Alanna Froam",
      lastName: "Torie Co",
      fullName: "Alanna Froam Torie Co",
      program: "Bachelor of Science in Information Technology",
      section: "BSIT-3A",
      yearLevel: "3rd Year",
      email: "alanna.torie@student.smcl.edu.ph",
      contactNumber: "+63 912 345 6789",
      address: "123 Main St, Biñan, Laguna",
      enrollmentDate: "2021-08-15",
      expectedGraduation: "2025-04-30",
      paymentStatus: "cleared",
      clearanceId: `CLR-2025-${studentId.padStart(3, "0")}`,
      submittedDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      uniqueToken: generateUniqueToken(),
    }

    const clearanceItems = [
      {
        id: "1",
        department: "Business Services Officer",
        officer: "Ms. Maria Santos",
        description: "Financial obligations and fees",
        status: mockStudent.paymentStatus === "cleared" ? "approved" : "requires_payment",
        paymentAmount: mockStudent.paymentStatus === "cleared" ? 0 : 2500,
        signedDate: mockStudent.paymentStatus === "cleared" ? new Date().toISOString() : undefined,
      },
      {
        id: "2",
        department: "Chief Librarian",
        officer: "Mr. Jose Dela Cruz",
        description: "Library books and materials",
        status: "approved",
        signedDate: new Date().toISOString(),
      },
      {
        id: "3",
        department: "CCSC Personnel",
        officer: "Ms. Ana Reyes",
        description: "Student activities and organizations",
        status: "pending",
      },
      {
        id: "4",
        department: "Chair/Administrator",
        officer: "Dr. Roberto Martinez",
        description: "Academic requirements and thesis",
        status: "pending",
      },
      {
        id: "5",
        department: "College Registrar",
        officer: "Ms. Carmen Lopez",
        description: "Academic records and transcripts",
        status: "pending",
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        student: mockStudent,
        clearanceItems,
        uniqueLink: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/clearance/${mockStudent.uniqueToken}`,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch student clearance data" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const studentId = params.id
    const body = await request.json()

    // Here you would update the clearance status in your database
    console.log(`Updating clearance for student ${studentId}:`, body)

    return NextResponse.json({
      success: true,
      message: "Clearance updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to update clearance" }, { status: 500 })
  }
}

function generateUniqueToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
