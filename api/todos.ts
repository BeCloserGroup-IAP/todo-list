import { db } from "../src/db/index.js";
import { todos } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req: any, res: any): Promise<void> {
  try {
    if (req.method === "GET") {
      const rows = await db.select().from(todos).orderBy(todos.createdAt);
      res.status(200).json(rows);
      return;
    }

    if (req.method === "POST") {
      const { text } = req.body ?? {};
      if (!text || typeof text !== "string" || !text.trim()) {
        res.status(400).json({ error: "Il testo dell'attività è obbligatorio." });
        return;
      }
      const [row] = await db
        .insert(todos)
        .values({ text: text.trim() })
        .returning();
      res.status(201).json(row);
      return;
    }

    if (req.method === "PATCH") {
      const { id, done, text } = req.body ?? {};
      if (!id) {
        res.status(400).json({ error: "L'id è obbligatorio." });
        return;
      }
      const updates: Partial<{ done: boolean; text: string }> = {};
      if (typeof done === "boolean") updates.done = done;
      if (typeof text === "string" && text.trim()) updates.text = text.trim();
      const [row] = await db
        .update(todos)
        .set(updates)
        .where(eq(todos.id, Number(id)))
        .returning();
      res.status(200).json(row);
      return;
    }

    if (req.method === "DELETE") {
      const id = req.query?.id ?? req.body?.id;
      if (!id) {
        res.status(400).json({ error: "L'id è obbligatorio." });
        return;
      }
      await db.delete(todos).where(eq(todos.id, Number(id)));
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Metodo non consentito." });
  } catch (err: any) {
    res.status(500).json({ error: err?.message ?? "Errore del server." });
  }
}
