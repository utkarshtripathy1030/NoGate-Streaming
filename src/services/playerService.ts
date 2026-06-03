import axios from 'axios';

const BACKEND_BASE = 'http://localhost:3001';

export const playerService = {
  /**
   * Get VidSrc player URL for a movie
   */
  getMoviePlayerUrl: async (movieId: number): Promise<string> => {
    try {
      const response = await axios.get(`${BACKEND_BASE}/api/player/movie/${movieId}`);
      if (response.data.success) {
        return response.data.url;
      }
      throw new Error('Failed to fetch player URL');
    } catch (error) {
      console.error('Error fetching movie player URL:', error);
      throw error;
    }
  },

  /**
   * Get VidSrc player URL for a TV episode
   */
  getTVPlayerUrl: async (tvId: number, season: number, episode: number): Promise<string> => {
    try {
      const response = await axios.get(`${BACKEND_BASE}/api/player/tv/${tvId}/${season}/${episode}`);
      if (response.data.success) {
        return response.data.url;
      }
      throw new Error('Failed to fetch player URL');
    } catch (error) {
      console.error('Error fetching TV player URL:', error);
      throw error;
    }
  },

  /**
   * Get VidSrc player URL for a TV show (defaults to S1E1)
   */
  getTVPlayerUrlDefault: async (tvId: number): Promise<string> => {
    try {
      const response = await axios.get(`${BACKEND_BASE}/api/player/tv/${tvId}`);
      if (response.data.success) {
        return response.data.url;
      }
      throw new Error('Failed to fetch player URL');
    } catch (error) {
      console.error('Error fetching TV player URL:', error);
      throw error;
    }
  },
};
