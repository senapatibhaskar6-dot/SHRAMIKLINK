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
  FileText
} from 'lucide-react';
import SaaSApp from './components/SaaSApp';
import ArchitectureDocs from './components/ArchitectureDocs';
import RoadmapView from './components/RoadmapView';
import { AppLanguage, getStoredLanguage, setStoredLanguage, TRANSLATIONS } from './i18n';
import { LanguageSelector } from './components/LanguageSelector';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'architecture' | 'roadmap'>('app');
  const [currentLang, setCurrentLangState] = useState<AppLanguage>(() => getStoredLanguage());

  const handleLanguageChange = (lang: AppLanguage) => {
    setCurrentLangState(lang);
    setStoredLanguage(lang);
  };

  const t = TRANSLATIONS[currentLang];

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
                src="/src/assets/images/shramiklink_logo_1788402038953.jpg" 
                alt="ShramikLinks Logo" 
                className="w-full h-full object-contain"
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
              onClick={() => setActiveTab('app')}
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
              id="tab-arch-btn"
              onClick={() => setActiveTab('architecture')}
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
              onClick={() => setActiveTab('roadmap')}
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

          {/* Pan-India Language Selector in Persistent Nav */}
          <div className="shrink-0 flex items-center gap-2">
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
