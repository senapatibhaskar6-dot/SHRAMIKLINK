import React, { useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  UserCheck, 
  Truck, 
  AlertTriangle, 
  Clock, 
  Search, 
  CheckCircle2, 
  Plus, 
  Camera, 
  Download,
  PhoneCall,
  Calendar,
  Building2,
  FileCheck2
} from 'lucide-react';
import { Worker, Industry, Contractor } from '../types';

interface SecurityGuardDashboardProps {
  guardName?: string;
  workers: Worker[];
  industries: Industry[];
  contractors: Contractor[];
  showNotice: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

interface GateEntry {
  id: string;
  type: 'worker' | 'visitor' | 'material';
  name: string;
  passNo: string;
  entity: string;
  purpose: string;
  inTime: string;
  outTime?: string;
  status: 'In-Premises' | 'Cleared-Out';
  verifiedVia: 'Aadhaar QR' | 'Security Pass' | 'Challan';
}

export const SecurityGuardDashboard: React.FC<SecurityGuardDashboardProps> = ({
  guardName = 'Rupen Das (Head Guard)',
  workers,
  industries,
  contractors,
  showNotice
}) => {
  const [activeTab, setActiveTab] = useState<'gate_entry' | 'worker_scan' | 'material_pass' | 'incident_log'>('gate_entry');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Gate entries state
  const [gateEntries, setGateEntries] = useState<GateEntry[]>([
    {
      id: 'gate-1',
      type: 'worker',
      name: 'Ramen Kalita',
      passNo: 'SHR-8921',
      entity: 'Brahmaputra Manpower Supply',
      purpose: 'Assembly Line Shift A',
      inTime: '06:15 AM',
      status: 'In-Premises',
      verifiedVia: 'Aadhaar QR'
    },
    {
      id: 'gate-2',
      type: 'worker',
      name: 'Gopal Kumar',
      passNo: 'SHR-4412',
      entity: 'Apex Solutions',
      purpose: 'Packaging Section',
      inTime: '06:22 AM',
      status: 'In-Premises',
      verifiedVia: 'Aadhaar QR'
    },
    {
      id: 'gate-3',
      type: 'visitor',
      name: 'Pranab Barman (Auditor)',
      passNo: 'VIS-2026-09',
      entity: 'Assam Labour Dept',
      purpose: 'CLRA Form VI Verification',
      inTime: '09:40 AM',
      status: 'In-Premises',
      verifiedVia: 'Security Pass'
    },
    {
      id: 'gate-4',
      type: 'material',
      name: 'Truck AS-01-EC-9844',
      passNo: 'CHAL-44812',
      entity: 'Tata Steel Raw Inward',
      purpose: 'Steel Sheet Delivery 14.5 MT',
      inTime: '10:05 AM',
      outTime: '11:15 AM',
      status: 'Cleared-Out',
      verifiedVia: 'Challan'
    }
  ]);

  // Visitor Pass Modal / State
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorOrg, setVisitorOrg] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorPurpose, setVisitorPurpose] = useState('');
  const [visitorHost, setVisitorHost] = useState('HR Department / Plant Manager');

  // Scanner Simulator State
  const [selectedWorkerScanId, setSelectedWorkerScanId] = useState(workers[0]?.id || '');
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Material Challan Form State
  const [vehicleNo, setVehicleNo] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [materialDescription, setMaterialDescription] = useState('');

  // Handle Quick Worker QR Scan
  const handleSimulateScan = () => {
    const worker = workers.find(w => w.id === selectedWorkerScanId);
    if (!worker) {
      showNotice('শ্ৰমিক চিনাক্ত কৰা নহ’ল!', 'error');
      return;
    }
    const contractor = contractors.find(c => c.id === worker.contractorId);
    const newEntry: GateEntry = {
      id: `gate-${Date.now()}`,
      type: 'worker',
      name: worker.name,
      passNo: `QR-${Math.floor(1000 + Math.random() * 9000)}`,
      entity: contractor ? contractor.name : 'Direct Facility',
      purpose: 'Daily Production Duty (Gate In)',
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'In-Premises',
      verifiedVia: 'Aadhaar QR'
    };
    setGateEntries([newEntry, ...gateEntries]);
    setScanResult(`ভৰিধাৰী শ্ৰমিক: ${worker.name} (Aadhaar: ${worker.aadhaarHash}) - গেট প্ৰৱেশ অনুমতিপ্ৰাপ্ত!`);
    showNotice(`গেট প্ৰৱেশ অনুমোদিত: ${worker.name}`, 'success');
  };

  // Handle Mark Gate Out
  const handleMarkOut = (id: string) => {
    setGateEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          outTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'Cleared-Out'
        };
      }
      return entry;
    }));
    showNotice('গেটৰ পৰা বাহিৰ হোৱা ৰেকৰ্ড আপডেট কৰা হ’ল (Gate Out Recorded)', 'info');
  };

  // Handle Visitor Pass Generation
  const handleCreateVisitorPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName || !visitorPhone) {
      showNotice('অনুগ্ৰহ কৰি ভ্ৰমণকাৰীৰ নাম আৰু ফোন নম্বৰ লিখক!', 'error');
      return;
    }
    const passNo = `VIS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: GateEntry = {
      id: `gate-${Date.now()}`,
      type: 'visitor',
      name: visitorName,
      passNo,
      entity: visitorOrg || 'Individual Visitor',
      purpose: visitorPurpose || `Meeting with ${visitorHost}`,
      inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'In-Premises',
      verifiedVia: 'Security Pass'
    };
    setGateEntries([newEntry, ...gateEntries]);
    setIsVisitorModalOpen(false);
    setVisitorName('');
    setVisitorOrg('');
    setVisitorPhone('');
    setVisitorPurpose('');
    showNotice(`ভ্ৰমণকাৰী গেট পাছ সৃষ্টি কৰা হ'ল! পাছ নং: ${passNo}`, 'success');
  };

  // Filtered entries
  const filteredEntries = gateEntries.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.passNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.entity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 space-y-6 text-slate-900 animate-fadeIn">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-center text-indigo-700 shadow-xs">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                PSARA Act & Factory Gate Security
              </span>
              <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Gate 1 Online
              </span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              👮 নিৰাপত্তাৰক্ষী গেট ডেশ্ববৰ্ড (Security Guard Dashboard)
            </h2>
            <p className="text-xs text-slate-500">
              অন-ডিউটি কমাণ্ডাৰ: <strong className="text-slate-800">{guardName}</strong> • কাৰখানা মূল প্ৰৱেশদ্বাৰ আৰু পহৰা নিৰীক্ষণ
            </p>
          </div>
        </div>

        {/* Quick Shift Counter */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">প্ৰাঙ্গনত বৰ্তমান (Inside)</span>
            <span className="text-base font-black text-indigo-600">
              {gateEntries.filter(e => e.status === 'In-Premises').length} গৰাকী
            </span>
          </div>
          <button
            onClick={() => setIsVisitorModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>+ নতুন গেট পাছ (Pass)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'gate_entry', label: '📋 গেট এন্ট্ৰি আৰু এক্সিট ৰেজিষ্টাৰ (Gate Log)', icon: FileCheck2 },
          { id: 'worker_scan', label: '📷 শ্ৰমিক Aadhaar QR স্কেন (Worker Scan)', icon: QrCode },
          { id: 'material_pass', label: '🚛 সামগ্ৰী ইনৱাৰ্ড চালান (Material Pass)', icon: Truck },
          { id: 'incident_log', label: "🚨 নিৰাপত্তা সতৰ্কতা আৰু পেট্ৰ'ল (Alert & Patrol)", icon: AlertTriangle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Gate Log */}
      {activeTab === 'gate_entry' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="নাম, পাছ নং, বা বাহন নং সন্ধান কৰক..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              মুঠ গেট ৰেকৰ্ড: <strong className="text-slate-800">{filteredEntries.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">প্ৰকাৰ / পাছ নং</th>
                  <th className="py-2.5 px-3">নাম / প্ৰতিষ্ঠান</th>
                  <th className="py-2.5 px-3">উদ্দেশ্য (Purpose)</th>
                  <th className="py-2.5 px-3">প্ৰৱেশ সময়</th>
                  <th className="py-2.5 px-3">প্ৰস্থান সময়</th>
                  <th className="py-2.5 px-3">সত্যতা নিৰূপণ</th>
                  <th className="py-2.5 px-3 text-right">ব্যৱস্থা</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          entry.type === 'worker' ? 'bg-emerald-100 text-emerald-800' :
                          entry.type === 'visitor' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {entry.type}
                        </span>
                        <span className="font-mono text-slate-900 font-bold">{entry.passNo}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{entry.name}</div>
                      <div className="text-[10px] text-slate-500">{entry.entity}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{entry.purpose}</td>
                    <td className="py-2.5 px-3 font-mono text-indigo-600 font-bold">{entry.inTime}</td>
                    <td className="py-2.5 px-3 font-mono">
                      {entry.outTime ? (
                        <span className="text-slate-600">{entry.outTime}</span>
                      ) : (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                          সক্ৰিয় (Inside)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-200">
                        {entry.verifiedVia}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {entry.status === 'In-Premises' ? (
                        <button
                          onClick={() => handleMarkOut(entry.id)}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg cursor-pointer transition-all"
                        >
                          গেট আউট (Exit)
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-bold">নিষ্ক্ৰান্ত (Cleared)</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Worker Scan Simulator */}
      {activeTab === 'worker_scan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-indigo-600" />
              <h3 className="font-black text-slate-900 text-sm">Aadhaar QR স্কেনাৰ আৰু গেট অনুমোদন</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              শ্ৰমিকৰ ডিজিটেল পৰিচয়-পত্ৰ বা আধাৰ QR স্কেন কৰি গেট প্ৰৱেশ আৰু হাজিৰা ৰেকৰ্ড সম্পন্ন কৰক।
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">পৰীক্ষাৰ বাবে শ্ৰমিক বাছক (Worker Selection):</label>
              <select
                value={selectedWorkerScanId}
                onChange={(e) => setSelectedWorkerScanId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
              >
                {workers.map(w => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.skillType} • {w.aadhaarHash})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulateScan}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <QrCode className="h-4 w-4" />
              <span>গেটলৈ প্ৰৱেশ স্কেন কৰক (Simulate Gate Check-In)</span>
            </button>

            {scanResult && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{scanResult}</span>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-24 h-24 border-2 border-dashed border-indigo-400 rounded-2xl flex items-center justify-center bg-indigo-50/50">
              <QrCode className="h-12 w-12 text-indigo-600" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 block">AI Optical Gate Sentry</span>
              <span className="text-[11px] text-slate-500 block">
                Zero Proxy Attendance & CLRA Verified Entry Point
              </span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Gate Hardware Protocol: Wiegand 26/34 / USB Scanner Ready
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Material Pass */}
      {activeTab === 'material_pass' && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-indigo-600" />
            <h3 className="font-black text-slate-900 text-sm">ইনৱাৰ্ড / আউটৱাৰ্ড সামগ্ৰী চালান (Goods Pass)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">বাহন নম্বৰ (Vehicle Reg No)</label>
              <input
                type="text"
                placeholder="e.g. AS-01-BX-7721"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">যোগানকাৰী / ভেণ্ডৰ (Vendor)</label>
              <input
                type="text"
                placeholder="e.g. Assam Logistics Corp"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">সামগ্ৰীৰ বিৱৰণ (Material Details)</label>
              <input
                type="text"
                placeholder="e.g. Cement, Steel, Spare Parts"
                value={materialDescription}
                onChange={(e) => setMaterialDescription(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!vehicleNo) {
                  showNotice('বাহন নম্বৰ লিখক!', 'error');
                  return;
                }
                const newPass: GateEntry = {
                  id: `gate-${Date.now()}`,
                  type: 'material',
                  name: `Vehicle ${vehicleNo}`,
                  passNo: `MAT-${Math.floor(1000 + Math.random() * 9000)}`,
                  entity: vendorName || 'Logistics Supplier',
                  purpose: materialDescription || 'Inward Raw Material',
                  inTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  status: 'In-Premises',
                  verifiedVia: 'Challan'
                };
                setGateEntries([newPass, ...gateEntries]);
                setVehicleNo('');
                setVendorName('');
                setMaterialDescription('');
                showNotice('সামগ্ৰী চালান গেট প্ৰৱেশ ৰেকৰ্ড কৰা হ’ল!', 'success');
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              + সামগ্ৰী চালান অনুমোদন কৰক
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Incident Log & Alert */}
      {activeTab === 'incident_log' && (
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="font-black text-slate-900 text-sm">পে'ট্ৰল আৰু নিৰাপত্তা সতৰ্কতা (Guard Incident Log)</h3>
            </div>
            <button
              onClick={() => showNotice('🚨 জৰুৰীকালীন নিৰাপত্তা সতৰ্কতা প্ৰেৰণ কৰা হ’ল! (Emergency Alert Broadcasted)', 'error')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>জৰুৰীকালীন SOS এলাৰ্ট</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Round 1: Boundary Wall & Perimeter Patrol</span>
                <span className="text-[11px] text-slate-500">Completed at 04:30 AM by Shift Guard. All perimeter lights active.</span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">সম্পূৰ্ণ (Normal)</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Fire Extinguisher & CCTV Gate Sentry Check</span>
                <span className="text-[11px] text-slate-500">Inspected at 08:00 AM. 16 cameras online. Hydrant pressure normal.</span>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">সম্পূৰ্ণ (Normal)</span>
            </div>
          </div>
        </div>
      )}

      {/* Visitor Modal */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-indigo-600" />
                নতুন ভ্ৰমণকাৰী গেট পাছ (Issue Visitor Pass)
              </h3>
              <button onClick={() => setIsVisitorModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisitorPass} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">ভ্ৰমণকাৰীৰ নাম (Visitor Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananta Saikia"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">মোবাইল নম্বৰ (Phone No) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9864012345"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">সংস্থা / ঠিকনা (Organization / Address)</label>
                <input
                  type="text"
                  placeholder="e.g. ABC Electricals Ltd"
                  value={visitorOrg}
                  onChange={(e) => setVisitorOrg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">সাক্ষাতকাৰী বিষয়া / কাৰ্যালয় (Host / Department)</label>
                <input
                  type="text"
                  value={visitorHost}
                  onChange={(e) => setVisitorHost(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">উদ্দেশ্য (Visiting Purpose)</label>
                <input
                  type="text"
                  placeholder="e.g. Factory Inspection / Client Meeting"
                  value={visitorPurpose}
                  onChange={(e) => setVisitorPurpose(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVisitorModalOpen(false)}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 rounded-xl text-xs cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs cursor-pointer shadow-xs"
                >
                  গেট পাছ জাৰী কৰক
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
