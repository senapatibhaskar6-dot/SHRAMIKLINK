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
  Menu,
  X
} from 'lucide-react';
import SaaSApp from './components/SaaSApp';
import ArchitectureDocs from './components/ArchitectureDocs';
import RoadmapView from './components/RoadmapView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'architecture' | 'roadmap'>('app');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-100 text-slate-900 flex font-sans overflow-hidden relative">
      
      {/* Mobile Menu Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Bento Sidebar Left Pane (Mobile slide-over, Desktop static) */}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-slate-900 text-white flex flex-col shrink-0 z-50 transform transition-transform duration-300 md:transform-none ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-400">SHRAMIKLINK</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">Labour Compliance OS</p>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Master Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-2">
          <button
            id="tab-app-btn"
            onClick={() => {
              setActiveTab('app');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all ${
              activeTab === 'app'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-xs border-l-2 border-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Building2 className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
            <span className="text-xs tracking-wide">Control Center</span>
          </button>

          <button
            id="tab-arch-btn"
            onClick={() => {
              setActiveTab('architecture');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all ${
              activeTab === 'architecture'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-xs border-l-2 border-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Database className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
            <span className="text-xs tracking-wide">Compliance Schema</span>
          </button>

          <button
            id="tab-roadmap-btn"
            onClick={() => {
              setActiveTab('roadmap');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl text-left transition-all ${
              activeTab === 'roadmap'
                ? 'bg-slate-800 text-emerald-400 font-bold shadow-xs border-l-2 border-emerald-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Milestone className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-white" />
            <span className="text-xs tracking-wide">Product Roadmap</span>
          </button>
        </nav>

        {/* Auditor Portal Online Badge */}
        <div className="p-4 border-t border-slate-800 bg-emerald-900/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Auditor Online</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          </div>
          <p className="text-[11px] text-slate-300">Govt Portal Connected: MH-LBR-8821</p>
        </div>
      </aside>

      {/* Main Container Right Pane */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0 z-30 shadow-xs">
          <div className="flex items-center space-x-3 md:space-x-8">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] uppercase text-slate-400 font-bold tracking-wider">Organization</span>
              <span className="text-xs md:text-sm font-bold text-slate-800 line-clamp-1 max-w-[150px] sm:max-w-none">Dharma Manufacturing Hub</span>
            </div>
            <div className="hidden sm:block h-8 w-[1px] bg-slate-200"></div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Status</span>
              <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                Compliance Locked 🔓
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:block bg-slate-100 px-3 py-1.5 rounded-full text-[12px] font-medium border border-slate-200 text-slate-700">
              ₹1/Worker/Day Micro-fee: Active
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold font-mono">
              AD
            </div>
          </div>
        </header>

        {/* Tab Viewport - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Tab content switching */}
          {activeTab === 'app' && (
            <div className="space-y-6">
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

              <SaaSApp />
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
            <span>&copy; 2026 ShramikLink compliance platform. Designed for Indian Manufacturing and Labor Regulations.</span>
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
