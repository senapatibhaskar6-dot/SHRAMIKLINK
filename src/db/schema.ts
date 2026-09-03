import { pgTable, serial, text, timestamp, boolean, integer, real } from 'drizzle-orm/pg-core';

// Define the 'users' table mapped to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  role: text('role').notNull(), // 'industry_admin' | 'contractor' | 'worker' | 'government_inspector'
  createdAt: timestamp('created_at').defaultNow(),
});

// Define ShramikLink compliance tables
export const industries = pgTable('industries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  location: text('location').notNull(),
  regNo: text('reg_no').notNull(),
  lin: text('lin').notNull(),
  contactEmail: text('contact_email').notNull(),
});

export const contractors = pgTable('contractors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  licenseNo: text('license_no').notNull(),
  lin: text('lin').notNull(),
  pan: text('pan').notNull(),
  epfCode: text('epf_code').notNull(),
  esiCode: text('esi_code').notNull(),
  contactNo: text('contact_no').notNull(),
  rating: real('rating').notNull().default(5),
});

export const workers = pgTable('workers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  aadhaarHash: text('aadhaar_hash').notNull(),
  phone: text('phone').notNull(),
  contractorId: text('contractor_id').notNull(),
  skillType: text('skill_type').notNull(),
  dailyWageRate: integer('daily_wage_rate').notNull(),
  status: text('status').notNull(),
  onboardingVerified: boolean('onboarding_verified').notNull().default(false),
  onboardingDate: text('onboarding_date').notNull(),
});

export const assignments = pgTable('assignments', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  contractorId: text('contractor_id').notNull(),
  industryId: text('industry_id').notNull(),
  assignedAt: text('assigned_at').notNull(),
  status: text('status').notNull(),
  shiftTiming: text('shift_timing').notNull(),
});

export const requirements = pgTable('requirements', {
  id: text('id').primaryKey(),
  industryId: text('industry_id').notNull(),
  industryName: text('industry_name').notNull(),
  contractorId: text('contractor_id').notNull(),
  date: text('date').notNull(),
  skillType: text('skill_type').notNull(),
  workersNeeded: integer('workers_needed').notNull(),
  workersFulfilled: integer('workers_fulfilled').notNull().default(0),
  shiftTiming: text('shift_timing').notNull(),
  status: text('status').notNull(),
});

export const attendance = pgTable('attendance', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  contractorId: text('contractor_id').notNull(),
  industryId: text('industry_id').notNull(),
  checkIn: text('check_in').notNull(),
  checkOut: text('check_out'),
  aadhaarVerified: boolean('aadhaar_verified').notNull().default(false),
  verificationMethod: text('verification_method').notNull(),
  hoursWorked: real('hours_worked').notNull().default(0),
  overtimeHours: real('overtime_hours').notNull().default(0),
  status: text('status').notNull(),
});

export const complianceDocs = pgTable('compliance_docs', {
  id: text('id').primaryKey(),
  contractorId: text('contractor_id').notNull(),
  month: text('month').notNull(),
  docType: text('doc_type').notNull(),
  fileUrl: text('file_url').notNull(),
  uploadedAt: text('uploaded_at').notNull(),
  status: text('status').notNull(),
  verifiedBy: text('verified_by'),
  remarks: text('remarks'),
});

export const bills = pgTable('bills', {
  id: text('id').primaryKey(),
  contractorId: text('contractor_id').notNull(),
  industryId: text('industry_id').notNull(),
  month: text('month').notNull(),
  baseAmount: real('base_amount').notNull(),
  serviceCharge: real('service_charge').notNull(),
  gstAmount: real('gst_amount').notNull(),
  totalAmount: real('total_amount').notNull(),
  status: text('status').notNull(),
  submittedAt: text('submitted_at'),
  reviewedAt: text('reviewed_at'),
  remarks: text('remarks'),
  complianceDocIds: text('compliance_doc_ids'), // serialized as JSON array
});

export const verificationLogs = pgTable('verification_logs', {
  id: text('id').primaryKey(),
  workerId: text('worker_id').notNull(),
  workerName: text('worker_name').notNull(),
  timestamp: text('timestamp').notNull(),
  activity: text('activity').notNull(),
  status: text('status').notNull(),
  remarks: text('remarks').notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey(),
  inspectorName: text('inspector_name').notNull(),
  inspectedEntity: text('inspected_entity').notNull(),
  entityId: text('entity_id').notNull(),
  entityName: text('entity_name').notNull(),
  timestamp: text('timestamp').notNull(),
  findings: text('findings').notNull(),
  status: text('status').notNull(),
});

export const revenueLogs = pgTable('revenue_logs', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  workerCount: integer('worker_count').notNull(),
  feeAmount: integer('fee_amount').notNull(),
  status: text('status').notNull(),
});
