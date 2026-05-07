import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCreateQuizTemplates } from '@/features/quiz/hooks/useQuizTemplates'
import { useEntranceTypes } from '@/features/entrance-types/hooks/useEntranceTypes'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, Loader2, Plus, Save } from 'lucide-react'
import { QuizTemplateType, QuizTemplateStatus } from '@/features/quiz/types/quiz-template.types'
import { useToast } from '@/hooks/useToast'

const MAX_QUESTIONS = 200
const MIN_QUESTIONS = 1
const MAX_DURATION = 700
const MIN_DURATION = 1

export default function CreateTemplatePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createTemplate = useCreateQuizTemplates()
  const { data: entranceTypes, isLoading: entranceTypesLoading } = useEntranceTypes()

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<QuizTemplateType>('PRACTICE')
  const [status, setStatus] = useState<QuizTemplateStatus>('DRAFT')
  const [entryFee, setEntryFee] = useState(0)
  const [selectedEntranceSlug, setSelectedEntranceSlug] = useState<string>('')
  const [totalQuestions, setTotalQuestions] = useState(20)
  const [totalMarks, setTotalMarks] = useState(20)
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [enableNegativeMarking, setEnableNegativeMarking] = useState(false)
  const [negativeMarkValue, setNegativeMarkValue] = useState(0.25)
  const [difficultyDistribution, setDifficultyDistribution] = useState<Record<string, number>>({
    EASY: 30,
    MODERATE: 50,
    HARD: 20,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter a template name.',
        variant: 'destructive',
      })
      return
    }

    const templateRequest = {
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      entryFee,
      status,
      entranceTypeId: selectedEntranceSlug
        ? entranceTypes?.find((e) => e.slug === selectedEntranceSlug)?.entranceTypeId
        : undefined,
      config: {
        totalQuestions,
        totalMarks,
        durationMinutes,
        difficultyDistribution,
        enableNegativeMarking,
        negativeMarkValue: enableNegativeMarking ? negativeMarkValue : 0,
      },
    }

    try {
      await createTemplate.mutateAsync([templateRequest])
      navigate('/quizzes/templates')
    } catch {
      // Error handled by mutation
    }
  }

  const updateDifficulty = (key: string, value: number) => {
    setDifficultyDistribution((prev) => ({ ...prev, [key]: value }))
  }

  const isLoading = createTemplate.isPending || entranceTypesLoading

  return (
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/quizzes/templates')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </Button>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Quiz Template</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter template name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter template description"
                  rows={3}
                />
              </div>
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as QuizTemplateType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRACTICE">Practice</SelectItem>
                    <SelectItem value="COMPETITIVE">Competitive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as QuizTemplateStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entryFee">Entry Fee ($)</Label>
                <Input
                  id="entryFee"
                  type="number"
                  min={0}
                  value={entryFee}
                  onChange={(e) => setEntryFee(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Entrance Type */}
            <div className="space-y-2">
              <Label>Entrance Type (Optional)</Label>
              <Select value={selectedEntranceSlug} onValueChange={setSelectedEntranceSlug}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an entrance type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Global)</SelectItem>
                  {entranceTypes?.map((entrance) => (
                    <SelectItem key={entrance.entranceTypeId} value={entrance.slug}>
                      {entrance.entranceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quiz Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quiz Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalQuestions">Total Questions</Label>
                  <Input
                    id="totalQuestions"
                    type="number"
                    min={MIN_QUESTIONS}
                    max={MAX_QUESTIONS}
                    value={totalQuestions}
                    onChange={(e) =>
                      setTotalQuestions(
                        Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, Number(e.target.value)))
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalMarks">Total Marks</Label>
                  <Input
                    id="totalMarks"
                    type="number"
                    min={1}
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Math.max(1, Number(e.target.value)))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={MIN_DURATION}
                    max={MAX_DURATION}
                    value={durationMinutes}
                    onChange={(e) =>
                      setDurationMinutes(
                        Math.min(MAX_DURATION, Math.max(MIN_DURATION, Number(e.target.value)))
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="space-y-4">
              <h3 className="font-semibold">Difficulty Distribution</h3>
              <div className="space-y-4">
                {Object.entries(difficultyDistribution).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <Label>{key}</Label>
                      <span className="text-sm text-muted-foreground">{value}%</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([v]) => updateDifficulty(key, v)}
                      max={100}
                      step={5}
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Total: {Object.values(difficultyDistribution).reduce((a, b) => a + b, 0)}%
                {Object.values(difficultyDistribution).reduce((a, b) => a + b, 0) !== 100 && (
                  <span className="text-amber-600 ml-2">(Should total 100%)</span>
                )}
              </div>
            </div>

            {/* Negative Marking */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="negativeMarking"
                  checked={enableNegativeMarking}
                  onCheckedChange={(checked) => setEnableNegativeMarking(checked === true)}
                />
                <Label htmlFor="negativeMarking">Enable Negative Marking</Label>
              </div>
              {enableNegativeMarking && (
                <div className="pl-6 space-y-2">
                  <Label>Negative Mark Value</Label>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.25}
                    value={negativeMarkValue}
                    onChange={(e) => setNegativeMarkValue(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Creating...' : 'Create Template'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              size="lg"
              onClick={() => navigate('/quizzes/templates')}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
