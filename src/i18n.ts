/**
 * ShramikLink Multi-Language Localization System (Pan-India)
 * Supports: English, Assamese, Hindi, Bengali, Marathi, Tamil, Telugu, Gujarati
 * 
 * Statutory Rule Enforced:
 * Official EPF ECR, ESIC Challans, and GST Tax Invoices (Rule 46 CGST)
 * strictly generate in official English format for statutory government audits.
 */

export type AppLanguage = 'en' | 'as' | 'hi' | 'bn' | 'mr' | 'ta' | 'te' | 'gu';

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
  region: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', region: 'Assam & North East', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'North, Central & West', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Pan-India / Official', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal & East', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra & MIDC', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu & South', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'AP & Telangana Hubs', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat Industrial Belt', flag: '🇮🇳' },
];

export interface TranslationDictionary {
  // Brand & Welcome
  appName: string;
  tagline: string;
  selectLanguageTitle: string;
  selectLanguageSub: string;
  statutoryEnglishNote: string;
  statutoryEnglishBadge: string;

  // Navigation
  controlCenter: string;
  complianceSchema: string;
  roadmap: string;
  switchRole: string;
  logout: string;
  currentRole: string;
  activeTenant: string;
  quickAccess: string;
  changeLanguage: string;
  sandboxNotice: string;
  restoreData: string;

  // Roles
  industryAdmin: string;
  industryAdminDesc: string;
  contractor: string;
  contractorDesc: string;
  worker: string;
  workerDesc: string;
  inspector: string;
  inspectorDesc: string;
  selectRole: string;
  loginButton: string;
  otpRequest: string;

  // Worker Portal
  workerPortal: string;
  workerIdCard: string;
  biometricStatus: string;
  checkInTitle: string;
  checkInDesc: string;
  aadhaarOtpCheckIn: string;
  biometricFaceCheckIn: string;
  selectTargetPlant: string;
  deployedFactory: string;
  dailyWageRate: string;
  totalEarnings: string;
  daysWorked: string;
  wageRegister: string;
  attendanceHistory: string;
  markedPresent: string;

  // Contractor Portal
  contractorPortal: string;
  workerPoolTitle: string;
  multiIndustrySupply: string;
  attendanceRegisterTitle: string;
  clraStatementTitle: string;
  epfEsicChallanTitle: string;
  billingSystemTitle: string;
  generateBillTitle: string;
  taxInvoiceTitle: string;
  complianceStatusTitle: string;
  allIndustries: string;
  selectIndustry: string;
  selectMonth: string;
  baseLabourWage: string;
  contractorCommission: string;
  subtotalTaxable: string;
  gst18: string;
  grandTotalClaim: string;
  submitBill: string;
  viewInvoice: string;
  printStatement: string;
  exportCsv: string;
  verified: string;
  pending: string;
  locked: string;
  approved: string;

  // Industry Admin Portal
  industryPortal: string;
  manpowerRequisition: string;
  createRequisition: string;
  gateAttendanceScan: string;
  billVerificationEngine: string;
  inspectDocuments: string;
  approve: string;
  reject: string;

  // Government Inspector Portal
  inspectorPortal: string;
  clraAuditTitle: string;
  minimumWageAudit: string;
  issueNoticeTitle: string;

  // Common terms
  close: string;
  print: string;
  download: string;
  status: string;
  shifts: string;
  date: string;
  shiftTiming: string;
  amount: string;
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  // 1. ASSAMESE (অসমীয়া)
  as: {
    appName: 'ShramikLink',
    tagline: 'ভাৰতীয় উদ্যোগ আৰু লেবাৰ কণ্ট্ৰেক্টৰৰ বাবে আইনী শ্ৰম নিয়োজন, বায়’মেট্ৰিক আৰু স্বয়ংক্ৰিয় বিলিং প্লেটফৰ্ম।',
    selectLanguageTitle: 'আপুনি আপোনাৰ সুবিধা অনুযায়ী ভাষা নিৰ্বাচন কৰক',
    selectLanguageSub: 'ভাৰতৰ সকলো ৰাজ্যৰ উদ্যোগ, কণ্ট্ৰেক্টৰ আৰু শ্ৰমিকৰ সুবিধাৰ্থে সমগ্ৰ ব্যৱস্থাটো আপোনাৰ নিজৰ ভাষাত উপলব্ধ।',
    statutoryEnglishNote: 'আইনী নিয়ম (Statutory Rule): কেন্দ্ৰীয় শ্ৰম মন্ত্ৰালয়, EPFO, ESIC আৰু GST অডিটৰ নিয়ম অনুসৰি কেৱল PF/ESI চালান, ECR ফাইল আৰু GST Tax Invoice আনুষ্ঠানিক ইংৰাজী (English) ফৰ্মেটত সৃষ্টি হ’ব।',
    statutoryEnglishBadge: 'PF / ESIC / GST বিল চৰকাৰী ইংৰাজী ফৰ্মেটত সংৰক্ষিত',

    controlCenter: 'কণ্ট্ৰোল চেণ্টাৰ (Control Center)',
    complianceSchema: 'আইনী বিধি আৰু স্কিমা (Compliance Schema)',
    roadmap: 'ৰোডমেপ (Roadmap)',
    switchRole: 'ভূমিকা সলনি কৰক',
    logout: 'লগআউট (Log Out)',
    currentRole: 'বৰ্তমান ভূমিকা:',
    activeTenant: 'সক্ৰিয় উদ্যোগ ক্লায়েণ্ট',
    quickAccess: 'দ্ৰুত পৰীক্ষা (Quick Access Demo)',
    changeLanguage: 'ভাষা বাছক (Language)',
    sandboxNotice: 'বাস্তৱ ভূমিকা অনুসৰি সুৰক্ষিত। আপুনি যিকোনো সময়ত লগআউট কৰি অন্য ভূমিকা বাছিব পাৰে।',
    restoreData: 'চেণ্ডবক্স ডেটা পুনৰুদ্ধাৰ কৰক',

    industryAdmin: 'উদ্যোগ প্ৰধান নিয়োগকৰ্তা (Industry Admin)',
    industryAdminDesc: 'কাৰখানা পৰিচালনা, শ্ৰমিকৰ চাহিদা আৰু কণ্ট্ৰেক্টৰৰ বিল অনুমোদন।',
    contractor: 'লেবাৰ কণ্ট্ৰেক্টৰ (Labour Contractor)',
    contractorDesc: 'শ্ৰমিক যোগান, বিভিন্ন কাৰখানাৰ উপস্থিতি, PF/ESI চালান আৰু স্বয়ংক্ৰিয় বিল সৃষ্টি।',
    worker: 'চুক্তিভিত্তিক শ্ৰমিক (Contract Worker)',
    workerDesc: 'ডিজিটেল পৰিচয়, উপস্থিতি পঞ্জীয়ন আৰু মজুৰিৰ খতিয়ান।',
    inspector: 'চৰকাৰী শ্ৰম পৰিদৰ্শক (CLRA Inspector)',
    inspectorDesc: 'আইনী শ্ৰম সুৰক্ষা, নূন্যতম মজুৰি আৰু বৈমূখ্যহীন চালান অডিট।',
    selectRole: 'প্ৰৱেশাধিকাৰ পদবী নিৰ্বাচন কৰক:',
    loginButton: 'প্ৰৱেশ কৰক (Secure Login)',
    otpRequest: 'OTP অনুৰোধ কৰক (Request 6-Digit OTP)',

    workerPortal: 'শ্ৰমিকৰ ডিজিটেল উপস্থিতি আৰু মজুৰি প’ৰ্টেল',
    workerIdCard: 'শ্ৰমিক ডিজিটেল পৰিচয় পত্ৰ (Worker ID)',
    biometricStatus: 'বায়’মেট্ৰিক আধাৰ স্থিতি:',
    checkInTitle: 'কাৰখানা শিফ্টত উপস্থিতি পঞ্জীয়ন কৰক (Attendance Check-In)',
    checkInDesc: 'কাৰখানা গেটত আধাৰ ওটিপি বা ফেচ স্কেনৰ জৰিয়তে উপস্থিতি নিশ্চিত কৰক।',
    aadhaarOtpCheckIn: 'আধাৰ OTP দ্বাৰা প্ৰৱেশ (Aadhaar-OTP Check-In)',
    biometricFaceCheckIn: 'ফেচ স্কেন দ্বাৰা প্ৰৱেশ (Biometric Face Scan)',
    selectTargetPlant: 'কাম কৰা নিৰ্দিষ্ট কাৰখানা নিৰ্বাচন কৰক:',
    deployedFactory: 'বৰ্তমান কৰ্মৰত কাৰখানা:',
    dailyWageRate: 'দৈনিক মজুৰিৰ হাৰ:',
    totalEarnings: 'এই মাহৰ মুঠ উপাৰ্জন:',
    daysWorked: 'উপস্থিতি (কাম কৰা দিন):',
    wageRegister: 'মজুৰি আৰু হাজিৰা খতিয়ান (Wage Register)',
    attendanceHistory: 'উপস্থিতিৰ সম্পূৰ্ণ ইতিহাস',
    markedPresent: 'উপস্থিত চিহ্নিত কৰা হ’ল',

    contractorPortal: 'লেবাৰ কণ্ট্ৰেক্টৰ পৰিচালন আৰু কমপ্লায়েন্স কেন্দ্ৰ',
    workerPoolTitle: 'শ্ৰমিক তালিকা আৰু কাৰখানাভিত্তিক নিয়োজন (Worker Pool)',
    multiIndustrySupply: 'বিভিন্ন কাৰখানাত শ্ৰমিক যোগান আৰু শিফ্ট (Multi-Industry Supply)',
    attendanceRegisterTitle: 'কাৰখানাভিত্তিক উপস্থিতি ৰেজিষ্টাৰ (Plant Attendance Register)',
    clraStatementTitle: 'CLRA ফৰ্ম XVII শ্ৰমিক আৰু মান-ডেচ স্টেটমেণ্ট (Man-Days Statement)',
    epfEsicChallanTitle: 'EPF আৰু ESIC (EIC) চালান আৰু ECR জেনেৰেটৰ (Statutory Challan)',
    billingSystemTitle: 'স্বয়ংক্ৰিয় উদ্যোগ বিলিং আৰু জিএছটি টেক্স ইনভয়েচ (Auto Billing Engine)',
    generateBillTitle: 'স্বয়ংক্ৰিয় বিল সৃষ্টি আৰু দাখিল কৰক (Generate Bill)',
    taxInvoiceTitle: 'অফিচিয়েল GST Tax Invoice (কৰ চালান)',
    complianceStatusTitle: 'আইনী চালান পৰীক্ষা স্থিতি (Compliance Status)',
    allIndustries: 'সকলো কাৰখানা (All Client Industries)',
    selectIndustry: 'কাৰখানা নিৰ্বাচন কৰক:',
    selectMonth: 'বিলৰ মাহ নিৰ্বাচন কৰক:',
    baseLabourWage: '১. শ্ৰমিকৰ যোগানৰ মুঠ মজুৰি (উপস্থিতি × মজুৰি):',
    contractorCommission: '২. কণ্ট্ৰেক্টৰ কমিছন (১০% চাৰ্ভিচ মাৰ্জিন):',
    subtotalTaxable: '৩. মুঠ কৰযোগ্য মূল্য (চাব-ট’টেল = ১ + ২):',
    gst18: '৪. চৰকাৰী জিএছটি ১৮% (৯% CGST + ৯% SGST):',
    grandTotalClaim: '৫. সৰ্বমুঠ প্ৰাপ্য বিলৰ ধনৰাশি (মুঠ বিল = ৩ + ৪):',
    submitBill: 'বিল জেনেৰেট কৰি ইণ্ডাষ্ট্ৰীলৈ দাখিল কৰক',
    viewInvoice: 'ইনভয়েচ চাওক আৰু প্ৰিন্ট কৰক (View & Print)',
    printStatement: 'খতিয়ান প্ৰিন্ট / PDF সংৰক্ষণ',
    exportCsv: 'ECR CSV ফাইল ডাউনল’ড',
    verified: 'সত্যান্বিত (Verified)',
    pending: 'পৰীক্ষণ বাকী (Pending)',
    locked: 'লক কৰা হৈছে (Locked)',
    approved: 'অনুমোদিত (Approved)',

    industryPortal: 'উদ্যোগ প্ৰধান নিয়োগকৰ্তা পৰিচালন কেন্দ্ৰ (Principal Employer)',
    manpowerRequisition: 'শ্ৰমিকৰ আৱশ্যকতা সৃষ্টি আৰু যোগান তদাৰক (Labour Requisitions)',
    createRequisition: 'নতুন শ্ৰমিকৰ অনুৰোধ প্ৰেৰণ কৰক',
    gateAttendanceScan: 'কাৰখানা গেট বায়’মেট্ৰিক উপস্থিতি পৰিদৰ্শন (Gate Monitoring)',
    billVerificationEngine: 'কণ্ট্ৰেক্টৰ চালান পৰীক্ষা আৰু বিল অনুমোদন (Bill Audit)',
    inspectDocuments: 'চালান পৰীক্ষা কৰক (Inspect)',
    approve: 'বিল অনুমোদন কৰক (Approve)',
    reject: 'নাকচ কৰক (Reject)',

    inspectorPortal: 'কেন্দ্ৰীয় আৰু ৰাজ্যিক শ্ৰম আয়ুক্ত পৰিদৰ্শন প’ৰ্টেল (Govt. Inspector)',
    clraAuditTitle: 'CLRA আৰু আন্তঃৰাজ্যিক প্ৰব্ৰজন শ্ৰমিক আইন অডিট (Statutory Audit)',
    minimumWageAudit: 'নূন্যতম মজুৰি আইন আৰু বায়’মেট্ৰিক উপস্থিতি বিশ্লেষণ',
    issueNoticeTitle: 'আইনী অনুসন্ধান আৰু কাৰণ দৰ্শোৱাৰ জাননী জাৰি কৰক',

    close: 'বন্ধ কৰক (Close)',
    print: 'প্ৰিন্ট কৰক (Print)',
    download: 'ডাউনল’ড কৰক (Download)',
    status: 'স্থিতি',
    shifts: 'শিফ্টসমূহ',
    date: 'তাৰিখ',
    shiftTiming: 'শিফ্টৰ সময়',
    amount: 'ধনৰাশি (₹)'
  },

