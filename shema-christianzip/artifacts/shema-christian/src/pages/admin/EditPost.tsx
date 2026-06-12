import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Save } from "lucide-react";

const TAG_OPTIONS = [
  { label: "Full-Stack", color: "text-blue-400" },
  { label: "Architecture", color: "text-purple-400" },
  { label: "TypeScript", color: "text-cyan-400" },
  { label: "Process", color: "text-green-400" },
  { label: "APIs", color: "text-orange-400" },
  { label: "DevOps", color: "text-red-400" },
  { label: "Frontend", color: "text-pink-400" },
  { label: "Database", color: "text-yellow-400" },
];

interface FormState {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
  tagColor: string;
}

const empty: FormState = { slug: "", title: "", excerpt: "", date: "", readTime: "", tag: "Full-Stack", tagColor: "text-blue-400" };

export default function EditPost() {
  const { slug } = useParams<{ slug?: string }>();
  const [, navigate] = useLocation();
  const isNew = !slug || slug === "new";

  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => { if (!r.ok) navigate("/admin/login"); })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/posts/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({ slug: data.slug, title: data.title, excerpt: data.excerpt, date: data.date, readTime: data.readTime, tag: data.tag, tagColor: data.tagColor });
        setLoading(false);
      });
  }, [slug, isNew]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = TAG_OPTIONS.find((t) => t.label === e.target.value);
    setForm((f) => ({ ...f, tag: e.target.value, tagColor: found?.color ?? "text-blue-400" }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/posts" : `/api/posts/${slug}`;
    const body = isNew ? { ...form, content: [] } : form;
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
      if (res.ok) { navigate("/admin"); }
      else { const d = await res.json(); setError(d.error ?? "Save failed"); }
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"><ArrowLeft size={15} /> Dashboard</button>
          <span className="text-border">|</span>
          <span className="font-semibold">{isNew ? "New Blog Post" : "Edit Blog Post"}</span>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          {[
            { label: "Title", key: "title" as const, placeholder: "Why TypeScript Changed Everything" },
            { label: "Slug", key: "slug" as const, placeholder: "why-typescript-changed-everything" },
            { label: "Date", key: "date" as const, placeholder: "May 2025" },
            { label: "Read Time", key: "readTime" as const, placeholder: "6 min read" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              <input value={form[key]} onChange={set(key)} required placeholder={placeholder} disabled={key === "slug" && !isNew}
                className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50" />
            </div>
          ))}

          <div className="space-y-2">
            <label className="text-sm font-medium">Tag</label>
            <select value={form.tag} onChange={handleTagChange} className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
              {TAG_OPTIONS.map((t) => <option key={t.label}>{t.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Excerpt</label>
            <textarea value={form.excerpt} onChange={set("excerpt")} required rows={3} placeholder="A brief summary shown on the blog list page…"
              className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/admin")} className="flex-1 py-3 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors">
              <Save size={15} /> {saving ? "Saving…" : "Save Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
