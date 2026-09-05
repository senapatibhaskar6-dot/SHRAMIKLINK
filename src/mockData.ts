import { 
  Industry, 
  Contractor, 
  Worker, 
  MultiIndustryAssignment, 
  DailyRequirement, 
  Attendance, 
  ComplianceDocument, 
  Bill, 
  AadhaarVerificationLog, 
  GovernmentAuditLog, 
  RevenueLog 
} from './types';

export const initialIndustries: Industry[] = [
  {
    id: 'ind-1',
    name: 'Tata Motors Pune Plant',
    location: 'Pimpri-Chinchwad, Maharashtra',
    regNo: 'MH/PUN/892/F-LIC',
    lin: '1982738920',
    contactEmail: 'admin.pune@tatamotors.com'
  },
  {
    id: 'ind-2',
    name: 'JSW Steel Bellary',
    location: 'Bellary, Karnataka',
    regNo: 'KA/BEL/734/F-LIC',
    lin: '1029384758',
    contactEmail: 'compliance@jswsteel.in'
  },
  {
    id: 'ind-3',
    name: 'Serum Institute of India',
    location: 'Hadapsar, Pune',
    regNo: 'MH/PUN/219/F-LIC',
    lin: '1847293849',
    contactEmail: 'hr@seruminstitute.com'
  }
];

export const initialContractors: Contractor[] = [
  {
    id: 'con-1',
    name: 'Apex Industrial Manpower Solutions',
    licenseNo: 'MH-PUN-CLRA-2024-902',
    lin: 'L-1293840291',
    pan: 'AAACA1029K',
    epfCode: 'MH/PUN/4567A/002',
    esiCode: '31-8973-102-1001',
    contactNo: '+91 98223 11045',
    rating: 4.8
  },
  {
    id: 'con-2',
    name: 'Jai Hind Security & Labour Supply',
    licenseNo: 'MH-MUM-CLRA-2023-771',
    lin: 'L-1029384812',
    pan: 'AAACJ7732L',
    epfCode: 'MH/MUM/8821B/005',
    esiCode: '12-4432-801-2002',
    contactNo: '+91 99304 55321',
    rating: 4.5
  },
  {
    id: 'con-3',
    name: 'Sahyadri Allied Services',
    licenseNo: 'MH-PUN-CLRA-2025-502',
    lin: 'L-1847293021',
    pan: 'AAACS4412M',
    epfCode: 'MH/PUN/9012C/001',
    esiCode: '31-4029-202-3003',
    contactNo: '+91 91580 88219',
    rating: 4.2
  }
];

export const initialWorkers: Worker[] = [
  { id: 'wrk-1', name: 'Rakesh Kumar Yadav', aadhaarHash: 'XXXX-XXXX-8920', phone: '9876543210', contractorId: 'con-1', skillType: 'Skilled', dailyWageRate: 650, status: 'Deployed', onboardingVerified: true, onboardingDate: '2026-01-10' },
  { id: 'wrk-2', name: 'Vikram Singh Shekhawat', aadhaarHash: 'XXXX-XXXX-4531', phone: '9823456789', contractorId: 'con-1', skillType: 'Skilled', dailyWageRate: 650, status: 'Deployed', onboardingVerified: true, onboardingDate: '2026-01-12' },
  { id: 'wrk-3', name: 'Anil S. Patil', aadhaarHash: 'XXXX-XXXX-1029', phone: '9422019283', contractorId: 'con-1', skillType: 'Unskilled', dailyWageRate: 480, status: 'Deployed', onboardingVerified: true, onboardingDate: '2026-02-15' },
  { id: 'wrk-4', name: 'Sunita Devi', aadhaarHash: 'XXXX-XXXX-9382', phone: '9112233445', contractorId: 'con-1', skillType: 'Semi-Skilled', dailyWageRate: 550, status: 'Available', onboardingVerified: true, onboardingDate: '2026-03-01' },
  { id: 'wrk-5', name: 'Ramesh Sawant', aadhaarHash: 'XXXX-XXXX-7721', phone: '9552103948', contractorId: 'con-1', skillType: 'Highly-Skilled', dailyWageRate: 850, status: 'Available', onboardingVerified: true, onboardingDate: '2026-03-20' },
  
  { id: 'wrk-6', name: 'Pappu Yadav', aadhaarHash: 'XXXX-XXXX-3829', phone: '9890210293', contractorId: 'con-2', skillType: 'Unskilled', dailyWageRate: 480, status: 'Deployed', onboardingVerified: true, onboardingDate: '2026-02-10' },
  { id: 'wrk-7', name: 'Sandeep Gite', aadhaarHash: 'XXXX-XXXX-4491', phone: '9158302192', contractorId: 'con-2', skillType: 'Semi-Skilled', dailyWageRate: 550, status: 'Deployed', onboardingVerified: true, onboardingDate: '2026-04-05' },
  { id: 'wrk-8', name: 'Laxmi Shinde', aadhaarHash: 'XXXX-XXXX-9012', phone: '9822453102', contractorId: 'con-2', skillType: 'Unskilled', dailyWageRate: 480, status: 'Available', onboardingVerified: true, onboardingDate: '2026-04-12' },
  
  { id: 'wrk-9', name: 'Arjun Pujari', aadhaarHash: 'XXXX-XXXX-8822', phone: '9049281293', contractorId: 'con-3', skillType: 'Skilled', dailyWageRate: 650, status: 'Deployed', onboardingVerified: true, onboardingDate: '2026-05-01' },
  { id: 'wrk-10', name: 'Shiva Ramanna', aadhaarHash: 'XXXX-XXXX-1144', phone: '9130491029', contractorId: 'con-3', skillType: 'Highly-Skilled', dailyWageRate: 850, status: 'Available', onboardingVerified: false, onboardingDate: '2026-09-01' }
];

