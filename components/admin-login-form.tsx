"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ForgotPasswordModal } from "./forgot-password-modal"

const departments = [
  { id: "cashier", name: "Cashier" },
  { id: "library", name: "Library" },
  { id: "guidance", name: "Guidance" },
  { id: "clinic", name: "Clinic" },
  { id: "registrar", name: "Registrar" },
]

interface AdminLoginFormProps {
  onBack: () => void
}

export function AdminLoginForm({ onBack }: AdminLoginFormProps) {
  const [selectedDept, setSelectedDept] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedDept) {
      setError("Please select a department")
      return
    }

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push(`/admin/${selectedDept}`)
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-foreground">Administrator Login</CardTitle>
            <p className="text-center text-sm text-muted-foreground mt-2">Access department clearance management</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium text-foreground">
                  Department
                </Label>
                <select
                  id="department"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3 py-2 bg-background text-foreground border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select your department...</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-foreground">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="bg-background text-foreground border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-background text-foreground border-border"
                />
              </div>

              {error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-primary hover:text-primary/80 p-0 h-auto"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </Button>
            </div>

            <div className="border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isLoading}
                className="w-full border-border hover:bg-muted bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Role Selection
              </Button>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800 text-xs">
                <strong>Demo Mode:</strong> Enter any username and password to access the department dashboard.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} userType="admin" />
    </>
  )
}
