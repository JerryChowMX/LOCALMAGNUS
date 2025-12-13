# MAGNUS Master Refactoring Plan

**Date**: 2025-12-12  
**Status**: Ready for Execution

---

## 🎯 Objective
Consolidate findings from 8 comprehensive audits into a prioritized action plan to eliminate technical debt (`noticiasHub`, inline styles) and harden the core architecture.

---

## 📊 Audit Scorecard

| Area | Grade | Critical Issues |
|------|-------|-----------------|
| **Architecture** | **A-** | Sound module structure, but `playground` is bloated. |
| **Logic/State** | **B** | Solid, but `AudioPlayer` state needs extraction. |
| **Routing** | **B-** | 56 import lines in one file; needs sub-routing. |
| **Strapi** | **A-** | Excellent integration; duplicate types need fixing. |
| **PostHog** | **A-** | Privacy-first; missing session tracking. |
| **Components** | **B+** | Good core; missing form components. |
| **CSS** | **C+** | **CRITICAL**: Inline styles in AudioPlayer/Card. |
| **Dead Code** | **N/A** | **18 files** identified for deletion. |

---

## 🚀 Execution Roadmap

### Phase 1: The Cleanup (Low Risk / High Clarity)
*Goal: Remove noise and confusion.*

- [x] **Audit Completion**: All 8 reports generated.
- [x] **Delete Dead Code**: Remove `src/modules/noticiasHub` pages and legacy layout components.
- [x] **Prune Routes**: Remove `/articles` placeholders from `AppRouter.tsx`.
- [x] **Fix Strapi Types**: Unify `StrapiArticle` definition to `src/types/strapi.ts`.

### Phase 2: Architecture Hardening (Medium Risk)
*Goal: Fix structural issues.*

- [ ] **Extract Playground Router**: Move 40+ dev routes out of `AppRouter.tsx` into `PlaygroundRouter.tsx`.
- [ ] **Add 404 Page**: Handle unknown routes gracefully.
- [ ] **CSS Refactor (AudioPlayer)**: Move inline styles to `AudioPlayer.css` and use BEM classes.
- [ ] **CSS Refactor (Card)**: Fix inline padding styles.

### Phase 3: Feature Completeness (New Dev)
*Goal: Fill functionality gaps.*

- [ ] **Form Components**: Build `Checkbox`, `Radio`, and `Select`.
- [ ] **Analytics**: Implement session end tracking and user trait identification.
- [ ] **Storybook Setup**: (Optional) Shift away from custom Playground.

---

## 📅 Recommended Immediate Actions

**Step 1**: Approve deletion of files listed in `DeadCodeAudit.md`.
**Step 2**: Authorize the CSS refactor of `AudioPlayer`.
**Step 3**: Authorize the extraction of `PlaygroundRouter`.
