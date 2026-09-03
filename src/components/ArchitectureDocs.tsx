import React from 'react';
import { 
  Database, 
  Key, 
  FileCheck, 
  ShieldAlert, 
  Layers, 
  Cpu, 
  CreditCard 
} from 'lucide-react';

export default function ArchitectureDocs() {
  return (
    <div className="space-y-12">
      {/* Executive Overview */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Layers className="text-indigo-600 h-6 w-6" />
          Technical System Architecture
        </h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          The Contract Labour Compliance Platform is a multi-tenant B2B SaaS platform structured specifically around Indian labor regulations: 
          <strong> The Contract Labour (Regulation & Abolition) Act, 1970 (CLRA)</strong>, 
          <strong> Employees' Provident Funds Scheme (EPF)</strong>, and 
          <strong> Employees' State Insurance Act (ESI)</strong>. 
          The platform operates with a decoupled full-stack architecture ensuring absolute security, encrypted ID hashes, and rigorous state-machine billing locking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-2xs">
            <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase mb-2">Frontend layer</div>
            <h4 className="font-semibold text-slate-800 mb-1">React + Tailwind + Vite</h4>
            <p className="text-xs text-slate-500">Role-gated dashboards for Factories, Contractors, Workers, and Government Inspectors with distinct access boundaries.</p>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-2xs">
            <div className="text-xs font-semibold text-emerald-600 tracking-wider uppercase mb-2">Backend & Security Engine</div>
            <h4 className="font-semibold text-slate-800 mb-1">Node/Express API + Aadhaar UIDAI</h4>
            <p className="text-xs text-slate-500">Secure AES-256 Aadhaar hashing, biometric facial-matching API triggers, and stateful compliance lock middleware.</p>
          </div>
          <div className="bg-white border border-slate-100 p-5 rounded-lg shadow-2xs">
            <div className="text-xs font-semibold text-amber-600 tracking-wider uppercase mb-2">Data & Storage</div>
            <h4 className="font-semibold text-slate-800 mb-1">PostgreSQL/Cloud SQL</h4>
            <p className="text-xs text-slate-500">Structured transactional SQL database with strict foreign key constraints, temporal wage auditing, and compliance ledgers.</p>
          </div>
        </div>
      </section>

      {/* Database Schema Design */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Database className="text-indigo-600 h-6 w-6" />
          <h2 className="text-2xl font-bold text-slate-900">Database Schema Design (Relational PostgreSQL)</h2>
        </div>
        <p className="text-sm text-slate-500 max-w-3xl">
          The following entity relationship schema enforces high integrity, allowing many-to-many relationship tracking between Industries and Contractors via multi-industry worker deployments.
        </p>

        {/* Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* 1. Industries */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: industries</span>
              <span className="text-xs text-slate-400">SaaS Principal/Client Tenants</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>name</span> <span className="text-slate-400">VARCHAR(255) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>location</span> <span className="text-slate-400">TEXT [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>reg_no</span> <span className="text-slate-400">VARCHAR(100) [UNIQUE] (Factory Lic)</span></li>
              <li className="flex justify-between p-1.5"><span>lin</span> <span className="text-slate-400">VARCHAR(10) [UNIQUE] (Labour ID)</span></li>
              <li className="flex justify-between p-1.5"><span>contact_email</span> <span className="text-slate-400">VARCHAR(100)</span></li>
              <li className="flex justify-between p-1.5"><span>created_at</span> <span className="text-slate-500">TIMESTAMP [DEFAULT NOW()]</span></li>
            </ul>
          </div>

          {/* 2. Contractors */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: contractors</span>
              <span className="text-xs text-slate-400">Independent Labor Vendors</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>name</span> <span className="text-slate-400">VARCHAR(255) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>license_no</span> <span className="text-slate-400">VARCHAR(100) [UNIQUE] (CLRA Lic)</span></li>
              <li className="flex justify-between p-1.5"><span>lin</span> <span className="text-slate-400">VARCHAR(10) [UNIQUE]</span></li>
              <li className="flex justify-between p-1.5"><span>pan</span> <span className="text-slate-400">VARCHAR(10) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>epf_code</span> <span className="text-slate-400">VARCHAR(50) [UNIQUE]</span></li>
              <li className="flex justify-between p-1.5"><span>esi_code</span> <span className="text-slate-400">VARCHAR(50) [UNIQUE]</span></li>
              <li className="flex justify-between p-1.5"><span>contact_no</span> <span className="text-slate-400">VARCHAR(15)</span></li>
              <li className="flex justify-between p-1.5"><span>rating</span> <span className="text-slate-400">NUMERIC(3,2) [DEFAULT 5.0]</span></li>
            </ul>
          </div>

          {/* 3. Workers */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: workers</span>
              <span className="text-xs text-slate-400">Labour Workforce Registry</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>name</span> <span className="text-slate-400">VARCHAR(255) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>aadhaar_hash</span> <span className="text-slate-500">VARCHAR(64) [UNIQUE, SHA256]</span></li>
              <li className="flex justify-between p-1.5"><span>phone</span> <span className="text-slate-400">VARCHAR(15)</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>skill_type</span> <span className="text-slate-400">VARCHAR(30) (Skilled, Unskilled, etc)</span></li>
              <li className="flex justify-between p-1.5"><span>daily_wage_rate</span> <span className="text-slate-400">NUMERIC(10,2) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(20) [DEFAULT 'Available']</span></li>
              <li className="flex justify-between p-1.5"><span>onboarding_verified</span> <span className="text-slate-400">BOOLEAN [DEFAULT FALSE]</span></li>
            </ul>
          </div>

          {/* 4. Multi-Industry Assignments */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: assignments</span>
              <span className="text-xs text-slate-400">Live Multi-Industry Deployments</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>worker_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; workers.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>industry_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; industries.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>assigned_at</span> <span className="text-slate-400">TIMESTAMP [DEFAULT NOW()]</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(20) [DEFAULT 'Active']</span></li>
              <li className="flex justify-between p-1.5"><span>shift_timing</span> <span className="text-slate-400">VARCHAR(50) [NOT NULL]</span></li>
            </ul>
          </div>

          {/* 5. Attendance & Timekeeper */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: attendance</span>
              <span className="text-xs text-slate-400">Aadhaar/Biometric Shift Check-ins</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>date</span> <span className="text-slate-400">DATE [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>worker_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; workers.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>industry_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; industries.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>check_in</span> <span className="text-slate-400">TIME [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>check_out</span> <span className="text-slate-400">TIME</span></li>
              <li className="flex justify-between p-1.5"><span>aadhaar_verified</span> <span className="text-slate-400">BOOLEAN [DEFAULT FALSE]</span></li>
              <li className="flex justify-between p-1.5"><span>verification_method</span> <span className="text-slate-400">VARCHAR(30)</span></li>
              <li className="flex justify-between p-1.5"><span>hours_worked</span> <span className="text-slate-400">NUMERIC(4,2)</span></li>
              <li className="flex justify-between p-1.5"><span>overtime_hours</span> <span className="text-slate-400">NUMERIC(4,2) [Calculated &gt; 8h]</span></li>
            </ul>
          </div>

          {/* 6. Compliance Documents */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: compliance_documents</span>
              <span className="text-xs text-slate-400">Statutory Monthly Challans Ledger</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>month</span> <span className="text-slate-400">VARCHAR(20) [NOT NULL] (e.g. "Aug 2026")</span></li>
              <li className="flex justify-between p-1.5"><span>doc_type</span> <span className="text-slate-400">VARCHAR(30) (EPF-Challan, ESI, GST)</span></li>
              <li className="flex justify-between p-1.5"><span>file_url</span> <span className="text-slate-400">TEXT [NOT NULL] (S3 Hash Path)</span></li>
              <li className="flex justify-between p-1.5"><span>uploaded_at</span> <span className="text-slate-400">TIMESTAMP</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(20) (Verified, Rejected, Pending)</span></li>
              <li className="flex justify-between p-1.5"><span>verified_by</span> <span className="text-slate-400">VARCHAR(100)</span></li>
            </ul>
          </div>

          {/* 7. Compliance-Locked Billing */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: billing</span>
              <span className="text-xs text-slate-400">Regulatory Secured Invoices</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>contractor_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; contractors.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>industry_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; industries.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>month</span> <span className="text-slate-400">VARCHAR(20) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>base_amount</span> <span className="text-slate-400">NUMERIC(12,2) [NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>service_charge</span> <span className="text-slate-400">NUMERIC(12,2)</span></li>
              <li className="flex justify-between p-1.5"><span>gst_amount</span> <span className="text-slate-400">NUMERIC(12,2) [18%]</span></li>
              <li className="flex justify-between p-1.5"><span>total_amount</span> <span className="text-slate-400">NUMERIC(12,2)</span></li>
              <li className="flex justify-between p-1.5 bg-amber-50"><span>status</span> <span className="text-amber-800">VARCHAR(20) (Locked, Submitted, Approved)</span></li>
            </ul>
          </div>

          {/* 8. Aadhaar Verification Logs */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Table: aadhaar_logs</span>
              <span className="text-xs text-slate-400">UIDAI Compliance Audit Logs</span>
            </div>
            <ul className="space-y-2 font-mono text-xs text-slate-700">
              <li className="flex justify-between p-1.5 bg-slate-50 rounded"><span className="font-semibold text-indigo-700">id</span> <span className="text-slate-500">UUID [PK, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>worker_id</span> <span className="text-emerald-700 font-semibold">UUID [FK &rarr; workers.id, NOT NULL]</span></li>
              <li className="flex justify-between p-1.5"><span>timestamp</span> <span className="text-slate-400">TIMESTAMP [DEFAULT NOW()]</span></li>
              <li className="flex justify-between p-1.5"><span>activity</span> <span className="text-slate-400">VARCHAR(50) (Onboarding / Check-In)</span></li>
              <li className="flex justify-between p-1.5"><span>status</span> <span className="text-slate-400">VARCHAR(10) (Success / Failed)</span></li>
              <li className="flex justify-between p-1.5"><span>uidai_tx_ref</span> <span className="text-slate-400">VARCHAR(100) [Encrypted OTP audit key]</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Multi-Industry Real-Time Architecture Diagram */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="text-indigo-600 h-5 w-5" />
          The Multi-Vendor Compliance & Security Pipeline
        </h3>

        <div className="border border-slate-100 rounded-lg p-6 bg-slate-50 space-y-6 text-sm text-slate-600">
          <div className="flex flex-col md:flex-row gap-4 items-stretch justify-between">
            <div className="bg-white p-4 rounded border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="font-semibold text-indigo-600 mb-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                1. Aadhaar ID & Roster Setup
              </div>
              <p className="text-xs text-slate-500">Workers undergo instant UIDAI Aadhaar verification. Self-registered workers are immediately assigned to licensed contractors to satisfy CLRA standards.</p>
            </div>
            <div className="flex items-center justify-center text-slate-400 font-bold">➔</div>
            <div className="bg-white p-4 rounded border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="font-semibold text-emerald-600 mb-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-emerald-600"></div>
                2. Live Multi-Industry Deployment
              </div>
              <p className="text-xs text-slate-500">Contractors deploy available workers to multiple industries using the real-time planner, routing the appropriate skill categories to factory shifts.</p>
            </div>
            <div className="flex items-center justify-center text-slate-400 font-bold">➔</div>
            <div className="bg-white p-4 rounded border border-slate-200 flex-1 flex flex-col justify-between">
              <div className="font-semibold text-amber-600 mb-1 flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-amber-600"></div>
                3. Double-Locked Statutory Billing
              </div>
              <p className="text-xs text-slate-500">Prior to August billing, contractors must present EPF/ESI/GST deposit challans for July. Non-compliance results in an absolute lock of billing workflows.</p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex gap-3 text-amber-900 text-xs">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <span className="font-semibold">Indian Statutory CLRA Clause 21 Alignment:</span>
              <p className="mt-1">
                The CLRA Act dictates that the Principal Employer (Industry) is ultimately liable for unpaid wages or statutory dues if the contractor defaults. 
                Our platform eliminates this massive liability for industries by locking monthly service bills until matching challans are uploaded and audited on-platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
