import { Button } from "@/components/ui/button"
import { Download, FileText, Users } from "lucide-react"

export function Header() {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold">Digital Clearance System</h1>
              <p className="text-blue-200 text-sm">Saint Michael's College of Laguna</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-blue-800">
              <Users className="h-4 w-4 mr-2" />
              Admin Portal
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-900 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Form
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
