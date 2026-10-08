import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Check, CircleDot, Clock, ShieldCheck, UserCheck } from 'lucide-react';

export type FourStepStage = 1 | 2 | 3 | 4;

interface FourStepReviewStepperProps {
  currentStage?: FourStepStage;
  currentStep?: number;
  status?: string;
  decisionOutcome?: 'Approved' | 'More Information Required' | 'Further Review Required' | 'Rejected' | 'Not yet decided';
  decisionMaker?: string;
  decisionDate?: string;
  decisionReason?: string;
  className?: string;
}

export const FourStepReviewStepper: React.FC<FourStepReviewStepperProps> = ({
  currentStage: propStage,
  currentStep,
  status,
  decisionOutcome: propOutcome = 'Not yet decided',
  decisionMaker,
  decisionDate,
  decisionReason,
  className = '',
}) => {
  const { t, dir } = useLanguage();
  let effectiveStage = (propStage || currentStep || 1) as FourStepStage;
  if (status === 'Approved') {
    effectiveStage = 4;
  } else if (status === 'Hospital Verified') {
    effectiveStage = 4;
  } else if (status === 'Human Review Required' || status === 'Human Review' || status === 'Requires More Information') {
    effectiveStage = 3;
  } else if (status === 'AI Check Completed' || status === 'AI Screening Completed') {
    effectiveStage = 2;
  } else if (status === 'Information Submitted') {
    effectiveStage = 1;
  }

  const isApproved = status === 'Approved' || propOutcome === 'Approved';
  const isHospitalVerified = status === 'Hospital Verified';
  const decisionOutcome = isApproved ? 'Approved' : isHospitalVerified ? 'Hospital Verified' : propOutcome;

  const steps = [
    {
      number: 1,
      title: t.step1Title,
      shortTitle: '1. Submitted',
      desc: t.step1Desc,
    },
    {
      number: 2,
      title: t.step2Title,
      shortTitle: '2. AI Checked',
      desc: t.step2Desc,
    },
    {
      number: 3,
      title: t.step3Title,
      shortTitle: '3. Human Review',
      desc: isHospitalVerified || isApproved
        ? 'Verified by authorized hospital clinical desk & documents uploaded.'
        : t.step3Desc,
    },
    {
      number: 4,
      title: t.step4Title,
      shortTitle: '4. Final Decision',
      desc: isApproved
        ? 'Approved by authorized clinical auditor. Verified for escrow crowdfunding.'
        : isHospitalVerified
        ? 'Awaiting authorized human auditor sign-off on hospital uploaded files.'
        : t.step4Desc,
    },
  ];

  const checkIsCompleted = (stepNum: number) => {
    if (stepNum === 1) return effectiveStage >= 2 || isHospitalVerified || isApproved;
    if (stepNum === 2) return effectiveStage >= 3 || isHospitalVerified || isApproved;
    if (stepNum === 3) return isHospitalVerified || isApproved || (effectiveStage === 4 && isApproved);
    if (stepNum === 4) return isApproved;
    return false;
  };

  const checkIsCurrent = (stepNum: number) => {
    if (isApproved) return false;
    if (isHospitalVerified) return stepNum === 4;
    return effectiveStage === stepNum;
  };

  return (
    <div className={`cf-card border-neutral-200 bg-white space-y-4 ${className}`}>
      {/* Stepper Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="cf-card-heading text-neutral-900 text-sm font-semibold uppercase tracking-wider">
            4-Step Review Progress
          </span>
          <span className="cf-secondary text-xs text-neutral-500">
            · {isApproved ? 'All 4 Steps Verified' : isHospitalVerified ? 'Step 3 Verified · Awaiting Step 4' : `Step ${effectiveStage} of 4`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
          <ShieldCheck className="w-3.5 h-3.5 text-red-600 shrink-0" />
          <span className="font-semibold">{t.motto}</span>
        </div>
      </div>

      {/* Desktop Horizontal Stepper (hidden on mobile) */}
      <div className="hidden md:grid md:grid-cols-4 gap-2 pt-1">
        {steps.map((st) => {
          const isCompleted = checkIsCompleted(st.number);
          const isCurrent = checkIsCurrent(st.number);

          return (
            <div
              key={st.number}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : isCurrent
                  ? 'border-red-600 bg-red-50/40 ring-1 ring-red-600/30'
                  : 'border-neutral-200 bg-neutral-50/50 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : st.number}
                  </span>

                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCurrent
                        ? 'bg-red-100 text-red-800'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isCurrent ? 'Active Now' : 'Pending'}
                  </span>
                </div>

                <p className="cf-card-heading text-xs font-semibold text-neutral-900 mb-1">
                  {st.title}
                </p>
                <p className="cf-secondary text-[11px] text-neutral-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              {st.number === 4 && (isApproved || isHospitalVerified) && (
                <div className="mt-2 pt-2 border-t border-neutral-200/60 text-[11px] font-semibold text-neutral-800">
                  Outcome: <span className={isApproved ? 'text-emerald-700' : 'text-amber-700'}>{isApproved ? 'Approved by Auditor' : 'Hospital Verified'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper (hidden on desktop) */}
      <div className="md:hidden space-y-3 relative pl-6 rtl:pl-0 rtl:pr-6 before:absolute before:left-[11px] rtl:before:left-auto rtl:before:right-[11px] before:top-3 before:bottom-3 before:w-[2px] before:bg-neutral-200">
        {steps.map((st) => {
          const isCompleted = checkIsCompleted(st.number);
          const isCurrent = checkIsCurrent(st.number);

          return (
            <div key={st.number} className="relative group">
              <div
                className={`absolute -left-6 rtl:-left-auto rtl:-right-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-red-600 text-white ring-2 ring-red-100'
                    : 'bg-neutral-200 text-neutral-600'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : st.number}
              </div>

              <div
                className={`p-3 rounded-lg border text-xs ${
                  isCurrent
                    ? 'border-red-500 bg-red-50/30'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-neutral-200 bg-neutral-50/40 opacity-80'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-neutral-900">{st.title}</span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCurrent
                        ? 'bg-red-100 text-red-800'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {isCompleted ? 'Completed' : isCurrent ? 'Active Now' : 'Pending'}
                  </span>
                </div>
                <p className="cf-secondary text-[11px] text-neutral-600">{st.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decision Summary Info if at Step 4 */}
      {effectiveStage === 4 && (
        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-neutral-900">
              Decision Made By: {decisionMaker || 'Authorized Hospital Clinical Supervisor'}
            </span>
            <span className="cf-secondary text-[11px] text-neutral-500">
              {decisionDate || 'Today'}
            </span>
          </div>
          {decisionReason && (
            <p className="text-neutral-700 bg-white p-2 rounded border border-neutral-200 text-[11px]">
              <strong>Decision Reason:</strong> {decisionReason}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
