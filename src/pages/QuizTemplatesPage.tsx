import { useNavigate, Link } from 'react-router-dom'
import { useQuizTemplates } from '@/features/quiz/hooks/useQuiz'
import { useMyQuizPurchases } from '@/features/purchases/hooks/usePurchases'
import { QuizCard } from '@/features/quiz/components/QuizCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useMemo } from 'react'
import { useCartStore } from '@/features/cart/stores/cartStore'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { Loader2, Search, Plus, Settings, FileText } from 'lucide-react'

export default function QuizTemplatesPage() {
  const navigate = useNavigate()
  const { data: response, isLoading } = useQuizTemplates()
  const { data: purchases } = useMyQuizPurchases()
  const { addItem } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')

  // Check if user is admin
  const isAdmin = user?.roles?.includes('ADMIN') ?? false

  // Handle both array and paginated responses
  const templates = Array.isArray(response) ? response : response?.content || []

  // Get purchased template IDs
  const purchasedTemplateIds = useMemo(() => {
    if (!purchases) return new Set()
    return new Set(purchases.map((purchase: any) => purchase.quizId))
  }, [purchases])

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartQuiz = (templateId: string) => {
    navigate(`/quizzes/configure/${templateId}`)
  }

  const handleCreateCustom = () => {
    navigate('/quizzes/custom')
  }

  const handleAddToCart = (templateId: string) => {
    const template = templates.find((t) => t.templateId === templateId)
    if (template) {
      addItem({
        id: `template-${templateId}`,
        type: 'QUIZ_TEMPLATE',
        name: template.name,
        price: template.entryFee,
        metadata: { templateId },
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quiz Templates</h1>
          <p className="text-muted-foreground mt-1">
            Choose from our curated collection of practice and competitive quizzes
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {isAuthenticated && (
            <Button asChild>
              <Link to="/templates/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Link>
            </Button>
          )}
          <Button variant="outline" onClick={handleCreateCustom}>
            <Plus className="h-4 w-4 mr-2" />
            Custom
          </Button>
          {isAuthenticated && (
            <Button variant="outline" asChild>
              <Link to="/my-templates">
                <FileText className="h-4 w-4 mr-2" />
                My Templates
              </Link>
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">No quizzes found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <QuizCard
              key={template.templateId}
              quiz={template}
              onStart={handleStartQuiz}
              onAddToCart={handleAddToCart}
              isPurchased={purchasedTemplateIds.has(template.templateId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
