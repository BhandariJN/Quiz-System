import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ShieldAlert, LogIn } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="container flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <ShieldAlert className="h-16 w-16 mx-auto text-red-500" />
        <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          You don't have permission to access this page. Please sign in or contact support if you believe this is an error.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
