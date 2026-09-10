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
  Smartphone
} from 'lucide-react';
import SaaSApp from './components/SaaSApp';
import ArchitectureDocs from './components/ArchitectureDocs';
import RoadmapView from './components/RoadmapView';
import TeaGardenWorkflow from './components/TeaGardenWorkflow';
import MobileSingleView from './components/MobileSingleView';
import { AppLanguage, getStoredLanguage, setStoredLanguage, TRANSLATIONS } from './i18n';
import { LanguageSelector } from './components/LanguageSelector';
import logoUrl from './assets/images/shramiklink_logo_1788402038953.jpg';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'tea_garden' | 'architecture' | 'roadmap'>(() => {
    const saved = localStorage.getItem('shramiklink_active_tab');
    return (saved as any) || 'app';
  });
  const [currentLang, setCurrentLangState] = useState<AppLanguage>(() => getStoredLanguage());
  const [isMobileView, setIsMobileView] = useState<boolean>(() => {
    const saved = localStorage.getItem('shramiklink_mobile_mode');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  const toggleMobileMode = (val: boolean) => {
    setIsMobileView(val);
    localStorage.setItem('shramiklink_mobile_mode', val ? 'true' : 'false');
  };

  const handleTabChange = (tab: 'app' | 'tea_garden' | 'architecture' | 'roadmap') => {
    setActiveTab(tab);
    localStorage.setItem('shramiklink_active_tab', tab);
  };

  React.useEffect(() => {
    const handleOpenTeaGarden = () => handleTabChange('tea_garden');
    const handleOpenAppTab = () => handleTabChange('app');
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
    <div className="h-screen w-full bg-slate-100 text-slate-900 flex flex-col font-sans overflow-hidden relative">
      
      {/* Main Container Right Pane */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Modern Persistent Top Navigation Bar (Placed ABOVE the "AD" header) */}
        <nav className="bg-slate-900 text-white flex justify-between items-center h-14 shrink-0 z-40 border-b border-slate-800 shadow-sm px-3 md:px-5">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5 mr-2 sm:mr-6 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shadow-xs border border-white/20">
              <img 
                src={logoUrl} 
                alt="ShramikLinks Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/shramiklinks_logo.jpg';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight text-white flex items-center">
                Shramik<span className="text-orange-500">Links</span>
              </span>
              <span className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase hidden sm:inline">
                CLRA Compliance
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 h-full flex-1 overflow-x-auto">
            <button
              id="tab-app-btn"
              onClick={() => handleTabChange('app')}
              className={`flex items-center justify-center space-x-2 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'app'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className={`h-4 w-4 ${activeTab === 'app' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-xs tracking-wide font-medium">{t.controlCenter}</span>
              {activeTab === 'app' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>

            <button
              id="tab-teagarden-btn"
              onClick={() => handleTabChange('tea_garden')}
              className={`flex items-center justify-center space-x-2 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'tea_garden'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Sprout className={`h-4 w-4 ${activeTab === 'tea_garden' ? 'text-emerald-400' : 'text-emerald-400/80'}`} />
              <span className="text-xs tracking-wide font-medium flex items-center gap-1.5">
                <span>🍃 চাহ বাগিচা ও চৰ্দাৰ পেনেল (Tea Garden)</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold border border-emerald-500/30">
                  Assam PLA
                </span>
              </span>
              {activeTab === 'tea_garden' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>

            <button
              id="tab-arch-btn"
              onClick={() => handleTabChange('architecture')}
              className={`flex items-center justify-center space-x-2 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'architecture'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className={`h-4 w-4 ${activeTab === 'architecture' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-xs tracking-wide font-medium">{t.complianceSchema}</span>
              {activeTab === 'architecture' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>

            <button
              id="tab-roadmap-btn"
              onClick={() => handleTabChange('roadmap')}
              className={`flex items-center justify-center space-x-2 px-3 md:px-4 h-full transition-all relative cursor-pointer whitespace-nowrap ${
                activeTab === 'roadmap'
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Milestone className={`h-4 w-4 ${activeTab === 'roadmap' ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="text-xs tracking-wide font-medium">{t.roadmap}</span>
              {activeTab === 'roadmap' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>
          </div>

          {/* Mode Switch & Language Selector */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              id="toggle-mobile-mode-btn"
              onClick={() => toggleMobileMode(true)}
              title="মোবাইল সৰল ভিউলৈ যাওক (Switch to Mobile-Optimized Single View)"
              className="bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">মোবাইল ভিউ</span>
              <span className="sm:hidden">মোবাইল</span>
            </button>

            <LanguageSelector 
              currentLang={currentLang} 
              onLanguageChange={handleLanguageChange} 
              variant="header" 
            />
          </div>
        </nav>

        {/* Tab Viewport - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-8 space-y-6">
          
          {/* Tab content switching */}
          {activeTab === 'app' && (
            <div className="space-y-6">
              <SaaSApp 
                externalLang={currentLang} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
          )}

          {activeTab === 'tea_garden' && (
            <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-2xl min-h-[700px] flex flex-col">
              <TeaGardenWorkflow />
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <ArchitectureDocs />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <RoadmapView />
            </div>
          )}

          {/* Inline Micro Footer */}
          <footer className="border-t border-slate-200 pt-6 text-[11px] text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
            <span>&copy; 2026 ShramikLinks compliance platform. Designed for Indian Manufacturing and Labor Regulations.</span>
            <div className="flex gap-4">
              <span className="hover:text-slate-600 cursor-pointer">Security Standards</span>
              <span>&bull;</span>
              <span className="hover:text-slate-600 cursor-pointer">CLRA Form V & VI PDF Exporter</span>
              <span>&bull;</span>
              <span className="hover:text-slate-600 cursor-pointer">UIDAI Integration</span>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
