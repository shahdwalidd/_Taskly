# Taskly — Complete Frontend Code Review

## 1. Executive Summary

Taskly is a small React + TypeScript + Vite app with a clear authentication flow, project listing, and project-management pages. The project is structurally understandable and the developer experience is reasonable: routes are centralized in App.tsx, form validation is mostly handled with Zod + React Hook Form, and the UI is organized into reusable page/component folders. The app also has a consistent visual language with Tailwind classes and a fairly clear separation between pages, hooks, services, and types.

However, the codebase is still in an early, somewhat inconsistent MVP state. The biggest issues are not stylistic; they are architectural and correctness problems:

- auth/session logic is split between a custom hook, a store module, and the service layer in a way that makes the system harder to reason about;
- project route state is not consistently sourced from the URL or a single project source of truth;
- a large amount of logic is duplicated across hooks and services;
- several data flows rely on implicit assumptions rather than a single app-wide pattern;
- the app has multiple real or strongly evidenced issues around project navigation, session initialization, route guards, and some mismatch between expected and actual backend contract.

The app is workable as a demo, but it is not yet robust enough to be treated as a production-grade frontend without tightening the state model and reducing duplicated logic.

---

## 2. Critical Issues

### 1) Auth/session state is split across multiple places and not treated as a single source of truth

- File: src/hooks/useAuth.ts, src/store/Authstore.ts, src/services/AuthService.ts
- Problem: Session truth lives in localStorage/sessionStorage plus a custom hook state (`isauth`, `isloading`). The hook uses a ref (`hasCheckedSession`) to ensure it only runs once, but the system is still not globally consistent. Multiple components call `getSession()` directly and re-derive auth state instead of sharing a single canonical auth model.
- Why it matters: This creates a stale/duplicated source of truth and increases the risk of divergent auth states between route guards, page loads, and logout behavior.
- Recommended fix: Consolidate auth/session state into a single hook or provider that owns the session, refresh logic, and auth status; use that for all route guards and UI instead of calling storage directly from unrelated components.

### 2) Project routes do not have a coherent source of truth for project context

- File: src/pages/ProjectPage.tsx, src/components/auth-layout/AuthenticatedLayout.tsx, src/hooks/useProject.ts, src/hooks/useProjects.ts
- Problem: `ProjectPage` calls `useProjects()` and finds the project by matching `projectId` from the URL. `AuthenticatedLayout` also receives `projectName` and `projectId` as props from page-level logic. Meanwhile `useProject()` separately fetches a project by ID. This duplicates project loading and results in multiple representations of the same data.
- Why it matters: The UI can display a project name in the sidebar while the main project page is using another fetch result. This creates stale/partial state, inconsistent loading/error behavior, and makes project navigation fragile.
- Recommended fix: Use one project context/hook per project route and pass the resolved project object down, or fetch project-by-id once in the route and reuse it consistently.

### 3) Public/protected route gating is incomplete and can create loops or blank states

- File: src/routes/ProtectedRoutes.tsx, src/routes/PublicRoutes.tsx, src/hooks/useAuth.ts
- Problem: Route guards return `null` while `isloading` is true. That means the app renders nothing during auth initialization, which is acceptable for a blank splash state but not ideal. More importantly, auth initialization is only checked once using a ref; if the app is mounted in a different route context or the user navigates quickly, the guard behavior can become inconsistent.
- Why it matters: The app may render blank screens or redirect unexpectedly during refresh and navigation race conditions. It also makes it harder to reason about initial auth recovery.
- Recommended fix: Initialize auth status once at an app-level boundary and make route wrappers explicitly handle pending state with a proper loading screen/skeleton instead of `null`.

### 4) Add/edit project forms use inconsistent field naming and do not map cleanly to backend data

- File: src/pages/AddProjectPage.tsx, src/hooks/useAddProject.ts, src/schemas/Project.schema.ts, src/hooks/useEditProject.ts
- Problem: Add form uses `title` in schema and hook, while edit form uses `name`. The backend payload for create uses `{ name, description }`, but the form uses `{ title, description }` and then transforms it to `name` in the submit function. This is not wrong in code, but it is inconsistent and easy to break.
- Why it matters: This type of mismatch increases maintenance cost and increases the chance of bugs when the API contract or forms evolve.
- Recommended fix: Use a single canonical schema and field naming across create/edit flow, and keep the API transformation at the service boundary only.

