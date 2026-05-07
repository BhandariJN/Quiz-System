import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTopicsByEntranceType } from '@/features/topics/hooks/useTopics'
import { useEntranceTypes } from '@/features/entrance-types/hooks/useEntranceTypes'
import { useGenerateCustomQuiz, useGenerateCustomQuizForEntrance } from '@/features/quiz/hooks/useQuiz'
import { useToast } from '@/hooks/useToast'
import { useActiveQuizStore } from '@/features/quiz/stores/activeQuizStore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertTriangle, Play, ArrowLeft, Plus, Trash2, Info } from 'lucide-react'
import type { TopicDistribution, QuizConfigDTO } from '@/features/quiz/types/quiz.types'
import type { Topic } from '@/features/topics/types/topic.types'

const MAX_QUESTIONS = 200
const MIN_QUESTIONS = 1
const MAX_DURATION = 700 // 16  hours in minutes
const MIN_DURATION = 1

export default function CustomQuizPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  // Form state
  const [totalQuestions, setTotalQuestions] = useState(20)
  const [totalMarks, setTotalMarks] = useState(20)
  const [durationMinutes, setDurationMinutes] = useState(30)
  const [selectedEntranceSlug, setSelectedEntranceSlug] = useState<string | null>(null)
  const [topicDistributions, setTopicDistributions] = useState<TopicDistribution[]>([])
  const [difficultyDistribution, setDifficultyDistribution] = useState<Record<string, number>>({
    EASY: 30,
    MODERATE: 50,
    HARD: 20,
  })
  const [enableNegativeMarking, setEnableNegativeMarking] = useState(false)
  const [negativeMarkValue, setNegativeMarkValue] = useState(0.25)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Queries
  const { data: entranceTopics, isLoading: topicsLoading } = useTopicsByEntranceType(selectedEntranceSlug ?? '')
  const { data: entranceTypes, isLoading: entranceTypesLoading } = useEntranceTypes()
  const generateCustom = useGenerateCustomQuiz()
  const generateCustomForEntrance = useGenerateCustomQuizForEntrance()
  const startQuiz = useActiveQuizStore((state) => state.startQuiz)

  // Clear selected topics when entrance type changes
  useEffect(() => {
    setTopicDistributions([])
    setExpandedCategories(new Set())
  }, [selectedEntranceSlug])

  // Flatten all topics for selection
  const allTopics = useMemo(() => {
    if (!entranceTopics) return []
    return entranceTopics.filter((topic): topic is Topic & { topicId: string } => !!(topic as Topic)?.topicId)
  }, [entranceTopics])

  // Group topics by category
  const topicsByCategory = useMemo(() => {
    if (!entranceTopics) return []
    const grouped: Record<string, Topic[]> = {}
    entranceTopics.forEach((topic) => {
      const category = topic.categoryName || 'Uncategorized'
      if (!grouped[category]) grouped[category] = []
      grouped[category].push(topic)
    })
    return Object.entries(grouped).map(([categoryName, topics]) => ({
      categoryName,
      topics,
      topicCount: topics.length,
    }))
  }, [entranceTopics])

  // Get selected topics info
  const selectedTopics = useMemo(() => {
    return topicDistributions.map((td) => {
      const topic = allTopics.find((t) => t.topicId === td.topicId)
      return { ...td, topicName: topic?.topicName || td.topicName || 'Unknown' }
    })
  }, [topicDistributions, allTopics])

  // Calculate remaining questions
  const allocatedQuestions = topicDistributions.reduce((sum, td) => sum + td.count, 0)
  const remainingQuestions = totalQuestions - allocatedQuestions

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName)
    } else {
      newExpanded.add(categoryName)
    }
    setExpandedCategories(newExpanded)
  }

  // Add topic to distribution
  const addTopic = (topicId: string, topicName: string) => {
    if (topicDistributions.some((td) => td.topicId === topicId)) return
    if (remainingQuestions <= 0) return

    setTopicDistributions((prev) => [
      ...prev,
      { topicId, topicName, count: Math.min(5, remainingQuestions), weightage: 0 },
    ])
  }

  // Remove topic from distribution
  const removeTopic = (topicId: string) => {
    setTopicDistributions((prev) => prev.filter((td) => td.topicId !== topicId))
  }

  // Update topic count
  const updateTopicCount = (topicId: string, count: number) => {
    setTopicDistributions((prev) =>
      prev.map((td) => (td.topicId === topicId ? { ...td, count: Math.max(1, count) } : td))
    )
  }

  // Update difficulty distribution
  const updateDifficulty = (key: string, value: number) => {
    setDifficultyDistribution((prev) => ({ ...prev, [key]: value }))
  }

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    // Validation: entrance type must be selected
    if (!selectedEntranceSlug) {
      toast({
        title: 'Entrance Type Required',
        description: 'Please select an entrance type.',
        variant: 'destructive',
      })
      return
    }

    // Validation: topics must be specified
    if (topicDistributions.length === 0) {
      toast({
        title: 'Topics Required',
        description: 'Please select at least one topic.',
        variant: 'destructive',
      })
      return
    }

    const config: QuizConfigDTO = {
      totalQuestions,
      totalMarks,
      durationMinutes,
      topicDistribution: topicDistributions.length > 0 ? topicDistributions : undefined,
      difficultyDistribution,
      enableNegativeMarking,
      negativeMarkValue: enableNegativeMarking ? negativeMarkValue : 0,
    }

    try {
      const snapshot = await generateCustomForEntrance.mutateAsync({
        entranceSlug: selectedEntranceSlug,
        config,
      })
      startQuiz(snapshot.attemptId, snapshot, snapshot.durationInMinutes)
      navigate(`/quizzes/attempt/${snapshot.attemptId}`)
    } catch {
      // Error handled by mutation
    }
  }

  const isLoading = topicsLoading || entranceTypesLoading
  const isGenerating = generateCustom.isPending || generateCustomForEntrance.isPending
  const isValid = totalQuestions >= MIN_QUESTIONS && durationMinutes >= MIN_DURATION

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
    <div className="container py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate('/quizzes/templates')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Templates
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Custom Practice Quiz</CardTitle>
          <p className="text-muted-foreground">
            Configure your own practice quiz by selecting topics and settings
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Basic Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Basic Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalQuestions">Total Questions (max {MAX_QUESTIONS})</Label>
                <Input
                  id="totalQuestions"
                  type="number"
                  min={MIN_QUESTIONS}
                  max={MAX_QUESTIONS}
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, Number(e.target.value))))}
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
                  onChange={(e) => setDurationMinutes(Math.min(MAX_DURATION, Math.max(MIN_DURATION, Number(e.target.value))))}
                />
              </div>
            </div>
          </div>

          {/* Entrance Type Filter */}
          <div className="space-y-2">
            <Label>Select Entrance Type *</Label>
            <Select
              value={selectedEntranceSlug || ''}
              onValueChange={(value) => setSelectedEntranceSlug(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an entrance type" />
              </SelectTrigger>
              <SelectContent>
                {entranceTypes?.map((entrance) => (
                  <SelectItem key={entrance.entranceTypeId} value={entrance.slug}>
                    {entrance.entranceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Topic Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Topic Distribution</h3>
              <div className="text-sm text-muted-foreground">
                Allocated: {allocatedQuestions} / {totalQuestions}
                {remainingQuestions > 0 && (
                  <span className="text-amber-600 ml-2">({remainingQuestions} remaining)</span>
                )}
              </div>
            </div>

            {remainingQuestions < 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You have allocated {Math.abs(remainingQuestions)} more questions than the total. Please reduce topic counts.
                </AlertDescription>
              </Alert>
            )}

            {/* Selected Topics */}
            {selectedTopics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Selected Topics</h4>
                <div className="space-y-2">
                  {selectedTopics.filter((topic): topic is (typeof topic & { topicId: string }) => !!topic?.topicId).map((topic) => (
                    <div key={topic.topicId} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{topic.topicName || 'Unknown'}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Questions:</Label>
                        <Input
                          type="number"
                          min={1}
                          max={totalQuestions}
                          value={topic.count}
                          onChange={(e) => updateTopicCount(topic.topicId, Number(e.target.value))}
                          className="w-20 h-8"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeTopic(topic.topicId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Available Topics by Category */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Available Topics</h4>
              
              {!selectedEntranceSlug ? (
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                  <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Please select an entrance type to see available topics</p>
                </div>
              ) : topicsLoading ? (
                <div className="border rounded-lg p-8 text-center">
                  <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin" />
                  <p className="text-muted-foreground">Loading topics...</p>
                </div>
              ) : topicsByCategory.length === 0 ? (
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No topics available for this entrance type</p>
                </div>
              ) : (
                <div className="border rounded-lg divide-y">
                  {topicsByCategory.map((category) => (
                    <div key={category.categoryName}>
                      <button
                        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        onClick={() => toggleCategory(category.categoryName)}
                      >
                        <span className="font-medium">{category.categoryName}</span>
                        <Badge variant="outline">{category.topicCount} topics</Badge>
                      </button>
                      {expandedCategories.has(category.categoryName) && (
                        <div className="p-3 space-y-2 bg-muted/30">
                          {category.topics.filter((t): t is Topic & { topicId: string } => !!(t as Topic)?.topicId).map((topic, idx) => {
                            const isSelected = topicDistributions.some((td) => td.topicId === topic.topicId)
                            return (
                              <div
                                key={topic.topicId || `topic-${idx}`}
                                className="flex items-center justify-between p-2 bg-background rounded"
                              >
                                <span className="text-sm">{topic.topicName || 'Unnamed Topic'}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  disabled={isSelected || remainingQuestions <= 0}
                                  onClick={() => topic.topicId && addTopic(topic.topicId, topic.topicName || 'Unknown')}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  {isSelected ? 'Added' : 'Add'}
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
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

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Custom practice quizzes are generated based on your topic selection and difficulty preferences.
              Questions are randomly selected from the available question pool.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            className="w-full sm:w-auto"
            size="lg"
            onClick={handleGenerateQuiz}
            disabled={isGenerating || !isValid || remainingQuestions < 0}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating Quiz...' : 'Generate & Start Quiz'}
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" size="lg" onClick={() => navigate('/quizzes/templates')}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
