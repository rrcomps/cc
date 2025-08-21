import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { SEO_CONFIG } from "../lib/constants";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        {/* SEO Meta Tags */}
        <title>{SEO_CONFIG.title}</title>
        <meta name="description" content={SEO_CONFIG.description} />
        <meta name="keywords" content={SEO_CONFIG.keywords} />
        <meta name="author" content={SEO_CONFIG.company} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SEO_CONFIG.url} />
        <meta property="og:title" content={SEO_CONFIG.title} />
        <meta property="og:description" content={SEO_CONFIG.description} />
        <meta property="og:site_name" content="Credit Cleaners" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={SEO_CONFIG.url} />
        <meta property="twitter:title" content={SEO_CONFIG.title} />
        <meta property="twitter:description" content={SEO_CONFIG.description} />
        
        {/* Viewport and Mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={SEO_CONFIG.url} />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data */}
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
      </Head>
      <Component {...pageProps} />
    </>
  );
}
