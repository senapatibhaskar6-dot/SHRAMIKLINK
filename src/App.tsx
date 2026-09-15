/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Database, 
  Milestone, 
  ShieldCheck, 
  Layers, 
  HelpCircle,
  FileText,
  Sprout,
  Smartphone,
  LogOut,
  Scale,
  Factory,
  ChevronRight,
  ArrowRight,
  ArrowLeftRight,
  Award,
  ExternalLink
} from 'lucide-react';
import SaaSApp from './components/SaaSApp';
import ArchitectureDocs from './components/ArchitectureDocs';
import RoadmapView from './components/RoadmapView';
import TeaGardenWorkflow from './components/TeaGardenWorkflow';
import MobileSingleView from './components/MobileSingleView';
import GovernmentSeparationModal from './components/GovernmentSeparationModal';
import DualAppHub from './components/DualAppHub';
import { AppLanguage, getStoredLanguage, setStoredLanguage, TRANSLATIONS } from './i18n';
import { LanguageSelector } from './components/LanguageSelector';
import logoUrl from './assets/images/shramiklink_logo_1788402038953.jpg';

export default function App() {
  // Dual App Mode: 'bagan' (BaganLink - PLA 1951) | 'udyog' (UdyogLink - CLRA 1970) | 'hub' (Dual App Launcher)
  const [currentApp, setCurrentApp] = useState<'bagan' | 'udyog' | 'hub'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      if (appParam === 'bagan') return 'bagan';
      if (appParam === 'udyog') return 'udyog';
      if (appParam === 'hub') return 'hub';
      const saved = localStorage.getItem('shramiklink_current_app');
      if (saved === 'bagan' || saved === 'udyog' || saved === 'hub') return saved;
    }
    return 'bagan'; // Default to BaganLink standalone app
  });

  // Internal tab within BaganLink
  const [baganSubTab, setBaganSubTab] = useState<'workflow' | 'architecture'>('workflow');

  // Internal tab within UdyogLink
  const [udyogSubTab, setUdyogSubTab] = useState<'app' | 'architecture' | 'roadmap'>('app');

  const [currentLang, setCurrentLangState] = useState<AppLanguage>(() => getStoredLanguage());
  const [isGovModalOpen, setIsGovModalOpen] = useState<boolean>(false);
  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    const saved = localStorage.getItem('shramiklink_mobile_mode');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  const toggleMobileMode = (val: boolean) => {
    setIsMobileView(val);
    localStorage.setItem('shramiklink_mobile_mode', val ? 'true' : 'false');
  };

  const handleSwitchApp = (app: 'bagan' | 'udyog' | 'hub') => {
    setCurrentApp(app);
    localStorage.setItem('shramiklink_current_app', app);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('app', app);
      window.history.replaceState({}, '', url.toString());
    }
  };

  React.useEffect(() => {
    const handleOpenTeaGarden = () => handleSwitchApp('bagan');
    const handleOpenAppTab = () => handleSwitchApp('udyog');
    window.addEventListener('open-tea-garden', handleOpenTeaGarden);
    window.addEventListener('open-app-tab', handleOpenAppTab);

    // If screen is resized below 768px and no manual override, suggest mobile
    const handleResize = () => {
      const saved = localStorage.getItem('shramiklink_mobile_mode');
      if (saved === null && window.innerWidth < 768) {
        setIsMobileView(true);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('open-tea-garden', handleOpenTeaGarden);
      window.removeEventListener('open-app-tab', handleOpenAppTab);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLanguageChange = (lang: AppLanguage) => {
    setCurrentLangState(lang);
    setStoredLanguage(lang);
  };

  const t = TRANSLATIONS[currentLang];

  if (isMobileView) {
    return (
      <MobileSingleView
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onSwitchToFullDesktop={() => toggleMobileMode(false)}
      />
    );
  }

  return (
    <div className="h-screen w-full bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden relative">
      
      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* ========================================================================= */}
        {/* CASE 1: STANDALONE APP 1: BAGANLINK (🌿 চাহ বাগিচা স্বতন্ত্ৰ এপ্প) */}
        {/* ========================================================================= */}
        {currentApp === 'bagan' && (
          <nav className="bg-emerald-950 text-white flex justify-between items-center h-14 shrink-0 z-40 border-b border-emerald-800/80 shadow-md px-3 md:px-5">
            {/* BaganLink Brand & Logo */}
            <div className="flex items-center gap-2.5 mr-2 sm:mr-4 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-900 border border-emerald-400/50 flex items-center justify-center shadow-xs text-emerald-300">
                <Sprout className="h-5 w-5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  বাগান-লিংক <span className="text-emerald-400 font-medium text-xs font-mono">(BaganLink)</span>
                </span>
                <span className="text-[9px] text-emerald-300/90 font-bold tracking-wider uppercase hidden sm:inline">
                  Assam PLA 1951 • স্বতন্ত্ৰ বাগিচা এপ্প
                </span>
              </div>
            </div>

            {/* BaganLink Dedicated Sub-Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2 h-full flex-1 overflow-x-auto">
              <button
                id="bagan-workflow-btn"
                onClick={() => setBaganSubTab('workflow')}
                className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                  baganSubTab === 'workflow'
                    ? 'text-emerald-300 font-bold bg-emerald-900/40'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                <Sprout className="h-4 w-4 text-emerald-400" />
                <span className="text-xs tracking-wide">🍃 চৰ্দাৰ হাজিৰা ও পাত খতিয়ান</span>
                {baganSubTab === 'workflow' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>

              <button
                id="bagan-arch-btn"
                onClick={() => setBaganSubTab('architecture')}
                className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                  baganSubTab === 'architecture'
                    ? 'text-emerald-300 font-bold bg-emerald-900/40'
                    : 'text-emerald-200/70 hover:text-white'
                }`}
              >
                <Scale className="h-4 w-4 text-emerald-400" />
                <span className="text-xs tracking-wide">🏛️ PLA 1951 আইনী সংৰচনা</span>
                {baganSubTab === 'architecture' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
                )}
              </button>
            </div>

            {/* Quick Actions & App Switcher */}
            <div className="shrink-0 flex items-center gap-2">
              {/* Dual App Hub / Switch App */}
              <button
                id="switch-to-udyog-btn"
                onClick={() => handleSwitchApp('udyog')}
                title="উদ্যোগ-লিংক (UdyogLink) স্বতন্ত্ৰ এপ্পলৈ যাওক"
                className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Factory className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span className="hidden md:inline">🏭 উদ্যোগ-লিংক এপ্প</span>
                <span className="md:hidden">উদ্যোগ</span>
              </button>

              {/* Master Hub / Govt Certificate Button */}
              <button
                id="open-hub-from-bagan-btn"
                onClick={() => handleSwitchApp('hub')}
                title="চৰকাৰী স্বীকাৰোক্তি আৰু দ্বৈত এপ হাব (Dual App Statutory Hub)"
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="hidden xl:inline">🏛️ চৰকাৰী প্ৰমাণপত্ৰ</span>
                <span className="xl:hidden">প্ৰমাণপত্ৰ</span>
              </button>

              <button
                onClick={() => toggleMobileMode(true)}
                title="মোবাইল সৰল ভিউলৈ যাওক"
                className="bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline">মোবাইল</span>
              </button>

              <LanguageSelector 
                currentLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
                variant="header" 
              />
            </div>
          </nav>
        )}

        {/* ========================================================================= */}
        {/* CASE 2: STANDALONE APP 2: UDYOGLINK (🏭 কাৰখানা ও ঠিকা শ্ৰমিক স্বতন্ত্ৰ এপ্প) */}
        {/* ========================================================================= */}
        {currentApp === 'udyog' && (
          <nav className="bg-slate-950 text-white flex justify-between items-center h-14 shrink-0 z-40 border-b border-indigo-900/60 shadow-md px-3 md:px-5">
            {/* UdyogLink Brand & Logo */}
            <div className="flex items-center gap-2.5 mr-2 sm:mr-4 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-500/50 flex items-center justify-center shadow-xs text-indigo-300">
                <Factory className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  উদ্যোগ-লিংক <span className="text-indigo-400 font-medium text-xs font-mono">(UdyogLink)</span>
                </span>
                <span className="text-[9px] text-indigo-300/90 font-bold tracking-wider uppercase hidden sm:inline">
                  Factories Act & CLRA 1970 • স্বতন্ত্ৰ কাৰখানা এপ্প
                </span>
              </div>
            </div>

            {/* UdyogLink Dedicated Sub-Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2 h-full flex-1 overflow-x-auto">
              <button
                id="udyog-app-btn"
                onClick={() => setUdyogSubTab('app')}
                className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                  udyogSubTab === 'app'
                    ? 'text-indigo-400 font-bold bg-indigo-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="h-4 w-4 text-indigo-400" />
                <span className="text-xs tracking-wide">🏭 কাৰখানা ডেশ্ববৰ্ড ও চালন তলা</span>
                {udyogSubTab === 'app' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
                )}
              </button>

              <button
                id="udyog-arch-btn"
                onClick={() => setUdyogSubTab('architecture')}
                className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                  udyogSubTab === 'architecture'
                    ? 'text-indigo-400 font-bold bg-indigo-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="h-4 w-4 text-indigo-400" />
                <span className="text-xs tracking-wide">📐 CLRA 1970 আইনী সংৰচনা</span>
                {udyogSubTab === 'architecture' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
                )}
              </button>

              <button
                id="udyog-roadmap-btn"
                onClick={() => setUdyogSubTab('roadmap')}
                className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                  udyogSubTab === 'roadmap'
                    ? 'text-indigo-400 font-bold bg-indigo-950/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Milestone className="h-4 w-4 text-indigo-400" />
                <span className="text-xs tracking-wide">🚀 ৰোডমেপ</span>
                {udyogSubTab === 'roadmap' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
                )}
              </button>
            </div>

            {/* Quick Actions & App Switcher */}
            <div className="shrink-0 flex items-center gap-2">
              {/* Switch to BaganLink */}
              <button
                id="switch-to-bagan-btn"
                onClick={() => handleSwitchApp('bagan')}
                title="বাগান-লিংক (BaganLink) স্বতন্ত্ৰ এপ্পলৈ যাওক"
                className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Sprout className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span className="hidden md:inline">🌿 বাগান-লিংক এপ্প</span>
                <span className="md:hidden">বাগান</span>
              </button>

              {/* Master Hub / Govt Certificate Button */}
              <button
                id="open-hub-from-udyog-btn"
                onClick={() => handleSwitchApp('hub')}
                title="চৰকাৰী স্বীকাৰোক্তি আৰু দ্বৈত এপ হাব (Dual App Statutory Hub)"
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Award className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="hidden xl:inline">🏛️ চৰকাৰী প্ৰমাণপত্ৰ</span>
                <span className="xl:hidden">প্ৰমাণপত্ৰ</span>
              </button>

              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('shramiklink-logout'));
                }}
                title="লগইন পেজ"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span className="hidden md:inline">লগইন</span>
              </button>

              <button
                onClick={() => toggleMobileMode(true)}
                title="মোবাইল সৰল ভিউলৈ যাওক"
                className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">মোবাইল</span>
              </button>

              <LanguageSelector 
                currentLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
                variant="header" 
              />
            </div>
          </nav>
        )}

        {/* ========================================================================= */}
        {/* CASE 3: MASTER LAUNCHER & DUAL APP HUB (🏛️ চৰকাৰী দ্বৈত স্বতন্ত্ৰ এপ হাব) */}
        {/* ========================================================================= */}
        {currentApp === 'hub' && (
          <nav className="bg-slate-950 text-white flex justify-between items-center h-14 shrink-0 z-40 border-b border-amber-500/30 shadow-md px-3 md:px-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <span className="text-sm font-black text-white flex items-center gap-1.5">
                  শ্ৰমিকলিংকছ <span className="text-amber-400 font-medium text-xs font-mono">Dual App Hub</span>
                </span>
                <span className="text-[9px] text-amber-300/80 font-bold uppercase hidden sm:inline">
                  অসম শ্ৰম বিভাগ বিধিসন্মত দ্বৈত এপ প্ৰৱেশদ্বাৰ
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSwitchApp('bagan')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <Sprout className="h-3.5 w-3.5" />
                <span>🌿 বাগান-লিংক এপ্প</span>
              </button>

              <button
                onClick={() => handleSwitchApp('udyog')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
              >
                <Factory className="h-3.5 w-3.5" />
                <span>🏭 উদ্যোগ-লিংক এপ্প</span>
              </button>

              <LanguageSelector 
                currentLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
                variant="header" 
              />
            </div>
          </nav>
        )}

        {/* Persistent Statutory Jurisdiction Banner */}
        <div className={`px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b shadow-xs ${
          currentApp === 'bagan' 
            ? 'bg-emerald-950/90 border-emerald-800/60 text-emerald-200' 
            : currentApp === 'udyog'
            ? 'bg-indigo-950/90 border-indigo-800/60 text-indigo-200'
            : 'bg-slate-950 border-amber-500/30 text-amber-200'
        }`}>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold flex items-center gap-1.5">
              {currentApp === 'bagan' ? (
                <>
                  <Sprout className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-white">🌿 বাগান-লিংক (BaganLink) সক্ৰিয়:</span>
                  <span className="font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] border border-emerald-500/30">
                    Statutory Act: Assam Plantations Labour Act (PLA), 1951 & ATPO/APF Board
                  </span>
                </>
              ) : currentApp === 'udyog' ? (
                <>
                  <Factory className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="text-white">🏭 উদ্যোগ-লিংক (UdyogLink) সক্ৰিয়:</span>
                  <span className="font-mono bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[11px] border border-indigo-500/30">
                    Statutory Act: Factories Act, 1948 & CLRA Act, 1970 (EPFO/ESIC)
                  </span>
                </>
              ) : (
                <>
                  <Scale className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="text-white">শ্ৰমিকলিংকছ দ্বৈত স্বতন্ত্ৰ প্ৰণালী:</span>
                  <span className="text-amber-300">চৰকাৰী নিৰ্দেশনা অনুসৰি ২ টা সুকীয়া এপ্প</span>
                </>
              )}
            </span>
            <span className="text-[11px] text-slate-300 hidden md:inline">
              {currentApp === 'bagan' 
                ? '• সুসংগঠিত বাগিচা শ্ৰমিক, মহৰী/চৰ্দাৰ দল আৰু সেউজ পাত খতিয়ান'
                : currentApp === 'udyog'
                ? '• অসংগঠিত ঠিকাদাৰী শ্ৰমিক, অনুজ্ঞাপত্ৰ অডিট আৰু গেটপাছ'
                : '• Zero Data Cross-Contamination & Isolated Database Schemas'}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsGovModalOpen(true)}
              className="underline hover:text-white font-bold text-[11px] cursor-pointer flex items-center gap-1"
            >
              <span>আইনগত বিভাজন প্ৰতিবেদন (Govt Brief)</span>
              <ChevronRight className="h-3 w-3" />
            </button>
            {currentApp !== 'hub' && (
              <button
                onClick={() => handleSwitchApp('hub')}
                className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer"
              >
                এপ লঞ্চাৰ
              </button>
            )}
          </div>
        </div>

        {/* Viewport Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 pb-8 space-y-6">
          
          {/* 1. BAGANLINK APP BODY */}
          {currentApp === 'bagan' && (
            <>
              {baganSubTab === 'workflow' && (
                <div className="rounded-2xl border border-emerald-900/60 overflow-hidden shadow-2xl min-h-[700px] flex flex-col">
                  <TeaGardenWorkflow />
                </div>
              )}
              {baganSubTab === 'architecture' && (
                <div className="bg-slate-950 rounded-2xl border border-emerald-900/60 p-4 sm:p-6 shadow-xs">
                  <ArchitectureDocs />
                </div>
              )}
            </>
          )}

          {/* 2. UDYOGLINK APP BODY */}
          {currentApp === 'udyog' && (
            <>
              {udyogSubTab === 'app' && (
                <div className="space-y-6">
                  <SaaSApp 
                    externalLang={currentLang} 
                    onLanguageChange={handleLanguageChange} 
                  />
                </div>
              )}
              {udyogSubTab === 'architecture' && (
                <div className="bg-slate-950 rounded-2xl border border-indigo-900/60 p-4 sm:p-6 shadow-xs">
                  <ArchitectureDocs />
                </div>
              )}
              {udyogSubTab === 'roadmap' && (
                <div className="bg-slate-950 rounded-2xl border border-indigo-900/60 p-4 sm:p-6 shadow-xs">
                  <RoadmapView />
                </div>
              )}
            </>
          )}

          {/* 3. DUAL APP HUB BODY */}
          {currentApp === 'hub' && (
            <DualAppHub 
              onLaunchBaganLink={() => handleSwitchApp('bagan')}
              onLaunchUdyogLink={() => handleSwitchApp('udyog')}
              onOpenGovReport={() => setIsGovModalOpen(true)}
              currentSelectedApp={currentApp}
            />
          )}

          {/* Micro Footer */}
          <footer className="border-t border-slate-800 pt-6 text-[11px] text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
            <span>
              {currentApp === 'bagan' 
                ? '© 2026 বাগান-লিংক (BaganLink) • অসম চৰকাৰৰ Plantations Labour Act, 1951 আৰু ATPO/APF ব’ৰ্ডৰ নিৰ্দেশনা অনুযায়ী নিৰ্মিত।'
                : currentApp === 'udyog'
                ? '© 2026 উদ্যোগ-লিংক (UdyogLink) • Factories Act, 1948 আৰু CLRA Act, 1970 ৰ নিৰ্দেশনা অনুযায়ী নিৰ্মিত।'
                : '© 2026 ShramikLinks Dual Autonomous Applications • Founder: Bhaskar Senapati, Assam, India.'}
            </span>
            <div className="flex gap-4">
              <button onClick={() => setIsGovModalOpen(true)} className="hover:text-white underline cursor-pointer">
                Statutory Separation Certificate
              </button>
              <span>&bull;</span>
              <button onClick={() => handleSwitchApp('hub')} className="hover:text-white underline cursor-pointer">
                Dual App Hub
              </button>
              <span>&bull;</span>
              <span className="text-slate-500">Zero Data Contamination</span>
            </div>
          </footer>
        </div>
      </main>

      {/* Official Government Separation Brief Modal */}
      <GovernmentSeparationModal 
        isOpen={isGovModalOpen}
        onClose={() => setIsGovModalOpen(false)}
        onSelectPortal={(portal) => {
          handleSwitchApp(portal === 'tea_garden' ? 'bagan' : 'udyog');
        }}
      />
    </div>
  );
}
