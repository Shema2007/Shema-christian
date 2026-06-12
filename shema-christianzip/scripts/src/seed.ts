import { db, projectsTable, postsTable } from "@workspace/db";

const projects = [
  {
    slug: "kapo-kitchenware",
    title: "Kapo Kitchenware",
    tagline: "Full-featured e-commerce storefront for a Rwandan kitchenware brand.",
    description:
      "A production e-commerce site built for Kapo Kitchenware — a local brand selling premium kitchen tools. Features clean product browsing, a responsive mobile-first layout, and a smooth checkout experience built for real customers.",
    challenge:
      "The client needed an online presence that matched the quality of their products. They had no digital store, relied entirely on word-of-mouth, and needed something fast, beautiful, and maintainable without a developer on staff.",
    solution:
      "I built a React + Next.js storefront with Tailwind CSS, optimised for performance and SEO. Product data is managed via a lightweight CMS, and the site is deployed on Vercel for zero-downtime updates.",
    outcome:
      "The site went live and became the brand's primary sales channel within weeks. Page load times under 1.2 s, 100 Lighthouse performance score, and zero post-launch critical bugs.",
    tags: ["React", "Next.js", "Tailwind", "E-Commerce"],
    image: "/images/project-ecommerce.png",
    link: "https://kapo-kitchenwarezip2zip-1zipzipejoz-tawny.vercel.app",
    live: true,
    stack: [
      { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Framer Motion"] },
      { category: "Backend", items: ["Next.js API Routes", "Vercel Serverless"] },
      { category: "Tooling", items: ["Vercel", "ESLint", "Prettier"] },
    ],
  },
  {
    slug: "saas-dashboard",
    title: "SaaS Dashboard",
    tagline: "Real-time analytics platform with multi-tenant architecture.",
    description:
      "A full-stack SaaS dashboard processing large datasets in real time. Built for teams that need live metrics, dynamic charting, and a robust multi-tenant auth layer.",
    challenge:
      "The client's existing spreadsheet-based reporting was slow and error-prone. They needed a centralised, live dashboard accessible by multiple teams with different permission levels.",
    solution:
      "Built with React on the frontend and Node.js + MongoDB on the backend. WebSocket connections push live data to charts without page refreshes. Role-based access control segments data per tenant.",
    outcome:
      "Report generation time dropped from 40 minutes to under 3 seconds. The platform now supports 5 tenants with separate data isolation and zero cross-contamination.",
    tags: ["React", "Node.js", "MongoDB", "WebSockets"],
    image: "/images/project-saas.png",
    link: null,
    live: false,
    stack: [
      { category: "Frontend", items: ["React", "Recharts", "Tailwind CSS"] },
      { category: "Backend", items: ["Node.js", "Express", "MongoDB", "Socket.io"] },
      { category: "Auth", items: ["JWT", "Role-based access control"] },
    ],
  },
  {
    slug: "api-gateway",
    title: "API Gateway System",
    tagline: "High-availability microservices gateway handling thousands of concurrent requests.",
    description:
      "A production-grade API gateway built on a microservices architecture. Designed for high throughput, low latency, and fault tolerance across distributed services.",
    challenge:
      "A growing platform had a monolithic backend that couldn't scale to meet peak traffic. Services were tightly coupled, deployments were risky, and a single bug could take down everything.",
    solution:
      "Decomposed the monolith into independently deployable microservices behind a unified API gateway. Each service runs in Docker containers orchestrated via AWS ECS. GraphQL federation exposes a single API surface.",
    outcome:
      "99.98% uptime since deployment. Peak throughput increased 12× with no increase in hardware costs. Individual services can be deployed and rolled back independently.",
    tags: ["Express", "Docker", "AWS", "GraphQL"],
    image: "/images/project-api.png",
    link: null,
    live: false,
    stack: [
      { category: "Gateway", items: ["Express", "GraphQL Federation", "Apollo Server"] },
      { category: "Infrastructure", items: ["Docker", "AWS ECS", "AWS ALB", "CloudWatch"] },
      { category: "Observability", items: ["Pino", "Prometheus", "Grafana"] },
    ],
  },
  {
    slug: "mobile-first-pwa",
    title: "Mobile-First Web App",
    tagline: "Progressive web app with offline capability and app-like transitions.",
    description:
      "A mobile-first progressive web application designed to work seamlessly in low-connectivity environments. Built with service workers, background sync, and smooth native-feeling transitions.",
    challenge:
      "The target users were in regions with unreliable internet. A traditional web app would fail without connectivity. A native app was out of budget. The solution needed to bridge both worlds.",
    solution:
      "Built a PWA with a service worker caching strategy that serves a full offline experience. Background sync queues user actions and replays them when connectivity returns. Install-to-home-screen works on Android and iOS.",
    outcome:
      "The app works fully offline for core workflows. 40% of users installed it to their home screen. Time-on-site increased 3× compared to the previous mobile website.",
    tags: ["TypeScript", "React", "Tailwind", "PWA"],
    image: "/images/project-mobile.png",
    link: null,
    live: false,
    stack: [
      { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "PWA", items: ["Workbox", "Service Workers", "Web App Manifest"] },
      { category: "State", items: ["Zustand", "React Query", "IndexedDB"] },
    ],
  },
  {
    slug: "corporate-hub",
    title: "Corporate Hub",
    tagline: "SEO-optimised business portal with headless CMS integration.",
    description:
      "A high-performance corporate website and intranet portal with a headless CMS backend. Heavily optimised for SEO and designed to load fast globally via edge delivery.",
    challenge:
      "The client's old website scored 34 on Lighthouse, ranked poorly in search results, and required developer involvement for every content update. Marketing was frustrated and IT was overwhelmed.",
    solution:
      "Rebuilt with Next.js for static generation + ISR, Sanity as the headless CMS, and Vercel's edge network for delivery. Content editors can publish in real time without touching code.",
    outcome:
      "Lighthouse performance score went from 34 → 97. Organic search traffic increased 210% over 6 months. Content updates went from 2–3 days (dev turnaround) to under 5 minutes (self-serve).",
    tags: ["Next.js", "Sanity", "Framer Motion", "SEO"],
    image: "/images/project-corporate.png",
    link: null,
    live: false,
    stack: [
      { category: "Frontend", items: ["Next.js", "Tailwind CSS", "Framer Motion"] },
      { category: "CMS", items: ["Sanity.io", "GROQ", "Portable Text"] },
      { category: "Delivery", items: ["Vercel Edge Network", "ISR", "Image Optimization"] },
    ],
  },
  {
    slug: "portfolio-cms",
    title: "Portfolio CMS",
    tagline: "Bespoke content management platform for creative professionals.",
    description:
      "A custom-built CMS and showcase platform tailored for photographers and designers. Features a drag-and-drop gallery editor, custom asset delivery pipeline, and client-facing proofing tools.",
    challenge:
      "Existing platforms like Squarespace were too rigid and too expensive at scale. The client needed full control over their brand, faster image delivery, and a proofing workflow for client approvals.",
    solution:
      "Built a full-stack application with React on the frontend, PostgreSQL for metadata, and an S3-backed asset pipeline with on-the-fly image resizing via a custom Lambda function.",
    outcome:
      "Image delivery latency dropped 70% compared to the previous Squarespace setup. Client proofing rounds reduced from 5 average to 2. The platform now hosts 12,000+ assets with zero storage complaints.",
    tags: ["React", "PostgreSQL", "AWS S3", "Lambda"],
    image: "/images/project-portfolio.png",
    link: null,
    live: false,
    stack: [
      { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
      { category: "Backend", items: ["Express", "PostgreSQL", "Drizzle ORM"] },
      { category: "Infrastructure", items: ["AWS S3", "AWS Lambda", "CloudFront"] },
    ],
  },
];

const posts = [
  {
    slug: "scalable-ecommerce-nextjs-postgresql",
    title: "Building Scalable E-Commerce with Next.js and PostgreSQL",
    excerpt:
      "How I approached building a production-ready storefront — from database schema design to payment gateway integration — and what I learned along the way.",
    date: "May 2025",
    readTime: "8 min read",
    tag: "Full-Stack",
    tagColor: "text-blue-400",
    content: [
      { type: "p", text: "When I started the Kapo Kitchenware project, I had a clear brief: build a fast, reliable e-commerce storefront that the client could hand off to non-technical staff for content updates. No clunky CMS. No Shopify lock-in. Just clean, owned code that performed." },
      { type: "h2", text: "Starting with the Database" },
      { type: "p", text: "PostgreSQL was the obvious choice for relational product data — variants, inventory counts, categories, and orders. I reached for Drizzle ORM for its TypeScript-first query builder and zero-cost schema migrations." },
      { type: "code", lang: "typescript", text: `export const products = pgTable("products", {\n  id: serial("id").primaryKey(),\n  name: varchar("name", { length: 255 }).notNull(),\n  slug: varchar("slug", { length: 255 }).notNull().unique(),\n  priceInCents: integer("price_in_cents").notNull(),\n  stock: integer("stock").notNull().default(0),\n  categoryId: integer("category_id").references(() => categories.id),\n  createdAt: timestamp("created_at").defaultNow(),\n});` },
      { type: "h2", text: "Next.js for the Frontend" },
      { type: "p", text: "Next.js 14 with the App Router gave me everything I needed: static generation for product listing pages, dynamic routes for individual products, and server actions for cart mutations. The result is a site that feels instant — most pages serve from the edge with no database hit." },
      { type: "h3", text: "Caching Strategy" },
      { type: "p", text: "Product pages are statically generated at build time with `revalidate: 3600`. Cart and checkout routes are fully dynamic. This means the 95% of traffic that's browsing hits a cached response, while the 5% that's buying hits fresh server logic." },
      { type: "h2", text: "What I'd Do Differently" },
      { type: "ul", items: [
        "Use server-side sessions for the cart instead of localStorage — it broke on private browsing mode.",
        "Add optimistic UI for add-to-cart — the 200ms delay to confirm was noticeable on mobile.",
        "Set up edge middleware for geo-based currency earlier — retrofitting it later was messy.",
      ]},
      { type: "quote", text: "Good software is built incrementally. Ship the simple version, measure what breaks, then fix what matters." },
      { type: "p", text: "The project shipped on time, under budget, and the client has made 20+ content updates without ever needing to call me. That's the real metric." },
    ],
  },
  {
    slug: "system-design-patterns",
    title: "System Design: Patterns Every Developer Should Know",
    excerpt:
      "A practical guide to the architectural patterns that separate hobby projects from production systems — load balancing, caching layers, and graceful degradation.",
    date: "April 2025",
    readTime: "12 min read",
    tag: "Architecture",
    tagColor: "text-purple-400",
    content: [
      { type: "p", text: "Most developers learn to code before they learn to architect. The gap shows when a project hits scale — suddenly the things that 'just worked' start falling apart under load. These are the patterns I reach for first." },
      { type: "h2", text: "1. The Circuit Breaker" },
      { type: "p", text: "When one service fails in a microservices system, the failure can cascade. The circuit breaker pattern trips after a configurable number of failures and fast-fails all subsequent calls, giving the downstream service time to recover." },
      { type: "code", lang: "typescript", text: `class CircuitBreaker {\n  private failures = 0;\n  private state: "closed" | "open" | "half-open" = "closed";\n  private readonly threshold = 5;\n\n  async call<T>(fn: () => Promise<T>): Promise<T> {\n    if (this.state === "open") throw new Error("Circuit open");\n    try {\n      const result = await fn();\n      this.reset();\n      return result;\n    } catch (err) {\n      this.failures++;\n      if (this.failures >= this.threshold) this.state = "open";\n      throw err;\n    }\n  }\n\n  private reset() { this.failures = 0; this.state = "closed"; }\n}` },
      { type: "h2", text: "2. Read-Through Cache" },
      { type: "p", text: "Rather than caching at the application layer manually, a read-through cache sits between your service and the database. On a miss it fetches from the database, populates the cache, and returns the result. Redis with a TTL-based eviction strategy handles 80% of caching needs." },
      { type: "h2", text: "3. Event Sourcing" },
      { type: "p", text: "Instead of storing current state, store every event that led to that state. The current state is a projection. This gives you an immutable audit log, time-travel debugging, and the ability to rebuild any projection from scratch." },
      { type: "ul", items: [
        "Immutable event log doubles as audit trail",
        "Temporal queries become trivial ('what was the balance at 3pm yesterday?')",
        "New projections can be built without touching the source data",
        "Complex to implement correctly — don't reach for it unless you need the audit trail",
      ]},
      { type: "quote", text: "Every architectural pattern is a tradeoff. The pattern that scales your system also adds complexity. Know what you're paying for." },
      { type: "h2", text: "When to Use Which" },
      { type: "p", text: "Circuit breakers belong in any service-to-service call. Read-through caches belong anywhere you have heavy read traffic on stable data. Event sourcing belongs in financial systems, audit-sensitive domains, or anywhere you need temporal queries. Don't over-engineer for problems you don't have yet." },
    ],
  },
  {
    slug: "typescript-mindset",
    title: "Why TypeScript Changed How I Write Every Line of Code",
    excerpt:
      "I used to see TypeScript as extra overhead. Now I see it as professional clarity. Here's the shift in thinking that made the difference.",
    date: "March 2025",
    readTime: "6 min read",
    tag: "TypeScript",
    tagColor: "text-cyan-400",
    content: [
      { type: "p", text: "I resisted TypeScript for two years. It felt like writing tests for code I already understood. Then I joined a codebase that had been maintained by four different developers over three years, and I changed my mind in about twenty minutes." },
      { type: "h2", text: "Types as Documentation" },
      { type: "p", text: "The most immediate benefit of TypeScript isn't catching bugs — it's communication. When I define an interface, I'm telling the next developer exactly what shape to expect. It's documentation that stays up to date because the compiler enforces it." },
      { type: "code", lang: "typescript", text: `// Without types — what is this?\nfunction processOrder(order, options) { ... }\n\n// With types — self-documenting\ninterface Order { id: string; items: LineItem[]; userId: string; }\ninterface ProcessOptions { sendEmail?: boolean; notifyWarehouse?: boolean; }\nfunction processOrder(order: Order, options: ProcessOptions): Promise<Receipt> { ... }` },
      { type: "h2", text: "The Feedback Loop" },
      { type: "p", text: "The real win is the feedback loop. In JavaScript, you find out about a type error when it crashes in production. In TypeScript, you find out in your editor, before you've even saved the file. That shift from reactive debugging to proactive prevention changes how you code." },
      { type: "h2", text: "Strict Mode or Nothing" },
      { type: "p", text: "There's no point in TypeScript without `strict: true`. Non-strict TypeScript lets `any` types slip through everywhere and gives you a false sense of safety. Enable strict mode from day one — the initial pain is worth it." },
      { type: "ul", items: [
        "`noImplicitAny` — forces you to type everything explicitly",
        "`strictNullChecks` — makes null/undefined explicit and prevents entire classes of runtime errors",
        "`noUncheckedIndexedAccess` — array access returns `T | undefined`, not just `T`",
      ]},
      { type: "quote", text: "TypeScript doesn't slow you down. It slows down the bugs that would have slowed you down next month." },
    ],
  },
  {
    slug: "end-to-end-workflow",
    title: "From Idea to Deployment: My End-to-End Workflow",
    excerpt:
      "Planning, scaffolding, CI/CD, and deployment — the repeatable process I use for every client project to deliver on time and within scope.",
    date: "February 2025",
    readTime: "10 min read",
    tag: "Process",
    tagColor: "text-green-400",
    content: [
      { type: "p", text: "The biggest source of missed deadlines isn't bad code — it's missing process. After enough projects, I've distilled my workflow into four phases that I repeat for every engagement, regardless of size." },
      { type: "h2", text: "Phase 1: Scope Lock" },
      { type: "p", text: "Before writing a single line of code, I produce a written scope document. It defines deliverables, explicitly lists what's out of scope, and ties each item to an estimate. This document becomes the source of truth when scope creep appears — and it always appears." },
      { type: "h2", text: "Phase 2: Scaffold and CI First" },
      { type: "p", text: "Day one of development: scaffold the project and set up CI/CD before writing any feature code. This means the deployment pipeline is proven before there's anything worth deploying. Shipping the first feature to production takes minutes instead of days." },
      { type: "code", lang: "yaml", text: `# .github/workflows/deploy.yml\nname: Deploy\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v3\n      - run: pnpm install --frozen-lockfile\n      - run: pnpm run typecheck\n      - run: pnpm run build\n      - uses: vercel/actions/deploy@v1` },
      { type: "h2", text: "Phase 3: Feature Development in Vertical Slices" },
      { type: "p", text: "I build features end-to-end — DB schema → API route → frontend — rather than building all the backend first and all the frontend second. A vertical slice is demonstrable and testable immediately. It also surfaces integration problems early." },
      { type: "h2", text: "Phase 4: Hardening Before Handoff" },
      { type: "p", text: "The last 20% of a project is where amateur projects become professional ones. I run Lighthouse on every page, check for missing error states, add rate limiting to every public API endpoint, and write a brief operations runbook." },
      { type: "ul", items: [
        "Lighthouse: all green before handoff",
        "Error boundaries on every async UI section",
        "Rate limiting on all public POST/PUT/DELETE routes",
        "Operations runbook: how to deploy, roll back, and debug",
      ]},
      { type: "quote", text: "Amateurs ship features. Professionals ship systems." },
    ],
  },
  {
    slug: "rest-vs-graphql",
    title: "REST vs GraphQL: Choosing the Right API for Your Project",
    excerpt:
      "Not every project needs GraphQL, and not every project needs REST. Here's how I decide — and how each choice affects the final product.",
    date: "January 2025",
    readTime: "7 min read",
    tag: "APIs",
    tagColor: "text-orange-400",
    content: [
      { type: "p", text: "I've built production systems with both REST and GraphQL. My take: GraphQL is frequently over-recommended and REST is frequently under-appreciated. Here's my actual decision framework." },
      { type: "h2", text: "Start with Your Client Count" },
      { type: "p", text: "If you have one client (a single web app), REST is almost always the right choice. You control the API shape, you can optimise each endpoint for its exact use case, and there's no schema overhead. GraphQL's flexibility is most valuable when multiple clients with different data needs hit the same API." },
      { type: "h2", text: "The Over-fetching Problem Is Overstated" },
      { type: "p", text: "The canonical argument for GraphQL is that it solves over-fetching — clients only request the fields they need. In practice, good REST API design with sparse fieldsets (`?fields=id,name,email`) or purpose-built endpoints solves the same problem without the schema complexity." },
      { type: "h2", text: "Where GraphQL Genuinely Wins" },
      { type: "ul", items: [
        "Public APIs consumed by third-party developers who need flexibility",
        "Platforms with genuinely diverse client types (mobile, web, partner integrations)",
        "Rapid product iteration where the data model changes frequently",
        "Teams that invest in a proper GraphQL gateway (Apollo Federation, etc.)",
      ]},
      { type: "h2", text: "Where REST Wins" },
      { type: "ul", items: [
        "Internal APIs with known clients",
        "Simple CRUD services where HTTP semantics map cleanly",
        "Teams without GraphQL experience — the learning curve is real",
        "Anywhere caching matters — REST's HTTP caching is unmatched",
      ]},
      { type: "quote", text: "Pick the tool that solves your actual problem. GraphQL is not the future of every API — it's the right answer for some APIs." },
    ],
  },
  {
    slug: "dockerizing-nodejs",
    title: "Dockerizing a Node.js App the Right Way",
    excerpt:
      "Multi-stage builds, non-root users, and health checks — the practices that take a container from 'it works' to 'it's production-ready'.",
    date: "December 2024",
    readTime: "9 min read",
    tag: "DevOps",
    tagColor: "text-red-400",
    content: [
      { type: "p", text: "Most Dockerfiles you find in tutorials will work. They won't survive production. These are the practices that separate a 'works on my machine' container from one you'd trust with real traffic." },
      { type: "h2", text: "Multi-Stage Builds" },
      { type: "p", text: "A single-stage build copies your entire development environment into the image — including devDependencies, TypeScript source, and build tooling. Multi-stage builds keep the final image lean." },
      { type: "code", lang: "dockerfile", text: `# Stage 1: Build\nFROM node:22-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --include=dev\nCOPY . .\nRUN npm run build\n\n# Stage 2: Production\nFROM node:22-alpine AS runner\nWORKDIR /app\nRUN addgroup -S appgroup && adduser -S appuser -G appgroup\nCOPY --from=builder /app/dist ./dist\nCOPY --from=builder /app/node_modules ./node_modules\nUSER appuser\nEXPOSE 8080\nHEALTHCHECK --interval=30s --timeout=5s \\\\\n  CMD wget -qO- http://localhost:8080/healthz || exit 1\nCMD ["node", "dist/index.js"]` },
      { type: "h2", text: "Non-Root Users" },
      { type: "p", text: "By default, containers run as root. If your container is ever compromised, that means the attacker has root access to the container filesystem. Always create a dedicated non-root user and switch to it before your CMD." },
      { type: "h2", text: "Health Checks" },
      { type: "p", text: "Without a health check, your orchestrator (ECS, Kubernetes, etc.) has no way to know if your app is actually serving requests or just running a zombie process. Add a health check endpoint and wire it to HEALTHCHECK in your Dockerfile." },
      { type: "h2", text: "Layer Caching" },
      { type: "p", text: "Docker caches each layer. Copy your package.json and run npm install before copying source code — this way, rebuilds only re-install dependencies when the package.json actually changes, not every time you edit a source file." },
      { type: "ul", items: [
        "Copy package.json first, install, then copy source",
        "Use `.dockerignore` to exclude node_modules, .git, and test files",
        "Pin your base image version — `node:22-alpine`, not `node:latest`",
        "Scan your image with `docker scout` before pushing to production",
      ]},
      { type: "quote", text: "A container that works in development is a prototype. A container with health checks, a non-root user, and a lean image is a product." },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding database…");

  console.log("  → Clearing existing projects and posts…");
  await db.delete(projectsTable);
  await db.delete(postsTable);

  console.log("  → Inserting 6 projects…");
  await db.insert(projectsTable).values(projects);

  console.log("  → Inserting 6 blog posts…");
  await db.insert(postsTable).values(posts as Parameters<typeof db.insert>[0] extends never ? never : any);

  console.log("✅ Done! Database seeded with 6 projects and 6 blog posts.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
