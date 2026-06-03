# Development Tips & Best Practices

## Quick Commands

```bash
# Start dev server with hot reload
npm run dev

# Type check only (without compilation)
npm run type-check

# Lint and check for issues
npm run lint

# Build for production
npm run build

# Test production build locally
npm run preview
```

## Adding a New Feature

### Step 1: Create Component
```typescript
// src/components/MyNewComponent.tsx
import React, { FC } from 'react';
import styles from './MyNewComponent.module.css';

interface MyNewComponentProps {
  data: any;
  onAction: () => void;
}

export const MyNewComponent: FC<MyNewComponentProps> = ({ data, onAction }) => {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
};
```

### Step 2: Add Styles
```css
/* src/components/MyNewComponent.module.css */
.container {
  /* styles here */
}

@media (max-width: 768px) {
  .container {
    /* mobile styles */
  }
}
```

### Step 3: Create Hook (if needed)
```typescript
// src/hooks/useMyNewData.ts
import { useState, useEffect } from 'react';
import { tmdbAPI } from '@/services/tmdbAPI';

export const useMyNewData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await tmdbAPI.getSomeData();
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading };
};
```

### Step 4: Use in App
```typescript
// src/App.tsx
import { MyNewComponent } from '@/components/MyNewComponent';
import { useMyNewData } from '@/hooks/useMyNewData';

// In render:
const { data } = useMyNewData();
return <MyNewComponent data={data} onAction={() => {}} />;
```

## Common Patterns

### API Call with Error Handling
```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await tmdbAPI.getMovieDetails(123);
    setData(response.data);
    setError(null);
  } catch (error) {
    console.error('Error:', error);
    setError('Failed to load data');
  } finally {
    setLoading(false);
  }
};
```

### Debounced Search Input
```typescript
const [query, setQuery] = useState('');
const debounceRef = useRef<NodeJS.Timeout>();

useEffect(() => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }
  
  debounceRef.current = setTimeout(() => {
    search(query);
  }, 300);
}, [query]);
```

### Conditional Rendering
```typescript
// Don't render at all
if (items.length === 0 && !isLoading) {
  return null;
}

// Show loading state
if (isLoading) {
  return <div className={styles.skeleton} />;
}

// Render content
return (
  <>
    {items.map(item => (
      <div key={item.id}>{item.title}</div>
    ))}
  </>
);
```

### Event Handler with Stop Propagation
```typescript
const handleListClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent parent click
  // Your handler logic
};
```

## Performance Tips

### 1. Image Lazy Loading
```typescript
<img
  loading="lazy"
  src={url}
  onError={(e) => {
    // Handle error with placeholder
    e.currentTarget.src = fallbackUrl;
  }}
/>
```

### 2. Memoize Callbacks
```typescript
const handleMediaSelect = useCallback((item: any) => {
  // Handler logic
}, []); // Add dependencies if needed
```

### 3. Use React.memo for Expensive Components
```typescript
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* Expensive render logic */}</div>;
});
```

### 4. Key Props for Lists
```typescript
// ✅ Good: Unique ID
{items.map(item => <Card key={item.id} {...item} />)}

// ❌ Bad: Array index
{items.map((item, idx) => <Card key={idx} {...item} />)}
```

## Testing Checklist

### Manual Testing
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Test on mobile (iOS Safari, Chrome Mobile)
- [ ] Test tablet view (iPad, Android tablet)
- [ ] Test with keyboard navigation
- [ ] Test with screen reader (accessibility)
- [ ] Test image loading with slow network
- [ ] Test error states
- [ ] Test empty states
- [ ] Test loading states
- [ ] Test animations on different devices

### Browser DevTools
```javascript
// Check component renders count
React DevTools > Profiler

// Check network requests
Network tab > Filter by XHR

// Check localStorage
Application > Local Storage > nogate_*

// Check console for errors
Console tab
```

## Debugging Tips

### 1. Check React Component Props
```typescript
console.log('Component props:', props);
```

### 2. Check API Response
```typescript
const response = await tmdbAPI.getData();
console.log('API Response:', response);
```

