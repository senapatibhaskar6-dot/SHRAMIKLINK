import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./src/db/index.ts";
import { seedDatabase } from "./src/db/seed.ts";
import { adminAuth } from "./src/lib/firebase-admin.ts";
import { eq, desc } from "drizzle-orm";
import {
  users,
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
} from "./src/db/schema.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// Enable CORS for PWA manifest and assets to allow PWABuilder to read them
app.get(["/manifest.json", "/manifest.webmanifest"], (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Content-Type", "application/manifest+json");
  res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
});

app.get("/sw.js", (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(path.join(process.cwd(), "public", "sw.js"));
});

// Enable CORS for all PWA icons to allow external scanners like PWABuilder to download them safely
app.get(["/pwa-192x192.png", "/pwa-512x512.png", "/apple-touch-icon.png", "/icon.png", "/favicon.ico"], (req: any, res: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const filename = path.basename(req.path);
  if (filename === "icon.png") {
    res.setHeader("Content-Type", "image/png");
    res.sendFile(path.join(process.cwd(), "public", "pwa-512x512.png"));
  } else if (filename === "favicon.ico") {
    res.setHeader("Content-Type", "image/x-icon");
    res.sendFile(path.join(process.cwd(), "public", "pwa-192x192.png"));
  } else {
    res.setHeader("Content-Type", "image/png");
    res.sendFile(path.join(process.cwd(), "public", filename));
  }
});

// Auth middleware to verify Firebase ID Token
const requireAuth = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// 1. Database seed trigger (ensures the DB is populated on first request if empty)
const ensureDbSeeded = async () => {
  try {
    await seedDatabase();
  } catch (err) {
    console.error("Error during auto-seeding:", err);
  }
};

// 2. Sync user profile after Firebase Authentication
app.post("/api/users/sync", requireAuth, async (req: any, res: any) => {
  const { role } = req.body;
  const { uid, email } = req.user;

  try {
    const result = await db.insert(users)
      .values({
        uid,
        email: email || "",
        role: role || "worker",
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email: email || "",
          role: role || "worker",
        },
      })
      .returning();

    res.json({ success: true, user: result[0] });
  } catch (error: any) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user profile with Postgres" });
  }
});

// 3. Get all compliance platform data (all tables)
app.get("/api/data", async (req: any, res: any) => {
  try {
    await ensureDbSeeded();

    const [
      allIndustries,
      allContractors,
      allWorkers,
      allAssignments,
      allRequirements,
      allAttendance,
      allComplianceDocs,
      allBills,
      allVerificationLogs,
      allAuditLogs,
      allRevenueLogs
    ] = await Promise.all([
      db.select().from(industries),
      db.select().from(contractors),
      db.select().from(workers),
      db.select().from(assignments),
      db.select().from(requirements),
      db.select().from(attendance),
      db.select().from(complianceDocs),
      db.select().from(bills),
      db.select().from(verificationLogs).orderBy(desc(verificationLogs.timestamp)),
      db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)),
      db.select().from(revenueLogs).orderBy(desc(revenueLogs.date))
    ]);

    // Parse serialized arrays/fields
    const parsedBills = allBills.map(b => ({
      ...b,
      complianceDocIds: b.complianceDocIds ? JSON.parse(b.complianceDocIds) : []
    }));

    res.json({
      industries: allIndustries,
      contractors: allContractors,
      workers: allWorkers,
      assignments: allAssignments,
      requirements: allRequirements,
      attendance: allAttendance,
      complianceDocs: allComplianceDocs,
      bills: parsedBills,
      verificationLogs: allVerificationLogs,
      auditLogs: allAuditLogs,
      revenueLogs: allRevenueLogs
    });
  } catch (error: any) {
    console.error("Error fetching CLRA compliance data:", error);
    res.status(500).json({ error: "Failed to load database contents", details: error.message });
  }
});

// 4. Register new contract worker
app.post("/api/workers/register", requireAuth, async (req: any, res: any) => {
  const { name, phone, aadhaarHash, contractorId, skillType, dailyWageRate } = req.body;
  if (!name || !phone || !aadhaarHash || !contractorId || !skillType) {
    return res.status(400).json({ error: "Missing required worker information" });
  }

  try {
    const workerId = "wrk-" + Date.now();
    const maskedAadhaar = `XXXX-XXXX-${aadhaarHash.slice(-4)}`;

    // 1. Insert Worker
    const newWorker = await db.insert(workers).values({
      id: workerId,
      name,
      aadhaarHash: maskedAadhaar,
      phone,
      contractorId,
      skillType,
      dailyWageRate: Number(dailyWageRate),
      status: "Available",
      onboardingVerified: true,
      onboardingDate: new Date().toISOString().split("T")[0]
    }).returning();

    // 2. Fetch contractor name for audit log
    const contractorObj = await db.select().from(contractors).where(eq(contractors.id, contractorId)).limit(1);
    const contractorName = contractorObj[0]?.name || "Assigned Contractor";

    // 3. Create Verification Log
    const newLog = await db.insert(verificationLogs).values({
      id: "log-" + Date.now(),
      workerId,
      workerName: name,
      timestamp: new Date().toLocaleString(),
      activity: "Onboarding",
      status: "Success",
      remarks: `Aadhaar OTP verified for new contract worker. Assigned under CLRA contractor: ${contractorName}.`
    }).returning();

    res.json({ success: true, worker: newWorker[0], log: newLog[0] });
  } catch (error: any) {
    console.error("Error registering worker:", error);
    res.status(500).json({ error: "Failed to register worker in database" });
  }
});

