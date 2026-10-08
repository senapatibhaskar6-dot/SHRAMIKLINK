import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle, 
  Send, 
  UserCheck, 
  X, 
  Search, 
  Filter, 
  User 
} from 'lucide-react';
import { DirectJobOpening, DirectWorkerApplication, Industry } from '../types';

interface DirectWorkersPanelProps {
  industries: Industry[];
  directJobOpenings: DirectJobOpening[];
  directApplications: DirectWorkerApplication[];
  onApplyDirect: (application: Omit<DirectWorkerApplication, 'id' | 'appliedDate' | 'status'>) => void;
}

export default function DirectWorkersPanel({
  industries,
  directJobOpenings,
  directApplications,
  onApplyDirect,
}: DirectWorkersPanelProps) {
  const [activeTab, setActiveTab] = useState<'jobs' | 'my_apps'>('jobs');
  const [selectedJob, setSelectedJob] = useState<DirectJobOpening | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('ALL');

  // Form State for 1-Click Application
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantSkill, setApplicantSkill] = useState('Unskilled');
  const [experienceYears, setExperienceYears] = useState<number>(1);
  const [preferredShift, setPreferredShift] = useState('General (09:00 - 17:00)');
  const [notes, setNotes] = useState('');

  const filteredJobs = directJobOpenings.filter(job => {
    const matchesSearch = 
      job.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.industryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = skillFilter === 'ALL' || job.skillType === skillFilter;
    return matchesSearch && matchesSkill && job.status === 'Open';
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob || !applicantName.trim() || !applicantPhone.trim()) return;

    onApplyDirect({
      jobOpeningId: selectedJob.id,
      industryId: selectedJob.industryId,
      industryName: selectedJob.industryName,
      workerName: applicantName.trim(),
      phone: applicantPhone.trim(),
      skillType: applicantSkill,
      experienceYears: Number(experienceYears) || 0,
      preferredShift: preferredShift,
      notes: notes.trim(),
    });

    setSelectedJob(null);
  };

  return (
    <div id="direct-workers-panel" className="space-y-6 animate-fadeIn">
      
      {/* 1. ZERO-BROKERAGE VALUE BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-emerald-800/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                Zero Middlemen • 100% Direct Pay
              </span>
              <span className="text-xs text-emerald-300 font-semibold">পোনপটীয়া নিযুক্তি পৰ্টেল</span>
            </div>
            <h2 className="text-xl font-black text-white">
              স্বাধীন শ্ৰমিক নিযুক্তি গেটৱে (Direct Independent Worker Portal)
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              কোনো ঠিকাদাৰ বা দালালৰ অবিহনে পোনপটীয়াকৈ অসম আৰু উত্তৰ-পূবৰ প্ৰতিষ্ঠিত কাৰখানাসমূহত কাম বিচাৰক। পোনে পোনে কাৰখানা HR-ৰ সৈতে ফোন বা হোৱাটছএপত কথা পাতক।
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl p-3 text-center shrink-0 w-full md:w-auto">
            <span className="text-[10px] uppercase font-bold text-emerald-300 block tracking-wider">উপলব্ধ নিযুক্তি পদ</span>
            <span className="text-2xl font-black text-white font-mono">{filteredJobs.length} টা</span>
            <span className="text-[10px] text-slate-300 block">কাৰখানাৰ পোনপটীয়া ভেকেন্সি</span>
          </div>
        </div>
      </div>

      {/* 2. Top Tabs & Filter */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'jobs'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            কাৰখানাৰ পোনপটীয়া চাকৰি (Direct Vacancies - {filteredJobs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('my_apps')}
            className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'my_apps'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            মোৰ আবেদনসমূহ (My Applications - {directApplications.length})
          </button>
        </div>

        {activeTab === 'jobs' && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title or factory..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-600"
              />
            </div>
            <span className="bg-slate-100 text-slate-700 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold">
              কেৱল অদক্ষ শ্ৰমিক পদ (Unskilled Openings)
            </span>
          </div>
        )}
      </div>

      {/* 3. JOBS LISTING (CLEAN CARDS) */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-xs">
              বৰ্তমান কোনো পোনপটীয়া পদ খালী নাই। নতুন বিজ্ঞাপন আহিলে ইয়াত পোৱা যাব।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job) => {
                const cleanPhone = (job.contactPhone || '9864019280').replace(/\D/g, '');
                const hasApplied = directApplications.some(a => a.jobOpeningId === job.id);

                return (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Top Header */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded">
                              অদক্ষ শ্ৰমিক (Unskilled)
                            </span>
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                              {job.openingsCount} টা পদ খালী
                            </span>
                          </div>
                          <h3 className="font-black text-slate-900 text-base mt-1.5">
                            {job.roleTitle}
                          </h3>
                          <div className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            {job.industryName}
                            <span className="text-slate-400 flex items-center gap-0.5 ml-1">
                              • <MapPin className="h-3 w-3" /> {job.location}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-emerald-700 font-mono block">
                            ₹{job.dailyWageRate}
                          </span>
                          <span className="text-[10px] text-slate-400">প্ৰতিদিনে (Daily)</span>
                        </div>
                      </div>

                      {/* Description & Shifts */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {job.description}
                      </p>

                      <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>সময়: <strong>{job.shiftTiming}</strong></span>
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          যোগাযোগ ব্যক্তি: <strong className="text-slate-700">{job.contactPerson}</strong>
                        </div>
                      </div>
                    </div>

                    {/* DIRECT ZERO-BROKERAGE ACTION BUTTONS */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="Call Factory HR"
                        >
                          <Phone className="h-3.5 w-3.5 text-emerald-400" />
                          কল কৰক (Call HR)
                        </a>
                        <a
                          href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`নমস্কাৰ ${job.contactPerson}, মই ${job.industryName} ত ${job.roleTitle} পদৰ বাবে শ্ৰমিকলিংকৰ জৰিয়তে পোনপটীয়াকৈ কাম কৰিব বিচাৰো।`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="WhatsApp Factory HR"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-white" />
                          WhatsApp
                        </a>
                      </div>

                      {hasApplied ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> আবেদন কৰা হৈছে
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedJob(job);
                            setApplicantSkill(job.skillType);
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <Send className="h-3.5 w-3.5" />
                          পোনপটীয়া আবেদন (Apply Direct)
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

      {/* 4. MY APPLICATIONS TAB */}
      {activeTab === 'my_apps' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">কাৰখানাৰ নাম (Factory)</th>
                    <th className="py-3 px-4">আবেদনকাৰী শ্ৰমিক (Applicant)</th>
                    <th className="py-3 px-4">ট্ৰেড & অভিজ্ঞতা (Trade & Experience)</th>
                    <th className="py-3 px-4">আবেদন তাৰিখ (Date)</th>
                    <th className="py-3 px-4">স্থিতি (Status)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {directApplications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-400">
                        আপুনি কোনো পোনপটীয়া কাৰখানা চাকৰিত আবেদন কৰা নাই।
                      </td>
                    </tr>
                  ) : (
                    directApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {app.industryName}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-800">{app.workerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">+91 {app.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-700">অদক্ষ শ্ৰমিক (Unskilled)</span>
                          <span className="text-[10px] text-slate-400 block">{app.experienceYears} বছৰৰ অভিজ্ঞতা</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {app.appliedDate}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${
                            app.status === 'Accepted'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : app.status === 'Shortlisted'
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : app.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {app.status === 'Accepted' ? '✓ Accepted (নিযুক্ত)' : 
                             app.status === 'Shortlisted' ? '📋 Shortlisted' :
                             app.status === 'Rejected' ? '✕ Rejected' : '⏳ Reviewing'}
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

      {/* MODAL: 1-CLICK DIRECT APPLY */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">কাৰখানাত পোনপটীয়া নিযুক্তি আবেদন</h3>
                  <p className="text-[11px] text-slate-500">{selectedJob.industryName} - {selectedJob.roleTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-emerald-900 text-[11px]">
                <strong>🛡️ কোনো কমিচন বা দালাল মাচুল নাই:</strong> আপোনাৰ আবেদন পোনে পোনে কাৰখানাৰ এইচ আৰ বিভাগে প্ৰত্যক্ষ কৰিব।
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">আপোনাৰ সম্পূৰ্ণ নাম (Worker Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. দিগন্ত হাজৰিকা (Diganta Hazarika)"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বৰ (Phone) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9864012345"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-emerald-600 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">অভিজ্ঞতা (Years of Experience)</label>
                  <input
                    type="number"
                    min={0}
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-emerald-600 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">শ্ৰমিকৰ শ্ৰেণী (Category)</label>
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800">
                    অদক্ষ শ্ৰমিক (Unskilled Manual Labourer)
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্ৰাথমিক শ্বিফ্ট পচন্দ</label>
                  <select
                    value={preferredShift}
                    onChange={(e) => setPreferredShift(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-emerald-600 font-semibold"
                  >
                    <option value="General (09:00 - 17:00)">সাধাৰণ (09:00 - 17:00)</option>
                    <option value="Shift A (06:00 - 14:00)">প্ৰথম শ্বিফ্ট</option>
                    <option value="Shift B (14:00 - 22:00)">দ্বিতীয় শ্বিফ্ট</option>
                    <option value="Shift C (22:00 - 06:00)">নাইট শ্বিফ্ট</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">চমু বিৱৰণ / অভিজ্ঞতা</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="পূৰ্বতে কাম কৰা কাৰখানা বা বিশেষ কৌশল..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:bg-white focus:border-emerald-600 font-medium resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-all cursor-pointer"
                >
                  পোনপটীয়া আবেদন দাখিল কৰক (Submit Direct Application)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
