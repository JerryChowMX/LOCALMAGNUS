# Quote Component - Final Design Specification

**Location:** `http://localhost:5173/dev/playground/components/articlecomponents/quote`

**Decision:** This is the ONLY quote design we are keeping. All other variants have been removed.

---

## Visual Design Description

### 1. Layout

The quote block is a horizontal card with:

- **A thick left vertical bar** in `#0076AB`
- **A soft cream-orange background:** `#FFF6F0`
- **No border** (cleaner than previous versions)
- **Smooth internal padding** (approx. 24–28px)

### 2. Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Left bar | Magnus Blue | `#0076AB` |
| Background | Soft Cream-Orange | `#FFF6F0` |
| Quote text | Black | `#000000` |
| Author name | Soft Gray | `#545454` |
| Quotation mark icon | Magnus Blue | `#0076AB` |

### 3. Typography

#### Quote text
- **Weight:** Bold (600 or 700 weight)
- **Font Family:** Clean sans-serif (Inter / Roboto / SF Pro)
- **Size:** Larger size (approx. 20–22px)
- **Alignment:** Left aligned
- **Line height:** Comfortable (~1.3–1.4)

#### Quotation marks
- **Color:** Blue `#0076AB`
- **Position:** Top-left inside the card
- **Purpose:** Adds personality without overwhelming the text

### 4. Composition

#### Quote state (default)

The first image shows:
- Left blue bar
- Blue quote marks
- Bold short quote
- **No author visible**

**Spacing feels balanced:**
- Blue bar sits flush on the left
- Then a small horizontal gap
- Then the colored card

This creates a distinctive **editorial style**, perfect for a newspaper.

#### Author state (revealed on tap)

When the user taps the quote (**mobile-first behavior**):
- The quote text disappears smoothly
- The blue quotation marks disappear as well
- The author name fades in, centered vertically

Shown in the second image:
- Same layout
- Same left blue bar
- Same background
- But instead of text, we see:
  ```
  – Benjamin Franklin
  ```
  - Light gray text `#545454`
  - Medium weight
  - Same typography family
  - Large horizontal padding
  - Clean, minimalist

**Important:**
- This is **not shown inside a different box**.
- It uses the **exact same card**, just with swapped content.

---

## ⚡ 5. Microinteraction (Mobile First)

### Tap Behavior

When the user taps the quote:
1. Quote text **fades out** (opacity transition)
2. Quotation marks **fade out**
3. Author name **fades in**, replacing the space
4. All transitions smooth (**150–250ms**)

#### Optional nice touch:
- Slight **upward fade** for the removed quote
- Slight **delayed fade-in** for author (20–40ms offset)

---

## 🎨 6. Why this works for your product

This design is:
- ✅ **Minimalist**
- ✅ **Elegant**
- ✅ **Newspaper-appropriate**
- ✅ **Mobile-first**
- ✅ **Easy to reuse in Magnus components**
- ✅ **Compatible with glassmorphism or editorial styles**

It feels like a **premium feature**, not a basic quote.

---

## Implementation Notes

### Current Status
- ✅ Design approved
- ⏳ Needs implementation in PlaygroundQuote.tsx
- ⏳ Remove all other quote variants
- ⏳ Add tap/click toggle functionality
- ⏳ Implement smooth transitions

### Next Steps
1. Update `PlaygroundQuote.tsx` to match this exact specification
2. Remove Option 1 and Option 2 (the previous blue variants)
3. Keep ONLY this cream-orange design
4. Implement the tap-to-toggle behavior
5. Add smooth fade transitions (150-250ms)
6. Test on mobile devices

---

## Reference Images

![Quote State - Default](uploaded_image_0_1764987962613.png)
*Default state: Shows the quote with blue quotation marks*

![Author State - On Tap](uploaded_image_1_1764987962613.png)
*Tapped state: Shows the author name, quote text hidden*
