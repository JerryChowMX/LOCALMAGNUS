# Strapi Auth Migration Guide - MAGNUS

**Date**: December 5, 2025  
**Objective**: Migrate authentication from standalone auth server (localhost:3000) to Strapi CMS

---

## 📋 Overview

### Current State:
- Auth API at `http://localhost:3000/api/auth/*`
- Separate auth server (not running)
- Mock fallback enabled

### Target State:
- Auth handled by Strapi at `http://localhost:1337/api/auth/*`
- Single backend for both content and auth
- Strapi's built-in Users & Permissions plugin

---

## 🚀 Step-by-Step Migration

### **Step 1: Install & Setup Strapi** (10 minutes)

#### 1.1 Create Strapi Project
```bash
# In a separate directory (e.g., Desktop/MAGNUS-backend)
npx create-strapi-app@latest strapi-backend --quickstart
```

This will:
- Install Strapi
- Create SQLite database (default)
- Open admin panel at `http://localhost:1337/admin`

#### 1.2 Create Admin User
- Follow the prompts to create your first admin user
- Remember these credentials!

---

### **Step 2: Configure Strapi Users & Permissions** (5 minutes)

#### 2.1 Enable Public Registration (Optional)
In Strapi Admin:
1. Go to **Settings** → **Users & Permissions** → **Advanced Settings**
2. Enable "Enable sign-ups"
3. Set default role to "Authenticated"
4. Save

#### 2.2 Configure Roles
In Strapi Admin:
1. Go to **Settings** → **Users & Permissions** → **Roles**
2. Edit **Public** role:
   - Allow `auth.login`
   - Allow `auth.register` (if you want public registration)
3. Edit **Authenticated** role:
   - Allow `users-permissions.user.me` (get current user)
4. Save

#### 2.3 Get API Token
1. Go to **Settings** → **API Tokens**
2. Click **Create new API Token**
3. Name: "MAGNUS Frontend"
4. Token type: "Full access" (for now, restrict later)
5. Copy the token (you'll need it for `.env`)

---

### **Step 3: Update Environment Variables** (2 minutes)

Update `c:\Users\USER\Desktop\MAGNUS HO\.env`:

```env
# Strapi Configuration
VITE_STRAPI_URL=http://localhost:1337/api
VITE_STRAPI_TOKEN=your_api_token_from_step_2.3

# Keep mock fallback during development
VITE_USE_MOCKS=true

# Remove or comment out old auth URL
# VITE_API_URL=http://localhost:3000/api

# Analytics (configure later)
# VITE_POSTHOG_KEY=
# VITE_POSTHOG_HOST=
```

---

### **Step 4: Update Strapi Client** (Already Done! ✅)

Your `strapiClient.ts` is already set up. Just verify it looks like this:

```typescript
// src/api/strapiClient.ts
class StrapiClient {
  private baseURL: string;
  private token: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337/api';
    this.token = import.meta.env.VITE_STRAPI_TOKEN || '';
  }

  // ... existing methods
}
```

---

### **Step 5: Update Auth API** (Main Migration)

The code changes are in the next section. We'll update:
- `authApi.ts` - Switch from old API to Strapi
- `AuthContext.tsx` - Handle Strapi JWT tokens
- Mock data - Update to match Strapi response format

---

### **Step 6: Test Authentication** (5 minutes)

#### 6.1 Create Test User in Strapi
In Strapi Admin:
1. Go to **Content Manager** → **User** (under Collection Types)
2. Click **Create new entry**
3. Fill in:
   - Username: `testuser`
   - Email: `test@magnus.com`
   - Password: `Test123!`
   - Confirmed: `true`
   - Blocked: `false`
   - Role: `Authenticated`
4. Save

#### 6.2 Test Login in MAGNUS
1. Start Strapi: `npm run develop` (in strapi-backend folder)
2. Start MAGNUS: `npm run dev` (in MAGNUS HO folder)
3. Navigate to login page
4. Try logging in with test@magnus.com / Test123!
5. Should work! ✅

---

## 🔧 Code Changes Required

See the following updated files:
1. `authApi.ts` - Updated to use Strapi endpoints
2. `AuthContext.tsx` - Updated to handle Strapi JWT
3. `mockAuth.ts` - Updated mock data format

---

## 🎯 Benefits After Migration

✅ **Single Backend**: One server instead of two  
✅ **Built-in User Management**: Strapi admin panel  
✅ **JWT Tokens**: Industry-standard authentication  
✅ **Role-Based Access**: Ready for paywall implementation  
✅ **Extensible**: Easy to add custom user fields  
✅ **Production Ready**: Strapi is battle-tested  

---

## 🚨 Important Notes

### JWT Token Storage
- Tokens are stored in `localStorage` (key: `jwt`)
- Automatically included in Strapi requests
- Cleared on logout

### Mock Fallback
- Keep `VITE_USE_MOCKS=true` during development
- App will use mocks if Strapi is down
- Graceful degradation

### Security
- **Production**: Use HTTPS for Strapi
- **Production**: Restrict API token permissions
- **Production**: Enable rate limiting
- **Production**: Use secure password requirements

---

## 📝 Next Steps After Migration

1. **Add Custom User Fields** (for paywall):
   - `subscriptionTier` (enum: free, basic, premium)
   - `subscriptionExpires` (date)
   - `articlesReadThisMonth` (number)
   - `monthlyLimit` (number)

2. **Implement Paywall Logic**:
   - Check subscription tier before showing content
   - Track article reads
   - Show upgrade prompts

3. **Add Stripe Integration** (later):
   - Payment processing
   - Subscription management
   - Webhook handlers

---

## 🆘 Troubleshooting

### "Cannot connect to Strapi"
- Check Strapi is running: `npm run develop`
- Verify URL in `.env`: `VITE_STRAPI_URL=http://localhost:1337/api`
- Check Strapi admin is accessible at `http://localhost:1337/admin`

### "Unauthorized" errors
- Verify API token in `.env`
- Check role permissions in Strapi admin
- Ensure user is confirmed and not blocked

### "User not found"
- Create test user in Strapi admin
- Ensure email is confirmed
- Check username/email spelling

---

## ✅ Migration Checklist

- [ ] Install Strapi (`npx create-strapi-app`)
- [ ] Create admin user
- [ ] Configure Users & Permissions plugin
- [ ] Get API token
- [ ] Update `.env` file
- [ ] Update `authApi.ts` (see code changes)
- [ ] Update `AuthContext.tsx` (see code changes)
- [ ] Update mock data (see code changes)
- [ ] Create test user in Strapi
- [ ] Test login in MAGNUS app
- [ ] Verify logout works
- [ ] Test protected routes
- [ ] Remove old auth server code (optional)

---

**Ready to implement? The code changes are coming next!**
