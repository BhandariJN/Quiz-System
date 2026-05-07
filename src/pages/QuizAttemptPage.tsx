import { useEffect, useCallback, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { useActiveQuizStore } from '@/features/quiz/stores/activeQuizStore'
import { useSubmitQuiz } from '@/features/quiz/hooks/useQuiz'
import { QuizTimer } from '@/features/quiz/components/QuizTimer'
import { QuestionCard } from '@/features/quiz/components/QuestionCard'
import { QuestionNavigator } from '@/features/quiz/components/QuestionNavigator'
import { QuizProgress } from '@/features/quiz/components/QuizProgress'
import { SubmitDialog } from '@/features/quiz/components/SubmitDialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function QuizAttemptPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showMobileNavigator, setShowMobileNavigator] = useState(false)

  const {
    quizSnapshot,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    getCurrentQuestion,
    getProgress,
    answerQuestion,
    toggleFlag,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    updateTimeRemaining,
    submitQuiz,
    resetQuiz,
  } = useActiveQuizStore()

  const submitMutation = useSubmitQuiz()
  const currentQuestion = getCurrentQuestion()
  const progress = getProgress()

  useEffect(() => {
    if (!quizSnapshot) {
      toast({
        title: 'No Active Quiz',
        description: 'Please select a quiz to start.',
        variant: 'destructive',
      })
      navigate('/quizzes/templates')
    }
  }, [quizSnapshot, navigate, toast])

  useEffect(() => {
    if (!quizSnapshot || timeRemaining <= 0) return

    const timer = setInterval(() => {
      const newTime = timeRemaining - 1
      updateTimeRemaining(newTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [quizSnapshot, timeRemaining, updateTimeRemaining])

  const handleTimeUp = useCallback(async () => {
    toast({
      title: "Time's Up!",
      description: 'Your quiz will be submitted automatically.',
      variant: 'destructive',
    })
    await handleSubmit()
  }, [toast])

  const handleTimeWarning = (minutesLeft: number) => {
    toast({
      title: `Only ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} left!`,
      variant: 'destructive',
    })
  }

  const handleSubmit = async () => {
    if (!attemptId) return

    const answersArray = submitQuiz()

    try {
      const result = await submitMutation.mutateAsync({
        attemptId,
        answers: answersArray,
      })

      resetQuiz()
      navigate(`/quizzes/results/${attemptId}`, { state: { result } })
    } catch (error) {
      // Error handled by mutation
    }
  }

  const handleSelectOption = (optionId: number) => {
    if (currentQuestion) {
      answerQuestion(currentQuestion.questionId, optionId)
    }
  }

  const handleToggleFlag = () => {
    if (currentQuestion) {
      toggleFlag(currentQuestion.questionId)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex === (quizSnapshot?.questions.length || 0) - 1) {
      setShowSubmitDialog(true)
    } else {
      nextQuestion()
    }
  }

  if (!quizSnapshot || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{quizSnapshot.name}</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quizSnapshot.questions.length}
              </p>
            </div>

            <div className="w-48 md:w-64">
              <QuizTimer
                durationInMinutes={quizSnapshot.durationInMinutes}
                timeRemaining={timeRemaining}
                onTimeUp={handleTimeUp}
                onWarning={handleTimeWarning}
              />
            </div>
          </div>

          <QuizProgress progress={progress} className="mt-4" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="hidden lg:block lg:col-span-1">
            <QuestionNavigator
              totalQuestions={quizSnapshot.questions.length}
              currentIndex={currentQuestionIndex}
              answeredQuestions={Object.keys(answers).map(Number)}
              flaggedQuestions={Array.from(flaggedQuestions)}
              onNavigate={navigateToQuestion}
            />
          </aside>

          <div className="lg:col-span-3">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizSnapshot.questions.length}
              selectedOption={answers[currentQuestion.questionId] || null}
              isFlagged={flaggedQuestions.has(currentQuestion.questionId)}
              onSelectOption={handleSelectOption}
              onToggleFlag={handleToggleFlag}
              onPrevious={previousQuestion}
              onNext={handleNext}
            />
          </div>
        </div>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowMobileNavigator(!showMobileNavigator)}
        >
          View All Questions ({Object.keys(answers).length}/{quizSnapshot.questions.length} answered)
        </Button>

        {showMobileNavigator && (
          <div className="mt-4">
            <QuestionNavigator
              totalQuestions={quizSnapshot.questions.length}
              currentIndex={currentQuestionIndex}
              answeredQuestions={Object.keys(answers).map(Number)}
              flaggedQuestions={Array.from(flaggedQuestions)}
              onNavigate={(index) => {
                navigateToQuestion(index)
                setShowMobileNavigator(false)
              }}
            />
          </div>
        )}
      </div>

      <SubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        answeredCount={Object.keys(answers).length}
        totalCount={quizSnapshot.questions.length}
        flaggedCount={flaggedQuestions.size}
        onSubmit={handleSubmit}
        onCancel={() => setShowSubmitDialog(false)}
      />
    </div>
  )
}
