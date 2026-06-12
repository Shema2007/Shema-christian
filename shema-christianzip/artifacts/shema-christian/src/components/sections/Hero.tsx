import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6"
          >
            Code with <span className="text-primary">Purpose.</span><br />
            Build for His Glory.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Precision engineering for the modern web. I design and build scalable, reliable, and high-performing digital systems.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#projects"
              data-testid="button-view-work"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors group"
            >
              View My Work
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/resume.html"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-download-cv"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-foreground border border-primary/40 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-primary/10 hover:border-primary transition-colors group"
            >
              <Download size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Download CV
            </a>
            <a
              href="#contact"
              data-testid="button-lets-talk"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-foreground border border-border rounded-md font-medium flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              Let's Talk
            </a>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </section>
  );
}
