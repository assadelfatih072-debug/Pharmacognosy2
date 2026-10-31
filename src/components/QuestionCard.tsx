import React, { useState } from 'react';
import { 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  FileEdit, 
  Check, 
  Sparkles,
  Tag,
  Flag
} from 'lucide-react';
import { Question } from '../data/questions';
import { sound } from '../utils/audio';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  onSelectAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isFlagged?: boolean;
  onToggleFlag?: () => void;
  showExplanationImmediately?: boolean;
  userNote?: string;
  onSaveNote?: (note: string) => void;
  onClearAnswer?: () => void;
  mode?: 'practice' | 'exam-live' | 'exam-review';
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isBookmarked,
  onToggleBookmark,
  isFlagged = false,
  onToggleFlag,
  showExplanationImmediately = true,
  userNote = '',
  onSaveNote,
  onClearAnswer,
  mode = 'practice',
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(userNote);

  const isAnswered = selectedAnswer !== undefined;
  const isCorrect = isAnswered && selectedAnswer === question.correctAnswer;
  const showFeedback = isAnswered && showExplanationImmediately;

  const handleSelect = (letter: 'A' | 'B' | 'C' | 'D') => {
    if (mode === 'exam-review') return;
    onSelectAnswer(letter);
    if (showExplanationImmediately) {
      if (letter === question.correctAnswer) {
        sound.playCorrect();
      } else {
        sound.playIncorrect();
      }
    } else {
      sound.playClick();
    }
  };

  const handleSaveNote = () => {
    if (onSaveNote) {
      onSaveNote(noteText);
      setIsEditingNote(false);
      sound.playClick();
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 shadow-sm ${
      showFeedback
        ? isCorrect
          ? 'border-emerald-300 dark:border-emerald-800/70 shadow-emerald-500/5'
          : 'border-rose-300 dark:border-rose-800/70 shadow-rose-500/5'
        : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
    }`}>
      {/* Question Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm">
            Q{question.id}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {question.topicTitle.split(':')[0]}
          </span>
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              {tag}
            </span>
          ))}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {onToggleFlag && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleFlag();
              }}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                isFlagged
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Flag for review"
            >
              <Flag className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline text-xs">Flag</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onToggleBookmark();
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-emerald-500 text-emerald-600' : ''}`} />
          </button>

          {onSaveNote && (
            <button
              onClick={() => setIsEditingNote(!isEditingNote)}
              className={`p-1.5 rounded-lg transition-colors ${
                userNote || isEditingNote
                  ? 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Add personal study note"
            >
              <FileEdit className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Body */}
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-5">
          {question.question}
        </h3>

        {/* Options List */}
        <div className="space-y-2.5">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.letter;
            const isOptionCorrect = option.letter === question.correctAnswer;

            let optionStyle = 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';
            let badgeStyle = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300';

            if (showFeedback) {
              if (isOptionCorrect) {
                optionStyle = 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-medium ring-1 ring-emerald-500/30';
                badgeStyle = 'bg-emerald-600 text-white font-bold';
              } else if (isSelected && !isOptionCorrect) {
                optionStyle = 'border-rose-400 dark:border-rose-700 bg-rose-50/80 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 line-through decoration-rose-400/50';
                badgeStyle = 'bg-rose-600 text-white font-bold';
              } else {
                optionStyle = 'opacity-60 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400';
              }
            } else if (isSelected) {
              // Live exam mode: selected but hidden answer
              optionStyle = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100 ring-2 ring-emerald-500/20 font-medium';
              badgeStyle = 'bg-emerald-600 text-white font-bold';
            }

            return (
              <button
                key={option.letter}
                onClick={() => handleSelect(option.letter)}
                disabled={mode === 'exam-review'}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-start gap-3 relative group ${optionStyle}`}
              >
                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-semibold shrink-0 transition-transform ${badgeStyle} group-hover:scale-105`}>
                  {option.letter}
                </span>

                <span className="text-sm sm:text-base leading-snug flex-1 pt-0.5">
                  {option.text}
                </span>

                {showFeedback && isOptionCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                )}
                {showFeedback && isSelected && !isOptionCorrect && (
                  <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Immediate Explanation Banner in Practice Mode */}
        {showFeedback && (
          <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Correct Answer: Option {question.correctAnswer}</span>
              </div>
              {onClearAnswer && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onClearAnswer();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline"
                >
                  Clear & Re-try
                </button>
              )}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Personal Study Notes box */}
        {isEditingNote && (
          <div className="mt-4 p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40">
            <label className="block text-xs font-medium text-indigo-900 dark:text-indigo-300 mb-1.5">
              Personal Study Note / Mnemonic for Q{question.id}:
            </label>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Remember: Seydler = 1815, Dioscorides = De Materia Medica, Hippocrates = Father of Med."
              rows={2}
              className="w-full text-xs sm:text-sm p-2 rounded-lg border border-indigo-200 dark:border-indigo-800/60 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setIsEditingNote(false)}
                className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-medium flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3 h-3" />
                Save Note
              </button>
            </div>
          </div>
        )}

        {/* Existing Note preview */}
        {!isEditingNote && userNote && (
          <div 
            onClick={() => setIsEditingNote(true)}
            className="mt-3 p-2.5 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg border border-indigo-100 dark:border-indigo-900/40 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors flex items-start gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-xs text-indigo-950 dark:text-indigo-200 italic">
              &ldquo;{userNote}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
