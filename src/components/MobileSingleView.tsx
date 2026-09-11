import React, { useState } from 'react';
import { 
  Sprout, 
  Factory,
  User, 
  CheckCircle2, 
  Clock, 
  Award, 
  DollarSign, 
  Laptop, 
  ChevronRight, 
  Plus, 
  Check, 
  FileText, 
  ShieldCheck, 
  Calendar,
  Building,
  Sparkles,
  Layers,
  ArrowUpRight,
  HardHat,
  Briefcase,
  QrCode,
  AlertCircle,
  UserPlus,
  Phone,
  CreditCard,
  Hash
} from 'lucide-react';
import { AppLanguage, TRANSLATIONS } from '../i18n';
import { LanguageSelector } from './LanguageSelector';
import logoUrl from '../assets/images/shramiklink_logo_1788402038953.jpg';

interface MobileSingleViewProps {
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onSwitchToFullDesktop: () => void;
}

interface QuickPluckingItem {
  id: string;
  workerName: string;
  tokenNo: string;
  grossKg: number;
  netKg: number;
  ticcaKg: number;
  totalWage: number;
  status: 'Approved' | 'Pending';
  time: string;
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

  // Sector Selection: Tea Garden vs Manufacturing Industry
  const [selectedSector, setSelectedSector] = useState<'tea_garden' | 'manufacturing'>('tea_garden');

  // Active Role Tab: 'contractor' (Hajira/Plucking), 'register' (New Worker Onboarding), 'worker', 'supervisor', 'bonus'
  const [mobileTab, setMobileTab] = useState<'contractor' | 'register' | 'worker' | 'supervisor' | 'bonus'>('contractor');
  
  // Toast State
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  // Wage Slip Modals
  const [showTeaSlip, setShowTeaSlip] = useState<boolean>(false);
  const [showIndustrySlip, setShowIndustrySlip] = useState<boolean>(false);

  // ==========================================
  // TEA GARDEN DATA & STATE
  // ==========================================
  const [selectedWorkerToken, setSelectedWorkerToken] = useState<string>('TK-402');
  const [leafWeightInput, setLeafWeightInput] = useState<string>('31.5');
  const [teaBonusPercent, setTeaBonusPercent] = useState<number>(20);
  const [teaWorkerCount, setTeaWorkerCount] = useState<number>(450);

  const [teaWorkers, setTeaWorkers] = useState<WorkerProfile[]>([
    { token: 'TK-402', name: 'সুনীতা কৰ্মকাৰ (Sunita Karmakar)', sectionOrTrade: 'Section 4A', uan: '101488921044', esic: '1319082341', phone: '9864012984', gender: 'মহিলা' },
    { token: 'TK-403', name: 'লক্ষী তাঁতী (Lakhi Tanti)', sectionOrTrade: 'Section 4A', uan: '101488921092', esic: '1319082377', phone: '9864012985', gender: 'মহিলা' },
    { token: 'TK-404', name: 'ৰূপালী ওৰাং (Rupali Orang)', sectionOrTrade: 'Section 4A', uan: '101488921133', esic: '1319082390', phone: '9864012986', gender: 'মহিলা' },
    { token: 'TK-405', name: 'মাধৱী ভূমিজ (Madhavi Bhumij)', sectionOrTrade: 'Section 4A', uan: '101488921155', esic: '1319082412', phone: '9864012987', gender: 'মহিলা' },
  ]);

  const [teaEntries, setTeaEntries] = useState<QuickPluckingItem[]>([
    {
      id: 'p-1',
      workerName: 'সুনীতা কৰ্মকাৰ',
      tokenNo: 'TK-402',
      grossKg: 33.5,
      netKg: 31.5,
      ticcaKg: 7.5,
      totalWage: 283.75,
      status: 'Approved',
      time: '11:30 AM'
    },
    {
      id: 'p-2',
      workerName: 'লক্ষী তাঁতী',
      tokenNo: 'TK-403',
      grossKg: 38.0,
      netKg: 36.0,
      ticcaKg: 12.0,
      totalWage: 304.00,
      status: 'Approved',
      time: '11:45 AM'
    },
    {
      id: 'p-3',
      workerName: 'ৰূপালী ওৰাং',
      tokenNo: 'TK-404',
      grossKg: 28.5,
      netKg: 27.0,
      ticcaKg: 3.0,
      totalWage: 263.50,
      status: 'Pending',
      time: '12:10 PM'
    }
  ]);

