import React, { useState } from 'react';
import { Globe, Check, ChevronDown, ShieldCheck, Sparkles, X } from 'lucide-react';
import { 
  AppLanguage, 
  SUPPORTED_LANGUAGES, 
  TRANSLATIONS, 
  LanguageOption 
} from '../i18n';

interface LanguageSelectorProps {
  currentLang: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  variant?: 'header' | 'compact' | 'modal' | 'banner';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
  variant = 'header'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];
  const t = TRANSLATIONS[currentLang];

  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 md:p-5 border border-indigo-500/30 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-indigo-600/30 rounded-xl text-indigo-400 shrink-0 border border-indigo-500/40">
              <Globe className="h-5 w-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Pan-India Language Preference
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                  8 Regional Languages
                </span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-white mt-0.5">
                {t.selectLanguageTitle}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {t.selectLanguageSub}
              </p>
              
              {/* Statutory English Preservation Note */}
              <div className="mt-2.5 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg text-[11px] font-medium">
                <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{t.statutoryEnglishNote}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-wrap gap-2 pt-2 md:pt-0">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md scale-105'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-sm">{lang.flag}</span>
                  <span className="font-semibold">{lang.nativeName}</span>
                  <span className="text-[10px] opacity-75 hidden sm:inline">({lang.name})</span>
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Header dropdown variant
  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        id="app-language-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border border-slate-700/80 transition-all cursor-pointer shadow-xs group"
        title="Change App Language / ভাষা বাছক"
      >
        <Globe className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 group-hover:rotate-45 transition-transform" />
        <span className="text-xs sm:text-sm">{currentLangObj.flag}</span>
        <span className="font-bold text-white text-[10px] sm:text-xs">{currentLangObj.nativeName}</span>
        <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          {/* Modal / Menu */}
          <div className="absolute right-0 mt-1 w-64 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl sm:rounded-2xl shadow-2xl z-50 p-2 sm:p-3 animate-fadeIn text-slate-100 origin-top-right">
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800 px-1 sm:px-2">
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400" />
                <span className="text-[9px] sm:text-xs font-bold text-white uppercase tracking-wider">
                  Select Language / ভাষা
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-0.5 sm:p-1 rounded-md"
              >
                <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>

            <div className="text-[9px] sm:text-[10px] text-slate-400 px-1 sm:px-2 pb-2 leading-relaxed">
              Choose language for portal actions. Statutory forms generate in English.
            </div>

            {/* 2-column grid layout on mobile to fit perfectly on any screen */}
            <div className="grid grid-cols-2 gap-1 max-h-52 sm:max-h-72 overflow-y-auto pr-1">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = lang.code === currentLang;
                return (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={`text-left px-2 py-1.5 rounded-lg text-[10px] sm:text-xs flex items-center justify-between transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                        : 'hover:bg-slate-800 text-slate-300 hover:text-white border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-xs sm:text-sm shrink-0">{lang.flag}</span>
                      <div className="min-w-0 truncate">
                        <div className="font-bold truncate text-[10px] sm:text-xs text-slate-100">
                          {lang.nativeName}
                        </div>
                        <div className="text-[8px] sm:text-[9px] text-slate-400 truncate">
                          ({lang.name})
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="h-3 w-3 text-emerald-400 shrink-0 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 px-1 sm:px-2 flex items-center gap-1 text-[8px] sm:text-[9px] text-emerald-400/90">
              <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" />
              <span className="truncate">{t.statutoryEnglishBadge}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
