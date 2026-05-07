import { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuestionSets } from '@/features/question-sets/hooks/useQuestionSets'
import { useMyQuizPurchases } from '@/features/purchases/hooks/usePurchases'
import { useCartStore } from '@/features/cart/stores/cartStore'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, ShoppingCart, CheckCircle, ExternalLink } from 'lucide-react'
import { Loader2 } from 'lucide-react'

export default function QuestionSetsPage() {
  const navigate = useNavigate()
  const { data: response, isLoading } = useQuestionSets()
  const { data: purchasesResponse } = useMyQuizPurchases()
  const { addItem } = useCartStore()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle both array and paginated responses
  const questionSets = Array.isArray(response) ? response : response?.content || []
  
  // Get purchased quiz IDs from purchases API
  const purchases = Array.isArray(purchasesResponse) ? purchasesResponse : purchasesResponse?.content || []
  const purchasedIds = useMemo(() => new Set(purchases.map((p) => p.quizId)), [purchases])

  const filteredSets = questionSets.filter((set) =>
    set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    set.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddToCart = (set: typeof questionSets extends (infer U)[] ? U : never) => {
    addItem({
      id: `question-set-${set.id}`,
      type: 'QUESTION_SET',
      name: set.name,
      price: set.price,
      metadata: { questionSetId: set.id },
    })
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Question Sets</h1>
          <p className="text-muted-foreground mt-1">
            Purchase premium question sets for offline practice
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search question sets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredSets.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No question sets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSets.map((set) => (
            <Card key={set.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <span className="text-lg font-bold">${set.price}</span>
                </div>
                <CardTitle className="text-lg mt-2">{set.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{set.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{set.totalQuestions} Questions</Badge>
                  <Badge variant="outline">{set.difficulty}</Badge>
                </div>
                {set.topics && set.topics.length > 0 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Topics: {set.topics.slice(0, 3).join(', ')}
                    {set.topics.length > 3 && ` +${set.topics.length - 3} more`}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {isAuthenticated && purchasedIds.has(set.id) ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    asChild
                  >
                    <Link to="/library">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                      In Library
                      <ExternalLink className="h-3 w-3 ml-2" />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(set)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
