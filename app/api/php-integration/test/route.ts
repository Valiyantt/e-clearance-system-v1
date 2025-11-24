/**
 * API Route: Test PHP Connection
 * POST /api/php-integration/test
 */

import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, apiKey } = body

    // Test the connection to PHP system
    const testEndpoint = `${url}/api/health`
    const response = await fetch(testEndpoint, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey || "",
      },
    })

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Connection successful",
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Connection failed: ${response.statusText}`,
        },
        { status: response.status },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Connection error: " + (error as Error).message,
      },
      { status: 500 },
    )
  }
}
