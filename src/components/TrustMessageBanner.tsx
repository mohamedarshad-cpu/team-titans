import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

interface TrustMessageBannerProps {
  className?: string;
  condensed?: boolean;
}

/**
 * CareFund Core Trust Message:
 * "AI assists. Humans decide."
 * "CareFund uses AI to help identify missing or inconsistent information. Final decisions are always made by authorized human reviewers."
 */
export const TrustMessageBanner: React.FC<TrustMessageBannerProps> = ({
  className = '',
  condensed = false,
}) => {
  if (condensed) {
    return (
      <div className={`flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100/80 px-3 py-1.5 rounded-lg border border-neutral-200 ${className}`}>
        <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
        <span>
          <strong>AI assists. Humans decide.</strong> Authorized human reviewers make all final decisions.
        </span>
      </div>
    );
  }

  return (
    <div className={`p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 flex items-start gap-3 ${className}`}>
      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 mt-0.5">
        <ShieldCheck className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-neutral-900 text-xs sm:text-sm">
          AI assists. Humans decide.
        </p>
        <p className="text-neutral-600 text-xs mt-0.5 leading-relaxed">
          CareFund uses AI to help identify missing or inconsistent information. Final decisions are always made by authorized human reviewers.
        </p>
      </div>
    </div>
  );
};