  // 2. HINDI (हिन्दी)
  hi: {
    appName: 'ShramikLink',
    tagline: 'भारतीय विनिर्माण उद्योगों और श्रम ठेकेदारों के लिए सीएलआरए अनुपालन, बायोमेट्रिक और स्वचालित बिलिंग प्लेटफॉर्म।',
    selectLanguageTitle: 'कृपया अपनी पसंदीदा भाषा चुनें',
    selectLanguageSub: 'अखिल भारतीय स्तर पर विनिर्माण संयंत्रों, ठेकेदारों और श्रमिकों के लिए आपकी अपनी भाषा में उपलब्ध।',
    statutoryEnglishNote: 'वैधानिक नियम (Statutory Rule): श्रम मंत्रालय, EPFO, ESIC और GST ऑडिट नियमों के अनुसार केवल PF/ESI चालान, ECR फाइल और GST Tax Invoice आधिकारिक अंग्रेजी (English) प्रारूप में उत्पन्न होंगे।',
    statutoryEnglishBadge: 'PF / ESIC / GST बिल सरकारी अंग्रेजी प्रारूप में सुरक्षित',

    controlCenter: 'नियंत्रण केंद्र (Control Center)',
    complianceSchema: 'अनुपालन स्कीमा (Compliance Schema)',
    roadmap: 'रोडमैप (Roadmap)',
    switchRole: 'भूमिका बदलें',
    logout: 'लॉग आउट (Log Out)',
    currentRole: 'वर्तमान भूमिका:',
    activeTenant: 'सक्रिय उद्योग ग्राहक',
    quickAccess: 'त्वरित डेमो परीक्षण (Quick Access)',
    changeLanguage: 'भाषा चुनें (Language)',
    sandboxNotice: 'भूमिका अलगाव सक्रिय है। आप किसी भी समय लॉग आउट कर सकते हैं।',
    restoreData: 'सैंडबॉक्स डेटा रीसेट करें',

    industryAdmin: 'उद्योग प्रधान नियोक्ता (Industry Admin)',
    industryAdminDesc: 'कारखाना संचालन, जनशक्ति आवश्यकता और ठेकेदार बिल सत्यापन।',
    contractor: 'श्रम ठेकेदार (Labour Contractor)',
    contractorDesc: 'श्रमिक आपूर्ति, विभिन्न उद्योगों में उपस्थिति, पीएफ/ईएसआई चालान और स्वचालित बिलिंग।',
    worker: 'अनुबंध श्रमिक (Contract Worker)',
    workerDesc: 'डिजिटल श्रमिक पहचान, बायोमेट्रिक उपस्थिति और मजदूरी रिकॉर्ड।',
    inspector: 'सरकारी श्रम निरीक्षक (CLRA Inspector)',
    inspectorDesc: 'श्रम कानून अनुपालन, न्यूनतम मजदूरी और चालान ऑडिट।',
    selectRole: 'सिस्टम भूमिका चुनें:',
    loginButton: 'सुरक्षित प्रवेश (Login)',
    otpRequest: 'ओटीपी अनुरोध करें (Request OTP)',

    workerPortal: 'श्रमिक डिजिटल उपस्थिति और वेतन पोर्टल',
    workerIdCard: 'श्रमिक पहचान पत्र (Worker ID Card)',
    biometricStatus: 'बायोमेट्रिक आधार स्थिति:',
    checkInTitle: 'कारखाना शिफ्ट में उपस्थिति दर्ज करें (Attendance Check-In)',
    checkInDesc: 'कारखाना गेट पर आधार ओटीपी या फेस स्कैन से उपस्थिति दर्ज करें।',
    aadhaarOtpCheckIn: 'आधार ओटीपी द्वारा चेक-इन (Aadhaar-OTP)',
    biometricFaceCheckIn: 'बायोमेट्रिक फेस स्कैन द्वारा चेक-इन (Face Scan)',
    selectTargetPlant: 'कार्यरत कारखाना चुनें:',
    deployedFactory: 'वर्तमान में तैनात कारखाना:',
    dailyWageRate: 'दैनिक मजदूरी दर:',
    totalEarnings: 'इस महीने की कुल कमाई:',
    daysWorked: 'उपस्थिति (कार्य दिवस):',
    wageRegister: 'मजदूरी और उपस्थिति रजिस्टर (Wage Register)',
    attendanceHistory: 'उपस्थिति का पूरा इतिहास',
    markedPresent: 'उपस्थित दर्ज किया गया',

    contractorPortal: 'श्रम ठेकेदार प्रबंधन एवं अनुपालन केंद्र',
    workerPoolTitle: 'श्रमिक सूची और कारखाना आवंटन (Worker Pool)',
    multiIndustrySupply: 'विभिन्न उद्योगों में श्रमिक आपूर्ति और शिफ्ट (Multi-Industry Supply)',
    attendanceRegisterTitle: 'कारखाना-वार उपस्थिति रजिस्टर (Plant Attendance Register)',
    clraStatementTitle: 'सीएलआरए फॉर्म XVII मैन-डेज विवरण (Man-Days Statement)',
    epfEsicChallanTitle: 'ईपीएफ और ईएसआईसी चालान एवं ईसीआर जनरेटर (Statutory Challan)',
    billingSystemTitle: 'स्वचालित उद्योग बिलिंग और जीएसटी चालान (Auto Billing Engine)',
    generateBillTitle: 'स्वचालित बिल बनाएं और जमा करें (Generate Bill)',
    taxInvoiceTitle: 'आधिकारिक जीएसटी टैक्स इनवॉइस (Tax Invoice)',
    complianceStatusTitle: 'वैधानिक चालान सत्यापन स्थिति (Compliance Status)',
    allIndustries: 'सभी उद्योग संयंत्र (All Industries)',
    selectIndustry: 'कारखाना चुनें:',
    selectMonth: 'बिलिंग माह चुनें:',
    baseLabourWage: '१. कुल श्रमिक आपूर्ति मजदूरी (उपस्थिति × दर):',
    contractorCommission: '२. ठेकेदार सेवा कमीशन (१०% मार्जिन):',
    subtotalTaxable: '३. कुल कर योग्य राशि (सबटोटल = १ + २):',
    gst18: '४. वैधानिक जीएसटी १८% (९% CGST + ९% SGST):',
    grandTotalClaim: '५. कुल देय इनवॉइस राशि (कुल बिल = ३ + ४):',
    submitBill: 'बिल जनरेट करें और उद्योग को भेजें',
    viewInvoice: 'चालान देखें और प्रिंट करें (View & Print)',
    printStatement: 'विवरण प्रिंट करें / पीडीएफ सहेजें',
    exportCsv: 'ईसीआर सीएसवी फाइल डाउनलोड',
    verified: 'सत्यापित (Verified)',
    pending: 'लंबित (Pending)',
    locked: 'लॉक किया गया (Locked)',
    approved: 'स्वीकृत (Approved)',

    industryPortal: 'उद्योग प्रधान नियोक्ता पोर्टल (Principal Employer)',
    manpowerRequisition: 'श्रमिक मांग और आपूर्ति निगरानी (Labour Requisitions)',
    createRequisition: 'नई मांग दर्ज करें',
    gateAttendanceScan: 'कारखाना गेट बायोमेट्रिक निगरानी (Gate Monitoring)',
    billVerificationEngine: 'ठेकेदार चालान सत्यापन और बिल अनुमोदन (Bill Audit)',
    inspectDocuments: 'चालान जांचें (Inspect)',
    approve: 'बिल स्वीकृत करें (Approve)',
    reject: 'अस्वीकार करें (Reject)',

    inspectorPortal: 'श्रम आयुक्त निरीक्षण पोर्टल (Govt. Inspector)',
    clraAuditTitle: 'सीएलआरए एवं अंतरराज्यीय प्रवासी श्रमिक ऑडिट (Statutory Audit)',
    minimumWageAudit: 'न्यूनतम मजदूरी अनुपालन एवं बायोमेट्रिक विश्लेषण',
    issueNoticeTitle: 'अनुपालन नोटिस जारी करें',

    close: 'बंद करें (Close)',
    print: 'प्रिंट करें (Print)',
    download: 'डाउनलोड करें (Download)',
    status: 'स्थिति',
    shifts: 'शिफ्ट',
    date: 'तारीख',
    shiftTiming: 'शिफ्ट का समय',
    amount: 'राशि (₹)'
  },

