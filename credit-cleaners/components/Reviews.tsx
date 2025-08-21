import React from 'react';
import { Star } from 'lucide-react';
import { REVIEWS } from '../lib/constants';

export const Reviews: React.FC = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16" aria-labelledby="reviews-heading">
      <h2 id="reviews-heading" className="text-2xl font-semibold text-center">
        What people say
      </h2>
      <div className="marquee mt-6" role="region" aria-label="Customer testimonials">
        <div className="marquee__track">
          {[...REVIEWS, ...REVIEWS].map((review, i) => (
            <div key={i} className="glass-card glass-morph review-card rounded-2xl p-5" role="article">
              <div className="flex items-center gap-1 text-amber-500 mb-1" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="text-slate-700 text-sm leading-relaxed review-text">
                "{review.text}"
              </blockquote>
              <cite className="mt-2 text-xs text-slate-500 not-italic">
                — {review.name}, {review.area}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
