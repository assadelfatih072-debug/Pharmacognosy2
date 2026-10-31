export interface ExamResult {
  id: string;
  timestamp: number;
  totalQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  topicBreakdown: Record<string, { total: number; correct: number }>;
  incorrectQuestionIds: number[];
}

const STORAGE_KEYS = {
  PRACTICE_ANSWERS: 'pharma_practice_answers_v1',
  BOOKMARKS: 'pharma_bookmarks_v1',
  NOTES: 'pharma_question_notes_v1',
  CHECKLIST: 'pharma_checklist_v1',
  FLASHCARD_KNOWN: 'pharma_flashcard_known_v1',
  EXAM_HISTORY: 'pharma_exam_history_v1',
  DARK_MODE: 'pharma_theme_dark_v1',
};

export const storage = {
  getPracticeAnswers(): Record<number, 'A' | 'B' | 'C' | 'D'> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRACTICE_ANSWERS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  savePracticeAnswer(questionId: number, answer: 'A' | 'B' | 'C' | 'D') {
    const current = this.getPracticeAnswers();
    current[questionId] = answer;
    localStorage.setItem(STORAGE_KEYS.PRACTICE_ANSWERS, JSON.stringify(current));
  },

  clearPracticeAnswers() {
    localStorage.removeItem(STORAGE_KEYS.PRACTICE_ANSWERS);
  },

  getBookmarks(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(questionId: number): boolean {
    const list = this.getBookmarks();
    const index = list.indexOf(questionId);
    let bookmarked = false;
    if (index > -1) {
      list.splice(index, 1);
      bookmarked = false;
    } else {
      list.push(questionId);
      bookmarked = true;
    }
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(list));
    return bookmarked;
  },

  getNotes(): Record<number, string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveNote(questionId: number, note: string) {
    const notes = this.getNotes();
    if (!note.trim()) {
      delete notes[questionId];
    } else {
      notes[questionId] = note;
    }
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  getChecklist(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleChecklist(itemId: string): boolean {
    const list = this.getChecklist();
    const idx = list.indexOf(itemId);
    let checked = false;
    if (idx > -1) {
      list.splice(idx, 1);
      checked = false;
    } else {
      list.push(itemId);
      checked = true;
    }
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(list));
    return checked;
  },

  getFlashcardKnown(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FLASHCARD_KNOWN);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  setFlashcardKnown(questionId: number, known: boolean) {
    const list = this.getFlashcardKnown();
    const idx = list.indexOf(questionId);
    if (known && idx === -1) {
      list.push(questionId);
    } else if (!known && idx > -1) {
      list.splice(idx, 1);
    }
    localStorage.setItem(STORAGE_KEYS.FLASHCARD_KNOWN, JSON.stringify(list));
  },

  getExamHistory(): ExamResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveExamResult(result: ExamResult) {
    const history = this.getExamHistory();
    history.unshift(result);
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(history.slice(0, 20)));
  },

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.PRACTICE_ANSWERS);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.CHECKLIST);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARD_KNOWN);
    localStorage.removeItem(STORAGE_KEYS.EXAM_HISTORY);
  }
};
