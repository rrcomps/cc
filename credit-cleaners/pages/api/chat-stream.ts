import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

export const config = { api: { bodyParser: true } };
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") { res.setHeader("Allow", ["POST"]); return res.status(405).end("Method Not Allowed"); }
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) return res.status(400).end("Bad request");

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    const system = `You are a friendly UK lead-intake assistant for Credit Cleaners (introducer, not a debt advice firm).\n- Be concise and plain-English.\n- Never give regulated debt advice or promise outcomes/deletions.\n- Mention MoneyHelper (free & impartial) when relevant.\n- If user wants to proceed, politely ask for: full name, email, UK mobile (07 or +44 7), postcode (optional), rough unsecured debt band.\n- Validate formats lightly; if wrong, ask again briefly.\n- Tone: calm, respectful, zero pressure.`;

    const stream = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    });

    for await (const part of stream) {
      const chunk = part.choices?.[0]?.delta?.content || "";
      if (chunk) res.write(chunk);
    }
    res.end();
  } catch (e:any) {
    res.write("Sorry — I’m having trouble reaching our AI right now.");
    res.end();
  }
}