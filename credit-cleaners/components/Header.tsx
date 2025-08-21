import React from 'react';
import { Award, Phone } from 'lucide-react';
import { SEO_CONFIG } from '../lib/constants';

interface HeaderProps {
  ctaText: string;
  formMode: 'single' | 'two';
  onFormModeChange: (mode: 'single' | 'two') => void;
}

export const Header: React.FC<HeaderProps> = ({ ctaText, formMode, onFormModeChange }) => {
  const isSingle = formMode === 'single';

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-teal-100">
      <div className="mx-auto max-w-6xl px-4 py-2 md:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="h-6 w-6 text-teal-700" />
          <span className="font-semibold">Credit Cleaners</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Preview toggle (single vs two-step) */}
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-600 border rounded-full px-2 py-1" data-preview-control>
            <span className="hidden lg:inline">Form:</span>
            <button 
              onClick={() => onFormModeChange("two")} 
              className={`px-2 py-0.5 rounded-full ${!isSingle ? "bg-slate-200" : "hover:bg-slate-100"}`}
              aria-label="Switch to two-step form"
            >
              Two‑step
            </button>
            <button 
              onClick={() => onFormModeChange("single")} 
              className={`px-2 py-0.5 rounded-full ${isSingle ? "bg-slate-200" : "hover:bg-slate-100"}`}
              aria-label="Switch to single-step form"
            >
              Single
            </button>
          </div>
          <a 
            href={`tel:${SEO_CONFIG.phone}`} 
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-teal-50" 
            aria-label="Call Credit Cleaners"
          >
            <Phone className="h-4 w-4" /> {SEO_CONFIG.phone.replace('+44', '0')}
          </a>
          <a 
            href="#form" 
            className="btn-cta hidden sm:inline-flex items-center gap-2" 
            aria-label="Check eligibility now"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </header>
  );
};
