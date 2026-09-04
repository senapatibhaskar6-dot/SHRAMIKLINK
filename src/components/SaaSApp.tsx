import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  FileSpreadsheet, 
  ShieldCheck, 
  AlertTriangle, 
  UserCheck, 
  Upload, 
  Plus, 
  Check, 
  X, 
  Eye, 
  Lock, 
  Unlock, 
  HelpCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  PhoneCall, 
  Star, 
  Search,
  IndianRupee,
  Database,
  LogOut,
  Download,
  Loader2,
  Zap
} from 'lucide-react';
import { 
  Industry, 
  Contractor, 
  Worker, 
  MultiIndustryAssignment, 
  DailyRequirement, 
  Attendance, 
  ComplianceDocument, 
  Bill, 
  AadhaarVerificationLog, 
  GovernmentAuditLog, 
  RevenueLog 
} from '../types';
import { 
  initialIndustries, 
  initialContractors, 
  initialWorkers, 
  initialAssignments, 
  initialRequirements, 
  initialAttendance, 
  initialComplianceDocs, 
  initialBills, 
  initialVerificationLogs, 
  initialAuditLogs, 
  initialRevenueLogs 
} from '../mockData';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import logoUrl from '../assets/images/shramiklink_logo_uploaded.jpeg';
import TransparentImage from './TransparentImage';
import { PWAInstallButton } from './PWAInstallButton';

