"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, X, Edit } from "lucide-react"

interface SignatureSectionProps {
  id: string
  department: string
  officer: string
  status: "pending" | "approved" | "rejected"
  onUpdate: (id: string, status: "approved" | "rejected", remarks?: string) => void
}

export function SignatureSection({ id, department, officer, status, onUpdate }: SignatureSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [remarks, setRemarks] = useState("")
  const [officerName, setOfficerName] = useState("")

  const handleApprove = () => {
    onUpdate(id, "approved", remarks)
    setIsOpen(false)
    setRemarks("")
    setOfficerName("")
  }

  const handleReject = () => {
    onUpdate(id, "rejected", remarks)
    setIsOpen(false)
    setRemarks("")
    setOfficerName("")
  }

  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="font-medium">{department}</span>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-gray-600">{officer}</p>
      </div>

      <div className="flex items-center gap-2">
        {status === "approved" && <CheckCircle className="h-5 w-5 text-green-600" />}
        {status === "rejected" && <X className="h-5 w-5 text-red-600" />}

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              {status === "pending" ? "Process" : "Update"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{department} - Clearance Processing</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="officerName">Officer Name</Label>
                <Input
                  id="officerName"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <Label htmlFor="remarks">Remarks (Optional)</Label>
                <Textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any remarks or notes"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleApprove} className="flex-1">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button onClick={handleReject} variant="destructive" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
