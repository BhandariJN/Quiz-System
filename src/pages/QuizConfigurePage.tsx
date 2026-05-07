import { useParams, useNavigate } from 'react-router-dom'
import { useQuizTemplate } from '@/features/quiz/hooks/useQuizTemplates'
import { useGenerateQuizFromTemplate } from '@/features/quiz/hooks/useQuiz'
import { useActiveQuizStore } from '@/features/quiz/stores/activeQuizStore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Clock, FileText, AlertTriangle, Play, ArrowLeft, Info } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function QuizConfigurePage() {
  const { templateId } = useParams<{ templateId: string }>()
  const navigate = useNavigate()

  const { data: template, isLoading, error } = useQuizTemplate(templateId || '')
  const generateQuiz = useGenerateQuizFromTemplate()
  const startQuiz = useActiveQuizStore((state) => state.startQuiz)

  const handleStartQuiz = async () => {
    if (!templateId) return

    try {
      const snapshot = await generateQuiz.mutateAsync(templateId)
      startQuiz(snapshot.attemptId, snapshot, snapshot.durationInMinutes)
      navigate(`/quizzes/attempt/${snapshot.attemptId}`)
    } catch {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !template) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || 'Failed to load quiz template. Please try again.'}
          </AlertDescription>
        </Alert>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/quizzes/templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
      </div>
    )
  }

  const config = template.config

  return (
    <div className="container py-8 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/quizzes/templates')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Badge variant={template.type === 'PRACTICE' ? 'secondary' : 'default'} className="mb-2">
                {template.type}
              </Badge>
              <CardTitle className="text-2xl">{template.name}</CardTitle>
            </div>
            <Badge variant="outline">{template.status}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {template.description && (
            <p className="text-muted-foreground">{template.description}</p>
          )}

          {/* Quiz Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <FileText className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-lg font-semibold">{config?.totalQuestions}</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="text-lg font-semibold">{config?.durationMinutes}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-lg font-semibold">{config?.totalMarks}</div>
              <div className="text-xs text-muted-foreground">Total Marks</div>
            </div>
            {template.entranceType && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <div className="text-lg font-semibold truncate">{template.entranceType.entranceName}</div>
                <div className="text-xs text-muted-foreground">Entrance Type</div>
              </div>
            )}
          </div>

          {/* Configuration Details */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Info className="h-4 w-4" />
              Configuration Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">Negative Marking</span>
                <span>{config?.enableNegativeMarking ? `Yes (-${config.negativeMarkValue})` : 'No'}</span>
              </div>
              {config?.topicDistribution && config.topicDistribution.length > 0 && (
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span className="text-muted-foreground">Topics</span>
                  <span>{config.topicDistribution.length} selected</span>
                </div>
              )}
              {config?.difficultyDistribution && (
                <div className="flex justify-between p-2 bg-muted/50 rounded">
                  <span className="text-muted-foreground">Difficulty Mix</span>
                  <span className="truncate max-w-[150px]">
                    {Object.entries(config.difficultyDistribution)
                      .map(([k, v]) => `${k}: ${v}%`)
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Topic Distribution */}
          {config?.topicDistribution && config.topicDistribution.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Topic Distribution</h3>
              <div className="space-y-2">
                {config.topicDistribution.map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{topic.topicName || `Topic ${idx + 1}`}</div>
                      <div className="text-xs text-muted-foreground">{topic.count} questions</div>
                    </div>
                    {topic.weightage > 0 && (
                      <Badge variant="outline">{topic.weightage}% weight</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-4 border-t">
            <span>Created: {formatDate(template.createdAt)}</span>
            <span>Updated: {formatDate(template.updatedAt)}</span>
            {template.createdBy && <span>By: {template.createdBy}</span>}
          </div>

          {template.entryFee > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This quiz requires a fee of ${template.entryFee}. Make sure you have purchased access or have an active subscription.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full sm:w-auto"
            size="lg"
            onClick={handleStartQuiz}
            disabled={generateQuiz.isPending}
          >
            {generateQuiz.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {generateQuiz.isPending ? 'Generating Quiz...' : 'Start Quiz Now'}
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            size="lg"
            onClick={() => navigate('/quizzes/custom')}
          >
            Create Custom Practice
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