export default function SaaSApp() {
  // Global State (persisted/synchronized to Postgres Cloud SQL)
  const [industries, setIndustries] = useState<Industry[]>(initialIndustries);
  const [contractors, setContractors] = useState<Contractor[]>(initialContractors);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [assignments, setAssignments] = useState<MultiIndustryAssignment[]>(initialAssignments);
  const [requirements, setRequirements] = useState<DailyRequirement[]>(initialRequirements);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDocument[]>(initialComplianceDocs);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [verificationLogs, setVerificationLogs] = useState<AadhaarVerificationLog[]>(initialVerificationLogs);
  const [auditLogs, setAuditLogs] = useState<GovernmentAuditLog[]>(initialAuditLogs);
  const [revenueLogs, setRevenueLogs] = useState<RevenueLog[]>(initialRevenueLogs);

  // Auth/Session State
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('s_is_logged_in') === 'true';
  });
  const [currentRole, setCurrentRole] = useState<'industry_admin' | 'contractor' | 'worker' | 'government_inspector'>(() => {
    const saved = localStorage.getItem('s_current_role');
    return (saved as any) || 'industry_admin';
  });
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginRoleInProgress, setLoginRoleInProgress] = useState<string | null>(null);

  // Load database tables from full-stack backend
  const refreshData = async (activeToken?: string) => {
    const currentToken = activeToken || token;
    try {
      const headers: Record<string, string> = {};
      if (currentToken) {
        headers['Authorization'] = `Bearer ${currentToken}`;
      }
      const response = await fetch('/api/data', { headers });
      if (response.ok) {
        const data = await response.json();
        setIndustries(data.industries);
        setContractors(data.contractors);
        setWorkers(data.workers);
        setAssignments(data.assignments);
        setRequirements(data.requirements);
        setAttendance(data.attendance);
        setComplianceDocs(data.complianceDocs);
        setBills(data.bills);
        setVerificationLogs(data.verificationLogs);
        setAuditLogs(data.auditLogs);
        setRevenueLogs(data.revenueLogs);
      } else {
        console.error('Failed to load database from full-stack API');
      }
    } catch (err) {
      console.error('Error fetching backend data:', err);
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        setToken(idToken);
        setIsLoggedIn(true);
        localStorage.setItem('s_is_logged_in', 'true');
        refreshData(idToken);
      } else {
        setToken(null);
        setIsLoggedIn(false);
        localStorage.setItem('s_is_logged_in', 'false');
        refreshData(undefined);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Secure sign-in via Google OAuth and sync role with database
  const handleLogin = async (role: 'industry_admin' | 'contractor' | 'worker' | 'government_inspector') => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginRoleInProgress(role);

    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      setCurrentRole(role);
      localStorage.setItem('s_current_role', role);

      // Sync user profile role to database
      try {
        await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({ role })
        });
      } catch (syncErr) {
        console.warn('Profile sync notification:', syncErr);
      }

      setIsLoggedIn(true);
      localStorage.setItem('s_is_logged_in', 'true');
      showNotice(`Secure login successful via Google: ${result.user.displayName || result.user.email}!`, 'success');
      refreshData(idToken);
    } catch (err: any) {
      const errorCode = err?.code || '';
      if (errorCode === 'auth/cancelled-popup-request') {
        console.warn('Google Sign-In popup request was cancelled or superseded.');
        showNotice('লগইন পপ-আপ বাতিল কৰা হৈছে। অনুগ্ৰহ কৰি আকৌ এবাৰ ক্লিক কৰক বা Quick Access বাছনি কৰক।', 'info');
      } else if (errorCode === 'auth/popup-closed-by-user') {
        console.warn('Google Sign-In popup was closed by user.');
        showNotice('লগইন উইণ্ড’খন বন্ধ কৰা হ’ল। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।', 'info');
      } else if (errorCode === 'auth/popup-blocked') {
        console.warn('Google Sign-In popup was blocked by browser.');
        showNotice('ব্ৰাউজাৰে পপ-আপ উইণ্ড’খন বাধা দিছে। Quick Demo Access ব্যৱহাৰ কৰিব পাৰে।', 'error');
      } else {
        console.error('Google Sign-In Error:', err);
        showNotice(`Secure login failed: ${err.message || err}`, 'error');
      }
    } finally {
      setIsLoggingIn(false);
      setLoginRoleInProgress(null);
    }
  };

  // Instant sandbox / demo login without requiring external popup window
  const handleDemoLogin = (role: 'industry_admin' | 'contractor' | 'worker' | 'government_inspector') => {
    setCurrentRole(role);
    localStorage.setItem('s_current_role', role);
    setIsLoggedIn(true);
    localStorage.setItem('s_is_logged_in', 'true');
    showNotice(`Sandbox Demo: Entered as ${role.replace('_', ' ').toUpperCase()}`, 'success');
    refreshData(token || undefined);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Logout notice:', err);
    } finally {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      localStorage.setItem('s_is_logged_in', 'false');
      showNotice('Logged out of secure CLRA compliance session.', 'info');
    }
  };
  
  // Selected Actor Sub-states
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('ind-1'); // Tata Motors Pune
  const [selectedContractorId, setSelectedContractorId] = useState<string>('con-1'); // Apex solutions
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>('wrk-4'); // Idle worker

  // Interactive Form Dialog states
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);
  const [newReq, setNewReq] = useState({
    skillType: 'Skilled' as 'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly-Skilled',
    workersNeeded: 5,
    shiftTiming: 'Shift A (06:00 - 14:00)',
    contractorId: 'con-1'
  });

  // Contractor Deployment states
  const [deployingWorkerId, setDeployingWorkerId] = useState<string | null>(null);
  const [deploymentIndustryId, setDeploymentIndustryId] = useState<string>('ind-1');
  const [deploymentShift, setDeploymentShift] = useState<string>('Shift A (06:00 - 14:00)');

  // Contractor Billing States
  const [billMonth, setBillMonth] = useState('August 2026');
  const [billTargetIndustry, setBillTargetIndustry] = useState('ind-1');
  const [billBaseWage, setBillBaseWage] = useState(150000);
  const [billServiceCharge, setBillServiceCharge] = useState(15000); // 10%
  const [challanFile, setChallanFile] = useState<string | null>(null);

  // Inspector States
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [newAudit, setNewAudit] = useState({
    inspectedEntity: 'Industry' as 'Industry' | 'Contractor',
    entityId: 'ind-1',
    findings: '',
    status: 'Clean' as 'Clean' | 'Minor-Observations' | 'Non-Compliant-Alert'
  });

  // Worker Check-In State
  const [verificationMethod, setVerificationMethod] = useState<'Aadhaar-OTP' | 'Biometric-Face'>('Aadhaar-OTP');
  const [otpGenerated, setOtpGenerated] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [isFaceScanning, setIsFaceScanning] = useState(false);
  const [checkInSuccessMessage, setCheckInSuccessMessage] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showNotice = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 8000);
  };

  // View Doc Modal state
  const [activeDocUrl, setActiveDocUrl] = useState<string | null>(null);

  // Helper selectors
  const activeIndustry = industries.find(i => i.id === selectedIndustryId) || industries[0];
  const activeContractor = contractors.find(c => c.id === selectedContractorId) || contractors[0];
  const activeWorker = workers.find(w => w.id === selectedWorkerId) || workers[0];

  // System auditing: check if contractor has July compliance verified
  const checkContractorCompliance = (contractorId: string, month: string) => {
    const docs = complianceDocs.filter(d => d.contractorId === contractorId && d.month === month && d.status === 'Verified');
    const hasEPF = docs.some(d => d.docType === 'EPF-Challan');
    const hasESI = docs.some(d => d.docType === 'ESI-Challan');
    const hasGST = docs.some(d => d.docType === 'GST-Return');
    return {
      compliant: hasEPF && hasESI && hasGST,
      hasEPF,
      hasESI,
      hasGST
    };
  };

  // Handle worker self-registration mapped to independent contractor
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerPhone, setNewWorkerPhone] = useState('');
  const [newWorkerAadhaar, setNewWorkerAadhaar] = useState('');
  const [newWorkerContractor, setNewWorkerContractor] = useState('con-1');
  const [newWorkerSkill, setNewWorkerSkill] = useState<'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly-Skilled'>('Unskilled');
  const [newWorkerSuccess, setNewWorkerSuccess] = useState(false);

  const handleRegisterWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName || !newWorkerPhone || !newWorkerAadhaar) return;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/workers/register', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newWorkerName,
          phone: newWorkerPhone,
          aadhaarHash: newWorkerAadhaar,
          contractorId: newWorkerContractor,
          skillType: newWorkerSkill,
          dailyWageRate: newWorkerSkill === 'Highly-Skilled' ? 850 : newWorkerSkill === 'Skilled' ? 650 : newWorkerSkill === 'Semi-Skilled' ? 550 : 480
        })
      });

      if (response.ok) {
        showNotice('Worker registered and verified against UIDAI secure database!', 'success');
        refreshData();
        setNewWorkerName('');
        setNewWorkerPhone('');
        setNewWorkerAadhaar('');
        setNewWorkerSuccess(true);
        setTimeout(() => setNewWorkerSuccess(false), 5000);
      } else {
        showNotice('Failed to register worker', 'error');
      }
    } catch (err) {
      console.error(err);
      showNotice('Network error registering worker', 'error');
    }
  };

  // Handle Contractor Deployment
  const handleDeployWorker = async (workerId: string) => {
    const workerObj = workers.find(w => w.id === workerId);
    if (!workerObj) return;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/workers/deploy', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workerId,
          industryId: deploymentIndustryId,
          shiftTiming: deploymentShift
        })
      });

      if (response.ok) {
        showNotice('Worker deployed successfully!', 'success');
        refreshData();
        setDeployingWorkerId(null);
      } else {
        showNotice('Failed to deploy worker', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Quick Recall
  const handleRecallWorker = async (assignmentId: string) => {
    const asg = assignments.find(a => a.id === assignmentId);
    if (!asg) return;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/workers/recall', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          assignmentId,
          workerId: asg.workerId
        })
      });

      if (response.ok) {
        showNotice('Worker recalled to active bench.', 'info');
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Upload missing challan for Sahyadri Allied Services to demonstrate interactive compliance unlocking
  const handleUploadMissingChallan = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/compliance/upload-missing', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contractorId: 'con-3',
          month: 'July 2026',
          docType: 'GST-Return',
          fileUrl: 'GSTR3B-JUL-SIMULATED.pdf',
          remarks: 'GST Return challan uploaded manually. Sandbox automatically verified payment of ₹94,500.'
        })
      });

      if (response.ok) {
        showNotice('GST Challan uploaded. Sahyadri Allied Services compliance unlocked!', 'success');
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Bill
  const handleSubmitBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const compliance = checkContractorCompliance(selectedContractorId, 'July 2026');
    if (!compliance.compliant) return;

    const base = Number(billBaseWage);
    const service = Number(billServiceCharge);
    const gst = (base + service) * 0.18;
    const total = base + service + gst;

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/bills/submit', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          contractorId: selectedContractorId,
          industryId: billTargetIndustry,
          month: billMonth,
          baseAmount: base,
          serviceCharge: service,
          gstAmount: gst,
          totalAmount: total,
          complianceDocIds: complianceDocs.filter(d => d.contractorId === selectedContractorId && d.month === 'July 2026').map(d => d.id)
        })
      });

      if (response.ok) {
        showNotice('Bill submitted successfully to Industry Admin for compliance check!', 'success');
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bill audit actions by Industry
  const handleAuditBill = async (billId: string, action: 'Approve' | 'Reject') => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/bills/audit', {
        method: 'POST',
        headers,
        body: JSON.stringify({ billId, action })
      });

      if (response.ok) {
        showNotice(`Bill ${action === 'Approve' ? 'approved' : 'rejected'} and logged!`, 'success');
        refreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post Industry Requirement
  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/requirements/add', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          industryId: selectedIndustryId,
          industryName: activeIndustry.name,
          contractorId: newReq.contractorId,
          date: new Date().toISOString().split('T')[0],
          skillType: newReq.skillType,
          workersNeeded: Number(newReq.workersNeeded),
          shiftTiming: newReq.shiftTiming
        })
      });

      if (response.ok) {
        showNotice('Requirement posted to contract panel.', 'success');
        refreshData();
        setIsRequirementModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Worker Check-In Simulator logic
  const triggerOtpGeneration = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setOtpGenerated(code);
    setOtpInput('');
    setOtpVerified(false);
    // Simulate SMS notification
    showNotice(`[UIDAI SECURE TRANSMISSION] Aadhaar OTP for ${activeWorker.name} is: ${code}`, 'info');
  };

  const verifyWorkerCheckIn = async () => {
    if (verificationMethod === 'Aadhaar-OTP' && otpInput !== otpGenerated) {
      showNotice('Incorrect Aadhaar OTP. Secure check-in rejected.', 'error');
      return;
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workerId: selectedWorkerId,
          verificationMethod,
          checkIn: new Date().toTimeString().split(' ')[0].slice(0, 5),
          date: new Date().toISOString().split('T')[0],
          industryId: assignments.find(a => a.workerId === selectedWorkerId && a.status === 'Active')?.industryId || 'ind-1'
        })
      });

      if (response.ok) {
        setCheckInSuccessMessage(`Check-In Succeeded! ${activeWorker.name} marked Present via secure Aadhaar-OTP.`);
        refreshData();
        setOtpGenerated(null);
        setOtpInput('');
        setTimeout(() => setCheckInSuccessMessage(null), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const simulateFaceScan = () => {
    setIsFaceScanning(true);
    setTimeout(() => {
      setIsFaceScanning(false);
      // Proceed to verify check-in
      const randomSuccess = true;
      if (randomSuccess) {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        fetch('/api/attendance/check-in', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            workerId: selectedWorkerId,
            verificationMethod: 'Biometric-Face',
            checkIn: new Date().toTimeString().split(' ')[0].slice(0, 5),
            date: new Date().toISOString().split('T')[0],
            industryId: assignments.find(a => a.workerId === selectedWorkerId && a.status === 'Active')?.industryId || 'ind-1'
          })
        }).then(response => {
          if (response.ok) {
            setCheckInSuccessMessage(`Check-In Succeeded! ${activeWorker.name} verified via Facial Biometric matching.`);
            refreshData();
            setTimeout(() => setCheckInSuccessMessage(null), 5000);
          }
        }).catch(err => console.error(err));
      }
    }, 2000);
  };

  // Post Inspector Audit
  const handlePostAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const entityName = newAudit.inspectedEntity === 'Industry' 
      ? industries.find(i => i.id === newAudit.entityId)?.name || 'Unknown'
      : contractors.find(c => c.id === newAudit.entityId)?.name || 'Unknown';

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/audit/submit-notice', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          inspectorName: 'Central Labour Commissioner Auditor',
          inspectedEntity: newAudit.inspectedEntity,
          entityId: newAudit.entityId,
          entityName: entityName,
          findings: newAudit.findings,
          status: newAudit.status
        })
      });

      if (response.ok) {
        showNotice('Government compliance notice published to database!', 'success');
        refreshData();
        setIsAuditModalOpen(false);
        setNewAudit({
          inspectedEntity: 'Industry',
          entityId: 'ind-1',
          findings: '',
          status: 'Clean'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reset database state and fetch afresh
  const handleResetState = () => {
    refreshData();
    showNotice('Database tables reloaded successfully from Cloud SQL Postgres!', 'success');
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto py-4">
        {/* Toast Notification Container */}
        {notification && (
          <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between border shadow-xs animate-fadeIn ${
            notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            'bg-indigo-50 border-indigo-200 text-indigo-900'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-sm">🔔</span>
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Top Installer Utility Bar */}
        <div className="flex justify-end px-2">
          <PWAInstallButton />
        </div>

        {/* Brand Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 md:p-5 border border-slate-800 shadow-xl relative overflow-hidden space-y-4">
          {/* Subtle graphic elements */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Row: Logo (Left), ShramikLink (Center), Pill (Right) */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 border-b border-slate-800/30 pb-4">
            
            {/* Logo (Left side) */}
            <div className="flex-1 flex justify-center md:justify-start w-full md:w-auto">
              <div className="relative group w-11 h-11 md:w-13 md:h-13 bg-white p-1 rounded-xl flex items-center justify-center border border-white shadow-md hover:scale-105 transition-transform duration-300">
                <TransparentImage 
                  src={logoUrl} 
                  alt="ShramikLink Official Logo" 
                  className="w-full h-full object-contain"
                  threshold={195}
                />
              </div>
            </div>

            {/* ShramikLink (Center) */}
            <div className="flex-1 flex justify-center text-center">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white select-none">
                <span className="text-orange-500">ShramikLink</span>
              </h2>
            </div>

            {/* Pill (Right side) */}
            <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap shadow-xs">
                <ShieldCheck className="h-3.5 w-3.5 shrink-0" /> Multi-Role Secure Login Gateway
              </div>
            </div>

          </div>

          {/* Subtitle / Description (Centered underneath) */}
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <p className="text-[11px] md:text-xs text-emerald-400/95 font-bold tracking-wide leading-relaxed">
              Double-locking compliance system engineered for Indian Industrial Labor Laws and statutory worker benefits. Please choose your secure role below to login.
            </p>
          </div>
        </div>

        {/* 4 Portal Login Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Industry Admin */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">🏭 Industry Admin Portal</h3>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">Principal Employer Gateway</p>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Factory owners can view live daily biometric attendance logs, audit statutory records, and securely approve contractor bills with full legal lockouts.
              </p>
            </div>
            <div className="space-y-2">
              <button 
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleLogin('industry_admin')}
                className={`w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer ${isLoggingIn ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoggingIn && loginRoleInProgress === 'industry_admin' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <span>Log In as Industry Admin →</span>
                )}
              </button>
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleDemoLogin('industry_admin')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors py-1 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>or Quick Sandbox Demo (without popups)</span>
              </button>
            </div>
          </div>

          {/* Card 2: Labor Contractor */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">🏢 Labor Contractor Portal</h3>
                <p className="text-emerald-600 text-[10px] uppercase font-bold tracking-wider mt-0.5">Licensed Contractor Hub</p>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Contractors can onboard new workers, submit mandatory EPF/ESI challans, and generate double-locked bills with cryptographic legal compliance.
              </p>
            </div>
            <div className="space-y-2">
              <button 
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleLogin('contractor')}
                className={`w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer ${isLoggingIn ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoggingIn && loginRoleInProgress === 'contractor' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <span>Log In as Labor Contractor →</span>
                )}
              </button>
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleDemoLogin('contractor')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors py-1 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>or Quick Sandbox Demo (without popups)</span>
              </button>
            </div>
          </div>

          {/* Card 3: Contract Worker */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <UserCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">👷 Contract Worker Hub</h3>
                <p className="text-indigo-600 text-[10px] uppercase font-bold tracking-wider mt-0.5">Verified Labour Workspace</p>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Workers can verify identity via Aadhaar biometric gate simulators, validate secure OTPs, and access personal daily attendance cards.
              </p>
            </div>
            <div className="space-y-2">
              <button 
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleLogin('worker')}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer ${isLoggingIn ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoggingIn && loginRoleInProgress === 'worker' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <span>Log In as Contract Worker →</span>
                )}
              </button>
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleDemoLogin('worker')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-indigo-700 transition-colors py-1 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>or Quick Sandbox Demo (without popups)</span>
              </button>
            </div>
          </div>

          {/* Card 4: Government Inspector */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-950 text-base">⚖️ Government Labour Inspector</h3>
                <p className="text-rose-600 text-[10px] uppercase font-bold tracking-wider mt-0.5">Independent Regulatory Audit</p>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">
                Labor inspectors can review mandatory CLRA forms, audit minimum wage payouts, verify statutory challans, and issue digital compliance warnings.
              </p>
            </div>
            <div className="space-y-2">
              <button 
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleLogin('government_inspector')}
                className={`w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-2xl text-xs font-bold tracking-wide transition-all shadow-xs hover:shadow-sm flex items-center justify-center gap-2 cursor-pointer ${isLoggingIn ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoggingIn && loginRoleInProgress === 'government_inspector' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Connecting with Google...</span>
                  </>
                ) : (
                  <span>Log In as Labor Inspector →</span>
                )}
              </button>
              <button
                type="button"
                disabled={isLoggingIn}
                onClick={() => handleDemoLogin('government_inspector')}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-rose-700 transition-colors py-1 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>or Quick Sandbox Demo (without popups)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Welcome Hero Panel */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-sm space-y-4">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase block">Active Product Simulator</span>
            <h2 className="text-xl font-black tracking-tight leading-tight md:text-2xl">
              Indian Industrial Labor Compliance Ecosystem
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Welcome to the multi-vendor sandbox preview. Experience the entire compliance lifecycle: register workers under licensed contractors, deploy them dynamically to manufacturing factories, verify check-ins via biometrics, and review bills protected by statutory proof lockers.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 text-xs font-mono">
            <div className="border border-slate-800 bg-slate-900/60 p-3 rounded-xl text-slate-200">
              <span className="text-emerald-400 block mb-0.5 text-[10px] font-bold">Statutory Standard</span>
              CLRA Act 1970 Sec 21
            </div>
            <div className="border border-slate-800 bg-slate-900/60 p-3 rounded-xl text-slate-200">
              <span className="text-emerald-400 block mb-0.5 text-[10px] font-bold">Biometric Gate</span>
              UIDAI Secure Match
            </div>
            <div className="border border-slate-800 bg-slate-900/60 p-3 rounded-xl text-slate-200">
              <span className="text-emerald-400 block mb-0.5 text-[10px] font-bold">Billing Policy</span>
              Double-Locked Challans
            </div>
            <div className="border border-slate-800 bg-slate-900/60 p-3 rounded-xl text-slate-200">
              <span className="text-emerald-400 block mb-0.5 text-[10px] font-bold">SaaS Pricing</span>
              ₹1 Worker/Day Micro-fee
            </div>
          </div>
        </div>

        {/* Demo Guidelines banner */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-5 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚙️</span>
            <span><strong>Sandbox Note:</strong> Real role isolation is enabled. Once logged in, the entire interface locks down to that specific role. You can log out anytime to return to this screen.</span>
          </div>
          <button 
            onClick={() => {
              if (confirm('Restore default mock data?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="text-slate-500 hover:text-rose-600 font-bold flex items-center gap-1.5 px-3 py-1 border border-slate-300 rounded-lg hover:border-rose-300 transition-colors shrink-0"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Restore Sandbox Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Dynamic Integrated Organization & Status Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Active Organization Tenant</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                Compliance Locked 🔓
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Dharma Manufacturing Hub</h2>
            <p className="text-xs text-slate-500">Standard registered principal employer factory under MH CLRA rules.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs text-slate-600 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            ₹1/Worker/Day Micro-fee: Active
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Operator</span>
              <span className="text-xs font-bold text-slate-700">Administrator</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-sm font-black font-mono shadow-sm">
              AD
            </div>
          </div>
        </div>
      </div>
      
      {/* Role Gate Bar (Bento-style Header Card) */}
      <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl shadow-sm border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative group w-11 h-11 bg-slate-950/20 p-0.5 rounded-xl text-slate-950 flex items-center justify-center shrink-0 border border-slate-800">
            <TransparentImage 
              src={logoUrl} 
              alt="ShramikLink Logo" 
              className="w-full h-full object-contain"
              threshold={195}
            />
            {currentRole === 'industry_admin' && (
              <a 
                href={logoUrl} 
                download="shramiklink_logo.png" 
                className="absolute -bottom-1 -right-1 bg-slate-900 text-emerald-400 hover:text-emerald-300 p-0.5 rounded-md border border-slate-800 shadow-md cursor-pointer hover:scale-105 transition-all flex items-center justify-center"
                title="Download Logo"
              >
                <Download className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
              🔒 SECURE CLRA SESSION: ACTIVE 
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                {currentRole === 'industry_admin' ? 'Industry Principal Employer' :
                 currentRole === 'contractor' ? 'Licensed Labor Contractor' :
                 currentRole === 'worker' ? 'Verified Contract Worker' :
                 'Government Labor Inspector'}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {currentRole === 'industry_admin' && 'Managing Dharma Manufacturing Hub, approving bills, and viewing biometric logs.'}
              {currentRole === 'contractor' && 'Managing labor supply, EPF/ESI statutory submissions, and billing.'}
              {currentRole === 'worker' && 'Accessing personalized shift registers and biometric check-in gates.'}
              {currentRole === 'government_inspector' && 'Auditing statutory CLRA compliance records, minimum wage audits, and compliance notices.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <PWAInstallButton />

          <button 
            onClick={handleResetState}
            title="Restore original data"
            className="text-xs text-slate-400 hover:text-rose-400 font-bold px-2.5 py-1.5 border border-slate-800 hover:border-rose-900 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset Demo
          </button>
          
          <button 
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log Out Securely
          </button>
        </div>
      </div>

      {/* Toast Notification Container */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between border shadow-xs animate-fadeIn ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          notification.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
          'bg-indigo-50 border-indigo-200 text-indigo-900'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-sm">🔔</span>
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main SaaS Screen */}
      <div className="space-y-6">
        
        {/* ==================== 1. INDUSTRY ADMIN DASHBOARD ==================== */}
        {currentRole === 'industry_admin' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Selector & Meta */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Inspecting Industry Tenant</label>
                <select 
                  value={selectedIndustryId} 
                  onChange={(e) => setSelectedIndustryId(e.target.value)}
                  className="font-bold text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-colors"
                >
                  {industries.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.name} ({ind.location})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs w-full md:w-auto">
                <div className="bg-slate-50 p-3 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block mb-0.5 font-semibold text-[10px] uppercase">Factory License No</span>
                  <span className="font-mono font-bold text-slate-700">{activeIndustry.regNo}</span>
                </div>
                <div className="bg-slate-50 p-3 border border-slate-100 rounded-xl">
                  <span className="text-slate-400 block mb-0.5 font-semibold text-[10px] uppercase">Labour ID (LIN)</span>
                  <span className="font-mono font-bold text-slate-700">{activeIndustry.lin}</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics (Bento Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Active Deployed Workers</span>
                <span className="text-3xl font-black text-slate-900 mt-2 block">
                  {assignments.filter(a => a.industryId === selectedIndustryId && a.status === 'Active').length}
                </span>
                <span className="text-[11px] text-slate-500 block mt-2">Across verified contractors</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Open Labor Requisitions</span>
                <span className="text-3xl font-black text-emerald-600 mt-2 block">
                  {requirements.filter(r => r.industryId === selectedIndustryId && r.status === 'Open').length}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium block mt-2">Awaiting contractor dispatch</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Submitted Bills for Review</span>
                <span className="text-3xl font-black text-amber-600 mt-2 block">
                  {bills.filter(b => b.industryId === selectedIndustryId && b.status === 'Submitted').length}
                </span>
                <span className="text-[11px] text-amber-600 font-semibold block mt-2">Double-locked compliance check</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Attendance Log (Today)</span>
                <span className="text-3xl font-black text-slate-800 mt-2 block">
                  {attendance.filter(a => a.industryId === selectedIndustryId && a.date === new Date().toISOString().split('T')[0]).length} Present
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-2">100% Secure UIDAI Audited</span>
              </div>
            </div>

            {/* Action Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Daily Requirements Posting */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Plus className="text-indigo-600 h-4 w-4" />
                    Labor Requisitions
                  </h4>
                  <button 
                    onClick={() => setIsRequirementModalOpen(true)}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-2.5 py-1.5 rounded transition-all"
                  >
                    Post Requirement
                  </button>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto">
                  {requirements.filter(r => r.industryId === selectedIndustryId).length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      No daily requirements posted yet.
                    </div>
                  ) : (
                    requirements.filter(r => r.industryId === selectedIndustryId).map(req => (
                      <div key={req.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-indigo-50 text-indigo-800 font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                            {req.skillType}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            req.status === 'Open' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex justify-between">
                          <span>Required: <strong className="text-slate-800 font-bold">{req.workersNeeded} Workers</strong></span>
                          <span>Shift: <strong className="text-slate-700 font-medium">{req.shiftTiming.split(' ')[0]}</strong></span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Target Contractor: {contractors.find(c => c.id === req.contractorId)?.name || 'General Pool'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Monthly Invoices Compliance Locking Verification */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <Lock className="text-indigo-600 h-4 w-4" />
                  Statutory Bill Verification Engine
                </h4>

                <div className="space-y-4">
                  {bills.filter(b => b.industryId === selectedIndustryId).length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No invoices submitted for compliance inspection.
                    </div>
                  ) : (
                    bills.filter(b => b.industryId === selectedIndustryId).map(bill => {
                      const contractorName = contractors.find(c => c.id === bill.contractorId)?.name || 'Contractor';
                      const compliance = checkContractorCompliance(bill.contractorId, 'July 2026');

                      return (
                        <div key={bill.id} className="border border-slate-200 rounded-lg overflow-hidden">
                          {/* Invoice Header */}
                          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
                            <div>
                              <span className="font-bold text-slate-800 text-xs">{contractorName}</span>
                              <span className="text-[10px] text-slate-400 ml-2">Month: {bill.month}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              bill.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                              bill.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                              'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}>
                              {bill.status}
                            </span>
                          </div>

                          {/* Invoice details and Compliance locking checks */}
                          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Billing Dues</span>
                              <span className="text-sm font-extrabold text-slate-800">₹{bill.totalAmount.toLocaleString()}</span>
                              <span className="text-[10px] text-slate-400 block">(Base: ₹{bill.baseAmount.toLocaleString()} + GST: 18%)</span>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pre-Month Challans (July)</span>
                              <div className="flex gap-1.5 flex-wrap">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${compliance.hasEPF ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                                  {compliance.hasEPF ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />} EPF
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${compliance.hasESI ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                                  {compliance.hasESI ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />} ESI
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${compliance.hasGST ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                                  {compliance.hasGST ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />} GST
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2">
                              {bill.status === 'Submitted' && (
                                <>
                                  <button 
                                    onClick={() => {
                                      // Simulated PDF inspection modal trigger
                                      setActiveDocUrl(`COMPLIANCE_PROOF_DOSSIER_${bill.id}.pdf`);
                                    }}
                                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-2.5 py-1.5 rounded transition-all flex items-center gap-1"
                                  >
                                    <Eye className="h-3.5 w-3.5" /> Inspect
                                  </button>
                                  <button 
                                    onClick={() => handleAuditBill(bill.id, 'Approve')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1.5 rounded transition-all"
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    onClick={() => handleAuditBill(bill.id, 'Reject')}
                                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-2.5 py-1.5 rounded transition-all"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {bill.status !== 'Submitted' && (
                                <div className="text-[11px] text-slate-500 italic">
                                  Audited: {bill.reviewedAt || 'N/A'} <br />
                                  <span className="text-slate-400 font-normal">Remarks: {bill.remarks}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

            {/* Daily Shift Attendance & Overtime Tracker */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Clock className="text-indigo-600 h-4 w-4" />
                Shift Attendance & Overtime Timekeeper
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Worker Name</th>
                      <th className="p-3">Check-In</th>
                      <th className="p-3">Check-Out</th>
                      <th className="p-3">UIDAI Verif.</th>
                      <th className="p-3 text-center">Regular (8h)</th>
                      <th className="p-3 text-center">Overtime Hours</th>
                      <th className="p-3">Contractor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendance.filter(att => att.industryId === selectedIndustryId).map(att => {
                      const cName = contractors.find(c => c.id === att.contractorId)?.name || 'Contractor';
                      return (
                        <tr key={att.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-medium text-slate-700">{att.date}</td>
                          <td className="p-3 font-semibold text-slate-800">{att.workerName}</td>
                          <td className="p-3 font-mono">{att.checkIn}</td>
                          <td className="p-3 font-mono">{att.checkOut || <span className="text-amber-500 font-bold">On-Duty</span>}</td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                              Verified ({att.verificationMethod})
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-700">{att.checkOut ? '8.00 hrs' : '--'}</td>
                          <td className="p-3 text-center">
                            {att.overtimeHours > 0 ? (
                              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                                +{att.overtimeHours} hrs (OT)
                              </span>
                            ) : (
                              <span className="text-slate-400">0.00</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500 max-w-[150px] truncate">{cName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Post Requisition Modal */}
            {isRequirementModalOpen && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800">Post Labor Requisition</h3>
                    <button onClick={() => setIsRequirementModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handlePostRequirement} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Required Skill Category</label>
                      <select 
                        value={newReq.skillType} 
                        onChange={(e) => setNewReq(prev => ({ ...prev, skillType: e.target.value as any }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none"
                      >
                        <option value="Unskilled">Unskilled (₹480/day)</option>
                        <option value="Semi-Skilled">Semi-Skilled (₹550/day)</option>
                        <option value="Skilled">Skilled (₹650/day)</option>
                        <option value="Highly-Skilled">Highly-Skilled (₹850/day)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Worker Count Needed</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="100"
                        value={newReq.workersNeeded}
                        onChange={(e) => setNewReq(prev => ({ ...prev, workersNeeded: Number(e.target.value) }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none" 
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Shift Timing</label>
                      <select 
                        value={newReq.shiftTiming}
                        onChange={(e) => setNewReq(prev => ({ ...prev, shiftTiming: e.target.value }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none"
                      >
                        <option value="General (09:00 - 17:00)">General (09:00 - 17:00)</option>
                        <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                        <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                        <option value="Shift C (22:00 - 06:00)">Shift C (22:00 - 06:00)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Target Contractor Agency</label>
                      <select 
                        value={newReq.contractorId}
                        onChange={(e) => setNewReq(prev => ({ ...prev, contractorId: e.target.value }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none"
                      >
                        {contractors.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setIsRequirementModalOpen(false)}
                        className="border border-slate-200 px-4 py-2 rounded text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
                      >
                        Post Requisition
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. CONTRACTOR DASHBOARD ==================== */}
        {currentRole === 'contractor' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Selector & Meta */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-200/60 p-5 rounded-lg">
              <div>
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Contractor Business Account</label>
                <select 
                  value={selectedContractorId} 
                  onChange={(e) => setSelectedContractorId(e.target.value)}
                  className="font-bold text-slate-800 text-lg bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-500"
                >
                  {contractors.map(con => (
                    <option key={con.id} value={con.id}>{con.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="bg-white p-3 border border-slate-100 rounded">
                  <span className="text-slate-400 block mb-0.5">CLRA License No</span>
                  <span className="font-mono font-bold text-slate-700">{activeContractor.licenseNo}</span>
                </div>
                <div className="bg-white p-3 border border-slate-100 rounded">
                  <span className="text-slate-400 block mb-0.5">EPF Code</span>
                  <span className="font-mono font-bold text-slate-700">{activeContractor.epfCode}</span>
                </div>
                <div className="bg-white p-3 border border-slate-100 rounded">
                  <span className="text-slate-400 block mb-0.5">ESI Registration</span>
                  <span className="font-mono font-bold text-slate-700">{activeContractor.esiCode}</span>
                </div>
                <div className="bg-white p-3 border border-slate-100 rounded">
                  <span className="text-slate-400 block mb-0.5">Agency Rating</span>
                  <span className="font-semibold text-amber-600 flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {activeContractor.rating}</span>
                </div>
              </div>
            </div>

            {/* CRUCIAL FEATURE: MULTI-INDUSTRY LIVE TRACKING & DEPLOYMENT MODULE */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Users className="text-indigo-600 h-5 w-5" />
                    Multi-Industry Deployment Board
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Track, deploy, and recall your contract workforce across multiple manufacturing industries in real time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* 1. Worker Pool: Idle/Available */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                  <div className="font-bold text-xs text-slate-500 uppercase tracking-wider flex justify-between items-center">
                    <span>🟢 Idle Workers Pool</span>
                    <span className="bg-slate-200 text-slate-700 rounded-full px-2 py-0.5 text-[10px]">
                      {workers.filter(w => w.contractorId === selectedContractorId && w.status === 'Available').length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto">
                    {workers.filter(w => w.contractorId === selectedContractorId && w.status === 'Available').length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        No idle workers available. All deployed!
                      </div>
                    ) : (
                      workers.filter(w => w.contractorId === selectedContractorId && w.status === 'Available').map(wrk => (
                        <div key={wrk.id} className="bg-white border border-slate-150 p-3 rounded shadow-2xs space-y-2">
                          <div>
                            <span className="font-semibold text-slate-800 text-xs block">{wrk.name}</span>
                            <span className="text-[10px] text-slate-400">Daily: ₹{wrk.dailyWageRate} | {wrk.skillType}</span>
                          </div>
                          
                          {deployingWorkerId === wrk.id ? (
                            <div className="space-y-2 border-t border-slate-100 pt-2 text-[11px]">
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-1">Target Factory</label>
                                <select 
                                  value={deploymentIndustryId}
                                  onChange={(e) => setDeploymentIndustryId(e.target.value)}
                                  className="w-full border border-slate-200 p-1 rounded"
                                >
                                  {industries.map(ind => (
                                    <option key={ind.id} value={ind.id}>{ind.name.split(' ')[0]} ({ind.location.split(',')[0]})</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-1">Shift Timing</label>
                                <select 
                                  value={deploymentShift}
                                  onChange={(e) => setDeploymentShift(e.target.value)}
                                  className="w-full border border-slate-200 p-1 rounded"
                                >
                                  <option value="General (09:00 - 17:00)">General (09:00 - 17:00)</option>
                                  <option value="Shift A (06:00 - 14:00)">Shift A (06:00 - 14:00)</option>
                                  <option value="Shift B (14:00 - 22:00)">Shift B (14:00 - 22:00)</option>
                                  <option value="Shift C (22:00 - 06:00)">Shift C (22:00 - 06:00)</option>
                                </select>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => setDeployingWorkerId(null)} className="text-slate-400 font-bold text-[10px] uppercase hover:text-slate-600">Cancel</button>
                                <button onClick={() => handleDeployWorker(wrk.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase px-2 py-1 rounded">Confirm</button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setDeployingWorkerId(wrk.id);
                                setDeploymentIndustryId(industries[0].id);
                              }}
                              className="w-full bg-slate-900 hover:bg-indigo-700 text-white text-[10px] font-bold py-1 px-2 rounded tracking-wide uppercase transition-colors"
                            >
                              Deploy Worker
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Deployed: Tata Motors */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                  <div className="font-bold text-xs text-indigo-700 uppercase tracking-wider flex justify-between items-center">
                    <span>🏭 Tata Motors Pune</span>
                    <span className="bg-indigo-100 text-indigo-700 rounded-full px-2 py-0.5 text-[10px]">
                      {assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-1' && a.status === 'Active').length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto">
                    {assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-1' && a.status === 'Active').length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        No workers active here.
                      </div>
                    ) : (
                      assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-1' && a.status === 'Active').map(asg => {
                        const wrkObj = workers.find(w => w.id === asg.workerId);
                        if (!wrkObj) return null;
                        return (
                          <div key={asg.id} className="bg-white border border-slate-150 p-3 rounded shadow-2xs space-y-2">
                            <div>
                              <span className="font-semibold text-slate-800 text-xs block">{wrkObj.name}</span>
                              <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Shift: {asg.shiftTiming.split(' ')[0]}</span>
                              <span className="text-[10px] text-slate-400">Wage: ₹{wrkObj.dailyWageRate}/day</span>
                            </div>
                            <button 
                              onClick={() => handleRecallWorker(asg.id)}
                              className="w-full text-center text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 text-[10px] font-bold py-1 px-2 rounded uppercase transition-all"
                            >
                              Recall Worker
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 3. Deployed: JSW Steel */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                  <div className="font-bold text-xs text-amber-700 uppercase tracking-wider flex justify-between items-center">
                    <span>🏭 JSW Steel Bellary</span>
                    <span className="bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 text-[10px]">
                      {assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-2' && a.status === 'Active').length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto">
                    {assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-2' && a.status === 'Active').length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        No workers active here.
                      </div>
                    ) : (
                      assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-2' && a.status === 'Active').map(asg => {
                        const wrkObj = workers.find(w => w.id === asg.workerId);
                        if (!wrkObj) return null;
                        return (
                          <div key={asg.id} className="bg-white border border-slate-150 p-3 rounded shadow-2xs space-y-2">
                            <div>
                              <span className="font-semibold text-slate-800 text-xs block">{wrkObj.name}</span>
                              <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Shift: {asg.shiftTiming.split(' ')[0]}</span>
                              <span className="text-[10px] text-slate-400">Wage: ₹{wrkObj.dailyWageRate}/day</span>
                            </div>
                            <button 
                              onClick={() => handleRecallWorker(asg.id)}
                              className="w-full text-center text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 text-[10px] font-bold py-1 px-2 rounded uppercase transition-all"
                            >
                              Recall Worker
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* 4. Deployed: Serum Institute */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                  <div className="font-bold text-xs text-emerald-700 uppercase tracking-wider flex justify-between items-center">
                    <span>🏭 Serum Institute</span>
                    <span className="bg-emerald-100 text-emerald-700 rounded-full px-2 py-0.5 text-[10px]">
                      {assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-3' && a.status === 'Active').length}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto">
                    {assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-3' && a.status === 'Active').length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs italic">
                        No workers active here.
                      </div>
                    ) : (
                      assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === 'ind-3' && a.status === 'Active').map(asg => {
                        const wrkObj = workers.find(w => w.id === asg.workerId);
                        if (!wrkObj) return null;
                        return (
                          <div key={asg.id} className="bg-white border border-slate-150 p-3 rounded shadow-2xs space-y-2">
                            <div>
                              <span className="font-semibold text-slate-800 text-xs block">{wrkObj.name}</span>
                              <span className="text-[10px] text-slate-500 block font-medium mt-0.5">Shift: {asg.shiftTiming.split(' ')[0]}</span>
                              <span className="text-[10px] text-slate-400">Wage: ₹{wrkObj.dailyWageRate}/day</span>
                            </div>
                            <button 
                              onClick={() => handleRecallWorker(asg.id)}
                              className="w-full text-center text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 text-[10px] font-bold py-1 px-2 rounded uppercase transition-all"
                            >
                              Recall Worker
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* MANDATORY STATUTORY BILL-LOCKING SYSTEM PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Compliance-Locked Invoice Generation */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Lock className="text-indigo-600 h-5 w-5" />
                    Compliance-Locked Billing Engine
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Statutory laws mandate that prior month's EPF, ESI, and GST returns must be verified before submitting current claims.
                  </p>
                </div>

                {/* Compliance State Check */}
                {(() => {
                  const compliance = checkContractorCompliance(selectedContractorId, 'July 2026');
                  
                  if (!compliance.compliant) {
                    return (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 space-y-4">
                        <div className="flex gap-3">
                          <AlertTriangle className="h-6 w-6 text-rose-600 shrink-0" />
                          <div>
                            <span className="font-bold text-rose-900 text-sm block">🔒 Billing Generation Locked!</span>
                            <p className="text-rose-700 text-xs mt-1 leading-relaxed">
                              Your account is suspended from generating bills for August 2026 due to unverified previous month (July 2026) statutory compliance challans.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
                          <div className={`p-2.5 rounded text-center border ${compliance.hasEPF ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-100 border-rose-200 text-rose-800'}`}>
                            EPF: {compliance.hasEPF ? 'Verified' : 'Pending'}
                          </div>
                          <div className={`p-2.5 rounded text-center border ${compliance.hasESI ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-100 border-rose-200 text-rose-800'}`}>
                            ESI: {compliance.hasESI ? 'Verified' : 'Pending'}
                          </div>
                          <div className={`p-2.5 rounded text-center border ${compliance.hasGST ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-100 border-rose-200 text-rose-800'}`}>
                            GST: {compliance.hasGST ? 'Verified' : 'Pending'}
                          </div>
                        </div>

                        {selectedContractorId === 'con-3' && (
                          <div className="pt-2">
                            <button 
                              onClick={handleUploadMissingChallan}
                              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
                            >
                              <Upload className="h-4 w-4" /> Upload Missing GSTR-3B Challan & Unlock
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-4 text-xs flex gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                        <div>
                          <strong className="block font-bold">✓ Statutory Compliance Unlocked</strong>
                          <span className="block mt-0.5 text-emerald-800">Verified previous month payment records for EPF, ESI, and GST GSTR-3B. Your billing access is active.</span>
                        </div>
                      </div>

                      <form onSubmit={handleSubmitBill} className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Target Manufacturing Client</label>
                            <select 
                              value={billTargetIndustry}
                              onChange={(e) => setBillTargetIndustry(e.target.value)}
                              className="w-full border border-slate-200 p-2 rounded outline-none"
                            >
                              {industries.map(ind => (
                                <option key={ind.id} value={ind.id}>{ind.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Billing Month</label>
                            <input 
                              type="text" 
                              value={billMonth} 
                              disabled 
                              className="w-full border border-slate-200 p-2 rounded bg-slate-50 text-slate-400 outline-none" 
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Worker Wage Component (INR)</label>
                            <input 
                              type="number" 
                              value={billBaseWage}
                              onChange={(e) => setBillBaseWage(Number(e.target.value))}
                              className="w-full border border-slate-200 p-2 rounded outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-slate-500 font-semibold mb-1">Contractor Service Charge (INR)</label>
                            <input 
                              type="number" 
                              value={billServiceCharge}
                              onChange={(e) => setBillServiceCharge(Number(e.target.value))}
                              className="w-full border border-slate-200 p-2 rounded outline-none" 
                            />
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5 font-semibold text-slate-700">
                          <div className="flex justify-between"><span>Base + Service Charge:</span> <span>₹{(billBaseWage + billServiceCharge).toLocaleString()}</span></div>
                          <div className="flex justify-between text-slate-500"><span>Statutory GST (18%):</span> <span>₹{((billBaseWage + billServiceCharge) * 0.18).toLocaleString()}</span></div>
                          <div className="flex justify-between border-t border-slate-200 pt-1.5 text-indigo-900 font-bold"><span>Grand Total Claim:</span> <span>₹{((billBaseWage + billServiceCharge) * 1.18).toLocaleString()}</span></div>
                        </div>

                        <button 
                          type="submit" 
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded"
                        >
                          Generate & Submit Bill
                        </button>
                      </form>
                    </div>
                  );
                })()}
              </div>

              {/* Uploaded Documents Tracker */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-1.5">
                  <FileText className="text-indigo-600 h-5 w-5" />
                  Statutory Records & Challans Archive
                </h3>

                <div className="space-y-3">
                  {complianceDocs.filter(d => d.contractorId === selectedContractorId).map(doc => (
                    <div key={doc.id} className="border border-slate-100 p-3.5 rounded-lg flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded text-slate-700">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-800 block">{doc.docType} ({doc.month})</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{doc.fileUrl} | Uploaded: {doc.uploadedAt}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {doc.status}
                        </span>
                        <button 
                          onClick={() => setActiveDocUrl(doc.fileUrl)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold text-[10px] uppercase block mt-1 transition-all"
                        >
                          View Challan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Contractor Payroll Register Sheets */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <FileSpreadsheet className="text-indigo-600 h-4 w-4" />
                Contract Wages & EPF/ESI Compliant Payroll Sheets
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Worker Name</th>
                      <th className="p-3">Skill Category</th>
                      <th className="p-3">Daily Wage Rate</th>
                      <th className="p-3 text-center">Days Present</th>
                      <th className="p-3 text-center">OT Hours</th>
                      <th className="p-3 text-right">Gross Wage Earned</th>
                      <th className="p-3 text-right">EPF Contrib (12%)</th>
                      <th className="p-3 text-right">ESI Contrib (0.75%)</th>
                      <th className="p-3 text-right">Net Take-Home Pay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workers.filter(w => w.contractorId === selectedContractorId).map(wrk => {
                      // Calculate days present from attendance
                      const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                      const daysPresent = wrkAttendance.length;
                      const otHours = wrkAttendance.reduce((acc, curr) => acc + curr.overtimeHours, 0);
                      
                      // Wage calculation under Indian Minimum Wage Standards
                      const baseWage = daysPresent * wrk.dailyWageRate;
                      const otPay = otHours * (wrk.dailyWageRate / 8) * 2; // OT is calculated at double rate under Factories Act
                      const grossWage = baseWage + otPay;
                      const epf = grossWage * 0.12;
                      const esi = grossWage * 0.0075;
                      const netPay = grossWage - epf - esi;

                      return (
                        <tr key={wrk.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-800">{wrk.name}</td>
                          <td className="p-3 text-slate-500">{wrk.skillType}</td>
                          <td className="p-3 font-mono">₹{wrk.dailyWageRate}</td>
                          <td className="p-3 text-center font-bold text-slate-700">{daysPresent}</td>
                          <td className="p-3 text-center">
                            {otHours > 0 ? (
                              <span className="bg-amber-50 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                {otHours} hrs
                              </span>
                            ) : '--'}
                          </td>
                          <td className="p-3 text-right font-bold text-slate-700">₹{Math.round(grossWage).toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-500">-₹{Math.round(epf).toLocaleString()}</td>
                          <td className="p-3 text-right text-slate-500">-₹{Math.round(esi).toLocaleString()}</td>
                          <td className="p-3 text-right font-extrabold text-emerald-700">₹{Math.round(netPay).toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 3. CONTRACT WORKER PORTAL ==================== */}
        {currentRole === 'worker' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Selector & Privacy Warning */}
            <div className="bg-slate-900 rounded-xl p-6 text-white grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-2">
                <span className="text-xs bg-indigo-500 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Worker Secure Portal (Indian Contract Labour Registry)
                </span>
                
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Select Registered Labor Identity</label>
                  <select 
                    value={selectedWorkerId}
                    onChange={(e) => {
                      setSelectedWorkerId(e.target.value);
                      setOtpGenerated(null);
                      setOtpInput('');
                    }}
                    className="font-bold text-white text-lg bg-slate-800 border border-slate-700 rounded px-3 py-1.5 outline-none focus:border-indigo-500 w-full"
                  >
                    {workers.map(w => (
                      <option key={w.id} value={w.id} className="text-slate-800">{w.name} ({w.skillType})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* WORKER PRIVACY RULE BANNER */}
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <ShieldCheck className="h-4 w-4" /> 
                  Worker Privacy Shield Active
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Compliance standards block direct factory brand identities. To protect vendor agreements and secure business, direct factory names are encrypted on worker dashboards.
                </p>
                <div className="font-mono text-[10px] text-indigo-400 mt-2">
                  🔒 DEPLOYED STATE: SECURE_CLIENT_ID_CODENAME_X902
                </div>
              </div>
            </div>

            {/* Interactive Attendance Check-In Simulation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <UserCheck className="text-indigo-600 h-5 w-5" />
                    Daily Attendance check-In Simulator
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mark present and log standard working hours (8 hrs) vs. overtime on-shift with secure UIDAI Aadhaar biometric authorization.
                  </p>
                </div>

                {checkInSuccessMessage && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-lg text-xs font-bold flex gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    {checkInSuccessMessage}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <label className="flex-1 border border-slate-200 p-3.5 rounded-lg flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input 
                        type="radio" 
                        name="verif" 
                        checked={verificationMethod === 'Aadhaar-OTP'}
                        onChange={() => setVerificationMethod('Aadhaar-OTP')}
                        className="text-indigo-600"
                      />
                      <div className="text-xs">
                        <strong className="block text-slate-800">Aadhaar OTP</strong>
                        <span className="text-slate-400 text-[10px]">Secure UIDAI SMS Pin</span>
                      </div>
                    </label>
                    
                    <label className="flex-1 border border-slate-200 p-3.5 rounded-lg flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 transition-colors">
                      <input 
                        type="radio" 
                        name="verif" 
                        checked={verificationMethod === 'Biometric-Face'}
                        onChange={() => setVerificationMethod('Biometric-Face')}
                        className="text-indigo-600"
                      />
                      <div className="text-xs">
                        <strong className="block text-slate-800">Facial Scan</strong>
                        <span className="text-slate-400 text-[10px]">Biometric Matching</span>
                      </div>
                    </label>
                  </div>

                  {/* Aadhaar OTP flow */}
                  {verificationMethod === 'Aadhaar-OTP' && (
                    <div className="space-y-3 bg-slate-50 p-4 border border-slate-100 rounded-lg text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-semibold">Masked Aadhaar Number</span>
                        <span className="font-mono font-bold text-slate-800">{activeWorker.aadhaarHash}</span>
                      </div>

                      {otpGenerated ? (
                        <div className="space-y-2">
                          <label className="block text-slate-600 font-bold mb-1">Enter 4-Digit OTP sent to {activeWorker.phone}</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              maxLength={4}
                              placeholder="e.g. 8092"
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              className="border border-slate-300 p-2 rounded text-base font-mono w-24 text-center outline-none focus:border-indigo-500"
                            />
                            <button 
                              onClick={verifyWorkerCheckIn}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded"
                            >
                              Verify OTP & Check In
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={triggerOtpGeneration}
                          className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-2 rounded transition-colors"
                        >
                          Send OTP Check-In Request
                        </button>
                      )}
                    </div>
                  )}

                  {/* Biometric flow */}
                  {verificationMethod === 'Biometric-Face' && (
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg text-center space-y-3 text-xs">
                      {isFaceScanning ? (
                        <div className="space-y-2 py-4">
                          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <span className="block font-bold text-indigo-700 animate-pulse">Scanning Camera Feed & Matching with UIDAI...</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="border border-slate-300 border-dashed rounded-lg py-8 bg-white max-w-xs mx-auto text-slate-400 font-semibold flex flex-col items-center justify-center gap-2">
                            <UserCheck className="h-8 w-8 text-slate-300 animate-bounce" />
                            [Webcam Face Match Sandbox]
                          </div>
                          <button 
                            onClick={simulateFaceScan}
                            className="bg-slate-950 hover:bg-slate-800 text-white font-bold py-2 px-6 rounded transition-colors"
                          >
                            Trigger Face Biometric Check-In
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* PUBLIC CONTRACTOR DIRECTORY FOR IDLE WORKERS */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Building2 className="text-indigo-600 h-5 w-5" />
                    Public Contractor Directory
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Idle or self-registered workers can connect with verified licensed contractors directly for instant industrial factory work.
                  </p>
                </div>

                <div className="space-y-4">
                  {contractors.map(c => (
                    <div key={c.id} className="border border-slate-150 rounded-lg p-4 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                      <div className="space-y-1">
                        <span className="font-bold text-xs text-slate-800 block">{c.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                          <span>LIC: {c.licenseNo.split('-')[1]}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-amber-600 font-bold"><Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {c.rating}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a 
                          href={`tel:${c.contactNo}`} 
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs p-2 rounded transition-all flex items-center gap-1"
                        >
                          <PhoneCall className="h-3.5 w-3.5" /> Call Agency
                        </a>
                        <button 
                          onClick={() => {
                            // Map the worker to this contractor!
                            setWorkers(prev => prev.map(w => w.id === selectedWorkerId ? { ...w, contractorId: c.id } : w));
                            showNotice(`Applied and mapped successfully to CLRA Contractor: ${c.name}`, 'success');
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-2 rounded transition-all"
                        >
                          Join Agency
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Public Worker Registration Form (Self-Registration ecosystem) */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-xl mx-auto space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-1.5">
                <Plus className="text-indigo-600 h-4 w-4" />
                New Worker Compliance Self-Registration
              </h4>

              {newWorkerSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-lg text-xs font-bold flex gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  Self-registration complete! Worker is successfully mapped to Selected Contractor and UIDAI authenticated.
                </div>
              )}

              <form onSubmit={handleRegisterWorker} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Worker Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ramesh Pujari"
                      value={newWorkerName}
                      onChange={(e) => setNewWorkerName(e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded outline-none" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Mobile Contact No</label>
                    <input 
                      type="tel" 
                      placeholder="+91 XXXXX XXXXX"
                      value={newWorkerPhone}
                      onChange={(e) => setNewWorkerPhone(e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded outline-none" 
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">12-Digit Aadhaar ID (UIDAI OTP verification)</label>
                    <input 
                      type="text" 
                      maxLength={12}
                      placeholder="XXXX-XXXX-XXXX"
                      value={newWorkerAadhaar}
                      onChange={(e) => setNewWorkerAadhaar(e.target.value)}
                      className="w-full border border-slate-200 p-2 rounded outline-none font-mono" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">Skill Category Mapping</label>
                    <select 
                      value={newWorkerSkill}
                      onChange={(e) => setNewWorkerSkill(e.target.value as any)}
                      className="w-full border border-slate-200 p-2 rounded outline-none"
                    >
                      <option value="Unskilled">Unskilled (Basic Manual Labour)</option>
                      <option value="Semi-Skilled">Semi-Skilled (Helper / Packer)</option>
                      <option value="Skilled">Skilled (Machine Op / Fitter)</option>
                      <option value="Highly-Skilled">Highly-Skilled (Supervisor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Assign to Independent Contractor (CLRA Compliant)</label>
                  <select 
                    value={newWorkerContractor}
                    onChange={(e) => setNewWorkerContractor(e.target.value)}
                    className="w-full border border-slate-200 p-2 rounded outline-none"
                  >
                    {contractors.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-2 rounded"
                >
                  Verify Aadhaar KYC & Complete Registration
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ==================== 4. LABOUR INSPECTOR AUDITOR PANEL ==================== */}
        {currentRole === 'government_inspector' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Stats */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-wrap justify-between items-center gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600 h-6 w-6" />
                  Labour Inspector & Statutory Auditor Portal
                </h3>
                <p className="text-xs text-slate-500">
                  Government panel to audit factory registrations, contractor statutory compliance records, minimum wages, and platform micro-revenue accruals.
                </p>
              </div>

              <button 
                onClick={() => setIsAuditModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded"
              >
                File Audit Certificate / Finding
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Inspection Audit Logs & Finding Certificates */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                  Filed Audit Inspection Certificates (Form VI Compliant)
                </h4>

                <div className="space-y-4">
                  {auditLogs.map(audit => (
                    <div key={audit.id} className="border border-slate-150 rounded-lg p-4 bg-slate-50/50 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-800">{audit.inspectorName}</span>
                        <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                          audit.status === 'Clean' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          audit.status === 'Minor-Observations' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {audit.status}
                        </span>
                      </div>

                      <div className="text-slate-500">
                        Inspected Entity: <strong className="text-slate-700">{audit.entityName} ({audit.inspectedEntity})</strong>
                      </div>

                      <p className="text-slate-600 italic leading-relaxed bg-white border border-slate-100 p-2.5 rounded">
                        "{audit.findings}"
                      </p>

                      <div className="text-[10px] text-slate-400">
                        Date of Audit: {audit.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time SaaS Platform Revenue & Micro-Fee Ledger */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <IndianRupee className="text-emerald-600 h-4 w-4" />
                    SaaS Platform Micro-Billing Tracker
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Accumulating micro-fees of ₹1 per marked present worker-day, settled monthly.
                  </p>
                </div>

                <div className="space-y-3">
                  {revenueLogs.map(rev => (
                    <div key={rev.id} className="bg-slate-50 border border-slate-100 rounded p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">{rev.date}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{rev.workerCount} Compliant Present Logs</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-emerald-700 block">₹{rev.feeAmount}</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wide">Accrued SaaS Fee</span>
                      </div>
                    </div>
                  ))}

                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs font-semibold text-emerald-900 flex justify-between items-center">
                    <span>Platform Revenue Accrued:</span>
                    <span className="text-base font-extrabold text-emerald-800">
                      ₹{revenueLogs.reduce((acc, curr) => acc + curr.feeAmount, 0)} INR
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Master Roster Audit (Factory / Contractor Cross Verifications) */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">
                Master Compliance Audit Ledger (EPF, ESI & Aadhaar Match Integrity)
              </h4>

              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Worker UID</th>
                      <th className="p-3">Full Legal Name</th>
                      <th className="p-3">Assigned Contractor</th>
                      <th className="p-3">Aadhaar Status</th>
                      <th className="p-3">Skill Type</th>
                      <th className="p-3">Min Daily Wage</th>
                      <th className="p-3">Onboarding Verified</th>
                      <th className="p-3">CLRA Compliance Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {workers.map(w => {
                      const contractor = contractors.find(c => c.id === w.contractorId);
                      return (
                        <tr key={w.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-700">{w.id}</td>
                          <td className="p-3 font-semibold text-slate-800">{w.name}</td>
                          <td className="p-3 text-slate-500 font-medium">{contractor?.name}</td>
                          <td className="p-3 font-mono text-slate-500">{w.aadhaarHash}</td>
                          <td className="p-3 text-slate-500">{w.skillType}</td>
                          <td className="p-3 font-mono text-slate-700">₹{w.dailyWageRate}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              w.onboardingVerified ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                            }`}>
                              {w.onboardingVerified ? 'Completed' : 'Failed/Pending'}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="text-emerald-600 font-bold">100% Compliant</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inspector Certificate Modal */}
            {isAuditModalOpen && (
              <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-800">Issue Audit Findings / Finding Certificate</h3>
                    <button onClick={() => setIsAuditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form onSubmit={handlePostAudit} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Entity Inspected Category</label>
                      <select 
                        value={newAudit.inspectedEntity} 
                        onChange={(e) => setNewAudit(prev => ({ ...prev, inspectedEntity: e.target.value as any, entityId: e.target.value === 'Industry' ? industries[0].id : contractors[0].id }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none"
                      >
                        <option value="Industry">Manufacturing Industry</option>
                        <option value="Contractor">Labor Contractor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Select Specific Entity</label>
                      <select 
                        value={newAudit.entityId}
                        onChange={(e) => setNewAudit(prev => ({ ...prev, entityId: e.target.value }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none"
                      >
                        {newAudit.inspectedEntity === 'Industry' 
                          ? industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)
                          : contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                        }
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Inspector Finding Status</label>
                      <select 
                        value={newAudit.status}
                        onChange={(e) => setNewAudit(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none"
                      >
                        <option value="Clean">Clean Record Certificate Issued</option>
                        <option value="Minor-Observations">Minor Compliance Observations Registered</option>
                        <option value="Non-Compliant-Alert">NON-COMPLIANCE VIOLATION WARNING</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Detailed Findings Description</label>
                      <textarea 
                        rows={4}
                        placeholder="State legal findings, EPF code checks, Form 15 verification notes..."
                        value={newAudit.findings}
                        onChange={(e) => setNewAudit(prev => ({ ...prev, findings: e.target.value }))}
                        className="w-full border border-slate-200 p-2 rounded outline-none"
                        required
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAuditModalOpen(false)}
                        className="border border-slate-200 px-4 py-2 rounded text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded"
                      >
                        File Inspection Certificate
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Simulator active Challan Dossier inspection modal */}
      {activeDocUrl && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <FileText className="text-indigo-600" />
                UIDAI Government-Verified Statutory Proof
              </h3>
              <button onClick={() => setActiveDocUrl(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-indigo-50/50 border border-indigo-100 p-3.5 rounded text-indigo-900">
                <strong>File Name:</strong> <span className="font-mono">{activeDocUrl}</span> <br />
                <strong>Format:</strong> Digital PDF Challan Document <br />
                <strong>Audit Trace:</strong> MATCHED WITH TRACES EPFO/ESIC SECURE GATEWAY
              </div>

              {/* Simulated PDF container representation */}
              <div className="border border-slate-200 rounded p-6 bg-slate-100 font-mono text-[10px] text-slate-600 space-y-4 leading-relaxed max-h-[300px] overflow-y-auto">
                <div className="text-center font-bold text-slate-800 text-xs border-b border-slate-300 pb-2">
                  GOVERNMENT OF INDIA <br />
                  EMPLOYEES' PROVIDENT FUND ORGANISATION
                </div>
                <div className="flex justify-between">
                  <span>TRRN: 310260810293</span>
                  <span>Date: 15-Aug-2026</span>
                </div>
                <div>
                  <strong>Establishment EPF Code:</strong> MH/PUN/4567A/002 <br />
                  <strong>Employer Name:</strong> Apex Industrial Manpower Solutions
                </div>
                <div className="border-t border-b border-slate-300 py-2 my-2 space-y-1">
                  <div className="flex justify-between"><span>No. of Workers Audited:</span> <span>10 Workers</span></div>
                  <div className="flex justify-between"><span>Total EPF Wages:</span> <span>₹1,45,200</span></div>
                  <div className="flex justify-between font-bold text-slate-800"><span>Net Payment Deposited:</span> <span>₹38,400</span></div>
                </div>
                <div className="text-center text-emerald-700 font-bold uppercase tracking-widest text-[9px]">
                  ✓ PAID & CONFIRMED BY STATE BANK OF INDIA API GATEWAY
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => setActiveDocUrl(null)}
                  className="bg-slate-900 text-white font-bold px-4 py-2 rounded text-xs hover:bg-slate-800"
                >
                  Close Document View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
