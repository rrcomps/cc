import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Phone, Info } from 'lucide-react';
import { Header } from '../components/Header';
import { Features } from '../components/Features';
import { LeadForm } from '../components/LeadForm';
import { TrustSection } from '../components/TrustSection';
import { Reviews } from '../components/Reviews';
import { Footer } from '../components/Footer';
import { ChatWidget } from '../components/ChatWidget';
import { chooseCtaVariant } from '../lib/utils';
import { FormMode } from '../lib/types';
import { SEO_CONFIG } from '../lib/constants';

export default function DebtHelpLandingPage() {
  const [ctaText, setCtaText] = useState("Check eligibility now");
  const [showExitCall, setShowExitCall] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('two');

  useEffect(() => {
    try { 
      setCtaText(chooseCtaVariant()); 
    } catch (_) {}
  }, []);

  // Exit-intent call prompt
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const key = "exitPromptShown";
    const handler = (e: MouseEvent) => {
      try { 
        if (localStorage.getItem(key) === "1") return; 
      } catch (_) {}
      
      if (!e.toElement && !e.relatedTarget && e.clientY <= 0) {
        try { 
          localStorage.setItem(key, "1"); 
        } catch (_) {}
        setShowExitCall(true);
      }
    };
    
    window.addEventListener("mouseout", handler);
    return () => window.removeEventListener("mouseout", handler);
  }, []);

  const handleFormModeChange = useCallback((mode: FormMode) => {
    setFormMode(mode);
  }, []);

  return (
    <>
      <style>{`
        /* ==== Conversion‑optimised palette (finance/trust) ==== */
        :root { --brand-blue:#2563eb; --brand-blue-dark:#1d4ed8; }
        .hl { color: var(--brand-blue); font-weight: 600; }
        .hlu { color: var(--brand-blue); font-weight: 600; text-decoration: underline; }
        .btn-cta { background: var(--brand-blue); color:#fff; border-radius: 1rem; padding: 0.75rem 1.25rem; font-weight: 600; box-shadow: 0 8px 24px rgba(37,99,235,0.25); transition: transform .15s ease, box-shadow .2s ease, background-color .2s ease; }
        .btn-cta:hover { background: var(--brand-blue-dark); box-shadow: 0 10px 28px rgba(37,99,235,0.32); transform: translateY(-1px); }
        .btn-cta:disabled { opacity: .6; cursor: not-allowed; }
        .btn-ghost { border-radius: 1rem; padding: 0.6rem 1rem; border:1px solid #e2e8f0; }
        .chat-scroll { scroll-behavior: smooth; }

        /* ===== Soft blue background with animated blobs (stronger but whiter) ===== */
        .bg-softblue { position: fixed; inset: 0; z-index: -2; background: #ffffff; }
        .bg-softblue::before, .bg-softblue::after { content: ""; position: absolute; inset: -20%; pointer-events: none; }
        .bg-softblue::before {
          background:
            radial-gradient(700px 480px at 12% 20%, rgba(37,99,235,0.22), rgba(37,99,235,0.10) 60%, rgba(37,99,235,0) 74%),
            radial-gradient(820px 560px at 88% 16%, rgba(59,130,246,0.24), rgba(59,130,246,0.10) 60%, rgba(59,130,246,0) 78%),
            radial-gradient(900px 620px at 52% 92%, rgba(147,197,253,0.24), rgba(147,197,253,0.10) 60%, rgba(147,197,253,0) 80%);
          filter: blur(10px) saturate(110%);
          animation: blobShift 36s ease-in-out infinite alternate;
        }
        .bg-softblue::after {
          background:
            radial-gradient(120% 80% at 50% 30%, rgba(37,99,235,0.06), rgba(0,0,0,0) 70%),
            radial-gradient(160% 100% at 0% 0%, rgba(37,99,235,0.04), rgba(0,0,0,0) 60%),
            radial-gradient(160% 100% at 100% 0%, rgba(37,99,235,0.04), rgba(0,0,0,0) 60%);
          animation: blobShift2 48s ease-in-out infinite alternate;
        }
        @keyframes blobShift { 0% { transform: translate3d(0,0,0) scale(1); } 100% { transform: translate3d(8%, -6%, 0) scale(1.05); } }
        @keyframes blobShift2 { 0% { transform: translate3d(0,0,0) scale(1.02); } 100% { transform: translate3d(-6%, 6%, 0) scale(1.06); } }

        /* Sticky mobile bar */
        .sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; }

        /* ===== Base glass card ===== */
        .glass-card { position: relative; overflow: hidden; background: linear-gradient(to bottom right, rgba(255,255,255,0.22), rgba(255,255,255,0.08)); border: 1px solid rgba(255,255,255,0.28); border-top-color: rgba(255,255,255,0.45); border-left-color: rgba(255,255,255,0.45); box-shadow: 0 10px 40px rgba(0,0,0,0.18); backdrop-filter: blur(16px) saturate(140%); -webkit-backdrop-filter: blur(16px) saturate(140%); }
        .glass-card::after { content: ""; pointer-events:none; position:absolute; top:-60%; left:-60%; width:220%; height:220%; background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 12%, rgba(255,255,255,0) 25%); transform: translateX(-60%) translateY(-60%) rotate(25deg); animation: sweep 9s linear infinite; opacity:0.5; }
        @keyframes sweep { 0%{ transform: translateX(-60%) translateY(-60%) rotate(25deg);} 100%{ transform: translateX(60%) translateY(60%) rotate(25deg);} }

        /* ===== Morphing reflection for realistic glass ===== */
        .glass-morph { will-change: transform; }
        .glass-morph::before { content: ""; position: absolute; inset: -2px; background:
            radial-gradient(140% 120% at 10% 0%, rgba(255,255,255,0.40), rgba(255,255,255,0.10) 40%, transparent 60%),
            radial-gradient(120% 100% at 100% 0%, rgba(255,255,255,0.18), transparent 60%);
          filter: blur(12px); mix-blend-mode: screen; pointer-events: none;
          background-size: 200% 200%, 200% 200%;
          background-position: 0% 0%, 100% 0%;
          animation: shineMorph 14s ease-in-out infinite alternate;
        }
        @keyframes shineMorph { 0% { background-position: 0% 0%, 100% 0%; transform: scale(1);} 50% { background-position: 20% 10%, 80% 10%; transform: scale(1.01);} 100% { background-position: 0% 20%, 100% 30%; transform: scale(1.02);} }
        .glass-morph:hover { transform: translateY(-2px); transition: transform .25s ease; }

        /* Feature pills spacing (improved alignment + safe wraps) */
        .feature-pill { display:flex; align-items:center; gap:.75rem; padding: 1rem 1.1rem; border-radius: 1rem; border:1px solid #e2e8f0; background: rgba(255,255,255,.85); backdrop-filter: blur(6px); min-height: 72px; }
        .feature-pill .icon { flex:0 0 auto; }
        .feature-pill .text { line-height: 1.25; overflow-wrap:anywhere; word-break:break-word; }
        @media (max-width: 640px){ .feature-pill{ min-height:64px; padding:.9rem 1rem;} .feature-pill .text{ font-size:.92rem; } }

        /* Review marquee — slower, uniform cards, no edge mask */
        .marquee { overflow:hidden; }
        .marquee__track { display:flex; align-items:stretch; gap:20px; width:max-content; animation: scrollX 90s linear infinite; }
        .marquee:hover .marquee__track { animation-play-state: paused; }
        @keyframes scrollX { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .marquee__track{ animation: none !important; } }

        /* Uniform review card */
        .review-card { width:320px; border: 1px solid rgba(37,99,235,0.22); box-shadow: 0 12px 28px rgba(37,99,235,0.12); background: rgba(255,255,255,0.9); }
        .review-text { min-height: 72px; }

        /* Trust row under Continue — perfect centering */
        .trust-row{ display:flex; align-items:center; justify-content:center; gap:.85rem; flex-wrap:wrap; text-align:center; }
        .trust-row > div{ display:flex; align-items:center; gap:.35rem; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .chat-dock { bottom: 1rem; }
        @media (max-width: 640px) {
          /* sit above the sticky CTA bar on mobile */
          .chat-dock { bottom: 4.75rem; }
        }
        .chat-fab { padding: .5rem .75rem; border-radius: 14px; font-size: .9rem; }
        @media (max-width: 640px){
          .chat-fab { padding: .45rem .65rem; font-size: .9rem; }
        }
      `}</style>

      <div className="relative min-h-screen text-slate-900">
        {/* Soft blue background */}
        <div className="bg-softblue"></div>

        {/* Header */}
        <Header 
          ctaText={ctaText} 
          formMode={formMode} 
          onFormModeChange={handleFormModeChange} 
        />

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-4 md:pt-10 pb-8 grid md:grid-cols-2 gap-6 md:gap-12 items-start md:items-center">
          <motion.div 
            className="order-2 md:order-1" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            <h1 className="hidden sm:block text-3xl md:text-5xl font-bold tracking-tight">
              Grow your <span className="hl">credit health</span> — fast <span className="hl">eligibility check</span>
            </h1>
            <p className="mt-4 text-slate-600 max-w-prose">
              We'll introduce you to an <strong className="hl">FCA‑authorised</strong> advisor who can explain your options. We're an
              <strong className="hl"> advertising/introducer service</strong> – <span className="hl">not a debt advice firm</span>.
            </p>
            <Features />
          </motion.div>

          {/* Form Card */}
          <LeadForm 
            formMode={formMode} 
            ctaText={ctaText} 
            onFormModeChange={handleFormModeChange} 
          />
        </section>

        {/* Trust & Explainer */}
        <TrustSection />

        {/* Social proof — continuous marquee */}
        <Reviews />

        {/* Exit‑intent call modal */}
        {showExitCall && (
          <div 
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="exit-call-title"
          >
            <div className="glass-card max-w-md w-full rounded-2xl p-6">
              <h3 id="exit-call-title" className="text-xl font-semibold">
                Prefer to talk it through?
              </h3>
              <p className="mt-2 text-slate-600">
                We can connect you to an FCA‑authorised advisor. Or tap to call now.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <a 
                  href={`tel:${SEO_CONFIG.phone}`} 
                  className="btn-cta"
                  aria-label="Call Credit Cleaners"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Tap to call
                </a>
                <button 
                  className="btn-ghost" 
                  onClick={() => setShowExitCall(false)}
                  aria-label="Close dialog"
                >
                  No thanks
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <Footer />

        {/* Live chat widget (smart local) */}
        <ChatWidget />

        {/* Dev panel with API + Twilio setup (copy into files) */}
        <details className="mx-auto mt-10 max-w-6xl px-4 pb-16 text-sm text-slate-600">
          <summary className="cursor-pointer select-none">
            Developer setup: /api endpoints + Twilio voice (Polly, 9–5 UK)
          </summary>
          <div className="mt-4 space-y-6">
            <div>
              <p className="font-semibold">1) Next.js App Router — <code>app/api/lead/route.ts</code></p>
              <pre className="whitespace-pre-wrap rounded-xl border p-4 bg-white/70">{`import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const body = await req.json();
  // TODO: validate + store body, then fan-out to buyers (webhook/email)
  console.log('LEAD', body);
  return NextResponse.json({ ok: true });
}`}</pre>
            </div>
            <div>
              <p className="font-semibold">2) Next.js App Router — <code>app/api/chat/route.ts</code> (server LLM optional)</p>
              <pre className="whitespace-pre-wrap rounded-xl border p-4 bg-white/70">{`import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const { messages } = await req.json();
  // Optional: call your LLM with tools for validation + slot-filling
  // For now, echo a polite fallback (the page already runs a smart local assistant)
  const reply = "Thanks! I can take your details here. What's your full name?";
  return NextResponse.json({ reply });
}`}</pre>
            </div>
            <div>
              <p className="font-semibold">3) Twilio Voice — webhook (Express) with business hours + Polly voice</p>
              <pre className="whitespace-pre-wrap rounded-xl border p-4 bg-white/70">{`import express from 'express';
import { twiml } from 'twilio';
const app = express();
app.post('/voice', (req, res) => {
  const now = new Date();
  const hour = now.toLocaleString('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Europe/London' });
  const open = Number(hour) >= 9 && Number(hour) < 17;
  const vr = new twiml.VoiceResponse();
  if (open) {
    vr.say({ voice: 'Polly.Amy' }, 'Please hold while we connect you.');
    vr.dial('${SEO_CONFIG.phone}');
  } else {
    const g = vr.gather({ input: 'speech dtmf', action: '/route', timeout: 2 });
    g.say({ voice: 'Polly.Amy' }, 'Hi, you've reached Credit Cleaners. We are an introducer, not a debt advice firm. I can take a few details and arrange a call with an FCA authorised adviser. Say okay to begin or agent to speak to a person.');
  }
  res.type('text/xml').send(vr.toString());
});
app.post('/route', (req, res) => {
  // TODO: attach Media Streams or gather more details then POST to /api/lead
});
app.listen(3001);`}</pre>
              <p className="mt-2">
                Buy a Twilio number → set Voice webhook to your server's <code>/voice</code>. For real conversational AI, attach <strong>Media Streams</strong> and stream audio to your bot server; use <strong>Polly Neural</strong> or ElevenLabs for TTS.
              </p>
            </div>
          </div>
        </details>
      </div>
    </>
  );
}