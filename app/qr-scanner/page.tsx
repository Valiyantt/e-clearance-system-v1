"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const [scannedData, setScannedData] = useState("")
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanningTimeout, setScanningTimeout] = useState<NodeJS.Timeout | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      checkCameraPermission()
    }

    // Cleanup on unmount
    return () => {
      if (scanningTimeout) {
        clearTimeout(scanningTimeout)
      }
      stopScanning()
    }
  }, [scanningTimeout])

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
      stream.getTracks().forEach((track) => track.stop()) // Stop the test stream
    } catch (err) {
      setHasPermission(false)
      setError("Camera access denied. Please allow camera permissions and refresh the page.")
    }
  }

  const startScanning = async () => {
    if (!hasPermission) {
      await checkCameraPermission()
      return
    }

    try {
      setIsScanning(true)
      setError("")
      setScannedData("")

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        // Start scanning for QR codes after video loads
        videoRef.current.onloadedmetadata = () => {
          scanForQRCode()
        }
      }
    } catch (err) {
      console.error("Camera error:", err)
      setError("Failed to access camera. Please check permissions and try again.")
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)

    if (scanningTimeout) {
      clearTimeout(scanningTimeout)
      setScanningTimeout(null)
    }
  }

  const scanForQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && isScanning) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // In a real implementation, you would use a QR code library like jsQR
        // For demo purposes, we'll simulate QR code detection
        simulateQRDetection()
      }

      if (isScanning) {
        requestAnimationFrame(scan)
      }
    }

    scan()
  }

  const simulateQRDetection = () => {
    // Simulate QR code detection after 3 seconds of scanning
    if (!scanningTimeout && isScanning) {
      const timeout = setTimeout(() => {
        if (isScanning) {
          // Generate a mock clearance token for demo
          const mockTokens = ["abc123def456", "xyz789abc123", "def456ghi789", "ghi789jkl012"]
          const randomToken = mockTokens[Math.floor(Math.random() * mockTokens.length)]
          const mockQRData = `${window.location.origin}/student/${randomToken}`
          handleQRCodeDetected(mockQRData)
        }
      }, 3000)
      setScanningTimeout(timeout)
    }
  }

  const handleQRCodeDetected = (data: string) => {
    setScannedData(data)
    stopScanning()

    // Extract token from URL or use data directly
    let token = ""
    if (data.includes("/student/")) {
      token = data.split("/student/")[1]
    } else if (data.length > 10) {
      // Assume it's a direct token
      token = data
    }

    if (token) {
      // Redirect to student clearance page
      setTimeout(() => {
        router.push(`/student/${token}`)
      }, 2000)
    } else {
      setError("Invalid QR code. Please scan a valid CLIME clearance QR code.")
    }
  }

  const handleManualEntry = () => {
    const input = prompt("Enter your clearance token:")
    if (input && input.trim()) {
      router.push(`/student/${input.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">QR Scanner</h1>
                <p className="text-sm text-gray-600">CLIME - Clearance Management System</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Scanner Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Camera Permission Check */}
            {hasPermission === false && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Camera access is required to scan QR codes. Please allow camera permissions in your browser settings
                  and refresh the page.
                </AlertDescription>
              </Alert>
            )}

            {/* Error Display */}
            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
            {scannedData && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>QR Code Detected!</strong> Redirecting to your clearance...
                  <div className="mt-2 text-sm font-mono bg-white p-2 rounded border">
                    {scannedData.length > 50 ? `${scannedData.substring(0, 50)}...` : scannedData}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Camera View */}
            <div className="relative">
              <video
                ref={videoRef}
                className={`w-full h-64 bg-gray-900 rounded-lg object-cover ${isScanning ? "block" : "hidden"}`}
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center animate-pulse">
                    <div className="text-white text-center">
                      <Camera className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Position QR code here</p>
                      <p className="text-xs mt-1">Scanning...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder when not scanning */}
              {!isScanning && !scannedData && (
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Ready to Scan</p>
                    <p className="text-sm">Click "Start Scanning" to begin</p>
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 mt-6">
              {!isScanning && !scannedData && hasPermission && (
                <Button onClick={startScanning} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              )}

              {isScanning && (
                <Button onClick={stopScanning} variant="outline" className="flex-1 bg-white">
                  Stop Scanning
                </Button>
              )}

              <Button onClick={handleManualEntry} variant="outline" className="flex-1 bg-white">
                Manual Entry
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How to Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">1</span>
                </div>
                <p>Allow camera access when prompted by your browser</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">2</span>
                </div>
                <p>Click "Start Scanning" to activate the camera</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">3</span>
                </div>
                <p>Position your clearance QR code within the scanning area</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-bold text-xs">4</span>
                </div>
                <p>Wait for automatic detection and redirection to your clearance</p>
              </div>
            </div>

            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Tip:</strong> Make sure you have good lighting and hold your device steady for best results. If
                scanning fails, you can use the "Manual Entry" option.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
