import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeleteUserTemplate, useUserTemplates } from '@/features/quiz/hooks/useQuiz'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Loader2, Search, Play, Trash2, ArrowLeft, Plus, FileText, Clock } from 'lucide-react'
import { useToast } from '@/hooks/useToast'

export default function UserTemplatesPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null)

  // Fetch user's templates using dedicated endpoint
  const { data: templatesResponse, isLoading } = useUserTemplates()

  // Extract templates from paginated response
  const templates = templatesResponse?.content || []

  const deleteTemplate = useDeleteUserTemplate()

  const filteredTemplates = templates?.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate.mutateAsync(templateId)
      setTemplateToDelete(null)
    } catch {
      // Error handled by mutation
    }
  }

  const handleStartQuiz = (templateId: string) => {
    navigate(`/quizzes/configure/${templateId}`)
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

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage your quiz templates and track their performance
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button asChild>
            <Link to="/templates/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Link>
          </Button>
        </div>
      </div>

      <Button variant="ghost" className="mb-4" onClick={() => navigate('/quizzes/templates')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to All Templates
      </Button>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No Templates Found' : 'No Templates Created'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Try a different search term' 
              : 'Start by creating your first quiz template.'
            }
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link to="/templates/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.templateId} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant={template.type === 'PRACTICE' ? 'secondary' : 'default'}>
                    {template.type}
                  </Badge>
                  <Badge variant="outline">{template.status}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {template.config?.totalQuestions} Questions
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {template.config?.durationMinutes} min
                  </div>
                </div>
                {template.entranceType?.entranceName && (
                  <Badge variant="outline" className="mb-2">{template.entranceType.entranceName}</Badge>
                )}
              </CardContent>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleStartQuiz(template.templateId)} className="flex-1">
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTemplateToDelete(template.templateId)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this template? This action cannot be undone.
              The template will be removed from your active templates but any existing quiz attempts will remain.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Archive Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
