import React from 'react';
import { TimelineStep } from '../types/carefund';
import { Check, Clock, CircleDot, ShieldCheck } from 'lucide-react';

interface VerificationTimelineProps {
  timeline: TimelineStep[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export const VerificationTimeline: React.FC<VerificationTimelineProps> = ({
  timeline,
  className = '',
  title = '4-Step Review System',
  subtitle = 'AI assists with initial checks. Authorized human reviewers make all final decisions.',
}) => {
  return (
    <div className={`cf-card ${className}`}>
      <div className="border-b border-neutral-100 pb-4 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="cf-card-heading text-neutral-900">{title}</h3>
          <span className="cf-status-text text-xs px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
            AI assists · Humans decide
          </span>
        </div>
        <p className="cf-secondary mt-1">
          {subtitle}
        </p>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-neutral-200">
        {timeline.map((step) => {
          const isDone = step.status === 'Completed';
          const isInProgress = step.status === 'In Progress';

          return (
            <div key={step.stepNumber} className="relative group">
              {/* Step indicator circle */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  isDone
                    ? 'bg-red-600 text-white'
                    : isInProgress
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                    : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                }`}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : isInProgress ? (
                  <CircleDot className="w-3.5 h-3.5 stroke-[2.5] animate-pulse" />
                ) : (
                  <span>{step.stepNumber}</span>
                )}
              </div>

              {/* Step content */}
              <div className="pl-3">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="cf-card-heading text-[15px] font-semibold text-neutral-900">
                    Step {step.stepNumber} — {step.title}
                  </span>
                  <span
                    className={`cf-status-text text-[11px] px-2 py-0.5 rounded border ${
                      isDone
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isInProgress
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-neutral-50 text-neutral-500 border-neutral-200'
                    }`}
                  >
                    {step.status}
                  </span>
                  {step.date && (
                    <span className="cf-secondary text-xs text-neutral-500 ml-auto">
                      {step.date}
                    </span>
                  )}
                </div>

                <p className="cf-body text-sm text-neutral-600 leading-relaxed">
                  {step.explanation}
                </p>

                {step.reviewerRole && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
                    <span className="font-medium text-neutral-700">Role / Checker:</span>
                    <span className="text-neutral-600">{step.reviewerRole}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-start gap-2.5 text-xs text-neutral-600 bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
        <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-neutral-900">AI assists. Humans decide.</strong>{' '}
          CareFund uses AI to help identify missing or inconsistent information. Final decisions are always made by authorized human reviewers.
        </p>
      </div>
    </div>
  );
};
