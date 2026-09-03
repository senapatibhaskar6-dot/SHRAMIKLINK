import { db } from './index.ts';
import {
  industries,
  contractors,
  workers,
  assignments,
  requirements,
  attendance,
  complianceDocs,
  bills,
  verificationLogs,
  auditLogs,
  revenueLogs
} from './schema.ts';

import {
  initialIndustries,
  initialContractors,
  initialWorkers,
  initialAssignments,
  initialRequirements,
  initialAttendance,
  initialComplianceDocs,
  initialBills,
  initialVerificationLogs,
  initialAuditLogs,
  initialRevenueLogs
} from '../mockData.ts';

export async function seedDatabase() {
  try {
    // Check if seeded
    const indCount = await db.select().from(industries).limit(1);
    if (indCount.length > 0) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding database with initial CLRA data...');

    // Seed Industries
    for (const ind of initialIndustries) {
      await db.insert(industries).values(ind);
    }

    // Seed Contractors
    for (const con of initialContractors) {
      await db.insert(contractors).values(con);
    }

    // Seed Workers
    for (const wrk of initialWorkers) {
      await db.insert(workers).values({
        id: wrk.id,
        name: wrk.name,
        aadhaarHash: wrk.aadhaarHash,
        phone: wrk.phone,
        contractorId: wrk.contractorId,
        skillType: wrk.skillType,
        dailyWageRate: wrk.dailyWageRate,
        status: wrk.status,
        onboardingVerified: wrk.onboardingVerified,
        onboardingDate: wrk.onboardingDate
      });
    }

    // Seed Assignments
    for (const asg of initialAssignments) {
      await db.insert(assignments).values(asg);
    }

    // Seed Requirements
    for (const req of initialRequirements) {
      await db.insert(requirements).values(req);
    }

    // Seed Attendance
    for (const att of initialAttendance) {
      await db.insert(attendance).values(att);
    }

    // Seed ComplianceDocs
    for (const doc of initialComplianceDocs) {
      await db.insert(complianceDocs).values(doc);
    }

    // Seed Bills
    for (const bill of initialBills) {
      await db.insert(bills).values({
        id: bill.id,
        contractorId: bill.contractorId,
        industryId: bill.industryId,
        month: bill.month,
        baseAmount: bill.baseAmount,
        serviceCharge: bill.serviceCharge,
        gstAmount: bill.gstAmount,
        totalAmount: bill.totalAmount,
        status: bill.status,
        submittedAt: bill.submittedAt,
        reviewedAt: bill.reviewedAt,
        remarks: bill.remarks,
        complianceDocIds: JSON.stringify(bill.complianceDocIds)
      });
    }

    // Seed VerificationLogs
    for (const log of initialVerificationLogs) {
      await db.insert(verificationLogs).values(log);
    }

    // Seed AuditLogs
    for (const log of initialAuditLogs) {
      await db.insert(auditLogs).values({
        id: log.id,
        inspectorName: log.inspectorName,
        inspectedEntity: log.inspectedEntity,
        entityId: log.entityId,
        entityName: log.entityName,
        timestamp: log.timestamp,
        findings: log.findings,
        status: log.status
      });
    }

    // Seed RevenueLogs
    for (const log of initialRevenueLogs) {
      await db.insert(revenueLogs).values(log);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
export default seedDatabase;
