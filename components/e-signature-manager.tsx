"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileImage, CheckCircle, AlertCircle, Download, Trash2, Eye } from "lucide-react"

interface DepartmentInfo {
  id: string
  name: string
  fullName: string
  officer: string
  email: string
  description: string
}

interface ESignatureManagerProps {
  isOpen: boolean
  onClose: () => void
  department: DepartmentInfo
  onSignatureUploaded: () => void
}

export function ESignatureManager({ isOpen, onClose, department, onSignatureUploaded }: ESignatureManagerProps) {
  const [currentSignature, setCurrentSignature] = useState<string | null>(
    // Mock existing signature - in real app, this would be fetched from database
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  )
  const [newSignature, setNewSignature] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [signatureNotes, setSignatureNotes] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, etc.)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setNewSignature(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSaveSignature = async () => {
    if (!newSignature) {
      alert("Please upload a signature image first.")
      return
    }

    setIsUploading(true)

    try {
      // Simulate API call to save signature
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In real app, this would save to database with proper coordinates and styling
      const signatureData = {
        departmentId: department.id,
        imageData: newSignature,
        officerName: department.officer,
        uploadedAt: new Date().toISOString(),
        notes: signatureNotes,
        // Signature positioning for PDF generation
        coordinates: {
          x: 50, // pixels from left
          y: 100, // pixels from top
          width: 200,
          height: 60,
        },
        styling: {
          opacity: 1.0,
          rotation: 0,
          borderWidth: 0,
        },
      }

      console.log("Saving signature:", signatureData)

      setCurrentSignature(newSignature)
      setNewSignature(null)
      setSignatureNotes("")
      onSignatureUploaded()

      alert("E-signature uploaded successfully!")
    } catch (error) {
      console.error("Error uploading signature:", error)
      alert("Failed to upload signature. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteSignature = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your current e-signature? This will prevent you from approving clearances until you upload a new one.",
      )
    ) {
      return
    }

    try {
      // Simulate API call to delete signature
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setCurrentSignature(null)
      alert("E-signature deleted successfully.")
    } catch (error) {
      console.error("Error deleting signature:", error)
      alert("Failed to delete signature. Please try again.")
    }
  }

  const downloadSignatureTemplate = () => {
    // Create a template image for signature guidelines
    const canvas = document.createElement("canvas")
    canvas.width = 400
    canvas.height = 150
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // White background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Border
      ctx.strokeStyle = "#cccccc"
      ctx.lineWidth = 2
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

      // Guidelines
      ctx.strokeStyle = "#eeeeee"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])

      // Horizontal center line
      ctx.beginPath()
      ctx.moveTo(20, canvas.height / 2)
      ctx.lineTo(canvas.width - 20, canvas.height / 2)
      ctx.stroke()

      // Text instructions
      ctx.fillStyle = "#666666"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Sign within this area", canvas.width / 2, 30)
      ctx.fillText("Recommended size: 400x150 pixels", canvas.width / 2, canvas.height - 20)

      // Download the template
      const link = document.createElement("a")
      link.download = `signature-template-${department.id}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            E-Signature Management - {department.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Department Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Department Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Department:</span>
                  <p className="font-medium">{department.fullName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Officer:</span>
                  <p className="font-medium">{department.officer}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{department.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="font-medium">{department.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Signature */}
          {currentSignature && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  Current E-Signature
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(currentSignature, "_blank")}>
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeleteSignature}
                      className="text-red-600 hover:text-red-700 bg-transparent"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <img
                    src={currentSignature || "/placeholder.svg"}
                    alt="Current signature"
                    className="max-h-24 max-w-full object-contain"
                    style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                  />
                </div>
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your e-signature is active and will be applied to approved clearances.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Upload New Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {currentSignature ? "Update E-Signature" : "Upload E-Signature"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Guidelines */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Signature Requirements:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>High-resolution PNG or JPG format</li>
                    <li>Transparent or white background preferred</li>
                    <li>Maximum file size: 5MB</li>
                    <li>Recommended dimensions: 400x150 pixels</li>
                    <li>Clear, legible signature that matches official documents</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Template Download */}
              <div className="flex justify-center">
                <Button variant="outline" onClick={downloadSignatureTemplate} className="bg-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download Signature Template
                </Button>
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="signature-upload">Upload Signature Image</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    id="signature-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">Click to upload signature image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Preview New Signature */}
              {newSignature && (
                <div>
                  <Label>Signature Preview</Label>
                  <div className="mt-2 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                    <img
                      src={newSignature || "/placeholder.svg"}
                      alt="New signature preview"
                      className="max-h-24 max-w-full object-contain mx-auto"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    />
                  </div>
                </div>
              )}

              {/* Signature Notes */}
              <div>
                <Label htmlFor="signature-notes">Notes (Optional)</Label>
                <Textarea
                  id="signature-notes"
                  value={signatureNotes}
                  onChange={(e) => setSignatureNotes(e.target.value)}
                  placeholder="Add any notes about this signature update..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveSignature}
                  disabled={!newSignature || isUploading}
                  className="flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      {currentSignature ? "Update Signature" : "Upload Signature"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <p>
                  <strong>PDF Placement:</strong> Your signature will be positioned at fixed coordinates on the
                  clearance form to match the paper version exactly.
                </p>
                <p>
                  <strong>Security:</strong> Signatures are encrypted and stored securely. Each application includes a
                  timestamp and audit trail.
                </p>
                <p>
                  <strong>Backup:</strong> Keep a backup copy of your signature file. You can re-upload it anytime if
                  needed.
                </p>
                <p>
                  <strong>Updates:</strong> You can update your signature at any time. New approvals will use the
                  updated signature.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
