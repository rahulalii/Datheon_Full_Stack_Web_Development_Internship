# TaskFlow &mdash; Modern Productivity &amp; Task CRUD Application

A fast, responsive, zero-dependency task management application built using vanilla HTML5, CSS3, and ES6+ JavaScript. Designed with clean UX, instant `localStorage` persistence, interactive animations, and keyboard accessibility.

---

## ✨ Features

- **Full CRUD Capabilities**:
  - **Create**: Add tasks with title, category, priority (High / Medium / Low), and due date.
  - **Read**: View tasks in a clean list with color-coded badges, relative due-date pills (Overdue, Today, Tomorrow), and dynamic statistics.
  - **Update**: Toggle completion status in one click, or open the native `<dialog>` modal to edit title, category, priority, due date, and completion state.
  - **Delete**: Remove individual tasks with a safe confirmation modal, or batch clear all completed tasks.
- **Persistent State**:
  - Automatically serializes the `tasks = []` array to the browser's `localStorage` on any state mutation (`saveToLocalStorage()` / `loadFromLocalStorage()`).
  - Pre-populates starter sample tasks on the first visit so the interface is never blank.
  - Features JSON export so users can backup or inspect their tasks.
- **Categorization & Priority**:
  - Supports Work 💼, Personal 🏠, Study 📚, Health 🏃, Finance 💰, and Other 📌.
  - Visual color badges with distinct contrast for light and dark themes.
- **Dynamic Filtering & Instant Search**:
  - **Status Tabs**: Filter by *All*, *Active*, or *Completed* with real-time counter badges.
  - **Category Filter**: Quickly isolate tasks by category.
  - **Live Search**: Instant keystroke search filtering by task title or category.
  - **Sorting**: Sort by Due Date (earliest/latest), Priority (High &rarr; Low), Created Date (newest/oldest), Alphabetical, or Manual.
- **Drag-and-Drop & Accessible Reordering**:
  - Native HTML5 Drag and Drop API support for reordering tasks directly on the list.
  - Keyboard accessible "Move Up" / "Move Down" buttons for screen reader and assistive technology users.
- **Polished Animations & UI Details**:
  - Smooth task entrance and deletion animations.
  - Interactive checkmark pop and strike-through styling on completed tasks.
  - Completion progress bar tracking completed vs. total tasks.
  - Light &amp; Dark theme toggle with persistence.
  - Toast notification system with polite ARIA live region updates.
- **Modern Web Standards**:
  - Form validation with `:user-invalid` pseudo-class and ARIA synchronization (`aria-invalid="false"` until interaction).
  - Native `<dialog closedby="any">` for accessible modal workflows with light-dismiss fallback and scroll-containment.

---

## 🚀 Getting Started

Since TaskFlow has **zero server dependencies and zero build steps**, you can run it immediately:

1. **Directly in your browser**:
   Double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari:
   ```text
   file:///c:/Users/rahul/OneDrive/Desktop/CRUD/index.html
   ```

2. **Or with a lightweight static server**:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

---

## 📂 Project Architecture

```
CRUD/
├── index.html        # Semantic HTML5 document, native dialogs, accessible forms
├── styles.css        # CSS custom properties, responsive grid/flexbox, animations, light/dark themes
├── app.js            # ES6+ state management, CRUD logic, localStorage sync, drag-and-drop
└── README.md         # Documentation and project manual
```

---

## 💾 Data Model (localStorage Schema)

Tasks are stored under the key `'taskflow_tasks_v1'` as a JSON array of task objects:

```json
[
  {
    "id": "task_1731339600000_a1b2c3",
    "title": "Complete Chapter 5: Data Structures & Algorithms",
    "category": "Study",
    "priority": "Medium",
    "dueDate": "2026-11-13",
    "completed": false,
    "createdAt": 1731339600000
  }
]
```

Theme preferences are stored under `'taskflow_theme_preference'` as either `'light'` or `'dark'`.

---

## 🧪 Browser Compatibility

- Chrome 119+ / Edge 119+
- Firefox 88+
- Safari 16.5+
- Mobile Safari (iOS 16+) / Chrome for Android