### 5) The app is missing a true project detail page and the current project route is only a shell

- File: src/pages/ProjectPage.tsx
- Problem: The page loads the project list and simply renders a placeholder for loading/error states. There is no actual project details, tasks, epics, or members UI. The route is effectively a stub.
- Why it matters: The route hierarchy suggests a feature-rich product, but the implementation is incomplete; navigation and sidebar links imply functionality that is not actually present.
- Recommended fix: Either implement the missing project subpages or remove the routes and related navigation until those features exist.

---

## 3. Actual Bugs

### Bug 1: `useAuth` may retain stale auth status across navigations and route changes

- File: src/hooks/useAuth.ts
- Function: `useAuth`
- Problem: `hasCheckedSession` is a ref inside the hook instance, not across the app. Each hook instance mount runs the effect once within its own component. This is not a global auth state and does not guard actual app-level auth.
- Why it can break: When multiple protected/public route components mount or remount, the auth state check can re-run and cause inconsistent transitions or re-auth logic.
- Recommended fix: Move session checking into a dedicated auth provider or a single root-level initialization step.

### Bug 2: `ProjectPage` uses `useProjects()` to resolve a project by ID instead of fetching the target object

- File: src/pages/ProjectPage.tsx
- Function: `ProjectPage`
- Problem: It does not call a project-by-id endpoint; it filters a list of all projects client-side. If the list is stale or the project is not in that list, the sidebar title and main page have no consistent data.
- Why it can break: Users can access a project URL that does not match the current project list; the routed page then shows empty or incorrect project data.
- Recommended fix: Always resolve the project from a dedicated API call by ID or from a cached store keyed by projectId.

### Bug 3: `useResetPassword` reads the recovery token once and never re-reads it after it is cleared or replaced

- File: src/hooks/useResetPassword.ts
- Function: `useResetPassword`
- Problem: `const [hasAccessToken] = useState(() => Boolean(getRecoveryAccessToken()))` captures the token at first render only. If the token is added after the component mount, or if the flow changes, the component may not react correctly.
- Why it can break: Recovery-link handling is asynchronous and may depend on the hash being processed by `RecoveryLinkHandler`. This can lead to a stale `hasAccessToken` value during transient navigation state.
- Recommended fix: Derive `hasAccessToken` from the current `getRecoveryAccessToken()` value in an effect or memo, not a one-time state initializer.

### Bug 4: `RecoveryLinkHandler` stores the recovery token in sessionStorage, but there is no token expiry or cleanup beyond a password reset success

- File: src/components/auth-layout/RecoveryLinkHandler.tsx, src/store/Authstore.ts
- Problem: Recovery tokens are persisted in sessionStorage and can remain valid even after the page is refreshed; there is no explicit check for missing or expired token states beyond the reset process.
- Why it can break: A stale recovery token may be reused after expiration, leaving users on a reset page that should have been invalidated.
- Recommended fix: Validate token presence and lifetime on reset route entry and clear it after failed or expired attempts.

### Bug 5: The app uses `window.location.origin` in a module-level constant for reset redirect URL

- File: src/services/AuthService.ts
- Problem: `resetPasswordRedirectUrl` is created at module load time and may evaluate before `window` is available in some SSR or non-browser contexts. Vite client build is browser-only, but the pattern is brittle and can fail in tests or future non-browser rendering.
- Why it can break: It can cause runtime errors in environments where this module is executed before the browser environment is ready.
- Recommended fix: Compute the redirect URL lazily at request time or in a browser-only function.

### Bug 6: Some route and form names do not match the backend contract, creating subtle mismatches

- File: src/pages/AddProjectPage.tsx, src/hooks/useAddProject.ts, src/services/ProjectService.ts, src/schemas/Project.schema.ts
- Problem: The frontend uses `title` in form schema, then transforms it to `name` on API calls. This is legal, but is inconsistent with `EditProjectPage` which uses `name` directly and with the backend contract that appears to expect `name` for a project.
- Why it can break: It becomes easy to create hidden bugs in validation, API request formatting, and new features added later.
- Recommended fix: Normalize form field names to the backend contract as early as possible.

