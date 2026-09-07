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
  LogOut
} from 'lucide-react';
import { Worker, Contractor, Industry, Attendance, Supervisor } from '../types';

interface SupervisorAttendancePanelProps {
  currentSupervisor?: Supervisor;
  supervisors: Supervisor[];
  onAddSupervisor: (sup: Omit<Supervisor, 'id' | 'createdAt'>) => void;
  workers: Worker[];
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
  onNavigateToFormXVI?: () => void;
  onLogout?: () => void;
  showNotice: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const SupervisorAttendancePanel: React.FC<SupervisorAttendancePanelProps> = ({
  currentSupervisor,
  supervisors,
  onAddSupervisor,
  workers,
  contractors,
  industries,
  attendance,
  onMarkAttendance,
  onNavigateToFormXVI,
  onLogout,
  showNotice
}) => {
  // Active selected supervisor (defaults to currentSupervisor or first active supervisor)
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string>(
    currentSupervisor ? currentSupervisor.id : (supervisors[0]?.id || '')
  );

  // Today's ISO date string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState<string>(todayStr);

  // Industry selection for supervisor
  const activeSupObj = supervisors.find(s => s.id === selectedSupervisorId) || supervisors[0];
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>(
    activeSupObj ? activeSupObj.industryId : (industries[0]?.id || 'ind-1')
  );

  // Contractor filter
  const [contractorFilter, setContractorFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [shiftSelection, setShiftSelection] = useState<'General (09:00 - 17:00)' | 'Shift A (06:00 - 14:00)' | 'Shift B (14:00 - 22:00)' | 'Shift C (22:00 - 06:00)'>('General (09:00 - 17:00)');

  // Quick batch status map: workerId -> { present: boolean, otHours: number }
  const [workerAttendanceState, setWorkerAttendanceState] = useState<Record<string, { present: boolean; otHours: number }>>({});

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

  // Add Supervisor Modal State
  const [isAddSupModalOpen, setIsAddSupModalOpen] = useState<boolean>(false);
  const [newSupName, setNewSupName] = useState<string>('');
  const [newSupPhone, setNewSupPhone] = useState<string>('');
  const [newSupEmail, setNewSupEmail] = useState<string>('');
  const [newSupDept, setNewSupDept] = useState<string>('Production & Assembly');
  const [newSupIndustryId, setNewSupIndustryId] = useState<string>(industries[0]?.id || 'ind-1');

  // Filtered workers eligible for attendance
  const filteredWorkers = workers.filter(w => {
    const matchesContractor = contractorFilter === 'ALL' || w.contractorId === contractorFilter;
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.aadhaarHash || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.skillType || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContractor && matchesSearch;
  });

  // Calculate stats for today
  const todayAttendance = attendance.filter(a => a.date === attendanceDate && a.industryId === selectedIndustryId);
  const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
  const totalOtHours = todayAttendance.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);

  // Handle Quick Batch Mark Present for all displayed
  const handleMarkAllPresent = () => {
    const nextState = { ...workerAttendanceState };
    filteredWorkers.forEach(w => {
      nextState[w.id] = { present: true, otHours: nextState[w.id]?.otHours || 0 };
    });
    setWorkerAttendanceState(nextState);
    showNotice(`সকলো ${filteredWorkers.length} জন শ্ৰমিকক 'উপস্থিত' (Present) হিচাপে চিহ্নিত কৰা হৈছে।`, 'info');
  };

  // Handle Quick Batch Clear/Reset
  const handleResetSelections = () => {
    setWorkerAttendanceState({});
    showNotice('উপস্থিতি বাছনি বাতিল কৰা হ’ল।', 'info');
  };

  // Toggle single worker
  const toggleWorkerPresent = (workerId: string) => {
    setWorkerAttendanceState(prev => {
      const current = prev[workerId];
      const isCurrentlyPresent = current ? current.present : false;
      return {
        ...prev,
        [workerId]: {
          present: !isCurrentlyPresent,
          otHours: current ? current.otHours : 0
        }
      };
    });
  };

  // Change Overtime hours for worker
  const handleOtChange = (workerId: string, otHours: number) => {
    setWorkerAttendanceState(prev => ({
      ...prev,
      [workerId]: {
        present: prev[workerId]?.present ?? true,
        otHours: Math.max(0, otHours)
      }
    }));
  };

  // Save attendance batch into Master Attendance Ledger (Form XVI)
  const handleSaveAttendance = () => {
    const recordsToSave: {
      workerId: string;
      industryId: string;
      hoursWorked: number;
      overtimeHours: number;
      date: string;
      supervisorName: string;
      status: 'Present' | 'Absent';
    }[] = [];

    const supName = activeSupObj ? activeSupObj.name : 'Industry Supervisor';

    filteredWorkers.forEach(w => {
      const state = workerAttendanceState[w.id];
      // If supervisor explicitly marked or marked all
      if (state !== undefined) {
        recordsToSave.push({
          workerId: w.id,
          industryId: selectedIndustryId,
          hoursWorked: state.present ? 8 : 0,
          overtimeHours: state.present ? (state.otHours || 0) : 0,
          date: attendanceDate,
          supervisorName: supName,
          status: state.present ? 'Present' : 'Absent'
        });
      }
    });

    if (recordsToSave.length === 0) {
      showNotice('অনুগ্ৰহ কৰি অতি কমেও এজন শ্ৰমিকৰ উপস্থিতি বাছক! (Please mark attendance for at least 1 worker)', 'error');
      return;
    }

    onMarkAttendance(recordsToSave);
    showNotice(
      `সফল! ছুপাৰভাইজাৰ ${supName} দ্বাৰা ${recordsToSave.length} জন শ্ৰমিকৰ উপস্থিতি CLRA Form XVI Muster Roll ত প্ৰবিষ্ট কৰা হ'ল!`,
      'success'
    );
  };

  // Handle Add New Supervisor
  const handleSubmitNewSup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName || !newSupPhone) {
      showNotice('অনুগ্ৰহ কৰি নাম আৰু ফোন নম্বৰ প্ৰবিষ্ট কৰক!', 'error');
      return;
    }
    onAddSupervisor({
      name: newSupName,
      phone: newSupPhone,
      email: newSupEmail || `${newSupName.toLowerCase().replace(/\s+/g, '')}@industry.com`,
      department: newSupDept,
      industryId: newSupIndustryId,
      active: true
    });
    setIsAddSupModalOpen(false);
    setNewSupName('');
    setNewSupPhone('');
    setNewSupEmail('');
    showNotice(`নতুন ছুপাৰভাইজাৰ ${newSupName} সফলতাৰে যোগ কৰা হ’ল!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Fast Attendance System Explanation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap className="h-3 w-3 text-emerald-400" />
                দ্ৰুত গেট এন্ট্ৰি ছিষ্টেম (Instant Factory Gate Entry)
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                CLRA Form XVI Muster Roll Linked
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-indigo-400" />
              ইণ্ডাষ্ট্ৰী ছুপাৰভাইজাৰ আৰু এইচ.আৰ উপস্থিতি পেনেল (Supervisor Attendance Desk)
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              কাৰখানাৰ ভিতৰত শ্ৰমিক প্ৰৱেশৰ সময়ত কোনো ধৰণৰ সময় অপচয় নকৰাকৈ ছুপাৰভাইজাৰসকলে ১-ক্লিকত শ্ৰমিকৰ হাজিৰা (Shift Attendance) আৰু অতিৰিক্ত কাম (Overtime Hours) প্ৰবিষ্ট কৰিব পাৰে। এই এন্ট্ৰিৰ পৰা স্বয়ংক্ৰিয়ভাৱে চৰকাৰী <strong>CLRA Form XVI (Muster Roll)</strong> আপডেট হৈ যায়।
            </p>
          </div>

          {/* Quick Action: Add Supervisor Button & Muster Roll Shortcut */}
          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setIsAddSupModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              ছুপাৰভাইজাৰ যোগ কৰক (+ Add Supervisor)
            </button>
            {onNavigateToFormXVI && (
              <button
                onClick={onNavigateToFormXVI}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                Form XVI খতিয়ান চাওক
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

        {/* Real-Time Shift KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">আজিৰ উপস্থিতি (Present Today)</span>
            <span className="text-xl font-black text-emerald-400">{presentCount} জন</span>
            <span className="text-[10px] text-slate-500 block">মুঠ তালিকাভুক্ত {workers.length} জনৰ ভিতৰত</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">অতিৰিক্ত কামৰ সময় (Overtime Log)</span>
            <span className="text-xl font-black text-amber-400">+{totalOtHours} ঘণ্টা</span>
            <span className="text-[10px] text-slate-500 block">Double Wage Compliance Rate</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">সক্ৰিয় ছুপাৰভাইজাৰ (Supervisors)</span>
            <span className="text-xl font-black text-indigo-400">{supervisors.length} জন</span>
            <span className="text-[10px] text-slate-500 block">বিভাগভিত্তিক নিয়োজিত</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">আইনী নথি (Statutory Sync)</span>
            <span className="text-xl font-black text-white flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100%
            </span>
            <span className="text-[10px] text-emerald-400 block">Form XVI & XVII Synchronized</span>
          </div>
        </div>
      </div>

      {/* Supervisor Control Desk & Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-xl flex items-center justify-center font-bold">
              👷
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">দায়িত্বপ্ৰাপ্ত ছুপাৰভাইজাৰ আৰু শিফ্ট নিৰ্বাচন</h3>
              <p className="text-xs text-slate-500">Select active supervisor desk, plant location, and worker shift</p>
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
            {onLogout && (
              <button
                onClick={onLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/70 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                title="লগ আউট কৰক (Log Out)"
              >
                <LogOut className="h-3.5 w-3.5" />
                লগ আউট (Log Out)
              </button>
            )}
          </div>
        </div>

        {/* Inputs row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Select Supervisor */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              ছুপাৰভাইজাৰ নিৰ্বাচন (Active Supervisor) *
            </label>
            <select
              value={selectedSupervisorId}
              onChange={(e) => {
                setSelectedSupervisorId(e.target.value);
                const s = supervisors.find(sup => sup.id === e.target.value);
                if (s) setSelectedIndustryId(s.industryId);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
            >
              {supervisors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.department}) - {s.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Plant */}
          <div>
            <label className="block text-slate-600 font-bold mb-1">
              কাৰখানা প্লাণ্ট (Industry Plant) *
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

          {/* Date */}
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

          {/* Shift */}
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
              placeholder="শ্ৰমিকৰ নাম, দক্ষতা বা আধাৰ নম্বৰ সন্ধান কৰক (Search worker...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 shrink-0">ঠিকাদাৰ বাছক (Filter Contractor):</span>
            <select
              value={contractorFilter}
              onChange={(e) => setContractorFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="ALL">সকলো ঠিকাদাৰ (All Contractors)</option>
              {contractors.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Workers Roster Table with 1-Click Fast Check-In */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              শ্ৰমিক গেট এন্ট্ৰি আৰু উপস্থিতি তালিকা ({filteredWorkers.length} জন পোৱা গৈছে)
            </h4>
            <p className="text-[11px] text-slate-500">
              Click &quot;Present&quot; to mark instant attendance. Overtime will be calculated automatically into Form XVI and CLRA Form XVII.
            </p>
          </div>

          {/* Commit Button */}
          <button
            onClick={handleSaveAttendance}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            উপস্থিতি সংৰক্ষণ কৰক (Submit to Form XVI)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3 w-12 text-center">নং</th>
                <th className="p-3">শ্ৰমিকৰ নাম আৰু আধাৰ (Worker & Aadhaar)</th>
                <th className="p-3">ঠিকাদাৰ প্ৰতিষ্ঠান (Contractor)</th>
                <th className="p-3">দক্ষতা (Skill)</th>
                <th className="p-3 text-center">দৈনিক হাৰ (Wage Rate)</th>
                <th className="p-3 text-center w-36">হাজিৰা স্থিতি (Attendance)</th>
                <th className="p-3 text-center w-28">অতিৰিক্ত কাম (Overtime OT)</th>
                <th className="p-3 text-center min-w-[210px] bg-indigo-50/80 text-indigo-950 border-x border-indigo-100">
                  <div className="flex items-center justify-center gap-1">
                    <span>📝</span>
                    <span>মন্তব্য (Remarks / টোকা)</span>
                  </div>
                </th>
                <th className="p-3 text-center">চৰকাৰী খতিয়ান স্থিতি</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-semibold">
                    কোনো শ্ৰমিক পোৱা নগ’ল। অনুগ্ৰহ কৰি ফিল্টাৰ সলনি কৰক।
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((wrk, idx) => {
                  const contractor = contractors.find(c => c.id === wrk.contractorId);
                  const isMarkedInState = workerAttendanceState[wrk.id];
                  // Check existing database attendance for today
                  const existingRecord = attendance.find(
                    a => a.workerId === wrk.id && a.date === attendanceDate && a.industryId === selectedIndustryId
                  );

                  const isPresent = isMarkedInState !== undefined
                    ? isMarkedInState.present
                    : (existingRecord ? existingRecord.status === 'Present' : false);

                  const otHours = isMarkedInState !== undefined
                    ? isMarkedInState.otHours
                    : (existingRecord ? existingRecord.overtimeHours : 0);

                  return (
                    <tr 
                      key={wrk.id} 
                      className={`transition-colors ${isPresent ? 'bg-emerald-50/30' : 'hover:bg-slate-50/60'}`}
                    >
                      <td className="p-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                          {wrk.name}
                          {wrk.isAadhaarVerified && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                              ✓ UIDAI
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Aadhaar: {wrk.aadhaarHash} | Ph: {wrk.phone}
                        </div>
                      </td>
                      <td className="p-3 text-slate-600 font-medium">
                        {contractor ? contractor.name : 'Unknown Agency'}
                      </td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {wrk.skillType}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-800 font-mono">
                        ₹{wrk.dailyWageRate}/দিন
                      </td>

                      {/* Fast Attendance Toggle */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleWorkerPresent(wrk.id)}
                          className={`w-full py-1.5 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isPresent 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' 
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {isPresent ? (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" />
                              উপস্থিত (Present)
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              অনুপস্থিত (Absent)
                            </>
                          )}
                        </button>
                      </td>

                      {/* Overtime Selector */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="8"
                            disabled={!isPresent}
                            value={otHours}
                            onChange={(e) => handleOtChange(wrk.id, Number(e.target.value))}
                            className={`w-14 text-center border rounded py-1 px-1.5 font-bold font-mono text-xs outline-none ${
                              !isPresent ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                            }`}
                          />
                          <span className="text-[10px] text-slate-500 font-bold">ঘণ্টা</span>
                        </div>
                      </td>

                      {/* Supervisor Remarks Column */}
                      <td className="p-2.5 text-center bg-indigo-50/20 border-x border-indigo-50">
                        <div className="flex flex-col gap-1 items-center">
                          <div className="flex items-center gap-1 w-full max-w-[210px]">
                            <input
                              type="text"
                              value={workerRemarks[wrk.id] ?? ''}
                              onChange={(e) => handleUpdateRemark(wrk.id, e.target.value)}
                              placeholder="মন্তব্য লিখক (Remark)..."
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-indigo-250 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder:text-slate-400 font-medium shadow-2xs"
                            />
                            {workerRemarks[wrk.id] ? (
                              <span className="text-[11px] text-emerald-700 font-black shrink-0 bg-emerald-100 px-1.5 py-1 rounded border border-emerald-300" title="মন্তব্য সংৰক্ষিত (Saved)">
                                ✓
                              </span>
                            ) : null}
                          </div>
                          {/* Quick Suggestion Chips */}
                          <div className="flex items-center gap-1 text-[9px] flex-wrap justify-center text-slate-500">
                            {['নিয়মিত', 'দেৰি', 'OT অনুমোদিত'].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleUpdateRemark(wrk.id, tag)}
                                className="px-1.5 py-0.5 bg-white hover:bg-indigo-100 border border-slate-200 hover:border-indigo-300 rounded text-slate-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                              >
                                +{tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Form XVI Sync Badge */}
                      <td className="p-3 text-center">
                        {existingRecord ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle className="h-3 w-3 text-emerald-600" /> Form XVI ত যুক্ত
                          </span>
                        ) : isPresent ? (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 font-bold px-2 py-0.5 rounded-full">
                            সংৰক্ষণৰ অপেক্ষাত (Pending Save)
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">---</span>
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
            <strong className="text-slate-900">{activeSupObj ? activeSupObj.name : 'Supervisor'}</strong>{' '}
            ({activeSupObj?.department || 'Production'}) | কাৰখানা:{' '}
            <strong className="text-slate-900">{industries.find(i => i.id === selectedIndustryId)?.name}</strong>
          </div>

          <button
            onClick={handleSaveAttendance}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            উপস্থিতি সংৰক্ষণ আৰু Form XVI লৈ প্ৰেৰণ কৰক (Confirm & Sync to Form XVI)
          </button>
        </div>
      </div>

      {/* Supervisors List Management Card (Plus System for Unlimited Supervisors) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              কাৰখানাৰ ছুপাৰভাইজাৰ ৰ’ষ্টাৰ (+ Plus System সক্ৰিয়)
            </h4>
            <p className="text-xs text-slate-500">
              কাৰখানাৰ প্ৰয়োজন অনুসৰি যিকোনো সংখ্যক ছুপাৰভাইজাৰ যোগ কৰিব পাৰিব (Unlimited Supervisors can be created).
            </p>
          </div>

          <button
            onClick={() => setIsAddSupModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 text-emerald-400" />
            নতুন ছুপাৰভাইজাৰ যোগ কৰক (+ Plus Supervisor)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supervisors.map((sup) => {
            const ind = industries.find(i => i.id === sup.industryId);
            const isSelected = sup.id === selectedSupervisorId;
            return (
              <div
                key={sup.id}
                onClick={() => {
                  setSelectedSupervisorId(sup.id);
                  setSelectedIndustryId(sup.industryId);
                  showNotice(`ছুপাৰভাইজাৰ ${sup.name} নিৰ্বাচন কৰা হ’ল।`, 'info');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-indigo-50/60 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs' 
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    sup.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {sup.active ? 'সক্ৰিয়' : 'Inactive'}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex justify-between items-center text-[10px] text-slate-500">
                  <span className="truncate max-w-[180px]">প্লাণ্ট: {ind ? ind.name : 'Main Plant'}</span>
                  {isSelected ? (
                    <span className="text-indigo-600 font-black flex items-center gap-0.5">
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
                  <p className="text-[11px] text-slate-400">Add New Factory Supervisor (+ Plus System)</p>
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
              <div>
                <label className="block text-slate-600 font-bold mb-1">ছুপাৰভাইজাৰৰ পূৰ্ণ নাম (Full Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kalita"
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
                  placeholder="e.g. ramesh@factory.com"
                  value={newSupEmail}
                  onChange={(e) => setNewSupEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">বিভাগ (Department / Section)</label>
                <select
                  value={newSupDept}
                  onChange={(e) => setNewSupDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-800 outline-none focus:border-indigo-500"
                >
                  <option value="Production & Assembly">Production & Assembly (উৎপাদন আৰু এচেম্বলী)</option>
                  <option value="Packaging & Dispatch">Packaging & Dispatch (পেকেজিং আৰু যোগান)</option>
                  <option value="Mechanical & Maintenance">Mechanical & Maintenance (মেকানিকেল)</option>
                  <option value="Warehouse & Logistics">Warehouse & Logistics (গুদাম)</option>
                  <option value="Civil & Construction">Civil & Construction (নিৰ্মাণ বিভাগ)</option>
                  <option value="General Gate Security">General Gate Security (গেট নিৰাপত্তা)</option>
                </select>
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
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-lg transition-all shadow-md"
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
