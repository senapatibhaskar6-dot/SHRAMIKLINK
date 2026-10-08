import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Trash2, 
  Plus, 
  Search, 
  Filter, 
  Award, 
  X, 
  Check, 
  Briefcase, 
  ShieldCheck, 
  AlertCircle,
  MessageSquare,
  Pencil,
  Lock
} from 'lucide-react';
import { Worker, Supervisor, Contractor } from '../types';

interface ContractorWorkforceManagerProps {
  contractor: Contractor;
  workers: Worker[];
  supervisors: Supervisor[];
  onAddWorker: (worker: Omit<Worker, 'id' | 'onboardingDate'>) => void;
  onUpdateWorker: (workerId: string, updates: Partial<Worker>) => void;
  onDeleteWorker?: (workerId: string) => void;
  onAddSupervisor: (supervisor: Omit<Supervisor, 'id' | 'createdAt'>) => void;
  onUpdateSupervisor?: (supervisorId: string, updates: Partial<Supervisor>) => void;
  onDeleteSupervisor?: (supervisorId: string) => void;
}

export default function ContractorWorkforceManager({
  contractor,
  workers,
  supervisors,
  onAddWorker,
  onUpdateWorker,
  onDeleteWorker,
  onAddSupervisor,
  onUpdateSupervisor,
  onDeleteSupervisor,
}: ContractorWorkforceManagerProps) {
  // Active sub-tab: 'workers' or 'supervisors'
  const [activeSubTab, setActiveSubTab] = useState<'workers' | 'supervisors'>('workers');
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState(false);
  const [isAddSupervisorOpen, setIsAddSupervisorOpen] = useState(false);

  // New Worker Form State
  const [newWorker, setNewWorker] = useState({
    name: '',
    phone: '',
    aadhaarDigits: '', // last 4 digits
    skillType: 'Unskilled' as Worker['skillType'],
    workerType: 'Unskilled-Laborer' as NonNullable<Worker['workerType']>,
    sectionOrTrade: 'General Loading & Packing',
    dailyWageRate: 480,
    status: 'Available' as Worker['status'],
    assignedSupervisorId: '',
  });

  // New Supervisor Form State
  const [newSupervisor, setNewSupervisor] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'Field Operations & Muster Roll',
    active: true,
  });

  // Edit Supervisor State
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [isEditSupervisorOpen, setIsEditSupervisorOpen] = useState(false);
  const [editSupervisorForm, setEditSupervisorForm] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    active: true,
  });

  // Filtered workers mapped to this specific contractor
  const contractorWorkers = useMemo(() => {
    return workers.filter(w => w.contractorId === contractor.id);
  }, [workers, contractor.id]);

  // Filtered supervisors mapped to this contractor
  const contractorSupervisors = useMemo(() => {
    return supervisors.filter(s => 
      s.supervisorType === 'contractor' && (s.contractorId === contractor.id || !s.contractorId)
    );
  }, [supervisors, contractor.id]);

  // Worker breakdown counts for capacity gauging
  const counts = useMemo(() => {
    const total = contractorWorkers.length;
    const available = contractorWorkers.filter(w => w.status === 'Available').length;
    const deployed = contractorWorkers.filter(w => w.status === 'Deployed').length;
    return { total, available, deployed };
  }, [contractorWorkers]);

  // Search filtered workers
  const displayedWorkers = useMemo(() => {
    return contractorWorkers.filter(w => {
      const matchesSearch = 
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.phone.includes(searchQuery) ||
        (w.sectionOrTrade && w.sectionOrTrade.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesSkill = skillFilter === 'ALL' || w.skillType === skillFilter;
      const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
      return matchesSearch && matchesSkill && matchesStatus;
    });
  }, [contractorWorkers, searchQuery, skillFilter, statusFilter]);

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name.trim() || !newWorker.phone.trim()) {
      return;
    }

    const cleanAadhaar = newWorker.aadhaarDigits.slice(-4).padStart(4, '0');
    onAddWorker({
      name: newWorker.name.trim(),
      phone: newWorker.phone.trim(),
      aadhaarHash: `XXXX-XXXX-${cleanAadhaar}`,
      contractorId: contractor.id,
      skillType: newWorker.skillType,
      workerType: newWorker.workerType,
      sectionOrTrade: newWorker.sectionOrTrade.trim() || 'General Labour',
      dailyWageRate: Number(newWorker.dailyWageRate) || 480,
      status: newWorker.status,
      onboardingVerified: true,
      assignedSupervisorId: newWorker.assignedSupervisorId || undefined,
    });

    setIsAddWorkerOpen(false);
    setNewWorker({
      name: '',
      phone: '',
      aadhaarDigits: '',
      skillType: 'Unskilled',
      workerType: 'Unskilled-Laborer',
      sectionOrTrade: 'General Loading & Packing',
      dailyWageRate: 480,
      status: 'Available',
      assignedSupervisorId: '',
    });
  };

  const handleCreateSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupervisor.name.trim() || !newSupervisor.phone.trim()) {
      return;
    }

    onAddSupervisor({
      name: newSupervisor.name.trim(),
      phone: newSupervisor.phone.trim(),
      email: newSupervisor.email.trim() || `${newSupervisor.name.toLowerCase().replace(/\s+/g, '.')}@agency.in`,
      department: newSupervisor.department.trim(),
      active: true,
      supervisorType: 'contractor',
      contractorId: contractor.id,
      contractorName: contractor.name,
      industryId: 'ind-1',
    });

    setIsAddSupervisorOpen(false);
    setNewSupervisor({
      name: '',
      phone: '',
      email: '',
      department: 'Field Operations & Muster Roll',
      active: true,
    });
  };

  const handleOpenEditSupervisor = (sup: Supervisor) => {
    setEditingSupervisor(sup);
    setEditSupervisorForm({
      name: sup.name,
      phone: sup.phone,
      email: sup.email,
      department: sup.department || 'Field Operations & Muster Roll',
      active: sup.active,
    });
    setIsEditSupervisorOpen(true);
  };

  const handleSaveEditSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupervisor || !editSupervisorForm.name.trim() || !editSupervisorForm.phone.trim()) {
      return;
    }

    onUpdateSupervisor?.(editingSupervisor.id, {
      name: editSupervisorForm.name.trim(),
      phone: editSupervisorForm.phone.trim(),
      email: editSupervisorForm.email.trim(),
      department: editSupervisorForm.department.trim(),
      active: editSupervisorForm.active,
    });

    setIsEditSupervisorOpen(false);
    setEditingSupervisor(null);
  };

  return (
    <div id="contractor-workforce-manager" className="space-y-6">
      
      {/* 1. Manpower Capacity Summary Header (Bento Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Manpower Capacity</span>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{counts.total} <span className="text-xs font-normal text-slate-500">workers</span></div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Mapped under {contractor.name}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available for Supply</span>
            <Check className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{counts.available} <span className="text-xs font-normal text-slate-500">idle/ready</span></div>
          <span className="text-[10px] text-slate-500 mt-1 block">{counts.deployed} deployed on factory floors</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Labour Classification</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{counts.total} <span className="text-xs font-normal text-slate-500">শ্ৰমিক</span></div>
          <span className="text-[11px] text-emerald-700 font-bold mt-1 block">100% সাধাৰণ ও অদক্ষ শ্ৰমিক (Unskilled Labour)</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Agency Field Supervisors</span>
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-700">{contractorSupervisors.length} <span className="text-xs font-normal text-slate-500">leads</span></div>
          <span className="text-[10px] text-slate-500 mt-1 block">Managing gate entries & muster</span>
        </div>
      </div>

      {/* 2. Top Action Bar: Sub-Tabs & Add Buttons */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSubTab('workers')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'workers'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            শ্ৰমিক বাহিনী তালিকা (Workers Pool - {contractorWorkers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('supervisors')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'supervisors'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            ফিল্ড ছুপাৰভাইজাৰ (Field Supervisors - {contractorSupervisors.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'workers' ? (
            <button
              type="button"
              onClick={() => setIsAddWorkerOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              নতুন শ্ৰমিক পঞ্জীয়ন কৰক (Add New Worker)
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddSupervisorOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              নতুন ছুপাৰভাইজাৰ যোগ কৰক (Add Supervisor)
            </button>
          )}
        </div>
      </div>

      {/* 3. WORKERS TAB CONTENT */}
      {activeSubTab === 'workers' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by worker name, trade, or phone..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-500">শ্ৰেণী:</span>
                <span className="bg-slate-100 text-slate-800 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold">
                  কেৱল অদক্ষ শ্ৰমিক (Unskilled Only)
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold outline-none"
                >
                  <option value="ALL">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Deployed">Deployed</option>
                  <option value="On-Leave">On-Leave</option>
                </select>
              </div>
            </div>
          </div>

          {/* Workers Tabular View (Clean, Clutter-Free) */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">শ্ৰমিকৰ নাম & পৰিচয় (Worker Name)</th>
                    <th className="py-3 px-4">যোগাযোগ (Phone)</th>
                    <th className="py-3 px-4">শ্ৰেণী & ট্ৰেড (Skill / Trade)</th>
                    <th className="py-3 px-4">দৈনিক নিৰিখ (Wage Rate)</th>
                    <th className="py-3 px-4">স্থিতি (Status)</th>
                    <th className="py-3 px-4 text-right">ব্যৱস্থা (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedWorkers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        কোনো শ্ৰমিক পোৱা নগ'ল। নতুন শ্ৰমিক যোগ কৰিবলৈ ওপৰৰ বুটামটো টিপক।
                      </td>
                    </tr>
                  ) : (
                    displayedWorkers.map((worker) => (
                      <tr key={worker.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{worker.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                            <span>Aadhaar: {worker.aadhaarHash}</span>
                            <span className="text-emerald-600 bg-emerald-50 px-1 rounded">✓ Verified</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <a 
                            href={`tel:${worker.phone}`}
                            className="inline-flex items-center gap-1 text-slate-700 hover:text-indigo-600 font-mono font-medium"
                          >
                            <Phone className="h-3 w-3 text-slate-400" />
                            +91 {worker.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
                            অদক্ষ শ্ৰমিক (Unskilled)
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-0.5 font-medium">
                            {worker.sectionOrTrade || 'General Floor'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          ₹{worker.dailyWageRate} <span className="text-[10px] text-slate-400 font-normal">/day</span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={worker.status}
                            onChange={(e) => onUpdateWorker(worker.id, { status: e.target.value as Worker['status'] })}
                            className={`text-[11px] font-bold rounded-lg px-2 py-1 outline-none border cursor-pointer ${
                              worker.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : worker.status === 'Deployed'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            <option value="Available">🟢 Available (উপলব্ধ)</option>
                            <option value="Deployed">🔵 Deployed (কৰ্মৰত)</option>
                            <option value="On-Leave">⚪ On-Leave (ছুটীত)</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`${worker.name} ক আপোনাৰ শ্ৰমিক তালিকাৰ পৰা আঁতৰাব বিচাৰে নেকি?`)) {
                                onDeleteWorker?.(worker.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors inline-flex cursor-pointer"
                            title="Delete Worker"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUPERVISORS TAB CONTENT */}
      {activeSubTab === 'supervisors' && (
        <div className="space-y-4">
          {/* Autonomous Agency Boundary Notice */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-950">
            <Lock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-900">স্বতন্ত্ৰ এজেন্সি ছুপাৰভাইজাৰ ব্যৱস্থাপনা (Contractor Agency Internal Control):</strong>{' '}
              আপোনাৰ লেবাৰ এজেন্সিৰ অধীনস্থ ছুপাৰভাইজাৰসকলক কেৱল আপুনিহে নিযুক্তি, সম্পাদনা বা আঁতৰাব পাৰে। কাৰখানা কৰ্তৃপক্ষই আপোনাৰ এই আভ্যন্তৰীণ কৰ্মীক সলনি কৰিব নোৱাৰে।
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">ছুপাৰভাইজাৰৰ নাম (Supervisor)</th>
                    <th className="py-3 px-4">পোনপটীয়া যোগাযোগ (Direct Connect)</th>
                    <th className="py-3 px-4">বিভাগ / মেইল (Dept & Email)</th>
                    <th className="py-3 px-4">তত্বাৱধানৰ শ্ৰমিক (Assigned Workers)</th>
                    <th className="py-3 px-4">দায়িত্বৰ স্থিতি (Duty Status)</th>
                    <th className="py-3 px-4 text-right">ব্যৱস্থা (Actions)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contractorSupervisors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        আপোনাৰ কোনো ছুপাৰভাইজাৰ পঞ্জীভুক্ত হোৱা নাই। "+ নতুন ছুপাৰভাইজাৰ পঞ্জীয়ন" বুটামত ক্লিক কৰক।
                      </td>
                    </tr>
                  ) : (
                    contractorSupervisors.map((sup) => {
                      const assignedCount = contractorWorkers.filter(w => w.assignedSupervisorId === sup.id).length;
                      return (
                        <tr key={sup.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{sup.name}</div>
                            <div className="text-[10px] text-indigo-600 font-semibold mt-0.5">
                              Agency Muster Lead
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <a 
                                href={`tel:${sup.phone}`}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded text-[11px] font-mono font-medium transition-colors"
                                title="Call Supervisor"
                              >
                                <Phone className="h-3 w-3 text-emerald-600" />
                                {sup.phone}
                              </a>
                              <a 
                                href={`https://wa.me/91${sup.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `নমস্কাৰ ${sup.name} ডাঙৰীয়া, ICWL (IndustrialContractorWorkerLink) এজেন্সিৰ তৰফৰ পৰা শ্ৰমিক দলৰ হাজিৰা আৰু কাৰখানাৰ কাম সন্দৰ্ভত যোগাযোগ কৰা হৈছে।`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition-colors"
                                title="WhatsApp Supervisor"
                              >
                                <MessageSquare className="h-3 w-3" />
                                WhatsApp
                              </a>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-800">{sup.department}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{sup.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                              <Users className="h-3 w-3 text-slate-500" />
                              {assignedCount} জন শ্ৰমিক
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => onUpdateSupervisor?.(sup.id, { active: !sup.active })}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                sup.active
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {sup.active ? 'সক্ৰিয় (Active)' : 'ছুটীত (Leave)'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSupervisor(sup)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors inline-flex cursor-pointer"
                                title="Edit Supervisor"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`${sup.name} ক ছুপাৰভাইজাৰ তালিকাৰ পৰা আঁতৰাব বিচাৰে নেকি?`)) {
                                    onDeleteSupervisor?.(sup.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors inline-flex cursor-pointer"
                                title="Delete Supervisor"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW WORKER */}
      {isAddWorkerOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">নতুন শ্ৰমিক পঞ্জীয়ন প্ৰপত্ৰ</h3>
                  <p className="text-[11px] text-slate-500">Add worker under {contractor.name} manpower pool</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddWorkerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorker} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">শ্ৰমিকৰ সম্পূৰ্ণ নাম (Worker Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. বিক্ৰম কলিতা (Bikram Kalita)"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বৰ (Phone) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9864012345"
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">আধাৰ শেষৰ ৪টা সংখ্যা (Aadhaar Last 4)</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="8492"
                    value={newWorker.aadhaarDigits}
                    onChange={(e) => setNewWorker({ ...newWorker, aadhaarDigits: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শ্ৰমিকৰ শ্ৰেণী (Labour Category)</label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800">
                    অদক্ষ শ্ৰমিক (Unskilled Labour)
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">দৈনিক মজুৰি (Daily Wage Rate ₹)</label>
                  <input
                    type="number"
                    min={350}
                    value={newWorker.dailyWageRate}
                    onChange={(e) => setNewWorker({ ...newWorker, dailyWageRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">বিভাগ / ট্ৰেড (Trade / Department)</label>
                <input
                  type="text"
                  placeholder="e.g. Loading, Assembly Line, Boiler, Packaging"
                  value={newWorker.sectionOrTrade}
                  onChange={(e) => setNewWorker({ ...newWorker, sectionOrTrade: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex items-start gap-2 text-[11px] text-amber-800">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  পঞ্জীয়ন কৰা লগে লগে এই শ্ৰমিকজন আপোনাৰ পুলত অন্তৰ্ভুক্ত হ'ব আৰু ইণ্ডাষ্ট্ৰী HR-এ আপোনাৰ সৰ্বমুঠ শ্ৰমিক ক্ষমতা নিৰ্ধাৰণ কৰিব পাৰিব।
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddWorkerOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-all cursor-pointer"
                >
                  শ্ৰমিক অন্তৰ্ভুক্ত কৰক (Save Worker)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW SUPERVISOR */}
      {isAddSupervisorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">নতুন ছুপাৰভাইজাৰ পঞ্জীয়ন প্ৰপত্ৰ</h3>
                  <p className="text-[11px] text-slate-500">Register Field Supervisor for {contractor.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddSupervisorOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSupervisor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ছুপাৰভাইজাৰৰ নাম (Supervisor Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ৰমেশ ডেকা (Ramesh Deka)"
                  value={newSupervisor.name}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বৰ (Phone) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9435112233"
                    value={newSupervisor.phone}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">কাৰ্যালয়ৰ মেইল (Email ID)</label>
                  <input
                    type="email"
                    placeholder="supervisor@agency.in"
                    value={newSupervisor.email}
                    onChange={(e) => setNewSupervisor({ ...newSupervisor, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">দায়িত্ব / বিভাগ (Assigned Department)</label>
                <input
                  type="text"
                  placeholder="e.g. Gate Attendance & Muster Roll Verification"
                  value={newSupervisor.department}
                  onChange={(e) => setNewSupervisor({ ...newSupervisor, department: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSupervisorOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-all cursor-pointer"
                >
                  ছুপাৰভাইজাৰ সংৰক্ষণ কৰক (Save Supervisor)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUPERVISOR */}
      {isEditSupervisorOpen && editingSupervisor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">ছুপাৰভাইজাৰ তথ্য সম্পাদনা (Edit Supervisor)</h3>
                  <p className="text-[11px] text-slate-500">Update Field Supervisor details for {contractor.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsEditSupervisorOpen(false);
                  setEditingSupervisor(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSupervisor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ছুপাৰভাইজাৰৰ নাম (Supervisor Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ৰমেশ ডেকা"
                  value={editSupervisorForm.name}
                  onChange={(e) => setEditSupervisorForm({ ...editSupervisorForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বৰ (Phone) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={editSupervisorForm.phone}
                    onChange={(e) => setEditSupervisorForm({ ...editSupervisorForm, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">কাৰ্যালয়ৰ মেইল (Email ID)</label>
                  <input
                    type="email"
                    value={editSupervisorForm.email}
                    onChange={(e) => setEditSupervisorForm({ ...editSupervisorForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">দায়িত্ব / বিভাগ (Assigned Dept)</label>
                  <input
                    type="text"
                    value={editSupervisorForm.department}
                    onChange={(e) => setEditSupervisorForm({ ...editSupervisorForm, department: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">দায়িত্বৰ স্থিতি (Status)</label>
                  <select
                    value={editSupervisorForm.active ? 'true' : 'false'}
                    onChange={(e) => setEditSupervisorForm({ ...editSupervisorForm, active: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-bold text-slate-700"
                  >
                    <option value="true">সক্ৰিয় (Active On-Duty)</option>
                    <option value="false">ছুটীত (On-Leave / Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditSupervisorOpen(false);
                    setEditingSupervisor(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all cursor-pointer"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-all cursor-pointer"
                >
                  আপডেট সংৰক্ষণ কৰক (Save Changes)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
