/**
 * Validation utilities for form inputs
 */

export function validateEmail(value: string): boolean {
  return (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/).test(value.trim());
}

export function validateUKMobile(value: string): boolean {
  const cleaned = value.replace(/[^0-9+]/g, "").replace(/^00/, "+");
  const compact = cleaned.replace(/\s+/g, "");
  return (/^(\+44?7\d{9}|07\d{9})$/).test(compact);
}

export function validatePostcode(value: string): boolean {
  const s = value.trim().toUpperCase();
  if (!s) return true; // optional
  return (/^(GIR 0AA|[A-PR-UWYZ][A-HK-Y]?\d[ABEHMNPRV-Y\d]?\s?\d[ABD-HJLN-UW-Z]{2})$/i).test(s);
}

export function validateFullName(value: string): boolean {
  const s = value.trim();
  if (!s) return false;
  const parts = s.split(/\s+/);
  return parts.length >= 2 && parts[0].length >= 2 && parts[1].length >= 2;
}

export function normalizeDebtBand(text: string): string {
  const n = text.replace(/[^0-9]/g, "").trim();
  if (!n) return "";
  const val = parseInt(n, 10);
  if (isNaN(val)) return "";
  if (val < 5000) return "<£5k";
  if (val < 10000) return "£5k–£10k";
  if (val < 20000) return "£10k–£20k";
  return "£20k+";
}

export function yesLike(value: string): boolean {
  return /^(y|yes|ok|okay|sure|please|go ahead)/i.test(value.trim());
}

export function noLike(value: string): boolean {
  return /^(n|no|stop|don't|dont|nope)/i.test(value.trim());
}

export function sanitizeInput(value: string): string {
  return value.trim().replace(/[<>]/g, '');
}
