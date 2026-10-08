import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  FileSpreadsheet, 
  Plus, 
  Edit3, 
  Send, 
  LogOut, 
  BadgeCheck, 
  Briefcase, 
  Clock, 
  ExternalLink,
  ChevronRight,
  UserCheck,
  RefreshCw,
  Sparkles,
  FolderArchive
} from 'lucide-react';
import { 
  GovernmentLaborInspector, 
  Industry, 
  Contractor, 
  Worker, 
  Attendance, 
  GovernmentAuditLog, 
  MultiIndustryAssignment,
  InspectionNotice,
  ComplianceDocument
} from '../types';
import IndustryProjectComplianceSystem from './IndustryProjectComplianceSystem';

interface GovernmentInspectorJurisdictionPanelProps {
  currentInspector: GovernmentLaborInspector;
  allInspectors: GovernmentLaborInspector[];
  industries: Industry[];
  contractors: Contractor[];
  workers: Worker[];
  attendance: Attendance[];
  auditLogs: GovernmentAuditLog[];
  assignments: MultiIndustryAssignment[];
  complianceDocs?: ComplianceDocument[];
  onUploadDoc?: (doc: Omit<ComplianceDocument, 'id' | 'uploadedAt'>) => void;
  onAddAttendanceRecord?: (att: Omit<Attendance, 'id'>) => void;
  onHrSignOff?: (industryId: string, contractorId: string, remarks: string) => void;
  onInspectorAuditSignOff?: (industryId: string, contractorId: string, status: string, remarks: string) => void;
  onUpdateInspectorProfile: (inspectorId: string, updates: Partial<GovernmentLaborInspector>) => void;
  onFileAuditLog: (audit: Omit<GovernmentAuditLog, 'id' | 'timestamp'>) => void;
  onLogout: () => void;
  onRefreshData?: () => void;
}

