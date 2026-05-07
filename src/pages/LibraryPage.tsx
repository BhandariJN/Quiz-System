import { useMyQuizPurchases } from '@/features/purchases/hooks/usePurchases'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Download, CheckCircle, Loader2, Clock, FileQuestion } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function LibraryPage() {
  const { data: purchasesResponse, isLoading } = useMyQuizPurchases()

  // Handle both array and paginated responses
  const purchases = Array.isArray(purchasesResponse) ? purchasesResponse : purchasesResponse?.content || []

  if (isLoading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">My Library</h1>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">My Library</h1>
      <p className="text-muted-foreground mb-8">
        Access your purchased question sets and study materials
      </p>

      {purchases.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Purchased Items</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            You haven't purchased any question sets yet. Browse our collection to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {purchases.map((purchase) => (
            <Card key={purchase.purchaseId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <Badge variant="secondary">{purchase.purchaseStatus}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{purchase.quizName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <FileQuestion className="h-4 w-4" />
                    {purchase.nosOfQuestions} Questions
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {purchase.durationInMinutes} min
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Purchased on {formatDate(purchase.purchaseDate)}
                </div>
                {purchase.courseName && (
                  <Badge variant="outline" className="mb-4">{purchase.courseName}</Badge>
                )}
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
