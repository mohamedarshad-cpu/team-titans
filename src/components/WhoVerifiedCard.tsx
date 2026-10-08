import React from 'react';
import { ShieldCheck, Calendar, Hash, Building2 } from 'lucide-react';

interface WhoVerifiedCardProps {
  verifiedByTitle: string;
  verifierName?: string;
  verificationDate: string;
  verificationReference: string;
  hospital: string;
  className?: string;
}

export const WhoVerifiedCard: React.FC<WhoVerifiedCardProps> = ({
  verifiedByTitle,
  verifierName,
  verificationDate,
  verificationReference,
  hospital,
  className = '',
}) => {
  return (
    <div className={`cf-card border-neutral-200 bg-white ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h4 className="cf-card-heading text-neutral-900 text-base">Verified Medical Authority</h4>
          <p className="cf-secondary text-xs">Official hospital & clinical accreditation seal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm">
        <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
          <span className="cf-secondary text-xs flex items-center gap-1.5 text-neutral-500 mb-0.5">
            <Building2 className="w-3.5 h-3.5 text-neutral-400" />
            Verified By
          </span>
          <p className="font-semibold text-neutral-900 text-sm">
            {verifiedByTitle}
          </p>
          {verifierName && (
            <p className="cf-secondary text-xs text-neutral-600 mt-0.5">
              {verifierName}
            </p>
          )}
        </div>

        <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80">
          <span className="cf-secondary text-xs flex items-center gap-1.5 text-neutral-500 mb-0.5">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            Verification Date
          </span>
          <p className="font-semibold text-neutral-900 text-sm">
            {verificationDate}
          </p>
          <p className="cf-secondary text-xs text-neutral-500 mt-0.5">
            Audit recorded & locked
          </p>
        </div>

        <div className="sm:col-span-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
          <div>
            <span className="cf-secondary text-xs flex items-center gap-1.5 text-neutral-500 mb-0.5">
              <Hash className="w-3.5 h-3.5 text-neutral-400" />
              Verification Reference
            </span>
            <p className="font-mono font-semibold text-neutral-900 text-xs">
              {verificationReference}
            </p>
          </div>
          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
            Valid
          </span>
        </div>
      </div>

      <p className="cf-secondary text-xs text-neutral-500 mt-3 pt-2.5 border-t border-neutral-100 leading-relaxed">
        Hospital desk representative confirmed the itemized surgery cost, identity, and clinical records.
      </p>
    </div>
  );
};
