import React, { useState } from 'react';
import { 
  Sprout, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Printer, 
  Calendar, 
  Award, 
  Building, 
  TrendingUp, 
  FileText, 
  Search, 
  Plus, 
  Clock, 
  ArrowRight,
  HelpCircle,
  Briefcase,
  LogOut,
  Home
} from 'lucide-react';
import { TeaGardenEstate, TeaGardenSardar, TeaGardenPluckingEntry, TeaGardenBonusAgreement } from '../types';

const SAMPLE_ESTATES: TeaGardenEstate[] = [
  {
    id: 'est-01',
    estateName: 'Mornoi Tea Estate (মৰনৈ চাহ বাগিচা)',
    district: 'Kokrajhar / Dhubri, Assam',
    regNo: 'PLA/AS/2026/G-104',
    totalAcreage: 1450,
    pluckingSections: ['Section 4A (North)', 'Section 7B (Borpukhuri)', 'Section 12 (Riverbank)', 'Section 15 (Hilltop)']
  },
  {
    id: 'est-02',
    estateName: 'Monabarie Tea Estate (মনাবাৰী চাহ বাগিচা)',
    district: 'Biswanath / Sonitpur, Assam',
    regNo: 'PLA/AS/2026/G-089',
    totalAcreage: 1820,
    pluckingSections: ['Section 1 (Old Garden)', 'Section 3B (Tezpur Ridge)', 'Section 8 (New Clone)']
  },
  {
    id: 'est-03',
    estateName: 'Hathikuli Organic Estate (হাতীখুলী চাহ বাগিচা)',
    district: 'Golaghat / Bokakhat, Assam',
    regNo: 'PLA/AS/2026/G-212',
    totalAcreage: 980,
    pluckingSections: ['Kaziranga Border Section', 'Central Factory Division', 'Baghmari Section']
  }
];

const SAMPLE_SARDARS: TeaGardenSardar[] = [
  {
    id: 'sar-01',
    name: 'Birsa Tanti (বিৰছা তাঁতী)',
    gangNo: 'Gang #04 (Borpukhuri Section)',
    phone: '+91 94351-88201',
    assignedSection: 'Section 7B (Borpukhuri)',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    workerCount: 28
  },
  {
    id: 'sar-02',
    name: 'Mina Munda (মীনা মুণ্ডা)',
    gangNo: 'Gang #07 (Women Plucking Gang)',
    phone: '+91 94352-77412',
    assignedSection: 'Section 4A (North)',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    workerCount: 32
  },
  {
    id: 'sar-03',
    name: 'Budhu Karmakar (বুধূ কৰ্মকাৰ)',
    gangNo: 'Gang #11 (Hoeing & Pruning Gang)',
    phone: '+91 94353-66103',
    assignedSection: 'Section 12 (Riverbank)',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    workerCount: 22
  }
];

const INITIAL_PLUCKING_ENTRIES: TeaGardenPluckingEntry[] = [
  {
    id: 'tg-001',
    date: '2026-09-09',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    sardarId: 'sar-02',
    sardarName: 'Mina Munda',
    gangNo: 'Gang #07',
    section: 'Section 4A (North)',
    workerId: 'w-tg-101',
    workerName: 'Sunita Karmakar (সুনীতা কৰ্মকাৰ)',
    tokenNo: 'TK-402',
    taskType: 'Plucking',
    grossLeafKg: 34.5,
    leafDeductionKg: 2.0,
    netLeafKg: 32.5,
    haziraBaseKg: 24.0,
    ticcaKg: 8.5,
    haziraWage: 250,
    ticcaRatePerKg: 4.5,
    ticcaEarned: 38.25,
    totalWageToday: 288.25,
    status: 'Approved-By-Supervisor',
    supervisorApprovedBy: 'Debojit Phukan (Field Supervisor)',
    approvedAt: '2026-09-09 11:45 AM'
  },
  {
    id: 'tg-002',
    date: '2026-09-09',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    sardarId: 'sar-02',
    sardarName: 'Mina Munda',
    gangNo: 'Gang #07',
    section: 'Section 4A (North)',
    workerId: 'w-tg-102',
    workerName: 'Lakhi Tanti (লক্ষী তাঁতী)',
    tokenNo: 'TK-403',
    taskType: 'Plucking',
    grossLeafKg: 38.0,
    leafDeductionKg: 2.0,
    netLeafKg: 36.0,
    haziraBaseKg: 24.0,
    ticcaKg: 12.0,
    haziraWage: 250,
    ticcaRatePerKg: 4.5,
    ticcaEarned: 54.00,
    totalWageToday: 304.00,
    status: 'Approved-By-Supervisor',
    supervisorApprovedBy: 'Debojit Phukan (Field Supervisor)',
    approvedAt: '2026-09-09 11:46 AM'
  },
  {
    id: 'tg-003',
    date: '2026-09-09',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    sardarId: 'sar-01',
    sardarName: 'Birsa Tanti',
    gangNo: 'Gang #04',
    section: 'Section 7B (Borpukhuri)',
    workerId: 'w-tg-103',
    workerName: 'Mohan Munda (মোহন মুণ্ডা)',
    tokenNo: 'TK-118',
    taskType: 'Plucking',
    grossLeafKg: 29.0,
    leafDeductionKg: 1.5,
    netLeafKg: 27.5,
    haziraBaseKg: 24.0,
    ticcaKg: 3.5,
    haziraWage: 250,
    ticcaRatePerKg: 4.5,
    ticcaEarned: 15.75,
    totalWageToday: 265.75,
    status: 'Logged-By-Sardar'
  },
  {
    id: 'tg-004',
    date: '2026-09-09',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    sardarId: 'sar-01',
    sardarName: 'Birsa Tanti',
    gangNo: 'Gang #04',
    section: 'Section 7B (Borpukhuri)',
    workerId: 'w-tg-104',
    workerName: 'Sanju Ghatowar (সঞ্জু ঘাটোৱাৰ)',
    tokenNo: 'TK-122',
    taskType: 'Plucking',
    grossLeafKg: 31.0,
    leafDeductionKg: 2.0,
    netLeafKg: 29.0,
    haziraBaseKg: 24.0,
    ticcaKg: 5.0,
    haziraWage: 250,
    ticcaRatePerKg: 4.5,
    ticcaEarned: 22.50,
    totalWageToday: 272.50,
    status: 'Logged-By-Sardar'
  },
  {
    id: 'tg-005',
    date: '2026-09-09',
    estateId: 'est-01',
    estateName: 'Mornoi Tea Estate',
    sardarId: 'sar-03',
    sardarName: 'Budhu Karmakar',
    gangNo: 'Gang #11',
    section: 'Section 12 (Riverbank)',
    workerId: 'w-tg-105',
    workerName: 'Sukra Urang (শুক্ৰা উৰাং)',
    tokenNo: 'TK-209',
    taskType: 'Pruning',
    grossLeafKg: 0,
    leafDeductionKg: 0,
    netLeafKg: 0,
    haziraBaseKg: 0,
    ticcaKg: 0,
    haziraWage: 250,
    ticcaRatePerKg: 0,
    ticcaEarned: 0,
    totalWageToday: 250.00,
    status: 'Logged-By-Sardar'
  }
];

