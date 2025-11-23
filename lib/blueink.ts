import { Client } from "blueink-client-js"

let blueinkClient: InstanceType<typeof Client> | null = null

export function getBlueinkClient() {
  if (!blueinkClient) {
    const apiKey = process.env.BLUEINK_PRIVATE_API_KEY
    if (!apiKey) {
      throw new Error("BLUEINK_PRIVATE_API_KEY environment variable is not set")
    }
    blueinkClient = new Client(apiKey)
  }
  return blueinkClient
}

export interface BlueinkSignatureRequest {
  studentEmail: string
  studentName: string
  department: string
  clearanceDocumentUrl: string
  callbackUrl: string
}

export interface BlueinkSignatureResponse {
  bundleId: string
  signatureLink: string
  status: string
}
