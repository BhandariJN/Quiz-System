import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { BookOpen, Award, Clock, Users } from 'lucide-react'
import { useAuthStore } from '@/features/auth/stores/authStore'

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()

  const features = [
    {
      icon: BookOpen,
      title: 'Practice Quizzes',
      description: 'Access thousands of practice questions across multiple subjects',
    },
    {
      icon: Award,
      title: 'Competitive Exams',
      description: 'Simulate real entrance exams with timed competitive quizzes',
    },
    {
      icon: Clock,
      title: 'Track Progress',
      description: 'Monitor your performance and improvement over time',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join thousands of students preparing for their future',
    },
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Master Your <span className="text-primary">Entrance Exams</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Practice with realistic quizzes, track your progress, and achieve your goals.
            Join thousands of successful students today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link to="/quizzes/templates">Start Practicing</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/quizzes/templates">Browse Quizzes</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardHeader className="pb-2">
                <feature.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="font-semibold text-lg">{feature.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already preparing for their future success.
            Get access to premium quizzes and personalized analytics.
          </p>
          {!isAuthenticated && (
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}
