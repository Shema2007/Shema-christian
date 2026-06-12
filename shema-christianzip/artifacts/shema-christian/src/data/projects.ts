export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  outcome: string;
  tags: string[];
  image: string;
  link: string | null;
  live: boolean;
  stack: { category: string; items: string[] }[];
}

export const projects: Project[] = [
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