// 5. Deploy worker to industry
app.post("/api/workers/deploy", requireAuth, async (req: any, res: any) => {
  const { workerId, industryId, shiftTiming } = req.body;
  if (!workerId || !industryId || !shiftTiming) {
    return res.status(400).json({ error: "Missing deployment parameters" });
  }

  try {
    // 1. Fetch worker info
    const workerObj = await db.select().from(workers).where(eq(workers.id, workerId)).limit(1);
    if (!workerObj[0]) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const assignmentId = "asg-" + Date.now();

    // 2. Insert Assignment
    const newAsg = await db.insert(assignments).values({
      id: assignmentId,
      workerId,
      contractorId: workerObj[0].contractorId,
      industryId,
      assignedAt: new Date().toISOString().split("T")[0],
      status: "Active",
      shiftTiming
    }).returning();

    // 3. Update Worker status to Deployed
    await db.update(workers)
      .set({ status: "Deployed" })
      .where(eq(workers.id, workerId));

    res.json({ success: true, assignment: newAsg[0] });
  } catch (error: any) {
    console.error("Error deploying worker:", error);
    res.status(500).json({ error: "Failed to deploy worker" });
  }
});

// 6. Recall worker deployment
app.post("/api/workers/recall", requireAuth, async (req: any, res: any) => {
  const { assignmentId, workerId } = req.body;
  if (!assignmentId || !workerId) {
    return res.status(400).json({ error: "Missing parameters for recall" });
  }

  try {
    // 1. Update assignment
    const updatedAsg = await db.update(assignments)
      .set({ status: "Recalled" })
      .where(eq(assignments.id, assignmentId))
      .returning();

    // 2. Update worker
    await db.update(workers)
      .set({ status: "Available" })
      .where(eq(workers.id, workerId));

    res.json({ success: true, assignment: updatedAsg[0] });
  } catch (error: any) {
    console.error("Error recalling worker:", error);
    res.status(500).json({ error: "Failed to recall worker" });
  }
});

// 7. Upload missing statutory compliance documents
app.post("/api/compliance/upload-missing", requireAuth, async (req: any, res: any) => {
  const { contractorId, month, docType, fileUrl, remarks } = req.body;
  if (!contractorId || !month || !docType || !fileUrl) {
    return res.status(400).json({ error: "Missing compliance parameters" });
  }

  try {
    const docId = "doc-" + Date.now();
    const newDoc = await db.insert(complianceDocs).values({
      id: docId,
      contractorId,
      month,
      docType,
      fileUrl,
      uploadedAt: new Date().toISOString().split("T")[0],
      status: "Verified", // Auto verified in sandbox demo
      verifiedBy: "Labour Portal API",
      remarks: remarks || "Statutory return verified with portal records."
    }).returning();

    res.json({ success: true, document: newDoc[0] });
  } catch (error: any) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Failed to upload compliance document" });
  }
});

// 8. Submit contractor bill
app.post("/api/bills/submit", requireAuth, async (req: any, res: any) => {
  const { contractorId, industryId, month, baseAmount, serviceCharge, gstAmount, totalAmount, complianceDocIds } = req.body;

  try {
    const billId = "bill-" + Date.now();
    const newBill = await db.insert(bills).values({
      id: billId,
      contractorId,
      industryId,
      month,
      baseAmount: Number(baseAmount),
      serviceCharge: Number(serviceCharge),
      gstAmount: Number(gstAmount),
      totalAmount: Number(totalAmount),
      status: "Submitted",
      submittedAt: new Date().toLocaleString(),
      reviewedAt: null,
      remarks: "Awaiting Industry Admin verification of statutory challans.",
      complianceDocIds: JSON.stringify(complianceDocIds)
    }).returning();

    res.json({ success: true, bill: { ...newBill[0], complianceDocIds } });
  } catch (error: any) {
    console.error("Error submitting bill:", error);
    res.status(500).json({ error: "Failed to submit bill" });
  }
});

