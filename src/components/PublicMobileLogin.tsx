import React from 'react';
import { Smartphone, ArrowRight, CheckCircle2, UserCheck, ShieldCheck, Key } from 'lucide-react';

interface PublicMobileLoginProps {
  mobileLoginPhone: string;
  setMobileLoginPhone: (val: string) => void;
  mobileOtpSent: boolean;
  setMobileOtpSent: (val: boolean) => void;
  mobileOtpCode: string;
  mobileOtpInput: string;
  setMobileOtpInput: (val: string) => void;
  mobileDetectedName: string | null;
  mobileSelectedRole: 'tea_garden' | 'contractor' | 'supervisor' | 'worker';
  setMobileSelectedRole: (val: 'tea_garden' | 'contractor' | 'supervisor' | 'worker') => void;
  mobileOtpSmsBanner: string | null;
  setMobileOtpSmsBanner: (val: string | null) => void;
  handleSendMobileOtp: (e?: React.FormEvent, directPhone?: string) => void;
  handleVerifyMobileOtp: (e: React.FormEvent) => void;
  onOpenMasterKey: () => void;
  showNotice: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PublicMobileLogin: React.FC<PublicMobileLoginProps> = ({
  mobileLoginPhone,
  setMobileLoginPhone,
  mobileOtpSent,
  setMobileOtpSent,
  mobileOtpCode,
  mobileOtpInput,
  setMobileOtpInput,
  mobileDetectedName,
  mobileSelectedRole,
  setMobileSelectedRole,
  mobileOtpSmsBanner,
  setMobileOtpSmsBanner,
  handleSendMobileOtp,
  handleVerifyMobileOtp,
  onOpenMasterKey,
  showNotice
}) => {
  return (
    <div className="max-w-md mx-auto space-y-6 animate-fadeIn py-2">
      
      {/* Mobile OTP SMS Notification Banner */}
      {mobileOtpSmsBanner && (
        <div className="bg-slate-900 border-2 border-emerald-500/80 text-emerald-300 p-4 rounded-2xl text-xs font-mono font-bold flex flex-col justify-between items-start gap-2.5 shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-xl">📱</span>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Simulated Telecom SMS Gateway
              </span>
              <span className="text-xs text-white">{mobileOtpSmsBanner}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setMobileOtpInput(mobileOtpCode);
              showNotice('OTP Auto-filled! এতিয়া প্ৰৱেশ বুটামত ক্লিক কৰক।', 'success');
            }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2 rounded-xl text-xs font-sans font-black tracking-wide uppercase transition-all cursor-pointer shadow-sm active:scale-95 text-center"
          >
            ⚡ Auto-Fill OTP / অ’টিপি ভৰাওক ({mobileOtpCode})
          </button>
        </div>
      )}

      {/* Main Public Interactive Login Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5 pb-2 border-b border-slate-100">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs border border-emerald-100">
            <Smartphone className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            মোবাইল নম্বৰ আৰু OTP দ্বাৰা প্ৰৱেশ
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            শ্ৰমিক, চৰ্দাৰ, কণ্ট্ৰেক্টৰ আৰু উদ্যোগিক প্ৰশাসনৰ বাবে একক সুৰক্ষিত প্ৰৱেশদ্বাৰ
          </p>
        </div>

        {/* Step 1: Mobile Number Input */}
        {!mobileOtpSent ? (
          <form onSubmit={(e) => handleSendMobileOtp(e)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                আপোনাৰ মোবাইল নম্বৰ (Enter Mobile Number)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-600 select-none border-r border-slate-200 pr-2.5 py-0.5">
                  <span className="text-sm">🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  placeholder="৯৮৭৬৫ ৪৩২১০"
                  value={mobileLoginPhone}
                  onChange={(e) => setMobileLoginPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-emerald-500 rounded-2xl pl-20 pr-4 py-3.5 text-base font-bold tracking-wider text-slate-900 outline-none transition-all focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                লগইনৰ বাবে এই নম্বৰলৈ এটা ৬-ডিজিটৰ সুৰক্ষিত OTP প্ৰেৰণ কৰা হ’ব।
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>OTP প্ৰেৰণ কৰক (Request OTP)</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Fast Click-to-Test Suggested Demo Accounts */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                পৰীক্ষাৰ বাবে নমুনা একাউণ্ট (Click to Test):
              </span>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleSendMobileOtp(undefined, '9876543214')}
                  className="text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🍃</span>
                    <div>
                      <div className="font-bold text-slate-800 text-[11px] group-hover:text-emerald-800">
                        চাহ বাগিচা চৰ্দাৰ (Mina Munda - Mornoi TE)
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">+91 9876543214</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    লগইন &rarr;
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMobileOtp(undefined, '9876543211')}
                  className="text-left p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-300 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏢</span>
                    <div>
                      <div className="font-bold text-slate-800 text-[11px] group-hover:text-indigo-800">
                        লেবাৰ কণ্ট্ৰেক্টৰ (Apex Solutions)
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">+91 9876543211</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    লগইন &rarr;
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMobileOtp(undefined, '9876543220')}
                  className="text-left p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-300 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">👷</span>
                    <div>
                      <div className="font-bold text-slate-800 text-[11px] group-hover:text-amber-800">
                        কাৰখানা ছুপাৰভাইজাৰ (Ramesh Kalita)
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">+91 9876543220</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    লগইন &rarr;
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMobileOtp(undefined, '9876543210')}
                  className="text-left p-2 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200/80 hover:border-purple-300 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏭</span>
                    <div>
                      <div className="font-bold text-slate-800 text-[11px] group-hover:text-purple-800">
                        উদ্যোগিক এইচ.আৰ. (Tata Motors)
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">+91 9876543210</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    লগইন &rarr;
                  </span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Verification Form */
          <form onSubmit={handleVerifyMobileOtp} className="space-y-4">
            
            {/* Phone banner with change link */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">●</span>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">প্ৰেৰণ কৰা নম্বৰ:</span>
                  <span className="text-xs font-mono font-bold text-slate-800">+91 {mobileLoginPhone}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileOtpSent(false);
                  setMobileOtpSmsBanner(null);
                  setMobileOtpInput('');
                }}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
              >
                নম্বৰ সলনি কৰক
              </button>
            </div>