  // 3. ENGLISH (Pan-India / Official)
  en: {
    appName: 'ShramikLink',
    tagline: 'Double-locking CLRA compliance, biometric attendance, and automated billing SaaS for Indian manufacturing industries.',
    selectLanguageTitle: 'Select Your Preferred Language',
    selectLanguageSub: 'Available across all industrial belts in India to ensure every contractor, plant manager, and worker can operate seamlessly.',
    statutoryEnglishNote: 'Statutory Compliance Notice: In adherence to Ministry of Labour, EPFO, ESIC, and GSTN audit standards, all official PF/ESI challans, ECR files, and GST Tax Invoices are strictly generated in standard English format.',
    statutoryEnglishBadge: 'PF / ESIC / GST Bills Preserved in Official English Format',

    controlCenter: 'Control Center',
    complianceSchema: 'Compliance Schema',
    roadmap: 'Roadmap',
    switchRole: 'Switch Role',
    logout: 'Log Out',
    currentRole: 'Current Role:',
    activeTenant: 'Active Tenant',
    quickAccess: 'Quick Access Demo',
    changeLanguage: 'Language',
    sandboxNotice: 'Role isolation is active. You can log out anytime to switch personas.',
    restoreData: 'Restore Sandbox Data',

    industryAdmin: 'Industry Principal Employer (Industry Admin)',
    industryAdminDesc: 'Plant operations, manpower requisitioning, and contractor bill verification.',
    contractor: 'Labour Contractor',
    contractorDesc: 'Worker deployment across factories, attendance logs, PF/ESI challans, and auto-billing.',
    worker: 'Contract Worker',
    workerDesc: 'Digital worker ID, biometric shift check-in, and wage history.',
    inspector: 'Government CLRA Inspector',
    inspectorDesc: 'Statutory compliance auditing, minimum wage enforcement, and challan inspection.',
    selectRole: 'Select System Role:',
    loginButton: 'Secure Login',
    otpRequest: 'Request 6-Digit OTP',

    workerPortal: 'Worker Digital Attendance & Wage Portal',
    workerIdCard: 'Worker Digital Identity Card',
    biometricStatus: 'Biometric Aadhaar Status:',
    checkInTitle: 'Plant Shift Attendance Check-In',
    checkInDesc: 'Authenticate at factory gate via Aadhaar-OTP or Biometric Face scan.',
    aadhaarOtpCheckIn: 'Aadhaar-OTP Check-In',
    biometricFaceCheckIn: 'Biometric Face Scan',
    selectTargetPlant: 'Select Deployment Factory:',
    deployedFactory: 'Currently Deployed Plant:',
    dailyWageRate: 'Daily Wage Rate:',
    totalEarnings: 'Current Month Earnings:',
    daysWorked: 'Shifts Worked (Attendance):',
    wageRegister: 'Wage & Attendance Register',
    attendanceHistory: 'Attendance History',
    markedPresent: 'Marked Present',

    contractorPortal: 'Labour Contractor Operations & Compliance Hub',
    workerPoolTitle: 'Worker Pool & Multi-Plant Deployment',
    multiIndustrySupply: 'Multi-Industry Manpower Supply & Shifts',
    attendanceRegisterTitle: 'Plant-wise Attendance Register',
    clraStatementTitle: 'CLRA Form XVII Man-Days Statement',
    epfEsicChallanTitle: 'EPF & ESIC (EIC) Challan & ECR Generator',
    billingSystemTitle: 'Automated Industry Billing & GST Tax Invoice Engine',
    generateBillTitle: 'Automated Bill Generator & Submission',
    taxInvoiceTitle: 'Official GST Tax Invoice (Form GST INV-1)',
    complianceStatusTitle: 'Statutory Challan Verification Status',
    allIndustries: 'All Client Manufacturing Plants',
    selectIndustry: 'Select Manufacturing Client:',
    selectMonth: 'Select Billing Month:',
    baseLabourWage: '1. Total Labour Supply Wages (Attendance × Rate):',
    contractorCommission: '2. Contractor Commission (10% Service Margin):',
    subtotalTaxable: '3. Total Taxable Value (Subtotal = 1 + 2):',
    gst18: '4. Statutory GST 18% (9% CGST + 9% SGST):',
    grandTotalClaim: '5. Grand Total Payable Invoice Amount (Total = 3 + 4):',
    submitBill: 'Generate & Submit Bill to Industry Admin',
    viewInvoice: 'View & Print Official Tax Invoice',
    printStatement: 'Print Statement / Save PDF',
    exportCsv: 'Export ECR CSV File',
    verified: 'Verified',
    pending: 'Pending Audit',
    locked: 'Locked',
    approved: 'Approved',

    industryPortal: 'Industry Principal Employer Hub',
    manpowerRequisition: 'Labour Requisitions & Deployment Monitoring',
    createRequisition: 'Submit New Requisition',
    gateAttendanceScan: 'Factory Gate Biometric Monitoring',
    billVerificationEngine: 'Contractor Compliance Audit & Bill Verification',
    inspectDocuments: 'Inspect Challans',
    approve: 'Approve Bill',
    reject: 'Reject Bill',

    inspectorPortal: 'Labour Commissioner Inspection Portal',
    clraAuditTitle: 'CLRA & Inter-State Migrant Workmen Audit',
    minimumWageAudit: 'Minimum Wages Act & Biometric Verification',
    issueNoticeTitle: 'Issue Statutory Compliance Notice',

    close: 'Close',
    print: 'Print',
    download: 'Download',
    status: 'Status',
    shifts: 'Shifts',
    date: 'Date',
    shiftTiming: 'Shift Timing',
    amount: 'Amount (₹)'
  },

