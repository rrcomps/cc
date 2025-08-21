import React from 'react';

export const TrustSection: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="trust-heading">
      <h2 id="trust-heading" className="sr-only">Trust and Information</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card glass-morph rounded-2xl p-4 sm:p-6">
          <h3 className="font-semibold">Who we are</h3>
          <p className="mt-2 text-sm text-slate-600">
            We're a UK marketing and introductions company. With your consent we refer you to a firm authorised and regulated by the{' '}
            <span className="hl">Financial Conduct Authority (FCA)</span> that can provide regulated debt advice.
          </p>
        </div>
        <div className="glass-card glass-morph rounded-2xl p-4 sm:p-6">
          <h3 className="font-semibold">What to expect</h3>
          <p className="mt-2 text-sm text-slate-600">
            A short call to understand your situation, confirm your details, and outline options such as budgeting help, Debt Management Plans, or IVAs (where appropriate).{' '}
            <span className="hl">No obligation.</span>
          </p>
        </div>
        <div className="glass-card glass-morph rounded-2xl p-4 sm:p-6">
          <h3 className="font-semibold">Your data</h3>
          <p className="mt-2 text-sm text-slate-600">
            Your information is used to handle your enquiry and referral. See our{' '}
            <span className="hl">Privacy Notice</span> for details. You can{' '}
            <span className="hl">withdraw consent</span> at any time.
          </p>
        </div>
      </div>
    </section>
  );
};
