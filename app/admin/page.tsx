"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Building, AlertTriangle, ArrowLeft, LogIn } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const departments = [
  {
    id: "cashier",
    name: "Cashier",
    fullName: "Cashier's Office",
    officer: "Ms. Ana Reyes",
    email: "cashier@smcl.edu.ph",
    description: "Financial Services & Payment Processing",
    stats: { total: 150, pending: 45, approved: 95, overdue: 10 },
  },
  {
    id: "library",
    name: "Library",
    fullName: "Library Services",
    officer: "Mr. Jose Dela Cruz",
    email: "library@smcl.edu.ph",
    description: "Library Resources & Book Management",
    stats: { total: 150, pending: 60, approved: 85, overdue: 5 },
  },
  {
    id: "guidance",
    name: "Guidance",
    fullName: "Guidance Office",
    officer: "Dr. Carmen Lopez",
    email: "guidance@smcl.edu.ph",
    description: "Student Counseling & Support Services",
    stats: { total: 150, pending: 80, approved: 65, overdue: 5 },
  },
  {
    id: "clinic",
    name: "Clinic",
    fullName: "Health Services",
    officer: "Nurse Maria Garcia",
    email: "clinic@smcl.edu.ph",
    description: "Health Services & Medical Records",
    stats: { total: 150, pending: 70, approved: 75, overdue: 5 },
  },
  {
    id: "registrar",
    name: "Registrar",
    fullName: "Registrar's Office",
    officer: "Ms. Rosa Martinez",
    email: "registrar@smcl.edu.ph",
    description: "Academic Records & Registration",
    stats: { total: 150, pending: 90, approved: 55, overdue: 5 },
  },
]

export default function AdminPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const router = useRouter()

  const handleDepartmentSelect = (deptId: string) => {
    setSelectedDepartment(deptId)
    setShowLogin(true)
  }

  const handleLogin = async () => {
    if (!credentials.username || !credentials.password) {
      alert("Please enter both username and password")
      return
    }

    setIsLoading(true)

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, validate credentials here
      // For demo, accept any non-empty credentials
      console.log("Login attempt:", { department: selectedDepartment, username: credentials.username })

      // Redirect to department dashboard
      router.push(`/admin/${selectedDepartment}`)
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetLogin = () => {
    setShowLogin(false)
    setSelectedDepartment("")
    setCredentials({ username: "", password: "" })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Department Portal</h1>
                <p className="text-sm text-gray-600">CLIME - Clearance Management System</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!showLogin ? (
          <>
            {/* Department Selection */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Department</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose your department to access the clearance management dashboard
              </p>
            </div>

            {/* Department Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {departments.map((dept) => (
                <Card
                  key={dept.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleDepartmentSelect(dept.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-blue-600" />
                      {dept.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{dept.fullName}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Officer</p>
                        <p className="font-medium">{dept.officer}</p>
                        <p className="text-xs text-gray-500">{dept.email}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Description</p>
                        <p className="text-sm text-gray-700">{dept.description}</p>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{dept.stats.approved}</div>
                          <div className="text-xs text-gray-600">Approved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{dept.stats.pending}</div>
                          <div className="text-xs text-gray-600">Pending</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-red-600">{dept.stats.overdue}</div>
                          <div className="text-xs text-gray-600">Overdue</div>
                        </div>
                      </div>

                      <Button className="w-full mt-4">
                        <LogIn className="h-4 w-4 mr-2" />
                        Access Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* System Status */}
            <Card className="max-w-2xl mx-auto mt-12">
              <CardHeader>
                <CardTitle className="text-center">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">All Departments Online</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Database Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Login Form */
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {departments.find((d) => d.id === selectedDepartment)?.name} Login
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Department:</strong> {departments.find((d) => d.id === selectedDepartment)?.fullName}
                      <br />
                      <strong>Officer:</strong> {departments.find((d) => d.id === selectedDepartment)?.officer}
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                      placeholder="Enter your username"
                      onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleLogin} className="flex-1" disabled={isLoading}>
                      {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                    <Button variant="outline" onClick={resetLogin} disabled={isLoading} className="bg-white">
                      Back
                    </Button>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Demo Mode:</strong> Enter any username and password to access the dashboard.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
