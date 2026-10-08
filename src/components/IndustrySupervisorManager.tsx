import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Trash2, 
  Plus, 
  Search, 
  Check, 
  X, 
  AlertCircle, 
  Briefcase, 
  Lock, 
  Pencil, 
  MessageSquare,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Industry, Supervisor, Contractor, Worker } from '../types';

export interface IndustrySupervisorManagerProps {
  industry: Industry;
  supervisors: Supervisor[];
  contractors: Contractor[];
  workers?: Worker[];
  onAddSupervisor: (supervisor: Omit<Supervisor, 'id' | 'createdAt'>) => void;
  onUpdateSupervisor: (supervisorId: string, updates: Partial<Supervisor>) => void;
  onDeleteSupervisor: (supervisorId: string) => void;
}

export default function IndustrySupervisorManager({
  industry,
  supervisors,
  contractors,
  workers = [],
  onAddSupervisor,
  onUpdateSupervisor,
  onDeleteSupervisor,
}: IndustrySupervisorManagerProps) {
  // Filter only Industry Supervisors belonging to this Industry Tenant
  // (Strict statutory & operational permission boundary)
  const industrySupervisors = useMemo(() => {
    return supervisors.filter(
      (s) => s.supervisorType === 'industry' && s.industryId === industry.id
    );
  }, [supervisors, industry.id]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedSupplierFilter, setSelectedSupplierFilter] = useState('ALL');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);

  // Form State for Adding / Editing
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: 'Production & Line 1',
    active: true,
    assignedContractorIds: [] as string[]
  });

  // Open Appoint Modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      department: 'Production & Line 1',
      active: true,
      assignedContractorIds: []
    });
    setEditingSupervisor(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (sup: Supervisor) => {
    setEditingSupervisor(sup);
    setFormData({
      name: sup.name,
      phone: sup.phone,
      email: sup.email,
      department: sup.department || 'Production & Line 1',
      active: sup.active,
      assignedContractorIds: sup.assignedContractorIds || []
    });
    setIsAddModalOpen(true);
  };

  // Toggle assigned contractor checkbox
  const handleToggleContractor = (contractorId: string) => {
    setFormData((prev) => {
      const current = prev.assignedContractorIds || [];
      if (current.includes(contractorId)) {
        return {
          ...prev,
          assignedContractorIds: current.filter((id) => id !== contractorId)
        };
      } else {
        return {
          ...prev,
          assignedContractorIds: [...current, contractorId]
        };
      }
    });
  };

  // Form Submission (Add or Update)
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      return;
    }

    if (editingSupervisor) {
      onUpdateSupervisor(editingSupervisor.id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@industry.com`,
        department: formData.department.trim(),
        active: formData.active,
        assignedContractorIds: formData.assignedContractorIds
      });
    } else {
      onAddSupervisor({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@industry.com`,
        department: formData.department.trim(),
        supervisorType: 'industry',
        industryId: industry.id,
        active: formData.active,
        assignedContractorIds: formData.assignedContractorIds
      });
    }

    setIsAddModalOpen(false);
    setEditingSupervisor(null);
  };

  // Unique departments for filter
  const departmentsList = useMemo(() => {
    const depts = new Set<string>();
    industrySupervisors.forEach((s) => {
      if (s.department) depts.add(s.department);
    });
    return Array.from(depts);
  }, [industrySupervisors]);

  // Filtered Supervisors
  const filteredSupervisors = useMemo(() => {
    return industrySupervisors.filter((sup) => {
      const matchesSearch =
        sup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sup.phone.includes(searchQuery) ||
        (sup.department && sup.department.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept =
        selectedDeptFilter === 'ALL' || sup.department === selectedDeptFilter;

      const matchesSupplier =
        selectedSupplierFilter === 'ALL' ||
        (sup.assignedContractorIds && sup.assignedContractorIds.includes(selectedSupplierFilter));

      return matchesSearch && matchesDept && matchesSupplier;
    });
  }, [industrySupervisors, searchQuery, selectedDeptFilter, selectedSupplierFilter]);

  // Calculate stats
  const activeCount = industrySupervisors.filter((s) => s.active).length;
  const assignedSupplierCount = new Set(
    industrySupervisors.flatMap((s) => s.assignedContractorIds || [])
  ).size;

  return (
    <div className="space-y-6">
      {/* 1. HEADER & STRICT PERMISSION BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Principal Employer Internal Staff
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Plant: {industry.name}
              </span>
            </div>
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600 shrink-0" />
              কাৰখানা ছুপাৰভাইজাৰ ব্যৱস্থাপনা & যোগানকৰ্তা সমন্বয়
            </h3>
            <p className="text-xs text-slate-500 max-w-3xl">
              কোম্পানীৰ প্লাণ্ট অপাৰেচন, গেট হাজিৰা আৰু কাৰখানাত কাম কৰা বাহিৰা যোগানকৰ্তা/ঠিকাদাৰ (Manpower Suppliers)-সকলৰ সৈতে সমন্বয় ৰক্ষাৰ বাবে ইণ্ডাষ্ট্ৰী ছুপাৰভাইজাৰ নিযুক্ত আৰু দায়িত্ব আৱণ্টন কৰক।
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            নতুন ছুপাৰভাইজাৰ নিযুক্তি (Appoint Supervisor)
          </button>
        </div>

        {/* STATUTORY & PERMISSION BOUNDARY NOTICE */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-slate-600">
          <Lock className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-800">সুৰক্ষিত কৰ্তৃত্বৰ সীমা (Permission Boundary):</strong>{' '}
            কাৰখানা কৰ্তৃপক্ষই কেৱল কোম্পানীৰ নিজস্ব ইণ্ডাষ্ট্ৰী ছুপাৰভাইজাৰসকলক পৰিচালনা আৰু শ্ৰমিক যোগানকৰ্তা তদাৰকীৰ দায়িত্ব দিব পাৰে। লেবাৰ কন্ট্ৰেক্টৰৰ আভ্যন্তৰীণ ফিল্ড ছুপাৰভাইজাৰসকল তেওঁলোকৰ নিজা পেনেলৰ দ্বাৰা সুৰক্ষিত আৰু স্বতন্ত্ৰ।
          </div>
        </div>

        {/* 3 QUICK BENTO METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              মুঠ কাৰখানা ছুপাৰভাইজাৰ (Total Plant Supervisors)
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline gap-2">
              {industrySupervisors.length}
              <span className="text-xs font-semibold text-emerald-600">
                ({activeCount} সক্ৰিয় / On-Duty)
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Direct Company Payroll</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              তদাৰকীৰ অধীনস্থ যোগানকৰ্তা (Overseen Suppliers)
            </div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {assignedSupplierCount} / {contractors.length}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Coordinating with Vendors</div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              সক্ৰিয় কাৰখানা বিভাগ (Operating Plant Zones)
            </div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {departmentsList.length || 1}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Production, Gate, Packaging</div>
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, ফোন নম্বৰ বা বিভাগ অনুধাৱন কৰক (Search supervisor)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:bg-white focus:border-indigo-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-600"
          >
            <option value="ALL">সকলো বিভাগ (All Departments)</option>
            {departmentsList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedSupplierFilter}
            onChange={(e) => setSelectedSupplierFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-600"
          >
            <option value="ALL">সকলো যোগানকৰ্তা (All Suppliers)</option>
            {contractors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. SUPERVISOR CARDS DIRECTORY */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSupervisors.length === 0 ? (
          <div className="col-span-full bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">
              কোনো কাৰখানা ছুপাৰভাইজাৰ পোৱা নগ'ল
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              নতুন ছুপাৰভাইজাৰ নিযুক্তি কৰিবলৈ ওপৰৰ বুটামত ক্লিক কৰক আৰু যোগানকৰ্তা সমন্বয়ৰ দায়িত্ব আৱণ্টন কৰক।
            </p>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              প্ৰথম ছুপাৰভাইজাৰ নিযুক্তি কৰক
            </button>
          </div>
        ) : (
          filteredSupervisors.map((sup) => {
            const assignedContractorsList = contractors.filter((c) =>
              sup.assignedContractorIds?.includes(c.id)
            );

            return (
              <div
                key={sup.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Header: Profile & Status */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-11 w-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-700 text-base">
                          {sup.name.charAt(0)}
                        </div>
                        <span
                          className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                            sup.active ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                          title={sup.active ? 'On Duty' : 'On Leave'}
                        />
                      </div>

                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-tight">
                          {sup.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            কাৰখানা বিষয়া (Plant Staff)
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateSupervisor(sup.id, { active: !sup.active })
                      }
                      className={`text-[10px] font-bold px-2 py-1 rounded-md border transition-all cursor-pointer ${
                        sup.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {sup.active ? 'সক্ৰিয় (Active)' : 'ছুটীত (Leave)'}
                    </button>
                  </div>

                  {/* Department & Email info */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">কাৰখানা বিভাগ (Dept):</span>
                      <span className="font-bold text-slate-700">{sup.department || 'Main Plant'}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-400">মেইল:</span>
                      <span className="text-slate-600 truncate max-w-[180px]">{sup.email}</span>
                    </div>
                  </div>

                  {/* DIRECT-CONNECT BUTTONS (0% BROKERAGE, DIRECT CALL & WHATSAPP) */}
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${sup.phone}`}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      কল কৰক (Call)
                    </a>

                    <a
                      href={`https://wa.me/91${sup.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `নমস্কাৰ ${sup.name} ডাঙৰীয়া, ICWL (IndustrialContractorWorkerLink) কাৰখানা HR ৰ তৰফৰ পৰা যোগাযোগ কৰা হৈছে। যোগানকৰ্তা আৰু শ্ৰমিক হাজিৰা সন্দৰ্ভত অনুগ্ৰহ কৰি আপডেট দিয়ক।`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      WhatsApp
                    </a>
                  </div>

                  {/* ASSIGNED SUPPLIERS / CONTRACTORS OVERVIEW */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                        তদাৰকীৰ শ্ৰমিক যোগানকৰ্তা (Suppliers):
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {assignedContractorsList.length} এজেন্সি
                      </span>
                    </div>

                    {assignedContractorsList.length === 0 ? (
                      <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 text-[11px] text-amber-800 flex items-center justify-between">
                        <span>কোনো যোগানকৰ্তা আৱণ্টিত হোৱা নাই।</span>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(sup)}
                          className="font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          + আৱণ্টন কৰক
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {assignedContractorsList.map((c) => (
                          <div
                            key={c.id}
                            className="bg-slate-50 border border-slate-200/70 rounded-lg p-2 text-xs flex items-center justify-between hover:bg-indigo-50/40 transition-colors"
                          >
                            <div>
                              <div className="font-bold text-slate-800 leading-tight">
                                {c.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                CLRA: {c.licenseNo.split('-')[0]}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <a
                                href={`tel:${c.contactNo}`}
                                title={`Call Contractor ${c.name}`}
                                className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors"
                              >
                                <Phone className="h-3 w-3" />
                              </a>
                              <a
                                href={`https://wa.me/91${c.contactNo.replace(/\D/g, '')}?text=${encodeURIComponent(
                                  `নমস্কাৰ ${c.name}, কাৰখানা ছুপাৰভাইজাৰ ${sup.name}-ৰ সৈতে সমন্বয় ৰক্ষাৰ বাবে ICWL যোগে যোগাযোগ কৰা হৈছে।`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`WhatsApp Contractor ${c.name}`}
                                className="p-1.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-600 hover:bg-emerald-100 transition-colors"
                              >
                                <MessageSquare className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions: Edit & Delete */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">
                    পঞ্জীয়ন: {sup.createdAt || '2026-08-10'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(sup)}
                      className="p-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-lg font-bold transition-all flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      সম্পাদনা (Edit)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          window.confirm(
                            `${sup.name} ক কাৰখানা ছুপাৰভাইজাৰ তালিকাৰ পৰা অপসাৰণ কৰিব বিচাৰে নেকি?`
                          )
                        ) {
                          onDeleteSupervisor(sup.id);
                        }
                      }}
                      className="p-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                      title="Delete Supervisor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. MODAL: APPOINT / EDIT INDUSTRY SUPERVISOR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-fadeIn space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {editingSupervisor
                      ? 'কাৰখানা ছুপাৰভাইজাৰ তথ্য সম্পাদনা (Edit Industry Supervisor)'
                      : 'নতুন কাৰখানা ছুপাৰভাইজাৰ নিযুক্তি (Appoint Industry Supervisor)'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {industry.name} প্লাণ্টৰ বাবে ছুপাৰভাইজাৰ আৰু যোগানকৰ্তা সমন্বয়
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ছুপাৰভাইজাৰৰ সম্পূৰ্ণ নাম (Supervisor Full Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ৰমেশ কলিতা (Ramesh Kalita)"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    মোবাইল ফোন নম্বৰ (Phone) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value.replace(/\D/g, '')
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    কোম্পানীৰ ই-মেইল (Official Email)
                  </label>
                  <input
                    type="email"
                    placeholder="supervisor@industry.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-600 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    কাৰখানাৰ বিভাগ / প্লাণ্ট জ'ন (Department / Plant Zone)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Production & Assembly Line 1"
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    দায়িত্বৰ স্থিতি (Duty Status)
                  </label>
                  <select
                    value={formData.active ? 'true' : 'false'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        active: e.target.value === 'true'
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-indigo-600 font-bold text-slate-700"
                  >
                    <option value="true">সক্ৰিয় দায়িত্বত (Active On-Duty)</option>
                    <option value="false">ছুটীত / নিষ্ক্ৰিয় (On-Leave / Inactive)</option>
                  </select>
                </div>
              </div>

              {/* ASSIGN SUPPLIERS / CONTRACTORS TO OVERSEE */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    তদাৰকীৰ বাবে শ্ৰমিক যোগানকৰ্তা আৱণ্টন কৰক (Assign Suppliers to Oversee)
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {formData.assignedContractorIds.length} নিৰ্বাচিত
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  এই ছুপাৰভাইজাৰে কাৰখানাত তলত নিৰ্বাচিত ঠিকাদাৰ এজেন্সিৰ শ্ৰমিক যোগান, গেট এন্ট্ৰি আৰু শিফট সমন্বয় তদাৰক কৰিব।
                </p>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {contractors.length === 0 ? (
                    <div className="text-slate-400 text-xs py-2 italic">
                      কোনো পঞ্জীভুক্ত ঠিকাদাৰ পোৱা নগ'ল।
                    </div>
                  ) : (
                    contractors.map((c) => {
                      const isChecked = formData.assignedContractorIds.includes(c.id);
                      return (
                        <label
                          key={c.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleContractor(c.id)}
                              className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            />
                            <div>
                              <div className="text-xs font-bold leading-tight">
                                {c.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                CLRA: {c.licenseNo} | যোগাযোগ: {c.contactNo}
                              </div>
                            </div>
                          </div>
                          {isChecked && (
                            <span className="bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                              Assigned
                            </span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-all cursor-pointer"
                >
                  বাতিল কৰক (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  {editingSupervisor
                    ? 'আপডেট সংৰক্ষণ কৰক (Save Changes)'
                    : 'নিযুক্তি প্ৰদান কৰক (Confirm Appointment)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
