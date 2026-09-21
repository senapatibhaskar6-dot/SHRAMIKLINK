import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Building2, 
  Scale, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  Info,
  BadgeCheck
} from 'lucide-react';
import { GovernmentLaborInspector } from '../types';

interface AssignedInspectorCardProps {
  inspector?: GovernmentLaborInspector | null;
  allInspectors: GovernmentLaborInspector[];
  entityType: 'industry' | 'contractor';
  entityName: string;
  entityLocationOrZone: string;
  onSelectInspector?: (inspectorId: string) => void;
  onViewAuditHistory?: () => void;
  onFileInquiry?: () => void;
}

export const AssignedInspectorCard: React.FC<AssignedInspectorCardProps> = ({
  inspector,
  allInspectors,
  entityType,
  entityName,
  entityLocationOrZone,
  onSelectInspector,
  onViewAuditHistory,
  onFileInquiry
}) => {
  const [showAllInspectorsModal, setShowAllInspectorsModal] = useState(false);

  // Fallback to first active inspector if none provided
  const activeInspector = inspector || allInspectors.find(i => i.active) || allInspectors[0];

  if (!activeInspector) {
    return null;
  }

  const cleanPhone = activeInspector.phone.replace(/\D/g, '');
  const waPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const waText = encodeURIComponent(
    `নমস্কাৰ ${activeInspector.name}, ShramikLink পৰ্টেলৰ পৰা যোগাযোগ কৰা হৈছে।\nপ্ৰতিষ্ঠান: ${entityName} (${entityType === 'industry' ? 'কাৰখানা এইচ.আৰ' : 'লেবাৰ কন্ট্ৰেক্টৰ'})\nস্থান/এলেকা: ${entityLocationOrZone}\nবিষয়: বিধিসন্মত শ্ৰম অনুপালন আৰু তদাৰকী (Statutory Compliance Transparency)`
  );

  return (
    <>
      <div 
        id={`assigned-inspector-card-${entityType}`}
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-500/30 shadow-md relative overflow-hidden"
      >
        {/* Subtle background badge watermark */}
        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none text-white">
          <Scale className="h-44 w-44" />
        </div>

        <div className="relative z-10 space-y-4">
          
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-indigo-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                <Scale className="h-4 w-4 text-amber-400" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/30">
                    চৰকাৰী বিধিসন্মত তদাৰকী (Statutory Oversight)
                  </span>
                  <span className="text-[10px] text-indigo-200 font-medium">
                    CLRA Act 1970 Sec 28 • Factories Act 1948
                  </span>
                </div>
                <h4 className="text-sm font-black text-white mt-0.5 flex items-center gap-1.5">
                  নিযুক্ত চৰকাৰী শ্ৰম পৰিদৰ্শক (Assigned Government Labor Inspector)
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                সক্ৰিয় কাৰ্যক্ষেত্ৰ (Active Jurisdiction)
              </span>

              {allInspectors.length > 1 && (
                <button
                  type="button"
                  onClick={() => setShowAllInspectorsModal(true)}
                  className="text-[11px] font-semibold text-indigo-200 hover:text-white bg-indigo-900/60 hover:bg-indigo-800/80 border border-indigo-700/50 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  title="ৰাজ্যিক পৰিদৰ্শক তালিকা চাওক (View State Inspectorate Directory)"
                >
                  অন্যান্য পৰিদৰ্শক ({allInspectors.length})
                  <ChevronDown className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Inspector Identity (5 Cols) */}
            <div className="md:col-span-5 space-y-1.5 border-b md:border-b-0 md:border-r border-indigo-800/40 pb-3 md:pb-0 md:pr-4">
              <div className="flex items-start gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center font-black text-amber-300 text-base shrink-0">
                  {activeInspector.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-white text-sm truncate">
                      {activeInspector.name}
                    </span>
                    <BadgeCheck className="h-4 w-4 text-amber-400 shrink-0" title="Verified Govt Inspector" />
                  </div>
                  <div className="text-[11px] text-amber-300/90 font-semibold truncate">
                    {activeInspector.designation}
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">
                    {activeInspector.department}
                  </div>
                  <div className="inline-block mt-1 bg-indigo-950/90 text-indigo-300 font-mono text-[9px] px-2 py-0.5 rounded border border-indigo-700/60">
                    বেজ ক্ৰমাংক: {activeInspector.badgeId}
                  </div>
                </div>
              </div>
            </div>

            {/* Jurisdiction Area Details (4 Cols) */}
            <div className="md:col-span-4 space-y-1.5 border-b md:border-b-0 md:border-r border-indigo-800/40 pb-3 md:pb-0 md:pr-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-200">
                  <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>অধিকাৰভুক্ত জিলা & মণ্ডল (Jurisdiction):</span>
                </div>
                <div className="text-xs font-bold text-white pl-4">
                  {activeInspector.district}, {activeInspector.state}
                </div>
                <div className="text-[11px] text-slate-300 pl-4 leading-tight">
                  {activeInspector.jurisdictionZone}
                </div>
                {activeInspector.assignedPinCodes && activeInspector.assignedPinCodes.length > 0 && (
                  <div className="text-[10px] text-indigo-300 font-mono pl-4">
                    PIN কভাৰেজ: {activeInspector.assignedPinCodes.slice(0, 4).join(', ')}{activeInspector.assignedPinCodes.length > 4 ? '...' : ''}
                  </div>
                )}
              </div>
            </div>

            {/* Direct Connect Buttons (3 Cols) */}
            <div className="md:col-span-3 flex flex-col gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                পোনপটীয়া যোগাযোগ (Direct Connect)
              </span>
              
              <div className="grid grid-cols-2 gap-1.5">
                {/* Direct Phone Call */}
                <a
                  href={`tel:${activeInspector.phone}`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  title="পোনপটীয়া ফোন কৰক (Direct Call)"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>ফোন (Call)</span>
                </a>

                {/* Direct WhatsApp */}
                <a
                  href={`https://wa.me/${waPhone}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  title="WhatsApp মেছেজ কৰক"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Official Email */}
              <a
                href={`mailto:${activeInspector.email}?subject=${encodeURIComponent(`Statutory Compliance Query - ${entityName}`)}`}
                className="bg-indigo-900/80 hover:bg-indigo-800 text-indigo-100 border border-indigo-700/60 font-medium text-[11px] px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all truncate"
                title="অফিচিয়েল ইমেইল পঠিয়াওক"
              >
                <Mail className="h-3 w-3 shrink-0" />
                <span className="truncate">{activeInspector.email}</span>
              </a>
            </div>

          </div>

          {/* Footer Transparency Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-indigo-800/40 text-[11px] text-indigo-200/80">
            <div className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                {entityType === 'industry' 
                  ? `কাৰখানা ${entityName}-ৰ বাবে এই পৰিদৰ্শকজনে আইনী Form V, Form VI আৰু হাজিৰা অডিট নিৰীক্ষণ কৰে।`
                  : `ঠিকাদাৰ ${entityName}-ৰ লাইচেন্স আৰু EPF/ESI চালান নিৰীক্ষণ এই পৰিদৰ্শকজনৰ কাৰ্যালয়ে তদাৰক কৰে।`}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {onViewAuditHistory && (
                <button
                  type="button"
                  onClick={onViewAuditHistory}
                  className="text-amber-300 hover:text-amber-200 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  দাখিল কৰা অডিট প্ৰতিবেদন (Audit Reports)
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* State Inspectorate Directory Modal */}
      {showAllInspectorsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm">ৰাজ্যিক চৰকাৰী শ্ৰম পৰিদৰ্শন এলেকা তালিকা</h3>
                  <p className="text-[11px] text-slate-400">Government Labor Inspectorates & Jurisdictional Circles</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAllInspectorsModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3">
              <p className="text-xs text-slate-500">
                আপোনাৰ কাৰখানা বা ঠিকাদাৰ প্ৰতিষ্ঠানৰ এলেকা অনুযায়ী তলত দিয়া সংশ্লিষ্ট পৰিদৰ্শকজনক চিহ্নিত কৰক:
              </p>

              <div className="space-y-2.5">
                {allInspectors.map(insp => {
                  const isCurrent = insp.id === activeInspector.id;
                  const iCleanPhone = insp.phone.replace(/\D/g, '');
                  const iWa = iCleanPhone.startsWith('91') ? iCleanPhone : `91${iCleanPhone}`;

                  return (
                    <div 
                      key={insp.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'border-indigo-500 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-400' 
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-slate-900 text-xs">{insp.name}</span>
                            <span className="bg-slate-200 text-slate-700 text-[10px] font-mono px-1.5 py-0.5 rounded">
                              {insp.badgeId}
                            </span>
                            {isCurrent && (
                              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                বৰ্তমান নিযুক্ত (Assigned)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-semibold text-indigo-900 mt-0.5">
                            {insp.designation} • {insp.department}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-rose-500 shrink-0" />
                            <strong>এলেকা:</strong> {insp.district} ({insp.jurisdictionZone})
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          <a
                            href={`tel:${insp.phone}`}
                            className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            title="Call"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${iWa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>
                          {onSelectInspector && !isCurrent && (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectInspector(insp.id);
                                setShowAllInspectorsModal(false);
                              }}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              এইজনক বাছক
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAllInspectorsModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg"
              >
                বন্ধ কৰক (Close)
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AssignedInspectorCard;
