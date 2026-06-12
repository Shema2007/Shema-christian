import { useParams, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Loader2, Tag, Twitter, Linkedin, Link2 } from "lucide-react";
import { useGetPost } from "@workspace/api-client-react";
import type { ContentSection } from "@workspace/api-client-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";

function RenderSection({ section, i }: { section: ContentSection; i: number }) {
  const base = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4, delay: i * 0.04 } };

  switch (section.type) {
    case "h2":
      return <motion.h2 {...base} className="text-2xl font-bold mt-12 mb-4 text-foreground">{section.text}</motion.h2>;
    case "h3":
      return <motion.h3 {...base} className="text-xl font-bold mt-8 mb-3 text-foreground">{section.text}</motion.h3>;
    case "p":
      return <motion.p {...base} className="text-muted-foreground leading-relaxed mb-4">{section.text}</motion.p>;
    case "quote":
      return (
        <motion.blockquote {...base} className="border-l-4 border-primary pl-6 my-8 italic text-lg text-foreground/80">
          "{section.text}"
        </motion.blockquote>
      );
    case "ul":
      return (
        <motion.ul {...base} className="my-4 flex flex-col gap-2">
          {section.items?.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-muted-foreground text-sm">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item.replace(/`([^`]+)`/g, '<code class="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>') }} />
            </li>
          ))}
        </motion.ul>
      );
    case "code":
      return (
        <motion.div {...base} className="my-6 rounded-xl overflow-hidden border border-border">
          <div className="flex items-center justify-between px-4 py-2.5 bg-secondary border-b border-border">
            <span className="text-xs font-mono text-muted-foreground">{section.lang}</span>
          </div>
          <pre className="p-5 bg-background overflow-x-auto">
            <code className="text-sm font-mono text-foreground/90 leading-relaxed">{section.text}</code>
          </pre>
        </motion.div>
      );
    default:
      return null;
  }
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { data: post, isLoading, isError } = useGetPost(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-muted-foreground">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm font-mono">Loading article…</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to portfolio
        </button>
      </div>
    );
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!", description: "Share link is in your clipboard." });
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`;
  const linkedinUrl = `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-3xl">

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
            <div className="flex items-center gap-3 mb-6">
              <span className={`flex items-center gap-1.5 text-xs font-mono font-semibold ${post.tagColor}`}>
                <Tag size={11} />
                {post.tag}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                <Clock size={11} />
                {post.readTime}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs text-muted-foreground font-mono">{post.date}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">{post.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-border mb-12" />

          {/* Body */}
          <article className="prose-custom">
            {post.content.map((section, i) => (
              <RenderSection key={i} section={section} i={i} />
            ))}
          </article>

          {/* Share */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 pt-10 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div>
              <p className="text-sm font-mono text-primary tracking-wider uppercase mb-1">Share this article</p>
              <p className="text-sm text-muted-foreground">If this was useful, pass it on.</p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-md text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Twitter size={15} /> Twitter
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-md text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Linkedin size={15} /> LinkedIn
              </a>
              <button
                onClick={copyLink}
                className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-md text-sm font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Link2 size={15} /> Copy link
              </button>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-card border border-border rounded-2xl p-10 text-center"
          >
            <p className="text-sm font-mono text-primary tracking-wider uppercase mb-3">Want to work together?</p>
            <h2 className="text-2xl font-bold mb-4">Let's build something great.</h2>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              I'm available for new projects and consulting. Whether you have a brief or just an idea — let's talk.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
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
