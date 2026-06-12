export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
  content: Section[];
}

export interface Section {
  type: "h2" | "h3" | "p" | "code" | "ul" | "quote";
  text?: string;
  items?: string[];
  lang?: string;
}

export const posts: Post[] = [
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
      { type: "code", lang: "typescript", text: `export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  priceInCents: integer("price_in_cents").notNull(),
  stock: integer("stock").notNull().default(0),
  categoryId: integer("category_id").references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow(),
});` },
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
      { type: "code", lang: "typescript", text: `class CircuitBreaker {
  private failures = 0;
  private state: "closed" | "open" | "half-open" = "closed";
  private readonly threshold = 5;

  async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") throw new Error("Circuit open");
    try {
      const result = await fn();
      this.reset();
      return result;
    } catch (err) {
      this.failures++;
      if (this.failures >= this.threshold) this.state = "open";
      throw err;
    }
  }

  private reset() { this.failures = 0; this.state = "closed"; }
}` },
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
      { type: "code", lang: "typescript", text: `// Without types — what is this?
function processOrder(order, options) { ... }

// With types — self-documenting
interface Order { id: string; items: LineItem[]; userId: string; }
interface ProcessOptions { sendEmail?: boolean; notifyWarehouse?: boolean; }
function processOrder(order: Order, options: ProcessOptions): Promise<Receipt> { ... }` },
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
      { type: "code", lang: "yaml", text: `# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - run: pnpm install --frozen-lockfile
      - run: pnpm run typecheck
      - run: pnpm run build
      - uses: vercel/actions/deploy@v1` },
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
      { type: "code", lang: "dockerfile", text: `# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s \\
  CMD wget -qO- http://localhost:8080/healthz || exit 1
CMD ["node", "dist/index.js"]` },
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
