/**
 * Sync Status Badge Component
 * Displays real-time sync status for students/clearances
 */

"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Clock, Loader2 } from "lucide-react"

interface SyncStatusBadgeProps {
  itemId: string
  itemType: "student" | "clearance"
  variant?: "default" | "outline"
}

export default function SyncStatusBadge({ itemId, itemType, variant = "default" }: SyncStatusBadgeProps) {
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "failed" | "pending">("pending")
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null)

  useEffect(() => {
    checkSyncStatus()
    const interval = setInterval(checkSyncStatus, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [itemId, itemType])

  async function checkSyncStatus() {
    try {
      const response = await fetch(`/api/php-integration/sync-logs?syncType=${itemType}&limit=1`)
      const data = await response.json()

      if (data.success && data.data.length > 0) {
        const latestSync = data.data[0]
        setSyncStatus(latestSync.status === "success" ? "synced" : "failed")
        setLastSyncTime(new Date(latestSync.timestamp).toLocaleString())
      }
    } catch (error) {
      console.error("Failed to check sync status:", error)
    }
  }

  const statusConfig = {
    synced: {
      icon: CheckCircle2,
      color: "bg-green-100 text-green-800",
      label: "Synced",
    },
    syncing: {
      icon: Loader2,
      color: "bg-blue-100 text-blue-800",
      label: "Syncing",
    },
    failed: {
      icon: AlertCircle,
      color: "bg-red-100 text-red-800",
      label: "Sync Failed",
    },
    pending: {
      icon: Clock,
      color: "bg-yellow-100 text-yellow-800",
      label: "Pending Sync",
    },
  }

  const config = statusConfig[syncStatus]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2">
      <Badge className={config.color} variant={variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
      {lastSyncTime && <span className="text-xs text-muted-foreground">{lastSyncTime}</span>}
    </div>
  )
}
