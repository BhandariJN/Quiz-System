import { useEffect, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface QuizTimerProps {
  durationInMinutes: number
  timeRemaining: number
  onTimeUp: () => void
  onWarning?: (minutesLeft: number) => void
}

export function QuizTimer({
  durationInMinutes,
  timeRemaining,
  onTimeUp,
  onWarning,
}: QuizTimerProps) {
  const totalSeconds = durationInMinutes * 60
  const progress = (timeRemaining / totalSeconds) * 100
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  const getStatusColor = () => {
    if (progress > 50) return 'bg-green-500'
    if (progress > 25) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp()
      return
    }

    if (timeRemaining === 300) onWarning?.(5)
    if (timeRemaining === 60) onWarning?.(1)
  }, [timeRemaining, onTimeUp, onWarning])

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Time Remaining</span>
        <span className={cn(
          "text-lg font-mono font-bold",
          progress < 25 ? 'text-red-600 animate-pulse' : 'text-foreground'
        )}>
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      </div>
      <Progress
        value={progress}
        className={cn("h-2", getStatusColor())}
      />
    </div>
  )
}
