/**
 * Utility functions
 */

import { CTA_VARIANTS } from './constants';

export function chooseCtaVariant(): string {
  if (typeof window === "undefined") return CTA_VARIANTS[0];
  
  const params = new URLSearchParams(window.location.search);
  const fromParam = params.get("cta");
  
  let chosen = "";
  try { 
    chosen = localStorage.getItem("ctaVariant") || ""; 
  } catch (_) {}
  
  if (fromParam && CTA_VARIANTS.includes(fromParam as any)) {
    try { 
      localStorage.setItem("ctaVariant", fromParam); 
    } catch (_) {}
    return fromParam;
  }
  
  if (chosen) return chosen;
  
  const pick = CTA_VARIANTS[Math.floor(Math.random() * CTA_VARIANTS.length)];
  try { 
    localStorage.setItem("ctaVariant", pick); 
  } catch (_) {}
  
  return pick;
}

export function getClientIP(req: any): string {
  return (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").toString().split(",")[0].trim();
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function log(message: string, data?: any): void {
  if (isDevelopment()) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
}

export function logError(message: string, error?: any): void {
  if (isDevelopment()) {
    if (error) {
      console.error(message, error);
    } else {
      console.error(message);
    }
  }
  // In production, you'd want to send this to a logging service
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}
