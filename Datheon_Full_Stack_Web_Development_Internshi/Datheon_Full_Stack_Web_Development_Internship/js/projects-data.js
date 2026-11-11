/**
 * Technical Projects Dataset for Portfolio
 * Contains comprehensive details for featured projects, modal popups, and category filtering.
 */
const projectsData = [
  {
    id: "devpulse-ai",
    title: "DevPulse AI",
    tagline: "Developer Analytics & Code Intelligence Platform",
    category: "ai",
    categoryLabel: "AI & Full Stack",
    image: "assets/images/project-1.svg",
    tags: ["React 19", "TypeScript", "Node.js", "Python", "FastAPI", "Gemini API", "PostgreSQL"],
    featured: true,
    stats: {
      stars: "1.4k+",
      metric: "98.4% Accuracy",
      speed: "180ms Latency"
    },
    description:
      "DevPulse AI is an enterprise-grade developer productivity intelligence platform that connects to GitHub/GitLab repositories to perform automated AST code reviews, velocity tracking, and predictive sprint bottlenecks detection using Gemini 1.5 Pro.",
    architecture:
      "Built with a decoupled microservice architecture: Next.js/React frontend with TailwindCSS, FastAPI AI ingestion worker pipeline running asynchronous queue consumers, and a PostgreSQL database with pgvector for semantic code snippet indexing.",
    highlights: [
      "Real-time code quality metrics and automated PR summaries via webhooks",
      "Vector search across codebase using pgvector for context-aware reviews",
      "Interactive analytics dashboard featuring velocity trends and team health graphs",
      "Achieved sub-200ms inference caching via Redis cluster"
    ],
    challenges:
      "Handling large diff payloads without exceeding model token limits. Implemented a syntax-tree chunking algorithm in Python that prioritizes critical execution paths and exports compact semantic summaries to the LLM.",
    demoUrl: "https://devpulse-ai.vercel.app",
    githubUrl: "https://github.com/rahulsharma-dev/devpulse-ai"
  },
  {
    id: "cloudnest",
    title: "CloudNest Vault",
    tagline: "Serverless Distributed Storage & Secure File Vault",
    category: "backend",
    categoryLabel: "Cloud & Distributed Systems",
    image: "assets/images/project-2.svg",
    tags: ["Go", "TypeScript", "AWS S3", "Docker", "Redis", "AES-256", "TailwindCSS"],
    featured: true,
    stats: {
      stars: "820+",
      metric: "AES-256 Encrypted",
      speed: "Zero-Knowledge"
    },
    description:
      "CloudNest is a zero-knowledge cloud storage and file synchronization platform. It offers client-side end-to-end encryption, resumable multipart uploads for multi-gigabyte files, and time-expiring shared links with password protection.",
    architecture:
      "Engineered with a high-throughput Go backend utilizing Goroutine worker pools for chunk validation, integrated with AWS S3 presigned URL flows to stream directly from client to bucket, bypassing server memory bottlenecks.",
    highlights: [
      "Client-side AES-GCM 256-bit encryption before any byte leaves the browser",
      "Resumable chunked upload protocol capable of recovering from connection drops",
      "Granular role-based access control (RBAC) and expiring secure link sharing",
      "Interactive storage analyzer and audit logging"
    ],
    challenges:
      "Ensuring zero memory leakage during high-concurrency 10GB+ file uploads. Solved using direct S3 pre-signed multipart APIs and chunk hash verification on the fly.",
    demoUrl: "https://cloudnest-vault.vercel.app",
    githubUrl: "https://github.com/rahulsharma-dev/cloudnest-vault"
  },
  {
    id: "ecotrack-iot",
    title: "EcoTrack Telemetry",
    tagline: "Real-Time IoT Carbon & Energy Monitoring Mesh",
    category: "fullstack",
    categoryLabel: "Full Stack & IoT",
    image: "assets/images/project-3.svg",
    tags: ["Next.js", "Node.js", "MQTT", "InfluxDB", "Chart.js", "TailwindCSS", "Docker"],
    featured: true,
    stats: {
      stars: "640+",
      metric: "1.2k+ Active Nodes",
      speed: "50ms Live Updates"
    },
    description:
      "An industrial IoT environmental monitoring dashboard visualizing real-time telemetry from over 1,200 deployed microcontroller sensors. Tracks energy consumption, peak load shifts, and carbon emissions in manufacturing facilities.",
    architecture:
      "Event-driven architecture streaming MQTT packet data into an InfluxDB time-series database. A Node.js backend pushes delta updates to a responsive Next.js frontend via Server-Sent Events (SSE) and WebSockets.",
    highlights: [
      "Geospatial mesh sensor map with dynamic color-coded temperature and emission states",
      "Automated anomaly detection triggering Webhook alerts and SMS dispatch",
      "High-density data streaming at 60 FPS using Canvas and WebGL chart renderers",
      "Comprehensive export engine for ESG sustainability audit compliance reports"
    ],
    challenges:
      "Preventing DOM re-rendering thrash when processing hundreds of simultaneous sensor pulses per second. Implemented a buffered sliding window queue on the frontend to batch render updates on `requestAnimationFrame`.",
    demoUrl: "https://ecotrack-iot.vercel.app",
    githubUrl: "https://github.com/rahulsharma-dev/ecotrack-iot"
  },
  {
    id: "omnichat-live",
    title: "OmniChat Live",
    tagline: "Real-Time AI Collaborative Workspace & Pair Coder",
    category: "ai",
    categoryLabel: "AI & Real-Time Web",
    image: "assets/images/project-4.svg",
    tags: ["React", "TypeScript", "WebSockets", "Go", "Gemini 3.8", "TailwindCSS"],
    featured: false,
    stats: {
      stars: "910+",
      metric: "Dual AI & Human",
      speed: "42ms TTFT"
    },
    description:
      "OmniChat Live merges real-time collaborative code editing with an intelligent AI copilot. Multiple developers can pair program inside a shared Monaco editor while streaming AI completions and chatting synchronously.",
    architecture:
      "Powered by Operational Transformation (OT) / CRDT algorithms for conflict-free multi-user editing, coordinated by a high-performance Go WebSocket hub and integrated with Gemini 1.5 Flash via streaming API.",
    highlights: [
      "Bidi streaming AI generation with Markdown and syntax highlighted code execution",
      "Multi-cursor presence indicator showing active collaborators and typing status",
      "In-browser sandbox for instantaneous JavaScript, TypeScript, and Python execution",
      "Dark-first glassmorphism IDE interface designed for prolonged coding sessions"
    ],
    challenges:
      "Resolving concurrent typing conflicts between human keystrokes and rapid streaming LLM completions. Built custom CRDT operational transformation buffers.",
    demoUrl: "https://omnichat-live.vercel.app",
    githubUrl: "https://github.com/rahulsharma-dev/omnichat-live"
  },
  {
    id: "algovisualizer-pro",
    title: "AlgoVisualizer Pro",
    tagline: "Interactive Graph & Pathfinding Simulation Suite",
    category: "frontend",
    categoryLabel: "Frontend & CS Fundamentals",
    image: "assets/images/project-5.svg",
    tags: ["JavaScript (ES6+)", "HTML5 Canvas", "CSS3 Grid", "Web Workers", "Jest"],
    featured: false,
    stats: {
      stars: "2.1k+",
      metric: "20+ Algorithms",
      speed: "60 FPS Smooth"
    },
    description:
      "An educational and algorithmic exploration engine built to visualize graph traversals (Dijkstra, A*, BFS, DFS), sorting algorithms (Quick, Merge, Radix), and dynamic programming tables with step-by-step playback.",
    architecture:
      "Zero-dependency vanilla JavaScript and HTML5 Canvas engine designed for maximum educational clarity and runtime speed. Heavy pathfinding computations run off the main thread inside dedicated Web Workers.",
    highlights: [
      "Interactive maze generator (Recursive Division, Prim's Minimal Spanning Tree)",
      "Play/pause, reverse stepping, and execution speed control sliders",
      "Live algorithmic complexity panel showing Big-O space/time breakdowns",
      "Custom graph editor supporting custom weights and obstacle placements"
    ],
    challenges:
      "Running heavy recursive maze generators without freezing the UI thread. Leveraged Web Workers with structured cloning to perform background path computations.",
    demoUrl: "https://algovisualizer.vercel.app",
    githubUrl: "https://github.com/rahulsharma-dev/algovisualizer-pro"
  },
  {
    id: "nexus-commerce",
    title: "Nexus Commerce",
    tagline: "Headless E-Commerce Engine with Stripe & Instant Search",
    category: "fullstack",
    categoryLabel: "Full Stack & E-Commerce",
    image: "assets/images/project-6.svg",
    tags: ["Next.js 14", "React", "TypeScript", "Stripe API", "PostgreSQL", "Prisma", "TailwindCSS"],
    featured: false,
    stats: {
      stars: "530+",
      metric: "Stripe Checkout",
      speed: "100/100 Lighthouse"
    },
    description:
      "A modern headless e-commerce store engineered for lightning-fast sub-second page loads. Features fuzzy instant search, dynamic cart persistence, Stripe webhook handling, and an automated inventory management dashboard.",
    architecture:
      "Next.js App Router with Server Components for optimal SEO and performance, Prisma ORM querying a resilient PostgreSQL database, and integrated Stripe Checkout with signed webhooks.",
    highlights: [
      "100/100 Google Lighthouse score across Performance, SEO, and Accessibility",
      "Instant client-side optimistic UI updates for shopping bag manipulations",
      "Stripe webhook idempotent transaction processing and invoice generation",
      "Complete mobile-first checkout flow with Apple Pay and Google Pay support"
    ],
    challenges:
      "Preventing double charges and inventory desynchronization during race conditions. Engineered database transaction locks with Prisma and Stripe idempotent keys.",
    demoUrl: "https://nexus-commerce.vercel.app",
    githubUrl: "https://github.com/rahulsharma-dev/nexus-commerce"
  }
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = projectsData;
}