  // 4. BENGALI (বাংলা)
  bn: {
    appName: 'ShramikLink',
    tagline: 'ভারতের শিল্প কলকারখানা ও শ্রমিক ঠিকাদারদের জন্য আইনসম্মত শ্রমিক সরবরাহ, বায়োমেট্রিক ও স্বয়ংক্রিয় বিলিং ব্যবস্থা।',
    selectLanguageTitle: 'অনুগ্রহ করে আপনার পছন্দসই ভাষা নির্বাচন করুন',
    selectLanguageSub: 'সমগ্র ভারতে কারখানা কর্তৃপক্ষ, ঠিকাদার ও শ্রমিকদের সুবিধার্থে আপনার নিজস্ব ভাষায় প্রস্তুত।',
    statutoryEnglishNote: 'আইনগত শর্ত (Statutory Rule): কেন্দ্রীয় শ্রম দপ্তর, EPFO, ESIC এবং GST অডিট বিধিমালার কারণে কেবল PF/ESI চালান, ECR ফাইল এবং GST Tax Invoice সরকারি ইংরেজি ফরম্যাটেই তৈরি হবে।',
    statutoryEnglishBadge: 'PF / ESIC / GST বিল সরকারি ইংরেজি ফরম্যাটে সংরক্ষিত',

    controlCenter: 'নিয়ন্ত্রণ কেন্দ্র (Control Center)',
    complianceSchema: 'কমপ্লায়েন্স স্কিমা (Compliance Schema)',
    roadmap: 'রোডম্যাপ (Roadmap)',
    switchRole: 'ভূমিকা পরিবর্তন করুন',
    logout: 'লগআউট (Log Out)',
    currentRole: 'বর্তমান ভূমিকা:',
    activeTenant: 'সক্রিয় কারখানা ক্লায়েন্ট',
    quickAccess: 'দ্রুত ডেমো পরীক্ষা (Quick Access)',
    changeLanguage: 'ভাষা পরিবর্তন (Language)',
    sandboxNotice: 'ভূমিকা সুরক্ষা সক্রিয় রয়েছে। আপনি যেকোনো সময় লগআউট করতে পারেন।',
    restoreData: 'স্যান্ডবক্স ডেটা রিসেট করুন',

    industryAdmin: 'শিল্প প্রধান নিয়োগকর্তা (Industry Admin)',
    industryAdminDesc: 'কারখানা পরিচালনা, শ্রমিকের চাহিদা এবং ঠিকাদার বিল অনুমোদন।',
    contractor: 'শ্রমিক ঠিকাদার (Labour Contractor)',
    contractorDesc: 'শ্রমিক সরবরাহ, কারখানায় হাজিরা, পিএফ/ইএসআই চালান ও স্বয়ংক্রিয় বিলিং।',
    worker: 'চুক্তিভিত্তিক শ্রমিক (Contract Worker)',
    workerDesc: 'ডিজিটাল শ্রমিক পরিচয়পত্র, বায়োমেট্রিক হাজিরা ও মজুরি খতিয়ান।',
    inspector: 'সরকারি শ্রম পরিদর্শক (CLRA Inspector)',
    inspectorDesc: 'শ্রম আইন সুরক্ষা, ন্যূনতম মজুরি ও চালান অডিট।',
    selectRole: 'সিস্টেম ভূমিকা নির্বাচন করুন:',
    loginButton: 'নিরাপদ লগইন (Login)',
    otpRequest: 'ওটিপি অনুরোধ করুন (Request OTP)',

    workerPortal: 'শ্রমিকের ডিজিটাল হাজিরা ও মজুরি পোর্টাল',
    workerIdCard: 'শ্রমিক ডিজিটাল পরিচয়পত্র',
    biometricStatus: 'বায়োমেট্রিক আধার স্থিতি:',
    checkInTitle: 'কারখানা শিফটে হাজিরা নিবন্ধন (Attendance Check-In)',
    checkInDesc: 'কারখানা গেটে আধার ওটিপি বা ফেস স্ক্যানের মাধ্যমে উপস্থিতি নিশ্চিত করুন।',
    aadhaarOtpCheckIn: 'আধার ওটিপি দিয়ে চেক-ইন (Aadhaar-OTP)',
    biometricFaceCheckIn: 'ফেস স্ক্যান দিয়ে চেক-ইন (Face Scan)',
    selectTargetPlant: 'কর্মরত কারখানা নির্বাচন করুন:',
    deployedFactory: 'বর্তমান কারখানা:',
    dailyWageRate: 'দৈনিক মজুরি হার:',
    totalEarnings: 'এই মাসের মোট আয়:',
    daysWorked: 'হাজিরা (কাজের দিন):',
    wageRegister: 'মজুরি ও হাজিরা রেজিস্টার (Wage Register)',
    attendanceHistory: 'হাজিরার সম্পূর্ণ ইতিহাস',
    markedPresent: 'উপস্থিত চিহ্নিত করা হয়েছে',

    contractorPortal: 'শ্রমিক ঠিকাদার পরিচালনা ও কমপ্লায়েন্স কেন্দ্র',
    workerPoolTitle: 'শ্রমিক তালিকা ও কারখানা বরাদ্দ (Worker Pool)',
    multiIndustrySupply: 'বিভিন্ন কারখানায় শ্রমিক সরবরাহ ও শিফট (Multi-Industry Supply)',
    attendanceRegisterTitle: 'কারখানাভিত্তিক হাজিরা খতিয়ান (Plant Attendance Register)',
    clraStatementTitle: 'CLRA ফর্ম XVII ম্যান-ডেজ বিবরণী (Man-Days Statement)',
    epfEsicChallanTitle: 'EPF ও ESIC চালান এবং ECR ফাইল জেনারেটর (Statutory Challan)',
    billingSystemTitle: 'স্বয়ংক্রিয় বিলিং ও জিএসটি ট্যাক্স ইনভয়েস ইঞ্জিন (Auto Billing)',
    generateBillTitle: 'স্বয়ংক্রিয় বিল তৈরি ও দাখিল করুন (Generate Bill)',
    taxInvoiceTitle: 'অফিসিয়াল জিএসটি ট্যাক্স ইনভয়েস (Tax Invoice)',
    complianceStatusTitle: 'আইনি চালান যাচাইকরণ স্থিতি (Compliance Status)',
    allIndustries: 'সকল কারখানা (All Industries)',
    selectIndustry: 'কারখানা বেছে নিন:',
    selectMonth: 'বিলিং মাস বেছে নিন:',
    baseLabourWage: '১. মোট শ্রমিক মজুরি (হাজিরা × দৈনিক মজুরি):',
    contractorCommission: '২. ঠিকাদার সার্ভিস কমিশন (১০% মার্জিন):',
    subtotalTaxable: '৩. মোট করযোগ্য মূল্য (সাবটোটাল = ১ + ২):',
    gst18: '৪. সরকারি জিএসটি ১৮% (৯% CGST + ৯% SGST):',
    grandTotalClaim: '৫. সর্বমোট প্রদেয় বিলের পরিমাণ (মোট বিল = ৩ + ৪):',
    submitBill: 'বিল তৈরি করে কারখানায় পাঠান',
    viewInvoice: 'ইনভয়েস দেখুন ও প্রিন্ট করুন (View & Print)',
    printStatement: 'বিবরণী প্রিন্ট / পিডিএফ সংরক্ষণ',
    exportCsv: 'ECR CSV ফাইল ডাউনলোড',
    verified: 'যাচাইকৃত (Verified)',
    pending: 'অপেক্ষমাণ (Pending)',
    locked: 'লক করা হয়েছে (Locked)',
    approved: 'অনুমোদিত (Approved)',

    industryPortal: 'কারখানা প্রধান নিয়োগকর্তা পোর্টাল (Principal Employer)',
    manpowerRequisition: 'শ্রমিক চাহিদা ও পর্যবেক্ষণ (Labour Requisitions)',
    createRequisition: 'নতুন চাহিদা জমা দিন',
    gateAttendanceScan: 'গেট বায়োমেট্রিক নজরদারি (Gate Monitoring)',
    billVerificationEngine: 'ঠিকাদার চালান পরীক্ষা ও বিল অনুমোদন (Bill Audit)',
    inspectDocuments: 'চালান খতিয়ে দেখুন (Inspect)',
    approve: 'বিল অনুমোদন করুন (Approve)',
    reject: 'প্রত্যাখ্যান করুন (Reject)',

    inspectorPortal: 'শ্রম পরিদর্শক পোর্টাল (Govt. Inspector)',
    clraAuditTitle: 'CLRA ও অভিবাসী শ্রমিক আইন অডিট (Statutory Audit)',
    minimumWageAudit: 'ন্যূনতম মজুরি আইন ও বায়োমেট্রিক পর্যালোচনা',
    issueNoticeTitle: 'আইনি নোটিশ জারি করুন',

    close: 'বন্ধ করুন (Close)',
    print: 'প্রিন্ট করুন (Print)',
    download: 'ডাউনলোড করুন (Download)',
    status: 'স্থিতি',
    shifts: 'শিফট',
    date: 'তারিখ',
    shiftTiming: 'শিফটের সময়',
    amount: 'টাকা (₹)'
  },

