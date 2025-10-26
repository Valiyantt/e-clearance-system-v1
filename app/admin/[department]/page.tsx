import { DepartmentDashboard } from "@/components/department-dashboard"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    department: string
  }
}

const validDepartments = ["cashier", "library", "guidance", "clinic", "registrar"]

export default function DepartmentPage({ params }: PageProps) {
  if (!validDepartments.includes(params.department)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DepartmentDashboard department={params.department} />
    </div>
  )
}
