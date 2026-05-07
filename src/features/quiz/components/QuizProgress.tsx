import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface QuizProgressProps {
  progress: number
  className?: string
}

export function QuizProgress({ progress, className }: QuizProgressProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
