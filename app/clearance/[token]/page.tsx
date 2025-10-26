import { DigitalClearanceDocument } from "@/components/digital-clearance-document"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    token: string
  }
}

// Mock function to fetch student data by token
async function getStudentByToken(token: string) {
  const mockStudents = {
    abc123def456: {
      id: "2021-001",
      firstName: "Alanna Froam",
      lastName: "Torie Co",
      fullName: "Alanna Froam Torie Co",
      program: "BSIT",
      section: "3A",
      yearLevel: "3rd year",
      email: "alanna.torie@student.smcl.edu.ph",
      contactNumber: "+63 912 345 6789",
      address: "123 Main St, Biñan, Laguna",
      enrollmentDate: "2021-08-15",
      expectedGraduation: "2025-04-30",
      paymentStatus: "cleared",
      clearanceId: "CLR-2025-001",
      submittedDate: "2025-01-15T10:30:00Z",
      lastUpdated: "2025-01-16T14:20:00Z",
      currentDate: "05/27/2025",
    },
  }

  return mockStudents[token as keyof typeof mockStudents] || null
}

export default async function StudentClearancePage({ params }: PageProps) {
  const student = await getStudentByToken(params.token)

  if (!student) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <DigitalClearanceDocument student={student} token={params.token} />
    </div>
  )
}
