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

interface StudentLoginFormProps {
  onBack: () => void
}

export function StudentLoginForm({ onBack }: StudentLoginFormProps) {
  const [token, setToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!token.trim()) {
      setError("Please enter your clearance token")
      return
    }

    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push(`/student/${token.trim()}`)
    } catch (err) {
      setError("Failed to access clearance. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="max-w-md mx-auto">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-foreground">Student Login</CardTitle>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Enter your clearance token to access your status
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token" className="text-sm font-medium text-foreground">
                  Clearance Token
                </Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter your token (e.g., abc123def456)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={isLoading}
                  className="bg-background text-foreground border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Your token was provided via email. Check your student portal if you don't have it.
                </p>
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
                    Accessing...
                  </>
                ) : (
                  "Access Clearance"
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
                Lost your token? Request a new one
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
                <strong>Demo Token:</strong> Try using "abc123def456" or "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        userType="student"
      />
    </>
  )
}
