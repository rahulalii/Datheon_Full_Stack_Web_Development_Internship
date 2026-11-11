/**
 * Main JavaScript Controller for Developer Portfolio
 * Features: Dark/Light Mode, Mobile Navigation, Project Filter & Native <dialog> Modal,
 * Form Handling, Toast Alerts, ScrollSpy, and Clipboard API.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNavigation();
  initProjects();
  initContactForm();
  initEmailCopy();
  initScrollSpy();
  initBackToTop();
  initStatsObserver();
});

/* ==========================================================================
   1. Theme Management (Modern Web Guidance Compliant)
   ========================================================================== */
function initTheme() {
  const themeToggleBtns = document.querySelectorAll(".theme-toggle-btn");
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

  function getResolvedTheme() {
    const saved = localStorage.getItem("color-scheme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(scheme, shouldStore = false) {
    if (shouldStore) {
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      if (scheme === systemPreference) {
        localStorage.removeItem("color-scheme");
        if (metaColorScheme) metaColorScheme.content = "light dark";
      } else {
        localStorage.setItem("color-scheme", scheme);
        if (metaColorScheme) metaColorScheme.content = scheme;
      }
    }

    document.documentElement.setAttribute("data-theme", scheme);

    const isDark = scheme === "dark";
    const label = isDark ? "Switch to light theme" : "Switch to dark theme";

    themeToggleBtns.forEach((btn) => {
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  // Bind click handlers to all theme buttons
  themeToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || getResolvedTheme();
      const nextTheme = current === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });
  });

  // Listen for system color-scheme changes when user hasn't explicitly overridden
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("color-scheme")) {
      applyTheme(e.matches ? "dark" : "light", false);
    }
  });

  // Sync across tabs
  window.addEventListener("storage", (e) => {
    if (e.key === "color-scheme") {
      const newTheme = e.newValue || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      applyTheme(newTheme, false);
    }
  });

  // Initial application
  applyTheme(getResolvedTheme(), false);
}

/* ==========================================================================
   2. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNavigation() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const drawer = document.querySelector(".mobile-nav-drawer");
  const backdrop = document.querySelector(".mobile-nav-backdrop");
  const navLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !drawer || !backdrop) return;

  function openMenu() {
    menuBtn.setAttribute("aria-expanded", "true");
    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuBtn.setAttribute("aria-expanded", "false");
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  menuBtn.addEventListener("click", () => {
    const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  backdrop.addEventListener("click", closeMenu);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      closeMenu();
      menuBtn.focus();
    }
  });
}

/* ==========================================================================
   3. Featured Projects & Interactive Modal Dialog
   ========================================================================== */
