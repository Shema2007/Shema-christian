import { Router, type IRouter } from "express";
import { z } from "zod";
import OpenAI from "openai";
import { db, chatSessionsTable, chatMessagesTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";
import { requireAdmin } from "../middleware/adminAuth";

const router: IRouter = Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a helpful assistant on Shema Christian's portfolio website. Shema Christian is a full-stack developer and systems architect who builds scalable, reliable, and high-performing digital systems. He specializes in Node.js, TypeScript, React, PostgreSQL, and modern web technologies. He codes with purpose and builds for God's glory.

Help visitors learn about Shema's work, skills, and services. If asked about pricing, availability, or project inquiries, encourage them to use the contact form on the site. Keep responses concise, warm, and professional. Do not make up specific project details not mentioned to you.`;

const MessageSchema = z.object({
  sessionId: z.number().int().positive().optional(),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().max(2000),
  })).min(1).max(20),
});

router.post("/chat", async (req, res) => {
  const parsed = MessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { messages, sessionId: incomingSessionId } = parsed.data;
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUserMsg) { res.status(400).json({ error: "No user message" }); return; }

  // Get or create session
  let sessionId: number;
  if (incomingSessionId) {
    const existing = await db.select({ id: chatSessionsTable.id }).from(chatSessionsTable).where(eq(chatSessionsTable.id, incomingSessionId)).limit(1);
    sessionId = existing[0]?.id ?? (await db.insert(chatSessionsTable).values({}).returning({ id: chatSessionsTable.id }))[0].id;
  } else {
    sessionId = (await db.insert(chatSessionsTable).values({}).returning({ id: chatSessionsTable.id }))[0].id;
  }

  // Save user message
  await db.insert(chatMessagesTable).values({ sessionId, role: "user", content: lastUserMsg.content });

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send sessionId back immediately so frontend can persist it
  res.write(`data: ${JSON.stringify({ sessionId })}\n\n`);

  let fullResponse = "";
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_completion_tokens: 512,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    // Save assistant response and update session stats
    await Promise.all([
      db.insert(chatMessagesTable).values({ sessionId, role: "assistant", content: fullResponse }),
      db.update(chatSessionsTable).set({
        lastMessageAt: new Date(),
        messageCount: (await db.select({ messageCount: chatSessionsTable.messageCount }).from(chatSessionsTable).where(eq(chatSessionsTable.id, sessionId)).limit(1))[0].messageCount + 2,
      }).where(eq(chatSessionsTable.id, sessionId)),
    ]);

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    req.log.error({ err }, "Chat completion failed");
    res.write(`data: ${JSON.stringify({ error: "Something went wrong. Please try again." })}\n\n`);
  }
  res.end();
});

// Admin: list sessions
router.get("/admin/chat-sessions", requireAdmin, async (req, res) => {
  const sessions = await db.select().from(chatSessionsTable).orderBy(desc(chatSessionsTable.lastMessageAt));
  res.json(sessions);
});

// Admin: get messages for a session
router.get("/admin/chat-sessions/:id/messages", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const msgs = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, id)).orderBy(asc(chatMessagesTable.createdAt));
  res.json(msgs);
});

// Admin: export all chat logs as CSV
router.get("/admin/export/chat-logs.csv", requireAdmin, async (req, res) => {
  const msgs = await db
    .select({
      sessionId: chatMessagesTable.sessionId,
      role: chatMessagesTable.role,
      content: chatMessagesTable.content,
      createdAt: chatMessagesTable.createdAt,
    })
    .from(chatMessagesTable)
    .orderBy(asc(chatMessagesTable.sessionId), asc(chatMessagesTable.createdAt));

  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    ["Session ID", "Role", "Message", "Date"].join(","),
    ...msgs.map((m) => [
      m.sessionId,
      m.role,
      escape(m.content),
      m.createdAt ? new Date(m.createdAt).toISOString() : "",
    ].join(",")),
  ];
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="chat-logs-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(lines.join("\r\n"));
});

// Admin: delete session
router.delete("/admin/chat-sessions/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(chatSessionsTable).where(eq(chatSessionsTable.id, id));
  res.json({ success: true });
});

export default router;
