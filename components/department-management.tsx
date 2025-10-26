"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Building, Plus, Edit, Trash2, Save, AlertCircle } from "lucide-react"

interface Department {
  id: string
  code: string
  name: string
  fullName: string
  description: string
  officerName: string
  officerEmail: string
  displayOrder: number
  isActive: boolean
  totalStudents: number
  pendingCount: number
}

interface DepartmentManagementProps {
  isOpen: boolean
  onClose: () => void
}

export function DepartmentManagement({ isOpen, onClose }: DepartmentManagementProps) {
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      code: "CASHIER",
      name: "Cashier",
      fullName: "Cashier's Office",
      description: "Financial Services & Payment Processing",
      officerName: "Ms. Ana Reyes",
      officerEmail: "ana.reyes@smcl.edu.ph",
      displayOrder: 1,
      isActive: true,
      totalStudents: 150,
      pendingCount: 45,
    },
    {
      id: "2",
      code: "LIBRARY",
      name: "Library",
      fullName: "Library Services",
      description: "Library Resources & Book Management",
      officerName: "Mr. Jose Dela Cruz",
      officerEmail: "jose.delacruz@smcl.edu.ph",
      displayOrder: 2,
      isActive: true,
      totalStudents: 150,
      pendingCount: 60,
    },
    {
      id: "3",
      code: "GUIDANCE",
      name: "Guidance",
      fullName: "Guidance Office",
      description: "Student Counseling & Support Services",
      officerName: "Dr. Carmen Lopez",
      officerEmail: "carmen.lopez@smcl.edu.ph",
      displayOrder: 3,
      isActive: true,
      totalStudents: 150,
      pendingCount: 80,
    },
    {
      id: "4",
      code: "CLINIC",
      name: "Clinic",
      fullName: "Health Services",
      description: "Health Services & Medical Records",
      officerName: "Nurse Maria Garcia",
      officerEmail: "maria.garcia@smcl.edu.ph",
      displayOrder: 4,
      isActive: true,
      totalStudents: 150,
      pendingCount: 70,
    },
    {
      id: "5",
      code: "REGISTRAR",
      name: "Registrar",
      fullName: "Registrar's Office",
      description: "Academic Records & Registration",
      officerName: "Ms. Rosa Martinez",
      officerEmail: "rosa.martinez@smcl.edu.ph",
      displayOrder: 5,
      isActive: true,
      totalStudents: 150,
      pendingCount: 90,
    },
  ])

  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    fullName: "",
    description: "",
    officerName: "",
    officerEmail: "",
    displayOrder: 1,
    isActive: true,
  })

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      fullName: "",
      description: "",
      officerName: "",
      officerEmail: "",
      displayOrder: departments.length + 1,
      isActive: true,
    })
    setEditingDepartment(null)
    setIsAddingNew(false)
  }

  const handleEdit = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      code: department.code,
      name: department.name,
      fullName: department.fullName,
      description: department.description,
      officerName: department.officerName,
      officerEmail: department.officerEmail,
      displayOrder: department.displayOrder,
      isActive: department.isActive,
    })
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    resetForm()
    setIsAddingNew(true)
  }

  const handleSave = async () => {
    if (!formData.code || !formData.name || !formData.officerName || !formData.officerEmail) {
      alert("Please fill in all required fields")
      return
    }

    setIsSaving(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (isAddingNew) {
        const newDepartment: Department = {
          id: Date.now().toString(),
          ...formData,
          totalStudents: 0,
          pendingCount: 0,
        }
        setDepartments((prev) => [...prev, newDepartment])
      } else if (editingDepartment) {
        setDepartments((prev) =>
          prev.map((dept) => (dept.id === editingDepartment.id ? { ...dept, ...formData } : dept)),
        )
      }

      resetForm()
      alert("Department saved successfully!")
    } catch (error) {
      console.error("Error saving department:", error)
      alert("Failed to save department. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (department: Department) => {
    if (department.totalStudents > 0) {
      alert("Cannot delete department with active students. Please transfer students first.")
      return
    }

    if (!confirm(`Are you sure you want to delete ${department.name}? This action cannot be undone.`)) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setDepartments((prev) => prev.filter((dept) => dept.id !== department.id))
      alert("Department deleted successfully!")
    } catch (error) {
      console.error("Error deleting department:", error)
      alert("Failed to delete department. Please try again.")
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Department Management
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Departments ({departments.length})</h3>
            <Button onClick={handleAddNew} disabled={isAddingNew || editingDepartment}>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </div>

          {/* Department Form */}
          {(isAddingNew || editingDepartment) && (
            <div className="border rounded-lg p-6 bg-gray-50">
              <h4 className="text-base font-semibold mb-4">
                {isAddingNew ? "Add New Department" : `Edit ${editingDepartment?.name}`}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Department Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => updateFormData("code", e.target.value.toUpperCase())}
                    placeholder="e.g., CASHIER"
                    disabled={!isAddingNew}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Department Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    placeholder="e.g., Cashier"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="e.g., Cashier's Office"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    placeholder="Brief description of department services"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="officerName">Officer Name *</Label>
                  <Input
                    id="officerName"
                    value={formData.officerName}
                    onChange={(e) => updateFormData("officerName", e.target.value)}
                    placeholder="e.g., Ms. Ana Reyes"
                  />
                </div>
                <div>
                  <Label htmlFor="officerEmail">Officer Email *</Label>
                  <Input
                    id="officerEmail"
                    type="email"
                    value={formData.officerEmail}
                    onChange={(e) => updateFormData("officerEmail", e.target.value)}
                    placeholder="officer@smcl.edu.ph"
                  />
                </div>
                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => updateFormData("displayOrder", Number.parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => updateFormData("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Active Department</Label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingNew ? "Add Department" : "Save Changes"}
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={resetForm} disabled={isSaving}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Departments Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((department) => (
                    <TableRow key={department.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{department.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {department.code}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{department.fullName}</p>
                          <p className="text-xs text-gray-500">{department.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{department.officerName}</p>
                          <p className="text-sm text-gray-600">{department.officerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="text-lg font-bold">{department.totalStudents}</div>
                          <div className="text-xs text-gray-600">{department.pendingCount} pending</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {department.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{department.displayOrder}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(department)}
                            disabled={isAddingNew || editingDepartment}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(department)}
                            disabled={department.totalStudents > 0 || isAddingNew || editingDepartment}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          {/* Warning for departments with students */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Departments with active students cannot be deleted. Please transfer or complete all
              student clearances before deletion.
            </AlertDescription>
          </Alert>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
