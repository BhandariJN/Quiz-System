import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { QuizSnapshot, SnapshotQuestionDTO, QuestionAnswer } from '../types/quiz.types'

interface ActiveQuizState {
  attemptId: string | null
  quizSnapshot: QuizSnapshot | null
  currentQuestionIndex: number
  answers: Record<number, number>
  flaggedQuestions: Set<number>
  startTime: number | null
  timeRemaining: number

  getCurrentQuestion: () => SnapshotQuestionDTO | null
  getAnsweredCount: () => number
  getFlaggedCount: () => number
  getProgress: () => number

  startQuiz: (attemptId: string, snapshot: QuizSnapshot, durationMinutes: number) => void
  answerQuestion: (questionId: number, optionId: number) => void
  toggleFlag: (questionId: number) => void
  navigateToQuestion: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  updateTimeRemaining: (seconds: number) => void
  submitQuiz: () => QuestionAnswer[]
  resetQuiz: () => void
}

export const useActiveQuizStore = create<ActiveQuizState>()(
  persist(
    (set, get) => ({
      attemptId: null,
      quizSnapshot: null,
      currentQuestionIndex: 0,
      answers: {},
      flaggedQuestions: new Set(),
      startTime: null,
      timeRemaining: 0,

      getCurrentQuestion: () => {
        const { quizSnapshot, currentQuestionIndex } = get()
        return quizSnapshot?.questions[currentQuestionIndex] || null
      },

      getAnsweredCount: () => Object.keys(get().answers).length,

      getFlaggedCount: () => get().flaggedQuestions.size,

      getProgress: () => {
        const { quizSnapshot, answers } = get()
        if (!quizSnapshot) return 0
        return (Object.keys(answers).length / quizSnapshot.questions.length) * 100
      },

      startQuiz: (attemptId, snapshot, durationMinutes) =>
        set({
          attemptId,
          quizSnapshot: snapshot,
          currentQuestionIndex: 0,
          answers: {},
          flaggedQuestions: new Set(),
          startTime: Date.now(),
          timeRemaining: durationMinutes * 60,
        }),

      answerQuestion: (questionId, optionId) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionId },
        })),

      toggleFlag: (questionId) =>
        set((state) => {
          const newFlagged = new Set(state.flaggedQuestions)
          if (newFlagged.has(questionId)) {
            newFlagged.delete(questionId)
          } else {
            newFlagged.add(questionId)
          }
          return { flaggedQuestions: newFlagged }
        }),

      navigateToQuestion: (index) =>
        set((state) => ({
          currentQuestionIndex: Math.max(
            0,
            Math.min(index, (state.quizSnapshot?.questions.length || 1) - 1)
          ),
        })),

      nextQuestion: () => {
        const { currentQuestionIndex, quizSnapshot } = get()
        if (quizSnapshot && currentQuestionIndex < quizSnapshot.questions.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 })
        }
      },

      previousQuestion: () => {
        const { currentQuestionIndex } = get()
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 })
        }
      },

      updateTimeRemaining: (seconds) => set({ timeRemaining: seconds }),

      submitQuiz: () => {
        const { answers } = get()
        return Object.entries(answers).map(([questionId, optionId]) => ({
          questionId: Number(questionId),
          selectedOptionId: optionId,
        }))
      },

      resetQuiz: () =>
        set({
          attemptId: null,
          quizSnapshot: null,
          currentQuestionIndex: 0,
          answers: {},
          flaggedQuestions: new Set(),
          startTime: null,
          timeRemaining: 0,
        }),
    }),
    {
      name: 'active-quiz-storage',
      partialize: (state) => ({
        attemptId: state.attemptId,
        quizSnapshot: state.quizSnapshot,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        flaggedQuestions: Array.from(state.flaggedQuestions),
        startTime: state.startTime,
        timeRemaining: state.timeRemaining,
      }),
    }
  )
)
