import type { NextApiRequest, NextApiResponse } from "next";
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ reply: "Thanks! I can take your details here. What’s your full name?" });
}