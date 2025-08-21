import React from 'react';
import { ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { FEATURES } from '../lib/constants';

const iconMap = {
  'shield-check': ShieldCheck,
  'check-circle': CheckCircle2,
  'lock': Lock,
};

export const Features: React.FC = () => {
  return (
    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4" role="list">
      {FEATURES.map((feature, index) => {
        const IconComponent = iconMap[feature.icon as keyof typeof iconMap];
        
        return (
          <li key={index} className="feature-pill" role="listitem">
            <span className="icon" aria-hidden="true">
              <IconComponent className="h-6 w-6 text-teal-700" />
            </span>
            <span className="text text-sm text-slate-800">
              {feature.label.split(feature.highlight).map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="hl">{feature.highlight}</span>
                  )}
                </React.Fragment>
              ))}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
