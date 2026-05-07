import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './protected-route'
import { MainLayout } from '@/components/layout/MainLayout'

const HomePage = lazy(() => import('@/pages/HomePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const QuizTemplatesPage = lazy(() => import('@/pages/QuizTemplatesPage'))
const QuizTemplatesListPage = lazy(() => import('@/pages/QuizTemplatesListPage'))
const QuizConfigurePage = lazy(() => import('@/pages/QuizConfigurePage'))
const CustomQuizPage = lazy(() => import('@/pages/CustomQuizPage'))
const UserTemplatesPage = lazy(() => import('@/pages/UserTemplatesPage'))
const CreateTemplatePage = lazy(() => import('@/pages/admin/CreateTemplatePage'))
const UserCreateTemplatePage = lazy(() => import('@/pages/UserCreateTemplatePage'))
const TopicsPage = lazy(() => import('@/pages/TopicsPage'))
const QuizAttemptPage = lazy(() => import('@/pages/QuizAttemptPage'))
const QuizResultsPage = lazy(() => import('@/pages/QuizResultsPage'))
const QuestionSetsPage = lazy(() => import('@/pages/QuestionSetsPage'))
const LibraryPage = lazy(() => import('@/pages/LibraryPage'))
const PlansPage = lazy(() => import('@/pages/PlansPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'))
const PaymentCallbackPage = lazy(() => import('@/pages/PaymentCallbackPage'))
const OAuth2CallbackPage = lazy(() => import('@/pages/OAuth2CallbackPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'quizzes/templates',
        element: (
          <Suspense fallback={<PageLoader />}>
            <QuizTemplatesPage />
          </Suspense>
        ),
      },
      {
        path: 'quizzes/templates/list',
        element: (
          <Suspense fallback={<PageLoader />}>
            <QuizTemplatesListPage />
          </Suspense>
        ),
      },
      {
        path: 'quizzes/configure/:templateId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <QuizConfigurePage />
          </Suspense>
        ),
      },
      {
        path: 'quizzes/custom',
        element: (
          <Suspense fallback={<PageLoader />}>
            <CustomQuizPage />
          </Suspense>
        ),
      },
      {
        path: 'my-templates',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <UserTemplatesPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/templates/create',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CreateTemplatePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'templates/create',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <UserCreateTemplatePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'topics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <TopicsPage />
          </Suspense>
        ),
      },
      {
        path: 'quizzes/sets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <QuestionSetsPage />
          </Suspense>
        ),
      },
      {
        path: 'quizzes/attempt/:attemptId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <QuizAttemptPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'quizzes/results/:attemptId',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <QuizResultsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CartPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <CheckoutPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'library',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <LibraryPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'plans',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PlansPage />
          </Suspense>
        ),
      },
      {
        path: 'unauthorized',
        element: (
          <Suspense fallback={<PageLoader />}>
            <UnauthorizedPage />
          </Suspense>
        ),
      },
      {
        path: 'payment-callback',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PaymentCallbackPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/oauth2/callback',
    element: (
      <Suspense fallback={<PageLoader />}>
        <OAuth2CallbackPage />
      </Suspense>
    ),
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