            {mobileDetectedName && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-800 flex items-center gap-2 font-bold">
                <UserCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>পৰিচয় নিশ্চিত: {mobileDetectedName}</span>
              </div>
            )}

            {!mobileDetectedName && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  কাৰ্যক্ষেত্ৰ বাছনি কৰক (Select Sector):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMobileSelectedRole('tea_garden')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      mobileSelectedRole === 'tea_garden'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>🍃 চাহ বাগিচা</span>
                    <span className="text-[10px] font-normal opacity-90">চৰ্দাৰ / হাজিৰা</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileSelectedRole('contractor')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      mobileSelectedRole === 'contractor'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>🏭 কাৰখানা</span>
                    <span className="text-[10px] font-normal opacity-90">কণ্ট্ৰেক্টৰ / শ্ৰমিক</span>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  ৬-ডিজিটৰ OTP প্ৰবিষ্ট কৰক (Enter 6-Digit OTP)
                </label>
                <button
                  type="button"
                  onClick={() => handleSendMobileOtp()}
                  className="text-[11px] text-emerald-600 hover:text-emerald-800 font-bold underline cursor-pointer"
                >
                  পুনৰ পঠিয়াওক (Resend)
                </button>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="• • • • • •"
                value={mobileOtpInput}
                onChange={(e) => setMobileOtpInput(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 border border-slate-300 focus:border-emerald-500 rounded-2xl py-3 text-center text-xl font-mono font-black tracking-widest text-slate-900 outline-none transition-all focus:ring-4 focus:ring-emerald-500/10"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-2xl text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>লগইন নিশ্চিত কৰক (Verify OTP & Enter)</span>
            </button>
          </form>
        )}

        {/* Secret Admin Master Key Discreet Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onOpenMasterKey}
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-700 font-bold cursor-pointer transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100"
          >
            <Key className="h-3.5 w-3.5 text-slate-400" />
            <span>এডমিন / ডেমো গোপন মোড (Admin Master Key)</span>
          </button>
        </div>

      </div>

      {/* Bottom Trust Badges */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium text-center">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          সুৰক্ষিত CLRA আৰু PL Act এনক্ৰিপশ্বন
        </span>
        <span>•</span>
        <span>₹১ প্ৰতি শ্ৰমিক দৈনিক</span>
      </div>

    </div>
  );
};