export default function TeaGardenWorkflow() {
  const [activeSubTab, setActiveSubTab] = useState<'sardar_panel' | 'supervisor_ledger' | 'dual_bonus' | 'micro_saas'>('sardar_panel');
  const [selectedEstateId, setSelectedEstateId] = useState<string>('est-01');
  const [selectedSardarId, setSelectedSardarId] = useState<string>('sar-01');
  const [entries, setEntries] = useState<TeaGardenPluckingEntry[]>(INITIAL_PLUCKING_ENTRIES);
  const [showChallanModal, setShowChallanModal] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // New Plucking Form State
  const [newWorkerToken, setNewWorkerToken] = useState<string>('TK-415');
  const [newWorkerName, setNewWorkerName] = useState<string>('Rina Nayak (ৰীণা নায়ক)');
  const [newTaskType, setNewTaskType] = useState<'Plucking' | 'Pruning' | 'Hoeing'>('Plucking');
  const [newGrossLeaf, setNewGrossLeaf] = useState<number>(33.5);
  const [newDeduction, setNewDeduction] = useState<number>(2.0);
  const [newHaziraQuota, setNewHaziraQuota] = useState<number>(24.0);
  const [newDailyHaziraWage, setNewDailyHaziraWage] = useState<number>(250);
  const [newTiccaRate, setNewTiccaRate] = useState<number>(4.5);

  // Micro-SaaS pricing simulator
  const [simWorkerCount, setSimWorkerCount] = useState<number>(1200);

  // Dual Sector Bonus Simulator
  const [bonusSector, setBonusSector] = useState<'manufacturing' | 'tea_garden'>('tea_garden');
  const [bonusPercentage, setBonusPercentage] = useState<number>(20); // 20% standard ACMS tea bonus
  const [bonusWorkerCount, setBonusWorkerCount] = useState<number>(450);
  const [averageMonthlyWage, setAverageMonthlyWage] = useState<number>(6500);

  const selectedEstate = SAMPLE_ESTATES.find(e => e.id === selectedEstateId) || SAMPLE_ESTATES[0];
  const selectedSardar = SAMPLE_SARDARS.find(s => s.id === selectedSardarId) || SAMPLE_SARDARS[0];

  // Calculations for new entry
  const netLeaf = Math.max(0, Number((newGrossLeaf - newDeduction).toFixed(2)));
  const ticcaKg = newTaskType === 'Plucking' ? Math.max(0, Number((netLeaf - newHaziraQuota).toFixed(2))) : 0;
  const ticcaEarned = Math.round(ticcaKg * newTiccaRate);
  const totalWage = newDailyHaziraWage + ticcaEarned;

  const showNotification = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 4000);
  };

  const handleExitOrLogout = () => {
    localStorage.setItem('s_is_logged_in', 'false');
    window.dispatchEvent(new CustomEvent('shramiklink-logout'));
    window.dispatchEvent(new CustomEvent('open-app-tab'));
    showNotification('লগ আউট সম্পন্ন হ’ল! (Logged out of session)');
  };

  const handleAddPluckingEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TeaGardenPluckingEntry = {
      id: `tg-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      estateId: selectedEstate.id,
      estateName: selectedEstate.estateName,
      sardarId: selectedSardar.id,
      sardarName: selectedSardar.name,
      gangNo: selectedSardar.gangNo,
      section: selectedSardar.assignedSection,
      workerId: `w-tg-${Date.now().toString().slice(-4)}`,
      workerName: newWorkerName,
      tokenNo: newWorkerToken,
      taskType: newTaskType,
      grossLeafKg: newGrossLeaf,
      leafDeductionKg: newDeduction,
      netLeafKg: netLeaf,
      haziraBaseKg: newHaziraQuota,
      ticcaKg: ticcaKg,
      haziraWage: newDailyHaziraWage,
      ticcaRatePerKg: newTiccaRate,
      ticcaEarned: ticcaEarned,
      totalWageToday: totalWage,
      status: 'Logged-By-Sardar'
    };

    setEntries(prev => [newEntry, ...prev]);
    showNotification(`✅ চৰ্দাৰ এন্ট্ৰি সফল: ${newWorkerName} (${newWorkerToken}) ৰ পাতৰ ওজন ${netLeaf} kg অন্তৰ্ভুক্ত হ'ল।`);
    setNewWorkerToken(`TK-${Math.floor(400 + Math.random() * 100)}`);
  };

  const handleApproveEntry = (id: string) => {
    setEntries(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Approved-By-Supervisor',
          supervisorApprovedBy: 'Debojit Phukan (Garden Supervisor)',
          approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return item;
    }));
    showNotification('✅ ছুপাৰভাইজাৰে ডিজিটেল হাজিৰা বহীত পাতৰ জোখ অনুমোদন কৰিলে।');
  };

  const handleBatchApproveAll = () => {
    setEntries(prev => prev.map(item => ({
      ...item,
      status: 'Approved-By-Supervisor',
      supervisorApprovedBy: 'Debojit Phukan (Garden Supervisor)',
      approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })));
    showNotification('🎉 সকলো চৰ্দাৰৰ এন্ট্ৰি একেলগে ছুপাৰভাইজাৰে সত্যাপন কৰিলে (Batch Approved)!');
  };

  const handleLockMuster = () => {
    setEntries(prev => prev.map(item => ({
      ...item,
      status: 'Muster-Locked'
    })));
    setShowChallanModal(true);
  };

  // Summaries
  const totalNetLeafKg = entries.reduce((acc, curr) => acc + (curr.taskType === 'Plucking' ? curr.netLeafKg : 0), 0);
  const totalWagesToday = entries.reduce((acc, curr) => acc + curr.totalWageToday, 0);
  const totalTiccaPaid = entries.reduce((acc, curr) => acc + curr.ticcaEarned, 0);
  const pendingApprovals = entries.filter(e => e.status === 'Logged-By-Sardar').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 overflow-y-auto">
      {/* Toast Notification */}
      {statusNotice && (
        <div className="fixed top-16 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-emerald-300 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Top Banner: Assam Tea Garden Special Module */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-800/40 px-4 md:px-8 py-5 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                <Sprout className="h-3 w-3 text-emerald-400" />
                Plantations Labour Act (PLA) & Assam Special Module
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                চাহ বাগিচা বিশেষ পৰিকাঠামো
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Shramik<span className="text-orange-500">Link</span> Tea Garden & Plantation Suite
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              পৰম্পৰাগত কাগজৰ <strong className="text-amber-300 font-semibold">"হাজিৰা বহী"</strong> সম্পূৰ্ণৰূপে সলনি কৰি চৰ্দাৰ আৰু ছুপাৰভাইজাৰৰ মাজত স্বচ্ছ ডিজিটেল পাত তোলাৰ জোখ (Green Leaf Weighment), নিৰিখ (Hazira), অধিক পাতৰ প্ৰতিদান (Ticca) আৰু ত্ৰিপাক্ষিক বোনাছ প্ৰতিষ্ঠা।
            </p>
          </div>

          {/* Estate Selector & Session Exit Controls */}
          <div className="flex flex-col gap-2 shrink-0 min-w-[260px]">
            <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-2xl flex flex-col gap-1.5 shadow-lg">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <Building className="h-3 w-3 text-emerald-400" />
                চাহ বাগিচা বাছক (Estate):
              </span>
              <select
                value={selectedEstateId}
                onChange={(e) => setSelectedEstateId(e.target.value)}
                className="bg-slate-800 text-white font-bold text-xs rounded-xl px-3 py-2 border border-slate-600 focus:outline-hidden focus:border-emerald-400 cursor-pointer"
              >
                {SAMPLE_ESTATES.map(est => (
                  <option key={est.id} value={est.id}>{est.estateName}</option>
                ))}
              </select>
              <div className="text-[10px] text-slate-400 font-mono">
                পঞ্জীয়ন: <strong className="text-emerald-300">{selectedEstate.regNo}</strong> ({selectedEstate.district})
              </div>
            </div>

            {/* Prominent Log Out / Exit Button */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="tea-garden-return-app-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('open-app-tab'))}
                title="মুখ্য পেনেললৈ যাওক (Go to Main Workspace)"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <Home className="h-3.5 w-3.5 text-emerald-400" />
                <span>মুখ্য পেনেল</span>
              </button>

              <button
                type="button"
                id="tea-garden-logout-btn"
                onClick={handleExitOrLogout}
                title="লগ আউট কৰক (Log Out & Exit Session)"
                className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md border border-rose-500 active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>লগ আউট (Exit)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-5 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveSubTab('sardar_panel')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === 'sardar_panel'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>১. চৰ্দাৰ পেনেল (Sardar Gang Portal)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('supervisor_ledger')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === 'supervisor_ledger'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Scale className="h-3.5 w-3.5" />
            <span>২. ছুপাৰভাইজাৰ ডিজিটেল হাজিৰা বহী (Digital Ledger)</span>
            {pendingApprovals > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {pendingApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('dual_bonus')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === 'dual_bonus'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>৩. দ্বৈত খণ্ড বোনাছ তুলনা (Bonus Act vs Tripartite)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('micro_saas')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              activeSubTab === 'micro_saas'
                ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>৪. ₹১/শ্ৰমিক/দিন Micro-SaaS ৰাজহ & ROI</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-4 md:p-6 space-y-6 flex-1">
        {/* ========================================================================= */}
        {/* TAB 1: SARDAR GANG LEADER PORTAL */}
        {/* ========================================================================= */}
        {activeSubTab === 'sardar_panel' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Sardar Identification Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-lg">
                  👨‍🌾
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{selectedSardar.name}</h3>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                      প্ৰমাণিত চৰ্দাৰ (Gang Leader)
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3 flex-wrap">
                    <span>দল: <strong className="text-slate-200">{selectedSardar.gangNo}</strong></span>
                    <span>•</span>
                    <span>ফিল্ড ছেকচন: <strong className="text-slate-200">{selectedSardar.assignedSection}</strong></span>
                    <span>•</span>
                    <span>ফোন: <span className="font-mono text-slate-300">{selectedSardar.phone}</span></span>
                  </div>
                </div>
              </div>

              {/* Sardar Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">চৰ্দাৰ সলনি কৰক:</span>
                <select
                  value={selectedSardarId}
                  onChange={(e) => setSelectedSardarId(e.target.value)}
                  className="bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2 border border-slate-700 cursor-pointer"
                >
                  {SAMPLE_SARDARS.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.gangNo})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block font-medium">আজিৰ মুঠ সংগৃহীত সেউজীয়া পাত</span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                  {totalNetLeafKg.toFixed(1)} <span className="text-xs text-slate-400 font-normal">kg</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">পানী আৰু ডাঠ পাত ৰেহাইৰ পাছত</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block font-medium">মুঠ দৈনিক হাজিৰা মজুৰি</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  ₹{totalWagesToday.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">PLA নূন্যতম নিৰিখ ভিত্তিত</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block font-medium">মুঠ অতিৰিক্ত পাতৰ প্ৰতিদান (Ticca)</span>
                <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                  ₹{totalTiccaPaid.toFixed(2)}
                </span>
                <span className="text-[10px] text-amber-300/80 block mt-1">নিৰিখৰ অতিৰিক্ত পাতৰ বোনাস</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block font-medium">অনুমোদন বাকী (Pending Approval)</span>
                <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">
                  {pendingApprovals} <span className="text-xs text-slate-400 font-normal">শ্ৰমিক</span>
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">ছুপাৰভাইজাৰ ভেৰিফিকেচনৰ বাবে</span>
              </div>
            </div>

            {/* Plucking & Daily Task Entry Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Scale className="h-5 w-5 text-emerald-400" />
                    চৰ্দাৰ ডিজিটেল ওজন আৰু হাজিৰা এন্ট্ৰি (Digital Leaf Scale & Hazira Entry)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ফিল্ড স্কেলৰ পৰা পোনে পোনে প্ৰতিজন শ্ৰমিকৰ পাতৰ জোখ আৰু হাজিৰা অনলাইন বহীত অন্তৰ্ভুক্ত কৰক
                  </p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-mono font-bold border border-emerald-500/30">
                  তাৰিখ: {new Date().toLocaleDateString('en-GB')}
                </span>
              </div>

              <form onSubmit={handleAddPluckingEntry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      শ্ৰমিকৰ টোকেন নম্বৰ (Token No.):
                    </label>
                    <input
                      type="text"
                      required
                      value={newWorkerToken}
                      onChange={(e) => setNewWorkerToken(e.target.value)}
                      placeholder="e.g. TK-415"
                      className="w-full bg-slate-800 text-white font-mono font-bold text-xs rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-hidden focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      শ্ৰমিকৰ সম্পূৰ্ণ নাম (Worker Name):
                    </label>
                    <input
                      type="text"
                      required
                      value={newWorkerName}
                      onChange={(e) => setNewWorkerName(e.target.value)}
                      placeholder="e.g. Sunita Karmakar"
                      className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-hidden focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      কামৰ প্ৰকাৰ (Task Category):
                    </label>
                    <select
                      value={newTaskType}
                      onChange={(e) => setNewTaskType(e.target.value as any)}
                      className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl px-3 py-2.5 border border-slate-700 focus:outline-hidden focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="Plucking">🍃 পাত তোলা (Green Leaf Plucking)</option>
                      <option value="Pruning">✂️ কলম কৰা (Bush Pruning)</option>
                      <option value="Hoeing">⛏️ কোৰ মৰা (Hoeing / Weeding)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      বাগিচাৰ ছেকচন (Plucking Section):
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedSardar.assignedSection}
                      className="w-full bg-slate-800/60 text-slate-300 text-xs rounded-xl px-3 py-2.5 border border-slate-700/60 font-medium"
                    />
                  </div>
                </div>

                {newTaskType === 'Plucking' && (
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                    <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">
                      ⚖️ ডিজিটেল স্কেলৰ জোখ (Green Leaf Weighment Metrics):
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block">কেঁচা পাতৰ ওজন (Gross Kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newGrossLeaf}
                          onChange={(e) => setNewGrossLeaf(Number(e.target.value))}
                          className="w-full bg-slate-800 text-white font-mono font-bold text-xs rounded-lg px-2.5 py-2 border border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">পানী/ৰেহাই (Deduction Kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={newDeduction}
                          onChange={(e) => setNewDeduction(Number(e.target.value))}
                          className="w-full bg-slate-800 text-rose-300 font-mono font-bold text-xs rounded-lg px-2.5 py-2 border border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">প্ৰকৃত ওজন (Net Leaf Kg)</label>
                        <input
                          type="text"
                          readOnly
                          value={`${netLeaf} kg`}
                          className="w-full bg-slate-900 text-emerald-300 font-mono font-black text-xs rounded-lg px-2.5 py-2 border border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">নিৰিখ কোটা (Hazira Quota)</label>
                        <input
                          type="number"
                          value={newHaziraQuota}
                          onChange={(e) => setNewHaziraQuota(Number(e.target.value))}
                          className="w-full bg-slate-800 text-slate-300 font-mono text-xs rounded-lg px-2.5 py-2 border border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">অতিৰিক্ত পাত (Ticca Kg)</label>
                        <input
                          type="text"
                          readOnly
                          value={`${ticcaKg} kg`}
                          className="w-full bg-slate-900 text-amber-300 font-mono font-bold text-xs rounded-lg px-2.5 py-2 border border-slate-700"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-400 block">অতিৰিক্ত হাৰ (Ticca Rate)</label>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={newTiccaRate}
                            onChange={(e) => setNewTiccaRate(Number(e.target.value))}
                            className="w-full bg-slate-800 text-amber-300 font-mono text-xs rounded-lg px-2 py-2 border border-slate-700"
                          />
                          <span className="text-[10px] text-slate-400">/kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Wage Calculation Summary */}
                    <div className="bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
                      <div className="text-xs text-slate-300">
                        দৈনিক নিৰিখ মজুৰি: <strong className="text-white font-mono">₹{newDailyHaziraWage}</strong> + অধিক পাতৰ প্ৰতিদান (Ticca): <strong className="text-amber-300 font-mono">₹{ticcaEarned}</strong> ({ticcaKg} kg × ₹{newTiccaRate})
                      </div>
                      <div className="text-sm font-black text-emerald-300 font-mono">
                        আজিৰ প্ৰাপ্য মজুৰি: ₹{totalWage}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>চৰ্দাৰ হাজিৰা বহীত অন্তৰ্ভুক্ত কৰক (Submit to Gang Ledger)</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Current Gang Plucking Records */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  📋 আজিৰ দলীয় শ্ৰমিক হাজিৰা খতিয়ান ({selectedSardar.gangNo})
                </h4>
                <span className="text-xs text-slate-400 font-mono">মুঠ এন্ট্ৰি: {entries.length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="p-3">টোকেন / নাম</th>
                      <th className="p-3">কামৰ ধৰণ</th>
                      <th className="p-3">প্ৰকৃত পাত (Net Kg)</th>
                      <th className="p-3">নিৰিখ (Hazira)</th>
                      <th className="p-3">অধিক পাত (Ticca)</th>
                      <th className="p-3">মুঠ মজুৰি</th>
                      <th className="p-3">স্থিতি (Status)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{entry.workerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{entry.tokenNo} • {entry.section}</div>
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                            {entry.taskType}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {entry.taskType === 'Plucking' ? `${entry.netLeafKg} kg` : '-'}
                        </td>
                        <td className="p-3 font-mono text-slate-300">
                          ₹{entry.haziraWage}
                        </td>
                        <td className="p-3 font-mono text-amber-300">
                          {entry.ticcaKg > 0 ? `+₹${entry.ticcaEarned} (${entry.ticcaKg}kg)` : '—'}
                        </td>
                        <td className="p-3 font-mono font-bold text-white">
                          ₹{entry.totalWageToday}
                        </td>
                        <td className="p-3">
                          {entry.status === 'Approved-By-Supervisor' ? (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                              <CheckCircle2 className="h-3 w-3" /> ছুপাৰভাইজাৰে অনুমোদিত
                            </span>
                          ) : entry.status === 'Muster-Locked' ? (
                            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                              <Lock className="h-3 w-3" /> মাষ্টাৰ ৰোল লকড
                            </span>
                          ) : (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit">
                              <Clock className="h-3 w-3" /> চৰ্দাৰ এন্ট্ৰি (পৰিদৰ্শন বাকী)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SUPERVISOR DIGITAL LEDGER (HAJIRA BAHI REPLACEMENT) */}
        {/* ========================================================================= */}
        {activeSubTab === 'supervisor_ledger' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header / Summary Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Paperless Field Management
                </span>
                <h3 className="text-lg font-black text-white mt-1 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emerald-400" />
                  ছুপাৰভাইজাৰ ডিজিটেল হাজিৰা বহী (Supervisor Digital Muster Ledger)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  চৰ্দাৰসকলে ফিল্ডত লোৱা পাতৰ জোখ ছুপাৰভাইজাৰে ডিজিটেল মোহৰ লগাই প্ৰমাণিত কৰে আৰু কাৰখানালৈ পাত প্ৰেৰণ নিশ্চিত কৰে।
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleBatchApproveAll}
                  disabled={pendingApprovals === 0}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                    pendingApprovals > 0
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>সকলো একেলগে সত্যাপন কৰক (Batch Verify All)</span>
                </button>

                <button
                  onClick={handleLockMuster}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer border border-indigo-400/40"
                >
                  <Lock className="h-4 w-4" />
                  <span>মাষ্টাৰ ৰোল লক & EPF/ESI চালান জেনেৰেট</span>
                </button>
              </div>
            </div>

            {/* Verification Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block font-medium">কাৰখানালৈ প্ৰেৰণ কৰা মুঠ সেউজীয়া পাত</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-emerald-400 font-mono">{totalNetLeafKg.toFixed(1)}</span>
                  <span className="text-xs text-slate-400 font-mono">kg ({ (totalNetLeafKg / 100).toFixed(2) } Quintal)</span>
                </div>
                <span className="text-[10px] text-emerald-400 block mt-1">ফেক্টৰী ওৱে-ব্ৰীজৰ সৈতে মিল খোৱা</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block font-medium">মুঠ অনুমোদন বাকী থকা এন্ট্ৰি</span>
                <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                  {pendingApprovals} / {entries.length}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">চৰ্দাৰৰ পৰা গৃহীত ৰেকৰ্ড</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs text-slate-400 block font-medium">মুঠ মজুৰি দায়বদ্ধতা (Daily Wage Liability)</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  ₹{totalWagesToday.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">নিৰিখ + অধিক পাতৰ প্ৰতিদান</span>
              </div>
            </div>

            {/* Supervisor Ledger Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  বাগিচাৰ দৈনিক ডিজিটেল হাজিৰা বহী (Digital Hajira Bahi)
                </h4>
                <span className="text-xs text-slate-400 font-mono">বাগিচা: {selectedEstate.estateName}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="p-3">শ্ৰমিকৰ বিৱৰণ</th>
                      <th className="p-3">চৰ্দাৰ আৰু দল</th>
                      <th className="p-3">ফিল্ড ছেকচন</th>
                      <th className="p-3">পাতৰ ওজন (Net Kg)</th>
                      <th className="p-3">নিৰিখ + Ticca</th>
                      <th className="p-3">মুঠ প্ৰাপ্য</th>
                      <th className="p-3">ছুপাৰভাইজাৰ কাৰ্য</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {entries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white">{entry.workerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">টোকেন: {entry.tokenNo}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-300 font-bold">{entry.sardarName}</div>
                          <div className="text-[10px] text-slate-400">{entry.gangNo}</div>
                        </td>
                        <td className="p-3 text-slate-300">
                          {entry.section}
                        </td>
                        <td className="p-3 font-mono font-bold text-emerald-400">
                          {entry.taskType === 'Plucking' ? (
                            <span>{entry.netLeafKg} kg <span className="text-[10px] text-slate-500 font-normal">(-{entry.leafDeductionKg}kg)</span></span>
                          ) : (
                            <span className="text-slate-400">{entry.taskType}</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-slate-300">
                          ₹{entry.haziraWage} {entry.ticcaEarned > 0 && <span className="text-amber-400 font-bold">+ ₹{entry.ticcaEarned}</span>}
                        </td>
                        <td className="p-3 font-mono font-bold text-white">
                          ₹{entry.totalWageToday}
                        </td>
                        <td className="p-3">
                          {entry.status === 'Approved-By-Supervisor' ? (
                            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>অনুমোদিত ({entry.approvedAt || 'সত্যাপিত'})</span>
                            </div>
                          ) : entry.status === 'Muster-Locked' ? (
                            <span className="text-indigo-300 text-xs font-bold flex items-center gap-1">
                              <Lock className="h-3.5 w-3.5" /> চালান সংলগ্ন
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApproveEntry(entry.id)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>সত্যাপন কৰক (Verify)</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DUAL SECTOR GOVERNANCE & BONUS COMPARATOR */}
        {/* ========================================================================= */}
        {activeSubTab === 'dual_bonus' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Explanatory Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  দ্বৈত খণ্ড বোনাছ পৰিচালনা নীতি (Dual Sector Bonus & Wage Governance)
                </h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
                ShramikLink প্লেটফৰ্মে সাধাৰণ উৎপাদন কাৰখানা আৰু অসমৰ চাহ বাগিচাসমূহৰ মাজত থকা আইনী পাৰ্থক্য বুজি দুয়োটা খণ্ডৰ বাবে পৃথক আৰু সঠিক নিয়ম প্ৰয়োগ কৰে।
              </p>

              {/* Sector Selector */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setBonusSector('tea_garden');
                    setBonusPercentage(20);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    bonusSector === 'tea_garden'
                      ? 'bg-emerald-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Sprout className="h-4 w-4" />
                  <span>🍃 চাহ বাগিচা খণ্ড (Plantation & ACMS Tripartite Agreement)</span>
                </button>

                <button
                  onClick={() => {
                    setBonusSector('manufacturing');
                    setBonusPercentage(8.33);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                    bonusSector === 'manufacturing'
                      ? 'bg-indigo-500 text-white shadow-md ring-2 ring-indigo-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>🏭 সাধাৰণ উৎপাদন কাৰখানা (Payment of Bonus Act, 1965)</span>
                </button>
              </div>
            </div>

            {/* Comparison Cards Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Card 1: General Manufacturing Rules */}
              <div className={`border rounded-2xl p-5 space-y-4 ${
                bonusSector === 'manufacturing' 
                  ? 'bg-slate-900 border-indigo-500 shadow-xl ring-2 ring-indigo-500/20' 
                  : 'bg-slate-900/60 border-slate-800 opacity-70'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                    Payment of Bonus Act, 1965
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">কাৰখানা আইন (Factories Act)</span>
                </div>

                <h4 className="text-base font-bold text-white">
                  সাধাৰণ ঔদ্যোগিক কাৰখানা (Manufacturing Sector)
                </h4>

                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span><strong>আইনী পৰিসীমা:</strong> নূন্যতম <strong>৮.৩৩%</strong> ৰ পৰা সৰ্বোচ্চ <strong>২০%</strong> লৈ (মজজুৰিৰ সীমা ₹৭,০০০ বা নূন্যতম চৰকাৰী হাৰ)।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span><strong>ভিত্তি:</strong> কোম্পানীৰ অডিট কৰা বাৰ্ষিক লাভালাভ (Allocable Surplus) আৰু কৰ বিয়োগৰ পাছৰ হিচাপ।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span><strong>প্ৰদানৰ সময়সীমা:</strong> বিত্তীয় বৰ্ষ সমাপ্তিৰ ৮ মাহৰ ভিতৰত প্ৰদান বাধ্যতামূলক।</span>
                  </li>
                </ul>

                <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-xl">
                  <span className="text-[11px] font-bold text-indigo-300 block mb-1">সাধাৰণ ঔদ্যোগিক বোনাছ গণনা:</span>
                  <span className="text-xs text-slate-300">
                    মজুৰি ₹৭,০০০ × ৮.৩৩% = <strong>₹৫৯৯/মাহ</strong> (বাৰ্ষিক ₹৭,১৮৮ প্ৰতি শ্ৰমিক)
                  </span>
                </div>
              </div>

              {/* Card 2: Tea Garden Tripartite Rules */}
              <div className={`border rounded-2xl p-5 space-y-4 ${
                bonusSector === 'tea_garden' 
                  ? 'bg-slate-900 border-emerald-500 shadow-xl ring-2 ring-emerald-500/20' 
                  : 'bg-slate-900/60 border-slate-800 opacity-70'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                    Plantations Labour Act & Tripartite
                  </span>
                  <span className="text-[10px] text-amber-300 font-bold">পূজা বোনাছ চুক্তি (ACMS)</span>
                </div>

                <h4 className="text-base font-bold text-white">
                  অসমৰ চাহ বাগিচা খণ্ড (Tea Plantation Sector)
                </h4>

                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>ত্ৰিপাক্ষিক চুক্তি:</strong> দুৰ্গাপূজাৰ পূৰ্বে বাগিচা মালিক সন্থা (ABITA/TAI/TEA), অসম চাহ মজদুৰ সংঘ (ACMS) আৰু চৰকাৰী শ্ৰম বিভাগৰ মাজত স্বাক্ষৰিত হয়।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>বোনাছ হাৰ:</strong> সাধাৰণতে সৰ্বোচ্চ <strong>২০%</strong> (বা ১৯%) হাৰত পূজাৰ এসপ্তাহ পূৰ্বে একেলগে প্ৰদান কৰা হয়।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span><strong>হাজিৰা আৰু নিৰিখ:</strong> পাত তোলাৰ দৈনিক নিৰিখ (Hazira) আৰু অতিৰিক্ত পাতৰ ইনচেণ্টিভ (Ticca) সুকীয়াকৈ মাহেকীয়া মজুৰিত যোগ হয়।</span>
                  </li>
                </ul>

                <div className="bg-emerald-950/40 border border-emerald-500/30 p-3.5 rounded-xl">
                  <span className="text-[11px] font-bold text-emerald-300 block mb-1">বাৰ্ষিক দুৰ্গাপূজা বোনাছ চুক্তিৰ আৰ্হি:</span>
                  <span className="text-xs text-slate-300">
                    বাৰ্ষিক মজুৰি ₹৭৮,০০০ × <strong>২০%</strong> = <strong>₹১৫,৬০০ প্ৰতি শ্ৰমিক</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Bonus Disbursement Engine */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
              <h4 className="font-bold text-white text-base flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" />
                লাইভ বোনাছ পৰিশোধ আৰু দায়বদ্ধতা কেলকুলেটৰ ({bonusSector === 'tea_garden' ? 'চাহ বাগিচা' : 'ঔদ্যোগিক কাৰখানা'})
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">শ্ৰমিকৰ সংখ্যা (Worker Count):</label>
                  <input
                    type="number"
                    value={bonusWorkerCount}
                    onChange={(e) => setBonusWorkerCount(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white font-mono font-bold text-xs rounded-xl px-3 py-2.5 border border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">গড় মাহেকীয়া মজুৰি (Monthly Basic+DA):</label>
                  <input
                    type="number"
                    value={averageMonthlyWage}
                    onChange={(e) => setAverageMonthlyWage(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white font-mono font-bold text-xs rounded-xl px-3 py-2.5 border border-slate-700"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    বোনাছ শতাংশ (Bonus Percentage %):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={8.33}
                      max={20}
                      step={0.5}
                      value={bonusPercentage}
                      onChange={(e) => setBonusPercentage(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <span className="font-mono font-bold text-emerald-400 text-sm">{bonusPercentage}%</span>
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              {(() => {
                const annualWagePerWorker = averageMonthlyWage * 12;
                const bonusPerWorker = Math.round(annualWagePerWorker * (bonusPercentage / 100));
                const totalDisbursement = bonusPerWorker * bonusWorkerCount;

                return (
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-400">প্ৰতিজন শ্ৰমিকৰ বাৰ্ষিক বোনাছ ধনৰাশি:</span>
                      <div className="text-lg font-black text-amber-300 font-mono">
                        ₹{bonusPerWorker.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-slate-400">মুঠ প্ৰতিষ্ঠানিক বোনাছ পৰিশোধ পুঁজি ({bonusWorkerCount} শ্ৰমিক):</span>
                      <div className="text-2xl font-black text-emerald-400 font-mono">
                        ₹{totalDisbursement.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      onClick={() => showNotification('📄 ত্ৰিপাক্ষিক বোনাছ রেজিস্টাৰ আৰু শ্ৰমিকৰ মজুৰি খতিয়ান প্ৰস্তুত কৰা হ’ল।')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="h-4 w-4" />
                      <span>বোনাছ খতিয়ান ৰেকৰ্ড ডাউনলোড</span>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ₹1 PER WORKER PER DAY MICRO-SAAS REVENUE & ROI */}
        {/* ========================================================================= */}
        {activeSubTab === 'micro_saas' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  Business & Revenue Model
                </span>
                <span className="text-xs text-slate-400">• প্ৰতিষ্ঠাপক: ভাস্কৰ সেনাপতি (Founder: Bhaskar Senapati)</span>
              </div>
              <h3 className="text-xl font-black text-white">
                ₹১ প্ৰতিজন শ্ৰমিকৰ বাবদ দৈনিক Micro-SaaS ব্যৱসায়িক আৰ্হি
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                উচ্চ আয়তন আৰু সুলভ খৰচৰ (High-Volume, Low-Friction) প্ৰযুক্তিগত সেৱা, যাৰ জৰিয়তে অসমৰ চাহ বাগিচা আৰু ঔদ্যোগিক কাৰখানাসমূহে আইনী জৰিমনা আৰু ভুৱা হাজিৰাৰ পৰা লাখে লাখে টকা ৰাহি কৰিব পাৰে।
              </p>
            </div>

            {/* Interactive Revenue Simulator */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-xl space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-white">
                    দৈনিক শ্ৰমিক সংখ্যা বাছক (Active Daily Workers on Platform):
                  </label>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {simWorkerCount.toLocaleString('en-IN')} শ্ৰমিক
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={25000}
                  step={100}
                  value={simWorkerCount}
                  onChange={(e) => setSimWorkerCount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>১০০ শ্ৰমিক</span>
                  <span>৫,০০০ শ্ৰমিক</span>
                  <span>১০,০০০ শ্ৰমিক</span>
                  <span>২৫,০০০ শ্ৰমিক</span>
                </div>
              </div>

              {/* Revenue Matrix */}
              {(() => {
                const dailyRevenue = simWorkerCount * 1;
                const monthlyRevenue = dailyRevenue * 30;
                const annualRevenue = monthlyRevenue * 12;

                // Enterprise ROI metrics
                const ghostLaborLeakageSaved = Math.round(simWorkerCount * 0.04 * 250 * 26); // 4% ghost attendance prevented
                const statutoryPenaltyAvoided = 350000; // Average CLRA / PLA inspection penalty avoided
                const totalEnterpriseValue = ghostLaborLeakageSaved + (statutoryPenaltyAvoided / 12);
                const roiPercentage = Math.round((totalEnterpriseValue / monthlyRevenue) * 100);

                return (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <span className="text-[11px] text-slate-400 font-medium block">দৈনিক চফ্টৱেৰ মাচুল (₹১/শ্ৰমিক)</span>
                        <span className="text-2xl font-black text-white font-mono mt-1 block">
                          ₹{dailyRevenue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">প্ৰতিদিনে বিলিং গণনা</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <span className="text-[11px] text-slate-400 font-medium block">মাহেকীয়া SaaS ৰাজহ (Monthly Recurring)</span>
                        <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                          ₹{monthlyRevenue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-300 block mt-1">স্বয়ংক্রিয় ক্লাউড ইনভয়েচিং</span>
                      </div>

                      <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                        <span className="text-[11px] text-slate-400 font-medium block">বাৰ্ষিক চুক্তিৰ মূল্য (Annual ARR)</span>
                        <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                          ₹{annualRevenue.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-amber-300 block mt-1">বাৰ্ষিক এন্টাৰপ্ৰাইজ চুক্তি</span>
                      </div>
                    </div>

                    {/* ROI Box for Principal Employers */}
                    <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 border border-emerald-500/40 p-5 rounded-xl space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                        <h4 className="font-bold text-white text-sm">
                          প্ৰতিষ্ঠানৰ লাভালাভ আৰু আইনী সুৰক্ষা (Enterprise Value & ROI Proposition)
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">ভুৱা হাজিৰা ৰোধেৰে মাহেকীয়া সঞ্চয়:</span>
                          <span className="text-sm font-black text-emerald-300 font-mono">
                            ₹{ghostLaborLeakageSaved.toLocaleString('en-IN')} /মাহ
                          </span>
                        </div>

                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">CLRA/PLA জৰিমনাৰ পৰা ৰেহাই:</span>
                          <span className="text-sm font-black text-emerald-300 font-mono">
                            ₹৩.৫০ লাখ+ সুৰক্ষা
                          </span>
                        </div>

                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block">মুঠ বিনিয়োগৰ প্ৰতিদান (ROI):</span>
                          <span className="text-sm font-black text-amber-300 font-mono">
                            {roiPercentage}% প্ৰতিদান
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 italic pt-1">
                        * চাহ বাগিচা বা কাৰখানাই শ্ৰমিকৰ বাবে মাহে ₹{monthlyRevenue.toLocaleString('en-IN')} পৰিশোধ কৰি মাহে ₹{ghostLaborLeakageSaved.toLocaleString('en-IN')} তকৈও অধিক ধন অপব্যয়ৰ পৰা ৰক্ষা কৰিব পাৰে।
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Statutory EPF/ESI Challan Generation Modal */}
      {showChallanModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
                <h3 className="font-bold text-white text-base">
                  স্বয়ংক্ৰিয় ষ্টেটিউটৰী EPF আৰু ESI চালান প্ৰস্তুত (Automated Statutory Challans)
                </h3>
              </div>
              <button
                onClick={() => setShowChallanModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl space-y-2">
                <span className="font-bold text-emerald-300 block text-sm">
                  🔒 মাষ্টাৰ ৰোল সফলভাৱে লক কৰা হ’ল (Muster Roll Locked):
                </span>
                <p>
                  বাগিচাৰ {entries.length} জন শ্ৰমিকৰ হাজিৰা আৰু সেউজীয়া পাতৰ ওজন ছুপাৰভাইজাৰ আৰু চৰ্দাৰৰ অনুমোদনৰ পিছত চৰকাৰী নিয়ম অনুসৰি লক কৰা হ'ল। এতিয়া কোনো ধৰণৰ অপ্ৰমাণিত এন্ট্ৰি বা সালসলনি সম্ভৱ নহয়।
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">EPF Electronic Challan:</span>
                  <span className="text-emerald-400 font-bold text-sm">TRRN: 2026/09/PLA/9812</span>
                  <span className="text-[10px] text-slate-400 block mt-1">১২% শ্ৰমিক + ১২% নিয়োগকৰ্তা অংশ</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase">ESI Challan Ref:</span>
                  <span className="text-emerald-400 font-bold text-sm">ESI/AS/2026/7741</span>
                  <span className="text-[10px] text-slate-400 block mt-1">০.৭৫% শ্ৰমিক + ৩.২৫% নিয়োগকৰ্তা অংশ</span>
                </div>
              </div>

              <p className="text-slate-400 text-[11px]">
                এই চালানে নিশ্চিত কৰে যে ঠিকাদাৰ বা বাগিচা কৰ্তৃপক্ষই শ্ৰমিকৰ মজুৰিৰ পৰা ধন কাটি চৰকাৰী কোষাগাৰত জমা নিদিয়াকৈ বিল অনুমোদন কৰিব নোৱাৰে (Compliance-Locked Billing Guaranteed).
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowChallanModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                বন্ধ কৰক (Close)
              </button>
              <button
                onClick={() => {
                  setShowChallanModal(false);
                  showNotification('📄 চৰকাৰী EPF/ESI চালান PDF প্ৰিণ্টৰ বাবে ডাউনলোড হ’ল।');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                <span>চালান প্ৰিণ্ট কৰক (Print Statutory Challan)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
