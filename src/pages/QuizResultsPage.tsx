import { useParams, useLocation, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { QuizResult, TopicPerformance } from '@/features/quiz/types/quiz.types'
import { CheckCircle, XCircle, HelpCircle, Clock, RotateCcw, Home } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

export default function QuizResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>()
  const location = useLocation()
  const result = location.state?.result as QuizResult

  if (!result) {
    return (
      <div className="container py-8 text-center">
        <p className="text-muted-foreground">Results not found.</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const scorePercentage = (result.score / result.totalQuestions) * 100
  const isPassed = scorePercentage >= 50

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Quiz Results</h1>

      {/* Score Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className={`text-6xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              {result.score}%
            </div>
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{result.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{result.wrongAnswers}</div>
                  <div className="text-sm text-muted-foreground">Wrong</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <HelpCircle className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{result.unattempted}</div>
                  <div className="text-sm text-muted-foreground">Unattempted</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatDuration(result.timeTaken)}</div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Breakdown */}
      {result.topicBreakdown && result.topicBreakdown.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Topic Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.topicBreakdown.map((topic: TopicPerformance) => (
                <div key={topic.topicId} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{topic.topicName}</span>
                      <span className="text-sm text-muted-foreground">
                        {topic.correctAnswers}/{topic.totalQuestions} ({topic.accuracy.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${topic.accuracy}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ranking */}
      {(result.rank || result.percentile) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Ranking</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            {result.rank && (
              <div className="text-center p-4 bg-amber-50 rounded-lg flex-1">
                <div className="text-3xl font-bold text-amber-600">#{result.rank}</div>
                <div className="text-sm text-muted-foreground">Rank</div>
              </div>
            )}
            {result.percentile && (
              <div className="text-center p-4 bg-purple-50 rounded-lg flex-1">
                <div className="text-3xl font-bold text-purple-600">{result.percentile.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Percentile</div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline">
          <Link to="/quizzes/templates">
            <RotateCcw className="h-4 w-4 mr-2" />
            Take Another Quiz
          </Link>
        </Button>
        <Button asChild>
          <Link to="/dashboard">
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
