import React, { useState } from 'react';
import { X, Printer, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { Question, TOPICS } from '../data/questions';

interface PrintStudySheetProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
}

export const PrintStudySheet: React.FC<PrintStudySheetProps> = ({
  isOpen,
  onClose,
  questions,
}) => {
  const [includeAnswers, setIncludeAnswers] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  if (!isOpen) return null;

  const printableQuestions = questions.filter((q) => {
    if (selectedTopic !== 'all' && q.topicId !== selectedTopic) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl my-auto animate-scaleUp">
        {/* Modal Controls (Hidden in print) */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 rounded-t-3xl print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">
              Printable Pharmacognosy II Study Bank
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs p-2 rounded-lg border border-slate-300 bg-white text-slate-800"
            >
              <option value="all">All Topics (92 Qs)</option>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.shortTitle}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIncludeAnswers(!includeAnswers)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium hover:bg-slate-100"
            >
              {includeAnswers ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Showing Answers</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Blank Test (No Answers)</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 print:p-0 print:overflow-visible text-slate-900 bg-white">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              Pharmacognosy II — Combined MCQ Review Set
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Lectures 1–10 Deduplicated Examination Question Bank
            </p>
            <p className="text-xs text-slate-500">
              {printableQuestions.length} Questions | {includeAnswers ? 'Master Review Edition with Explanations' : 'Self-Test Examination Copy'}
            </p>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {printableQuestions.map((q) => (
              <div key={q.id} className="break-inside-avoid space-y-2 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-sm text-slate-900">
                    Q{q.id}.
                  </span>
                  <p className="text-sm font-semibold text-slate-900">
                    {q.question}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-6">
                  {q.options.map((opt) => {
                    const isCorrect = includeAnswers && opt.letter === q.correctAnswer;
                    return (
                      <div
                        key={opt.letter}
                        className={`text-xs p-1.5 rounded flex items-start gap-2 ${
                          isCorrect ? 'font-bold bg-emerald-50 text-emerald-900 border border-emerald-300' : 'text-slate-700'
                        }`}
                      >
                        <span className="font-bold">{opt.letter}.</span>
                        <span>{opt.text}</span>
                        {isCorrect && <span className="ml-auto text-[10px] text-emerald-700">✓ Correct</span>}
                      </div>
                    );
                  })}
                </div>

                {includeAnswers && (
                  <div className="pl-6 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                    <span className="font-bold text-emerald-800">Correct Answer: {q.correctAnswer} — </span>
                    <span>{q.explanation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Printable Footer */}
          <div className="border-t border-slate-300 pt-4 text-center text-[10px] text-slate-400">
            Pharmacognosy II (Lectures 1–10) • Pharmacy Review Bank & Examination Guide
          </div>
        </div>
      </div>
    </div>
  );
};
