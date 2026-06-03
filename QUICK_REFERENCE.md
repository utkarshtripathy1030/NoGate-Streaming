# Quick Reference Guide - NoGate Features

## 🚀 Getting Started

### Run Development Server
```bash
cd "c:\Users\utkar_51ty\OneDrive\Desktop\New folder"
npm run dev
# Opens at localhost:5174
```

### First-Time User Flow
1. **Create Profile** → Avatar selection modal
2. **Who's Watching?** → Profile selection screen
3. **Select Profile** → Main app content
4. **Watch Content** → Click movie/show to play
5. **Resume Later** → Return to app, select profile, continue watching

## 📱 Multi-Profile System

### Create Profile
```typescript
const { createProfile } = useProfile();
await createProfile(
  "John",                    // Profile name
  "/path/to/avatar.png",     // Avatar URL
  "action",                  // Favorite genre
  false                       // isKids
);
```

### Switch Profile
```typescript
const { selectProfile } = useProfile();
selectProfile(profileId);  // Switch to profile
```

### Access Profile Data
```typescript
const { selectedProfile } = useProfile();
selectedProfile.continueWatching[]  // Array of WatchItem
selectedProfile.watchHistory[]      // Array of WatchItem
selectedProfile.favorites[]         // Array of media IDs
selectedProfile.watchlist[]         // Array of media IDs
```

### Track Watch Progress
```typescript
const { updateWatchProgress } = useProfile();
updateWatchProgress(
  profileId,           // Which profile
  mediaId,             // Movie/show ID
  progress,            // 0-100 percentage
  currentTime          // Current play position in seconds
);
```

## 🎨 UI Components

### Who's Watching Screen
```tsx
import { WhoIsWatching } from '@/components/WhoIsWatching';

<WhoIsWatching />  // Shows profile grid, auto-selects on click
```

### Skeleton Loader
```tsx
import { SkeletonLoader } from '@/components/SkeletonLoader';

<SkeletonLoader type="card" count={3} />  // 3 card skeletons
<SkeletonLoader type="avatar" count={5} /> // 5 avatar skeletons
<SkeletonLoader type="text" />             // Text placeholder
```

### Image Lazy Loading
```tsx
import { ImageLazyLoader } from '@/components/ImageLazyLoader';

<ImageLazyLoader 
  src={posterPath}
  alt="Movie Title"
  placeholder={blurredImage}
  width="150px"
  height="225px"
  onLoad={() => console.log('Loaded')}
/>
```

## 🌐 Responsive Design

### CSS Breakpoints
```css
/* Mobile First - Base Styles */
/* < 480px - Small Mobile */

/* 480px - Mobile */
@media (max-width: 768px) { }

/* 768px - Tablet */
@media (max-width: 1024px) { }

/* 1024px - Laptop */
@media (max-width: 1400px) { }

/* 1400px+ - Desktop */
/* No media query needed */

/* 3000px+ - TV/Large Screen */
@media (min-width: 3000px) { }
```

### Touch-Friendly Elements
```css
/* Minimum 48px on touch devices */
button, a[role="button"] {
  min-width: 48px;
  min-height: 48px;
}

/* Disable hover on touch */
@media (hover: none) and (pointer: coarse) {
  button:hover { /* No hover effect */ }
}
```

## 📦 PWA Features

### Service Worker Caching
```javascript
// Automatic - handled by sw.js
// 4 cache strategies:
1. Static assets (indefinite)
2. Images (cache-first)
3. API calls (network-first, 24hr cache)
4. Dynamic content (network-first)
```

### Install App
- Chrome/Brave/Edge: Look for install icon in address bar
- Firefox: Menu → "Install NoGate"
- Safari: Share → "Add to Home Screen"

### Check Offline Status
```typescript
const isOnline = navigator.onLine;
if (!isOnline) {
  // Show offline message
}
```

## 🎯 Key Data Structures

### Profile Object
```typescript
{
  profileId: "uuid-string",
  profileName: "John",
  avatar: "/avatars/deadpool.png",
  favoriteGenre: "action",
  isKids: false,
  createdAt: 1704067200000,
  continueWatching: [],      // WatchItem[]
  watchHistory: [],          // WatchItem[]
  favorites: [],             // number[] (media IDs)
  watchlist: [],             // number[] (media IDs)
  stats: {
    moviesWatched: 5,
    showsWatched: 2,
    totalHoursWatched: 12.5,
    lastWatchedAt: 1704153600000
  }
}
```

### WatchItem Object
```typescript
{
  id: 550,                    // TMDB ID
  type: "movie",              // 'movie' | 'tv'
  title: "Fight Club",
  poster_path: "/image.jpg",  // TMDB poster URL
  progress: 45,               // 0-100%
  duration: 5400,             // Seconds
  currentTime: 2430,          // Seconds (45% of 5400)
  season: undefined,          // For TV shows
  episode: undefined,         // For TV shows
  timestamp: 1704153600000,   // Added date
  lastWatchedAt: 1704153600000 // Last watched
}
```

## 💾 LocalStorage Keys