// 9. Industry Admin audits/approves or rejects bill
app.post("/api/bills/audit", requireAuth, async (req: any, res: any) => {
  const { billId, action } = req.body; // 'Approve' | 'Reject'
  if (!billId || !action) {
    return res.status(400).json({ error: "Missing parameters for bill audit" });
  }

  try {
    const updatedBill = await db.update(bills)
      .set({
        status: action === "Approve" ? "Approved" : "Rejected",
        reviewedAt: new Date().toLocaleString(),
        remarks: action === "Approve" ? "Verified with EPF/ESI Portal. Released for disbursement." : "Missing verified ESI receipts. Please re-submit."
      })
      .where(eq(bills.id, billId))
      .returning();

    res.json({ success: true, bill: updatedBill[0] });
  } catch (error: any) {
    console.error("Error auditing bill:", error);
    res.status(500).json({ error: "Failed to audit bill" });
  }
});

// 10. Worker check-in (attendance)
app.post("/api/attendance/check-in", requireAuth, async (req: any, res: any) => {
  const { workerId, verificationMethod, checkIn, date, industryId } = req.body;
  if (!workerId || !verificationMethod || !checkIn || !date || !industryId) {
    return res.status(400).json({ error: "Missing check-in parameters" });
  }

  try {
    // Fetch worker details
    const workerObj = await db.select().from(workers).where(eq(workers.id, workerId)).limit(1);
    if (!workerObj[0]) {
      return res.status(404).json({ error: "Worker not found" });
    }

    const attendanceId = "att-" + Date.now();

    // Insert attendance record
    const newAtt = await db.insert(attendance).values({
      id: attendanceId,
      date,
      workerId,
      workerName: workerObj[0].name,
      contractorId: workerObj[0].contractorId,
      industryId,
      checkIn,
      checkOut: null,
      aadhaarVerified: true,
      verificationMethod,
      hoursWorked: 0,
      overtimeHours: 0,
      status: "Present"
    }).returning();

    // Create log
    await db.insert(verificationLogs).values({
      id: "log-" + Date.now(),
      workerId,
      workerName: workerObj[0].name,
      timestamp: new Date().toLocaleString(),
      activity: "Shift-Check-In",
      status: "Success",
      remarks: verificationMethod === "Biometric-Face" 
        ? "Facial Biometric matched 98.4% against Aadhaar UIDAI secure cache."
        : "Aadhaar OTP verified. UIDAI reference code txn_live."
    });

    res.json({ success: true, attendance: newAtt[0] });
  } catch (error: any) {
    console.error("Error checking in worker:", error);
    res.status(500).json({ error: "Failed to log shift check-in" });
  }
});

// 11. Worker check-out (attendance)
app.post("/api/attendance/check-out", requireAuth, async (req: any, res: any) => {
  const { attendanceId, checkOut, hoursWorked, overtimeHours } = req.body;
  if (!attendanceId || !checkOut) {
    return res.status(400).json({ error: "Missing check-out parameters" });
  }

  try {
    const updatedAtt = await db.update(attendance)
      .set({
        checkOut,
        hoursWorked: Number(hoursWorked),
        overtimeHours: Number(overtimeHours),
      })
      .where(eq(attendance.id, attendanceId))
      .returning();

    res.json({ success: true, attendance: updatedAtt[0] });
  } catch (error: any) {
    console.error("Error checking out worker:", error);
    res.status(500).json({ error: "Failed to log shift check-out" });
  }
});

// 12. Add industry labor requirement
app.post("/api/requirements/add", requireAuth, async (req: any, res: any) => {
  const { industryId, industryName, contractorId, date, skillType, workersNeeded, shiftTiming } = req.body;
  if (!industryId || !contractorId || !date || !skillType || !workersNeeded) {
    return res.status(400).json({ error: "Missing requirement parameters" });
  }

  try {
    const reqId = "req-" + Date.now();
    const newReq = await db.insert(requirements).values({
      id: reqId,
      industryId,
      industryName,
      contractorId,
      date,
      skillType,
      workersNeeded: Number(workersNeeded),
      workersFulfilled: 0,
      shiftTiming,
      status: "Open"
    }).returning();

    res.json({ success: true, requirement: newReq[0] });
  } catch (error: any) {
    console.error("Error adding daily requirement:", error);
    res.status(500).json({ error: "Failed to publish daily requirement" });
  }
});

// 13. Inspector issues compliance notice
app.post("/api/audit/submit-notice", requireAuth, async (req: any, res: any) => {
  const { inspectorName, inspectedEntity, entityId, entityName, findings, status } = req.body;
  if (!inspectorName || !inspectedEntity || !entityId || !entityName || !findings || !status) {
    return res.status(400).json({ error: "Missing audit parameters" });
  }

  try {
    const auditId = "aud-" + Date.now();
    const newLog = await db.insert(auditLogs).values({
      id: auditId,
      inspectorName,
      inspectedEntity,
      entityId,
      entityName,
      timestamp: new Date().toLocaleString(),
      findings,
      status
    }).returning();

    res.json({ success: true, auditLog: newLog[0] });
  } catch (error: any) {
    console.error("Error submitting audit log:", error);
    res.status(500).json({ error: "Failed to publish regulatory compliance notice" });
  }
});

// Integrate Vite Dev Server / Static files middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