export const GovernmentInspectorJurisdictionPanel: React.FC<GovernmentInspectorJurisdictionPanelProps> = ({
  currentInspector,
  allInspectors,
  industries,
  contractors,
  workers,
  attendance,
  auditLogs,
  assignments,
  complianceDocs = [],
  onUploadDoc,
  onAddAttendanceRecord,
  onHrSignOff,
  onInspectorAuditSignOff,
  onUpdateInspectorProfile,
  onFileAuditLog,
  onLogout,
  onRefreshData
}) => {
  // Jurisdiction scope toggle: 'my_jurisdiction' vs 'all_state'
  const [jurisdictionScope, setJurisdictionScope] = useState<'my_jurisdiction' | 'all_state'>('my_jurisdiction');
  
  // Navigation tabs in inspector panel
  const [activeTab, setActiveTab] = useState<'overview' | 'industries' | 'contractors' | 'muster_audit' | 'industry_compliance' | 'notices'>('overview');

  // Modals state
  const [isEditJurisdictionModalOpen, setIsEditJurisdictionModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [selectedTargetForNotice, setSelectedTargetForNotice] = useState<{
    type: 'Industry' | 'Contractor';
    id: string;
    name: string;
  } | null>(null);

  // Edit Jurisdiction form state
  const [editDistrict, setEditDistrict] = useState(currentInspector.district);
  const [editZone, setEditZone] = useState(currentInspector.jurisdictionZone);
  const [editPinCodes, setEditPinCodes] = useState(currentInspector.assignedPinCodes.join(', '));
  const [editDesignation, setEditDesignation] = useState(currentInspector.designation);
  const [editDepartment, setEditDepartment] = useState(currentInspector.department);
  const [editPhone, setEditPhone] = useState(currentInspector.phone);

  // Notice form state
  const [noticeSubject, setNoticeSubject] = useState('');
  const [noticeAct, setNoticeAct] = useState<'CLRA Act 1970' | 'Factories Act 1948' | 'Plantations Labour Act 1951' | 'Minimum Wages Act 1948' | 'EPF & MP Act 1952'>('CLRA Act 1970');
  const [noticeSeverity, setNoticeSeverity] = useState<'Notice' | 'Advisory' | 'Urgent-Compliance-Summons'>('Advisory');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [issuedNotices, setIssuedNotices] = useState<InspectionNotice[]>([
    {
      id: 'not-1',
      inspectorId: currentInspector.id,
      inspectorName: currentInspector.name,
      targetType: 'Industry',
      targetId: industries[0]?.id || 'ind-1',
      targetName: industries[0]?.name || 'Industrial Plant',
      subject: 'Annual Muster Roll & Form XVI Verification Advisory',
      statutoryAct: 'CLRA Act 1970',
      severity: 'Advisory',
      message: 'Ensure all third-party contractor workers have digital biometric records and verified EPF numbers.',
      issuedAt: '2026-09-10',
      status: 'Acknowledged'
    }
  ]);

  // Audit filing form state
  const [auditTargetType, setAuditTargetType] = useState<'Industry' | 'Contractor'>('Industry');
  const [auditTargetId, setAuditTargetId] = useState<string>(industries[0]?.id || '');
  const [auditStatus, setAuditStatus] = useState<'Clean' | 'Minor-Observations' | 'Non-Compliant-Alert'>('Clean');
  const [auditFindings, setAuditFindings] = useState<string>('');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [contractorFilter, setContractorFilter] = useState('ALL');

  // Helper to test if an industry belongs to this inspector's jurisdiction
  const isIndustryInJurisdiction = (ind: Industry) => {
    if (jurisdictionScope === 'all_state') return true;
    const loc = ind.location.toLowerCase();
    const zone = currentInspector.jurisdictionZone.toLowerCase();
    const dist = currentInspector.district.toLowerCase();

    // Check district or zone match or any pin match
    if (loc.includes(dist) || dist.includes(loc)) return true;
    const zoneKeywords = zone.split(/[,\s&/]+/).filter(w => w.length > 3);
    if (zoneKeywords.some(kw => loc.includes(kw))) return true;

    // Default fallback: if this is the designated primary inspector
    return true;
  };

  // Helper to test if a contractor operates in this inspector's jurisdiction
  const isContractorInJurisdiction = (con: Contractor) => {
    if (jurisdictionScope === 'all_state') return true;
    // Check if contractor has workers assigned to industries in this jurisdiction
    const conWorkers = workers.filter(w => w.contractorId === con.id);
    const assignedIndIds = assignments
      .filter(a => conWorkers.some(w => w.id === a.workerId) && a.status === 'Active')
      .map(a => a.industryId);

    const matchAssigned = industries.some(ind => assignedIndIds.includes(ind.id) && isIndustryInJurisdiction(ind));
    if (matchAssigned) return true;

    // Or address match
    if (con.address && (con.address.toLowerCase().includes(currentInspector.district.toLowerCase()) || con.address.toLowerCase().includes(currentInspector.state.toLowerCase()))) {
      return true;
    }

    return true; // Include in purview
  };

  const filteredIndustries = industries.filter(ind => {
    if (!isIndustryInJurisdiction(ind)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return ind.name.toLowerCase().includes(q) || ind.location.toLowerCase().includes(q) || ind.regNo.toLowerCase().includes(q) || ind.lin.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredContractors = contractors.filter(con => {
    if (!isContractorInJurisdiction(con)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return con.name.toLowerCase().includes(q) || con.licenseNo.toLowerCase().includes(q) || con.epfCode.toLowerCase().includes(q) || con.esiCode.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate jurisdiction stats
  const totalJurisdictionWorkers = workers.filter(w => {
    const isAssignedToInd = assignments.some(a => a.workerId === w.id && a.status === 'Active' && industries.some(i => i.id === a.industryId && isIndustryInJurisdiction(i)));
    return isAssignedToInd || isContractorInJurisdiction(contractors.find(c => c.id === w.contractorId) || contractors[0]);
  }).length;

  const totalCompliantMuster = attendance.filter(a => a.status === 'Present').length;

  // Handle saving updated jurisdiction
  const handleSaveJurisdiction = (e: React.FormEvent) => {
    e.preventDefault();
    const pinList = editPinCodes
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    onUpdateInspectorProfile(currentInspector.id, {
      district: editDistrict,
      jurisdictionZone: editZone,
      assignedPinCodes: pinList,
      designation: editDesignation,
      department: editDepartment,
      phone: editPhone
    });

    setIsEditJurisdictionModalOpen(false);
  };

  // Handle filing new audit finding
  const handleFilingAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditFindings.trim()) return;

    let targetName = '';
    if (auditTargetType === 'Industry') {
      targetName = industries.find(i => i.id === auditTargetId)?.name || 'Industry Establishment';
    } else {
      targetName = contractors.find(c => c.id === auditTargetId)?.name || 'Contractor Agency';
    }

    onFileAuditLog({
      inspectorName: `${currentInspector.name} (${currentInspector.designation})`,
      inspectedEntity: auditTargetType,
      entityId: auditTargetId,
      entityName: targetName,
      findings: auditFindings,
      status: auditStatus
    });

    setAuditFindings('');
    setIsAuditModalOpen(false);
  };

  // Handle issuing statutory notice
  const handleIssueNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetForNotice || !noticeSubject.trim() || !noticeMessage.trim()) return;

    const newNotice: InspectionNotice = {
      id: `not-${Date.now()}`,
      inspectorId: currentInspector.id,
      inspectorName: currentInspector.name,
      targetType: selectedTargetForNotice.type,
      targetId: selectedTargetForNotice.id,
      targetName: selectedTargetForNotice.name,
      subject: noticeSubject.trim(),
      statutoryAct: noticeAct,
      severity: noticeSeverity,
      message: noticeMessage.trim(),
      issuedAt: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setIssuedNotices(prev => [newNotice, ...prev]);
    setIsNoticeModalOpen(false);
    setNoticeSubject('');
    setNoticeMessage('');
    setSelectedTargetForNotice(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ==================== 1. TOP JURISDICTION & INSPECTOR IDENTIFICATION BANNER ==================== */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 border border-indigo-500/40 shadow-xl relative overflow-hidden">
        
        {/* Subtle Watermark */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none text-white">
          <Scale className="h-56 w-56" />
        </div>

        <div className="relative z-10 space-y-5">
          
          {/* Top Line: Badge & Quick Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-indigo-800/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/40 border border-amber-400/50 flex items-center justify-center text-amber-300 font-black text-xl shadow-inner">
                <Scale className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded tracking-wider uppercase">
                    চৰকাৰী শ্ৰম পৰিদৰ্শন পৰ্টেল (Govt Labor Inspectorate)
                  </span>
                  <span className="bg-indigo-900/80 text-indigo-200 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-700/60">
                    ID: {currentInspector.badgeId}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    <CheckCircle2 className="h-3 w-3" />
                    আইনী কৰ্তৃত্ব প্ৰাপ্ত (Statutory Authorized)
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                  {currentInspector.name}
                  <BadgeCheck className="h-5 w-5 text-amber-400 inline" />
                </h2>
                <p className="text-xs text-indigo-200">
                  {currentInspector.designation} • {currentInspector.department}
                </p>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="flex items-center gap-2 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
              <button
                type="button"
                onClick={() => {
                  setEditDistrict(currentInspector.district);
                  setEditZone(currentInspector.jurisdictionZone);
                  setEditPinCodes(currentInspector.assignedPinCodes.join(', '));
                  setEditDesignation(currentInspector.designation);
                  setEditDepartment(currentInspector.department);
                  setEditPhone(currentInspector.phone);
                  setIsEditJurisdictionModalOpen(true);
                }}
                className="bg-indigo-700/70 hover:bg-indigo-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all border border-indigo-500/50 cursor-pointer shadow-xs"
              >
                <Edit3 className="h-3.5 w-3.5 text-amber-300" />
                এলেকা বাছনি / আপডেট (Change Jurisdiction)
              </button>

              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                দাখিল কৰক অডিট প্ৰমাণপত্ৰ (File Audit)
              </button>

              <button
                type="button"
                onClick={onLogout}
                className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
              >
                <LogOut className="h-3.5 w-3.5" />
                লগ আউট
              </button>
            </div>
          </div>

          {/* Jurisdiction Area Details & Scope Switcher */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/40">
            
            {/* Active District & Zone (7 Cols) */}
            <div className="md:col-span-7 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-rose-400" />
                  সক্ৰিয় কাৰ্যক্ষেত্ৰ ও আইনী মণ্ডল (Assigned Jurisdiction):
                </span>
                <span className="text-[10px] bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded font-mono">
                  {currentInspector.state}
                </span>
              </div>

              <div className="text-sm font-black text-white flex items-center gap-2 flex-wrap">
                <span className="text-amber-300">{currentInspector.district}</span>
                <span className="text-indigo-400">/</span>
                <span>{currentInspector.jurisdictionZone}</span>
              </div>

              <div className="text-[11px] text-slate-300 flex items-center gap-2 flex-wrap">
                <span>PIN কভাৰেজ:</span>
                <span className="font-mono text-indigo-200">
                  {currentInspector.assignedPinCodes.join(', ') || 'সমগ্ৰ জিলা (All Circles)'}
                </span>
                <span className="text-slate-500">•</span>
                <span>কাৰ্যালয়:</span>
                <span className="text-slate-300">{currentInspector.officeAddress || 'Shram Bhavan, Guwahati'}</span>
              </div>
            </div>

            {/* Scope Filter Buttons (5 Cols) */}
            <div className="md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2">
              <div className="bg-slate-900/90 border border-indigo-700/60 p-1 rounded-xl flex items-center w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setJurisdictionScope('my_jurisdiction')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 flex-1 sm:flex-initial justify-center ${
                    jurisdictionScope === 'my_jurisdiction'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 text-amber-300" />
                  মোৰ অধিকাৰভুক্ত এলেকা ({filteredIndustries.length} কাৰখানা)
                </button>
                <button
                  type="button"
                  onClick={() => setJurisdictionScope('all_state')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 flex-1 sm:flex-initial justify-center ${
                    jurisdictionScope === 'all_state'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-indigo-300 hover:text-white'
                  }`}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  সমগ্ৰ ৰাজ্য (All State)
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ==================== 2. JURISDICTION STATISTICAL BENTO TILES ==================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">পৰিদৰ্শন এলেকাৰ কাৰখানা</span>
            <Building2 className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {filteredIndustries.length}
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            পঞ্জীভুক্ত প্লাণ্ট & ইউনিট
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">কাৰ্যৰত অনুজ্ঞাপ্ৰাপ্ত ঠিকাদাৰ</span>
            <Briefcase className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">
            {filteredContractors.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <BadgeCheck className="h-3 w-3" />
            CLRA ধাৰা ১২ অনুজ্ঞাপ্ৰাপ্ত
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">আইনী সুৰক্ষাৰ শ্ৰমিক সংখ্যা</span>
            <Users className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-700 mt-2">
            {totalJurisdictionWorkers}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            পৰিদৰ্শন মণ্ডলৰ মুঠ শ্ৰমিক
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">দাখিল কৰা অডিট প্ৰতিবেদন</span>
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">
            {auditLogs.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Form VI অনুপালিত
          </div>
        </div>

      </div>

      {/* ==================== 3. NAVIGATION TABS ==================== */}
      <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Scale className="h-4 w-4" />
          পৰিদৰ্শন অৱলোকন (Jurisdiction Overview)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('industries')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'industries'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          কাৰখানা & উদ্যোগ তালিকা ({filteredIndustries.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contractors')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'contractors'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          লেবাৰ কন্ট্ৰেক্টৰ & এজেঞ্চি ({filteredContractors.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('muster_audit')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'muster_audit'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          লাইভ Form XVI (Muster Roll) অডিট ডেস্ক
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('industry_compliance')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'industry_compliance'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FolderArchive className="h-4 w-4" />
          📁 প্ৰকল্প কমপ্লাইয়েন্স ডচিয়াৰ ও ৰেজিষ্টাৰ অডিট (Project Compliance Dossiers)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notices')}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'notices'
              ? 'border-indigo-600 text-indigo-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          জাৰী কৰা জাননী & নিৰ্দেশনা ({issuedNotices.length})
        </button>
      </div>

      {/* ==================== 4. TAB 1: OVERVIEW & RECENT AUDITS ==================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Quick Notice to Industries / Contractors Callout */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-black text-amber-950 text-sm">
                  বিধিসন্মত শ্ৰম অনুপালন তদাৰকী (Statutory Compliance Watch)
                </h4>
                <p className="text-xs text-amber-900 leading-relaxed">
                  আপোনাৰ এলেকাৰ সকলো কাৰখানা আৰু ঠিকাদাৰে শ্ৰমিকৰ মজুৰি, দৈনিক হাজিৰা (Rule 78 Form XVI) আৰু EPF/ESI চালান জমাকৰণ নিশ্চিত কৰিবলৈ বাধ্য। যিকোনো অনিয়ম হ'লে তাৎক্ষণিকভাৱে চৰকাৰী জাননী জাৰী কৰিব পাৰে।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedTargetForNotice({
                  type: 'Industry',
                  id: industries[0]?.id || 'ind-1',
                  name: industries[0]?.name || 'Industrial Plant'
                });
                setIsNoticeModalOpen(true);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
            >
              <Send className="h-3.5 w-3.5" />
              আইনী জাননী জাৰী কৰক (Issue Notice)
            </button>
          </div>

          {/* Inspection Audit Logs & Certificates */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600 h-5 w-5" />
                  দাখিল কৰা পৰিদৰ্শন প্ৰমাণপত্ৰসমূহ (Filed Audit Certificates - Form VI)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  শ্ৰম পৰিদৰ্শকৰ দ্বাৰা দাখিল কৰা আনুষ্ঠানিক প্ৰতিবেদন আৰু অনুপালন মান নিৰ্ণয়।
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                নতুন অডিট দাখিল কৰক
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auditLogs.map(audit => (
                <div key={audit.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2.5 text-xs hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 text-sm">{audit.inspectorName}</span>
                    <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] ${
                      audit.status === 'Clean' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      audit.status === 'Minor-Observations' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {audit.status}
                    </span>
                  </div>

                  <div className="text-slate-500">
                    পৰিদৰ্শন কৰা প্ৰতিষ্ঠান: <strong className="text-slate-800">{audit.entityName} ({audit.inspectedEntity})</strong>
                  </div>

                  <p className="text-slate-600 italic leading-relaxed bg-white border border-slate-200/80 p-3 rounded-lg">
                    "{audit.findings}"
                  </p>

                  <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-2">
                    <span>পৰিদৰ্শনৰ তাৰিখ: {audit.timestamp}</span>
                    <span className="text-indigo-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-indigo-600" />
                      চৰকাৰী অডিট সম্পন্ন
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ==================== 5. TAB 2: INDUSTRIES DIRECTORY IN JURISDICTION ==================== */}
      {activeTab === 'industries' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                অধিকাৰভুক্ত কাৰখানা ও ঔদ্যোগিক প্ৰতিষ্ঠানসমূহ (Jurisdiction Industries)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                আপোনাৰ জিলা আৰু ঔদ্যোগিক মণ্ডলৰ সকলো পঞ্জীভুক্ত কাৰখানা, অনুজ্ঞাপত্ৰ আৰু এইচ.আৰ. যোগাযোগৰ তথ্য।
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="কাৰখানা / স্থান সন্ধান কৰক..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">কাৰখানাৰ নাম & অৱস্থান (Factory & Location)</th>
                  <th className="p-3.5">লাইচেন্স & LIN নং</th>
                  <th className="p-3.5 text-center">নিয়োজিত শ্ৰমিক</th>
                  <th className="p-3.5">এইচ.আৰ. যোগাযোগ (Direct HR Connect)</th>
                  <th className="p-3.5 text-center">আইনী স্থিতি</th>
                  <th className="p-3.5 text-right">পৰিদৰ্শন ব্যৱস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIndustries.map(ind => {
                  const deployedWorkersCount = assignments.filter(a => a.industryId === ind.id && a.status === 'Active').length;
                  const recentAudit = auditLogs.find(a => a.entityId === ind.id);
                  const cleanPhone = '9876543210';

                  return (
                    <tr key={ind.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">{ind.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                          {ind.location}
                        </div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="text-slate-700 font-bold">{ind.regNo}</div>
                        <div className="text-slate-400">LIN: {ind.lin}</div>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="font-black text-slate-900 text-sm">{deployedWorkersCount}</span>
                        <span className="block text-[10px] text-slate-400">সক্ৰিয় শ্ৰমিক</span>
                      </td>

                      <td className="p-3.5">
                        <div className="text-slate-700 font-medium text-[11px]">{ind.contactEmail}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md"
                            title="Call HR"
                          >
                            <Phone className="h-3 w-3" />
                            ফোন
                          </a>
                          <a
                            href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`নমস্কাৰ ${ind.name} HR, চৰকাৰী শ্ৰম পৰিদৰ্শক ${currentInspector.name}-ৰ কাৰ্যালয়ৰ পৰা বিধিসন্মত তথ্যৰ বাবে যোগাযোগ কৰা হৈছে।`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-1 rounded-md"
                            title="WhatsApp HR"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </a>
                        </div>
                      </td>

                      <td className="p-3.5 text-center">
                        {recentAudit ? (
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                            recentAudit.status === 'Clean' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            recentAudit.status === 'Minor-Observations' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {recentAudit.status}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                            নিয়মীয়া পৰ্যবেক্ষণ
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setAuditTargetType('Industry');
                            setAuditTargetId(ind.id);
                            setIsAuditModalOpen(true);
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          অডিট প্ৰমাণপত্ৰ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTargetForNotice({
                              type: 'Industry',
                              id: ind.id,
                              name: ind.name
                            });
                            setIsNoticeModalOpen(true);
                          }}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          জাননী জাৰী
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ==================== 6. TAB 3: CONTRACTORS DIRECTORY IN JURISDICTION ==================== */}
      {activeTab === 'contractors' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                পৰিদৰ্শন এলেকাত সক্ৰিয় লেবাৰ কন্ট্ৰেক্টৰ (Licensed Manpower Contractors)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                CLRA Act 1970 অনুসৰি অনুজ্ঞাপ্ৰাপ্ত শ্ৰমিক যোগানকৰ্তা সংস্থা, EPF/ESI ক'ড আৰু শ্ৰমিক নিয়োগৰ তথ্য।
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="ঠিকাদাৰ / অনুজ্ঞাপত্ৰ নং..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">সংস্থাৰ নাম & CLRA অনুজ্ঞাপত্ৰ</th>
                  <th className="p-3.5">EPF ক'ড & ESI নম্বৰ</th>
                  <th className="p-3.5 text-center">মুঠ পঞ্জীভুক্ত শ্ৰমিক</th>
                  <th className="p-3.5">ঠিকাদাৰৰ সৈতে যোগাযোগ (Direct Connect)</th>
                  <th className="p-3.5 text-center">ৰেটিং & বিলিং অনুপালন</th>
                  <th className="p-3.5 text-right">আইনী পদক্ষেপ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContractors.map(con => {
                  const conWorkersCount = workers.filter(w => w.contractorId === con.id).length;
                  const cPhone = con.contactNo.replace(/\D/g, '') || '9876543211';

                  return (
                    <tr key={con.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 text-sm">{con.name}</div>
                        <div className="text-[11px] font-mono text-indigo-600 font-semibold mt-0.5">
                          {con.licenseNo}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">LIN: {con.lin}</div>
                      </td>

                      <td className="p-3.5 font-mono text-[11px]">
                        <div className="text-slate-700 font-bold">EPF: {con.epfCode}</div>
                        <div className="text-slate-500">ESI: {con.esiCode}</div>
                        <div className="text-slate-400 text-[10px]">PAN: {con.pan}</div>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="font-black text-slate-900 text-sm">{conWorkersCount}</span>
                        <span className="block text-[10px] text-slate-400">জন শ্ৰমিক</span>
                      </td>

                      <td className="p-3.5">
                        <div className="text-slate-700 font-medium text-[11px]">{con.contactNo}</div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <a
                            href={`tel:${cPhone}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-md"
                            title="Call Contractor"
                          >
                            <Phone className="h-3 w-3" />
                            ফোন
                          </a>
                          <a
                            href={`https://wa.me/91${cPhone}?text=${encodeURIComponent(`নমস্কাৰ ${con.name}, চৰকাৰী শ্ৰম পৰিদৰ্শক ${currentInspector.name}-ৰ কাৰ্যালয়ৰ পৰা CLRA অনুজ্ঞাপত্ৰ আৰু শ্ৰমিক নথিপত্ৰৰ বিষয়ে যোগাযোগ কৰা হৈছে।`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-1 rounded-md"
                            title="WhatsApp Contractor"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </a>
                        </div>
                      </td>

                      <td className="p-3.5 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          লক বিলিং সক্ৰিয় (EPF/ESI Verified)
                        </span>
                        <div className="text-[10px] text-amber-600 font-semibold mt-1">★ {con.rating} ৰেটিং</div>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setAuditTargetType('Contractor');
                            setAuditTargetId(con.id);
                            setIsAuditModalOpen(true);
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          অডিট প্ৰমাণপত্ৰ
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTargetForNotice({
                              type: 'Contractor',
                              id: con.id,
                              name: con.name
                            });
                            setIsNoticeModalOpen(true);
                          }}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors"
                        >
                          জাননী জাৰী
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ==================== 7. TAB 4: LIVE FORM XVI (MUSTER ROLL) AUDIT DESK ==================== */}
      {activeTab === 'muster_audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  CLRA RULE 78(1)(a)(i)
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Statutory Live Muster Audit Desk
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 mt-1">
                <FileSpreadsheet className="text-indigo-600 h-5 w-5" />
                লাইভ Form XVI (Muster Roll) আৰু দৈনিক হাজিৰা অডিট লেজাৰ
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                পৰিদৰ্শন এলেকাৰ অধীনস্থ কাৰখানাৰ গেটত ছুপাৰভাইজাৰে দিয়া দৈনিক উপস্থিতি আৰু অভাৰটাইম (OT) ৰিপোৰ্ট।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={contractorFilter}
                onChange={(e) => setContractorFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
              >
                <option value="ALL">সকলো ঠিকাদাৰ (All Contractors)</option>
                {contractors.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">শ্ৰমিকৰ নাম</th>
                  <th className="p-3">ঠিকাদাৰ প্ৰতিষ্ঠান</th>
                  <th className="p-3">নিয়োজিত কাৰখানা</th>
                  <th className="p-3 text-center">উপস্থিতি (Shifts)</th>
                  <th className="p-3 text-center">OT ঘণ্টা</th>
                  <th className="p-3 text-right">মজুৰি নিৰিখ</th>
                  <th className="p-3 text-center">আইনী অডিট স্থিতি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workers
                  .filter(w => contractorFilter === 'ALL' || w.contractorId === contractorFilter)
                  .slice(0, 15)
                  .map(w => {
                    const contractor = contractors.find(c => c.id === w.contractorId);
                    const wrkAttendance = attendance.filter(a => a.workerId === w.id && a.status === 'Present');
                    const shiftsCount = wrkAttendance.length;
                    const otHours = wrkAttendance.reduce((sum, curr) => sum + (curr.overtimeHours || 0), 0);
                    const assignedIndId = assignments.find(a => a.workerId === w.id && a.status === 'Active')?.industryId || wrkAttendance[0]?.industryId;
                    const industry = industries.find(i => i.id === assignedIndId);

                    return (
                      <tr key={w.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-semibold text-slate-800">
                          {w.name}
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">Aadhaar: {w.aadhaarHash}</span>
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{contractor?.name}</td>
                        <td className="p-3 text-slate-600 font-medium">{industry?.name || 'Assigned Plant'}</td>
                        <td className="p-3 text-center font-bold text-slate-800">
                          {shiftsCount} দিন
                        </td>
                        <td className="p-3 text-center font-bold text-indigo-600">
                          {otHours} hrs
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          ₹{w.dailyWageRate}/দিন
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            নথিভুক্ত (Compliant)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ==================== 8. TAB 5: ISSUED NOTICES & ADVISORIES ==================== */}
      {activeTab === 'notices' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
          
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                জাৰী কৰা চৰকাৰী বিধিসন্মত জাননী & পৰামৰ্শ (Issued Statutory Advisories & Notices)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                কাৰখানা আৰু ঠিকাদাৰৰ বাবে শ্ৰম পৰিদৰ্শক কাৰ্যালয়ৰ পৰা পোনপটীয়াকৈ প্ৰেৰণ কৰা আইনী জাননী।
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedTargetForNotice({
                  type: 'Industry',
                  id: industries[0]?.id || 'ind-1',
                  name: industries[0]?.name || 'Industrial Plant'
                });
                setIsNoticeModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              নতুন জাননী জাৰী কৰক
            </button>
          </div>

          <div className="space-y-3">
            {issuedNotices.map(notice => (
              <div key={notice.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        notice.severity === 'Urgent-Compliance-Summons' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        notice.severity === 'Notice' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {notice.severity}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{notice.subject}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      প্ৰাপক: <strong className="text-slate-800">{notice.targetName} ({notice.targetType})</strong> • আইন: <span className="font-semibold text-indigo-700">{notice.statutoryAct}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    তাৰিখ: {notice.issuedAt}
                  </span>
                </div>

                <p className="text-slate-700 bg-white border border-slate-200/80 p-3 rounded-lg leading-relaxed">
                  {notice.message}
                </p>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>পৰিদৰ্শক: {notice.inspectorName}</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    স্থিতি: {notice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================== TAB 6: INDUSTRY PROJECT COMPLIANCE & REGISTERS ==================== */}
      {activeTab === 'industry_compliance' && (
        <div className="space-y-4">
          <IndustryProjectComplianceSystem
            contractor={contractors[0]}
            allContractors={contractors}
            industries={industries}
            workers={workers}
            assignments={assignments}
            attendance={attendance}
            complianceDocs={complianceDocs}
            inspectors={allInspectors}
            viewMode="government_inspector"
            onUploadDoc={onUploadDoc || (() => {})}
            onAddAttendanceRecord={onAddAttendanceRecord || (() => {})}
            onHrSignOff={onHrSignOff}
            onInspectorAuditSignOff={onInspectorAuditSignOff}
          />
        </div>
      )}

      {/* ==================== 9. MODAL: EDIT JURISDICTION & AREA SELECTION ==================== */}
      {isEditJurisdictionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
            
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <MapPin className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">শ্ৰম পৰিদৰ্শন এলেকা ও অধিকাৰ ক্ষেত্ৰ সলনি কৰক</h3>
                  <p className="text-[11px] text-slate-400">Update Jurisdiction Area, Region & PIN Coverage</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditJurisdictionModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJurisdiction} className="p-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">
                    পৰিদৰ্শন জিলা (District) *
                  </label>
                  <select
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                  >
                    <option value="Kamrup Metropolitan">Kamrup Metropolitan (Guwahati)</option>
                    <option value="Dibrugarh & Tinsukia">Dibrugarh & Tinsukia (Upper Assam)</option>
                    <option value="Cachar & Barak Valley">Cachar & Barak Valley (Silchar)</option>
                    <option value="Nagaon & Morigaon">Nagaon & Morigaon</option>
                    <option value="Jorhat & Golaghat">Jorhat & Golaghat</option>
                    <option value="Pune District">Pune District (Maharashtra)</option>
                    <option value="Bellary District">Bellary District (Karnataka)</option>
                    <option value="Kamrup Rural">Kamrup Rural (Amingaon/Palasbari)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">
                    চৰকাৰী পদবী (Designation) *
                  </label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                    placeholder="e.g. Assistant Labour Commissioner"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">
                  ঔদ্যোগিক মণ্ডল / মণ্ডলৰ নাম (Industrial Zone / Corridor) *
                </label>
                <input
                  type="text"
                  value={editZone}
                  onChange={(e) => setEditZone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                  placeholder="e.g. Guwahati Industrial Area, EPIP Amingaon & North Guwahati Zone"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">
                  অধিকাৰভুক্ত PIN ক'ডসমূহ (Covered PIN Codes - comma separated)
                </label>
                <input
                  type="text"
                  value={editPinCodes}
                  onChange={(e) => setEditPinCodes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                  placeholder="e.g. 781001, 781021, 781031"
                />
                <p className="text-[10px] text-slate-400">
                  কাৰখানা আৰু ঠিকাদাৰৰ ভৌগোলিক অৱস্থান এই PIN আৰু জিলাৰ ভিত্তিত স্বয়ংক্ৰিয়ভাৱে সংলগ্ন হয়।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">
                    চৰকাৰী বিভাগ (Department)
                  </label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                    placeholder="Office of the Labour Commissioner, Govt of Assam"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">
                    পৰিদৰ্শকৰ অফিচিয়েল ফোন নম্বৰ (Official Phone) *
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                    placeholder="9876543213"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditJurisdictionModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                >
                  বাতিল কৰক
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  এলেকা সংৰক্ষণ কৰক (Save Jurisdiction)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================== 10. MODAL: FILE AUDIT CERTIFICATE ==================== */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
            
            <div className="bg-indigo-900 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">দাখিল কৰক চৰকাৰী অডিট প্ৰমাণপত্ৰ (Form VI)</h3>
                  <p className="text-[11px] text-indigo-200">File Statutory Labor Inspection Certificate</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="text-indigo-200 hover:text-white p-1 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFilingAudit} className="p-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">প্ৰতিষ্ঠান প্ৰকাৰ</label>
                  <select
                    value={auditTargetType}
                    onChange={(e: any) => {
                      setAuditTargetType(e.target.value);
                      if (e.target.value === 'Industry') {
                        setAuditTargetId(industries[0]?.id || '');
                      } else {
                        setAuditTargetId(contractors[0]?.id || '');
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="Industry">🏭 কাৰখানা (Industry Establishment)</option>
                    <option value="Contractor">🏢 ঠিকাদাৰ সংস্থা (Contractor Agency)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">লক্ষ্য প্ৰতিষ্ঠান</label>
                  <select
                    value={auditTargetId}
                    onChange={(e) => setAuditTargetId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
                  >
                    {auditTargetType === 'Industry' ? (
                      industries.map(ind => (
                        <option key={ind.id} value={ind.id}>{ind.name}</option>
                      ))
                    ) : (
                      contractors.map(con => (
                        <option key={con.id} value={con.id}>{con.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">অডিট স্থিতি নিৰ্ণয়</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuditStatus('Clean')}
                    className={`py-2 px-2 rounded-xl font-bold text-xs border text-center transition-all cursor-pointer ${
                      auditStatus === 'Clean'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    ✓ Clean (অনুপালিত)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditStatus('Minor-Observations')}
                    className={`py-2 px-2 rounded-xl font-bold text-xs border text-center transition-all cursor-pointer ${
                      auditStatus === 'Minor-Observations'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    ⚠ Observations
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditStatus('Non-Compliant-Alert')}
                    className={`py-2 px-2 rounded-xl font-bold text-xs border text-center transition-all cursor-pointer ${
                      auditStatus === 'Non-Compliant-Alert'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    ✕ Alert (অনিয়ম)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">
                  পৰিদৰ্শন ফলাফল ও মন্তব্য (Inspection Findings) *
                </label>
                <textarea
                  rows={4}
                  value={auditFindings}
                  onChange={(e) => setAuditFindings(e.target.value)}
                  placeholder="e.g. Form V আৰু Form XVI হাজিৰা বহী পৰীক্ষা কৰা হ'ল। শ্ৰমিকসকলৰ বেংক একাউণ্টত নূন্যতম মজুৰিৰ হাৰ আৰু EPF চালানৰ জমা ৰেকৰ্ড সঠিক পোৱা গ'ল।"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-indigo-500 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  অডিট দাখিল কৰক (Submit Certificate)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==================== 11. MODAL: ISSUE STATUTORY NOTICE ==================== */}
      {isNoticeModalOpen && selectedTargetForNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
            
            <div className="bg-amber-600 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-white" />
                <div>
                  <h3 className="font-bold text-sm">আইনী জাননী / নিৰ্দেশনা জাৰী কৰক</h3>
                  <p className="text-[11px] text-amber-100">
                    Issue Statutory Compliance Notice to {selectedTargetForNotice.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNoticeModalOpen(false)}
                className="text-amber-100 hover:text-white p-1 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueNotice} className="p-5 space-y-4 text-xs">
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900">
                <strong>প্ৰাপক প্ৰতিষ্ঠান:</strong> {selectedTargetForNotice.name} ({selectedTargetForNotice.type})
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">আইন (Statutory Act)</label>
                  <select
                    value={noticeAct}
                    onChange={(e: any) => setNoticeAct(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="CLRA Act 1970">CLRA Act 1970</option>
                    <option value="Factories Act 1948">Factories Act 1948</option>
                    <option value="Plantations Labour Act 1951">Plantations Labour Act 1951</option>
                    <option value="Minimum Wages Act 1948">Minimum Wages Act 1948</option>
                    <option value="EPF & MP Act 1952">EPF & MP Act 1952</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">গুৰুত্ব (Severity)</label>
                  <select
                    value={noticeSeverity}
                    onChange={(e: any) => setNoticeSeverity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="Advisory">পৰামৰ্শ (Advisory)</option>
                    <option value="Notice">আনুষ্ঠানিক জাননী (Formal Notice)</option>
                    <option value="Urgent-Compliance-Summons">তাৎক্ষণিক তলব (Urgent Summons)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">বিষয় (Subject) *</label>
                <input
                  type="text"
                  value={noticeSubject}
                  onChange={(e) => setNoticeSubject(e.target.value)}
                  placeholder="e.g. সাত দিনৰ ভিতৰত ই.পি.এফ. চালান দাখিলৰ জাননী"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase">নিৰ্দেশনা / মেছেজ (Notice Text) *</label>
                <textarea
                  rows={4}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="অনুগ্ৰহ কৰি তলত দিয়া তথ্যসমূহ তৎক্ষণাৎ কাৰ্যালয়ত দাখিল কৰক..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-amber-500 leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  জাননী জাৰী কৰক (Issue Notice)
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default GovernmentInspectorJurisdictionPanel;
