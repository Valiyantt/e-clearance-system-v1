"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface BlueinkBundle {
  bundleId: string
  studentName: string
  facultyName: string
  status: "created" | "in-progress" | "completed" | "expired"
  createdAt: string
  completedAt?: string
  signers: Array<{
    email: string
    name: string
    isSigned: boolean
    signedAt?: string
  }>
}

interface BlueinkBundleTrackerProps {
  bundles: BlueinkBundle[]
  onRefresh: () => void
}

export function BlueinkBundleTracker({ bundles, onRefresh }: BlueinkBundleTrackerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Mail className="h-4 w-4 text-gray-600" />
    }
  }

  if (bundles.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            BlueInk E-Signature Requests
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "Refresh Status"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {bundles.map((bundle) => {
          const totalSigners = bundle.signers.length
          const signedCount = bundle.signers.filter((s) => s.isSigned).length

          return (
            <div key={bundle.bundleId} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(bundle.status)}
                  <div>
                    <p className="font-medium">
                      {bundle.facultyName} - {bundle.studentName}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(bundle.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(bundle.status)}>
                  {signedCount}/{totalSigners} Signed
                </Badge>
              </div>

              {/* Signers Progress */}
              <div className="space-y-2">
                {bundle.signers.map((signer) => (
                  <div key={signer.email} className="flex items-center gap-2 text-sm">
                    {signer.isSigned ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                    <span className="flex-1">{signer.name}</span>
                    {signer.isSigned && (
                      <span className="text-xs text-green-600">{new Date(signer.signedAt!).toLocaleDateString()}</span>
                    )}
                  </div>
                ))}
              </div>

              {bundle.status === "completed" && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 text-sm">
                    All parties have signed. The clearance document is ready for download.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
