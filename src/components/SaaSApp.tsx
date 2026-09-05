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
  Zap,
  Printer,
  Filter,
  Factory,
  Receipt,
  Briefcase,
  Calculator,
  ArrowRight,
  Percent
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
import { AppLanguage, getStoredLanguage, setStoredLanguage, TRANSLATIONS, SUPPORTED_LANGUAGES } from '../i18n';
import { LanguageSelector } from './LanguageSelector';

interface SaaSAppProps {
  externalLang?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
}

export default function SaaSApp({ externalLang, onLanguageChange }: SaaSAppProps = {}) {
  // Localization State (Pan-India Multilingual Engine)
  const [internalLang, setInternalLang] = useState<AppLanguage>(() => getStoredLanguage());
  const currentLang = externalLang || internalLang;
  const handleLangChange = (l: AppLanguage) => {
    setInternalLang(l);
    setStoredLanguage(l);
    if (onLanguageChange) {
      onLanguageChange(l);
    }
  };
  const t = TRANSLATIONS[currentLang];

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

  // Unified Credentials & Simulated OTP State
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  
  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmailOrPhone, setRegisterEmailOrPhone] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [registerRole, setRegisterRole] = useState<'industry_admin' | 'contractor' | 'worker' | 'government_inspector'>('industry_admin');
  
  const [otpStep, setOtpStep] = useState<boolean>(false);
  const [simulatedOtpCode, setSimulatedOtpCode] = useState<string>('');
  const [enteredOtpCode, setEnteredOtpCode] = useState<string>('');
  const [showSimulatedSms, setShowSimulatedSms] = useState<string | null>(null);

  interface CredentialUser {
    name: string;
    emailOrPhone: string;
    passwordHash: string;
    role: 'industry_admin' | 'contractor' | 'worker' | 'government_inspector';
  }

  const [credentialUsers, setCredentialUsers] = useState<CredentialUser[]>(() => {
    const saved = localStorage.getItem('s_credential_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    const defaults: CredentialUser[] = [
      { name: 'Tata Motors HR (Industry)', emailOrPhone: 'admin@shramiklink.com', passwordHash: 'admin', role: 'industry_admin' },
      { name: 'Apex Solutions (Contractor)', emailOrPhone: 'contractor@shramiklink.com', passwordHash: 'contractor', role: 'contractor' },
      { name: 'Gopal Kumar (Worker)', emailOrPhone: 'worker@shramiklink.com', passwordHash: 'worker', role: 'worker' },
      { name: 'Bhaskar Senapati (Government)', emailOrPhone: 'inspector@shramiklink.com', passwordHash: 'inspector', role: 'government_inspector' },
      { name: 'Demo Admin Phone', emailOrPhone: '9876543210', passwordHash: 'admin', role: 'industry_admin' },
      { name: 'Demo Contractor Phone', emailOrPhone: '9876543211', passwordHash: 'contractor', role: 'contractor' },
      { name: 'Demo Worker Phone', emailOrPhone: '9876543212', passwordHash: 'worker', role: 'worker' },
      { name: 'Demo Inspector Phone', emailOrPhone: '9876543213', passwordHash: 'inspector', role: 'government_inspector' },
    ];
    localStorage.setItem('s_credential_users', JSON.stringify(defaults));
    return defaults;
  });

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone || !loginPassword) {
      showNotice('অনুগ্ৰহ কৰি মেইল/ফোন নম্বৰ আৰু পাছৱৰ্ড প্ৰবিষ্ট কৰক। (Please enter Email/Phone and Password)', 'error');
      return;
    }
    const matched = credentialUsers.find(
      u => u.emailOrPhone.trim().toLowerCase() === loginEmailOrPhone.trim().toLowerCase() && 
           u.passwordHash === loginPassword
    );
    if (matched) {
      setCurrentRole(matched.role);
      localStorage.setItem('s_current_role', matched.role);
      setIsLoggedIn(true);
      localStorage.setItem('s_is_logged_in', 'true');
      showNotice(`লগইন সফল হৈছে! স্বাগতম, ${matched.name}!`, 'success');
      refreshData();
    } else {
      showNotice('ভুল মেইল/ফোন নম্বৰ বা পাছৱৰ্ড! (Invalid email/phone or password)', 'error');
    }
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmailOrPhone || !registerPassword) {
      showNotice('অনুগ্ৰহ কৰি সকলো ফিল্ড পূৰণ কৰক। (Please fill in all fields)', 'error');
      return;
    }
    const exists = credentialUsers.some(u => u.emailOrPhone.trim().toLowerCase() === registerEmailOrPhone.trim().toLowerCase());
    if (exists) {
      showNotice('এই মেইল/ফোন নম্বৰ ইতিমধ্যে পঞ্জীভুক্ত হৈ আছে! (User already registered)', 'error');
      return;
    }

    const newUser: CredentialUser = {
      name: registerName,
      emailOrPhone: registerEmailOrPhone.trim().toLowerCase(),
      passwordHash: registerPassword,
      role: registerRole
    };
    
    const updated = [...credentialUsers, newUser];
    setCredentialUsers(updated);
    localStorage.setItem('s_credential_users', JSON.stringify(updated));

    setCurrentRole(registerRole);
    localStorage.setItem('s_current_role', registerRole);
    setIsLoggedIn(true);
    localStorage.setItem('s_is_logged_in', 'true');
    
    setRegisterName('');
    setRegisterEmailOrPhone('');
    setRegisterPassword('');
    
    showNotice(`পঞ্জীয়ন আৰু লগইন সফল হৈছে! স্বাগতম ${newUser.name}! (Registration & Login Successful!)`, 'success');
    refreshData();
  };

  const handleVerifyRegisterOtp = (e: React.FormEvent) => {
    e.preventDefault();
  };

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

  // Contractor Billing States & Automated Invoice Engine
  const [billMonth, setBillMonth] = useState('August 2026');
  const [billTargetIndustry, setBillTargetIndustry] = useState('ind-1');
  const [billBaseWage, setBillBaseWage] = useState(150000);
  const [billServiceCharge, setBillServiceCharge] = useState(15000); // 10%
  const [billCommissionPct, setBillCommissionPct] = useState(10); // 10% Labour Contractor Commission
  const [billCalculationMode, setBillCalculationMode] = useState<'auto' | 'custom'>('auto');
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [selectedInvoiceBill, setSelectedInvoiceBill] = useState<Bill | null>(null);
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
  const activeIndustry = industries.find(i => i.id === selectedIndustryId) || industries[0] || { id: '', name: 'No active industry', location: '', regNo: 'N/A', lin: 'N/A', contactEmail: '' };
  const activeContractor = contractors.find(c => c.id === selectedContractorId) || contractors[0] || { id: '', name: 'No active contractor', licenseNo: 'N/A', lin: 'N/A', pan: 'N/A', epfCode: 'N/A', esiCode: 'N/A', contactNo: '', rating: 5 };
  const activeWorker = workers.find(w => w.id === selectedWorkerId) || workers[0] || { id: '', name: 'No active worker', aadhaarHash: 'N/A', phone: 'N/A', contractorId: '', skillType: 'Unskilled', dailyWageRate: 0, status: 'Available', onboardingVerified: false, onboardingDate: '' };

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

  // Industry-wise Attendance Filter & Worker Check-In state
  const [attendanceIndustryFilter, setAttendanceIndustryFilter] = useState<string>('ALL');
  const [requisitionContractorFilter, setRequisitionContractorFilter] = useState<string>('ALL');
  
  // Contractor Contract Allotments & Worker Quotas State
  const [allotments, setAllotments] = useState<{
    id: string;
    contractorId: string;
    industryId: string;
    allottedWorkers: number;
    contractValue: number;
    validUntil: string;
    workDescription: string;
    status: 'Active' | 'Suspended';
  }[]>(() => {
    const saved = localStorage.getItem('s_allotments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing allotments:', e);
      }
    }
    return [
      { id: 'alot-1', contractorId: 'con-1', industryId: 'ind-1', allottedWorkers: 50, contractValue: 120000, validUntil: '2026-12-31', workDescription: 'Electrical & General Assembly Maintenance', status: 'Active' },
      { id: 'alot-2', contractorId: 'con-1', industryId: 'ind-2', allottedWorkers: 35, contractValue: 85000, validUntil: '2026-10-15', workDescription: 'Dispatch Yard Helpers & Packing', status: 'Active' },
      { id: 'alot-3', contractorId: 'con-2', industryId: 'ind-1', allottedWorkers: 80, contractValue: 240000, validUntil: '2027-03-31', workDescription: 'Heavy Machine Operation & Forging', status: 'Active' },
      { id: 'alot-4', contractorId: 'con-2', industryId: 'ind-3', allottedWorkers: 40, contractValue: 95000, validUntil: '2026-11-30', workDescription: 'Loading, Unloading & Logistics', status: 'Active' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('s_allotments', JSON.stringify(allotments));
  }, [allotments]);

  const [isAddingAllotment, setIsAddingAllotment] = useState(false);
  const [newAllotment, setNewAllotment] = useState({
    contractorId: 'con-1',
    industryId: 'ind-1',
    allottedWorkers: 50,
    contractValue: 100000,
    validUntil: '2026-12-31',
    workDescription: 'General Maintenance & Packing',
    status: 'Active' as 'Active' | 'Suspended'
  });
  const [targetCheckInIndustry, setTargetCheckInIndustry] = useState<string>('');

  // Industry-wise EPF & ESIC Challan Generator State
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [challanTargetIndustry, setChallanTargetIndustry] = useState<string>('ind-1');
  const [challanTargetMonth, setChallanTargetMonth] = useState<string>('August 2026');

  // Contractor Industry-wise Work Summary Inspection & Print State
  const [isWorkSummaryModalOpen, setIsWorkSummaryModalOpen] = useState(false);
  const [summaryTargetIndustry, setSummaryTargetIndustry] = useState<string>('ALL');

  // CLRA Registers State
  const [selectedClraForm, setSelectedClraForm] = useState<'Form XIII' | 'Form XVI' | 'Form XVII' | 'Form XX' | 'Form XXII' | 'Form XXIII'>('Form XIII');
  const [activePrintClraForm, setActivePrintClraForm] = useState<'Form XIII' | 'Form XVI' | 'Form XVII' | 'Form XX' | 'Form XXII' | 'Form XXIII' | null>(null);
  
  // Custom states for Form XX (Deductions) & Form XXII (Advances) with digital localStorage persistence
  const [clraDeductions, setClraDeductions] = useState<{
    id: string;
    workerId: string;
    damageDate: string;
    particulars: string;
    amount: number;
    installments: number;
    recoveryDate: string;
  }[]>(() => {
    const saved = localStorage.getItem('s_clra_deductions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing clra deductions:', e);
      }
    }
    return [
      { id: 'ded-1', workerId: 'wrk-1', damageDate: '2026-08-12', particulars: 'Lost Safety Helmet', amount: 350, installments: 1, recoveryDate: '2026-08-31' },
      { id: 'ded-2', workerId: 'wrk-2', damageDate: '2026-08-15', particulars: 'Damaged Machine Lever', amount: 1200, installments: 2, recoveryDate: '2026-08-31' }
    ];
  });

  const [clraAdvances, setClraAdvances] = useState<{
    id: string;
    workerId: string;
    advanceDate: string;
    purpose: string;
    amount: number;
    installments: number;
    recoveryDate: string;
  }[]>(() => {
    const saved = localStorage.getItem('s_clra_advances');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing clra advances:', e);
      }
    }
    return [
      { id: 'adv-1', workerId: 'wrk-3', advanceDate: '2026-08-05', purpose: 'Family Medical Emergency', amount: 5000, installments: 5, recoveryDate: '2026-08-31' },
      { id: 'adv-2', workerId: 'wrk-4', advanceDate: '2026-08-10', purpose: 'Travel Expense', amount: 1500, installments: 1, recoveryDate: '2026-08-31' }
    ];
  });

  // Automatically sync to local digital ledger cache whenever changed
  useEffect(() => {
    localStorage.setItem('s_clra_deductions', JSON.stringify(clraDeductions));
  }, [clraDeductions]);

  useEffect(() => {
    localStorage.setItem('s_clra_advances', JSON.stringify(clraAdvances));
  }, [clraAdvances]);

  const [isAddingDeduction, setIsAddingDeduction] = useState(false);
  const [newDeduction, setNewDeduction] = useState({
    workerId: '',
    particulars: '',
    amount: 100,
    installments: 1,
    damageDate: '2026-08-20',
    recoveryDate: '2026-08-31'
  });

  const [isAddingAdvance, setIsAddingAdvance] = useState(false);
  const [newAdvance, setNewAdvance] = useState({
    workerId: '',
    purpose: '',
    amount: 1000,
    installments: 1,
    advanceDate: '2026-08-20',
    recoveryDate: '2026-08-31'
  });

  // Forgot Password / Password Reset States - Free of cost security verification
  const [resetStep, setResetStep] = useState<'none' | 'request' | 'new_password'>('none');
  const [resetEmailOrPhone, setResetEmailOrPhone] = useState<string>('');
  const [resetSecurityName, setResetSecurityName] = useState<string>('');
  const [newResetPassword, setNewResetPassword] = useState<string>('');

  const handleInitiatePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmailOrPhone || !resetSecurityName) {
      showNotice('অনুগ্ৰহ কৰি মেইল/নম্বৰ আৰু নাম দুয়োটাই লিখক। (Please enter Email/Phone and Full Name)', 'error');
      return;
    }
    const matched = credentialUsers.find(
      u => u.emailOrPhone.trim().toLowerCase() === resetEmailOrPhone.trim().toLowerCase() &&
           u.name.trim().toLowerCase() === resetSecurityName.trim().toLowerCase()
    );
    if (!matched) {
      showNotice('প্ৰবিষ্ট কৰা তথ্যসমূহ মিলি যোৱা নাই! অনুগ্ৰহ কৰি সঠিক তথ্য লিখক। (Details do not match our records!)', 'error');
      return;
    }
    setResetStep('new_password');
    setNewResetPassword('');
    showNotice('পৰিচয় প্ৰমাণিত হৈছে! অনুগ্ৰহ কৰি নতুন পাছৱৰ্ড ছেট কৰক। (Identity verified! Please set your new password)', 'success');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResetPassword) {
      showNotice('অনুগ্ৰহ কৰি নতুন পাছৱৰ্ডটো লিখক। (Please enter your new password)', 'error');
      return;
    }
    const updated = credentialUsers.map(u => {
      if (u.emailOrPhone.trim().toLowerCase() === resetEmailOrPhone.trim().toLowerCase()) {
        return { ...u, passwordHash: newResetPassword };
      }
      return u;
    });
    setCredentialUsers(updated);
    localStorage.setItem('s_credential_users', JSON.stringify(updated));
    showNotice('আপোনাৰ পাছৱৰ্ড সফলতাৰে পৰিৱৰ্তন কৰা হৈছে! নতুন পাছৱৰ্ডেৰে লগইন কৰক। (Password reset successful!)', 'success');
    setResetStep('none');
    setResetEmailOrPhone('');
    setResetSecurityName('');
    setNewResetPassword('');
  };

  // Helper generators for statutory identifiers (UAN & ESIC IP No.)
  const getWorkerUAN = (w: Worker) => {
    const digits = (w.aadhaarHash || '').replace(/\D/g, '').padEnd(4, '8');
    return `1019${digits.slice(-4)}8821`;
  };

  const getWorkerESIIP = (w: Worker) => {
    const digits = (w.aadhaarHash || '').replace(/\D/g, '').padEnd(4, '3');
    return `31${digits.slice(-4)}9902`;
  };

  // Helper for Indian Currency in Words (Rupees Lakh/Crore format)
  const toIndianWords = (num: number): string => {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n: number): string => {
      if (n === 0) return '';
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10];
      if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + inWords(n % 100);
      if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + inWords(n % 1000);
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + inWords(n % 100000);
      return inWords(Math.floor(n / 10000000)) + 'Crore ' + inWords(n % 10000000);
    };
    const rounded = Math.round(num);
    if (rounded === 0) return 'Zero Rupees Only';
    return 'Rupees ' + inWords(rounded).trim() + ' Only';
  };

  // Industry-wise Attendance & Wage Billing Breakdown per Contractor
  const getIndustryBillingBreakdown = (contractorId: string, industryId: string, month: string) => {
    const contractorWorkers = workers.filter(w => w.contractorId === contractorId);

    const workerRows = contractorWorkers.map((wrk) => {
      const wrkShifts = attendance.filter(a => 
        a.workerId === wrk.id && 
        a.industryId === industryId && 
        a.status === 'Present'
      );
      
      const isAssigned = assignments.some(a => a.workerId === wrk.id && a.industryId === industryId && a.status === 'Active');
      
      const daysWorked = wrkShifts.length > 0 ? wrkShifts.length : (isAssigned ? 1 : 0);
      const otHours = wrkShifts.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);
      
      const regularWage = daysWorked * wrk.dailyWageRate;
      const otWage = Math.round(otHours * (wrk.dailyWageRate / 8) * 2);
      const totalWage = regularWage + otWage;

      return {
        worker: wrk,
        daysWorked,
        otHours,
        dailyRate: wrk.dailyWageRate,
        regularWage,
        otWage,
        totalWage,
        isActive: daysWorked > 0 || isAssigned
      };
    }).filter(r => r.isActive || r.daysWorked > 0);

    const totalAttendance = workerRows.reduce((sum, r) => sum + r.daysWorked, 0);
    const totalWageSum = workerRows.reduce((sum, r) => sum + r.totalWage, 0);

    return {
      workerRows,
      totalAttendance,
      totalWageSum
    };
  };

  // Statutory PF & ESIC Calculation per worker in a specific industry
  const getIndustryWorkerStatutory = (contractorId: string, industryId: string, month: string) => {
    const contractorWorkers = workers.filter(w => w.contractorId === contractorId);
    
    return contractorWorkers.map((wrk) => {
      // Find shifts for this worker at this specific industry
      const wrkShifts = attendance.filter(a => 
        a.workerId === wrk.id && 
        a.industryId === industryId && 
        a.status === 'Present'
      );
      
      const isAssigned = assignments.some(a => a.workerId === wrk.id && a.industryId === industryId && a.status === 'Active');
      
      // If shifts exist, count them. If assigned to this factory, at least 1 shift preview
      const daysWorked = wrkShifts.length > 0 ? wrkShifts.length : (isAssigned ? 1 : 0);
      const otHours = wrkShifts.reduce((acc, curr) => acc + (curr.overtimeHours || 0), 0);
      
      const baseWage = daysWorked * wrk.dailyWageRate;
      const otPay = otHours * (wrk.dailyWageRate / 8) * 2; // Overtime is calculated at double rate under Factories Act
      const grossWage = baseWage + otPay;
      
      // Statutory EPF calculation (capped at ₹15,000 ceiling under EPFO Act)
      const epfWage = Math.min(grossWage, 15000);
      const epfEeShare = Math.round(epfWage * 0.12); // 12% Employee Share
      const epfErEpfShare = Math.round(epfWage * 0.0367); // 3.67% Employer EPF Share (A/C 1)
      const epfErEpsShare = Math.round(epfWage * 0.0833); // 8.33% Employer Pension Fund (A/C 10)
      const epfAdmin = Math.round(epfWage * 0.01); // 1.0% EDLI & Admin (A/C 2 & 21)
      const epfTotal = epfEeShare + epfErEpfShare + epfErEpsShare + epfAdmin;

      // Statutory ESI calculation (0.75% EE, 3.25% ER, Total 4.0%)
      const esiWage = grossWage;
      const esiEeShare = Math.round(esiWage * 0.0075);
      const esiErShare = Math.round(esiWage * 0.0325);
      const esiTotal = esiEeShare + esiErShare;

      const netPay = grossWage - epfEeShare - esiEeShare;

      return {
        worker: wrk,
        uan: getWorkerUAN(wrk),
        ipNo: getWorkerESIIP(wrk),
        daysWorked,
        otHours,
        grossWage,
        epfWage,
        epfEeShare,
        epfErEpfShare,
        epfErEpsShare,
        epfAdmin,
        epfTotal,
        esiWage,
        esiEeShare,
        esiErShare,
        esiTotal,
        netPay,
        hasActivity: wrkShifts.length > 0 || isAssigned
      };
    }).filter(row => row.hasActivity || row.daysWorked > 0);
  };

  // Contractor's Industry-wise Work & Man-Days Records
  const getContractorIndustrySummary = (contractorId: string) => {
    const contractorAllotments = allotments.filter(al => al.contractorId === contractorId);
    const allottedIndustryIds = contractorAllotments.map(al => al.industryId);

    return industries
      .filter(ind => allottedIndustryIds.includes(ind.id) || assignments.some(a => a.contractorId === contractorId && a.industryId === ind.id && a.status === 'Active'))
      .map(ind => {
        const allotmentDetail = contractorAllotments.find(al => al.industryId === ind.id);
        const assignedWorkers = assignments.filter(a => a.contractorId === contractorId && a.industryId === ind.id && a.status === 'Active');
        const indAttendance = attendance.filter(a => a.contractorId === contractorId && a.industryId === ind.id && a.status === 'Present');
        
        const totalManDays = indAttendance.length;
        const totalOtHours = indAttendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);
        const totalStdHours = totalManDays * 8;
        
        const totalWages = indAttendance.reduce((sum, att) => {
          const wrk = workers.find(w => w.id === att.workerId);
          const rate = wrk?.dailyWageRate || 650;
          const base = rate;
          const ot = (att.overtimeHours || 0) * (rate / 8) * 2;
          return sum + base + ot;
        }, 0);

        const bill = bills.find(b => b.contractorId === contractorId && b.industryId === ind.id);

        return {
          industry: ind,
          assignedCount: assignedWorkers.length,
          totalManDays,
          totalStdHours,
          totalOtHours,
          totalWages,
          bill,
          allotmentLimit: allotmentDetail?.allottedWorkers || 50,
          workDescription: allotmentDetail?.workDescription || 'General Labour Support',
          validUntil: allotmentDetail?.validUntil || '2026-12-31',
          status: allotmentDetail?.status || 'Active'
        };
      });
  };

  // Export ECR CSV File
  const handleExportECRCSV = (rows: any[], targetIndustryObj: Industry | undefined, month: string) => {
    const headers = ['Sl No', 'Worker Name', 'UAN', 'ESI IP No', 'Days Worked', 'Gross Wages', 'EPF Wages', 'EE Share (12%)', 'ER EPF (3.67%)', 'EPS Pension (8.33%)', 'Total EPF', 'ESI Wages', 'EE ESI (0.75%)', 'ER ESI (3.25%)', 'Total ESI', 'Net Take-Home'];
    const csvContent = [
      `# ECR RETURN - EMPLOYEES PROVIDENT FUND & ESIC STATUTORY STATEMENT`,
      `# Principal Employer: ${targetIndustryObj?.name || 'Factory'} (LIN: ${targetIndustryObj?.lin || 'N/A'})`,
      `# Contractor: ${activeContractor.name} (CLRA Lic: ${activeContractor.licenseNo})`,
      `# Wage Month: ${month}`,
      headers.join(','),
      ...rows.map((r, i) => [
        i + 1,
        `"${r.worker.name}"`,
        r.uan,
        r.ipNo,
        r.daysWorked,
        r.grossWage,
        r.epfWage,
        r.epfEeShare,
        r.epfErEpfShare,
        r.epfErEpsShare,
        r.epfTotal,
        r.esiWage,
        r.esiEeShare,
        r.esiErShare,
        r.esiTotal,
        r.netPay
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ECR_CHALLAN_${(targetIndustryObj?.name || 'FACTORY').replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice(`Downloaded official EPFO/ESIC ECR format CSV for ${targetIndustryObj?.name}!`, 'success');
  };

  // Save generated statutory challan into verified compliance dossier
  const handleSaveChallanDossier = (targetIndustryObj: Industry | undefined, month: string, epfTotal: number, esiTotal: number, workerCount: number) => {
    const epfDoc: ComplianceDocument = {
      id: 'doc-epf-' + Date.now(),
      contractorId: selectedContractorId,
      industryId: challanTargetIndustry,
      month,
      docType: 'EPF-Challan',
      fileUrl: `EPF_CHALLAN_${(targetIndustryObj?.name || 'IND').replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Verified',
      verifiedBy: 'EPFO Live Gateway Portal',
      remarks: `EPF Challan verified for ${targetIndustryObj?.name}. Workers: ${workerCount}, Total Deposited: ₹${epfTotal.toLocaleString()}.`
    };

    const esiDoc: ComplianceDocument = {
      id: 'doc-esi-' + (Date.now() + 1),
      contractorId: selectedContractorId,
      industryId: challanTargetIndustry,
      month,
      docType: 'ESI-Challan',
      fileUrl: `ESI_CHALLAN_${(targetIndustryObj?.name || 'IND').replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.pdf`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Verified',
      verifiedBy: 'ESIC Live Gateway Portal',
      remarks: `ESI Challan verified for ${targetIndustryObj?.name}. Workers: ${workerCount}, Total Deposited: ₹${esiTotal.toLocaleString()}.`
    };

    setComplianceDocs(prev => [epfDoc, esiDoc, ...prev]);
    showNotice(`Official EPF & ESI Challans generated for ${targetIndustryObj?.name} and attached to compliance records!`, 'success');
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

    // Check active allotment for target industry
    const activeAllotmentObj = allotments.find(
      al => al.contractorId === workerObj.contractorId && al.industryId === deploymentIndustryId && al.status === 'Active'
    );

    if (!activeAllotmentObj) {
      showNotice(
        `এই উদ্যোগত আপোনাৰ কোনো সক্ৰিয় আৱণ্টন (Allotment) নাই! (You do not have an active contract allotment for this industry!)`,
        'error'
      );
      return;
    }

    // Check quota limit
    const activeCount = assignments.filter(
      a => a.contractorId === workerObj.contractorId && a.industryId === deploymentIndustryId && a.status === 'Active'
    ).length;

    if (activeCount >= activeAllotmentObj.allottedWorkers) {
      showNotice(
        `আৱণ্টিত শ্ৰমিকৰ সৰ্বোচ্চ সীমা অতিক্ৰম কৰিছে! ক’টা সীমা: ${activeAllotmentObj.allottedWorkers} জন শ্ৰমিক। (Worker quota exceeded! Max limit: ${activeAllotmentObj.allottedWorkers} workers.)`,
        'error'
      );
      return;
    }

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

      const activeContractorObj = contractors.find(c => c.id === selectedContractorId) || contractors[0];
      const compliance = checkContractorCompliance(selectedContractorId, 'July 2026');

      const missingDocs = [];
      if (!compliance.hasEPF) missingDocs.push('EPF-Challan');
      if (!compliance.hasESI) missingDocs.push('ESI-Challan');
      if (!compliance.hasGST) missingDocs.push('GST-Return');

      if (missingDocs.length === 0) {
        showNotice('All statutory challans are already verified for this contractor!', 'info');
        return;
      }

      for (const docType of missingDocs) {
        await fetch('/api/compliance/upload-missing', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contractorId: selectedContractorId,
            month: 'July 2026',
            docType: docType,
            fileUrl: `${docType.toLowerCase()}-JUL-SIMULATED.pdf`,
            remarks: `${docType} uploaded digitally. Automatic government portal verification succeeded.`
          })
        });
      }

      showNotice(`Statutory compliance challans uploaded! ${activeContractorObj.name} is now fully unlocked!`, 'success');
      refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Bill
  const handleSubmitBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const compliance = checkContractorCompliance(selectedContractorId, 'July 2026');
    if (!compliance.compliant) {
      showNotice('আপোনাৰ পূৰ্বৰ মাহৰ EPF/ESI/GST চালান সত্যাপিত নোহোৱালৈকে বিল সৃষ্টি কৰা বন্ধ আছে।', 'error');
      return;
    }

    const currentBillingBreakdown = getIndustryBillingBreakdown(selectedContractorId, billTargetIndustry, billMonth);
    const base = billCalculationMode === 'auto'
      ? (currentBillingBreakdown.totalWageSum > 0 ? currentBillingBreakdown.totalWageSum : Number(billBaseWage))
      : Number(billBaseWage);
    const service = Math.round(base * (billCommissionPct / 100));
    const taxable = base + service;
    const gst = Math.round(taxable * 0.18);
    const total = taxable + gst;

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
        const resJson = await response.json().catch(() => null);
        if (resJson?.bill) {
          setBills(prev => [resJson.bill, ...prev.filter(b => b.id !== resJson.bill.id)]);
        }
        showNotice(`বিলখন সফলতাৰে তৈয়াৰ কৰা হ’ল (₹${total.toLocaleString()}) আৰু ইণ্ডাষ্ট্ৰী এডমিনলৈ প্ৰেৰণ কৰা হ’ল!`, 'success');
        refreshData();
      }
    } catch (err) {
      console.error(err);
      showNotice('বিল দাখিলত সমস্যা হৈছে। পুনৰ চেষ্টা কৰক।', 'error');
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

  // Add custom deduction for Form XX
  const handleAddDeduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeduction.workerId) {
      showNotice('অনুগ্ৰহ কৰি এজন শ্ৰমিক বাছক (Please select a worker)', 'error');
      return;
    }
    const record = {
      id: `ded-${Date.now()}`,
      workerId: newDeduction.workerId,
      damageDate: newDeduction.damageDate,
      particulars: newDeduction.particulars || 'Material Damage',
      amount: Number(newDeduction.amount),
      installments: Number(newDeduction.installments),
      recoveryDate: newDeduction.recoveryDate
    };
    setClraDeductions(prev => [record, ...prev]);
    setIsAddingDeduction(false);
    setNewDeduction({
      workerId: '',
      particulars: '',
      amount: 100,
      installments: 1,
      damageDate: '2026-08-20',
      recoveryDate: '2026-08-31'
    });
    showNotice('ক্ষতিপূৰণ কর্তন ৰেকৰ্ড কৰা হৈছে! (Deduction recorded successfully!)', 'success');
  };

  // Add custom advance for Form XXII
  const handleAddAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdvance.workerId) {
      showNotice('অনুগ্ৰহ কৰি এজন শ্ৰমিক বাছক (Please select a worker)', 'error');
      return;
    }
    const record = {
      id: `adv-${Date.now()}`,
      workerId: newAdvance.workerId,
      advanceDate: newAdvance.advanceDate,
      purpose: newAdvance.purpose || 'Personal Advance',
      amount: Number(newAdvance.amount),
      installments: Number(newAdvance.installments),
      recoveryDate: newAdvance.recoveryDate
    };
    setClraAdvances(prev => [record, ...prev]);
    setIsAddingAdvance(false);
    setNewAdvance({
      workerId: '',
      purpose: '',
      amount: 1000,
      installments: 1,
      advanceDate: '2026-08-20',
      recoveryDate: '2026-08-31'
    });
    showNotice('অগ্ৰিম ধনৰ ৰেকৰ্ড কৰা হৈছে! (Advance recorded successfully!)', 'success');
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

    const effectiveIndId = targetCheckInIndustry || assignments.find(a => a.workerId === selectedWorkerId && a.status === 'Active')?.industryId || 'ind-1';
    const targetIndName = industries.find(i => i.id === effectiveIndId)?.name || 'Industry Plant';

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const todayStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toTimeString().split(' ')[0].slice(0, 5);

      const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workerId: selectedWorkerId,
          verificationMethod,
          checkIn: timeStr,
          date: todayStr,
          industryId: effectiveIndId
        })
      });

      // Optimistic update
      const newAttRecord: Attendance = {
        id: 'att-' + Date.now(),
        date: todayStr,
        workerId: selectedWorkerId,
        workerName: activeWorker.name,
        contractorId: activeWorker.contractorId,
        industryId: effectiveIndId,
        checkIn: timeStr,
        checkOut: null,
        aadhaarVerified: true,
        verificationMethod,
        hoursWorked: 8,
        overtimeHours: 0,
        status: 'Present'
      };
      setAttendance(prev => [newAttRecord, ...prev]);

      setCheckInSuccessMessage(`Check-In Succeeded! ${activeWorker.name} marked Present for ${targetIndName} via Aadhaar-OTP.`);
      showNotice(`Attendance recorded for ${activeWorker.name} at ${targetIndName}`, 'success');
      refreshData();
      setOtpGenerated(null);
      setOtpInput('');
      setTimeout(() => setCheckInSuccessMessage(null), 6000);
    } catch (err) {
      console.error(err);
    }
  };

  const simulateFaceScan = () => {
    setIsFaceScanning(true);
    const effectiveIndId = targetCheckInIndustry || assignments.find(a => a.workerId === selectedWorkerId && a.status === 'Active')?.industryId || 'ind-1';
    const targetIndName = industries.find(i => i.id === effectiveIndId)?.name || 'Industry Plant';

    setTimeout(() => {
      setIsFaceScanning(false);
      const todayStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toTimeString().split(' ')[0].slice(0, 5);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Optimistic update
      const newAttRecord: Attendance = {
        id: 'att-' + Date.now(),
        date: todayStr,
        workerId: selectedWorkerId,
        workerName: activeWorker.name,
        contractorId: activeWorker.contractorId,
        industryId: effectiveIndId,
        checkIn: timeStr,
        checkOut: null,
        aadhaarVerified: true,
        verificationMethod: 'Biometric-Face',
        hoursWorked: 8,
        overtimeHours: 0,
        status: 'Present'
      };
      setAttendance(prev => [newAttRecord, ...prev]);

      fetch('/api/attendance/check-in', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          workerId: selectedWorkerId,
          verificationMethod: 'Biometric-Face',
          checkIn: timeStr,
          date: todayStr,
          industryId: effectiveIndId
        })
      }).then(response => {
        setCheckInSuccessMessage(`Check-In Succeeded! ${activeWorker.name} verified via Biometric Face scan for ${targetIndName}.`);
        showNotice(`Biometric shift logged for ${activeWorker.name} at ${targetIndName}`, 'success');
        refreshData();
        setTimeout(() => setCheckInSuccessMessage(null), 6000);
      }).catch(err => console.error(err));
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

        {/* Top Installer & Language Selector Utility Bar */}
        <div className="flex items-center justify-between px-2 gap-3">
          <LanguageSelector 
            currentLang={currentLang} 
            onLanguageChange={handleLangChange} 
            variant="header" 
          />
          <PWAInstallButton />
        </div>

        {/* Brand Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 md:p-4 border border-slate-800 shadow-xl relative overflow-hidden space-y-3">
          {/* Subtle graphic elements */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Top Row: Logo (Left), ShramikLink (Center), Pill (Right) */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-2 border-b border-slate-800/30 pb-2.5">
            
            {/* Logo (Left side) */}
            <div className="flex-1 flex justify-center md:justify-start w-full md:w-auto">
              <div className="relative group w-9 h-9 md:w-11 md:h-11 bg-white p-1 rounded-xl flex items-center justify-center border border-white shadow-md hover:scale-105 transition-transform duration-300">
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
              <h2 className="text-lg md:text-xl font-black tracking-tight text-white select-none">
                <span className="text-orange-500">ShramikLink</span>
              </h2>
            </div>

            {/* Pill (Right side) */}
            <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-bold uppercase tracking-wider border border-emerald-500/20 whitespace-nowrap shadow-xs">
                <ShieldCheck className="h-3 w-3 shrink-0" /> Multi-Role Secure Login Gateway
              </div>
            </div>

          </div>

          {/* Subtitle / Description (Centered underneath) */}
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <p className="text-[10px] md:text-[11px] text-emerald-400/95 font-bold tracking-wide leading-relaxed">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* SMS / Email Simulated Banner */}
        {showSimulatedSms && (
          <div className="bg-slate-900 border-2 border-amber-500/80 text-amber-300 px-5 py-4 rounded-2xl text-xs font-mono font-bold flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-lg animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">📱</span>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Simulated Carrier SMS Gateway</span>
                <span>{showSimulatedSms}</span>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => {
                const otpMatch = showSimulatedSms.match(/OTP is (\d+)/);
                if (otpMatch && otpMatch[1]) {
                  setEnteredOtpCode(otpMatch[1]);
                  showNotice('OTP Auto-filled for quick testing!', 'success');
                }
              }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold tracking-wider uppercase transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              Auto-Fill OTP / অ’টিপি ভৰাওক
            </button>
          </div>
        )}

        {/* Double-Column Authentication Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          
          {/* Left Column: Interactive Tabbed Form (3 Cols) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 max-w-lg mx-auto w-full">
            
            {/* Header */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-widest block">Unified Credentials Gateway</span>
              <h3 className="text-base font-black text-slate-950 tracking-tight">🔒 সুৰক্ষিত লগইন আৰু পঞ্জীয়ন প্ৰণালী</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Log in securely using registered credentials or create a new multi-tenant portal profile secured by password.
              </p>
            </div>

            {/* OTP Verification Step */}
            {otpStep ? (
              <form onSubmit={handleVerifyRegisterOtp} className="space-y-4 bg-slate-50 border border-slate-100 p-5 rounded-xl">
                <div className="text-center space-y-1.5">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-base">
                    🔑
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">সুৰক্ষা সত্যতা প্ৰমাণ (Verify Identity)</h4>
                  <p className="text-[11px] text-slate-500">
                    We sent a simulated 6-digit OTP to <strong className="text-indigo-600">{registerEmailOrPhone}</strong>. Check the carrier banner at the top of the screen!
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-600 uppercase">৬-ডিজিটৰ OTP প্ৰবিষ্ট কৰক (Enter OTP Code)</label>
                  <input 
                    type="text"
                    maxLength={6}
                    required
                    placeholder="E.g., 123456"
                    value={enteredOtpCode}
                    onChange={(e) => setEnteredOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-center text-base font-mono font-bold tracking-widest text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep(false);
                      setSimulatedOtpCode('');
                      setEnteredOtpCode('');
                      setShowSimulatedSms(null);
                    }}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer text-center"
                  >
                    ভুল শুধৰাওক (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer text-center shadow-sm"
                  >
                    প্ৰমাণ কৰক (Verify & Login)
                  </button>
                </div>
              </form>
            ) : resetStep !== 'none' ? (
              <div className="space-y-4 bg-slate-50 border border-slate-100 p-5 rounded-xl">
                {resetStep === 'request' && (
                  <form onSubmit={handleInitiatePasswordReset} className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-base">
                        🔑
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">পাছৱৰ্ড পুনৰুদ্ধাৰ (Password Recovery)</h4>
                      <p className="text-[10px] text-slate-500">
                        Enter your registered Email/Phone and Full Name to securely reset your password. 100% Free of cost.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">মেইল ঠিকনা / ফোন নম্বৰ (Registered Email/Phone)</label>
                      <input 
                        type="text"
                        required
                        placeholder="E.g., contractor@shramiklink.com"
                        value={resetEmailOrPhone}
                        onChange={(e) => setResetEmailOrPhone(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">পঞ্জীভুক্ত পূৰ্ণ নাম (Registered Full Name)</label>
                      <input 
                        type="text"
                        required
                        placeholder="E.g., Apex Solutions (Contractor)"
                        value={resetSecurityName}
                        onChange={(e) => setResetSecurityName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setResetStep('none');
                          setResetEmailOrPhone('');
                          setResetSecurityName('');
                        }}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg text-xs font-bold cursor-pointer text-center"
                      >
                        বাতিল কৰক (Cancel)
                      </button>
                      <button
                        type="submit"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-xs font-bold cursor-pointer text-center shadow-xs"
                      >
                        প্ৰমাণিত কৰক (Verify Identity)
                      </button>
                    </div>
                  </form>
                )}

                {resetStep === 'new_password' && (
                  <form onSubmit={handleSaveNewPassword} className="space-y-4">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-base">
                        🔐
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">নতুন পাছৱৰ্ড ছেট কৰক (Choose New Password)</h4>
                      <p className="text-[10px] text-slate-500">
                        Create a secure new password for your account linked to <strong className="text-indigo-600">{resetEmailOrPhone}</strong>.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">নতুন পাছৱৰ্ড লিখক (Enter New Password)</label>
                      <input 
                        type="password"
                        required
                        placeholder="Choose secure password"
                        value={newResetPassword}
                        onChange={(e) => setNewResetPassword(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1">
                      <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-lg text-xs font-bold cursor-pointer text-center shadow-xs uppercase tracking-wider font-extrabold"
                      >
                        পাছৱৰ্ড সলনি কৰক (Update & Reset Password)
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Tabs */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAuthTab('login')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${authTab === 'login' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    লগইন কৰক (Log In)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab('register')}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${authTab === 'register' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    নতুন পঞ্জীয়ন কৰক (Register)
                  </button>
                </div>

                {/* Form: LOGIN */}
                {authTab === 'login' && (
                  <form onSubmit={handleCredentialsLogin} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">মেইল ঠিকনা / ফোন নম্বৰ (Email or Mobile No)</label>
                      <input 
                        type="text"
                        required
                        placeholder="E.g., admin@shramiklink.com or 9876543210"
                        value={loginEmailOrPhone}
                        onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">পাছৱৰ্ড (Password)</label>
                        <span className="text-[9px] text-slate-400">Default is the role name</span>
                      </div>
                      <input 
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div className="text-right">
                      <button
                        type="button"
                        onClick={() => {
                          setResetStep('request');
                          setResetEmailOrPhone(loginEmailOrPhone);
                        }}
                        className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                      >
                        পাছৱৰ্ড পাহৰি গৈছে? (Forgot Password?)
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer text-center mt-1"
                    >
                      সুৰক্ষিতভাৱে প্ৰৱেশ কৰক (Enter Secure Session)
                    </button>
                  </form>
                )}

                {/* Form: REGISTER */}
                {authTab === 'register' && (
                  <form onSubmit={handleRequestOtp} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">পূৰ্ণ নাম (Full Name)</label>
                      <input 
                        type="text"
                        required
                        placeholder="E.g., Bhaskar Senapati"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">মেইল আইডি / মোবাইল নম্বৰ (Email or 10-Digit Mobile)</label>
                      <input 
                        type="text"
                        required
                        placeholder="E.g., b_senapati@gmail.com or 8876543210"
                        value={registerEmailOrPhone}
                        onChange={(e) => setRegisterEmailOrPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">পাছৱৰ্ড নিৰ্বাচন কৰক (Set Portal Password)</label>
                      <input 
                        type="password"
                        required
                        placeholder="Choose password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">প্ৰৱেশাধিকাৰ পদবী (Select System Role)</label>
                      <select
                        value={registerRole}
                        onChange={(e: any) => setRegisterRole(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-500"
                      >
                        <option value="industry_admin">🏭 Industry Admin (ইণ্ডাষ্ট্ৰী এডমিন)</option>
                        <option value="contractor">🏢 Labor Contractor (লেবাৰ কন্ট্ৰেক্টৰ)</option>
                        <option value="worker">👷 Contract Worker (চুক্তিভিত্তিক শ্ৰমিক)</option>
                        <option value="government_inspector">⚖️ Government Inspector (চৰকাৰী পৰিদৰ্শক)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer text-center mt-1"
                    >
                      পঞ্জীয়ন সম্পূৰ্ণ কৰক (Complete Registration)
                    </button>
                  </form>
                )}

              </div>
            )}

          </div>

          {/* Right Column: Default Tester Accounts & Portals Guide (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Demo Access Credentials Card */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] bg-indigo-500 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  Developer Cheat-sheet
                </span>
                <h4 className="font-extrabold text-white text-sm">⚡ Quick Access Autofill</h4>
                <p className="text-[11px] text-slate-400">
                  Click any verified credentials row below to instantly autofill the credentials form for rapid testing.
                </p>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: '🏭 Industry Principal', email: 'admin@shramiklink.com', pass: 'admin', phone: '9876543210' },
                  { label: '🏢 Licensed Contractor', email: 'contractor@shramiklink.com', pass: 'contractor', phone: '9876543211' },
                  { label: '👷 Contract Worker', email: 'worker@shramiklink.com', pass: 'worker', phone: '9876543212' },
                  { label: '⚖️ Government Inspector', email: 'inspector@shramiklink.com', pass: 'inspector', phone: '9876543213' }
                ].map((cred, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      setLoginEmailOrPhone(cred.email);
                      setLoginPassword(cred.pass);
                      showNotice(`Autofilled ${cred.label} credentials! Click Login to enter.`, 'info');
                    }}
                    className="w-full text-left bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 p-3 rounded-2xl hover:border-slate-700/80 transition-all flex justify-between items-center group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] text-indigo-400 font-bold block">{cred.label}</span>
                      <div className="text-[11px] text-slate-300 font-mono flex flex-col">
                        <span>Mail: {cred.email}</span>
                        <span>Phone: {cred.phone}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1.5 shrink-0">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono block">Pass: {cred.pass}</span>
                      <span className="text-[9px] text-slate-500 group-hover:text-indigo-400 transition-colors block">Use Mail/Phone →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Framework Core Specs */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold text-slate-950 text-sm flex items-center gap-2">
                <span>🛡️</span> Dual-Verification Framework
              </h4>
              <ul className="space-y-2 text-[11px] text-slate-600 list-disc list-inside">
                <li><strong className="text-slate-800">Section 21 Compliance:</strong> Real-time audit on EPF code, ESI registry, and Minimum Wage margins.</li>
                <li><strong className="text-slate-800">Double-Locking Bills:</strong> Prevents salary leakage. Bills must align mathematically with biometric attendance hours.</li>
                <li><strong className="text-slate-800">Aadhaar Simulators:</strong> Allows contract workers to log shifts synchronously using Simulated One-Time Passwords.</li>
              </ul>
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
                {currentRole === 'industry_admin' ? t.industryAdmin :
                 currentRole === 'contractor' ? t.contractor :
                 currentRole === 'worker' ? t.worker :
                 t.inspector}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {currentRole === 'industry_admin' && t.industryAdminDesc}
              {currentRole === 'contractor' && t.contractorDesc}
              {currentRole === 'worker' && t.workerDesc}
              {currentRole === 'government_inspector' && t.inspectorDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Pan-India Language Selector in Session Bar */}
          <LanguageSelector 
            currentLang={currentLang} 
            onLanguageChange={handleLangChange} 
            variant="header" 
          />

          <PWAInstallButton />

          <button 
            onClick={handleResetState}
            title="Restore original data"
            className="text-xs text-slate-400 hover:text-rose-400 font-bold px-2.5 py-1.5 border border-slate-800 hover:border-rose-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t.restoreData}</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t.logout}
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
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Inspecting Industry Tenant</label>
                <select 
                  value={selectedIndustryId} 
                  onChange={(e) => setSelectedIndustryId(e.target.value)}
                  className="font-bold text-slate-800 text-base bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500 transition-colors w-full md:w-auto"
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

              <button 
                onClick={handleLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 self-stretch md:self-auto justify-center shrink-0"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                লগ আউট কৰক (Log Out)
              </button>
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

            {/* Industry Plant Statutory Challan & Compliance Action Bar */}
            <div className="bg-emerald-950 text-white rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded">
                    Principal Employer Statutory Portal
                  </span>
                  <span className="text-xs text-emerald-300 font-mono">LIN: {activeIndustry.lin}</span>
                </div>
                <h3 className="font-bold text-base text-white">
                  {activeIndustry.name} - শ্ৰমিকভিত্তিক EPF & ESI চালান নিৰীক্ষণ (Worker-Wise Challan Audit)
                </h3>
                <p className="text-xs text-emerald-200">
                  এই কাৰখানাত নিয়োজিত সকলো শ্ৰমিকৰ নাম, UAN, কামৰ দিন আৰু জমা কৰা EPF/ESIC চালান পৰীক্ষা কৰক।
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setChallanTargetIndustry(selectedIndustryId);
                    setIsChallanModalOpen(true);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  এই প্লাণ্টৰ শ্ৰমিকভিত্তিক PF & ESI চালান চাওক (Inspect Plant Challan)
                </button>
              </div>
            </div>

            {/* Action Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Daily Requirements Posting */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Plus className="text-indigo-600 h-4 w-4" />
                    Labor Requisitions (শ্ৰমিকৰ দৈনিক চাহিদা)
                  </h4>
                  <button 
                    onClick={() => setIsRequirementModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-2.5 py-1.5 rounded transition-all"
                  >
                    Post Requirement
                  </button>
                </div>

                {/* Contractor Filter Dropdown */}
                <div className="flex items-center justify-between gap-2 bg-slate-50 border border-slate-150 p-2.5 rounded-lg text-xs">
                  <span className="font-bold text-slate-500">ঠিকাদাৰ বাছক (Filter Contractor):</span>
                  <select
                    value={requisitionContractorFilter}
                    onChange={(e) => setRequisitionContractorFilter(e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2 py-1 outline-none font-semibold text-slate-700 focus:border-indigo-500"
                  >
                    <option value="ALL">সকলো ঠিকাদাৰ (All Contractors)</option>
                    {contractors.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto">
                  {(() => {
                    const filteredReqs = requirements
                      .filter(r => r.industryId === selectedIndustryId)
                      .filter(r => requisitionContractorFilter === 'ALL' || r.contractorId === requisitionContractorFilter);

                    if (filteredReqs.length === 0) {
                      return (
                        <div className="text-center py-8 text-slate-400 text-xs italic">
                          এই ঠিকাদাৰৰ বাবে কোনো দৈনিক চাহিদা লিখা হোৱা নাই। (No requirements posted for this contractor.)
                        </div>
                      );
                    }

                    return filteredReqs.map(req => (
                      <div key={req.id} className="border border-slate-150 rounded-lg p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-indigo-50 text-indigo-800 font-bold text-[10px] uppercase px-2 py-0.5 rounded border border-indigo-100">
                            {req.skillType}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            req.status === 'Open' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 flex justify-between">
                          <span>Required: <strong className="text-slate-800 font-bold">{req.workersNeeded} Workers</strong></span>
                          <span>Shift: <strong className="text-slate-700 font-medium">{req.shiftTiming.split(' ')[0]}</strong></span>
                        </div>
                        <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-1.5 mt-1 flex justify-between items-center">
                          <span>ঠিকাদাৰ (Contractor):</span>
                          <span className="font-semibold text-slate-600 truncate max-w-[150px]">
                            {contractors.find(c => c.id === req.contractorId)?.name || 'General Pool'}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
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
                              <button 
                                onClick={() => {
                                  setSelectedInvoiceBill(bill);
                                  setIsInvoicePreviewOpen(true);
                                }}
                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-2.5 py-1.5 rounded transition-all flex items-center gap-1"
                              >
                                <Receipt className="h-3.5 w-3.5" /> Tax Invoice
                              </button>
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

            {/* STATUTORY CONTRACT ALLOTMENTS & WORKER QUOTAS MANAGER */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="text-indigo-600 h-5 w-5" />
                    চুক্তি আৱণ্টন আৰু শ্ৰমিক ক’টা নিয়ন্ত্ৰণ (Contract Allotments & Worker Quotas)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage active labor contractor assignments, restrict max worker deployment quotas, track contract values, and enforce compliance validity.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewAllotment(prev => ({ ...prev, industryId: selectedIndustryId }));
                    setIsAddingAllotment(!isAddingAllotment);
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  নতুন আৱণ্টন যোগ কৰক (Add Allotment)
                </button>
              </div>

              {/* Form to Add New Allotment */}
              {isAddingAllotment && (
                <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 space-y-4 animate-fadeIn">
                  <span className="font-extrabold text-slate-800 text-xs block uppercase tracking-wider text-indigo-600">
                    নতুন কণ্ট্ৰেক্ট আৱণ্টন প্ৰপত্ৰ (New Allotment Form)
                  </span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1.5">ঠিকাদাৰ প্ৰতিষ্ঠান (Select Contractor):</label>
                      <select
                        value={newAllotment.contractorId}
                        onChange={(e) => setNewAllotment(prev => ({ ...prev, contractorId: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 outline-none focus:border-indigo-600"
                      >
                        {contractors.map(c => (
                          <option key={c.id} value={c.id}>{c.name} (CLRA: {c.licenseNo.split('-')[0]})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1.5">সৰ্বোচ্চ শ্ৰমিকৰ ক’টা (Max Worker Quota):</label>
                      <input
                        type="number"
                        min={1}
                        value={newAllotment.allottedWorkers}
                        onChange={(e) => setNewAllotment(prev => ({ ...prev, allottedWorkers: Math.max(1, Number(e.target.value)) }))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700 outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1.5">চুক্তিৰ মূল্য (Contract Value in ₹):</label>
                      <input
                        type="number"
                        min={1000}
                        value={newAllotment.contractValue}
                        onChange={(e) => setNewAllotment(prev => ({ ...prev, contractValue: Math.max(0, Number(e.target.value)) }))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700 outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2">
                      <label className="block text-slate-600 font-bold mb-1.5">কামৰ চমু বিৱৰণ (Work/Scope Description):</label>
                      <input
                        type="text"
                        placeholder="e.g. Electrical Maintenance / Loading Yards / General Packing"
                        value={newAllotment.workDescription}
                        onChange={(e) => setNewAllotment(prev => ({ ...prev, workDescription: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 font-semibold text-slate-700 outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-bold mb-1.5">চুক্তিৰ ম্যাদ উকলিব লগা তাৰিখ (Valid Until):</label>
                      <input
                        type="date"
                        value={newAllotment.validUntil}
                        onChange={(e) => setNewAllotment(prev => ({ ...prev, validUntil: e.target.value }))}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 font-semibold text-slate-700 outline-none focus:border-indigo-600 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 text-xs">
                    <button
                      onClick={() => setIsAddingAllotment(false)}
                      className="text-slate-500 font-bold px-4 py-2 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      বাতিল কৰক (Cancel)
                    </button>
                    <button
                      onClick={() => {
                        if (!newAllotment.workDescription) {
                          showNotice('অনুগ্ৰহ কৰি কামৰ বিৱৰণ লিখক! (Please write work description)', 'error');
                          return;
                        }
                        const allotmentObj = {
                          ...newAllotment,
                          id: 'alot-' + Date.now()
                        };
                        setAllotments(prev => [allotmentObj, ...prev]);
                        setIsAddingAllotment(false);
                        setNewAllotment({
                          contractorId: 'con-1',
                          industryId: 'ind-1',
                          allottedWorkers: 50,
                          contractValue: 100000,
                          validUntil: '2026-12-31',
                          workDescription: 'General Maintenance & Packing',
                          status: 'Active'
                        });
                        showNotice('চুক্তি আৱণ্টন আৰু শ্ৰমিক ক’টা সফলতাৰে সংৰক্ষণ কৰা হৈছে! (Contract allotment successfully created!)', 'success');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-5 py-2.5 rounded-lg transition-all shadow-xs"
                    >
                      প্ৰতিষ্ঠা কৰক (Confirm Allotment)
                    </button>
                  </div>
                </div>
              )}

              {/* Allotments Overview List */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200/80">
                    <tr>
                      <th className="p-3">ঠিকাদাৰ প্ৰতিষ্ঠান (Contractor Agency)</th>
                      <th className="p-3">আৱণ্টিত শ্ৰমিক ক’টা (Quota)</th>
                      <th className="p-3">নিয়োজিত শ্ৰমিক (Active Deploy)</th>
                      <th className="p-3">চুক্তিৰ মূল্য (Contract Value)</th>
                      <th className="p-3">কামৰ বিৱৰণ (Scope of Work)</th>
                      <th className="p-3 font-mono text-center">বৈধতা (Validity)</th>
                      <th className="p-3 text-center">স্থিতি (Status)</th>
                      <th className="p-3 text-right">একশ্যন (Action)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allotments.filter(al => al.industryId === selectedIndustryId).length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400 italic">
                          এই প্লাণ্টত কোনো ঠিকাদাৰৰ বাবে এতিয়ালৈকে কোনো সক্ৰিয় চুক্তি আৱণ্টন কৰা হোৱা ない।
                        </td>
                      </tr>
                    ) : (
                      allotments
                        .filter(al => al.industryId === selectedIndustryId)
                        .map(al => {
                          const contractor = contractors.find(c => c.id === al.contractorId);
                          const activeDeployedCount = assignments.filter(
                            as => as.contractorId === al.contractorId && as.industryId === selectedIndustryId && as.status === 'Active'
                          ).length;
                          
                          const isNearLimit = activeDeployedCount >= al.allottedWorkers;
                          const isExpired = new Date(al.validUntil) < new Date('2026-09-05');

                          return (
                            <tr key={al.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-3">
                                <span className="font-extrabold text-slate-900 block">{contractor?.name || 'Unknown'}</span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">Lic: {contractor?.licenseNo}</span>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-800 text-sm">
                                {al.allottedWorkers} জন
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-mono font-extrabold text-sm ${isNearLimit ? 'text-amber-600' : 'text-slate-800'}`}>
                                    {activeDeployedCount}
                                  </span>
                                  <span className="text-slate-400">/</span>
                                  <span className="text-xs text-slate-400 font-mono">{al.allottedWorkers}</span>
                                </div>
                                <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                                  <div 
                                    className={`h-full rounded-full ${isNearLimit ? 'bg-amber-500' : 'bg-indigo-600'}`} 
                                    style={{ width: `${Math.min(100, (activeDeployedCount / al.allottedWorkers) * 100)}%` }}
                                  />
                                </div>
                              </td>
                              <td className="p-3 font-mono font-extrabold text-emerald-700 text-sm">
                                ₹{al.contractValue.toLocaleString()}
                              </td>
                              <td className="p-3 font-medium text-slate-700 max-w-[150px] truncate">
                                {al.workDescription}
                              </td>
                              <td className="p-3 font-mono text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isExpired ? 'bg-rose-50 text-rose-800 border border-rose-150' : 'bg-slate-100 text-slate-600'}`}>
                                  {al.validUntil}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                                  al.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}>
                                  <span className={`h-1.5 w-1.5 rounded-full ${al.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                  {al.status}
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => {
                                      const updated = allotments.map(item => {
                                        if (item.id === al.id) {
                                          const nextStatus = item.status === 'Active' ? 'Suspended' as const : 'Active' as const;
                                          showNotice(
                                            `আৱণ্টন স্থিতি পৰিৱৰ্তন কৰা হৈছে: ${nextStatus}! (Allotment status set to ${nextStatus})`,
                                            'info'
                                          );
                                          return { ...item, status: nextStatus };
                                        }
                                        return item;
                                      });
                                      setAllotments(updated);
                                    }}
                                    className={`px-2.5 py-1.5 rounded text-[10px] font-bold transition-all ${
                                      al.status === 'Active' 
                                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40' 
                                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/40'
                                    }`}
                                  >
                                    {al.status === 'Active' ? 'Suspended কৰক' : 'Active কৰক'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm('আপুনি এই আৱণ্টনটো ডিলিট কৰিব বিচাৰে নেকি? (Are you sure you want to delete this allotment?)')) {
                                        setAllotments(prev => prev.filter(item => item.id !== al.id));
                                        showNotice('আৱণ্টন ডিলিট কৰা হৈছে। (Allotment deleted.)', 'info');
                                      }
                                    }}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                                    title="Delete Allotment"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
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
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-400 tracking-wider uppercase mb-1">Contractor Business Account</label>
                <select 
                  value={selectedContractorId} 
                  onChange={(e) => setSelectedContractorId(e.target.value)}
                  className="font-bold text-slate-800 text-lg bg-white border border-slate-200 rounded px-3 py-1.5 outline-none focus:border-indigo-500 w-full md:w-auto"
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

              <button 
                onClick={handleLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 self-stretch md:self-auto justify-center shrink-0"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                লগ আউট কৰক (Log Out)
              </button>
            </div>

            {/* CONTRACTOR'S INDUSTRY-WISE WORK & DEPLOYMENT SUMMARY */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Factory className="text-indigo-600 h-5 w-5" />
                    কণ্ট্ৰেক্টৰৰ ইণ্ডাষ্ট্ৰীভিত্তিক কাম আৰু ম্যান-ডে’জ খতিয়ান (Industry-Wise Work & Man-Days Records)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    প্ৰতিটো কাৰখানা/ইণ্ডাষ্ট্ৰীত কৰা কাম, সম্পন্ন হোৱা কৰ্মদিন (Man-Days), অভাৰটাইম ঘণ্টা আৰু উপাৰ্জিত মজুৰিৰ সুকীয়া খতিয়ান।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    onClick={() => {
                      setSummaryTargetIndustry('ALL');
                      setIsWorkSummaryModalOpen(true);
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="h-4 w-4 text-slate-600" />
                    কৰ্ম-খতিয়ান প্ৰিন্ট / ডাউনলোড
                  </button>

                  <button 
                    onClick={() => {
                      setChallanTargetIndustry(industries[0]?.id || 'ind-1');
                      setIsChallanModalOpen(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    ইণ্ডাষ্ট্ৰীভিত্তিক PF & EIC চালান জেনেৰেটৰ
                  </button>
                </div>
              </div>

              {/* Cards for each Industry */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getContractorIndustrySummary(selectedContractorId).map(summary => (
                  <div key={summary.industry.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all space-y-3 shadow-2xs">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-bold text-xs text-slate-800 block flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                          {summary.industry.name}
                        </span>
                        <span className="text-[10px] text-slate-500">{summary.industry.location} • LIN: {summary.industry.lin}</span>
                      </div>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-100">
                        {summary.assignedCount} জন শ্ৰমিক
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-200/60 text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">মুঠ কৰ্মদিন</span>
                        <span className="text-sm font-extrabold text-slate-800">{summary.totalManDays} Shifts</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">কামৰ ঘণ্টা / OT</span>
                        <span className="text-sm font-extrabold text-slate-800">{summary.totalStdHours}h {summary.totalOtHours > 0 ? `+${summary.totalOtHours}h` : ''}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">উপাৰ্জিত মজুৰি</span>
                        <span className="text-sm font-extrabold text-emerald-700">₹{summary.totalWages.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[10px]">
                        <span className="text-slate-400">বিল স্থিতি: </span>
                        {summary.bill ? (
                          <span className={`font-bold ${summary.bill.status === 'Approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {summary.bill.status}
                          </span>
                        ) : (
                          <span className="text-slate-500 font-medium">Ready to Bill</span>
                        )}
                      </div>

                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => {
                            setSummaryTargetIndustry(summary.industry.id);
                            setIsWorkSummaryModalOpen(true);
                          }}
                          title="View & Print Statement"
                          className="text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2 py-1 rounded hover:bg-slate-100 transition-all flex items-center gap-1"
                        >
                          <Printer className="h-3 w-3" /> খতিয়ান
                        </button>
                        <button 
                          onClick={() => {
                            setChallanTargetIndustry(summary.industry.id);
                            setIsChallanModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded hover:bg-indigo-100 transition-all flex items-center gap-1"
                        >
                          <FileSpreadsheet className="h-3 w-3" /> PF/ESI চালান
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DAILY LABOUR REQUISITIONS FOR CONTRACTOR */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Briefcase className="text-indigo-600 h-5 w-5" />
                    দৈনিক শ্ৰমিক চাহিদা (Daily Labour Requisitions)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    উদ্যোগসমূহৰ পৰা অহা সক্ৰিয় শ্ৰমিকৰ চাহিদা আৰু যোগানৰ অগ্ৰগতি পৰীক্ষা কৰক। (Track live labour requirements requested by manufacturing plants.)
                  </p>
                </div>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                  {requirements.filter(r => r.contractorId === selectedContractorId && r.status === 'Open').length} সক্ৰিয় চাহিদা (Active)
                </span>
              </div>

              {(() => {
                const activeReqs = requirements.filter(r => r.contractorId === selectedContractorId && r.status === 'Open');
                
                if (activeReqs.length === 0) {
                  return (
                    <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs italic">
                      আপোনাৰ বাবে কোনো সক্ৰিয় শ্ৰমিক চাহিদা নাই। (No active labor requirements are currently posted for your agency.)
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeReqs.map(req => {
                      const fulfilledCount = assignments.filter(a => {
                        if (a.industryId !== req.industryId || a.contractorId !== req.contractorId || a.status !== 'Active') {
                          return false;
                        }
                        const worker = workers.find(w => w.id === a.workerId);
                        return worker?.skillType === req.skillType;
                      }).length;

                      const pct = Math.min(100, Math.round((fulfilledCount / req.workersNeeded) * 100));

                      return (
                        <div key={req.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all space-y-3.5 shadow-2xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-xs text-slate-800 block">
                                {req.industryName}
                              </span>
                              <span className="text-[10px] text-slate-400">{req.shiftTiming}</span>
                            </div>
                            <span className="bg-indigo-50 text-indigo-800 font-bold text-[9px] uppercase px-2 py-0.5 rounded border border-indigo-100">
                              {req.skillType}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                              <span>যোগানৰ স্থিতি (Fulfillment):</span>
                              <span>{fulfilledCount} / {req.workersNeeded} শ্ৰমিক (Workers)</span>
                            </div>
                            
                            {/* Fulfillment Progress Bar */}
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>অগ্ৰগতি (Progress)</span>
                              <span>{pct}% Completed</span>
                            </div>
                          </div>

                          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs">
                            <span className="text-[10px] text-slate-400 font-mono">Date: {req.date}</span>
                            <button
                              onClick={() => {
                                // Set deployment form target industry and shift to make it easy for contractor
                                setDeploymentIndustryId(req.industryId);
                                setDeploymentShift(req.shiftTiming);
                                // Scroll to deployment board
                                const el = document.getElementById('deployment-board');
                                if (el) {
                                  el.scrollIntoView({ behavior: 'smooth' });
                                }
                                showNotice(`Deployment presets configured for ${req.industryName}. Choose a worker to deploy!`, 'info');
                              }}
                              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline text-[11px]"
                            >
                              শ্ৰমিক পঠাওক (Deploy Workers) →
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* CRUCIAL FEATURE: MULTI-INDUSTRY LIVE TRACKING & DEPLOYMENT MODULE */}
            <div id="deployment-board" className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Users className="text-indigo-600 h-5 w-5" />
                    Multi-Industry Deployment Board (কাৰখানাভিত্তিক শ্ৰমিক নিয়োজন বোৰ্ড)
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
                                  className="w-full border border-slate-200 p-1 rounded font-bold text-slate-700 bg-white"
                                >
                                  {allotments
                                    .filter(al => al.contractorId === selectedContractorId && al.status === 'Active')
                                    .map(al => {
                                      const ind = industries.find(i => i.id === al.industryId);
                                      if (!ind) return null;
                                      return (
                                        <option key={ind.id} value={ind.id}>{ind.name.split(' ')[0]} (Quota: {al.allottedWorkers})</option>
                                      );
                                    })}
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] text-slate-500 mb-1">Shift Timing</label>
                                <select 
                                  value={deploymentShift}
                                  onChange={(e) => setDeploymentShift(e.target.value)}
                                  className="w-full border border-slate-200 p-1 rounded font-semibold text-slate-700 bg-white"
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
                                const activeAllots = allotments.filter(al => al.contractorId === selectedContractorId && al.status === 'Active');
                                if (activeAllots.length > 0) {
                                  setDeploymentIndustryId(activeAllots[0].industryId);
                                }
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

                {/* Dynamically render contractor's allotted industries next to idle pool */}
                {allotments
                  .filter(al => al.contractorId === selectedContractorId && al.status === 'Active')
                  .map(al => {
                    const ind = industries.find(i => i.id === al.industryId);
                    if (!ind) return null;
                    const count = assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === ind.id && a.status === 'Active').length;
                    const isOverQuota = count >= al.allottedWorkers;
                    
                    return (
                      <div key={al.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3 shadow-2xs">
                        <div className="font-bold text-xs uppercase tracking-wider flex flex-col gap-1">
                          <div className="flex justify-between items-center text-indigo-700">
                            <span className="truncate max-w-[130px] font-extrabold flex items-center gap-1">
                              🏭 {ind.name.split(' ')[0]}
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${isOverQuota ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>
                              {count} / {al.allottedWorkers}
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-400 normal-case font-semibold block truncate">
                            Limit: {al.allottedWorkers} Workers • {al.workDescription}
                          </span>
                        </div>
                        <div className="space-y-3 max-h-[350px] overflow-y-auto">
                          {assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === ind.id && a.status === 'Active').length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-[10px] italic">
                              No workers active here.
                            </div>
                          ) : (
                            assignments.filter(a => a.contractorId === selectedContractorId && a.industryId === ind.id && a.status === 'Active').map(asg => {
                              const wrkObj = workers.find(w => w.id === asg.workerId);
                              if (!wrkObj) return null;
                              return (
                                <div key={asg.id} className="bg-white border border-slate-150 p-2.5 rounded hover:border-indigo-300 transition-all space-y-2">
                                  <div>
                                    <span className="font-semibold text-slate-800 text-xs block">{wrkObj.name}</span>
                                    <span className="text-[9px] text-slate-500 block font-medium mt-0.5">Shift: {asg.shiftTiming.split(' ')[0]}</span>
                                    <span className="text-[9px] text-slate-400">Wage: ₹{wrkObj.dailyWageRate}/day</span>
                                  </div>
                                  <button 
                                    onClick={() => handleRecallWorker(asg.id)}
                                    className="w-full text-center text-rose-600 hover:text-white border border-rose-200 hover:bg-rose-600 text-[9px] font-bold py-1 rounded uppercase transition-all"
                                  >
                                    Recall Worker
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}

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

                        {!compliance.compliant && (
                          <div className="pt-2">
                            <button 
                              onClick={handleUploadMissingChallan}
                              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-extrabold"
                            >
                              <Upload className="h-4 w-4 animate-bounce" /> চৰকাৰী চালান আপলোড কৰি আনলক কৰক (Upload Missing Challans & Unlock)
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  }

                  const currentBillingBreakdown = getIndustryBillingBreakdown(selectedContractorId, billTargetIndustry, billMonth);
                  const effectiveBaseWage = billCalculationMode === 'auto'
                    ? (currentBillingBreakdown.totalWageSum > 0 ? currentBillingBreakdown.totalWageSum : billBaseWage)
                    : billBaseWage;
                  const effectiveCommission = Math.round(effectiveBaseWage * (billCommissionPct / 100));
                  const effectiveTaxable = effectiveBaseWage + effectiveCommission;
                  const effectiveCgst = Math.round(effectiveTaxable * 0.09);
                  const effectiveSgst = Math.round(effectiveTaxable * 0.09);
                  const effectiveGst = effectiveCgst + effectiveSgst;
                  const effectiveGrandTotal = effectiveTaxable + effectiveGst;

                  const contractorSubmittedBills = bills.filter(b => b.contractorId === selectedContractorId);

                  return (
                    <div className="space-y-6">
                        {/* Compliance Status Notice */}
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-4 text-xs flex items-center justify-between gap-3 shadow-2xs">
                          <div className="flex items-center gap-2.5">
                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                              <CheckCircle className="h-5 w-5 shrink-0" />
                            </div>
                            <div>
                              <strong className="block font-bold text-emerald-950">✓ Statutory Compliance Unlocked (আইনী চৰ্ত সত্যান্বিত)</strong>
                              <span className="block mt-0.5 text-emerald-800 text-[11px]">
                                পূৰ্বৰ মাহৰ EPF, ESI, আৰু GST ৰিটাৰ্ণ পৰীক্ষা কৰা হৈছে। কাৰখানা অনুসাৰে স্বয়ংক্ৰিয় বিল সৃষ্টিৰ অনুমতি সক্ৰিয়।
                              </span>
                            </div>
                          </div>
                          <span className="hidden sm:inline-block font-mono text-[10px] bg-white border border-emerald-200 px-2.5 py-1 rounded text-emerald-800 font-bold">
                            SAC: 998513 / GST Ready
                          </span>
                        </div>

                        {/* Bill Creator Form */}
                        <form onSubmit={handleSubmitBill} className="space-y-5 text-xs">
                          {/* Industry & Month Selection */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-slate-700 font-bold mb-1">
                                কাৰখানা / ক্লায়েণ্ট নিৰ্বাচন (Target Manufacturing Client):
                              </label>
                              <select 
                                value={billTargetIndustry}
                                onChange={(e) => setBillTargetIndustry(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-800 p-2.5 rounded-lg outline-none focus:border-indigo-600 focus:bg-white transition-all"
                              >
                                {industries.map(ind => (
                                  <option key={ind.id} value={ind.id}>{ind.name} ({ind.location})</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-slate-700 font-bold mb-1">
                                বিলৰ মাহ (Billing Month):
                              </label>
                              <select 
                                value={billMonth}
                                onChange={(e) => setBillMonth(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-300 font-bold text-slate-800 p-2.5 rounded-lg outline-none focus:border-indigo-600 focus:bg-white transition-all"
                              >
                                <option value="August 2026">August 2026</option>
                                <option value="September 2026">September 2026</option>
                                <option value="July 2026">July 2026</option>
                              </select>
                            </div>
                          </div>

                          {/* Mode Selector & Live Attendance Feed */}
                          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-3.5">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                              <div className="flex items-center gap-2">
                                <Calculator className="h-4 w-4 text-indigo-600" />
                                <span className="font-bold text-slate-800 text-xs">
                                  বিল গণনাৰ ধৰণ (Calculation Engine Mode):
                                </span>
                              </div>

                              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-[11px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => setBillCalculationMode('auto')}
                                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                                    billCalculationMode === 'auto'
                                      ? 'bg-indigo-600 text-white shadow-2xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  <Zap className="h-3 w-3" />
                                  ⚡ উপস্থিতিৰ পৰা স্বয়ংক্ৰিয় (Auto Attendance)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setBillCalculationMode('custom')}
                                  className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                                    billCalculationMode === 'custom'
                                      ? 'bg-indigo-600 text-white shadow-2xs'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  ✏️ কাষ্টম সালসলনি (Manual Override)
                                </button>
                              </div>
                            </div>

                            {/* Quick Metrics of Labour Supplied */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px] pt-1">
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold">যোগান দিয়া শ্ৰমিক</span>
                                <span className="font-extrabold text-slate-800 text-sm">{currentBillingBreakdown.workerRows.length} জন শ্ৰমিক</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold">মুঠ উপস্থিতি (Attendance)</span>
                                <span className="font-extrabold text-indigo-700 text-sm">{currentBillingBreakdown.totalAttendance} Shifts</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold">মুঠ শ্ৰমিকৰ মজুৰি</span>
                                <span className="font-extrabold text-emerald-700 text-sm">₹{effectiveBaseWage.toLocaleString()}</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                                <span className="text-slate-400 block text-[9px] uppercase font-bold">কণ্ট্ৰেক্টৰ মাৰ্জিন ({billCommissionPct}%)</span>
                                <span className="font-extrabold text-amber-700 text-sm">₹{effectiveCommission.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Itemized Worker Schedule */}
                            {currentBillingBreakdown.workerRows.length > 0 && (
                              <div className="border border-indigo-100 rounded-lg bg-white overflow-hidden text-[11px]">
                                <div className="bg-slate-50 px-3 py-1.5 font-bold text-slate-700 border-b border-slate-100 flex justify-between items-center text-[10px] uppercase tracking-wider">
                                  <span>কাৰখানাত যোগান ধৰা শ্ৰমিকৰ উপস্থিতি আৰু মজুৰিৰ সূচী (Schedule):</span>
                                  <span className="text-indigo-600 font-mono font-normal">Attendance × Daily Rate</span>
                                </div>
                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100">
                                  {currentBillingBreakdown.workerRows.map(row => (
                                    <div key={row.worker.id} className="p-2 flex items-center justify-between hover:bg-slate-50">
                                      <div>
                                        <span className="font-bold text-slate-800">{row.worker.name}</span>
                                        <span className="text-[10px] text-slate-400 ml-1.5">({row.worker.skillType})</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-right font-mono">
                                        <span className="text-slate-600">{row.daysWorked} দিন × ₹{row.dailyRate}</span>
                                        {row.otHours > 0 && <span className="text-amber-600 font-semibold text-[10px]">(+{row.otHours}h OT)</span>}
                                        <span className="font-bold text-slate-900 w-16 text-right">₹{row.totalWage.toLocaleString()}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Manual adjustment fields if custom mode */}
                          {billCalculationMode === 'custom' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
                              <div>
                                <label className="block text-slate-700 font-semibold mb-1">
                                  মুঠ শ্ৰমিকৰ মজুৰি (Total Labour Wages in ₹):
                                </label>
                                <input 
                                  type="number" 
                                  value={billBaseWage}
                                  onChange={(e) => setBillBaseWage(Math.max(0, Number(e.target.value)))}
                                  className="w-full bg-white border border-slate-300 font-bold p-2 rounded-lg outline-none focus:border-indigo-600" 
                                />
                              </div>
                              <div>
                                <label className="block text-slate-700 font-semibold mb-1">
                                  কণ্ট্ৰেক্টৰ কমিছনৰ হাৰ % (Commission Percentage):
                                </label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={billCommissionPct}
                                    onChange={(e) => setBillCommissionPct(Math.max(0, Number(e.target.value)))}
                                    className="w-24 bg-white border border-slate-300 font-bold p-2 rounded-lg outline-none focus:border-indigo-600" 
                                  />
                                  <span className="font-bold text-slate-500">% (ডিফল্ট ১০% কমিছন)</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Real-time 5-Step Mathematical Formula Breakdown (As per user prompt) */}
                          <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3.5 shadow-sm">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                              <span className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                                <FileSpreadsheet className="h-4 w-4 text-indigo-400" />
                                বিলৰ স্পষ্ট সূত্ৰ আৰু স্বয়ংক্ৰিয় হিচাপ (Automatic Billing Formula)
                              </span>
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                                SAC: 998513
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              {/* Step 1 */}
                              <div className="flex justify-between items-center bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
                                <div>
                                  <span className="text-slate-400 block text-[10px] font-bold">১. মুঠ শ্ৰমিকৰ মজুৰি (Total Labour Supply Wages):</span>
                                  <span className="text-slate-200 text-[11px] font-mono">
                                    উপস্থিতি ({currentBillingBreakdown.totalAttendance} Shifts) × শ্ৰমিকৰ প্ৰাপ্য মজুৰি
                                  </span>
                                </div>
                                <span className="font-mono font-extrabold text-white text-sm">
                                  ₹{effectiveBaseWage.toLocaleString()}
                                </span>
                              </div>

                              {/* Step 2 */}
                              <div className="flex justify-between items-center bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
                                <div>
                                  <span className="text-amber-400 block text-[10px] font-bold">২. শ্ৰমিকৰ মুঠ মজুৰিৰ ওপৰত কণ্ট্ৰেক্টৰ কমিছন ({billCommissionPct}%):</span>
                                  <span className="text-slate-300 text-[11px] font-mono">
                                    ₹{effectiveBaseWage.toLocaleString()} × {billCommissionPct}%
                                  </span>
                                </div>
                                <span className="font-mono font-extrabold text-amber-300 text-sm">
                                  + ₹{effectiveCommission.toLocaleString()}
                                </span>
                              </div>

                              {/* Step 3 */}
                              <div className="flex justify-between items-center bg-indigo-950/80 p-2.5 rounded-lg border border-indigo-800/80">
                                <div>
                                  <span className="text-indigo-300 block text-[10px] font-bold">৩. মুঠ কৰযোগ্য মূল্য (Subtotal Taxable Amount = ধাপ ১ + ২):</span>
                                  <span className="text-slate-300 text-[11px] font-mono">
                                    শ্ৰমিকৰ মজুৰি + কণ্ট্ৰেক্টৰ চাৰ্ভিচ মাচুল
                                  </span>
                                </div>
                                <span className="font-mono font-extrabold text-indigo-200 text-sm">
                                  ₹{effectiveTaxable.toLocaleString()}
                                </span>
                              </div>

                              {/* Step 4 */}
                              <div className="flex justify-between items-center bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/60">
                                <div>
                                  <span className="text-emerald-400 block text-[10px] font-bold">৪. চৰকাৰী জিএছটি ১৮% (Statutory 18% GST on Taxable Value):</span>
                                  <span className="text-slate-300 text-[11px] font-mono">
                                    ৯% CGST (₹{effectiveCgst.toLocaleString()}) + ৯% SGST (₹{effectiveSgst.toLocaleString()})
                                  </span>
                                </div>
                                <span className="font-mono font-extrabold text-emerald-300 text-sm">
                                  + ₹{effectiveGst.toLocaleString()}
                                </span>
                              </div>

                              {/* Step 5 */}
                              <div className="flex justify-between items-center bg-emerald-950 p-3 rounded-xl border border-emerald-600/60 mt-1">
                                <div>
                                  <span className="text-emerald-300 block text-[11px] font-black uppercase tracking-wider">
                                    ৫. সৰ্বমুঠ প্ৰাপ্য বিলৰ ধনৰাশি (Grand Total Claim = ধাপ ৩ + ৪):
                                  </span>
                                  <span className="text-slate-200 text-[10px]">
                                    (মজুৰি + ১০% কণ্ট্ৰেক্টৰ মাৰ্জিন) + ১৮% জিএছটি
                                  </span>
                                </div>
                                <span className="font-mono font-black text-emerald-300 text-base sm:text-lg">
                                  ₹{effectiveGrandTotal.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="text-[10px] text-slate-400 font-mono italic border-t border-slate-800 pt-2">
                              In Words: <strong className="text-slate-200 font-normal">{toIndianWords(effectiveGrandTotal)}</strong>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col sm:flex-row gap-3 pt-1">
                            <button 
                              type="button"
                              onClick={() => {
                                setSelectedInvoiceBill(null);
                                setIsInvoicePreviewOpen(true);
                              }}
                              className="flex-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                              <Printer className="h-4 w-4 text-slate-600" />
                              📄 Tax Invoice (কৰ চালান) প্ৰিভিউ আৰু প্ৰিণ্ট
                            </button>

                            <button 
                              type="submit" 
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                              <CheckCircle className="h-4 w-4" />
                              🚀 বিল জেনেৰেট কৰি ইণ্ডাষ্ট্ৰীলৈ দাখিল কৰক (Submit Bill)
                            </button>
                          </div>
                        </form>

                        {/* Archive of Contractor's Submitted Invoices */}
                        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-2xs mt-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
                                <Receipt className="text-indigo-600 h-4 w-4" />
                                কণ্ট্ৰেক্টৰে প্ৰেৰণ কৰা সকলো বিল আৰু ইনভয়েচ (Submitted Invoices & Archive)
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                বিভিন্ন কাৰখানাত দাখিল কৰা বিলৰ স্থিতি আৰু কৰ চালান (Tax Invoice) প্ৰিণ্ট কৰক।
                              </p>
                            </div>
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100">
                              {contractorSubmittedBills.length} খন বিল দাখিল কৰা হৈছে
                            </span>
                          </div>

                          {contractorSubmittedBills.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs">
                              এই কণ্ট্ৰেক্টৰে এতিয়ালৈকে কোনো বিল দাখিল কৰা নাই।
                            </div>
                          ) : (
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs text-slate-600">
                                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                                  <tr>
                                    <th className="p-3">বিল নম্বৰ / মাহ</th>
                                    <th className="p-3">কাৰখানা / ক্লায়েণ্ট</th>
                                    <th className="p-3 text-right">শ্ৰমিক মজুৰি</th>
                                    <th className="p-3 text-right">কমিছন (10%)</th>
                                    <th className="p-3 text-right">জিএছটি (18%)</th>
                                    <th className="p-3 text-right font-black">মুঠ বিল (₹)</th>
                                    <th className="p-3 text-center">স্থিতি</th>
                                    <th className="p-3 text-right">একশ্যন</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 font-mono">
                                  {contractorSubmittedBills.map(bill => {
                                    const clientInd = industries.find(i => i.id === bill.industryId);
                                    return (
                                      <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="p-3">
                                          <span className="font-bold text-slate-800 block">{bill.id.toUpperCase()}</span>
                                          <span className="text-[10px] text-slate-400 font-sans">{bill.month}</span>
                                        </td>
                                        <td className="p-3 font-sans">
                                          <span className="font-semibold text-slate-800 block">{clientInd?.name || bill.industryId}</span>
                                          <span className="text-[10px] text-slate-400">{clientInd?.location}</span>
                                        </td>
                                        <td className="p-3 text-right text-slate-700">
                                          ₹{bill.baseAmount.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-right text-amber-700">
                                          ₹{bill.serviceCharge.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-right text-emerald-700">
                                          ₹{bill.gstAmount.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-right font-extrabold text-slate-900">
                                          ₹{bill.totalAmount.toLocaleString()}
                                        </td>
                                        <td className="p-3 text-center font-sans">
                                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            bill.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                            bill.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                            'bg-amber-50 text-amber-700 border border-amber-200'
                                          }`}>
                                            {bill.status === 'Approved' ? '✓ Approved' : bill.status}
                                          </span>
                                        </td>
                                        <td className="p-3 text-right font-sans">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setSelectedInvoiceBill(bill);
                                              setIsInvoicePreviewOpen(true);
                                            }}
                                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition-all inline-flex items-center gap-1"
                                          >
                                            <Printer className="h-3.5 w-3.5" /> ইনভয়েচ
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
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

            {/* Contractor's Industry-Wise Attendance Register */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <UserCheck className="text-emerald-600 h-4 w-4" />
                    ইণ্ডাষ্ট্ৰীভিত্তিক শ্ৰমিকৰ দৈনিক উপস্থিতি ৰেজিষ্টাৰ (Industry-Wise Shift Attendance Register)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    প্ৰতিটো কাৰখানাৰ নাম উল্লেখ কৰি শ্ৰমিকসকলৰ উপস্থিতি আৰু অভাৰটাইম ঘণ্টা পৰিদৰ্শন কৰক।
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Filter className="h-3.5 w-3.5" /> ইণ্ডাষ্ট্ৰী বাছক:
                  </span>
                  <select
                    value={attendanceIndustryFilter}
                    onChange={(e) => setAttendanceIndustryFilter(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">সকলো ইণ্ডাষ্ট্ৰী / কাৰখানা (All Industries)</option>
                    {industries.map(ind => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-3">তাৰিখ (Date)</th>
                      <th className="p-3">শ্ৰমিকৰ নাম (Worker)</th>
                      <th className="p-3">কাৰখানা / ইণ্ডাষ্ট্ৰী (Industry Plant)</th>
                      <th className="p-3">ইন / আউট (In/Out)</th>
                      <th className="p-3 text-center">কামৰ ঘণ্টা</th>
                      <th className="p-3 text-center">অভাৰটাইম (OT)</th>
                      <th className="p-3 text-center">বায়’মেট্ৰিক নিৰীক্ষণ</th>
                      <th className="p-3 text-right">মজুৰি (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendance
                      .filter(a => a.contractorId === selectedContractorId)
                      .filter(a => attendanceIndustryFilter === 'ALL' || a.industryId === attendanceIndustryFilter)
                      .map(att => {
                        const ind = industries.find(i => i.id === att.industryId);
                        const wrk = workers.find(w => w.id === att.workerId);
                        const rate = wrk?.dailyWageRate || 650;
                        const otWage = (att.overtimeHours || 0) * (rate / 8) * 2;
                        const shiftWage = rate + otWage;

                        return (
                          <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="p-3 font-mono font-medium text-slate-700">{att.date}</td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{att.workerName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">UAN: {wrk ? getWorkerUAN(wrk) : 'N/A'}</span>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center gap-1 font-semibold text-[11px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md">
                                <Building2 className="h-3 w-3 text-indigo-600" />
                                {ind ? ind.name : 'Unknown Plant'}
                              </span>
                              <span className="block text-[9px] text-slate-400 mt-0.5">{ind?.location}</span>
                            </td>
                            <td className="p-3 font-mono text-[11px]">
                              <span className="text-emerald-700 font-semibold">{att.checkIn}</span> - <span className="text-slate-500">{att.checkOut || '17:00'}</span>
                            </td>
                            <td className="p-3 text-center font-semibold text-slate-700">{att.hoursWorked || 8} hrs</td>
                            <td className="p-3 text-center">
                              {att.overtimeHours > 0 ? (
                                <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                  +{att.overtimeHours} hrs
                                </span>
                              ) : (
                                <span className="text-slate-400 font-normal">--</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                <CheckCircle className="h-3 w-3" />
                                {att.verificationMethod === 'Biometric-Face' ? 'Face Match' : 'UIDAI OTP'}
                              </span>
                            </td>
                            <td className="p-3 text-right font-bold text-slate-800 font-mono">
                              ₹{Math.round(shiftWage).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contractor Payroll Register Sheets */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <FileSpreadsheet className="text-indigo-600 h-4 w-4" />
                    Contract Wages & EPF/ESI Compliant Payroll Sheets
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    শ্ৰমিকসকলৰ নাম, উপাৰ্জিত মজুৰি, আৰু চৰকাৰী নিয়ম অনুসৰি EPF (12%) আৰু ESI (0.75%) কৰ্তনৰ সম্পূৰ্ণ হিচাপ।
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={challanTargetIndustry}
                    onChange={(e) => setChallanTargetIndustry(e.target.value)}
                    className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
                  >
                    {industries.map(ind => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setIsChallanModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                    এই ইণ্ডাষ্ট্ৰীৰ PF/ESI চালান উলিয়াওক (Generate Challan)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Worker Details</th>
                      <th className="p-3">UAN / ESIC IP</th>
                      <th className="p-3">Skill Category</th>
                      <th className="p-3 font-mono">Daily Rate</th>
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
                      const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                      const daysPresent = wrkAttendance.length;
                      const otHours = wrkAttendance.reduce((acc, curr) => acc + curr.overtimeHours, 0);
                      
                      const baseWage = daysPresent * wrk.dailyWageRate;
                      const otPay = otHours * (wrk.dailyWageRate / 8) * 2;
                      const grossWage = baseWage + otPay;
                      const epf = Math.min(grossWage, 15000) * 0.12;
                      const esi = grossWage * 0.0075;
                      const netPay = grossWage - epf - esi;

                      return (
                        <tr key={wrk.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-semibold text-slate-800">{wrk.name}</td>
                          <td className="p-3 font-mono text-[10px] text-slate-500">
                            <div>UAN: {getWorkerUAN(wrk)}</div>
                            <div>IP: {getWorkerESIIP(wrk)}</div>
                          </td>
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

            {/* ==================== STATUTORY CLRA COMPLIANCE REGISTERS (RULES 75, 78) ==================== */}
            <div id="clra-registers-card" className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <ShieldCheck className="text-emerald-600 h-5 w-5" />
                    🔒 চৰকাৰী CLRA বিধিবদ্ধ পঞ্জীয়ন বহী (Government CLRA Statutory Registers)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    চুক্তি শ্ৰমিক (নিয়ন্ত্ৰণ আৰু উচ্ছেদ) কেন্দ্ৰীয় নিয়মাৱলী, ১৯৭১ (Rules 75, 78) অনুসৰি শ্ৰমিক ঠিকাদাৰৰ দ্বাৰা বাধ্যতামূলক সংৰক্ষণ।
                  </p>
                </div>
                
                <button
                  id="print-ledger-btn"
                  onClick={() => {
                    setActivePrintClraForm(selectedClraForm);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  বিস্তাৰিত লেজাৰ প্ৰিণ্ট / ডাউনলোড
                </button>
              </div>

              {/* Form Selector Tabs */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200/60">
                {[
                  { id: 'Form XIII', label: 'Form XIII', desc: 'Workmen Register' },
                  { id: 'Form XVI', label: 'Form XVI', desc: 'Muster Roll' },
                  { id: 'Form XVII', label: 'Form XVII', desc: 'Register of Wages' },
                  { id: 'Form XX', label: 'Form XX', desc: 'Deductions' },
                  { id: 'Form XXII', label: 'Form XXII', desc: 'Advances' },
                  { id: 'Form XXIII', label: 'Form XXIII', desc: 'Overtime' }
                ].map(form => (
                  <button
                    id={`clra-tab-${form.id.toLowerCase().replace(/\s+/g, '-')}`}
                    key={form.id}
                    onClick={() => setSelectedClraForm(form.id as any)}
                    className={`p-2.5 rounded-lg text-center transition-all ${
                      selectedClraForm === form.id
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/40'
                    }`}
                  >
                    <span className="block font-black text-xs">{form.label}</span>
                    <span className="block text-[9px] opacity-80 truncate">{form.desc}</span>
                  </button>
                ))}
              </div>

              {/* Active Form Screen Container */}
              <div className="border border-slate-150 rounded-xl overflow-hidden bg-slate-50/20">
                
                {/* Rule Reference Header */}
                <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 block font-mono">
                      {selectedClraForm === 'Form XIII' && 'Rule 75 - Register of Workmen Employed by Contractor'}
                      {selectedClraForm === 'Form XVI' && 'Rule 78(1)(a)(i) - Muster Roll Ledger'}
                      {selectedClraForm === 'Form XVII' && 'Rule 78(1)(a)(i) - Register of Wages'}
                      {selectedClraForm === 'Form XX' && 'Rule 78(1)(a)(ii) - Register of Deductions for Damage or Loss'}
                      {selectedClraForm === 'Form XXII' && 'Rule 78(1)(a)(ii) - Register of Advances'}
                      {selectedClraForm === 'Form XXIII' && 'Rule 78(1)(a)(iii) - Register of Overtime'}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm mt-0.5">
                      {selectedClraForm === 'Form XIII' && 'ফৰ্ম XIII: ঠিকাদাৰৰ দ্বাৰা নিয়োজিত শ্ৰমিকৰ পঞ্জীয়ন বহী'}
                      {selectedClraForm === 'Form XVI' && 'ফৰ্ম XVI: দৈনিক শ্ৰমিক উপস্থিতি ৰোল (Muster Roll)'}
                      {selectedClraForm === 'Form XVII' && 'ফৰ্ম XVII: শ্ৰমিকৰ মজুৰি আৰু কৰ্তন পঞ্জীয়ন বহী'}
                      {selectedClraForm === 'Form XX' && 'ফৰ্ম XX: কামৰ ক্ষতি বা লোকচানৰ ক্ষতিপূৰণ কর্তন বহী'}
                      {selectedClraForm === 'Form XXII' && 'ফৰ্ম XXII: শ্ৰমিকক প্ৰদান কৰা অগ্ৰিম ধনৰ খতিয়ান'}
                      {selectedClraForm === 'Form XXIII' && 'ফৰ্ম XXIII: শ্ৰমিকৰ অতিৰিক্ত কৰ্ম ঘণ্টা (অভাৰটাইম) বহী'}
                    </h4>
                  </div>

                  <div className="flex gap-2">
                    {/* Deduction or Advance adding buttons */}
                    {selectedClraForm === 'Form XX' && (
                      <button
                        id="add-clra-deduction-btn"
                        onClick={() => setIsAddingDeduction(true)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" /> নতুন কৰ্তন লিখক (Add Deduction)
                      </button>
                    )}
                    {selectedClraForm === 'Form XXII' && (
                      <button
                        id="add-clra-advance-btn"
                        onClick={() => setIsAddingAdvance(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-2xs"
                      >
                        <Plus className="h-3.5 w-3.5" /> নতুন অগ্ৰিম লিখক (Add Advance)
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Specific Tables */}
                <div className="overflow-x-auto">
                  {selectedClraForm === 'Form XIII' && (
                    <table id="clra-table-form-xiii" className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 border-r border-slate-150">ক্ৰমিক (Sl)</th>
                          <th className="p-3 border-r border-slate-150">শ্ৰমিকৰ নাম (Name)</th>
                          <th className="p-3 border-r border-slate-150">বয়স / লিংগ</th>
                          <th className="p-3 border-r border-slate-150">पितृ বা স্বামীৰ নাম</th>
                          <th className="p-3 border-r border-slate-150">কামৰ শ্ৰেণী (Designation)</th>
                          <th className="p-3 border-r border-slate-150">ঠিকনা (Present & Permanent)</th>
                          <th className="p-3 border-r border-slate-150">যোগদানৰ তাৰিখ</th>
                          <th className="p-3 text-center">স্বাক্ষৰ / টিপ চহী (Biometric Status)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => (
                          <tr key={wrk.id} className="hover:bg-slate-50/50">
                            <td className="p-3 border-r border-slate-150 font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-3 border-r border-slate-150">
                              <span className="font-extrabold text-slate-900 block">{wrk.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">UAN: {getWorkerUAN(wrk)}</span>
                            </td>
                            <td className="p-3 border-r border-slate-150 font-medium">32 / Male</td>
                            <td className="p-3 border-r border-slate-150">Late B. {wrk.name.split(' ')[1] || 'Kumar'}</td>
                            <td className="p-3 border-r border-slate-150 font-semibold text-slate-700">{wrk.skillType}</td>
                            <td className="p-3 border-r border-slate-150 text-[11px] text-slate-500 max-w-[180px] leading-relaxed">
                              Guwahati, Assam, India / PIN-781001
                            </td>
                            <td className="p-3 border-r border-slate-150 font-mono text-slate-600">{wrk.onboardingDate || '2026-04-12'}</td>
                            <td className="p-3 text-center">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <CheckCircle className="h-3 w-3" /> Aadhaar Verified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {selectedClraForm === 'Form XVI' && (
                    <table id="clra-table-form-xvi" className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 border-r border-slate-150">Sl</th>
                          <th className="p-3 border-r border-slate-150 font-sans">Workman (শ্ৰমিক)</th>
                          <th className="p-3 border-r border-slate-150">UAN Number</th>
                          {/* 15 Days Grid */}
                          {Array.from({ length: 15 }).map((_, i) => (
                            <th key={i} className="p-1.5 text-center border-r border-slate-150 font-mono text-[9px] w-8">D{i + 1}</th>
                          ))}
                          <th className="p-3 text-center">মুঠ দিন (Total)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white font-mono">
                        {workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => {
                          const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                          const daysPresent = wrkAttendance.length;
                          return (
                            <tr key={wrk.id} className="hover:bg-slate-50/50">
                              <td className="p-3 border-r border-slate-150 font-bold text-slate-400 font-sans">{idx + 1}</td>
                              <td className="p-3 border-r border-slate-150 font-sans font-bold text-slate-800">{wrk.name}</td>
                              <td className="p-3 border-r border-slate-150 text-[11px] text-slate-500">{getWorkerUAN(wrk)}</td>
                              {/* Simulate attendance values */}
                              {Array.from({ length: 15 }).map((_, i) => {
                                const isPresent = i < daysPresent;
                                return (
                                  <td key={i} className={`p-1 text-center border-r border-slate-150 font-bold text-[11px] ${isPresent ? 'text-emerald-600 bg-emerald-50/20' : 'text-rose-500 bg-rose-50/10'}`}>
                                    {isPresent ? 'P' : 'A'}
                                  </td>
                                );
                              })}
                              <td className="p-3 text-center font-bold text-slate-800 font-sans bg-slate-50">{daysPresent} Days</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {selectedClraForm === 'Form XVII' && (
                    <table id="clra-table-form-xvii" className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 border-r border-slate-150">Sl</th>
                          <th className="p-3 border-r border-slate-150 font-sans">Workman Details</th>
                          <th className="p-3 border-r border-slate-150 text-right">Daily Rate</th>
                          <th className="p-3 border-r border-slate-150 text-center">Days Worked</th>
                          <th className="p-3 border-r border-slate-150 text-right">Gross Wages</th>
                          <th className="p-3 border-r border-slate-150 text-right text-rose-700">EPF Cont.</th>
                          <th className="p-3 border-r border-slate-150 text-right text-rose-700">ESI Cont.</th>
                          <th className="p-3 border-r border-slate-150 text-right text-rose-700">Deductions</th>
                          <th className="p-3 border-r border-slate-150 text-right text-rose-700">Advances</th>
                          <th className="p-3 border-r border-slate-150 text-right font-black text-emerald-800">Net Wages</th>
                          <th className="p-3 text-center font-sans">Biometric Thumb (Sign)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white font-mono">
                        {workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => {
                          const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                          const daysPresent = wrkAttendance.length;
                          const otHours = wrkAttendance.reduce((acc, curr) => acc + curr.overtimeHours, 0);
                          
                          const baseWage = daysPresent * wrk.dailyWageRate;
                          const otPay = otHours * (wrk.dailyWageRate / 8) * 2;
                          const grossWage = baseWage + otPay;
                          const epf = Math.min(grossWage, 15000) * 0.12;
                          const esi = grossWage * 0.0075;
                          
                          // Sum custom deductions & advances
                          const deds = clraDeductions.filter(d => d.workerId === wrk.id).reduce((sum, curr) => sum + curr.amount, 0);
                          const advs = clraAdvances.filter(a => a.workerId === wrk.id).reduce((sum, curr) => sum + curr.amount, 0);
                          const netWages = grossWage - epf - esi - deds - advs;

                          return (
                            <tr key={wrk.id} className="hover:bg-slate-50/50">
                              <td className="p-3 border-r border-slate-150 font-bold font-sans text-slate-400">{idx + 1}</td>
                              <td className="p-3 border-r border-slate-150 font-sans">
                                <span className="font-extrabold text-slate-900 block">{wrk.name}</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">ESIC: {getWorkerESIIP(wrk)}</span>
                              </td>
                              <td className="p-3 border-r border-slate-150 text-right">₹{wrk.dailyWageRate}</td>
                              <td className="p-3 border-r border-slate-150 text-center font-bold text-slate-700">{daysPresent}</td>
                              <td className="p-3 border-r border-slate-150 text-right font-semibold text-slate-800">₹{Math.round(grossWage).toLocaleString()}</td>
                              <td className="p-3 border-r border-slate-150 text-right text-slate-500">₹{Math.round(epf).toLocaleString()}</td>
                              <td className="p-3 border-r border-slate-150 text-right text-slate-500">₹{Math.round(esi).toLocaleString()}</td>
                              <td className="p-3 border-r border-slate-150 text-right text-rose-600 font-bold">₹{deds}</td>
                              <td className="p-3 border-r border-slate-150 text-right text-indigo-600 font-bold">₹{advs}</td>
                              <td className="p-3 border-r border-slate-150 text-right font-black text-emerald-700">₹{Math.round(netWages).toLocaleString()}</td>
                              <td className="p-3 text-center font-sans">
                                <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                                  ✓ Biometric OTP verified
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  {selectedClraForm === 'Form XX' && (
                    <table id="clra-table-form-xx" className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 border-r border-slate-150">Sl No</th>
                          <th className="p-3 border-r border-slate-150 font-sans">Workman Name (শ্ৰমিকৰ নাম)</th>
                          <th className="p-3 border-r border-slate-150">Loss/Damage Particulars (লোকচানৰ বিৱৰণ)</th>
                          <th className="p-3 border-r border-slate-150">Date of Occurrence</th>
                          <th className="p-3 border-r border-slate-150 text-right">Deduction Amount (কৰ্তন ₹)</th>
                          <th className="p-3 border-r border-slate-150 text-center">Installments (কিস্তি)</th>
                          <th className="p-3 border-r border-slate-150">Date of Recovery</th>
                          <th className="p-3 text-center font-sans">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white font-mono">
                        {clraDeductions.filter(d => {
                          const w = workers.find(wrk => wrk.id === d.workerId);
                          return w && w.contractorId === selectedContractorId;
                        }).length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 italic font-sans">
                              কোনো ক্ষতি বা কৰ্তনৰ ৰেকৰ্ড পোৱা নগ’ল। (No deduction records found.)
                            </td>
                          </tr>
                        ) : (
                          clraDeductions.filter(d => {
                            const w = workers.find(wrk => wrk.id === d.workerId);
                            return w && w.contractorId === selectedContractorId;
                          }).map((ded, idx) => {
                            const wrkObj = workers.find(w => w.id === ded.workerId);
                            return (
                              <tr key={ded.id} className="hover:bg-slate-50/50">
                                <td className="p-3 border-r border-slate-150 font-bold font-sans text-slate-400">{idx + 1}</td>
                                <td className="p-3 border-r border-slate-150 font-sans font-bold text-slate-800">{wrkObj?.name || 'Unknown Worker'}</td>
                                <td className="p-3 border-r border-slate-150 font-sans text-slate-600">{ded.particulars}</td>
                                <td className="p-3 border-r border-slate-150">{ded.damageDate}</td>
                                <td className="p-3 border-r border-slate-150 text-right text-rose-600 font-extrabold">₹{ded.amount}</td>
                                <td className="p-3 border-r border-slate-150 text-center font-sans">{ded.installments}</td>
                                <td className="p-3 border-r border-slate-150">{ded.recoveryDate}</td>
                                <td className="p-3 text-center font-sans">
                                  <button
                                    onClick={() => {
                                      setClraDeductions(prev => prev.filter(d => d.id !== ded.id));
                                      showNotice('কৰ্তন আঁতৰ কৰা হৈছে (Deduction removed)', 'info');
                                    }}
                                    className="text-rose-600 hover:text-rose-800 font-bold text-[10px] uppercase hover:underline"
                                  >
                                    আঁতৰাওক (Delete)
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}

                  {selectedClraForm === 'Form XXII' && (
                    <table id="clra-table-form-xxii" className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 border-r border-slate-150">Sl No</th>
                          <th className="p-3 border-r border-slate-150 font-sans">Workman Name (শ্ৰমিকৰ নাম)</th>
                          <th className="p-3 border-r border-slate-150">Purpose of Advance (অগ্ৰিমৰ উদ্দেশ্য)</th>
                          <th className="p-3 border-r border-slate-150">Date Given</th>
                          <th className="p-3 border-r border-slate-150 text-right">Advance Amount (অগ্ৰিম ₹)</th>
                          <th className="p-3 border-r border-slate-150 text-center">Installments for Recovery</th>
                          <th className="p-3 border-r border-slate-150">Target Recovery Date</th>
                          <th className="p-3 text-center font-sans">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white font-mono">
                        {clraAdvances.filter(a => {
                          const w = workers.find(wrk => wrk.id === a.workerId);
                          return w && w.contractorId === selectedContractorId;
                        }).length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-slate-400 italic font-sans">
                              কোনো অগ্ৰিম ধনৰ ৰেকৰ্ড পোৱা নগ’ল। (No advance payment records found.)
                            </td>
                          </tr>
                        ) : (
                          clraAdvances.filter(a => {
                            const w = workers.find(wrk => wrk.id === a.workerId);
                            return w && w.contractorId === selectedContractorId;
                          }).map((adv, idx) => {
                            const wrkObj = workers.find(w => w.id === adv.workerId);
                            return (
                              <tr key={adv.id} className="hover:bg-slate-50/50">
                                <td className="p-3 border-r border-slate-150 font-bold font-sans text-slate-400">{idx + 1}</td>
                                <td className="p-3 border-r border-slate-150 font-sans font-bold text-slate-800">{wrkObj?.name || 'Unknown Worker'}</td>
                                <td className="p-3 border-r border-slate-150 font-sans text-slate-600">{adv.purpose}</td>
                                <td className="p-3 border-r border-slate-150">{adv.advanceDate}</td>
                                <td className="p-3 border-r border-slate-150 text-right text-indigo-600 font-extrabold">₹{adv.amount}</td>
                                <td className="p-3 border-r border-slate-150 text-center font-sans">{adv.installments}</td>
                                <td className="p-3 border-r border-slate-150">{adv.recoveryDate}</td>
                                <td className="p-3 text-center font-sans">
                                  <button
                                    onClick={() => {
                                      setClraAdvances(prev => prev.filter(a => a.id !== adv.id));
                                      showNotice('অগ্ৰিম ধন আঁতৰ কৰা হৈছে (Advance removed)', 'info');
                                    }}
                                    className="text-rose-600 hover:text-rose-800 font-bold text-[10px] uppercase hover:underline"
                                  >
                                    আঁতৰাওক (Delete)
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  )}

                  {selectedClraForm === 'Form XXIII' && (
                    <table id="clra-table-form-xxiii" className="w-full text-left text-xs text-slate-600 border-collapse">
                      <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3 border-r border-slate-150">Sl No</th>
                          <th className="p-3 border-r border-slate-150 font-sans">Workman Name (শ্ৰমিকৰ নাম)</th>
                          <th className="p-3 border-r border-slate-150">Overtime Dates (তাৰিখ)</th>
                          <th className="p-3 border-r border-slate-150 text-center font-sans">Normal Hours</th>
                          <th className="p-3 border-r border-slate-150 text-center">Overtime Hours Worked</th>
                          <th className="p-3 border-r border-slate-150 text-right">Normal Wage Rate</th>
                          <th className="p-3 border-r border-slate-150 text-right">Overtime Wage Rate (2x)</th>
                          <th className="p-3 border-r border-slate-150 text-right font-black text-amber-700">OT Earnings (₹)</th>
                          <th className="p-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white font-mono">
                        {workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => {
                          const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                          const otHours = wrkAttendance.reduce((acc, curr) => acc + curr.overtimeHours, 0);
                          const otPay = otHours * (wrk.dailyWageRate / 8) * 2;

                          if (otHours === 0) return null;

                          return (
                            <tr key={wrk.id} className="hover:bg-slate-50/50">
                              <td className="p-3 border-r border-slate-150 font-bold font-sans text-slate-400">{idx + 1}</td>
                              <td className="p-3 border-r border-slate-150 font-sans font-bold text-slate-800">{wrk.name}</td>
                              <td className="p-3 border-r border-slate-150 font-sans text-slate-500">August 2026 Active Shift Cycles</td>
                              <td className="p-3 border-r border-slate-150 text-center font-sans">8 hrs/day</td>
                              <td className="p-3 border-r border-slate-150 text-center font-bold text-slate-800">{otHours} hrs</td>
                              <td className="p-3 border-r border-slate-150 text-right">₹{wrk.dailyWageRate}</td>
                              <td className="p-3 border-r border-slate-150 text-right text-emerald-700 font-semibold">₹{(wrk.dailyWageRate / 8 * 2).toFixed(1)}/hr</td>
                              <td className="p-3 border-r border-slate-150 text-right font-black text-amber-600">₹{Math.round(otPay).toLocaleString()}</td>
                              <td className="p-3 text-center">
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-100 font-sans">
                                  ✓ Added to Gross
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== 3. CONTRACT WORKER PORTAL ==================== */}
        {currentRole === 'worker' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Bar with Logout */}
            <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Worker Gateway</div>
              <button 
                onClick={handleLogout}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
                লগ আউট কৰক (Log Out)
              </button>
            </div>

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

              {/* WORKER INDUSTRY SELECTION & MULTI-INDUSTRY BADGE */}
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Factory className="h-4 w-4 text-emerald-400" /> 
                    কাম কৰা কাৰখানা / ইণ্ডাষ্ট্ৰী নিৰ্বাচন (Reporting Factory)
                  </div>
                  <span className="text-[10px] bg-slate-700 text-indigo-300 px-2 py-0.5 rounded font-mono">
                    Multi-Industry Shift Enabled
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  আপুনি যদি বিভিন্ন ইণ্ডাষ্ট্ৰী বা কাৰখানাত কাম কৰিছে, তেন্তে আজি কাম কৰা ইণ্ডাষ্ট্ৰীখন বাছক। আপোনাৰ উপস্থিতি সেই নিৰ্দিষ্ট ইণ্ডাষ্ট্ৰীৰ নামত ৰেকৰ্ড হ'ব।
                </p>

                <div className="pt-1">
                  <select
                    value={targetCheckInIndustry || assignments.find(a => a.workerId === selectedWorkerId && a.status === 'Active')?.industryId || 'ind-1'}
                    onChange={(e) => setTargetCheckInIndustry(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 text-white rounded px-3 py-1.5 text-xs font-semibold outline-none focus:border-emerald-500"
                  >
                    {industries.map(ind => {
                      const isAssigned = assignments.some(a => a.workerId === selectedWorkerId && a.industryId === ind.id && a.status === 'Active');
                      return (
                        <option key={ind.id} value={ind.id}>
                          {ind.name} ({ind.location}) {isAssigned ? '✓ [Active Deployment]' : ''}
                        </option>
                      );
                    })}
                  </select>
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
                          <span>LIC: {c.licenseNo ? (c.licenseNo.includes('-') ? c.licenseNo.split('-')[1] : c.licenseNo) : 'N/A'}</span>
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

            {/* Worker's Industry-Wise Shift & Wage History Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xs">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <UserCheck className="text-indigo-600 h-4 w-4" />
                  শ্ৰমিকৰ ইণ্ডাষ্ট্ৰীভিত্তিক উপস্থিতি আৰু দৈনিক মজুৰিৰ খতিয়ান (Worker's Industry-Wise Shift & Wage History)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeWorker.name}-এ বিভিন্ন কাৰখানাত সম্পন্ন কৰা কামৰ উপস্থিতি আৰু উপাৰ্জিত মজুৰিৰ তালিকা।
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="p-3">তাৰিখ (Date)</th>
                      <th className="p-3">কাৰখানা / ইণ্ডাষ্ট্ৰী (Industry Plant)</th>
                      <th className="p-3">ইন - আউট (In - Out)</th>
                      <th className="p-3 text-center">কামৰ ঘণ্টা</th>
                      <th className="p-3 text-center">অভাৰটাইম (OT)</th>
                      <th className="p-3 text-center">বায়’মেট্ৰিক সত্যতা</th>
                      <th className="p-3 text-right">উপাৰ্জিত মজুৰি (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {attendance.filter(a => a.workerId === selectedWorkerId).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-slate-400 italic">
                          এই শ্ৰমিকজনৰ এতিয়ালৈকে কোনো উপস্থিতি ৰেকৰ্ড হোৱা নাই। ওপৰৰ চেকাৰৰ পৰা চেক-ইন কৰক।
                        </td>
                      </tr>
                    ) : (
                      attendance
                        .filter(a => a.workerId === selectedWorkerId)
                        .map(att => {
                          const ind = industries.find(i => i.id === att.industryId);
                          const rate = activeWorker.dailyWageRate || 650;
                          const otWage = (att.overtimeHours || 0) * (rate / 8) * 2;
                          const shiftWage = rate + otWage;

                          return (
                            <tr key={att.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="p-3 font-mono font-medium text-slate-700">{att.date}</td>
                              <td className="p-3">
                                <span className="inline-flex items-center gap-1 font-semibold text-[11px] bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md">
                                  <Building2 className="h-3 w-3 text-indigo-600" />
                                  {ind ? ind.name : 'Unknown Plant'}
                                </span>
                                <span className="block text-[10px] text-slate-400 mt-0.5">{ind?.location}</span>
                              </td>
                              <td className="p-3 font-mono text-[11px]">
                                <span className="text-emerald-700 font-semibold">{att.checkIn}</span> - <span className="text-slate-500">{att.checkOut || '17:00'}</span>
                              </td>
                              <td className="p-3 text-center font-semibold text-slate-700">{att.hoursWorked || 8} hrs</td>
                              <td className="p-3 text-center">
                                {att.overtimeHours > 0 ? (
                                  <span className="bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
                                    +{att.overtimeHours} hrs
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-normal">--</span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                  <CheckCircle className="h-3 w-3" />
                                  {att.verificationMethod === 'Biometric-Face' ? 'Face Match' : 'UIDAI OTP'}
                                </span>
                              </td>
                              <td className="p-3 text-right font-extrabold text-emerald-700 font-mono">
                                ₹{Math.round(shiftWage).toLocaleString()}
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
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
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <ShieldCheck className="text-indigo-600 h-6 w-6" />
                  Labour Inspector & Statutory Auditor Portal
                </h3>
                <p className="text-xs text-slate-500">
                  Government panel to audit factory registrations, contractor statutory compliance records, minimum wages, and platform micro-revenue accruals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                <button 
                  onClick={() => setIsAuditModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  File Audit Certificate / Finding
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/40 px-4 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all flex items-center gap-1.5 justify-center"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  লগ আউট কৰক (Log Out)
                </button>
              </div>
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

      {/* ======================================================== */}
      {/* 1. INDUSTRY-WISE EPF & ESIC (EIC) CHALLAN & ECR GENERATOR */}
      {/* ======================================================== */}
      {isChallanModalOpen && (() => {
        const targetInd = industries.find(i => i.id === challanTargetIndustry) || industries[0];
        const statutoryRows = getIndustryWorkerStatutory(selectedContractorId, challanTargetIndustry, challanTargetMonth);
        const totalWages = statutoryRows.reduce((s, r) => s + r.grossWage, 0);
        const totalEpfEe = statutoryRows.reduce((s, r) => s + r.epfEeShare, 0);
        const totalEpfEr = statutoryRows.reduce((s, r) => s + (r.epfErEpfShare + r.epfErEpsShare + r.epfAdmin), 0);
        const totalEpf = statutoryRows.reduce((s, r) => s + r.epfTotal, 0);
        const totalEsiEe = statutoryRows.reduce((s, r) => s + r.esiEeShare, 0);
        const totalEsiEr = statutoryRows.reduce((s, r) => s + r.esiErShare, 0);
        const totalEsi = statutoryRows.reduce((s, r) => s + r.esiTotal, 0);
        const totalDays = statutoryRows.reduce((s, r) => s + r.daysWorked, 0);

        return (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase">
                      EPFO & ESIC Electronic Challan Return (ECR)
                    </span>
                    <span className="text-xs text-indigo-300 font-mono">TRRN: 310260810{challanTargetIndustry.replace(/\D/g, '') || '92'}</span>
                  </div>
                  <h3 className="font-extrabold text-lg text-white mt-1 flex items-center gap-2">
                    <FileSpreadsheet className="text-indigo-400 h-5 w-5" />
                    ইণ্ডাষ্ট্ৰীভিত্তিক শ্ৰমিকৰ নাম সম্বলিত PF আৰু EIC চালান (Industry-Wise Statutory Challan)
                  </h3>
                </div>

                <button 
                  onClick={() => setIsChallanModalOpen(false)} 
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors self-end sm:self-center"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Selector Bar */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-4 shrink-0 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">কাৰখানা / ইণ্ডাষ্ট্ৰী বাছক (Factory Plant):</label>
                    <select
                      value={challanTargetIndustry}
                      onChange={(e) => setChallanTargetIndustry(e.target.value)}
                      className="bg-white font-bold text-slate-800 border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                    >
                      {industries.map(ind => (
                        <option key={ind.id} value={ind.id}>{ind.name} ({ind.location})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">মজুৰি মাহ (Wage Month):</label>
                    <select
                      value={challanTargetMonth}
                      onChange={(e) => setChallanTargetMonth(e.target.value)}
                      className="bg-white font-bold text-slate-800 border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                    >
                      <option value="August 2026">August 2026</option>
                      <option value="September 2026">September 2026</option>
                      <option value="July 2026">July 2026</option>
                    </select>
                  </div>
                </div>

                {/* Establishment Metadata */}
                <div className="flex flex-wrap gap-4 text-[11px] bg-white border border-slate-200 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Principal Employer</span>
                    <span className="font-bold text-slate-800">{targetInd?.name} (LIN: {targetInd?.lin})</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">Labor Contractor</span>
                    <span className="font-bold text-slate-800">{activeContractor.name}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">EPF / ESI Codes</span>
                    <span className="font-mono font-bold text-indigo-700">{activeContractor.epfCode} / {activeContractor.esiCode}</span>
                  </div>
                </div>
              </div>

              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-indigo-50/40 border-b border-indigo-100 shrink-0 text-center">
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">অন্তৰ্ভুক্ত শ্ৰমিক (Covered)</span>
                  <span className="text-lg font-black text-slate-900">{statutoryRows.length} Workers</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">মুঠ কৰ্মদিন (Days Worked)</span>
                  <span className="text-lg font-black text-slate-900">{totalDays} Man-Days</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">মুঠ মজুৰি (Gross Wages)</span>
                  <span className="text-lg font-black text-slate-900">₹{totalWages.toLocaleString()}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100">
                  <span className="text-[10px] text-indigo-600 font-bold uppercase block">মুঠ EPF চালান (A/C 1,10,2)</span>
                  <span className="text-lg font-black text-indigo-700">₹{totalEpf.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block">EE: ₹{totalEpfEe} | ER: ₹{totalEpfEr}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-indigo-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase block">মুঠ ESIC চালান (4.0%)</span>
                  <span className="text-lg font-black text-emerald-700">₹{totalEsi.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block">EE: ₹{totalEsiEe} | ER: ₹{totalEsiEr}</span>
                </div>
              </div>

              {/* Worker-by-Worker Breakdown Table */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-extrabold sticky top-0 z-10 border-b border-slate-200">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">শ্ৰমিকৰ নাম (Worker)</th>
                        <th className="p-3">UAN (12-Digit)</th>
                        <th className="p-3">ESIC IP No</th>
                        <th className="p-3 text-center">কৰ্মদিন</th>
                        <th className="p-3 text-right">মুঠ মজুৰি</th>
                        <th className="p-3 text-right bg-indigo-50/70 text-indigo-900">EPF কৰ্তন (12%)</th>
                        <th className="p-3 text-right bg-indigo-50/70 text-indigo-900">EPF জমা (ER)</th>
                        <th className="p-3 text-right bg-indigo-100/70 text-indigo-950">মুঠ PF চালান</th>
                        <th className="p-3 text-right bg-emerald-50/70 text-emerald-900">ESI কৰ্তন (0.75%)</th>
                        <th className="p-3 text-right bg-emerald-50/70 text-emerald-900">ESI জমা (ER 3.25%)</th>
                        <th className="p-3 text-right bg-emerald-100/70 text-emerald-950">মুঠ ESI চালান</th>
                        <th className="p-3 text-right font-black">Net Pay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150">
                      {statutoryRows.length === 0 ? (
                        <tr>
                          <td colSpan={13} className="p-6 text-center text-slate-400 italic">
                            এই কাৰখানাত এই মাহত কোনো শ্ৰমিকৰ উপস্থিতি বা কৰ্তব্য পোৱা নগ’ল।
                          </td>
                        </tr>
                      ) : (
                        statutoryRows.map((row, idx) => (
                          <tr key={row.worker.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{row.worker.name}</span>
                              <span className="text-[10px] text-slate-400">{row.worker.skillType} • ₹{row.worker.dailyWageRate}/day</span>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-700 text-[11px]">{row.uan}</td>
                            <td className="p-3 font-mono text-slate-600 text-[11px]">{row.ipNo}</td>
                            <td className="p-3 text-center font-bold text-slate-800">
                              {row.daysWorked} {row.otHours > 0 ? <span className="text-amber-600 text-[10px] block">+{row.otHours}h OT</span> : null}
                            </td>
                            <td className="p-3 text-right font-bold text-slate-800 font-mono">₹{row.grossWage.toLocaleString()}</td>
                            <td className="p-3 text-right font-mono text-slate-600 bg-indigo-50/30">₹{row.epfEeShare}</td>
                            <td className="p-3 text-right font-mono text-slate-600 bg-indigo-50/30">₹{row.epfErEpfShare + row.epfErEpsShare + row.epfAdmin}</td>
                            <td className="p-3 text-right font-mono font-bold text-indigo-700 bg-indigo-50/70">₹{row.epfTotal}</td>
                            <td className="p-3 text-right font-mono text-slate-600 bg-emerald-50/30">₹{row.esiEeShare}</td>
                            <td className="p-3 text-right font-mono text-slate-600 bg-emerald-50/30">₹{row.esiErShare}</td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-700 bg-emerald-50/70">₹{row.esiTotal}</td>
                            <td className="p-3 text-right font-black text-slate-900 font-mono">₹{row.netPay.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Modal Footer with Actions */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Official EPFO & ESIC Compliant:</span> Electronic Challan Format with worker-by-worker UAN mapping.
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleExportECRCSV(statutoryRows, targetInd, challanTargetMonth)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-300 shadow-2xs"
                  >
                    <Download className="h-4 w-4 text-slate-600" />
                    ECR Return (CSV) ডাউনল’ড
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-slate-300 shadow-2xs"
                  >
                    <Printer className="h-4 w-4 text-slate-600" />
                    প্ৰিণ্ট / PDF সংৰক্ষণ
                  </button>

                  <button
                    onClick={() => {
                      handleSaveChallanDossier(targetInd, challanTargetMonth, totalEpf, totalEsi, statutoryRows.length);
                      setIsChallanModalOpen(false);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    বিলৰ সৈতে চালান সংলগ্ন কৰক (Save & Attach to Bill)
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 2. CONTRACTOR CLRA WORK & MAN-DAYS DISTRIBUTION REPORT */}
      {/* ======================================================== */}
      {isWorkSummaryModalOpen && (() => {
        const summaries = getContractorIndustrySummary(selectedContractorId)
          .filter(s => summaryTargetIndustry === 'ALL' || s.industry.id === summaryTargetIndustry);
        const totalManDays = summaries.reduce((sum, s) => sum + s.totalManDays, 0);
        const totalWages = summaries.reduce((sum, s) => sum + s.totalWages, 0);
        const totalHours = summaries.reduce((sum, s) => sum + s.totalStdHours + s.totalOtHours, 0);

        return (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              
              {/* Header */}
              <div className="bg-slate-900 text-white p-5 flex justify-between items-center shrink-0">
                <div>
                  <span className="bg-slate-700 text-indigo-300 font-extrabold text-[10px] px-2 py-0.5 rounded tracking-wide uppercase">
                    CLRA Act 1970 Statutory Certificate
                  </span>
                  <h3 className="font-extrabold text-lg text-white mt-1 flex items-center gap-2">
                    <Printer className="text-indigo-400 h-5 w-5" />
                    কণ্ট্ৰেক্টৰৰ ইণ্ডাষ্ট্ৰীভিত্তিক কৰ্ম-খতিয়ান (Industry Work & Man-Days Statement)
                  </h3>
                </div>

                <button 
                  onClick={() => setIsWorkSummaryModalOpen(false)} 
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Filter */}
              <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-500">ইণ্ডাষ্ট্ৰী ফিল্টাৰ:</span>
                  <select
                    value={summaryTargetIndustry}
                    onChange={(e) => setSummaryTargetIndustry(e.target.value)}
                    className="bg-white font-bold text-slate-800 border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-indigo-500"
                  >
                    <option value="ALL">সকলো ইণ্ডাষ্ট্ৰী / কাৰখানা (All Industries Consolidated)</option>
                    {industries.map(ind => (
                      <option key={ind.id} value={ind.id}>{ind.name}</option>
                    ))}
                  </select>
                </div>

                <div className="text-[11px] text-slate-500">
                  কণ্ট্ৰেক্টৰ: <strong className="text-slate-800">{activeContractor.name}</strong> | লাইচেঞ্চ: <strong className="text-slate-800">{activeContractor.licenseNo}</strong>
                </div>
              </div>

              {/* Printable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Official Letterhead */}
                <div className="border-b-2 border-slate-800 pb-4 text-center space-y-1">
                  <h2 className="font-black text-base text-slate-900 uppercase tracking-wide">
                    {activeContractor.name}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Licensed Labor Contractor Under Contract Labour (Regulation & Abolition) Act, 1970
                  </p>
                  <div className="flex justify-center gap-4 text-[10px] font-mono text-slate-500 pt-1">
                    <span>CLRA License: {activeContractor.licenseNo}</span>
                    <span>•</span>
                    <span>EPF Code: {activeContractor.epfCode}</span>
                    <span>•</span>
                    <span>ESIC Code: {activeContractor.esiCode}</span>
                    <span>•</span>
                    <span>PAN: {activeContractor.pan}</span>
                  </div>
                </div>

                {/* KPI Bar */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">মুঠ কাৰখানা সামৰি লোৱা</span>
                    <span className="text-xl font-black text-slate-800">{summaries.length} Plants</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">মুঠ কৰ্মদিন (Total Man-Days)</span>
                    <span className="text-xl font-black text-indigo-700">{totalManDays} Man-Days</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">মুঠ উপাৰ্জিত মজুৰি</span>
                    <span className="text-xl font-black text-emerald-700">₹{totalWages.toLocaleString()}</span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-800">প্ৰতিটো ইণ্ডাষ্ট্ৰী আৰু কাৰখানাভিত্তিক কামৰ বিতং বিৱৰণ:</h4>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                        <tr>
                          <th className="p-3">কাৰখানা / ইণ্ডাষ্ট্ৰীৰ নাম</th>
                          <th className="p-3">অৱস্থান আৰু LIN</th>
                          <th className="p-3 text-center">সক্ৰিয় শ্ৰমিক</th>
                          <th className="p-3 text-center">সম্পূৰ্ণ হোৱা কৰ্মদিন</th>
                          <th className="p-3 text-center">মুঠ কামৰ ঘণ্টা</th>
                          <th className="p-3 text-right">মুঠ মজুৰি (₹)</th>
                          <th className="p-3 text-center">বিল স্থিতি</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {summaries.map(s => (
                          <tr key={s.industry.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{s.industry.name}</td>
                            <td className="p-3 text-[11px] text-slate-500">{s.industry.location} • LIN: {s.industry.lin}</td>
                            <td className="p-3 text-center font-bold text-slate-700">{s.assignedCount} জন</td>
                            <td className="p-3 text-center font-bold text-indigo-700">{s.totalManDays} Shifts</td>
                            <td className="p-3 text-center font-mono">{s.totalStdHours}h {s.totalOtHours > 0 ? `(+${s.totalOtHours}h OT)` : ''}</td>
                            <td className="p-3 text-right font-mono font-bold text-emerald-700">₹{s.totalWages.toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                {s.bill?.status || 'Active Cycle'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
                  <div className="space-y-6 text-center">
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <span className="font-bold text-slate-700 block">লেবাৰ কণ্ট্ৰেক্টৰৰ স্বাক্ষৰ আৰু ছীল (Contractor Signature)</span>
                    <span className="text-[10px] text-slate-400 block">{activeContractor.name}</span>
                  </div>
                  <div className="space-y-6 text-center">
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <span className="font-bold text-slate-700 block">কাৰখানা মেনেজাৰ / প্ৰধান নিয়োগকৰ্তাৰ স্বাক্ষৰ (Factory Manager)</span>
                    <span className="text-[10px] text-slate-400 block">Principal Employer Endorsement</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center shrink-0">
                <span className="text-xs text-slate-500">Government CLRA Compliance Audit Document</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="h-4 w-4" />
                    খতিয়ান প্ৰিন্ট / PDF ডাউনল’ড (Print Statement)
                  </button>
                  <button
                    onClick={() => setIsWorkSummaryModalOpen(false)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    বন্ধ কৰক (Close)
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 3. OFFICIAL GST TAX INVOICE & AUTOMATED BILL VIEWER MODAL */}
      {/* ======================================================== */}
      {isInvoicePreviewOpen && (() => {
        const isExistingBill = !!selectedInvoiceBill;
        const targetIndId = isExistingBill ? selectedInvoiceBill.industryId : billTargetIndustry;
        const targetMonth = isExistingBill ? selectedInvoiceBill.month : billMonth;
        const targetInd = industries.find(i => i.id === targetIndId) || industries[0];
        const activeContractor = contractors.find(c => c.id === selectedContractorId) || contractors[0];

        const breakdown = getIndustryBillingBreakdown(selectedContractorId, targetIndId, targetMonth);

        const currentWage = isExistingBill 
          ? selectedInvoiceBill.baseAmount 
          : (billCalculationMode === 'auto' ? (breakdown.totalWageSum > 0 ? breakdown.totalWageSum : billBaseWage) : billBaseWage);

        const currentCommission = isExistingBill 
          ? selectedInvoiceBill.serviceCharge 
          : Math.round(currentWage * (billCommissionPct / 100));

        const currentTaxable = currentWage + currentCommission;

        const currentCgst = Math.round(currentTaxable * 0.09);
        const currentSgst = Math.round(currentTaxable * 0.09);
        const currentGst = isExistingBill ? selectedInvoiceBill.gstAmount : (currentCgst + currentSgst);
        const currentGrandTotal = isExistingBill ? selectedInvoiceBill.totalAmount : (currentTaxable + currentGst);

        const invoiceNo = isExistingBill 
          ? `TAX-INV/${targetInd.id.toUpperCase()}/${targetMonth.replace(/\s+/g, '').toUpperCase()}/${selectedInvoiceBill.id.toUpperCase()}`
          : `TAX-INV/${targetInd.id.toUpperCase()}/${targetMonth.replace(/\s+/g, '').toUpperCase()}/042`;

        const invoiceDate = isExistingBill 
          ? (selectedInvoiceBill.submittedAt || '2026-08-31') 
          : '2026-09-04';

        const gstReg = `27AAECP${activeContractor.id.replace(/\D/g, '').padEnd(3, '0')}4892Z1`;
        const indGstReg = `27AABCT8921K1ZZ`;

        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
              
              {/* Modal Control Header */}
              <div className="bg-slate-900 text-white p-4 sm:p-5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="bg-indigo-600 p-2 rounded-lg text-white">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                      {t.viewInvoice} (GST Tax Invoice - Rule 46 CGST)
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        Rule 46 CGST / SAC 998513
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {t.statutoryEnglishNote}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    প্ৰিন্ট / PDF (Print)
                  </button>
                  <button
                    onClick={() => {
                      setIsInvoicePreviewOpen(false);
                      setSelectedInvoiceBill(null);
                    }}
                    className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Container */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs font-sans print:p-0">
                
                {/* Official Invoice Header */}
                <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">
                      FORM GST INV-1 (TAX INVOICE)
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
                      TAX INVOICE / কৰ চালান
                    </h1>
                    <span className="text-[11px] text-slate-500">
                      Original for Recipient / Duplicate for Supplier
                    </span>
                  </div>

                  <div className="text-left sm:text-right font-mono space-y-0.5 text-[11px]">
                    <div><strong>ইনভয়েচ নং (Invoice No):</strong> <span className="text-indigo-900 font-bold">{invoiceNo}</span></div>
                    <div><strong>তাৰিখ (Invoice Date):</strong> <span>{invoiceDate}</span></div>
                    <div><strong>সেৱাৰ শ্ৰেণী (SAC Code):</strong> <strong>998513</strong> (Manpower Supply Services)</div>
                    <div><strong>বিল মাহ (Supply Period):</strong> <span className="font-bold text-slate-900">{targetMonth}</span></div>
                  </div>
                </div>

                {/* Two Column Parties Details: Supplier & Recipient */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                  {/* Supplier (Contractor) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-indigo-700 tracking-wider block border-b border-slate-200 pb-1">
                      যোগানকাৰী / কণ্ট্ৰেক্টৰ (Supplier / Labour Contractor)
                    </span>
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm">{activeContractor.name}</h4>
                    <div className="text-slate-600">MIDC Industrial Complex, Phase II, Guwahati/Pune</div>
                    <div className="pt-1 font-mono text-[10px] space-y-0.5">
                      <div><strong>GSTIN:</strong> <span className="text-slate-900 font-bold">{gstReg}</span></div>
                      <div><strong>PAN:</strong> {activeContractor.pan} | <strong>CLRA Lic:</strong> {activeContractor.licenseNo}</div>
                      <div><strong>EPF Code:</strong> {activeContractor.epfCode} | <strong>ESIC Code:</strong> {activeContractor.esiCode}</div>
                      <div><strong>বেংক একাউণ্ট:</strong> SBI Current A/c 301984210984 | IFSC: SBIN0001824</div>
                    </div>
                  </div>

                  {/* Recipient (Industry) */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-emerald-700 tracking-wider block border-b border-slate-200 pb-1">
                      প্ৰাপক / উদ্যোগ (Billed To / Principal Employer Client)
                    </span>
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm">{targetInd.name}</h4>
                    <div className="text-slate-600">{targetInd.location}</div>
                    <div className="pt-1 font-mono text-[10px] space-y-0.5">
                      <div><strong>Recipient GSTIN:</strong> <span className="text-slate-900 font-bold">{indGstReg}</span></div>
                      <div><strong>Factory LIN:</strong> {targetInd.lin}</div>
                      <div><strong>Reg/License No:</strong> {targetInd.regNo}</div>
                      <div><strong>State Code:</strong> 27 (Maharashtra / Assam Industrial Zone)</div>
                    </div>
                  </div>
                </div>

                {/* Itemized Worker Attendance Schedule */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-indigo-600" />
                      অনুসূচী: যোগান ধৰা শ্ৰমিকৰ উপস্থিতি আৰু প্ৰাপ্য মজুৰি (Worker Attendance & Wage Schedule)
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500 font-mono">
                      মুঠ উপস্থিতি: {breakdown.totalAttendance} Man-Days
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                        <tr>
                          <th className="p-2.5">ক্ৰমিক</th>
                          <th className="p-2.5">শ্ৰমিকৰ নাম (Worker Name)</th>
                          <th className="p-2.5">দক্ষতা (Trade)</th>
                          <th className="p-2.5 text-center">উপস্থিতি (Shifts)</th>
                          <th className="p-2.5 text-right">দৈনিক মজুৰি</th>
                          <th className="p-2.5 text-right">ওভাৰটাইম</th>
                          <th className="p-2.5 text-right font-black">মুঠ মজুৰি (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {breakdown.workerRows.map((r, idx) => (
                          <tr key={r.worker.id} className="hover:bg-slate-50/50">
                            <td className="p-2.5 text-slate-400 font-normal">{idx + 1}</td>
                            <td className="p-2.5 font-bold text-slate-900 font-sans">{r.worker.name}</td>
                            <td className="p-2.5 text-slate-600 font-sans text-[10px]">{r.worker.skillType}</td>
                            <td className="p-2.5 text-center font-bold text-indigo-700">{r.daysWorked} দিন</td>
                            <td className="p-2.5 text-right text-slate-700">₹{r.dailyRate}</td>
                            <td className="p-2.5 text-right text-amber-700">{r.otHours > 0 ? `+${r.otHours}h (₹${r.otWage})` : '-'}</td>
                            <td className="p-2.5 text-right font-black text-slate-900">₹{r.totalWage.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mathematical Consolidated Tax Summary (Formula requested by user) */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="h-3.5 w-3.5 text-indigo-600" />
                    বিলৰ বিতং হিচাপ আৰু কৰ সংগ্ৰহ (Consolidated Tax Calculation Breakdown)
                  </h4>

                  <div className="border border-slate-300 rounded-xl overflow-hidden font-mono text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                        <tr>
                          <th className="p-3">বিৱৰণ (Description of Service / SAC 998513)</th>
                          <th className="p-3 text-center">উপস্থিতি (Man-Days)</th>
                          <th className="p-3 text-center">কমিছন %</th>
                          <th className="p-3 text-right">ধনৰাশি (Amount in ₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {/* Line 1: Worker wages */}
                        <tr className="bg-white">
                          <td className="p-3 font-sans">
                            <strong className="text-slate-900 block font-bold">১. শ্ৰমিকৰ যোগানৰ মুঠ মজুৰি (Labour Wages)</strong>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Total Attendance × Worker Wage Rate under Minimum Wages Act
                            </span>
                          </td>
                          <td className="p-3 text-center font-bold text-indigo-900">{breakdown.totalAttendance}</td>
                          <td className="p-3 text-center text-slate-400">-</td>
                          <td className="p-3 text-right font-bold text-slate-900">₹{currentWage.toLocaleString()}</td>
                        </tr>

                        {/* Line 2: Contractor commission */}
                        <tr className="bg-white">
                          <td className="p-3 font-sans">
                            <strong className="text-amber-900 block font-bold">২. লেবাৰ কণ্ট্ৰেক্টৰ চাৰ্ভিচ মাৰ্জিন / কমিছন (Contractor Commission 10%)</strong>
                            <span className="text-[10px] text-slate-500 font-normal">
                              Contractor service charge @ 10% on Labour Wage Total
                            </span>
                          </td>
                          <td className="p-3 text-center text-slate-400">-</td>
                          <td className="p-3 text-center font-bold text-amber-700">10%</td>
                          <td className="p-3 text-right font-bold text-amber-800">+ ₹{currentCommission.toLocaleString()}</td>
                        </tr>

                        {/* Line 3: Taxable Subtotal */}
                        <tr className="bg-slate-50 font-bold">
                          <td className="p-3 font-sans text-slate-900">
                            ৩. মুঠ কৰযোগ্য মূল্য / চাবট’টেল (Total Taxable Value = ১ + ২)
                          </td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-right text-slate-900 font-black">₹{currentTaxable.toLocaleString()}</td>
                        </tr>

                        {/* Line 4: CGST 9% */}
                        <tr className="bg-white">
                          <td className="p-3 font-sans text-slate-700 pl-6">
                            • Central GST (CGST @ 9% on Taxable Value)
                          </td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-center text-slate-600">9%</td>
                          <td className="p-3 text-right text-emerald-800">₹{currentCgst.toLocaleString()}</td>
                        </tr>

                        {/* Line 5: SGST 9% */}
                        <tr className="bg-white">
                          <td className="p-3 font-sans text-slate-700 pl-6">
                            • State GST (SGST @ 9% on Taxable Value)
                          </td>
                          <td className="p-3 text-center">-</td>
                          <td className="p-3 text-center text-slate-600">9%</td>
                          <td className="p-3 text-right text-emerald-800">₹{currentSgst.toLocaleString()}</td>
                        </tr>

                        {/* Line 6: Grand Total */}
                        <tr className="bg-emerald-900 text-white font-black text-sm">
                          <td className="p-3.5 font-sans">
                            <span className="text-[10px] block uppercase tracking-wider text-emerald-300 font-bold">
                              সৰ্বমুঠ প্ৰাপ্য বিলৰ ধনৰাশি (FINAL PAYABLE INVOICE AMOUNT)
                            </span>
                            (শ্ৰমিকৰ মজুৰি + ১০% কণ্ট্ৰেক্টৰ মাৰ্জিন) + ১৮% জিএছটি
                          </td>
                          <td className="p-3.5 text-center text-emerald-200">{breakdown.totalAttendance} Shifts</td>
                          <td className="p-3.5 text-center text-emerald-200">18% GST</td>
                          <td className="p-3.5 text-right font-black text-emerald-200 text-base">
                            ₹{currentGrandTotal.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Words */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px]">
                    <strong>কথাত মুঠ ধনৰাশি (Amount in Words):</strong>{' '}
                    <span className="text-slate-900 font-bold">{toIndianWords(currentGrandTotal)}</span>
                  </div>
                </div>

                {/* Statutory Certifications & Declarations */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-[10px] text-slate-600">
                  <strong className="block text-slate-800 uppercase font-bold tracking-wider">
                    আইনী ঘোষণা আৰু চৰ্তাৱলী (Statutory Undertaking under CLRA & GST Act 2017):
                  </strong>
                  <p>
                    ১. আমি প্ৰমাণপত্ৰ প্ৰদান কৰোঁ যে ওপৰত বিল কৰা মজুৰিৰ হাৰ আৰু উপস্থিতিৰ তথ্যবোৰ বায়’মেট্ৰিক আৰু আধাৰ ডিজিটেল উপস্থিতি ৰেজিষ্টাৰৰ পৰা সঁচা আৰু নূন্যতম মজুৰি আইন (Minimum Wages Act) অনুসৰি।
                  </p>
                  <p>
                    ২. উক্ত শ্ৰমিকসকলৰ যোৱা মাহৰ বৈমূখ্যহীন EPF আৰু ESIC চালান আৰু ইচিআৰ (ECR) জমা কৰা হৈছে আৰু ৰাজ্যিক পৰিদৰ্শক বা ইণ্ডাষ্ট্ৰীৰ বাবে পৰীক্ষণীয়।
                  </p>
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t-2 border-slate-900 text-xs">
                  <div className="space-y-6 text-center">
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <div>
                      <span className="font-bold text-slate-900 block">কণ্ট্ৰেক্টৰৰ হৈ কৰ্তৃত্বপ্ৰাপ্ত স্বাক্ষৰ (Authorised Signatory)</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{activeContractor.name}</span>
                      <span className="text-[9px] text-slate-400 block">Stamp & Signature of Contractor</span>
                    </div>
                  </div>

                  <div className="space-y-6 text-center">
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <div>
                      <span className="font-bold text-slate-900 block">কাৰখানা মেনেজাৰ / প্ৰধান নিয়োগকৰ্তা (Principal Employer)</span>
                      <span className="text-[10px] text-slate-500 block font-mono">{targetInd.name}</span>
                      <span className="text-[9px] text-slate-400 block">Verified & Passed for Payment</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-slate-100 border-t border-slate-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
                <span className="text-xs text-slate-500 font-mono">
                  Official GST INV-1 Document Generated Automatically by ShramikSathi
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="h-4 w-4" />
                    প্ৰিন্ট / PDF সংৰক্ষণ কৰক
                  </button>

                  {!isExistingBill && (
                    <button
                      onClick={(e) => {
                        setIsInvoicePreviewOpen(false);
                        handleSubmitBill(e);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      বিল দাখিল কৰক (Submit Bill)
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsInvoicePreviewOpen(false);
                      setSelectedInvoiceBill(null);
                    }}
                    className="bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl border border-slate-300 transition-all"
                  >
                    বন্ধ কৰক (Close)
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 4. LANDSCAPE STATUTORY CLRA COMPLIANCE REGISTERS PRINT VIEW */}
      {/* ======================================================== */}
      {activePrintClraForm && (() => {
        const formType = activePrintClraForm;
        const contractorObj = contractors.find(c => c.id === selectedContractorId) || contractors[0];
        const industryObj = industries.find(i => i.id === selectedIndustryId) || industries[0];
        
        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 z-50 overflow-y-auto">
            <div className="bg-white text-slate-900 rounded-2xl max-w-7xl w-full shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[96vh] flex flex-col">
              
              {/* Modal Control Header (Non-Printable in CSS but nice here) */}
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center shrink-0 print:hidden">
                <div className="flex items-center gap-2">
                  <Printer className="text-emerald-400 h-5 w-5" />
                  <span className="font-extrabold text-xs sm:text-sm">
                    {formType} Ledger Blueprint (Statutory Landscape Alignment)
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="h-4 w-4" />
                    PDF ডাউনলোড / প্ৰিণ্ট কৰক
                  </button>
                  <button
                    onClick={() => setActivePrintClraForm(null)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Printable Body */}
              <div className="flex-1 overflow-auto p-8 space-y-6 bg-white font-serif print:p-0 print:m-0">
                
                {/* Official Statutory Heading */}
                <div className="text-center space-y-2 border-b-2 border-slate-800 pb-4">
                  <h1 className="text-xl font-bold tracking-wide uppercase">
                    {formType === 'Form XIII' && 'FORM XIII'}
                    {formType === 'Form XVI' && 'FORM XVI'}
                    {formType === 'Form XVII' && 'FORM XVII'}
                    {formType === 'Form XX' && 'FORM XX'}
                    {formType === 'Form XXII' && 'FORM XXII'}
                    {formType === 'Form XXIII' && 'FORM XXIII'}
                  </h1>
                  <p className="text-xs italic font-semibold">
                    {formType === 'Form XIII' && 'See Rule 75 of Contract Labour (Regulation & Abolition) Central Rules 1971'}
                    {formType === 'Form XVI' && 'See Rule 78(1)(a)(i) - MUSTER ROLL'}
                    {formType === 'Form XVII' && 'See Rule 78(1)(a)(i) - REGISTER OF WAGES'}
                    {formType === 'Form XX' && 'See Rule 78(1)(a)(ii) - REGISTER OF DEDUCTIONS FOR DAMAGE OR LOSS'}
                    {formType === 'Form XXII' && 'See Rule 78(1)(a)(ii) - REGISTER OF ADVANCES'}
                    {formType === 'Form XXIII' && 'See Rule 78(1)(a)(iii) - REGISTER OF OVERTIME'}
                  </p>
                  <h2 className="text-sm font-extrabold uppercase mt-1">
                    {formType === 'Form XIII' && 'REGISTER OF WORKMEN EMPLOYED BY CONTRACTOR'}
                    {formType === 'Form XVI' && 'MUSTER ROLL LEDGER REGISTER'}
                    {formType === 'Form XVII' && 'REGISTER OF WAGES / WAGE SLIP LEDGER'}
                    {formType === 'Form XX' && 'REGISTER OF DEDUCTIONS FOR DAMAGE OR LOSS'}
                    {formType === 'Form XXII' && 'REGISTER OF ADVANCES PAID TO WORKMEN'}
                    {formType === 'Form XXIII' && 'REGISTER OF OVERTIME WORK HOURS'}
                  </h2>
                </div>

                {/* Metadata Details */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans border-b border-slate-300 pb-4">
                  <div>
                    <span className="text-slate-500 block">Name and Address of Contractor:</span>
                    <strong className="text-slate-900 block font-serif text-sm">{contractorObj.name}</strong>
                    <span className="text-slate-400 block text-[10px]">License No: {contractorObj.licenseNo} | LIN: {contractorObj.lin}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Name and Address of Establishment / Factory:</span>
                    <strong className="text-slate-900 block font-serif text-sm">{industryObj.name}</strong>
                    <span className="text-slate-400 block text-[10px]">Location: {industryObj.location} | LIN: {industryObj.lin}</span>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-slate-500 block">Name and Address of Principal Employer:</span>
                    <strong className="text-slate-900 block font-serif text-sm">{industryObj.name} Managing Division</strong>
                    <span className="text-slate-400 block text-[10px]">Assam Industrial Development Council Zone</span>
                  </div>
                </div>

                {/* Ledger Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse border-2 border-slate-900 font-sans">
                    <thead className="bg-slate-50 text-slate-900 font-bold border-b-2 border-slate-900 text-center">
                      {formType === 'Form XIII' && (
                        <tr>
                          <th className="p-2 border border-slate-900 w-12">Sl No</th>
                          <th className="p-2 border border-slate-900">Name of Workman</th>
                          <th className="p-2 border border-slate-900 w-16">Age / Sex</th>
                          <th className="p-2 border border-slate-900">Father’s/Husband’s Name</th>
                          <th className="p-2 border border-slate-900">Nature of Work</th>
                          <th className="p-2 border border-slate-900 max-w-xs">Home Address (Permanent)</th>
                          <th className="p-2 border border-slate-900">Date of Joining</th>
                          <th className="p-2 border border-slate-900">Aadhaar/UAN No.</th>
                          <th className="p-2 border border-slate-900">Thumb Impression / Sign</th>
                        </tr>
                      )}

                      {formType === 'Form XVI' && (
                        <tr>
                          <th className="p-2 border border-slate-900 w-12" rowSpan={2}>Sl No</th>
                          <th className="p-2 border border-slate-900" rowSpan={2}>Name of Workman</th>
                          <th className="p-2 border border-slate-900" rowSpan={2}>UAN Number</th>
                          <th className="p-1 border border-slate-900 text-[10px]" colSpan={15}>Daily Attendance Status for Period (August 2026)</th>
                          <th className="p-2 border border-slate-900 w-20" rowSpan={2}>Total Days Present</th>
                        </tr>
                      )}
                      {formType === 'Form XVI' && (
                        <tr>
                          {Array.from({ length: 15 }).map((_, i) => (
                            <th key={i} className="p-0.5 border border-slate-900 font-mono text-[9px] w-6 text-center">{i + 1}</th>
                          ))}
                        </tr>
                      )}

                      {formType === 'Form XVII' && (
                        <tr>
                          <th className="p-1.5 border border-slate-900 w-10">Sl</th>
                          <th className="p-1.5 border border-slate-900">Workman Name</th>
                          <th className="p-1.5 border border-slate-900 w-20 text-right">Daily Rate</th>
                          <th className="p-1.5 border border-slate-900 w-16 text-center">Days Worked</th>
                          <th className="p-1.5 border border-slate-900 text-right">Gross Wages</th>
                          <th className="p-1.5 border border-slate-900 text-right">EPF (12%)</th>
                          <th className="p-1.5 border border-slate-900 text-right">ESI (0.75%)</th>
                          <th className="p-1.5 border border-slate-900 text-right">Other Deductions</th>
                          <th className="p-1.5 border border-slate-900 text-right">Advances</th>
                          <th className="p-1.5 border border-slate-900 text-right font-bold">Net Paid (₹)</th>
                          <th className="p-1.5 border border-slate-900">Signature / Endorsement</th>
                        </tr>
                      )}

                      {formType === 'Form XX' && (
                        <tr>
                          <th className="p-2 border border-slate-900 w-12">Sl No</th>
                          <th className="p-2 border border-slate-900">Name of Workman</th>
                          <th className="p-2 border border-slate-900">Nature of Damage / Material Loss Particulars</th>
                          <th className="p-2 border border-slate-900">Date of Incident</th>
                          <th className="p-2 border border-slate-900 text-right">Amount Charged (₹)</th>
                          <th className="p-2 border border-slate-900 text-center">Installments Allowed</th>
                          <th className="p-2 border border-slate-900">Final Date of Recovery</th>
                          <th className="p-2 border border-slate-900">Verified By Inspector Sign</th>
                        </tr>
                      )}

                      {formType === 'Form XXII' && (
                        <tr>
                          <th className="p-2 border border-slate-900 w-12">Sl No</th>
                          <th className="p-2 border border-slate-900">Name of Workman</th>
                          <th className="p-2 border border-slate-900">Purpose / Reason of Advance Given</th>
                          <th className="p-2 border border-slate-900">Date of Advance Paid</th>
                          <th className="p-2 border border-slate-900 text-right">Amount Advanced (₹)</th>
                          <th className="p-2 border border-slate-900 text-center">Installments Approved</th>
                          <th className="p-2 border border-slate-900">Date of Settlement</th>
                          <th className="p-2 border border-slate-900">Remarks / Signature</th>
                        </tr>
                      )}

                      {formType === 'Form XXIII' && (
                        <tr>
                          <th className="p-2 border border-slate-900 w-12">Sl No</th>
                          <th className="p-2 border border-slate-900">Name of Workman</th>
                          <th className="p-2 border border-slate-900">Date of Overtime Work</th>
                          <th className="p-2 border border-slate-900 text-center">Normal Hours</th>
                          <th className="p-2 border border-slate-900 text-center">Overtime Hours</th>
                          <th className="p-2 border border-slate-900 text-right">Normal Wage Rate</th>
                          <th className="p-2 border border-slate-900 text-right">Overtime Wage Rate</th>
                          <th className="p-2 border border-slate-900 text-right font-bold">OT Earnings (₹)</th>
                          <th className="p-2 border border-slate-900">Payment Reconciliation Date</th>
                        </tr>
                      )}
                    </thead>

                    <tbody className="divide-y divide-slate-800 bg-white">
                      {formType === 'Form XIII' && workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => (
                        <tr key={wrk.id} className="text-center font-mono">
                          <td className="p-2 border border-slate-900 font-sans font-bold">{idx + 1}</td>
                          <td className="p-2 border border-slate-900 font-sans font-extrabold text-left">{wrk.name}</td>
                          <td className="p-2 border border-slate-900 font-sans text-xs">32 / M</td>
                          <td className="p-2 border border-slate-900 font-sans text-left">Late B. {wrk.name.split(' ')[1] || 'Kumar'}</td>
                          <td className="p-2 border border-slate-900 font-sans text-left">{wrk.skillType}</td>
                          <td className="p-2 border border-slate-900 font-sans text-left text-[10px] max-w-xs leading-tight">
                            Assam Industrial Zone, Guwahati - 781001
                          </td>
                          <td className="p-2 border border-slate-900">{wrk.onboardingDate || '2026-04-12'}</td>
                          <td className="p-2 border border-slate-900 font-sans">{getWorkerUAN(wrk)}</td>
                          <td className="p-2 border border-slate-900 font-sans text-[10px] text-emerald-800 font-bold">
                            Aadhaar Digitally Signed
                          </td>
                        </tr>
                      ))}

                      {formType === 'Form XVI' && workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => {
                        const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                        const daysPresent = wrkAttendance.length;
                        return (
                          <tr key={wrk.id} className="text-center font-mono">
                            <td className="p-2 border border-slate-900 font-sans font-bold">{idx + 1}</td>
                            <td className="p-2 border border-slate-900 font-sans font-extrabold text-left">{wrk.name}</td>
                            <td className="p-2 border border-slate-900 font-sans">{getWorkerUAN(wrk)}</td>
                            {Array.from({ length: 15 }).map((_, i) => {
                              const isPresent = i < daysPresent;
                              return (
                                <td key={i} className={`p-1 border border-slate-900 font-bold text-[10px] ${isPresent ? 'text-slate-900 bg-slate-50' : 'text-slate-400'}`}>
                                  {isPresent ? 'P' : 'A'}
                                </td>
                              );
                            })}
                            <td className="p-2 border border-slate-900 font-sans font-bold bg-slate-50">{daysPresent} Days</td>
                          </tr>
                        );
                      })}

                      {formType === 'Form XVII' && workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => {
                        const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                        const daysPresent = wrkAttendance.length;
                        const otHours = wrkAttendance.reduce((acc, curr) => acc + curr.overtimeHours, 0);
                        
                        const baseWage = daysPresent * wrk.dailyWageRate;
                        const otPay = otHours * (wrk.dailyWageRate / 8) * 2;
                        const grossWage = baseWage + otPay;
                        const epf = Math.min(grossWage, 15000) * 0.12;
                        const esi = grossWage * 0.0075;
                        
                        const deds = clraDeductions.filter(d => d.workerId === wrk.id).reduce((sum, curr) => sum + curr.amount, 0);
                        const advs = clraAdvances.filter(a => a.workerId === wrk.id).reduce((sum, curr) => sum + curr.amount, 0);
                        const netWages = grossWage - epf - esi - deds - advs;

                        return (
                          <tr key={wrk.id} className="text-right font-mono">
                            <td className="p-2 border border-slate-900 text-center font-sans font-bold">{idx + 1}</td>
                            <td className="p-2 border border-slate-900 font-sans font-extrabold text-left">{wrk.name}</td>
                            <td className="p-2 border border-slate-900">₹{wrk.dailyWageRate}</td>
                            <td className="p-2 border border-slate-900 text-center font-bold">{daysPresent}</td>
                            <td className="p-2 border border-slate-900 font-bold">₹{Math.round(grossWage).toLocaleString()}</td>
                            <td className="p-2 border border-slate-900">₹{Math.round(epf).toLocaleString()}</td>
                            <td className="p-2 border border-slate-900">₹{Math.round(esi).toLocaleString()}</td>
                            <td className="p-2 border border-slate-900 font-bold text-rose-700">₹{deds}</td>
                            <td className="p-2 border border-slate-900 font-bold text-indigo-700">₹{advs}</td>
                            <td className="p-2 border border-slate-900 font-black text-emerald-800">₹{Math.round(netWages).toLocaleString()}</td>
                            <td className="p-2 border border-slate-900 text-center font-sans text-[10px] text-slate-500">
                              UIDAI Digitally Verified
                            </td>
                          </tr>
                        );
                      })}

                      {formType === 'Form XX' && (
                        clraDeductions.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-6 text-center text-slate-400 italic">
                              No deduction records logged in compliance systems.
                            </td>
                          </tr>
                        ) : (
                          clraDeductions.map((ded, idx) => {
                            const wrkObj = workers.find(w => w.id === ded.workerId);
                            return (
                              <tr key={ded.id} className="text-center font-mono">
                                <td className="p-2 border border-slate-900 font-sans font-bold">{idx + 1}</td>
                                <td className="p-2 border border-slate-900 font-sans font-extrabold text-left">{wrkObj?.name || 'Unknown Workman'}</td>
                                <td className="p-2 border border-slate-900 font-sans text-left">{ded.particulars}</td>
                                <td className="p-2 border border-slate-900">{ded.damageDate}</td>
                                <td className="p-2 border border-slate-900 text-right font-bold text-rose-700">₹{ded.amount}</td>
                                <td className="p-2 border border-slate-900 font-sans">{ded.installments}</td>
                                <td className="p-2 border border-slate-900">{ded.recoveryDate}</td>
                                <td className="p-2 border border-slate-900 font-sans text-slate-400">Approved Offline</td>
                              </tr>
                            );
                          })
                        )
                      )}

                      {formType === 'Form XXII' && (
                        clraAdvances.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-6 text-center text-slate-400 italic">
                              No advance payment records logged.
                            </td>
                          </tr>
                        ) : (
                          clraAdvances.map((adv, idx) => {
                            const wrkObj = workers.find(w => w.id === adv.workerId);
                            return (
                              <tr key={adv.id} className="text-center font-mono">
                                <td className="p-2 border border-slate-900 font-sans font-bold">{idx + 1}</td>
                                <td className="p-2 border border-slate-900 font-sans font-extrabold text-left">{wrkObj?.name || 'Unknown Workman'}</td>
                                <td className="p-2 border border-slate-900 font-sans text-left">{adv.purpose}</td>
                                <td className="p-2 border border-slate-900">{adv.advanceDate}</td>
                                <td className="p-2 border border-slate-900 text-right font-bold text-indigo-700">₹{adv.amount}</td>
                                <td className="p-2 border border-slate-900 font-sans">{adv.installments}</td>
                                <td className="p-2 border border-slate-900">{adv.recoveryDate}</td>
                                <td className="p-2 border border-slate-900 font-sans text-slate-400">Completed</td>
                              </tr>
                            );
                          })
                        )
                      )}

                      {formType === 'Form XXIII' && workers.filter(w => w.contractorId === selectedContractorId).map((wrk, idx) => {
                        const wrkAttendance = attendance.filter(a => a.workerId === wrk.id && a.status === 'Present');
                        const otHours = wrkAttendance.reduce((acc, curr) => acc + curr.overtimeHours, 0);
                        const otPay = otHours * (wrk.dailyWageRate / 8) * 2;

                        if (otHours === 0) return null;

                        return (
                          <tr key={wrk.id} className="text-center font-mono">
                            <td className="p-2 border border-slate-900 font-sans font-bold">{idx + 1}</td>
                            <td className="p-2 border border-slate-900 font-sans font-extrabold text-left">{wrk.name}</td>
                            <td className="p-2 border border-slate-900 text-left font-sans text-xs">August 2026 Shift Cycles</td>
                            <td className="p-2 border border-slate-900 font-sans">8 hrs / Day</td>
                            <td className="p-2 border border-slate-900 font-bold">{otHours} hrs</td>
                            <td className="p-2 border border-slate-900 text-right">₹{wrk.dailyWageRate}</td>
                            <td className="p-2 border border-slate-900 text-right">₹{(wrk.dailyWageRate / 8 * 2).toFixed(1)}</td>
                            <td className="p-2 border border-slate-900 text-right font-bold text-amber-700">₹{Math.round(otPay).toLocaleString()}</td>
                            <td className="p-2 border border-slate-900 font-sans text-xs text-slate-500">August 31, 2026</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Statutory Certification Signature Panel */}
                <div className="grid grid-cols-2 gap-12 pt-8 text-xs font-sans">
                  <div className="space-y-8 text-center">
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <span className="font-extrabold block text-slate-800 uppercase text-[10px]">
                      CONTRACTOR SIGNATURE & CORPORATE SEAL
                    </span>
                    <span className="text-[9px] text-slate-500 block">Lic. No. {contractorObj.licenseNo} | {contractorObj.name}</span>
                  </div>

                  <div className="space-y-8 text-center">
                    <div className="h-10 border-b border-dashed border-slate-400"></div>
                    <span className="font-extrabold block text-slate-800 uppercase text-[10px]">
                      FACTORY INSPECTOR / PRINCIPAL EMPLOYER ENDORSEMENT
                    </span>
                    <span className="text-[9px] text-slate-500 block">Under CLRA Central Rules Rule 75/78 Verification</span>
                  </div>
                </div>

              </div>

              {/* Modal Footer Controls */}
              <div className="bg-slate-100 border-t border-slate-200 p-4 flex justify-between items-center shrink-0 print:hidden">
                <span className="text-[10px] text-slate-500 font-mono">
                  CLRA Compliance Sheet Ledger Generated under Digital India Labor Initiative
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    প্ৰিন্ট কৰক (Print Frame)
                  </button>
                  <button
                    onClick={() => setActivePrintClraForm(null)}
                    className="bg-white hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl border border-slate-300 transition-all"
                  >
                    বন্ধ কৰক (Close)
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* 5. ADD CUSTOM DEDUCTION MODAL FOR FORM XX */}
      {/* ======================================================== */}
      {isAddingDeduction && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Plus className="text-rose-500 h-5 w-5" />
                নতুন কৰ্তন ৰেকৰ্ড কৰক (Add Custom Deduction)
              </h3>
              <button onClick={() => setIsAddingDeduction(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDeduction} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">শ্ৰমিক বাছক (Select Workman) *</label>
                <select
                  value={newDeduction.workerId}
                  onChange={(e) => setNewDeduction(prev => ({ ...prev, workerId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                  required
                >
                  <option value="">-- শ্ৰমিক বাছক --</option>
                  {workers.filter(w => w.contractorId === selectedContractorId).map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">লোকচানৰ বিৱৰণ (Loss Particulars) *</label>
                <input
                  type="text"
                  placeholder="e.g. Lost Safety Helmet, Damaged Tools"
                  value={newDeduction.particulars}
                  onChange={(e) => setNewDeduction(prev => ({ ...prev, particulars: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">কৰ্তন মূল্য (Amount ₹) *</label>
                  <input
                    type="number"
                    value={newDeduction.amount}
                    onChange={(e) => setNewDeduction(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                    min={10}
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">কিস্তিৰ সংখ্যা (Installments) *</label>
                  <input
                    type="number"
                    value={newDeduction.installments}
                    onChange={(e) => setNewDeduction(prev => ({ ...prev, installments: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">ক্ষতি হোৱা তাৰিখ *</label>
                  <input
                    type="date"
                    value={newDeduction.damageDate}
                    onChange={(e) => setNewDeduction(prev => ({ ...prev, damageDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">আদায়ৰ শেষ তাৰিখ *</label>
                  <input
                    type="date"
                    value={newDeduction.recoveryDate}
                    onChange={(e) => setNewDeduction(prev => ({ ...prev, recoveryDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 justify-end">
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  ৰেকৰ্ড সংৰক্ষণ কৰক (Save Record)
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingDeduction(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg transition-colors border border-slate-300"
                >
                  বাতিল কৰক (Cancel)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. ADD CUSTOM ADVANCE MODAL FOR FORM XXII */}
      {/* ======================================================== */}
      {isAddingAdvance && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                <Plus className="text-emerald-500 h-5 w-5" />
                নতুন অগ্ৰিম ৰেকৰ্ড লিখক (Add Custom Advance)
              </h3>
              <button onClick={() => setIsAddingAdvance(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAdvance} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">শ্ৰমিক বাছক (Select Workman) *</label>
                <select
                  value={newAdvance.workerId}
                  onChange={(e) => setNewAdvance(prev => ({ ...prev, workerId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                  required
                >
                  <option value="">-- শ্ৰমিক বাছক --</option>
                  {workers.filter(w => w.contractorId === selectedContractorId).map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">অগ্ৰিম প্ৰদানৰ কাৰণ / উদ্দেশ্য *</label>
                <input
                  type="text"
                  placeholder="e.g. Festival Advance, Medical Emergency"
                  value={newAdvance.purpose}
                  onChange={(e) => setNewAdvance(prev => ({ ...prev, purpose: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">অগ্ৰিম ধনৰ পৰিমাণ (₹) *</label>
                  <input
                    type="number"
                    value={newAdvance.amount}
                    onChange={(e) => setNewAdvance(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                    min={100}
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">উদ্ধাৰ কিস্তি সংখ্যা *</label>
                  <input
                    type="number"
                    value={newAdvance.installments}
                    onChange={(e) => setNewAdvance(prev => ({ ...prev, installments: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                    min={1}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">অগ্ৰিম প্ৰদানৰ তাৰিখ *</label>
                  <input
                    type="date"
                    value={newAdvance.advanceDate}
                    onChange={(e) => setNewAdvance(prev => ({ ...prev, advanceDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-bold mb-1">আদায়ৰ শেষ তাৰিখ *</label>
                  <input
                    type="date"
                    value={newAdvance.recoveryDate}
                    onChange={(e) => setNewAdvance(prev => ({ ...prev, recoveryDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none focus:border-indigo-500 font-bold text-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 justify-end">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  অগ্ৰিম সংৰক্ষণ কৰক (Save Advance)
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAdvance(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg transition-colors border border-slate-300"
                >
                  বাতিল কৰক (Cancel)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
