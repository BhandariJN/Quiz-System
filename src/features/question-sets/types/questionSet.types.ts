export interface QuestionSet {
  id: number
  name: string
  description: string
  price: number
  totalQuestions: number
  topics: string[]
  difficulty: string
  createdAt: string
}

export interface QuestionSetDetail extends QuestionSet {
  questions: Array<{
    questionId: number
    question: string
    topicName: string
  }>
}
