import React from 'react';
import { CheckCircle2, Clock, HelpCircle, XCircle } from 'lucide-react';

interface DecisionStatusTrioProps {
  aiScreening: 'Completed' | 'In Progress' | 'Pending';
  humanReview: 'Completed' | 'In Progress' | 'Pending';
  finalDecision: 'Approved' | 'Not yet decided' | 'Requires More Information' | 'Send for Further Review' | 'Rejected';
  className?: string;
}

/**
 * Standard Decision Trio (Rule 13):
 * AI Screening | Human Review | Final Decision
 * Makes it clear AI assists and humans make final decisions.
 */
export const DecisionStatusTrio: React.FC<DecisionStatusTrioProps> = ({
  aiScreening,
  humanReview,
  finalDecision,
  className = '',
}) => {
  const getFinalBadge = () => {
    switch (finalDecision) {
      case 'Approved':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'Rejected':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          icon: <XCircle className="w-3.5 h-3.5 text-red-600" />,
        };
      case 'Requires More Information':
      case 'Send for Further Review':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
        };
      case 'Not yet decided':
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-700 border-neutral-300',
          icon: <Clock className="w-3.5 h-3.5 text-neutral-500" />,
        };
    }
  };

  const finalStyle = getFinalBadge();

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2.5 ${className}`}>
      {/* 1. AI Screening */}
      <div className="p-3 bg-white rounded-lg border border-neutral-200 flex flex-col justify-between">
        <span className="cf-secondary text-[11px] text-neutral-500 font-medium uppercase tracking-wider mb-1">
          1. AI Screening
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-900" />
          <span className="text-xs font-semibold text-neutral-900">{aiScreening}</span>
        </div>
        <span className="cf-secondary text-[11px] text-neutral-500 mt-1">
          {aiScreening === 'Completed' ? 'Initial document check done' : 'Automated check in progress'}
        </span>
      </div>

      {/* 2. Human Review */}
      <div className="p-3 bg-white rounded-lg border border-neutral-200 flex flex-col justify-between">
        <span className="cf-secondary text-[11px] text-neutral-500 font-medium uppercase tracking-wider mb-1">
          2. Human Review
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              humanReview === 'Completed'
                ? 'bg-emerald-600'
                : humanReview === 'In Progress'
                ? 'bg-amber-500'
                : 'bg-neutral-400'
            }`}
          />
          <span className="text-xs font-semibold text-neutral-900">{humanReview}</span>
        </div>
        <span className="cf-secondary text-[11px] text-neutral-500 mt-1">
          {humanReview === 'Completed'
            ? 'Authorized reviewer inspected'
            : humanReview === 'In Progress'
            ? 'Reviewer evaluating records'
            : 'Pending human evaluation'}
        </span>
      </div>

      {/* 3. Final Decision */}
      <div className={`p-3 rounded-lg border flex flex-col justify-between ${finalStyle.bg}`}>
        <span className="cf-secondary text-[11px] opacity-75 font-medium uppercase tracking-wider mb-1">
          3. Final Decision
        </span>
        <div className="flex items-center gap-1.5">
          {finalStyle.icon}
          <span className="text-xs font-bold">{finalDecision}</span>
        </div>
        <span className="cf-secondary text-[11px] opacity-80 mt-1">
          {finalDecision === 'Approved'
            ? 'Authorized human approval'
            : finalDecision === 'Not yet decided'
            ? 'Human decision pending'
            : 'Human reviewer action'}
        </span>
      </div>
    </div>
  );
};
