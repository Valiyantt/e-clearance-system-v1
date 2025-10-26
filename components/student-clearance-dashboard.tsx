"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, RefreshCw, Share2, Clock, CheckCircle, AlertCircle, FileText, QrCode, User } from "lucide-react"
import Link from "next/link"

interface Student {
  id: string
  firstName: string
  lastName: string
  fullName: string
  program: string
  section: string
  yearLevel: string
  email: string
  contactNumber: string
  address: string
  semester: string
  academicYear: string
  clearanceId: string
  submittedDate: string
  lastUpdated: string
  expiresAt: string
  qrCode: string
}

interface Department {
  id: string
  name: string
  officer: string
  contact: string
  status: "pending" | "approved" | "rejected" | "overdue"
  approvedDate?: string
  signature?: string
  remarks?: string
  priority: number
}

interface StudentClearanceDashboardProps {
  student: Student
  token: string
}

export function StudentClearanceDashboard({ student, token }: StudentClearanceDashboardProps) {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Cashier",
      officer: "Ms. Ana Reyes",
      contact: "cashier@smcl.edu.ph",
      status: "approved",
      approvedDate: "2025-01-15T09:00:00Z",
      signature: "Ana Reyes",
      priority: 1,
    },
    {
      id: "2",
      name: "Library",
      officer: "Mr. Jose Dela Cruz",
      contact: "library@smcl.edu.ph",
      status: "approved",
      approvedDate: "2025-01-14T14:30:00Z",
      signature: "Jose R. Dela Cruz",
      priority: 2,
    },
    {
      id: "3",
      name: "Guidance",
      officer: "Dr. Carmen Lopez",
      contact: "guidance@smcl.edu.ph",
      status: "pending",
      priority: 3,
    },
    {
      id: "4",
      name: "Clinic",
      officer: "Nurse Maria Garcia",
      contact: "clinic@smcl.edu.ph",
      status: "pending",
      priority: 4,
    },
    {
      id: "5",
      name: "Registrar",
      officer: "Ms. Rosa Martinez",
      contact: "registrar@smcl.edu.ph",
      status: "pending",
      priority: 5,
    },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const approvedCount = departments.filter((dept) => dept.status === "approved").length
  const totalDepartments = departments.length
  const progressPercentage = (approvedCount / totalDepartments) * 100
  const isComplete = approvedCount === totalDepartments
  const expiryDate = new Date(student.expiresAt)
  const isExpired = new Date() > expiryDate
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const refreshStatus = async () => {
    setIsLoading(true)
    // Simulate API call to refresh clearance status
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const shareLink = async () => {
    const shareUrl = `${window.location.origin}/student/${token}`
    if (navigator.share) {
      await navigator.share({
        title: "My Clearance Status",
        text: `Track my clearance progress - ${student.fullName}`,
        url: shareUrl,
      })
    } else {
      await navigator.clipboard.writeText(shareUrl)
      alert("Link copied to clipboard!")
    }
  }

  const downloadPDF = () => {
    if (!isComplete) {
      alert("Please wait for all departments to approve your clearance before downloading.")
      return
    }

    // Generate PDF that exactly matches paper form
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Clearance - ${student.fullName}</title>
          <style>
            @page {
              size: 8.5in 11in;
              margin: 0.5in;
            }
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 0; 
              padding: 0; 
              line-height: 1.4;
              font-size: 12px;
              color: #000;
            }
            .document {
              width: 100%;
              height: 100vh;
              background: white;
              padding: 20px;
              box-sizing: border-box;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
            }
            .college-name { 
              font-size: 18px; 
              font-weight: bold; 
              margin-bottom: 8px;
              letter-spacing: 1px;
            }
            .address { 
              font-size: 12px; 
              margin-bottom: 20px;
              font-style: italic;
            }
            .title { 
              font-size: 16px; 
              font-weight: bold; 
              text-decoration: underline;
              letter-spacing: 2px;
            }
            .student-info {
              margin: 30px 0;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            .info-row {
              margin-bottom: 12px;
              display: flex;
              align-items: baseline;
            }
            .label {
              font-weight: bold;
              margin-right: 15px;
              min-width: 140px;
              font-size: 11px;
            }
            .value {
              border-bottom: 1px solid #000;
              flex: 1;
              padding-bottom: 3px;
              font-size: 12px;
              min-height: 16px;
            }
            .certification {
              margin: 40px 0;
              font-style: italic;
              text-align: justify;
              line-height: 1.6;
              padding: 20px;
              border: 1px solid #ccc;
              background: #f9f9f9;
            }
            .departments-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin: 40px 0;
            }
            .department-box {
              border: 2px solid #000;
              padding: 20px;
              min-height: 120px;
              position: relative;
            }
            .dept-number {
              position: absolute;
              top: -12px;
              left: 10px;
              background: white;
              padding: 0 8px;
              font-weight: bold;
              font-size: 14px;
            }
            .dept-name {
              font-weight: bold;
              font-size: 13px;
              margin-bottom: 15px;
              text-align: center;
              text-transform: uppercase;
            }
            .signature-area {
              border-bottom: 2px solid #000;
              height: 40px;
              margin: 15px 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .signature-text {
              font-family: 'Brush Script MT', cursive;
              font-size: 18px;
              color: #000;
              font-weight: bold;
            }
            .officer-name {
              text-align: center;
              font-size: 10px;
              margin-top: 5px;
              font-style: italic;
            }
            .date-signed {
              text-align: center;
              font-size: 9px;
              color: #666;
              margin-top: 3px;
            }
            .footer-notes {
              margin-top: 50px;
              border-top: 1px solid #000;
              padding-top: 20px;
              font-size: 10px;
            }
            .footer-title {
              font-weight: bold;
              margin-bottom: 10px;
              text-decoration: underline;
            }
            .document-info {
              text-align: center;
              margin-top: 30px;
              font-size: 9px;
              color: #666;
              border-top: 1px solid #ccc;
              padding-top: 15px;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="document">
            <div class="header">
              <div class="college-name">SAINT MICHAEL'S COLLEGE OF LAGUNA</div>
              <div class="address">Old National Road, Platero, City of Biñan, Laguna</div>
              <div class="title">STUDENT CLEARANCE</div>
            </div>
            
            <div class="student-info">
              <div>
                <div class="info-row">
                  <span class="label">NAME OF STUDENT:</span>
                  <span class="value">${student.fullName}</span>
                </div>
                <div class="info-row">
                  <span class="label">STUDENT ID:</span>
                  <span class="value">${student.id}</span>
                </div>
                <div class="info-row">
                  <span class="label">PROGRAM:</span>
                  <span class="value">${student.program}</span>
                </div>
              </div>
              <div>
                <div class="info-row">
                  <span class="label">SECTION:</span>
                  <span class="value">${student.section}</span>
                </div>
                <div class="info-row">
                  <span class="label">YEAR LEVEL:</span>
                  <span class="value">${student.yearLevel}</span>
                </div>
                <div class="info-row">
                  <span class="label">SEMESTER:</span>
                  <span class="value">${student.semester} ${student.academicYear}</span>
                </div>
              </div>
            </div>
            
            <div class="certification">
              I hereby certify that the above named student has satisfactorily complied with all the requirements 
              and is free from all money and property accountabilities in my office/department.
            </div>
            
            <div class="departments-grid">
              ${departments
                .map(
                  (dept, index) => `
                <div class="department-box">
                  <div class="dept-number">${index + 1}</div>
                  <div class="dept-name">${dept.name}</div>
                  <div class="signature-area">
                    ${
                      dept.status === "approved" && dept.signature
                        ? `<span class="signature-text">${dept.signature}</span>`
                        : ""
                    }
                  </div>
                  <div class="officer-name">${dept.officer}</div>
                  ${
                    dept.approvedDate
                      ? `<div class="date-signed">Date: ${new Date(dept.approvedDate).toLocaleDateString()}</div>`
                      : '<div class="date-signed">Date: _______________</div>'
                  }
                </div>
              `,
                )
                .join("")}
            </div>
            
            <div class="footer-notes">
              <div class="footer-title">IMPORTANT REMINDERS:</div>
              <p>1. This clearance must be submitted to the Registrar's Office before the end of the semester.</p>
              <p>2. Students with incomplete clearance will not be allowed to take final examinations.</p>
              <p>3. All accountabilities must be settled before clearance approval.</p>
              <p>4. This document is valid only for the current semester: ${student.semester} ${student.academicYear}</p>
            </div>
            
            <div class="document-info">
              <p><strong>Clearance ID:</strong> ${student.clearanceId}</p>
              <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Valid Until:</strong> ${new Date(student.expiresAt).toLocaleDateString()}</p>
              <p>F-REG-001 | Rev. 2025 | Digital Version</p>
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "overdue":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-orange-500" />
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">CLIME</h1>
                <p className="text-sm text-gray-600">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={refreshStatus} variant="outline" size="sm" disabled={isLoading} className="bg-white">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={shareLink} variant="outline" size="sm" className="bg-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-white">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Student Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">{student.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-sm">{student.email}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{student.program}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Section</p>
                  <p className="font-medium">{student.section}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year Level</p>
                  <p className="font-medium">{student.yearLevel}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Semester</p>
                  <p className="font-medium">
                    {student.semester} {student.academicYear}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Clearance ID</p>
                  <p className="font-medium">{student.clearanceId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expires</p>
                  <p className={`font-medium ${daysUntilExpiry <= 7 ? "text-red-600" : "text-gray-900"}`}>
                    {expiryDate.toLocaleDateString()}
                    {!isExpired && <span className="text-sm text-gray-500 ml-2">({daysUntilExpiry} days left)</span>}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Clearance Progress</h3>
              <Badge variant="outline" className="text-sm">
                {approvedCount}/{totalDepartments} Completed
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-3 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                <div className="text-gray-600">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {departments.filter((d) => d.status === "pending").length}
                </div>
                <div className="text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {departments.filter((d) => d.status === "overdue").length}
                </div>
                <div className="text-gray-600">Overdue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalDepartments}</div>
                <div className="text-gray-600">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expiry Warning */}
        {daysUntilExpiry <= 7 && !isExpired && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Urgent:</strong> Your clearance expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}
              . Please follow up with pending departments immediately.
            </AlertDescription>
          </Alert>
        )}

        {/* Expired Alert */}
        {isExpired && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Expired:</strong> This clearance has expired. Please contact the Registrar's Office for
              assistance.
            </AlertDescription>
          </Alert>
        )}

        {/* Department Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {departments
            .sort((a, b) => a.priority - b.priority)
            .map((dept) => (
              <Card
                key={dept.id}
                className={`relative ${dept.status === "approved" ? "border-green-200 bg-green-50" : dept.status === "overdue" ? "border-red-200 bg-red-50" : "border-gray-200"}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="flex items-center gap-2">
                      {getStatusIcon(dept.status)}
                      {dept.name}
                    </span>
                    {getStatusBadge(dept.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Officer</p>
                      <p className="font-medium text-sm">{dept.officer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-sm">{dept.contact}</p>
                    </div>
                    {dept.status === "approved" && dept.approvedDate && (
                      <div>
                        <p className="text-sm text-gray-600">Approved</p>
                        <p className="font-medium text-sm text-green-700">
                          {new Date(dept.approvedDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {dept.remarks && (
                      <div>
                        <p className="text-sm text-gray-600">Remarks</p>
                        <p className="text-sm italic">{dept.remarks}</p>
                      </div>
                    )}
                  </div>

                  {/* Signature Preview */}
                  {dept.status === "approved" && dept.signature && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Digital Signature:</p>
                      <div className="bg-white border rounded p-2 text-center">
                        <span
                          className="text-lg font-signature text-gray-800"
                          style={{ fontFamily: "Brush Script MT, cursive" }}
                        >
                          {dept.signature}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={downloadPDF}
            size="lg"
            disabled={!isComplete || isExpired}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isComplete
              ? "Download Printable Clearance"
              : `Complete ${totalDepartments - approvedCount} more department${totalDepartments - approvedCount !== 1 ? "s" : ""}`}
          </Button>

          <Button
            onClick={() => setShowQR(!showQR)}
            variant="outline"
            size="lg"
            className="flex items-center gap-2 bg-white"
          >
            <QrCode className="h-4 w-4" />
            {showQR ? "Hide QR Code" : "Show QR Code"}
          </Button>
        </div>

        {/* QR Code Display */}
        {showQR && (
          <Card className="mt-6 max-w-sm mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-base">Share Your Clearance</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 border">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}`}
                  alt="QR Code for clearance access"
                  className="w-44 h-44"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">Scan this QR code to access your clearance status</p>
              <div className="text-xs text-gray-500 break-all bg-gray-50 p-2 rounded">{window.location.href}</div>
            </CardContent>
          </Card>
        )}

        {/* Last Updated */}
        <div className="text-center text-sm text-gray-500 mt-8">
          Last updated: {new Date(student.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  )
}
