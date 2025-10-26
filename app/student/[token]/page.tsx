import { StudentClearanceDashboard } from "@/components/student-clearance-dashboard"
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
      id: "2024-001",
      firstName: "Maria",
      lastName: "Santos",
      fullName: "Maria Santos",
      program: "Bachelor of Science in Information Technology",
      section: "BSIT-4A",
      yearLevel: "4th Year",
      email: "maria.santos@student.smcl.edu.ph",
      contactNumber: "+63 912 345 6789",
      address: "123 Main St, Biñan, Laguna",
      semester: "2nd Semester",
      academicYear: "2024-2025",
      clearanceId: "CLR-2025-001",
      submittedDate: "2025-01-15T10:30:00Z",
      lastUpdated: "2025-01-16T14:20:00Z",
      expiresAt: "2025-02-15T23:59:59Z",
      qrCode:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
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
    <div className="min-h-screen bg-gray-50">
      <StudentClearanceDashboard student={student} token={params.token} />
    </div>
  )
}
