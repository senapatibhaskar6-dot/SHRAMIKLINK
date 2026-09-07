import React, { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle, 
  ThumbsUp, 
  User, 
  Sparkles, 
  HeartHandshake,
  Clock
} from 'lucide-react';
import { AppFeedback } from '../types';

interface AppFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: 'industry_admin' | 'supervisor' | 'contractor' | 'worker' | 'government_inspector';
  currentUserName?: string;
  feedbacks: AppFeedback[];
  onSubmitFeedback: (feedback: Omit<AppFeedback, 'id' | 'createdAt'>) => void;
  showNotice: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const AppFeedbackModal: React.FC<AppFeedbackModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  currentUserName = 'App User',
  feedbacks,
  onSubmitFeedback,
  showNotice
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<AppFeedback['category']>('Attendance System');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(currentUserName);
  const [activeTab, setActiveTab] = useState<'write' | 'reviews'>('write');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      showNotice('অনুগ্ৰহ কৰি আপোনাৰ মতামত লিখক! (Please write your feedback message)', 'error');
      return;
    }

    onSubmitFeedback({
      authorName: authorName.trim() || 'Anonymous User',
      authorRole: currentUserRole,
      rating,
      category,
      feedbackText: feedbackText.trim()
    });

    setFeedbackText('');
    showNotice('ধন্যবাদ! আপোনাৰ মূল্যৱান ৰিভিউ সফলতাৰে জমা হ’ল। (Thank you for your feedback!)', 'success');
    setActiveTab('reviews');
  };

  // Average Rating
  const avgRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length).toFixed(1)
    : '5.0';

  const roleLabelMap: Record<string, string> = {
    industry_admin: '🏭 Industry Admin',
    supervisor: '👷 Factory Supervisor',
    contractor: '🏢 Labor Contractor',
    worker: '👷 Contract Worker',
    government_inspector: '⚖️ Government Inspector'
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-xs">
              ⭐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  এপ ৰিভিউ আৰু ফীডবেক (App Review & Feedback)
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  ★ {avgRating} / 5.0
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Give your feedback on attendance speed, CLRA forms, or ease of use to improve the platform.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'write' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            মতামত প্ৰেৰণ কৰক (Submit Review)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reviews' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ThumbsUp className="h-4 w-4 text-amber-600" />
            সকলো ৰিভিউ চাওক ({feedbacks.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-4">
          {activeTab === 'write' ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Star Rating selector */}
              <div className="bg-amber-50/60 border border-amber-200/70 p-4 rounded-2xl text-center space-y-2">
                <span className="block font-extrabold text-amber-950 text-xs uppercase tracking-wider">
                  আপোনাৰ সন্তুষ্টিৰ ৰেটিং বাছক (Rate Your Experience)
                </span>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="text-3xl transition-transform hover:scale-125 focus:outline-none p-1 cursor-pointer"
                      >
                        <span className={isFilled ? 'text-amber-400 drop-shadow-xs' : 'text-slate-300'}>
                          ★
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] font-bold text-amber-800">
                  {rating === 5 && '🌟 অসাধাৰণ! (Excellent - Fast & Seamless)'}
                  {rating === 4 && '👍 অতি ভাল! (Very Good)'}
                  {rating === 3 && '👌 সন্তোষজনক (Good / Satisfactory)'}
                  {rating === 2 && '⚠️ উন্নতিৰ প্ৰয়োজন (Needs Improvement)'}
                  {rating === 1 && '❌ অসন্তুষ্ট (Not Satisfied)'}
                </div>
              </div>

              {/* Author and Role Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">আপোনাৰ নাম (Your Name) *</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">মতামতৰ শিতান (Feedback Category)</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="Attendance System">Attendance System (ছুপাৰভাইজাৰ হাজিৰা ব্যৱস্থা)</option>
                    <option value="CLRA Forms">CLRA Forms & Muster Roll (আইনী খতিয়ানসমূহ)</option>
                    <option value="Bill Audit">Bill Audit & GST Invoices (বিল পৰীক্ষা)</option>
                    <option value="Speed & Performance">Speed & Performance (গতি আৰু সহজলভ্যতা)</option>
                    <option value="General Feedback">General Feedback (সাধাৰণ মতামত)</option>
                  </select>
                </div>
              </div>

              {/* Message text area */}
              <div>
                <label className="block text-slate-600 font-bold mb-1">
                  আপোনাৰ মন্তব্য বা অভিজ্ঞতা লিখক (Detailed Feedback & Suggestions) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="শ্ৰমিকৰ হাজিৰা লোৱাৰ সময়, আধাৰ ভেৰিফিকেচন, অথবা নতুন ছুপাৰভাইজাৰ ব্যৱস্থা সম্পৰ্কে আপোনাৰ অভিজ্ঞতা জনাব পাৰে..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-normal text-slate-800 outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  বন্ধ কৰক (Close)
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  মতামত দাখিল কৰক (Submit Review)
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {feedbacks.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-semibold">
                  এতিয়ালৈকে কোনো ৰিভিউ নাই। প্ৰথম ৰিভিউ দিয়ক!
                </div>
              ) : (
                feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-bold text-xs">{fb.authorName}</strong>
                          <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                            {roleLabelMap[fb.authorRole] || fb.authorRole}
                          </span>
                        </div>
                        <span className="text-[10px] text-indigo-600 font-semibold block mt-0.5">
                          🏷️ {fb.category}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-amber-400 font-bold text-sm tracking-widest">
                          {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">{fb.createdAt}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                      &quot;{fb.feedbackText}&quot;
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AppFeedbackModal;
