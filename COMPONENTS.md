# Components

## Atomic Components

### Button
`src/components/Button/Button.tsx`

Props:
- `variant`: "primary" | "secondary" | "ghost"
- `size`: "sm" | "md" | "lg"
- `fullWidth`: boolean
- `loading`: boolean

### Typography
`src/components/Typography/Typography.tsx`

**Text**
- `variant`: "body" | "caption" | "small"
- `color`: "primary" | "secondary" | "accent" | "error"

**Heading**
- `level`: 1 | 2 | 3 | 4 | 5 | 6

### PageWrapper
`src/components/Layout/PageWrapper.tsx`

Layout primitive for pages. Limits max-width and adds padding.

## Layout Components

### Container
`src/components/Layout/Container.tsx`
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `padding`: boolean

### Stack
`src/components/Layout/Stack.tsx`
- `direction`: 'row' | 'column'
- `spacing`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `align`: 'start' | 'center' | 'end' | 'stretch'
- `justify`: 'start' | 'center' | 'end' | 'between' | 'around'
- `wrap`: boolean

### Grid
`src/components/Layout/Grid.tsx`
- `columns`: 1 | 2 | 3 | 4 | 12
- `gap`: "sm" | "md" | "lg"

### Section
`src/components/Layout/Section.tsx`
- `padding`: "none" | "sm" | "md" | "lg"
- `background`: "default" | "surface" | "highlight"

### Spacer
`src/components/Layout/Spacer.tsx`
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
- `axis`: 'vertical' | 'horizontal'

## Typography Components
`src/components/Typography/Typography.tsx`

- `Display`
- `Headline` (level 1-6)
- `Title`
- `Subtitle`
- `Body` (size lg, md, sm)
- `Caption`
- `Overline`

## Molecules

### Pagination
`src/components/Pagination/Pagination.tsx`
- `currentPage`: number
- `pageCount`: number
- `onPageChange`: (page: number) => void
- `onNext`: () => void
- `onPrev`: () => void

## Feature Components (Articles)

### NewsCard
`src/modules/articles/components/NewsCard.tsx`
- `article`: Article
- `variant`: 'standard' | 'featured' | 'compact'

### Tag
`src/modules/articles/components/Tag.tsx`
- `label`: string
