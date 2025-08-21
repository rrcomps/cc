import React from 'react';
import { SEO_CONFIG } from '../lib/constants';
import { getCurrentYear } from '../lib/utils';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-white" role="contentinfo">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">Important information</h3>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                We are an advertising and introductions company. We do not provide debt advice and are not authorised by the FCA to do so.
              </li>
              <li>
                Free and impartial debt advice is available from MoneyHelper:{' '}
                <a 
                  className="hlu" 
                  href="https://www.moneyhelper.org.uk/en" 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Visit MoneyHelper for free debt advice (opens in new tab)"
                >
                  moneyhelper.org.uk
                </a>.
              </li>
              <li>
                Some debt solutions can affect your credit rating and ability to obtain credit. Fees may apply. Your advisor will confirm details.
              </li>
            </ul>
          </div>
          <div id="privacy">
            <h3 className="font-semibold">Privacy Notice (summary)</h3>
            <p className="mt-2">
              We process your data to respond to your enquiry and, if you consent, to introduce you to an FCA‑authorised firm. 
              Lawful basis: consent and legitimate interests. You have rights to access, rectification, erasure, and objection. 
              Contact: privacy@creditcleaners.co.uk.
            </p>
            <p className="mt-2">
              © {getCurrentYear()} {SEO_CONFIG.company} — Company No. {SEO_CONFIG.companyNumber} — 
              Registered Office: {SEO_CONFIG.address}.
            </p>
          </div>
        </div>
      </div>
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FinancialService",
            "name": "Credit Cleaners",
            "description": SEO_CONFIG.description,
            "url": SEO_CONFIG.url,
            "telephone": SEO_CONFIG.phone,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": SEO_CONFIG.address.split(',')[0],
              "addressLocality": "Manchester",
              "postalCode": "M1 1AA",
              "addressCountry": "GB"
            },
            "areaServed": "GB",
            "serviceType": "Credit Repair and Debt Solutions",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Credit Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Credit Health Assessment"
                  }
                },
                {
                  "@type": "Offer", 
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Debt Solutions Consultation"
                  }
                }
              ]
            }
          })
        }}
      />
    </footer>
  );
};
