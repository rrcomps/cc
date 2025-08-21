import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';
import { ChatMessage, ChatSlots, ChatPhase } from '../lib/types';
import { validateEmail, validateUKMobile, validatePostcode, validateFullName, normalizeDebtBand, yesLike, noLike, sanitizeInput } from '../lib/validation';
import { CHAT_PROMPTS } from '../lib/constants';

export const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: "assistant", 
      content: "Hi! I'm the Credit Cleaners assistant. We're an introducer (not a debt advice firm). I can take a few details and book a call with an FCA‑authorised adviser. Free help: MoneyHelper. Shall we start?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [slots, setSlots] = useState<ChatSlots>({
    fullName: "",
    email: "",
    phone: "",
    postcode: "",
    debtBand: "",
    consentContact: null,
    consentPrivacy: null,
    preferredTime: "",
  });
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const pendingSlotsRef = useRef<ChatSlots | null>(null);

  // Keep latest message in view
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    
    requestAnimationFrame(() => {
      try { 
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); 
      } catch { 
        el.scrollTop = el.scrollHeight; 
      }
    });
  }, [messages, typing, open]);

  // Nudge to open once for first-time visitors
  useEffect(() => {
    try {
      if (!localStorage.getItem("chatNudged")) {
        const t = setTimeout(() => { 
          setOpen(true); 
          localStorage.setItem("chatNudged", "1"); 
        }, 1200);
        return () => clearTimeout(t);
      }
    } catch (_) {}
  }, []);

  // Start slot-filling when opened
  useEffect(() => {
    if (!open || phase !== "idle") return;
    const t = setTimeout(() => { ask("name"); }, 350);
    return () => clearTimeout(t);
  }, [open, phase]);

  const pushUser = useCallback((text: string) => {
    setMessages((m) => [...m, { role: "user", content: sanitizeInput(text) }]);
  }, []);

  const assistantSay = useCallback((text: string, delay = 220) => {
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", content: text }]);
      setTyping(false);
    }, delay);
  }, []);

  const ask = useCallback((which: keyof typeof CHAT_PROMPTS) => {
    setPhase(which as ChatPhase);
    assistantSay(CHAT_PROMPTS[which], 260);
  }, [assistantSay]);

  const submitLead = useCallback(async (finalSlots: ChatSlots) => {
    // Final double‑check before sending
    if (!validateFullName(finalSlots.fullName)) { 
      assistantSay("Let's correct your name — please type your full name (first and last).", 0); 
      setPhase("name"); 
      return; 
    }
    if (!validateEmail(finalSlots.email)) { 
      assistantSay("That email still looks off (e.g., name@example.com). What's the best email?", 0); 
      setPhase("email"); 
      return; 
    }
    if (!validateUKMobile(finalSlots.phone)) { 
      assistantSay("That doesn't look like a UK mobile. Use 07… or +44 7…", 0); 
      setPhase("phone"); 
      return; 
    }
    if (finalSlots.postcode && !validatePostcode(finalSlots.postcode)) { 
      assistantSay("Postcode format looks off (e.g., M1 1AA).", 0); 
      setPhase("postcode"); 
      return; 
    }

    try {
      const payload = {
        source: "chat",
        timestamp: new Date().toISOString(),
        fullName: finalSlots.fullName,
        email: finalSlots.email,
        phone: finalSlots.phone,
        postcode: finalSlots.postcode,
        debtAmountBand: finalSlots.debtBand,
        consentContact: !!finalSlots.consentContact,
        consentPrivacy: !!finalSlots.consentPrivacy,
        preferredTime: finalSlots.preferredTime || "",
        moneyHelperMentioned: true,
      };
      
      const res = await fetch("/api/lead", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) throw new Error("Lead API error");
      
      assistantSay("Thanks! We've submitted your details. An FCA‑authorised adviser will call at your chosen time. You're under no obligation.", 240);
      setPhase("done");
    } catch (e) {
      assistantSay("I couldn't reach our server just now, but I've saved your details and a human will follow up shortly. If urgent, call us 9–5.", 240);
      setPhase("done");
    }
  }, [assistantSay]);

  const handleTextFlow = useCallback(async (text: string) => {
    const sanitizedText = sanitizeInput(text);
    
    if (phase === "idle") { ask("name"); return; }

    if (phase === "name") {
      if (!validateFullName(sanitizedText)) { 
        assistantSay("Please enter your full name (first and last).", 0); 
        return; 
      }
      setSlots((s) => ({ ...s, fullName: sanitizedText }));
      ask("email");
      return;
    }
    
    if (phase === "email") {
      if (!validateEmail(sanitizedText)) { 
        assistantSay("That email doesn't look right — e.g., name@example.com. Could you check it?", 0); 
        return; 
      }
      setSlots((s) => ({ ...s, email: sanitizedText }));
      ask("phone");
      return;
    }
    
    if (phase === "phone") {
      if (!validateUKMobile(sanitizedText)) { 
        assistantSay("That doesn't look like a UK mobile. Use 07… or +44 7…", 0); 
        return; 
      }
      setSlots((s) => ({ ...s, phone: sanitizedText }));
      ask("postcode");
      return;
    }
    
    if (phase === "postcode") {
      if (/^skip$/i.test(sanitizedText)) { 
        setSlots((s) => ({ ...s, postcode: "" })); 
        ask("debt"); 
        return; 
      }
      if (sanitizedText && !validatePostcode(sanitizedText)) { 
        assistantSay("Postcode format looks off (e.g., M1 1AA). You can also say 'skip'.", 0); 
        return; 
      }
      setSlots((s) => ({ ...s, postcode: sanitizedText.toUpperCase() }));
      ask("debt");
      return;
    }
    
    if (phase === "debt") {
      const band = normalizeDebtBand(sanitizedText);
      if (!band) { 
        assistantSay("Please share a rough amount (e.g., £5k, £12,500).", 0); 
        return; 
      }
      setSlots((s) => ({ ...s, debtBand: band }));
      ask("consent1");
      return;
    }
    
    if (phase === "consent1") {
      if (noLike(sanitizedText)) { 
        assistantSay("No problem. Free and impartial help is available at MoneyHelper.org.uk. I'll stop here.", 0); 
        setPhase("done"); 
        return; 
      }
      if (!yesLike(sanitizedText)) { 
        assistantSay("Please reply yes or no.", 0); 
        return; 
      }
      setSlots((s) => ({ ...s, consentContact: true }));
      ask("consent2");
      return;
    }
    
    if (phase === "consent2") {
      if (!yesLike(sanitizedText)) { 
        assistantSay("We can't proceed without privacy consent. You can still visit MoneyHelper.org.uk for free help.", 0); 
        setPhase("done"); 
        return; 
      }
      setSlots((s) => ({ ...s, consentPrivacy: true }));
      ask("callback");
      return;
    }
    
    if (phase === "callback") {
      const s = { ...slots, preferredTime: sanitizedText };
      pendingSlotsRef.current = s;
      setSlots(s);
      assistantSay(
        `Great. To confirm: Name: ${s.fullName}. Email: ${s.email}. Phone: ${s.phone}. Postcode: ${s.postcode || "(not given)"}. Debt: ${s.debtBand}. We'll ask an FCA‑authorised adviser to call ${sanitizedText}. Shall I submit this now? (yes/no)`, 
        200
      );
      setPhase("confirm");
      return;
    }
    
    if (phase === "confirm") {
      if (!yesLike(sanitizedText)) { 
        assistantSay("Okay, I won't submit. Tell me what to change (name/email/phone/postcode/debt/time).", 0); 
        setPhase("idle"); 
        return; 
      }
      await submitLead(pendingSlotsRef.current || slots);
      return;
    }
  }, [phase, slots, ask, assistantSay, submitLead]);

  const handleSend = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    pushUser(text);
    setInput("");
    await handleTextFlow(text);
  }, [input, pushUser, handleTextFlow]);

  const clickChip = useCallback(async (value: string) => {
    pushUser(value);
    await handleTextFlow(value);
  }, [pushUser, handleTextFlow]);

  // Suggestions / quick‑reply chips
  const chips = React.useMemo(() => {
    if (phase === "consent1" || phase === "consent2") return ["Yes", "No"];
    if (phase === "callback") return ["Now", "Later today", "Evenings", "Weekends"];
    if (phase === "postcode") return ["Skip"];
    return [];
  }, [phase]);

  return (
    <div className="fixed right-4 z-50 chat-dock">
      {open && (
        <div className="glass-card w-80 max-w-[85vw] rounded-2xl p-4 mb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-sm font-semibold">Credit Cleaners Chat</span>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              className="text-sm" 
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          <div ref={listRef} className="h-64 overflow-y-auto space-y-2 pr-1 chat-scroll">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={`inline-block rounded-xl px-3 py-2 text-sm leading-snug ${
                  m.role === "user" ? "bg-blue-600 text-white" : "bg-white/70"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="text-left">
                <div className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm bg-white/70">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse"></span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:.15s]"></span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:.3s]"></span>
                </div>
              </div>
            )}
          </div>
          {chips.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {chips.map((c) => (
                <button 
                  key={c} 
                  onClick={() => clickChip(c)} 
                  className="rounded-full border px-3 py-1 text-xs hover:bg-slate-50"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <form onSubmit={handleSend} className="mt-2 flex gap-2">
            <input 
              className="flex-1 rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" 
              placeholder="Type here…" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              aria-label="Chat input"
            />
            <button className="btn-cta text-sm px-3" type="submit">
              Send
            </button>
          </form>
          <p className="mt-2 text-[11px] text-slate-500">
            We're an introducer (not a debt advice firm). Free help: MoneyHelper.
          </p>
        </div>
      )}
      <button 
        onClick={() => setOpen((o) => !o)} 
        className="btn-cta chat-fab shadow-lg" 
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "Close chat" : "Live chat"}
      </button>
    </div>
  );
};
