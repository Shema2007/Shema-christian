import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Save } from "lucide-react";

interface FormState {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  challenge: string;
  solution: string;
  outcome: string;
  tags: string;
  link: string;
  live: boolean;
  image: string;
}

const empty: FormState = {
  slug: "", title: "", tagline: "", description: "", challenge: "", solution: "", outcome: "",
  tags: "", link: "", live: false, image: "/images/project-ecommerce.png",
};

export default function EditProject() {
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
    fetch(`/api/projects/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          slug: data.slug, title: data.title, tagline: data.tagline, description: data.description,
          challenge: data.challenge, solution: data.solution, outcome: data.outcome,
          tags: (data.tags ?? []).join(", "), link: data.link ?? "", live: data.live ?? false, image: data.image ?? "",
        });
        setLoading(false);
      });
  }, [slug, isNew]);

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/projects" : `/api/projects/${slug}`;
    const body = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      link: form.link || null,
      stack: [],
    };
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
      if (res.ok) { navigate("/admin"); }
      else { const d = await res.json(); setError(d.error ?? "Save failed"); }
    } catch { setError("Network error"); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;

  const fields: { label: string; key: keyof FormState; placeholder: string; rows?: number }[] = [
    { label: "Title", key: "title", placeholder: "Kapo Kitchenware" },
    { label: "Slug", key: "slug", placeholder: "kapo-kitchenware" },
    { label: "Tagline", key: "tagline", placeholder: "One-line description shown on case study" },
    { label: "Tags (comma-separated)", key: "tags", placeholder: "React, Next.js, Tailwind" },
    { label: "Live URL (optional)", key: "link", placeholder: "https://yourproject.vercel.app" },
    { label: "Description", key: "description", placeholder: "Full project description…", rows: 3 },
    { label: "The Challenge", key: "challenge", placeholder: "What problem did this solve?", rows: 3 },
    { label: "The Solution", key: "solution", placeholder: "How did you solve it?", rows: 3 },
    { label: "The Outcome", key: "outcome", placeholder: "What was the measurable result?", rows: 3 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"><ArrowLeft size={15} /> Dashboard</button>
          <span className="text-border">|</span>
          <span className="font-semibold">{isNew ? "New Project" : "Edit Project"}</span>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          {fields.map(({ label, key, placeholder, rows }) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium">{label}</label>
              {rows ? (
                <textarea value={String(form[key])} onChange={set(key)} rows={rows} placeholder={placeholder}
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none" />
              ) : (
                <input value={String(form[key])} onChange={set(key)} placeholder={placeholder}
                  disabled={key === "slug" && !isNew}
                  required={["slug", "title", "tagline"].includes(key)}
                  className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all disabled:opacity-50" />
              )}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <input id="live" type="checkbox" checked={form.live} onChange={(e) => setForm((f) => ({ ...f, live: e.target.checked }))}
              className="w-4 h-4 accent-primary" />
            <label htmlFor="live" className="text-sm font-medium">Mark as LIVE project</label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate("/admin")} className="flex-1 py-3 border border-border rounded-md text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-70 transition-colors">
              <Save size={15} /> {saving ? "Saving…" : "Save Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
