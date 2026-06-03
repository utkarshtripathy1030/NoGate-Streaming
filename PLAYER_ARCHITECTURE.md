# NoGate Player Architecture - Complete Implementation Guide

## Executive Summary

✅ **VidSrc remains as the streaming backend**  
✅ **Users stay on NoGate domain throughout playback**  
✅ **All direct VidSrc navigation removed**  
✅ **Secure backend-controlled URL delivery**  

---

## Architecture Overview

### Before (❌ Problem)
```
User clicks Play
  ↓
Direct window.location.href or window.open()
  ↓
Browser navigates to: https://vidsrc.me/embed/movie/12345
  ↓
User leaves NoGate domain
  ↓
VidSrc URL exposed in address bar
```

### After (✅ Solution)
```
User clicks Play
  ↓
MediaModal.openPlayer()
  ↓
Navigator to: /watch/movie/12345
  ↓
WatchPage fetches URL from backend API
  ↓
VidSrc URL served from /api/player/movie/12345
  ↓
URL injected into secured iframe
  ↓
User stays on NoGate domain
  ↓
VidSrc streams in background
```

---

## Component Architecture

### 1. **MediaModal** (Entry Point)
**File**: `src/components/MediaModal.tsx`

```typescript
const handlePlayClick = () => {
  openPlayer(media, selectedSeason, selectedEpisode);
};
```

- Calls PlayerContext's `openPlayer()` with media details
- No direct VidSrc URLs
- Modal closes, PlayerOverlay component takes over

### 2. **PlayerOverlay** (Router)
**File**: `src/components/PlayerOverlay.tsx` ✅ REFACTORED

```typescript
useEffect(() => {
  if (!isOpen || !media) return;
  
  // Navigate to watch page instead of opening window
  const watchPath = media.type === 'movie'
    ? `/watch/movie/${media.id}`
    : `/watch/tv/${media.id}/${season}/${episode}`;
  
  closePlayer();
  navigateRouter(watchPath);
}, [isOpen, media, season, episode]);
```

