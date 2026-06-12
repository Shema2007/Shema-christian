import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Bot, User, Clock, Trash2, ChevronDown, ChevronUp, ExternalLink, LogOut, MessageSquare, Download } from "lucide-react";

interface Session {
  id: number;
  messageCount: number;
  createdAt: string | null;
  lastMessageAt: string | null;
}

interface ChatMessage {
  id: number;
  sessionId: number;
  role: "user" | "assistant";
  content: string;
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

export default function AdminChatLogs() {
  const [, navigate] = useLocation();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loadingMsgs, setLoadingMsgs] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
      .then((r) => { if (!r.ok) navigate("/admin/login"); })
      .catch(() => navigate("/admin/login"));
  }, [navigate]);

  useEffect(() => {
    fetch("/api/admin/chat-sessions", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setSessions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const expandSession = async (id: number) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (messages[id]) return;
    setLoadingMsgs(id);
    const data = await fetch(`/api/admin/chat-sessions/${id}/messages`, { credentials: "include" }).then((r) => r.json());
    setMessages((prev) => ({ ...prev, [id]: data }));
    setLoadingMsgs(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/admin/chat-sessions/${deleteTarget.id}`, { method: "DELETE", credentials: "include" });
    setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    if (expanded === deleteTarget.id) setExpanded(null);
    setDeleteTarget(null);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    navigate("/admin/login");
  };

  const exportCsv = async () => {
    const res = await fetch("/api/admin/export/chat-logs.csv", { credentials: "include" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
        <div className="mb-8">
          <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={15} /> Back to dashboard
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="text-primary" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Chat Logs</h1>
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading…" : `${sessions.length} conversation${sessions.length !== 1 ? "s" : ""} logged`}
              </p>
            </div>
          </div>
          {!loading && sessions.length > 0 && (
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download size={14} /> Export CSV
            </button>
          )}
        </div>

        {loading && <div className="text-center py-20 text-muted-foreground text-sm">Loading conversations…</div>}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-xl">
            <Bot size={32} className="mx-auto mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground font-medium">No conversations yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">AI chat conversations with visitors will appear here.</p>
          </div>
        )}

        {!loading && sessions.length > 0 && (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <div key={session.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
                <button
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left"
                  onClick={() => expandSession(session.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bot size={16} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">Visitor #{session.id}</p>
                      <p className="text-xs text-muted-foreground">{session.messageCount} messages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                      <Clock size={11} /> {timeAgo(session.lastMessageAt)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(session); }}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                    {expanded === session.id ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
                  </div>
                </button>

                {expanded === session.id && (
                  <div className="border-t border-border px-6 py-4 space-y-3 max-h-[420px] overflow-y-auto">
                    {loadingMsgs === session.id && (
                      <p className="text-sm text-muted-foreground text-center py-4">Loading messages…</p>
                    )}
                    {(messages[session.id] ?? []).map((msg) => (
                      <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {msg.role === "assistant" && (
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Bot size={11} className="text-primary" />
                          </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-primary/15 text-foreground rounded-tr-sm"
                            : "bg-secondary text-foreground rounded-tl-sm"
                        }`}>
                          {msg.content}
                        </div>
                        {msg.role === "user" && (
                          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                            <User size={11} className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground text-center pt-2 font-mono">
                      Started {session.createdAt ? new Date(session.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : ""}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-destructive" />
            </div>
            <h2 className="text-xl font-bold mb-1">Delete this conversation?</h2>
            <p className="text-sm text-muted-foreground mb-6">Visitor #{deleteTarget.id} · {deleteTarget.messageCount} messages. This cannot be undone.</p>
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
