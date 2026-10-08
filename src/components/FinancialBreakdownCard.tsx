import React from 'react';
import { formatINR, calculateFundingMetrics } from '../data/mockCases';
import { ShieldCheck, Info } from 'lucide-react';

interface FinancialBreakdownCardProps {
  totalTreatmentCost: number;
  insuranceConfirmed: number;
  governmentSupportConfirmed: number;
  hospitalAssistance: number;
  familyContribution: number;
  existingDonations: number;
  alreadyRaised: number;
  className?: string;
  condensed?: boolean;
}

export const FinancialBreakdownCard: React.FC<FinancialBreakdownCardProps> = ({
  totalTreatmentCost,
  insuranceConfirmed,
  governmentSupportConfirmed,
  hospitalAssistance,
  familyContribution,
  existingDonations,
  alreadyRaised,
  className = '',
  condensed = false,
}) => {
  const { confirmedSupport, verifiedFundingGap, stillNeeded } = calculateFundingMetrics({
    totalTreatmentCost,
    insuranceConfirmed,
    governmentSupportConfirmed,
    hospitalAssistance,
    familyContribution,
    existingDonations,
    alreadyRaised,
  });

  const progressPercent =
    verifiedFundingGap > 0
      ? Math.min(100, Math.round((alreadyRaised / verifiedFundingGap) * 100))
      : 100;

  return (
    <div className={`cf-card ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <div>
          <h3 className="cf-card-heading text-neutral-900">Financial Breakdown</h3>
          <p className="cf-secondary mt-0.5">
            Transparent view of verified medical costs and confirmed financial aid.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-semibold">Hospital Verified</span>
        </div>
      </div>

      {/* Itemized Calculation Grid */}
      <div className="py-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="cf-body text-neutral-700">Total Treatment Cost</span>
          <span className="font-semibold text-neutral-900 tabular-nums">
            {formatINR(totalTreatmentCost)}
          </span>
        </div>

        <div className="pl-3 border-l-2 border-neutral-200 space-y-2 text-xs md:text-sm text-neutral-600">
          <div className="flex items-center justify-between">
            <span className="cf-secondary text-neutral-600">− Insurance Confirmed</span>
            <span className="tabular-nums text-neutral-800">
              {formatINR(insuranceConfirmed)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="cf-secondary text-neutral-600">− Government Support Confirmed</span>
            <span className="tabular-nums text-neutral-800">
              {formatINR(governmentSupportConfirmed)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="cf-secondary text-neutral-600">− Hospital Assistance</span>
            <span className="tabular-nums text-neutral-800">
              {formatINR(hospitalAssistance)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="cf-secondary text-neutral-600">− Family Contribution</span>
            <span className="tabular-nums text-neutral-800">
              {formatINR(familyContribution)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="cf-secondary text-neutral-600">− Existing Donations</span>
            <span className="tabular-nums text-neutral-800">
              {formatINR(existingDonations)}
            </span>
          </div>
        </div>

        {/* Verified Funding Gap Line */}
        <div className="pt-2 border-t border-neutral-200 flex items-center justify-between font-semibold">
          <span className="text-neutral-900">Verified Funding Gap</span>
          <span className="text-base md:text-lg text-neutral-900 tabular-nums">
            {formatINR(verifiedFundingGap)}
          </span>
        </div>
      </div>

      {/* Progress & Bottom Summary */}
      <div className="pt-4 border-t border-neutral-100 bg-neutral-50/70 -mx-6 -mb-6 p-6 rounded-b-xl space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-neutral-700">
              Funding Progress: <strong className="text-neutral-900">{progressPercent}%</strong>
            </span>
            <span className="text-neutral-500 tabular-nums">
              {formatINR(alreadyRaised)} of {formatINR(verifiedFundingGap)}
            </span>
          </div>
          <div className="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2-Part Highlight: Already Raised vs Still Needed */}
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div className="p-3 bg-white rounded-lg border border-neutral-200">
            <p className="cf-secondary text-xs text-neutral-500 font-medium">Already Raised</p>
            <p className="cf-financial-number text-lg md:text-xl text-neutral-900 mt-0.5">
              {formatINR(alreadyRaised)}
            </p>
            <p className="cf-secondary text-[11px] text-neutral-500 mt-1">
              Disbursed directly to hospital escrow.
            </p>
          </div>

          <div className="p-3 bg-red-50/50 rounded-lg border border-red-200">
            <p className="cf-secondary text-xs text-red-700 font-medium">Amount Still Needed</p>
            <p className="cf-financial-number text-lg md:text-xl text-red-700 mt-0.5">
              {formatINR(stillNeeded)}
            </p>
            <p className="cf-secondary text-[11px] text-red-600/90 mt-1">
              Remaining amount to complete verified care.
            </p>
          </div>
        </div>

        {/* Formula Explanation Note as required */}
        <div className="flex items-start gap-2 text-xs text-neutral-500 bg-white p-3 rounded-md border border-neutral-200">
          <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Verified Funding Gap</strong> = Total verified treatment cost − confirmed support − existing donations.
            Only confirmed and approved support reduces the funding gap.
          </p>
        </div>
      </div>
    </div>
  );
};
