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
    // 1. Seed Industries if empty
    const indCount = await db.select().from(industries).limit(1);
    if (indCount.length === 0) {
      console.log('Seeding industries...');
      for (const ind of initialIndustries) {
        await db.insert(industries).values(ind).onConflictDoNothing();
      }
    }

    // 2. Seed Contractors if empty
    const conCount = await db.select().from(contractors).limit(1);
    if (conCount.length === 0) {
      console.log('Seeding contractors...');
      for (const con of initialContractors) {
        await db.insert(contractors).values(con).onConflictDoNothing();
      }
    }

    // 3. Seed Workers if empty
    const wrkCount = await db.select().from(workers).limit(1);
    if (wrkCount.length === 0) {
      console.log('Seeding workers...');
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
        }).onConflictDoNothing();
      }
    }

    // 4. Seed Assignments if empty
    const asgCount = await db.select().from(assignments).limit(1);
    if (asgCount.length === 0) {
      for (const asg of initialAssignments) {
        await db.insert(assignments).values(asg).onConflictDoNothing();
      }
    }

    // 5. Seed Requirements if empty
    const reqCount = await db.select().from(requirements).limit(1);
    if (reqCount.length === 0) {
      for (const req of initialRequirements) {
        await db.insert(requirements).values(req).onConflictDoNothing();
      }
    }

    // 6. Seed Attendance if empty
    const attCount = await db.select().from(attendance).limit(1);
    if (attCount.length === 0) {
      for (const att of initialAttendance) {
        await db.insert(attendance).values(att).onConflictDoNothing();
      }
    }

    // 7. Seed ComplianceDocs if empty
    const docCount = await db.select().from(complianceDocs).limit(1);
    if (docCount.length === 0) {
      for (const doc of initialComplianceDocs) {
        await db.insert(complianceDocs).values(doc).onConflictDoNothing();
      }
    }

    // 8. Seed Bills if empty
    const billCount = await db.select().from(bills).limit(1);
    if (billCount.length === 0) {
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
        }).onConflictDoNothing();
      }
    }

    // 9. Seed VerificationLogs if empty
    const verCount = await db.select().from(verificationLogs).limit(1);
    if (verCount.length === 0) {
      for (const log of initialVerificationLogs) {
        await db.insert(verificationLogs).values(log).onConflictDoNothing();
      }
    }

    // 10. Seed AuditLogs if empty
    const audCount = await db.select().from(auditLogs).limit(1);
    if (audCount.length === 0) {
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
        }).onConflictDoNothing();
      }
    }

    // 11. Seed RevenueLogs if empty
    const revCount = await db.select().from(revenueLogs).limit(1);
    if (revCount.length === 0) {
      for (const log of initialRevenueLogs) {
        await db.insert(revenueLogs).values(log).onConflictDoNothing();
      }
    }

    console.log('Database seeding verified successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
export default seedDatabase;
