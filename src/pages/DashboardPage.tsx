import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuizHistory, useCategoryAnalysis } from '@/features/quiz/hooks/useQuiz'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, Trophy, TrendingUp, Calendar, AlertCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/useToast'

export default function DashboardPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data: history, isLoading: historyLoading } = useQuizHistory()
  const { data: analysis, isLoading: analysisLoading } = useCategoryAnalysis()

  // Handle payment callback params
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    const method = searchParams.get('method')
    const reason = searchParams.get('reason')

    if (paymentStatus === 'success') {
      toast({
        title: 'Payment Successful!',
        description: method === 'khalti' ? 'Your Khalti payment was processed.' : 'Your eSewa payment was processed.',
      })
      // Clear params from URL
      navigate('/dashboard', { replace: true })
    } else if (paymentStatus === 'failed') {
      toast({
        title: 'Payment Failed',
        description: reason === 'verification_failed' 
          ? 'Payment verification failed. Contact support if amount was deducted.'
          : 'Your payment could not be completed.',
        variant: 'destructive',
      })
      navigate('/dashboard', { replace: true })
    } else if (paymentStatus === 'canceled') {
      toast({
        title: 'Payment Canceled',
        description: 'You canceled the payment. You can try again anytime.',
      })
      navigate('/dashboard', { replace: true })
    }
  }, [searchParams, toast, navigate])

  const stats = {
    totalQuizzes: history?.length || 0,
    averageScore: history?.length
      ? history.reduce((acc, h) => acc + h.percentage, 0) / history.length
      : 0,
    totalQuestions: history?.reduce((acc, h) => acc + h.totalQuestions, 0) || 0,
    totalCorrect: history?.reduce((acc, h) => acc + h.correctAnswers, 0) || 0,
  }

  const recentAttempts = history?.slice(0, 5) || []

  // Check if we just came from payment
  const showPaymentBanner = searchParams.get('payment') === 'success'
  const showFailureBanner = searchParams.get('payment') === 'failed'
  const showCanceledBanner = searchParams.get('payment') === 'canceled'

  return (
    <div className="container py-8">
      {/* Payment Status Banners */}
      {showPaymentBanner && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Payment Successful!</p>
            <p className="text-sm text-green-600">Your purchase has been completed. Visit your library to access your content.</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link to="/library">Go to Library</Link>
          </Button>
        </div>
      )}
      
      {showFailureBanner && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600" />
          <div>
            <p className="font-medium text-red-800">Payment Failed</p>
            <p className="text-sm text-red-600">Your payment could not be processed. Please try again.</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link to="/cart">Try Again</Link>
          </Button>
        </div>
      )}
      
      {showCanceledBanner && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div>
            <p className="font-medium text-yellow-800">Payment Canceled</p>
            <p className="text-sm text-yellow-600">You canceled the payment. You can complete your purchase anytime.</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" asChild>
            <Link to="/cart">Complete Purchase</Link>
          </Button>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/quizzes/templates">Take a Quiz</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalQuizzes}</div>
                <div className="text-sm text-muted-foreground">Quizzes Taken</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.totalCorrect}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats.totalQuestions > 0
                    ? ((stats.totalCorrect / stats.totalQuestions) * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="text-sm text-muted-foreground">Overall Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attempts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentAttempts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No quizzes taken yet. Start practicing today!
              </p>
            ) : (
              <div className="space-y-4">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.attemptId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{attempt.quizTemplateName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(attempt.attemptedAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${attempt.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                        {attempt.percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {attempt.correctAnswers}/{attempt.totalQuestions} correct
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Topic Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisLoading || !analysis || analysis.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Take more quizzes to see your topic-wise performance
              </p>
            ) : (
              <div className="space-y-4">
                {analysis.map((category) => (
                  <div key={category.categoryId}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{category.categoryName}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.accuracy.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={category.accuracy} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-1">
                      {category.totalAttempts} attempt{category.totalAttempts !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
