import React, { useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, AlertTriangle, Lock, ShieldCheck, Award } from 'lucide-react';
import { LeadFormData, FormErrors, FormTouched, FormMode } from '../lib/types';
import { validateEmail, validateUKMobile, validatePostcode, validateFullName } from '../lib/validation';
import { DEBT_TYPES, SEO_CONFIG } from '../lib/constants';
import { formatCurrency } from '../lib/utils';

interface LeadFormProps {
  formMode: FormMode;
  ctaText: string;
  onFormModeChange: (mode: FormMode) => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ formMode, ctaText, onFormModeChange }) => {
  const [form, setForm] = useState<LeadFormData>({
    fullName: "",
    email: "",
    phone: "",
    postcode: "",
    debtAmount: 5000,
    debtTypes: [],
    consentContact: false,
    consentPrivacy: false,
    honey: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [showExitCall, setShowExitCall] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [formInView, setFormInView] = useState(false);
  const [touched, setTouched] = useState<FormTouched>({ 
    fullName: false, 
    email: false, 
    phone: false, 
    postcode: false 
  });
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const errors = useMemo((): FormErrors => ({
    fullName: validateFullName(form.fullName) ? "" : "Please enter your full name",
    email: validateEmail(form.email) ? "" : "Enter a valid email address",
    phone: validateUKMobile(form.phone) ? "" : "Enter a valid UK mobile (07… or +44 7…)",
    postcode: form.postcode && !validatePostcode(form.postcode) ? "Enter a valid UK postcode (e.g., M1 1AA)" : "",
  }), [form]);

  const step1Valid = useMemo(() => !errors.fullName && !errors.email && !errors.phone, [errors]);
  const finalValidSingle = useMemo(() => 
    step1Valid && form.consentContact && form.consentPrivacy, 
    [step1Valid, form.consentContact, form.consentPrivacy]
  );

  const isSingle = formMode === 'single';

  // Sticky CTA visibility (hide when form in view)
  React.useEffect(() => {
    if (!formRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      const e = entries[0];
      setFormInView(e.isIntersecting);
    }, { threshold: 0.2 });
    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, [formRef]);

  const setModeAndUrl = useCallback((mode: FormMode) => {
    onFormModeChange(mode);
    try { 
      localStorage.setItem("formMode", mode); 
    } catch (_) {}
    try {
      const params = new URLSearchParams(window.location.search);
      if (mode === "two") params.delete("form"); 
      else params.set("form", "single");
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, "", newUrl);
    } catch (_) {}
  }, [onFormModeChange]);

  const toggleDebtType = useCallback((type: string) => {
    setForm((f) => ({
      ...f,
      debtTypes: f.debtTypes.includes(type)
        ? f.debtTypes.filter((t) => t !== type)
        : [...f.debtTypes, type],
    }));
  }, []);

  const update = useCallback((key: keyof LeadFormData, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAttemptedSubmit(true);

    if (form.honey) return; // bot detected – silently ignore

    if (isSingle) {
      if (!finalValidSingle) { return; }
    } else {
      if (step === 1) {
        if (!step1Valid) return;
        setStep(2);
        return;
      }
      if (!(form.consentContact && form.consentPrivacy)) {
        setError("Please confirm the consent checkboxes to proceed.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = { 
        source: "landing-page", 
        timestamp: new Date().toISOString(), 
        mode: isSingle ? "single" : "two", 
        ...form 
      };
      
      const response = await fetch("/api/lead", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(payload) 
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      await new Promise((r) => setTimeout(r, 400));
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong sending your details. Please try again.");
    } finally { 
      setSubmitting(false); 
    }
  }, [form, isSingle, step, step1Valid, finalValidSingle]);

  return (
    <>
      {/* Mobile title above the form */}
      <div className="sm:hidden px-4 mb-3">
        <h1 className="text-2xl font-bold tracking-tight">
          Grow your <span className="hl">credit health</span> — fast <span className="hl">eligibility check</span>
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div id="form" ref={formRef} className="glass-card glass-morph rounded-2xl p-4 sm:p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">See if you <span className="hl">qualify</span></h2>
                {!isSingle && <div className="text-xs text-slate-500">Step {step} of 2</div>}
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}

              {/* Honeypot */}
              <div className="hidden">
                <label htmlFor="company">Company</label>
                <input 
                  id="company" 
                  name="company" 
                  autoComplete="off" 
                  className="border" 
                  value={form.honey} 
                  onChange={(e) => update("honey", e.target.value)} 
                />
              </div>

              {/* Step 1 fields (always shown in single mode) */}
              {(isSingle || step === 1) && (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium">Full name</label>
                      <input
                        id="fullName"
                        type="text"
                        className={`mt-1 w-full rounded-xl border-2 px-3 py-2 focus:outline-none ${
                          ((touched.fullName || attemptedSubmit) && errors.fullName) 
                            ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                            : "border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        }`}
                        placeholder="Jane Doe"
                        value={form.fullName}
                        onChange={(e) => update("fullName", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                        aria-invalid={!!((touched.fullName || attemptedSubmit) && errors.fullName)}
                        aria-describedby="fullName-error"
                        required
                      />
                      {(touched.fullName || attemptedSubmit) && errors.fullName && (
                        <p id="fullName-error" className="mt-1 text-xs text-red-600" role="alert">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="postcode" className="block text-sm font-medium">Postcode</label>
                      <input
                        id="postcode"
                        type="text"
                        className={`mt-1 w-full rounded-xl border-2 px-3 py-2 focus:outline-none ${
                          ((touched.postcode || attemptedSubmit) && errors.postcode) 
                            ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                            : "border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        }`}
                        placeholder="M1 1AA"
                        value={form.postcode}
                        onChange={(e) => update("postcode", e.target.value.toUpperCase())}
                        onBlur={() => setTouched((t) => ({ ...t, postcode: true }))}
                        aria-invalid={!!((touched.postcode || attemptedSubmit) && errors.postcode)}
                        aria-describedby="postcode-error"
                      />
                      {(touched.postcode || attemptedSubmit) && errors.postcode && (
                        <p id="postcode-error" className="mt-1 text-xs text-red-600" role="alert">
                          {errors.postcode}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium">Email</label>
                      <input
                        id="email"
                        type="email"
                        className={`mt-1 w-full rounded-xl border-2 px-3 py-2 focus:outline-none ${
                          ((touched.email || attemptedSubmit) && errors.email) 
                            ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                            : "border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        }`}
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        aria-invalid={!!((touched.email || attemptedSubmit) && errors.email)}
                        aria-describedby="email-error"
                        required
                      />
                      {(touched.email || attemptedSubmit) && errors.email && (
                        <p id="email-error" className="mt-1 text-xs text-red-600" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                      <input
                        id="phone"
                        type="tel"
                        className={`mt-1 w-full rounded-xl border-2 px-3 py-2 focus:outline-none ${
                          ((touched.phone || attemptedSubmit) && errors.phone) 
                            ? "border-red-500 focus:ring-2 focus:ring-red-200" 
                            : "border-slate-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        }`}
                        placeholder="07… or +44 7…"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                        aria-invalid={!!((touched.phone || attemptedSubmit) && errors.phone)}
                        aria-describedby="phone-error"
                        required
                      />
                      {(touched.phone || attemptedSubmit) && errors.phone && (
                        <p id="phone-error" className="mt-1 text-xs text-red-600" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2 fields (always shown in single mode) */}
              {(isSingle || step === 2) && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Approx. unsecured debt</label>
                    <div className="mt-2 flex items-center gap-3">
                      <input 
                        type="range" 
                        min={1000} 
                        max={30000} 
                        step={500} 
                        value={form.debtAmount} 
                        onChange={(e) => update("debtAmount", Number(e.target.value))} 
                        className="w-full accent-blue-600" 
                      />
                      <div className="w-28 text-right font-semibold">
                        {formatCurrency(form.debtAmount)}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Typical partner minimum is around £5,000.</p>
                  </div>

                  <div>
                    <span className="block text-sm font-medium">Debt types (select all that apply)</span>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      {DEBT_TYPES.map((type) => (
                        <label key={type} className={`flex items-center gap-2 rounded-xl border p-2 ${
                          form.debtTypes.includes(type) ? "bg-teal-50 border-teal-300" : "bg-white"
                        }`}>
                          <input 
                            type="checkbox" 
                            checked={form.debtTypes.includes(type)} 
                            onChange={() => toggleDebtType(type)} 
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-start gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={form.consentContact} 
                        onChange={(e) => update("consentContact", e.target.checked)} 
                      />
                      <span>
                        I agree that you may contact me by phone, SMS, or email to discuss my enquiry and introduce me to an FCA‑authorised debt advice firm.
                      </span>
                    </label>
                    <label className="flex items-start gap-2 text-sm">
                      <input 
                        type="checkbox" 
                        checked={form.consentPrivacy} 
                        onChange={(e) => update("consentPrivacy", e.target.checked)} 
                      />
                      <span>
                        I have read and accept the <a href="#privacy" className="hlu">Privacy Notice</a> and understand that free and impartial debt help is available at {" "}
                        <a 
                          className="hlu" 
                          href="https://www.moneyhelper.org.uk/en" 
                          target="_blank" 
                          rel="noreferrer"
                          aria-label="Visit MoneyHelper for free debt advice (opens in new tab)"
                        >
                          MoneyHelper
                        </a>.
                      </span>
                    </label>
                  </div>
                </>
              )}

              {/* Actions */}
              {!isSingle && step === 1 && (
                <>
                  <button type="submit" disabled={!step1Valid} className="btn-cta w-full">
                    Continue
                  </button>
                  <div className="trust-row text-xs text-slate-600">
                    <div><Lock className="h-3.5 w-3.5" /> <span>Data <span className="hl">secure</span></span></div>
                    <div><ShieldCheck className="h-3.5 w-3.5" /> <span>We introduce <span className="hl">you</span> to <span className="hl">FCA‑authorised</span> advisers</span></div>
                    <div><Award className="h-3.5 w-3.5" /> <span>UK‑based</span></div>
                  </div>
                </>
              )}

              {(isSingle || step === 2) && (
                <div className="flex items-center justify-between gap-3">
                  {!isSingle && (
                    <button type="button" onClick={() => setStep(1)} className="btn-ghost">
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={submitting || (isSingle ? !finalValidSingle : !(form.consentContact && form.consentPrivacy))}
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold shadow-sm btn-cta"
                    aria-disabled={isSingle ? !finalValidSingle : !(form.consentContact && form.consentPrivacy)}
                  >
                    {submitting ? "Sending…" : ctaText}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold">
                Thanks, {form.fullName.split(" ")[0] || "there"}!
              </h3>
              <p className="mt-2 text-slate-600">
                We've received your details. An FCA‑authorised advisor will be in touch shortly to talk through your options.
              </p>
              <a 
                href="https://www.moneyhelper.org.uk/en" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-teal-50"
                aria-label="Learn about free debt help at MoneyHelper (opens in new tab)"
              >
                Learn about free debt help (MoneyHelper)
              </a>
            </div>
          )}
        </div>
      </motion.div>

      {/* Sticky mobile CTA (hidden when form visible) */}
      {!formInView && (
        <div className="sticky-cta md:hidden bg-white/90 backdrop-blur border-t">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <a href="#form" className="btn-cta w-full text-center inline-block">
              {ctaText}
            </a>
          </div>
        </div>
      )}
    </>
  );
};