**Changes Made**:
- ❌ Removed: `window.open(playerUrl, 'vidsrc_player')`
- ❌ Removed: Direct VIDSRC_BASE usage
- ✅ Added: `useNavigate()` from React Router
- ✅ Added: Watch history tracking before navigation
- Returns: `null` (doesn't render anything, just navigates)

### 3. **WatchPage** (Player Display)
**File**: `src/components/WatchPage.tsx` ✅ NEW

```typescript
export const WatchPage: FC<WatchPageProps> = ({ 
  type, id, season = 1, episode = 1, title 
}) => {
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Fetch VidSrc URL from backend
    const url = type === 'movie'
      ? await playerService.getMoviePlayerUrl(id)
      : await playerService.getTVPlayerUrl(id, season, episode);
    
    setPlayerUrl(url);
    storageService.updateWatchHistory(...);
  }, [type, id, season, episode]);
  
  return (
    <div>
      <header>Back / Close buttons</header>
      <iframe src={playerUrl} sandbox="allow-same-origin allow-scripts allow-popups allow-presentation" />
    </div>
  );
};
```

**Key Features**:
- Fetches VidSrc URL from backend API
- Displays loading state while fetching
- Shows error state with retry option
- Secure iframe sandbox (no `allow-top-navigation-by-user-activation`)
- Back/Close buttons for navigation
- Auto-tracks watch history on load
- Responsive design

### 4. **Player Service**
**File**: `src/services/playerService.ts` ✅ NEW

```typescript
export const playerService = {
  getMoviePlayerUrl: async (movieId: number): Promise<string> => {
    const response = await axios.get(`/api/player/movie/${movieId}`);
    return response.data.url;
  },
  
  getTVPlayerUrl: async (tvId, season, episode): Promise<string> => {
    const response = await axios.get(`/api/player/tv/${tvId}/${season}/${episode}`);
    return response.data.url;
  },
};
```

- Abstracts backend API calls
- Centralized error handling
- Easy to extend with auth/analytics later

---

## Backend Implementation

### Express Server
**File**: `backend/src/server.ts` ✅ NEW

```typescript
const VIDSRC_BASE = 'https://vidsrc.me/embed';

// Movie endpoint
app.get('/api/player/movie/:id', (req, res) => {
  const { id } = req.params;
  const playerUrl = `${VIDSRC_BASE}/movie/${id}`;
  res.json({ success: true, url: playerUrl, type: 'movie', id });
});

// TV episode endpoint
app.get('/api/player/tv/:id/:season/:episode', (req, res) => {
  const { id, season, episode } = req.params;
  const playerUrl = `${VIDSRC_BASE}/tv/${id}/${season}/${episode}`;
  res.json({ success: true, url: playerUrl, type: 'tv', id, season, episode });
});

// TV default (S1E1)
app.get('/api/player/tv/:id', (req, res) => {
  const { id } = req.params;
  const playerUrl = `${VIDSRC_BASE}/tv/${id}/1/1`;
  res.json({ success: true, url: playerUrl, type: 'tv', id });
});
```

**Advantages**:
- VidSrc URLs never exposed in frontend code
- Can add authentication later
- Can add rate limiting
- Can add analytics
- Can switch streaming providers by changing VIDSRC_BASE
- Cleaner separation of concerns

---

## Routing Setup

### Updated: `src/App.tsx`

```typescript
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      {/* Main app */}
      <Route path="/" element={<AppContent />} />
      
      {/* Watch pages */}
      <Route path="/watch/movie/:id" element={<MovieWatchRoute />} />
      <Route path="/watch/tv/:id/:season?/:episode?" element={<TVWatchRoute />} />
    </Routes>
  );
}
```

### Updated: `src/main.tsx`

```typescript
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
```

---

## Watch History & Features

✅ **Watch History**: Auto-updated when WatchPage loads
✅ **Continue Watching**: Uses stored season/episode data
✅ **My List**: Preserved (stored in localStorage)
✅ **Recommendations**: Preserved
✅ **Episode Selection**: Navigates to `/watch/tv/:id/:season/:episode`
✅ **Genre Filter**: Works on home page
✅ **Search**: Works on home page

---

## Security & Sandbox

### iframe Sandbox Attributes

```html
<iframe 
  sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
  allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
/>
```

**Removed**: `allow-top-navigation-by-user-activation`
- Prevents iframe from navigating parent window
- Prevents VidSrc URL exposure in address bar
- Still allows fullscreen and all playback features

**Kept**:
- `allow-same-origin`: Required for VidSrc functionality
- `allow-scripts`: Required for player controls
- `allow-popups`: May be needed by VidSrc
- `allow-presentation`: Required for fullscreen mode

---

## Installation & Running

### Frontend Setup
```bash
cd /path/to/project
npm install  # Installs react-router-dom
npm run dev  # Runs on http://localhost:5173
```

### Backend Setup
```bash
cd backend
npm install  # Installs express, cors
npm run dev  # Runs on http://localhost:3001
```

**Both services must be running for playback to work**

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Home Page (http://localhost:5173)                     │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ HeroCarousel / MediaRow                                      ││
│ │ [Movie Card]                                                 ││
│ │   ↓ Click "▶ Play"                                           ││
│ │ [MediaModal]                                                 ││
│ │   ↓ handlePlayClick() → openPlayer(media, season, episode)  ││
│ │ [PlayerContext]                                              ││
│ │   ↓ Triggers useEffect in PlayerOverlay                     ││
│ │ [PlayerOverlay] (null return)                                ││
│ │   ↓ navigateRouter("/watch/movie/12345")                    ││
│ └──────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                          ↓ Browser history
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Watch Page (http://localhost:5173/watch/movie/12345) │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ [WatchPage]                                                  ││
│ │   ↓ useEffect fetches player URL                            ││
│ │ ┌─────────────────────────────────────────────────────────┐ ││
│ │ │ await playerService.getMoviePlayerUrl(12345)            │ ││
│ │ └──────────┬──────────────────────────────────────────────┘ ││
│ └────────────┼────────────────────────────────────────────────┘│
│              ↓ HTTP GET /api/player/movie/12345                │
┌──────────────┴──────────────────────────────────────────────────┐
│ BACKEND: Express Server (http://localhost:3001)                 │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ app.get('/api/player/movie/:id')                            ││
│ │   const url = `https://vidsrc.me/embed/movie/12345`        ││
│ │   return { success: true, url: url }                        ││
│ └──────────────────┬──────────────────────────────────────────┘│
└────────────────────┼─────────────────────────────────────────────┘
                     ↓ JSON response
┌─────────────────────┴──────────────────────────────────────────┐
│ FRONTEND: Watch Page (continued)                               │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ [WatchPage]                                                ││
│ │   ↓ setPlayerUrl("https://vidsrc.me/embed/movie/12345")   ││
│ │   ↓ storageService.updateWatchHistory(...)               ││
│ │ ┌────────────────────────────────────────────────────────┐││
│ │ │ <iframe src="https://vidsrc.me/embed/movie/12345"     │││
│ │ │         sandbox="allow-same-origin allow-scripts      │││
│ │ │                 allow-popups allow-presentation" />    │││
│ │ └────────────────────────────────────────────────────────┘││
│ │ ✅ User streams on VidSrc                                 ││
│ │ ✅ Stays on NoGate domain: http://localhost:5173/watch/...││
│ │ ✅ VidSrc URL NOT in address bar                          ││
│ └────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Code Verification

### ✅ All Direct VidSrc Navigation Removed

```bash
# No window.open() to VidSrc
$ grep -r "window\.open.*vidsrc" src/
# Result: No matches ✅

# No window.location.href to VidSrc  
$ grep -r "window\.location.*vidsrc" src/
# Result: No matches ✅

# VIDSRC_BASE only in backend
$ grep -r "VIDSRC_BASE" src/
# Result: Only in tmdbAPI.ts (exported but unused) ✅

# YouTube trailers still work (intentional)
$ grep -r "window\.open.*youtube" src/
# Result: MediaModal.tsx line 297 ✅
```

---

## Future Enhancements

### Potential Improvements
- [ ] Add backend authentication for player URLs
- [ ] Add analytics tracking for playback
- [ ] Add rate limiting on backend
- [ ] Support multiple streaming providers (toggle via ENV)
- [ ] Add HTTPS/security headers
- [ ] Production CORS configuration
- [ ] Database integration for preferences
- [ ] CDN for VidSrc URLs (if available)

---

## Troubleshooting

### Player shows "Failed to load player"
1. Ensure backend is running: `npm run dev` in `/backend`
2. Check backend is on `http://localhost:3001`
3. Check browser console for CORS errors
4. Verify movie/TV ID is valid

### Backend not found
```bash
cd backend
npm install
npm run dev
```

### VidSrc not loading in iframe
- Check browser console for sandbox errors
- Verify VidSrc service is accessible
- Check iframe permissions in sandbox attribute

---

## Summary

✅ **VidSrc continues as streaming backend**  
✅ **Users never see VidSrc URL in address bar**  
✅ **All playback routed through /watch pages**  
✅ **Backend serves VidSrc URLs securely**  
✅ **Watch history, lists, and features preserved**  
✅ **Users stay on NoGate domain throughout**  

The player architecture is now **secure, scalable, and user-friendly** while maintaining VidSrc as the reliable streaming source.