  const haziraQuota = 24; // 24 kg standard
  const haziraRate = 250; // ₹250/day
  const ticcaRate = 4.50; // ₹4.50/kg

  const currentNetKg = parseFloat(leafWeightInput) || 0;
  const currentTiccaKg = Math.max(0, currentNetKg - haziraQuota);
  const currentTiccaEarned = currentTiccaKg * ticcaRate;
  const currentTeaTotalWage = haziraRate + currentTiccaEarned;

  const handleAddTeaEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const workerObj = teaWorkers.find(w => w.token === selectedWorkerToken);
    if (!workerObj || currentNetKg <= 0) return;

    const newEntry: QuickPluckingItem = {
      id: `p-${Date.now()}`,
      workerName: workerObj.name.split(' (')[0],
      tokenNo: workerObj.token,
      grossKg: currentNetKg + 1.5,
      netKg: currentNetKg,
      ticcaKg: currentTiccaKg,
      totalWage: currentTeaTotalWage,
      status: 'Pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setTeaEntries([newEntry, ...teaEntries]);
    setShowSuccessToast(`${workerObj.token} (${workerObj.name.split(' (')[0]}) ৰ পাত ওজন সফলভাৱে জমা হ’ল!`);
    setTimeout(() => setShowSuccessToast(null), 3500);
    setLeafWeightInput('29.0');
  };

