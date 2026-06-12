import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { postsTable, insertPostSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middleware/adminAuth";

const router: IRouter = Router();

router.get("/posts", async (req, res) => {
  const rows = await db.select().from(postsTable).orderBy(postsTable.id);
  res.json(rows);
});

router.get("/posts/:slug", async (req, res) => {
  const [row] = await db.select().from(postsTable).where(eq(postsTable.slug, req.params.slug));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.post("/posts", requireAdmin, async (req, res) => {
  const parsed = insertPostSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input", details: parsed.error.issues }); return; }
  const [row] = await db.insert(postsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/posts/:slug", requireAdmin, async (req, res) => {
  const parsed = insertPostSchema.partial().safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid input", details: parsed.error.issues }); return; }
  const [row] = await db.update(postsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(postsTable.slug, req.params.slug))
    .returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/posts/:slug", requireAdmin, async (req, res) => {
  const [row] = await db.delete(postsTable).where(eq(postsTable.slug, req.params.slug)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ok: true });
});

export default router;
