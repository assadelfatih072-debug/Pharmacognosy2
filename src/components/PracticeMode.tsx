import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ListFilter, 
  Bookmark, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Sparkles,
  LayoutGrid,
  Rows,
  RotateCcw,
  Search,
  BookOpen
} from 'lucide-react';
import { Question, TOPICS } from '../data/questions';
import { QuestionCard } from './QuestionCard';
import { sound } from '../utils/audio';

interface PracticeModeProps {
  questions: Question[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  onSelectAnswer: (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => void;
  onClearAnswer: (questionId: number) => void;
  bookmarks: number[];
  onToggleBookmark: (questionId: number) => void;
  userNotes: Record<number, string>;
  onSaveNote: (questionId: number, note: string) => void;
  searchQuery: string;
}

type FilterStatus = 'all' | 'unattempted' | 'incorrect' | 'correct' | 'bookmarked';

export const PracticeMode: React.FC<PracticeModeProps> = ({
  questions,
  userAnswers,
  onSelectAnswer,
  onClearAnswer,
  bookmarks,
  onToggleBookmark,
  userNotes,
  onSaveNote,
  searchQuery,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<'single' | 'scroll'>('single');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showNavGrid, setShowNavGrid] = useState<boolean>(false);

  // Filter questions based on topic, status, and search query
  const filteredQuestions = questions.filter((q) => {
    // Topic filter
    if (selectedTopic !== 'all' && q.topicId !== selectedTopic) {
      return false;
    }

    // Status filter
    const ans = userAnswers[q.id];
    if (statusFilter === 'unattempted' && ans !== undefined) return false;
    if (statusFilter === 'correct' && ans !== q.correctAnswer) return false;
    if (statusFilter === 'incorrect' && (ans === undefined || ans === q.correctAnswer)) return false;
    if (statusFilter === 'bookmarked' && !bookmarks.includes(q.id)) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const qText = q.question.toLowerCase();
      const optionsText = q.options.map((o) => o.text.toLowerCase()).join(' ');
      const expText = q.explanation.toLowerCase();
      const tagsText = q.tags.join(' ').toLowerCase();
      const search = searchQuery.toLowerCase();
      return (
        qText.includes(search) ||
        optionsText.includes(search) ||
        expText.includes(search) ||
        tagsText.includes(search)
      );
    }

    return true;
  });

  // Clamp current index when filter changes
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(Math.max(0, filteredQuestions.length - 1));
    }
  }, [filteredQuestions.length, currentIndex]);

  // Keyboard navigation for single question view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (viewMode === 'single' && filteredQuestions.length > 0) {
        if (e.key === 'ArrowRight' || e.key === 'n' || e.key === 'N') {
          if (currentIndex < filteredQuestions.length - 1) {
            sound.playClick();
            setCurrentIndex((prev) => prev + 1);
          }
        } else if (e.key === 'ArrowLeft' || e.key === 'p' || e.key === 'P') {
          if (currentIndex > 0) {
            sound.playClick();
            setCurrentIndex((prev) => prev - 1);
          }
        } else if (['1', 'a', 'A'].includes(e.key)) {
          const q = filteredQuestions[currentIndex];
          if (q) onSelectAnswer(q.id, 'A');
        } else if (['2', 'b', 'B'].includes(e.key)) {
          const q = filteredQuestions[currentIndex];
          if (q) onSelectAnswer(q.id, 'B');
        } else if (['3', 'c', 'C'].includes(e.key)) {
          const q = filteredQuestions[currentIndex];
          if (q) onSelectAnswer(q.id, 'C');
        } else if (['4', 'd', 'D'].includes(e.key)) {
          const q = filteredQuestions[currentIndex];
          if (q) onSelectAnswer(q.id, 'D');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, filteredQuestions, currentIndex, onSelectAnswer]);

  // Overall stats
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = questions.filter((q) => userAnswers[q.id] === q.correctAnswer).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  const currentQ = filteredQuestions[currentIndex];

  const jumpToFirstUnanswered = () => {
    const idx = filteredQuestions.findIndex((q) => userAnswers[q.id] === undefined);
    if (idx !== -1) {
      sound.playClick();
      setCurrentIndex(idx);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Topic filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              sound.playClick();
              setSelectedTopic('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedTopic === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Topics ({questions.length})
          </button>
          {TOPICS.map((topic) => {
            const count = questions.filter((q) => q.topicId === topic.id).length;
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedTopic(topic.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{topic.shortTitle}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status filters & View mode toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
              <ListFilter className="w-3.5 h-3.5" />
              Filter:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'unattempted', label: 'Unattempted' },
              { id: 'incorrect', label: 'Missed / Incorrect' },
              { id: 'correct', label: 'Correct' },
              { id: 'bookmarked', label: `Bookmarked (${bookmarks.length})` },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playClick();
                  setStatusFilter(f.id as FilterStatus);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f.id
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* View Toggles & Jump button */}
          <div className="flex items-center gap-2">
            <button
              onClick={jumpToFirstUnanswered}
              className="text-xs px-2.5 py-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors font-medium hidden sm:inline-flex"
            >
              Next Unanswered →
            </button>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('single')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'single'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Single Question Focus View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('scroll')}
                className={`p-1.5 rounded-md text-xs transition-colors ${
                  viewMode === 'scroll'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Continuous Scroll View"
              >
                <Rows className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setShowNavGrid(!showNavGrid)}
              className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
            >
              {showNavGrid ? 'Hide Grid' : 'Question Grid'}
            </button>
          </div>
        </div>

        {/* Collapsible Question Quick Jump Grid */}
        {showNavGrid && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Jump directly to question (1–92):
              </span>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Correct
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> Missed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span> Unanswered
                </span>
              </div>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-23 gap-1.5 max-h-48 overflow-y-auto p-1">
              {questions.map((q, idx) => {
                const ans = userAnswers[q.id];
                const isCorrect = ans === q.correctAnswer;
                const isMissed = ans !== undefined && !isCorrect;
                const isCurrent = viewMode === 'single' && currentQ?.id === q.id;

                let color = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200';
                if (isCorrect) color = 'bg-emerald-500 text-white font-bold';
                else if (isMissed) color = 'bg-rose-500 text-white font-bold';

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      sound.playClick();
                      const filteredIdx = filteredQuestions.findIndex((item) => item.id === q.id);
                      if (filteredIdx !== -1) {
                        setCurrentIndex(filteredIdx);
                        setViewMode('single');
                      } else {
                        // Reset topic and status filters so this question is visible
                        setSelectedTopic('all');
                        setStatusFilter('all');
                        const fullIdx = questions.findIndex((item) => item.id === q.id);
                        setCurrentIndex(fullIdx);
                        setViewMode('single');
                      }
                    }}
                    className={`h-7 rounded-md text-xs font-medium flex items-center justify-center transition-all ${color} ${
                      isCurrent ? 'ring-2 ring-emerald-600 ring-offset-1 scale-105' : ''
                    }`}
                  >
                    {q.id}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {filteredQuestions.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No questions match your current filters
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your topic selection or status filter (e.g. switch back to &ldquo;All Topics&rdquo; or &ldquo;All&rdquo; status).
          </p>
          <button
            onClick={() => {
              sound.playClick();
              setSelectedTopic('all');
              setStatusFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'single' && currentQ ? (
        /* Single Question View */
        <div className="space-y-4">
          {/* Progress bar within filtered set */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>
              Question <strong className="text-slate-900 dark:text-white">{currentIndex + 1}</strong> of{' '}
              {filteredQuestions.length}
            </span>
            <span className="hidden sm:inline">
              Tip: Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-[10px]">A</kbd>–<kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-[10px]">D</kbd> or <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-[10px]">←</kbd> / <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded border text-[10px]">→</kbd>
            </span>
          </div>

          <QuestionCard
            question={currentQ}
            selectedAnswer={userAnswers[currentQ.id]}
            onSelectAnswer={(ans) => onSelectAnswer(currentQ.id, ans)}
            isBookmarked={bookmarks.includes(currentQ.id)}
            onToggleBookmark={() => onToggleBookmark(currentQ.id)}
            userNote={userNotes[currentQ.id]}
            onSaveNote={(note) => onSaveNote(currentQ.id, note)}
            onClearAnswer={() => onClearAnswer(currentQ.id)}
            showExplanationImmediately={true}
            mode="practice"
          />

          {/* Prev / Next Pagination Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  sound.playClick();
                  setCurrentIndex((prev) => prev - 1);
                }
              }}
              disabled={currentIndex === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-medium text-slate-400">
              Q{currentQ.id} (Bank #)
            </span>

            <button
              onClick={() => {
                if (currentIndex < filteredQuestions.length - 1) {
                  sound.playClick();
                  setCurrentIndex((prev) => prev + 1);
                }
              }}
              disabled={currentIndex === filteredQuestions.length - 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentIndex === filteredQuestions.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/30'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Continuous Scroll View */
        <div className="space-y-6">
          <div className="text-xs text-slate-500 dark:text-slate-400 px-1">
            Showing {filteredQuestions.length} questions in continuous list view:
          </div>
          {filteredQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              selectedAnswer={userAnswers[q.id]}
              onSelectAnswer={(ans) => onSelectAnswer(q.id, ans)}
              isBookmarked={bookmarks.includes(q.id)}
              onToggleBookmark={() => onToggleBookmark(q.id)}
              userNote={userNotes[q.id]}
              onSaveNote={(note) => onSaveNote(q.id, note)}
              onClearAnswer={() => onClearAnswer(q.id)}
              showExplanationImmediately={true}
              mode="practice"
            />
          ))}
        </div>
      )}
    </div>
  );
};
