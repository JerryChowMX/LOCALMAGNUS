# 🎨 MAGNUS Design System

**Version:** 1.0.0  
**Last Updated:** 2025-12-04  
**Status:** Production

> Complete design system documentation for MAGNUS - Vanguardia's mobile-first news application

---

## 📋 Table of Contents

1. [Design Tokens](#design-tokens)
2. [Component Library](#component-library)
3. [Iconography](#iconography)
4. [Layout System](#layout-system)
5. [Dark Mode Guidelines](#dark-mode-guidelines)
6. [Feedback Patterns](#feedback-patterns)
7. [Accessibility Standards](#accessibility-standards)
8. [Performance Guidelines](#performance-guidelines)

---

## 🎨 Design Tokens

### Colors

#### Light Mode
```css
/* Backgrounds */
--bg-primary: #FFFFFF;        /* Main app background */
--bg-secondary: #F5F5F5;      /* Cards, surfaces */
--bg-tertiary: #E5E5E5;       /* Elevated surfaces */

/* Text */
--text-primary: #111111;      /* Headlines, primary content */
--text-secondary: #666666;    /* Body text, descriptions */
--text-disabled: #999999;     /* Disabled states */

/* Brand */
--color-brand-orange: #FF6600; /* Vanguardia primary brand color */

/* Accents */
--color-accent: #0076ab;      /* Default accent (Updated Blue) */
--color-accent-teal: #00C7BE; /* Teal variant */
--color-accent-violet: #5E5CE6; /* Violet variant */
```

#### Dark Mode
```css
/* Backgrounds - Surface Hierarchy */
--bg-primary: #0A0A0A;        /* Main app background */
--bg-secondary: #1A1A1A;      /* Cards, surfaces */
--bg-tertiary: #252525;       /* Elevated surfaces */
--bg-elevated: #303030;       /* Modals, dropdowns */

/* Text - High Contrast */
--text-primary: #FFFFFF;      /* Headlines (21:1 contrast) */
--text-secondary: #D1D1D6;    /* Body text (14:1 contrast) */
--text-tertiary: #A8A8AD;     /* Captions (8.5:1 contrast) */
--text-disabled: #6E6E73;     /* Disabled (4.8:1 contrast) */

/* Borders - Visible Separation */
--border-primary: #3A3A3A;    /* Visible borders */
--border-secondary: #2A2A2A;  /* Subtle dividers */
--border-subtle: rgba(255, 255, 255, 0.1); /* Inner separators */

/* Brand */
--color-brand-orange: #FF8533; /* Lighter for dark backgrounds */

/* Accents - Brighter for Dark */
--color-accent: #4DA6DE;      /* Lighter blue for dark mode */
--color-accent-teal: #64D2FF; /* Lighter teal */
--color-accent-violet: #7D7AFF; /* Lighter violet */
```

### Typography

```css
/* Font Families */
--font-family-display: "Blinker", system-ui, sans-serif;
--font-family-body: "Inter", system-ui, sans-serif;
--font-family-title: "Inter", system-ui, sans-serif;

/* Font Sizes - Medium (Default) */
--font-size-caption: 12px;
--font-size-body: 15px;
--font-size-h3: 18px;
--font-size-h2: 21px;
--font-size-h1: 26px;

/* Font Weights */
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line Heights */
--line-height-tight: 1.3;
--line-height-normal: 1.5;
--line-height-relaxed: 1.6;
```

### Spacing System

Based on 8px grid for consistency:

```css
--spacing-xs: 4px;    /* Tight spacing, icon gaps */
--spacing-sm: 8px;    /* Small gaps, compact layouts */
--spacing-md: 12px;   /* Default spacing */
--spacing-lg: 16px;   /* Section spacing */
--spacing-xl: 24px;   /* Large gaps between sections */
--spacing-2xl: 32px;  /* Major section breaks */
--spacing-3xl: 48px;  /* Page-level spacing */
```

### Border Radius

```css
--radius-sm: 4px;     /* Small elements */
--radius-md: 8px;     /* Default */
--radius-input: 10px; /* Input fields */
--radius-btn: 12px;   /* Buttons */
--radius-lg: 16px;    /* Cards */
--radius-xl: 24px;    /* Images, glass surfaces */
--radius-full: 9999px; /* Pills, circular */
```

### Shadows & Elevation

```css
/* Light Mode */
--shadow-1: 0px 4px 12px rgba(0, 0, 0, 0.08);  /* Cards */
--shadow-2: 0px 6px 18px rgba(0, 0, 0, 0.12);  /* Floating buttons */
--shadow-3: 0px 10px 32px rgba(0, 0, 0, 0.18); /* Modals */

/* Dark Mode */
--shadow-1: 0px 4px 12px rgba(0, 0, 0, 0.6);
--shadow-2: 0px 6px 18px rgba(0, 0, 0, 0.7);
--shadow-3: 0px 10px 32px rgba(0, 0, 0, 0.8);
```

### Glassmorphism

```css
/* Light Mode */
--glass-blur: 16px;
--glass-bg: rgba(255, 255, 255, 0.75);
--glass-border: rgba(255, 255, 255, 0.4);
--glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);

/* Dark Mode */
--glass-bg: rgba(26, 26, 26, 0.8);
--glass-border: rgba(255, 255, 255, 0.15);
--glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
```

---

## 🧩 Component Library

### Button Component

**Variants:** `primary`, `secondary`, `ghost`, `glass`  
**Sizes:** `sm`, `md`, `lg`

```tsx
// Primary Button
<Button variant="primary" size="md">Suscribirse</Button>

// Secondary Button
<Button variant="secondary" size="md">Cancelar</Button>

// Ghost Button (transparent)
<Button variant="ghost" size="sm">Ver más</Button>

// Glass Button (glassmorphism)
<Button variant="glass" size="md">Compartir</Button>
```

**Design Specs:**
- **Touch Target:** Minimum 44x44px (WCAG AA)
- **Padding:** sm: 8px 16px, md: 12px 24px, lg: 16px 32px
- **Border Radius:** `var(--radius-btn)` (12px)
- **Font Weight:** `var(--font-weight-semibold)` (600)
- **Transition:** 150ms ease for hover/active states

### Input Components

#### TextInput

```tsx
<TextInput 
  label="Correo electrónico"
  placeholder="tu@email.com"
  error="El correo no es válido"
/>
```

**Design Specs:**
- **Height:** 48px minimum (touch-friendly)
- **Padding:** 12px 16px
- **Border Radius:** `var(--radius-input)` (10px)
- **Border:** 1px solid `var(--border-primary)`
- **Error State:** Red border + error text below
- **Focus State:** 2px border with accent color

#### SearchBar

```tsx
<SearchBar 
  placeholder="Buscar noticias..."
  onSearch={handleSearch}
/>
```

**Design Specs:**
- **Height:** 44px
- **Icon:** 20px search icon, left-aligned
- **Clear Button:** Shows when input has value
- **Border Radius:** `var(--radius-full)` for pill shape

### Card Component

```tsx
<Card padding="md" onClick={handleClick}>
  {children}
</Card>
```

**Padding Options:** `none`, `sm` (8px), `md` (16px), `lg` (24px)

**Design Specs:**
- **Background:** `var(--bg-secondary)`
- **Border Radius:** `var(--radius-lg)` (16px)
- **Shadow:** `var(--shadow-1)`
- **Interactive:** Add hover state with `var(--shadow-2)`
- **Transition:** 250ms ease for hover

### Modal Component

**Sizes:** `small`, `medium`, `fullscreen`

```tsx
<Modal 
  isOpen={isOpen}
  onClose={handleClose}
  size="medium"
  title="Compartir artículo"
>
  {children}
</Modal>
```

**Design Specs:**
- **Backdrop:** rgba(0, 0, 0, 0.5) with backdrop-filter blur
- **Container:** `var(--bg-elevated)` background
- **Border Radius:** `var(--radius-xl)` (24px) for small/medium
- **Shadow:** `var(--shadow-3)`
- **Padding:** 24px
- **Max Width:** small: 400px, medium: 600px, fullscreen: 100vw
- **Animation:** Slide up from bottom (mobile-first)

### Toast Notification

**Types:** `success`, `error`, `warning`, `info`

```tsx
<Toast 
  type="success"
  message="Artículo guardado correctamente"
  duration={3000}
/>
```

**Design Specs:**
- **Position:** Bottom center (mobile), top-right (desktop)
- **Height:** 56px minimum
- **Padding:** 16px 20px
- **Border Radius:** `var(--radius-lg)` (16px)
- **Icon:** 20px, left-aligned
- **Duration:** 3 seconds default
- **Animation:** Slide in from bottom, fade out

### Loading States

#### Spinner

```tsx
<Spinner size="md" />
```

**Sizes:** `sm` (16px), `md` (24px), `lg` (40px)

**Design Specs:**
- **Color:** `var(--color-accent)`
- **Stroke Width:** 2px
- **Animation:** Rotate 360deg in 1s

#### Skeleton Loader

```tsx
<Skeleton variant="text" width="100%" />
<Skeleton variant="card" height="200px" />
<Skeleton variant="image" aspectRatio="16/9" />
```

**Design Specs:**
- **Background:** `var(--bg-tertiary)`
- **Animation:** Shimmer effect (gradient moving left to right)
- **Border Radius:** Match content type (text: 4px, card: 16px)

### Navigation Components

#### BottomTabBar

```tsx
<BottomTabBar activeTab="noticias">
  <TabItem icon={HomeIcon} label="Inicio" />
  <TabItem icon={NewsIcon} label="Noticias" />
  <TabItem icon={PaperIcon} label="EPaper" />
  <TabItem icon={ProfileIcon} label="Perfil" />
</BottomTabBar>
```

**Design Specs:**
- **Height:** 64px (includes safe area)
- **Background:** `var(--bg-secondary)` with blur
- **Border Top:** 1px solid `var(--border-secondary)`
- **Icon Size:** 24px
- **Label Font:** `var(--font-size-caption)` (12px)
- **Active Color:** `var(--color-brand-orange)`
- **Inactive Color:** `var(--text-secondary)`
- **Safe Area:** Add `env(safe-area-inset-bottom)`

#### TopNavBar

```tsx
<TopNavBar 
  title="Noticias"
  showBack={true}
  onBack={handleBack}
  actions={<ShareButton />}
/>
```

**Design Specs:**
- **Height:** 56px + safe area top
- **Background:** `var(--bg-primary)` or transparent
- **Border Bottom:** 1px solid `var(--border-secondary)` (optional)
- **Title Font:** `var(--font-size-h2)` (21px), semibold
- **Back Button:** 24px icon, 44x44px touch target
- **Actions:** Right-aligned, 44x44px touch targets

---

## 🎯 Iconography

### Icon Library

**Primary:** [Lucide React](https://lucide.dev)  
**Fallback:** Heroicons for missing icons

### Icon Sizes

```css
--icon-xs: 16px;  /* Inline with text */
--icon-sm: 20px;  /* Buttons, small UI */
--icon-md: 24px;  /* Default, tab bars */
--icon-lg: 32px;  /* Feature highlights */
--icon-xl: 48px;  /* Empty states, onboarding */
```

### Icon Usage

```tsx
import { Share2, Heart, Bookmark } from 'lucide-react';

// Default size (24px)
<Share2 size={24} />

// Using design tokens
<Heart size={20} color="var(--color-brand-orange)" />

// Stroke width: 2px (default)
<Bookmark size={24} strokeWidth={2} />
```

### Icon Colors

- **Default:** `var(--text-secondary)`
- **Active:** `var(--color-brand-orange)` or `var(--color-accent)`
- **Disabled:** `var(--text-disabled)`
- **On Primary Button:** `#FFFFFF`

### Icon States

- **Default:** Secondary text color
- **Hover:** Slight opacity change (0.8)
- **Active:** Brand orange with filled variant (if available)
- **Disabled:** Disabled text color + 50% opacity

---

## 📐 Layout System

### Grid System

```css
/* Mobile (< 768px) */
--grid-columns: 4;
--grid-gutter: 16px;

/* Tablet (768px - 1024px) */
--grid-columns: 8;
--grid-gutter: 24px;

/* Desktop (> 1024px) */
--grid-columns: 12;
--grid-gutter: 24px;
```

### Content Max-Width

```css
/* Article text - optimal reading length */
--content-max-width: 680px;

/* Full-width content (images, videos) */
--content-full-width: 100%;

/* Centered containers */
--container-max-width: 1440px;
```

### Safe Areas (Mobile)

Always account for notches and system UI:

```css
/* Top safe area */
padding-top: calc(env(safe-area-inset-top) + 16px);

/* Bottom safe area */
padding-bottom: calc(env(safe-area-inset-bottom) + 16px);

/* Sides safe area */
padding-left: calc(env(safe-area-inset-left) + 16px);
padding-right: calc(env(safe-area-inset-right) + 16px);
```

### Breakpoints

```css
--breakpoint-xs: 320px;   /* Small phones */
--breakpoint-sm: 375px;   /* Standard phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Small laptops */
--breakpoint-xl: 1440px;  /* Desktop */
```

**Usage:**

```css
/* Mobile-first approach */
.component {
  padding: var(--spacing-md);
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: var(--spacing-xl);
  }
}
```

---

## 🌙 Dark Mode Guidelines

### Surface Elevation

In dark mode, use subtle background color changes instead of heavy shadows:

```css
/* Layer hierarchy */
Level 0: #0A0A0A  /* Base */
Level 1: #1A1A1A  /* Cards */
Level 2: #252525  /* Elevated cards */
Level 3: #303030  /* Modals, dropdowns */
```

**Rule:** Avoid pure black (#000000) - use #0A0A0A for reduced eye strain

### Image Handling

For bright images in dark mode:

```css
/* Apply subtle overlay */
.image-dark-mode {
  position: relative;
}

.image-dark-mode::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  pointer-events: none;
}

/* Or reduce opacity */
[data-theme='dark'] img {
  opacity: 0.9;
}
```

### Color Intensity

- Reduce saturation of accent colors by 10-15% in dark mode
- Increase contrast for text (use #FFFFFF instead of #F5F5F5)
- Brighten brand colors slightly for visibility

### Borders vs Shadows

- **Light Mode:** Use shadows for depth
- **Dark Mode:** Use borders + subtle shadows
- Always add visible borders in dark mode: `1px solid var(--border-primary)`

---

## 💬 Feedback Patterns

### Error States

```tsx
<TextInput 
  error="El correo electrónico no es válido"
/>
```

**Design Specs:**
- **Color:** `var(--text-error)` (#FF6B6B in dark mode)
- **Icon:** AlertCircle (Lucide), 16px
- **Position:** Below input field, left-aligned
- **Typography:** `var(--font-size-caption)`, `var(--font-weight-medium)`
- **Spacing:** 4px gap from input

### Success States

```tsx
<Toast type="success" message="Artículo guardado correctamente" />
```

**Design Specs:**
- **Color:** `var(--text-success)` (#6BFF6B in dark mode)
- **Icon:** CheckCircle (Lucide), 20px
- **Duration:** 3 seconds (toast), persistent (inline)
- **Background:** `var(--bg-success)` with border

### Loading States

**For Content (Cards, Text):**
- Use skeleton loaders
- Match the shape of the content
- Shimmer animation

**For Actions (Buttons, Infinite Scroll):**
- Use spinners
- Show in button: "Cargando..."
- Bottom of list: centered spinner

**Rule:** Never block entire screen unless critical operation (login, payment)

### Empty States

```tsx
<EmptyState 
  icon={<InboxIcon size={48} />}
  title="No hay artículos guardados"
  description="Los artículos que guardes aparecerán aquí"
  action={<Button>Explorar noticias</Button>}
/>
```

**Design Specs:**
- **Icon:** 48px, `var(--text-tertiary)`
- **Title:** `var(--font-size-h2)`, semibold
- **Description:** `var(--font-size-body)`, `var(--text-secondary)`
- **Spacing:** 16px between elements
- **Max Width:** 320px, centered

---

## ♿ Accessibility Standards

### Contrast Ratios (WCAG AA)

- **Normal Text:** Minimum 4.5:1
- **Large Text (18px+):** Minimum 3:1
- **UI Components:** Minimum 3:1

### Touch Targets

- **Minimum Size:** 44x44px (WCAG AAA)
- **Spacing:** 8px minimum between targets
- **Exception:** Inline text links can be smaller

### Focus States

All interactive elements must have visible focus states:

```css
.button:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

### Screen Reader Support

```tsx
// Always include ARIA labels
<button aria-label="Compartir artículo">
  <Share2 size={20} />
</button>

// Use semantic HTML
<nav aria-label="Navegación principal">
  <ul>...</ul>
</nav>

// Announce dynamic content
<div role="status" aria-live="polite">
  Artículo guardado
</div>
```

### Keyboard Navigation

- **Tab:** Navigate between interactive elements
- **Enter/Space:** Activate buttons
- **Escape:** Close modals/dialogs
- **Arrow Keys:** Navigate lists/menus

---

## ⚡ Performance Guidelines

### Image Optimization

```tsx
// Use WebP with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>

// Lazy load images below fold
<img loading="lazy" src="image.jpg" alt="Description" />

// Provide placeholder
<Skeleton variant="image" aspectRatio="16/9" />
```

### Animation Performance

**Use GPU-accelerated properties only:**

```css
/* ✅ Good - GPU accelerated */
.element {
  transform: translateY(10px);
  opacity: 0.8;
}

/* ❌ Bad - Causes reflow */
.element {
  top: 10px;
  height: 200px;
}
```

### Respect User Preferences

```css
/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Timings

```css
--transition-fast: 150ms;   /* Hover, focus */
--transition-base: 250ms;   /* Default */
--transition-slow: 350ms;   /* Complex animations */

--easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
--easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
--easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
```

---

## 📝 Quick Start for Developers

### 1. Use Design Tokens

```css
/* ❌ Bad */
.button {
  padding: 16px;
  background: #FF6600;
}

/* ✅ Good */
.button {
  padding: var(--spacing-lg);
  background: var(--color-brand-orange);
}
```

### 2. Use Components, Not HTML

```tsx
// ❌ Bad
<button style={{padding: '12px 24px'}}>Click</button>

// ✅ Good
<Button variant="primary" size="md">Click</Button>
```

### 3. Mobile-First Responsive

```css
/* ✅ Good - Mobile first */
.card {
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .card {
    padding: var(--spacing-xl);
  }
}
```

### 4. Always Test Dark Mode

Every component must work in both light and dark themes.

---

## 🔄 Design System Evolution

### Deprecation Process

1. Mark old token/component as deprecated in docs
2. Provide migration path to new pattern
3. Give 2-week notice before removal
4. Update all internal usage before deprecating

### Version Naming

- **Major (2.0.0):** Breaking changes (color palette overhaul)
- **Minor (1.1.0):** New components or tokens added
- **Patch (1.0.1):** Bug fixes or small adjustments

### Change Log

Maintain `DESIGN_CHANGELOG.md` with:
- Date of change
- What changed (before/after)
- Migration guide
- Affected components

---

## 🎯 Design Principles

1. **Mobile-First:** Design for 375px screens first, scale up
2. **Accessibility:** WCAG AA minimum, AAA preferred
3. **Consistency:** Use design tokens, never hardcode
4. **Performance:** Optimize images, use GPU-accelerated animations
5. **Dark Mode:** Every component must support both themes
6. **Touch-Friendly:** 44x44px minimum touch targets
7. **Readability:** Max 65 characters per line for body text

---

**Questions?** Contact the design system team or open an issue in the repository.
