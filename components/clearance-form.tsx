"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, Download, Send } from "lucide-react"

interface ClearanceData {
  studentName: string
  program: string
  section: string
  date: string
  yearLevel: string
  studentId: string
}

interface SignatureStatus {
  id: string
  department: string
  officer: string
  status: "pending" | "approved" | "rejected"
  signedDate?: string
  remarks?: string
}

export function ClearanceForm() {
  const [formData, setFormData] = useState<ClearanceData>({
    studentName: "",
    program: "",
    section: "",
    date: new Date().toISOString().split("T")[0],
    yearLevel: "",
    studentId: "",
  })

  const [signatures, setSignatures] = useState<SignatureStatus[]>([
    {
      id: "1",
      department: "Business Services Officer",
      officer: "Signature over Printed Name",
      status: "pending",
    },
    {
      id: "2",
      department: "Chief Librarian",
      officer: "Signature over Printed Name",
      status: "pending",
    },
    {
      id: "3",
      department: "CCSC Personnel",
      officer: "Signature over Printed Name",
      status: "pending",
    },
    {
      id: "4",
      department: "Chair/Asso. Director/Administrator/Principal",
      officer: "Signature over Printed Name",
      status: "pending",
    },
    {
      id: "5",
      department: "College Registrar",
      officer: "Signature over Printed Name",
      status: "pending",
    },
  ])

  const handleInputChange = (field: keyof ClearanceData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignatureUpdate = (id: string, status: "approved" | "rejected", remarks?: string) => {
    setSignatures((prev) =>
      prev.map((sig) => (sig.id === id ? { ...sig, status, signedDate: new Date().toISOString(), remarks } : sig)),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const approvedCount = signatures.filter((sig) => sig.status === "approved").length
  const totalSignatures = signatures.length
  const isComplete = approvedCount === totalSignatures

  return (
    <div className="space-y-8">
      {/* Student Information Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>Student Information</span>
            <Badge variant="outline">
              {approvedCount}/{totalSignatures} Approved
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentName">Name of Student</Label>
              <Input
                id="studentName"
                value={formData.studentName}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                placeholder="Enter student ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="program">Program/Major/Grade</Label>
              <Input
                id="program"
                value={formData.program}
                onChange={(e) => handleInputChange("program", e.target.value)}
                placeholder="e.g., BSIT, BSBA"
              />
            </div>
            <div>
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => handleInputChange("section", e.target.value)}
                placeholder="Enter section"
              />
            </div>
            <div>
              <Label htmlFor="yearLevel">Year Level</Label>
              <Select value={formData.yearLevel} onValueChange={(value) => handleInputChange("yearLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st year">1st Year</SelectItem>
                  <SelectItem value="2nd year">2nd Year</SelectItem>
                  <SelectItem value="3rd year">3rd Year</SelectItem>
                  <SelectItem value="4th year">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Certification Statement */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700 leading-relaxed">
              I hereby certify that the above named student has satisfactorily complied with all the requirements and is
              free from all money property accountabilities in my subjects/units/department.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Signatures Section */}
      <Card>
        <CardHeader>
          <CardTitle>Department Clearances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {signatures.map((signature, index) => (
              <div key={signature.id}>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        {index + 1}. {signature.department}
                      </span>
                      {getStatusBadge(signature.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{signature.officer}</p>
                    {signature.signedDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        Signed on: {new Date(signature.signedDate).toLocaleDateString()}
                      </p>
                    )}
                    {signature.remarks && (
                      <p className="text-xs text-gray-600 mt-1 italic">Remarks: {signature.remarks}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {signature.status === "approved" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {index < signatures.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="flex items-center gap-2" disabled={!formData.studentName || !formData.program}>
          <Send className="h-4 w-4" />
          Submit for Approval
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2 bg-transparent" disabled={!isComplete}>
          <Download className="h-4 w-4" />
          Download Completed Form
        </Button>
      </div>

      {/* Form Reference */}
      <div className="text-center text-xs text-gray-500">
        F-CRO-18
        <br />
        Rev (10/08/14/23)
      </div>
    </div>
  )
}
