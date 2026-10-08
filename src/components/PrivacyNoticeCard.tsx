import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PrivacyNoticeCardProps {
  className?: string;
}

export const PrivacyNoticeCard: React.FC<PrivacyNoticeCardProps> = ({ className = '' }) => {
  return (
    <div className={`cf-card border-neutral-200 bg-white ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="cf-card-heading text-neutral-900 text-base">Privacy & Patient Dignity</h4>
          <p className="cf-secondary text-xs">Strict separation of verified transparency and patient privacy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-700" />
            <span>What Donors Can See</span>
          </div>
          <ul className="space-y-1 text-emerald-800/90 list-disc list-inside">
            <li>Case ID & Treatment category</li>
            <li>Verified Hospital & City</li>
            <li>Itemized cost breakdown & funding gap</li>
            <li>Amount raised & remaining need</li>
            <li>Direct hospital escrow settlement reference</li>
          </ul>
        </div>

        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
          <div className="flex items-center gap-1.5 font-semibold text-neutral-800 mb-1.5">
            <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
            <span>Protected & Confidential</span>
          </div>
          <ul className="space-y-1 text-neutral-600 list-disc list-inside">
            <li>Government ID & Aadhaar numbers</li>
            <li>Private medical diagnostic scans & lab films</li>
            <li>Patient phone numbers & home addresses</li>
            <li>Personal banking credentials</li>
          </ul>
        </div>
      </div>

      <p className="cf-secondary text-xs text-neutral-500 mt-3 pt-2.5 border-t border-neutral-100 leading-relaxed">
        <strong>Authorized Access Only:</strong> Detailed clinical charts are accessible exclusively to authorized hospital staff and accredited clinical verification officers.
      </p>
    </div>
  );
};
