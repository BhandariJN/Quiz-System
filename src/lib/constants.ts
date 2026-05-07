export const APP_NAME = 'Entrance Gateway'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  QUIZZES: {
    TEMPLATES: '/quizzes/templates',
    SETS: '/quizzes/sets',
    ATTEMPT: '/quizzes/attempt/:attemptId',
    RESULTS: '/quizzes/results/:attemptId',
    HISTORY: '/quizzes/history',
  },
  CART: '/cart',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  UNAUTHORIZED: '/unauthorized',
} as const

export const QUIZ_CONFIG = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 200,
  MIN_DURATION: 5,
  MAX_DURATION: 180,
  WARNING_THRESHOLD_MINUTES: [5, 1],
} as const

export const STORAGE_KEYS = {
  TOKEN: import.meta.env.VITE_JWT_STORAGE_KEY || 'entrance_gateway_token',
  REFRESH_TOKEN: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || 'entrance_gateway_refresh_token',
} as const
