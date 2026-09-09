import React, { useRef } from 'react';
import { Printer, Download, X, Calendar, CheckCircle, Clock, ShieldCheck, Building2, User } from 'lucide-react';
import { Worker, Contractor, Supervisor, ContractorAttendanceRecord } from '../types';

interface ContractorMonthlyAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractor: Contractor;
  supervisor?: Supervisor;
  workers: Worker[];
  contractorAttendance: ContractorAttendanceRecord[];
  selectedMonth: string; // YYYY-MM (e.g. '2026-09')
  onChangeMonth: (m: string) => void;
}

export const ContractorMonthlyAttendanceModal: React.FC<ContractorMonthlyAttendanceModalProps> = ({
  isOpen,
  onClose,
  contractor,
  supervisor,
  workers,
  contractorAttendance,
  selectedMonth,
  onChangeMonth
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const safeContractor = contractor || {
    id: 'con-1',
    name: 'Apex Industrial Manpower Solutions',
    licenseNo: 'CLRA/AS/2026/8921',
    lin: '1928374650',
    pan: 'ABCDE1234F',
    epfCode: 'AS/GHY/0029381/000',
    esiCode: '13000982710000001',
    contactNo: '+91 98640 11223',
    rating: 4.9
  };

  // Compute number of days in selected month
  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10) || 2026;
  const monthIndex = (parseInt(monthStr, 10) || 9) - 1; // 0-based
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Month names for display
  const monthNames = [
    'January (জানুৱাৰী)', 'February (ফে ফেব্ৰুৱাৰী)', 'March (মাৰ্চ)', 'April (এপ্ৰিল)',
    'May (মে)', 'June (জুন)', 'July (জুলাই)', 'August (আগষ্ট)',
    'September (ছেপ্টেম্বৰ)', 'October (অক্টোবৰ)', 'November (নৱেম্বৰ)', 'December (ডিচেম্বৰ)'
  ];
  const displayMonthName = monthNames[monthIndex] || selectedMonth;

  // Filter workers under this contractor
  const contractorWorkers = workers.filter(w => w.contractorId === contractor.id);

  // Trigger Native Browser Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn overflow-y-auto">
      {/* Container with print-specific visibility classes */}
      <div className="bg-white rounded-2xl w-full max-w-6xl my-6 shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Non-Print Header / Action Bar */}
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:hidden shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                  কণ্ট্ৰেক্টৰ আভ্যন্তৰীণ বহী (Contractor Internal Register)
                </span>
                <span className="text-slate-400 text-[11px]">
                  (Form XVI ৰ সৈতে সংঘাতমুক্ত / Independent of Statutory Muster Roll)
                </span>
              </div>
              <h3 className="font-extrabold text-white text-base">
                মাহেকীয়া হাজিৰা পত্ৰিকা আৰু মজুৰি হিচাপ (Monthly Attendance Sheet & Wage Estimation)
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Month Picker */}
            <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5 text-emerald-400" />
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => onChangeMonth(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer"
              />
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              প্ৰিণ্ট / PDF সংৰক্ষণ (Print / Save PDF)
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2 rounded-xl transition-colors cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Sheet Body */}
        <div ref={printAreaRef} className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 print:p-2 print:overflow-visible">
          
          {/* Printable Official Contractor Header Block */}
          <div className="border-b-2 border-slate-900 pb-4 space-y-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 block">
                  LABOUR CONTRACTOR ATTENDANCE & WAGE RECORD (INTERNAL REGISTER)
                </span>
                <h1 className="text-xl font-black text-slate-950 tracking-tight">
                  {safeContractor.name}
                </h1>
                <p className="text-xs text-slate-600 mt-0.5">
                  CLRA License: <span className="font-mono font-bold text-slate-900">{safeContractor.licenseNo}</span> | LIN: <span className="font-mono font-bold text-slate-900">{safeContractor.lin}</span> | PAN: <span className="font-mono font-bold text-slate-900">{safeContractor.pan}</span>
                </p>
                <p className="text-xs text-slate-600">
                  EPF Code: <span className="font-mono font-bold text-slate-900">{safeContractor.epfCode}</span> | ESI Code: <span className="font-mono font-bold text-slate-900">{safeContractor.esiCode}</span>
                </p>
              </div>

              <div className="text-right border-l border-slate-200 pl-4">
                <span className="text-xs font-bold text-slate-500 block">মাহ আৰু বছৰ (Month & Year):</span>
                <span className="text-sm font-black text-indigo-900 block mt-0.5 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                  {displayMonthName} {year}
                </span>
                <span className="text-[11px] text-slate-600 font-medium block mt-1">
                  দায়িত্বপ্ৰাপ্ত ছুপাৰভাইজাৰ: <strong>{supervisor?.name || 'Site Supervisor'}</strong>
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  ফোন: {supervisor?.phone || safeContractor.contactNo}
                </span>
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-lg flex justify-between items-center text-xs print:bg-white print:border-slate-300">
              <span className="font-medium text-emerald-900">
                📌 <strong>টোকা:</strong> এইখন কণ্ট্ৰেক্টৰৰ চাইট ছুপাৰভাইজাৰৰ দ্বাৰা সংৰক্ষিত মাহেকীয়া উপস্থিতি পত্ৰিকা। এই হিচাপৰ ভিত্তিত শ্ৰমিকৰ মজুৰি আৰু কণ্ট্ৰেক্টৰৰ চাৰ্ভিস মাৰ্জিন গণনা কৰা হয়।
              </span>
              <span className="font-bold text-emerald-800 shrink-0 font-mono">
                মুঠ শ্ৰমিক: {contractorWorkers.length} জন
              </span>
            </div>
          </div>

          {/* Attendance Grid Table */}
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-200 w-8 text-center">নং</th>
                  <th className="p-2 border-r border-slate-200 min-w-[150px]">শ্ৰমিকৰ নাম আৰু আধাৰ (Worker Name)</th>
                  <th className="p-2 border-r border-slate-200 text-center w-16">দক্ষতা (Skill)</th>
                  <th className="p-2 border-r border-slate-200 text-center w-16">দৈনিক হাৰ (Rate)</th>
                  
                  {/* Days 1 to 30/31 columns */}
                  {daysArray.map(d => (
                    <th key={d} className="p-1 border-r border-slate-200 text-center w-6 text-[10px] font-mono">
                      {d}
                    </th>
                  ))}

                  <th className="p-2 border-r border-slate-200 text-center w-12 bg-emerald-50 text-emerald-900 font-black">উপস্থিতি (P)</th>
                  <th className="p-2 border-r border-slate-200 text-center w-12 bg-amber-50 text-amber-900 font-black">OT ঘণ্টা</th>
                  <th className="p-2 text-right w-24 bg-indigo-50 text-indigo-950 font-black">প্ৰদেয় মজুৰি (Gross ₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {contractorWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={daysArray.length + 7} className="p-8 text-center text-slate-400 font-semibold italic">
                      এই কণ্ট্ৰেক্টৰৰ অধীনত কোনো শ্ৰমিক তালিকাভুক্ত নাই। ছুপাৰভাইজাৰ পেনেলৰ পৰা পোনপটীয়া এন্ট্ৰি কৰক।
                    </td>
                  </tr>
                ) : (
                  contractorWorkers.map((worker, idx) => {
                    // Compute attendance for this worker across all days of the month
                    let presentCount = 0;
                    let otHoursSum = 0;

                    const dayStatusCells = daysArray.map(day => {
                      const dayStr = String(day).padStart(2, '0');
                      const dateKey = `${selectedMonth}-${dayStr}`;

                      // Check contractor attendance record
                      const record = contractorAttendance.find(
                        r => r.workerId === worker.id && r.date === dateKey
                      );

                      let cellChar = '-';
                      let cellClass = 'text-slate-300';

                      if (record) {
                        if (record.status === 'Present') {
                          presentCount++;
                          otHoursSum += (record.overtimeHours || 0);
                          cellChar = record.overtimeHours > 0 ? `P+${record.overtimeHours}` : 'P';
                          cellClass = 'text-emerald-700 font-bold bg-emerald-50/50';
                        } else if (record.status === 'Half-Day') {
                          presentCount += 0.5;
                          cellChar = 'HD';
                          cellClass = 'text-amber-700 font-bold bg-amber-50/50';
                        } else if (record.status === 'Absent') {
                          cellChar = 'A';
                          cellClass = 'text-rose-600 font-bold bg-rose-50/50';
                        }
                      } else {
                        // Default simulation: if not marked, can show rest day or absent for Sundays
                        const dateObj = new Date(year, monthIndex, day);
                        const isSunday = dateObj.getDay() === 0;
                        if (isSunday) {
                          cellChar = 'W/O';
                          cellClass = 'text-slate-400 bg-slate-50 text-[9px] font-medium';
                        }
                      }

                      return (
                        <td key={day} className={`p-1 border-r border-slate-200 text-center text-[10px] font-mono ${cellClass}`}>
                          {cellChar}
                        </td>
                      );
                    });

                    // Wages calculation: Normal wage + Overtime (2x hourly rate under Factories Act)
                    const hourlyRate = worker.dailyWageRate / 8;
                    const normalWage = presentCount * worker.dailyWageRate;
                    const otWage = otHoursSum * (hourlyRate * 2);
                    const grossWages = Math.round(normalWage + otWage);

                    return (
                      <tr key={worker.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-2 border-r border-slate-200 text-center font-mono text-slate-500 font-bold">
                          {idx + 1}
                        </td>
                        <td className="p-2 border-r border-slate-200">
                          <span className="font-extrabold text-slate-900 block text-xs">{worker.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {worker.aadhaarHash} | Ph: {worker.phone}
                          </span>
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center">
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            {worker.skillType.slice(0, 4)}
                          </span>
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-slate-800">
                          ₹{worker.dailyWageRate}
                        </td>

                        {/* 30/31 day cells */}
                        {dayStatusCells}

                        {/* Totals */}
                        <td className="p-2 border-r border-slate-200 text-center font-mono font-extrabold text-emerald-800 bg-emerald-50/40">
                          {presentCount}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-center font-mono font-bold text-amber-800 bg-amber-50/40">
                          {otHoursSum}h
                        </td>
                        <td className="p-2 text-right font-mono font-black text-indigo-900 bg-indigo-50/40">
                          ₹{grossWages.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {contractorWorkers.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-800">
                    <td colSpan={4} className="p-2 text-right pr-4 font-black">
                      মুঠ সৰ্বমুঠ (Total):
                    </td>
                    <td colSpan={daysArray.length} className="p-2 text-center text-[10px] text-slate-500 italic">
                      P = উপস্থিত (Present) | A = অনুপস্থিত (Absent) | HD = আধা দিন | W/O = সাপ্তাহিক বন্ধ (Weekly Off)
                    </td>
                    <td className="p-2 text-center font-mono font-black text-emerald-900 bg-emerald-100/50">
                      {contractorWorkers.reduce((acc, w) => {
                        const count = daysArray.reduce((c, day) => {
                          const dateKey = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                          const rec = contractorAttendance.find(r => r.workerId === w.id && r.date === dateKey);
                          return c + (rec?.status === 'Present' ? 1 : rec?.status === 'Half-Day' ? 0.5 : 0);
                        }, 0);
                        return acc + count;
                      }, 0)}
                    </td>
                    <td className="p-2 text-center font-mono font-black text-amber-900 bg-amber-100/50">
                      {contractorWorkers.reduce((acc, w) => {
                        const ot = daysArray.reduce((c, day) => {
                          const dateKey = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                          const rec = contractorAttendance.find(r => r.workerId === w.id && r.date === dateKey);
                          return c + (rec?.overtimeHours || 0);
                        }, 0);
                        return acc + ot;
                      }, 0)}h
                    </td>
                    <td className="p-2 text-right font-mono font-black text-indigo-950 bg-indigo-100/50">
                      ₹{contractorWorkers.reduce((acc, w) => {
                        let presentCount = 0;
                        let otSum = 0;
                        daysArray.forEach(day => {
                          const dateKey = `${selectedMonth}-${String(day).padStart(2, '0')}`;
                          const rec = contractorAttendance.find(r => r.workerId === w.id && r.date === dateKey);
                          if (rec?.status === 'Present') presentCount += 1;
                          else if (rec?.status === 'Half-Day') presentCount += 0.5;
                          if (rec?.overtimeHours) otSum += rec.overtimeHours;
                        });
                        const hourly = w.dailyWageRate / 8;
                        return acc + Math.round(presentCount * w.dailyWageRate + otSum * hourly * 2);
                      }, 0).toLocaleString('en-IN')}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* Verification, Seal & Signatures Block */}
          <div className="pt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-xs print:pt-4">
            <div className="space-y-12">
              <span className="text-slate-500 font-bold block">প্ৰস্তুতকৰ্তা (Prepared by Site Supervisor):</span>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-extrabold text-slate-800 block">{supervisor?.name || 'Site Supervisor'}</span>
                <span className="text-[10px] text-slate-500 block">লেবাৰ ছুপাৰভাইজাৰ (Labour Supervisor)</span>
                <span className="text-[10px] text-slate-400 font-mono block">তাৰিখ: {new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="space-y-12 text-center">
              <span className="text-slate-500 font-bold block">শ্ৰমিক প্ৰতিনিধি (Worker Representative):</span>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-slate-700 block">শ্ৰমিকৰ স্বাক্ষৰ / চহী</span>
                <span className="text-[10px] text-slate-400 block">প্ৰাপ্তি স্বীকাৰ (Wage Acknowledged)</span>
              </div>
            </div>

            <div className="space-y-12 text-right">
              <span className="text-slate-500 font-bold block">কণ্ট্ৰেক্টৰ কৰ্তৃপক্ষ (Authorized Signatory & Seal):</span>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-black text-slate-900 block">{safeContractor.name}</span>
                <span className="text-[10px] text-slate-500 block">Mohor & Stamp (মোহৰ আৰু চহী)</span>
              </div>
            </div>
          </div>

          {/* Print instructions notice */}
          <div className="text-[10px] text-slate-400 text-center print:hidden pt-2">
            💡 টিপ: ব্ৰাউজাৰৰ <strong>&quot;প্ৰিণ্ট / PDF সংৰক্ষণ&quot;</strong> বিকল্প ব্যৱহাৰ কৰি ইয়াৰ পৰা পোনপটীয়াকৈ A4 Landscape PDF ডাউনল’ড বা প্ৰিণ্ট কৰিব পাৰি।
          </div>
        </div>
      </div>
    </div>
  );
};
