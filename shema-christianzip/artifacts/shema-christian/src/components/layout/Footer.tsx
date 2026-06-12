export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Shema Christian" className="h-8 w-auto opacity-70 grayscale" />
          <div className="flex flex-col opacity-70">
            <span className="font-bold text-sm leading-tight tracking-tight text-foreground">SHEMA</span>
            <span className="text-[8px] text-foreground tracking-widest uppercase font-mono">Christian</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground font-mono">
          Code with Purpose. Build for His Glory.
        </p>
        
        <div className="flex items-center gap-6">
          <a href="#hero" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</a>
          <a href="#projects" className="text-sm text-muted-foreground hover:text-primary transition-colors">Projects</a>
          <a href="#blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-8 text-center text-xs text-muted-foreground/60">
        &copy; {currentYear} Shema Christian. All rights reserved.
      </div>
    </footer>
  );
}