### Data Storage
```javascript
// All profiles
localStorage.getItem('nogate_profiles')
// Returns: JSON string of Profile[]

// Currently selected profile ID
localStorage.getItem('nogate_selected_profile')
// Returns: "profile-id-string"
```

### Example Read
```javascript
const profiles = JSON.parse(localStorage.getItem('nogate_profiles') || '[]');
const selectedId = localStorage.getItem('nogate_selected_profile');
const selectedProfile = profiles.find(p => p.profileId === selectedId);
```

## 🔄 App State Flow

```
Start App
  ↓
Check localStorage
  ↓
profiles.length === 0?
  ├─ YES → Show CreateProfileModal
  │         ↓
  │      Create Profile
  │         ↓
  │      Show WhoIsWatching
  │
  └─ NO → Check selectedProfile
           ├─ null → Show WhoIsWatching
           │         ↓
           │      User clicks profile
           │         ↓
           │      selectProfile(id)
           │         ↓
           │      Show Main App
           │
           └─ exists → Show Main App
```

## 📺 Device-Specific Handling

### Desktop (1400px+)
- Large titles, wide layouts
- Hover effects on interactive elements
- Multi-column grids

### Tablet (768px - 1023px)
- Medium-sized elements
- Touch-friendly buttons (48px)
- 2-3 column layouts

### Mobile (480px - 767px)
- Single column or 2-column layout
- Large touch targets
- Compact spacing

### TV (3000px+)
- Extra large fonts (4x base size)
- Large buttons (remote navigation)
- Simple layouts

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab**: Move between elements
- **Enter**: Activate button/link
- **Escape**: Close modal/dialog
- **Arrow Keys**: Navigation in lists

### Screen Reader Support
- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ARIA labels on icons
- Alt text on images
- Role attributes

### User Preferences
```css
/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; }
}

/* High contrast mode */
@media (prefers-contrast: more) {
  button { text-decoration: underline; }
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  /* Dark styles */ 
}
```

## 🐛 Debugging

### Check Profile Context
```javascript
// In console:
const profiles = JSON.parse(localStorage.getItem('nogate_profiles'));
console.log('All profiles:', profiles);
console.log('Selected:', localStorage.getItem('nogate_selected_profile'));
```

### Clear Everything (Fresh Start)
```javascript
localStorage.clear();
sessionStorage.clear();
// Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### Check Service Worker
1. Open DevTools
2. Application → Service Workers
3. Should show "ACTIVATED AND RUNNING"
4. If not: Hard refresh + clear site data

### Performance Check
1. DevTools → Performance
2. Record page load
3. Check metrics:
   - First Contentful Paint: < 2s
   - Largest Contentful Paint: < 3s
   - Cumulative Layout Shift: < 0.1

## 📚 Documentation

- **IMPLEMENTATION_SUMMARY.md**: Complete architecture overview
- **FEATURE_IMPLEMENTATION.md**: Detailed feature specs
- **TESTING_GUIDE.md**: Testing instructions and checklist
- **DEVELOPMENT.md**: Development environment setup
- **README.md**: Project overview

## 🔗 Important Files

### Core Files
- `src/context/ProfileContext.tsx` - Multi-profile state management
- `src/App.tsx` - Main app with WhoIsWatching logic
- `public/sw.js` - Service worker for PWA
- `src/App.css` - Responsive design

### Components
- `src/components/WhoIsWatching.tsx` - Profile selector
- `src/components/SkeletonLoader.tsx` - Loading placeholders
- `src/components/ImageLazyLoader.tsx` - Lazy image loading

### Configuration
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Dependencies

## 🎯 Common Tasks

### Add a New Feature
1. Update ProfileContext if new profile data needed
2. Create component in `src/components/`
3. Add styles in `[ComponentName].module.css`
4. Update `src/App.tsx` if needed for routing
5. Add to tests

### Fix Responsive Issue
1. Identify breakpoint (480, 768, 1024, 1400, 3000px)
2. Add `@media` query to CSS
3. Test on actual device or DevTools
4. Verify touch targets are 48px+

### Debug Profile Data
1. Open DevTools Console
2. Run: `JSON.parse(localStorage.getItem('nogate_profiles'))`
3. Check structure matches Profile interface
4. Verify `nogate_selected_profile` is valid ID

### Optimize Performance
1. Run Lighthouse audit
2. Check bundle size: `npm run analyze`
3. Identify slow components
4. Add SkeletonLoader while loading
5. Use ImageLazyLoader for images

## 🚀 Ready to Deploy?

Checklist:
- [ ] All tests passing
- [ ] No console errors
- [ ] Lighthouse > 80
- [ ] Tested offline
- [ ] Tested on mobile
- [ ] Accessibility checked
- [ ] Build optimized
- [ ] Manifest valid
- [ ] Service worker active

Then run:
```bash
npm run build        # Create optimized bundle
npm run preview      # Test production build
# Deploy dist/ folder
```

## 📞 Support

For issues:
1. Check TESTING_GUIDE.md "Common Issues & Solutions"
2. Clear localStorage and test fresh
3. Hard refresh (Ctrl+Shift+R)
4. Check browser console for errors
5. Verify PWA manifest is valid
6. Test in incognito/private mode
