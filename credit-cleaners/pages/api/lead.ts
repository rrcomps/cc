import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "../../lib/supabase";
import { validateEmail, validateUKMobile } from "../../lib/validation";
import { getClientIP, log, logError } from "../../lib/utils";
import { LeadPayload } from "../../lib/types";

// Simple in-memory limiter (resets on rebuild)
const hits: Map<string, number[]> = new Map();

function allow(ip: string): boolean {
  const now = Date.now();
  const arr = hits.get(ip) || [];
  const recent = arr.filter(t => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length <= 5; // max 5 per minute
}

async function addToEmailOctopus(payload: any): Promise<void> {
  const API = process.env.EMAILOCTOPUS_API_KEY;
  const LIST = process.env.EMAILOCTOPUS_LIST_ID;
  
  if (!API || !LIST) {
    log("Email Octopus not configured, skipping");
    return;
  }
  
  try {
    const full = String(payload.full_name || "").trim();
    const [first, ...rest] = full.split(/\s+/);
    const last = rest.join(" ");
    
    const body = {
      api_key: API,
      email_address: payload.email,
      fields: {
        ...(first && { FirstName: first }),
        ...(last && { LastName: last })
      },
      tags: ["credit-cleaners", "lead"],
      resubscribe: true
    };
    
    const url = `https://emailoctopus.com/api/1.6/lists/${LIST}/contacts`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const text = await response.text();
      logError("Email Octopus API error", { status: response.status, text });
    } else {
      log("Email Octopus contact added successfully");
    }
  } catch (error) {
    logError("Email Octopus add failed", error);
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const body = req.body || {};

    // Honeypot & rate limit
    const ip = getClientIP(req);
    if (body.honey) {
      log("Bot detected via honeypot");
      res.status(200).json({ ok: true });
      return;
    }
    
    if (!allow(ip)) {
      res.status(429).json({ 
        error: "Too many submissions, try later.",
        retryAfter: 60
      });
      return;
    }

    // Validate required fields
    if (!validateEmail(body.email) || !validateUKMobile(body.phone)) {
      res.status(400).json({ 
        error: "Invalid email or UK mobile number" 
      });
      return;
    }

    const ua = req.headers["user-agent"] || "";
    const payload: LeadPayload = {
      source: String(body.source || "web"),
      mode: String(body.mode || ""),
      fullName: String(body.fullName || ""),
      email: String(body.email || ""),
      phone: String(body.phone || ""),
      postcode: String(body.postcode || ""),
      debtAmount: Number.isFinite(Number(body.debtAmount)) ? Number(body.debtAmount) : 0,
      debtTypes: Array.isArray(body.debtTypes) 
        ? body.debtTypes 
        : (body.debtTypes ? String(body.debtTypes).split(",").map((s: string) => s.trim()) : []),
      consentContact: Boolean(body.consentContact),
      consentPrivacy: Boolean(body.consentPrivacy),
      utm_source: String(body.utm_source || ""),
      utm_medium: String(body.utm_medium || ""),
      utm_campaign: String(body.utm_campaign || ""),
      ip,
      user_agent: String(ua || ""),
    };

    const { data, error } = await supabaseAdmin
      .from("leads")
      .insert([payload])
      .select("id")
      .single();

    if (error) {
      logError("Supabase insert error", error);
      res.status(500).json({ error: "Database error" });
      return;
    }

    // Fire-and-forget subscriber add
    addToEmailOctopus(payload).catch(e => 
      logError("Email Octopus add failed", e)
    );

    log("Lead submitted successfully", { id: data?.id });
    res.status(200).json({ ok: true, id: data?.id });
  } catch (error) {
    logError("/api/lead error", error);
    res.status(500).json({ error: "Server error" });
  }
}