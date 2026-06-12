import { Router, type IRouter } from "express";
import nodemailer from "nodemailer";
import { z } from "zod";
import { db, contactsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireAdmin } from "../middleware/adminAuth";

const router: IRouter = Router();

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

router.get("/admin/contacts", requireAdmin, async (req, res) => {
  const rows = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  res.json(rows);
});

router.get("/admin/export/contacts.csv", requireAdmin, async (req, res) => {
  const rows = await db.select().from(contactsTable).orderBy(desc(contactsTable.createdAt));
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    ["ID", "Name", "Email", "Message", "Read", "Date"].join(","),
    ...rows.map((r) => [
      r.id,
      escape(r.name),
      escape(r.email),
      escape(r.message),
      r.read ? "yes" : "no",
      r.createdAt ? new Date(r.createdAt).toISOString() : "",
    ].join(",")),
  ];
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="contacts-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(lines.join("\r\n"));
});

router.patch("/admin/contacts/:id/read", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { read } = req.body as { read: boolean };
  if (typeof read !== "boolean") { res.status(400).json({ error: "read must be boolean" }); return; }
  await db.update(contactsTable).set({ read }).where(eq(contactsTable.id, id));
  res.json({ success: true });
});

router.delete("/admin/contacts/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(contactsTable).where(eq(contactsTable.id, id));
  res.json({ success: true });
});

router.post("/contact", async (req, res) => {
  const parsed = ContactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const { name, email, message } = parsed.data;

  await db.insert(contactsTable).values({ name, email, message });
  req.log.info({ from: email, name }, "Contact message saved to database");

  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword) {
    req.log.warn("GMAIL_APP_PASSWORD not set — skipping email notification");
    res.json({ success: true });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "christianirasubizashema@gmail.com",
      pass: appPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <christianirasubizashema@gmail.com>`,
      to: "christianirasubizashema@gmail.com",
      replyTo: email,
      subject: `New message from ${name} — Portfolio`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d1220;color:#e2e8f0;padding:32px;border-radius:12px">
          <h2 style="color:#3b82f6;margin-top:0">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 0;color:#94a3b8;width:80px">Name</td>
              <td style="padding:8px 0;font-weight:600">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#94a3b8">Email</td>
              <td style="padding:8px 0"><a href="mailto:${email}" style="color:#3b82f6">${email}</a></td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #1e293b;margin:20px 0"/>
          <p style="color:#94a3b8;margin-bottom:8px">Message</p>
          <p style="background:#1e293b;border-left:3px solid #3b82f6;padding:16px;border-radius:4px;white-space:pre-wrap;margin:0">${message}</p>
          <p style="color:#475569;font-size:12px;margin-top:24px;margin-bottom:0">Sent from shemachristian.dev portfolio contact form</p>
        </div>
      `,
    });

    req.log.info({ from: email, name }, "Contact email notification sent");
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email — message still saved in DB");
  }

  res.json({ success: true });
});

export default router;
