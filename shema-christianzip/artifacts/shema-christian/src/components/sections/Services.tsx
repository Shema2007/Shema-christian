import { motion } from "framer-motion";
import { Server, Database, Code2, Globe, LayoutTemplate, Network } from "lucide-react";

const services = [
  {
    title: "Full-Stack Development",
    description: "End-to-end web applications built with modern frameworks and robust architectures.",
    icon: Code2,
  },
  {
    title: "System Architecture",
    description: "Designing scalable, secure, and highly available infrastructure for enterprise needs.",
    icon: Server,
  },
  {
    title: "API Integration",
    description: "Connecting discrete systems through clean, well-documented REST and GraphQL APIs.",
    icon: Network,
  },
  {
    title: "Database Design",
    description: "Structuring data models for performance, integrity, and complex querying.",
    icon: Database,
  },
  {
    title: "IT & Systems",
    description: "Infrastructure management, deployment pipelines, and operational reliability.",
    icon: Globe,
  },
  {
    title: "Web Production",
    description: "Translating brand identities into fast, responsive, and accessible user interfaces.",
    icon: LayoutTemplate,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Services() {
  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">Areas of Expertise</h2>
          <h3 className="text-3xl md:text-5xl font-bold">Technical Capabilities</h3>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="bg-card border border-border p-8 rounded-xl hover:border-primary/50 transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:bg-primary/10"></div>
              
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                <service.icon size={24} />
              </div>
              <h4 className="text-xl font-bold mb-3">{service.title}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
