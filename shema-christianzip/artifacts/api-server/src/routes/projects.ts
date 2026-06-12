import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { projectsTable, insertProjectSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middleware/adminAuth";

const router: IRouter = Router();

router.get("/projects", async (req, res) => {
  const rows = await db.select().from(projectsTable).orderBy(projectsTable.id);
  res.json(rows);
});

router.get("/projects/:slug", async (req, res) => {
  const [row] = await db.select().from(projectsTable).where(eq(projectsTable.slug, req.params.slug));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.post("/projects", requireAdmin, async (req, res) => {
  const parsed = insertProjectSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input", details: parsed.error.issues }); return; }
  const [row] = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/projects/:slug", requireAdmin, async (req, res) => {
  const parsed = insertProjectSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input", details: parsed.error.issues }); return; }
  const [row] = await db.update(projectsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projectsTable.slug, req.params.slug))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/projects/:slug", requireAdmin, async (req, res) => {
  const [row] = await db.delete(projectsTable).where(eq(projectsTable.slug, req.params.slug)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ok: true });
});

export default router;
