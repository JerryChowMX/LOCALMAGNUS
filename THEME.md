# Theme System

Magnus uses a strict Design Token system. All styling must flow from `src/theme/tokens.ts`.

## Tokens

Tokens are available as JS objects in `src/theme/tokens.ts` and as CSS variables in `src/theme/theme.css`.

### Colors
- `primary`
- `accent`
- `textPrimary`
- `textSecondary`
- `background`
- `surface`
- `success`
- `error`

### Spacing
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

### Radii
- `sm`: 4px
- `md`: 8px
- `lg`: 16px
- `full`: 9999px

### Typography
- `fontFamilies`: sans, serif, mono
- `fontSizes`: xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl
- `fontWeights`: regular, medium, semibold, bold
- `lineHeights`: tight, snug, normal, relaxed

## Usage

Use CSS variables in your CSS files:

```css
.my-component {
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border-radius: var(--radius-sm);
}
```