  // 5. MARATHI (मराठी)
  mr: {
    appName: 'ShramikLink',
    tagline: 'भारतीय विनिर्माण उद्योग आणि कामगार कंत्राटदारांसाठी सीएलआरए अनुपालन, बायोमेट्रिक आणि स्वयंचलित बिलिंग प्लॅटफॉर्म.',
    selectLanguageTitle: 'कृपया आपली पसंतीची भाषा निवडा',
    selectLanguageSub: 'महाराष्ट्र एमआयडीसी आणि संपूर्ण भारतातील कारखाने, कंत्राटदार आणि कामगारांसाठी आपल्या भाषेत उपलब्ध.',
    statutoryEnglishNote: 'वैधानिक नियम (Statutory Rule): कामगार मंत्रालय, EPFO, ESIC आणि GST ऑडिट नियमांनुसार केवळ PF/ESI चलन, ECR फाईल आणि GST Tax Invoice अधिकृत इंग्रजी (English) फॉरमॅटमध्ये तयार केले जातील.',
    statutoryEnglishBadge: 'PF / ESIC / GST बिले सरकारी इंग्रजी फॉरमॅटमध्ये संरक्षित',

    controlCenter: 'नियंत्रण केंद्र (Control Center)',
    complianceSchema: 'अनुपालन स्कीमा (Compliance Schema)',
    roadmap: 'रोडमॅप (Roadmap)',
    switchRole: 'भूमिका बदला',
    logout: 'लॉग आउट (Log Out)',
    currentRole: 'वर्तमान भूमिका:',
    activeTenant: 'सक्रिय उद्योग क्लायंट',
    quickAccess: 'झटपट डेमो चाचणी (Quick Access)',
    changeLanguage: 'भाषा निवडा (Language)',
    sandboxNotice: 'भूमिका अलगाव सक्रिय आहे. आपण कधीही लॉग आउट करू शकता.',
    restoreData: 'सँडबॉक्स डेटा पूर्ववत करा',

    industryAdmin: 'उद्योग मुख्य नियोक्ता (Industry Admin)',
    industryAdminDesc: 'कारखाना कामकाज, मनुष्यबळ आवश्यकता आणि कंत्राटदार बिल मंजुरी.',
    contractor: 'कामगार कंत्राटदार (Labour Contractor)',
    contractorDesc: 'कामगार पुरवठा, कारखान्यांमधील हजेरी, पीएफ/ईएसआय चलन आणि स्वयंचलित बिलिंग.',
    worker: 'कंत्राटी कामगार (Contract Worker)',
    workerDesc: 'डिजिटल कामगार ओळखपत्र, बायोमेट्रिक हजेरी आणि मजुरी नोंद.',
    inspector: 'सरकारी कामगार निरीक्षक (CLRA Inspector)',
    inspectorDesc: 'कामगार कायदा अनुपालन, किमान वेतन आणि चलन ऑडिट.',
    selectRole: 'प्रणाली भूमिका निवडा:',
    loginButton: 'सुरक्षित प्रवेश (Login)',
    otpRequest: 'ओटीपी विनंती करा (Request OTP)',

    workerPortal: 'कामगार डिजिटल हजेरी व वेतन पोर्टल',
    workerIdCard: 'कामगार ओळखपत्र (Worker ID Card)',
    biometricStatus: 'बायोमेट्रिक आधार स्थिती:',
    checkInTitle: 'कारखाना शिफ्ट हजेरी नोंदवा (Attendance Check-In)',
    checkInDesc: 'कारखाना गेटवर आधार ओटीपी किंवा फेस स्कॅनद्वारे हजेरी नोंदवा.',
    aadhaarOtpCheckIn: 'आधार ओटीपीद्वारे हजेरी (Aadhaar-OTP)',
    biometricFaceCheckIn: 'बायोमेट्रिक फेस स्कॅनद्वारे हजेरी (Face Scan)',
    selectTargetPlant: 'कार्यरत कारखाना निवडा:',
    deployedFactory: 'सध्या कार्यरत कारखाना:',
    dailyWageRate: 'दैनिक मजुरी दर:',
    totalEarnings: 'या महिन्याची एकूण कमाई:',
    daysWorked: 'हजेरी (कामाचे दिवस):',
    wageRegister: 'मजुरी आणि हजेरी रजिस्टर (Wage Register)',
    attendanceHistory: 'हजेरीचा संपूर्ण इतिहास',
    markedPresent: 'उपस्थित नोंदवले',

    contractorPortal: 'कामगार कंत्राटदार व्यवस्थापन व अनुपालन केंद्र',
    workerPoolTitle: 'कामगार यादी व कारखाना वाटप (Worker Pool)',
    multiIndustrySupply: 'विविध उद्योगांमध्ये कामगार पुरवठा आणि शिफ्ट (Multi-Industry Supply)',
    attendanceRegisterTitle: 'कारखान्यानुसार हजेरी नोंदवही (Plant Attendance Register)',
    clraStatementTitle: 'सीएलआरए फॉर्म XVII मॅन-डेज विवरण (Man-Days Statement)',
    epfEsicChallanTitle: 'ईपीएफ आणि ईएसआयसी चलन व ईसीआर जनरेटर (Statutory Challan)',
    billingSystemTitle: 'स्वयंचलित बिलिंग आणि जीएसटी टॅक्स इनव्हॉइस (Auto Billing Engine)',
    generateBillTitle: 'स्वयंचलित बिल तयार करा आणि पाठवा (Generate Bill)',
    taxInvoiceTitle: 'अधिकृत जीएसटी टॅक्स इनव्हॉइस (Tax Invoice)',
    complianceStatusTitle: 'वैधानिक चलन पडताळणी स्थिती (Compliance Status)',
    allIndustries: 'सर्व उद्योग संयंत्रे (All Industries)',
    selectIndustry: 'कारखाना निवडा:',
    selectMonth: 'बिलिंग महिना निवडा:',
    baseLabourWage: '१. एकूण कामगार मजुरी (हजेरी × दर):',
    contractorCommission: '२. कंत्राटदार सेवा कमिशन (१०% मार्जिन):',
    subtotalTaxable: '३. एकूण करपात्र रक्कम (सबटोटल = १ + २):',
    gst18: '४. वैधानिक जीएसटी १८% (९% CGST + ९% SGST):',
    grandTotalClaim: '५. एकूण देय इनव्हॉइस रक्कम (एकूण बिल = ३ + ४):',
    submitBill: 'बिल तयार करा आणि उद्योगाकडे पाठवा',
    viewInvoice: 'इनव्हॉइस पहा आणि प्रिंट करा (View & Print)',
    printStatement: 'विवरण प्रिंट करा / पीडीएफ जतन करा',
    exportCsv: 'ईसीआर सीएसव्ही फाईल डाउनलोड',
    verified: 'पडताळणी झाली (Verified)',
    pending: 'प्रलंबित (Pending)',
    locked: 'लॉक केले (Locked)',
    approved: 'मंजूर (Approved)',

    industryPortal: 'उद्योग मुख्य नियोक्ता पोर्टल (Principal Employer)',
    manpowerRequisition: 'कामगार मागणी आणि पुरवठा देखरेख (Labour Requisitions)',
    createRequisition: 'नवीन मागणी नोंदवा',
    gateAttendanceScan: 'कारखाना गेट बायोमेट्रिक देखरेख (Gate Monitoring)',
    billVerificationEngine: 'कंत्राटदार चलन तपासणी आणि बिल मंजुरी (Bill Audit)',
    inspectDocuments: 'चलनांची तपासणी करा (Inspect)',
    approve: 'बिल मंजूर करा (Approve)',
    reject: 'नाकारा (Reject)',

    inspectorPortal: 'कामगार आयुक्त तपासणी पोर्टल (Govt. Inspector)',
    clraAuditTitle: 'सीएलआरए आणि आंतरराज्य स्थलांतरित कामगार ऑडिट (Statutory Audit)',
    minimumWageAudit: 'किमान वेतन अनुपालन आणि बायोमेट्रिक विश्लेषण',
    issueNoticeTitle: 'अनुपालन नोटीस जारी करा',

    close: 'बंद करा (Close)',
    print: 'प्रिंट करा (Print)',
    download: 'डाउनलोड करा (Download)',
    status: 'स्थिती',
    shifts: 'शिफ्ट',
    date: 'तारीख',
    shiftTiming: 'शिफ्टची वेळ',
    amount: 'रक्कम (₹)'
  },

