"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowLeft, RefreshCw } from "lucide-react"
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
  enrollmentDate: string
  expectedGraduation: string
  paymentStatus: "cleared" | "pending" | "overdue"
  clearanceId: string
  submittedDate: string
  lastUpdated: string
  currentDate: string
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

interface DigitalClearanceDocumentProps {
  student: Student
  token: string
}

export function DigitalClearanceDocument({ student, token }: DigitalClearanceDocumentProps) {
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([
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
      status: "approved",
      signedDate: "2025-01-14T14:30:00Z",
      signature: "Jose R. Dela Cruz",
    },
    {
      id: "3",
      department: "CCSC Personnel",
      officer: "Ms. Ana Reyes",
      status: "pending",
    },
    {
      id: "4",
      department: "Chair/Asso. Director/Administrator/Principal",
      officer: "Dr. Roberto Martinez",
      status: "pending",
    },
    {
      id: "5",
      department: "College Registrar",
      officer: "Ms. Carmen Lopez",
      status: "pending",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const refreshClearance = async () => {
    setIsLoading(true)
    // Simulate API call to refresh clearance status
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleDownloadPDF = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Clearance - ${student.fullName}</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              margin: 0; 
              padding: 20px; 
              line-height: 1.4;
              font-size: 12px;
            }
            .document {
              max-width: 8.5in;
              margin: 0 auto;
              background: white;
              padding: 0.5in;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
              border-bottom: 1px solid #000;
              padding-bottom: 15px;
            }
            .college-name { 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 5px;
            }
            .address { 
              font-size: 12px; 
              margin-bottom: 15px;
            }
            .title { 
              font-size: 14px; 
              font-weight: bold; 
              text-decoration: underline;
            }
            .form-section { 
              margin: 20px 0; 
            }
            .student-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .info-left, .info-right {
              width: 48%;
            }
            .info-row {
              margin-bottom: 8px;
              display: flex;
              align-items: baseline;
            }
            .label {
              font-weight: normal;
              margin-right: 10px;
              min-width: 120px;
            }
            .value {
              border-bottom: 1px solid #000;
              flex: 1;
              padding-bottom: 2px;
              font-weight: normal;
            }
            .certification {
              margin: 25px 0;
              font-style: italic;
              text-align: justify;
              line-height: 1.5;
            }
            .signature-section {
              margin: 30px 0;
            }
            .signature-item {
              display: flex;
              align-items: center;
              margin-bottom: 25px;
              min-height: 40px;
            }
            .signature-number {
              width: 20px;
              font-weight: bold;
            }
            .signature-content {
              flex: 1;
              display: flex;
              flex-direction: column;
            }
            .signature-line {
              border-bottom: 1px solid #000;
              min-height: 25px;
              margin-bottom: 5px;
              display: flex;
              align-items: center;
              padding: 0 10px;
            }
            .signature-text {
              font-family: 'Brush Script MT', cursive;
              font-size: 16px;
              color: #000;
            }
            .signature-label {
              font-size: 10px;
              text-align: center;
              color: #666;
            }
            .important-section {
              margin-top: 30px;
              border-top: 1px solid #000;
              padding-top: 15px;
            }
            .important-title {
              font-weight: bold;
              margin-bottom: 10px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 10px;
              border-top: 1px solid #000;
              padding-top: 10px;
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
              <div class="address">OLD NATIONAL ROAD, PLATERO, CITY OF BIÑAN, LAGUNA</div>
              <div class="title">STUDENT'S CLEARANCE</div>
            </div>
            
            <div class="student-info">
              <div class="info-left">
                <div class="info-row">
                  <span class="label">NAME OF STUDENT:</span>
                  <span class="value">${student.fullName}</span>
                </div>
                <div class="info-row">
                  <span class="label">PROGRAM/MAJOR/GRADE:</span>
                  <span class="value">${student.program}</span>
                </div>
              </div>
              <div class="info-right">
                <div class="info-row">
                  <span class="label">DATE:</span>
                  <span class="value">${student.currentDate}</span>
                </div>
                <div class="info-row">
                  <span class="label">YEAR/LEVEL:</span>
                  <span class="value">${student.yearLevel}</span>
                </div>
              </div>
            </div>
            
            <div class="info-row">
              <span class="label">SECTION:</span>
              <span class="value">${student.section}</span>
            </div>
            
            <div class="certification">
              I hereby certify that the above named student has satisfactorily complied with all the requirements and is free from all money property accountabilities in my subjects/units/department.
            </div>
            
            <div class="signature-section">
              ${clearanceItems
                .map(
                  (item, index) => `
                <div class="signature-item">
                  <div class="signature-number">${index + 1}.</div>
                  <div class="signature-content">
                    <div class="signature-line">
                      ${
                        item.status === "approved" && item.signature
                          ? `<span class="signature-text">${item.signature}</span>`
                          : ""
                      }
                    </div>
                    <div class="signature-label">${item.department}<br>(Signature over Printed Name)</div>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
            
            <div class="important-section">
              <div class="important-title">IMPORTANT:</div>
              <p>For Basic Education Division: Please surrender at the Principal's/Vice Principal's/Administrator's Office.</p>
              <p>For Tertiary Education Division: Please surrender at the Registrar's Center.</p>
            </div>
            
            <div class="footer">
              F-CRO-18<br>
              Rev (10/08/14/23)
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  const approvedCount = clearanceItems.filter((item) => item.status === "approved").length
  const totalItems = clearanceItems.length

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2 bg-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white">
              {approvedCount}/{totalItems} Completed
            </Badge>
            <Button onClick={refreshClearance} variant="outline" size="sm" disabled={isLoading} className="bg-white">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Document Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg" style={{ aspectRatio: "8.5/11" }}>
            {/* Document Content */}
            <div className="p-12 h-full flex flex-col" style={{ fontFamily: "Times New Roman, serif" }}>
              {/* Header */}
              <div className="text-center mb-8 border-b border-gray-800 pb-6">
                <h1 className="text-xl font-bold mb-2">SAINT MICHAEL'S COLLEGE OF LAGUNA</h1>
                <p className="text-sm mb-4">OLD NATIONAL ROAD, PLATERO, CITY OF BIÑAN, LAGUNA</p>
                <h2 className="text-lg font-bold underline">STUDENT'S CLEARANCE</h2>
              </div>

              {/* Student Information */}
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <div className="flex-1 mr-8">
                    <div className="flex items-baseline mb-3">
                      <span className="text-sm mr-4 min-w-[140px]">NAME OF STUDENT:</span>
                      <span className="border-b border-gray-800 flex-1 pb-1 font-medium">{student.fullName}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-sm mr-4 min-w-[140px]">PROGRAM/MAJOR/GRADE:</span>
                      <span className="border-b border-gray-800 flex-1 pb-1">{student.program}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline mb-3">
                      <span className="text-sm mr-4 min-w-[80px]">DATE:</span>
                      <span className="border-b border-gray-800 flex-1 pb-1">{student.currentDate}</span>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-sm mr-4 min-w-[80px]">YEAR/LEVEL:</span>
                      <span className="border-b border-gray-800 flex-1 pb-1">{student.yearLevel}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <span className="text-sm mr-4 min-w-[80px]">SECTION:</span>
                  <span className="border-b border-gray-800 flex-1 pb-1">{student.section}</span>
                </div>
              </div>

              {/* Certification Statement */}
              <div className="mb-8 italic text-justify leading-relaxed">
                <p className="text-sm">
                  I hereby certify that the above named student has satisfactorily complied with all the requirements
                  and is free from all money property accountabilities in my subjects/units/department.
                </p>
              </div>

              {/* Signature Section */}
              <div className="flex-1">
                {clearanceItems.map((item, index) => (
                  <div key={item.id} className="flex items-start mb-8">
                    <div className="text-sm font-bold mr-4 mt-2">{index + 1}.</div>
                    <div className="flex-1">
                      <div
                        className="border-b border-gray-800 h-8 flex items-center px-3 mb-2"
                        style={{ minHeight: "32px" }}
                      >
                        {item.status === "approved" && item.signature && (
                          <span className="text-lg text-gray-800" style={{ fontFamily: "Brush Script MT, cursive" }}>
                            {item.signature}
                          </span>
                        )}
                        {item.status === "pending" && (
                          <span className="text-gray-400 text-sm italic">Pending approval...</span>
                        )}
                        {item.status === "requires_payment" && (
                          <span className="text-orange-600 text-sm italic">Payment required</span>
                        )}
                      </div>
                      <div className="text-xs text-center text-gray-600">
                        {item.department}
                        <br />
                        (Signature over Printed Name)
                      </div>
                      {item.status === "approved" && item.signedDate && (
                        <div className="text-xs text-gray-500 text-center mt-1">
                          Signed: {new Date(item.signedDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Section */}
              <div className="border-t border-gray-800 pt-4 mt-8">
                <div className="text-sm font-bold mb-2">IMPORTANT:</div>
                <div className="text-xs space-y-1">
                  <p>
                    <strong>For Basic Education Division:</strong> Please surrender at the Principal's/Vice
                    Principal's/Administrator's Office.
                  </p>
                  <p>
                    <strong>For Tertiary Education Division:</strong> Please surrender at the Registrar's Center.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-600 mt-6 border-t border-gray-800 pt-4">
                <p>F-CRO-18</p>
                <p>Rev (10/08/14/23)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="max-w-4xl mx-auto mt-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Clearance Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-medium">{student.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Clearance ID</p>
                <p className="font-medium">{student.clearanceId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="font-medium">{new Date(student.lastUpdated).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium">
                  {approvedCount} of {totalItems} departments completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
