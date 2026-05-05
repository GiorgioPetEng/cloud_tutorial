# Fleet Parallel Execution Trial

Goal: validate that the Fleet slash-command can split work across multiple agents with minimal merge conflicts. Each to-do targets a separate file so agents can run concurrently without blocking one another.

---

## To-Do 1 (Agent A): Accessibility and motion polish
**Scope: `styles.css` only**

Tasks:
1. Improve `focus-visible` contrast for all interactive controls in both light and dark themes.
2. Add stronger `prefers-reduced-motion` coverage to collapse hover and entrance animations.
3. Normalize touch-target sizing (min 44x44px) for mobile controls.

Acceptance criteria:
- Keyboard focus ring is clearly visible in light and dark modes.
- All non-essential animations are removed under `prefers-reduced-motion`.
- No layout regressions at 375px mobile breakpoint.

Out of scope: JS logic, HTML structure, localStorage.

---

## To-Do 2 (Agent B): State robustness and persistence hardening
**Scope: `script.js` only**

Tasks:
1. Wrap `localStorage` reads in a try/catch so a malformed JSON value does not crash the app.
2. Extract a single `saveTodos()` call site called after every add, toggle, and delete mutation.
3. Prevent blank or duplicate todo submissions with a clear user-facing validation message.

Acceptance criteria:
- App loads successfully even when `localStorage.todos` contains invalid JSON.
- Add, toggle, and delete always persist state; a reload restores todos and completion state.
- Submitting an empty or duplicate value shows an error message and does not add an item.

Out of scope: CSS, HTML structure, theme logic.

---

## To-Do 3 (Agent C): Semantic structure and UX copy clarity
**Scope: `index.html` only**

Tasks:
1. Improve ARIA labels and descriptions for the form, list, and status regions.
2. Refine heading and subtitle wording to communicate app purpose clearly.
3. Ensure no JS selector IDs or class hooks are renamed or removed.

Acceptance criteria:
- Screen-reader labels are descriptive and non-redundant.
- Page structure passes basic HTML validation (no duplicate IDs, correct landmark roles).
- All existing JS selectors (#todo-form, #todo-input, #todo-list, #helper-text, #theme-toggle, #empty-state, #progress-badge) remain intact.

Out of scope: CSS, JS logic, localStorage.

---

## Parallelization note

To-Do 1, 2, and 3 may run concurrently — default edit scopes are isolated by file (styles.css, script.js, index.html).

Final integration step (after all agents complete): run a manual regression pass for add, toggle, delete, theme toggle, and reload persistence to confirm no cross-file regressions.
