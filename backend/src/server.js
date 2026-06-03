const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// VidSrc configuration
const VIDSRC_BASE = 'https://vidsrc.me/embed';

// ============ API Routes ============

/**
 * GET /api/player/movie/:id
 * Get VidSrc player URL for a movie
 */
app.get('/api/player/movie/:id', (req, res) => {
  const { id } = req.params;
  // VidSrc URL format - note: VidSrc uses TMDB IDs directly
  const playerUrl = `${VIDSRC_BASE}/movie/${id}`;
  
  res.json({
    success: true,
    url: playerUrl,
    type: 'movie',
    id: parseInt(id),
  });
});

/**
 * GET /api/player/tv/:id/:season/:episode
 * Get VidSrc player URL for a TV show episode
 */
app.get('/api/player/tv/:id/:season/:episode', (req, res) => {
  const { id, season, episode } = req.params;
  const playerUrl = `${VIDSRC_BASE}/tv/${id}/${season}/${episode}`;
  
  res.json({
    success: true,
    url: playerUrl,
    type: 'tv',
    id: parseInt(id),
    season: parseInt(season),
    episode: parseInt(episode),
  });
});

/**
 * GET /api/player/tv/:id
 * Get VidSrc player URL for TV show (default to S1E1)
 */
app.get('/api/player/tv/:id', (req, res) => {
  const { id } = req.params;
  const playerUrl = `${VIDSRC_BASE}/tv/${id}/1/1`;
  
  res.json({
    success: true,
    url: playerUrl,
    type: 'tv',
    id: parseInt(id),
    season: 1,
    episode: 1,
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ NoGate Backend listening on http://localhost:${PORT}`);
  console.log(`📺 VidSrc player URLs served from: ${VIDSRC_BASE}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});
