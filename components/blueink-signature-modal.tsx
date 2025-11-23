"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader, AlertCircle, Mail } from "lucide-react"

interface BlueinkSignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSignatureComplete: (data: any) => void
  student: {
    id: string
    fullName: string
    email: string
    studentId: string
  }
  faculty: {
    name: string
    email: string
    department: string
  }
  documentUrl: string
}

export function BlueinkSignatureModal({
  isOpen,
  onClose,
  onSignatureComplete,
  student,
  faculty,
  documentUrl,
}: BlueinkSignatureModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [signatureLink, setSignatureLink] = useState("")
  const [remarks, setRemarks] = useState("")

  const handleCreateBundle = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch("/api/blueink/create-bundle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentEmail: student.email,
          studentName: student.fullName,
          facultyEmail: faculty.email,
          facultyName: faculty.name,
          department: faculty.department,
          documentUrl,
          remarks,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create signature bundle")
      }

      const data = await response.json()
      setSignatureLink(data.signatureLink)
      setIsComplete(true)

      onSignatureComplete({
        bundleId: data.bundleId,
        status: "pending",
        signatureMethod: "blueink",
        signatureLink: data.signatureLink,
      })
    } catch (error) {
      console.error("Error creating BlueInk bundle:", error)
      alert("Failed to create signature request. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            BlueInk E-Signature Request
          </DialogTitle>
        </DialogHeader>

        {isComplete ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-semibold text-green-800">Signature Request Sent Successfully!</h3>
            <p className="text-gray-600">
              Signature requests have been sent to both {student.fullName} and {faculty.name}.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Signing Link for Faculty:</strong>
                <br />
                <a href={signatureLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {signatureLink}
                </a>
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Both parties will receive email notifications with their signing links.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Student Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Student Information</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span> <span className="font-medium">{student.fullName}</span>
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> <span className="font-medium">{student.email}</span>
                </p>
                <p>
                  <span className="text-gray-600">Student ID:</span>{" "}
                  <span className="font-medium">{student.studentId}</span>
                </p>
              </div>
            </div>

            {/* Faculty Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Faculty Information</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Name:</span> <span className="font-medium">{faculty.name}</span>
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> <span className="font-medium">{faculty.email}</span>
                </p>
                <p>
                  <span className="text-gray-600">Department:</span>{" "}
                  <span className="font-medium">{faculty.department}</span>
                </p>
              </div>
            </div>

            {/* Remarks */}
            <div>
              <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any additional comments or special instructions"
                rows={3}
                className="mt-2"
              />
            </div>

            {/* BlueInk Information */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Secure E-Signature Process:</strong> This will create a secure BlueInk signature request. Both
                the student and faculty member will receive email invitations to sign the clearance document.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleCreateBundle} disabled={isProcessing} className="flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Creating Request...
                  </>
                ) : (
                  "Send Signature Request"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
