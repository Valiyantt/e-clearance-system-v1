"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FacultySignatureModal } from "@/components/faculty-signature-modal"
import { BlueinkSignatureModal } from "@/components/blueink-signature-modal"
import {
  Mail,
  Search,
  Filter,
  Download,
  Eye,
  Users,
  Clock,
  CheckCircle,
  PenTool,
  AlertCircle,
  CreditCard,
} from "lucide-react"

interface Student {
  id: string
  fullName: string
  studentId: string
  program: string
  yearLevel: string
  section: string
  email: string
  submittedDate: string
  status: "pending" | "in-progress" | "completed"
  paymentStatus: "cleared" | "pending" | "overdue"
  clearanceItems: ClearanceItem[]
  uniqueToken: string
}

interface ClearanceItem {
  id: string
  department: string
  officer: string
  status: "pending" | "approved" | "rejected" | "requires_payment"
  signedDate?: string
  signature?: string
  remarks?: string
  paymentAmount?: number
}

export function FacultyAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [showBlueinkModal, setShowBlueinkModal] = useState(false)
  const [useBlueink, setUseBlueink] = useState(false)
  const [selectedClearanceItem, setSelectedClearanceItem] = useState<{
    student: Student
    item: ClearanceItem
  } | null>(null)

  const currentUserDepartment = "Business Services Officer"
  const currentUserName = "Ms. Maria Santos"

  const mockStudents: Student[] = [
    {
      id: "1",
      fullName: "Alanna Froam Torie Co",
      studentId: "2021-001",
      program: "BSIT",
      yearLevel: "3rd year",
      section: "3A",
      email: "alanna.torie@student.smcl.edu.ph",
      submittedDate: "2025-01-15",
      status: "in-progress",
      paymentStatus: "cleared",
      uniqueToken: "abc123def456",
      clearanceItems: [
        {
          id: "1",
          department: "Business Services Officer",
          officer: "Ms. Maria Santos",
          status: "approved",
          signedDate: "2025-01-15T09:00:00Z",
          signature: "Maria Santos",
        },
        {
          id: "2",
          department: "Chief Librarian",
          officer: "Mr. Jose Dela Cruz",
          status: "pending",
        },
        {
          id: "3",
          department: "CCSC Personnel",
          officer: "Ms. Ana Reyes",
          status: "pending",
        },
        {
          id: "4",
          department: "Chair/Administrator",
          officer: "Dr. Roberto Martinez",
          status: "pending",
        },
        {
          id: "5",
          department: "College Registrar",
          officer: "Ms. Carmen Lopez",
          status: "pending",
        },
      ],
    },
    {
      id: "2",
      fullName: "John Doe",
      studentId: "2021-002",
      program: "BSBA",
      yearLevel: "4th year",
      section: "4B",
      email: "john.doe@student.smcl.edu.ph",
      submittedDate: "2025-01-14",
      status: "pending",
      paymentStatus: "pending",
      uniqueToken: "xyz789abc123",
      clearanceItems: [
        {
          id: "1",
          department: "Business Services Officer",
          officer: "Ms. Maria Santos",
          status: "requires_payment",
          paymentAmount: 2500,
          remarks: "Outstanding tuition balance",
        },
        {
          id: "2",
          department: "Chief Librarian",
          officer: "Mr. Jose Dela Cruz",
          status: "pending",
        },
        {
          id: "3",
          department: "CCSC Personnel",
          officer: "Ms. Ana Reyes",
          status: "pending",
        },
        {
          id: "4",
          department: "Chair/Administrator",
          officer: "Dr. Roberto Martinez",
          status: "pending",
        },
        {
          id: "5",
          department: "College Registrar",
          officer: "Ms. Carmen Lopez",
          status: "pending",
        },
      ],
    },
    {
      id: "3",
      fullName: "Jane Smith",
      studentId: "2021-003",
      program: "BSED",
      yearLevel: "2nd year",
      section: "2C",
      email: "jane.smith@student.smcl.edu.ph",
      submittedDate: "2025-01-16",
      status: "pending",
      paymentStatus: "cleared",
      uniqueToken: "def456ghi789",
      clearanceItems: [
        {
          id: "1",
          department: "Business Services Officer",
          officer: "Ms. Maria Santos",
          status: "pending",
        },
        {
          id: "2",
          department: "Chief Librarian",
          officer: "Mr. Jose Dela Cruz",
          status: "pending",
        },
        {
          id: "3",
          department: "CCSC Personnel",
          officer: "Ms. Ana Reyes",
          status: "pending",
        },
        {
          id: "4",
          department: "Chair/Administrator",
          officer: "Dr. Roberto Martinez",
          status: "pending",
        },
        {
          id: "5",
          department: "College Registrar",
          officer: "Ms. Carmen Lopez",
          status: "pending",
        },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "requires_payment":
        return <Badge className="bg-orange-100 text-orange-800">Payment Required</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "cleared":
        return <Badge className="bg-green-100 text-green-800">Cleared</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
    }
  }

  const handleSignClearance = (student: Student, item: ClearanceItem, useBlueinkSigning = false) => {
    setSelectedClearanceItem({ student, item })
    setUseBlueink(useBlueinkSigning)
    if (useBlueinkSigning) {
      setShowBlueinkModal(true)
    } else {
      setShowSignatureModal(true)
    }
  }

  const handleSignatureComplete = (signatureData: any) => {
    if (selectedClearanceItem) {
      console.log("Signature completed:", signatureData)
      setShowSignatureModal(false)
      setShowBlueinkModal(false)
      setSelectedClearanceItem(null)
    }
  }

  const myDepartmentStudents = mockStudents.filter((student) =>
    student.clearanceItems.some((item) => item.department === currentUserDepartment),
  )

  const filteredStudents = myDepartmentStudents.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())

    if (departmentFilter === "all") return matchesSearch

    const myItem = student.clearanceItems.find((item) => item.department === currentUserDepartment)
    return matchesSearch && myItem?.status === departmentFilter
  })

  const myDepartmentStats = {
    total: myDepartmentStudents.length,
    pending: myDepartmentStudents.filter((s) =>
      s.clearanceItems.some((item) => item.department === currentUserDepartment && item.status === "pending"),
    ).length,
    approved: myDepartmentStudents.filter((s) =>
      s.clearanceItems.some((item) => item.department === currentUserDepartment && item.status === "approved"),
    ).length,
    requiresPayment: myDepartmentStudents.filter((s) =>
      s.clearanceItems.some((item) => item.department === currentUserDepartment && item.status === "requires_payment"),
    ).length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Portal</h1>
          <p className="text-gray-600">
            {currentUserDepartment} - {currentUserName}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Department Info Alert */}
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You are viewing clearance requests for <strong>{currentUserDepartment}</strong>. You can only approve or
          reject clearances for your department. You can now use BlueInk for secure e-signatures.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{myDepartmentStats.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{myDepartmentStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{myDepartmentStats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Payment Required</p>
                <p className="text-2xl font-bold text-red-600">{myDepartmentStats.requiresPayment}</p>
              </div>
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by student name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="requires_payment">Payment Required</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Clearance Requests - {currentUserDepartment}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>My Department Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const myItem = student.clearanceItems.find((item) => item.department === currentUserDepartment)
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-sm text-gray-600">{student.studentId}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{student.program}</p>
                        <p className="text-sm text-gray-600">
                          {student.yearLevel} - Section {student.section}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getPaymentBadge(student.paymentStatus)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(myItem?.status || "pending")}
                        {myItem?.signedDate && (
                          <p className="text-xs text-gray-500">
                            Signed: {new Date(myItem.signedDate).toLocaleDateString()}
                          </p>
                        )}
                        {myItem?.paymentAmount && (
                          <p className="text-xs text-red-600">₱{myItem.paymentAmount.toLocaleString()}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(student.submittedDate).toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/clearance/${student.uniqueToken}`, "_blank")}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {myItem && myItem.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleSignClearance(student, myItem, true)}
                              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                            >
                              <Mail className="h-3 w-3" />
                              BlueInk
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSignClearance(student, myItem, false)}
                              className="flex items-center gap-1"
                            >
                              <PenTool className="h-3 w-3" />
                              Manual
                            </Button>
                          </div>
                        )}
                        {myItem && myItem.status === "approved" && (
                          <Button variant="outline" size="sm" disabled>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Signed
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Faculty Signature Modal */}
      <FacultySignatureModal
        isOpen={showSignatureModal && !useBlueink}
        onClose={() => {
          setShowSignatureModal(false)
          setSelectedClearanceItem(null)
        }}
        onSignatureComplete={handleSignatureComplete}
        student={selectedClearanceItem?.student}
        clearanceItem={selectedClearanceItem?.item}
        facultyName={currentUserName}
        department={currentUserDepartment}
      />

      {/* BlueInk Signature Modal */}
      {selectedClearanceItem && (
        <BlueinkSignatureModal
          isOpen={showBlueinkModal && useBlueink}
          onClose={() => {
            setShowBlueinkModal(false)
            setSelectedClearanceItem(null)
          }}
          onSignatureComplete={handleSignatureComplete}
          student={{
            id: selectedClearanceItem.student.id,
            fullName: selectedClearanceItem.student.fullName,
            email: selectedClearanceItem.student.email,
            studentId: selectedClearanceItem.student.studentId,
          }}
          faculty={{
            name: currentUserName,
            email: "faculty@smcl.edu.ph", // Should come from auth in real app
            department: currentUserDepartment,
          }}
          documentUrl={`${process.env.NEXT_PUBLIC_BASE_URL}/clearance/${selectedClearanceItem.student.uniqueToken}`}
        />
      )}
    </div>
  )
}