---

## 4. Architecture Issues

1. The app has a thin but inconsistent layer split: UI pages, custom hooks, services, and localStorage logic all interact directly. This is common for a small app, but the inconsistent boundaries make auth and project state harder to reason about.
2. There is no application-wide provider or context layer, even though several behaviors act like they need one: auth state, project state, user state, project navigation context, and route/session status.
3. The project route hierarchy is designed around a project-shell experience, but the actual implementation only partially supports it. This creates a mismatch between the user-facing architecture and the code reality.
4. The app mixes localStorage/sessionStorage persistence, service fetch calls, and component-specific assumptions without a clear shared API layer or state abstraction.
5. It is possible to see the same business concern solved multiple ways: some hooks fetch directly, some call service functions, some read storage directly, and some rely on page props.

---

## 5. Folder Structure Issues

The current folder structure is mostly sensible for a small app, but it has a few problems:

- `store/` is named `Authstore.ts` with a non-standard camel case file name. This is a low-level persistence module, not a state store, and should be named more clearly, such as `authStorage.ts` or `sessionStorage.ts`.
- `services/` is doing both auth endpoints and project endpoints, which is acceptable for a small app, but the code is not yet normalized around a single data layer shape.
- There is no `features/` or `domains/` split, so feature logic is mixed across pages, hooks, and components. That is manageable in a tiny app but will become harder to maintain as the feature set grows.
- `routes/` is a small wrapper around auth checks but does not provide a broader app shell or route config abstraction.

Overall: the structure is readable and not chaotic, but it is not yet shaped around feature boundaries or a single architecture pattern.

---

## 6. React Issues

### Good patterns

- Components mostly keep a single responsibility.
- The use of `useForm` and `useWatch` is straightforward.
- `NavLink` usage for sidebar navigation is mostly appropriate.

### Problems

- `useAuth` is a hook that both reads session state and triggers navigation. This mixes data access and side effects inside a hook that is used across route wrappers and layout components.
- `useProjects` is invoked in `ProjectPage`, but the page is not actually a detail view. This is a strong sign of component-level misuse of data fetching logic.
- `Sidebar` and `MobileDrawer` both implement similar menu logic and both pass `logout` directly from `useAuth`, which creates duplicated UI behavior in two render trees.
- The app uses several page-level `navigate()` calls inline rather than centralizing route navigation logic in route-aware handlers or a router config.
- Some hooks rely on `useEffect` + direct storage access; this makes them more stateful than necessary and can create stale re-renders.

The React code is not fundamentally broken, but it lacks a consistent composition model and some hooks are doing too much.

---

## 7. TypeScript Issues

### Strengths

- The project uses TypeScript and many interfaces are explicit.
- Some generic form components are typed reasonably well.
- `zod` inference is used correctly in several places.

### Problems

- `ProjectService.ts` uses broad `unknown` casting and manually reconstructs typed objects from `JSON.parse(...)`. That is workable but not ideal and increases the chance of incorrect runtime assumptions.
- `AuthService.ts` is very loose on response types; all errors are treated through `msg` or `message` fallbacks without a stricter API-style wrapper.
- Some interfaces are duplicated across the codebase (for example, project payload structures and error shapes are repeated or partially repeated rather than normalized).
- The store stores a `StoredSession` and then reads it with `as StoredSession`. There is no runtime shape validation at the boundary, which means malformed localStorage data could crash or create invalid state.
- A few props and generics are not consistent (`AddProjectPage` uses `name` in the schema but `title` in form field; `FormField` generic typing is good, but usage is inconsistently named).

The TypeScript quality is acceptable for a small app, but the app would be more reliable if it validated persisted session data and normalized response types more strongly.

---

## 8. Authentication Issues

### What is implemented reasonably well

- Session persistence is intentionally split between localStorage and sessionStorage based on the Remember Me option.
- Login stores tokens and expiration values.
- Public and protected routes do basic auth gating.
- A recovery token is temporarily stored and then cleared on password reset.

### Issues

