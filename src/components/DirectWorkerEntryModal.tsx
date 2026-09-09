import React, { useState } from 'react';
import { UserPlus, Smartphone, CheckCircle, AlertCircle, X, ShieldCheck, Briefcase } from 'lucide-react';
import { Worker, Contractor, Supervisor } from '../types';

interface DirectWorkerEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor?: Contractor;
  supervisor?: Supervisor;
  onAddWorker: (worker: Worker) => void;
  showNotice: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const DirectWorkerEntryModal: React.FC<DirectWorkerEntryModalProps> = ({
  isOpen,
  onClose,
  contractor,
  supervisor,
  onAddWorker,
  showNotice
}) => {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [hasNoSmartphone, setHasNoSmartphone] = useState<boolean>(true);
  const [aadhaarLastDigits, setAadhaarLastDigits] = useState<string>('');
  const [skillType, setSkillType] = useState<'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly-Skilled'>('Unskilled');
  const [dailyWageRate, setDailyWageRate] = useState<number>(480);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [assignedShift, setAssignedShift] = useState<string>('General (09:00 - 17:00)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const safeContractor: Contractor = contractor || {
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

  // Auto-adjust default minimum wage when skill type changes
  const handleSkillChange = (newSkill: 'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly-Skilled') => {
    setSkillType(newSkill);
    if (newSkill === 'Unskilled') setDailyWageRate(480);
    else if (newSkill === 'Semi-Skilled') setDailyWageRate(550);
    else if (newSkill === 'Skilled') setDailyWageRate(650);
    else if (newSkill === 'Highly-Skilled') setDailyWageRate(850);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showNotice('অনুগ্ৰহ কৰি শ্ৰমিকৰ নাম প্ৰবিষ্ট কৰক!', 'error');
      return;
    }

    if (!phone.trim()) {
      showNotice('অনুগ্ৰহ কৰি শ্ৰমিকৰ বা পৰিয়ালৰ ফোন নম্বৰ প্ৰবিষ্ট কৰক!', 'error');
      return;
    }

    setIsSubmitting(true);

    const cleanAadhaar = aadhaarLastDigits.replace(/\D/g, '');
    const lastFour = cleanAadhaar.length >= 4 ? cleanAadhaar.slice(-4) : String(Math.floor(1000 + Math.random() * 9000));
    const maskedAadhaar = `XXXX-XXXX-${lastFour}`;

    const newWorkerId = `wrk-${Date.now()}`;
    const newWorker: Worker = {
      id: newWorkerId,
      name: name.trim(),
      aadhaarHash: maskedAadhaar,
      phone: phone.trim(),
      contractorId: safeContractor.id,
      skillType: skillType,
      dailyWageRate: Number(dailyWageRate) || 480,
      status: 'Available',
      onboardingVerified: true,
      onboardingDate: new Date().toISOString().split('T')[0]
    };

    onAddWorker(newWorker);
    showNotice(
      `সফল! ছুপাৰভাইজাৰ ${supervisor?.name || 'Supervisor'} দ্বাৰা শ্ৰমিক ${name} ক কণ্ট্ৰেক্টৰ ${safeContractor.name} ৰ অধীনত পোনপটীয়াকৈ ভৰ্তি কৰা হ'ল!`,
      'success'
    );

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden space-y-0">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30 shrink-0">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ছুপাৰভাইজাৰ পোনপটীয়া এন্ট্ৰি (Direct Entry)
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                  {safeContractor.name.split(' ')[0]}
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base mt-1">
                স্মাৰ্টফোন নথকা শ্ৰমিকৰ পোনপটীয়া নামভৰ্তি
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                শ্ৰমিকৰ হাতত এণ্ড্ৰইড ফোন নাথাকিলেও ছুপাৰভাইজাৰে নিজৰ পেনেলৰ পৰা ১-মিনিটত ভৰ্তি কৰাব পাৰে।
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Offline Phone Note */}
        <div className="bg-amber-50 border-y border-amber-200/80 px-5 py-2.5 flex items-center gap-2.5 text-xs text-amber-900">
          <Smartphone className="h-4 w-4 text-amber-600 shrink-0" />
          <div>
            <strong>এণ্ড্ৰইড ফোন বাধ্যতামূলক নহয়:</strong> শ্ৰমিকৰ সাধাৰণ কী-পেড ফোন বা পৰিয়ালৰ সদস্যৰ ফোন নম্বৰ ব্যৱহাৰ কৰিব পাৰি।
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          
          {/* Worker Full Name */}
          <div>
            <label className="block text-slate-700 font-extrabold mb-1">
              শ্ৰমিকৰ সম্পূৰ্ণ নাম (Worker Full Name) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Gopal Kumar / Babul Das"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-900 outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Contact Phone & Offline Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                মোবাইল নম্বৰ (Phone Number) *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-slate-900 outline-none focus:border-indigo-500 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                আধাৰ নম্বৰৰ শেষৰ ৪ টা সংখ্যা (Aadhaar / ID)
              </label>
              <input
                type="text"
                maxLength={12}
                placeholder="e.g. 8920 (Last 4 digits)"
                value={aadhaarLastDigits}
                onChange={(e) => setAadhaarLastDigits(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono font-bold text-slate-900 outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          {/* Offline / No Smartphone Toggle */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between cursor-pointer" onClick={() => setHasNoSmartphone(!hasNoSmartphone)}>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hasNoSmartphone}
                onChange={(e) => setHasNoSmartphone(e.target.checked)}
                className="h-4 w-4 text-emerald-600 rounded cursor-pointer"
              />
              <div>
                <span className="font-extrabold text-slate-800 block text-xs">
                  শ্ৰমিকৰ হাতত স্মাৰ্টফোন নাই (Non-Smartphone / Offline Labourer)
                </span>
                <span className="text-[10px] text-slate-500 block">
                  ছুপাৰভাইজাৰে নিজৰ মোবাইলৰ পৰাই এই শ্ৰমিকৰ দৈনিক হাজিৰা নিয়ন্ত্ৰণ কৰিব।
                </span>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full">
              অফলাইন শ্ৰমিক
            </span>
          </div>

          {/* Skill Category & Daily Wage Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                দক্ষতাৰ শ্ৰেণী (Skill Category) *
              </label>
              <select
                value={skillType}
                onChange={(e: any) => handleSkillChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 outline-none focus:border-indigo-500 text-xs"
              >
                <option value="Unskilled">Unskilled (অদক্ষ - ₹480/দিন)</option>
                <option value="Semi-Skilled">Semi-Skilled (অৰ্ধ-দক্ষ - ₹550/দিন)</option>
                <option value="Skilled">Skilled (দক্ষ - ₹650/দিন)</option>
                <option value="Highly-Skilled">Highly-Skilled (উচ্চ-দক্ষ - ₹850/দিন)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                দৈনিক মজুৰি হাৰ (Daily Wage Rate ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  min={300}
                  max={2500}
                  value={dailyWageRate}
                  onChange={(e) => setDailyWageRate(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-3 py-2.5 font-mono font-black text-slate-900 outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Assigned Shift & Assigned Contractor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                নিৰ্ধাৰিত শিফ্ট (Assigned Shift)
              </label>
              <select
                value={assignedShift}
                onChange={(e) => setAssignedShift(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-bold text-slate-800 outline-none focus:border-indigo-500 text-xs"
              >
                <option value="General (09:00 - 17:00)">General (09:00 - 17:00)</option>
                <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                <option value="Shift C (22:00 - 06:00)">Shift C (22:00 - 06:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-extrabold mb-1">
                লেবাৰ কণ্ট্ৰেক্টৰ (Contractor Agency)
              </label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 text-xs truncate">
                🏢 {safeContractor.name}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              বাতিল কৰক (Cancel)
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              {isSubmitting ? 'ভৰ্তি কৰা হৈছে...' : 'পোনপটীয়াকৈ ভৰ্তি কৰক (Enrol Worker)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
