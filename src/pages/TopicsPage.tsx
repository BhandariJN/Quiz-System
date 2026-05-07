import { useState } from 'react'
import { useTopicsWithSubjects, useSearchTopics } from '@/features/topics/hooks/useTopics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, Loader2, ChevronRight } from 'lucide-react'

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: subjectsData, isLoading: subjectsLoading } = useTopicsWithSubjects()
  const { data: searchResults, isLoading: searchLoading } = useSearchTopics(searchQuery)

  const subjects = Array.isArray(subjectsData) ? subjectsData : subjectsData?.content || []
  const searchTopics = Array.isArray(searchResults) ? searchResults : searchResults?.content || []

  const isLoading = subjectsLoading || (searchQuery && searchLoading)

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
          <h1 className="text-3xl font-bold">Topics</h1>
          <p className="text-muted-foreground mt-1">
            Browse topics organized by subjects for targeted practice
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {searchQuery && searchTopics.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchTopics.map((topic) => (
              <Card key={topic.topicId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">{topic.topicName}</h3>
                      {topic.categoryName && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {topic.categoryName}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {topic.questionCount} questions
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : searchQuery ? (
        <div className="text-center py-20">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Topics Found</h3>
          <p className="text-muted-foreground">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {subjects.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Topics Available</h3>
              <p className="text-muted-foreground">
                Topics will appear here once they are added by administrators.
              </p>
            </div>
          ) : (
            subjects.map((subject) => (
              <Card key={subject.subjectId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{subject.subjectName}</CardTitle>
                    <Badge variant="secondary">{subject.topicCount} topics</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subject.topics.map((topic) => (
                      <div
                        key={topic.topicId}
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{topic.topicName}</p>
                          <p className="text-xs text-muted-foreground">
                            {topic.questionCount} questions
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
