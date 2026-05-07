export interface User {
  userId: number
  email: string
  fullname: string
  roles: string[]
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  fullname: string
  confirmPassword: string
}

export interface AuthResponse {
  userId: number
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

export interface PasswordResetRequest {
  email: string
}