  // 6. TAMIL (தமிழ்)
  ta: {
    appName: 'ShramikLink',
    tagline: 'இந்திய உற்பத்தி தொழிலகங்கள் மற்றும் ஒப்பந்ததாரர்களுக்கான சி.எல்.ஆர்.ஏ சட்டம், பயோமெட்ரிக் மற்றும் தானியங்கி பில்லிங் தளம்.',
    selectLanguageTitle: 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்',
    selectLanguageSub: 'இந்தியா முழுவதும் உள்ள தொழிற்சாலைகள், ஒப்பந்ததாரர்கள் மற்றும் தொழிலாளர்களுக்காக உங்கள் தாய்மொழியில் வழங்கப்படுகிறது.',
    statutoryEnglishNote: 'சட்டரீதியான விதி (Statutory Rule): மத்திய தொழிலாளர் நலத்துறை, EPFO, ESIC மற்றும் GST விதிகளின்படி PF/ESI சலான், ECR கோப்புகள் மற்றும் GST Tax Invoice ஆகியவை அதிகாரப்பூர்வ ஆங்கிலத்தில் (English) மட்டுமே உருவாக்கப்படும்.',
    statutoryEnglishBadge: 'PF / ESIC / GST பில்கள் அதிகாரப்பூர்வ ஆங்கில வடிவில் பாதுகாக்கப்படுகின்றன',

    controlCenter: 'கட்டுப்பாட்டு மையம் (Control Center)',
    complianceSchema: 'சட்ட விதிகளின் திட்டம் (Compliance Schema)',
    roadmap: 'செயல்திட்டம் (Roadmap)',
    switchRole: 'பொறுப்பை மாற்றவும்',
    logout: 'வெளியேறு (Log Out)',
    currentRole: 'தற்போதைய பொறுப்பு:',
    activeTenant: 'செயலில் உள்ள தொழிலகம்',
    quickAccess: 'விரைவு சோதனை (Quick Access Demo)',
    changeLanguage: 'மொழி மாற்றம் (Language)',
    sandboxNotice: 'பாதுகாப்பு முறை செயலில் உள்ளது. நீங்கள் எப்போது வேண்டுமானாலும் வெளியேறலாம்.',
    restoreData: 'தரவை மீட்டமைக்கவும்',

    industryAdmin: 'தொழிற்சாலை முதன்மை நிர்வாகி (Industry Admin)',
    industryAdminDesc: 'தொழிற்சாலை இயக்கம், தொழிலாளர் தேவை மற்றும் ஒப்பந்ததாரர் பில் ஒப்புதல்.',
    contractor: 'தொழிலாளர் ஒப்பந்ததாரர் (Labour Contractor)',
    contractorDesc: 'தொழிலாளர் விநியோகம், வருகை பதிவு, பிஎஃப்/இஎஸ்ஐ சலான் மற்றும் தானியங்கி பில்லிங்.',
    worker: 'ஒப்பந்த தொழிலாளி (Contract Worker)',
    workerDesc: 'டிஜிட்டல் தொழிலாளர் அட்டை, வருகைப் பதிவு மற்றும் ஊதியக் கணக்கு.',
    inspector: 'அரசு தொழிலாளர் ஆய்வாளர் (CLRA Inspector)',
    inspectorDesc: 'சட்டப்பூர்வ பாதுகாப்பு, குறைந்தபட்ச ஊதியம் மற்றும் சலான் தணிக்கை.',
    selectRole: 'கணினிப் பொறுப்பைத் தேர்ந்தெடுக்கவும்:',
    loginButton: 'பாதுகாப்பான உள்நுழைவு (Login)',
    otpRequest: 'ஓடிபி கோரவும் (Request OTP)',

    workerPortal: 'தொழிலாளர் வருகை மற்றும் ஊதிய போர்டல்',
    workerIdCard: 'தொழிலாளர் அடையாள அட்டை',
    biometricStatus: 'பயோமெட்ரிக் ஆதார் நிலை:',
    checkInTitle: 'ஷிப்ட் வருகைப் பதிவு (Attendance Check-In)',
    checkInDesc: 'தொழிற்சாலை வாயிலில் ஆதார் ஓடிபி அல்லது முகம் ஸ்கேன் மூலம் வருகையை பதிவு செய்யவும்.',
    aadhaarOtpCheckIn: 'ஆதார் ஓடிபி வழி வருகை (Aadhaar-OTP)',
    biometricFaceCheckIn: 'முக ஸ்கேன் வழி வருகை (Face Scan)',
    selectTargetPlant: 'பணியாற்றும் தொழிற்சாலையைத் தேர்ந்தெடுக்கவும்:',
    deployedFactory: 'தற்போதைய தொழிற்சாலை:',
    dailyWageRate: 'தினசரி ஊதிய விகிதம்:',
    totalEarnings: 'இம்மாத மொத்த வருமானம்:',
    daysWorked: 'வருகை (வேலை செய்த நாட்கள்):',
    wageRegister: 'ஊதிய மற்றும் வருகை பதிவேடு (Wage Register)',
    attendanceHistory: 'முழு வருகை வரலாறு',
    markedPresent: 'வருகை பதிவு செய்யப்பட்டது',

    contractorPortal: 'ஒப்பந்ததாரர் மேலாண்மை மற்றும் இணக்க மையம்',
    workerPoolTitle: 'தொழிலாளர் பட்டியல் மற்றும் தொழிற்சாலை ஒதுக்கீடு (Worker Pool)',
    multiIndustrySupply: 'பல்வேறு தொழிற்சாலைகளுக்கு தொழிலாளர் வழங்கல் (Multi-Industry Supply)',
    attendanceRegisterTitle: 'தொழிற்சாலை வாரியான வருகைப் பதிவேடு (Plant Attendance Register)',
    clraStatementTitle: 'CLRA படிவம் XVII மனித-நாட்கள் அறிக்கை (Man-Days Statement)',
    epfEsicChallanTitle: 'EPF மற்றும் ESIC சலான் மற்றும் ECR ஜெனரேட்டர் (Statutory Challan)',
    billingSystemTitle: 'தானியங்கி பில்லிங் மற்றும் ஜிஎஸ்டி விலைப்பட்டியல் (Auto Billing Engine)',
    generateBillTitle: 'தானியங்கி பில் உருவாக்கி சமர்ப்பிக்கவும் (Generate Bill)',
    taxInvoiceTitle: 'அதிகாரப்பூர்வ ஜிஎஸ்டி வரி விலைப்பட்டியல் (Tax Invoice)',
    complianceStatusTitle: 'சட்டரீதியான சலான் சரிபார்ப்பு நிலை (Compliance Status)',
    allIndustries: 'அனைத்து தொழிற்சாலைகள் (All Industries)',
    selectIndustry: 'தொழிற்சாலையைத் தேர்வுசெய்க:',
    selectMonth: 'பில்லிங் மாதத்தைத் தேர்வுசெய்க:',
    baseLabourWage: '1. தொழிலாளர் ஊதியம் (வருகை × தினசரி ஊதியம்):',
    contractorCommission: '2. ஒப்பந்ததாரர் கமிஷன் (10% சேவை கட்டணம்):',
    subtotalTaxable: '3. வரிக்குரிய மொத்த மதிப்பு (கூடுதல் = 1 + 2):',
    gst18: '4. அரசு ஜிஎஸ்டி 18% (9% CGST + 9% SGST):',
    grandTotalClaim: '5. மொத்த பில் தொகை (மொத்தம் = 3 + 4):',
    submitBill: 'பில் உருவாக்கி தொழிற்சாலைக்கு அனுப்பவும்',
    viewInvoice: 'விலைப்பட்டியலை பார்க்க & அச்சிட (View & Print)',
    printStatement: 'அறிக்கையை அச்சிடுக / பிடிஎஃப் சேமிக்க',
    exportCsv: 'ECR CSV கோப்பைப் பதிவிறக்குக',
    verified: 'சரிபார்க்கப்பட்டது (Verified)',
    pending: 'நிலுவையில் (Pending)',
    locked: 'பூட்டப்பட்டது (Locked)',
    approved: 'ஒப்புதல் அளிக்கப்பட்டது (Approved)',

    industryPortal: 'தொழிற்சாலை முதன்மை போர்டல் (Principal Employer)',
    manpowerRequisition: 'தொழிலாளர் தேவை மற்றும் வழங்கல் கண்காணிப்பு (Labour Requisitions)',
    createRequisition: 'புதிய தேவையை சமர்ப்பிக்கவும்',
    gateAttendanceScan: 'வாயில் பயோமெட்ரிக் வருகை கண்காணிப்பு (Gate Monitoring)',
    billVerificationEngine: 'ஒப்பந்ததாரர் சலான் தணிக்கை மற்றும் பில் ஒப்புதல் (Bill Audit)',
    inspectDocuments: 'சலான்களைச் சோதிக்கவும் (Inspect)',
    approve: 'பில் ஒப்புதல் செய்க (Approve)',
    reject: 'நிராகரிக்க (Reject)',

    inspectorPortal: 'தொழிலாளர் ஆணையர் ஆய்வு போர்டல் (Govt. Inspector)',
    clraAuditTitle: 'சி.எல்.ஆர்.ஏ தொழிலாளர் சட்ட தணிக்கை (Statutory Audit)',
    minimumWageAudit: 'குறைந்தபட்ச ஊதிய சட்டம் மற்றும் பயோமெட்ரிக் பகுப்பாய்வு',
    issueNoticeTitle: 'சட்டரீதியான நோட்டீஸ் வெளியிடுக',

    close: 'மூடுக (Close)',
    print: 'அச்சிடுக (Print)',
    download: 'பதிவிறக்குக (Download)',
    status: 'நிலை',
    shifts: 'ஷிப்ட்கள்',
    date: 'தேதி',
    shiftTiming: 'ஷிப்ட் நேரம்',
    amount: 'தொகை (₹)'
  },

