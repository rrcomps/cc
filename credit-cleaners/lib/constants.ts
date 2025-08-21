/**
 * Application constants and configuration
 */

export const CALL_HOURS = { start: 9, end: 17, tz: "Europe/London" };

export const DEBT_TYPES = [
  "Credit cards",
  "Loans", 
  "Store cards",
  "Overdraft",
  "Catalogues",
  "Utility arrears"
] as const;

export const CTA_VARIANTS = [
  "Check eligibility now",
  "See my options", 
  "Find out if you qualify"
] as const;

export const FEATURES = [
  { 
    icon: "shield-check", 
    label: "Introducer service – not debt advice",
    highlight: "not debt advice"
  },
  { 
    icon: "check-circle", 
    label: "Speak to FCA‑authorised specialists",
    highlight: "FCA‑authorised"
  },
  { 
    icon: "lock", 
    label: "Secure & GDPR‑friendly",
    highlight: "Secure"
  },
] as const;

export const REVIEWS = [
  { name: "A.K.", area: "Leeds", text: "Super simple — got a call same day and understood my options clearly." },
  { name: "J.P.", area: "Birmingham", text: "Helpful intro, no pressure. The advisor was patient and professional." },
  { name: "S.R.", area: "Manchester", text: "Finally got clarity — the process was quick and respectful." },
  { name: "L.T.", area: "London", text: "Fast, polite and transparent. Booked at a time that suited me." },
  { name: "R.N.", area: "Glasgow", text: "I liked the clear disclosure and MoneyHelper link. Felt trustworthy." },
  { name: "M.E.", area: "Liverpool", text: "No pressure, just arranged a proper call. Exactly what I needed." },
  { name: "D.K.", area: "Bristol", text: "Quick to respond and very professional throughout." },
  { name: "P.C.", area: "Sheffield", text: "Seamless process from form to callback. Recommended." },
] as const;

export const SEO_CONFIG = {
  title: "Credit Cleaners - FCA Authorised Credit Health & Debt Solutions",
  description: "Get introduced to FCA-authorised credit specialists. Free eligibility check for debt solutions including IVAs, DMPs and credit repair. Secure, UK-based service.",
  keywords: "credit health, credit repair, FCA authorised, debt advice, financial advisor, debt solutions, credit eligibility, IVA, debt management plan",
  url: "https://creditcleaners.co.uk",
  phone: "+441612345678",
  company: "Credit Cleaners Ltd",
  companyNumber: "00000000",
  address: "123 Example St, Manchester, M1 1AA"
} as const;

export const CHAT_PROMPTS = {
  name: "What's your full name?",
  email: "Thanks. What's the best email for a callback link?",
  phone: "Got it. What's your UK mobile? (07… or +44 7…)",
  postcode: "Postcode? (optional, helps us route to the nearest adviser)",
  debt: "Roughly how much unsecured debt? e.g., £5k, £12k. (An estimate is fine)",
  consent1: "Can we contact you by phone/SMS/email about your enquiry and introduce you to an FCA‑authorised firm? (yes/no)",
  consent2: "Do you accept our Privacy Notice? (yes/no)",
  callback: "When's best for the adviser to call? e.g., \"today after 6pm\" or \"weekday mornings\"",
} as const;
