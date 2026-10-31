import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  FileCheck2, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Printer, 
  RotateCcw,
  Sparkles,
  Search
} from 'lucide-react';
import { sound } from '../utils/audio';

export type AppMode = 'practice' | 'exam' | 'flashcards' | 'highyield';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenAnalytics: () => void;
  onOpenPrint: () => void;
  onResetProgress: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalAnswered: number;
  totalQuestions: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenAnalytics,
  onOpenPrint,
  onResetProgress,
  isMuted,
  onToggleSound,
  searchQuery,
  onSearchChange,
  totalAnswered,
  totalQuestions,
}) => {
  const percentComplete = Math.round((totalAnswered / totalQuestions) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Course Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight truncate text-base sm:text-lg">
                  Pharmacognosy II
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                  Lectures 1–10
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate hidden md:block">
                Combined 92 MCQ Review Bank & High-Yield Exam Guide
              </p>
            </div>
          </div>

          {/* Quick Search on larger screens */}
          <div className="hidden lg:flex items-center relative max-w-xs w-full">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 92 questions, drugs, enzymes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/70 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-800 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Progress pill */}
            <button
              onClick={onOpenAnalytics}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all text-xs font-medium"
              title="View Study Analytics & Mastery"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Progress:</span>
              <span className="font-semibold">{percentComplete}%</span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden sm:inline">
                ({totalAnswered}/{totalQuestions})
              </span>
            </button>

            {/* Print Study Guide */}
            <button
              onClick={onOpenPrint}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Printable Study Sheet & Answer Key"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
            </button>

            {/* Reset Progress */}
            <button
              onClick={onResetProgress}
              className="p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
              title="Reset Practice Answers"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-t border-slate-100 dark:border-slate-800/80 py-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('practice');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
              currentMode === 'practice'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Mode</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              currentMode === 'practice' ? 'bg-emerald-700/60 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}>
              92 Qs
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('exam');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
              currentMode === 'exam'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Exam Simulator</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('flashcards');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
              currentMode === 'flashcards'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('highyield');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all shrink-0 ${
              currentMode === 'highyield'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            <span>High-Yield Revision & Matrix</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
