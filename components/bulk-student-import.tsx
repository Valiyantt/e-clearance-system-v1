"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Download, CheckCircle, AlertCircle, FileText, Users } from "lucide-react"

interface BulkStudentImportProps {
  isOpen: boolean
  onClose: () => void
}

interface ImportResult {
  success: number
  failed: number
  errors: string[]
  students: any[]
}

export function BulkStudentImport({ isOpen, onClose }: BulkStudentImportProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [semester, setSemester] = useState("2nd Semester")
  const [academicYear, setAcademicYear] = useState("2024-2025")
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        alert("Please select a CSV file")
        return
      }
      setSelectedFile(file)
      setImportResult(null)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `student_id,first_name,last_name,email,contact_number,address,program,section,year_level
2024-001,Maria,Santos,maria.santos@student.smcl.edu.ph,+63 912 345 6789,"123 Main St, Biñan, Laguna",Bachelor of Science in Information Technology,BSIT-4A,4th Year
2024-002,John,Doe,john.doe@student.smcl.edu.ph,+63 912 345 6790,"456 Oak Ave, Biñan, Laguna",Bachelor of Science in Business Administration,BSBA-3B,3rd Year`

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "student_import_template.csv"
    link.click()
    window.URL.revokeObjectURL(url)
  }

  const processImport = async () => {
    if (!selectedFile) {
      alert("Please select a file first")
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      // Simulate file processing
      const reader = new FileReader()
      reader.onload = async (e) => {
        const csvContent = e.target?.result as string
        const lines = csvContent.split("\n")
        const headers = lines[0].split(",")

        // Validate headers
        const requiredHeaders = ["student_id", "first_name", "last_name", "email", "program", "section", "year_level"]
        const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))

        if (missingHeaders.length > 0) {
          alert(`Missing required columns: ${missingHeaders.join(", ")}`)
          setIsProcessing(false)
          return
        }

        const students = []
        const errors = []

        // Process each row
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === "") continue

          setProgress((i / (lines.length - 1)) * 100)
          await new Promise((resolve) => setTimeout(resolve, 100)) // Simulate processing time

          const values = lines[i].split(",")
          const student: any = {}

          headers.forEach((header, index) => {
            student[header.trim()] = values[index]?.trim().replace(/"/g, "")
          })

          // Validate student data
          if (!student.student_id || !student.email || !student.first_name || !student.last_name) {
            errors.push(`Row ${i + 1}: Missing required fields`)
            continue
          }

          // Add semester and academic year
          student.semester = semester
          student.academic_year = academicYear
          student.full_name = `${student.first_name} ${student.last_name}`

          students.push(student)
        }

        // Simulate API call to save students
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setImportResult({
          success: students.length,
          failed: errors.length,
          errors,
          students,
        })

        console.log("Imported students:", students)
      }

      reader.readAsText(selectedFile)
    } catch (error) {
      console.error("Import error:", error)
      alert("Failed to process import. Please try again.")
    } finally {
      setIsProcessing(false)
      setProgress(100)
    }
  }

  const resetImport = () => {
    setSelectedFile(null)
    setImportResult(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Student Import
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!importResult && (
            <>
              {/* Instructions */}
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Import Instructions:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>Download the CSV template and fill in student information</li>
                    <li>Required columns: student_id, first_name, last_name, email, program, section, year_level</li>
                    <li>Optional columns: contact_number, address</li>
                    <li>Maximum 1000 students per import</li>
                    <li>Duplicate student IDs will be skipped</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {/* Template Download */}
              <div className="flex justify-center">
                <Button onClick={downloadTemplate} variant="outline" className="bg-white">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </div>

              {/* Semester Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select value={semester} onValueChange={setSemester}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Semester">1st Semester</SelectItem>
                      <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                      <SelectItem value="Summer">Summer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2025-2026">2025-2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <Label htmlFor="csvFile">Upload CSV File</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 bg-white"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : "Click to upload CSV file"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">CSV files only, max 10MB</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Processing Progress */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing import...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Import Completed!</strong> Successfully imported {importResult.success} students.
                  {importResult.failed > 0 && ` ${importResult.failed} records failed.`}
                </AlertDescription>
              </Alert>

              {/* Error Summary */}
              {importResult.errors.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Import Errors:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      {importResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {importResult.errors.length > 5 && <li>... and {importResult.errors.length - 5} more errors</li>}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Imported Students Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Imported Students ({importResult.students.length})</h3>
                <div className="max-h-64 overflow-y-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importResult.students.slice(0, 10).map((student, index) => (
                        <TableRow key={index}>
                          <TableCell>{student.student_id}</TableCell>
                          <TableCell>{student.full_name}</TableCell>
                          <TableCell>{student.program}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>{student.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {importResult.students.length > 10 && (
                    <div className="p-3 text-center text-sm text-gray-600 border-t">
                      ... and {importResult.students.length - 10} more students
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            {!importResult ? (
              <>
                <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button
                  onClick={processImport}
                  disabled={!selectedFile || isProcessing}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import Students
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={resetImport}>
                  Import More
                </Button>
                <Button onClick={onClose}>Close</Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
