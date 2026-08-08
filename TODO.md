# Frontend ↔ Backend Integration TODO

## Phase 1 — Auth Foundation

- [x] Rewrite `src/lib/AuthContext.jsx` (clean, backend-aligned, no MCP/OAuth bootstrap)
- [x] Update `src/api/authClient.js` (real logout, credentials include, remove debug/app-params)
- [x] Update `src/lib/api.js` (add `credentials: "include"`)
- [x] Remove duplicate `src/contexts/AuthContext.jsx`

## Phase 2 — App Wiring

- [x] Update `src/App.jsx` to match new AuthContext API (remove app-settings/OAuth error flow)

## Phase 3 — End-to-End Feature Alignment

- [x] SearchBar: fix autocomplete to use suggestion `name` (backend returns `{_id,name,type}`)
- [x] Categories: remove broken `/categories` API call (backend has none) → static data
- [x] Dashboard: fetch real saved-addresses count
- [x] Login: allow login by email OR phone (changed input type from email → text)
- [x] Verified Cart / Wishlist / Checkout / Orders / Addresses / ProductDetail all match backend shapes
- [x] Verified authClient endpoints match backend (login/register/verify/reset/forgot/logout/resend)

## Phase 4 — Verify & Cleanup

- [x] Remove unused OAuth/Google components/pages (OAuthConsent, GoogleIcon, ProtectedRoute, UserNotRegisteredError, axiosClient, app-params)
- [x] Production build passes (`npm run build`)

## Follow-up

- [ ] Run `npm run dev` (frontend) + `npm run dev` (backend) and test login/register/cart/checkout/orders
