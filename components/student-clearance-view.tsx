"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ESignatureModal } from "@/components/e-signature-modal"
import {
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  CreditCard,
} from "lucide-react"

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
  enrollmentDate: string
  expectedGraduation: string
  paymentStatus: "cleared" | "pending" | "overdue"
  clearanceId: string
  submittedDate: string
  lastUpdated: string
}

interface ClearanceItem {
  id: string
  department: string
  officer: string
  description: string
  status: "pending" | "approved" | "rejected" | "requires_payment"
  signedDate?: string
  remarks?: string
  paymentAmount?: number
}

interface StudentClearanceViewProps {
  student: Student
  token: string
}

export function StudentClearanceView({ student, token }: StudentClearanceViewProps) {
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([
    {
      id: "1",
      department: "Business Services Officer",
      officer: "Ms. Maria Santos",
      description: "Financial obligations and fees",
      status: student.paymentStatus === "cleared" ? "approved" : "requires_payment",
      paymentAmount: student.paymentStatus === "cleared" ? 0 : 2500,
      signedDate: student.paymentStatus === "cleared" ? "2025-01-15T09:00:00Z" : undefined,
    },
    {
      id: "2",
      department: "Chief Librarian",
      officer: "Mr. Jose Dela Cruz",
      description: "Library books and materials",
      status: "approved",
      signedDate: "2025-01-14T14:30:00Z",
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
  ])

  const [showESignature, setShowESignature] = useState(false)
  const [canSign, setCanSign] = useState(false)

  useEffect(() => {
    // Check if student can sign (all items approved and payment cleared)
    const allApproved = clearanceItems.every((item) => item.status === "approved")
    const paymentCleared = student.paymentStatus === "cleared"
    setCanSign(allApproved && paymentCleared)
  }, [clearanceItems, student.paymentStatus])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "requires_payment":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Payment Required</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "requires_payment":
        return <CreditCard className="h-5 w-5 text-orange-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const approvedCount = clearanceItems.filter((item) => item.status === "approved").length
  const totalItems = clearanceItems.length
  const progressPercentage = (approvedCount / totalItems) * 100

  const handleDownloadPDF = () => {
    // Generate PDF with current clearance status
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Clearance - ${student.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .student-info { margin-bottom: 30px; }
            .info-row { display: flex; margin-bottom: 10px; }
            .info-label { font-weight: bold; width: 150px; }
            .clearance-item { border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .approved { background-color: #d4edda; border-color: #c3e6cb; }
            .pending { background-color: #fff3cd; border-color: #ffeaa7; }
            .rejected { background-color: #f8d7da; border-color: #f5c6cb; }
            .requires_payment { background-color: #ffeaa7; border-color: #fdcb6e; }
            .signature-section { margin-top: 40px; border-top: 2px solid #333; padding-top: 20px; }
            @media print { body { margin: 0; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SAINT MICHAEL'S COLLEGE OF LAGUNA</h1>
            <p>OLD NATIONAL ROAD, PLATERO, CITY OF BIÑAN, LAGUNA</p>
            <h2>STUDENT'S CLEARANCE</h2>
            <p>Clearance ID: ${student.clearanceId}</p>
          </div>
          
          <div class="student-info">
            <div class="info-row">
              <span class="info-label">Name of Student:</span>
              <span>${student.fullName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Student ID:</span>
              <span>${student.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Program:</span>
              <span>${student.program}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Section:</span>
              <span>${student.section}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Year Level:</span>
              <span>${student.yearLevel}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          <p style="margin-bottom: 30px; font-style: italic;">
            I hereby certify that the above named student has satisfactorily complied with all the requirements and is free from all money property accountabilities in my subjects/units/department.
          </p>
          
          <h3>Department Clearances:</h3>
          ${clearanceItems
            .map(
              (item, index) => `
            <div class="clearance-item ${item.status}">
              <h4>${index + 1}. ${item.department}</h4>
              <p><strong>Officer:</strong> ${item.officer}</p>
              <p><strong>Description:</strong> ${item.description}</p>
              <p><strong>Status:</strong> ${item.status.toUpperCase().replace("_", " ")}</p>
              ${item.signedDate ? `<p><strong>Signed:</strong> ${new Date(item.signedDate).toLocaleString()}</p>` : ""}
              ${item.remarks ? `<p><strong>Remarks:</strong> ${item.remarks}</p>` : ""}
              ${item.paymentAmount ? `<p><strong>Payment Required:</strong> ₱${item.paymentAmount.toLocaleString()}</p>` : ""}
            </div>
          `,
            )
            .join("")}
          
          <div class="signature-section">
            <h3>Important Notes:</h3>
            <p><strong>For Basic Education Division:</strong> Please surrender at the Principal's/Vice Principal's/Administrator's Office.</p>
            <p><strong>For Tertiary Education Division:</strong> Please surrender at the Registrar's Center.</p>
            
            <div style="margin-top: 40px;">
              <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Progress:</strong> ${approvedCount}/${totalItems} departments cleared</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #666;">
            F-CRO-18 | Rev (10/08/14/23) | Digital Version
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Digital Clearance System</h1>
            <p className="text-gray-600">Saint Michael's College of Laguna</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">STUDENT'S CLEARANCE</h2>
        <p className="text-sm text-gray-600">Clearance ID: {student.clearanceId}</p>
      </div>

      {/* Progress Overview */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Clearance Progress</h3>
            <Badge variant="outline" className="text-sm">
              {approvedCount}/{totalItems} Completed
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <div className="text-gray-600">Approved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {clearanceItems.filter((item) => item.status === "requires_payment").length}
              </div>
              <div className="text-gray-600">Payment Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {clearanceItems.filter((item) => item.status === "pending").length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {clearanceItems.filter((item) => item.status === "rejected").length}
              </div>
              <div className="text-gray-600">Rejected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Student Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{student.fullName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-medium">{student.id}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <GraduationCap className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{student.program}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Section</p>
                  <p className="font-medium">{student.section}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Year Level</p>
                  <p className="font-medium">{student.yearLevel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{student.contactNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <Badge
                    className={
                      student.paymentStatus === "cleared"
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }
                  >
                    {student.paymentStatus === "cleared" ? "Cleared" : "Pending"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certification Statement */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed italic">
              I hereby certify that the above named student has satisfactorily complied with all the requirements and is
              free from all money property accountabilities in my subjects/units/department.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Payment Alert */}
      {student.paymentStatus !== "cleared" && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <CreditCard className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Payment Required:</strong> Please settle your outstanding balance with the cashier before your
            clearance can be completed. Contact the Business Services Office for payment details.
          </AlertDescription>
        </Alert>
      )}

      {/* Clearance Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Department Clearances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clearanceItems.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">{getStatusIcon(item.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {index + 1}. {item.department}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{item.officer}</p>
                        <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                        {item.signedDate && (
                          <p className="text-xs text-gray-500 mt-2">
                            Signed on: {new Date(item.signedDate).toLocaleString()}
                          </p>
                        )}
                        {item.remarks && <p className="text-xs text-gray-600 mt-1 italic">Remarks: {item.remarks}</p>}
                        {item.paymentAmount && item.paymentAmount > 0 && (
                          <p className="text-sm text-orange-700 mt-1 font-medium">
                            Payment Required: ₱{item.paymentAmount.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(item.status)}</div>
                    </div>
                  </div>
                </div>
                {index < clearanceItems.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Important Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-yellow-800">
              <strong>For Basic Education Division:</strong> Please surrender at the Principal's/Vice
              Principal's/Administrator's Office.
            </p>
            <p className="text-sm text-yellow-800">
              <strong>For Tertiary Education Division:</strong> Please surrender at the Registrar's Center.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <Button
          onClick={() => setShowESignature(true)}
          size="lg"
          disabled={!canSign}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          {canSign ? "Sign Clearance" : "Complete Requirements First"}
        </Button>
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-transparent"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Form Reference */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>F-CRO-18 | Rev (10/08/14/23) | Digital Version</p>
        <p>Last Updated: {new Date(student.lastUpdated).toLocaleString()}</p>
        <p className="text-blue-600">Secure Link: {token}</p>
      </div>

      {/* E-Signature Modal */}
      <ESignatureModal
        isOpen={showESignature}
        onClose={() => setShowESignature(false)}
        studentName={student.fullName}
        clearanceId={student.clearanceId}
      />
    </div>
  )
}
