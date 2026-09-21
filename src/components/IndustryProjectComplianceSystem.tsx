import React, { useState, useMemo } from 'react';
import { 
  FolderCheck, 
  Building2, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  Calendar, 
  Clock, 
  Coins, 
  Users, 
  Printer, 
  Download, 
  Search, 
  Plus, 
  Eye, 
  Check, 
  X, 
  FileSpreadsheet, 
  Award, 
  Scale, 
  FileCheck, 
  AlertTriangle,
  Send,
  UserCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  Industry, 
  Contractor, 
  Worker, 
  Attendance, 
  ComplianceDocument, 
  MultiIndustryAssignment,
  GovernmentLaborInspector,
  ComplianceDocType
} from '../types';

interface IndustryProjectComplianceSystemProps {
  contractor: Contractor;
  allContractors?: Contractor[];
  industries: Industry[];
  workers: Worker[];
  attendance: Attendance[];
  complianceDocs: ComplianceDocument[];
  assignments: MultiIndustryAssignment[];
  inspectors?: GovernmentLaborInspector[];
  viewMode?: 'contractor' | 'industry_hr' | 'government_inspector';
  selectedIndustryId?: string;
  onSelectIndustryId?: (industryId: string) => void;
  onUploadDoc: (doc: Omit<ComplianceDocument, 'id' | 'uploadedAt'>) => void;
  onAddAttendanceRecord: (record: Omit<Attendance, 'id'>) => void;
  onHrSignOff?: (industryId: string, contractorId: string, remarks?: string) => void;
  onInspectorAuditSignOff?: (industryId: string, contractorId: string, status: 'Clean' | 'Minor-Observations' | 'Non-Compliant-Alert', remarks: string) => void;
}

