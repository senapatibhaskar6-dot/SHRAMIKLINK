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

export default function App() {
  const [activeTab, setActiveTab] = useState<'app' | 'architecture' | 'roadmap'>('app');

  return (
    <div className="h-screen w-full bg-slate-100 text-slate-900 flex flex-col font-sans overflow-hidden relative">
      
      {/* Main Container Right Pane */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Modern Persistent Top Navigation Bar (Placed ABOVE the "AD" header) */}
        <nav className="bg-slate-900 text-white flex justify-around items-center h-14 shrink-0 z-40 border-b border-slate-800 shadow-sm px-2">
          <button
            id="tab-app-btn"
            onClick={() => setActiveTab('app')}
            className={`flex items-center justify-center space-x-2 w-1/3 h-full transition-all relative ${
              activeTab === 'app'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className={`h-4 w-4 ${activeTab === 'app' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="text-xs tracking-wide font-medium">Control Center</span>
            {activeTab === 'app' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            id="tab-arch-btn"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center justify-center space-x-2 w-1/3 h-full transition-all relative ${
              activeTab === 'architecture'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className={`h-4 w-4 ${activeTab === 'architecture' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="text-xs tracking-wide font-medium">Compliance Schema</span>
            {activeTab === 'architecture' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            id="tab-roadmap-btn"
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center justify-center space-x-2 w-1/3 h-full transition-all relative ${
              activeTab === 'roadmap'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Milestone className={`h-4 w-4 ${activeTab === 'roadmap' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span className="text-xs tracking-wide font-medium">Roadmap</span>
            {activeTab === 'roadmap' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Tab Viewport - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-8 space-y-6">
          
          {/* Tab content switching */}
          {activeTab === 'app' && (
            <div className="space-y-6">
              <SaaSApp />

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
