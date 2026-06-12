import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { FolderOpen, BookOpen, LogOut, Plus, Pencil, Trash2, ExternalLink, Inbox, MessageSquare } from "lucide-react";

interface Project { id: number; slug: string; title: string; tagline: string; live: boolean; link: string | null; tags: string[] }
interface Post { id: number; slug: string; title: string; tag: string; tagColor: string; date: string; readTime: string }

type Tab = "projects" | "posts";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<Tab>("posts");
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ type: Tab; slug: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => { if (!r.ok) navigate("/admin/login"); })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/projects").then((r) => r.json()),
      fetch("/api/posts").then((r) => r.json()),
      fetch("/api/admin/contacts", { credentials: "include" }).then((r) => r.ok ? r.json() : []),
    ]).then(([p, po, contacts]) => {
      setProjects(p);
      setPosts(po);
      setUnreadCount((contacts as { read: boolean }[]).filter((c) => !c.read).length);
      setLoading(false);
    });
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    navigate("/admin/login");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const endpoint = deleteTarget.type === "projects" ? "projects" : "posts";
    await fetch(`/api/${endpoint}/${deleteTarget.slug}`, { method: "DELETE", credentials: "include" });
    if (deleteTarget.type === "projects") setProjects((p) => p.filter((x) => x.slug !== deleteTarget.slug));
    else setPosts((p) => p.filter((x) => x.slug !== deleteTarget.slug));
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors">
              <ExternalLink size={14} /> View site
            </a>
            <button onClick={logout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><FolderOpen className="text-primary" size={22} /></div>
            <div><p className="text-2xl font-bold">{projects.length}</p><p className="text-sm text-muted-foreground">Projects</p></div>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><BookOpen className="text-primary" size={22} /></div>
            <div><p className="text-2xl font-bold">{posts.length}</p><p className="text-sm text-muted-foreground">Blog Posts</p></div>
          </div>
          <button
            onClick={() => navigate("/admin/inbox")}
            className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left relative"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center relative shrink-0">
              <Inbox className="text-primary" size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium">Contact Inbox</p>
              <p className="text-sm text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread` : "No new messages"}</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/admin/chat-logs")}
            className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-colors text-left"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="text-primary" size={22} />
            </div>
            <div>
              <p className="text-sm font-medium">AI Chat Logs</p>
              <p className="text-sm text-muted-foreground">View conversations →</p>
            </div>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border pb-4">
          {(["posts", "projects"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
              {t === "posts" ? "Blog Posts" : "Projects"}
            </button>
          ))}
          <div className="ml-auto">
            <button onClick={() => navigate(tab === "posts" ? "/admin/posts/new" : "/admin/projects/new")} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
              <Plus size={15} /> New {tab === "posts" ? "Post" : "Project"}
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading…</div>
        ) : tab === "posts" ? (
          <div className="flex flex-col gap-3">
            {posts.length === 0 && <p className="text-center py-16 text-muted-foreground">No posts yet. Create your first one.</p>}
            {posts.map((post) => (
              <div key={post.slug} className="bg-card border border-border rounded-xl px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span className={`text-xs font-mono font-semibold shrink-0 ${post.tagColor}`}>{post.tag}</span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">{post.date} · {post.readTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><ExternalLink size={15} /></a>
                  <button onClick={() => navigate(`/admin/posts/${post.slug}/edit`)} className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteTarget({ type: "posts", slug: post.slug })} className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.length === 0 && <p className="text-center py-16 text-muted-foreground">No projects yet. Create your first one.</p>}
            {projects.map((project) => (
              <div key={project.slug} className="bg-card border border-border rounded-xl px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  {project.live && <span className="text-xs font-mono text-green-400 shrink-0">● LIVE</span>}
                  <div className="min-w-0">
                    <p className="font-medium truncate">{project.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{project.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><ExternalLink size={15} /></a>}
                  <button onClick={() => navigate(`/admin/projects/${project.slug}/edit`)} className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
                  <button onClick={() => setDeleteTarget({ type: "projects", slug: project.slug })} className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">Delete this?</h2>
            <p className="text-muted-foreground text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-md border border-border text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
