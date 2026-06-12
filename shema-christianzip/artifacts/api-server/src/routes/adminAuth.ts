import { Router, type IRouter } from "express";
import { createAdminSession, clearAdminSession, requireAdmin } from "../middleware/adminAuth";

const router: IRouter = Router();

router.post("/admin/login", (req, res) => {
  const { password } = req.body ?? {};
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin not configured — set ADMIN_PASSWORD secret" });
    return;
  }
  if (password !== adminPassword) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }
  createAdminSession(res);
  res.json({ ok: true });
});

router.post("/admin/logout", (_req, res) => {
  clearAdminSession(res);
  res.json({ ok: true });
});

router.get("/admin/me", requireAdmin, (_req, res) => {
  res.json({ authenticated: true });
});

export default router;
