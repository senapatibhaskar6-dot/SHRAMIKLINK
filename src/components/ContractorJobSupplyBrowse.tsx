import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  Clock, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Users, 
  X, 
  Check, 
  DollarSign, 
  Calendar, 
  MapPin 
} from 'lucide-react';
import { DailyRequirement, ContractorApplication, Contractor, Worker, Industry } from '../types';

interface ContractorJobSupplyBrowseProps {
  contractor: Contractor;
  requirements: DailyRequirement[];
  contractorApplications: ContractorApplication[];
  workers: Worker[];
  industries: Industry[];
  onApplyToSupply: (app: Omit<ContractorApplication, 'id' | 'appliedDate' | 'status'>) => void;
}

export default function ContractorJobSupplyBrowse({
  contractor,
  requirements,
  contractorApplications,
  workers,
  industries,
  onApplyToSupply,
}: ContractorJobSupplyBrowseProps) {
  // Tab: 'browse' or 'my_applications'
  const [activeTab, setActiveTab] = useState<'browse' | 'my_applications'>('browse');
  const [selectedReq, setSelectedReq] = useState<DailyRequirement | null>(null);

  // Application Form State
  const [committedCount, setCommittedCount] = useState<number>(10);
  const [proposedWage, setProposedWage] = useState<number>(500);
  const [notes, setNotes] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Contractor's workers
  const contractorWorkers = workers.filter(w => w.contractorId === contractor.id);
  const availableWorkersCount = contractorWorkers.filter(w => w.status === 'Available').length;
  const totalPoolCount = contractorWorkers.length;

  // Filter open requirements
  const openReqs = requirements.filter(r => r.status === 'Open');

  // Contractor's own applications
  const myApplications = contractorApplications.filter(a => a.contractorId === contractor.id);

  // Role filter for establishments
  const [establishmentRoleFilter, setEstablishmentRoleFilter] = useState<'All' | 'Industry HR' | 'Apartment Owner' | 'Shop Owner' | 'Office'>('All');

  // Filtered requirements based on establishment role
  const displayedReqs = openReqs.filter(r => {
    if (establishmentRoleFilter === 'All') return true;
    const ind = industries.find(i => i.id === r.industryId);
    return ind?.category === establishmentRoleFilter;
  });

  const handleOpenApplyModal = (req: DailyRequirement) => {
    setSelectedReq(req);
    const defaultCommit = Math.min(
      req.workersNeeded, 
      Math.max(req.minWorkersNeeded || 1, Math.min(availableWorkersCount, 15))
    );
    setCommittedCount(defaultCommit || (req.minWorkersNeeded || 1));
    setProposedWage(req.dailyWageOffer || 500);
    setNotes(`আমি প্ৰয়োজনীয় ${defaultCommit || req.minWorkersNeeded || 1} জন দক্ষ/উপযুক্ত শ্ৰমিক সঠিক সময়ত যোগান ধৰিবলৈ প্ৰস্তুত।`);
    setErrorMessage('');
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReq) return;

    if (selectedReq.minWorkersNeeded && committedCount < selectedReq.minWorkersNeeded) {
      setErrorMessage(`কাৰখানা কৰ্তৃপক্ষই নূন্যতম ${selectedReq.minWorkersNeeded} জন শ্ৰমিক যোগানৰ চৰ্ত বান্ধি দিছে।`);
      return;
    }

    if (committedCount <= 0) {
      setErrorMessage('অনুগ্ৰহ কৰি সঠিক শ্ৰমিকৰ সংখ্যা উল্লেখ কৰক।');
      return;
    }

    onApplyToSupply({
      requirementId: selectedReq.id,
      industryId: selectedReq.industryId,
      industryName: selectedReq.industryName,
      contractorId: contractor.id,
      contractorName: contractor.name,
      contractorPhone: contractor.contactNo,
      contractorLicenseNo: contractor.licenseNo,
      committedWorkers: Number(committedCount),
      availablePoolCount: totalPoolCount,
      proposedWageRate: Number(proposedWage),
      notes: notes.trim(),
    });

    setSelectedReq(null);
  };

  return (
    <div id="contractor-job-supply-browse" className="space-y-6">
      
      {/* 1. Header with Workforce Pool Status & Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'browse'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            কাৰখানা শ্ৰমিক চাহিদা (Industry Postings - {openReqs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_applications')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'my_applications'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            দাখিল কৰা আবেদনসমূহ (My Applications - {myApplications.length})
          </button>
        </div>

        {/* Current Pool Badge */}
        <div className="flex items-center gap-2 text-xs bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg">
          <Users className="h-4 w-4 text-indigo-600" />
          <div>
            <span className="text-slate-500 font-medium">আপোনাৰ উপলব্ধ শ্ৰমিক পুল: </span>
            <strong className="text-indigo-700 font-bold">{availableWorkersCount} জন</strong>
            <span className="text-slate-400 text-[10px] ml-1">({totalPoolCount} মুঠ পঞ্জীভুক্ত)</span>
          </div>
        </div>
      </div>

      {/* 2. BROWSE TAB CONTENT */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          
          {/* Specific Roles Navigation Filter */}
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              নিয়োগকাৰী প্ৰতিষ্ঠানৰ ভূমিকা ফিল্টাৰ:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'All', label: 'সকলো (All)' },
                { id: 'Industry HR', label: '🏭 Industry HR' },
                { id: 'Apartment Owner', label: '🏢 Apartment' },
                { id: 'Shop Owner', label: '🛍️ Shop' },
                { id: 'Office', label: '🏛️ Office' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setEstablishmentRoleFilter(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    establishmentRoleFilter === f.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {displayedReqs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">
              বৰ্তমান এই শ্ৰেণীৰ কোনো নতুন শ্ৰমিক চাহিদা উপলব্ধ নাই। নতুন পোষ্টিং আহিলে ইয়াত প্ৰদৰ্শিত হ'ব।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedReqs.map((req) => {
                const targetIndustry = industries.find(ind => ind.id === req.industryId);
                const hasApplied = myApplications.some(a => a.requirementId === req.id);
                const isTargetedToMe = req.contractorId === contractor.id || req.contractorId === 'OPEN_POOL' || req.contractorId === 'ALL';

                return (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                              {req.skillType}
                            </span>
                            {targetIndustry?.category && (
                              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                {targetIndustry.category === 'Industry HR' ? '🏭 Industry HR' :
                                 targetIndustry.category === 'Apartment Owner' ? '🏢 Apartment Owner' :
                                 targetIndustry.category === 'Shop Owner' ? '🛍️ Shop Owner' :
                                 '🏛️ Office'}
                              </span>
                            )}
                            {req.contractorId === contractor.id && (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                Direct Request for You
                              </span>
                            )}
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-1.5">
                            {req.description || `${req.skillType} Requirement`}
                          </h4>
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3 text-slate-400" />
                            {req.industryName}
                            {targetIndustry?.location && (
                              <span className="text-slate-400 flex items-center gap-0.5">
                                • <MapPin className="h-3 w-3" /> {targetIndustry.location}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-indigo-700 font-mono block">
                            {req.workersNeeded}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">শ্ৰমিক লাগে</span>
                        </div>
                      </div>

                      {/* Details Box */}
                      <div className="bg-slate-50 border border-slate-150 rounded-lg p-2.5 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">নূন্যতম আবেদন</span>
                          <span className="font-extrabold text-slate-800">
                            {req.minWorkersNeeded ? `${req.minWorkersNeeded} জন শ্ৰমিক` : '১ জন'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">শ্বিফ্টৰ সময়</span>
                          <span className="font-semibold text-slate-700">{req.shiftTiming.split(' ')[0]}</span>
                        </div>
                        {req.dailyWageOffer && (
                          <div className="col-span-2 pt-1 border-t border-slate-200 flex justify-between">
                            <span className="text-slate-500 text-[11px]">কাৰখানাৰ মজুৰি অফাৰ:</span>
                            <span className="font-mono font-bold text-emerald-700">₹{req.dailyWageOffer} /day</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-slate-100 flex justify-end items-center">
                      {hasApplied ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> আবেদন দাখিল কৰা হৈছে (Applied)
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenApplyModal(req)}
                          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5" />
                          Apply to Supply (যোগান ধৰিবলৈ আবেদন কৰক)
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. MY APPLICATIONS TAB */}
      {activeTab === 'my_applications' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">কাৰখানা / চাহিদা (Industry Requisition)</th>
                    <th className="py-3 px-4">প্ৰতিশ্ৰুতিবদ্ধ শ্ৰমিক (Committed Workers)</th>
                    <th className="py-3 px-4">প্ৰস্তাৱিত মজুৰি (Proposed Wage)</th>
                    <th className="py-3 px-4">আবেদন তাৰিখ (Date)</th>
                    <th className="py-3 px-4">স্থিতি (Status)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myApplications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400">
                        আপুনি এতিয়ালৈকে কোনো শ্ৰমিক যোগানৰ আবেদন কৰা নাই।
                      </td>
                    </tr>
                  ) : (
                    myApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{app.industryName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Req ID: {app.requirementId.slice(-6)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-black text-indigo-700 text-sm">{app.committedWorkers} জন শ্ৰমিক</span>
                          <span className="block text-[10px] text-slate-400">মুঠ পুল: {app.availablePoolCount} জন</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          ₹{app.proposedWageRate || 480} /day
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono">
                          {app.appliedDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                            app.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {app.status === 'Accepted' ? '✓ Accepted (অনুমোদিত)' : app.status === 'Rejected' ? '✕ Rejected' : '⏳ Pending HR Review'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: APPLY TO SUPPLY */}
      {selectedReq && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">শ্ৰমিক যোগানৰ আবেদন প্ৰপত্ৰ (Apply to Supply)</h3>
                  <p className="text-[11px] text-slate-500">{selectedReq.industryName} - {selectedReq.skillType}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="space-y-3.5 text-xs">
              {/* Pool Info Banner */}
              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl flex items-center justify-between text-indigo-950">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">আপোনাৰ শ্ৰমিক পুল ক্ষমতা</span>
                  <span className="font-black text-sm">{totalPoolCount} জন পঞ্জীভুক্ত ({availableWorkersCount} জন উপলব্ধ)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">কাৰখানাৰ নূন্যতম চৰ্ত</span>
                  <span className="font-black text-sm">{selectedReq.minWorkersNeeded || 1} জন শ্ৰমিক</span>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-rose-700 text-xs font-medium flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  আপুনি কিমানজন শ্ৰমিক যোগান ধৰিব বিচাৰে? (Committed Workers to Supply) *
                </label>
                <input
                  type="number"
                  min={selectedReq.minWorkersNeeded || 1}
                  max={totalPoolCount || 100}
                  required
                  value={committedCount}
                  onChange={(e) => setCommittedCount(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-black text-indigo-700 text-base"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  কাৰখানাত মুঠ প্ৰয়োজন {selectedReq.workersNeeded} জন। আপুনি অংশভিত্তিক বা সম্পূৰ্ণ যোগান ধৰিব পাৰে।
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  প্ৰস্তাৱিত দৈনিক মজুৰি নিৰিখ (Proposed Daily Wage Rate ₹)
                </label>
                <input
                  type="number"
                  min={350}
                  value={proposedWage}
                  onChange={(e) => setProposedWage(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  কাৰখানা HR লৈ চমু বাৰ্তা / অভিজ্ঞতা (Notes for Industry HR)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="শ্ৰমিকৰ পূৰ্ব অভিজ্ঞতা, সময়ানুবৰ্তিতা বা অন্য বিশেষ সুবিধা..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-indigo-600 font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-xs transition-all cursor-pointer"
                >
                  আবেদন দাখিল কৰক (Submit Supply Bid)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
