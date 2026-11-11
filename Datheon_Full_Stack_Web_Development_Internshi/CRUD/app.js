/**
 * TaskFlow - Productivity & Task CRUD Application
 * Features:
 * - Full CRUD (Create, Read, Update, Delete)
 * - State management with localStorage persistence
 * - Status filtering (All, Active, Completed)
 * - Category filtering (Work, Personal, Study, Health, Finance, Other)
 * - Live instant search
 * - Drag-and-drop reordering with persistent order
 * - Native <dialog> modals for editing and delete confirmation
 * - Smooth CSS transitions and completion animations
 * - Accessible keyboard navigation and ARIA error announcements
 */

(() => {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants & Storage Keys
  // ---------------------------------------------------------------------------
  const STORAGE_KEY = 'taskflow_tasks_v1';
  const THEME_KEY = 'taskflow_theme_preference';

  // Sample tasks for first-time visitors
  const DEFAULT_SAMPLE_TASKS = [
    {
      id: 'task-sample-1',
      title: 'Finalize Q4 project roadmap & budget projections',
      category: 'Work',
      priority: 'High',
      dueDate: getRelativeDateString(1), // Tomorrow
      completed: false,
      createdAt: Date.now() - 1000 * 60 * 60 * 4
    },
    {
      id: 'task-sample-2',
      title: 'Review Chapter 5: Advanced Data Structures & Algorithms',
      category: 'Study',
      priority: 'Medium',
      dueDate: getRelativeDateString(2),
      completed: false,
      createdAt: Date.now() - 1000 * 60 * 60 * 24
    },
    {
      id: 'task-sample-3',
      title: 'Schedule annual health checkup & dentist cleaning',
      category: 'Health',
      priority: 'Low',
      dueDate: getRelativeDateString(4),
      completed: false,
      createdAt: Date.now() - 1000 * 60 * 60 * 30
    },
    {
      id: 'task-sample-4',
      title: 'Submit monthly expense receipts for reimbursement',
      category: 'Finance',
      priority: 'High',
      dueDate: getRelativeDateString(0), // Today
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 48
    },
    {
      id: 'task-sample-5',
      title: 'Pick up organic groceries and coffee beans',
      category: 'Personal',
      priority: 'Low',
      dueDate: '',
      completed: true,
      createdAt: Date.now() - 1000 * 60 * 60 * 72
    }
  ];

  // Helper for generating sample dates: offsets in days from today
  function getRelativeDateString(offsetDays) {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  // ---------------------------------------------------------------------------
  // Application State
  // ---------------------------------------------------------------------------
  let tasks = [];
  let currentStatusFilter = 'all'; // 'all' | 'active' | 'completed'
  let currentCategoryFilter = 'all'; // 'all' | category name
  let currentSearchQuery = '';
  let currentSort = 'manual'; // 'manual' | 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'newest' | 'oldest' | 'alphabetical'
  let taskPendingDeletionId = null;
  let draggedTaskId = null;

  // ---------------------------------------------------------------------------
  // DOM Elements Selection
  // ---------------------------------------------------------------------------
  const DOM = {
    // Header & Stats
    currentDateDisplay: document.getElementById('current-date-display'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    statTotal: document.getElementById('stat-total'),
    statActive: document.getElementById('stat-active'),
    statCompleted: document.getElementById('stat-completed'),
    statProgressPercent: document.getElementById('stat-progress-percent'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    progressBarContainer: document.getElementById('progress-bar-container'),

    // Task Creation Form
    addTaskForm: document.getElementById('add-task-form'),
    taskTitleInput: document.getElementById('task-title-input'),
    taskCategorySelect: document.getElementById('task-category-select'),
    taskPrioritySelect: document.getElementById('task-priority-select'),
    taskDateInput: document.getElementById('task-date-input'),

    // Filter, Search, Sort
    statusTabs: document.querySelectorAll('.status-tabs .tab-btn'),
    countAll: document.getElementById('count-all'),
    countActive: document.getElementById('count-active'),
    countCompleted: document.getElementById('count-completed'),
    searchInput: document.getElementById('search-input'),
    clearSearchBtn: document.getElementById('clear-search-btn'),
    filterCategorySelect: document.getElementById('filter-category-select'),
    sortSelect: document.getElementById('sort-select'),
    clearCompletedBtn: document.getElementById('clear-completed-btn'),
    exportDataBtn: document.getElementById('export-data-btn'),
    resetDemoBtn: document.getElementById('reset-demo-btn'),

    // Task List Container & Empty State
    taskList: document.getElementById('task-list'),
    emptyState: document.getElementById('empty-state'),
    emptyStateTitle: document.getElementById('empty-state-title'),
    emptyStateDesc: document.getElementById('empty-state-desc'),
    dragTipText: document.getElementById('reorder-tip-text'),

    // Edit Modal Dialog
    editTaskDialog: document.getElementById('edit-task-dialog'),
    editTaskForm: document.getElementById('edit-task-form'),
    editTaskId: document.getElementById('edit-task-id'),
    editTaskTitle: document.getElementById('edit-task-title'),
    editTaskCategory: document.getElementById('edit-task-category'),
    editTaskPriority: document.getElementById('edit-task-priority'),
    editTaskDate: document.getElementById('edit-task-date'),
    editTaskCompleted: document.getElementById('edit-task-completed'),
    closeEditDialogBtn: document.getElementById('close-edit-dialog-btn'),
    cancelEditBtn: document.getElementById('cancel-edit-btn'),

    // Confirm Delete Dialog
    confirmDeleteDialog: document.getElementById('confirm-delete-dialog'),
    closeDeleteDialogBtn: document.getElementById('close-delete-dialog-btn'),
    cancelDeleteBtn: document.getElementById('cancel-delete-btn'),
    confirmDeleteBtn: document.getElementById('confirm-delete-btn'),
    confirmDeleteMessage: document.getElementById('confirm-delete-message'),

    // Toast
    toastContainer: document.getElementById('toast-notification'),
    toastMessageText: document.getElementById('toast-message-text')
  };

  // ---------------------------------------------------------------------------
  // Accessibility Live Announcer & :user-invalid Fallback System
  // ---------------------------------------------------------------------------
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.classList.add('visually-hidden');
  document.body.append(announcer);

  let announceTimer;
  const linkError = (el, shown) => {
    const errorId = el.dataset.error;
    if (!errorId) return;
    const ids = (el.getAttribute('aria-describedby') || '').split(/\s+/).filter((id) => id && id !== errorId);
    if (shown) ids.push(errorId);
    if (ids.length) el.setAttribute('aria-describedby', ids.join(' '));
    else el.removeAttribute('aria-describedby');
  };

  const announceError = (el) => {
    const error = document.getElementById(el.dataset.error);
    if (!error) return;
    const label = el.labels?.[0] ? `${el.labels[0].textContent.trim()}: ` : '';
    clearTimeout(announceTimer);
    announcer.textContent = '';
    announceTimer = setTimeout(() => {
      announcer.textContent = label + error.textContent.trim();
    }, 400);
  };

  const flagged = new WeakSet();
  const announced = new WeakSet();

  const syncAria = (el, announce = false) => {
    if (!el || !el.matches?.('input, select, textarea')) return;
    const isInvalid = el.matches(':user-invalid') || (el.validity && !el.validity.valid && el.classList.contains('user-invalid-fallback'));
    if (isInvalid) {
      if (announce && !announced.has(el)) {
        announceError(el);
        announced.add(el);
      }
      el.setAttribute('aria-invalid', 'true');
      linkError(el, true);
      flagged.add(el);
    } else if (flagged.has(el) || el.getAttribute('aria-invalid') !== 'true') {
      el.setAttribute('aria-invalid', 'false');
      linkError(el, false);
      flagged.delete(el);
      announced.delete(el);
    }
  };

  // Initialize ARIA invalid on inputs
  document.querySelectorAll('input, select, textarea').forEach((el) => {
    if (!el.hasAttribute('aria-invalid')) el.setAttribute('aria-invalid', 'false');
  });

  document.addEventListener('blur', (e) => syncAria(e.target, true), true);
  document.addEventListener('input', (e) => {
    if (e.target.hasAttribute('aria-invalid')) syncAria(e.target);
  });
  document.addEventListener('invalid', (e) => {
    announced.add(e.target);
    syncAria(e.target);
  }, true);
  document.addEventListener('reset', (e) => {
    setTimeout(() => [...e.target.elements].forEach((el) => syncAria(el)));
  }, true);

  // ---------------------------------------------------------------------------
  // Modal Light-Dismiss Fallback (Modern Web Guidance)
  // ---------------------------------------------------------------------------
  function setupDialogLightDismissFallback(dialog) {
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          dialog.close();
        }
      });
    }
  }
  setupDialogLightDismissFallback(DOM.editTaskDialog);
  setupDialogLightDismissFallback(DOM.confirmDeleteDialog);

  // ---------------------------------------------------------------------------
  // LocalStorage Helper Functions
  // ---------------------------------------------------------------------------
  function saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      showToast('⚠️ Local storage is full or disabled.');
    }
  }

  function loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to parse tasks from localStorage. Falling back to defaults.', error);
    }
    // Return sample starter tasks on first launch
    return [...DEFAULT_SAMPLE_TASKS];
  }

  // ---------------------------------------------------------------------------
  // Theme Management (Light / Dark Mode)
  // ---------------------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', activeTheme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    showToast(`Switched to ${newTheme} theme`);
  }

  // ---------------------------------------------------------------------------
  // Date Display & Formatting Helpers
  // ---------------------------------------------------------------------------
  function updateHeaderDate() {
    const now = new Date();
    const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    DOM.currentDateDisplay.textContent = now.toLocaleDateString(undefined, options);
  }

  /**
   * Returns a friendly badge object for a due date string (YYYY-MM-DD)
   */
  function formatDueDateBadge(dateString) {
    if (!dateString) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    const dueDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const daysOverdue = Math.abs(diffDays);
      return {
        text: `Overdue (${daysOverdue}d)`,
        className: 'due-chip overdue',
        icon: '⚠️'
      };
    } else if (diffDays === 0) {
      return {
        text: 'Due Today',
        className: 'due-chip today',
        icon: '⏰'
      };
    } else if (diffDays === 1) {
      return {
        text: 'Due Tomorrow',
        className: 'due-chip tomorrow',
        icon: '📅'
      };
    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formatted = `${monthNames[dueDate.getMonth()]} ${dueDate.getDate()}`;
      return {
        text: `Due ${formatted}`,
        className: 'due-chip',
        icon: '📅'
      };
    }
  }

  // ---------------------------------------------------------------------------
  // Stats & Progress Calculations
  // ---------------------------------------------------------------------------
  function updateStatistics() {
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.completed).length;
    const activeCount = totalCount - completedCount;
    const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

    DOM.statTotal.textContent = totalCount;
    DOM.statActive.textContent = activeCount;
    DOM.statCompleted.textContent = completedCount;
    DOM.statProgressPercent.textContent = `${percent}%`;

    DOM.progressBarFill.style.width = `${percent}%`;
    DOM.progressBarContainer.setAttribute('aria-valuenow', percent);

    // Filter tab counter badges
    DOM.countAll.textContent = totalCount;
    DOM.countActive.textContent = activeCount;
    DOM.countCompleted.textContent = completedCount;
  }

  // ---------------------------------------------------------------------------
  // CRUD Operations
  // ---------------------------------------------------------------------------

  /**
   * CREATE: Adds a new task to state, persists, and renders
   */
  function addTask(title, category, priority, dueDate) {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTask = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: trimmedTitle,
      category: category || 'Work',
      priority: priority || 'Medium',
      dueDate: dueDate || '',
      completed: false,
      createdAt: Date.now()
    };

    tasks.unshift(newTask);
    saveToLocalStorage();
    renderTasks();
    showToast('Task created successfully');
  }

  /**
   * READ: Returns filtered and sorted tasks array
   */
  function getFilteredAndSortedTasks() {
    let result = [...tasks];

    // Status filter
    if (currentStatusFilter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (currentStatusFilter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Category filter
    if (currentCategoryFilter !== 'all') {
      result = result.filter((t) => t.category.toLowerCase() === currentCategoryFilter.toLowerCase());
    }

    // Search query
    if (currentSearchQuery.trim()) {
      const q = currentSearchQuery.toLowerCase().trim();
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (currentSort === 'dueDateAsc') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    } else if (currentSort === 'dueDateDesc') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.localeCompare(a.dueDate);
      });
    } else if (currentSort === 'priority') {
      const weight = { High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => (weight[b.priority] || 0) - (weight[a.priority] || 0));
    } else if (currentSort === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (currentSort === 'oldest') {
      result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (currentSort === 'alphabetical') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    // 'manual' retains the existing array index order

    return result;
  }

  /**
   * UPDATE: Toggle task completion status
   */
  function toggleTaskComplete(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveToLocalStorage();
    renderTasks();

    const statusMsg = task.completed ? 'Task marked as completed 🎉' : 'Task marked as active';
    showToast(statusMsg);
  }

  /**
   * UPDATE: Opens the Edit Task modal
   */
  function openEditModal(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    DOM.editTaskId.value = task.id;
    DOM.editTaskTitle.value = task.title;
    DOM.editTaskCategory.value = task.category;
    DOM.editTaskPriority.value = task.priority;
    DOM.editTaskDate.value = task.dueDate || '';
    DOM.editTaskCompleted.checked = task.completed;

    DOM.editTaskTitle.setAttribute('aria-invalid', 'false');
    DOM.editTaskTitle.classList.remove('user-invalid-fallback');
    linkError(DOM.editTaskTitle, false);

    DOM.editTaskDialog.showModal();
    DOM.editTaskTitle.focus();
  }

  /**
   * UPDATE: Saves edited task properties
   */
  function saveEditedTask() {
    const id = DOM.editTaskId.value;
    const title = DOM.editTaskTitle.value.trim();
    if (!title) {
      DOM.editTaskTitle.classList.add('user-invalid-fallback');
      syncAria(DOM.editTaskTitle, true);
      return;
    }

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) return;

    tasks[taskIndex].title = title;
    tasks[taskIndex].category = DOM.editTaskCategory.value;
    tasks[taskIndex].priority = DOM.editTaskPriority.value;
    tasks[taskIndex].dueDate = DOM.editTaskDate.value;
    tasks[taskIndex].completed = DOM.editTaskCompleted.checked;

    saveToLocalStorage();
    DOM.editTaskDialog.close();
    renderTasks();
    showToast('Task updated successfully');
  }

  /**
   * DELETE: Opens the confirm delete dialog
   */
  function promptDeleteTask(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    taskPendingDeletionId = taskId;
    DOM.confirmDeleteMessage.textContent = `Are you sure you want to delete "${task.title}"?`;
    DOM.confirmDeleteDialog.showModal();
  }

  /**
   * DELETE: Confirms deletion with smooth DOM exit animation
   */
  function confirmDelete() {
    if (!taskPendingDeletionId) return;

    const id = taskPendingDeletionId;
    taskPendingDeletionId = null;
    DOM.confirmDeleteDialog.close();

    const element = document.querySelector(`[data-task-id="${id}"]`);
    if (element) {
      element.classList.add('deleting');
      setTimeout(() => {
        tasks = tasks.filter((t) => t.id !== id);
        saveToLocalStorage();
        renderTasks();
        showToast('Task deleted');
      }, 220);
    } else {
      tasks = tasks.filter((t) => t.id !== id);
      saveToLocalStorage();
      renderTasks();
      showToast('Task deleted');
    }
  }

  /**
   * DELETE: Clear all completed tasks
   */
  function clearCompletedTasks() {
    const completedCount = tasks.filter((t) => t.completed).length;
    if (completedCount === 0) {
      showToast('No completed tasks to clear');
      return;
    }

    if (confirm(`Remove all ${completedCount} completed task(s)?`)) {
      tasks = tasks.filter((t) => !t.completed);
      saveToLocalStorage();
      renderTasks();
      showToast(`Cleared ${completedCount} completed task(s)`);
    }
  }

  /**
   * REORDER (Keyboard Accessibility): Move task up or down in array
   */
  function moveTask(taskId, direction) {
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index === -1) return;

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    // Swap items in state array
    const temp = tasks[index];
    tasks[index] = tasks[targetIndex];
    tasks[targetIndex] = temp;

    saveToLocalStorage();
    // Set sort to manual so reorder is visually reflected
    if (currentSort !== 'manual') {
      DOM.sortSelect.value = 'manual';
      currentSort = 'manual';
    }
    renderTasks();
    showToast('Task reordered');
  }

  // ---------------------------------------------------------------------------
  // Drag and Drop State & Handlers
  // ---------------------------------------------------------------------------
  function setupDragEvents(itemElement, taskId) {
    itemElement.addEventListener('dragstart', (e) => {
      if (currentSort !== 'manual') {
        e.preventDefault();
        showToast('Switch to "Manual" sort mode to reorder tasks');
        return;
      }
      draggedTaskId = taskId;
      itemElement.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', taskId);
    });

    itemElement.addEventListener('dragend', () => {
      itemElement.classList.remove('dragging');
      draggedTaskId = null;
      document.querySelectorAll('.task-item').forEach((el) => el.classList.remove('drag-over'));
    });

    itemElement.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (draggedTaskId && draggedTaskId !== taskId) {
        itemElement.classList.add('drag-over');
      }
    });

    itemElement.addEventListener('dragleave', () => {
      itemElement.classList.remove('drag-over');
    });

    itemElement.addEventListener('drop', (e) => {
      e.preventDefault();
      itemElement.classList.remove('drag-over');

      if (!draggedTaskId || draggedTaskId === taskId) return;

      const sourceIndex = tasks.findIndex((t) => t.id === draggedTaskId);
      const targetIndex = tasks.findIndex((t) => t.id === taskId);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        // Move element in tasks array
        const [removed] = tasks.splice(sourceIndex, 1);
        tasks.splice(targetIndex, 0, removed);

        saveToLocalStorage();
        renderTasks();
        showToast('Tasks reordered');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------
  function renderTasks() {
    updateStatistics();

    const filtered = getFilteredAndSortedTasks();
    DOM.taskList.innerHTML = '';

    // Reorder tip visibility
    if (currentSort === 'manual' && filtered.length > 1) {
      DOM.dragTipText.textContent = 'Drag handle or use buttons to reorder tasks';
    } else if (currentSort !== 'manual') {
      DOM.dragTipText.textContent = `Sorted by ${DOM.sortSelect.options[DOM.sortSelect.selectedIndex].text} (reordering disabled)`;
    } else {
      DOM.dragTipText.textContent = 'Tasks list';
    }

    if (filtered.length === 0) {
      DOM.emptyState.hidden = false;
      if (currentSearchQuery.trim()) {
        DOM.emptyStateTitle.textContent = 'No matching tasks found';
        DOM.emptyStateDesc.textContent = `No tasks match your search for "${currentSearchQuery}". Try clearing your search or filter.`;
      } else if (currentStatusFilter === 'completed') {
        DOM.emptyStateTitle.textContent = 'No completed tasks yet';
        DOM.emptyStateDesc.textContent = 'Keep working! When you complete tasks, they will appear here.';
      } else if (currentStatusFilter === 'active') {
        DOM.emptyStateTitle.textContent = 'All caught up!';
        DOM.emptyStateDesc.textContent = 'You have zero pending tasks. Enjoy your day or add new goals!';
      } else {
        DOM.emptyStateTitle.textContent = 'Your task list is empty';
        DOM.emptyStateDesc.textContent = 'Get started by creating your first task above.';
      }
      return;
    }

    DOM.emptyState.hidden = true;

    filtered.forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.taskId = task.id;
      li.setAttribute('draggable', currentSort === 'manual' ? 'true' : 'false');

      // Category badge class
      const catClass = `badge-cat-${task.category.toLowerCase()}`;
      // Priority badge class
      const prioClass = `badge-prio-${task.priority.toLowerCase()}`;
      // Due date badge
      const dueDateInfo = formatDueDateBadge(task.dueDate);

      li.innerHTML = `
        <!-- Drag Handle -->
        <div class="drag-handle" title="Drag to reorder" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="12" r="1.5"></circle>
            <circle cx="9" cy="5" r="1.5"></circle>
            <circle cx="9" cy="19" r="1.5"></circle>
            <circle cx="15" cy="12" r="1.5"></circle>
            <circle cx="15" cy="5" r="1.5"></circle>
            <circle cx="15" cy="19" r="1.5"></circle>
          </svg>
        </div>

        <!-- Checkbox Toggle -->
        <div class="task-checkbox-container">
          <input
            type="checkbox"
            class="task-checkbox"
            id="checkbox-${task.id}"
            ${task.completed ? 'checked' : ''}
            aria-label="Mark task '${escapeHtml(task.title)}' as ${task.completed ? 'active' : 'completed'}"
          >
        </div>

        <!-- Task Content -->
        <div class="task-content">
          <div class="task-title-row">
            <span class="task-title">${escapeHtml(task.title)}</span>
          </div>
          <div class="task-meta">
            <span class="badge ${catClass}">${task.category}</span>
            <span class="badge ${prioClass}">P: ${task.priority}</span>
            ${dueDateInfo ? `<span class="${dueDateInfo.className}"><span aria-hidden="true">${dueDateInfo.icon}</span> ${dueDateInfo.text}</span>` : ''}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="task-actions">
          <button type="button" class="btn-task-action btn-move-up" data-action="move-up" title="Move up" aria-label="Move task up" ${index === 0 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
          <button type="button" class="btn-task-action btn-move-down" data-action="move-down" title="Move down" aria-label="Move task down" ${index === filtered.length - 1 ? 'disabled style="opacity:0.3;cursor:not-allowed;"' : ''}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <button type="button" class="btn-task-action btn-edit" data-action="edit" title="Edit task" aria-label="Edit task '${escapeHtml(task.title)}'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </button>
          <button type="button" class="btn-task-action btn-delete" data-action="delete" title="Delete task" aria-label="Delete task '${escapeHtml(task.title)}'">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      // Attach checkbox listener
      const checkbox = li.querySelector('.task-checkbox');
      checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

      // Attach action buttons
      li.querySelector('[data-action="edit"]').addEventListener('click', () => openEditModal(task.id));
      li.querySelector('[data-action="delete"]').addEventListener('click', () => promptDeleteTask(task.id));
      const moveUpBtn = li.querySelector('[data-action="move-up"]');
      if (moveUpBtn && !moveUpBtn.disabled) {
        moveUpBtn.addEventListener('click', () => moveTask(task.id, -1));
      }
      const moveDownBtn = li.querySelector('[data-action="move-down"]');
      if (moveDownBtn && !moveDownBtn.disabled) {
        moveDownBtn.addEventListener('click', () => moveTask(task.id, 1));
      }

      // Drag and drop attachment
      setupDragEvents(li, task.id);

      DOM.taskList.appendChild(li);
    });
  }

  // Escape HTML utility to prevent XSS
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ---------------------------------------------------------------------------
  // Toast Notifications
  // ---------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message) {
    DOM.toastMessageText.textContent = message;
    DOM.toastContainer.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      DOM.toastContainer.classList.remove('show');
    }, 2800);
  }

  // ---------------------------------------------------------------------------
  // Export & Demo Data Actions
  // ---------------------------------------------------------------------------
  function exportTasksToJson() {
    if (tasks.length === 0) {
      showToast('No tasks to export');
      return;
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported tasks to JSON');
  }

  function loadSampleData() {
    if (tasks.length > 0 && !confirm('Load sample tasks? This will reset your task list to demo entries.')) {
      return;
    }
    tasks = [...DEFAULT_SAMPLE_TASKS];
    saveToLocalStorage();
    renderTasks();
    showToast('Loaded sample tasks');
  }

  // ---------------------------------------------------------------------------
  // Event Listeners Setup
  // ---------------------------------------------------------------------------
  function setupEventListeners() {
    // Theme toggle
    DOM.themeToggleBtn.addEventListener('click', toggleTheme);

    // Form submission for adding task
    DOM.addTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = DOM.taskTitleInput.value.trim();

      if (!title) {
        DOM.taskTitleInput.classList.add('user-invalid-fallback');
        syncAria(DOM.taskTitleInput, true);
        DOM.taskTitleInput.focus();
        return;
      }

      DOM.taskTitleInput.classList.remove('user-invalid-fallback');
      addTask(
        title,
        DOM.taskCategorySelect.value,
        DOM.taskPrioritySelect.value,
        DOM.taskDateInput.value
      );

      // Reset form controls
      DOM.addTaskForm.reset();
      DOM.taskPrioritySelect.value = 'Medium';
      DOM.taskCategorySelect.value = 'Work';
      DOM.taskTitleInput.setAttribute('aria-invalid', 'false');
      linkError(DOM.taskTitleInput, false);
      DOM.taskTitleInput.focus();
    });

    // Edit form submission
    DOM.editTaskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveEditedTask();
    });

    // Close and Cancel buttons for edit dialog
    DOM.closeEditDialogBtn.addEventListener('click', () => DOM.editTaskDialog.close());
    DOM.cancelEditBtn.addEventListener('click', () => DOM.editTaskDialog.close());

    // Confirm and Cancel buttons for delete dialog
    DOM.closeDeleteDialogBtn.addEventListener('click', () => {
      taskPendingDeletionId = null;
      DOM.confirmDeleteDialog.close();
    });
    DOM.cancelDeleteBtn.addEventListener('click', () => {
      taskPendingDeletionId = null;
      DOM.confirmDeleteDialog.close();
    });
    DOM.confirmDeleteBtn.addEventListener('click', confirmDelete);

    // Status filter tabs
    DOM.statusTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        DOM.statusTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        currentStatusFilter = tab.dataset.statusFilter;
        renderTasks();
      });
    });

    // Category filter select
    DOM.filterCategorySelect.addEventListener('change', (e) => {
      currentCategoryFilter = e.target.value;
      renderTasks();
    });

    // Sort select
    DOM.sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderTasks();
    });

    // Instant search input
    DOM.searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      DOM.clearSearchBtn.hidden = !currentSearchQuery;
      renderTasks();
    });

    // Clear search button
    DOM.clearSearchBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      currentSearchQuery = '';
      DOM.clearSearchBtn.hidden = true;
      DOM.searchInput.focus();
      renderTasks();
    });

    // Bulk actions
    DOM.clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    DOM.exportDataBtn.addEventListener('click', exportTasksToJson);
    DOM.resetDemoBtn.addEventListener('click', loadSampleData);
  }

  // ---------------------------------------------------------------------------
  // Application Bootstrap
  // ---------------------------------------------------------------------------
  function init() {
    initTheme();
    updateHeaderDate();
    tasks = loadFromLocalStorage();
    setupEventListeners();
    renderTasks();
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