  const handleApproveTeaEntry = (id: string) => {
    setTeaEntries(teaEntries.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
    setShowSuccessToast(`হাজিৰা অনুমোদন সম্পন্ন হ’ল!`);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

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
  const [regGender, setRegGender] = useState<string>('মহিলা');
  const [regAge, setRegAge] = useState<string>('26');
  const [regSectionOrTrade, setRegSectionOrTrade] = useState<string>('Section 4A (পাত তোলা)');
  const [regAadhaarLast4, setRegAadhaarLast4] = useState<string>('5842');
  const [regUan, setRegUan] = useState<string>('');
  const [regEsic, setRegEsic] = useState<string>('');
  const [regBankAcc, setRegBankAcc] = useState<string>('XXXX9821');
  const [registeredSuccessProfile, setRegisteredSuccessProfile] = useState<WorkerProfile | null>(null);

  const handleRegisterWorkerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    if (selectedSector === 'tea_garden') {
      const nextTokenNum = 400 + teaWorkers.length + 2;
      const generatedToken = `TK-${nextTokenNum}`;
      const generatedUan = regUan.trim() || `1014889${Math.floor(10000 + Math.random() * 90000)}`;
      const generatedEsic = regEsic.trim() || `131908${Math.floor(1000 + Math.random() * 9000)}`;

      const newWorker: WorkerProfile = {
        token: generatedToken,
        name: `${regName.trim()} (${generatedToken})`,
        sectionOrTrade: regSectionOrTrade || 'Section 4A',
        uan: generatedUan,
        esic: generatedEsic,
        phone: regPhone || '98640XXXXX',
        gender: regGender,
        bankAcc: regBankAcc
      };

      setTeaWorkers([...teaWorkers, newWorker]);
      setSelectedWorkerToken(newWorker.token);
      setRegisteredSuccessProfile(newWorker);
      setShowSuccessToast(`নৱ-পঞ্জীকৃত শ্ৰমিক ${newWorker.token} (${regName}) সফলভাৱে যোগ কৰা হ’ল!`);
      setTimeout(() => setShowSuccessToast(null), 4000);
    } else {
      const nextEmpNum = 108 + indWorkers.length;
      const generatedToken = `EMP-${nextEmpNum}`;
      const generatedUan = regUan.trim() || `1019948${Math.floor(10000 + Math.random() * 90000)}`;
      const generatedEsic = regEsic.trim() || `139928${Math.floor(1000 + Math.random() * 9000)}`;

      const newWorker: WorkerProfile = {
        token: generatedToken,
        name: `${regName.trim()} (${generatedToken})`,
        sectionOrTrade: regSectionOrTrade || 'CNC Operator',
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
    }

    // Reset Form
    setRegName('');
    setRegPhone('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans max-w-md mx-auto relative shadow-2xl overflow-x-hidden pb-20">
      
      {/* 1. Mobile App Top Header */}
      <header className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-emerald-500/40">
            <img 
              src={logoUrl} 
              alt="ShramikLinks" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/shramiklinks_logo.jpg';
              }}
            />
          </div>
          <div>
            <div className="text-sm font-black text-white flex items-center gap-1">
              Shramik<span className="text-orange-500">Links</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">মোবাইল</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {selectedSector === 'tea_garden' ? 'মৰনৈ চাহ বাগিচা (Mornoi TE)' : 'টাটা মটৰছ / কামৰূপ ইণ্ডাষ্ট্ৰীজ'}
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

      {/* 2. Dual Sector Toggle Bar (Chah Bagicha vs General Manufacturing) */}
      <div className="bg-slate-950 px-3.5 py-2.5 border-b border-slate-800">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5 flex items-center justify-between">
          <span>কাৰ্যক্ষেত্ৰ নিৰ্বাচন (Choose Sector):</span>
          <span className="text-emerald-400 font-normal">২ টা সুকীয়া খণ্ড</span>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => {
              setSelectedSector('tea_garden');
              setRegisteredSuccessProfile(null);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedSector === 'tea_garden'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sprout className="h-3.5 w-3.5" />
            <span>🍃 চাহ বাগিচা (Tea)</span>
          </button>

          <button
            onClick={() => {
              setSelectedSector('manufacturing');
              setRegisteredSuccessProfile(null);
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedSector === 'manufacturing'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Factory className="h-3.5 w-3.5" />
            <span>🏭 কাৰখানা (Industry)</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-24 left-4 right-4 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-950" />
          <span>{showSuccessToast}</span>
        </div>
      )}

      {/* 3. Role Picker Tabs (Thumb-Friendly, 5 Roles with Direct Registration!) */}
      <div className="p-2.5 bg-slate-950 border-b border-slate-800/80">
        <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
          
          {/* Tab 1: Hajira (Contractor/Sardar) */}
          <button
            onClick={() => setMobileTab('contractor')}
            className={`py-2 px-0.5 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              mobileTab === 'contractor'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {selectedSector === 'tea_garden' ? <Sprout className="h-3.5 w-3.5" /> : <HardHat className="h-3.5 w-3.5" />}
            <span className="text-[9px] whitespace-nowrap">
              {selectedSector === 'tea_garden' ? 'চৰ্দাৰ' : 'ঠিকাদাৰ'}
            </span>
          </button>

          {/* Tab 2: DIRECT REGISTRATION PANEL (Requested by User!) */}
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
                ? 'bg-emerald-600 text-white shadow-md'
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
                ? 'bg-emerald-600 text-white shadow-md'
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
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span className="text-[9px] whitespace-nowrap">বোনাছ</span>
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      <div className="p-3.5 space-y-4">

        {/* ========================================================= */}
        {/* TAB: DIRECT MOBILE WORKER REGISTRATION (নতুুন শ্ৰমিক পঞ্জীয়ন)*/}
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
                    {selectedSector === 'tea_garden' ? 'চাহ শ্ৰমিক দ্ৰুত পঞ্জীয়ন' : 'কাৰখানা শ্ৰমিক দ্ৰুত পঞ্জীয়ন'}
                  </h3>
                  <div className="text-[10px] text-amber-300 font-semibold">
                    {selectedSector === 'tea_garden' ? 'চৰ্দাৰ গেং #০৭ &bull; বাগিচা লাইন এন্ট্ৰি' : 'CLRA Form XIII &bull; Apex Manpower'}
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
                      if (selectedSector === 'tea_garden') {
                        setSelectedWorkerToken(registeredSuccessProfile.token);
                      } else {
                        setSelectedIndWorkerToken(registeredSuccessProfile.token);
                      }
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
                  {selectedSector === 'tea_garden' ? 'Plantations Labour Act Onboarding' : 'CLRA Form XIII & Factories Act'}
                </span>
                <h3 className="text-xs font-black text-white mt-0.5">নতুন শ্ৰমিকৰ তথ্য অন্তৰ্ভুক্ত কৰক</h3>
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
                    placeholder={selectedSector === 'tea_garden' ? 'যেনে: বিমলা তাঁতী / ৰামেশ্বৰ ঘাটোৱাৰ' : 'যেনে: ৰমেন কলিতা / বিকাশ শইকীয়া'}
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
                      <option value="মহিলা">মহিলা (Female)</option>
                      <option value="পুৰুষ">পুৰুষ (Male)</option>
                      <option value="অন্যান্য">অন্যান্য (Other)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Section / Trade */}
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    {selectedSector === 'tea_garden' ? 'বাগিচাৰ ছেকচন / লাইন (Section & Line):' : 'কাৰখানাৰ কামৰ ট্ৰেড (Trade / Section):'}
                  </label>
                  {selectedSector === 'tea_garden' ? (
                    <select
                      value={regSectionOrTrade}
                      onChange={(e) => setRegSectionOrTrade(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-hidden focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Section 4A (পাত তোলা)">Section 4A (পাত তোলা - Plucking)</option>
                      <option value="Section 2B (প্ৰুনিং / কটা)">Section 2B (প্ৰুনিং / কটা - Pruning)</option>
                      <option value="Section 1C (নিৰানি / Hoeing)">Section 1C (নিৰানি - Hoeing)</option>
                      <option value="Line 12 (গেং #০৭)">Line 12 (চৰ্দাৰ মীনা মুণ্ডা গেং)</option>
                    </select>
                  ) : (
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
                  )}
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
                <span>পঞ্জীকৃত শ্ৰমিকৰ তালিকা ({selectedSector === 'tea_garden' ? teaWorkers.length : indWorkers.length} জন)</span>
                <span className="text-[10px] text-amber-400 font-mono">লাইভ ডাটাবেচ</span>
              </div>

              <div className="space-y-1.5">
                {(selectedSector === 'tea_garden' ? teaWorkers : indWorkers).map((w) => (
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
        {/* SECTOR A: TEA GARDEN (চাৰ বাগান)                            */}
        {/* ========================================================= */}
        {selectedSector === 'tea_garden' && mobileTab !== 'register' && (
          <>
            {/* 1. SARDAR PANEL */}
            {mobileTab === 'contractor' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-800/90 border border-slate-700/80 p-3.5 rounded-2xl shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                      <Sprout className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">মীনা মুণ্ডা (Mina Munda)</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">গেং #০৭ &bull; ছেকচন ৪এ (উত্তৰ)</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">আজিৰ কোটা</div>
                    <div className="text-xs font-black text-amber-400">২৪ কেজি (₹২৫০)</div>
                  </div>
                </div>

                {/* Quick Registration Shortcut Button */}
                <button
                  onClick={() => setMobileTab('register')}
                  className="w-full bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 p-2.5 rounded-xl text-xs font-bold text-amber-300 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all"
                >
                  <UserPlus className="h-4 w-4 text-amber-400" />
                  <span>+ নতুন চাহ শ্ৰমিক পঞ্জীয়ন কৰক (Register New Worker)</span>
                </button>

                {/* Plucking Form */}
                <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-2xl shadow-lg space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                    <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                      <Plus className="h-4 w-4 text-emerald-400" />
                      <span>দ্ৰুত পাত ওজন এণ্ট্ৰি (Quick Leaf Weighing)</span>
                    </h3>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-mono font-bold">
                      টিক্কা: ₹৪.৫০/কেজি
                    </span>
                  </div>

                  <form onSubmit={handleAddTeaEntry} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        শ্ৰমিক বাছক (Worker Token & Name):
                      </label>
                      <select
                        value={selectedWorkerToken}
                        onChange={(e) => setSelectedWorkerToken(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white font-bold focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                      >
                        {teaWorkers.map((w) => (
                          <option key={w.token} value={w.token}>
                            {w.token} &bull; {w.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-300 block mb-1">
                        পাতেৰে ভৰা ওজন (Net Green Leaf in Kg):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          value={leafWeightInput}
                          onChange={(e) => setLeafWeightInput(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-base font-black text-emerald-300 focus:outline-hidden focus:border-emerald-500"
                          placeholder="e.g. 32.5"
                          required
                        />
                        <span className="absolute right-3 top-3 text-xs font-bold text-slate-400">কেজি (KG)</span>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px]">
                      <div className="bg-slate-900/60 p-1.5 rounded-lg">
                        <span className="text-slate-400 block">মূল হাজিৰা</span>
                        <strong className="text-white font-mono">₹{haziraRate}</strong>
                      </div>
                      <div className="bg-slate-900/60 p-1.5 rounded-lg">
                        <span className="text-slate-400 block">টিক্কা ({currentTiccaKg.toFixed(1)}kg)</span>
                        <strong className="text-amber-400 font-mono">+₹{currentTiccaEarned.toFixed(2)}</strong>
                      </div>
                      <div className="bg-emerald-950/80 border border-emerald-500/30 p-1.5 rounded-lg">
                        <span className="text-emerald-300 font-bold block">মুঠ মজুৰি</span>
                        <strong className="text-emerald-400 font-black font-mono text-xs">₹{currentTeaTotalWage.toFixed(2)}</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>পাত ওজন জমা কৰক (Submit Leaf Entry)</span>
                    </button>
                  </form>
                </div>

                {/* Today's Logged Entries */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                    <span>আজিৰ পাত জোখ তালিকা ({teaEntries.length} জন শ্ৰমিক)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">মুঠ: {teaEntries.reduce((acc, curr) => acc + curr.netKg, 0).toFixed(1)} kg</span>
                  </div>

                  <div className="space-y-2">
                    {teaEntries.map((item) => (
                      <div key={item.id} className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span className="text-emerald-400 font-mono">{item.tokenNo}</span>
                            <span>{item.workerName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            পাত: <strong className="text-slate-200">{item.netKg} kg</strong> (টিক্কা: +{item.ticcaKg}kg) &bull; {item.time}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-black text-emerald-300">₹{item.totalWage.toFixed(2)}</div>
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

            {/* 2. TEA WORKER VIEW */}
            {mobileTab === 'worker' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">চাহ শ্ৰমিক ডিজিটেল পাছ</span>
                      <h3 className="text-sm font-black text-white">সুনীতা কৰ্মকাৰ (Sunita Karmakar)</h3>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">টোকেন নং: TK-402</span>
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>উপস্থিত (Present)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">আজি সংগৃহীত পাত</span>
                      <div className="text-base font-black text-emerald-300 font-mono mt-0.5">৩১.৫ কেজি</div>
                      <span className="text-[9px] text-amber-400 font-semibold">+৭.৫ কেজি ওভাৰ-কোটা (টিক্কা)</span>
                    </div>

                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">আজিৰ মুঠ মজুৰি</span>
                      <div className="text-base font-black text-white font-mono mt-0.5">₹২৮৩.৭৫</div>
                      <span className="text-[9px] text-emerald-400 font-semibold">হাজিৰা ₹২৫০ + টিক্কা ₹৩৩.৭৫</span>
                    </div>
                  </div>

                  <div className="bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span>EPF UAN: <strong className="text-white font-mono">101488921044</strong></span>
                    </div>
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">প্ৰমাণীকৃত</span>
                  </div>

                  {/* Annual Bonus Passbook Card for Worker */}
                  <div className="bg-gradient-to-r from-amber-950/90 to-slate-900 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between shadow-xs">
                    <div>
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3 text-amber-400" />
                        <span className="text-[9px] uppercase font-black text-amber-400">বাৰ্ষিক পূজা বোনাছ (Yearly Bonus)</span>
                      </div>
                      <div className="text-xs font-black text-white mt-0.5 font-mono">₹১৮,২৪০.০০ <span className="text-[10px] text-emerald-400 font-normal">(২০% সৰ্বোচ্চ হাৰ)</span></div>
                      <span className="text-[9px] text-slate-300 block mt-0.5">📅 বছৰত ১ বাৰ: দুৰ্গাপূজাৰ পূৰ্বে একাউণ্টত প্ৰত্যক্ষ জমা</span>
                    </div>
                    <div className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg text-[9px] font-bold border border-amber-500/40 shrink-0 text-center">
                      অনুমোদিত<br/>(Approved)
                    </div>
                  </div>

                  <button
                    onClick={() => setShowTeaSlip(true)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-600 cursor-pointer active:scale-98 transition-all"
                  >
                    <FileText className="h-3.5 w-3.5 text-emerald-400" />
                    <span>ডিজিটেল মজুৰি স্লিপ চাওক (View Wage Slip)</span>
                  </button>
                </div>

                <div className="bg-slate-800/70 border border-slate-700/60 p-3.5 rounded-2xl text-xs space-y-2">
                  <h4 className="font-bold text-white flex items-center gap-1.5 text-[11px]">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>প্লাণ্টেশ্যন এক্ট অনুসৰি লাভালাভ (Plantation Entitlements)</span>
                  </h4>
                  <ul className="text-[10px] text-slate-300 space-y-1.5">
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>বিনামূলীয়া বাগিচা স্বাস্থ্যসেৱা আৰু প্ৰাথমিক ঔষধ (Free Medical)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>বাৰ্ষিক ২০% দুৰ্গাপূজা ত্ৰিপাক্ষিক বোনাছ প্ৰাপ্য (ACMS Agreement)</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. TEA SUPERVISOR VIEW */}
            {mobileTab === 'supervisor' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-2xl flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-white">ডিজিটেল হাজিৰা বহী (Field Approval)</h3>
                    <span className="text-[10px] text-slate-400">ফিল্ড ছুপাৰভাইজাৰ: দেৱজিত ফুকন</span>
                  </div>
                  <button
                    onClick={() => {
                      setTeaEntries(teaEntries.map(item => ({ ...item, status: 'Approved' })));
                      setShowSuccessToast(`সকলো শ্ৰমিকৰ হাজিৰা অনুমোদিত হ’ল!`);
                      setTimeout(() => setShowSuccessToast(null), 3000);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[10px] px-3 py-1.5 rounded-xl cursor-pointer shadow-xs active:scale-95"
                  >
                    সকলো অনুমোদন
                  </button>
                </div>

                <div className="space-y-2">
                  {teaEntries.map((item) => (
                    <div key={item.id} className="bg-slate-800/90 border border-slate-700 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="text-emerald-400 font-mono">{item.tokenNo}</span>
                          <span>{item.workerName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          পাত: <strong className="text-white">{item.netKg} kg</strong> &bull; মজুৰি: <strong className="text-emerald-300">₹{item.totalWage.toFixed(2)}</strong>
                        </div>
                      </div>

                      {item.status === 'Approved' ? (
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <Check className="h-3 w-3" />
                          <span>অনুমোদিত</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveTeaEntry(item.id)}
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

            {/* 4. TEA TRIPARTITE BONUS VIEW */}
            {mobileTab === 'bonus' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30 p-4 rounded-2xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">অসম চাহ বাগিচা ত্ৰিপাক্ষিক চুক্তি</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/40">২০২৬ পূজা বোনাছ</span>
                  </div>
                  <h3 className="text-sm font-black text-white">দুৰ্গাপূজা বোনাছ বন্দোৱস্ত (২০% সৰ্বোচ্চ)</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    অসম চাহ মজদুৰ সংঘ (ACMS), বাগান মালিক সন্থা (ABITA/NETA) আৰু শ্ৰম বিভাগৰ যৌথ স্বাক্ষৰিত বোনাছ চুক্তি।
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">শ্ৰমিকৰ সংখ্যা:</span>
                      <strong className="text-white font-mono">{teaWorkerCount} জন</strong>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="1200" 
                      step="25"
                      value={teaWorkerCount} 
                      onChange={(e) => setTeaWorkerCount(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">বোনাছৰ হাৰ:</span>
                      <strong className="text-emerald-400 font-mono">{teaBonusPercent}%</strong>
                    </div>

                    <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-bold">এজন শ্ৰমিকৰ বোনাছ:</span>
                      <strong className="text-amber-400 font-mono font-black text-sm">₹১৮,২৪০</strong>
                    </div>

                    <div className="border-t border-slate-800 pt-1 flex justify-between items-center text-xs">
                      <span className="text-slate-300 font-bold">মুঠ বাৰ্ষিক বোনাছ পুঁজি:</span>
                      <strong className="text-emerald-400 font-mono font-black text-sm">
                        ₹{((teaWorkerCount * 18240) / 100000).toFixed(2)} লাখ
                      </strong>
                    </div>
                  </div>

                  {/* Yearly Bonus Note */}
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                    <Award className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300 font-bold">বাৰ্ষিক বোনাছৰ হিচাপ (Annual Bonus Settlement):</strong>
                      এই বোনাছ বছৰত এবাৰ মাত্ৰ দুৰ্গাপূজাৰ সময়ত বিগত ১২ মাহৰ উপাৰ্জনৰ ওপৰত ভিত্তি কৰি এককালীন বিতৰণ কৰা হয়।
                    </div>
                  </div>

                  {/* Stakeholder Transparency Card */}
                  <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-2 text-[11px]">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>কোনে কি দেখা পাব? (Stakeholder Transparency)</span>
                    </div>
                    <ul className="text-[10px] text-slate-300 space-y-1.5">
                      <li className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">● শ্ৰমিক:</span>
                        <span>নিজৰ টোকেনত বাৰ্ষিক ₹১৮,২৪০ বোনাছ প্ৰাপ্য আৰু বেংক ক্ৰেডিটৰ অনুমোদন চাব পাৰিব।</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">● মেনেজমেন্ট / HR:</span>
                        <span>সমগ্ৰ বাগিচাৰ মুঠ বাৰ্ষিক বোনাছ পুঁজি (₹{((teaWorkerCount * 18240) / 100000).toFixed(2)} লাখ) আৰু ত্ৰিপাক্ষিক চনদ চাব পাৰিব।</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="text-blue-400 font-bold">● চৰ্দাৰ:</span>
                        <span>নিজৰ গেঙৰ শ্ৰমিকসকলৰ তালিকা আৰু কাৰ কিমান বোনাছ অনুমোদন হ’ল নিৰীক্ষণ কৰিব পাৰিব।</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ========================================================= */}
        {/* SECTOR B: GENERAL MANUFACTURING INDUSTRY (ঔদ্যোগিক কাৰখানা)  */}
        {/* ========================================================= */}
        {selectedSector === 'manufacturing' && mobileTab !== 'register' && (
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
                          {item.shift} &bull; OT: <strong className="text-amber-300">{item.otHours}h</strong> &bull; মজুৰি: <strong className="text-emerald-300">₹{item.totalWage}</strong>
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

                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>গে'ট পাছ ডিজিটেলভাৱে ভেৰিফাই কৰা হৈছে &bull; শূন্য প্ৰক্সি হাজিৰা (Zero Proxy)</span>
                </div>
              </div>
            )}

            {/* 4. INDUSTRIAL BONUS ACT (Payment of Bonus Act, 1965) */}
            {mobileTab === 'bonus' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 p-4 rounded-2xl shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Payment of Bonus Act, 1965</span>
                    <span className="text-[9px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-bold border border-blue-500/40">কাৰখানা বোনাছ</span>
                  </div>
                  <h3 className="text-sm font-black text-white">ঔদ্যোগিক বিধিবদ্ধ বোনাছ (Statutory Bonus)</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    ভাৰতীয় উদ্যোগিক কাৰখানা আইন অনুসৰি শ্ৰমিকক বাৰ্ষিক ৮.৩৩% (ন্যূনতম) ৰ পৰা ২০% (সৰ্বোচ্চ) লৈকে প্ৰতিষ্ঠানৰ লাভৰ ওপৰত বোনাছ প্ৰদান কৰা বাধ্যতামূলক।
                  </p>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">কাৰখানাৰ শ্ৰমিক সংখ্যা:</span>
                      <strong className="text-white font-mono">{indWorkerCount} জন</strong>
                    </div>
                    <input 
                      type="range" 
                      min="20" 
                      max="600" 
                      step="10"
                      value={indWorkerCount} 
                      onChange={(e) => setIndWorkerCount(parseInt(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer"
                    />

                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">বোনাছৰ শতাংশ (8.33% - 20%):</span>
                      <strong className="text-blue-400 font-mono font-bold">{indBonusPercent}%</strong>
                    </div>
                    <div className="flex gap-2">
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
      {/* MODAL 1: TEA GARDEN WAGE SLIP                             */}
      {/* ========================================================= */}
      {showTeaSlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-xs animate-in zoom-in-95">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">ডিজিটেল মজুৰি স্লিপ (Pay Slip)</div>
                <h3 className="text-sm font-black text-white">মৰনৈ চাহ বাগিচা (Mornoi TE)</h3>
                <span className="text-[10px] text-emerald-400 font-mono">মাহ: ছেপ্টেম্বৰ ২০২৬ &bull; ফৰ্ম ১১</span>
              </div>
              <button
                onClick={() => setShowTeaSlip(false)}
                className="text-slate-400 hover:text-white p-1 text-base font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">শ্ৰমিকৰ নাম:</span>
                <strong className="text-white">সুনীতা কৰ্মকাৰ</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">টোকেন নং:</span>
                <strong className="text-emerald-400 font-mono">TK-402</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">মুঠ উপস্থিত দিন:</span>
                <strong className="text-white font-mono">২৬ দিন</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">মূল হাজিৰা (Basic):</span>
                <strong className="text-white font-mono">₹৬,৫০০.০০</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">অতিৰিক্ত পাত টিক্কা (Ticca):</span>
                <strong className="text-amber-400 font-mono">+₹১,০৮২.৫০</strong>
              </div>
              <div className="flex justify-between py-1.5 bg-emerald-950/60 px-2 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-300 font-bold">মুঠ প্ৰাপ্য মজুৰি (Net):</span>
                <strong className="text-emerald-400 font-black font-mono text-sm">₹৭,৫৮২.৫০</strong>
              </div>
            </div>

            <div className="text-[9px] text-slate-400 text-center font-mono">
              EPF UAN: 101488921044 &bull; ESIC: 1319082341
            </div>

            <button
              onClick={() => setShowTeaSlip(false)}
              className="w-full bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl cursor-pointer"
            >
              বন্ধ কৰক (Close Slip)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: INDUSTRIAL FACTORY WAGE SLIP (CLRA Form XIX)     */}
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
                <span className="text-slate-400">পদবী (Trade):</span>
                <strong className="text-emerald-400">CNC Machine Operator</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">মুঠ উপস্থিত দিন:</span>
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

      {/* 5. Fixed Bottom Navigation (Mobile Native Bar - 5 Thumb Friendly Icons) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950 border-t border-slate-800/90 py-2 px-2 flex items-center justify-around z-40 shadow-2xl">
        
        {/* Hajira / Plucking */}
        <button
          onClick={() => setMobileTab('contractor')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'contractor' ? 'text-emerald-400 font-black' : 'text-slate-400'
          }`}
        >
          {selectedSector === 'tea_garden' ? <Sprout className="h-4 w-4" /> : <HardHat className="h-4 w-4" />}
          <span className="text-[9px]">{selectedSector === 'tea_garden' ? 'চৰ্দাৰ' : 'ঠিকাদাৰ'}</span>
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
            mobileTab === 'worker' ? 'text-emerald-400 font-black' : 'text-slate-400'
          }`}
        >
          <User className="h-4 w-4" />
          <span className="text-[9px]">শ্ৰমিক</span>
        </button>

        {/* Supervisor */}
        <button
          onClick={() => setMobileTab('supervisor')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'supervisor' ? 'text-emerald-400 font-black' : 'text-slate-400'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-[9px]">ছুপাৰভাইজাৰ</span>
        </button>

        {/* Bonus */}
        <button
          onClick={() => setMobileTab('bonus')}
          className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
            mobileTab === 'bonus' ? 'text-emerald-400 font-black' : 'text-slate-400'
          }`}
        >
          <Award className="h-4 w-4" />
          <span className="text-[9px]">বোনাছ</span>
        </button>
      </div>

    </div>
  );
}
