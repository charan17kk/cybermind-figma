# Next.js Theme App

A modern Next.js application with TypeScript, Tailwind CSS, and comprehensive theme support (light/dark modes).

## Features

- 🎨 **Theme Support**: Light and dark theme modes with smooth transitions
- 🔄 **System Preference Detection**: Automatically detects user's system theme preference
- 💾 **Persistent Theme Selection**: Remembers user's theme choice across sessions
- 🎯 **TypeScript**: Fully typed for better development experience
- 🎨 **Tailwind CSS**: Modern utility-first CSS framework
- 📱 **Responsive Design**: Mobile-friendly responsive layout
- ⚡ **Next.js 14**: Latest Next.js with App Router

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and theme variables
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   └── ThemeToggle.tsx      # Theme toggle button component
├── contexts/
│   └── ThemeContext.tsx     # Theme context provider
└── lib/                     # Utility functions (if needed)
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Theme System

The application uses a sophisticated theme system built with:

- **React Context**: Manages theme state across the application
- **Tailwind CSS**: CSS variables for seamless theme switching
- **Local Storage**: Persists user's theme preference
- **System Preference**: Detects and respects user's system theme

### Theme Variables

The app uses CSS custom properties for theme values:

**Light Theme (Default):**
- Background: White (`#ffffff`)
- Foreground: Dark gray
- Primary: Dark blue
- Secondary: Light gray

**Dark Theme:**
- Background: Pure Black (`#000000`)
- Foreground: Pure White (`#ffffff`)
- Primary: White
- Secondary: Dark gray cards with subtle borders

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding New Theme Colors

1. Add CSS variables to `src/app/globals.css`
2. Update Tailwind config in `tailwind.config.js`
3. Use the new colors in your components

### Modifying Theme Behavior

The theme logic is centralized in `src/contexts/ThemeContext.tsx`. You can:

- Add more theme options (e.g., system, auto)
- Customize theme detection logic
- Add theme-specific animations

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **React Context API** - State management for themes
- **CSS Custom Properties** - Dynamic theme variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).