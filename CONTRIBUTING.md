# Contributing to NoGate

Thank you for your interest in contributing to NoGate! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Git

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/nogate.git
cd nogate

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your TMDB API key

# Start development server
npm run dev
```

## Project Structure Guidelines

### Adding Components
1. Create component in `src/components/ComponentName.tsx`
2. Create styles in `src/components/ComponentName.module.css`
3. Export component from component file
4. Use TypeScript interfaces for props

Example:
```typescript
import React, { FC } from 'react';
import styles from './MyComponent.module.css';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return <div className={styles.container}>{title}</div>;
};
```

### Adding Hooks
1. Create hook in `src/hooks/hookName.ts`
2. Follow naming convention: `useXxx`
3. Document hook usage with JSDoc

### Adding Services
1. Create service in `src/services/serviceName.ts`
2. Export as named export or object
3. Add proper TypeScript types

### Styling
- Use CSS Modules for component styles
- Mobile-first responsive design
- Follow existing color scheme
- Test on multiple breakpoints

## Code Style

### TypeScript
- Use strict mode
- Type all function parameters
- Use interfaces for object types
- Avoid `any` type unless necessary

### React
- Use functional components
- Use hooks for state management
- Memoize callbacks with useCallback
- Lazy load components with React.lazy

### Naming Conventions
- Components: PascalCase (`MyComponent`)
- Hooks: camelCase with `use` prefix (`useMyHook`)
- Services: camelCase (`myService`)
- Constants: UPPER_SNAKE_CASE (`MY_CONSTANT`)
- CSS classes: camelCase (`.myClass`)

## Commit Guidelines

### Format
```
type(scope): description

body (optional)
footer (optional)
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Styling changes
- `docs`: Documentation
- `test`: Test updates
- `chore`: Build/tooling

### Examples
```
feat(header): add user profile dropdown
fix(modal): resolve scroll issues on mobile
docs(readme): update installation instructions
```

## Testing

### Manual Testing Checklist
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test keyboard navigation
- [ ] Test with screen readers
- [ ] Verify loading states
- [ ] Check error handling

### Browser Testing
Use BrowserStack or similar for cross-browser testing.

## Performance Guidelines

- Lazy load images with `loading="lazy"`
- Use React.memo for expensive components
- Debounce search input (300ms)
- Minimize re-renders with memoization
- Code split with React.lazy
- Optimize bundle size

## Accessibility Checklist

- [ ] Semantic HTML elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Color contrast >= 4.5:1
- [ ] Focus indicators visible
- [ ] No auto-playing audio/video
- [ ] Alt text for images

## Security

- Never commit API keys or secrets
- Use environment variables
- Validate user input
- Sanitize output
- Use HTTPS for external requests
- Follow OWASP guidelines

## Documentation

### Code Comments
```typescript
// Simple explanation for complex logic
// Use JSDoc for functions

/**
 * Fetches media details from TMDB API
 * @param type - 'movie' or 'tv'
 * @param id - Media ID
 * @returns Promise<MediaDetails>
 */
```

### README Updates
Update README.md when:
- Adding new features
- Changing project structure
- Adding new dependencies
- Modifying setup instructions

## Pull Request Process

1. **Fork** the repository
2. **Branch** from `main`
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** with meaningful messages
4. **Test** thoroughly
5. **Push** to your fork
6. **Create PR** with:
   - Clear description
   - Related issues
   - Screenshots (if UI changes)
   - Testing notes

### PR Checklist
- [ ] Code follows style guide
- [ ] No console errors/warnings
- [ ] Responsive design tested
- [ ] Accessibility tested
- [ ] Documentation updated
- [ ] No breaking changes

## Reporting Issues

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the problem

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What should happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g., macOS]
- Browser: [e.g., Chrome]
- Version: [e.g., 22]

**Additional context**
Any other context
```

### Feature Request Template
```markdown
**Is your feature related to a problem?**
Description of the problem

**Describe the solution**
How should it work?

**Describe alternatives**
Other approaches

**Additional context**
Screenshots or examples
```

## Performance Optimization

### Bundle Size
Monitor with:
```bash
npm run build
# Check dist folder size
```

### Loading Performance
- Profile with Chrome DevTools
- Aim for < 3s First Contentful Paint
- Optimize images
- Use code splitting

## Future Contributions

Priority areas for contribution:
1. Backend API integration
2. User authentication
3. Recommendations engine
4. Testing suite
5. Documentation
6. Accessibility improvements
7. Performance optimization

## Questions?

- Check existing issues
- Read the README
- Review code comments
- Open a discussion

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Happy coding! 🚀
