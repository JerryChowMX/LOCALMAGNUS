# Article Components - Production Ready

These components are production-ready, reusable components designed for Strapi CMS integration. They are extracted from the Playground and optimized for performance, accessibility, and maintainability.

## Components

### 1. ArticleQuote
A tap-to-toggle quote component with smooth animations.

**Props:**
- `quote: string` - The quote text
- `author: string` - The author name

**Features:**
- Tap/click to toggle between quote and author
- Fixed height (150px) prevents layout shift
- Smooth 450ms ease transitions
- 8px Magnus Blue left border
- Cream-orange background (#FFF6F0)
- Italic bold typography

**Usage:**
```tsx
import { ArticleQuote } from '@/components/Article';

<ArticleQuote 
    quote="Three can keep a secret, if two of them are dead."
    author="Benjamin Franklin"
/>
```

---

### 2. ArticleGallery
A clean grid gallery with integrated lightbox navigation.

**Props:**
- `images: StrapiGalleryImage[]` - Array of gallery images

**StrapiGalleryImage Interface:**
```typescript
{
    id: number;
    url: string;
    caption?: string;
    alt?: string;
}
```

**Features:**
- 2x2 clean grid layout
- Square aspect ratio (1:1)
- Hover zoom effect (scale 1.05)
- Fullscreen lightbox with keyboard support
- Next/Previous navigation
- Image counter
- Click-to-close (overlay or × button)
- Accessible with ARIA labels

**Usage:**
```tsx
import { ArticleGallery } from '@/components/Article';

const images = [
    { id: 1, url: '/image1.jpg', caption: 'Mountain Sunset', alt: 'Sunset over mountains' },
    { id: 2, url: '/image2.jpg', caption: 'City Skyline', alt: 'Night city view' },
    // ... more images
];

<ArticleGallery images={images} />
```

---

### 3. ArticleRichText
A rich text renderer for Strapi content blocks.

**Props:**
- `blocks: StrapiRichTextBlock[]` - Array of content blocks

**StrapiRichTextBlock Interface:**
```typescript
{
    type: 'paragraph' | 'heading' | 'list';
    content?: string;        // For paragraphs and headings
    level?: 1 | 2 | 3 | 4 | 5 | 6;  // For headings
    items?: string[];        // For lists
    ordered?: boolean;       // For lists (true = <ol>, false = <ul>)
}
```

**Features:**
- Supports H1-H6 headings with Blinker font
- Paragraphs with Inter font (17px, 1.65 line-height)
- Ordered and unordered lists
- Proper typography hierarchy
- Consistent spacing

**Typography Scale:**
- H1: 2.5rem (40px), weight 800
- H2: 2rem (32px), weight 700
- H3: 1.5rem (24px), weight 700
- H4: 1.25rem (20px), weight 700
- H5: 1.125rem (18px), weight 600
- H6: 1rem (16px), weight 600
- Paragraph: 1.0625rem (17px), weight 400

**Usage:**
```tsx
import { ArticleRichText } from '@/components/Article';

const blocks = [
    { type: 'heading', level: 2, content: 'Introduction' },
    { type: 'paragraph', content: 'This is the first paragraph...' },
    { 
        type: 'list', 
        ordered: false, 
        items: ['First item', 'Second item', 'Third item'] 
    },
];

<ArticleRichText blocks={blocks} />
```


---

### 4. ArticleAuthor
A minimalist author card with "Por" label and bottom accent.

**Props:**
- `name: string` - The author's name

**Features:**
- Clean, minimalist design with black text on white
- Uppercase typography for impact
- "Por" label in small caps (Spanish)
- Blue bottom accent line
- Scalable and responsive

**Usage:**
```tsx
import { ArticleAuthor } from '@/components/Article';

<ArticleAuthor name="Carlos Ramírez" />
```

---

## Strapi Integration

### Content Type Structure

In Strapi, create a **Dynamic Zone** field in your Article content type with these components:

1. **ComponentArticleQuote**
   - `quote` (Text, Long text)
   - `author` (Text)

2. **ComponentArticleGallery**
   - `images` (Media, Multiple files, Images only)

3. **ComponentArticleRichText**
   - `blocks` (JSON field containing array of blocks)
   
4. **ComponentArticleAuthor**
   - `name` (Text)

### Example Strapi Query

```graphql
query GetArticle($id: ID!) {
  article(id: $id) {
    data {
      id
      attributes {
        title
        content {
          __typename
          ... on ComponentArticleQuote {
            id
            quote
            author
          }
          ... on ComponentArticleGallery {
            id
            images {
              data {
                id
                attributes {
                  url
                  alternativeText
                  caption
                }
              }
            }
          }
          ... on ComponentArticleRichText {
            id
            blocks
          }
          ... on ComponentArticleAuthor {
            id
            name
          }
        }
      }
    }
  }
}
```

---

## Rendering Article Content

```tsx
import { 
    ArticleQuote, 
    ArticleGallery, 
    ArticleRichText, 
    ArticleAuthor,
    ArticleContentBlock 
} from '@/components/Article';


interface ArticleContentProps {
    content: ArticleContent Block[];
}

export const ArticleContent = ({ content }: ArticleContentProps) => {
    return (
        <div>
            {content.map((block, index) => {
                switch (block.__typename) {
                    case 'ComponentArticleQuote':
                        return (
                            <ArticleQuote 
                                key={index}
                                quote={block.data.quote}
                                author={block.data.author}
                            />
                        );
                    
                    case 'ComponentArticleGallery':
                        return (
                            <ArticleGallery 
                                key={index}
                                images={block.data.images}
                            />
                        );
                    
                    case 'ComponentArticleRichText':
                        return (
                            <ArticleRichText 
                                key={index}
                                blocks={block.data.blocks}
                            />
                        );
                        
                    case 'ComponentArticleAuthor':
                        return (
                            <ArticleAuthor
                                key={index}
                                name={block.data.name}
                            />
                        );
                    
                    default:
                        return null;
                }
            })}
        </div>
    );
};
```

---

## Styling

All components use inline styles for maximum portability and to avoid CSS conflicts. The design system uses:

- **Fonts:** Blinker (headings), Inter (body)
- **Colors:** 
  - Magnus Blue: `#0076AB`
  - Cream-Orange: `#FFF6F0`
  - Dark Gray: `#111827`
  - Medium Gray: `#374151`
  - Light Gray: `#545454`

---

## Accessibility

- All images have proper `alt` attributes
- Lightbox buttons have ARIA labels
- Keyboard navigation supported (ESC to close lightbox)
- Proper heading hierarchy
- High contrast text colors

---

## Performance

- Components use React hooks efficiently
- No unnecessary re-renders
- Lightbox only mounts when open
- Images use proper `loading` attributes (can be added)
- Minimal DOM manipulation

---

## Next Steps

### For Staging:
1. Test with real Strapi data
2. Add error boundaries
3. Add loading states
4. Implement lazy loading for images
5. Add keyboard navigation for lightbox (arrow keys)
6. Add swipe gestures for mobile lightbox

### For Production:
1. Add analytics tracking
2. Implement image optimization (srcset, WebP)
3. Add SEO metadata
4. Accessibility audit
5. Performance optimization
6. Cross-browser testing

---

## Migration from Playground

The Playground components at:
- `src/modules/playground/components/articlecomponents/PlaygroundQuote.tsx`
- `src/modules/playground/components/articlecomponents/PlaygroundGallery.tsx`
- `src/modules/playground/components/articlecomponents/PlaygroundRichText.tsx`

Can now use these production components by importing them and passing mock data as props.
