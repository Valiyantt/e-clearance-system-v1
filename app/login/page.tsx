"use client"

import { useState } from "react"
import { StudentLoginForm } from "@/components/student-login-form"
import { AdminLoginForm } from "@/components/admin-login-form"
import { LoginRoleSelector } from "@/components/login-role-selector"
import { FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "admin" | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">ClearMe</h1>
                <p className="text-xs text-muted-foreground">Student Clearance System</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {selectedRole === null ? (
          <LoginRoleSelector onSelectRole={setSelectedRole} />
        ) : selectedRole === "student" ? (
          <StudentLoginForm onBack={() => setSelectedRole(null)} />
        ) : (
          <AdminLoginForm onBack={() => setSelectedRole(null)} />
        )}
      </div>
    </div>
  )
}
