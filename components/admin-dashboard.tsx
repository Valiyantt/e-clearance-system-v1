"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Download,
  Eye,
  Users,
  FileText,
  Clock,
  CheckCircle,
  LinkIcon,
  Send,
  Settings,
  Plus,
  Edit,
} from "lucide-react"

interface Student {
  id: string
  fullName: string
  studentId: string
  program: string
  yearLevel: string
  email: string
  submittedDate: string
  status: "pending" | "in-progress" | "completed" | "signed"
  approvedCount: number
  totalRequired: number
  uniqueToken: string
  paymentStatus: "cleared" | "pending" | "overdue"
  lastAccessed?: string
}

interface ClearanceAction {
  studentId: string
  department: string
  action: "approve" | "reject" | "require_payment"
  remarks?: string
  paymentAmount?: number
}

export function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showLinkGenerator, setShowLinkGenerator] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [actionData, setActionData] = useState<ClearanceAction>({
    studentId: "",
    department: "",
    action: "approve",
  })

  const mockStudents: Student[] = [
    {
      id: "1",
      fullName: "Alanna Froam Torie Co",
      studentId: "2021-001",
      program: "BSIT",
      yearLevel: "3rd year",
      email: "alanna.torie@student.smcl.edu.ph",
      submittedDate: "2025-01-15",
      status: "in-progress",
      approvedCount: 3,
      totalRequired: 5,
      uniqueToken: "abc123def456",
      paymentStatus: "cleared",
      lastAccessed: "2025-01-16T10:30:00Z",
    },
    {
      id: "2",
      fullName: "John Doe",
      studentId: "2021-002",
      program: "BSBA",
      yearLevel: "4th year",
      email: "john.doe@student.smcl.edu.ph",
      submittedDate: "2025-01-14",
      status: "completed",
      approvedCount: 5,
      totalRequired: 5,
      uniqueToken: "xyz789abc123",
      paymentStatus: "cleared",
      lastAccessed: "2025-01-15T14:20:00Z",
    },
    {
      id: "3",
      fullName: "Jane Smith",
      studentId: "2021-003",
      program: "BSED",
      yearLevel: "2nd year",
      email: "jane.smith@student.smcl.edu.ph",
      submittedDate: "2025-01-16",
      status: "pending",
      approvedCount: 0,
      totalRequired: 5,
      uniqueToken: "def456ghi789",
      paymentStatus: "pending",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "signed":
        return <Badge className="bg-blue-100 text-blue-800">Signed</Badge>
      case "in-progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
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

  const generateUniqueLink = (token: string) => {
    return `${window.location.origin}/clearance/${token}`
  }

  const handleSendLink = async (student: Student) => {
    const link = generateUniqueLink(student.uniqueToken)

    // Simulate sending email
    console.log(`Sending clearance link to ${student.email}: ${link}`)

    // Here you would integrate with your email service
    alert(`Clearance link sent to ${student.email}`)
  }

  const handleClearanceAction = async () => {
    console.log("Processing clearance action:", actionData)

    // Here you would update the database
    alert(`Action processed for ${actionData.department}`)
    setShowActionModal(false)
  }

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || student.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: mockStudents.length,
    pending: mockStudents.filter((s) => s.status === "pending").length,
    inProgress: mockStudents.filter((s) => s.status === "in-progress").length,
    completed: mockStudents.filter((s) => s.status === "completed").length,
    signed: mockStudents.filter((s) => s.status === "signed").length,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Management Center</h1>
          <p className="text-gray-600">Digital Clearance System - Saint Michael's College of Laguna</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowLinkGenerator(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Generate Links
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">E-Signed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.signed}</p>
              </div>
              <Edit className="h-8 w-8 text-purple-600" />
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
                  placeholder="Search by name, student ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="signed">E-Signed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Clearances</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Accessed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
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
                      <p className="text-sm text-gray-600">{student.yearLevel}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">
                        {student.approvedCount}/{student.totalRequired}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(student.approvedCount / student.totalRequired) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getPaymentBadge(student.paymentStatus)}</TableCell>
                  <TableCell>{getStatusBadge(student.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {student.lastAccessed ? new Date(student.lastAccessed).toLocaleDateString() : "Never"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleSendLink(student)}>
                        <Send className="h-3 w-3 mr-1" />
                        Send Link
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActionData({ ...actionData, studentId: student.studentId })
                          setShowActionModal(true)
                        }}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Student Clearance Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="font-medium">{selectedStudent.fullName}</p>
                </div>
                <div>
                  <Label>Student ID</Label>
                  <p className="font-medium">{selectedStudent.studentId}</p>
                </div>
                <div>
                  <Label>Program</Label>
                  <p className="font-medium">{selectedStudent.program}</p>
                </div>
                <div>
                  <Label>Year Level</Label>
                  <p className="font-medium">{selectedStudent.yearLevel}</p>
                </div>
              </div>

              <div>
                <Label>Unique Access Link</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={generateUniqueLink(selectedStudent.uniqueToken)}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generateUniqueLink(selectedStudent.uniqueToken))
                      alert("Link copied to clipboard!")
                    }}
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => handleSendLink(selectedStudent)}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Link to Student
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(generateUniqueLink(selectedStudent.uniqueToken), "_blank")}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Clearance
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Clearance Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Clearance Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="department">Department</Label>
              <Select
                value={actionData.department}
                onValueChange={(value) => setActionData({ ...actionData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business-services">Business Services Officer</SelectItem>
                  <SelectItem value="library">Chief Librarian</SelectItem>
                  <SelectItem value="ccsc">CCSC Personnel</SelectItem>
                  <SelectItem value="chair">Chair/Administrator</SelectItem>
                  <SelectItem value="registrar">College Registrar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="action">Action</Label>
              <Select
                value={actionData.action}
                onValueChange={(value: "approve" | "reject" | "require_payment") =>
                  setActionData({ ...actionData, action: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="require_payment">Require Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {actionData.action === "require_payment" && (
              <div>
                <Label htmlFor="paymentAmount">Payment Amount (₱)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={actionData.paymentAmount || ""}
                  onChange={(e) => setActionData({ ...actionData, paymentAmount: Number.parseFloat(e.target.value) })}
                  placeholder="Enter amount"
                />
              </div>
            )}

            <div>
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={actionData.remarks || ""}
                onChange={(e) => setActionData({ ...actionData, remarks: e.target.value })}
                placeholder="Add any remarks or notes"
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowActionModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleClearanceAction}>Process Action</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
