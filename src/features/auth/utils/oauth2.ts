/**
 * OAuth2 utility functions for handling Google OAuth2 authentication
 * Backend: Spring Boot 3.5.6 with Spring Security 6.x
 */

const OAUTH2_BACKEND_URL = import.meta.env.VITE_OAUTH2_BACKEND_URL || 'https://api.entrancegateway.com'

/**
 * Get the OAuth2 login URL for Google
 * Backend endpoint: GET /oauth2/authorization/google
 */
export function getOAuth2LoginUrl(): string {
  return `${OAUTH2_BACKEND_URL}/oauth2/authorization/google`
}

/**
 * OAuth2 callback result type
 */
export interface OAuth2CallbackResult {
  success: boolean
  token?: string
  refreshToken?: string
  expiresIn?: number
  userId?: number
  error?: string
}

/**
 * Parse OAuth2 callback URL parameters
 * Success pattern: ?token={jwt}&refreshToken={uuid}&expiresIn={seconds}&userId={id}
 * Error pattern: ?error={message}
 */
export function parseOAuth2Callback(searchParams: URLSearchParams): OAuth2CallbackResult {
  // Check for error first
  const error = searchParams.get('error')
  if (error) {
    return {
      success: false,
      error: decodeURIComponent(error),
    }
  }

  // Extract token parameters
  const token = searchParams.get('token')
  const refreshToken = searchParams.get('refreshToken')
  const expiresInParam = searchParams.get('expiresIn')
  const userIdParam = searchParams.get('userId')

  // Validate required parameters
  if (!token || !refreshToken || !userIdParam) {
    return {
      success: false,
      error: 'Invalid OAuth2 callback: missing required parameters',
    }
  }

  return {
    success: true,
    token,
    refreshToken,
    expiresIn: expiresInParam ? parseInt(expiresInParam, 10) : undefined,
    userId: parseInt(userIdParam, 10),
  }
}

/**
 * Initiate Google OAuth2 login by redirecting to backend
 */
export function initiateGoogleOAuth2(): void {
  window.location.href = getOAuth2LoginUrl()
}

/**
 * Common OAuth2 error messages from backend
 */
export const OAUTH2_ERRORS = {
  EMAIL_REGISTERED_WITH_DIFFERENT_PROVIDER: 'Email registered with different provider',
  DEFAULT_ROLE_NOT_FOUND: 'Default USER role not found',
  UNSUPPORTED_PROVIDER: 'Unsupported OAuth provider',
} as const
