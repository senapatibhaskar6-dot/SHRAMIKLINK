import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Smartphone, Download, X, Share } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone app, hide the installer
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition-all duration-200 transform hover:scale-[1.02] cursor-pointer"
      >
        <Download className="w-4 h-4" />
        এপটো ফোনত সংস্থাপন কৰক (Install App)
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all duration-200 cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          iOS সংস্থাপন কৰক (Install on iPhone)
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative">
              <button 
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">iPhone-অত এপটো লগাৱক</h3>
                  <p className="text-[10px] text-slate-400">খুবেই সহজ আৰু খৰতকীয়া পদ্ধতি</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex gap-2 items-start">
                  <div className="bg-slate-800 px-2 py-0.5 rounded text-white font-mono text-[10px] mt-0.5">১</div>
                  <p>Safari ব্ৰাউজাৰৰ আটাইতকৈ তলত থকা <strong className="text-white flex items-center gap-1 inline-flex bg-slate-800 px-1 py-0.5 rounded"><Share className="w-3 h-3" /> Share (শ্বেয়াৰ)</strong> বুটামটোত ক্লিক কৰক।</p>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="bg-slate-800 px-2 py-0.5 rounded text-white font-mono text-[10px] mt-0.5">২</div>
                  <p> অলপ তললৈ গৈ <strong className="text-white">Add to Home Screen (হোম স্ক্ৰীণত যোগ কৰক)</strong> বুটামটোত টিপক।</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 py-2.5 text-xs font-bold text-slate-950 transition cursor-pointer"
              >
                বুজি পালোঁ (Done)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for general Android instructions if prompt isn't fired yet
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700/50 px-4 py-2.5 text-xs text-slate-300 shadow-sm">
      <Smartphone className="w-4 h-4 text-emerald-400 animate-pulse" />
      <span>ব্ৰাউজাৰৰ ওপৰৰ ৩টা বিন্দুত টিপি <strong>'Install App'</strong> বা <strong>'Add to Home screen'</strong> কৰক</span>
    </div>
  );
};
