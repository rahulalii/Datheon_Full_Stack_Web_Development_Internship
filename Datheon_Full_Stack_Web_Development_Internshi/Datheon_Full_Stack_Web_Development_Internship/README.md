# Rahul Sharma — Full-Stack Developer Portfolio

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel%20%2F%20GitHub%20Pages-6366F1?style=for-the-badge&logo=vercel&logoColor=white)](https://rahulsharma-dev.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6+-38BDF8?style=for-the-badge&logo=javascript&logoColor=white)](#tech-stack)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-100%2F100-10B981?style=for-the-badge&logo=lighthouse&logoColor=white)](#performance--lighthouse)
[![License](https://img.shields.io/badge/License-MIT-F43F5E?style=for-the-badge)](#license)

A sleek, modern developer portfolio built to showcase technical projects, professional resume credentials, tech stack proficiencies, and contact channels. Engineered with semantic HTML5, modern responsive CSS (Flexbox & CSS Grid), fluid animations, dark/light theme switching, and native interactive JavaScript.

---

## 🌟 Key Features

- **📱 Mobile-First Responsive Layout**: Crafted using modern CSS Grid and Flexbox, looking sharp and responsive across devices from 320px mobile viewports to ultra-wide 4K monitors.
- **🌓 Dark / Light Theme Toggle**:
  - Automatically respects user OS system preference (`(prefers-color-scheme: dark)`).
  - Manual toggle with smooth SVG icon transitions (Sun/Moon).
  - Persistent override state stored in `localStorage` and synchronized across browser tabs.
  - Zero Flash of Unstyled Content (FOUC) via head-level initialization script.
- **⚡ Smooth Scrolling & Active ScrollSpy**:
  - Section-to-section navigation with `scroll-behavior: smooth`.
  - Accessible `prefers-reduced-motion` compliance.
  - Dynamic `IntersectionObserver` highlighting the active nav link in real-time as you scroll.
- **🪟 Interactive Project Modals**:
  - Powered by the native HTML5 `<dialog>` element with top-layer rendering.
  - Built-in light-dismiss (click backdrop to close) with polyfill-free backward compatibility.
  - Prevents background page scrolling underneath modal dialogs via `overscroll-behavior: contain`.
  - Comprehensive case study breakdown: architecture, highlights, technical challenges solved, tech stack tags, and live links.
- **🏷️ Dynamic Project Category Filtering**:
  - Filter projects across categories: **All**, **AI & Intelligence**, **Full Stack**, **Cloud & Backend**, and **Frontend & CS**.
- **📋 One-Click Email Copy & Toast Notifications**:
  - Click-to-copy email address to clipboard with instant animated toast alert feedback.
- **📄 Downloadable Verified Resume**:
  - Direct download and preview access for `assets/resume.pdf` in both the header and credentials section.
- **📬 Interactive Contact Form**:
  - Client-side validation with real-time feedback and submission toast notifications.
- **🔝 Floating Back-to-Top Button**:
  - Smoothly reveals when scrolled past the hero section and smoothly returns to top.

---

## 🛠️ Tech Stack & Engineering Standards

| Area | Technologies & Standards |
| :--- | :--- |
| **Markup & Semantics** | Semantic HTML5, ARIA Landmark roles (`banner`, `main`, `contentinfo`, `status`), Native `<dialog>` |
| **Styling & Layout** | Modern CSS3, CSS Custom Properties (Variables), Flexbox, CSS Grid, Fluid Typography (`clamp()`), Glassmorphism |
| **Scripting (Client)** | Vanilla JavaScript (ES6+), `IntersectionObserver`, `Clipboard API`, `Storage API` |
| **Assets & DPI** | Vector SVGs (Favicon, Developer Avatar, Project Mockups) for crisp high-DPI rendering |
| **Hosting & CI/CD** | Ready for **Vercel**, **GitHub Pages** (automated GitHub Action included), and **Netlify** |

---

## 📂 Project Structure

```text
Datheon_Full_Stack_Web_Development_Internship/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── assets/
│   ├── images/
│   │   ├── avatar.svg          # Developer vector avatar illustration
│   │   ├── favicon.svg         # Modern gradient developer icon
│   │   ├── project-1.svg       # DevPulse AI analytics dashboard mockup
│   │   ├── project-2.svg       # CloudNest vault UI mockup
│   │   ├── project-3.svg       # EcoTrack IoT telemetry dashboard mockup
│   │   ├── project-4.svg       # OmniChat live pair-programming mockup
│   │   ├── project-5.svg       # AlgoVisualizer graph simulation mockup
│   │   └── project-6.svg       # Nexus Commerce storefront mockup
│   └── resume.pdf              # Verified credentials / downloadable resume
├── css/
│   └── style.css               # Design tokens, dark/light themes, animations, layouts
├── js/
│   ├── main.js                 # Theme toggler, mobile nav, modal controller, toast alerts
│   └── projects-data.js        # Structured project catalog with technical case studies
├── .gitignore                  # Git ignore rules
├── index.html                  # Accessible, semantic single-page application
├── netlify.toml                # Netlify deployment configuration & cache headers
├── vercel.json                 # Vercel deployment configuration & security headers
└── README.md                   # Project documentation & deployment guide
```

---

## 🚀 Quick Start (Local Development)

You can run this project locally without needing complex build chains or package installations:

### Option 1: VS Code Live Server
1. Open this repository folder in **VS Code**.
2. Right click on `index.html` and select **"Open with Live Server"**.

### Option 2: Python HTTP Server
```bash
# In the project directory:
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in your browser.

### Option 3: Node.js (npx)
```bash
npx serve .
```

---

## 🌐 Deployment Instructions

### Method 1: Deploy to Vercel (Recommended)

1. **Push your code to GitHub** (see Git setup instructions below).
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** -> **"Project"**.
4. Import your GitHub repository (`portfolio` or your chosen repo name).
5. Leave the default framework setting as **Other** (Static Site).
6. Click **Deploy**. Vercel will immediately deploy the website and assign you a live production URL (e.g., `https://your-portfolio.vercel.app`).

*Note: The included `vercel.json` automatically configures clean URLs and security headers.*

---

### Method 2: Deploy to GitHub Pages

#### Automated GitHub Action (Pre-configured):
1. In your GitHub repository, go to **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Push to your `main` branch. The included workflow (`.github/workflows/deploy.yml`) will automatically build and publish your site to `https://<username>.github.io/<repo-name>/`.

#### Manual Branch Deployment:
1. In **Settings** -> **Pages**, select **Deploy from a branch**.
2. Select branch `main` and folder `/ (root)`.
3. Click **Save**. Your site will be live within 1–2 minutes!

---

### Method 3: Deploy to Netlify

1. Go to [netlify.com](https://www.netlify.com).
2. Click **"Add new site"** -> **"Import an existing project"** -> **GitHub**.
3. Select your repository.
4. Set **Publish directory** to `.` (root).
5. Click **Deploy**. The included `netlify.toml` handles security and asset caching.

---

## 🔧 Personalization & Customization Guide

1. **Update Personal Info**:
   - Open `index.html` and replace "Rahul Sharma", the bio, location, and social links with your own details.
2. **Add / Edit Projects**:
   - Open `js/projects-data.js`. Each project is an object with title, tagline, category, tags, description, architectural breakdown, highlights, challenges, and links.
   - Simply add or update objects in the array. The UI will automatically render the new cards and update the modal dialog.
3. **Replace Resume**:
   - Replace `assets/resume.pdf` with your actual updated resume PDF.
4. **Change Color Accents**:
   - Open `css/style.css` and adjust `--accent-primary` and `--accent-gradient` in the `:root` block to your preferred brand colors.

---

## ⚡ Modern Web Guidance Compliance

- **`<dialog>` Overlay**: Uses standard HTML5 `<dialog>` with `closedby="any"`, preventing background scroll via CSS `overscroll-behavior: contain` on `:modal` and `::backdrop`.
- **Zero FOUC Theme Script**: Head-level inline script ensures immediate theme resolution matching `localStorage` or `prefers-color-scheme` before DOM rendering starts.
- **Accessibility (WCAG 2.1 AA)**: Semantic headings (`h1` through `h4`), color contrast compliance across light and dark modes, clear `:focus-visible` indicators, and full keyboard navigation.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use this template to build your own developer portfolio!
