# Codebase Audit Report (audit1.md)

**Date**: December 4, 2025
**Status**: ❌ Critical Issues Found

This document outlines the findings from a comprehensive audit of the MAGNUS HO codebase. Issues are ranked by priority.

---

## 🚨 Critical Priority (Fix Immediately)

### 1. EPaper Filtering Logic Missing / Design Conflict
**File**: `src/modules/epaper/pages/EpaperHubPage.tsx`
**Issue**: The filtering functionality described in the walkthrough is completely missing. Furthermore, recent changes have replaced the edition grid with a single card view, effectively removing the "Hub" functionality.
**Impact**: Users cannot see past editions or filter them. The "Filtrar" button exists but the underlying list to filter is gone.
**Action**: 
1. Clarify if the design is "Single View" or "List View".
2. If "List View" (as per walkthrough), revert the recent changes and implement the missing filtering logic.
3. If "Single View", update the walkthrough and rename the "Filtrar" button to "Cambiar Fecha".

---

## 🔴 High Priority (Architecture & Consistency)

### 2. Inconsistent API Clients
**Files**:
- `src/modules/noticiasHub/services/noticiasApi.ts` (Uses `apiClient`)
- `src/services/authApi.ts` (Uses `apiClient`)
- `src/modules/resumenHub/services/resumenApi.ts` (Uses `strapiClient`)
- `src/modules/articles/api/articlesApi.ts` (Uses pure Mocks, no client)
**Issue**: There are three different ways data is fetched: legacy `apiClient`, new `strapiClient`, and hardcoded mocks.
**Impact**: High technical debt. Migrating to a real backend will require touching every service file.
**Action**: Standardize on `strapiClient` for all data fetching. Implement the Adapter Pattern for `articlesApi` and `noticiasApi`.

### 3. Hardcoded EPaper URL
**File**: `src/modules/epaper/pages/EpaperEditionPage.tsx`
**Issue**: The PDF URL is hardcoded to `http://example.com/epaper/...`.
**Impact**: The EPaper viewer will not work in production.
**Action**: Connect to a real API endpoint or use the `strapiClient` to fetch the PDF URL.

### 4. Strapi Client Maturity
**File**: `src/api/strapiClient.ts`
**Issue**: The client is a basic wrapper around `fetch` and does not handle Strapi's specific response structure (nested `data` and `attributes`).
**Impact**: Service layers have to manually handle the unwrapping, leading to code duplication.
**Action**: Enhance `strapiClient` to automatically unwrap responses.

---

## 🟡 Medium Priority (Features & Cleanup)

### 5. Profile Page Incompleteness
**File**: `src/modules/perfilHub/pages/PerfilHubPage.tsx`
**Issue**: Contains multiple TODOs and placeholder `console.log` actions.
- `TODO: Load from user profile`
- `TODO: Add plan to user model`
- Placeholder actions for "Administrar", "Notificaciones", etc.
**Impact**: The profile page is largely cosmetic and lacks real functionality.
**Action**: Implement the missing data loading and action handlers.

### 6. Share Modal Polish
**File**: `src/components/ShareModal/ShareModal.tsx`
**Issue**: `TODO: Show toast notification`
**Impact**: User feedback is logged to console instead of shown in the UI.
**Action**: Implement a Toast/Notification system to inform the user when a link is copied.

### 7. Leftover Console Logs
**Files**: Multiple (e.g., `PerfilHubPage.tsx`, `SocialLoginButtons.tsx`, `ArticlesListPage.tsx`)
**Issue**: Production code contains `console.log` statements for debugging or placeholders.
**Impact**: Clutters the console and looks unprofessional.
**Action**: Remove or replace with proper logging/error handling.

---

## 🟢 Low Priority (Minor Improvements)

### 8. Analytics Logging
**File**: `src/lib/analytics.ts`
**Issue**: Verbose logging of analytics events.
**Impact**: harmless but noisy.
**Action**: Make logging conditional on `import.meta.env.DEV`.

---

## Recommended Roadmap

1.  **IMMEDIATELY**: Fix the **EPaper Filtering** logic in `EpaperHubPage.tsx`.
2.  **NEXT**: Standardize the API layer by migrating `noticiasHub` and `auth` to `strapiClient`.
3.  **THEN**: Address the TODOs in `PerfilHubPage` and `ShareModal`.
