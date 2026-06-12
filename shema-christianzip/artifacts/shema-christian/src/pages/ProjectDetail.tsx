import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import { useGetProject } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import imgEcommerce from "@/assets/images/project-ecommerce.png";
import imgSaas from "@/assets/images/project-saas.png";
import imgCorporate from "@/assets/images/project-corporate.png";
import imgMobile from "@/assets/images/project-mobile.png";
import imgApi from "@/assets/images/project-api.png";
import imgPortfolio from "@/assets/images/project-portfolio.png";

const imageMap: Record<string, string> = {
  "kapo-kitchenware": imgEcommerce,
  "saas-dashboard": imgSaas,
  "api-gateway": imgApi,
  "mobile-first-pwa": imgMobile,
  "corporate-hub": imgCorporate,
  "portfolio-cms": imgPortfolio,
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { data: project, isLoading, isError } = useGetProject(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-muted-foreground">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm font-mono">Loading project…</p>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Project not found</h1>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={16} /> Back to portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">

          {/* Back */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to portfolio
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
              <div>
                <p className="text-sm font-mono text-primary tracking-wider uppercase mb-3">Case Study</p>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{project.title}</h1>
                <p className="text-xl text-muted-foreground max-w-2xl">{project.tagline}</p>
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors whitespace-nowrap mt-2"
                >
                  View Live Site <ExternalLink size={16} />
                </a>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full">
                  {tag}
                </span>
              ))}
              {project.live && (
                <span className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full aspect-[16/9] rounded-2xl overflow-hidden border border-border mb-20 bg-card"
          >
            <img
              src={imageMap[project.slug] ?? project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            {[
              { label: "The Challenge", icon: "⚡", body: project.challenge },
              { label: "The Solution", icon: "🔧", body: project.solution },
              { label: "The Outcome", icon: "🚀", body: project.outcome },
            ].map((block, i) => (
              <motion.div
                key={block.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="text-2xl mb-3">{block.icon}</div>
                <h2 className="text-lg font-bold mb-4 text-foreground">{block.label}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm">{block.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Tech Stack Breakdown */}
          {project.stack && project.stack.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-10 mb-20"
            >
              <h2 className="text-sm font-mono text-primary tracking-wider uppercase mb-2">Under the Hood</h2>
              <h3 className="text-2xl font-bold mb-8">Tech Stack</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {project.stack.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">{group.category}</p>
                    <ul className="flex flex-col gap-2">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle size={14} className="text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center border-t border-border pt-16"
          >
            <p className="text-sm font-mono text-primary tracking-wider uppercase mb-4">Like what you see?</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's build something together.</h2>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Get in touch →
            </a>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
