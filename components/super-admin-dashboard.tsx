"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { SystemSettingsModal } from "@/components/system-settings-modal"
import { BulkStudentImport } from "@/components/bulk-student-import"
import { DepartmentManagement } from "@/components/department-management"
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
  FileText,
  BarChart3,
  Shield,
  Database,
  Mail,
  Calendar,
  TrendingUp,
  Activity,
  LogOut,
  Building,
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
  status: "pending" | "in_progress" | "completed" | "expired"
  progress: number
  expiresAt: string
  clearanceToken: string
  departments: DepartmentStatus[]
}

interface DepartmentStatus {
  code: string
  name: string
  status: "pending" | "approved" | "rejected" | "overdue"
  approvedBy?: string
  approvedAt?: string
}

interface DepartmentStats {
  code: string
  name: string
  officer: string
  total: number
  pending: number
  approved: number
  overdue: number
  avgProcessingTime: number
}

export function SuperAdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [showSettings, setShowSettings] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [showDepartmentMgmt, setShowDepartmentMgmt] = useState(false)

  // Mock data - in real app, this would come from API
  const [students] = useState<Student[]>([
    {
      id: "1",
      fullName: "Maria Santos",
      studentId: "2024-001",
      program: "BSIT",
      yearLevel: "4th Year",
      section: "4A",
      email: "maria.santos@student.smcl.edu.ph",
      submittedDate: "2025-01-15",
      status: "in_progress",
      progress: 40,
      expiresAt: "2025-02-15T23:59:59Z",
      clearanceToken: "abc123def456",
      departments: [
        {
          code: "CASHIER",
          name: "Cashier",
          status: "approved",
          approvedBy: "Ms. Ana Reyes",
          approvedAt: "2025-01-15T09:00:00Z",
        },
        {
          code: "LIBRARY",
          name: "Library",
          status: "approved",
          approvedBy: "Mr. Jose Dela Cruz",
          approvedAt: "2025-01-14T14:30:00Z",
        },
        { code: "GUIDANCE", name: "Guidance", status: "pending" },
        { code: "CLINIC", name: "Clinic", status: "pending" },
        { code: "REGISTRAR", name: "Registrar", status: "pending" },
      ],
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
      status: "pending",
      progress: 0,
      expiresAt: "2025-02-14T23:59:59Z",
      clearanceToken: "xyz789abc123",
      departments: [
        { code: "CASHIER", name: "Cashier", status: "pending" },
        { code: "LIBRARY", name: "Library", status: "pending" },
        { code: "GUIDANCE", name: "Guidance", status: "pending" },
        { code: "CLINIC", name: "Clinic", status: "pending" },
        { code: "REGISTRAR", name: "Registrar", status: "pending" },
      ],
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
      status: "completed",
      progress: 100,
      expiresAt: "2025-02-10T23:59:59Z",
      clearanceToken: "def456ghi789",
      departments: [
        {
          code: "CASHIER",
          name: "Cashier",
          status: "approved",
          approvedBy: "Ms. Ana Reyes",
          approvedAt: "2025-01-10T10:00:00Z",
        },
        {
          code: "LIBRARY",
          name: "Library",
          status: "approved",
          approvedBy: "Mr. Jose Dela Cruz",
          approvedAt: "2025-01-11T11:00:00Z",
        },
        {
          code: "GUIDANCE",
          name: "Guidance",
          status: "approved",
          approvedBy: "Dr. Carmen Lopez",
          approvedAt: "2025-01-12T12:00:00Z",
        },
        {
          code: "CLINIC",
          name: "Clinic",
          status: "approved",
          approvedBy: "Nurse Maria Garcia",
          approvedAt: "2025-01-13T13:00:00Z",
        },
        {
          code: "REGISTRAR",
          name: "Registrar",
          status: "approved",
          approvedBy: "Ms. Rosa Martinez",
          approvedAt: "2025-01-14T14:00:00Z",
        },
      ],
    },
  ])

  const departmentStats: DepartmentStats[] = [
    {
      code: "CASHIER",
      name: "Cashier",
      officer: "Ms. Ana Reyes",
      total: 150,
      pending: 45,
      approved: 95,
      overdue: 10,
      avgProcessingTime: 2.5,
    },
    {
      code: "LIBRARY",
      name: "Library",
      officer: "Mr. Jose Dela Cruz",
      total: 150,
      pending: 60,
      approved: 85,
      overdue: 5,
      avgProcessingTime: 1.8,
    },
    {
      code: "GUIDANCE",
      name: "Guidance",
      officer: "Dr. Carmen Lopez",
      total: 150,
      pending: 80,
      approved: 65,
      overdue: 5,
      avgProcessingTime: 3.2,
    },
    {
      code: "CLINIC",
      name: "Clinic",
      officer: "Nurse Maria Garcia",
      total: 150,
      pending: 70,
      approved: 75,
      overdue: 5,
      avgProcessingTime: 2.1,
    },
    {
      code: "REGISTRAR",
      name: "Registrar",
      officer: "Ms. Rosa Martinez",
      total: 150,
      pending: 90,
      approved: 55,
      overdue: 5,
      avgProcessingTime: 4.1,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || student.status === statusFilter

    const matchesDepartment =
      departmentFilter === "all" ||
      student.departments.some((dept) => dept.code === departmentFilter && dept.status === "pending")

    return matchesSearch && matchesStatus && matchesDepartment
  })

  const overallStats = {
    totalStudents: students.length,
    pending: students.filter((s) => s.status === "pending").length,
    inProgress: students.filter((s) => s.status === "in_progress").length,
    completed: students.filter((s) => s.status === "completed").length,
    expired: students.filter((s) => s.status === "expired").length,
    avgCompletionTime: 5.2,
    completionRate: (students.filter((s) => s.status === "completed").length / students.length) * 100,
  }

  const handleBulkAction = (action: string, studentIds: string[]) => {
    console.log(`Bulk ${action} for students:`, studentIds)
    // Implement bulk actions
  }

  const exportData = (format: string) => {
    console.log(`Exporting data in ${format} format`)

    if (format === "csv") {
      // Create CSV content
      const csvHeaders = ["Student ID", "Name", "Program", "Status", "Progress", "Email"]
      const csvRows = filteredStudents.map((student) => [
        student.studentId,
        student.fullName,
        student.program,
        student.status,
        `${student.progress}%`,
        student.email,
      ])

      const csvContent = [csvHeaders, ...csvRows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `clime-students-${new Date().toISOString().split("T")[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CLIME Super Admin</h1>
                <p className="text-sm text-gray-600">System-wide Clearance Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setShowSettings(true)} variant="outline" size="sm" className="bg-white">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Link href="/">
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
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{overallStats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold text-green-600">{overallStats.completionRate.toFixed(1)}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Processing</p>
                      <p className="text-2xl font-bold text-blue-600">{overallStats.avgCompletionTime} days</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">System Status</p>
                      <p className="text-2xl font-bold text-green-600">Online</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clearance Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Completed</span>
                      <span className="text-sm text-gray-600">{overallStats.completed}</span>
                    </div>
                    <Progress value={(overallStats.completed / overallStats.totalStudents) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">In Progress</span>
                      <span className="text-sm text-gray-600">{overallStats.inProgress}</span>
                    </div>
                    <Progress value={(overallStats.inProgress / overallStats.totalStudents) * 100} className="h-2" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pending</span>
                      <span className="text-sm text-gray-600">{overallStats.pending}</span>
                    </div>
                    <Progress value={(overallStats.pending / overallStats.totalStudents) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentStats.slice(0, 3).map((dept) => (
                      <div key={dept.code} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{dept.name}</p>
                          <p className="text-xs text-gray-600">{dept.officer}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{((dept.approved / dept.total) * 100).toFixed(1)}%</p>
                          <p className="text-xs text-gray-600">
                            {dept.approved}/{dept.total}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Jane Smith's clearance completed</p>
                      <p className="text-xs text-gray-600">All departments approved • 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Library approved Maria Santos</p>
                      <p className="text-xs text-gray-600">Mr. Jose Dela Cruz • 15 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">5 clearances expiring tomorrow</p>
                      <p className="text-xs text-gray-600">Automatic reminder sent • 1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-6">
            {/* Filters */}
            <Card>
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
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="CASHIER">Cashier Pending</SelectItem>
                        <SelectItem value="LIBRARY">Library Pending</SelectItem>
                        <SelectItem value="GUIDANCE">Guidance Pending</SelectItem>
                        <SelectItem value="CLINIC">Clinic Pending</SelectItem>
                        <SelectItem value="REGISTRAR">Registrar Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => exportData("csv")} variant="outline" className="bg-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button onClick={() => exportData("pdf")} variant="outline" className="bg-white">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Students Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Student Clearances ({filteredStudents.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expires</TableHead>
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
                            <p className="text-sm text-gray-600">
                              {student.yearLevel} - {student.section}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{student.progress}%</span>
                              <span className="text-xs text-gray-500">
                                {student.departments.filter((d) => d.status === "approved").length}/
                                {student.departments.length}
                              </span>
                            </div>
                            <Progress value={student.progress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(student.expiresAt).toLocaleDateString()}
                            {new Date(student.expiresAt) < new Date() && (
                              <p className="text-xs text-red-600">Expired</p>
                            )}
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Department Management</h2>
              <Button onClick={() => setShowDepartmentMgmt(true)}>
                <Building className="h-4 w-4 mr-2" />
                Manage Departments
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentStats.map((dept) => (
                <Card key={dept.code}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{dept.name}</span>
                      <Badge variant="outline">{dept.code}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Officer</p>
                        <p className="font-medium">{dept.officer}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{dept.approved}</div>
                          <div className="text-gray-600">Approved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">{dept.pending}</div>
                          <div className="text-gray-600">Pending</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{((dept.approved / dept.total) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(dept.approved / dept.total) * 100} className="h-2" />
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Avg. Processing Time</span>
                        <span className="font-medium">{dept.avgProcessingTime} days</span>
                      </div>

                      {dept.overdue > 0 && (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            {dept.overdue} overdue clearances
                          </AlertDescription>
                        </Alert>
                      )}

                      <Link href={`/admin/${dept.code.toLowerCase()}`}>
                        <Button variant="outline" className="w-full bg-white">
                          <Eye className="h-4 w-4 mr-2" />
                          View Department
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Time Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Chart visualization would go here</p>
                      <p className="text-sm">Integration with charting library needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentStats
                      .sort((a, b) => a.avgProcessingTime - b.avgProcessingTime)
                      .map((dept, index) => (
                        <div key={dept.code} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                            </div>
                            <span className="font-medium">{dept.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{dept.avgProcessingTime} days</p>
                            <p className="text-xs text-gray-600">avg. processing</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">98.5%</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">1.2s</div>
                    <div className="text-sm text-gray-600">Avg. Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">2,847</div>
                    <div className="text-sm text-gray-600">Total Clearances</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">156</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Bulk Operations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setShowBulkImport(true)} className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Students
                  </Button>
                  <Button variant="outline" className="w-full bg-white" onClick={() => exportData("csv")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full bg-white">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Notifications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={() => setShowSettings(true)} className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure System
                  </Button>
                  <Button variant="outline" className="w-full bg-white">
                    <Database className="h-4 w-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button variant="outline" className="w-full bg-white">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Semester Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    New Semester
                  </Button>
                  <Button variant="outline" className="w-full bg-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Archive Old Data
                  </Button>
                  <Button variant="outline" className="w-full bg-white">
                    <Clock className="h-4 w-4 mr-2" />
                    Set Deadlines
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>5 clearances</strong> are expiring within 24 hours.
                      <Button variant="outline" size="sm" className="ml-2 bg-white">
                        Send Reminders
                      </Button>
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>12 students</strong> have overdue clearances.
                      <Button variant="outline" size="sm" className="ml-2 bg-white">
                        View Details
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <SystemSettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <BulkStudentImport isOpen={showBulkImport} onClose={() => setShowBulkImport(false)} />
      <DepartmentManagement isOpen={showDepartmentMgmt} onClose={() => setShowDepartmentMgmt(false)} />
    </div>
  )
}
