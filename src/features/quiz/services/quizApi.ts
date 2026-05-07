import api from '@/lib/axios'
import { ApiResponse } from '@/types/api.types'
import {
  QuizTemplateResponse,
  QuizSnapshot,
  QuizSnapshotResponse,
  QuizResult,
  QuizAttemptResult,
  QuizAttempt,
  QuizHistory,
  CategoryAnalysis,
  QuestionAnswer,
  QuizConfigDTO,
  SnapshotQuestionDTO,
} from '../types/quiz.types'

// Helper function to parse quiz snapshot response
const parseQuizSnapshot = (response: QuizSnapshotResponse): QuizSnapshot => {
  try {
    const questions = JSON.parse(response.questionsSnapshotJson)
    return {
      attemptId: String(response.attemptId),
      templateId: response.quizTemplate?.templateId,
      name: response.quizTemplate?.name || 'Quiz',
      durationInMinutes: response.quizTemplate?.configJson?.durationMinutes || 30,
      questions: questions,
      generatedAt: response.attemptedAt,
    }
  } catch (error) {
    console.error('Failed to parse questionsSnapshotJson:', error)
    return {
      attemptId: String(response.attemptId),
      templateId: response.quizTemplate?.templateId,
      name: response.quizTemplate?.name || 'Quiz',
      durationInMinutes: response.quizTemplate?.configJson?.durationMinutes || 30,
      questions: [],
      generatedAt: response.attemptedAt,
    }
  }
}

// Helper function to transform backend result to QuizResult format
const parseQuizResult = (response: QuizAttemptResult): QuizResult => {
  const totalQuestions = response.quizTemplate?.configJson?.totalQuestions || 0
  const correctAnswers = response.score || 0
  const wrongAnswers = totalQuestions - correctAnswers
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  // Parse questions to calculate topic breakdown
  let topicBreakdown: any[] = []
  try {
    const questions: SnapshotQuestionDTO[] = JSON.parse(response.questionsSnapshotJson)
    const topicMap = new Map<string, { total: number; correct: number; topicName: string }>()

    questions.forEach((q) => {
      const topicName = q.topicName || 'General'
      if (!topicMap.has(topicName)) {
        topicMap.set(topicName, { total: 0, correct: 0, topicName })
      }
      const topic = topicMap.get(topicName)!
      topic.total += 1
    })

    topicBreakdown = Array.from(topicMap.values()).map((topic) => ({
      topicId: topic.topicName,
      topicName: topic.topicName,
      totalQuestions: topic.total,
      correctAnswers: topic.correct,
      accuracy: topic.total > 0 ? (topic.correct / topic.total) * 100 : 0,
    }))
  } catch (error) {
    console.error('Failed to parse questions for topic breakdown:', error)
  }

  return {
    attemptId: String(response.attemptId),
    score: scorePercentage,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    unattempted: 0,
    timeTaken: 0, // Not provided by backend
    topicBreakdown,
  }
}

// Helper function to parse topic performance from JSON string
const parseTopicPerformance = (jsonString: string): TopicPerformance[] => {
  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Failed to parse topicPerformanceJson:', error)
    return []
  }
}

export const quizApi = {
  getTemplates: async () => {
    const response = await api.get<ApiResponse<any>>('/quiz-templates')
    return response.data.data
  },

  getTemplateById: async (templateId: string) => {
    const response = await api.get<ApiResponse<QuizTemplateResponse>>(`/quiz-templates/${templateId}`)
    return response.data.data
  },

  generateFromTemplate: async (templateId: string) => {
    const response = await api.post<ApiResponse<QuizSnapshotResponse>>(`/quiz-attempts/generate/${templateId}`)
    return parseQuizSnapshot(response.data.data)
  },

  generateCustom: async (config: QuizConfigDTO) => {
    const response = await api.post<ApiResponse<QuizSnapshotResponse>>('/quiz-attempts/generate/custom', config)
    return parseQuizSnapshot(response.data.data)
  },

  generateCustomForEntrance: async (entranceSlug: string, config: QuizConfigDTO) => {
    const response = await api.post<ApiResponse<QuizSnapshotResponse>>(
      `/quiz-attempts/generate/custom/entrance/${entranceSlug}`,
      config
    )
    return parseQuizSnapshot(response.data.data)
  },

  submitQuiz: async (attemptId: string, answers: QuestionAnswer[]) => {
    const response = await api.post<ApiResponse<QuizAttemptResult>>(`/quiz-attempts/${attemptId}/submit`, {
      questionAnswers: answers,
    })
    return parseQuizResult(response.data.data)
  },

  getAttemptById: async (attemptId: string) => {
    const response = await api.get<ApiResponse<QuizAttempt>>(`/quiz-attempts/${attemptId}`)
    return response.data.data
  },

  getUserAttempts: async () => {
    const response = await api.get<ApiResponse<QuizAttempt[]>>('/quiz-attempts/user')
    return response.data.data
  },

  getQuizHistory: async () => {
    const response = await api.get<ApiResponse<QuizHistory[]>>('/quiz-attempts/history')
    return response.data.data
  },

  getCategoryAnalysis: async () => {
    const response = await api.get<ApiResponse<CategoryAnalysis[]>>('/quiz-attempts/analysis')
    return response.data.data
  },

  deleteUserTemplate: async (templateId: string) => {
    const response = await api.delete<ApiResponse<void>>(`/quiz-templates/my-templates/${templateId}`)
    return response.data
  },

  getUserTemplates: async () => {
    const response = await api.get<ApiResponse<any>>('/quiz-templates/my-templates')
    return response.data.data
  },
}
