import React, { useState, useEffect } from 'react';
import { 
  RotateCw, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  Bookmark, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Question, TOPICS } from '../data/questions';
import { storage } from '../utils/storage';
import { sound } from '../utils/audio';

interface FlashcardModeProps {
  questions: Question[];
  bookmarks: number[];
  onToggleBookmark: (id: number) => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  questions,
  bookmarks,
  onToggleBookmark,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [filterMode, setFilterMode] = useState<'all' | 'unmastered' | 'mastered' | 'bookmarked'>('all');
  const [knownIds, setKnownIds] = useState<number[]>(() => storage.getFlashcardKnown());

  // Filtered flashcard deck
  const deck = questions.filter((q) => {
    if (selectedTopic !== 'all' && q.topicId !== selectedTopic) return false;
    const isMastered = knownIds.includes(q.id);
    if (filterMode === 'mastered' && !isMastered) return false;
    if (filterMode === 'unmastered' && isMastered) return false;
    if (filterMode === 'bookmarked' && !bookmarks.includes(q.id)) return false;
    return true;
  });

  const currentQ = deck[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex, selectedTopic, filterMode]);

  // Keyboard navigation: Space = Flip, Left = Prev, Right = Next, 1 = Learning, 2 = Mastered
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        sound.playFlip();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < deck.length - 1) {
          sound.playClick();
          setCurrentIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          sound.playClick();
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length]);

  const handleMarkMastered = () => {
    if (!currentQ) return;
    sound.playCorrect();
    storage.setFlashcardKnown(currentQ.id, true);
    setKnownIds(storage.getFlashcardKnown());
    // Auto advance
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleMarkLearning = () => {
    if (!currentQ) return;
    sound.playIncorrect();
    storage.setFlashcardKnown(currentQ.id, false);
    setKnownIds(storage.getFlashcardKnown());
    // Auto advance
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const isCurrentMastered = currentQ ? knownIds.includes(currentQ.id) : false;
  const isBookmarked = currentQ ? bookmarks.includes(currentQ.id) : false;

  const totalMasteredInDeck = deck.filter((q) => knownIds.includes(q.id)).length;
  const progressPct = deck.length > 0 ? Math.round((totalMasteredInDeck / deck.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Deck Stats & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-slate-900 dark:text-white text-base">
              Flashcard Active Recall
            </h2>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-3">
            <span>
              Mastered: <strong className="text-emerald-600 dark:text-emerald-400">{totalMasteredInDeck}</strong> / {deck.length} ({progressPct}%)
            </span>
          </div>
        </div>

        {/* Progress line */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentIndex(0);
            }}
            className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Topics ({questions.length})</option>
            {TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.shortTitle}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'unmastered', label: 'To Learn' },
              { id: 'mastered', label: 'Mastered' },
              { id: 'bookmarked', label: 'Bookmarked' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  sound.playClick();
                  setFilterMode(mode.id as typeof filterMode);
                  setCurrentIndex(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterMode === mode.id
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Flashcard Card */}
      {deck.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
          <Layers className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            No cards in this deck view
          </h3>
          <p className="text-xs text-slate-400">
            Try switching filters or reset to &ldquo;All&rdquo;.
          </p>
        </div>
      ) : currentQ ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Card <strong>{currentIndex + 1}</strong> of {deck.length}
            </span>
            <span>Press Space or click card to flip</span>
          </div>

          <div
            onClick={() => {
              sound.playFlip();
              setIsFlipped(!isFlipped);
            }}
            className="cursor-pointer select-none bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-md min-h-[340px] flex flex-col justify-between hover:shadow-lg transition-all duration-200 relative group"
          >
            {/* Top info strip */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                  Q{currentQ.id}
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  {currentQ.topicTitle.split(':')[0]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    onToggleBookmark(currentQ.id);
                  }}
                  className="p-1 text-slate-400 hover:text-emerald-600"
                >
                  <Bookmark
                    className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-500 text-emerald-600' : ''}`}
                  />
                </button>
                <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{isFlipped ? 'Back' : 'Front (Tap to flip)'}</span>
                </span>
              </div>
            </div>

            {/* Card Content: Front vs Back */}
            <div className="py-8 my-auto">
              {!isFlipped ? (
                /* FRONT */
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed text-center">
                    {currentQ.question}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4 max-w-lg mx-auto opacity-75">
                    {currentQ.options.map((opt) => (
                      <div
                        key={opt.letter}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 flex items-center gap-2"
                      >
                        <span className="font-bold text-slate-400">{opt.letter}.</span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* BACK */
                <div className="space-y-4 animate-fadeIn">
                  <div className="text-center space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Correct Answer
                    </span>
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                      Option {currentQ.correctAnswer}:{' '}
                      {currentQ.options.find((o) => o.letter === currentQ.correctAnswer)?.text}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-center max-w-xl mx-auto">
                    {currentQ.explanation}
                  </div>

                  <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                    {currentQ.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom status badge */}
            <div className="text-center pt-2">
              {isCurrentMastered ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Marked as Mastered
                </span>
              ) : (
                <span className="text-xs text-slate-400">In Learning Queue</span>
              )}
            </div>
          </div>

          {/* Flashcard Response Controls */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                if (currentIndex > 0) {
                  sound.playClick();
                  setCurrentIndex((prev) => prev - 1);
                }
              }}
              disabled={currentIndex === 0}
              className={`p-3 rounded-2xl border text-sm font-medium transition-all ${
                currentIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
              title="Previous card"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>

            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <button
                onClick={handleMarkLearning}
                className="flex-1 py-3 px-3 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <X className="w-4 h-4" />
                <span>Still Learning</span>
              </button>

              <button
                onClick={handleMarkMastered}
                className="flex-1 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Mastered!</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (currentIndex < deck.length - 1) {
                  sound.playClick();
                  setCurrentIndex((prev) => prev + 1);
                }
              }}
              disabled={currentIndex === deck.length - 1}
              className={`p-3 rounded-2xl border text-sm font-medium transition-all ${
                currentIndex === deck.length - 1
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
              title="Next card"
            >
              <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
