import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  UserCheck, 
  Building2, 
  FileSpreadsheet, 
  Printer, 
  Zap, 
  AlertCircle,
  Briefcase,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
  LogOut,
  UserPlus,
  Lock,
  Calendar,
  Smartphone
} from 'lucide-react';
import { Worker, Contractor, Industry, Attendance, Supervisor, ContractorAttendanceRecord } from '../types';
import { ContractorMonthlyAttendanceModal } from './ContractorMonthlyAttendanceModal';
import { DirectWorkerEntryModal } from './DirectWorkerEntryModal';

export interface SupervisorAttendancePanelProps {
  currentSupervisor?: Supervisor;
  supervisors: Supervisor[];
  onAddSupervisor: (sup: Omit<Supervisor, 'id' | 'createdAt'>) => void;
  workers: Worker[];
  onAddWorker?: (worker: Worker) => void;
  contractors: Contractor[];
  industries: Industry[];
  attendance: Attendance[];
  onMarkAttendance: (records: {
    workerId: string;
    industryId: string;
    hoursWorked: number;
    overtimeHours: number;
    date: string;
    supervisorName: string;
    status: 'Present' | 'Absent';
  }[]) => void;
  contractorAttendance?: ContractorAttendanceRecord[];
  onSaveContractorAttendance?: (records: ContractorAttendanceRecord[]) => void;
  onNavigateToFormXVI?: () => void;
  onLogout?: () => void;
  showNotice: (msg: string, type: 'info' | 'success' | 'error') => void;
  initialDeskMode?: 'industry' | 'contractor';
}