- There is no central auth provider. The app effectively treats auth as a local hook state plus browser storage, which is more fragile than a single auth context.
- `useAuth` can silently clear the session and navigate without a true centralized auth lifecycle. This is functional but not production-grade.
- Expiration is checked in `useAuth` but not consistently enforced at the service boundary; a stale session could still be used until a route triggers re-check.
- `saveSession()` accepts `rememberMe` but the session logic does not actively enforce a full auth state refresh or token verification on startup beyond checking expiration.
- `PublicRoutes` and `ProtectedRoutes` return `null` during loading; that is not user-friendly and can create a blank flash on startup.
- Logout uses remote logout as a best-effort action; if the server fails, the UI keeps local state and issues a logout error, but the app still does not fully centralize the auth state. This is workable but inconsistent.

---

## 9. Password Recovery Issues

The password recovery flow is mostly present and coherent:

- `forgetPassword()` posts to the Supabase recover endpoint and passes a redirect URL.
- `RecoveryLinkHandler` reads the recovery hash and saves the token.
- `ResetPasswordPage` uses `useResetPassword` to submit the new password.
- The token is cleared after success.

However:

- `RecoveryLinkHandler` uses `window.location.hash` and `location.hash` with no server-side or route guard validation beyond `type=recovery` and `access_token` presence.
- The token is not actively validated for expiration before the reset form loads.
- The reset form uses a one-time state variable for `hasAccessToken`, which can become stale.
- The overall flow is functional but very dependent on browser state and URL hash timing.

This is a practical implementation, but not strongly resilient.

---

## 10. Routing Issues

### Current route map

- `/` → redirect to `/login`
- `/sign-up` → public
- `/login` → public
- `/forgot-password` → public
- `/reset-password` → public
- `/project` → protected
- `/project/add` → protected
- `/project/:projectId/epics` → protected
- `/project/:projectId/tasks` → protected
- `/project/:projectId/members` → protected
- `/project/:projectId/edit` → protected

### Issues

- The project sub-routes are defined but largely empty shell pages. This makes route existence look richer than the actual feature set.
- There is no consistent dynamic child route pattern for the project shell. The route guards are at the route level, but project state does not come from a single nested route structure.
- `/project/:projectId/...` is treated as a route for pages that are not actually implemented; these links exist in the sidebar and card UI but the pages themselves are effectively placeholders.
- `App.tsx` includes a catch-all `*` route redirect to `/login`; this is okay but could hide incorrect route issues and obscure invalid navigation states.

The routing is coherent enough for the current MVP, but not strong enough for a real project-management app.

---

## 11. Project Navigation Issues

This is one of the clearest weak areas.

- The sidebar and bottom nav imply deep project navigation, but the actual system is only partially implemented.
- `ProjectPage` depends on the project list to find the `projectId`, which is a weak source of truth and is not a proper project detail route.
- The layout passes `projectName` and `projectId` to the navigation components, but those values are not guaranteed to be consistently available or refreshed across route changes.
- `ProjectAccordion` and `BottomNav` use path strings like `/project/${projectId}/tasks`, but those pages only show a loading/error shell and no real features.
- Project creation navigates back to `/project`, but there is no strong guarantee that the newly created project is loaded or selected in the project list immediately.

In short: the UI appears to support full project navigation, but the data and page implementation do not yet support it.

---

## 12. API / Services Issues

### Strengths

- The project keeps `fetch` calls in a service layer rather than embedding them in components.
- The API base URL is centralized via environment variables.
- Bearer token headers are consistently applied for protected calls.

### Problems

- There is no standardized helper for API requests, response parsing, or error normalization. Each service function duplicates boilerplate and manually parses JSON/text.
- Error handling is inconsistent across services; some throw `result.msg`, some throw `message`, some parse a response body and some do not.
- `AuthService.ts` and `ProjectService.ts` both check `response.ok` and parse JSON manually but do not centralize a base request pattern.
- There is no request timeout, retry pattern, or abort handling.
- `ProjectService.getProjects()` calls a Supabase RPC named `get_projects`. This is valid only if the backend contract includes that function. Without a clear contract, the app is tightly coupled to a server-side function name that is not visible in the frontend itself.
- The app assumes Supabase responses use nested `msg` or `message` fields, but the real contract is not consistently typed or enforced.

This is acceptable for a prototype, but not for a production-grade client contract.

---

## 13. Provider Review