export const initialAssignments: MultiIndustryAssignment[] = [
  { id: 'asg-1', workerId: 'wrk-1', contractorId: 'con-1', industryId: 'ind-1', assignedAt: '2026-08-01', status: 'Active', shiftTiming: 'Shift A (06:00 - 14:00)' },
  { id: 'asg-2', workerId: 'wrk-2', contractorId: 'con-1', industryId: 'ind-1', assignedAt: '2026-08-01', status: 'Active', shiftTiming: 'Shift A (06:00 - 14:00)' },
  { id: 'asg-3', workerId: 'wrk-3', contractorId: 'con-1', industryId: 'ind-2', assignedAt: '2026-08-10', status: 'Active', shiftTiming: 'Shift B (14:00 - 22:00)' },
  
  { id: 'asg-4', workerId: 'wrk-6', contractorId: 'con-2', industryId: 'ind-2', assignedAt: '2026-08-05', status: 'Active', shiftTiming: 'General (09:00 - 17:00)' },
  { id: 'asg-5', workerId: 'wrk-7', contractorId: 'con-2', industryId: 'ind-3', assignedAt: '2026-08-12', status: 'Active', shiftTiming: 'Shift C (22:00 - 06:00)' },
  
  { id: 'asg-6', workerId: 'wrk-9', contractorId: 'con-3', industryId: 'ind-1', assignedAt: '2026-08-15', status: 'Active', shiftTiming: 'Shift B (14:00 - 22:00)' }
];

export const initialRequirements: DailyRequirement[] = [
  { id: 'req-1', industryId: 'ind-1', industryName: 'Tata Motors Pune Plant', contractorId: 'con-1', date: '2026-09-03', skillType: 'Skilled', workersNeeded: 5, workersFulfilled: 2, shiftTiming: 'Shift A (06:00 - 14:00)', status: 'Open' },
  { id: 'req-2', industryId: 'ind-1', industryName: 'Tata Motors Pune Plant', contractorId: 'con-1', date: '2026-09-03', skillType: 'Unskilled', workersNeeded: 10, workersFulfilled: 0, shiftTiming: 'Shift B (14:00 - 22:00)', status: 'Open' },
  { id: 'req-3', industryId: 'ind-2', industryName: 'JSW Steel Bellary', contractorId: 'con-2', date: '2026-09-03', skillType: 'Semi-Skilled', workersNeeded: 3, workersFulfilled: 1, shiftTiming: 'General (09:00 - 17:00)', status: 'Open' },
  { id: 'req-4', industryId: 'ind-3', industryName: 'Serum Institute of India', contractorId: 'con-3', date: '2026-09-03', skillType: 'Skilled', workersNeeded: 4, workersFulfilled: 0, shiftTiming: 'Shift B (14:00 - 22:00)', status: 'Open' }
];

