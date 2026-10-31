import React from 'react';
import { 
  X, 
  BarChart3, 
  Award, 
  Bookmark, 
  FileEdit, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Layers
} from 'lucide-react';
import { Question, TOPICS } from '../data/questions';
import { storage } from '../utils/storage';
import { sound } from '../utils/audio';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  bookmarks: number[];
  userNotes: Record<number, string>;
  onClearAllData: () => void;
  onJumpToQuestion?: (id: number) => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  questions,
  userAnswers,
  bookmarks,
  userNotes,
  onClearAllData,
  onJumpToQuestion,
}) => {
  if (!isOpen) return null;

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const examHistory = storage.getExamHistory();
  const notesCount = Object.keys(userNotes).length;
  const flashcardsKnown = storage.getFlashcardKnown().length;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 my-8 animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Study Diagnostics & Mastery
              </h2>
              <p className="text-xs text-slate-400">
                Track your progress across all 10 Pharmacognosy lectures
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Attempted
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {answeredCount}/{totalQuestions}
            </div>
            <span className="text-[11px] text-slate-500">
              {Math.round((answeredCount / totalQuestions) * 100)}% covered
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Accuracy
            </span>
            <div className={`text-xl sm:text-2xl font-black mt-1 ${
              accuracy >= 70 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-500' : 'text-slate-700 dark:text-slate-200'
            }`}>
              {accuracy}%
            </div>
            <span className="text-[11px] text-slate-500">
              {correctCount} correct
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Flashcards
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {flashcardsKnown}
            </div>
            <span className="text-[11px] text-slate-500">cards mastered</span>
          </div>
        </div>

        {/* Topic Mastery Bars */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Domain-Specific Mastery
          </h3>
          <div className="space-y-2.5">
            {TOPICS.map((topic) => {
              const topicQuestions = questions.filter((q) => q.topicId === topic.id);
              const topicAttempted = topicQuestions.filter((q) => userAnswers[q.id] !== undefined).length;
              const topicCorrect = topicQuestions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;
              const topicPct = topicAttempted > 0 ? Math.round((topicCorrect / topicQuestions.length) * 100) : 0;

              return (
                <div key={topic.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {topic.shortTitle}
                    </span>
                    <span className="text-slate-500">
                      {topicCorrect}/{topicQuestions.length} ({topicPct}% completed)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookmarks & Notes Counters */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-emerald-600" />
              Bookmarked Questions:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {bookmarks.length}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <FileEdit className="w-4 h-4 text-indigo-600" />
              Personal Study Notes:
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {notesCount}
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('Reset all saved answers, notes, bookmarks, and test history?')) {
                sound.playClick();
                onClearAllData();
                onClose();
              }
            }}
            className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Progress Data</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
