"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ESignatureManager } from "@/components/e-signature-manager"
import { BulkApprovalModal } from "@/components/bulk-approval-modal"
import {
  Search,
  Filter,
  Download,
  Eye,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Upload,
  FileSignature,
  UserCheck,
  LogOut,
} from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  fullName: string
  studentId: string
  program: string
  yearLevel: string
  section: string
  email: string
  submittedDate: string
  status: "pending" | "approved" | "overdue"
  lastAccessed?: string
  expiresAt: string
  clearanceToken: string
  priority: "high" | "medium" | "low"
}

interface DepartmentInfo {
  id: string
  name: string
  fullName: string
  officer: string
  email: string
  description: string
}

const departmentData: Record<string, DepartmentInfo> = {
  cashier: {
    id: "cashier",
    name: "Cashier",
    fullName: "Cashier's Office",
    officer: "Ms. Ana Reyes",
    email: "cashier@smcl.edu.ph",
    description: "Financial Services & Payment Processing",
  },
  library: {
    id: "library",
    name: "Library",
    fullName: "Library Services",
    officer: "Mr. Jose Dela Cruz",
    email: "library@smcl.edu.ph",
    description: "Library Resources & Book Management",
  },
  guidance: {
    id: "guidance",
    name: "Guidance",
    fullName: "Guidance Office",
    officer: "Dr. Carmen Lopez",
    email: "guidance@smcl.edu.ph",
    description: "Student Counseling & Support Services",
  },
  clinic: {
    id: "clinic",
    name: "Clinic",
    fullName: "Health Services",
    officer: "Nurse Maria Garcia",
    email: "clinic@smcl.edu.ph",
    description: "Health Services & Medical Records",
  },
  registrar: {
    id: "registrar",
    name: "Registrar",
    fullName: "Registrar's Office",
    officer: "Ms. Rosa Martinez",
    email: "registrar@smcl.edu.ph",
    description: "Academic Records & Registration",
  },
}

interface DepartmentDashboardProps {
  department: string
}

