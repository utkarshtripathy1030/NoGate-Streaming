# Testing Guide - NoGate Multi-Profile & PWA Features

## Quick Start Testing

### 1. First-Time User Experience
1. Open the app at `localhost:5174`
2. **Expected**: You should see the **CreateProfileModal** with avatar selection
3. Enter a profile name (e.g., "John")
4. Select an avatar (click Deadpool, Batman, etc.)
5. Choose a favorite genre from dropdown
6. Click "Create Profile"
7. **Expected**: Modal closes and you're redirected to "Who's Watching?" screen

### 2. Who's Watching Screen (Profile Selector)
1. After creating first profile, you'll see **Who's Watching?** screen
2. **Expected Features**:
   - Large title "Who's Watching?"
   - Profile grid showing your created profile with avatar and name
   - "+ Add Profile" button to create more profiles
   - "⚙️ Manage Profiles" button at bottom
3. Click on your profile avatar
4. **Expected**: Profile selected, main app content loads

### 3. Multiple Profiles
1. From Who's Watching screen, click "+ Add Profile"
2. **Expected**: CreateProfileModal opens again
3. Create second profile (e.g., "Kids Profile")
4. Toggle "Kids Mode" option (adds 👶 badge)
5. Click "Create Profile"
6. **Expected**: Modal closes, Who's Watching shows 2 profiles
7. Click different profiles to switch between them
8. **Expected**: Header shows selected profile avatar, different content per profile

### 4. Continue Watching (Per-Profile Data)
1. Select a profile
2. Click on a movie/show to open it
3. **Expected**: MediaModal opens with watch button
4. Click "Watch" to go to player
5. Play video for 10-15 seconds
6. Refresh the page
7. **Expected**: 
   - If profiles exist, see Who's Watching screen again
   - Click your profile
   - Look for "Continue Watching" row with the movie you started
   - Should show progress bar indicating how far you watched

### 5. Profile-Specific Data Isolation
1. Create 2 profiles: "Parent" and "Kids"
2. In "Parent" profile:
   - Add 3 movies to "My List"
   - Watch a movie partially (15 seconds)
3. Switch to "Kids" profile
4. **Expected**: 
   - "My List" is empty for Kids profile
   - "Continue Watching" doesn't show Parent's movie
   - Completely separate data
5. Switch back to Parent
6. **Expected**: Your movie list and continue watching are still there

### 6. Kids Mode Badge
1. Create a profile with Kids Mode enabled
2. Look at Who's Watching screen
3. **Expected**: Kids profile shows 👶 badge in top-right corner of avatar
4. Visual indicator that this is a kids profile

### 7. Persistent Storage (localStorage)
1. Create 2-3 profiles
2. Add movies to My List
3. Watch some content
4. Press F12 to open DevTools
5. Go to Application → Local Storage → localhost:5174
6. **Expected Storage Keys**:
   - `nogate_profiles`: Array of all profiles with full data
   - `nogate_selected_profile`: Currently selected profile ID
7. Close browser tab completely
8. Reopen localhost:5174
9. **Expected**: 
   - Profiles still exist
   - Last selected profile is selected
   - My List and Continue Watching data preserved

## Device Responsiveness Testing

### Desktop (1400px+)
1. Open in full-screen browser window
2. Check Who's Watching screen:
   - **Expected**: Large avatars (150px), grid with 4+ columns
   - Large title "Who's Watching?"
   - Smooth hover animations
   - 40px padding around content

### Laptop (1024px - 1399px)
1. Resize browser to 1200px width
2. **Expected**: 
   - Slightly smaller avatars (120px)
   - 3-4 columns in grid
   - Proper spacing maintained

### Tablet (768px - 1023px)
1. Resize browser to 800px width or use iPad device
2. **Expected**:
   - Medium avatars (120px)
   - 2-3 columns
   - Adjusted font sizes (0.9rem)
   - Touch-friendly buttons (48px minimum)
   - No hover effects on touch devices

### Mobile (480px - 767px)
1. Resize browser to 600px or use iPhone device
2. **Expected**:
   - Smaller avatars (100px)
   - 2-column grid
   - Font size 0.85rem
   - Proper mobile padding
   - Who's Watching title at ~2rem

### Small Mobile (<480px)
1. Resize browser to 375px (iPhone SE size)
2. **Expected**:
   - Tiny avatars (80px)
   - 2-column grid (maybe 1 on very small)
   - Minimal padding
   - Responsive font sizes

### Landscape Mode
1. Rotate device to landscape (or resize window)
2. **Expected**:
   - Header adjusts for landscape
   - Reduced vertical spacing
   - Content still readable
   - No horizontal scroll

## Accessibility Testing

### Keyboard Navigation
1. Open Who's Watching screen
2. Press Tab key repeatedly
3. **Expected**:
   - Focus outline (blue) shows on each profile
   - Focus shows on "Add Profile" button
   - Focus shows on "Manage Profiles" button
4. With profile focused, press Enter
5. **Expected**: Profile selected, app loads

### Reduced Motion Preference
1. On Windows: Settings → Ease of Access → Display → Show animations
2. Turn OFF animations
3. On macOS: System Preferences → Accessibility → Display → Reduce motion
4. Open Who's Watching screen
5. **Expected**:
   - No fade-in animation
   - No hover scaling effect
   - Still functional, just no animations

### High Contrast Mode
1. Enable high contrast mode (Windows: Settings → Ease of Access)
2. Open Who's Watching screen
3. **Expected**:
   - Text has underline (accessibility pref)
   - Better contrast on focus states
   - Colors remain accessible

## PWA Testing

