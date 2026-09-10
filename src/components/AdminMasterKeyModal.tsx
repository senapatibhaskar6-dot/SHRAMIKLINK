import React from 'react';
import { Key, X } from 'lucide-react';

interface AdminMasterKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  masterKeyInput: string;
  setMasterKeyInput: (val: string) => void;
  masterKeyError: string;
  setMasterKeyError: (val: string) => void;
  onUnlock: (e?: React.FormEvent) => void;
}

export const AdminMasterKeyModal: React.FC<AdminMasterKeyModalProps> = ({
  isOpen,
  onClose,
  masterKeyInput,
  setMasterKeyInput,
  masterKeyError,
  setMasterKeyError,
  onUnlock
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-7 shadow-2xl max-w-sm w-full space-y-4 animate-scaleUp">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">এডমিন মাষ্টাৰ কি (Admin Master Key)</h4>
              <p className="text-[11px] text-slate-500">গোপন প্ৰশাসনিক মোড আনলক কৰক</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onUnlock} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              মাষ্টাৰ কি প্ৰবিষ্ট কৰক (Enter Master Key)
            </label>
            <input
              type="password"
              autoFocus
              required
              placeholder="E.g., admin"
              value={masterKeyInput}
              onChange={(e) => {
                setMasterKeyInput(e.target.value);
                setMasterKeyError('');
              }}
              className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            {masterKeyError && (
              <p className="text-[11px] font-bold text-rose-600">{masterKeyError}</p>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-center justify-between">
            <span>পৰীক্ষাৰ বাবে মাষ্টাৰ কি: <strong>admin</strong> বা <strong>1234</strong></span>
            <button
              type="button"
              onClick={() => {
                setMasterKeyInput('admin');
                setMasterKeyError('');
              }}
              className="text-[10px] font-bold text-amber-700 hover:text-amber-950 underline cursor-pointer"
            >
              অটোফিল
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all shadow-sm cursor-pointer"
            >
              আনলক কৰক (Unlock)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
