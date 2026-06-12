import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "David M.",
    role: "E-Commerce Business Owner",
    quote: "Shema built our online store from scratch and delivered ahead of schedule. The site is fast, clean, and our sales went up immediately after launch. He doesn't just write code — he thinks about the business.",
    initials: "DM",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "Sarah K.",
    role: "SaaS Startup Founder",
    quote: "We needed a complex dashboard built quickly with real-time data. Shema delivered exactly what was scoped — solid architecture, no shortcuts. He is now our go-to developer for every new feature.",
    initials: "SK",
    color: "from-purple-500 to-purple-700",
  },
  {
    name: "James O.",
    role: "Corporate IT Manager",
    quote: "Reliable, professional, and technically excellent. Shema redesigned our internal systems and the improvement was immediate. Communication was clear throughout. I would not hesitate to work with him again.",
    initials: "JO",
    color: "from-cyan-500 to-cyan-700",
  },
  {
    name: "Amara N.",
    role: "Creative Agency Director",
    quote: "Our clients kept complaining our old website was slow and outdated. Shema rebuilt it in three weeks — now it's the first thing we show prospective clients. It's become a selling point for the whole agency.",
    initials: "AN",
    color: "from-emerald-500 to-emerald-700",
  },
  {
    name: "Peter L.",
    role: "Tech Startup CTO",
    quote: "Shema understands system design at a level most freelancers don't. He asked the right architectural questions upfront, which saved us months of rework down the line. Exceptional problem-solver.",
    initials: "PL",
    color: "from-orange-500 to-orange-700",
  },
  {
    name: "Grace T.",
    role: "Non-Profit Organization Lead",
    quote: "We had a tight budget and a tight timeline. Shema prioritized what mattered and delivered a polished, functional website that our community is proud of. He truly builds with purpose.",
    initials: "GT",
    color: "from-rose-500 to-rose-700",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-sm font-mono text-primary mb-4 tracking-wider uppercase">Social Proof</h2>
            <h3 className="text-3xl md:text-5xl font-bold">What Clients Say</h3>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Real words from people who trusted me with their most important projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              data-testid={`card-testimonial-${i}`}
              className="flex flex-col bg-card border border-border rounded-xl p-7 hover:border-primary/30 transition-colors"
            >
              <Quote size={28} className="text-primary/30 mb-5 flex-shrink-0" />

              <p className="text-sm text-muted-foreground leading-relaxed flex-grow italic">
                "{t.quote}"
              </p>

              <div className="mt-7 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((t, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${t.color} border-2 border-card flex items-center justify-center text-white text-[10px] font-bold`}
                >
                  {t.initials[0]}
                </div>
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-mono">
              <span className="text-primary font-bold">20+</span> happy clients across 5 industries
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
