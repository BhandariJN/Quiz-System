import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { QuizTemplateResponse } from '../types/quiz.types'

interface QuizCardProps {
  quiz: QuizTemplateResponse
  onStart: (quizId: string) => void
  onAddToCart?: (quizId: string) => void
  isPurchased?: boolean
  isLocked?: boolean
}

export function QuizCard({
  quiz,
  onStart,
  onAddToCart,
  isPurchased = false,
  isLocked = false,
}: QuizCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{quiz.name}</h3>
          <Badge variant={quiz.type === 'COMPETITIVE' ? 'destructive' : 'default'}>
            {quiz.type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{quiz.description}</p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="outline">
            {quiz.config?.totalQuestions} Questions
          </Badge>
          <Badge variant="outline">
            {quiz.config?.durationMinutes} Minutes
          </Badge>
          {quiz.config?.enableNegativeMarking && (
            <Badge variant="outline" className="text-amber-600">
              -{quiz.config.negativeMarkValue} Marking
            </Badge>
          )}
        </div>

        {quiz.entranceType && (
          <p className="text-xs text-muted-foreground mt-2">
            {quiz.entranceType.entranceName}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {isLocked ? (
          <Button variant="outline" disabled className="w-full">
            Subscription Required
          </Button>
        ) : quiz.entryFee === 0 || isPurchased ? (
          <Button onClick={() => onStart(quiz.templateId)} className="w-full">
            Start Quiz
          </Button>
        ) : (
          <>
            <span className="text-lg font-bold">
              ${quiz.entryFee}
            </span>
            <Button
              variant="outline"
              onClick={() => onAddToCart?.(quiz.templateId)}
            >
              Add to Cart
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
