"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader, Download, AlertCircle, FileText, CheckCircle } from "lucide-react"

interface PdfGeneratorWithBlueinkProps {
  studentName: string
  clearanceId: string
  departments: Array<{
    name: string
    officer: string
    signature?: string
    blueinkBundleId?: string
    signedAt?: string
  }>
  blueinkBundles?: Array<{
    bundleId: string
    status: string
    signers: Array<{ name: string; isSigned: boolean; signedAt?: string }>
  }>
}

export function PdfGeneratorWithBlueink({
  studentName,
  clearanceId,
  departments,
  blueinkBundles = [],
}: PdfGeneratorWithBlueinkProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const hasBlueinkSignatures = blueinkBundles.length > 0
  const allBlueinkSigned = blueinkBundles.every((b) => b.status === "completed")

  const handleGeneratePdf = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          clearanceId,
          departments,
          blueinkBundles,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const data = await response.json()
      setDownloadUrl(data.downloadUrl)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error("PDF generation error:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const canGenerate = departments.length > 0 || hasBlueinkSignatures

  return (
    <div className="space-y-4">
      {hasBlueinkSignatures && (
        <Alert className={allBlueinkSigned ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
          <FileText className="h-4 w-4" />
          <AlertDescription className={allBlueinkSigned ? "text-green-800" : "text-blue-800"}>
            {allBlueinkSigned
              ? "All BlueInk signatures are complete. Ready to generate final PDF."
              : "Waiting for all BlueInk signatures to be completed before PDF can include them."}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {downloadUrl ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <p className="mb-2">PDF generated successfully!</p>
            <a href={downloadUrl} download className="text-green-700 font-medium underline">
              Download PDF
            </a>
          </AlertDescription>
        </Alert>
      ) : (
        <Button
          onClick={handleGeneratePdf}
          disabled={isGenerating || !canGenerate}
          className="w-full flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Generate PDF with Signatures
            </>
          )}
        </Button>
      )}
    </div>
  )
}
