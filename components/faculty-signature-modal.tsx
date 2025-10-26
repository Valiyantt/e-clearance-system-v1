"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Pen, RotateCcw, Save, AlertCircle, CreditCard } from "lucide-react"

interface Student {
  id: string
  fullName: string
  studentId: string
  program: string
  yearLevel: string
  section: string
  paymentStatus: string
}

interface ClearanceItem {
  id: string
  department: string
  officer: string
  status: string
  paymentAmount?: number
}

interface FacultySignatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSignatureComplete: (data: any) => void
  student?: Student
  clearanceItem?: ClearanceItem
  facultyName: string
  department: string
}

export function FacultySignatureModal({
  isOpen,
  onClose,
  onSignatureComplete,
  student,
  clearanceItem,
  facultyName,
  department,
}: FacultySignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureData, setSignatureData] = useState<string>("")
  const [action, setAction] = useState<"approve" | "reject" | "require_payment">("approve")
  const [facultySignature, setFacultySignature] = useState(facultyName)
  const [remarks, setRemarks] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        // Set white background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
    }
  }, [isOpen])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.beginPath()
        ctx.moveTo(x, y)
      }
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL())
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        setSignatureData("")
      }
    }
  }

  const handleSubmit = async () => {
    if (!signatureData || !facultySignature) {
      alert("Please provide your signature and printed name.")
      return
    }

    if (action === "require_payment" && !paymentAmount) {
      alert("Please specify the payment amount required.")
      return
    }

    setIsProcessing(true)

    try {
      const signaturePayload = {
        studentId: student?.studentId,
        studentName: student?.fullName,
        department,
        facultyName,
        facultySignature,
        action,
        remarks,
        paymentAmount: action === "require_payment" ? Number.parseFloat(paymentAmount) : undefined,
        signatureImage: signatureData,
        timestamp: new Date().toISOString(),
        clearanceItemId: clearanceItem?.id,
      }

      console.log("Processing faculty signature:", signaturePayload)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setIsComplete(true)
      onSignatureComplete(signaturePayload)

      // Auto-close after showing success
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      console.error("Error processing signature:", error)
      alert("Failed to process signature. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetForm = () => {
    setSignatureData("")
    setAction("approve")
    setFacultySignature(facultyName)
    setRemarks("")
    setPaymentAmount("")
    setIsProcessing(false)
    setIsComplete(false)
    clearSignature()
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!student || !clearanceItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pen className="h-5 w-5" />
            Faculty Digital Signature - {department}
          </DialogTitle>
        </DialogHeader>

        {isComplete ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Signature Processed Successfully!</h3>
            <p className="text-gray-600">
              The clearance has been{" "}
              {action === "approve" ? "approved" : action === "reject" ? "rejected" : "marked for payment"} and the
              student will see your signature.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Student Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Student Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{student.fullName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Student ID:</span>
                  <p className="font-medium">{student.studentId}</p>
                </div>
                <div>
                  <span className="text-gray-600">Program:</span>
                  <p className="font-medium">{student.program}</p>
                </div>
                <div>
                  <span className="text-gray-600">Year & Section:</span>
                  <p className="font-medium">
                    {student.yearLevel} - {student.section}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Status Alert */}
            {student.paymentStatus !== "cleared" && (
              <Alert className="border-orange-200 bg-orange-50">
                <CreditCard className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Payment Status:</strong> This student has outstanding payments. Consider requiring payment
                  settlement before approval.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Selection */}
            <div>
              <Label className="text-base font-medium">Action</Label>
              <Select
                value={action}
                onValueChange={(value: "approve" | "reject" | "require_payment") => setAction(value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">✅ Approve Clearance</SelectItem>
                  <SelectItem value="reject">❌ Reject Clearance</SelectItem>
                  <SelectItem value="require_payment">💳 Require Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Amount (if requiring payment) */}
            {action === "require_payment" && (
              <div>
                <Label htmlFor="paymentAmount">Payment Amount Required (₱)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-2"
                />
              </div>
            )}

            {/* Digital Signature Canvas */}
            <div>
              <Label className="text-base font-medium">Digital Signature *</Label>
              <p className="text-sm text-gray-600 mb-3">
                Please sign in the box below. This will appear on the student's clearance document.
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={150}
                  className="border border-gray-300 rounded cursor-crosshair w-full bg-white"
                  style={{ maxWidth: "100%", height: "150px" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">Sign above with your mouse or touch device</p>
                  <Button
                    onClick={clearSignature}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 bg-transparent"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Faculty Information */}
            <div>
              <Label htmlFor="facultySignature">Printed Name *</Label>
              <Input
                id="facultySignature"
                value={facultySignature}
                onChange={(e) => setFacultySignature(e.target.value)}
                placeholder="Your full name as it should appear"
                className="mt-2"
              />
            </div>

            {/* Remarks */}
            <div>
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Add any additional comments or requirements"
                rows={3}
                className="mt-2"
              />
            </div>

            {/* Legal Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Faculty Certification:</strong> By providing your digital signature, you certify that:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>You have verified the student's compliance with department requirements</li>
                  <li>All necessary documentation has been reviewed</li>
                  <li>The student is free from accountabilities in your department</li>
                  <li>This digital signature has the same legal effect as a handwritten signature</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isProcessing} className="flex items-center gap-2">
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {action === "approve" ? "Approve & Sign" : action === "reject" ? "Reject" : "Require Payment"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
