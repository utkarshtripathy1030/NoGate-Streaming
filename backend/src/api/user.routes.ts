/**
 * User API Routes - Placeholder for future implementation
 *
 * Routes:
 * GET /users/profile - Get user profile
 * PUT /users/profile - Update user profile
 * GET /users/preferences - Get user preferences
 * PUT /users/preferences - Update user preferences
 * DELETE /users/account - Delete user account
 * GET /users/watch-history - Get watch history
 * POST /users/watch-history - Add to watch history
 * GET /users/my-list - Get user's saved list
 * POST /users/my-list - Add to my list
 * DELETE /users/my-list/:mediaId - Remove from my list
 */

export const userRoutes = {
  getProfile: 'GET /api/users/profile',
  updateProfile: 'PUT /api/users/profile',
  getPreferences: 'GET /api/users/preferences',
  updatePreferences: 'PUT /api/users/preferences',
  deleteAccount: 'DELETE /api/users/account',
  getWatchHistory: 'GET /api/users/watch-history',
  addWatchHistory: 'POST /api/users/watch-history',
  getMyList: 'GET /api/users/my-list',
  addToMyList: 'POST /api/users/my-list',
  removeFromMyList: 'DELETE /api/users/my-list/:mediaId',
};

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: string;
  subtitle: string;
  quality: 'SD' | 'HD' | '4K';
  autoplay: boolean;
  notifications: boolean;
}

export interface WatchHistoryEntry {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  watchedAt: string;
  progress?: number;
}

export interface MyListItem {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  addedAt: string;
}
