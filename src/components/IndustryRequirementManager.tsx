import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Users, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Search, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { DailyRequirement, ContractorApplication, Contractor, Worker, Industry } from '../types';

interface IndustryRequirementManagerProps {
  industry: Industry;
  requirements: DailyRequirement[];
  contractorApplications: ContractorApplication[];
  contractors: Contractor[];
  workers: Worker[];
  onPostRequirement: (req: Omit<DailyRequirement, 'id' | 'workersFulfilled' | 'status'>) => void;
  onUpdateApplicationStatus: (appId: string, newStatus: 'Accepted' | 'Rejected') => void;
  onCloseRequirement: (reqId: string) => void;
}

export default function IndustryRequirementManager({
  industry,
  requirements,
  contractorApplications,
  contractors,
  workers,
  onPostRequirement,
  onUpdateApplicationStatus,
  onCloseRequirement,
}: IndustryRequirementManagerProps) {
  // Tab: 'requirements' or 'directory'
  const [activeTab, setActiveTab] = useState<'requirements' | 'directory'>('requirements');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [expandedReqId, setExpandedReqId] = useState<string | null>(null);
  const [directorySearch, setDirectorySearch] = useState('');

  // Form State for Posting Requirement
  const [formSkill, setFormSkill] = useState<DailyRequirement['skillType']>('Unskilled');
  const [formWorkersNeeded, setFormWorkersNeeded] = useState<number>(25);
  const [formMinWorkers, setFormMinWorkers] = useState<number>(5);
  const [formShift, setFormShift] = useState<string>('General (09:00 - 17:00)');
  const [formWageOffer, setFormWageOffer] = useState<number>(500);
  const [formDesc, setFormDesc] = useState<string>('Warehouse packing and material handling');

  // Filter requirements for current industry
  const currentReqs = requirements.filter(r => r.industryId === industry.id);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (formWorkersNeeded <= 0) return;

    onPostRequirement({
      industryId: industry.id,
      industryName: industry.name,
      contractorId: 'OPEN_POOL', // open to all reliable contractors
      date: new Date().toISOString().split('T')[0],
      skillType: formSkill,
      workersNeeded: Number(formWorkersNeeded),
      minWorkersNeeded: Number(formMinWorkers) || 1,
      shiftTiming: formShift,
      dailyWageOffer: Number(formWageOffer) || 480,
      description: formDesc.trim() || 'Industrial Operations',
    });

    setIsPostModalOpen(false);
  };

  return (
    <div id="industry-requirement-manager" className="space-y-6">
      
      {/* 1. Header & Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('requirements')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'requirements'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            শ্ৰমিক চাহিদা & আবেদনকাৰী (Manpower Postings & Applications)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            বিশ্বস্ত ঠিকাদাৰ ডাইৰেক্টৰি (Reliable Contractor Directory)
          </button>
        </div>

        {activeTab === 'requirements' && (
          <button
            type="button"
            onClick={() => setIsPostModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            নতুন শ্ৰমিক চাহিদা লিখক (Post New Requirement)
          </button>
        )}
      </div>

      {/* 2. REQUIREMENTS TAB CONTENT */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          {currentReqs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 w-12 h-12 rounded-full mx-auto flex items-center justify-center">
                <Briefcase className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">কোনো সক্ৰিয় শ্ৰমিক চাহিদা নাই (No Active Job Postings)</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আপোনাৰ কাৰখানাৰ বাবে প্ৰয়োজনীয় শ্ৰমিক বিচাৰি নতুন চাহিদা পোষ্ট কৰক। বিশ্বস্ত অনুজ্ঞাপ্ৰাপ্ত ঠিকাদাৰসকলে তেওঁলোকৰ শ্ৰমিক পুল ব্যৱহাৰ কৰি আবেদন জনাব।
              </p>
              <button
                type="button"
                onClick={() => setIsPostModalOpen(true)}
                className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> চাহিদা পোষ্ট কৰক (Post Requirement)
              </button>
            </div>
          ) : (
            currentReqs.map((req) => {
              const applications = contractorApplications.filter(a => a.requirementId === req.id);
              const acceptedApps = applications.filter(a => a.status === 'Accepted');
              const totalCommitted = acceptedApps.reduce((sum, a) => sum + a.committedWorkers, 0);
              const isExpanded = expandedReqId === req.id;

              return (
                <div key={req.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  {/* Requirement Summary Card */}
                  <div className="p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                          {req.skillType}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.status === 'Open'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          ● {req.status === 'Open' ? 'সক্ৰিয় চাহিদা (Open)' : 'বন্ধ (Closed)'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {req.date}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-sm">
                        {req.description || `${req.skillType} Workers Needed`}
                      </h3>

                      <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                        <div>
                          প্ৰয়োজনীয় সংখ্যা: <strong className="text-slate-900 font-bold">{req.workersNeeded} জন</strong>
                        </div>
                        {req.minWorkersNeeded && (
                          <div>
                            নূন্যতম আবেদন: <strong className="text-indigo-600 font-bold">নূন্যতম {req.minWorkersNeeded} জন</strong>
                          </div>
                        )}
                        <div>
                          সময় / শ্বিফ্ট: <strong className="text-slate-800 font-medium">{req.shiftTiming}</strong>
                        </div>
                        {req.dailyWageOffer && (
                          <div>
                            মজুৰি অফাৰ: <strong className="text-emerald-700 font-bold">₹{req.dailyWageOffer} /day</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side stats & action */}
                    <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0">
                      <div className="text-left lg:text-right">
                        <div className="text-xs text-slate-500 font-medium">ঠিকাদাৰৰ আবেদন (Applications)</div>
                        <div className="text-sm font-extrabold text-slate-900">
                          {applications.length} জন ঠিকাদাৰ 
                          {totalCommitted > 0 && <span className="text-emerald-600 text-xs font-semibold ml-1">({totalCommitted}/{req.workersNeeded} শ্ৰমিক স্বীকৃত)</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedReqId(isExpanded ? null : req.id)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          {isExpanded ? (
                            <>আবেদন লুকুৱাওক <ChevronUp className="h-3.5 w-3.5" /></>
                          ) : (
                            <>আবেদন চাওক ({applications.length}) <ChevronDown className="h-3.5 w-3.5" /></>
                          )}
                        </button>
                        {req.status === 'Open' && (
                          <button
                            type="button"
                            onClick={() => onCloseRequirement(req.id)}
                            className="px-2.5 py-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition-all"
                            title="Close Requirement"
                          >
                            বন্ধ কৰক
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Applying Contractors Drawer */}
                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-200 p-5 space-y-4 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-indigo-600" />
                          এই চাহিদাৰ বাবে আবেদন কৰা ঠিকাদাৰসকল (Applying Contractors):
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          মুঠ আবেদন: {applications.length}
                        </span>
                      </div>

                      {applications.length === 0 ? (
                        <div className="bg-white border border-dashed border-slate-300 rounded-lg p-6 text-center text-xs text-slate-400">
                          বৰ্তমানলৈকে কোনো ঠিকাদাৰে এই চাহিদাত আবেদন কৰা নাই। ঠিকাদাৰসকলে তেওঁলোকৰ পেনেলত এই চাহিদা প্রত্যক্ষ কৰি আবেদন জনাব।
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {applications.map((app) => {
                            const contractorInfo = contractors.find(c => c.id === app.contractorId);
                            const cleanPhone = (app.contractorPhone || contractorInfo?.contactNo || '').replace(/\D/g, '');

                            return (
                              <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="font-black text-slate-900 text-sm">{app.contractorName}</div>
                                    <div className="text-[10px] text-slate-400 font-mono">
                                      CLRA: {app.contractorLicenseNo} | LIN: {contractorInfo?.lin || 'N/A'}
                                    </div>
                                  </div>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                                    app.status === 'Accepted'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : app.status === 'Rejected'
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                    {app.status === 'Accepted' ? '✓ Accepted (অনুমোদিত)' : app.status === 'Rejected' ? '✕ Rejected' : '⏳ Pending Review'}
                                  </span>
                                </div>

                                {/* Manpower details */}
                                <div className="bg-slate-50 p-2.5 rounded-lg grid grid-cols-2 gap-2 text-xs">
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-bold uppercase">যোগান ধৰিব পৰা শ্ৰমিক</span>
                                    <span className="text-indigo-700 font-extrabold text-sm">{app.committedWorkers} জন শ্ৰমিক</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-slate-400 block font-bold uppercase">ঠিকাদাৰৰ মুঠ শ্ৰমিক পুল</span>
                                    <span className="text-slate-800 font-bold text-sm">{app.availablePoolCount} জন</span>
                                  </div>
                                  {app.proposedWageRate && (
                                    <div className="col-span-2 pt-1 border-t border-slate-200 flex justify-between">
                                      <span className="text-[10px] text-slate-500">প্ৰস্তাৱিত মজুৰি নিৰিখ:</span>
                                      <span className="font-mono font-bold text-slate-800">₹{app.proposedWageRate}/day</span>
                                    </div>
                                  )}
                                  {app.notes && (
                                    <div className="col-span-2 text-[11px] text-slate-600 italic">
                                      "{app.notes}"
                                    </div>
                                  )}
                                </div>

                                {/* Direct Communication & Decision Buttons */}
                                <div className="flex items-center justify-between gap-2 pt-1">
                                  {/* Direct zero-brokerage contact */}
                                  <div className="flex items-center gap-1.5">
                                    <a
                                      href={`tel:${cleanPhone}`}
                                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                      title="Direct Phone Call"
                                    >
                                      <Phone className="h-3.5 w-3.5 text-indigo-600" />
                                      <span className="hidden sm:inline">কল কৰক</span>
                                    </a>
                                    <a
                                      href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`নমস্কাৰ ${app.contractorName}, আমি ${industry.name} ৰ পৰা যোগাযোগ কৰিছো। আপোনাৰ ${app.committedWorkers} জন শ্ৰমিক যোগানৰ আবেদন আমি বিবেচনা কৰিছো।`)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                      title="Direct WhatsApp"
                                    >
                                      <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                                      <span className="hidden sm:inline">WhatsApp</span>
                                    </a>
                                  </div>

                                  {/* Accept / Reject controls */}
                                  {app.status === 'Pending' ? (
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => onUpdateApplicationStatus(app.id, 'Accepted')}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                                      >
                                        <Check className="h-3.5 w-3.5" /> গ্ৰহণ কৰক (Accept)
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => onUpdateApplicationStatus(app.id, 'Rejected')}
                                        className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                      >
                                        <X className="h-3.5 w-3.5" /> অগ্ৰাহ্য (Reject)
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-[10px] text-slate-400 italic">
                                      সিদ্ধান্ত লিপিবদ্ধ কৰা হৈছে
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 3. RELIABLE CONTRACTOR DIRECTORY TAB */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center justify-between gap-4">
            <div className="relative w-full max-w-md">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={directorySearch}
                onChange={(e) => setDirectorySearch(e.target.value)}
                placeholder="ঠিকাদাৰৰ নাম বা অনুজ্ঞাপত্ৰ নম্বৰেৰে সন্ধান কৰক..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-medium"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap hidden sm:inline">
              মুঠ অনুজ্ঞাপ্ৰাপ্ত ঠিকাদাৰ: <strong className="text-slate-800">{contractors.length}</strong>
            </span>
          </div>

          {/* Contractors Cards Grid with Manpower Capacity Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {contractors
              .filter(c => c.name.toLowerCase().includes(directorySearch.toLowerCase()) || c.licenseNo.includes(directorySearch))
              .map((c) => {
                // Dynamically gauge this contractor's workforce capacity
                const mappedWorkers = workers.filter(w => w.contractorId === c.id);
                const totalCount = mappedWorkers.length;
                const unskilledCount = mappedWorkers.filter(w => w.skillType === 'Unskilled').length;
                const semiCount = mappedWorkers.filter(w => w.skillType === 'Semi-Skilled').length;
                const skilledCount = mappedWorkers.filter(w => w.skillType === 'Skilled' || w.skillType === 'Highly-Skilled').length;
                const availableCount = mappedWorkers.filter(w => w.status === 'Available').length;
                const cleanPhone = (c.contactNo || '').replace(/\D/g, '');

                return (
                  <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">{c.name}</h4>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            CLRA: {c.licenseNo}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {c.rating || 4.9}
                        </span>
                      </div>

                      {/* MANPOWER CAPACITY GAUGE (Crucial Requirement) */}
                      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                            <Users className="h-3 w-3 text-indigo-600" /> শ্ৰমিক ক্ষমতা (Capacity)
                          </span>
                          <span className="text-xs font-black text-indigo-700 font-mono">
                            {totalCount} জন পঞ্জীভুক্ত
                          </span>
                        </div>

                        {/* Breakdown pills */}
                        <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-bold">
                          <div className="bg-white p-1 rounded border border-indigo-100">
                            <span className="text-slate-400 block text-[9px] font-normal">অদক্ষ</span>
                            <span className="text-slate-800">{unskilledCount}</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-indigo-100">
                            <span className="text-slate-400 block text-[9px] font-normal">অৰ্ধ-দক্ষ</span>
                            <span className="text-slate-800">{semiCount}</span>
                          </div>
                          <div className="bg-white p-1 rounded border border-indigo-100">
                            <span className="text-slate-400 block text-[9px] font-normal">দক্ষ</span>
                            <span className="text-slate-800">{skilledCount}</span>
                          </div>
                        </div>

                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          উপলব্ধ শ্ৰমিক (Ready for Deployment): {availableCount} জন
                        </div>
                      </div>

                      {/* Statutory Legal Badges */}
                      <div className="space-y-1 text-[11px] text-slate-600">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">EPF Code:</span>
                          <span className="font-semibold text-slate-800">{c.epfCode}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">ESIC Code:</span>
                          <span className="font-semibold text-slate-800">{c.esiCode}</span>
                        </div>
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">LIN:</span>
                          <span className="font-semibold text-slate-800">{c.lin}</span>
                        </div>
                      </div>
                    </div>

                    {/* Zero-Brokerage Direct Communication Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Phone className="h-3.5 w-3.5 text-emerald-400" />
                        কল কৰক
                      </a>
                      <a
                        href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`নমস্কাৰ ${c.name}, আমি ${industry.name} ৰ পৰা কথা পাতিছো। আমাক কিছু শ্ৰমিকৰ প্ৰয়োজন হৈছে। আপোনাৰ উপলব্ধ শ্ৰমিকৰ বিষয়ে আলোচনা কৰিব বিচাৰো।`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="h-3.5 w-3.5 text-white" />
                        WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MODAL: POST NEW MANPOWER REQUIREMENT */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">নতুন শ্ৰমিক চাহিদা প্ৰকাশ কৰক</h3>
                  <p className="text-[11px] text-slate-500">{industry.name} Industrial Plant Requisition</p>
                </div>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">কামৰ বিৱৰণ / প্ৰকল্প (Work Description) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Warehouse Cargo Loading & Assembly Operations"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">দক্ষতাৰ স্তৰ (Skill Category)</label>
                  <select
                    value={formSkill}
                    onChange={(e) => setFormSkill(e.target.value as DailyRequirement['skillType'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-semibold"
                  >
                    <option value="Unskilled">অদক্ষ শ্ৰমিক (Unskilled)</option>
                    <option value="Semi-Skilled">অৰ্ধ-দক্ষ শ্ৰমিক (Semi-Skilled)</option>
                    <option value="Skilled">দক্ষ টেকনিচিয়ান (Skilled)</option>
                    <option value="Highly-Skilled">উচ্চ-দক্ষ (Highly-Skilled)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">শ্বিফ্টৰ সময় (Shift Timing)</label>
                  <select
                    value={formShift}
                    onChange={(e) => setFormShift(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-semibold"
                  >
                    <option value="General (09:00 - 17:00)">সাধাৰণ (09:00 - 17:00)</option>
                    <option value="Shift A (06:00 - 14:00)">প্ৰথম শ্বিফ্ট (06:00 - 14:00)</option>
                    <option value="Shift B (14:00 - 22:00)">দ্বিতীয় শ্বিফ্ট (14:00 - 22:00)</option>
                    <option value="Shift C (22:00 - 06:00)">নাইট শ্বিফ্ট (22:00 - 06:00)</option>
                  </select>
                </div>
              </div>

              {/* Workers Needed & Minimum Workers Required */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    মুঠ প্ৰয়োজনীয় শ্ৰমিক (Total Needed) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formWorkersNeeded}
                    onChange={(e) => setFormWorkersNeeded(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">কাৰখানাত মুঠ প্ৰয়োজন</span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    নূন্যতম আবেদন সীমা (Min per Contractor) *
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formMinWorkers}
                    onChange={(e) => setFormMinWorkers(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-bold text-indigo-700"
                  />
                  <span className="text-[10px] text-indigo-500 mt-0.5 block">প্ৰতি ঠিকাদাৰে নূন্যতম দিব লাগিব</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্ৰস্তাৱিত দৈনিক মজুৰি অফাৰ (Wage Offer ₹ / day)</label>
                <input
                  type="number"
                  min={350}
                  value={formWageOffer}
                  onChange={(e) => setFormWageOffer(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-bold text-emerald-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-all cursor-pointer"
                >
                  চাহিদা প্ৰকাশ কৰক (Publish Requisition)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