  // 7. TELUGU (తెలుగు)
  te: {
    appName: 'ShramikLink',
    tagline: 'భారతీయ తయారీ పరిశ్రమలు మరియు లేబర్ కాంట్రాక్టర్ల కోసం సీఎల్ఆర్ఏ చట్టం, బయోమెట్రిక్ మరియు ఆటోమేటెడ్ బిల్లింగ్ వేదిక.',
    selectLanguageTitle: 'దయచేసి మీ ప్రాధాన్య భాషను ఎంచుకోండి',
    selectLanguageSub: 'భారతదేశ వ్యాప్తంగా పరిశ్రమలు, కాంట్రాక్టర్లు మరియు కార్మికుల సౌలభ్యం కోసం మీ సొంత భాషలో అందుబాటులో ఉంది.',
    statutoryEnglishNote: 'చట్టబద్ధమైన నిబంధన (Statutory Rule): కేంద్ర కార్మిక మంత్రిత్వ శాఖ, EPFO, ESIC మరియు GST ఆడిట్ నిబంధనల ప్రకారం PF/ESI చలానాలు, ECR ఫైళ్లు మరియు GST Tax Invoice అధికారిక ఆంగ్ల (English) ఫార్మాట్‌లో మాత్రమే ఉత్పత్తి చేయబడతాయి.',
    statutoryEnglishBadge: 'PF / ESIC / GST బిల్లులు అధికారిక ఆంగ్ల ఫార్మాట్‌లో భద్రపరచబడ్డాయి',

    controlCenter: 'నియంత్రణ కేంద్రం (Control Center)',
    complianceSchema: 'చట్టపరమైన నిబంధనల పథకం (Compliance Schema)',
    roadmap: 'రోడ్‌మ్యాప్ (Roadmap)',
    switchRole: 'పాత్రను మార్చండి',
    logout: 'లాగ్ అవుట్ (Log Out)',
    currentRole: 'ప్రస్తుత పాత్ర:',
    activeTenant: 'క్రియాశీల పరిశ్రమ క్లయింట్',
    quickAccess: 'త్వరిత డెమో పరీక్ష (Quick Access Demo)',
    changeLanguage: 'భాషను ఎంచుకోండి (Language)',
    sandboxNotice: 'పాత్ర భద్రత యాక్టివ్‌గా ఉంది. మీరు ఎప్పుడైనా లాగ్ అవుట్ చేయవచ్చు.',
    restoreData: 'శాండ్‌బాక్స్ డేటాను పునరుద్ధరించండి',

    industryAdmin: 'పరిశ్రమ ప్రధాన యజమాని (Industry Admin)',
    industryAdminDesc: 'ఫ్యాక్టరీ నిర్వహణ, కార్మికుల అవసరాలు మరియు కాంట్రాక్టర్ బిల్లుల ఆమోదం.',
    contractor: 'లేబర్ కాంట్రాక్టర్ (Labour Contractor)',
    contractorDesc: 'కార్మికుల సరఫరా, కర్మాగారాల్లో హాజరు, పీఎఫ్/ఈఎస్ఐ చలానాలు మరియు ఆటోమేటెడ్ బిల్లింగ్.',
    worker: 'కాంట్రాక్ట్ కార్మికుడు (Contract Worker)',
    workerDesc: 'డిజిటల్ కార్మిక గుర్తింపు కార్డు, బయోమెట్రిక్ హాజరు మరియు వేతన రికార్డు.',
    inspector: 'ప్రభుత్వ కార్మిక ఇన్స్పెక్టర్ (CLRA Inspector)',
    inspectorDesc: 'కార్మిక చట్టాల రక్షణ, కనీస వేతనాలు మరియు చలానాల ఆడిట్.',
    selectRole: 'సిస్టమ్ పాత్రను ఎంచుకోండి:',
    loginButton: 'సురక్షిత లాగిన్ (Login)',
    otpRequest: 'ఓటీపీని అభ్యర్థించండి (Request OTP)',

    workerPortal: 'కార్మికుల డిజిటల్ హాజరు మరియు వేతన పోర్టల్',
    workerIdCard: 'కార్మిక గుర్తింపు కార్డు (Worker ID)',
    biometricStatus: 'బయోమెట్రిక్ ఆధార్ స్థితి:',
    checkInTitle: 'షిఫ్ట్ హాజరు నమోదు చేసుకోండి (Attendance Check-In)',
    checkInDesc: 'ఫ్యాక్టరీ గేట్ వద్ద ఆధార్ ఓటీపీ లేదా ఫేస్ స్కాన్ ద్వారా హాజరును నమోదు చేయండి.',
    aadhaarOtpCheckIn: 'ఆధార్ ఓటీపీ ద్వారా హాజరు (Aadhaar-OTP)',
    biometricFaceCheckIn: 'ఫేస్ స్కాన్ ద్వారా హాజరు (Face Scan)',
    selectTargetPlant: 'పనిచేస్తున్న పరిశ్రమను ఎంచుకోండి:',
    deployedFactory: 'ప్రస్తుత కర్మాగారం:',
    dailyWageRate: 'రోజువారీ వేతన రేటు:',
    totalEarnings: 'ఈ నెల మొత్తం సంపాదన:',
    daysWorked: 'హాజరు (పనిచేసిన రోజులు):',
    wageRegister: 'వేతన మరియు హాజరు రిజిస్టర్ (Wage Register)',
    attendanceHistory: 'పూర్తి హాజరు చరిత్ర',
    markedPresent: 'హాజరు నమోదు చేయబడింది',

    contractorPortal: 'లేబర్ కాంట్రాక్టర్ నిర్వహణ మరియు నిబంధనల కేంద్రం',
    workerPoolTitle: 'కార్మికుల జాబితా మరియు కేటాయింపు (Worker Pool)',
    multiIndustrySupply: 'వివిధ పరిశ్రమలకు కార్మికుల సరఫరా మరియు షిఫ్టులు (Multi-Industry Supply)',
    attendanceRegisterTitle: 'పరిశ్రమల వారీగా హాజరు రిజిస్టర్ (Plant Attendance Register)',
    clraStatementTitle: 'CLRA ఫారం XVII మ్యాన్-డేస్ స్టేట్‌మెంట్ (Man-Days Statement)',
    epfEsicChallanTitle: 'EPF మరియు ESIC చలానాలు & ECR జనరేటర్ (Statutory Challan)',
    billingSystemTitle: 'ఆటోమేటెడ్ బిల్లింగ్ & జీఎస్టీ టాక్స్ ఇన్వాయిస్ (Auto Billing Engine)',
    generateBillTitle: 'ఆటోమేటెడ్ బిల్లును సృష్టించి సమర్పించండి (Generate Bill)',
    taxInvoiceTitle: 'అధికారిక జీఎస్టీ టాక్స్ ఇన్వాయిస్ (Tax Invoice)',
    complianceStatusTitle: 'చట్టబద్ధమైన చలానాల ధృవీకరణ స్థితి (Compliance Status)',
    allIndustries: 'అన్ని పరిశ్రమలు (All Industries)',
    selectIndustry: 'కర్మాగారాన్ని ఎంచుకోండి:',
    selectMonth: 'బిల్లింగ్ నెలను ఎంచుకోండి:',
    baseLabourWage: '1. మొత్తం కార్మిక వేతనాలు (హాజరు × రోజువారీ వేతనం):',
    contractorCommission: '2. కాంట్రాక్టర్ సర్వీస్ కమీషన్ (10% మార్జిన్):',
    subtotalTaxable: '3. మొత్తం పన్ను విధించదగిన విలువ (సబ్‌టోటల్ = 1 + 2):',
    gst18: '4. ప్రభుత్వ జీఎస్టీ 18% (9% CGST + 9% SGST):',
    grandTotalClaim: '5. మొత్తం చెల్లించాల్సిన బిల్లు మొత్తం (మొత్తం = 3 + 4):',
    submitBill: 'బిల్లును రూపొందించి పరిశ్రమకు పంపండి',
    viewInvoice: 'ఇన్వాయిస్ చూడండి మరియు ప్రింట్ చేయండి (View & Print)',
    printStatement: 'స్టేట్‌మెంట్ ప్రింట్ / పీడీఎఫ్ సేవ్ చేయండి',
    exportCsv: 'ECR CSV ఫైల్‌ను డౌన్‌లోడ్ చేయండి',
    verified: 'ధృవీకరించబడింది (Verified)',
    pending: 'పెండింగ్‌లో ఉంది (Pending)',
    locked: 'లాక్ చేయబడింది (Locked)',
    approved: 'ఆమోదించబడింది (Approved)',

    industryPortal: 'పరిశ్రమ ప్రధాన యజమాని పోర్టల్ (Principal Employer)',
    manpowerRequisition: 'కార్మికుల డిమాండ్ మరియు పర్యవేక్షణ (Labour Requisitions)',
    createRequisition: 'కొత్త డిమాండ్‌ను సమర్పించండి',
    gateAttendanceScan: 'గేట్ బయోమెట్రిక్ హాజరు పర్యవేక్షణ (Gate Monitoring)',
    billVerificationEngine: 'కాంట్రాక్టర్ చలానా తనిఖీ మరియు బిల్లు ఆమోదం (Bill Audit)',
    inspectDocuments: 'చలానాలను తనిఖీ చేయండి (Inspect)',
    approve: 'బిల్లును ఆమోదించండి (Approve)',
    reject: 'తిరస్కరించండి (Reject)',

    inspectorPortal: 'కార్మిక కమిషనర్ తనిఖీ పోర్టల్ (Govt. Inspector)',
    clraAuditTitle: 'CLRA & వలస కార్మిక చట్టాల ఆడిట్ (Statutory Audit)',
    minimumWageAudit: 'కనీస వేతనాల చట్టం & బయోమెట్రిక్ విశ్లేషణ',
    issueNoticeTitle: 'చట్టపరమైన నోటీసు జారీ చేయండి',

    close: 'మూసివేయి (Close)',
    print: 'ప్రింట్ చేయండి (Print)',
    download: 'డౌన్‌లోడ్ చేయండి (Download)',
    status: 'స్థితి',
    shifts: 'షిఫ్టులు',
    date: 'తేదీ',
    shiftTiming: 'షిఫ్ట్ సమయం',
    amount: 'మొత్తం (₹)'
  },

