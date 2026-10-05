Build a complete **note-taking web application in Angular** called **Sticky**.

The app should feel like a carefully designed independent productivity tool, **not an AI-generated template**.

## 1. Core Concept

Create a note-taking application where notes visually resemble physical sticky notes pinned onto a workspace.

The primary interaction should be:

**Create → Write → Organize → Search → Edit → Delete**

The experience should be fast, minimal, tactile, and slightly playful while remaining professional.

Use a **neo-brutalist visual design system**.

Do NOT make it look like a typical SaaS dashboard.

---

# 2. Technology

Use:

- Angular
- TypeScript
- HTML
- CSS
- Angular standalone components
- Angular Signals where appropriate
- Browser LocalStorage for persistence
- No backend
- No authentication
- No database
- No external API

The application must work completely offline after loading.

Structure the project cleanly so it can later be migrated from LocalStorage to a backend without rewriting the UI.

---

# 3. Data Model

Each note should contain at minimum:

```ts
interface Note {
  id: string;
  title: string;
  content: string;
  color: NoteColor;
  tags: string[];
  pinned: boolean;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
}
```

Implement all CRUD operations:

- Create note
- Read notes
- Update note
- Delete note
- Pin/unpin
- Archive/unarchive
- Change note color
- Add/remove tags

Persist every change automatically to LocalStorage.

Handle corrupted or missing LocalStorage data gracefully.

---

# 4. Visual Direction — Neo-Brutalism

The design should strongly follow **neo-brutalist UI principles**:

- Thick black borders
- Hard-edged shadows
- High contrast
- Flat colors
- Slightly imperfect / tactile feeling
- Strong typography
- Large readable headings
- Rectangular controls
- Minimal border radius
- Deliberate visual hierarchy
- Buttons that visibly feel clickable
- Shadows should be offset rather than soft/blurry

Example visual language:

```css
border: 3px solid #111;
box-shadow: 5px 5px 0 #111;
```

Avoid excessive rounded cards.

Use a restrained palette such as:

- Off-white / warm paper background
- Black
- Cream
- Yellow
- Orange
- Red
- Blue
- Green

Colors should feel like physical stationery.

Do NOT use gradients.

Do NOT use glassmorphism.

Do NOT use glowing effects.

Do NOT use excessive rounded corners.

Do NOT use purple as the primary accent.

---

# 5. IMPORTANT — Avoid AI Slop

The application must explicitly avoid common AI-generated UI patterns.

DO NOT use:

- Purple-blue gradients
- Generic SaaS dashboards
- Excessive rounded cards
- Glassmorphism
- Floating gradient blobs
- Decorative meaningless illustrations
- Excessive emojis
- Emoji icons instead of proper UI icons
- "✨" style AI copy
- Generic phrases such as "Welcome back!"
- Fake analytics
- Unnecessary charts
- Excessive shadows
- Huge hero sections
- Stock illustrations
- Generic landing-page layouts
- Excessive animations
- Random decorative elements

The application should look like something a **human product designer intentionally designed**.

Use icons only when they communicate an actual function.

Prefer simple SVG icons or a lightweight icon library over emojis.

---

# 6. Main Layout

Design the application around a workspace rather than a dashboard.

### Desktop

Use a layout approximately like:

```text
┌──────────────────────────────────────────────────────────────┐
│ STICKY                         Search              + New Note │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ All Notes     │        Sticky Note Workspace                 │
│ Pinned        │                                              │
│ Archived      │      ┌─────────────┐   ┌─────────────┐       │
│               │      │             │   │             │       │
│ Tags          │      │   NOTE      │   │   NOTE      │       │
│ ─────────     │      │             │   │             │       │
│ Work          │      │             │   │             │       │
│ Personal      │      └─────────────┘   └─────────────┘       │
│ Ideas         │                                              │
│               │      ┌─────────────┐   ┌─────────────┐       │
│               │      │             │   │             │       │
│               │      │   NOTE      │   │   NOTE      │       │
│               │      │             │   │             │       │
│               │      └─────────────┘   └─────────────┘       │
└───────────────┴──────────────────────────────────────────────┘
```

The workspace should feel like a **digital desk covered with sticky notes**.

---

# 7. Sticky Note Design

Each note should visually resemble a real sticky note.

Each note should contain:

- Title
- Content preview
- Tags
- Updated time
- Pin indicator
- Context menu

Example:

```text
┌──────────────────────────┐
│ PROJECT IDEA        ●    │
│                          │
│ Build a lightweight      │
│ content management       │
│ system for...            │
│                          │
│ #project  #idea          │
│                          │
│ Updated 12 min ago       │
└──────────────────────────┘
```

Give different notes slightly different rotations:

```text
-1deg
0deg
1deg
```

But keep this subtle.

Do not randomly rotate everything excessively.

Hovering over a note can slightly straighten it and raise it visually.

---

# 8. Note Editor

When creating or editing a note, use a focused editor.

The editor should contain:

- Title input
- Large content textarea/editor
- Color selector
- Tags input
- Pin toggle
- Archive action
- Delete action
- Close/save controls

