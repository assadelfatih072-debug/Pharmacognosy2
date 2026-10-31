import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './data/questions';
import { storage } from './utils/storage';
import { sound } from './utils/audio';
import { Header, AppMode } from './components/Header';
import { PracticeMode } from './components/PracticeMode';
import { ExamMode } from './components/ExamMode';
import { FlashcardMode } from './components/FlashcardMode';
import { HighYieldGuide } from './components/HighYieldGuide';
import { AnalyticsModal } from './components/AnalyticsModal';
import { PrintStudySheet } from './components/PrintStudySheet';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('practice');
  const [userAnswers, setUserAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>(() =>
    storage.getPracticeAnswers()
  );
  const [bookmarks, setBookmarks] = useState<number[]>(() => storage.getBookmarks());
  const [userNotes, setUserNotes] = useState<Record<number, string>>(() => storage.getNotes());
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.isMuted());
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);

  // Sync sounds
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      sound.playClick();
    }
  };

  // Practice answer selection
  const handleSelectAnswer = (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => {
    storage.savePracticeAnswer(questionId, answer);
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Clear single answer
  const handleClearAnswer = (questionId: number) => {
    const updated = { ...userAnswers };
    delete updated[questionId];
    localStorage.setItem('pharma_practice_answers_v1', JSON.stringify(updated));
    setUserAnswers(updated);
  };

  // Bookmark toggle
  const handleToggleBookmark = (questionId: number) => {
    storage.toggleBookmark(questionId);
    setBookmarks(storage.getBookmarks());
  };

  // Save personal note
  const handleSaveNote = (questionId: number, note: string) => {
    storage.saveNote(questionId, note);
    setUserNotes(storage.getNotes());
  };

  // Reset practice progress
  const handleResetProgress = () => {
    if (window.confirm('Reset all your practice question answers? Your study notes and bookmarks will remain saved.')) {
      sound.playClick();
      storage.clearPracticeAnswers();
      setUserAnswers({});
    }
  };

  // Clear all data completely
  const handleClearAllData = () => {
    storage.clearAllData();
    setUserAnswers({});
    setBookmarks([]);
    setUserNotes({});
  };

  // Switch to Practice Mode with a search filter for missed question IDs
  const handleReattemptMissed = (missedIds: number[]) => {
    setCurrentMode('practice');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors antialiased">
      {/* App Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setSearchQuery('');
        }}
        onOpenAnalytics={() => {
          sound.playClick();
          setIsAnalyticsOpen(true);
        }}
        onOpenPrint={() => {
          sound.playClick();
          setIsPrintOpen(true);
        }}
        onResetProgress={handleResetProgress}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalAnswered={Object.keys(userAnswers).length}
        totalQuestions={QUESTIONS.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentMode === 'practice' && (
          <PracticeMode
            questions={QUESTIONS}
            userAnswers={userAnswers}
            onSelectAnswer={handleSelectAnswer}
            onClearAnswer={handleClearAnswer}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            userNotes={userNotes}
            onSaveNote={handleSaveNote}
            searchQuery={searchQuery}
          />
        )}

        {currentMode === 'exam' && (
          <ExamMode
            questions={QUESTIONS}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
            onReattemptMissedInPractice={handleReattemptMissed}
          />
        )}

        {currentMode === 'flashcards' && (
          <FlashcardMode
            questions={QUESTIONS}
            bookmarks={bookmarks}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentMode === 'highyield' && <HighYieldGuide />}
      </main>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        questions={QUESTIONS}
        userAnswers={userAnswers}
        bookmarks={bookmarks}
        userNotes={userNotes}
        onClearAllData={handleClearAllData}
      />

      {/* Print / PDF Sheet Modal */}
      <PrintStudySheet
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        questions={QUESTIONS}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Pharmacognosy II (Lectures 1–10) • Combined Master Review Bank
          </span>
          <span className="text-slate-400">
            92 Questions • Interactive Exam Simulator • High-Yield Revision Matrix
          </span>
        </div>
      </footer>
    </div>
  );
}