There are no React Context providers in this project. The app uses custom hooks and browser storage instead of provider-based state.

### Provider inventory

- Provider: None
- Current Location: N/A
- Responsibility: N/A
- KEEP / MOVE / REMOVE / RESTRUCTURE: RESTRUCTURE or ADD a real auth provider if the app grows
- Reason: The app behaves as if it needs a global auth state provider, but this responsibility is currently split across the hook, route guards, and localStorage. This is the key missing app-level layer.

### Conclusion

A provider layer is not required for a very small app, but this project is at the point where a dedicated auth/session provider would make the route guard and session lifecycle much more reliable. The current pattern is a functional workaround, not a robust architecture.

---

## 14. State Management Review

### Local State

- Login password rememeber toggle in `useLogin()`
- Form state in `react-hook-form`
- Drawer open/close state in `AuthenticatedLayout` and `Sidebar`
- Reset password countdown and success state in `useResetPassword`
- Project form save state in `useEditProject` and `useAddProject`

### Global State

- There is no true global state management library.
- Auth status is effectively global in practice but not implemented as global state.
- User name display in `Navbar` depends on `useUser` and `useAuth`, which makes it feel global without being truly centralized.

### Server State

- Projects list fetched by `useProjects()`
- Project detail fetched by `useProject()`
- User data fetched by `useUser()`
- Auth token refresh and logout requests are server-side

### URL State

- `projectId` is used in route params and is the correct source of truth for route-specific project context.
- Recovery token is also stored in the URL hash and then translated into browser storage.

### Derived State

- `Sidebar` computes `hasActiveProject` from `projectName` and `projectId`.
- `BottomNav` derives nav items from projectId.
- `PasswordRequirements` computes validation states from the password field value.

### Problem areas

- The app has duplicated state: project name is derived in multiple places, session is read from storage in multiple places, and auth state is partly in hook state and partly in storage.
- There is a mild state duplication problem between `useProject` and `useProjects`.
- The app should not separately maintain auth state in multiple components when a single auth state model can cover the same need.

---

## 15. Component Review

### Good components

- `Header`, `AuthCard`, `FormField`, and `Button` provide a reusable foundation and are readable.
- `SidebarNavItem` is a clear abstraction for navigation items.
- `ProjectCard` is readable and focused.

### Components that are too coupled or too large

- `AuthenticatedLayout` is a shell component that directly orchestrates layout, drawer state, project nav, and logout. This is acceptable for a simple app but is beginning to do too much.
- `Sidebar` and `MobileDrawer` each repeat similar structure and logic. This is the clearest example of duplicated component-level UI logic and should be unified or at least composed more deliberately.
- `ProjectPage` is only a shell; it is not real feature code, but it still participates in route-level layout and project navigation logic.

### Components that should be split

- `Sidebar` should ideally be split into a `SidebarShell` and a `ProjectSidebarSection` or a `ProjectNavigationPanel` to keep the state and layout responsibilities cleaner.
- `MobileDrawer` should share a common nav item building pattern with `Sidebar` instead of repeating the same navigation entries and logout UI logic.
- `ProjectAccordion` is fine as a focused component, but it is still tied to the app’s project route model rather than a generic navigation list component.

### Components that should be merged

- `Sidebar` and `MobileDrawer` are similar enough that a common nav composition/hook would be more maintainable than two separate implementations.

---

## 16. Hook Review

### Strong hooks

- `useCountdown` is simple and focused.
- `useForgotPassword` is fairly clean and keeps related form state and resend logic together.

### Weak hooks

- `useAuth` does too much: token read, refresh, logout, route state, and navigation. This is not a clean single-purpose hook.
- `useProjects` is simple but reloads the whole project list on each route mount and does not have a stable project cache or a single source of truth.
- `useProject` is a detail fetch hook but is paired with a route that is not actually a detail page. It is not a bug by itself, but it is a signal that the architecture is incomplete.
- `useUser` is a reasonable pattern, but it is not actually used broadly in the application and it reads auth from `useAuth` plus storage again. It duplicates auth determinations.

The hooks are not badly written, but they need more discipline around ownership boundaries and a clearer separation between domain state and UI state.

---

## 17. Forms Review

### Form quality

