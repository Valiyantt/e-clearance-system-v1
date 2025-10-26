"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, AlertCircle } from "lucide-react"

interface Student {
  id: string
  fullName: string
  studentId: string
  program: string
  yearLevel: string
  section: string
  email: string
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

interface BulkApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  selectedStudents: Student[]
  onApprove: (studentIds: string[]) => void
  department: DepartmentInfo
}

export function BulkApprovalModal({
  isOpen,
  onClose,
  selectedStudents,
  onApprove,
  department,
}: BulkApprovalModalProps) {
  const [remarks, setRemarks] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleBulkApprove = async () => {
    setIsProcessing(true)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const studentIds = selectedStudents.map((s) => s.id)
      onApprove(studentIds)

      // Log the bulk approval
      console.log("Bulk approval processed:", {
        department: department.id,
        officer: department.officer,
        studentIds,
        remarks,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error processing bulk approval:", error)
      alert("Failed to process bulk approval. Please try again.")
    } finally {
      setIsProcessing(false)
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Approval - {department.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              You are about to approve{" "}
              <strong>
                {selectedStudents.length} student{selectedStudents.length !== 1 ? "s" : ""}
              </strong>{" "}
              for {department.fullName}. Your e-signature will be applied to all selected clearances.
            </AlertDescription>
          </Alert>

          {/* Student List */}
          <div>
            <Label className="text-base font-medium">Selected Students</Label>
            <div className="mt-3 max-h-64 overflow-y-auto border rounded-lg">
              {selectedStudents.map((student, index) => (
                <div
                  key={student.id}
                  className={`p-3 flex items-center justify-between ${
                    index !== selectedStudents.length - 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{student.fullName}</span>
                      {getPriorityBadge(student.priority)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {student.studentId} • {student.program} • {student.yearLevel} - {student.section}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Remarks */}
          <div>
            <Label htmlFor="bulk-remarks">Remarks (Optional)</Label>
            <Textarea
              id="bulk-remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks that will apply to all selected students..."
              rows={3}
              className="mt-2"
            />
          </div>

          {/* Confirmation */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Confirmation Required:</strong> This action will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Mark all {selectedStudents.length} selected students as approved</li>
                <li>Apply your official e-signature to their clearance documents</li>
                <li>Send notification emails to students (if enabled)</li>
                <li>Create an audit log entry for this bulk action</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleBulkApprove} disabled={isProcessing} className="flex items-center gap-2">
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Processing {selectedStudents.length} approvals...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Approve All {selectedStudents.length} Students
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
