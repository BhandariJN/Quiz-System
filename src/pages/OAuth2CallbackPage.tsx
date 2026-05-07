import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/stores/authStore'
import { useToast } from '@/hooks/useToast'
import { parseOAuth2Callback, getOAuth2LoginUrl } from '@/features/auth/utils/oauth2'
import { Loader2 } from 'lucide-react'

export default function OAuth2CallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    const result = parseOAuth2Callback(searchParams)

    if (result.success) {
      // Construct user object from OAuth2 response
      const user = {
        userId: result.userId!,
        email: '', // Will be populated by getCurrentUser
        fullname: '',
        roles: ['USER'],
      }

      // Store auth tokens
      setAuth(user, result.token!, result.refreshToken!)

      toast({
        title: 'Welcome!',
        description: 'Successfully signed in with Google',
      })

      // Redirect to dashboard
      navigate('/dashboard')
    } else {
      toast({
        title: 'Authentication failed',
        description: result.error || 'Could not sign in with Google',
        variant: 'destructive',
      })

      // Redirect to login page
      navigate('/login')
    }
  }, [searchParams, navigate, setAuth, toast])

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  )
}