The editor can appear as:

- A modal
- Side panel
- Expanded sticky note

Choose whichever produces the best UX.

Prioritize usability over visual gimmicks.

---

# 9. Creating Notes

The **+ New Note** button should immediately create a note and put the user into editing mode.

Avoid unnecessary multi-step dialogs.

Keyboard shortcut:

```text
N → New Note
```

Support:

```text
Ctrl/Cmd + Enter → Save
Esc → Close editor
```

---

# 10. Search

Add instant client-side search.

Search should match:

- Title
- Content
- Tags

Results should update as the user types.

Keyboard shortcut:

```text
/
```

should focus the search field.

Show a sensible empty state when nothing matches.

---

# 11. Filtering

Provide simple filters:

- All
- Pinned
- Archived

Allow filtering by tags.

Do not turn filtering into a complicated sidebar dashboard.

---

# 12. Sorting

Allow notes to be sorted by:

- Recently updated
- Recently created
- Oldest
- Alphabetical

Keep the sorting control visually simple.

---

# 13. LocalStorage

Create a dedicated storage service.

For example:

```text
src/app/core/services/storage.service.ts
```

The service should handle:

```ts
saveNotes()
loadNotes()
deleteNote()
updateNote()
clearNotes()
```

Use JSON serialization.

Automatically save whenever the note state changes.

If LocalStorage is unavailable, show a clear non-blocking warning.

---

# 14. Responsive Design

The application must work well on:

### Desktop
Multi-column sticky-note workspace.

### Tablet
Reduced sidebar + responsive note grid.

### Mobile
Transform the interface into a compact note list/grid.

The sidebar should become a drawer or collapsible section.

The note editor should become a full-screen mobile editor.

Do not simply shrink the desktop interface.

---

# 15. Accessibility

Implement proper:

- Semantic HTML
- Keyboard navigation
- Focus states
- ARIA labels where required
- Accessible buttons
- Accessible form labels
- Sufficient color contrast

Every important action must be usable without a mouse.

---

# 16. Micro-interactions

Use animations sparingly.

Good:

- Note appearing
- Note hover
- Modal/editor opening
- Save feedback
- Filter transition

Avoid:

- Constant floating animations
- Excessive bouncing
- Long transitions
- Decorative animations

Animations should generally be around:

```text
120–200ms
```

Use `prefers-reduced-motion`.

---

# 17. Empty States

Create thoughtful empty states.

For example:

```text
NO NOTES YET

Your workspace is empty.

Create your first note.

[ + New Note ]
```

Keep copy short and human.

Do not use emojis or generic AI language.

---

# 18. Confirmation / Destructive Actions

Deleting a note should require confirmation or provide a short undo mechanism.

Prefer an **Undo** toast after deletion instead of an intrusive confirmation modal.

Example:

```text
Note deleted                    UNDO
```

---

# 19. Component Architecture

Use a maintainable Angular structure such as:

```text
src/app/

  core/
    models/
      note.model.ts

    services/
      notes.service.ts
      storage.service.ts

  features/
    notes/
      components/
        note-card/
        note-editor/
        note-grid/
        note-filters/
        search-bar/

      pages/
        notes-page/

  shared/
    components/
    directives/
    pipes/
```

Use Angular Signals for reactive state where they make sense.

Keep business logic out of templates.

---

# 20. Design Details

Typography should feel editorial and functional.

Use one strong typeface family rather than mixing many fonts.

Recommended direction:

- Bold grotesk/sans-serif for headings
- Clean readable sans-serif for note content

The UI should have strong spacing and intentional alignment.

Use a consistent spacing scale.

Avoid excessive visual density.

---

# 21. Performance

The application should feel instant.

Requirements:

- No unnecessary API calls
- Minimal dependencies
- Lazy-load where useful
- Avoid unnecessary change detection
- Efficient rendering of notes
- Track notes by ID
- Avoid repeatedly parsing LocalStorage
- Keep state centralized

The app should remain responsive with **hundreds of notes**.

---

# 22. Seed Data

On the very first launch, optionally provide 3–5 example notes so the interface doesn't look empty.

Clearly distinguish seed data from user-created notes and allow users to delete them normally.

Example notes:

```text
PROJECT IDEAS
Things I want to experiment with this month.

READ LATER
Books, articles and papers worth revisiting.

CONTENT IDEAS
Ideas for future posts and videos.
```

Do not use emojis.

---

# 23. Final Quality Bar

Before considering the implementation complete, verify:

- Notes survive page refresh
- Notes survive browser restart
- Creating notes works
- Editing works
- Deleting works
- Undo deletion works
- Pinning works
- Archiving works
- Tags work
- Search works
- Filters work
- Sorting works
- Keyboard shortcuts work
- Mobile layout works
- LocalStorage errors are handled
- No console errors
- No placeholder functionality
- No fake buttons
- No dead interactions

Most importantly:

**The final result should feel like a real, opinionated productivity application designed by a product designer—not a generic UI generated from a prompt.**

Prioritize **functionality, visual hierarchy, usability, and design consistency** over adding unnecessary features.