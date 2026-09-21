import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
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
  onSelectPortal?: (portal: 'app') => void;
}

export default function GovernmentSeparationModal({ 
  isOpen, 
  onClose,
  onSelectPortal 
}: GovernmentSeparationModalProps) {
  const [activeTab, setActiveTab] = useState<'acts' | 'clra_framework' | 'epfo_esic' | 'audit_workflow'>('acts');

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
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 shadow-inner">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30 tracking-wide uppercase">
                  অসম চৰকাৰ শ্ৰম আয়ুক্তালয় বিধিসন্মত পৰিকাঠামো
                </span>
                <span className="text-slate-400 text-xs font-mono">Ref: SL/GOV-ASSAM/CLRA-FACTORIES/2026/V-05</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                ঔদ্যোগিক নিৰ্মাণ আৰু কাৰখানা শ্ৰম আইন (CLRA & Factories Act) নিৰীক্ষণ প্ৰতিবেদন
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl">
                Statutory Architecture Brief: Clarifying 100% Legal, Structural, and Digital Governance under the Factories Act, 1948, CLRA Act, 1970, EPFO, and ESIC in Assam & Northeast India.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Print official brief"
            >
              <Printer className="h-3.5 w-3.5 text-indigo-400" />
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
        <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-4 sm:px-6 py-3 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-200/90 leading-relaxed">
            <span className="font-bold text-indigo-300">চৰকাৰী পৰিদৰ্শন আৰু অডিট নীতি:</span> ShramikLink প্লেটফৰ্মে উদ্যোগিক প্ৰতিষ্ঠানসমূহৰ বাবে CLRA Section 21 ৰ অধীনত Compliance-Locked Billing কাৰ্যকৰী কৰে—য’ত প্ৰধান নিয়োগকৰ্তা (Principal Employer) আৰু অনুজ্ঞাপ্ৰাপ্ত ঠিকাদাৰৰ প্ৰতিটো চালান EPFO/ESIC ডিজিটেল ভেলিডেচনৰ পাছতহে প্ৰস্তুত হয়।
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-4 sm:px-6 bg-slate-900/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab('acts')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'acts'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>১. প্ৰযোজ্য আইন আৰু বিধি (Statutory Acts)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('clra_framework')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'clra_framework'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>২. CLRA Form XVI / XVII পঞ্জীয়ন</span>
          </button>

          <button
            onClick={() => setActiveTab('epfo_esic')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'epfo_esic'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>৩. EPFO / ESIC সুৰক্ষা আৰু চালান</span>
          </button>

          <button
            onClick={() => setActiveTab('audit_workflow')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit_workflow'
                ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>৪. পৰিদৰ্শক আৰু অডিট ডেক্স</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-300 flex-1">
          
          {activeTab === 'acts' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                    <Factory className="h-4 w-4" />
                    <span>The Factories Act, 1948 & Assam Rules</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-400 list-disc list-inside">
                    <li>কাৰখানা অনুজ্ঞাপত্ৰ আৰু LIN নম্বৰৰ ডিজিটেল নিৰীক্ষণ</li>
                    <li>দৈনিক ৮ ঘণ্টা শিফ্ট আৰু সাপ্তাহিক ৪৮ ঘণ্টাৰ সীমা</li>
                    <li>অভাৰটাইমৰ ক্ষেত্ৰত দুগুণ মজুৰি (Section 59) প্ৰতিশ্ৰুতি</li>
                    <li>স্বাস্থ্য, সুৰক্ষা আৰু কৰ্মস্থলী কল্যাণৰ চৰ্ত অনুসৰণ</li>
                  </ul>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <Building2 className="h-4 w-4" />
                    <span>Contract Labour (R&A) Act, 1970</span>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-400 list-disc list-inside">
                    <li>Principal Employer পঞ্জীয়ন চাৰ্টিফিকেট (Form I) সংৰক্ষণ</li>
                    <li>ঠিকাদাৰ অনুজ্ঞাপত্ৰ (Form VI) ম্যাদ নিৰীক্ষণ</li>
                    <li>মাস্টাৰ ৰোল আৰু মজুৰি বহী (Form XVI & XVII) স্বয়ংক্ৰিয় সংৰক্ষণ</li>
                    <li>Section 21 অনুসৰি প্ৰধান নিয়োগকৰ্তাৰ মজুৰি নিশ্চিতকৰণ</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Payment of Bonus Act, 1965 & Minimum Wages Act, 1948
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  প্ৰতিগৰাকী উদ্যোগিক শ্ৰমিকৰ বাবে অসম চৰকাৰৰ শ্ৰম বিভাগে সময়ে সময়ে জাৰি কৰা নূন্যতম মজুৰিৰ নিৰিখ (Unskilled, Semi-skilled, Skilled) স্বয়ংক্ৰিয়ভাৱে প্ৰযোজ্য হয়। বাৰ্ষিক লাভালাভৰ বিত্তীয় প্ৰতিবেদনৰ ভিত্তিত বিধি অনুসৰি ৮.৩৩% ৰ পৰা ২০% লৈ বোনাছ গণনা কৰা হয়।
                </p>
              </div>
            </div>
          )}

          {activeTab === 'clra_framework' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">CLRA অনুপালনৰ স্বয়ংক্ৰিয় রেজিস্টাৰ সংৰক্ষণ</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="font-mono text-indigo-400 font-bold block mb-1">Form XVI — Muster Roll</span>
                    <p className="text-slate-400 text-[11px]">দৈনিক প্ৰৱেশ-প্ৰস্থান আৰু শিফ্ট ভিত্তিক উপস্থিতি। বায়’মেট্ৰিক বা ছুপাৰভাইজাৰ সত্যাপনৰ সৈতে সংযোজিত।</p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="font-mono text-emerald-400 font-bold block mb-1">Form XVII — Register of Wages</span>
                    <p className="text-slate-400 text-[11px]">নূন্যতম মজুৰি, কৰ্তন (PF/ESI), মুঠ পৰিশোধ আৰু শ্ৰমিকৰ ডিজিটেল অনুমোদনৰ স্পষ্ট খতিয়ান।</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'epfo_esic' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  <span>Compliance-Locked Billing System</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  প্ৰধান নিয়োগকৰ্তাই ঠিকাদাৰক আদায় দিবলগীয়া মাহেকীয়া ইনভয়েচ কেতিয়াও অনুমোদন নহয় যেতিয়ালৈকে ঠিকাদাৰে শ্ৰমিকৰ ভৱিষ্যনিধি (EPF 12%) আৰু কৰ্মচাৰী ৰাজ্যিক বীমা (ESIC 3.25% + 0.75%) জমা দিয়াৰ অফিচিয়েল ECR চালান আপলোড নকৰে।
                </p>
                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300">
                  ✓ প্ৰধান নিয়োগকৰ্তাৰ আইনী দায়বদ্ধতা শূন্য কৰা হয়<br />
                  ✓ ভুৱা শ্ৰমিক বা প্ৰক্সি হাজিৰাৰ জৰিয়তে ধন আত্মসাত বন্ধ হয়
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit_workflow' && (
            <div className="space-y-4">
              <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-sm">চৰকাৰী পৰিদৰ্শক (Government Inspector) প’ৰ্টেল</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  শ্ৰম পৰিদৰ্শকসকলে নিৰ্ধাৰিত আইডিৰ জৰিয়তে যিকোনো সময়ত উদ্যোগ প্ৰতিষ্ঠান আৰু ঠিকাদাৰৰ ডিজিটেল রেজিস্টাৰ পৰিদৰ্শন কৰিব পাৰে, যাৰ ফলত কাগজৰ ফাইল বিচাৰি সময় নষ্ট কৰিব নালাগে।
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 border-t border-slate-800 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>This compliance charter is fully aligned with Assam Labour Regulations.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Factory className="h-4 w-4" />
              <span>পৰিদৰ্শন বন্ধ কৰক (Close Charter)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
