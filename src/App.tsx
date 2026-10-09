/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  Database, 
  Milestone, 
  Smartphone,
  LogOut,
  Factory
} from 'lucide-react';
import SaaSApp from './components/SaaSApp';
import ArchitectureDocs from './components/ArchitectureDocs';
import RoadmapView from './components/RoadmapView';
import MobileSingleView from './components/MobileSingleView';
import { AppLanguage, getStoredLanguage, setStoredLanguage, TRANSLATIONS } from './i18n';
import { LanguageSelector } from './components/LanguageSelector';

export default function App() {
  // Pure Industry / Factory Standalone Mode: 'app' (Main Console) | 'architecture' | 'roadmap'
  const [activeTab, setActiveTab] = useState<'app' | 'architecture' | 'roadmap'>(() => {
    return 'app';
  });

  const [currentLang, setCurrentLangState] = useState<AppLanguage>(() => getStoredLanguage());
  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    const saved = localStorage.getItem('icwl_mobile_mode') || localStorage.getItem('shramiklink_mobile_mode');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  const toggleMobileMode = (val: boolean) => {
    setIsMobileView(val);
    localStorage.setItem('icwl_mobile_mode', val ? 'true' : 'false');
    localStorage.setItem('shramiklink_mobile_mode', val ? 'true' : 'false');
  };

  const handleTabChange = (tab: 'app' | 'architecture' | 'roadmap') => {
    setActiveTab(tab);
    localStorage.setItem('icwl_industry_tab', tab);
    localStorage.setItem('shramiklink_industry_tab', tab);
  };

  React.useEffect(() => {
    // Clear any previous tea garden cached tabs and role from browser localStorage
    try {
      localStorage.removeItem('shramiklink_current_app');
      localStorage.removeItem('shramiklink_active_tab');
      localStorage.removeItem('shramiklink_tea_active_tab');
      localStorage.removeItem('shramiklink_tea_state');
      if (localStorage.getItem('s_current_role') === 'tea_garden') {
        localStorage.setItem('s_current_role', 'industry_admin');
      }
      // If URL has ?app=bagan or ?app=hub, clean it up to keep it purely industry
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (url.searchParams.has('app') && url.searchParams.get('app') !== 'udyog') {
          url.searchParams.delete('app');
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch {
      // ignore
    }

    const handleOpenAppTab = () => handleTabChange('app');
    window.addEventListener('open-app-tab', handleOpenAppTab);

    const handleResize = () => {
      const saved = localStorage.getItem('shramiklink_mobile_mode');
      if (saved === null && window.innerWidth < 768) {
        setIsMobileView(true);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
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
    <div className="h-screen w-full bg-white text-slate-900 flex flex-col font-sans overflow-hidden relative">
      
      {/* Main Container */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        
        {/* ========================================================================= */}
        {/* STANDALONE INDUSTRY & FACTORY SAAS TOP NAVIGATION (উদ্যোগিক শ্ৰম ব্যৱস্থাপনা) */}
        {/* ========================================================================= */}
        <nav className="bg-slate-950 text-white flex justify-between items-center h-14 shrink-0 z-40 border-b border-indigo-900/60 shadow-md px-3 md:px-5">
          {/* Brand & Logo */}
          <div className="flex items-center gap-2.5 mr-2 sm:mr-4 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 border border-indigo-500/50 flex items-center justify-center shadow-xs overflow-hidden p-0.5">
              <img src="/ICWL.png" alt="ICWL Logo" className="w-full h-full object-contain rounded-lg" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                IndustrialContractorWorkerLink <span className="text-indigo-400 font-bold text-xs font-mono">(ICWL)</span>
              </span>
              <span className="text-[9px] text-indigo-300/90 font-bold tracking-wider uppercase hidden sm:inline">
                Factories Act, 1948 & CLRA 1970 • ঔদ্যোগিক শ্ৰম অনুপালন
              </span>
            </div>
          </div>

          {/* Dedicated Sub-Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 h-full flex-1 overflow-x-auto">
            <button
              id="industry-app-btn"
              onClick={() => handleTabChange('app')}
              className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'app'
                  ? 'text-indigo-400 font-bold bg-indigo-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="h-4 w-4 text-indigo-400" />
              <span className="text-xs tracking-wide">🏭 কাৰখানা ডেশ্ববৰ্ড ও চালান তলা</span>
              {activeTab === 'app' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>

            <button
              id="industry-arch-btn"
              onClick={() => handleTabChange('architecture')}
              className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'text-indigo-400 font-bold bg-indigo-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="h-4 w-4 text-indigo-400" />
              <span className="text-xs tracking-wide">📐 CLRA ও আইনী সংৰচনা</span>
              {activeTab === 'architecture' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>

            <button
              id="industry-roadmap-btn"
              onClick={() => handleTabChange('roadmap')}
              className={`flex items-center justify-center space-x-1.5 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'roadmap'
                  ? 'text-indigo-400 font-bold bg-indigo-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Milestone className="h-4 w-4 text-indigo-400" />
              <span className="text-xs tracking-wide">🚀 ৰোডমেপ</span>
              {activeTab === 'roadmap' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Quick Actions & Logout */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('icwl-logout'));
                window.dispatchEvent(new CustomEvent('shramiklink-logout'));
              }}
              title="লগইন পেজ / নতুন প্ৰৱেশদ্বাৰ"
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

        {/* Persistent Statutory Legal Strip (Pure Industry Focus) */}
        <div className="px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 border-b shadow-xs bg-indigo-950/90 border-indigo-800/60 text-indigo-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold flex items-center gap-1.5">
              <Factory className="h-4 w-4 text-indigo-400 shrink-0" />
              <span className="text-white">উদ্যোগিক শ্ৰম অনুপালন প্ৰণালী সক্ৰিয়:</span>
              <span className="text-indigo-300 font-mono">
                Statutory Act: Factories Act, 1948 & CLRA Act, 1970 (EPFO & ESIC Compliant)
              </span>
            </span>
            <span className="text-slate-400 hidden lg:inline">
              • অসংগঠিত ঠিকাদাৰী শ্ৰমিক, অনুজ্ঞাপত্ৰ অডিট, গেট এন্ট্ৰি ও Compliance-Locked Billing
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Zero Ghost Worker & Locked Billing Active</span>
            </span>
          </div>
        </div>

        {/* Viewport Content with Clean White Dashboard Background */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 pb-8 space-y-6 bg-white text-slate-900">
          
          {activeTab === 'app' && (
            <div className="space-y-6">
              <SaaSApp 
                externalLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm text-slate-900">
              <ArchitectureDocs />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm text-slate-900">
              <RoadmapView />
            </div>
          )}

          {/* Micro Footer */}
          <footer className="border-t border-slate-200 pt-6 text-[11px] text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
            <span>
              © 2026 IndustrialContractorWorkerLink (ICWL) • Factories Act, 1948 আৰু CLRA Act, 1970 ৰ নিৰ্দেশনা অনুযায়ী নিৰ্মিত ঔদ্যোগিক শ্ৰম ব্যৱস্থাপনা প্ৰণালী।
            </span>
            <div className="flex gap-4">
              <span className="text-slate-600 font-medium">EPFO & ESIC Compliance-Locked</span>
              <span>&bull;</span>
              <span className="text-slate-600 font-medium">CLRA Form XVI & XVII</span>
              <span>&bull;</span>
              <span className="text-indigo-600 font-bold">Founder: Bhaskar Senapati, Assam</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
