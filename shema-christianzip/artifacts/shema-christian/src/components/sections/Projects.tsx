import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useListProjects } from "@workspace/api-client-react";
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

export default function Projects() {
  const [, navigate] = useLocation();
  const { data: projects, isLoading, isError } = useListProjects();

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">Selected Work</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Featured Projects</h3>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            A curated selection of real projects — shipped, live, and built for results.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 size={24} className="animate-spin mr-3" />
            Loading projects…
          </div>
        )}

        {isError && (
          <div className="text-center py-24 text-muted-foreground text-sm">
            Could not load projects. Please try again later.
          </div>
        )}

        {projects && projects.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-sm font-mono">
            No projects yet — check back soon.
          </div>
        )}

        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, i) => {
              const img = imageMap[project.slug] ?? project.image;
              return (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project.slug}`)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.live && (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-primary-foreground text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        LIVE
                      </div>
                    )}
                    <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors z-10" />
                    <img
                      src={img}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold">{project.title}</h4>
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:scale-110 transition-transform"
                        >
                          <ExternalLink size={14} />
                        </a>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                          <ArrowUpRight size={16} />
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm mb-6 flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono px-2 py-1 bg-secondary text-secondary-foreground rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      View Case Study <ArrowUpRight size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
