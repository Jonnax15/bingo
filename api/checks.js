import { kv } from "@vercel/kv";

// Schlüssel eindeutig pro Zeitraum wählen
const KEY = "checks:2025-10-02_2025-10-17";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      // Erwartetes Format: { checks: { "YYYY-MM-DD": true, ... } }
      const data = (await kv.get(KEY)) || { checks: {} };
      return res.status(200).json(data);
    }

    if (req.method === "PUT") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body !== "object" || typeof body.checks !== "object") {
        return res.status(400).json({ error: "Invalid payload" });
      }
      await kv.set(KEY, { checks: body.checks });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT");
    return res.status(405).end("Method Not Allowed");
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
