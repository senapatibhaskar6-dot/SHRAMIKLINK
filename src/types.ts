export type UserRole = 'industry_admin' | 'supervisor' | 'contractor' | 'worker' | 'government_inspector';

export type IndustryCategory = 'Industry HR' | 'Apartment Owner' | 'Shop Owner' | 'Office';
export type ContractorCategory = 'Labour Contractor' | 'Security Agency';

export interface Industry {
  id: string;
  name: string;
  location: string;
  regNo: string; // Factory / Establishment License No
  lin: string; // Labour Identification Number
  contactEmail: string;
  category?: IndustryCategory;
}

export interface Contractor {
  id: string;
  name: string;
  licenseNo: string; // CLRA / PSARA License Number
  lin: string; // Labour Identification Number
  pan: string;
  gstin?: string;
  epfCode: string;
  esiCode: string;
  contactNo: string;
  email?: string;
  address?: string;
  rating: number;
  contractorType?: ContractorCategory;
}

export interface Worker {
  id: string;
  name: string;
  aadhaarHash: string; // Masked Aadhaar
  phone: string;
  contractorId: string; // Current assigned Contractor or 'direct' for independent
  skillType: 'Unskilled';
  workerType?: 'Unskilled-Laborer';
  sectionOrTrade?: string;
  dailyWageRate: number; // in INR
  status: 'Available' | 'Deployed' | 'On-Leave';
  onboardingVerified: boolean;
  onboardingDate: string;
  assignedSupervisorId?: string;
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
  contractorId: string; // Target Contractor (or open to all: 'OPEN_POOL' or 'ALL')
  date: string;
  skillType: 'Unskilled';
  workersNeeded: number;
  minWorkersNeeded?: number; // Minimum workers required per contractor application
  workersFulfilled: number;
  shiftTiming: string;
  dailyWageOffer?: number;
  description?: string;
  status: 'Open' | 'Fulfilled' | 'Closed';
}

export interface ContractorApplication {
  id: string;
  requirementId: string;
  industryId: string;
  industryName: string;
  contractorId: string;
  contractorName: string;
  contractorPhone: string;
  contractorLicenseNo: string;
  committedWorkers: number;
  availablePoolCount: number;
  proposedWageRate?: number;
  appliedDate: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  notes?: string;
}

export interface DirectJobOpening {
  id: string;
  industryId: string;
  industryName: string;
  location: string;
  roleTitle: string;
  skillType: 'Unskilled';
  openingsCount: number;
  dailyWageRate: number;
  shiftTiming: string;
  contactPerson: string;
  contactPhone: string;
  postedDate: string;
  status: 'Open' | 'Closed';
  description: string;
}

export interface DirectWorkerApplication {
  id: string;
  jobOpeningId: string;
  industryId: string;
  industryName: string;
  workerName: string;
  phone: string;
  skillType: string;
  experienceYears: number;
  preferredShift: string;
  appliedDate: string;
  status: 'Applied' | 'Shortlisted' | 'Accepted' | 'Rejected';
  notes?: string;
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

export type ComplianceDocType = 
  | 'EPF-Challan' 
  | 'ESI-Challan' 
  | 'GST-Return' 
  | 'Wage-Register'
  | 'Form-IV-License'
  | 'Form-VI-A-Notice'
  | 'Bank-Disbursement-Proof'
  | 'Muster-Roll-XVI';

export interface ComplianceDocument {
  id: string;
  contractorId: string;
  industryId?: string; // Optional: tagged to specific principal employer factory
  month: string; // e.g. "August 2026"
  docType: ComplianceDocType;
  fileUrl: string;
  fileName?: string;
  referenceNo?: string;
  uploadedAt: string;
  status: 'Verified' | 'Pending' | 'Rejected';
  verifiedBy: string | null; // Industry ID or Government Inspector
  remarks: string | null;
  validTill?: string;
}

export interface IndustryProjectCompliance {
  id: string;
  contractorId: string;
  industryId: string;
  projectName?: string;
  workOrderNo?: string;
  contractPeriod?: string;
  status: 'Compliant' | 'Pending-Docs' | 'Under-Review';
  hrVerified: boolean;
  hrVerifiedAt?: string;
  hrVerifiedBy?: string;
  inspectorAudited: boolean;
  inspectorAuditedAt?: string;
  inspectorAuditedBy?: string;
  inspectorRemarks?: string;
  notes?: string;
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
  supervisorType?: 'industry' | 'contractor'; // 'industry' = Factory Gate HR, 'contractor' = Labour Agency Supervisor
  contractorId?: string; // If supervisorType === 'contractor'
  contractorName?: string;
  industryId: string;
  department: string;
  active: boolean;
  assignedContractorIds?: string[];
  createdAt: string;
}

export interface ContractorAttendanceRecord {
  id: string;
  contractorId: string;
  supervisorId: string;
  supervisorName: string;
  workerId: string;
  workerName: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent' | 'Half-Day';
  hoursWorked: number;
  overtimeHours: number;
  shift?: string;
  remarks?: string;
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

export interface GovernmentLaborInspector {
  id: string;
  name: string;
  badgeId: string; // e.g. "GOV-AS-LI-8821"
  designation: string; // e.g. "Assistant Labour Commissioner" or "Senior Labour Inspector"
  department: string; // e.g. "Office of the Labour Commissioner, Govt of Assam"
  email: string;
  phone: string;
  state: string; // e.g. "Assam", "Maharashtra", "Karnataka"
  district: string; // e.g. "Kamrup Metropolitan", "Dibrugarh", "Tinsukia", "Pune"
  jurisdictionZone: string; // e.g. "Guwahati & EPIP Amingaon Industrial Belt"
  assignedPinCodes: string[]; // e.g. ["781001", "781021", "781031", "411018"]
  active: boolean;
  registeredAt: string;
  officeAddress?: string;
  officeHours?: string;
}

export interface InspectionNotice {
  id: string;
  inspectorId: string;
  inspectorName: string;
  targetType: 'Industry' | 'Contractor';
  targetId: string;
  targetName: string;
  subject: string;
  statutoryAct: 'CLRA Act 1970' | 'Factories Act 1948' | 'Plantations Labour Act 1951' | 'Minimum Wages Act 1948' | 'EPF & MP Act 1952';
  severity: 'Notice' | 'Advisory' | 'Urgent-Compliance-Summons';
  message: string;
  issuedAt: string;
  status: 'Pending' | 'Acknowledged' | 'Resolved';
}

