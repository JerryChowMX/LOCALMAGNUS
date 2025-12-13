# Profile Page (PerfilHub) Audit

**Date**: December 12, 2025  
**Page**: `/PerfilHub`

---

## Summary

The Profile page displays user information, membership details, app settings, and preferences. It uses a combination of Strapi API calls and mock fallbacks.

---

## Components Status

### ✅ Working

| Component | Status | Notes |
|-----------|--------|-------|
| **ProfileCard** | ✅ Working | Displays user avatar, name, email, and editable description |
| **Avatar Upload** | ✅ Working | Uses Strapi's `/upload` endpoint |
| **Name Editing** | ✅ Working | Inline edit with save via `/users/:id` PUT |
| **Description Editing** | ✅ Working | Textarea with character counter (160 max) |
| **MembershipCard** | ⚠️ Hardcoded | Shows "Plan Anual" with hardcoded renewal date and benefits |
| **SettingsSection** | ✅ Working | Container component for grouped settings |
| **SettingsRow** | ✅ Working | Clickable row with icon and label |
| **ToggleSwitch** | ✅ Working | Dark mode toggle works correctly |
| **OptionSelector** | ✅ Working | Font size selector (A, A+, A++) |
| **Logout Button** | ✅ Working | Clears JWT and redirects to login |

### ⚠️ Partially Working / Hardcoded

| Feature | Status | Issue |
|---------|--------|-------|
| **Membership Plan** | ⚠️ Hardcoded | Always shows "Plan Anual", not fetched from Strapi |
| **Renewal Date** | ⚠️ Hardcoded | Shows "15/04/2026" static value |
| **Benefits List** | ⚠️ Hardcoded | Static array, not dynamic |
| **App Settings** | ⚠️ Mock Only | `getAppSettings()` returns mock directly (no Strapi content type) |

### ❌ Not Implemented (TODOs)

| Feature | Location | Status |
|---------|----------|--------|
| Settings Icon Action | Line 81 | `{/* TODO: Implement settings navigation */}` |
| Notifications Settings | Line 125 | `{/* TODO: Implement notifications settings */}` |
| Privacy Settings | Line 130 | `{/* TODO: Implement privacy settings */}` |
| About Page | Line 135 | `{/* TODO: Implement about page */}` |
| Help & Support | Line 140 | `{/* TODO: Implement help & support */}` |
| Membership Management | Line 116 | `{/* TODO: Implement membership management */}` |

---

## API Integration Status

### `perfilApi.ts`

| Method | Status | Notes |
|--------|--------|-------|
| `getUserProfile()` | ✅ Strapi | Fetches `/users/me?populate=*` |
| `updateUserProfile()` | ✅ Strapi | Handles avatar upload + `/users/:id` PUT |
| `getAppSettings()` | ❌ Mock Only | Returns `MOCK_SETTINGS` directly |
| `updateAppSettings()` | ❌ Mock Only | Returns updated mock object |

### Strapi User Model

The profile page depends on these Strapi User fields:
- `username` → mapped to `name`
- `email` → displayed as-is
- `avatar` → relation to Media (needs `populate=*`)
- `description` → custom field (may need to be added to Strapi User model)
- `createdAt` → mapped to `memberSince`

---

## Strapi Requirements

To fully integrate the profile page, Strapi needs:

### 1. User Model Extensions
- [ ] Add `description` field (Text, long text)
- [ ] Ensure `avatar` relation to Media is enabled

### 2. App Settings Content Type (Optional)
Create `app-settings` single type with:
- `theme` (Enumeration: light, dark)
- `fontSize` (Enumeration: small, medium, large)
- `notificationsEnabled` (Boolean)
- `pushNotificationsEnabled` (Boolean)
- `emailNewsletterEnabled` (Boolean)
- `analyticsEnabled` (Boolean)
- `location` (String)

### 3. Membership Content Type (Future)
For premium features:
- `subscription-tier` (Enumeration: free, basic, premium)
- `subscription_expires_at` (DateTime)
- `stripe_customer_id` (String)

---

## Data Flow

```
┌─────────────────────────────────────────┐
│  PerfilHubPage.tsx                      │
│  - useAuth() → user data                │
│  - useProfile() → profile + settings    │
│  - useUserPreferences() → theme/font    │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  useProfile Hook                        │
│  - Calls perfilApi.getUserProfile()     │
│  - Calls perfilApi.getAppSettings()     │
└──────────┬──────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│  perfilApi.ts                           │
│  - strapiClient.get('/users/me')        │
│  - strapiClient.put('/users/:id')       │
│  - strapiClient.upload() for avatar     │
└─────────────────────────────────────────┘
```

---

## UI/UX Issues

| Issue | Severity | Fix Needed |
|-------|----------|------------|
| Random avatar image on first login | Low | Use actual Google avatar or default icon |
| "Sin descripción" placeholder | Low | Could be styled differently |
| Guardar button styling | Low | Could match brand orange |

---

## Recommendations

### Priority 1: Add Description Field to Strapi User
```bash
# In Strapi admin, edit the User content type:
# Settings → Users & Permissions → User → Add field
# Name: description
# Type: Text (Long text)
```

### Priority 2: Replace Hardcoded Membership Data
- Create a `subscriptions` content type in Strapi
- Fetch user's active subscription
- Display dynamic plan info

### Priority 3: Implement Settings Navigation
Create sub-pages for:
- `/PerfilHub/notificaciones`
- `/PerfilHub/privacidad`
- `/PerfilHub/acerca`
- `/PerfilHub/ayuda`

---

## Files Involved

```
src/modules/perfilHub/
├── components/
│   ├── MembershipCard.tsx     # Displays subscription info
│   ├── OptionSelector.tsx     # Font size selector
│   ├── ProfileCard.tsx        # Main profile display/edit
│   ├── SettingsRow.tsx        # Single settings item
│   ├── SettingsSection.tsx    # Settings group container
│   └── ToggleSwitch.tsx       # Boolean toggle
├── hooks/
│   └── useProfile.ts          # Profile data fetching
├── mocks/
│   └── profile.mock.ts        # Fallback mock data
├── pages/
│   ├── PerfilHubPage.css
│   └── PerfilHubPage.tsx
└── services/
    └── perfilApi.ts           # API layer
```

---

## Conclusion

The Profile page is **functional for basic use cases**. The main gaps are:
1. **Membership data is hardcoded** - needs Strapi integration
2. **Settings links are placeholders** - need sub-pages
3. **App settings use mocks** - needs Strapi content type

The user authentication flow (login, logout, user display) is fully working with Strapi.
