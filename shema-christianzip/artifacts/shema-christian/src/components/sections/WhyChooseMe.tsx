import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "Reliable Delivery",
    desc: "I hit deadlines. Predictability and consistency are built into my workflow."
  },
  {
    title: "Clean, Scalable Code",
    desc: "Architecture that grows with your business, written to be understood by the next developer."
  },
  {
    title: "Clear Communication",
    desc: "No technical jargon hiding lack of progress. Transparent, honest updates."
  },
  {
    title: "Purpose-Driven",
    desc: "Every project is approached with conviction and a commitment to excellence."
  }
];

export default function WhyChooseMe() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">The Difference</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Why Partner With Me?</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Technical skill is common. Technical skill paired with reliable execution, clear communication, and deep care for the final product is rare. I provide the latter.
            </p>
            
            <a href="#contact" className="inline-flex items-center justify-center px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-colors">
              Start a Conversation
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {reasons.map((reason, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-xl">
                <CheckCircle2 className="text-primary mb-4" size={24} />
                <h4 className="font-bold text-lg mb-2">{reason.title}</h4>
                <p className="text-sm text-muted-foreground">{reason.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
