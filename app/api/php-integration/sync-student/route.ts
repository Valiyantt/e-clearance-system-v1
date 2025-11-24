/**
 * API Route: Sync Student Data to PHP
 * POST /api/php-integration/sync-student
 */

import { type NextRequest, NextResponse } from "next/server"
import { pushStudentToPhp } from "@/lib/php-sync-client"
import { mapStudentToPhp } from "@/lib/php-integration-mapper"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student } = body

    if (!student) {
      return NextResponse.json({ success: false, message: "Student data is required" }, { status: 400 })
    }

    // Map Next.js student to PHP format
    const phpStudent = mapStudentToPhp(student)

    // Send to PHP system
    const result = await pushStudentToPhp(phpStudent)

    return NextResponse.json({
      success: true,
      message: "Student synchronized to PHP system",
      data: result,
    })
  } catch (error) {
    console.error("[v0] Student sync error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to synchronize student to PHP system",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
