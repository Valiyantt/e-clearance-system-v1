/**
 * PHP Sync Client
 * Handles all communication with the PHP system
 */

const PHP_API_URL = process.env.PHP_SYSTEM_URL || "https://api.php-system.local"
const PHP_API_KEY = process.env.PHP_API_KEY || ""
const PHP_SECRET = process.env.PHP_API_SECRET || ""

export interface SyncConfig {
  enabled: boolean
  url: string
  apiKey: string
  syncInterval: number // in minutes
  retryAttempts: number
}

// Store sync logs in memory (replace with database in production)
let syncLogs: any[] = []

export async function fetchFromPhp(endpoint: string, method = "GET", data?: any): Promise<any> {
  try {
    const headers: any = {
      "Content-Type": "application/json",
      "X-API-Key": PHP_API_KEY,
      "X-API-Secret": PHP_SECRET,
      "User-Agent": "clearme-system/1.0",
    }

    const options: any = {
      method,
      headers,
    }

    if (data && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(data)
    }

    const response = await fetch(`${PHP_API_URL}${endpoint}`, options)

    if (!response.ok) {
      throw new Error(`PHP API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] PHP API Error:", error)
    throw error
  }
}

export async function pushStudentToPhp(student: any): Promise<any> {
  try {
    const response = await fetchFromPhp("/api/students", "POST", {
      student,
      sync_source: "clearme",
      timestamp: new Date().toISOString(),
    })

    logSync("student", "to_php", "success", student.id, response.php_student_id)
    return response
  } catch (error) {
    logSync("student", "to_php", "failed", student.id, "", (error as Error).message)
    throw error
  }
}

export async function pushClearanceToPhp(clearanceItem: any, studentId: string): Promise<any> {
  try {
    const response = await fetchFromPhp("/api/clearances", "POST", {
      student_id: studentId,
      clearance: clearanceItem,
      sync_source: "clearme",
      timestamp: new Date().toISOString(),
    })

    logSync("clearance", "to_php", "success", clearanceItem.id, response.php_clearance_id)
    return response
  } catch (error) {
    logSync("clearance", "to_php", "failed", clearanceItem.id, "", (error as Error).message)
    throw error
  }
}

export async function fetchStudentsFromPhp(filters?: any): Promise<any[]> {
  try {
    const queryParams = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        queryParams.append(key, String(value))
      })
    }

    const endpoint = `/api/students${queryParams.toString() ? "?" + queryParams.toString() : ""}`
    const response = await fetchFromPhp(endpoint)

    logSync("student", "from_php", "success", "", "")
    return response.students || []
  } catch (error) {
    logSync("student", "from_php", "failed", "", "", (error as Error).message)
    throw error
  }
}

export async function fetchClearancesFromPhp(studentId: string): Promise<any[]> {
  try {
    const response = await fetchFromPhp(`/api/clearances?student_id=${studentId}`)

    logSync("clearance", "from_php", "success", "", studentId)
    return response.clearances || []
  } catch (error) {
    logSync("clearance", "from_php", "failed", "", studentId, (error as Error).message)
    throw error
  }
}

export async function updateClearanceStatusInPhp(clearanceId: string, status: string, signature?: any): Promise<any> {
  try {
    const response = await fetchFromPhp(`/api/clearances/${clearanceId}`, "PUT", {
      status,
      signature,
      sync_source: "clearme",
      timestamp: new Date().toISOString(),
    })

    logSync("clearance", "to_php", "success", clearanceId, response.php_clearance_id)
    return response
  } catch (error) {
    logSync("clearance", "to_php", "failed", clearanceId, "", (error as Error).message)
    throw error
  }
}

function logSync(syncType: string, direction: string, status: string, phpId: string, nextId: string, error?: string) {
  const log = {
    id: Math.random().toString(36).substr(2, 9),
    sync_type: syncType,
    direction,
    status,
    php_id: phpId,
    next_id: nextId,
    error_message: error,
    timestamp: new Date().toISOString(),
    retry_count: 0,
  }

  syncLogs.push(log)

  // Keep only last 1000 logs in memory
  if (syncLogs.length > 1000) {
    syncLogs = syncLogs.slice(-1000)
  }

  console.log("[v0] PHP Sync Log:", log)
}

export function getSyncLogs(filter?: { syncType?: string; status?: string; limit?: number }): any[] {
  let logs = [...syncLogs]

  if (filter?.syncType) {
    logs = logs.filter((log) => log.sync_type === filter.syncType)
  }

  if (filter?.status) {
    logs = logs.filter((log) => log.status === filter.status)
  }

  if (filter?.limit) {
    logs = logs.slice(-filter.limit)
  }

  return logs
}
