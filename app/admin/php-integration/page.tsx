/**
 * PHP Integration Management Page
 * Admin interface for configuring and monitoring PHP system sync
 */

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PHPIntegrationPanel from "@/components/php-integration-panel"
import { AlertCircle, CheckCircle2, LinkIcon, Send } from "lucide-react"

export default function PHPIntegrationPage() {
  const [phpUrl, setPhpUrl] = useState(process.env.NEXT_PUBLIC_BASE_URL || "")
  const [phpApiKey, setPhpApiKey] = useState("")
  const [testResult, setTestResult] = useState<any>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [activeSyncType, setActiveSyncType] = useState("students")

  async function testConnection() {
    if (!phpUrl.trim()) {
      alert("Please enter a PHP System URL")
      return
    }

    setIsTestingConnection(true)
    try {
      // Simulate API test
      const response = await fetch("/api/php-integration/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: phpUrl, apiKey: phpApiKey }),
      })

      if (response.ok) {
        setTestResult({ success: true, message: "Connection successful" })
      } else {
        setTestResult({ success: false, message: "Connection failed" })
      }
    } catch (error) {
      setTestResult({ success: false, message: (error as Error).message })
    } finally {
      setIsTestingConnection(false)
    }
  }

  async function triggerSyncAll() {
    try {
      const response = await fetch("/api/php-integration/sync-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()
      alert(`Sync initiated. ${data.synced} items synchronized.`)
    } catch (error) {
      alert("Failed to trigger sync: " + (error as Error).message)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">PHP Integration Manager</h1>
        <p className="text-muted-foreground mt-2">Configure and monitor bidirectional sync with your PHP system</p>
      </div>

      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Connection Settings
              </CardTitle>
              <CardDescription>Configure your PHP system connection details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="phpUrl">PHP System URL</Label>
                <Input
                  id="phpUrl"
                  placeholder="https://api.php-system.local"
                  value={phpUrl}
                  onChange={(e) => setPhpUrl(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phpApiKey">API Key</Label>
                <Input
                  id="phpApiKey"
                  placeholder="Enter your PHP API key"
                  type="password"
                  value={phpApiKey}
                  onChange={(e) => setPhpApiKey(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button onClick={testConnection} disabled={isTestingConnection} className="w-full">
                {isTestingConnection ? "Testing..." : "Test Connection"}
              </Button>

              {testResult && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    testResult.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {testResult.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sync Options</CardTitle>
              <CardDescription>Configure what data to synchronize</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">Student Data</div>
                    <div className="text-xs text-muted-foreground">Sync student information and enrollment details</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">Clearance Status</div>
                    <div className="text-xs text-muted-foreground">Sync clearance approvals and status updates</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <div>
                    <div className="font-medium text-sm">Signatures</div>
                    <div className="text-xs text-muted-foreground">Sync digital and image signatures</div>
                  </div>
                </label>
              </div>

              <Button onClick={triggerSyncAll} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Trigger Full Sync Now
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring">
          <PHPIntegrationPanel />
        </TabsContent>

        {/* Documentation Tab */}
        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Available Endpoints</h4>
                <div className="space-y-2 bg-muted p-3 rounded-lg font-mono text-xs">
                  <div>POST /api/php-integration/sync-student</div>
                  <div>POST /api/php-integration/sync-clearance</div>
                  <div>POST /api/php-integration/webhook</div>
                  <div>GET /api/php-integration/sync-logs</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Webhook Events</h4>
                <div className="space-y-2 bg-muted p-3 rounded-lg font-mono text-xs">
                  <div>student.updated</div>
                  <div>clearance.approved</div>
                  <div>clearance.rejected</div>
                  <div>signature.received</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Environment Variables Required</h4>
                <div className="space-y-2 bg-muted p-3 rounded-lg font-mono text-xs">
                  <div>PHP_SYSTEM_URL</div>
                  <div>PHP_API_KEY</div>
                  <div>PHP_API_SECRET</div>
                  <div>PHP_WEBHOOK_SECRET</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
