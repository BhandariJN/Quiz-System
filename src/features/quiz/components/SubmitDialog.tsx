import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface SubmitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answeredCount: number
  totalCount: number
  flaggedCount: number
  onSubmit: () => void
  onCancel: () => void
}

export function SubmitDialog({
  open,
  onOpenChange,
  answeredCount,
  totalCount,
  flaggedCount,
  onSubmit,
  onCancel,
}: SubmitDialogProps) {
  const unansweredCount = totalCount - answeredCount

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Are you sure you want to submit your quiz?</p>
            <div className="text-sm space-y-1 mt-2">
              <p>
                <span className="font-medium">Answered:</span> {answeredCount} of {totalCount}
              </p>
              <p>
                <span className="font-medium">Unanswered:</span> {unansweredCount}
              </p>
              {flaggedCount > 0 && (
                <p className="text-yellow-600">
                  <span className="font-medium">Flagged:</span> {flaggedCount} questions
                </p>
              )}
            </div>
            {unansweredCount > 0 && (
              <p className="text-amber-600 mt-2">
                Warning: You have {unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Submit Quiz</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