### 3. Check localStorage
```javascript
console.log('My List:', JSON.parse(localStorage.getItem('nogate_mylist')));
console.log('Watch History:', JSON.parse(localStorage.getItem('nogate_watch')));
```

### 4. Monitor Re-renders
```typescript
import { useEffect } from 'react';

export const MyComponent = () => {
  useEffect(() => {
    console.log('Component rendered');
  });
  // Component code
};
```

## Mobile Optimization

### 1. Test on Real Device
```bash
# Get your machine IP
ipconfig getifaddr en0 # macOS
ipconfig # Windows

# Access from phone on same network
http://<YOUR_IP>:5173
```

### 2. Simulate Mobile in DevTools
```
Chrome DevTools > Device Toolbar (Ctrl+Shift+M)
```

### 3. Check Mobile Performance
```
Chrome DevTools > Lighthouse
```

## CSS Tips

### 1. Dark Theme Colors
```css
background: #141414;        /* Main background */
background: #1a1a1a;        /* Secondary bg */
color: #e5e5e5;             /* Primary text */
color: #ddd;                /* Secondary text */
color: #888;                /* Tertiary text */
accent-color: #e50914;      /* Netflix red */
```

### 2. Responsive Breakpoints
```css
@media (max-width: 1400px) { }  /* Desktop XL */
@media (max-width: 1024px) { }  /* Laptop */
@media (max-width: 768px) { }   /* Tablet */
@media (max-width: 480px) { }   /* Mobile */
```

### 3. Common Utilities
```css
/* Truncate text */
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;

/* Multi-line truncate */
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;

/* Smooth transitions */
transition: all 0.3s ease;

/* Scrollbar styling */
scrollbar-width: thin;
scrollbar-color: #e50914 #222;
```

## Git Workflow

### Feature Development
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make commits
git add .
git commit -m "feat: add my feature"

# Push to fork
git push origin feature/my-feature

# Create pull request on GitHub
```

### Keeping Sync
```bash
# Add upstream remote
git remote add upstream https://github.com/original/repo.git

# Update local main
git fetch upstream
git rebase upstream/main
```

## Useful Vite Commands

### Build Analysis
```bash
# Build and show bundle analysis
npm run build

# Check dist folder size
du -sh dist/
```

### Environment Variables
```typescript
// Use import.meta.env for environment variables
const apiKey = import.meta.env.VITE_TMDB_API_KEY;
const apiUrl = import.meta.env.VITE_API_URL;
```

## localStorage Tips

### Backup Data
```javascript
// Backup
const backup = JSON.stringify({
  mylist: localStorage.getItem('nogate_mylist'),
  watch: localStorage.getItem('nogate_watch'),
  reactions: localStorage.getItem('nogate_reactions'),
});

// Restore
const data = JSON.parse(backup);
localStorage.setItem('nogate_mylist', data.mylist);
```

### Clear All Data
```javascript
// Clear specific app data
['nogate_mylist', 'nogate_watch', 'nogate_reactions'].forEach(key => {
  localStorage.removeItem(key);
});

// Clear all
localStorage.clear();
```

## Accessibility Tips

### Keyboard Navigation
- Tab: Next element
- Shift+Tab: Previous element
- Enter: Activate button
- Space: Activate button/toggle
- Escape: Close modal

### Testing with Screen Reader
- macOS: VoiceOver (Cmd+F5)
- Windows: Narrator (Win+Ctrl+Enter)
- Linux: Orca

### Accessibility Checklist
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] ARIA labels for non-text content
- [ ] Color contrast >= 4.5:1
- [ ] No keyboard traps
- [ ] Semantic HTML used

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Type check only
npm run type-check

# Run with strict mode
npx tsc --noEmit
```

### Styling Issues
```bash
# CSS Modules specific class names
// Check actual class name in DevTools
// Format: [filename]__[classname]__[hash]
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [MDN Web Docs](https://developer.mozilla.org)
- [Can I Use](https://caniuse.com)

---

Happy coding! Feel free to extend this guide with more tips and tricks. 🚀
