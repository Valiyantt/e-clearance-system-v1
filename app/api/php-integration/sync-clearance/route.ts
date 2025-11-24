/**
 * API Route: Sync Clearance Status to PHP
 * POST /api/php-integration/sync-clearance
 */

import { type NextRequest, NextResponse } from "next/server"
import { pushClearanceToPhp } from "@/lib/php-sync-client"
import { mapClearanceToPhp } from "@/lib/php-integration-mapper"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clearanceItem, studentId } = body

    if (!clearanceItem || !studentId) {
      return NextResponse.json(
        { success: false, message: "Clearance item and student ID are required" },
        { status: 400 },
      )
    }

    // Map clearance to PHP format
    const phpClearance = mapClearanceToPhp(clearanceItem, studentId)

    // Send to PHP system
    const result = await pushClearanceToPhp(phpClearance, studentId)

    return NextResponse.json({
      success: true,
      message: "Clearance status synchronized to PHP system",
      data: result,
    })
  } catch (error) {
    console.error("[v0] Clearance sync error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to synchronize clearance to PHP system",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
