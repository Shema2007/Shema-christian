import { motion } from "framer-motion";
import { ArrowRight, Clock, Loader2, Tag } from "lucide-react";
import { useLocation } from "wouter";
import { useListPosts } from "@workspace/api-client-react";

export default function Blog() {
  const [, navigate] = useLocation();
  const { data: posts, isLoading, isError } = useListPosts();

  return (
    <section id="blog" className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">Insights</h2>
            <h3 className="text-3xl md:text-5xl font-bold">Dev Articles</h3>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Practical writing on full-stack development, system design, and building software that lasts.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 size={24} className="animate-spin mr-3" />
            Loading articles…
          </div>
        )}

        {isError && (
          <div className="text-center py-24 text-muted-foreground text-sm">
            Could not load articles. Please try again later.
          </div>
        )}

        {posts && posts.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm font-mono">
            No articles yet — check back soon.
          </div>
        )}

        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => navigate(`/blog/${post.slug}`)}
                className="group flex flex-col bg-card border border-border rounded-xl p-7 hover:border-primary/40 hover:bg-card/80 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className={`flex items-center gap-1.5 text-xs font-mono font-semibold ${post.tagColor}`}>
                    <Tag size={11} />
                    {post.tag}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                    <Clock size={11} />
                    {post.readTime}
                  </span>
                </div>

                <h4 className="text-lg font-bold leading-snug mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>

                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">{post.date}</span>
                  <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Read article <ArrowRight size={12} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground font-mono mb-4">More articles coming soon</p>
          <div className="w-24 h-px bg-border mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
