/**
 * API Route: Trigger Full Sync
 * POST /api/php-integration/sync-all
 */

import { type NextRequest, NextResponse } from "next/server"
import { pushStudentToPhp } from "@/lib/php-sync-client"
import { mapStudentToPhp } from "@/lib/php-integration-mapper"

// Mock data - in production, fetch from database
const mockStudents = [
  {
    id: "test-001",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    program: "BS Information Technology",
    section: "BSIT-1A",
    yearLevel: "1st Year",
    email: "john.doe@student.edu",
    contactNumber: "+63 912 345 6789",
    address: "123 Main St",
    enrollmentDate: "2024-08-01",
    expectedGraduation: "2028-04-30",
    paymentStatus: "cleared",
    clearanceId: "CLR-2025-001",
    submittedDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    uniqueToken: "token123",
  },
]

export async function POST(request: NextRequest) {
  try {
    let totalSynced = 0
    const syncResults = {
      students: 0,
      clearances: 0,
      failed: 0,
    }

    // Sync all students
    for (const student of mockStudents) {
      try {
        await pushStudentToPhp(mapStudentToPhp(student))
        syncResults.students++
        totalSynced++
      } catch (error) {
        console.error("[v0] Failed to sync student:", student.id, error)
        syncResults.failed++
      }
    }

    return NextResponse.json({
      success: true,
      message: "Full sync completed",
      synced: totalSynced,
      results: syncResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Sync all error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to complete sync",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
