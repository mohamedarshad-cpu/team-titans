import React from 'react';
import { CaseStatus } from '../types/carefund';
import { STATUS_EXPLANATIONS } from '../data/mockCases';
import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: CaseStatus;
  showExplanation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  showExplanation = false,
  size = 'md',
  className = '',
}) => {
  const explanation = STATUS_EXPLANATIONS[status] || 'Status recorded by CareFund.';

  // Map status to clean CareFund neutral/semantic theme without garish rainbow badges
  const getStatusStyles = () => {
    switch (status) {
      case 'Hospital Verified':
      case 'Approved':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-600',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />,
        };
      case 'Rejected':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          dot: 'bg-red-600',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-red-700" />,
        };
      case 'Fully Funded':
      case 'Payment Confirmed':
      case 'Reconciled':
      case 'Case Closed':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200',
          dot: 'bg-red-600',
          icon: <CheckCheck className="w-3.5 h-3.5 text-red-700" />,
        };
      case 'Human Review':
      case 'Human Review Required':
      case 'More Information Required':
      case 'Requires More Information':
      case 'Further Review Required':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-600',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />,
        };
      case 'AI Check Completed':
      case 'AI Screening Completed':
        return {
          bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          dot: 'bg-indigo-600',
          icon: <Clock className="w-3.5 h-3.5 text-indigo-700" />,
        };
      case 'Information Submitted':
      case 'Verification in Progress':
      case 'Pending':
      default:
        return {
          bg: 'bg-neutral-100 text-neutral-800 border-neutral-200',
          dot: 'bg-neutral-500',
          icon: <Clock className="w-3.5 h-3.5 text-neutral-600" />,
        };
    }
  };

  const style = getStatusStyles();

  if (showExplanation) {
    return (
      <div className={`p-3 rounded-lg border ${style.bg} ${className}`}>
        <div className="flex items-center gap-2 mb-1">
          {style.icon}
          <span className="cf-status-text font-semibold">{status}</span>
        </div>
        <p className="cf-secondary text-xs opacity-90 leading-relaxed">
          {explanation}
        </p>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-semibold cf-status-text ${
        size === 'sm' ? 'text-xs' : 'text-xs'
      } ${style.bg} ${className}`}
      title={explanation}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      <span>{status}</span>
    </span>
  );
};
