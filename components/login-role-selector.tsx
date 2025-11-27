"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Shield } from "lucide-react"

interface LoginRoleSelectorProps {
  onSelectRole: (role: "student" | "admin") => void
}

export function LoginRoleSelector({ onSelectRole }: LoginRoleSelectorProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Sign In to Your Account</h2>
        <p className="text-lg text-muted-foreground text-balance">
          Choose your role to access the clearance management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Login */}
        <Card
          className="border border-border hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer"
          onClick={() => onSelectRole("student")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              Student
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Access your clearance status and track progress</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  View clearance requirements
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Track approval status
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Download documents
                </li>
              </ul>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In as Student
            </Button>
          </CardContent>
        </Card>

        {/* Administrator Login */}
        <Card
          className="border border-border hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer"
          onClick={() => onSelectRole("admin")}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-foreground">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              Administrator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">Manage clearances and departmental operations</p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Review student clearances
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Approve/reject requests
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  Manage signatures
                </li>
              </ul>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In as Administrator
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
