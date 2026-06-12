import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-24 bg-card/30 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-square rounded-2xl bg-card border border-border relative overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-primary)_0%,transparent_50%)] opacity-20 group-hover:opacity-30 transition-opacity blur-2xl"></div>
              <img src="/logo.png" alt="Shema Christian Logo" className="w-1/2 h-auto relative z-10 drop-shadow-2xl" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">About Me</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Craftsman. Architect. Developer.</h3>
            
            <div className="space-y-6 text-muted-foreground text-lg">
              <p>
                I am a full-stack developer and IT professional who views software engineering not just as a job, but as a discipline of precision and purpose. 
              </p>
              <p>
                Every line of code is an opportunity to build something reliable, performant, and beautiful. My approach is rooted in strong architectural fundamentals — ensuring that what I build today scales gracefully tomorrow.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border mt-8">
                <div>
                  <h4 className="font-bold text-foreground text-xl mb-2">Develop</h4>
                  <p className="text-sm">Clean, maintainable, and modern codebases.</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-xl mb-2">Reliable</h4>
                  <p className="text-sm">Systems built to withstand scale and edge cases.</p>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-xl mb-2">Perform</h4>
                  <p className="text-sm">Optimized for speed, efficiency, and user experience.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
