/**
 * PHP Integration Management Panel
 * Displays sync status, logs, and configuration
 */

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Clock, RefreshCw, Settings } from "lucide-react"

export default function PHPIntegrationPanel() {
  const [syncLogs, setSyncLogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [syncStats, setSyncStats] = useState({
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
    pendingSyncs: 0,
  })

  useEffect(() => {
    fetchSyncLogs()
  }, [])

  async function fetchSyncLogs() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/php-integration/sync-logs?limit=20")
      const data = await response.json()

      if (data.success) {
        setSyncLogs(data.data)

        // Calculate stats
        const stats = {
          totalSyncs: data.data.length,
          successfulSyncs: data.data.filter((log: any) => log.status === "success").length,
          failedSyncs: data.data.filter((log: any) => log.status === "failed").length,
          pendingSyncs: data.data.filter((log: any) => log.status === "pending").length,
        }
        setSyncStats(stats)
      }
    } catch (error) {
      console.error("Failed to fetch sync logs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSyncTypeLabel = (syncType: string) => {
    const labels: Record<string, string> = {
      student: "Student Data",
      clearance: "Clearance Status",
      signature: "Signature",
    }
    return labels[syncType] || syncType
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Syncs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{syncStats.totalSyncs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{syncStats.successfulSyncs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{syncStats.failedSyncs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{syncStats.pendingSyncs}</div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            PHP System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">PHP System URL</label>
            <div className="text-sm text-foreground mt-1">{process.env.NEXT_PUBLIC_BASE_URL || "Not configured"}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">API Status</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-foreground">Connected</span>
            </div>
          </div>
          <Button variant="outline" className="w-full bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Configure Integration
          </Button>
        </CardContent>
      </Card>

      {/* Sync Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Sync Activity</CardTitle>
          <Button size="sm" variant="outline" onClick={fetchSyncLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncLogs.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">No sync activity yet</p>
              </div>
            ) : (
              syncLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {log.status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : log.status === "failed" ? (
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{getSyncTypeLabel(log.sync_type)}</span>
                        <Badge className={getStatusBadgeColor(log.status)}>{log.status}</Badge>
                        <span className="text-xs text-muted-foreground">{log.direction}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                      {log.error_message && <div className="text-xs text-red-600 mt-1">{log.error_message}</div>}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground text-right">Retry: {log.retry_count}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
