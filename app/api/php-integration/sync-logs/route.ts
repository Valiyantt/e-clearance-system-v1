/**
 * API Route: Get PHP Integration Sync Logs
 * GET /api/php-integration/sync-logs
 */

import { type NextRequest, NextResponse } from "next/server"
import { getSyncLogs } from "@/lib/php-sync-client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const syncType = searchParams.get("syncType") || undefined
    const status = searchParams.get("status") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

    const logs = getSyncLogs({
      syncType: syncType as any,
      status: status as any,
      limit,
    })

    return NextResponse.json({
      success: true,
      data: logs,
      total: logs.length,
    })
  } catch (error) {
    console.error("[v0] Sync logs error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sync logs",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
