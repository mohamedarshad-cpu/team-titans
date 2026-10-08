import React from 'react';
import { formatINR } from '../data/mockCases';
import { Calculator, HeartHandshake } from 'lucide-react';

interface FundingRequirementProps {
  totalCost: number;
  familyContribution: number;
  insurance: number;
  governmentAssistance: number;
  otherAssistance: number;
  onUpdateCost?: (field: string, val: number) => void;
  readOnly?: boolean;
}

export const FundingRequirement: React.FC<FundingRequirementProps> = ({
  totalCost,
  familyContribution,
  insurance,
  governmentAssistance,
  otherAssistance,
  readOnly = true,
}) => {
  const donationRequired = Math.max(
    0,
    totalCost - (familyContribution + insurance + governmentAssistance + otherAssistance)
  );

  const percentageCovered = totalCost > 0
    ? Math.min(100, Math.round(((totalCost - donationRequired) / totalCost) * 100))
    : 0;

  return (
    <div className="cf-card p-6 sm:p-8 border-red-200 bg-gradient-to-br from-white via-red-50/10 to-red-50/30 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-neutral-900">Funding Requirement & Cost Breakdown</h3>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            CareFund Donation Required is automatically computed from verified hospital estimates and financial support sources.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-1.5 self-start">
          <HeartHandshake className="w-4 h-4" />
          <span>{percentageCovered}% Covered by Family, Insurance & Govt</span>
        </div>
      </div>

      {/* Prominent Funding Required Highlight Card */}
      <div className="p-6 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            CareFund Donation Required
          </span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
            ₹ {formatINR(donationRequired)}
          </div>
          <p className="text-xs text-neutral-300">
            Verified funding gap needed from CareFund community donors to ensure admission.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-center">
            <span className="text-[10px] uppercase text-neutral-400 block font-medium">Total Cost</span>
            <span className="text-sm font-bold text-white">₹ {formatINR(totalCost)}</span>
          </div>
          <div className="px-4 py-3 rounded-xl bg-neutral-800/80 border border-neutral-700 text-center">
            <span className="text-[10px] uppercase text-neutral-400 block font-medium">Support Total</span>
            <span className="text-sm font-bold text-emerald-300">
              ₹ {formatINR(familyContribution + insurance + governmentAssistance + otherAssistance)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold text-neutral-700">
          <span>Funding Progress</span>
          <span>{percentageCovered}% Secured</span>
        </div>
        <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden p-0.5 border border-neutral-200">
          <div
            className="h-full bg-gradient-to-r from-red-600 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percentageCovered}%` }}
          />
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 block">Total Treatment Cost</span>
          <span className="text-base font-bold text-neutral-900">₹ {formatINR(totalCost)}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 block">Family Contribution</span>
          <span className="text-base font-bold text-neutral-900">₹ {formatINR(familyContribution)}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 block">Insurance Coverage</span>
          <span className="text-base font-bold text-neutral-900">₹ {formatINR(insurance)}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 block">Govt. Scheme Aid</span>
          <span className="text-base font-bold text-neutral-900">₹ {formatINR(governmentAssistance)}</span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-medium text-neutral-500 block">Other Assistance</span>
          <span className="text-base font-bold text-neutral-900">₹ {formatINR(otherAssistance)}</span>
        </div>
      </div>
    </div>
  );
};
