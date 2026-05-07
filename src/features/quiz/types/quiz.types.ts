export type QuizTemplateType = 'PRACTICE' | 'COMPETITIVE'
export type QuizTemplateStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type QuizDifficulty = 'EASY' | 'MEDIUM' | 'HARD' | 'MIXED'

export interface QuizTemplateResponse {
  templateId: string
  name: string
  description: string
  type: QuizTemplateType
  entryFee: number
  config: QuizConfigDTO
  status: QuizTemplateStatus
  createdAt: string
  updatedAt: string
  createdBy: string
  entranceType?: EntranceTypeSummary
}

export interface TopicDistribution {
  topicId?: string
  topicName?: string
  count: number
  weightage: number
}

export interface ValidationConstraints {
  noRepeatWithinDays: number
  avoidPreviouslyFailed: boolean
  maxUsageCount: number
}

export interface QuizConfigDTO {
  totalQuestions: number
  totalMarks: number
  durationMinutes: number
  topicDistribution?: TopicDistribution[]
  difficultyDistribution?: Record<string, number> // {"EASY": 30, "MODERATE": 50, "HARD": 20}
  enableNegativeMarking: boolean
  negativeMarkValue: number
  constraints?: ValidationConstraints
}

export interface EntranceTypeSummary {
  entranceTypeId: number
  entranceName: string
  slug: string
}

export interface QuizSnapshot {
  attemptId: string
  templateId?: string
  name: string
  durationInMinutes: number
  questions: SnapshotQuestionDTO[]
  generatedAt: string
}

// Raw API response structure (questionsSnapshotJson is a JSON string)
export interface QuizSnapshotResponse {
  attemptId: number
  userId: number
  userName: string
  quizTemplate: {
    templateId: string
    name: string
    description: string | null
    type: QuizTemplateType
    entryFee: number | null
    configJson: QuizConfigDTO
    createdBy: string
    status: QuizTemplateStatus
    createdAt: string
    updatedAt: string | null
    entranceType?: EntranceTypeSummary
  }
  questionsSnapshotJson: string // JSON string that needs parsing
  score: number
  attemptedAt: string
  submitted: boolean
}

export interface SnapshotQuestionDTO {
  questionId: number
  question: string
  topicName: string
  options: SnapshotOptionDTO[]
  mcqImage?: string
}

export interface SnapshotOptionDTO {
  optionId: number
  text: string
  isCorrect?: boolean
}

export interface QuizResult {
  attemptId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  unattempted: number
  timeTaken: number
  topicBreakdown: TopicPerformance[]
  rank?: number
  percentile?: number
}

// Backend quiz submission response
export interface QuizAttemptResult {
  attemptId: number
  userId: number
  userName: string
  quizTemplate: {
    templateId: string
    name: string
    description: string | null
    type: QuizTemplateType
    entryFee: number | null
    configJson: QuizConfigDTO
    createdBy: string
    status: QuizTemplateStatus
    createdAt: string
    updatedAt: string | null
    entranceType?: EntranceTypeSummary
  }
  questionsSnapshotJson: string
  score: number // Raw score (correct answer count)
  attemptedAt: string
  submitted: boolean
}

export interface QuizAttempt {
  attemptId: string
  quizName: string
  score: number
  totalQuestions: number
  correctAnswers: number
  startedAt: string
  completedAt?: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'
}

export interface QuizHistory {
  id: number
  quizId: string | null
  quizName: string | null
  quizTemplateId: string
  quizTemplateName: string
  totalScore: number
  correctAnswers: number
  wrongAnswers: number
  skippedAnswers: number
  totalQuestions: number
  timeTakenSeconds: number | null
  percentage: number
  status: 'PASSED' | 'FAILED'
  rankAtAttempt: number | null
  previousRank: number
  previousScore: number
  currentRank: number
  topicPerformanceJson: string
  attemptedAt: string
}

export interface TopicPerformance {
  topicId: string
  topicName: string
  totalQuestions: number
  correctAnswers: number
  accuracy: number
}

export interface CategoryAnalysis {
  categoryName: string
  totalAttempted: number
  totalCorrect: number
  accuracy: number
}

export interface QuestionAnswer {
  questionId: number
  selectedOptionId: number
}

export interface QuizSetAttemptRequest {
  questionAnswers: QuestionAnswer[]
}
