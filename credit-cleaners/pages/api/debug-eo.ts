import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = `https://emailoctopus.com/api/1.6/lists/${process.env.EMAILOCTOPUS_LIST_ID}?api_key=${process.env.EMAILOCTOPUS_API_KEY}`;
    const r = await fetch(url);
    const j = await r.json();
    return res.status(r.ok ? 200 : 500).json({
      ok: r.ok,
      list_name: j?.name,
      double_opt_in: j?.double_opt_in,
      fields: (j?.fields || []).map((f: any) => f.tag),
      error: r.ok ? undefined : j,
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
