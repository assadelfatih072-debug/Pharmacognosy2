import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Award, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Flag, 
  Layers, 
  Check, 
  HelpCircle,
  BarChart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Question, TOPICS } from '../data/questions';
import { QuestionCard } from './QuestionCard';
import { storage, ExamResult } from '../utils/storage';
import { sound } from '../utils/audio';

interface ExamModeProps {
  questions: Question[];
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
  onReattemptMissedInPractice?: (missedIds: number[]) => void;
}

type ExamState = 'setup' | 'in-progress' | 'results';

export const ExamMode: React.FC<ExamModeProps> = ({
  questions,
  bookmarks,
  onToggleBookmark,
  onReattemptMissedInPractice,
}) => {
  const [examState, setExamState] = useState<ExamState>('setup');
  
  // Setup Options
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [isTimed, setIsTimed] = useState<boolean>(true);

  // Active Exam State
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [flaggedIds, setFlaggedIds] = useState<number[]>([]);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(1800);
  const [totalExamTimeSeconds, setTotalExamTimeSeconds] = useState<number>(1800);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState<boolean>(false);

  // Results State
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Exam
  const handleStartExam = () => {
    sound.playClick();
    let eligible = questions;
    if (selectedTopic !== 'all') {
      eligible = questions.filter((q) => q.topicId === selectedTopic);
    }

    // Shuffle eligible questions
    const shuffled = [...eligible].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    // Time: 60 seconds per question
    const totalTime = selected.length * 60;

    setExamQuestions(selected);
    setCurrentIndex(0);
    setExamAnswers({});
    setFlaggedIds([]);
    setTimeRemainingSeconds(totalTime);
    setTotalExamTimeSeconds(totalTime);
    setIsPaused(false);
    setExamState('in-progress');
  };

  // Timer logic
  useEffect(() => {
    if (examState === 'in-progress' && isTimed && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [examState, isTimed, isPaused]);

  // Finish Exam & calculate results
  const handleFinishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    sound.playFanfare();

    let score = 0;
    const incorrectIds: number[] = [];
    const topicBreakdown: Record<string, { total: number; correct: number }> = {};

    examQuestions.forEach((q) => {
      if (!topicBreakdown[q.topicId]) {
        topicBreakdown[q.topicId] = { total: 0, correct: 0 };
      }
      topicBreakdown[q.topicId].total += 1;

      const userAns = examAnswers[q.id];
      if (userAns === q.correctAnswer) {
        score += 1;
        topicBreakdown[q.topicId].correct += 1;
      } else {
        incorrectIds.push(q.id);
      }
    });

    const percentage = Math.round((score / examQuestions.length) * 100);
    const timeSpent = totalExamTimeSeconds - timeRemainingSeconds;

    const result: ExamResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      totalQuestions: examQuestions.length,
      score,
      percentage,
      timeSpentSeconds: isTimed ? timeSpent : 0,
      topicBreakdown,
      incorrectQuestionIds: incorrectIds,
    };

    storage.saveExamResult(result);
    setLastResult(result);
    setShowSubmitConfirm(false);
    setExamState('results');
  };

  // Toggle flag
  const toggleFlag = (id: number) => {
    setFlaggedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // 1. SETUP VIEW
  // ----------------------------------------------------
  if (examState === 'setup') {
    const examHistory = storage.getExamHistory();

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Pharmacognosy II Exam Simulator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Test your recall under exam conditions. Answers and explanations are concealed until test completion.
            </p>
          </div>

          <div className="space-y-5 pt-2">
            {/* Number of Questions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Number of Questions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { count: 15, label: '15 Qs', subtitle: 'Quick Quiz (15m)' },
                  { count: 30, label: '30 Qs', subtitle: 'Standard Test (30m)' },
                  { count: 50, label: '50 Qs', subtitle: 'Midterm Drill (50m)' },
                  { count: 92, label: '92 Qs', subtitle: 'Full Bank (92m)' },
                ].map((item) => (
                  <button
                    key={item.count}
                    onClick={() => {
                      sound.playClick();
                      setQuestionCount(item.count);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      questionCount === item.count
                        ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-sm sm:text-base">{item.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scope / Topic Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Exam Scope
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Topics (Comprehensive Lectures 1–10)</option>
                {TOPICS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Timer Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Timed Examination
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Allows 60 seconds per question with a live countdown timer
                </span>
              </div>
              <input
                type="checkbox"
                checked={isTimed}
                onChange={(e) => setIsTimed(e.target.checked)}
                className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartExam}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Play className="w-5 h-5 fill-current transition-transform group-hover:scale-110" />
              <span>Begin Examination Now</span>
            </button>
          </div>
        </div>

        {/* Past Exam History */}
        {examHistory.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              Past Exam Attempts ({examHistory.length})
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
              {examHistory.map((item, i) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Attempt #{examHistory.length - i}
                    </span>
                    <span className="text-xs text-slate-400 block">
                      {new Date(item.timestamp).toLocaleDateString()} at{' '}
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">
                      {item.score}/{item.totalQuestions} Qs
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.percentage >= 70
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.percentage >= 50
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. LIVE EXAM VIEW
  // ----------------------------------------------------
  if (examState === 'in-progress') {
    const currentQ = examQuestions[currentIndex];
    const answeredCount = Object.keys(examAnswers).length;
    const isUrgent = isTimed && timeRemainingSeconds < 300; // < 5 mins

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Sticky Exam Status Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Exam in progress
            </span>
            <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {answeredCount} of {examQuestions.length} answered
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isTimed && (
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-colors ${
                  isUrgent
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{formatTime(timeRemainingSeconds)}</span>
              </div>
            )}

            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/20 transition-all"
            >
              Submit Exam
            </button>
          </div>
        </div>

        {/* Live Question Card */}
        {currentQ && (
          <QuestionCard
            question={currentQ}
            selectedAnswer={examAnswers[currentQ.id]}
            onSelectAnswer={(ans) => setExamAnswers({ ...examAnswers, [currentQ.id]: ans })}
            isBookmarked={bookmarks.includes(currentQ.id)}
            onToggleBookmark={() => onToggleBookmark(currentQ.id)}
            isFlagged={flaggedIds.includes(currentQ.id)}
            onToggleFlag={() => toggleFlag(currentQ.id)}
            showExplanationImmediately={false}
            mode="exam-live"
          />
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                sound.playClick();
                setCurrentIndex((prev) => prev - 1);
              }
            }}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-slate-400 font-medium">
            Question {currentIndex + 1} of {examQuestions.length}
          </span>

          <button
            onClick={() => {
              if (currentIndex < examQuestions.length - 1) {
                sound.playClick();
                setCurrentIndex((prev) => prev + 1);
              }
            }}
            disabled={currentIndex === examQuestions.length - 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium ${
              currentIndex === examQuestions.length - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Exam Question Navigator Palette */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Exam Navigator Palette
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Answered
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Flagged
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span> Unanswered
              </span>
            </div>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-1.5 max-h-40 overflow-y-auto p-1">
            {examQuestions.map((q, idx) => {
              const isAnswered = examAnswers[q.id] !== undefined;
              const isFlagged = flaggedIds.includes(q.id);
              const isCurrent = currentIndex === idx;

              let style = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200';
              if (isAnswered) {
                style = 'bg-emerald-600 text-white font-semibold';
              }
              if (isFlagged) {
                style = isAnswered
                  ? 'bg-emerald-600 text-white ring-2 ring-amber-400 font-semibold'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 font-semibold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentIndex(idx);
                  }}
                  className={`h-8 rounded-lg text-xs transition-all relative flex items-center justify-center ${style} ${
                    isCurrent ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-1 scale-105' : ''
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-scaleUp">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Submit Examination?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You have answered <strong>{answeredCount}</strong> of{' '}
                  <strong>{examQuestions.length}</strong> questions.
                  {answeredCount < examQuestions.length && (
                    <span className="text-rose-600 dark:text-rose-400 block font-medium mt-1">
                      ⚠️ You still have {examQuestions.length - answeredCount} unanswered questions!
                    </span>
                  )}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Return to Exam
                </button>
                <button
                  onClick={handleFinishExam}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all"
                >
                  Yes, Submit & Grade
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // 3. EXAM RESULTS VIEW
  // ----------------------------------------------------
  if (examState === 'results' && lastResult) {
    const isPassed = lastResult.percentage >= 60;

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Scorecard Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Exam Simulator Result
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mt-1">
              {lastResult.percentage}%
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Score: <strong className="text-slate-900 dark:text-white">{lastResult.score}</strong> /{' '}
              {lastResult.totalQuestions} questions correct
            </p>
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {isPassed ? '🎉 Passed (≥ 60% Threshold)' : '⚠️ Needs Revision (< 60%)'}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {lastResult.incorrectQuestionIds.length > 0 && onReattemptMissedInPractice && (
              <button
                onClick={() => {
                  sound.playClick();
                  onReattemptMissedInPractice(lastResult.incorrectQuestionIds);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-drill {lastResult.incorrectQuestionIds.length} Missed Questions</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                setExamState('setup');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Configure New Exam</span>
            </button>
          </div>
        </div>

        {/* Topic Breakdown Diagnostics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart className="w-5 h-5 text-emerald-600" />
            Performance by Lecture Domain
          </h3>

          <div className="space-y-3">
            {TOPICS.map((topic) => {
              const data = lastResult.topicBreakdown[topic.id];
              if (!data || data.total === 0) return null;
              const topicPct = Math.round((data.correct / data.total) * 100);

              return (
                <div key={topic.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {topic.title}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {data.correct}/{data.total} ({topicPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        topicPct >= 70
                          ? 'bg-emerald-500'
                          : topicPct >= 50
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${topicPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Full Question-by-Question Review with Rationales
          </h3>

          <div className="space-y-4">
            {examQuestions.map((q, idx) => (
              <QuestionCard
                key={q.id}
                question={q}
                selectedAnswer={examAnswers[q.id]}
                onSelectAnswer={() => {}}
                isBookmarked={bookmarks.includes(q.id)}
                onToggleBookmark={() => onToggleBookmark(q.id)}
                showExplanationImmediately={true}
                mode="exam-review"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
