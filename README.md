# NoGate - Production Ready Streaming Platform

A modern, responsive streaming platform built with **React 18**, **Vite**, and **TypeScript**. Stream movies and TV shows with a Netflix-like experience.

## Features

### Core Functionality ✅
- **Hero Carousel** - Trending content showcase with auto-rotation
- **Horizontal Media Rows** - Browse by trending, popular, and genres
- **Search & Suggestions** - Real-time search with autocomplete
- **My List** - Save and organize your favorite content
- **Continue Watching** - Resume from where you left off
- **Infinite Scroll** - Endless content discovery
- **Media Modal** - Detailed view with cast, episodes, trailers
- **Reactions** - Like, Awesome, or Trash reactions
- **User Reactions** - Rate content with quick reaction buttons
- **Episode Selection** - Browse and select episodes for TV series
- **Trailer Playback** - Watch trailers and clips directly

### Design & UX ✅
- **Mobile-first responsive design**
- **Dark theme** (Netflix-style)
- **Smooth animations and transitions**
- **Accessible keyboard navigation**
- **Loading states & skeletons**
- **Error handling**

### Tech Stack ✅
- **Frontend**: React 18, TypeScript, Vite
- **API**: TMDB (The Movie Database)
- **State Management**: React Hooks & Context API
- **Styling**: CSS Modules with responsive design
- **Build**: Vite with code splitting and lazy loading
- **PWA**: Service Worker & Web App Manifest

### Future Backend Features 🔄
- User authentication & profiles
- Watch history synchronization
- Personalized recommendations
- User preferences & settings
- API key protection
- Analytics & tracking

## Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:5173`

## Project Structure

```
nogate/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── HeroCarousel.tsx
│   │   ├── MediaCard.tsx
│   │   ├── MediaRow.tsx
│   │   ├── MediaModal.tsx
│   │   ├── InfiniteScrollGrid.tsx
│   │   └── *.module.css
│   ├── context/
│   │   └── ModalContext.tsx  # Global modal state
│   ├── hooks/
│   │   └── useMedia.ts       # Custom hooks for API & data
│   ├── services/
│   │   ├── tmdbAPI.ts        # TMDB API integration
│   │   └── storageService.ts # LocalStorage utilities
│   ├── App.tsx               # Root component
│   ├── App.css               # Global styles
│   └── main.tsx              # Entry point
├── public/
│   ├── manifest.json         # PWA manifest
│   └── sw.js                 # Service worker
├── backend/                  # Future backend structure
│   └── src/
│       ├── api/              # API routes (placeholders)
│       ├── models/           # Database models (placeholders)
│       └── services/         # Business logic (placeholders)
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Component Architecture

### Header Component
- Navigation (Home, TV Shows, Movies)
- Search with autocomplete suggestions
- Active navigation highlighting

### HeroCarousel Component
- Auto-rotating carousel with 8 trending items
- Manual navigation with dots
- Play and More Info buttons
- Responsive image backgrounds

### MediaCard Component
- Poster image with hover effects
- Title and rating display
- Add/remove from My List button
- Progress badge for Continue Watching

### MediaRow Component
- Horizontal scrollable row of cards
- Responsive grid layout
- Loading skeleton states
- Accessibility features

### MediaModal Component
- Full-featured detail modal
- Cast information
- Episode selection (for TV)
- Similar content recommendations
- Trailer playback
- My List and reaction buttons
- Smooth animations

### InfiniteScrollGrid Component
- Grid layout with automatic infinite scroll
- Intersection Observer for efficiency
- My List toggle integration
- Search results display

## Styling System

### CSS Modules
Each component has its own `.module.css` file with:
- Component-scoped styles
- No naming conflicts
- Easy maintenance

### Global Styles
- `App.css`: Typography, utilities, animations, responsive breakpoints
- Base styles for body, headings, buttons, links

### Responsive Breakpoints
- `2xl`: 1400px+
- `xl`: 1024px+
- `lg`: 768px+
- `md`: 480px+

## State Management

### Context API
- **ModalContext**: Global modal open/close state and media selection

### Custom Hooks
- `useMyList()`: My List management
- `useTrendingMedia()`: Trending movies and series
- `useGenreMovies()`: Genre-specific content
- `useHeroCarousel()`: Hero carousel data
- `useInfiniteScroll()`: Infinite scroll pagination
- `useSearch()`: Search functionality

### Local Storage
- `nogate_mylist`: Saved content
- `nogate_watch`: Watch history (last 3)
- `nogate_reactions`: User reactions

## API Integration

### TMDB API
- Movie/TV details
- Trending content
- Search functionality
- Cast information
- Episodes for TV series
- Trailers and videos
- Similar content
- Recommendations

### Image URLs
- Poster images: 342px width
- Backdrop images: Original resolution
- Cast/episode stills: 300px width

## PWA Features

### Offline Support
- Service Worker caching
- Network-first strategy
- Offline fallback page

### Installability
- Web App Manifest
- App icons (multiple sizes)
- Maskable icons support
- Shortcuts for quick access
- Screenshot support

## Performance Optimizations

- **Code Splitting**: Separate chunks for vendor and app code
- **Lazy Loading**: Images loaded on demand
- **Image Optimization**: Multiple sizes and formats
- **CSS Minification**: Production-ready CSS
- **Tree Shaking**: Removes unused code
- **Caching**: HTTP and service worker caching

## Mobile Optimization

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Larger touch targets
- **Mobile Navigation**: Collapsible menus
- **Viewport Scaling**: Proper meta tags
- **Mobile Performance**: Optimized for 3G/4G

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Screen reader support
- **Focus Visible**: Clear focus indicators
- **Color Contrast**: WCAG compliant
- **Semantic HTML**: Proper element usage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Environment Variables

Currently using public TMDB API key. For production, create `.env`:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

## Future Backend Integration

### Phase 1: API Setup
- Express.js server
- Database (PostgreSQL/MongoDB)
- Authentication system
- JWT token management

### Phase 2: User Management
- User profiles
- Preferences storage
- Watch history sync
- My List persistence

### Phase 3: Recommendations
- Personalized recommendations engine
- Content-based filtering
- Collaborative filtering
- Analytics tracking

### Phase 4: Enhancement
- Advanced search filters
- Content curation
- Social features
- Push notifications

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist folder
```

### Docker
```bash
# Build Docker image
docker build -t nogate .

# Run container
docker run -p 5173:5173 nogate
```

## Development

### Code Quality
- TypeScript strict mode
- ESLint configuration ready
- Prettier formatting support

### Common Tasks
```bash
# Start development
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint

# Build production
npm run build

# Preview build
npm run preview
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an GitHub Issue
- Check existing documentation
- Review code comments

## Roadmap

- [ ] Backend API integration
- [ ] User authentication
- [ ] Personalized recommendations
- [ ] Fullscreen video player modal
- [ ] Social sharing features
- [ ] Advanced filtering
- [ ] User profiles & settings
- [ ] Analytics dashboard
- [ ] Admin panel
- [ ] Multiple language support

## Credits

- **TMDB**: Movie and TV data
- **React**: UI library
- **Vite**: Build tool
- **TypeScript**: Type safety

---

**NoGate** - Bringing cinema to your screen. Enjoy! 🎬