  // 8. GUJARATI (ગુજરાતી)
  gu: {
    appName: 'ShramikLink',
    tagline: 'ભારતીય ઉત્પાદન ઉદ્યોગો અને લેબર કોન્ટ્રાક્ટરો માટે સીએલઆરએ કાયદાનું પાલન, બાયોમેટ્રિક અને સ્વચાલિત બિલિંગ પ્લેટફોર્મ.',
    selectLanguageTitle: 'કૃપા કરીને તમારી પસંદગીની ભાષા પસંદ કરો',
    selectLanguageSub: 'ગુજરાત ઔદ્યોગિક પટ્ટા અને સમગ્ર ભારતના કારખાનાઓ, કોન્ટ્રાક્ટરો અને શ્રમિકો માટે તમારી પોતાની ભાષામાં ઉપલબ્ધ.',
    statutoryEnglishNote: 'કાનૂની નિયમ (Statutory Rule): કેન્દ્રીય શ્રમ મંત્રાલય, EPFO, ESIC અને GST ઓડિટ નિયમો અનુસાર માત્ર PF/ESI ચલાન, ECR ફાઇલ અને GST Tax Invoice સત્તાવાર અંગ્રેજી (English) ફોર્મેટમાં જ જનરેટ થશે.',
    statutoryEnglishBadge: 'PF / ESIC / GST બિલો સત્તાવાર અંગ્રેજી ફોર્મેટમાં સાચવવામાં આવે છે',

    controlCenter: 'કંટ્રોલ સેન્ટર (Control Center)',
    complianceSchema: 'કાયદાકીય નિયમો (Compliance Schema)',
    roadmap: 'રોડમેપ (Roadmap)',
    switchRole: 'ભૂમિકા બદલો',
    logout: 'લૉગ આઉટ (Log Out)',
    currentRole: 'વર્તમાન ભૂમિકા:',
    activeTenant: 'સક્રિય ઉદ્યોગ ક્લાયન્ટ',
    quickAccess: 'ઝડપી ડેમો પરીક્ષણ (Quick Access Demo)',
    changeLanguage: 'ભાષા પસંદ કરો (Language)',
    sandboxNotice: 'ભૂમિકા સુરક્ષા સક્રિય છે. તમે ગમે ત્યારે લૉગ આઉટ કરી શકો છો.',
    restoreData: 'સેન્ડબોક્સ ડેટા રીસેટ કરો',

    industryAdmin: 'ઉદ્યોગ મુખ્ય માલિક (Industry Admin)',
    industryAdminDesc: 'કારખાનાનું સંચાલન, શ્રમિકોની જરૂરિયાત અને કોન્ટ્રાક્ટર બિલ મંજૂરી.',
    contractor: 'લેબર કોન્ટ્રાક્ટર (Labour Contractor)',
    contractorDesc: 'શ્રમિક પુરવઠો, કારખાનામાં હાજરી, પીએફ/ઇએસઆઈ ચલાન અને સ્વચાલિત બિલિંગ.',
    worker: 'કોન્ટ્રાક્ટ શ્રમિક (Contract Worker)',
    workerDesc: 'ડિજિટલ શ્રમિક ઓળખપત્ર, બાયોમેટ્રિક હાજરી અને વેતન રેકોર્ડ.',
    inspector: 'સરકારી શ્રમ નિરીક્ષક (CLRA Inspector)',
    inspectorDesc: 'શ્રમ કાયદા સુરક્ષા, લઘુત્તમ વેતન અને ચલાન ઓડિટ.',
    selectRole: 'સિસ્ટમ ભૂમિકા પસંદ કરો:',
    loginButton: 'સુરક્ષિત પ્રવેશ (Login)',
    otpRequest: 'ઓટીપી વિનંતી કરો (Request OTP)',

    workerPortal: 'શ્રમિક ડિજિટલ હાજરી અને વેતન પોર્ટલ',
    workerIdCard: 'શ્રમિક ઓળખપત્ર (Worker ID Card)',
    biometricStatus: 'બાયોમેટ્રિક આધાર સ્થિતિ:',
    checkInTitle: 'કારખાના શિફ્ટમાં હાજરી નોંધાવો (Attendance Check-In)',
    checkInDesc: 'કારખાનાના ગેટ પર આધાર ઓટીપી અથવા ફેસ સ્કેન દ્વારા હાજરી નોંધાવો.',
    aadhaarOtpCheckIn: 'આધાર ઓટીપી દ્વારા ચેક-ઇન (Aadhaar-OTP)',
    biometricFaceCheckIn: 'ફેસ સ્કેન દ્વારા ચેક-ઇન (Face Scan)',
    selectTargetPlant: 'કાર્યરત કારખાનું પસંદ કરો:',
    deployedFactory: 'હાલમાં કાર્યરત કારખાનું:',
    dailyWageRate: 'દૈનિક વેતન દર:',
    totalEarnings: 'આ મહિનાની કુલ કમાણી:',
    daysWorked: 'હાજરી (કામના દિવસો):',
    wageRegister: 'વેતન અને હાજરી રજીસ્ટર (Wage Register)',
    attendanceHistory: 'હાજરીનો સંપૂર્ણ ઇતિહાસ',
    markedPresent: 'હાજર નોંધાયેલ છે',

    contractorPortal: 'લેબર કોન્ટ્રાક્ટર સંચાલન અને કાયદા પાલન કેન્દ્ર',
    workerPoolTitle: 'શ્રમિક યાદી અને કારખાના ફાળવણી (Worker Pool)',
    multiIndustrySupply: 'વિવિધ ઉદ્યોગોમાં શ્રમિક પુરવઠો અને શિફ્ટ (Multi-Industry Supply)',
    attendanceRegisterTitle: 'કારખાનાવાર હાજરી રજીસ્ટર (Plant Attendance Register)',
    clraStatementTitle: 'CLRA ફોર્મ XVII મેન-ડેઝ સ્ટેટમેન્ટ (Man-Days Statement)',
    epfEsicChallanTitle: 'EPF અને ESIC ચલાન અને ECR જનરેટર (Statutory Challan)',
    billingSystemTitle: 'સ્વચાલિત બિલિંગ અને જીએસટી ટેક્સ ઇનવોઇસ (Auto Billing Engine)',
    generateBillTitle: 'સ્વચાલિત બિલ બનાવો અને સબમિટ કરો (Generate Bill)',
    taxInvoiceTitle: 'સત્તાવાર જીએસટી ટેક્સ ઇનવોઇસ (Tax Invoice)',
    complianceStatusTitle: 'કાયદાકીય ચલાન ચકાસણી સ્થિતિ (Compliance Status)',
    allIndustries: 'તમામ કારખાનાઓ (All Industries)',
    selectIndustry: 'કારખાનું પસંદ કરો:',
    selectMonth: 'બિલિંગ મહિનો પસંદ કરો:',
    baseLabourWage: '૧. કુલ શ્રમિક વેતન (હાજરી × દૈનિક વેતન):',
    contractorCommission: '૨. કોન્ટ્રાક્ટર સર્વિસ કમિશન (૧૦% માર્જિન):',
    subtotalTaxable: '૩. કુલ કરપાત્ર રકમ (સબટોટલ = ૧ + ૨):',
    gst18: '૪. સરકારી જીએસટી ૧૮% (૯% CGST + ૯% SGST):',
    grandTotalClaim: '૫. કુલ ચૂકવવાપાત્ર બિલ રકમ (કુલ બિલ = ૩ + ૪):',
    submitBill: 'બિલ બનાવીને કારખાનાને મોકલો',
    viewInvoice: 'ઇનવોઇસ જુઓ અને પ્રિન્ટ કરો (View & Print)',
    printStatement: 'સ્ટેટમેન્ટ પ્રિન્ટ / પીડીએફ સાચવો',
    exportCsv: 'ECR CSV ફાઇલ ડાઉનલોડ કરો',
    verified: 'ચકાસાયેલ (Verified)',
    pending: 'બાકી (Pending)',
    locked: 'લૉક કરેલ (Locked)',
    approved: 'મંજૂર કરેલ (Approved)',

    industryPortal: 'ઉદ્યોગ મુખ્ય માલિક પોર્ટલ (Principal Employer)',
    manpowerRequisition: 'શ્રમિક માંગ અને પુરવઠો મોનિટરિંગ (Labour Requisitions)',
    createRequisition: 'નવી માંગ સબમિટ કરો',
    gateAttendanceScan: 'ગેટ બાયોમેટ્રિક હાજરી મોનિટરિંગ (Gate Monitoring)',
    billVerificationEngine: 'કોન્ટ્રાક્ટર ચલાન ચકાસણી અને બિલ મંજૂરી (Bill Audit)',
    inspectDocuments: 'ચલાનોની તપાસ કરો (Inspect)',
    approve: 'બિલ મંજૂર કરો (Approve)',
    reject: 'અસ્વીકાર કરો (Reject)',

    inspectorPortal: 'શ્રમ કમિશનર નિરીક્ષણ પોર્ટલ (Govt. Inspector)',
    clraAuditTitle: 'CLRA અને સ્થળાંતરિત શ્રમિક કાયદા ઓડિટ (Statutory Audit)',
    minimumWageAudit: 'લઘુત્તમ વેતન કાયદો અને બાયોમેટ્રિક વિશ્લેષણ',
    issueNoticeTitle: 'કાયદાકીય નોટિસ જારી કરો',

    close: 'બંધ કરો (Close)',
    print: 'પ્રિન્ટ કરો (Print)',
    download: 'ડાઉનલોડ કરો (Download)',
    status: 'સ્થિતિ',
    shifts: 'શિફ્ટ',
    date: 'તારીખ',
    shiftTiming: 'શિફ્ટનો સમય',
    amount: 'રકમ (₹)'
  }
};

/**
 * Hook or helper to retrieve language from localStorage or default
 */
export const getStoredLanguage = (): AppLanguage => {
  const saved = localStorage.getItem('shramiklink_app_lang') as AppLanguage;
  if (saved && TRANSLATIONS[saved]) {
    return saved;
  }
  return 'as'; // Default to user's native Assamese or English
};

export const setStoredLanguage = (lang: AppLanguage): void => {
  localStorage.setItem('shramiklink_app_lang', lang);
};
