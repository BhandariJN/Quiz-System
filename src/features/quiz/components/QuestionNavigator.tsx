import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface QuestionNavigatorProps {
  totalQuestions: number
  currentIndex: number
  answeredQuestions: number[]
  flaggedQuestions: number[]
  onNavigate: (index: number) => void
}

export function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
}: QuestionNavigatorProps) {
  return (
    <div className="bg-white rounded-lg border p-4">
      <h4 className="font-medium mb-3">Question Navigator</h4>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const questionId = i + 1
          const isCurrent = i === currentIndex
          const isAnswered = answeredQuestions.includes(questionId)
          const isFlagged = flaggedQuestions.includes(questionId)

          return (
            <Button
              key={i}
              variant={isCurrent ? 'default' : 'outline'}
              size="sm"
              onClick={() => onNavigate(i)}
              className={cn(
                'h-10 w-10 p-0 text-sm font-medium',
                isAnswered && !isCurrent && 'bg-green-100 hover:bg-green-200',
                isFlagged && 'border-yellow-500 border-2'
              )}
            >
              {questionId}
            </Button>
          )
        })}
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border rounded" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-yellow-500 rounded" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border rounded" />
          <span>Not Answered</span>
        </div>
      </div>
    </div>
  )
}