- `LoginPage`, `SignUp`, `ForgotPasswordPage`, `ResetPasswordPage`, `AddProjectPage`, and `EditProjectPage` all use `react-hook-form` and Zod validation consistently.
- Validation messages are readable and user-facing.
- Disabled submit states are implemented for async actions.

### Issues

- Add/edit project form names are inconsistent (`title` vs `name`).
- Form error messages are useful, but some of the field naming and placeholder language is not perfectly aligned with the actual backend data model.
- Some forms have a `Remember Me` toggle but no actual persistence logic in the form layer beyond the hook.
- `PasswordField` uses a button icon without a proper accessible label for the show/hide action. The current markup hides the button intent from assistive tech since the image has empty alt text and no aria-label.
- The reset password flow does not show a clear invalid-link UI state beyond text; the logic is okay but the user experience is rough.

The forms are generally solid, but they are not yet standardized around a single data contract.

---

## 18. Loading / Error / Empty States

### Present

- Project list: loading skeletons, error state, empty state
- Auth route guards: loading returns null
- Login: server error state
- Forgot password: submitted state and resend banner
- Edit project: loading, error, success, save error
- Add project: submit toasts and session-expired redirect

### Missing or weak

- `ProjectPage` has only a basic loading/error placeholder and no actual content states.
- No page-level empty states for missing project IDs or invalid project URLs.
- `useAuth` route initialization uses a silent `null`, which is a blank state rather than a deliberate loading screen.
- Some async flows show toasts but not an inline error area on the form itself.

The app handles the common states reasonably, but project-specific flows are still too skeletal.

---

## 19. Tailwind / Styling Review

### Strengths

- Tailwind classes are mostly readable and consistent.
- The UI uses a small number of shared classes and a theme-like palette through variable names.
- The app is not over-abstraction-heavy in the styling layer.

### Problems

- There are many custom class names such as `text-boy-sm`, `text-pp`, `text-logo`, etc. Those may be valid design tokens, but without a clear token catalog they can become opaque and hard to maintain.
- Some class strings are long and repetitive across multiple components.
- There are cases where custom CSS variable syntax is used in class names such as `md:w-(--layout-auth-width)`, which may be valid in Tailwind v4 but can be harder to reason about and maintain.
- Some components use arbitrary or custom utility combinations that are harder to scan quickly.

Overall, the style system is serviceable, but the app would benefit from a smaller, more explicit tokenized design vocabulary and less repeated utility composition.

---

## 20. Accessibility Review

### Good

- Form labels are used in most places.
- Many buttons have visible text or labels.
- `aria-label` is used for menu toggles and alert text exists for some errors.

### Problems

- `PasswordField` visibility toggle button has no accessible label on the toggle icon; it only renders an `img` with `alt=""`.
- Some focused/hover states exist, but keyboard focus styling is not consistently strong across custom interactive elements.
- The app has a drawer and overlays, but they are not backed with more explicit dialog semantics or focus-management logic.
- `SidebarNavItem` uses a button element when there is no `to`, but it does not clearly separate a disabled or non-link action from actual navigation.
- The `Remember Me` checkbox may rely on a custom component that is not fully inspected here; it should be validated separately for accessibility and keyboard behavior.

This is a functional app, but not yet quite strong enough for accessibility compliance at a higher standard.

---

## 21. Performance Review

This app is small enough that the performance budget is not currently under severe stress, but there are some avoidable patterns:

- `useProjects` fetches all projects for the project page route and filters them on the client, which is unnecessary when a route-specific fetch by ID is more deterministic.
- `useAuth` and `useUser` both consult a session and independently trigger fetch logic. This can create duplicated fetch work across route changes.
- `ProjectPage` is effectively an extra list fetch + client-side filter for a detail route, which is more work than needed.
- There is no memoization or list virtualization pressure at this size, so optimization is not urgently needed. The bigger issue is redundant state and redundant fetches.

The app is not performance-heavy, but there is enough redundant data fetching to justify cleanup once the product features are implemented.

---

## 22. Dependency Review

### KEEP

