import React from 'react';
import { 
  Milestone, 
  IndianRupee, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react';

export default function RoadmapView() {
  return (
    <div className="space-y-12">
      {/* Product Roadmap Overview */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Milestone className="text-emerald-600 h-6 w-6" />
          Product Development Roadmap (SaaS MVP)
        </h2>
        <p className="text-slate-600 leading-relaxed max-w-4xl">
          An incremental, security-first timeline designed to launch a highly compliant contract labor supply software in Indian industrial belts (like Pune, Bellary, Chennai, and NCR).
        </p>

        {/* Phase Timeline */}
        <div className="relative border-l border-slate-200 ml-4 mt-8 space-y-8 pb-4">
          
          {/* Phase 1 */}
          <div className="relative pl-6">
            <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-emerald-600 border border-white"></div>
            <div className="text-xs font-semibold text-emerald-600 tracking-widest uppercase mb-1">Phase 1: Foundation & Identity (Weeks 1-4)</div>
            <h4 className="font-bold text-slate-800 text-sm">Aadhaar KYC & Contractor Onboarding</h4>
            <ul className="list-disc list-inside mt-2 text-xs text-slate-500 space-y-1">
              <li>Deploy Core Tenant systems for Factories (Factory Licenses, Principal Employer Registration).</li>
              <li>Integrate secure UIDAI OTP API sandbox and bio-matching microservices.</li>
              <li>Establish public Contractor Directory for idle laborers.</li>
            </ul>
          </div>

          {/* Phase 2 */}
          <div className="relative pl-6">
            <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-indigo-600 border border-white"></div>
            <div className="text-xs font-semibold text-indigo-600 tracking-widest uppercase mb-1">Phase 2: Core Workflows (Weeks 5-8)</div>
            <h4 className="font-bold text-slate-800 text-sm">Multi-Industry Deployment & Shift Timekeeper</h4>
            <ul className="list-disc list-inside mt-2 text-xs text-slate-500 space-y-1">
              <li>Develop the live Contractor Multi-Industry tracking module with drag-and-drop allocations.</li>
              <li>Build real-time Shift Attendance capturing 8h (regular) vs. 12h (overtime) states.</li>
              <li>Implement Privacy shielding layers to mask client brands on worker screens.</li>
            </ul>
          </div>

          {/* Phase 3 */}
          <div className="relative pl-6">
            <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-amber-500 border border-white"></div>
            <div className="text-xs font-semibold text-amber-600 tracking-widest uppercase mb-1">Phase 3: The Lock & Audit (Weeks 9-12)</div>
            <h4 className="font-bold text-slate-800 text-sm">Statutory Bill-Locking & Labour Inspector Portal</h4>
            <ul className="list-disc list-inside mt-2 text-xs text-slate-500 space-y-1">
              <li>Write the compliance checking state-machine that matches current bills with prior month's EPF, ESI, and GST challans.</li>
              <li>Launch the secure Labour Inspector Portal with quick-compliance ratings and exportable PDF registers (Form XV, Form XVI).</li>
              <li>Integrate automated payroll generation based directly on verified biometric logs.</li>
            </ul>
          </div>

          {/* Phase 4 */}
          <div className="relative pl-6">
            <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-slate-400 border border-white"></div>
            <div className="text-xs font-semibold text-slate-600 tracking-widest uppercase mb-1">Phase 4: Scale & Monetization (Weeks 13-16)</div>
            <h4 className="font-bold text-slate-800 text-sm">Micro-Billing Settlements & Expansion</h4>
            <ul className="list-disc list-inside mt-2 text-xs text-slate-500 space-y-1">
              <li>Initiate automated monthly invoicing for the SaaS platform fee (₹1 per worker-day).</li>
              <li>Expand native Android apps featuring voice guidance in Hindi, Marathi, Kannada, and Telugu.</li>
              <li>Release Predictive Labour Supply analytics powered by seasonal demands.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Monetization Strategy */}
      <section className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <IndianRupee className="text-emerald-600 h-5 w-5" />
          The SaaS Micro-Fee Monetization Model
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-900 font-semibold rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span>₹1 (One Rupee) Daily Per-Worker Model</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              To make platform adoption seamless and highly scale-aligned, we charge zero heavy licensing fees upfront. Instead, the platform levies a micro-SaaS fee of <strong>₹1 per deployed worker per day</strong> who is marked present via Aadhaar check-in.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-xs">
              <span className="font-semibold block text-slate-700 mb-2">Simulated Yield (e.g. Medium Factory):</span>
              <ul className="space-y-1.5 text-slate-500">
                <li className="flex justify-between"><span>Deployed Workforce:</span> <span className="font-semibold text-slate-700">500 Workers</span></li>
                <li className="flex justify-between"><span>Operational Days / Mo:</span> <span className="font-semibold text-slate-700">26 Days</span></li>
                <li className="flex justify-between border-t border-slate-200 pt-1.5 mt-1.5"><span>Monthly SaaS Revenue:</span> <span className="font-semibold text-emerald-600">₹13,000 / Month</span></li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-indigo-50 text-indigo-900 font-semibold rounded-lg">
              <ShieldCheck className="h-5 w-5 text-indigo-600" />
              <span>Value Proposition to Stakeholders</span>
            </div>
            
            <div className="space-y-3 text-xs text-slate-600">
              <p>
                <strong>For Manufacturing Industries:</strong> Saves lakhs in government fines by preventing audits that trigger solid-liability defaults under Section 21 of CLRA.
              </p>
              <p>
                <strong>For Labor Contractors:</strong> Drastically reduces billing overheads, speeds up billing approvals from weeks to minutes, and unlocks immediate multi-factory growth without operational chaos.
              </p>
              <p>
                <strong>For Government Auditors:</strong> Instant access to flawless, digital-fingerprint verified registries, minimum wage calculations, and compliance proof in just one click.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
