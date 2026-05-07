import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Flag, Image as ImageIcon } from 'lucide-react'
import { SnapshotQuestionDTO } from '../types/quiz.types'

interface QuestionCardProps {
  question: SnapshotQuestionDTO
  questionNumber: number
  totalQuestions: number
  selectedOption: number | null
  isFlagged: boolean
  onSelectOption: (optionId: number) => void
  onToggleFlag: () => void
  onPrevious: () => void
  onNext: () => void
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onPrevious,
  onNext,
}: QuestionCardProps) {
  const [showImage, setShowImage] = useState(false)

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Question {questionNumber} of {totalQuestions}
          </h3>
          <p className="text-sm text-muted-foreground">
            {question.topicName}
          </p>
        </div>

        <div className="flex gap-2">
          {question.mcqImage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowImage(!showImage)}
              className={showImage ? 'text-primary' : ''}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFlag}
            className={isFlagged ? 'text-yellow-500' : ''}
          >
            <Flag className="h-4 w-4" fill={isFlagged ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-lg leading-relaxed">
          {question.question}
        </div>

        {showImage && question.mcqImage && (
          <div className="border rounded-lg overflow-hidden">
            <img
              src={question.mcqImage}
              alt="Question diagram"
              className="w-full h-auto max-h-64 object-contain"
            />
          </div>
        )}

        <RadioGroup
          value={selectedOption?.toString()}
          onValueChange={(value) => onSelectOption(Number(value))}
          className="space-y-3"
        >
          {question.options?.map((option) => (
            <div
              key={option.optionId}
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <RadioGroupItem
                value={option.optionId.toString()}
                id={`option-${option.optionId}`}
              />
              <Label
                htmlFor={`option-${option.optionId}`}
                className="flex-1 cursor-pointer"
              >
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionNumber === 1}
          >
            Previous
          </Button>

          <Button
            onClick={onNext}
          >
            {questionNumber === totalQuestions ? 'Finish' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