export const initialAttendance: Attendance[] = [
  // August 31st Records (Standard and Overtime)
  { id: 'att-1', date: '2026-08-31', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-1', checkIn: '06:02', checkOut: '14:05', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-2', date: '2026-08-31', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', contractorId: 'con-1', industryId: 'ind-1', checkIn: '05:58', checkOut: '18:15', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 12, overtimeHours: 4, status: 'Present' }, // 4h Overtime
  { id: 'att-3', date: '2026-08-31', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-2', checkIn: '13:55', checkOut: '22:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-4', date: '2026-08-31', workerId: 'wrk-6', workerName: 'Pappu Yadav', contractorId: 'con-2', industryId: 'ind-2', checkIn: '08:50', checkOut: '21:05', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 12, overtimeHours: 4.25, status: 'Present' }, // Overtime
  { id: 'att-5', date: '2026-08-31', workerId: 'wrk-7', workerName: 'Sandeep Gite', contractorId: 'con-2', industryId: 'ind-3', checkIn: '21:45', checkOut: '05:45', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-6', date: '2026-08-31', workerId: 'wrk-9', workerName: 'Arjun Pujari', contractorId: 'con-3', industryId: 'ind-1', checkIn: '14:02', checkOut: '22:05', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },

  // August Previous Shifts showing workers rotating between different industries
  { id: 'att-14', date: '2026-08-28', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-2', checkIn: '06:00', checkOut: '14:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-15', date: '2026-08-29', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-2', checkIn: '06:10', checkOut: '14:15', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-16', date: '2026-08-25', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-1', checkIn: '14:00', checkOut: '22:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-17', date: '2026-08-26', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-1', checkIn: '14:05', checkOut: '22:10', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-18', date: '2026-08-30', workerId: 'wrk-4', workerName: 'Sunita Devi', contractorId: 'con-1', industryId: 'ind-1', checkIn: '09:00', checkOut: '17:00', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-19', date: '2026-08-29', workerId: 'wrk-9', workerName: 'Arjun Pujari', contractorId: 'con-3', industryId: 'ind-2', checkIn: '06:00', checkOut: '14:00', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  
  // September 1st Records
  { id: 'att-7', date: '2026-09-01', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-1', checkIn: '05:59', checkOut: '14:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-8', date: '2026-09-01', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', contractorId: 'con-1', industryId: 'ind-1', checkIn: '06:05', checkOut: '14:02', aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-9', date: '2026-09-01', workerId: 'wrk-3', workerName: 'Anil S. Patil', contractorId: 'con-1', industryId: 'ind-2', checkIn: '13:58', checkOut: '22:05', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-10', date: '2026-09-01', workerId: 'wrk-6', workerName: 'Pappu Yadav', contractorId: 'con-2', industryId: 'ind-2', checkIn: '08:55', checkOut: '17:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },
  { id: 'att-11', date: '2026-09-01', workerId: 'wrk-7', workerName: 'Sandeep Gite', contractorId: 'con-2', industryId: 'ind-3', checkIn: '21:55', checkOut: '06:00', aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 8, overtimeHours: 0, status: 'Present' },

  // September 2nd (Live check-ins for interactive simulator)
  { id: 'att-12', date: '2026-09-02', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', contractorId: 'con-1', industryId: 'ind-1', checkIn: '06:01', checkOut: null, aadhaarVerified: true, verificationMethod: 'Biometric-Face', hoursWorked: 0, overtimeHours: 0, status: 'Present' },
  { id: 'att-13', date: '2026-09-02', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', contractorId: 'con-1', industryId: 'ind-1', checkIn: '05:57', checkOut: null, aadhaarVerified: true, verificationMethod: 'Aadhaar-OTP', hoursWorked: 0, overtimeHours: 0, status: 'Present' }
];

export const initialComplianceDocs: ComplianceDocument[] = [
  // Verified Previous Month (July 2026) Challans - allowing Apex (con-1) to generate August bills
  { id: 'doc-1', contractorId: 'con-1', month: 'July 2026', docType: 'EPF-Challan', fileUrl: 'EPF-CH-JULY-90212.pdf', uploadedAt: '2026-08-15', status: 'Verified', verifiedBy: 'System Audit', remarks: 'EPF payment of ₹1,45,200 verified with EPFO portal API.' },
  { id: 'doc-2', contractorId: 'con-1', month: 'July 2026', docType: 'ESI-Challan', fileUrl: 'ESI-CH-JULY-88310.pdf', uploadedAt: '2026-08-15', status: 'Verified', verifiedBy: 'System Audit', remarks: 'ESI payment of ₹38,400 matching with ESIC records.' },
  { id: 'doc-3', contractorId: 'con-1', month: 'July 2026', docType: 'GST-Return', fileUrl: 'GST-3B-JULY-99231.pdf', uploadedAt: '2026-08-18', status: 'Verified', verifiedBy: 'System Audit', remarks: 'GSTR-3B filed. Tax of ₹1,88,290 verified.' },
  
  // Jai Hind (con-2) Challans - Verified as well
  { id: 'doc-4', contractorId: 'con-2', month: 'July 2026', docType: 'EPF-Challan', fileUrl: 'EPF-CH-JUL-2201.pdf', uploadedAt: '2026-08-14', status: 'Verified', verifiedBy: 'System Audit', remarks: 'EPF verified.' },
  { id: 'doc-5', contractorId: 'con-2', month: 'July 2026', docType: 'ESI-Challan', fileUrl: 'ESI-CH-JUL-4322.pdf', uploadedAt: '2026-08-14', status: 'Verified', verifiedBy: 'System Audit', remarks: 'ESI verified.' },
  { id: 'doc-6', contractorId: 'con-2', month: 'July 2026', docType: 'GST-Return', fileUrl: 'GST-JUL-7712.pdf', uploadedAt: '2026-08-14', status: 'Verified', verifiedBy: 'System Audit', remarks: 'GST verified.' },

  // Sahyadri (con-3) has NOT uploaded previous month's GST-Return, only EPF/ESI. This will trigger the compliance billing lock for them!
  { id: 'doc-7', contractorId: 'con-3', month: 'July 2026', docType: 'EPF-Challan', fileUrl: 'EPF-CH-JUL-9912.pdf', uploadedAt: '2026-08-19', status: 'Verified', verifiedBy: 'System Audit', remarks: 'EPF Verified.' },
  { id: 'doc-8', contractorId: 'con-3', month: 'July 2026', docType: 'ESI-Challan', fileUrl: 'ESI-CH-JUL-0012.pdf', uploadedAt: '2026-08-19', status: 'Verified', verifiedBy: 'System Audit', remarks: 'ESI Verified.' },
  // Missing GST Challan will lock con-3's August billing!
];

export const initialBills: Bill[] = [
  // Apex August Bill for Tata Motors (Compliant, pre-existing proof and approved)
  {
    id: 'bill-1',
    contractorId: 'con-1',
    industryId: 'ind-1',
    month: 'August 2026',
    baseAmount: 185000,
    serviceCharge: 18500, // 10%
    gstAmount: 36630, // 18% on total (base + service)
    totalAmount: 240130,
    status: 'Approved',
    submittedAt: '2026-08-25 10:30',
    reviewedAt: '2026-08-27 15:45',
    remarks: 'Approved after verification of all EPF and ESI payment challans for July.',
    complianceDocIds: ['doc-1', 'doc-2', 'doc-3']
  },
  // Jai Hind August Bill for JSW Steel (Submitted, pending review)
  {
    id: 'bill-2',
    contractorId: 'con-2',
    industryId: 'ind-2',
    month: 'August 2026',
    baseAmount: 120000,
    serviceCharge: 12000,
    gstAmount: 23760,
    totalAmount: 155760,
    status: 'Submitted',
    submittedAt: '2026-09-01 11:20',
    reviewedAt: null,
    remarks: 'Awaiting Industry Admin verification of ESI challan.',
    complianceDocIds: ['doc-4', 'doc-5', 'doc-6']
  }
];

export const initialVerificationLogs: AadhaarVerificationLog[] = [
  { id: 'log-1', workerId: 'wrk-1', workerName: 'Rakesh Kumar Yadav', timestamp: '2026-09-02 06:01', activity: 'Shift-Check-In', status: 'Success', remarks: 'Facial Biometric matched 98.4% against Aadhaar UIDAI secure cache.' },
  { id: 'log-2', workerId: 'wrk-2', workerName: 'Vikram Singh Shekhawat', timestamp: '2026-09-02 05:57', activity: 'Shift-Check-In', status: 'Success', remarks: 'Aadhaar OTP verified. UIDAI reference code txn_810293.' },
  { id: 'log-3', workerId: 'wrk-10', workerName: 'Shiva Ramanna', timestamp: '2026-09-01 14:15', activity: 'Onboarding', status: 'Failed', remarks: 'Aadhaar verification failed: OTP timeout.' }
];

export const initialAuditLogs: GovernmentAuditLog[] = [
  { id: 'aud-1', inspectorName: 'Shri K. D. Rane (Central Labour Commissioner, Pune)', inspectedEntity: 'Industry', entityId: 'ind-1', entityName: 'Tata Motors Pune Plant', timestamp: '2026-08-28 11:30', findings: 'Inspected CLRA Form V and Form VI registers. Payout records are fully compliant. Minimum wage standards strictly matched with digital attendance logs.', status: 'Clean' },
  { id: 'aud-2', inspectorName: 'Shri K. D. Rane (Central Labour Commissioner, Pune)', inspectedEntity: 'Contractor', entityId: 'con-1', entityName: 'Apex Industrial Manpower Solutions', timestamp: '2026-08-28 14:10', findings: 'EPF payment returns verified against payroll registers. Highly organized digital logs with Aadhaar authentication traces.', status: 'Clean' }
];

export const initialRevenueLogs: RevenueLog[] = [
  { id: 'rev-1', date: '2026-08-31', workerCount: 6, feeAmount: 6, status: 'Accrued' },
  { id: 'rev-2', date: '2026-09-01', workerCount: 5, feeAmount: 5, status: 'Accrued' },
  { id: 'rev-3', date: '2026-09-02', workerCount: 2, feeAmount: 2, status: 'Accrued' }
];
