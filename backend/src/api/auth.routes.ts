/**
 * Auth API Routes - Placeholder for future implementation
 *
 * Routes:
 * POST /auth/register - User registration
 * POST /auth/login - User login
 * POST /auth/logout - User logout
 * POST /auth/refresh - Refresh JWT token
 * POST /auth/forgot-password - Initiate password reset
 * POST /auth/reset-password - Reset password with token
 */

export const authRoutes = {
  register: 'POST /api/auth/register',
  login: 'POST /api/auth/login',
  logout: 'POST /api/auth/logout',
  refresh: 'POST /api/auth/refresh',
  forgotPassword: 'POST /api/auth/forgot-password',
  resetPassword: 'POST /api/auth/reset-password',
};

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}
