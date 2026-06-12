import { motion } from "framer-motion";
import { 
  SiReact, SiNodedotjs, SiTypescript, SiPython, 
  SiPostgresql, SiMongodb, SiDocker, SiGit, 
  SiNextdotjs, SiTailwindcss, SiExpress, SiVercel, 
  SiGraphql, SiRedis, SiLinux 
} from "react-icons/si";

const techStack = [
  { name: "TypeScript", icon: SiTypescript },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Express", icon: SiExpress },
  { name: "Python", icon: SiPython },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Redis", icon: SiRedis },
  { name: "GraphQL", icon: SiGraphql },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Docker", icon: SiDocker },
  { name: "Vercel", icon: SiVercel },
  { name: "Linux", icon: SiLinux },
  { name: "Git", icon: SiGit },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="py-24 bg-card/30 border-y border-border overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">Arsenal</h2>
          <h3 className="text-3xl md:text-5xl font-bold">Tech Stack</h3>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3 bg-card border border-border px-5 py-3 rounded-full hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <tech.icon className="text-xl text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="font-medium text-sm text-foreground">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