export const SupervisorAttendancePanel: React.FC<SupervisorAttendancePanelProps> = ({
  currentSupervisor,
  supervisors,
  onAddSupervisor,
  workers,
  onAddWorker,
  contractors,
  industries,
  attendance,
  onMarkAttendance,
  contractorAttendance = [],
  onSaveContractorAttendance,
  onNavigateToFormXVI,
  onLogout,
  showNotice,
  initialDeskMode = 'contractor'
}) => {
  // Desk mode switcher: 'contractor' (Contractor Site Supervisor) vs 'industry' (Factory Gate Supervisor)
  const [deskMode, setDeskMode] = useState<'contractor' | 'industry'>(initialDeskMode);

  // Active Contractor for Contractor Supervisor Desk
  const [selectedContractorId, setSelectedContractorId] = useState<string>(
    contractors[0]?.id || 'con-1'
  );

  // Active selected supervisor
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>(() => {
    if (currentSupervisor) return currentSupervisor.id;
    // Find supervisor for selected contractor if in contractor mode
    const conSup = supervisors.find(s => s.supervisorType === 'contractor' && s.contractorId === selectedContractorId);
    return conSup?.id || supervisors[0]?.id || '';
  });

  // Today's ISO date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState<string>(todayStr);

  // Industry selection for factory gate supervisor
  const activeSupObj = supervisors.find(s => s.id === selectedSupervisorId) || supervisors[0];
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(
    activeSupObj ? activeSupObj.industryId : (industries[0]?.id || 'ind-1')
  );

  // Search & Shift filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shiftSelection, setShiftSelection] = useState<'General (09:00 - 17:00)' | 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Shift C (22:00 - 06:00)'>('General (09:00 - 17:00)');

  // Quick batch status map for active session: workerId -> { status: 'Present' | 'Absent' | 'Half-Day', otHours: number }
  const [localAttendanceState, setLocalAttendanceState] = useState<Record<string, { status: 'Present' | 'Absent' | 'Half-Day'; otHours: number }>>({});

  // Worker remarks state: workerId -> remark text
  const [workerRemarks, setWorkerRemarks] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('s_worker_remarks');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const handleUpdateRemark = (workerId: string, remark: string) => {
    setWorkerRemarks(prev => {
      const updated = { ...prev, [workerId]: remark };
      try {
        localStorage.setItem('s_worker_remarks', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Modals state
  const [isDirectWorkerModalOpen, setIsDirectWorkerModalOpen] = useState<boolean>(false);
  const [isMonthlySheetModalOpen, setIsMonthlySheetModalOpen] = useState<boolean>(false);
  const [selectedMonthForSheet, setSelectedMonthForSheet] = useState<string>('2026-09');

  // Add Supervisor Modal State
  const [isAddSupModalOpen, setIsAddSupModalOpen] = useState<boolean>(false);
  const [newSupName, setNewSupName] = useState<string>('');
  const [newSupPhone, setNewSupPhone] = useState<string>('');
  const [newSupEmail, setNewSupEmail] = useState<string>('');
  const [newSupDept, setNewSupDept] = useState<string>('Site Operations & Labour Management');
  const [newSupType, setNewSupType] = useState<'contractor' | 'industry'>('contractor');
  const [newSupContractorId, setNewSupContractorId] = useState<string>(contractors[0]?.id || 'con-1');
  const [newSupIndustryId, setNewSupIndustryId] = useState<string>(industries[0]?.id || 'ind-1');

  // Active Contractor Object with guaranteed fallback
  const fallbackContractor: Contractor = {
    id: 'con-1',
    name: 'Apex Industrial Manpower Solutions',
    licenseNo: 'CLRA/AS/2026/8921',
    lin: '1928374650',
    pan: 'ABCDE1234F',
    epfCode: 'AS/GHY/0029381/000',
    esiCode: '13000982710000001',
    contactNo: '+91 98640 11223',
    rating: 4.9
  };
  const activeContractor = contractors.find(c => c.id === selectedContractorId) || contractors[0] || fallbackContractor;

  // Supervisors filtered by active mode
  const contractorSupervisors = supervisors.filter(
    s => s.supervisorType === 'contractor' || (s.contractorId && s.contractorId === selectedContractorId)
  );
  const industrySupervisors = supervisors.filter(
    s => s.supervisorType === 'industry' || !s.contractorId
  );

  // Filtered workers eligible for attendance
  const displayedWorkers = (workers || []).filter(w => {
    if (!w) return false;
    // In contractor mode, only show workers belonging to this contractor
    const matchesContractor = deskMode === 'contractor' 
      ? w.contractorId === selectedContractorId 
      : true;

    const matchesSearch = (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.aadhaarHash || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.skillType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.phone || '').includes(searchQuery);

    return matchesContractor && matchesSearch;
  });

  // Calculate today stats
  const todayIndustryAttendance = attendance.filter(a => a.date === attendanceDate && a.industryId === selectedIndustryId);
  const todayContractorAttendance = contractorAttendance.filter(a => a.date === attendanceDate && a.contractorId === selectedContractorId);
  
  const presentCount = deskMode === 'contractor'
    ? todayContractorAttendance.filter(a => a.status === 'Present').length
    : todayIndustryAttendance.filter(a => a.status === 'Present').length;

  const totalOtHours = deskMode === 'contractor'
    ? todayContractorAttendance.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0)
    : todayIndustryAttendance.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);

  // Quick Batch Mark All Present
  const handleMarkAllPresent = () => {
    const nextState = { ...localAttendanceState };
    displayedWorkers.forEach(w => {
      nextState[w.id] = { status: 'Present', otHours: nextState[w.id]?.otHours || 0 };
    });
    setLocalAttendanceState(nextState);
    showNotice(`সকলো ${displayedWorkers.length} জন শ্ৰমিকক 'উপস্থিত' (Present) হিচাপে চিহ্নিত কৰা হৈছে।`, 'info');
  };

  // Quick Reset Selections
  const handleResetSelections = () => {
    setLocalAttendanceState({});
    showNotice('উপস্থিতি বাছনি বাতিল কৰা হ’ল।', 'info');
  };

  // Toggle single worker status: Present <-> Absent <-> Half-Day
  const toggleWorkerStatus = (workerId: string) => {
    setLocalAttendanceState(prev => {
      const current = prev[workerId];
      const currentStatus = current ? current.status : 'Absent';
      let nextStatus: 'Present' | 'Absent' | 'Half-Day' = 'Present';
      if (currentStatus === 'Present') nextStatus = 'Half-Day';
      else if (currentStatus === 'Half-Day') nextStatus = 'Absent';
      else nextStatus = 'Present';

      return {
        ...prev,
        [workerId]: {
          status: nextStatus,
          otHours: current ? current.otHours : 0
        }
      };
    });
  };

  // Change Overtime hours for worker
  const handleOtChange = (workerId: string, otHours: number) => {
    setLocalAttendanceState(prev => ({
      ...prev,
      [workerId]: {
        status: prev[workerId]?.status || 'Present',
        otHours: Math.max(0, otHours)
      }
    }));
  };

  // Save attendance based on active desk mode
  const handleSaveAttendance = () => {
    const supName = activeSupObj ? activeSupObj.name : (deskMode === 'contractor' ? 'Contractor Supervisor' : 'Industry Supervisor');

    if (deskMode === 'contractor') {
      // CONTRACTOR INTERNAL ATTENDANCE: Does NOT touch Form XVI Muster Roll!
      const recordsToSave: ContractorAttendanceRecord[] = [];

      displayedWorkers.forEach(w => {
        const state = localAttendanceState[w.id];
        if (state !== undefined) {
          recordsToSave.push({
            id: `catt-${Date.now()}-${w.id}`,
            contractorId: selectedContractorId,
            supervisorId: selectedSupervisorId,
            supervisorName: supName,
            workerId: w.id,
            workerName: w?.name || 'Worker',
            date: attendanceDate,
            status: state.status,
            hoursWorked: state.status === 'Present' ? 8 : state.status === 'Half-Day' ? 4 : 0,
            overtimeHours: state.status !== 'Absent' ? (state.otHours || 0) : 0,
            shift: shiftSelection,
            remarks: workerRemarks[w.id] || ''
          });
        }
      });

      if (recordsToSave.length === 0) {
        showNotice('অনুগ্ৰহ কৰি অতি কমেও এজন শ্ৰমিকৰ উপস্থিতি বাছক! (Please mark attendance for at least 1 worker)', 'error');
        return;
      }

      if (onSaveContractorAttendance) {
        onSaveContractorAttendance(recordsToSave);
      }
      showNotice(
        `সফল! ছুপাৰভাইজাৰ ${supName} দ্বাৰা ${recordsToSave.length} জন শ্ৰমিকৰ হাজিৰা কণ্ট্ৰেক্টৰ আভ্যন্তৰীণ বহীত সংৰক্ষিত হ'ল! (চৰকাৰী Form XVI অপৰিৱৰ্তিত)`,
        'success'
      );
    } else {
      // INDUSTRY GATE ATTENDANCE: Syncs directly with statutory Form XVI Muster Roll
      const recordsToSave: {
        workerId: string;
        industryId: string;
        hoursWorked: number;
        overtimeHours: number;
        date: string;
        supervisorName: string;
        status: 'Present' | 'Absent';
      }[] = [];

      displayedWorkers.forEach(w => {
        const state = localAttendanceState[w.id];
        if (state !== undefined) {
          recordsToSave.push({
            workerId: w.id,
            industryId: selectedIndustryId,
            hoursWorked: state.status === 'Present' ? 8 : state.status === 'Half-Day' ? 4 : 0,
            overtimeHours: state.status !== 'Absent' ? (state.otHours || 0) : 0,
            date: attendanceDate,
            supervisorName: supName,
            status: state.status === 'Absent' ? 'Absent' : 'Present'
          });
        }
      });

      if (recordsToSave.length === 0) {
        showNotice('অনুগ্ৰহ কৰি অতি কমেও এজন শ্ৰমিকৰ উপস্থিতি বাছক! (Please mark attendance for at least 1 worker)', 'error');
        return;
      }

      onMarkAttendance(recordsToSave);
      showNotice(
        `সফল! ইণ্ডাষ্ট্ৰী ছুপাৰভাইজাৰ ${supName} দ্বাৰা ${recordsToSave.length} জন শ্ৰমিকৰ উপস্থিতি CLRA Form XVI Muster Roll ত প্ৰবিষ্ট কৰা হ'ল!`,
        'success'
      );
    }
  };

  // Handle Add New Supervisor (can be contractor supervisor or industry supervisor)
  const handleSubmitNewSup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newSupPhone) {
      showNotice('অনুগ্ৰহ কৰি নাম আৰু ফোন নম্বৰ প্ৰবিষ্ট কৰক!', 'error');
      return;
    }
    const contractorObj = contractors.find(c => c.id === newSupContractorId);
    onAddSupervisor({
      name: newSupName,
      phone: newSupPhone,
      email: newSupEmail || `${newSupName.toLowerCase().replace(/\s+/g, '')}@${newSupType === 'contractor' ? 'contractor' : 'industry'}.com`,
      department: newSupDept,
      supervisorType: newSupType,
      contractorId: newSupType === 'contractor' ? newSupContractorId : undefined,
      contractorName: newSupType === 'contractor' ? contractorObj?.name : undefined,
      industryId: newSupIndustryId,
      active: true
    });
    setIsAddSupModalOpen(false);
    setNewSupName('');
    setNewSupPhone('');
    setNewSupEmail('');
    showNotice(`নতুন ${newSupType === 'contractor' ? 'কণ্ট্ৰেক্টৰ' : 'ইণ্ডাষ্ট্ৰী'} ছুপাৰভাইজাৰ ${newSupName} সফলতাৰে যোগ কৰা হ’ল!`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* ==================== DESK ARCHITECTURE SWITCHER BAR ==================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold border border-indigo-500/30 shrink-0">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              ছুপাৰভাইজাৰ ভূমিকা নিৰ্বাচন (Supervisor Authority Mode):
            </span>
            <span className="text-xs font-bold text-white">
              {deskMode === 'contractor' ? '🏢 লেবাৰ কণ্ট্ৰেক্টৰ ছুপাৰভাইজাৰ ডেস্ক' : '🏭 ইণ্ডাষ্ট্ৰী এইচ.আৰ আৰু গেট ছুপাৰভাইজাৰ'}
            </span>
          </div>
        </div>

        {/* 2-Way Mode Switcher Tabs */}
        <div className="flex items-center gap-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setDeskMode('contractor')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              deskMode === 'contractor'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>🏢 কণ্ট্ৰেক্টৰ ছুপাৰভাইজাৰ (Contractor Supervisor)</span>
            <span className="text-[9px] bg-emerald-950/40 text-emerald-100 px-1.5 py-0.2 rounded font-mono">
              পোনপটীয়া এন্ট্ৰি + PDF
            </span>
          </button>

          <button
            type="button"
            onClick={() => setDeskMode('industry')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              deskMode === 'industry'
                ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>🏭 ইণ্ডাষ্ট্ৰী গেট ছুপাৰভাইজাৰ (Industry Gate HR)</span>
            <span className="text-[9px] bg-indigo-950/60 text-indigo-200 px-1.5 py-0.2 rounded font-mono">
              Form XVI Muster Roll
            </span>
          </button>
        </div>
      </div>

      {/* Top Banner: Explaining Active Authority & Compliance Separation */}
      <div className={`p-6 rounded-2xl border shadow-md text-white ${
        deskMode === 'contractor'
          ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 border-emerald-900/40'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-900/40'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              {deskMode === 'contractor' ? (
                <>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Zap className="h-3 w-3 text-emerald-400" />
                    লেবাৰ কণ্ট্ৰেক্টৰ চাইট পেনেল (Contractor Site Desk)
                  </span>
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    স্মাৰ্টফোন নথকা শ্ৰমিকৰ পোনপটীয়া এন্ট্ৰি সমৰ্থিত
                  </span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-700">
                    🔒 Form XVI ৰ সৈতে খেলিমেলিমুক্ত (Independent Internal Ledger)
                  </span>
                </>
              ) : (
                <>
                  <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-indigo-400" />
                    ইণ্ডাষ্ট্ৰী প্ৰিন্সিপাল এমপ্লয়াৰ (Factory Principal HR)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    চৰকাৰী CLRA Form XVI Muster Roll
                  </span>
                </>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <UserCheck className={`h-6 w-6 ${deskMode === 'contractor' ? 'text-emerald-400' : 'text-indigo-400'}`} />
              {deskMode === 'contractor' 
                ? `🏢 কণ্ট্ৰেক্টৰ ছুপাৰভাইজাৰ ডেস্ক: ${activeContractor?.name || 'Labour Contractor Agency'}` 
                : '🏭 ইণ্ডাষ্ট্ৰী এইচ.আৰ আৰু ফেক্টৰী গেট ছুপাৰভাইজাৰ পেনেল'}
            </h2>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {deskMode === 'contractor' ? (
                <>
                  এণ্ড্ৰইড ফোন নথকা সাধাৰণ শ্ৰমিকসকলক কণ্ট্ৰেক্টৰৰ ছুপাৰভাইজাৰে পোনপটীয়াকৈ নিজৰ পেনেলৰ পৰা নামভৰ্তি কৰাব পাৰে। দৈনিক উপস্থিতি মাৰ্ক কৰাৰ পিছত চিষ্টেমৰ পৰা পোনে পোনে <strong>মাহেকীয়া হাজিৰা বহী (Monthly Attendance PDF)</strong> প্ৰিণ্ট কৰি উলিয়াব পাৰি। এই এন্ট্ৰি চৰকাৰী Form XVI ত পোনে পোনে নোসোমোৱাৰ বাবে ইণ্ডাষ্ট্ৰী এইচ.আৰৰ গেট এন্ট্ৰিৰ সৈতে কোনো সংঘাত (Conflict/Collision) নহয়।
                </>
              ) : (
                <>
                  কাৰখানাৰ ভিতৰত শ্ৰমিক প্ৰৱেশৰ সময়ত কোনো ধৰণৰ সময় অপচয় নকৰাকৈ ছুপাৰভাইজাৰসকলে ১-ক্লিকত শ্ৰমিকৰ হাজিৰা আৰু অভাৰটাইম প্ৰবিষ্ট কৰিব পাৰে। এই এন্ট্ৰিৰ পৰা স্বয়ংক্ৰিয়ভাৱে চৰকাৰী <strong>CLRA Form XVI (Muster Roll)</strong> আৰু Form XVII আপডেট হৈ যায়।
                </>
              )}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            {deskMode === 'contractor' && (
              <>
                {/* Direct Worker Entry Modal Trigger */}
                <button
                  onClick={() => setIsDirectWorkerModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <UserPlus className="h-4 w-4" />
                  + পোনপটীয়া শ্ৰমিক ভৰ্তি (Direct Labour Entry)
                </button>

                {/* Monthly PDF / Print Sheet Modal Trigger */}
                <button
                  onClick={() => setIsMonthlySheetModalOpen(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Printer className="h-4 w-4 text-emerald-400" />
                  🖨️ মাহেকীয়া হাজিৰা PDF/প্ৰিণ্ট (Monthly Sheet)
                </button>
              </>
            )}

            <button
              onClick={() => {
                setNewSupType(deskMode === 'contractor' ? 'contractor' : 'industry');
                setIsAddSupModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              + ছুপাৰভাইজাৰ যোগ কৰক (+ Add Supervisor)
            </button>

            {deskMode === 'industry' && onNavigateToFormXVI && (
              <button
                onClick={onNavigateToFormXVI}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                Form XVI Muster Roll চাওক
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                title="লগ আউট কৰক (Log Out)"
              >
                <LogOut className="h-4 w-4" />
                লগ আউট (Log Out)
              </button>
            )}
          </div>
        </div>

        {/* Real-Time KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {deskMode === 'contractor' ? 'আজিৰ উপস্থিতি (Contractor Present)' : 'আজিৰ গেট উপস্থিতি (Gate Present)'}
            </span>
            <span className="text-xl font-black text-emerald-400">{presentCount} জন</span>
            <span className="text-[10px] text-slate-500 block">মুঠ তালিকাভুক্ত {displayedWorkers.length} জনৰ ভিতৰত</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">অতিৰিক্ত কাম (Overtime Log)</span>
            <span className="text-xl font-black text-amber-400">+{totalOtHours} ঘণ্টা</span>
            <span className="text-[10px] text-slate-500 block">দুগুণ মজুৰি নিৰ্ধাৰিত</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {deskMode === 'contractor' ? 'কণ্ট্ৰেক্টৰ ছুপাৰভাইজাৰ' : 'ইণ্ডাষ্ট্ৰী ছুপাৰভাইজাৰ'}
            </span>
            <span className="text-xl font-black text-indigo-400">
              {deskMode === 'contractor' ? contractorSupervisors.length : industrySupervisors.length} জন
            </span>
            <span className="text-[10px] text-slate-500 block">
              {deskMode === 'contractor' ? 'একাধিক চাইট ছুপাৰভাইজাৰ সক্ৰিয়' : 'গেট আৰু প্লাণ্ট ইন-চাৰ্জ'}
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">নথি আৰু খতিয়ান সুৰক্ষা</span>
            <span className="text-xl font-black text-white flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> 
              {deskMode === 'contractor' ? 'মাহেকীয়া বহী' : 'Form XVI'}
            </span>
            <span className="text-[10px] text-emerald-400 block">
              {deskMode === 'contractor' ? 'PDF প্ৰিণ্টৰ বাবে সাজু' : 'চৰকাৰী খতিয়ান লিংকড'}
            </span>
          </div>
        </div>
      </div>

      {/* Control Desk: Selectors & Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              deskMode === 'contractor' ? 'bg-emerald-50 text-emerald-700' : 'bg-indigo-50 text-indigo-700'
            }`}>
              {deskMode === 'contractor' ? '👷' : '🏭'}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                {deskMode === 'contractor' 
                  ? 'কণ্ট্ৰেক্টৰ, দায়িত্বপ্ৰাপ্ত চাইট ছুপাৰভাইজাৰ আৰু শিফ্ট বাছক' 
                  : 'কাৰখানা প্লাণ্ট আৰু গেট ছুপাৰভাইজাৰ নিৰ্বাচন'}
              </h3>
              <p className="text-xs text-slate-500">
                {deskMode === 'contractor' 
                  ? 'Select active labour contractor, supervisor desk and mark worker attendance' 
                  : 'Select active factory plant and gate check-in supervisor'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleMarkAllPresent}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              সকলো উপস্থিত চিহ্নিত কৰক (Mark All Present)
            </button>
            <button
              onClick={handleResetSelections}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer"
            >
              ৰিষ্ট কৰক (Reset)
            </button>
          </div>
        </div>

        {/* Dynamic Selector Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* In Contractor Mode: Select Contractor Agency */}
          {deskMode === 'contractor' && (
            <div>
              <label className="block text-slate-600 font-bold mb-1">
                লেবাৰ কণ্ট্ৰেক্টৰ বাছক (Active Contractor) *
              </label>
              <select
                value={selectedContractorId}
                onChange={(e) => {
                  setSelectedContractorId(e.target.value);
                  // Auto-switch to supervisor of that contractor if available
                  const foundSup = supervisors.find(s => s.contractorId === e.target.value);
                  if (foundSup) setSelectedSupervisorId(foundSup.id);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
              >
                {contractors.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Select Active Supervisor */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              সক্ৰিয় ছুপাৰভাইজাৰ (Active Supervisor Desk) *
            </label>
            <select
              value={selectedSupervisorId}
              onChange={(e) => {
                setSelectedSupervisorId(e.target.value);
                const s = supervisors.find(sup => sup.id === e.target.value);
                if (s?.industryId) setSelectedIndustryId(s.industryId);
                if (s?.contractorId) setSelectedContractorId(s.contractorId);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              {(deskMode === 'contractor' ? contractorSupervisors : industrySupervisors).length === 0 ? (
                <option value="">কোনো ছুপাৰভাইজাৰ পোৱা নগ'ল (+ Add কৰক)</option>
              ) : (
                (deskMode === 'contractor' ? contractorSupervisors : industrySupervisors).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department}) - {s.phone}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Industry Plant (in industry mode or for assigned site) */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              {deskMode === 'contractor' ? 'চাইট প্লাণ্ট (Deployment Site)' : 'কাৰখানা প্লাণ্ট (Factory Plant)'} *
            </label>
            <select
              value={selectedIndustryId}
              onChange={(e) => setSelectedIndustryId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              {industries.map(i => (
                <option key={i.id} value={i.id}>{i.name} ({i.location})</option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              উপস্থিতিৰ তাৰিখ (Attendance Date) *
            </label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Shift Selection */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              শিফ্ট (Shift Hours)
            </label>
            <select
              value={shiftSelection}
              onChange={(e: any) => setShiftSelection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              <option value="General (09:00 - 17:00)">General (09:00 - 17:00)</option>
              <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
              <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
              <option value="Shift C (22:00 - 06:00)">Shift C (22:00 - 06:00)</option>
            </select>
          </div>
        </div>

        {/* Worker filter row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="শ্ৰমিকৰ নাম, দক্ষতা, ফোন বা আধাৰ নম্বৰ সন্ধান কৰক (Search worker...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <span className="font-bold">
              তালিকাভুক্ত শ্ৰমিক সংখ্যা: <strong className="text-slate-900">{displayedWorkers.length} জন</strong>
            </span>
            {deskMode === 'contractor' && (
              <span className="text-[11px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                🏢 {activeContractor?.name ? activeContractor.name.split(' ')[0] : 'কণ্ট্ৰেক্টৰ'} ৰ অধীনস্থ শ্ৰমিক
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Workers Roster Table with 1-Click Check-In */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className={`h-4 w-4 ${deskMode === 'contractor' ? 'text-emerald-600' : 'text-indigo-600'}`} />
              {deskMode === 'contractor'
                ? `কণ্ট্ৰেক্টৰ শ্ৰমিক হাজিৰা বহী (${displayedWorkers.length} জন শ্ৰমিক)`
                : `কাৰখানা গেট এন্ট্ৰি আৰু হাজিৰা তালিকা (${displayedWorkers.length} জন শ্ৰমিক)`}
            </h4>
            <p className="text-[11px] text-slate-500">
              {deskMode === 'contractor'
                ? '১-ক্লিকত Present, Absent বা Half-Day চিহ্নিত কৰক। মাহেকীয়া প্ৰতিবেদনৰ বাবে ইয়াৰ পৰা PDF প্ৰিণ্ট ল’ব পাৰিব।'
                : 'Gate attendance will be verified and synchronized into statutory CLRA Form XVI Muster Roll.'}
            </p>
          </div>

          {/* Commit Button */}
          <button
            onClick={handleSaveAttendance}
            className={`font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer ${
              deskMode === 'contractor'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            {deskMode === 'contractor'
              ? 'কণ্ট্ৰেক্টৰ হাজিৰা বহীত সংৰক্ষণ কৰক (Save to Contractor Ledger)'
              : 'উপস্থিতি সংৰক্ষণ কৰক (Submit to Form XVI)'}
          </button>
        </div>

        {/* Statutory Collision Prevention Badge for Contractor Mode */}
        {deskMode === 'contractor' && (
          <div className="bg-emerald-50/70 border-b border-emerald-150 px-4 py-2 text-xs flex items-center justify-between text-emerald-900">
            <div className="flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span>
                <strong>নিৰাপদ আৰু সংঘাতমুক্ত:</strong> এই এন্ট্ৰিয়ে চৰকাৰী Form XVI ত প্ৰভাৱ নেপেলায়। ইণ্ডাষ্ট্ৰী এইচ.আৰৰ গেট এন্ট্ৰি আৰু কণ্ট্ৰেক্টৰৰ আভ্যন্তৰীণ এন্ট্ৰি পৃথকভাৱে সংৰক্ষিত থাকে।
              </span>
            </div>
            <button
              onClick={() => setIsMonthlySheetModalOpen(true)}
              className="text-[11px] font-black underline text-emerald-800 hover:text-emerald-950 shrink-0 cursor-pointer ml-2"
            >
              মাহেকীয়া PDF খতিয়ান চাওক →
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">নং</th>
                <th className="p-3">শ্ৰমিকৰ নাম আৰু মোবাইল (Worker & Phone)</th>
                <th className="p-3">ঠিকাদাৰ এজেন্সী (Contractor)</th>
                <th className="p-3">দক্ষতা (Skill)</th>
                <th className="p-3 text-center">দৈনিক হাৰ (Rate)</th>
                <th className="p-3 text-center w-40">হাজিৰা স্থিতি (Status)</th>
                <th className="p-3 text-center w-28">অভাৰটাইম (OT)</th>
                <th className="p-3 text-center min-w-[180px] bg-slate-50 border-x border-slate-200">
                  মন্তব্য (Supervisor Remarks)
                </th>
                <th className="p-3 text-center">সংৰক্ষণ স্থিতি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {displayedWorkers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-semibold">
                    কোনো শ্ৰমিক পোৱা নগ’ল। অনুগ্ৰহ কৰি ফিল্টাৰ সলনি কৰক বা ছুপাৰভাইজাৰ পেনেলৰ পৰা পোনপটীয়া এন্ট্ৰি কৰক।
                  </td>
                </tr>
              ) : (
                displayedWorkers.map((wrk, idx) => {
                  const contractor = contractors.find(c => c.id === wrk.contractorId);
                  const isMarkedInLocalState = localAttendanceState[wrk.id];

                  // In contractor mode, check contractor attendance
                  const existingContractorRec = contractorAttendance.find(
                    a => a.workerId === wrk.id && a.date === attendanceDate && a.contractorId === selectedContractorId
                  );
                  // In industry mode, check standard attendance
                  const existingIndustryRec = attendance.find(
                    a => a.workerId === wrk.id && a.date === attendanceDate && a.industryId === selectedIndustryId
                  );

                  let statusValue: 'Present' | 'Absent' | 'Half-Day' = 'Absent';
                  let otValue = 0;

                  if (isMarkedInLocalState !== undefined) {
                    statusValue = isMarkedInLocalState.status;
                    otValue = isMarkedInLocalState.otHours;
                  } else if (deskMode === 'contractor' && existingContractorRec) {
                    statusValue = existingContractorRec.status;
                    otValue = existingContractorRec.overtimeHours || 0;
                  } else if (deskMode === 'industry' && existingIndustryRec) {
                    statusValue = existingIndustryRec.status === 'Present' ? 'Present' : 'Absent';
                    otValue = existingIndustryRec.overtimeHours || 0;
                  }

                  const isPresent = statusValue === 'Present';
                  const isHalfDay = statusValue === 'Half-Day';

                  return (
                    <tr 
                      key={wrk.id} 
                      className={`transition-colors ${isPresent ? 'bg-emerald-50/30' : isHalfDay ? 'bg-amber-50/30' : 'hover:bg-slate-50/60'}`}
                    >
                      <td className="p-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          {wrk?.name || 'Worker'}
                          {wrk?.onboardingVerified && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              ✓ ভৰ্তি
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>Aadhaar: {wrk?.aadhaarHash || 'N/A'}</span>
                          <span>&bull;</span>
                          <span>📞 {wrk?.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">
                        {contractor?.name || 'Assigned Agency'}
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {wrk.skillType}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-800 font-mono">
                        ₹{wrk.dailyWageRate}/দিন
                      </td>

                      {/* 1-Click Fast Attendance Toggle */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleWorkerStatus(wrk.id)}
                            className={`w-full py-1.5 px-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
                              isPresent 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                                : isHalfDay
                                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {isPresent ? (
                              <>
                                <CheckCircle className="h-3.5 w-3.5" />
                                উপস্থিত (Present)
                              </>
                            ) : isHalfDay ? (
                              <>
                                <Clock className="h-3.5 w-3.5" />
                                আধা দিন (Half-Day)
                              </>
                            ) : (
                              <>
                                <Clock className="h-3.5 w-3.5 text-slate-400" />
                                অনুপস্থিত (Absent)
                              </>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Overtime Selector */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="8"
                            disabled={statusValue === 'Absent'}
                            value={otValue}
                            onChange={(e) => handleOtChange(wrk.id, Number(e.target.value))}
                            className={`w-14 text-center border rounded py-1 px-1.5 font-bold font-mono text-xs outline-none ${
                              statusValue === 'Absent' 
                                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                            }`}
                          />
                          <span className="text-[10px] text-slate-500 font-bold">ঘণ্টা</span>
                        </div>
                      </td>

                      {/* Supervisor Remarks Column */}
                      <td className="p-2.5 text-center bg-slate-50/50 border-x border-slate-100">
                        <div className="flex flex-col gap-1 items-center">
                          <div className="flex items-center gap-1 w-full max-w-[200px]">
                            <input
                              type="text"
                              value={workerRemarks[wrk.id] ?? ''}
                              onChange={(e) => handleUpdateRemark(wrk.id, e.target.value)}
                              placeholder="মন্তব্য (Remark)..."
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 font-medium"
                            />
                            {workerRemarks[wrk.id] && (
                              <span className="text-[10px] text-emerald-700 font-black shrink-0 bg-emerald-100 px-1 py-0.5 rounded border border-emerald-300" title="Saved">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-[9px] flex-wrap justify-center text-slate-500">
                            {['নিয়মিত', 'দেৰি', 'OT অনুমোদিত'].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleUpdateRemark(wrk.id, tag)}
                                className="px-1.5 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                              >
                                +{tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Record Sync Badge */}
                      <td className="p-3 text-center">
                        {deskMode === 'contractor' ? (
                          existingContractorRec ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3 text-emerald-600" /> কণ্ট্ৰেক্টৰ বহীত যুক্ত
                            </span>
                          ) : (statusValue !== 'Absent' || isMarkedInLocalState) ? (
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 font-bold px-2 py-0.5 rounded-full">
                              সংৰক্ষণৰ অপেক্ষাত
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">---</span>
                          )
                        ) : (
                          existingIndustryRec ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3 text-emerald-600" /> Form XVI ত যুক্ত
                            </span>
                          ) : (statusValue !== 'Absent' || isMarkedInLocalState) ? (
                            <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 font-bold px-2 py-0.5 rounded-full">
                              সংৰক্ষণৰ অপেক্ষাত
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">---</span>
                          )
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Summary & Action */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-slate-600">
            দায়িত্বপ্ৰাপ্ত ছুপাৰভাইজাৰ:{' '}
            <strong className="text-slate-900">{activeSupObj ? activeSupObj.name : 'Site Supervisor'}</strong>{' '}
            ({activeSupObj?.department || 'Operations'}) | {deskMode === 'contractor' ? 'কণ্ট্ৰেক্টৰ:' : 'কাৰখানা:'}{' '}
            <strong className="text-slate-900">
              {deskMode === 'contractor' ? (activeContractor?.name || 'Labour Contractor') : (industries.find(i => i.id === selectedIndustryId)?.name || 'Industry Plant')}
            </strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {deskMode === 'contractor' && (
              <button
                onClick={() => setIsMonthlySheetModalOpen(true)}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Printer className="h-4 w-4 text-emerald-400" />
                মাহেকীয়া হাজিৰা বহী PDF প্ৰিণ্ট (Monthly Sheet)
              </button>
            )}

            <button
              onClick={handleSaveAttendance}
              className={`w-full sm:w-auto font-black text-xs px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                deskMode === 'contractor'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              {deskMode === 'contractor'
                ? 'কণ্ট্ৰেক্টৰ বহীত সংৰক্ষণ কৰক (Confirm & Save)'
                : 'Form XVI লৈ প্ৰেৰণ কৰক (Sync to Form XVI)'}
            </button>
          </div>
        </div>
      </div>

      {/* Supervisors List Management Card (Multiple Supervisors System) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              {deskMode === 'contractor'
                ? `লেবাৰ কণ্ট্ৰেক্টৰ চাইট ছুপাৰভাইজাৰ ৰ’ষ্টাৰ (${contractorSupervisors.length} জন সক্ৰিয়)`
                : `কাৰখানা গেট ছুপাৰভাইজাৰ ৰ’ষ্টাৰ (${industrySupervisors.length} জন সক্ৰিয়)`}
            </h4>
            <p className="text-xs text-slate-500">
              {deskMode === 'contractor'
                ? 'একাধিক চাইট আৰু শিফ্টৰ বাবে কণ্ট্ৰেক্টৰে যিকোনো সংখ্যক ছুপাৰভাইজাৰ যোগ কৰিব পাৰে (Multiple Contractor Supervisors).'
                : 'ইণ্ডাষ্ট্ৰী গেট আৰু প্লাণ্ট নিৰাপত্তাৰ বাবে দায়িত্বপ্ৰাপ্ত ছুপাৰভাইজাৰ তালিকা।'}
            </p>
          </div>

          <button
            onClick={() => {
              setNewSupType(deskMode === 'contractor' ? 'contractor' : 'industry');
              setIsAddSupModalOpen(true);
            }}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            + নতুন ছুপাৰভাইজাৰ যোগ কৰক (+ Add Supervisor)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(deskMode === 'contractor' ? contractorSupervisors : industrySupervisors).map((sup) => {
            const isSelected = sup.id === selectedSupervisorId;
            const linkedContractor = contractors.find(c => c.id === sup.contractorId);
            const linkedIndustry = industries.find(i => i.id === sup.industryId);

            return (
              <div
                key={sup.id}
                onClick={() => {
                  setSelectedSupervisorId(sup.id);
                  if (sup.contractorId) setSelectedContractorId(sup.contractorId);
                  if (sup.industryId) setSelectedIndustryId(sup.industryId);
                  showNotice(`ছুপাৰভাইজাৰ ${sup.name} নিৰ্বাচন কৰা হ’ল।`, 'info');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-50/60 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs' 
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                      {sup.department}
                    </span>
                    <h5 className="font-extrabold text-slate-900 text-sm">{sup.name}</h5>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">📞 {sup.phone}</p>
                    <p className="text-[11px] text-slate-500 font-mono">✉️ {sup.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sup.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {sup.active ? 'সক্ৰিয়' : 'Inactive'}
                    </span>
                    <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                      {sup.supervisorType === 'contractor' ? 'Contractor' : 'Industry'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center text-[10px] text-slate-500">
                  <span className="truncate max-w-[180px]">
                    {sup.supervisorType === 'contractor' 
                      ? `কণ্ট্ৰেক্টৰ: ${linkedContractor?.name || 'Assigned Agency'}` 
                      : `প্লাণ্ট: ${linkedIndustry?.name || 'Main Plant'}`}
                  </span>
                  {isSelected ? (
                    <span className="text-emerald-700 font-black flex items-center gap-0.5">
                      ✓ বৰ্তমান সক্ৰিয়
                    </span>
                  ) : (
                    <span className="text-slate-400 group-hover:text-slate-600">বাছক →</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Direct Worker Entry for Non-Smartphone Workers */}
      <DirectWorkerEntryModal
        isOpen={isDirectWorkerModalOpen}
        onClose={() => setIsDirectWorkerModalOpen(false)}
        contractor={activeContractor}
        supervisor={activeSupObj}
        onAddWorker={(newWorker) => {
          if (onAddWorker) onAddWorker(newWorker);
        }}
        showNotice={showNotice}
      />

      {/* Modal: Monthly Attendance PDF / Print Sheet */}
      <ContractorMonthlyAttendanceModal
        isOpen={isMonthlySheetModalOpen}
        onClose={() => setIsMonthlySheetModalOpen(false)}
        contractor={activeContractor}
        supervisor={activeSupObj}
        workers={workers}
        contractorAttendance={contractorAttendance}
        selectedMonth={selectedMonthForSheet}
        onChangeMonth={setSelectedMonthForSheet}
      />

      {/* Modal: Add New Supervisor */}
      {isAddSupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  +
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">নতুন ছুপাৰভাইজাৰ যোগ কৰক</h3>
                  <p className="text-[11px] text-slate-400">Add New Supervisor (+ Multi-Supervisor System)</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddSupModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewSup} className="space-y-3 text-xs">
              
              {/* Supervisor Type Selector */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">ছুপাৰভাইজাৰৰ প্ৰকাৰ (Supervisor Type) *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSupType('contractor')}
                    className={`p-2 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                      newSupType === 'contractor' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-2xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    🏢 কণ্ট্ৰেক্টৰ ছুপাৰভাইজাৰ
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSupType('industry')}
                    className={`p-2 rounded-lg font-bold border text-center transition-all cursor-pointer ${
                      newSupType === 'industry' 
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-2xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    🏭 ইণ্ডাষ্ট্ৰী গেট ছুপাৰভাইজাৰ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">ছুপাৰভাইজাৰৰ পূৰ্ণ নাম (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhaben Barman / Ramesh Kalita"
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">মোবাইল নম্বৰ (Mobile Phone) *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543220"
                  value={newSupPhone}
                  onChange={(e) => setNewSupPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-semibold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">মেইল ঠিকনা (Email Address)</label>
                <input
                  type="email"
                  placeholder="e.g. supervisor@company.com"
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              {/* If Contractor Supervisor, select which contractor */}
              {newSupType === 'contractor' && (
                <div>
                  <label className="block text-slate-600 font-bold mb-1">লেবাৰ কণ্ট্ৰেক্টৰ (Contractor Agency) *</label>
                  <select
                    value={newSupContractorId}
                    onChange={(e) => setNewSupContractorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
                  >
                    {contractors.map(con => (
                      <option key={con.id} value={con.id}>{con.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-slate-600 font-bold mb-1">বিভাগ (Department / Section)</label>
                <input
                  type="text"
                  value={newSupDept}
                  onChange={(e) => setNewSupDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
                  placeholder="e.g. Site Operations / Assembly Line"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">নিৰ্ধাৰিত কাৰখানা (Assigned Plant)</label>
                <select
                  value={newSupIndustryId}
                  onChange={(e) => setNewSupIndustryId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
                >
                  {industries.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.name} - {ind.location}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSupModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-lg transition-all shadow-md cursor-pointer"
                >
                  ছুপাৰভাইজাৰ সংৰক্ষণ কৰক (Save Supervisor)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupervisorAttendancePanel;
