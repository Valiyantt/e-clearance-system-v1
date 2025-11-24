/**
 * PHP Integration Data Mapper
 * Converts between Next.js clearance data and PHP system format
 */

export interface PHPStudentData {
  student_id: string
  first_name: string
  last_name: string
  full_name: string
  program: string
  section: string
  year_level: string
  email: string
  contact_number: string
  address: string
  enrollment_date: string
  expected_graduation: string
  payment_status: string
  clearance_id: string
  submitted_date: string
  last_updated: string
  unique_token: string
}

export interface PHPClearanceItem {
  clearance_id: string
  department: string
  officer: string
  description: string
  status: string
  payment_amount?: number
  signed_date?: string
  signed_by?: string
  signature_image_url?: string
  blueink_bundle_id?: string
  blueink_status?: string
}

export interface PHPSyncLog {
  id: string
  sync_type: "student" | "clearance" | "signature"
  direction: "to_php" | "from_php"
  status: "success" | "failed" | "pending"
  php_id: string
  next_id: string
  error_message?: string
  timestamp: string
  retry_count: number
}

// Map Next.js student data to PHP format
export function mapStudentToPhp(student: any): PHPStudentData {
  return {
    student_id: student.id,
    first_name: student.firstName,
    last_name: student.lastName,
    full_name: student.fullName,
    program: student.program,
    section: student.section,
    year_level: student.yearLevel,
    email: student.email,
    contact_number: student.contactNumber,
    address: student.address,
    enrollment_date: student.enrollmentDate,
    expected_graduation: student.expectedGraduation,
    payment_status: student.paymentStatus,
    clearance_id: student.clearanceId,
    submitted_date: student.submittedDate,
    last_updated: student.lastUpdated,
    unique_token: student.uniqueToken,
  }
}

// Map PHP student data to Next.js format
export function mapStudentFromPhp(phpStudent: PHPStudentData): any {
  return {
    id: phpStudent.student_id,
    firstName: phpStudent.first_name,
    lastName: phpStudent.last_name,
    fullName: phpStudent.full_name,
    program: phpStudent.program,
    section: phpStudent.section,
    yearLevel: phpStudent.year_level,
    email: phpStudent.email,
    contactNumber: phpStudent.contact_number,
    address: phpStudent.address,
    enrollmentDate: phpStudent.enrollment_date,
    expectedGraduation: phpStudent.expected_graduation,
    paymentStatus: phpStudent.payment_status,
    clearanceId: phpStudent.clearance_id,
    submittedDate: phpStudent.submitted_date,
    lastUpdated: phpStudent.last_updated,
    uniqueToken: phpStudent.unique_token,
  }
}

// Map clearance item to PHP format
export function mapClearanceToPhp(clearanceItem: any, studentId: string): PHPClearanceItem {
  return {
    clearance_id: clearanceItem.id,
    department: clearanceItem.department,
    officer: clearanceItem.officer,
    description: clearanceItem.description,
    status: clearanceItem.status,
    payment_amount: clearanceItem.paymentAmount,
    signed_date: clearanceItem.signedDate,
    signed_by: clearanceItem.signedBy,
    signature_image_url: clearanceItem.signatureImage,
    blueink_bundle_id: clearanceItem.blueinkBundleId,
    blueink_status: clearanceItem.blueinkStatus,
  }
}

// Map PHP clearance to Next.js format
export function mapClearanceFromPhp(phpClearance: PHPClearanceItem): any {
  return {
    id: phpClearance.clearance_id,
    department: phpClearance.department,
    officer: phpClearance.officer,
    description: phpClearance.description,
    status: phpClearance.status,
    paymentAmount: phpClearance.payment_amount,
    signedDate: phpClearance.signed_date,
    signedBy: phpClearance.signed_by,
    signatureImage: phpClearance.signature_image_url,
    blueinkBundleId: phpClearance.blueink_bundle_id,
    blueinkStatus: phpClearance.blueink_status,
  }
}
