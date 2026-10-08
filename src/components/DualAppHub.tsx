import React, { useState } from 'react';
import { 
  Sprout, 
  Factory, 
  ShieldCheck, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Printer, 
  Building2, 
  Users, 
  FileText, 
  Award,
  ExternalLink,
  Lock,
  Smartphone,
  Check
} from 'lucide-react';
import logoUrl from '../assets/images/icwl_logo.png';

interface DualAppHubProps {
  onLaunchBaganLink: () => void;
  onLaunchUdyogLink: () => void;
  onOpenGovReport: () => void;
  currentSelectedApp?: 'bagan' | 'udyog' | null;
}

export default function DualAppHub({
  onLaunchBaganLink,
  onLaunchUdyogLink,
  onOpenGovReport,
  currentSelectedApp
}: DualAppHubProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyDirectLink = (type: 'bagan' | 'udyog') => {
    const url = `${window.location.origin}${window.location.pathname}?app=${type}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 px-2 sm:px-4">
      {/* Official Government Directive Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <Scale className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-amber-500/20 text-amber-300 text-[11px] font-black px-3 py-0.5 rounded-full border border-amber-500/40 uppercase tracking-wider">
                  অসম শ্ৰম আয়ুক্তালয়ৰ বিধিসন্মত নিৰ্দেশনা (Govt Statutory Directive)
                </span>
                <span className="text-slate-400 text-xs font-mono">PLA vs CLRA Separation Mandate</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                দুটা সুকীয়া স্বতন্ত্ৰ এপ্লিকেচন (Two Autonomous Applications)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                চৰকাৰী নিয়ম আৰু শ্ৰম আইনৰ বাধ্যবাধকতা অনুসৰি <strong>সুসংগঠিত চাহ বাগিচা</strong> আৰু <strong>অসংগঠিত ঔদ্যোগিক কাৰখানা</strong>ৰ বাবে ১০০% পৃথক দুটা স্বতন্ত্ৰ ছফ্টৱেৰ এপ প্ৰদান কৰা হৈছে।
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
            <button
              onClick={onOpenGovReport}
              className="flex-1 md:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Award className="h-4 w-4 text-slate-950" />
              <span>চৰকাৰী আইনী প্ৰমাণপত্ৰ (Govt Brief)</span>
            </button>
          </div>
        </div>

        {/* Legal Assurance Points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span><strong>পৃথক আইনী বিধিপ্ৰণয়ন:</strong> PLA 1951 বনাম CLRA 1970</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span><strong>পৃথক ভৱিষ্যনিধি ব'ৰ্ড:</strong> ATPO বনাম কেন্দ্ৰীয় EPFO</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span><strong>ডাটাবেচ বিভাজন:</strong> Zero Data Contamination</span>
          </div>
        </div>
      </div>

      {/* THE TWO APPS CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ================= APP 1: BAGANLINK ================= */}
        <div className="bg-slate-900 rounded-3xl border-2 border-emerald-500/60 overflow-hidden shadow-2xl flex flex-col hover:border-emerald-400 transition-all group">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-6 border-b border-emerald-800/80 relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-md">
                  <Sprout className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-500/30 text-emerald-200 font-bold px-2.5 py-0.5 rounded-full border border-emerald-400/40 uppercase">
                      App #1 • স্বতন্ত্ৰ বাগিচা এপ্প
                    </span>
                    <span className="text-emerald-300 text-xs font-mono font-bold">PLA 1951</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    বাগান-লিংক <span className="text-emerald-400 font-light text-xl">(BaganLink)</span>
                  </h2>
                  <p className="text-xs text-emerald-200/90 font-medium">
                    চাহ বাগিচা শ্ৰমিক, মহৰী আৰু চৰ্দাৰ হাজিৰা ব্যৱস্থাপনা প্ৰণালী
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-2xl p-4 text-xs space-y-2 text-emerald-100">
                <div className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                  <Scale className="h-4 w-4" />
                  <span>চৰকাৰী বিধিসন্মত প্ৰফাইল (Statutory Profile):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block">আইন (Statute):</span>
                    <span className="text-white font-bold">Plantations Labour Act, 1951</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">পি এফ ব'ৰ্ড (PF Board):</span>
                    <span className="text-emerald-300 font-bold">ATPO / APF (অসম চৰকাৰ)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">মজুৰি মাপকাঠি:</span>
                    <span className="text-white">সেউজ পাতৰ ওজন (Kg) + ঠিকা</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">বাৰ্ষিক বোনাছ:</span>
                    <span className="text-emerald-300">পূজাৰ ত্ৰিপাক্ষিক চুক্তি (ACMS)</span>
                  </div>
                </div>
              </div>

              {/* Core Features */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  মূল মডিউলসমূহ (Core Modules):
                </span>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>চৰ্দাৰ ডিজিটেল হাজিৰা বহী:</strong> ফিল্ড সেকশ্বন আৰু পাত তোলা দলৰ দৈনিক এন্ট্ৰি।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>মহৰী আৰু পৰিদৰ্শক অনুমোদন:</strong> পাতৰ ওজন আৰু ছাঁচ কাটি নিমিষতে লক কৰা।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>ATPO ভৱিষ্যনিধি চালান:</strong> অসম চাহ কৰ্মচাৰী পি এফৰ বাবে নিৰ্ভুল প্ৰতিবেদন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>পূজা বোনাছ গণনা:</strong> চৰকাৰী শ্ৰম বিভাগ আৰু ACMS ত্ৰিপাক্ষিক হাৰ নিৰ্ধাৰণ।</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <button
                id="launch-baganlink-btn"
                onClick={onLaunchBaganLink}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-950 transition-all cursor-pointer active:scale-98"
              >
                <Sprout className="h-5 w-5" />
                <span>🌿 বাগান-লিংক (BaganLink) এপ খোলক</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <button
                  onClick={() => copyDirectLink('bagan')}
                  className="hover:text-emerald-400 flex items-center gap-1 font-mono transition-colors cursor-pointer"
                >
                  {copiedLink === 'bagan' ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">URL কপি হ'ল (?app=bagan)</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3 w-3" />
                      <span>Direct URL: ?app=bagan</span>
                    </>
                  )}
                </button>
                <span className="text-emerald-400 font-bold">Package: com.icwl.baganlink</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= APP 2: UDYOGLINK ================= */}
        <div className="bg-slate-900 rounded-3xl border-2 border-indigo-500/60 overflow-hidden shadow-2xl flex flex-col hover:border-indigo-400 transition-all group">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 p-6 border-b border-indigo-800/80 relative">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border-2 border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-md">
                  <Factory className="h-8 w-8 text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-indigo-500/30 text-indigo-200 font-bold px-2.5 py-0.5 rounded-full border border-indigo-400/40 uppercase">
                      App #2 • স্বতন্ত্ৰ উদ্যোগ এপ্প
                    </span>
                    <span className="text-indigo-300 text-xs font-mono font-bold">CLRA 1970</span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    উদ্যোগ-লিংক <span className="text-indigo-400 font-light text-xl">(UdyogLink)</span>
                  </h2>
                  <p className="text-xs text-indigo-200/90 font-medium">
                    ঔদ্যোগিক নিৰ্মাণ আৰু ঠিকা শ্ৰমিক অনুপালন প্ৰণালী
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="bg-indigo-950/40 border border-indigo-800/50 rounded-2xl p-4 text-xs space-y-2 text-indigo-100">
                <div className="font-bold text-indigo-300 text-sm flex items-center gap-1.5">
                  <Scale className="h-4 w-4" />
                  <span>চৰকাৰী বিধিসন্মত প্ৰফাইল (Statutory Profile):</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block">আইন (Statute):</span>
                    <span className="text-white font-bold">Factories Act 1948 & CLRA 1970</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">পি এফ ব'ৰ্ড (PF Board):</span>
                    <span className="text-indigo-300 font-bold">EPFO (নতুন দিল্লী) & ESIC</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">মজুৰি মাপকাঠি:</span>
                    <span className="text-white">৮-ঘণ্টাৰ শিফ্ট + ২ গুণ অ'ভাৰটাইম</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">বাৰ্ষিক বোনাছ:</span>
                    <span className="text-indigo-300">Payment of Bonus Act (8.33%-20%)</span>
                  </div>
                </div>
              </div>

              {/* Core Features */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  মূল মডিউলসমূহ (Core Modules):
                </span>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Compliance-Locked Billing:</strong> EPFO আৰু ESIC চালান অবিহনে বিল ব্লক কৰা।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>CLRA Form XVI & XVII:</strong> চৰকাৰী ঠিকাদাৰ হাজিৰা আৰু মজুৰি ৰেজিষ্টাৰ প্ৰিণ্ট।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>গে'ট এন্ট্ৰি ও ছুপাৰভাইজাৰ অনুমোদন:</strong> বায়মেট্ৰিক ও জিলাভিত্তিক শ্ৰমিক পঞ্জীয়ন।</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>₹1 প্ৰতিদিনে মাইক্ৰ’-SaaS আৰ্হি:</strong> Principal Employer আৰু Vendor ৰ বাবে স্বচ্ছ অডিট।</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <button
                id="launch-udyoglink-btn"
                onClick={onLaunchUdyogLink}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-950 transition-all cursor-pointer active:scale-98"
              >
                <Factory className="h-5 w-5" />
                <span>🏭 উদ্যোগ-লিংক (UdyogLink) এপ খোলক</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <button
                  onClick={() => copyDirectLink('udyog')}
                  className="hover:text-indigo-400 flex items-center gap-1 font-mono transition-colors cursor-pointer"
                >
                  {copiedLink === 'udyog' ? (
                    <>
                      <Check className="h-3 w-3 text-indigo-400" />
                      <span className="text-indigo-400 font-bold">URL কপি হ'ল (?app=udyog)</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-3 w-3" />
                      <span>Direct URL: ?app=udyog</span>
                    </>
                  )}
                </button>
                <span className="text-indigo-400 font-bold">Package: com.icwl.udyoglink</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Official Legal Undertaking by Founder Bhaskar Senapati */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-xs text-slate-300 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">
              শ্ৰম আয়ুক্তালয় আৰু মুখ্য কাৰখানা/বাগিচা পৰিদৰ্শকক দিয়া বিধিসন্মত প্ৰতিশ্ৰুতি পত্ৰ
            </span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">Assam Labour Dept Submission</span>
        </div>

        <p className="leading-relaxed">
          "মই <strong>ভাস্কৰ সেনাপতি</strong> (প্ৰতিষ্ঠাপক, IndustrialContractorWorkerLink / ICWL), ইয়াৰ দ্বাৰা স্পষ্ট কৰিছোঁ যে আমাৰ প্লেটফৰ্মত <strong>বাগান-লিংক (BaganLink)</strong> আৰু <strong>উদ্যোগ-লিংক (UdyogLink)</strong> দুটা সম্পূর্ণ স্বতন্ত্ৰ প্ৰণালী। চাহ বাগিচাৰ শ্ৰমিক সুসংগঠিত হোৱাৰ বাবে তেওঁলোকৰ হিচাপ অসম চৰকাৰৰ <em>Plantations Labour Act, 1951</em> আৰু <em>ATPO গুৱাহাটী</em>ৰ অধীনত ৰখা হৈছে। আনহাতে কাৰখানাৰ ঠিকা শ্ৰমিকৰ হিচাপ <em>Factories Act, 1948</em> আৰু <em>CLRA Act, 1970</em> ৰ অধীনত কেন্দ্ৰীয় <em>EPFO/ESIC</em> ত ৰখা হৈছে। কোনো কাৰণতে এই দুয়োটা ডাটাবেচৰ মাজত খেলিমেলি বা ডাটা সংমিশ্ৰণ নহয়।"
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div>
            <strong>প্ৰতিষ্ঠাপক:</strong> ভাস্কৰ সেনাপতি (Bhaskar Senapati) | অসম, ভাৰতবৰ্ষ
          </div>
          <button
            onClick={onOpenGovReport}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            আইনী প্ৰতিবেদন সম্পূৰ্ণকৈ পঢ়ক ও প্ৰিণ্ট কৰক →
          </button>
        </div>
      </div>
    </div>
  );
}
