"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PDFGeneratorProps {
  formData: any
  signatures: any[]
}

export function PDFGenerator({ formData, signatures }: PDFGeneratorProps) {
  const generatePDF = () => {
    // Create a new window with the form content
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Student Clearance Form</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .form-section { margin-bottom: 20px; }
            .signature-section { border: 1px solid #ccc; padding: 10px; margin: 10px 0; }
            .approved { background-color: #d4edda; }
            .pending { background-color: #fff3cd; }
            .rejected { background-color: #f8d7da; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>SAINT MICHAEL'S COLLEGE OF LAGUNA</h2>
            <p>OLD NATIONAL ROAD, PLATERO, CITY OF BIÑAN, LAGUNA</p>
            <h3>STUDENT'S CLEARANCE</h3>
          </div>
          
          <div class="form-section">
            <p><strong>Name of Student:</strong> ${formData.studentName}</p>
            <p><strong>Program/Major/Grade:</strong> ${formData.program}</p>
            <p><strong>Section:</strong> ${formData.section}</p>
            <p><strong>Date:</strong> ${formData.date}</p>
            <p><strong>Year Level:</strong> ${formData.yearLevel}</p>
          </div>
          
          <div class="form-section">
            <p>I hereby certify that the above named student has satisfactorily complied with all the requirements and is free from all money property accountabilities in my subjects/units/department.</p>
          </div>
          
          <div class="form-section">
            <h4>Department Clearances:</h4>
            ${signatures
              .map(
                (sig, index) => `
              <div class="signature-section ${sig.status}">
                <p><strong>${index + 1}. ${sig.department}</strong></p>
                <p>Status: ${sig.status.toUpperCase()}</p>
                ${sig.signedDate ? `<p>Signed: ${new Date(sig.signedDate).toLocaleDateString()}</p>` : ""}
                ${sig.remarks ? `<p>Remarks: ${sig.remarks}</p>` : ""}
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="form-section">
            <p><strong>Important:</strong></p>
            <p>For Basic Education Division: Please surrender at the Principal's/Vice Principal's/Administrator's Office.</p>
            <p>For Tertiary Education Division: Please surrender at the Registrar's Center.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px;">
            F-CRO-18<br>
            Rev (10/08/14/23)
          </div>
          
          <button class="no-print" onclick="window.print()" style="margin-top: 20px; padding: 10px 20px;">Print Form</button>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()
  }

  return (
    <Button onClick={generatePDF} variant="outline" className="flex items-center gap-2 bg-transparent">
      <Download className="h-4 w-4" />
      Generate PDF
    </Button>
  )
}
