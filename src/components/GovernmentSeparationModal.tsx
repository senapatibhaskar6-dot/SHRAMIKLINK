import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Sprout, 
  Factory, 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Users, 
  Download, 
  X,
  Award,
  ChevronRight,
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface GovernmentSeparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPortal?: (portal: 'tea_garden' | 'app') => void;
}

export default function GovernmentSeparationModal({ 
  isOpen, 
  onClose,
  onSelectPortal 
}: GovernmentSeparationModalProps) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'legal_acts' | 'pf_difference' | 'workflow'>('matrix');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 p-4 sm:p-6 flex items-start justify-between relative">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 shadow-inner">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 tracking-wide uppercase">
                  অসম শ্ৰম বিভাগ ও চৰকাৰী পৰিদৰ্শন বিশেষ প্ৰতিবেদন
                </span>
                <span className="text-slate-400 text-xs font-mono">Ref: SL/GOV-ASSAM/PLA-CLRA/2026/V-04</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                চাহ বাগিচা (Organised) বনাম ঔদ্যোগিক ঠিকাদাৰী (Unorganised) সুকীয়া আইনী সংৰচনা
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Statutory Architecture Brief: Clarifying 100% Legal, Structural, and Database Separation between Tea Estates (PLA 1951 / ATPO) and General Manufacturing (Factories Act / CLRA / EPFO).
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Print official brief"
            >
              <Printer className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">প্ৰিণ্ট / PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Statutory Declaration Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 sm:px-6 py-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200/90 leading-relaxed">
            <span className="font-bold text-amber-300">চৰকাৰী নিৰ্দেশনা আৰু আপত্তিৰ প্ৰতি ShramikLinks ৰ স্পষ্ট প্ৰতিশ্ৰুতি:</span> চাহ বাগানৰ শ্ৰমিক সুসংগঠিত (Organised Tea Labour) আৰু কাৰখানাৰ ঠিকা শ্ৰমিক অসংগঠিত (Unorganised Contract Labour)। দুয়োটাৰ আইন, মজুৰি নীতি, ভৱিষ্যনিধি আৰু অডিট একেবাৰে সুকীয়া। ShramikLinks এ দুয়োটাকে কেতিয়াও একেলগ নকৰে—বৰঞ্চ তলৰ দৰে **দুটা পৃথক পোৰ্টেল (Dual Autonomous Suites)** ৰূপে পৰিচালনা কৰে।
          </div>
        </div>

        {/* Dual Suite Quick Switcher inside Modal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 sm:px-6 bg-slate-950/60 border-b border-slate-800">
          
          {/* Suite 1: BaganLink */}
          <div 
            onClick={() => {
              onSelectPortal('tea_garden');
              onClose();
            }}
            className="group p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/40 cursor-pointer transition-all flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Sprout className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-white text-sm group-hover:text-emerald-300 transition-colors">
                    🌿 বাগান-লিংক (BaganLink)
                  </h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">
                    Organised PLA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Assam Plantations Labour Act, 1951 & ATPO/APF ব’ৰ্ডৰ অধীনত সুকীয়া চাহ বাগিচা পোৰ্টেল
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
          </div>

          {/* Suite 2: UdyogLink */}
          <div 
            onClick={() => {
              onSelectPortal('app');
              onClose();
            }}
            className="group p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-950/40 cursor-pointer transition-all flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Factory className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-white text-sm group-hover:text-indigo-300 transition-colors">
                    🏭 উদ্যোগ-লিংক (UdyogLink)
                  </h3>
                  <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded font-bold uppercase">
                    Unorganised CLRA
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Factories Act, 1948, CLRA Act, 1970 আৰু কেন্দ্ৰীয় EPFO/ESIC অধীনত ঔদ্যোগিক পোৰ্টেল
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-indigo-400 transition-colors shrink-0" />
          </div>

        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-4 sm:px-6 bg-slate-900/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>১. দ্বৈত আইনী তুলনা তালিকা (Statutory Matrix)</span>
          </button>

          <button
            onClick={() => setActiveTab('pf_difference')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pf_difference'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>২. সুকীয়া ভৱিষ্যনিধি ব’ৰ্ড (ATPO বনাম EPFO)</span>
          </button>

          <button
            onClick={() => setActiveTab('legal_acts')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'legal_acts'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>৩. আইন আৰু বিধিগত প্ৰমাণপত্ৰ (Statutory Acts)</span>
          </button>

          <button
            onClick={() => setActiveTab('workflow')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'workflow'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>৪. ডাটা সুৰক্ষা ও আইছ’লেচন (Zero Leakage)</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: MATRIX */}
          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  আইনগত আৰু পৰিচালনাগত সম্পূৰ্ণ সুকীয়া তুলনামূলক তালিকা (Direct Statutory Comparison)
                </h4>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Approved Separation Architecture
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                      <th className="p-3 sm:p-3.5 border-r border-slate-800 w-1/4">বিধান / কাৰক (Parameter)</th>
                      <th className="p-3 sm:p-3.5 border-r border-slate-800 w-3/8 text-emerald-300 bg-emerald-950/20">
                        🌿 চাহ বাগিচা বিশেষ পোৰ্টেল (BaganLink)
                        <div className="text-[9px] text-emerald-400/80 font-normal lowercase">organised plantation workforce</div>
                      </th>
                      <th className="p-3 sm:p-3.5 w-3/8 text-indigo-300 bg-indigo-950/20">
                        🏭 ঔদ্যোগিক ঠিকাদাৰী পোৰ্টেল (UdyogLink)
                        <div className="text-[9px] text-indigo-400/80 font-normal lowercase">unorganised contract workforce</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white border-r border-slate-800">
                        ১. শাসনকাৰী আইন (Governing Act)
                      </td>
                      <td className="p-3 border-r border-slate-800 bg-emerald-950/10 text-emerald-200">
                        <strong>Plantations Labour Act (PLA), 1951</strong> & Assam Plantations Labour Rules, 1956.
                      </td>
                      <td className="p-3 bg-indigo-950/10 text-indigo-200">
                        <strong>Factories Act, 1948</strong> & <strong>Contract Labour (Regulation & Abolition) Act, 1970</strong>.
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white border-r border-slate-800">
                        ২. শ্ৰমিক সংগঠন আৰু ইউনিয়ন (Workforce Nature)
                      </td>
                      <td className="p-3 border-r border-slate-800 bg-emerald-950/10 text-emerald-200">
                        <strong>অত্যন্ত সুসংগঠিত (Highly Organised)</strong>: স্থায়ী আৰু বস্তী শ্ৰমিক। ACMS আৰু বাগিচা মেনেজমেন্টৰ মাজত ত্ৰিপাক্ষিক চুক্তি।
                      </td>
                      <td className="p-3 bg-indigo-950/10 text-indigo-200">
                        <strong>অসংগঠিত ও স্থানান্তৰযোগ্য (Unorganised / Floating)</strong>: ঠিকাদাৰ বা লেবাৰ ভেণ্ডৰৰ অধীনত দৈনিক স্থানান্তৰিত শ্ৰমিক।
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white border-r border-slate-800">
                        ৩. হাজিৰা আৰু মজুৰি নিৰ্ধাৰণ (Wage & Task Metric)
                      </td>
                      <td className="p-3 border-r border-slate-800 bg-emerald-950/10 text-emerald-200">
                        <strong>পাত তোলাৰ ওজন (Green Leaf Kg)</strong>, দৈনিক হাজিৰা টাস্ক (Standard Hazira Task, যেনে ২১-২৪ কেজি), আৰু ওপৰঞ্চি ঠিকা (Ticca Rate)।
                      </td>
                      <td className="p-3 bg-indigo-950/10 text-indigo-200">
                        <strong>৮-ঘণ্টাৰ শিফ্ট হাজিৰা (8-Hr Shift)</strong>, দক্ষতানুযায়ী নূন্যতম মজুৰি, আৰু কাৰখানা আইনৰ ধাৰা ৫৯ অনুসৰি ২ গুণ অ’ভাৰটাইম (2x OT)।
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white border-r border-slate-800">
                        ৪. ভৱিষ্যনিধি সংৰচনা (Provident Fund Body)
                      </td>
                      <td className="p-3 border-r border-slate-800 bg-emerald-950/10 text-emerald-200">
                        <strong>ATPO / APF</strong> — অসম চাহ শ্ৰচাৰী ভৱিষ্যনিধি সংস্থা (Assam Tea Employees Provident Fund Organization, Guwahati)।
                      </td>
                      <td className="p-3 bg-indigo-950/10 text-indigo-200">
                        <strong>EPFO & ESIC</strong> — কেন্দ্ৰীয় শ্ৰম মন্ত্ৰালয়ৰ Employees' Provident Fund Organisation (New Delhi)।
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white border-r border-slate-800">
                        ৫. বাৰ্ষিক বোনাছ পদ্ধতি (Annual Bonus Framework)
                      </td>
                      <td className="p-3 border-r border-slate-800 bg-emerald-950/10 text-emerald-200">
                        <strong>ত্ৰিপাক্ষিক পূজা বোনাছ চুক্তি (Tripartite Pre-Puja Agreement)</strong>: শ্ৰম বিভাগ, ACMS, আৰু বাগিচা মালিকপক্ষৰ মাজত স্বাক্ষৰিত শতাংশ (৮.৩৩% - ২০%)।
                      </td>
                      <td className="p-3 bg-indigo-950/10 text-indigo-200">
                        <strong>Payment of Bonus Act, 1965</strong>: ফেক্টৰীৰ ব্যৱসায়িক লাভালাভ আৰু বেলেঞ্চ চীটৰ ওপৰত নিৰ্ভৰ কৰি ৮.৩৩% ৰ পৰা ২০% গণনা।
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white border-r border-slate-800">
                        ৬. নথি আৰু বহী ডিজিটাইজেচন (Muster Roll Registers)
                      </td>
                      <td className="p-3 border-r border-slate-800 bg-emerald-950/10 text-emerald-200">
                        <strong>ডিজিটেল হাজিৰা বহী (Digital Hajira Bahi)</strong>: মহৰী আৰু চৰ্দাৰৰ দলভিত্তিক সেউজ পাত খতিয়ান, ছেকচন আৰু প্ৰুনিং ৰেকৰ্ড।
                      </td>
                      <td className="p-3 bg-indigo-950/10 text-indigo-200">
                        <strong>CLRA Form XVI (Muster Roll)</strong> & <strong>Form XVII (Register of Wages)</strong>: ঠিকাদাৰ অনুজ্ঞাপত্ৰ আৰু গেটপাছ অডিট।
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-white border-r border-slate-800">
                        ৭. কল্যাণমূলক বিধি (Mandatory Statutory Welfare)
                      </td>
                      <td className="p-3 border-r border-slate-800 bg-emerald-950/10 text-emerald-200">
                        বাগিচা হাস্পতাল, ক্ৰেচ (Crèche), ৰেচন আৰু বাসস্থান (PLA ধাৰা ৮-১৫)।
                      </td>
                      <td className="p-3 bg-indigo-950/10 text-indigo-200">
                        কাৰখানা কেণ্টিন, প্ৰাথমিক চিকিৎসা, আৰু ESIC ডিস্পেন্সাৰী সুবিধা।
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PF DIFFERENCE */}
          {activeTab === 'pf_difference' && (
            <div className="space-y-5">
              <div className="bg-emerald-950/30 border border-emerald-500/30 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <Building2 className="h-5 w-5" />
                  <span>কিয় চাহ বাগিচা আৰু ফেক্টৰীৰ PF একেলগ কৰিব নোৱাৰি? (The Legal Reality of ATPO vs EPFO)</span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  ভাৰত চৰকাৰৰ শ্ৰম আইন অনুসৰি সমগ্ৰ দেশত EPFO প্ৰযোজ্য হ’লেও, <strong>অসমৰ চাহ বাগিচাসমূহৰ বাবে ১৯৫৫ চনৰ পৰাই এক বিশেষ স্বায়ত্তশাসিত সংস্থা আছে—ATPO (Assam Tea Employees Provident Fund Organization)</strong>। সেয়েহে এজন শ্ৰমিকৰ PF জমা কৰাৰ প্লেটফৰ্ম দুয়োটাৰ বাবে ১০০% সুকীয়া হ’ব লাগিব।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* ATPO Box */}
                <div className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-black text-emerald-300 text-sm">🌿 ATPO / APF (চাহ বাগিচা)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">Assam Special Act</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>আইনী পৰিকাঠামো:</strong> The Assam Tea Plantations Provident Fund and Pension Fund and Deposit Linked Insurance Fund Scheme Act, 1955.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>কাৰ্যালয়:</strong> Board of Trustees, ATPO, Basistha, Guwahati, Assam.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>কভাৰেজ:</strong> কেৱল অসমৰ চাহ বাগিচাৰ চাহ শ্ৰমিক আৰু কৰ্মচাৰীসকলৰ বাবে।</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>ShramikLinks ৰ কাৰ্য:</strong> বাগান-লিংকত বাগিচাৰ PLA নম্বৰ আৰু ATPO Estate Code অনুসৰি সুকীয়া চালান প্ৰস্তুত হয়।</span>
                    </li>
                  </ul>
                </div>

                {/* EPFO Box */}
                <div className="bg-slate-950 border border-indigo-500/40 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <span className="font-black text-indigo-300 text-sm">🏭 EPFO / ESIC (উদ্যোগিক কাৰখানা)</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">Central Act</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>আইনী পৰিকাঠামো:</strong> Employees' Provident Funds and Miscellaneous Provisions Act, 1952.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>কাৰ্যালয়:</strong> Ministry of Labour & Employment, Government of India, New Delhi.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>কভাৰেজ:</strong> কাৰখানা, তেল শোধনাগাৰ, চিমেণ্ট আৰু উৎপাদন খণ্ডৰ ঠিকাদাৰী শ্ৰমিক।</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span><strong>ShramikLinks ৰ কাৰ্য:</strong> উদ্যোগ-লিংকত Compliance-Locked Billing ৰ জৰিয়তে ঠিকাদাৰৰ EPFO TRRN চালান পৰীক্ষা কৰা হয়।</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: LEGAL ACTS */}
          {activeTab === 'legal_acts' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                শ্ৰমিকলিংকছৰ দুয়োটা পোৰ্টেলৰ আইনী প্ৰমাণপত্ৰ ও অনুশাসন (Statutory Backing)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Sprout className="h-4 w-4" />
                    <span>বাগান-লিংকৰ বাবে আইনী বিধি (Statutory Rules for Tea)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    ১. <strong>Plantations Labour Act, 1951</strong> (Act No. 69 of 1951)<br />
                    ২. <strong>Assam Plantations Labour Rules, 1956</strong><br />
                    ৩. <strong>The Assam Tea Plantations Provident Fund Act, 1955</strong><br />
                    ৪. <strong>Annual Tripartite Bonus Settlement Guidelines</strong> (ACMS & CCPA)<br />
                    ৫. <strong>Minimum Wages Act (Tea Plantation Notification)</strong>
                  </p>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-300 text-[11px] border border-emerald-500/20">
                    ✓ বাগান-লিংকত কেৱল বাগান পৰিচালক, মহৰী, চাহ চৰ্দাৰ আৰু চাহ শ্ৰমিকহে প্ৰৱেশ কৰিব পাৰে। কোনো ঔদ্যোগিক ঠিকাদাৰৰ সংযোগ ইয়াত নিষিদ্ধ।
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold">
                    <Factory className="h-4 w-4" />
                    <span>উদ্যোগ-লিংকৰ বাবে আইনী বিধি (Statutory Rules for Industry)</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    ১. <strong>The Factories Act, 1948</strong> (Health, Safety, 8-Hr Work)<br />
                    ২. <strong>The Contract Labour (R&A) Act, 1970</strong> (CLRA Licensing)<br />
                    ৩. <strong>The Payment of Bonus Act, 1965</strong> (Commercial Bonus)<br />
                    ৪. <strong>EPF & MP Act, 1952</strong> & <strong>ESI Act, 1948</strong><br />
                    ৫. <strong>The Payment of Wages Act, 1936</strong>
                  </p>
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-300 text-[11px] border border-indigo-500/20">
                    ✓ উদ্যোগ-লিংকত প্ৰধান নিয়োগকৰ্তা (Principal Employer) আৰু ঠিকাদাৰৰ মাজত Compliance-Locked চালান পৰীক্ষা কৰা হয়।
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: WORKFLOW & ZERO LEAKAGE */}
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                চৰকাৰক দেখুৱাবলৈ ৪-স্তৰীয় তথ্য সুৰক্ষা ও আইছ’লেচন গেৰাণ্টী (Zero Data Leakage Architecture)
              </h4>

              <div className="space-y-3">
                
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ১
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">ডাটাবেচ স্কিমাৰ সম্পূৰ্ণ বিভাজন (Isolated Database Schemas)</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      চাহ বাগানৰ তথ্য (পাত তোলাৰ ওজন, মহৰী হাজিৰা, ঠিকা, বাগান কোড) আৰু ফেক্টৰীৰ তথ্য (গেষ্ট হাউছ গেটপাছ, ঠিকাদাৰ অনুজ্ঞাপত্ৰ, শিফ্ট হাজিৰা) দুটা সুকীয়া স্কিমাত সংৰক্ষিত হয়। কোনো ডেটা কেতিয়াও মিহলি নহয়।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ২
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">চৰকাৰী পৰিদৰ্শকৰ বাবে সুকীয়া অডিট লগইন (Inspectorate Single-View)</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      শ্ৰম পৰিদৰ্শক (Labour Inspector) বা বাগান পৰিদৰ্শক (Inspector of Plantations) সকলে লগইন কৰোঁতে যিটো ক্ষেত্ৰ নিৰ্বাচন কৰিব, কেৱল সেই নিৰ্দিষ্ট আইনৰ ফৰ্ম আৰু চালানহে দেখিব।
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    ৩
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">মজুৰি আৰু বোনাছ সূত্ৰৰ সুকীয়া এলগৰিথম (Non-Conflicting Algorithms)</h5>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      চাহ বাগিচাত ত্ৰিপাক্ষিক চুক্তি অনুসৰি পূজাৰ আগত বোনাছ আৰু ঠিকা গণনা হয়। ঔদ্যোগিক কাৰখানাত বিত্তীয় বৰ্ষৰ লাভালাভৰ বেলেঞ্চ চীট অনুসৰি বোনাছ আৰু ২ গুণ অভাৰটাইম গণনা হয়।
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>This brief can be directly submitted to the Labour Commissionerate, Assam.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onSelectPortal('tea_garden');
                onClose();
              }}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sprout className="h-4 w-4" />
              <span>বাগান-লিংক পোৰ্টেল খোলক (BaganLink)</span>
            </button>

            <button
              onClick={() => {
                onSelectPortal('app');
                onClose();
              }}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Factory className="h-4 w-4" />
              <span>উদ্যোগ-লিংক পোৰ্টেল খোলক (UdyogLink)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