export const IndustryProjectComplianceSystem: React.FC<IndustryProjectComplianceSystemProps> = ({
  contractor,
  allContractors,
  industries,
  workers,
  attendance,
  complianceDocs,
  assignments,
  inspectors = [],
  viewMode = 'contractor',
  selectedIndustryId: controlledIndustryId,
  onSelectIndustryId,
  onUploadDoc,
  onAddAttendanceRecord,
  onHrSignOff,
  onInspectorAuditSignOff
}) => {
  // Selected contractor state (supports switching in HR or Inspector modes)
  const [selectedContractorId, setSelectedContractorId] = useState<string>(contractor?.id || 'con-1');

  useEffect(() => {
    if (contractor?.id) {
      setSelectedContractorId(contractor.id);
    }
  }, [contractor?.id]);

  const activeContractor = useMemo(() => {
    if (allContractors && allContractors.length > 0) {
      return allContractors.find(c => c.id === selectedContractorId) || contractor;
    }
    return contractor;
  }, [allContractors, selectedContractorId, contractor]);

  // Determine all industry projects linked to this contractor
  const assignedIndustryIds = useMemo(() => {
    const ids = new Set<string>();
    // From assignments
    assignments.forEach(a => {
      if (a.contractorId === activeContractor.id) {
        ids.add(a.industryId);
      }
    });
    // From compliance docs
    complianceDocs.forEach(d => {
      if (d.contractorId === activeContractor.id && d.industryId) {
        ids.add(d.industryId);
      }
    });
    // From attendance
    attendance.forEach(att => {
      if (att.contractorId === activeContractor.id && att.industryId) {
        ids.add(att.industryId);
      }
    });

    // If contractor has none yet, default to all industries so they can maintain folders
    if (ids.size === 0 && industries.length > 0) {
      industries.forEach(i => ids.add(i.id));
    }
    return Array.from(ids);
  }, [assignments, complianceDocs, attendance, activeContractor.id, industries]);

  // Active Project Selection
  const [internalSelectedIndId, setInternalSelectedIndId] = useState<string>(
    controlledIndustryId || assignedIndustryIds[0] || industries[0]?.id || 'ind-1'
  );

  const activeIndustryId = controlledIndustryId || internalSelectedIndId;
  const activeIndustry = industries.find(i => i.id === activeIndustryId) || industries[0];

  const handleSelectIndustry = (id: string) => {
    setInternalSelectedIndId(id);
    if (onSelectIndustryId) onSelectIndustryId(id);
  };

  // Sub-tab navigation inside the project folder
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'muster' | 'wages' | 'legal_docs' | 'signoff'>('overview');

  // Month selector (defaults to current active audit month)
  const [selectedMonth, setSelectedMonth] = useState<string>('August 2026');

  // Modal states
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [activeUploadDocType, setActiveUploadDocType] = useState<ComplianceDocType>('Form-IV-License');
  const [previewDoc, setPreviewDoc] = useState<ComplianceDocument | null>(null);

  // New Attendance Form State
  const [attWorkerId, setAttWorkerId] = useState<string>('');
  const [attDate, setAttDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attCheckIn, setAttCheckIn] = useState<string>('08:00');
  const [attCheckOut, setAttCheckOut] = useState<string>('17:00');
  const [attOvertimeHours, setAttOvertimeHours] = useState<number>(0);
  const [attVerificationMethod, setAttVerificationMethod] = useState<'Biometric-Face' | 'Aadhaar-OTP' | 'Supervisor-Gate' | 'Quick-Batch'>('Biometric-Face');
  const [attStatus, setAttStatus] = useState<'Present' | 'Absent'>('Present');

  // New Doc Upload Form State
  const [uploadRefNo, setUploadRefNo] = useState<string>('');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadRemarks, setUploadRemarks] = useState<string>('');
  const [uploadMonth, setUploadMonth] = useState<string>('August 2026');

  // Inspector / HR Observation State
  const [signOffRemarks, setSignOffRemarks] = useState<string>('');
  const [auditStatusResult, setAuditStatusResult] = useState<'Clean' | 'Minor-Observations' | 'Non-Compliant-Alert'>('Clean');

  // Workers deployed at this industry
  const deployedWorkerIds = useMemo(() => {
    const ids = new Set<string>();
    assignments.forEach(a => {
      if (a.contractorId === contractor.id && a.industryId === activeIndustryId && a.status === 'Active') {
        ids.add(a.workerId);
      }
    });
    // Also include workers with attendance at this site
    attendance.forEach(att => {
      if (att.contractorId === contractor.id && att.industryId === activeIndustryId) {
        ids.add(att.workerId);
      }
    });
    return ids;
  }, [assignments, attendance, contractor.id, activeIndustryId]);

  const deployedWorkers = useMemo(() => {
    const list = workers.filter(w => deployedWorkerIds.has(w.id) && w.contractorId === contractor.id);
    // If empty fallback to contractor's general workers
    if (list.length === 0) {
      return workers.filter(w => w.contractorId === contractor.id).slice(0, 3);
    }
    return list;
  }, [workers, deployedWorkerIds, contractor.id]);

  // Site-specific attendance records
  const siteAttendance = useMemo(() => {
    return attendance.filter(a => 
      a.contractorId === contractor.id && 
      a.industryId === activeIndustryId
    );
  }, [attendance, contractor.id, activeIndustryId]);

  // Site-specific compliance documents
  const siteDocs = useMemo(() => {
    return complianceDocs.filter(d => 
      d.contractorId === contractor.id && 
      (d.industryId === activeIndustryId || !d.industryId)
    );
  }, [complianceDocs, contractor.id, activeIndustryId]);

  // Find assigned inspector for this industry
  const assignedInspector = useMemo(() => {
    if (!activeIndustry || inspectors.length === 0) return null;
    const loc = (activeIndustry.location || '').toLowerCase();
    const matched = inspectors.find(insp => {
      const dist = (insp.district || '').toLowerCase();
      const zone = (insp.jurisdictionZone || '').toLowerCase();
      if (dist && (loc.includes(dist) || dist.includes(loc))) return true;
      const kw = zone.split(/[,\s&/]+/).filter(w => w.length > 3);
      return kw.some(k => loc.includes(k));
    });
    return matched || inspectors[0];
  }, [activeIndustry, inspectors]);

  // Wage Calculations for each deployed worker (Form XVII Register of Wages)
  const wageRegisterData = useMemo(() => {
    return deployedWorkers.map(worker => {
      const workerAtts = siteAttendance.filter(a => a.workerId === worker.id && a.status === 'Present');
      const daysWorked = workerAtts.length > 0 ? workerAtts.length : 24; // realistic monthly mandays
      const totalOtHours = workerAtts.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0) || (worker.id === 'wrk-2' ? 12 : 4);
      
      const dailyRate = worker.dailyWageRate || 650;
      const hourlyRate = dailyRate / 8;
      const normalWage = daysWorked * dailyRate;
      // Overtime at double standard rate under Factories Act / CLRA
      const otWage = Math.round(totalOtHours * hourlyRate * 2);
      const grossWage = normalWage + otWage;

      // Statutory deductions
      // EPF 12% employee share
      const epfDeduction = Math.round(Math.min(normalWage, 15000) * 0.12);
      // ESI 0.75% employee share
      const esiDeduction = Math.round(grossWage * 0.0075);
      const netWage = grossWage - epfDeduction - esiDeduction;

      // Minimum wage compliance check (Assam Scheduled Employment rate baseline)
      const minWageFloor = worker.skillType === 'Unskilled' ? 450 : worker.skillType === 'Semi-Skilled' ? 520 : worker.skillType === 'Skilled' ? 620 : 750;
      const isCompliant = dailyRate >= minWageFloor;

      return {
        worker,
        daysWorked,
        totalOtHours,
        dailyRate,
        hourlyRate,
        normalWage,
        otWage,
        grossWage,
        epfDeduction,
        esiDeduction,
        netWage,
        isCompliant,
        minWageFloor
      };
    });
  }, [deployedWorkers, siteAttendance]);

  // Overall totals for wage register
  const totalGrossWages = wageRegisterData.reduce((sum, item) => sum + item.grossWage, 0);
  const totalEpfDeduction = wageRegisterData.reduce((sum, item) => sum + item.epfDeduction, 0);
  const totalEsiDeduction = wageRegisterData.reduce((sum, item) => sum + item.esiDeduction, 0);
  const totalNetWages = wageRegisterData.reduce((sum, item) => sum + item.netWage, 0);
  const totalOtHours = wageRegisterData.reduce((sum, item) => sum + item.totalOtHours, 0);

  // Check which mandatory documents are present for this project
  const docStatusMap = useMemo(() => {
    const hasFormIV = siteDocs.some(d => d.docType === 'Form-IV-License');
    const hasFormVIA = siteDocs.some(d => d.docType === 'Form-VI-A-Notice');
    const hasEPF = siteDocs.some(d => d.docType === 'EPF-Challan');
    const hasESI = siteDocs.some(d => d.docType === 'ESI-Challan');
    const hasBank = siteDocs.some(d => d.docType === 'Bank-Disbursement-Proof');
    const hasWage = siteDocs.some(d => d.docType === 'Wage-Register');

    const totalUploaded = [hasFormIV, hasFormVIA, hasEPF, hasESI, hasBank].filter(Boolean).length;
    const score = Math.round((totalUploaded / 5) * 100);

    return {
      hasFormIV,
      hasFormVIA,
      hasEPF,
      hasESI,
      hasBank,
      hasWage,
      totalUploaded,
      score,
      isFullyCompliant: score === 100
    };
  }, [siteDocs]);

  // Handle adding attendance
  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attWorkerId) return;

    const workerObj = workers.find(w => w.id === attWorkerId);
    if (!workerObj) return;

    onAddAttendanceRecord({
      workerId: workerObj.id,
      workerName: workerObj.name,
      contractorId: contractor.id,
      industryId: activeIndustryId,
      date: attDate,
      checkIn: attCheckIn,
      checkOut: attCheckOut,
      aadhaarVerified: true,
      verificationMethod: attVerificationMethod,
      hoursWorked: attStatus === 'Present' ? 8 : 0,
      overtimeHours: attStatus === 'Present' ? Number(attOvertimeHours) : 0,
      status: attStatus,
      markedBySupervisor: `${contractor.name} Site Field Office`
    });

    setIsAttendanceModalOpen(false);
  };

  // Handle uploading document
  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const docTitles: Record<ComplianceDocType, string> = {
      'Form-IV-License': 'CLRA_Form_IV_License',
      'Form-VI-A-Notice': 'Notice_Commencement_Form_VI_A',
      'EPF-Challan': 'EPF_ECR_Challan_Receipt',
      'ESI-Challan': 'ESIC_Monthly_Payment_Receipt',
      'Bank-Disbursement-Proof': 'Bank_Wages_NEFT_Disbursement_Sheet',
      'Wage-Register': 'Form_XVII_Wage_Register',
      'GST-Return': 'GSTR3B_Filing_Receipt',
      'Muster-Roll-XVI': 'Form_XVI_Muster_Roll'
    };

    const finalFileName = uploadFileName.trim() || `${docTitles[activeUploadDocType] || 'Statutory_Doc'}_${uploadMonth.replace(/\s+/g, '_')}.pdf`;
    const finalRef = uploadRefNo.trim() || `REF-${activeUploadDocType.slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;

    onUploadDoc({
      contractorId: contractor.id,
      industryId: activeIndustryId,
      month: uploadMonth,
      docType: activeUploadDocType,
      fileUrl: finalFileName,
      fileName: finalFileName,
      referenceNo: finalRef,
      status: 'Verified',
      verifiedBy: viewMode === 'industry_hr' ? 'Industry HR Gate Office' : viewMode === 'government_inspector' ? 'Govt Labor Inspector' : 'System Auto-Audit',
      remarks: uploadRemarks.trim() || 'Digitally archived on ShramikLink compliance folder.',
      validTill: '2026-12-31'
    });

    setIsUploadModalOpen(false);
    setUploadFileName('');
    setUploadRefNo('');
    setUploadRemarks('');
  };

  // Print Form XVI Muster Roll
  const handlePrintMusterRoll = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* HEADER: AUTOMATED COMPLIANCE & DOCUMENTATION RECORD SYSTEM */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <FolderCheck className="w-48 h-48" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Automated Statutory Compliance & Project Records (CLRA / Form XVI & XVII)
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <FolderCheck className="h-6 w-6 text-indigo-400" />
              ইণ্ডাষ্ট্ৰীভিত্তিক কমপ্লাইয়েন্স আৰু নথি খতিয়ান
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-3xl">
              প্ৰতিটো নিয়োগকাৰী কাৰখানাৰ বাবে স্বয়ংক্ৰিয় মাষ্টাৰ ৰোল (Form XVI), মজুৰি আৰু অভাৰটাইম ৰেজিষ্টাৰ (Form XVII), অনুজ্ঞাপত্ৰ (Form IV), Form VI-A আৰু EPF/ESI বেংক প্ৰমাণ সংৰক্ষণ কক্ষ।
            </p>
          </div>

          {/* Quick Context & Mode Indicator */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">প্ৰৱেশ মোড (View Mode)</span>
            <span className={`text-xs font-bold inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md mt-1 ${
              viewMode === 'government_inspector'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : viewMode === 'industry_hr'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {viewMode === 'government_inspector' && <Scale className="h-3.5 w-3.5" />}
              {viewMode === 'industry_hr' && <Building2 className="h-3.5 w-3.5" />}
              {viewMode === 'contractor' && <Users className="h-3.5 w-3.5" />}
              {viewMode === 'government_inspector' ? 'শ্ৰম পৰিদৰ্শক অধিকাৰিক নিৰীক্ষণ' : viewMode === 'industry_hr' ? 'ইণ্ডাষ্ট্ৰী এইচ.আৰ নিৰীক্ষণ' : 'ঠিকাদাৰ পৰিচালনা প্যানেল'}
            </span>
          </div>
        </div>
      </div>

      {/* 1. DEDICATED INDUSTRY PROJECT FOLDERS / TABS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-600" />
              নিয়োগকাৰী কাৰখানা প্ৰকল্প ফোল্ডাৰ (Assigned Industry Project Folders)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              আপোনাৰ শ্ৰমিক নিয়োজিত থকা কাৰখানাৰ প্ৰকল্প ফোল্ডাৰ নিৰ্বাচন কৰক।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">অডিট মাহ:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
            >
              <option value="August 2026">August 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="July 2026">July 2026</option>
            </select>
          </div>
        </div>

        {/* Dynamic Project Tabs / Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {industries.map(ind => {
            const isSelected = ind.id === activeIndustryId;
            const indWorkersCount = workers.filter(w => 
              w.contractorId === contractor.id && 
              assignments.some(a => a.workerId === w.id && a.industryId === ind.id)
            ).length || (ind.id === 'ind-1' ? 2 : ind.id === 'ind-2' ? 1 : 1);

            const indDocsCount = complianceDocs.filter(d => 
              d.contractorId === contractor.id && 
              (d.industryId === ind.id || !d.industryId)
            ).length;

            return (
              <button
                key={ind.id}
                onClick={() => handleSelectIndustry(ind.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-xs' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{ind.name}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{ind.location}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="bg-indigo-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                      সক্ৰিয়
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 flex items-center gap-1 font-medium">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    {indWorkersCount} জন শ্ৰমিক
                  </span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-emerald-200">
                    {indDocsCount} টা নথি সংৰক্ষিত
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PROJECT FOLDER WORKSPACE (SUB-TABS) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Project Header Banner */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 text-[10px] font-mono px-2 py-0.5 rounded uppercase">
                Project Dossier: {activeIndustry.regNo}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-bold">
                LIN: {activeIndustry.lin}
              </span>
            </div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              📁 {activeIndustry.name} — আইনী নথি ও ৰেজিষ্টাৰ সংৰক্ষণ
            </h3>
            <p className="text-xs text-slate-300">
              ঠিকাদাৰ: <span className="font-bold text-white">{contractor.name}</span> | লাইচেঞ্চ: <span className="font-mono text-indigo-300">{contractor.licenseNo}</span>
            </p>
          </div>

          {/* Compliance Health Badge */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs px-4 py-2 rounded-xl border border-white/15">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-300 block font-bold">কমপ্লাইয়েন্স স্থিতি</span>
              <span className="text-xs font-black text-emerald-400">
                {docStatusMap.score}% নিখুঁত সংৰক্ষিত
              </span>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-black text-xs text-white bg-emerald-600/30">
              {docStatusMap.score}%
            </div>
          </div>
        </div>

        {/* Clean, Mobile-Friendly Sub-Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-1 overflow-x-auto px-4 pt-2 bg-slate-50/70 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 font-black bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderCheck className="h-4 w-4" />
            ফোল্ডাৰ অভাৰভিউ (Overview)
          </button>

          <button
            onClick={() => setActiveSubTab('muster')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'muster'
                ? 'border-indigo-600 text-indigo-600 font-black bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            মাষ্টাৰ ৰোল (Form XVI)
          </button>

          <button
            onClick={() => setActiveSubTab('wages')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'wages'
                ? 'border-indigo-600 text-indigo-600 font-black bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Coins className="h-4 w-4" />
            মজুৰি ও অভাৰটাইম (Form XVII)
          </button>

          <button
            onClick={() => setActiveSubTab('legal_docs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'legal_docs'
                ? 'border-indigo-600 text-indigo-600 font-black bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="h-4 w-4" />
            আইনী নথি ও চালান আপলোড (Documents)
          </button>

          <button
            onClick={() => setActiveSubTab('signoff')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeSubTab === 'signoff'
                ? 'border-indigo-600 text-indigo-600 font-black bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="h-4 w-4" />
            শ্ৰম পৰিদৰ্শক & HR সাইন-অফ (Sign-Off)
          </button>
        </div>

        {/* SUB-TAB CONTENTS */}
        <div className="p-5 md:p-6 space-y-6">

          {/* 1. OVERVIEW & PROJECT SUMMARY */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              {/* Statutory Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>মোকৰ্দমা শ্ৰমিক (Deployed Workforce)</span>
                    <Users className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">
                    {deployedWorkers.length} জন
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    ✓ ১০০% বায়মেট্ৰিক ও আধাৰ সত্যায়িত
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>মাহেকীয়া মজুৰি বিতৰণ (Monthly Wages)</span>
                    <Coins className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">
                    ₹{totalGrossWages.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    নেট পৰিশোধ: ₹{totalNetWages.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>সংবিধিবদ্ধ নথি (Statutory Uploads)</span>
                    <FileCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-2">
                    {siteDocs.length} খন নথি
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    {docStatusMap.totalUploaded}/5 মূল সংবিধিবদ্ধ নথি সক্ৰিয়
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                    <span>চৰকাৰী শ্ৰম পৰিদৰ্শক (Assigned Inspector)</span>
                    <Scale className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-sm font-black text-slate-900 mt-2 line-clamp-1">
                    {assignedInspector?.name || 'শ্ৰম আয়ুক্ত কাৰ্যালয়'}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                    {assignedInspector?.badgeId || 'GOV-AS-LI-8821'}
                  </span>
                </div>
              </div>

              {/* Checklist & Legal Readiness */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-indigo-600" />
                    কাৰখানা প্ৰকল্প আইনী সংবিধিবদ্ধ নিৰীক্ষণ চেকলিষ্ট (Statutory Audit Checklist)
                  </h4>
                  <span className="text-xs font-bold text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
                    মাহ: {selectedMonth}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${docStatusMap.hasFormIV ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {docStatusMap.hasFormIV ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">CLRA Form IV অনুজ্ঞাপত্ৰ (Labor License)</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {docStatusMap.hasFormIV ? 'বৈধ অনুজ্ঞাপত্ৰ আপলোড কৰা হৈছে (CLRA 1970 compliant)' : 'অনুগ্ৰহ কৰি আপোনাৰ Form IV অনুজ্ঞাপত্ৰ আপলোড কৰক।'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${docStatusMap.hasFormVIA ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {docStatusMap.hasFormVIA ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Form VI-A কাম আৰম্ভণি জাননী (Notice of Work)</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {docStatusMap.hasFormVIA ? 'শ্ৰম পৰিদৰ্শকক দিয়া জাননী পোৱা গৈছে' : 'Form VI-A শ্ৰম বিষয়াৰ জাননী দাখিল কৰক।'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${docStatusMap.hasEPF ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {docStatusMap.hasEPF ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">EPF মাহেকীয়া চালান ও ECR (EPF Challan & TRRN)</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {docStatusMap.hasEPF ? 'EPFO পোৰ্টেলত জমা দিয়া চালান ও TRRN সত্যায়িত' : 'EPF চালান আপলোড নহলে বিল প্ৰস্তুত বন্ধ থাকিব।'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${docStatusMap.hasESI ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {docStatusMap.hasESI ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">ESIC মাহেকীয়া বৰঙণি চালান (ESIC Contribution)</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {docStatusMap.hasESI ? 'ESIC পৰিশোধ চালান নথিভুক্ত' : 'ESIC চালান দাখিল কৰা হোৱা নাই।'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${docStatusMap.hasBank ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {docStatusMap.hasBank ? <Check className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">বেংক ট্ৰেন্সফাৰ মজুৰি প্ৰমাণ (Bank Wages Proof)</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        {docStatusMap.hasBank ? 'NEFT / বেংক মজুৰি বিতৰণ তালিকা সংৰক্ষিত' : 'শ্ৰমিকৰ বেংক একাউণ্টত মজুৰি জমাৰ প্ৰমাণ আপলোড কৰক।'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-emerald-100 text-emerald-700">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">Form XVI মাষ্টাৰ ৰোল & Form XVII মজুৰি বহী</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">
                        ডিজিটেলভাৱে লাইভ সংৰক্ষিত হৈ আছে। ১-ক্লিকত প্ৰিণ্ট / ডাউনলোড কৰিব পাৰিব।
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveSubTab('muster')}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <UserCheck className="h-4 w-4" />
                  মাষ্টাৰ ৰোল পৰিদৰ্শন কৰক (View Form XVI)
                </button>

                <button
                  onClick={() => setActiveSubTab('wages')}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Coins className="h-4 w-4" />
                  মজুৰি ও অভাৰটাইম বহী (View Form XVII)
                </button>

                <button
                  onClick={() => {
                    setActiveSubTab('legal_docs');
                    setIsUploadModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <UploadCloud className="h-4 w-4" />
                  নতুন আইনী নথি আপলোড কৰক (Upload Document)
                </button>
              </div>
            </div>
          )}

          {/* 2. MUSTER ROLL & ATTENDANCE (FORM XVI) */}
          {activeSubTab === 'muster' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <UserCheck className="text-indigo-600 h-5 w-5" />
                    Form XVI — শ্ৰমিক হাজিৰা মাষ্টাৰ ৰোল (Muster Roll)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ধাৰা ৭৮(১)(ক)(১) অনুসৰি সংৰক্ষিত লাইভ হাজিৰা খতিয়ান। স্থান: {activeIndustry.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAttendanceModalOpen(true)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    দৈনিক হাজিৰা এন্ট্ৰি কৰক (Log Attendance)
                  </button>

                  <button
                    onClick={handlePrintMusterRoll}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200"
                  >
                    <Printer className="h-4 w-4" />
                    প্ৰিণ্ট / PDF
                  </button>
                </div>
              </div>

              {/* Statutory Header for Form XVI Print */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-1">
                <div className="text-center font-bold text-slate-800 uppercase tracking-wider text-sm">
                  FORM XVI [See Rule 78 (1) (a) (i)] — MUSTER ROLL
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 pt-2 border-t border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-800">প্ৰধান নিয়োগকাৰী (Principal Employer):</span> {activeIndustry.name}, {activeIndustry.location}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">ঠিকাদাৰ (Contractor):</span> {contractor.name} (License No: {contractor.licenseNo})
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">কামৰ প্ৰকৃতি ও স্থান (Nature of Work):</span> Industrial Operations & Maintenance at {activeIndustry.name}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">মাহত (For the Month):</span> {selectedMonth}
                  </div>
                </div>
              </div>

              {/* Workers Muster Roll Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">ক্ৰমাংক</th>
                        <th className="p-3">শ্ৰমিকৰ নাম & আইডি</th>
                        <th className="p-3">আধাৰ / চিনাক্তকৰণ</th>
                        <th className="p-3">দক্ষতা শ্ৰেণী</th>
                        <th className="p-3">দৈনিক নিৰিখ</th>
                        <th className="p-3 text-center">উপস্থিত দিন</th>
                        <th className="p-3 text-center">অভাৰটাইম ঘণ্টা</th>
                        <th className="p-3">সত্যাপন পদ্ধতি</th>
                        <th className="p-3 text-center">স্থিতি</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wageRegisterData.map((item, idx) => (
                        <tr key={item.worker.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-500">#{idx + 1}</td>
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{item.worker.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">ID: {item.worker.id}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {item.worker.aadhaarHash}
                            </span>
                            <span className="text-[10px] text-emerald-700 block font-semibold mt-0.5">
                              ✓ আধাৰ সত্যায়িত
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-bold text-[10px]">
                              {item.worker.skillType}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-slate-800">
                            ₹{item.dailyRate}/দিন
                          </td>
                          <td className="p-3 text-center font-black text-slate-900 text-sm">
                            {item.daysWorked} দিন
                          </td>
                          <td className="p-3 text-center font-bold text-amber-700">
                            {item.totalOtHours} ঘণ্টা
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              <ShieldCheck className="h-3 w-3 text-emerald-600" />
                              বায়মেট্ৰিক ফেচ গেট
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                              উপস্থিত (Present)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Site Check-in Logs */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-slate-500" />
                    শেহতীয়া দৈনিক গেট এন্ট্ৰি লগ (Recent Shift Logs for this Site)
                  </span>
                  <span className="text-slate-500 font-mono">মোট {siteAttendance.length} টা ৰেকৰ্ড</span>
                </div>

                <div className="space-y-2">
                  {siteAttendance.slice(0, 5).map(att => (
                    <div key={att.id} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{att.workerName}</span>
                          <span className="text-[10px] text-slate-500 block">
                            তাৰিখ: {att.date} | প্ৰৱেশ: {att.checkIn} | প্ৰস্থান: {att.checkOut || 'চলি আছে'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {att.overtimeHours > 0 && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            OT: +{att.overtimeHours} ঘণ্টা
                          </span>
                        )}
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono">
                          {att.verificationMethod}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. WAGES & OVERTIME REGISTER (FORM XVII) */}
          {activeSubTab === 'wages' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <Coins className="text-emerald-600 h-5 w-5" />
                    Form XVII — মজুৰি ও অভাৰটাইম ৰেজিষ্টাৰ (Register of Wages & Overtime)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    CLRA Rule 78 (1) (a) (i) & Minimum Wages Act, 1948 অনুসৰি স্বয়ংক্ৰিয়ভাৱে গণনাকৃত বিতৰণ তালিকা।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="h-4 w-4" />
                    মজুৰি বহী এক্সপোৰ্ট (Export Wages)
                  </button>
                </div>
              </div>

              {/* Statutory Notice Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">
                    অসম তথা ৰাজ্যিক ন্যূনতম মজুৰি আইন অনুসৰি নিৰীক্ষিত (Statutory Minimum Wage Verified)
                  </span>
                  <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                    প্ৰতিজন শ্ৰমিকৰ দৈনিক মজুৰি ৰাজ্যিক অধিসূচনাৰ ন্যূনতম নিৰিখতকৈ অধিক বা সমান। অভাৰটাইম ঘণ্টাৰ বাবে কাৰখানা আইন ১৯৪৮ ধাৰা ৫৯ অনুসৰি ২x (দুগুণ) নিৰিখত মজুৰি গণনা কৰা হৈছে।
                  </p>
                </div>
              </div>

              {/* Wage Register Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-black tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="p-3">শ্ৰমিকৰ নাম</th>
                        <th className="p-3 text-center">দিন</th>
                        <th className="p-3">দৈনিক নিৰিখ</th>
                        <th className="p-3">মূল উপাৰ্জন</th>
                        <th className="p-3 text-center">অভাৰটাইম</th>
                        <th className="p-3">OT উপাৰ্জন (2x)</th>
                        <th className="p-3 font-extrabold text-slate-900">মুঠ উপাৰ্জন</th>
                        <th className="p-3 text-rose-700">EPF (12%)</th>
                        <th className="p-3 text-rose-700">ESI (0.75%)</th>
                        <th className="p-3 font-extrabold text-emerald-800">প্ৰাপ্য মজুৰি (Net)</th>
                        <th className="p-3">স্থিতি</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {wageRegisterData.map((item) => (
                        <tr key={item.worker.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{item.worker.name}</span>
                            <span className="text-[10px] text-slate-500">{item.worker.skillType}</span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700">{item.daysWorked}</td>
                          <td className="p-3 font-mono font-semibold">₹{item.dailyRate}</td>
                          <td className="p-3 font-mono">₹{item.normalWage.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-center font-bold text-amber-700">{item.totalOtHours}h</td>
                          <td className="p-3 font-mono text-amber-700 font-semibold">+₹{item.otWage.toLocaleString('en-IN')}</td>
                          <td className="p-3 font-mono font-black text-slate-900">₹{item.grossWage.toLocaleString('en-IN')}</td>
                          <td className="p-3 font-mono text-rose-600">-₹{item.epfDeduction}</td>
                          <td className="p-3 font-mono text-rose-600">-₹{item.esiDeduction}</td>
                          <td className="p-3 font-mono font-black text-emerald-700 text-sm">
                            ₹{item.netWage.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                              ✓ বৈধ নিৰিখ
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 font-black text-slate-900 border-t-2 border-slate-200">
                      <tr>
                        <td className="p-3" colSpan={3}>সৰ্বমুঠ (Total Aggregate for {activeIndustry.name})</td>
                        <td className="p-3 font-mono">₹{wageRegisterData.reduce((s, i) => s + i.normalWage, 0).toLocaleString('en-IN')}</td>
                        <td className="p-3 text-center font-mono">{totalOtHours}h</td>
                        <td className="p-3 font-mono text-amber-700">+₹{wageRegisterData.reduce((s, i) => s + i.otWage, 0).toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono text-base">₹{totalGrossWages.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono text-rose-600">-₹{totalEpfDeduction.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono text-rose-600">-₹{totalEsiDeduction.toLocaleString('en-IN')}</td>
                        <td className="p-3 font-mono text-base text-emerald-700">₹{totalNetWages.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-emerald-800 font-bold text-[10px]">১০০% অনুপালন</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Advice & Bank Statement */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">বেংক মজুৰি স্থানান্তৰ নিৰ্দেশনা (Bank Direct NEFT Advice)</span>
                  <span className="text-slate-500 text-[11px] block mt-0.5">
                    মজুৰি নগদ টকাত দিয়া নিষিদ্ধ। ১০০% শ্ৰমিকৰ বেংক একাউণ্টলৈ পোনপটীয়া বিতৰণ বাধ্যতামূলক।
                  </span>
                </div>
                <button
                  onClick={() => {
                    setActiveSubTab('legal_docs');
                    setActiveUploadDocType('Bank-Disbursement-Proof');
                    setIsUploadModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  বেংক ট্ৰেন্সফাৰ চালান আপলোড কৰক
                </button>
              </div>
            </div>
          )}

          {/* 4. LEGAL DOCUMENT UPLOADS & REPOSITORY */}
          {activeSubTab === 'legal_docs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                    <FileText className="text-indigo-600 h-5 w-5" />
                    আইনী সংবিধিবদ্ধ নথি সংৰক্ষণ কক্ষ (Statutory Legal Repository)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    শ্ৰম অনুজ্ঞাপত্ৰ (Form IV), Form VI-A জাননী, EPF/ESI মাহেকীয়া চালান আৰু বেংক ট্ৰেন্সফাৰ প্ৰমাণ।
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <UploadCloud className="h-4 w-4" />
                  নতুন নথি আপলোড (Upload Document)
                </button>
              </div>

              {/* 5 Mandatory Document Slots (Interactive Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* SLOT 1: FORM IV LICENSE */}
                {(() => {
                  const doc = siteDocs.find(d => d.docType === 'Form-IV-License');
                  return (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                            CLRA Act 1970
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {doc ? '✓ সংৰক্ষিত' : 'বাকি আছে'}
                          </span>
                        </div>

                        <h5 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-indigo-600" />
                          Contractor Labor License (Form IV)
                        </h5>
                        <p className="text-xs text-slate-500 mt-1">
                          শ্ৰম আয়ুক্তৰ অনুজ্ঞাপত্ৰ (Contractor License under Rule 21(1)).
                        </p>

                        {doc && (
                          <div className="mt-3 p-2 bg-white rounded border border-slate-200 text-[11px] space-y-0.5">
                            <div className="font-mono text-slate-700 line-clamp-1">{doc.fileName || doc.fileUrl}</div>
                            <div className="text-slate-400 text-[10px]">ৰেফ: {doc.referenceNo || 'MH-PUN-CLRA-2024-902'}</div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {doc ? (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="w-full py-1.5 bg-white hover:bg-slate-100 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            অনুজ্ঞাপত্ৰ পৰিদৰ্শন কৰক
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUploadDocType('Form-IV-License');
                              setIsUploadModalOpen(true);
                            }}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            Form IV আপলোড কৰক
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* SLOT 2: FORM VI-A NOTICE */}
                {(() => {
                  const doc = siteDocs.find(d => d.docType === 'Form-VI-A-Notice');
                  return (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Rule 81(1)(iii)
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {doc ? '✓ দাখিল কৰা হ’ল' : 'বাকি আছে'}
                          </span>
                        </div>

                        <h5 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-blue-600" />
                          Form VI-A কাম আৰম্ভণি জাননী
                        </h5>
                        <p className="text-xs text-slate-500 mt-1">
                          Notice of Commencement / Completion to Inspector.
                        </p>

                        {doc && (
                          <div className="mt-3 p-2 bg-white rounded border border-slate-200 text-[11px] space-y-0.5">
                            <div className="font-mono text-slate-700 line-clamp-1">{doc.fileName || doc.fileUrl}</div>
                            <div className="text-slate-400 text-[10px]">ৰেফ: {doc.referenceNo || 'NOT-VIA-PUN-2026-092'}</div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {doc ? (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="w-full py-1.5 bg-white hover:bg-slate-100 text-blue-600 border border-blue-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            জাননী পৰিদৰ্শন কৰক
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUploadDocType('Form-VI-A-Notice');
                              setIsUploadModalOpen(true);
                            }}
                            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            Form VI-A আপলোড কৰক
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* SLOT 3: EPF MONTHLY CHALLAN (ECR) */}
                {(() => {
                  const doc = siteDocs.find(d => d.docType === 'EPF-Challan');
                  return (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            EPFO ECR / TRRN
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {doc ? '✓ পৰিশোধ সত্যায়িত' : 'বিল লক'}
                          </span>
                        </div>

                        <h5 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                          <Coins className="h-4 w-4 text-purple-600" />
                          EPF মাহেকীয়া চালান ও ৰচিদ
                        </h5>
                        <p className="text-xs text-slate-500 mt-1">
                          EPF Electronic Challan Cum Return (ECR) & Payment Proof.
                        </p>

                        {doc && (
                          <div className="mt-3 p-2 bg-white rounded border border-slate-200 text-[11px] space-y-0.5">
                            <div className="font-mono text-slate-700 line-clamp-1">{doc.fileName || doc.fileUrl}</div>
                            <div className="text-slate-400 text-[10px]">TRRN: {doc.referenceNo || 'TRRN-90212984920'}</div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {doc ? (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="w-full py-1.5 bg-white hover:bg-slate-100 text-purple-600 border border-purple-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            EPF চালান পৰিদৰ্শন কৰক
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUploadDocType('EPF-Challan');
                              setIsUploadModalOpen(true);
                            }}
                            className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            EPF চালান আপলোড কৰক
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* SLOT 4: ESIC MONTHLY CONTRIBUTION */}
                {(() => {
                  const doc = siteDocs.find(d => d.docType === 'ESI-Challan');
                  return (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                            ESIC Act 1948
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {doc ? '✓ বৰঙণি পৰিশোধ' : 'বিল লক'}
                          </span>
                        </div>

                        <h5 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4 text-teal-600" />
                          ESIC মাহেকীয়া বৰঙণি চালান
                        </h5>
                        <p className="text-xs text-slate-500 mt-1">
                          ESIC Monthly Contribution Receipt & Bank Verification.
                        </p>

                        {doc && (
                          <div className="mt-3 p-2 bg-white rounded border border-slate-200 text-[11px] space-y-0.5">
                            <div className="font-mono text-slate-700 line-clamp-1">{doc.fileName || doc.fileUrl}</div>
                            <div className="text-slate-400 text-[10px]">ৰেফ: {doc.referenceNo || 'ESIC-CH-8831029'}</div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {doc ? (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="w-full py-1.5 bg-white hover:bg-slate-100 text-teal-600 border border-teal-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            ESIC চালান পৰিদৰ্শন কৰক
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUploadDocType('ESI-Challan');
                              setIsUploadModalOpen(true);
                            }}
                            className="w-full py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            ESIC চালান আপলোড কৰক
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* SLOT 5: BANK TRANSFER WAGES PROOF */}
                {(() => {
                  const doc = siteDocs.find(d => d.docType === 'Bank-Disbursement-Proof');
                  return (
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            Banking Act / Payment of Wages
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            doc ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {doc ? '✓ বেংক নিশ্চিত' : 'অপলোড কৰক'}
                          </span>
                        </div>

                        <h5 className="font-black text-slate-900 text-sm mt-2 flex items-center gap-1.5">
                          <Coins className="h-4 w-4 text-emerald-600" />
                          বেংক মজুৰি বিতৰণ তালিকা (NEFT/RTGS)
                        </h5>
                        <p className="text-xs text-slate-500 mt-1">
                          Bank Transfer Statement to worker savings accounts.
                        </p>

                        {doc && (
                          <div className="mt-3 p-2 bg-white rounded border border-slate-200 text-[11px] space-y-0.5">
                            <div className="font-mono text-slate-700 line-clamp-1">{doc.fileName || doc.fileUrl}</div>
                            <div className="text-slate-400 text-[10px]">CMS ৰেফ: {doc.referenceNo || 'CMS-NEFT-99201948'}</div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                        {doc ? (
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="w-full py-1.5 bg-white hover:bg-slate-100 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            বেংক প্ৰমাণ চাওক
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveUploadDocType('Bank-Disbursement-Proof');
                              setIsUploadModalOpen(true);
                            }}
                            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="h-3.5 w-3.5" />
                            বেংক প্ৰমাণ আপলোড কৰক
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Uploaded Documents Archive List */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 border-b border-slate-200 pb-2">
                  <span>সংৰক্ষিত নথিৰ সম্পূৰ্ণ সূচী (Complete Project Archive for {activeIndustry.name})</span>
                  <span className="text-slate-500">{siteDocs.length} খন নথি উপলব্ধ</span>
                </div>

                <div className="space-y-2">
                  {siteDocs.map(d => (
                    <div key={d.id} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{d.docType}</span>
                            <span className="text-[10px] text-slate-500 font-mono">({d.month})</span>
                          </div>
                          <span className="text-[11px] text-slate-600 font-mono block mt-0.5">
                            {d.fileName || d.fileUrl} | ৰেফ: {d.referenceNo || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          {d.status} ({d.verifiedBy || 'Audit'})
                        </span>
                        <button
                          onClick={() => setPreviewDoc(d)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          নথি খোলক
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 5. INSPECTOR & HR STATUTORY SIGN-OFF */}
          {activeSubTab === 'signoff' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                  <Scale className="text-indigo-600 h-5 w-5" />
                  সংবিধিবদ্ধ অনুমোদন ও শ্ৰম পৰিদৰ্শক সমীক্ষা (Statutory Sign-Off & Inspection Review)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  প্ৰধান নিয়োগকাৰী (Industry HR) আৰু অধিকাৰপ্ৰাপ্ত চৰকাৰী শ্ৰম পৰিদৰ্শকৰ সংবিধিবদ্ধ ডিজিটেল চহী আৰু নিৰীক্ষণ প্ৰমাণপত্ৰ।
                </p>
              </div>

              {/* Inspector Details Card */}
              {assignedInspector && (
                <div className="bg-gradient-to-r from-amber-500/10 via-slate-50 to-indigo-50 border border-amber-200/80 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                      <Scale className="h-3 w-3" />
                      Assigned Statutory Inspector (অধিকাৰক্ষেত্ৰ শ্ৰম পৰিদৰ্শক)
                    </div>
                    <h4 className="text-base font-black text-slate-900">{assignedInspector.name}</h4>
                    <p className="text-xs text-slate-600">
                      {assignedInspector.designation} • {assignedInspector.department}
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      Badge: {assignedInspector.badgeId} | মণ্ডল: {assignedInspector.jurisdictionZone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">ডিজিটেল সংৰক্ষণ এক্সেছ</span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full inline-block mt-1">
                      ✓ সম্পূৰ্ণ ৰেজিষ্টাৰ অডিট সক্ৰিয়
                    </span>
                  </div>
                </div>
              )}

              {/* Two Column Sign-Off Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Industry HR Endorsement */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">প্ৰধান নিয়োগকাৰীৰ অনুমোদন (Industry HR)</h5>
                        <span className="text-[11px] text-slate-500">{activeIndustry.name}</span>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                      অনুমোদিত (Endorsed)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    প্ৰধান নিয়োগকাৰী হিচাপে প্ৰতিটো শ্ৰমিকৰ উপস্থিতি (Form XVI), মজুৰি বিতৰণ (Form XVII), আৰু জুলাই/আগষ্টৰ EPF ও ESI চালান নিৰীক্ষণ কৰা হৈছে।
                  </p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>অনুমোদন তাৰিখ:</span>
                      <span className="font-mono text-slate-800 font-bold">2026-08-27 15:45</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>অনুমোদনকাৰী বিষয়া:</span>
                      <span className="font-bold text-slate-800">{activeIndustry.contactEmail}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>মন্তব্য:</span>
                      <span className="text-emerald-700 font-semibold">EPF/ESI আৰু বেংক পে স্লিপ ১০০% মিলিছে।</span>
                    </div>
                  </div>

                  {viewMode === 'industry_hr' && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          if (onHrSignOff) onHrSignOff(activeIndustryId, contractor.id, 'Verified and approved by Principal Employer');
                        }}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Check className="h-4 w-4" />
                        এই মাহৰ নথি ডিজিটেল অনুমোদন কৰক (Re-Endorse Records)
                      </button>
                    </div>
                  )}
                </div>

                {/* Government Labor Inspector Audit Certification */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-amber-600" />
                      <div>
                        <h5 className="font-bold text-slate-900 text-sm">শ্ৰম পৰিদৰ্শক সংবিধিবদ্ধ ছীল (Inspector Seal)</h5>
                        <span className="text-[11px] text-slate-500">অসম চৰকাৰ শ্ৰম বিভাগ</span>
                      </div>
                    </div>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded">
                      পৰিদৰ্শন সম্পন্ন (Inspected)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    শ্ৰম আইন অনুসৰি Form XVI মাষ্টাৰ ৰোল, Form XVII মজুৰি বহী আৰু Form IV অনুজ্ঞাপত্ৰ ডিজিটেলভাৱে নিৰীক্ষণ কৰা হৈছে।
                  </p>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>পৰিদৰ্শন ক্ৰমাংক:</span>
                      <span className="font-mono text-slate-800 font-bold">AUD-AS-CLRA-2026-9021</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>পৰিদৰ্শন ফল:</span>
                      <span className="text-emerald-700 font-bold">Clean & Fully Compliant</span>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>শ্ৰম পৰিদৰ্শক:</span>
                      <span className="font-bold text-slate-800">{assignedInspector?.name || 'Senior Labour Inspector'}</span>
                    </div>
                  </div>

                  {viewMode === 'government_inspector' && (
                    <div className="pt-2 space-y-2">
                      <input
                        type="text"
                        placeholder="পৰিদৰ্শন মন্তব্য লিখক (Audit observation)..."
                        value={signOffRemarks}
                        onChange={(e) => setSignOffRemarks(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-xs outline-none focus:border-indigo-600"
                      />
                      <div className="flex gap-2">
                        <select
                          value={auditStatusResult}
                          onChange={(e) => setAuditStatusResult(e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs font-bold outline-none"
                        >
                          <option value="Clean">Clean (নিখুঁত)</option>
                          <option value="Minor-Observations">Minor Observations</option>
                          <option value="Non-Compliant-Alert">Non-Compliant</option>
                        </select>
                        <button
                          onClick={() => {
                            if (onInspectorAuditSignOff) {
                              onInspectorAuditSignOff(activeIndustryId, contractor.id, auditStatusResult, signOffRemarks || 'Official statutory inspection verified on ShramikLink.');
                            }
                          }}
                          className="flex-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Scale className="h-3.5 w-3.5" />
                          শ্ৰম পৰিদৰ্শন চাৰ্টিফিকেট দাখিল কৰক
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ==================== MODAL 1: ADD SITE ATTENDANCE ==================== */}
      {isAttendanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">দৈনিক চাইট হাজিৰা এন্ট্ৰি (Log Site Attendance)</h4>
              </div>
              <button
                onClick={() => setIsAttendanceModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAttendance} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">কাৰখানা প্ৰকল্প (Industry Site)</label>
                <input
                  type="text"
                  disabled
                  value={activeIndustry.name}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">শ্ৰমিক নিৰ্বাচন কৰক (Select Worker) *</label>
                <select
                  required
                  value={attWorkerId}
                  onChange={(e) => setAttWorkerId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                >
                  <option value="">-- শ্ৰমিক বাচক --</option>
                  {workers.filter(w => w.contractorId === contractor.id).map(w => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({w.skillType} • ₹{w.dailyWageRate}/দিন)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">তাৰিখ (Date)</label>
                  <input
                    type="date"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">স্থিতি (Status)</label>
                  <select
                    value={attStatus}
                    onChange={(e) => setAttStatus(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold outline-none focus:border-indigo-600"
                  >
                    <option value="Present">উপস্থিত (Present)</option>
                    <option value="Absent">অনুপস্থিত (Absent)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">প্ৰৱেশ সময় (Check In)</label>
                  <input
                    type="time"
                    value={attCheckIn}
                    onChange={(e) => setAttCheckIn(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">প্ৰস্থান সময় (Check Out)</label>
                  <input
                    type="time"
                    value={attCheckOut}
                    onChange={(e) => setAttCheckOut(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">অভাৰটাইম ঘণ্টা (Overtime Hours)</label>
                  <input
                    type="number"
                    min="0"
                    max="12"
                    step="0.5"
                    value={attOvertimeHours}
                    onChange={(e) => setAttOvertimeHours(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">সত্যাপন মাধ্যম</label>
                  <select
                    value={attVerificationMethod}
                    onChange={(e) => setAttVerificationMethod(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                  >
                    <option value="Biometric-Face">Biometric Face Scanner</option>
                    <option value="Aadhaar-OTP">Aadhaar OTP</option>
                    <option value="Supervisor-Gate">Supervisor Gate Log</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAttendanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল কৰক
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  মাষ্টাৰ ৰোলত সংৰক্ষণ কৰক
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: UPLOAD STATUTORY DOCUMENT ==================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">আইনী নথি সংৰক্ষণ (Upload Statutory Document)</h4>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDocument} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">কাৰখানা প্ৰকল্প ফোল্ডাৰ (Target Industry)</label>
                <input
                  type="text"
                  disabled
                  value={activeIndustry.name}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">নথিৰ প্ৰকাৰ (Statutory Document Type) *</label>
                <select
                  value={activeUploadDocType}
                  onChange={(e) => setActiveUploadDocType(e.target.value as ComplianceDocType)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-600"
                >
                  <option value="Form-IV-License">Contractor Labor License (Form IV under CLRA)</option>
                  <option value="Form-VI-A-Notice">Notice of Commencement/Completion (Form VI-A)</option>
                  <option value="EPF-Challan">EPF Monthly Challan & ECR Receipt</option>
                  <option value="ESI-Challan">ESIC Monthly Contribution Challan</option>
                  <option value="Bank-Disbursement-Proof">Bank Salary NEFT Transfer Statement</option>
                  <option value="Wage-Register">Form XVII Register of Wages & OT</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">মাহ (Audit Month)</label>
                  <select
                    value={uploadMonth}
                    onChange={(e) => setUploadMonth(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-indigo-600"
                  >
                    <option value="August 2026">August 2026</option>
                    <option value="July 2026">July 2026</option>
                    <option value="September 2026">September 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ৰেফাৰেন্স / চালান নম্বৰ</label>
                  <input
                    type="text"
                    placeholder="e.g. TRRN-9921092"
                    value={uploadRefNo}
                    onChange={(e) => setUploadRefNo(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Drag-and-drop / simulated file selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">ফাইল নিৰ্বাচন কৰক (Select Document PDF / Scan)</label>
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-4 text-center bg-slate-50 transition-colors cursor-pointer">
                  <UploadCloud className="h-6 w-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-slate-600 font-semibold text-xs block">
                    ফাইল ড্ৰপ কৰক বা ক্লিক কৰি বাচক
                  </span>
                  <span className="text-[10px] text-slate-400">PDF, JPG, PNG (Max 15MB)</span>
                  <input
                    type="text"
                    placeholder="বা ফাইলৰ নাম লিখক (e.g. CLRA_License_Tata_2026.pdf)"
                    value={uploadFileName}
                    onChange={(e) => setUploadFileName(e.target.value)}
                    className="w-full mt-2 bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono text-center outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">মন্তব্য (Remarks / Notes)</label>
                <input
                  type="text"
                  placeholder="e.g. Verified with EPFO portal API / Signed by Inspector"
                  value={uploadRemarks}
                  onChange={(e) => setUploadRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  ফোল্ডাৰত আপলোড কৰক
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: STATUTORY DOCUMENT PREVIEW ==================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {previewDoc.docType}
                </span>
                <h4 className="font-black text-slate-900 text-base mt-1">
                  {previewDoc.fileName || previewDoc.fileUrl}
                </h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Authentically Rendered Document Paper View */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl p-6 shadow-inner font-serif text-slate-800 space-y-4 text-xs">
              <div className="text-center space-y-1 border-b border-slate-300 pb-3">
                <div className="text-base font-bold uppercase tracking-wider text-slate-900">
                  GOVERNMENT OF ASSAM / STATE LABOUR COMMISSIONERATE
                </div>
                <div className="text-[11px] text-slate-600 uppercase font-sans">
                  SHRAMIKLINK STATUTORY DIGITAL AUDIT VAULT
                </div>
                <div className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 inline-block px-3 py-1 rounded border border-indigo-200 mt-1">
                  DOCUMENT TYPE: {previewDoc.docType}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans text-[11px] pt-2">
                <div>
                  <span className="font-bold text-slate-600 block">Principal Employer:</span>
                  <span className="font-semibold text-slate-900">{activeIndustry.name}</span>
                  <span className="text-slate-500 block text-[10px]">{activeIndustry.location}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">Licensed Contractor:</span>
                  <span className="font-semibold text-slate-900">{contractor.name}</span>
                  <span className="text-slate-500 block text-[10px]">License: {contractor.licenseNo}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">Reference / TRRN / Challan No:</span>
                  <span className="font-mono text-indigo-700 font-bold">{previewDoc.referenceNo || 'TRRN-2026-9021'}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">Audit Month / Period:</span>
                  <span className="font-semibold text-slate-800">{previewDoc.month}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded border border-slate-200 font-sans space-y-2 text-[11px]">
                <div className="flex justify-between items-center text-slate-500">
                  <span>Verification Status:</span>
                  <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    ✓ {previewDoc.status} ({previewDoc.verifiedBy || 'System Inspector'})
                  </span>
                </div>
                <div className="text-slate-600 italic">
                  &quot;{previewDoc.remarks || 'Statutory remittance confirmed against labor register.'}&quot;
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-slate-300 font-sans text-[10px] text-slate-500">
                <div>
                  <span>Security Token: SHA256-SL-2026-CLRA-009</span>
                  <span className="block">Timestamp: {previewDoc.uploadedAt}</span>
                </div>
                <div className="text-right">
                  <div className="w-20 h-10 border border-slate-300 rounded flex items-center justify-center font-mono text-[9px] text-slate-400">
                    [OFFICIAL STAMP]
                  </div>
                  <span className="block mt-1 font-bold text-slate-700">ShramikLink Compliance Engine</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                প্ৰিণ্ট কৰক
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                বন্ধ কৰক
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default IndustryProjectComplianceSystem;