function initProjects() {
  const projectsGrid = document.querySelector(".projects-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("project-modal");

  if (!projectsGrid || typeof projectsData === "undefined") return;

  // Render Projects Grid
  function renderProjects(filter = "all") {
    projectsGrid.innerHTML = "";

    const filtered =
      filter === "all" ? projectsData : projectsData.filter((item) => item.category === filter);

    filtered.forEach((project) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("data-category", project.category);

      card.innerHTML = `
        <div class="project-thumb-container">
          <img src="${project.image}" alt="${project.title} Interface Preview" class="project-thumb" loading="lazy">
          <span class="project-category-badge">${project.categoryLabel}</span>
        </div>
        <div class="project-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-tagline">${project.tagline}</p>
          <div class="project-tech-tags" aria-label="Technologies used">
            ${project.tags.map((tag) => `<span class="tech-tag">${tag}</span>`).join("")}
          </div>
          <div class="project-actions">
            <button type="button" class="project-btn-details" data-project-id="${project.id}">
              <span>View Details</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <div class="project-icon-links">
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-icon-btn" aria-label="View ${project.title} source code on GitHub" title="GitHub Repository">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
              <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="project-icon-btn" aria-label="Open live demo of ${project.title}" title="Live Demo">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </div>
      `;

      projectsGrid.appendChild(card);
    });

    // Rebind project detail buttons
    document.querySelectorAll(".project-btn-details").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-project-id");
        openProjectModal(id);
      });
    });
  }

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const category = btn.getAttribute("data-filter");
      renderProjects(category);
    });
  });

  // Modal Dialog Logic
  function openProjectModal(projectId) {
    if (!modal) return;
    const project = projectsData.find((p) => p.id === projectId);
    if (!project) return;

    const modalTitle = document.getElementById("modal-project-title");
    const modalTagline = document.getElementById("modal-project-tagline");
    const modalImage = document.getElementById("modal-project-image");
    const modalOverview = document.getElementById("modal-project-overview");
    const modalArchitecture = document.getElementById("modal-project-architecture");
    const modalHighlights = document.getElementById("modal-project-highlights");
    const modalChallenges = document.getElementById("modal-project-challenges");
    const modalTags = document.getElementById("modal-project-tags");
    const modalDemoLink = document.getElementById("modal-demo-link");
    const modalGithubLink = document.getElementById("modal-github-link");

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalTagline) modalTagline.textContent = project.tagline;
    if (modalImage) {
      modalImage.src = project.image;
      modalImage.alt = `${project.title} Preview`;
    }
    if (modalOverview) modalOverview.textContent = project.description;
    if (modalArchitecture) modalArchitecture.textContent = project.architecture;
    if (modalChallenges) modalChallenges.textContent = project.challenges;

    if (modalHighlights) {
      modalHighlights.innerHTML = project.highlights.map((h) => `<li>${h}</li>`).join("");
    }

    if (modalTags) {
      modalTags.innerHTML = project.tags.map((tag) => `<span class="tech-tag">${tag}</span>`).join("");
    }

    if (modalDemoLink) modalDemoLink.href = project.demoUrl;
    if (modalGithubLink) modalGithubLink.href = project.githubUrl;

    // Open via native showModal()
    modal.showModal();
  }

  // Fallback for light-dismiss on browsers that don't support closedby attribute yet (Safari)
  if (modal && !("closedBy" in HTMLDialogElement.prototype)) {
    modal.addEventListener("click", (event) => {
      if (event.target !== modal) return;
      const rect = modal.getBoundingClientRect();
      const isContentClick =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isContentClick) {
        modal.close();
      }
    });
  }

  // Initial Render
  renderProjects("all");
}

/* ==========================================================================
   4. Email Copy to Clipboard
   ========================================================================== */
function initEmailCopy() {
  const copyBtns = document.querySelectorAll(".copy-email-btn");
  const emailAddress = "rahul.dev@example.com";

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(emailAddress);
        } else {
          // Fallback for older browsers / insecure origins
          const tempInput = document.createElement("input");
          tempInput.value = emailAddress;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }
        showToast("Email address copied to clipboard!");
      } catch (err) {
        showToast("Copied: " + emailAddress);
      }
    });
  });
}

/* ==========================================================================
   5. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    // Simulate submission state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
      <span>Sending...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();
      showToast("Thank you! Your message has been sent successfully.");
    }, 900);
  });
}

/* ==========================================================================
   6. Toast Notifications
   ========================================================================== */
function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast-icon-success">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    </span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ==========================================================================
   7. ScrollSpy & Navigation Active State
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".desktop-nav .nav-link, .mobile-nav-link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${currentId}`) {
              link.classList.add("active");
            } else {
              link.classList.remove("active");
            }
          });
        }
      });
    },
    {
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   8. Floating Back To Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.querySelector(".back-to-top-btn");
  if (!backToTopBtn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    },
    { passive: true }
  );

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==========================================================================
   9. Animated Stats Counter on Viewport Entry
   ========================================================================== */
function initStatsObserver() {
  const statNumbers = document.querySelectorAll(".metric-number");
  if (!statNumbers.length) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          statNumbers.forEach((el) => {
            const text = el.textContent.trim();
            const num = parseFloat(text.replace(/[^0-9.]/g, ""));
            const suffix = text.replace(/[0-9.]/g, "");
            if (isNaN(num)) return;

            let current = 0;
            const duration = 1200;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = num / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= num) {
                current = num;
                clearInterval(timer);
              }
              const formatted = Number.isInteger(num) ? Math.floor(current) : current.toFixed(1);
              el.textContent = formatted + suffix;
            }, stepTime);
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  const metricsSection = document.querySelector(".metrics-section");
  if (metricsSection) {
    observer.observe(metricsSection);
  }
}