export function DepartmentDashboard({ department }: DepartmentDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showSignatureManager, setShowSignatureManager] = useState(false)
  const [showBulkApproval, setShowBulkApproval] = useState(false)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [hasSignature, setHasSignature] = useState(true) // Mock - would check if signature exists

  const deptInfo = departmentData[department]

  // Mock student data - in real app, this would be filtered by department
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      fullName: "Maria Santos",
      studentId: "2024-001",
      program: "BSIT",
      yearLevel: "4th Year",
      section: "4A",
      email: "maria.santos@student.smcl.edu.ph",
      submittedDate: "2025-01-15",
      status: "pending",
      lastAccessed: "2025-01-16T10:30:00Z",
      expiresAt: "2025-02-15T23:59:59Z",
      clearanceToken: "abc123def456",
      priority: "high",
    },
    {
      id: "2",
      fullName: "John Doe",
      studentId: "2024-002",
      program: "BSBA",
      yearLevel: "3rd Year",
      section: "3B",
      email: "john.doe@student.smcl.edu.ph",
      submittedDate: "2025-01-14",
      status: "approved",
      lastAccessed: "2025-01-15T14:20:00Z",
      expiresAt: "2025-02-14T23:59:59Z",
      clearanceToken: "xyz789abc123",
      priority: "medium",
    },
    {
      id: "3",
      fullName: "Jane Smith",
      studentId: "2024-003",
      program: "BSED",
      yearLevel: "2nd Year",
      section: "2C",
      email: "jane.smith@student.smcl.edu.ph",
      submittedDate: "2025-01-10",
      status: "overdue",
      lastAccessed: "2025-01-12T09:15:00Z",
      expiresAt: "2025-02-10T23:59:59Z",
      clearanceToken: "def456ghi789",
      priority: "high",
    },
    {
      id: "4",
      fullName: "Carlos Rodriguez",
      studentId: "2024-004",
      program: "BSCRIM",
      yearLevel: "1st Year",
      section: "1A",
      email: "carlos.rodriguez@student.smcl.edu.ph",
      submittedDate: "2025-01-16",
      status: "pending",
      expiresAt: "2025-02-16T23:59:59Z",
      clearanceToken: "ghi789jkl012",
      priority: "low",
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge variant="destructive" className="text-xs">
            High
          </Badge>
        )
      case "medium":
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Medium</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            Low
          </Badge>
        )
    }
  }

  const handleApprove = async (studentId: string) => {
    if (!hasSignature) {
      alert("Please upload your e-signature first before approving clearances.")
      setShowSignatureManager(true)
      return
    }

    setStudents((prev) =>
      prev.map((student) => (student.id === studentId ? { ...student, status: "approved" as const } : student)),
    )
  }

  const handleBulkApprove = async (studentIds: string[]) => {
    if (!hasSignature) {
      alert("Please upload your e-signature first before approving clearances.")
      setShowSignatureManager(true)
      return
    }

    setStudents((prev) =>
      prev.map((student) => (studentIds.includes(student.id) ? { ...student, status: "approved" as const } : student)),
    )
    setSelectedStudents([])
    setShowBulkApproval(false)
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    const matchesPriority = priorityFilter === "all" || student.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const stats = {
    total: students.length,
    pending: students.filter((s) => s.status === "pending").length,
    approved: students.filter((s) => s.status === "approved").length,
    overdue: students.filter((s) => s.status === "overdue").length,
  }

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileSignature className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{deptInfo.fullName}</h1>
                <p className="text-sm text-gray-600">
                  {deptInfo.officer} • {deptInfo.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowSignatureManager(true)} variant="outline" size="sm" className="bg-white">
                <Settings className="h-4 w-4 mr-2" />
                E-Signature
              </Button>
              <Link href="/admin">
                <Button variant="outline" size="sm" className="bg-white">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Signature Status Alert */}
        {!hasSignature && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Upload className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Action Required:</strong> Please upload your official e-signature before approving student
              clearances.
              <Button
                onClick={() => setShowSignatureManager(true)}
                variant="outline"
                size="sm"
                className="ml-3 bg-white"
              >
                Upload Signature
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
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
                  <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {selectedStudents.length > 0 && (
                  <Button onClick={() => setShowBulkApproval(true)} className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Bulk Approve ({selectedStudents.length})
                  </Button>
                )}
                <Button variant="outline" className="bg-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Clearance Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudents.length === filteredStudents.filter((s) => s.status === "pending").length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(filteredStudents.filter((s) => s.status === "pending").map((s) => s.id))
                        } else {
                          setSelectedStudents([])
                        }
                      }}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.status === "pending" && (
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="rounded"
                        />
                      )}
                    </TableCell>
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
                          {student.yearLevel} - {student.section}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(student.priority)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {getStatusBadge(student.status)}
                        {student.lastAccessed && (
                          <p className="text-xs text-gray-500">
                            Last seen: {new Date(student.lastAccessed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(student.expiresAt).toLocaleDateString()}
                        {new Date(student.expiresAt) < new Date() && <p className="text-xs text-red-600">Expired</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/student/${student.clearanceToken}`, "_blank")}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {student.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleApprove(student.id)}
                            disabled={!hasSignature}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </Button>
                        )}
                        {student.status === "approved" && (
                          <Button variant="outline" size="sm" disabled>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* E-Signature Manager Modal */}
      <ESignatureManager
        isOpen={showSignatureManager}
        onClose={() => setShowSignatureManager(false)}
        department={deptInfo}
        onSignatureUploaded={() => setHasSignature(true)}
      />

      {/* Bulk Approval Modal */}
      <BulkApprovalModal
        isOpen={showBulkApproval}
        onClose={() => setShowBulkApproval(false)}
        selectedStudents={selectedStudents.map((id) => students.find((s) => s.id === id)!)}
        onApprove={handleBulkApprove}
        department={deptInfo}
      />
    </div>
  )
}
