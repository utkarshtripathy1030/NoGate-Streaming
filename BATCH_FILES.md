# Batch Files Guide

This directory contains Windows batch files for easy project management.

## Files

### 1. `launch.bat` - Project Launcher Menu
**Purpose**: Interactive menu for all common development tasks

**Usage**: Double-click `launch.bat` or run:
```bash
launch.bat
```

**Options**:
- 1: Install Dependencies
- 2: Start Development Server
- 3: Build for Production
- 4: Preview Production Build
- 5: Run Type Checking
- 6: Lint Code
- 7: Open Project in Explorer
- 8: Clean Node Modules
- 9: Exit

### 2. `dev.bat` - Quick Start Development
**Purpose**: Fast way to start developing (automatically installs dependencies if needed)

**Usage**: Double-click `dev.bat` or run:
```bash
dev.bat
```

**What it does**:
1. Checks if `node_modules` exists
2. Installs dependencies if needed
3. Starts development server on http://localhost:5173

### 3. `build.bat` - Production Build
**Purpose**: Create optimized production build with verification

**Usage**: Double-click `build.bat` or run:
```bash
build.bat
```

**What it does**:
1. Removes previous build
2. Runs type checking
3. Builds for production
4. Shows build summary
5. Optionally previews the build

## Quick Start Guide

### First Time Setup
```
1. Double-click: dev.bat
   - Automatically installs dependencies
   - Starts development server
   - Opens http://localhost:5173
```

### Daily Development
```
1. Double-click: dev.bat
   - Starts dev server immediately
   - Hot reload enabled
```

### Before Deployment
```
1. Double-click: build.bat
   - Type checks your code
   - Creates optimized build
   - Shows output stats
```

### Access All Tools
```
1. Double-click: launch.bat
   - Interactive menu
   - Full control over all tasks
```

## Requirements

- Windows OS
- Node.js installed and in PATH
- npm installed

## Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your computer
- Try again

### "Command not found"
- Make sure you're in the project directory
- Check that Node.js is properly installed

### Port Already in Use
- Close other applications using port 5173
- Or use `launch.bat` and select a different command

### Build Fails
- Run `launch.bat` → Option 8 to clean node_modules
- Run `launch.bat` → Option 1 to reinstall dependencies
- Run `build.bat` again

## Tips

1. **Shortcut**: Create desktop shortcut to `dev.bat` for quick access
2. **Pinned**: Pin `launch.bat` to Start Menu for easy access
3. **Customization**: Edit batch files to add custom tasks
4. **Automation**: Schedule `build.bat` for automated builds

## Advanced Usage

### Create Additional Custom Batch File

```batch
@echo off
REM My Custom Task
call npm run my-command
pause
```

### Disable Pause
Remove the `pause` line at the end to auto-close after execution.

### Run Multiple Commands
```batch
@echo off
call npm run lint
call npm run build
pause
```

## File Descriptions

| File | Size | Purpose |
|------|------|---------|
| launch.bat | 2 KB | Interactive menu |
| dev.bat | 0.5 KB | Quick dev start |
| build.bat | 2 KB | Production build |

---

**Note**: Keep these files in the project root directory for easy access.
