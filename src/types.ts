export type UserRole = 'industry_admin' | 'supervisor' | 'contractor' | 'worker' | 'government_inspector';

export interface Industry {
  id: string;
  name: string;
  location: string;
  regNo: string; // Factory License No
  lin: string; // Labour Identification Number
  contactEmail: string;
}

export interface Contractor {
  id: string;
  name: string;
  licenseNo: string; // CLRA License Number
  lin: string; // Labour Identification Number
  pan: string;
  epfCode: string;
  esiCode: string;
  contactNo: string;
  rating: number;
}

export interface Worker {
  id: string;
  name: string;
  aadhaarHash: string; // Masked Aadhaar
  phone: string;
  contractorId: string; // Current assigned Contractor
  skillType: 'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly-Skilled';
  dailyWageRate: number; // in INR
  status: 'Available' | 'Deployed' | 'On-Leave';
  onboardingVerified: boolean;
  onboardingDate: string;
}

export interface MultiIndustryAssignment {
  id: string;
  workerId: string;
  contractorId: string;
  industryId: string;
  assignedAt: string;
  status: 'Active' | 'Completed' | 'Recalled';
  shiftTiming: 'General (09:00 - 17:00)' | 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Shift C (22:00 - 06:00)';
}

export interface DailyRequirement {
  id: string;
  industryId: string;
  industryName: string; // Hidden from Worker, visible to Contractor
  contractorId: string; // Target Contractor (or open to all)
  date: string;
  skillType: 'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly-Skilled';
  workersNeeded: number;
  workersFulfilled: number;
  shiftTiming: string;
  status: 'Open' | 'Fulfilled' | 'Closed';
}

export interface Attendance {
  id: string;
  date: string;
  workerId: string;
  workerName: string;
  contractorId: string;
  industryId: string;
  checkIn: string; // ISO / Time string
  checkOut: string | null;
  aadhaarVerified: boolean;
  verificationMethod: 'Aadhaar-OTP' | 'Biometric-Face' | 'Supervisor-Gate' | 'Quick-Batch';
  hoursWorked: number;
  overtimeHours: number; // hours exceeding 8
  status: 'Present' | 'Absent' | 'Pending-Verification';
  markedBySupervisor?: string; // Supervisor name
}

export interface ComplianceDocument {
  id: string;
  contractorId: string;
  industryId?: string; // Optional: tagged to specific principal employer factory
  month: string; // e.g. "August 2026"
  docType: 'EPF-Challan' | 'ESI-Challan' | 'GST-Return' | 'Wage-Register';
  fileUrl: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy: string | null; // Industry ID or Government Inspector
  remarks: string | null;
}

export interface Bill {
  id: string;
  billNumber?: string; // Auto-generated or manually entered by contractor
  contractorId: string;
  contractorName?: string;
  industryId: string;
  industryName?: string;
  month: string; // e.g. "August 2026"
  totalWorkers?: number;
  totalDaysWorked?: number;
  dailyWageRate?: number;
  baseAmount: number; // Worker salaries (Total Labour Mandays × Daily Wage Rate)
  profitPercentage?: number; // Contractor profit percentage (e.g. 10%, 12%, 15%)
  serviceCharge: number; // Contractor margin = baseAmount * profitPercentage / 100
  subtotalAmount?: number; // baseAmount + serviceCharge (Subtotal before GST)
  gstPercentage?: number; // GST percentage (e.g. 18%, 12%, 5%)
  gstAmount: number; // Subtotal * gstPercentage / 100
  totalAmount: number; // Subtotal + gstAmount
  status: 'Locked' | 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  submittedAt: string | null;
  reviewedAt: string | null;
  remarks: string | null;
  complianceDocIds: string[]; // Linked verified challans
}

export interface AadhaarVerificationLog {
  id: string;
  workerId: string;
  workerName: string;
  timestamp: string;
  activity: 'Onboarding' | 'Shift-Check-In';
  status: 'Success' | 'Failed';
  remarks: string;
}

export interface GovernmentAuditLog {
  id: string;
  inspectorName: string;
  inspectedEntity: 'Industry' | 'Contractor';
  entityId: string;
  entityName: string;
  timestamp: string;
  findings: string;
  status: 'Clean' | 'Minor-Observations' | 'Non-Compliant-Alert';
}

export interface RevenueLog {
  id: string;
  date: string;
  workerCount: number;
  feeAmount: number; // ₹1 per worker
  status: 'Accrued' | 'Invoiced' | 'Paid';
}

export interface Supervisor {
  id: string;
  name: string;
  phone: string;
  email: string;
  industryId: string;
  department: string;
  active: boolean;
  assignedContractorIds?: string[];
  createdAt: string;
}

export interface AppFeedback {
  id: string;
  authorName: string;
  authorRole: 'industry_admin' | 'supervisor' | 'contractor' | 'worker' | 'government_inspector';
  rating: number; // 1 to 5
  category: 'Attendance System' | 'CLRA Forms' | 'Bill Audit' | 'Speed & Performance' | 'General Feedback';
  feedbackText: string;
  createdAt: string;
}
