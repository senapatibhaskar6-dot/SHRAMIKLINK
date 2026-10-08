import React, { useState } from 'react';
import { 
  Factory,
  User, 
  CheckCircle2, 
  Clock, 
  Award, 
  Laptop, 
  Plus, 
  Check, 
  FileText, 
  ShieldCheck, 
  HardHat, 
  Briefcase, 
  QrCode, 
  UserPlus, 
  Scale
} from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../i18n';
import { LanguageSelector } from './LanguageSelector';
import GovernmentSeparationModal from './GovernmentSeparationModal';

interface MobileSingleViewProps {
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onSwitchToFullDesktop: () => void;
}

interface QuickShiftItem {
  id: string;
  workerName: string;
  tokenNo: string;
  shift: string;
  regularHours: number;
  otHours: number;
  totalWage: number;
  status: 'Approved' | 'Pending';
  time: string;
}

interface WorkerProfile {
  token: string;
  name: string;
  sectionOrTrade: string;
  uan: string;
  esic?: string;
  phone?: string;
  gender?: string;
  bankAcc?: string;
}

export default function MobileSingleView({
  currentLang,
  onLanguageChange,
  onSwitchToFullDesktop
}: MobileSingleViewProps) {
  const t = TRANSLATIONS[currentLang];

  const [isGovModalOpen, setIsGovModalOpen] = useState(false);

  // Active Role Tab: 'contractor' (Attendance / Shift Entry), 'register' (New Worker Onboarding), 'worker', 'supervisor', 'bonus'
  const [mobileTab, setMobileTab] = useState<'contractor' | 'register' | 'worker' | 'supervisor' | 'bonus'>('contractor');
  
  // Toast State
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Wage Slip Modal
  const [showIndustrySlip, setShowIndustrySlip] = useState<boolean>(false);

  // ==========================================
  // MANUFACTURING INDUSTRY DATA & STATE
  // ==========================================
  const [selectedIndWorkerToken, setSelectedIndWorkerToken] = useState<string>('EMP-108');
  const [selectedShift, setSelectedShift] = useState<string>('Shift A (08:00 - 16:00)');
  const [otHoursInput, setOtHoursInput] = useState<string>('2');
  const [indBonusPercent, setIndBonusPercent] = useState<number>(8.33); // 8.33% statutory minimum
  const [indWorkerCount, setIndWorkerCount] = useState<number>(240);

  const [indWorkers, setIndWorkers] = useState<WorkerProfile[]>([
    { token: 'EMP-108', name: 'ৰাহুল বৰ্মন (Rahul Barman)', sectionOrTrade: 'CNC Operator', uan: '101994827102', esic: '1399281728', phone: '9864019281', gender: 'পুৰুষ' },
    { token: 'EMP-109', name: 'অনুপ কলিতা (Anup Kalita)', sectionOrTrade: 'Fitter / Welder', uan: '101994827134', esic: '1399281745', phone: '9864019282', gender: 'পুৰুষ' },
    { token: 'EMP-110', name: 'বিকাশ ডেকা (Bikash Deka)', sectionOrTrade: 'Material Handler', uan: '101994827188', esic: '1399281772', phone: '9864019283', gender: 'পুৰুষ' },
    { token: 'EMP-111', name: 'প্ৰাণজিৎ দাস (Pranjit Das)', sectionOrTrade: 'Quality Inspector', uan: '101994827210', esic: '1399281799', phone: '9864019284', gender: 'পুৰুষ' }
  ]);

  const [indEntries, setIndEntries] = useState<QuickShiftItem[]>([
    {
      id: 'ind-1',
      workerName: 'ৰাহুল বৰ্মন',
      tokenNo: 'EMP-108',
      shift: 'Shift A',
      regularHours: 8,
      otHours: 2,
      totalWage: 720.00, // ₹480 base + ₹240 OT
      status: 'Approved',
      time: '08:05 AM'
    },
    {
      id: 'ind-2',
      workerName: 'অনুপ কলিতা',
      tokenNo: 'EMP-109',
      shift: 'Shift A',
      regularHours: 8,
      otHours: 0,
      totalWage: 480.00,
      status: 'Approved',
      time: '08:12 AM'
    },
    {
      id: 'ind-3',
      workerName: 'বিকাশ ডেকা',
      tokenNo: 'EMP-110',
      shift: 'Shift A',
      regularHours: 8,
      otHours: 1.5,
      totalWage: 660.00,
      status: 'Pending',
      time: '08:25 AM'
    }
  ]);

  const indBaseDailyWage = 480; // ₹480 per 8-hr shift (State Minimum Wage notified)
  const indOtRatePerHour = 120; // 2x normal hourly rate (₹60 x 2 = ₹120/hr under Factories Act)

  const currentOtHours = parseFloat(otHoursInput) || 0;
  const currentOtWage = currentOtHours * indOtRatePerHour;
  const currentIndTotalDailyWage = indBaseDailyWage + currentOtWage;

  const handleAddIndEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const workerObj = indWorkers.find(w => w.token === selectedIndWorkerToken);
    if (!workerObj) return;

    const newEntry: QuickShiftItem = {
      id: `ind-${Date.now()}`,
      workerName: workerObj.name.split(' (')[0],
      tokenNo: workerObj.token,
      shift: selectedShift.split(' ')[0] + ' ' + selectedShift.split(' ')[1],
      regularHours: 8,
      otHours: currentOtHours,
      totalWage: currentIndTotalDailyWage,
      status: 'Pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setIndEntries([newEntry, ...indEntries]);
    setShowSuccessToast(`${workerObj.token} (${workerObj.name.split(' (')[0]}) ৰ শিফ্ট হাজিৰা সফলভাৱে জমা হ’ল!`);
    setTimeout(() => setShowSuccessToast(null), 3500);
    setOtHoursInput('0');
  };

  const handleApproveIndEntry = (id: string) => {
    setIndEntries(indEntries.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
    setShowSuccessToast(`গে'ট হাজিৰা অনুমোদন সম্পন্ন হ’ল!`);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  // ==========================================
  // DIRECT MOBILE REGISTRATION WORKFLOW STATE
  // ==========================================
  const [regName, setRegName] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regGender, setRegGender] = useState<string>('পুৰুষ');
  const [regAge, setRegAge] = useState<string>('26');
  const [regSectionOrTrade, setRegSectionOrTrade] = useState<string>('CNC Machine Operator');
  const [regAadhaarLast4, setRegAadhaarLast4] = useState<string>('5842');
  const [regUan, setRegUan] = useState<string>('');
  const [regEsic, setRegEsic] = useState<string>('');
  const [regBankAcc, setRegBankAcc] = useState<string>('XXXX9821');
  const [registeredSuccessProfile, setRegisteredSuccessProfile] = useState<WorkerProfile | null>(null);

  const handleRegisterWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    const nextEmpNum = 108 + indWorkers.length;
    const generatedToken = `EMP-${nextEmpNum}`;
    const generatedUan = regUan.trim() || `1019948${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedEsic = regEsic.trim() || `139928${Math.floor(1000 + Math.random() * 9000)}`;

    const newWorker: WorkerProfile = {
      token: generatedToken,
      name: `${regName.trim()} (${generatedToken})`,
      sectionOrTrade: regSectionOrTrade || 'CNC Machine Operator',
      uan: generatedUan,
      esic: generatedEsic,
      phone: regPhone || '98640XXXXX',
      gender: regGender,
      bankAcc: regBankAcc
    };

    setIndWorkers([...indWorkers, newWorker]);
    setSelectedIndWorkerToken(newWorker.token);
    setRegisteredSuccessProfile(newWorker);
    setShowSuccessToast(`কাৰখানা শ্ৰমিক ${newWorker.token} (${regName}) ৰ CLRA পঞ্জীয়ন সফল হ’ল!`);
    setTimeout(() => setShowSuccessToast(null), 4000);

    // Reset Form
    setRegName('');
    setRegPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans max-w-md mx-auto relative shadow-2xl overflow-x-hidden pb-20">
      
      {/* 1. Mobile App Top Header (Pure Industry / Factory Standalone) */}
      <header className="px-4 py-3 border-b flex items-center justify-between sticky top-0 z-30 shadow-md bg-slate-950 border-indigo-900/60 text-indigo-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs border bg-slate-900 border-indigo-500/50 text-indigo-300 overflow-hidden p-0.5">
            <img src="/ICWL.png" alt="ICWL Logo" className="w-full h-full object-contain rounded-lg" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-1.5">
              <span>ICWL</span>
              <span className="text-indigo-400 font-medium text-xs font-mono">(IndustrialContractorWorkerLink)</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-1.5 py-0.2 rounded-full border border-indigo-500/30">CLRA</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">
              কামৰূপ কাৰখানা মণ্ডল • EPFO/ESIC সংৰক্ষিত
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector 
            currentLang={currentLang} 
            onLanguageChange={onLanguageChange} 
            variant="header" 
          />
          <button
            onClick={onSwitchToFullDesktop}
            title="ডেস্কটপ সম্পূৰ্ণ ডেচবৰ্ড খোলক"
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl text-xs flex items-center gap-1 border border-slate-700 cursor-pointer active:scale-95"
          >
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-bold hidden sm:inline">Desktop</span>
          </button>
        </div>
      </header>

      {/* Official Government Brief Button for Mobile */}
      <div className="bg-slate-950 px-3.5 py-2 border-b border-slate-800">
        <button
          onClick={() => setIsGovModalOpen(true)}
          className="w-full bg-gradient-to-r from-indigo-500/20 to-blue-500/20 hover:from-indigo-500/30 border border-indigo-500/40 text-indigo-300 font-bold py-1.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Scale className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span>🏛️ ঔদ্যোগিক শ্ৰম আইন ও বিধি সংৰচনা (Factories Act & CLRA)</span>
        </button>
      </div>

      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-24 left-4 right-4 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-950" />
          <span>{showSuccessToast}</span>
        </div>
      )}

      {/* 2. Role Picker Tabs (Thumb-Friendly, 5 Roles for Industrial Ecosystem) */}
      <div className="p-2.5 bg-slate-950 border-b border-slate-800/80">
        <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          
          {/* Tab 1: Hajira (Contractor / Thekedar) */}
          <button
            onClick={() => setMobileTab('contractor')}
            className={`py-2 px-0.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mobileTab === 'contractor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardHat className="h-3.5 w-3.5" />
            <span className="text-[9px] whitespace-nowrap">ঠিকাদাৰ</span>
          </button>

          {/* Tab 2: DIRECT REGISTRATION PANEL */}
          <button
            onClick={() => setMobileTab('register')}
            className={`py-2 px-0.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mobileTab === 'register'
                ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span className="text-[9px] whitespace-nowrap">পঞ্জীয়ন</span>
          </button>

          {/* Tab 3: Worker Pass */}
          <button
            onClick={() => setMobileTab('worker')}
            className={`py-2 px-0.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mobileTab === 'worker'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span className="text-[9px] whitespace-nowrap">শ্ৰমিক</span>
          </button>

          {/* Tab 4: Supervisor */}
          <button
            onClick={() => setMobileTab('supervisor')}
            className={`py-2 px-0.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mobileTab === 'supervisor'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="text-[9px] whitespace-nowrap">অনুমোদন</span>
          </button>

          {/* Tab 5: Bonus */}
          <button
            onClick={() => setMobileTab('bonus')}
            className={`py-2 px-0.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mobileTab === 'bonus'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span className="text-[9px] whitespace-nowrap">বোনাছ</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 p-3.5 space-y-4">

        {/* ========================================================= */}
        {/* DIRECT WORKER REGISTRATION TAB (ON-SPOT ONBOARDING)       */}
        {/* ========================================================= */}
        {mobileTab === 'register' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* Header Card */}
            <div className="bg-gradient-to-r from-amber-950/70 to-slate-900 border border-amber-500/40 p-3.5 rounded-2xl shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white">
                    কাৰখানা শ্ৰমিক দ্ৰুত পঞ্জীয়ন (Factory Onboarding)
                  </h3>
                  <div className="text-[10px] text-amber-300 font-semibold">
                    CLRA Form XIII &bull; Apex Manpower Solutions
                  </div>
                </div>
              </div>
              <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold">
                অন-স্পট (On-Spot)
              </span>
            </div>

            {/* Registration Success Badge (If registered just now) */}
            {registeredSuccessProfile && (
              <div className="bg-emerald-950/90 border-2 border-emerald-500 p-4 rounded-2xl shadow-xl space-y-3 animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-emerald-500/40 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <div>
                      <span className="text-[10px] text-emerald-300 font-bold uppercase">পঞ্জীয়ন সম্পন্ন হ’ল! (Registration Confirmed)</span>
                      <h4 className="text-sm font-black text-white">{registeredSuccessProfile.name}</h4>
                    </div>
                  </div>
                  <div className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg font-mono shadow-xs">
                    {registeredSuccessProfile.token}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">বিভাগ / ট্ৰেড</span>
                    <strong className="text-white">{registeredSuccessProfile.sectionOrTrade}</strong>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block">EPF UAN নম্বৰ</span>
                    <strong className="text-emerald-400 font-mono">{registeredSuccessProfile.uan}</strong>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-6 w-6 text-emerald-400" />
                    <div>
                      <span className="text-slate-300 font-bold block">ডিজিটেল পৰিচয় পাছ সক্ৰিয়</span>
                      <span className="text-slate-400 text-[9px]">Zero-Proxy Biometric Verified</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">100% Valid</span>
                </div>

                {/* Quick Action to immediately punch hazira for this worker */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileTab('contractor');
                      setSelectedIndWorkerToken(registeredSuccessProfile.token);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-2.5 rounded-xl text-[11px] flex items-center justify-center gap-1 cursor-pointer shadow-md active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>এতিয়াই হাজিৰা লওক</span>
                  </button>
                  <button
                    onClick={() => setRegisteredSuccessProfile(null)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-[11px] border border-slate-700 cursor-pointer active:scale-95"
                  >
                    + আন এজন পঞ্জীয়ন
                  </button>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shadow-lg space-y-3.5">
              <div className="border-b border-slate-700/80 pb-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  CLRA Form XIII & Factories Act Onboarding
                </span>
                <h3 className="text-xs font-black text-white mt-0.5">নতুন কাৰখানা শ্ৰমিকৰ তথ্য অন্তৰ্ভুক্ত কৰক</h3>
              </div>

              <form onSubmit={handleRegisterWorkerSubmit} className="space-y-3">
                {/* 1. Full Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    শ্ৰমিকৰ সম্পূৰ্ণ নাম (Worker Full Name): <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="যেনে: ৰমেন কলিতা / বিকাশ শইকীয়া"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                {/* 2. Phone and Gender */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      মোবাইল নম্বৰ (Phone):
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        maxLength={10}
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="9864012345"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-white focus:outline-hidden focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      লিংগ (Gender):
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-bold text-white focus:outline-hidden focus:border-amber-500 cursor-pointer"
                    >
                      <option value="পুৰুষ">পুৰুষ (Male)</option>
                      <option value="মহিলা">মহিলা (Female)</option>
                      <option value="অন্যান্য">অন্যান্য (Other)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Section / Trade */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    কাৰখানাৰ কামৰ ট্ৰেড (Trade / Section):
                  </label>
                  <select
                    value={regSectionOrTrade}
                    onChange={(e) => setRegSectionOrTrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-hidden focus:border-amber-500 cursor-pointer"
                  >
                    <option value="CNC Machine Operator">CNC Machine Operator (মেচিন অপাৰেটৰ)</option>
                    <option value="Fitter / Welder">Fitter / Welder (ফিটাৰ / ৱেল্ডাৰ)</option>
                    <option value="Material Handler">Material Handler (লোডিং / আনলোডিং)</option>
                    <option value="Assembly Line Technician">Assembly Line Technician (সংযোজন)</option>
                    <option value="General Helper">General Helper (সাধাৰণ সহায়ক)</option>
                  </select>
                </div>

                {/* 4. Aadhaar and EPF UAN */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      আধাৰ শেষ ৪টা সংখ্যা:
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={regAadhaarLast4}
                      onChange={(e) => setRegAadhaarLast4(e.target.value)}
                      placeholder="5842"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono font-bold text-white focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      EPF UAN (বা খালি থওক):
                    </label>
                    <input
                      type="text"
                      value={regUan}
                      onChange={(e) => setRegUan(e.target.value)}
                      placeholder="স্বয়ংক্ৰিয় সৃষ্টি"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono text-emerald-300 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Bank Account for Wages & Yearly Bonus */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    বেংক একাউণ্ট (মজুৰি আৰু বাৰ্ষিক বোনাছৰ বাবে):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={regBankAcc}
                      onChange={(e) => setRegBankAcc(e.target.value)}
                      placeholder="A/C No. e.g. 3982104"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
                    />
                    <input
                      type="text"
                      defaultValue="SBIN0001245"
                      placeholder="IFSC Code"
                      className="bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-400 focus:outline-hidden focus:border-amber-500 uppercase"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all mt-2"
                >
                  <UserPlus className="h-4 w-4 text-slate-950" />
                  <span>পঞ্জীয়ন সম্পন্ন কৰক (Complete Registration)</span>
                </button>
              </form>
            </div>

            {/* Currently Registered Workers List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                <span>পঞ্জীকৃত কাৰখানা শ্ৰমিকৰ তালিকা ({indWorkers.length} জন)</span>
                <span className="text-[10px] text-amber-400 font-mono">লাইভ ডাটাবেচ</span>
              </div>

              <div className="space-y-1.5">
                {indWorkers.map((w) => (
                  <div key={w.token} className="bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-[10px]">
                        {w.token.split('-')[1]}
                      </div>
                      <div>
                        <div className="font-bold text-white text-[11px]">{w.name.split(' (')[0]}</div>
                        <div className="text-[9px] text-slate-400 font-mono">{w.sectionOrTrade} &bull; UAN: {w.uan}</div>
                      </div>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                      সক্ৰিয়
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* GENERAL MANUFACTURING INDUSTRY (ঔদ্যোগিক কাৰখানা)          */}
        {/* ========================================================= */}
        {mobileTab !== 'register' && (
          <>
            {/* 1. FACTORY CONTRACTOR (Thekedar) DESK */}
            {mobileTab === 'contractor' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Contractor Identity */}
                <div className="bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-black">
                      <HardHat className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">বিৰাজ দাস (Apex Manpower)</div>
                      <div className="text-[10px] text-orange-400 font-semibold">CLRA অনুজ্ঞাপত্ৰ: ALC-KAM-4091</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">মাস্টাৰ ৰোল</div>
                    <div className="text-xs font-black text-emerald-400">২৪ জন উপস্থিত</div>
                  </div>
                </div>

                {/* Quick Registration Shortcut Button */}
                <button
                  onClick={() => setMobileTab('register')}
                  className="w-full bg-orange-950/70 hover:bg-orange-900 border border-orange-500/40 p-2.5 rounded-xl text-xs font-bold text-orange-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all"
                >
                  <UserPlus className="h-4 w-4 text-orange-400" />
                  <span>+ নতুন কাৰখানা শ্ৰমিক পঞ্জীয়ন কৰক (Register New Worker)</span>
                </button>

                {/* Quick Shift Punch Form */}
                <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shadow-lg space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                    <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-emerald-400" />
                      <span>দ্ৰুত শিফ্ট হাজিৰা এণ্ট্ৰি (Daily Shift Attendance)</span>
                    </h3>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      ন্যূনতম মজুৰি: ₹৪৮০
                    </span>
                  </div>

                  <form onSubmit={handleAddIndEntry} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        কাৰখানাৰ শ্ৰমিক বাছক (Contract Worker):
                      </label>
                      <select
                        value={selectedIndWorkerToken}
                        onChange={(e) => setSelectedIndWorkerToken(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                      >
                        {indWorkers.map((w) => (
                          <option key={w.token} value={w.token}>
                            {w.token} &bull; {w.name} ({w.sectionOrTrade})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          শিফ্ট বাছক (Shift):
                        </label>
                        <select
                          value={selectedShift}
                          onChange={(e) => setSelectedShift(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-bold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                        >
                          <option value="Shift A (08:00 - 16:00)">Shift A (ৰাতিপুৱা)</option>
                          <option value="Shift B (16:00 - 00:00)">Shift B (সন্ধিয়া)</option>
                          <option value="General (09:00 - 18:00)">সাধাৰণ শিফ্ট</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          ওভাৰটাইম ঘণ্টা (OT Hours):
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="8"
                            value={otHoursInput}
                            onChange={(e) => setOtHoursInput(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-black text-amber-300 focus:outline-hidden focus:border-emerald-500"
                            placeholder="0"
                          />
                          <span className="absolute right-3 top-2 text-[10px] font-bold text-slate-400">ঘণ্টা</span>
                        </div>
                      </div>
                    </div>

                    {/* Industrial Wage Math Preview */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-slate-900/60 p-1.5 rounded-lg">
                        <span className="text-slate-400 block">৮ ঘণ্টা বেছিক</span>
                        <strong className="text-white font-mono">₹{indBaseDailyWage}</strong>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded-lg">
                        <span className="text-slate-400 block">ওভাৰটাইম ({currentOtHours}h)</span>
                        <strong className="text-amber-400 font-mono">+₹{currentOtWage}</strong>
                      </div>
                      <div className="bg-emerald-950/80 border border-emerald-500/30 p-1.5 rounded-lg">
                        <span className="text-emerald-300 font-bold block">দিনৰ মুঠ উপাৰ্জন</span>
                        <strong className="text-emerald-400 font-black font-mono text-xs">₹{currentIndTotalDailyWage}</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>শিফ্ট হাজিৰা জমা কৰক (Submit Shift Punch)</span>
                    </button>
                  </form>
                </div>

                {/* Today's Factory Shift Logs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                    <span>আজিৰ ফেক্টৰী হাজিৰা তালিকা ({indEntries.length} জন শ্ৰমিক)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">মুঠ মজুৰি: ₹{indEntries.reduce((acc, curr) => acc + curr.totalWage, 0)}</span>
                  </div>

                  <div className="space-y-2">
                    {indEntries.map((item) => (
                      <div key={item.id} className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="text-emerald-400 font-mono">{item.tokenNo}</span>
                            <span>{item.workerName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.shift} &bull; OT: <strong className="text-amber-300">{item.otHours} hrs</strong> &bull; {item.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-black text-emerald-300">₹{item.totalWage}</div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 ${
                            item.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {item.status === 'Approved' ? 'অনুমোদিত' : 'অপেক্ষমান'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. INDUSTRIAL WORKER VIEW */}
            {mobileTab === 'worker' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">কাৰখানা শ্ৰমিক পাছ (CLRA Form XIV)</span>
                      <h3 className="text-sm font-black text-white">ৰাহুল বৰ্মন (Rahul Barman)</h3>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">টোকেন: EMP-108 &bull; CNC মেচিন অপাৰেটৰ</span>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>ইন-গে'ট (Punched)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">আজিৰ শিফ্ট অৱস্থা</span>
                      <div className="text-sm font-black text-white mt-0.5">Shift A (৮ ঘণ্টা)</div>
                      <span className="text-[9px] text-amber-400 font-semibold">+২ ঘণ্টা ওভাৰটাইম (OT)</span>
                    </div>

                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">আজিৰ মুঠ মজুৰি</span>
                      <div className="text-base font-black text-emerald-300 font-mono mt-0.5">₹৭২০.০০</div>
                      <span className="text-[9px] text-slate-400">বেছিক ₹৪৮০ + OT ₹২৪০</span>
                    </div>
                  </div>

                  {/* EPF / ESIC Statutory Compliance */}
                  <div className="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">EPF UAN (12% ক্ৰেডিট):</span>
                      <strong className="text-white font-mono">101994827102</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">ESIC বিমা নম্বৰ (0.75%):</span>
                      <strong className="text-emerald-400 font-mono">1399281728</strong>
                    </div>
                  </div>

                  {/* Annual Industrial Bonus Card for Worker */}
                  <div className="bg-gradient-to-r from-blue-950/90 to-slate-900 border border-blue-500/40 p-3 rounded-xl flex items-center justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-blue-400" />
                        <span className="text-[9px] uppercase font-black text-blue-400">বাৰ্ষিক বিধিবদ্ধ বোনাছ (Yearly Statutory Bonus)</span>
                      </div>
                      <div className="text-xs font-black text-white mt-0.5 font-mono">₹১১,৭৬০.০০ <span className="text-[10px] text-blue-300 font-normal">(১৪% ঘোষিত হাৰত)</span></div>
                      <span className="text-[9px] text-slate-300 block mt-0.5">📅 বাৰ্ষিক হিচাপ: Payment of Bonus Act, 1965 অনুসৰি প্ৰাপ্য</span>
                    </div>
                    <div className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-lg text-[9px] font-bold border border-blue-500/40 shrink-0 text-center">
                      অনুমোদিত<br/>(Declared)
                    </div>
                  </div>

                  <button
                    onClick={() => setShowIndustrySlip(true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-600 cursor-pointer active:scale-98 transition-all"
                  >
                    <FileText className="h-3.5 w-3.5 text-emerald-400" />
                    <span>ফৰ্ম ১৯ মজুৰি স্লিপ চাওক (CLRA Wage Slip)</span>
                  </button>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/60 p-3.5 rounded-2xl text-xs space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>ফেক্টৰী আইন অনুসৰি অধিকাৰ (Factories Act Rights)</span>
                  </h4>
                  <ul className="text-[10px] text-slate-300 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>৯ ঘণ্টাৰ ওপৰত কাম কৰিলে দ্বিগুণ হাৰত ওভাৰটাইম (Double Rate OT)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>প্ৰত্যেক সপ্তাহত ১ দিন বাধ্যতামূলক সবেতন সাপ্তাহিক ছুটী (Weekly Off)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>বিনামূলীয়া PPE কিট: সুৰক্ষা জোতা, হেলমেট আৰু গ্লভছ</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. INDUSTRIAL GATE SUPERVISOR VIEW */}
            {mobileTab === 'supervisor' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-white">গে'ট এন্ট্ৰি আৰু শিফ্ট অনুমোদন (Gate Supervisor)</h3>
                    <span className="text-[10px] text-slate-400">ছুপাৰভাইজাৰ: ৰবীন বৰা &bull; মূল গে'ট #১</span>
                  </div>
                  <button
                    onClick={() => {
                      setIndEntries(indEntries.map(item => ({ ...item, status: 'Approved' })));
                      setShowSuccessToast(`সকলো কাৰখানা শ্ৰমিকৰ শিফ্ট হাজিৰা অনুমোদিত হ’ল!`);
                      setTimeout(() => setShowSuccessToast(null), 3000);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl cursor-pointer shadow-xs active:scale-95"
                  >
                    সকলো অনুমোদন
                  </button>
                </div>

                <div className="space-y-2">
                  {indEntries.map((item) => (
                    <div key={item.id} className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="text-emerald-400 font-mono">{item.tokenNo}</span>
                          <span>{item.workerName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.shift} &bull; OT: <strong className="text-amber-300">{item.otHours} hrs</strong> &bull; {item.time}
                        </div>
                      </div>

                      {item.status === 'Approved' ? (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>অনুমোদিত</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveIndEntry(item.id)}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg cursor-pointer active:scale-95 transition-all shadow-xs"
                        >
                          অনুমোদন কৰক
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ANNUAL STATUTORY BONUS VIEW */}
            {mobileTab === 'bonus' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 p-4 rounded-2xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Payment of Bonus Act, 1965</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-500/40">বাৰ্ষিক বোনাছ কেম্বেল</span>
                  </div>
                  <h3 className="text-sm font-black text-white">বিধিবদ্ধ বাৰ্ষিক বোনাছ (৮.৩৩% - ২০%)</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    ভাৰতীয় ঔদ্যোগিক আইন অনুসৰি কাৰখানা শ্ৰমিকসকলৰ বছৰেকীয়া উপাৰ্জনৰ ওপৰত নিৰ্ধাৰিত বাৰ্ষিক বোনাছ হিচাপ।
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">কাৰখানাৰ শ্ৰমিকৰ সংখ্যা:</span>
                      <strong className="text-white font-mono">{indWorkerCount} জন</strong>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="1000" 
                      step="10"
                      value={indWorkerCount} 
                      onChange={(e) => setIndWorkerCount(parseInt(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">ঘোষিত বোনাছৰ শতাংশ:</span>
                      <strong className="text-blue-400 font-mono">{indBonusPercent}%</strong>
                    </div>

                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => setIndBonusPercent(8.33)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg cursor-pointer border ${
                          indBonusPercent === 8.33 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        ৮.৩৩% (ন্যূনতম)
                      </button>
                      <button
                        onClick={() => setIndBonusPercent(12.5)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg cursor-pointer border ${
                          indBonusPercent === 12.5 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        ১২.৫% (মধ্যম)
                      </button>
                      <button
                        onClick={() => setIndBonusPercent(20)}
                        className={`flex-1 py-1 text-[10px] font-bold rounded-lg cursor-pointer border ${
                          indBonusPercent === 20 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        ২০% (সৰ্বোচ্চ)
                      </button>
                    </div>

                    {/* Per Worker calculation based on ₹7,000 statutory wage ceiling */}
                    {(() => {
                      const statutoryWageCeilingAnnual = 7000 * 12; // ₹84,000 ceiling
                      const bonusPerWorker = Math.round(statutoryWageCeilingAnnual * (indBonusPercent / 100));
                      const totalBonusFund = bonusPerWorker * indWorkerCount;
                      return (
                        <>
                          <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-bold">এজন শ্ৰমিকৰ বোনাছ:</span>
                            <strong className="text-amber-400 font-mono font-black text-sm">₹{bonusPerWorker.toLocaleString('en-IN')}</strong>
                          </div>

                          <div className="border-t border-slate-800 pt-1 flex justify-between items-center text-xs">
                            <span className="text-slate-300 font-bold">মুঠ বাৰ্ষিক ঔদ্যোগিক বোনাছ পুঁজি:</span>
                            <strong className="text-blue-400 font-mono font-black text-sm">
                              ₹{(totalBonusFund / 100000).toFixed(2)} লাখ
                            </strong>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Yearly Bonus Act Note */}
                  <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl text-[11px] text-blue-200 flex items-start gap-2">
                    <Award className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-blue-300 font-bold">Payment of Bonus Act, 1965 (বাৰ্ষিক নিয়ম):</strong>
                      বোনাছ হ’ল এক বাৰ্ষিক প্ৰাপ্য। প্ৰতিটো বিত্তীয় বৰ্ষ সমাপ্ত হোৱাৰ ৮ মাহৰ ভিতৰত (সাধাৰণতে পূজা/দেৱালীৰ পূৰ্বে) শ্ৰমিকৰ বাৰ্ষিক উপাৰ্জনৰ ৮.৩৩% ৰ পৰা ২০% লৈকে এককালীন প্ৰদান কৰা বিধিবদ্ধ নিয়ম।
                    </div>
                  </div>

                  {/* Stakeholder Transparency Card */}
                  <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-2 text-[11px]">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                      <span>কোনে কি দেখা পাব? (Stakeholder Transparency)</span>
                    </div>
                    <ul className="text-[10px] text-slate-300 space-y-1.5">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">● শ্ৰমিক:</span>
                        <span>নিজৰ বেংক একাউণ্টত প্ৰাপ্য বাৰ্ষিক বোনাছ (₹৭,০০০ - ₹১৬,৮০০) আৰু পে' স্লিপ চাব পাৰিব।</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-400 font-bold">● মেনেজমেন্ট / HR:</span>
                        <span>কাৰখানাৰ মুঠ বাৰ্ষিক বোনাছ লায়েবিলিটি আৰু Statutory Allocable Surplus অডিট ফাইল চাব পাৰিব।</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-orange-400 font-bold">● ঠিকাদাৰ:</span>
                        <span>ঠিকাদাৰী শ্ৰমিকৰ বাৰ্ষিক বোনাছ ক্লিয়াৰেন্স আৰু প্ৰিন্সিপাল এমপ্লয়াৰৰ অনুমোদন নিৰীক্ষণ কৰিব পাৰিব।</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl text-xs space-y-2">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">Compliance-Locked Billing</div>
                  <div className="text-xs font-black text-white">EPF & ESI চালনা অবিহনে বিল নিষিদ্ধ</div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    ঠিকাঠিকাদাৰে শ্ৰমিকৰ পি এফ আৰু ই এছ আই জমা দিয়াৰ চৰকাৰী চালনা আপলোড নকৰালৈকে প্ৰিন্সিপাল এমপ্লয়াৰে ইনভইচ মুকলি কৰিব নোৱাৰে।
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ========================================================= */}
      {/* INDUSTRIAL FACTORY WAGE SLIP (CLRA Form XIX)              */}
      {/* ========================================================= */}
      {showIndustrySlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-xs animate-in zoom-in-95">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <div className="text-[10px] uppercase font-bold text-orange-400">CLRA Form XIX Wage Slip</div>
                <h3 className="text-sm font-black text-white">Apex Manpower &bull; কামৰূপ কাৰখানা</h3>
                <span className="text-[10px] text-slate-400 font-mono">Principal Employer: Tata Motors</span>
              </div>
              <button
                onClick={() => setShowIndustrySlip(false)}
                className="text-slate-400 hover:text-white p-1 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">শ্ৰমিকৰ নাম:</span>
                <strong className="text-white">ৰাহুল বৰ্মন (Rahul Barman)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">টোকেন / ID:</span>
                <strong className="text-emerald-400 font-mono">EMP-108</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">মুঠ কাৰ্য্যদিৱস:</span>
                <strong className="text-white font-mono">২৬ দিন (২৬ x ₹৪৮০)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">মূল মজুৰি (Basic):</span>
                <strong className="text-white font-mono">₹১২,৪৮০.০০</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">ওভাৰটাইম (OT ২০ ঘণ্টা):</span>
                <strong className="text-amber-400 font-mono">+₹২,৪০০.০০</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-rose-400">
                <span className="text-slate-400">EPF কর্তন (Employee 12%):</span>
                <strong className="font-mono">-₹১,৪৯৭.৬০</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800 text-rose-400">
                <span className="text-slate-400">ESIC কর্তন (0.75%):</span>
                <strong className="font-mono">-₹১১১.৬০</strong>
              </div>
              <div className="flex justify-between py-1.5 bg-emerald-950/60 px-2 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-300 font-bold">ঘৰলৈ নিব পৰা দৰমহা (Take-Home):</span>
                <strong className="text-emerald-400 font-black font-mono text-sm">₹১৩,২৭১.০০</strong>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 text-center font-mono space-y-0.5">
              <div>EPF UAN: 101994827102 &bull; ESIC: 1399281728</div>
              <div className="text-emerald-400">Payment of Wages Act, 1936 Compliant</div>
            </div>

            <button
              onClick={() => setShowIndustrySlip(false)}
              className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
            >
              বন্ধ কৰক (Close Slip)
            </button>
          </div>
        </div>
      )}

      {/* 4. Fixed Bottom Navigation (Mobile Native Bar - 5 Thumb Friendly Icons) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950 border-t border-slate-800/90 py-2 px-2 flex items-center justify-around z-40 shadow-2xl">
        
        {/* Attendance Punch (Contractor) */}
        <button
          onClick={() => setMobileTab('contractor')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'contractor' ? 'text-indigo-400 font-black' : 'text-slate-400'
          }`}
        >
          <HardHat className="h-4 w-4" />
          <span className="text-[9px]">ঠিকাদাৰ</span>
        </button>

        {/* Direct Registration */}
        <button
          onClick={() => setMobileTab('register')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'register' ? 'text-amber-400 font-black scale-105' : 'text-amber-400/80 hover:text-amber-300'
          }`}
        >
          <UserPlus className="h-4 w-4 text-amber-400" />
          <span className="text-[9px] font-bold">পঞ্জীয়ন</span>
        </button>

        {/* Worker */}
        <button
          onClick={() => setMobileTab('worker')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'worker' ? 'text-indigo-400 font-black' : 'text-slate-400'
          }`}
        >
          <User className="h-4 w-4" />
          <span className="text-[9px]">শ্ৰমিক</span>
        </button>

        {/* Supervisor */}
        <button
          onClick={() => setMobileTab('supervisor')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'supervisor' ? 'text-indigo-400 font-black' : 'text-slate-400'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-[9px]">ছুপাৰভাইজাৰ</span>
        </button>

        {/* Bonus */}
        <button
          onClick={() => setMobileTab('bonus')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'bonus' ? 'text-indigo-400 font-black' : 'text-slate-400'
          }`}
        >
          <Award className="h-4 w-4" />
          <span className="text-[9px]">বোনাছ</span>
        </button>
      </div>

      {/* Official Government Separation Modal */}
      <GovernmentSeparationModal 
        isOpen={isGovModalOpen}
        onClose={() => setIsGovModalOpen(false)}
      />

    </div>
  );
}
