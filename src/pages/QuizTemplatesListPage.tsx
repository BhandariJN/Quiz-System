import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePublishedTemplates, useQuizTemplatesByEntranceType } from '@/features/quiz/hooks/useQuizTemplates'
import { useEntranceTypes } from '@/features/entrance-types/hooks/useEntranceTypes'
import { QuizTemplateType } from '@/features/quiz/types/quiz-template.types'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Clock, FileText, Play, Loader2, SlidersHorizontal } from 'lucide-react'

export default function QuizTemplatesListPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<QuizTemplateType | 'ALL'>('ALL')
  const [selectedEntranceSlug, setSelectedEntranceSlug] = useState<string | 'ALL'>('ALL')

  const { data: entranceTypes, isLoading: entranceTypesLoading } = useEntranceTypes()
  const { data: practiceResponse, isLoading: practiceLoading } = usePublishedTemplates('PRACTICE')
  const { data: competitiveResponse, isLoading: competitiveLoading } = usePublishedTemplates('COMPETITIVE')
  const { data: entranceFilteredResponse, isLoading: entranceLoading } = useQuizTemplatesByEntranceType(
    selectedEntranceSlug === 'ALL' ? '' : selectedEntranceSlug,
    { page: 0, size: 50 }
  )

  const practiceTemplates = Array.isArray(practiceResponse) ? practiceResponse : practiceResponse?.content || []
  const competitiveTemplates = Array.isArray(competitiveResponse) ? competitiveResponse : competitiveResponse?.content || []
  const entranceFilteredTemplates = Array.isArray(entranceFilteredResponse)
    ? entranceFilteredResponse
    : entranceFilteredResponse?.content || []

  // When entrance type is selected, use those templates; otherwise use type-based filtering
  const baseTemplates = selectedEntranceSlug !== 'ALL'
    ? entranceFilteredTemplates
    : [...practiceTemplates, ...competitiveTemplates]

  const allTemplates = selectedType === 'ALL'
    ? baseTemplates
    : baseTemplates.filter((t) => t.type === selectedType)

  const filteredTemplates = allTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isLoading = practiceLoading || competitiveLoading || entranceTypesLoading || (selectedEntranceSlug !== 'ALL' && entranceLoading)

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
          <h1 className="text-3xl font-bold">Quiz Templates</h1>
          <p className="text-muted-foreground mt-1">
            Choose from our collection of practice and competitive quizzes
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedEntranceSlug}
            onValueChange={(value) => setSelectedEntranceSlug(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Entrance Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Entrances</SelectItem>
              {entranceTypes?.map((entrance) => (
                <SelectItem key={entrance.entranceTypeId} value={entrance.slug}>
                  {entrance.entranceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedType === 'ALL' ? 'default' : 'outline'}
          onClick={() => setSelectedType('ALL')}
        >
          All
        </Button>
        <Button
          variant={selectedType === 'PRACTICE' ? 'default' : 'outline'}
          onClick={() => setSelectedType('PRACTICE')}
        >
          Practice
        </Button>
        <Button
          variant={selectedType === 'COMPETITIVE' ? 'default' : 'outline'}
          onClick={() => setSelectedType('COMPETITIVE')}
        >
          Competitive
        </Button>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Templates Found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? 'Try a different search term' : 'No quiz templates available at the moment.'}
          </p>
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
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to={`/quizzes/configure/${template.templateId}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Quiz
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