### Installation Prompt
1. Open app in Chrome/Brave/Edge
2. Look for install icon (usually in address bar)
3. **Expected**: Can install as app
4. Click install
5. App opens in standalone window

### Offline Functionality
1. Open app while online
2. DevTools → Network tab
3. Set to "Offline" mode
4. Refresh page
5. **Expected**: 
   - App still loads (shell cached)
   - "Who's Watching?" screen shows (static)
   - Clicking profiles works (from localStorage)
   - Images show (cached from previous load)

### Service Worker Caching
1. DevTools → Application → Service Workers
2. **Expected**: Service worker shows "ACTIVATED"
3. Go to Cache Storage
4. **Expected These Caches**:
   - `nogate-static-v1`: index.html, manifest.json
   - `nogate-dynamic-v1`: Page content
   - `nogate-images-v1`: Movie posters, avatars
   - `nogate-api-v1`: TMDB API responses

## Performance Testing

### Skeleton Loaders
1. Open DevTools → Network tab
2. Set to "Fast 3G" throttling
3. Navigate between profiles
4. **Expected**: 
   - Skeleton placeholders appear while loading
   - Smooth transition to real content
   - No flash/flicker

### Lazy Image Loading
1. DevTools → Network tab → Images filter
2. Scroll through Continue Watching/Movies
3. **Expected**:
   - Images only load when scrolled into view
   - Network shows images load on-demand
   - Blur placeholder visible briefly

### First Paint Performance
1. DevTools → Performance tab → Record
2. Open app
3. Stop recording
4. **Expected**:
   - First Contentful Paint: < 2 seconds
   - Largest Contentful Paint: < 3 seconds
   - Cumulative Layout Shift: < 0.1

## Feature Checklist

### Profile Features
- [ ] Create multiple profiles
- [ ] Select profile switches context
- [ ] Kids mode adds badge
- [ ] Profile data persists (F5 refresh)
- [ ] Delete profile works
- [ ] Edit profile (future feature)

### Data Isolation
- [ ] My List separate per profile
- [ ] Continue Watching separate per profile
- [ ] Watch history separate per profile
- [ ] Favorites separate per profile
- [ ] Stats accurate per profile

### UI Features
- [ ] Who's Watching screen shows all profiles
- [ ] Add Profile button works
- [ ] Profile avatars display correctly
- [ ] Hover/focus effects work
- [ ] Animations smooth (no glitches)
- [ ] Responsive on all breakpoints

### PWA Features
- [ ] Can install as app
- [ ] Works offline
- [ ] Service worker active
- [ ] Multiple caches exist
- [ ] Shortcuts work
- [ ] Share target functional

### Accessibility
- [ ] Keyboard navigation works
- [ ] Tab shows focus outlines
- [ ] Enter selects profile
- [ ] Respects reduced motion
- [ ] Respects high contrast
- [ ] Screen reader friendly

### Performance
- [ ] Skeleton loaders appear
- [ ] Lazy loading works
- [ ] Images load on-demand
- [ ] No layout shift
- [ ] Smooth animations
- [ ] Fast load times

## Debugging Tips

### Check localStorage
```javascript
// In DevTools Console:
JSON.parse(localStorage.getItem('nogate_profiles'))
localStorage.getItem('nogate_selected_profile')
```

### Check Service Worker Status
1. DevTools → Application → Service Workers
2. Look for "ACTIVATED AND RUNNING"
3. If not, hard refresh (Ctrl+Shift+R)

### Check Caches
1. DevTools → Application → Cache Storage
2. Expand each cache to see what's stored
3. Should see images, API responses, HTML

### Clear Everything (Fresh Start)
```javascript
// In DevTools Console:
localStorage.clear()
sessionStorage.clear()
// Then hard refresh: Ctrl+Shift+R
// Then DevTools → Application → Clear site data
```

## Common Issues & Solutions

### Issue: Who's Watching screen doesn't appear
- **Cause**: selectedProfile is null but profiles exist
- **Check**: localStorage for nogate_profiles and nogate_selected_profile
- **Fix**: Clear localStorage and create fresh profile

### Issue: Avatar doesn't load in profile picker
- **Cause**: Image import path wrong
- **Check**: Network tab to see 404 errors
- **Fix**: Verify avatars exist in src/assets/avatars/

### Issue: Switching profiles doesn't update content
- **Cause**: Components not re-rendering
- **Check**: useProfile hook is being used
- **Fix**: Add dependency array properly

### Issue: Offline mode shows blank page
- **Cause**: Service worker not active
- **Check**: Application → Service Workers should show "ACTIVATED"
- **Fix**: Hard refresh (Ctrl+Shift+R)

### Issue: Data persists across profiles (should be isolated)
- **Cause**: Still using old single-profile context
- **Check**: ProfileContext.ts should use profiles array
- **Fix**: Use selectedProfile.profileId when saving data

## Performance Benchmarks

### Target Metrics
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s

### Measure with Lighthouse
1. DevTools → Lighthouse
2. Select "Mobile" or "Desktop"
3. Click "Analyze page load"
4. Review scores
5. Check Performance, Accessibility, Best Practices

## Success Criteria

✅ **Multi-Profile System**
- Create, switch, and delete profiles
- Profile-specific data isolation
- Kids mode support

✅ **Who's Watching Screen**
- Shows all profiles with avatars
- Add profile functionality
- Netflix-style interface

✅ **PWA Features**
- Installable on all modern browsers
- Offline functionality
- Service worker caching

✅ **Responsive Design**
- Works on desktop, tablet, mobile
- Touch-friendly controls
- Landscape support

✅ **Accessibility**
- Keyboard navigation
- Respects user preferences
- Screen reader compatible

✅ **Performance**
- Fast load times
- Smooth animations
- Efficient caching
