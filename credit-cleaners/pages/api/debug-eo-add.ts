import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = String(req.query.email || "").trim();
    if (!email) return res.status(400).json({ ok:false, error:"add ?email=you@example.com" });

    const first = String(req.query.first || "Test");
    const last  = String(req.query.last  || "User");

    const url = `https://emailoctopus.com/api/1.6/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts`;
    const body = {
      api_key: process.env.EMAILOCTOPUS_API_KEY,
      email_address: email,
      // omit status so EO uses list default (SUBSCRIBED since double_opt_in=false)
      fields: { FirstName: first, LastName: last },
      tags: ["credit-cleaners","lead"],
      // set true if the address might have unsubscribed before:
      resubscribe: true,
    };

    const resp = await fetch(url, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
    const text = await resp.text();
    return res.status(resp.ok ? 200 : 500).json({ ok: resp.ok, status: resp.status, raw: text });
  } catch (e:any) {
    return res.status(500).json({ ok:false, error: e?.message || String(e) });
  }
}
