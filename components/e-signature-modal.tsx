"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Pen, RotateCcw, Save } from "lucide-react"

interface ESignatureModalProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
  clearanceId: string
}

export function ESignatureModal({ isOpen, onClose, studentName, clearanceId }: ESignatureModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureData, setSignatureData] = useState<string>("")
  const [studentSignature, setStudentSignature] = useState("")
  const [witnessName, setWitnessName] = useState("")
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split("T")[0])
  const [remarks, setRemarks] = useState("")
  const [isSigned, setIsSigned] = useState(false)

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
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
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setSignatureData("")
      }
    }
  }

  const handleSubmitSignature = async () => {
    if (!signatureData || !studentSignature || !witnessName) {
      alert("Please complete all required fields and provide your signature.")
      return
    }

    try {
      // Here you would typically send the signature data to your backend
      const signaturePayload = {
        clearanceId,
        studentName,
        studentSignature,
        witnessName,
        signatureDate,
        remarks,
        signatureImage: signatureData,
        timestamp: new Date().toISOString(),
      }

      console.log("Submitting signature:", signaturePayload)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsSigned(true)

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose()
        setIsSigned(false)
      }, 2000)
    } catch (error) {
      console.error("Error submitting signature:", error)
      alert("Failed to submit signature. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pen className="h-5 w-5" />
            Electronic Signature - Student Clearance
          </DialogTitle>
        </DialogHeader>

        {isSigned ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 mb-2">Signature Submitted Successfully!</h3>
            <p className="text-gray-600">Your clearance has been digitally signed and submitted.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Student Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Clearance Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Student Name:</span>
                  <p className="font-medium">{studentName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Clearance ID:</span>
                  <p className="font-medium">{clearanceId}</p>
                </div>
              </div>
            </div>

            {/* Signature Canvas */}
            <div>
              <Label className="text-base font-medium">Digital Signature *</Label>
              <p className="text-sm text-gray-600 mb-3">
                Please sign in the box below using your mouse or touch device
              </p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={200}
                  className="border border-gray-300 rounded cursor-crosshair w-full"
                  style={{ maxWidth: "100%", height: "200px" }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex justify-end mt-2">
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

            {/* Student Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentSignature">Printed Name *</Label>
                <Input
                  id="studentSignature"
                  value={studentSignature}
                  onChange={(e) => setStudentSignature(e.target.value)}
                  placeholder="Type your full name"
                />
              </div>
              <div>
                <Label htmlFor="witnessName">Witness Name *</Label>
                <Input
                  id="witnessName"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  placeholder="Name of witness (if applicable)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="signatureDate">Date</Label>
              <Input
                id="signatureDate"
                type="date"
                value={signatureDate}
                onChange={(e) => setSignatureDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Any additional comments or notes"
                rows={3}
              />
            </div>

            {/* Legal Notice */}
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Legal Notice:</strong> By providing your electronic signature, you acknowledge that:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>You have reviewed and agree to the clearance requirements</li>
                  <li>All information provided is accurate and complete</li>
                  <li>This electronic signature has the same legal effect as a handwritten signature</li>
                  <li>You understand the consequences of providing false information</li>
                </ul>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmitSignature} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Submit Signature
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