- react, react-dom, react-router-dom: required for the app’s routing and UI.
- @hookform/resolvers, react-hook-form, zod: this is a solid choice for typed forms and validation.
- tailwindcss, @tailwindcss/vite: directly used for styling and Vite integration.
- sonner: used for toasts and is a sensible lightweight choice.
- vite, @vitejs/plugin-react, @types/*, typescript, eslint: required for modern Vite React app development.

### REMOVE or reassess

- `tailwind-merge` is present in package.json but no direct usage was identified in the inspected code. It may be a leftover dependency or planned for future use. It is not serving an immediate purpose in this app as reviewed.
- `vite-plugin-svgr` is used in the code for SVG imports, so it should stay.

### OPTIONAL

- `sonner` is optional only if toast notifications are deemed larger than necessary, but in this project it is already used effectively.

There is no evidence of a dependency problem severe enough to justify removal beyond `tailwind-merge` as a likely unused package.

---

## 23. Files That Should Move

- src/store/Authstore.ts → src/lib/auth/sessionStorage.ts
  - Reason: This file is a browser storage abstraction, not a generic store. The name and location are misleading and do not reflect the actual lifecycle being managed.

- src/services/AuthService.ts → src/features/auth/api/authApi.ts
  - Reason: Auth service logic is domain-specific and should live near the auth feature slice rather than in a general service root if the app scales.

- src/services/ProjectService.ts → src/features/projects/api/projectApi.ts
  - Reason: Project API is a feature domain and should live with project logic for cleaner ownership and better separation from auth data.

- src/hooks/useAuth.ts → src/features/auth/useAuth.ts or src/features/auth/authState.ts
  - Reason: This is feature-level logic and should be grouped with the auth feature rather than in a general hooks folder.

- src/hooks/useProjects.ts → src/features/projects/useProjects.ts
  - Reason: This logically belongs with the project feature and not in a generic hook collection.

---

## 24. Files That Should Be Split

### src/components/auth-layout/AuthenticatedLayout.tsx

- Current responsibility: layout shell + project nav + logout state + drawer visibility
- Split into:
  - `AppShell` or `AppLayout` — page shell and structure
  - `SidebarNavigation` — project and general nav composition
  - `MobileNavigationDrawer` — mobile-only drawer and menu behavior
  - `LayoutHeader` — header/title area
- Reason: The component currently manages multiple UI concerns and is too central for a growing app.

### src/components/auth-layout/Sidebar.tsx

- Current responsibility: sidebar display, collapse state, project accordion, logout button, and project-specific nav.
- Split into:
  - `Sidebar` layout container
  - `SidebarProjectSection` for project-specific nav
  - `SidebarFooterActions` for collapse/logout
- Reason: The current file merges layout state, project-specific UI, and action state.

### src/components/auth-layout/MobileDrawer.tsx

- Similar issue: menu composition, project section, and footer actions are entangled in one component.

### src/hooks/useAuth.ts

- Split into:
  - `useSessionRecovery()` or `useAuthState()` for session loading / validation
  - `useLogout()` or `useAuthActions()` for sign-out actions
- Reason: The single hook owns both reading and writing auth state, which is too broad.

---

## 25. Files That Should Be Merged

There are not many strong candidates for merging, but one case is worth noting:

- src/pages/ProjectPage.tsx and src/hooks/useProject.ts are conceptually connected but currently out of sync. They should not be merged blindly, but the page route and hook should be aligned around a single project-fetch pattern instead of a separate list-based lookup.

The main theme here is not merging in general; it is aligning the same domain concern around one code path.

---

## 26. Duplicated Logic

### API logic

- Auth endpoints in `AuthService.ts` each parse response bodies with slightly different patterns.
- Project endpoints in `ProjectService.ts` hand-parse JSON/text for every request.
- The same session check (`getSession()`) is repeated across multiple hooks.

### State

- Auth status is effectively duplicated between hook state and persisted session state.
- Project name is passed down as props in multiple places without a single canonical project state container.

### Types

- Project payload and error types are duplicated in a way that is not normalized.
- The app uses both `Project` and `project`-like response shapes without a stronger shared API contract.

### Components

- Sidebar and MobileDrawer share nearly the same navigation structure and project actions.
- Auth pages share `Header`, `AuthCard`, and form elements, which is good, but the `PasswordField` and `FormField` patterns could be further standardized.

### Utilities

- Password requirements are defined in both `src/utils/passwordRequirements.ts` and `src/components/register/PasswordRequirements.tsx`. They are not exactly identical and are a sign of duplicated validation logic.

### Validation

- Password validation logic exists in `Passwordschema.ts` and is partly duplicated in `PasswordRequirements.tsx` and `getPasswordRequirements()`. This is a maintainability risk.

### Auth logic

- Route guards and session checks use similar logic separately, without a central source of truth.

---

## 27. Recommended Folder Structure

A more coherent structure for the project would look like this:

src/
app/
App.tsx
routes/
ProtectedRoutes.tsx
PublicRoutes.tsx
features/
auth/
api/
authApi.ts
components/
LoginForm.tsx
ResetPasswordForm.tsx
hooks/
useAuth.ts
useLogin.ts
useResetPassword.ts
types/
auth.types.ts
storage/
sessionStorage.ts
projects/
api/
projectApi.ts
components/
ProjectCard.tsx
ProjectListHeader.tsx
ProjectSidebar.tsx
hooks/
useProjects.ts
useProject.ts
useAddProject.ts
useEditProject.ts
types/
project.types.ts
users/
api/
userApi.ts
hooks/
useUser.ts
shared/
components/
AuthCard.tsx
Button.tsx
FormField.tsx
PasswordField.tsx
Header.tsx
utils/
formatDate.ts
getInitials.ts
passwordRequirements.ts
schemas/
authSchemas.ts
projectSchemas.ts
styles/
index.css
main.tsx

This is not a large architectural change; it is mostly a better grouping of existing code.

---

## 28. Recommended Architecture

The app should follow a simple domain-oriented layer structure:

1. App shell and routes sit at the top level.
2. Each feature area owns its own API, hooks, and type contracts.
3. Shared UI and utility code stays in a shared layer.
4. Auth/session lifecycle is managed in one place rather than being rebuilt in multiple hooks.
5. Project route state should come from the URL and a single project fetch/source-of-truth rather than client-side list filtering.
6. Services should normalize API responses once, and UI code should not parse raw response bodies.

The key principle: the UI should not have to know whether data came from localStorage, a project list, or a direct project-by-id fetch. It should ask a feature hook or provider for a consistent state shape.

---

## 29. P0 — Must Fix

1. Replace the duplicated auth/session model with a single auth state source of truth.
2. Align project route handling around a real project detail source of truth instead of list filtering.
3. Fix stale reset-token handling and one-time auth state capture in the reset flow.
4. Resolve the mismatch between form names and backend contract for create/edit project flows.
5. Either implement the missing project subpages or remove the routes that imply finished feature coverage.

---

## 30. P1 — Should Fix

1. Standardize API handling and error normalization across all services.
2. Reduce duplicated UI logic between `Sidebar` and `MobileDrawer`.
3. Strengthen accessibility for password visibility toggles and drawer semantics.
4. Replace empty loading states (`null`) with explicit loading screens or route-level placeholders.
5. Add stronger session validation and expiration handling.

---

## 31. P2 — Nice to Have

1. Remove unused dependencies such as `tailwind-merge` if no direct usage remains.
2. Consolidate duplicate password rule definitions into one canonical validation utility.
3. Improve project navigation state and selected-project behavior.
4. Add a clearer route config abstraction and possibly nested routes for the project shell.
5. Normalize CSS token naming and reduce repeated custom class combinations.

---

## 32. Things That Are Already Good

These parts are reasonable and should be preserved unless there is a specific bug tied to them:

- The project structure is understandable and easy to navigate for a small app.
- Route-level separation between public and protected flows is a good starting structure.
- Using Zod + React Hook Form is a good choice for validation and form quality.
- The app uses a service layer for API work rather than placing fetch calls directly in page components.
- There is a clear visual system with reusable card, header, and form elements.
- `useCountdown`, `useForgotPassword`, and the general form handling are understandable and implementable.
- The project has clean naming for most components and a conventional React layout.

These areas are already good enough to keep and build on; the main priority is not a full rewrite but a measured correction of the auth and project-state architecture.

---

## Verification

I ran the project verification commands directly:

- `pnpm lint`
- `pnpm exec tsc --noEmit`
- `pnpm build`

This returned no output in the terminal session, which is consistent with a clean pass in this environment. I did not ignore or change source code during this review.
