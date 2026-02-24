# Meal Planner Finish-Off Plan

## 1) Stabilize and productionize the foundation (Week 1)
- Replace hardcoded login defaults with empty form state and add validation/error UX for auth flows.
- Implement a complete sign-out flow from the account menu and ensure local session state resets correctly.
- Move `QueryClient` creation out of `App` render to avoid recreating cache on each re-render.
- Add route-level structure (React Router) so each major page has a URL and deep-link support.
- Add loading/error/empty states consistently across Pantry and Recipes.

### Deliverables
- Reliable auth session behavior (sign-in, refresh, sign-out)
- Stable data caching behavior
- Shareable URLs for all top-level features

---

## 2) Complete missing feature pages (Weeks 2-4)

### 2.1 AI Generation page
- Build AI-assisted meal suggestions from pantry + preference inputs.
- Add prompt controls: meal type, prep time, servings, dietary tags.
- Save generated meals directly to Recipes.
- Add guardrails: input limits, retry/fallback handling, and clear error messaging.

### 2.2 Calendar page
- Implement weekly/monthly calendar views.
- Enable drag-and-drop recipe assignment to meal slots (breakfast/lunch/dinner).
- Support copy/clear actions for day plans.
- Persist meal plan entries in Supabase with optimistic UI updates.

### 2.3 Grocery page
- Auto-generate grocery items from calendar meal plan + pantry deficits.
- Group items by category/aisle and allow manual add/edit/delete.
- Add checkbox completion state and “archive completed” workflow.
- Add “regenerate from plan” action with conflict handling for manual edits.

### Deliverables
- Three fully functional pages replacing current placeholders
- End-to-end flow: recipe -> calendar -> grocery

---

## 3) Improve pantry + recipe power features (Week 5)
- Pantry: low-stock and expiry alerts, bulk actions, and category presets.
- Recipes: richer metadata (nutrition, prep/cook time), better filtering, and duplicate/copy recipe action.
- Add quick actions between modules (e.g., “Add recipe ingredients to grocery”).
- Add user preference integration (diet/allergens) into filters and AI defaults.

### Deliverables
- Better day-to-day utility with fewer clicks
- Higher quality generated plans and shopping lists

---

## 4) Data model and backend hardening (Week 6)
- Finalize Supabase schema for meal plans and grocery items.
- Add Row Level Security policies for all tables and verify per-user isolation.
- Add migration scripts and seed data for local/dev environments.
- Add database constraints/indexes for common query paths.
- Add audit fields (`created_at`, `updated_at`) and consistency checks.

### Deliverables
- Production-safe schema and policies
- Repeatable local setup and deploy migrations

---

## 5) Quality, testing, and observability (Week 7)
- Add unit tests for core store logic and data transformations.
- Add integration tests for API modules and component interactions.
- Add end-to-end tests for key flows:
  1. Login -> Pantry CRUD
  2. Recipe CRUD -> assign to calendar
  3. Generate grocery list -> mark complete
- Add runtime error logging and basic analytics events for feature usage.

### Deliverables
- Confidence in releases
- Clear visibility into failures and user behavior

---

## 6) UX polish and accessibility pass (Week 8)
- Improve navigation responsiveness (mobile/tablet layout and menu behavior).
- Add keyboard and screen-reader support checks for dialogs/forms.
- Improve visual hierarchy and consistency across pages.
- Add onboarding empty states and contextual hints.

### Deliverables
- Accessible and polished UX across devices

---

## 7) Release readiness and launch checklist (Week 9)
- Configure environment management for dev/staging/prod.
- Add CI pipeline gates (lint, typecheck, tests, build).
- Verify performance budgets and optimize heavy views.
- Write user documentation and internal runbooks.
- Execute final UAT with a short beta cohort.

### Deliverables
- Launch candidate with low operational risk

---

## Suggested backlog order (now -> next)
1. Auth/session cleanup and routing baseline
2. Calendar data model + CRUD
3. Grocery generation engine
4. AI generation integration
5. Testing + CI hardening
6. UX/accessibility polish

## Definition of Done for “app complete”
- All top navigation pages are functional (no placeholders).
- A user can plan meals for a week and generate a usable grocery list.
- Pantry and recipe management are reliable, tested, and fast.
- CI is green with meaningful test coverage.
- App is deployable with documented setup and rollback.
