/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./*.js",
    "./**/*.js",
    "./css/**/*.css",
  ],
  safelist: [
    // Position and layout
    'fixed', 'absolute', 'relative', 'sticky', 'static',
    'top-0', 'bottom-5', 'right-5', 'left-0', 'top-50%', 'left-50%',
    'inset-0', 'z-50', 'z-100', 'z-10000', 'z-10001', 'z-[10002]',

    // Display and flexbox
    'block', 'flex', 'inline-flex', 'hidden', 'grid', 'inline-block',
    'flex-col', 'items-center', 'justify-center', 'justify-between',
    'flex-1', 'flex-shrink-0', 'min-w-0',

    // Spacing
    'p-4', 'px-6', 'py-4', 'px-4', 'pt-1', 'pb-6', 'm-1', 'm-2', 'mx-auto',
    'px-3', 'py-2', 'gap-3', 'gap-2', 'gap-4', 'gap-1', 'space-y-2',

    // Sizing
    'w-70', 'h-70', 'w-15', 'h-15', 'w-10', 'h-10', 'w-8', 'h-8',
    'w-5', 'h-5', 'w-4', 'h-4', 'w-3.5', 'h-3.5', 'w-1', 'h-1',
    'w-0.75', 'h-0.75', 'w-1.25', 'h-1.25', 'w-2', 'h-2', 'w-2.25', 'h-2.25',
    'w-full', 'h-full', 'max-w-800', 'max-w-full', 'min-w-40', 'min-h-0',
    'aspect-ratio-1',

    // Colors and backgrounds
    'bg-white', 'bg-black', 'bg-gray-100', 'bg-gray-600', 'bg-gray-700',
    'bg-black/70', 'bg-white/95', 'bg-gray-800/95', 'bg-black/60',
    'bg-gradient-to-br', 'from-blue-500', 'to-purple-600',
    'bg-[var(--bg-primary)]', 'bg-[var(--bg-secondary)]', 'bg-[var(--bg-tertiary)]',
    'bg-blue-600', 'hover:bg-blue-700', 'bg-red-100', 'bg-green-100',
    'bg-purple-100', 'bg-orange-100', 'bg-white/30',

    // Text colors
    'text-white', 'text-gray-600', 'text-gray-400', 'text-gray-300',
    'text-[var(--text-primary)]', 'text-[var(--text-secondary)]',
    'theme-text-primary', 'theme-text-secondary',

    // Borders
    'border', 'border-2', 'border-gray-300', 'border-gray-600',
    'border-gray-200/80', 'border-gray-600/80', 'border-blue-500',
    'border-[var(--border-primary)]', 'border-slate-400', 'border-slate-600',

    // Border radius
    'rounded-full', 'rounded-xl', 'rounded-lg', 'rounded-md', 'rounded-sm',
    'rounded-none',

    // Shadows
    'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-none',

    // Typography
    'text-2xl', 'text-lg', 'text-base', 'text-sm', 'text-xs',
    'font-bold', 'font-semibold', 'font-medium', 'font-normal',
    'text-center', 'text-left', 'uppercase', 'tracking-wide',

    // Interactions
    'cursor-pointer', 'cursor-not-allowed', 'pointer-events-none',
    'hover:bg-gray-200', 'hover:bg-gray-600', 'hover:border-blue-500',
    'hover:shadow-lg', 'hover:-translate-y-1', 'hover:bg-[var(--bg-tertiary)]',
    'hover:bg-blue-700', 'active:scale-95',

    // Transitions and animations
    'transition-all', 'transition-colors', 'transition-transform',
    'duration-300', 'duration-150', 'duration-200', 'ease-out',

    // Opacity and transforms
    'opacity-0', 'opacity-100', 'opacity-70', 'opacity-90',
    'translate-y-28', 'translate-y-0', 'translate-x-1/2', 'translate-y-1/2',
    'scale-95', 'scale-1', 'scale-1.05', 'rotate-180',

    // Grid
    'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4', 'p-4',

    // Backdrop and filters
    'backdrop-blur-lg', 'backdrop-blur-md', '-webkit-backdrop-filter-blur-20px',
    '-webkit-backdrop-filter-blur-10px',

    // Layout containers
    'min-h-screen', 'max-w-full', 'overflow-hidden', 'overflow-visible',
    'overflow-y-auto',

    // Positioning
    'sticky', 'top-0', 'z-100', 'relative', 'absolute',

    // Special classes
    'object-cover', 'break-words', 'resize-vertical', 'no-underline',
    'user-select-none', '-webkit-tap-highlight-transparent', 'lazy-loading',
    'loaded', 'flux-shnel-hidden', 'has-image', 'need-image', 'selected',
    'active', 'collapsed', 'expanded', 'show', 'hide', 'fade-in',
    'fade-out', 'animate-in', 'animate-out', 'pulse', 'spin', 'loading',
    'visible', 'invisible', 'glassmorphism-animate-in',

    // Responsive prefixes
    'md:grid-cols-2', 'lg:grid-cols-3', 'max-w-95vw', 'w-95vw',
    'md:flex', 'md:hidden', 'sm:px-4',

    // Dark mode variants
    'dark:bg-gray-800', 'dark:bg-gray-700', 'dark:text-gray-300',
    'dark:text-gray-400', 'dark:border-gray-600', 'dark:bg-gray-800/95',
    'dark:border-gray-600/80', 'dark:hover:bg-gray-600',

    // Theme variants
    'theme-bg-primary', 'theme-bg-secondary', 'theme-bg-tertiary',
    'theme-text-primary', 'theme-text-secondary', 'theme-border-primary',

    // Button variants
    'btn', 'btn-primary', 'btn-secondary', 'btn:focus', 'btn:disabled',
    'btn-primary:hover:not(:disabled)', 'dark:btn-primary',

    // Card variants
    'card', 'card-header', 'card-body', 'card-footer', 'dark:card',

    // Modal variants
    'modal', 'modal-overlay', 'modal-backdrop', 'dark:modal',

    // Input variants
    'input', 'input:focus', 'label',

    // Utility variants
    'hidden', 'visible', 'loading', 'status-success', 'status-error',
    'status-warning', 'status-info',

    // Special sizing
    'w-70', 'h-70', 'w-95', 'h-30', 'w-60', 'h-60',

    // Animation delays
    'animation-delay-0.2s', 'animation-delay-0.7s', 'animation-delay-1.1s',

    // Custom widths
    'w-70', 'h-70', 'w-15', 'h-15', 'w-1.25', 'h-1.25',

    // Special positioning
    'top-15%', 'left-25%', 'top-70%', 'right-20%', 'bottom-20%', 'left-15%',

    // Focus styles
    'focus:outline-none', 'focus:border-blue-500', 'focus:ring-0',

    // Scroll behavior
    'scroll-smooth', 'scroll-behavior-smooth',

    // Container queries
    'container', 'md:container',

    // Responsive design - adaptive padding/sizing
    'xs:inline', 'sm:px-4', 'sm:py-3', 'lg:px-6', 'lg:py-4',
    'px-3', 'py-2.5', 'sm:p-4', 'lg:p-6', 'xl:p-8',
    'max-w-[1600px]', 'xl:grid-cols-4',
    'sm:gap-3', 'sm:p-3', 'lg:gap-4',
    'gap-2', 'p-2', 'sm:p-3',
    'w-10', 'h-10', 'sm:w-[50px]', 'sm:h-[50px]', 'lg:w-[70px]', 'lg:h-[70px]',
    'py-6', 'sm:py-8', 'sm:px-6',

    // AI Coach specific explicit safelist (because JIT might miss dynamic JS)
    'top-20', 'bottom-5', 'w-72', 'min-h-0',
    'md:flex-row', 'md:max-w-6xl', 'md:left-10', 'md:right-10', 'left-4', 'right-4',
    'bg-[#0f172a]/95', 'bg-[#1e293b]/50', 'bg-[#1e293b]/30',
    'border-r', 'border-b-0', 'flex-1', 'mx-auto',
    'z-[10003]', 'overflow-y-auto', 'overflow-hidden',
    'backdrop-blur-2xl', 'backdrop-saturate-150', 'bg-white/75',
    'dark:bg-slate-950/45', 'dark:border-white/10', 'border-black/5',
    'dark:shadow-2xl', 'dark:shadow-black/80', 'ring-1', 'ring-white/10',
  ],
  darkMode: ['selector', '[data-theme="dark"]'], // Используем data-theme атрибут для темной темы
  theme: {
    extend: {
      // Цветовая палитра на основе CSS переменных для поддержки тем
      colors: {
        // Основные цвета через CSS переменные
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        // Фоновые цвета через переменные
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        // Цвета текста через переменные
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        // Цвета границ через переменные
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },
        // Акцентные цвета
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
        },
        // Extended colors (сохраняем для совместимости)
        cyan: '#26a8ff',
        indigo: '#6366f1',
        purple: '#8b5cf6',
        'purple-light': '#a855f7',
        // Gray scale (сохраняем для совместимости)
        // Gray scale (Zinc/Neutral 2026 update)
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
        // Semantic colors
        success: {
          500: '#10b981',
          green: '#28a745',
        },
        error: {
          500: '#ef4444',
          red: '#dc2626',
        },
        warning: {
          500: '#f59e0b',
          orange: '#ffc107',
        },
        // Component colors
        btn: {
          blue: '#007bff',
          gray: '#6c757d',
        },
        // Use standard Tailwind colors for now
        tab: {
          border: '#dee2e6',
          bg: '#f8f9fa',
          'dark-bg': '#343a40',
          'dark-text': '#adb5bd',
          'dark-hover-bg': '#495057',
          'dark-hover-text': '#ced4da',
        },
        // Modal colors
        modal: {
          bg: 'rgba(255, 255, 255, 0.95)',
          'bg-dark': 'rgba(30, 41, 59, 0.95)',
        },
        overlay: {
          bg: 'rgba(0, 0, 0, 0.6)',
          blur: 'rgba(255, 255, 255, 0.1)',
          'blur-dark': 'rgba(255, 255, 255, 0.1)',
        },
        // Plan card colors
        plan: {
          lite: '#00d4ff',
          pro: '#ff6b35',
          studio: '#ff4081',
          badge: 'linear-gradient(135deg, #ff6b35, #f7931e, #ff4081)',
        },
        // Cost badge colors
        cost: {
          premium: 'var(--cost-premium)',
          free: 'var(--cost-free)',
          standard: 'var(--cost-standard)',
        },
        // Button colors
        btn: {
          blue: 'var(--btn-blue)',
          gray: 'var(--btn-gray)',
        },
        // Accent colors with RGB
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
        },
      },
      // Gradient backgrounds
      backgroundImage: {
        'primary': 'linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-cyan) 100%)',
        'secondary': 'linear-gradient(135deg, var(--primary-indigo) 0%, var(--primary-purple) 100%)',
        'accent': 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-purple-light) 100%)',
        'success': 'linear-gradient(135deg, var(--success-green) 0%, var(--success-500) 100%)',
        'warning': 'linear-gradient(135deg, var(--warning-orange) 0%, var(--warning-500) 100%)',
        'error': 'linear-gradient(135deg, var(--error-red) 0%, var(--error-500) 100%)',
      },
      // Box shadows
      boxShadow: {
        xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'glow-primary': '0 0 20px rgba(59, 130, 246, 0.6)',
        'glow-secondary': '0 0 20px rgba(147, 51, 234, 0.6)',
        // AI Coach specific shadows
        'ai-golden': '0 8px 25px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4)',
        'ai-golden-sustained': '0 4px 15px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.3)',
        'ai-golden-dimmed': '0 2px 8px rgba(255, 215, 0, 0.3), 0 0 10px rgba(255, 215, 0, 0.15)',
        'ai-pink': '0 4px 15px rgba(236, 72, 153, 0.3)',
        'ai-pink-hover': '0 6px 20px rgba(236, 72, 153, 0.4)',
        'ai-purple': '0 3px 8px rgba(102, 126, 234, 0.4)',
        // Modal shadows
        'modal': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'modal-dark': '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 10px 40px rgba(15, 23, 42, 0.5)',
        // Slider and control shadows
        'slider': '0 2px 6px rgba(0, 0, 0, 0.2)',
        'slider-hover': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'slider-active': '0 4px 12px rgba(0, 0, 0, 0.3)',
        // Credit packs shadows
        'credit-pack': '0 8px 25px rgba(59, 130, 246, 0.15)',
        // Style card focus shadows
        'style-focus': '0 0 0 2px rgba(14, 165, 233, 0.3)',
        'style-focus-active': '0 0 0 2px var(--primary-500)',
        // Badge shadows
        'badge-premium': '0 2px 4px rgba(255, 215, 0, 0.3)',
        'badge-free': '0 2px 4px rgba(0, 255, 0, 0.4)',
        'badge-standard': '0 2px 4px rgba(100, 181, 246, 0.15)',
      },
      // Border radius
      borderRadius: {
        none: '0',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Spacing system
      spacing: {
        '0': '0',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '3.5': '0.875rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
      },
      // Font sizes
      fontSize: {
        'xs': ['0.75rem', '1rem'],
        's': ['0.8rem', '1.2rem'],
        'sm': ['0.875rem', '1.25rem'],
        'base': ['1rem', '1.5rem'],
        'lg': ['1.125rem', '1.75rem'],
        'xl': ['1.25rem', '1.75rem'],
        '2xl': ['1.5rem', '2rem'],
        '3xl': ['1.875rem', '2.25rem'],
        '4xl': ['2.25rem', '2.5rem'],
        '5xl': ['3rem', '1'],
        '6xl': ['3.75rem', '1'],
        '7xl': ['4.5rem', '1'],
        '8xl': ['6rem', '1'],
        '9xl': ['8rem', '1'],
      },
      // Font weights
      fontWeight: {
        thin: '100',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      // Line heights
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
      },
      // Letter spacing
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
      // Transitions
      transitionDuration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      // Breakpoints - совпадают с существующими
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1920px',
      },
      // Typography
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
