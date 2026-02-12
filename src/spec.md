# Specification

## Summary
**Goal:** Restore a working frontend build by replacing missing `@/components/ui/*` (Shadcn) imports with a new local UI kit and ensuring toast notifications still work.

**Planned changes:**
- Add a new local UI kit directory (e.g. `frontend/src/components/ui-kit/*`) containing implementations for the UI primitives currently used by the app (button, card, badge, alert, dialog, alert-dialog, input, label, textarea, select, radio-group) including required subcomponent exports.
- Update all frontend imports from `@/components/ui/*` to a consistent new prefix (e.g. `@/components/ui-kit/*`) so no files under `frontend/src` reference `@/components/ui/*`.
- Replace the missing `@/components/ui/sonner` usage by mounting a working toaster once in `frontend/src/App.tsx` while keeping existing `toast.success` / `toast.error` calls functional.

**User-visible outcome:** The app compiles and runs again without unresolved UI imports, existing screens render without UI-related runtime crashes, and toast notifications continue to display.
