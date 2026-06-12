import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Mail, Clock, ChevronDown, ChevronUp, ExternalLink, LogOut, Inbox, Circle, CheckCircle, Trash2, Download } from "lucide-react";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string | null;
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminInbox() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => { if (!r.ok) navigate("/admin/login"); })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  useEffect(() => {
    fetch("/api/admin/contacts", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setMessages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleRead = async (id: number, current: boolean) => {
    const next = !current;
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, read: next } : m));
    await fetch(`/api/admin/contacts/${id}/read`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: next }),
    });
  };

  const expand = (id: number, read: boolean) => {
    setExpanded((prev) => (prev === id ? null : id));
    if (!read) toggleRead(id, false);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/contacts/${deleteTarget.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    if (expanded === deleteTarget.id) setExpanded(null);
    setDeleteTarget(null);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    navigate("/admin/login");
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const exportCsv = async () => {
    const res = await fetch("/api/admin/export/contacts.csv", { credentials: "include" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {/* Back */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={15} /> Back to dashboard
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Inbox className="text-primary" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Contact Inbox</h1>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading…" : `${messages.length} message${messages.length !== 1 ? "s" : ""} total`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!loading && messages.length > 0 && (
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Download size={14} /> Export CSV
              </button>
            )}
            {unreadCount > 0 && !loading && (
              <button
                onClick={async () => {
                  setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
                  await Promise.all(
                    messages.filter((m) => !m.read).map((m) =>
                      fetch(`/api/admin/contacts/${m.id}/read`, {
                        method: "PATCH",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ read: true }),
                      })
                    )
                  );
                }}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle size={14} /> Mark all read
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="text-center py-20 text-muted-foreground text-sm">Loading messages…</div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <Mail size={32} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground font-medium">No messages yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Messages from your contact form will appear here.</p>
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  msg.read ? "bg-card border-border" : "bg-card border-primary/30 shadow-sm shadow-primary/5"
                }`}
              >
                {/* Row header */}
                <button
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
                  onClick={() => expand(msg.id, msg.read)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0">
                      {!msg.read
                        ? <Circle size={8} className="fill-primary text-primary" />
                        : <Circle size={8} className="text-transparent" />}
                    </div>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${msg.read ? "bg-secondary text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className={`truncate ${msg.read ? "font-normal text-muted-foreground" : "font-semibold"}`}>{msg.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      <Clock size={11} /> {timeAgo(msg.createdAt)}
                    </span>
                    {expanded === msg.id
                      ? <ChevronUp size={15} className="text-muted-foreground" />
                      : <ChevronDown size={15} className="text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded body */}
                {expanded === msg.id && (
                  <div className="px-6 pb-6 border-t border-border">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap mt-4 bg-secondary/40 rounded-lg p-4">
                      {msg.message}
                    </p>
                    <div className="mt-4 flex items-center gap-3 flex-wrap">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Your message — Shema Christian`}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
                      >
                        <Mail size={14} /> Reply via email
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleRead(msg.id, msg.read); }}
                        className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-medium rounded-md hover:bg-secondary transition-colors text-muted-foreground"
                      >
                        {msg.read
                          ? <><Circle size={13} className="fill-primary text-primary" /> Mark unread</>
                          : <><CheckCircle size={13} /> Mark read</>}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(msg); }}
                        className="flex items-center gap-2 px-4 py-2 border border-destructive/30 text-sm font-medium rounded-md hover:bg-destructive/10 transition-colors text-destructive"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                      <span className="text-xs text-muted-foreground font-mono ml-auto">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                          : ""}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-destructive" />
            </div>
            <h2 className="text-xl font-bold mb-1">Delete this message?</h2>
            <p className="text-sm text-muted-foreground mb-1">From <span className="font-medium text-foreground">{deleteTarget.name}</span></p>
            <p className="text-xs text-muted-foreground mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-md border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
