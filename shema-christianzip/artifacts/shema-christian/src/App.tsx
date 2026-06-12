import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import BlogPost from "@/pages/BlogPost";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminInbox from "@/pages/admin/Inbox";
import AdminChatLogs from "@/pages/admin/ChatLogs";
import EditPost from "@/pages/admin/EditPost";
import EditProject from "@/pages/admin/EditProject";
import AiChat from "@/components/AiChat";
import { useEffect } from "react";
import { useLocation } from "wouter";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/:slug" component={ProjectDetail} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/posts/new" component={EditPost} />
      <Route path="/admin/posts/:slug/edit" component={EditPost} />
      <Route path="/admin/projects/new" component={EditProject} />
      <Route path="/admin/projects/:slug/edit" component={EditProject} />
      <Route path="/admin/inbox" component={AdminInbox} />
      <Route path="/admin/chat-logs" component={AdminChatLogs} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ChatOverlay() {
  const [location] = useLocation();
  if (location.startsWith("/admin")) return null;
  return <AiChat />;
}

function App() {
  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
          <ChatOverlay />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
