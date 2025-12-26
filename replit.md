# MokamelFitPro - AI Bodybuilding Assistant

## Overview
A React-based AI fitness and bodybuilding assistant application that uses Google's Gemini AI to generate personalized fitness plans, nutrition advice, and supplement recommendations. The app is designed for Persian (Farsi) speaking users.

## Project Architecture
- **Frontend**: React 19 with TypeScript, Vite build system
- **Styling**: Tailwind CSS (via CDN)
- **AI Integration**: Google Gemini API (@google/genai)
- **Charts**: Recharts for data visualization

## Key Files
- `App.tsx` - Main application component with routing logic
- `vite.config.ts` - Vite configuration (port 5000, allows all hosts)
- `services/geminiService.ts` - Gemini AI integration
- `components/` - React components (Hero, Assessment, Dashboard, etc.)
- `context/AuthContext.tsx` - Authentication context

## Environment Variables Required
- `GEMINI_API_KEY` - Google Gemini API key for AI features

## Development
Run the dev server:
```bash
npm run dev
```
The app runs on port 5000 with host 0.0.0.0 to work with Replit's proxy.

## Build
```bash
npm run build
```

## Recent Changes
- 2025-12-26: Initial Replit setup - configured Vite for port 5000 with allowedHosts: true
