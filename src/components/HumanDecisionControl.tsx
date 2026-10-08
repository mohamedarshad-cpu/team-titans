import React, { useState } from 'react';
import { MedicalCase, HumanDecisionAction, HumanDecisionRecord } from '../types/carefund';
import { formatINR } from '../data/mockCases';
import { DecisionStatusTrio } from './DecisionStatusTrio';
import { TrustMessageBanner } from './TrustMessageBanner';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileCheck2,
  Clock,
  UserCheck,
  XCircle,
  Building2,
  Send,
} from 'lucide-react';

interface HumanDecisionControlProps {
  caseItem?: MedicalCase;
  medicalCase?: MedicalCase;
  onDecisionSubmit?: (decisionRecord: HumanDecisionRecord, updatedCase: MedicalCase) => void;
  onDecisionComplete?: (decisionRecord: HumanDecisionRecord, updatedCase: MedicalCase) => void;
  onCancel?: () => void;
  className?: string;
}

export const HumanDecisionControl: React.FC<HumanDecisionControlProps> = ({
  caseItem: propCaseItem,
  medicalCase: propMedicalCase,
  onDecisionSubmit: propOnDecisionSubmit,
  onDecisionComplete: propOnDecisionComplete,
  onCancel,
  className = '',
}) => {
  const caseItem = propCaseItem || propMedicalCase;
  const onDecisionSubmit = propOnDecisionSubmit || propOnDecisionComplete || (() => {});
  if (!caseItem) return null;
  const [selectedAction, setSelectedAction] = useState<HumanDecisionAction | null>(null);
  const [reviewerName, setReviewerName] = useState<string>('Dr. Priya Raman');
  const [reviewerRole, setReviewerRole] = useState<string>('Authorized Clinical Reviewer, Chennai');
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedAction) {
      setErrorMessage('Please select a human decision action.');
      return;
    }

    if (selectedAction === 'Reject' && !rejectionReason.trim()) {
      setErrorMessage('A detailed reason is strictly required when rejecting a case.');
      return;
    }

    if (!reviewerName.trim()) {
      setErrorMessage('Please enter your authorized reviewer name.');
      return;
    }

    const decisionRecord: HumanDecisionRecord = {
      decision: selectedAction,
      decidedBy: reviewerName,
      reviewerRole: reviewerRole,
      decidedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      reason: selectedAction === 'Reject' ? rejectionReason : undefined,
      notes: decisionNotes || (selectedAction === 'Approve' ? 'Case approved after thorough document inspection.' : undefined),
    };

    // Determine new case status based on human choice
    let newStatus = caseItem.status;
    let newFinalDecisionState = caseItem.finalDecisionState;
    let newTimeline = [...caseItem.timeline];

    if (selectedAction === 'Approve') {
      newStatus = 'Approved';
      newFinalDecisionState = 'Approved';
      newTimeline = newTimeline.map((step) => {
        if (step.stepNumber === 3) {
          return {
            ...step,
            status: 'Completed' as const,
            date: step.date || 'Today',
            explanation: step.explanation || 'Hospital clinical desk verified treatment order and itemized cost.',
            reviewerRole: step.reviewerRole || 'Hospital Desk Liaison',
          };
        }
        if (step.stepNumber === 4) {
          return {
            ...step,
            status: 'Completed' as const,
            date: new Date().toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            explanation: `Authorized human reviewer (${reviewerName}) made final binding decision to approve. Verified for community escrow funding.`,
            reviewerRole: reviewerRole,
          };
        }
        return step;
      });
    } else if (selectedAction === 'Request More Information') {
      newStatus = 'Requires More Information';
      newFinalDecisionState = 'Requires More Information';
    } else if (selectedAction === 'Send for Further Review') {
      newStatus = 'Human Review Required';
      newFinalDecisionState = 'Send for Further Review';
    } else if (selectedAction === 'Reject') {
      newStatus = 'Requires More Information'; // Respectful non-destructive status
      newFinalDecisionState = 'Rejected';
    }

    const updatedDocumentChecks = selectedAction === 'Approve'
      ? caseItem.documentChecks.map((d) => ({
          ...d,
          status: 'Verified' as const,
          note: d.note.includes('Verified') ? d.note : `${d.note} · Verified by Authorized Auditor (${reviewerName})`,
        }))
      : caseItem.documentChecks;

    const updatedCase: MedicalCase = {
      ...caseItem,
      status: newStatus,
      humanReviewState: 'Completed',
      finalDecisionState: newFinalDecisionState,
      verifiedByTitle: reviewerRole,
      verifierName: reviewerName,
      verificationDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      humanDecisions: [decisionRecord, ...caseItem.humanDecisions],
      timeline: newTimeline,
      documentChecks: updatedDocumentChecks,
      hasInconsistency: selectedAction === 'Approve' ? false : caseItem.hasInconsistency,
      isResolved: selectedAction === 'Approve' ? true : caseItem.isResolved,
    };

    onDecisionSubmit(decisionRecord, updatedCase);
    setIsSubmitted(true);
  };

  return (
    <div className={`cf-card space-y-6 ${className}`}>
      {/* Header with Title and Trust Message */}
      <div className="border-b border-neutral-100 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="cf-section-heading text-neutral-900">
            Decision Control Panel · Case {caseItem.id}
          </h2>
          <span className="cf-status-text text-xs px-2.5 py-1 rounded bg-neutral-100 text-neutral-800">
            Authorized Personnel Only
          </span>
        </div>
        <p className="cf-secondary text-xs sm:text-sm text-neutral-600">
          AI assists with initial checks. You as an authorized human reviewer make the final binding decision.
        </p>
      </div>

      {/* Decision Status Trio (Rule 13) */}
      <DecisionStatusTrio
        aiScreening={caseItem.aiScreeningState}
        humanReview={caseItem.humanReviewState}
        finalDecision={caseItem.finalDecisionState}
      />

      <TrustMessageBanner />

      {/* 1. INFORMATION REVIEW (Section 2) */}
      <div className="border border-neutral-200 rounded-xl p-5 bg-neutral-50/70 space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <FileCheck2 className="w-4 h-4 text-neutral-700" />
          <h3 className="cf-card-heading text-neutral-900 text-sm sm:text-base">
            1. Information Review
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] block text-neutral-500">Patient</span>
            <span className="font-semibold text-neutral-900">{caseItem.patientName}</span>
            <span className="text-neutral-500 block text-[10px]">Age: {caseItem.patientAge}y</span>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] block text-neutral-500">Treatment</span>
            <span className="font-semibold text-neutral-900 truncate block" title={caseItem.treatment}>
              {caseItem.treatment}
            </span>
            <span className="text-neutral-500 block text-[10px]">{caseItem.treatmentCategory}</span>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] block text-neutral-500">Hospital</span>
            <span className="font-semibold text-neutral-900 truncate block" title={caseItem.hospital}>
              {caseItem.hospital}
            </span>
            <span className="text-neutral-500 block text-[10px]">{caseItem.city}</span>
          </div>

          <div className="p-2.5 bg-white rounded-lg border border-neutral-200">
            <span className="cf-secondary text-[11px] block text-neutral-500">Verified Gap</span>
            <span className="cf-financial-number text-sm text-red-700">
              {formatINR(caseItem.verifiedFundingGap)}
            </span>
            <span className="text-neutral-500 block text-[10px]">Cost: {formatINR(caseItem.totalTreatmentCost)}</span>
          </div>
        </div>

        <div className="pt-1 text-xs text-neutral-700 space-y-1">
          <p><strong>Clinical Diagnosis:</strong> {caseItem.diagnosisSummary}</p>
          <p className="text-neutral-600"><strong>Patient Background:</strong> {caseItem.patientStory}</p>
        </div>
      </div>

      {/* 2. AI ASSISTANCE (Section 2) */}
      <div className="border border-neutral-200 rounded-xl p-5 bg-white space-y-3">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <HelpCircle className="w-4 h-4 text-red-600" />
          <h3 className="cf-card-heading text-neutral-900 text-sm sm:text-base">
            2. AI Assistance (Advisory Only)
          </h3>
          <span className="cf-secondary text-xs text-neutral-500 ml-auto hidden sm:inline">
            Non-binding check
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Summary */}
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="font-semibold text-neutral-900 mb-1">
              AI Document Check Summary:
            </p>
            <p className="text-neutral-700 leading-relaxed">
              {caseItem.aiAssistance.checkedSummary}
            </p>
          </div>

          {/* Checked Items */}
          <div>
            <span className="font-semibold text-neutral-800 block mb-1">What the AI checked:</span>
            <ul className="list-disc list-inside space-y-1 text-neutral-600">
              {caseItem.aiAssistance.checkedItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Possible Inconsistencies */}
          {caseItem.aiAssistance.possibleInconsistencies.length > 0 ? (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <span className="font-semibold text-amber-900 block mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Possible Inconsistencies Identified for Reviewer:
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-800">
                {caseItem.aiAssistance.possibleInconsistencies.map((inc, idx) => (
                  <li key={idx}>{inc}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No automated line-item inconsistencies detected in initial screening.</span>
            </div>
          )}

          {/* Confidence Note */}
          <p className="cf-secondary text-[11px] text-neutral-500 italic">
            {caseItem.aiAssistance.confidenceExplanation}
          </p>
        </div>
      </div>

      {/* 3. HUMAN DECISION (Section 2 & 16) */}
      <div className="border-2 border-neutral-300 rounded-xl p-5 bg-white space-y-4">
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <UserCheck className="w-4 h-4 text-neutral-900" />
          <h3 className="cf-card-heading text-neutral-900 text-sm sm:text-base">
            3. Human Decision
          </h3>
          <span className="text-xs font-semibold text-red-700 ml-auto">
            Authorized Human Action Required
          </span>
        </div>

        {isSubmitted ? (
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="font-semibold text-sm">Human Decision Recorded Successfully</h4>
            <p className="cf-secondary text-xs text-emerald-800">
              Decision "{selectedAction}" has been recorded in the permanent CareFund audit trail by {reviewerName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Reviewer Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="cf-label block text-xs mb-1">Authorized Reviewer Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>

              <div>
                <label className="cf-label block text-xs mb-1">Reviewer Role / Hospital Desk</label>
                <input
                  type="text"
                  required
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>
            </div>

            {/* Decision Action Buttons (Rule 2 & 16) */}
            <div>
              <label className="cf-label block text-xs mb-1.5">
                Select Your Final Decision Action:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction('Approve')}
                  className={`h-11 px-3 rounded-lg border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedAction === 'Approve'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve Case
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAction('Request More Information')}
                  className={`h-11 px-3 rounded-lg border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedAction === 'Request More Information'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Request More Info
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAction('Send for Further Review')}
                  className={`h-11 px-3 rounded-lg border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedAction === 'Send for Further Review'
                      ? 'bg-neutral-800 text-white border-neutral-800 shadow-xs'
                      : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Further Review
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAction('Reject')}
                  className={`h-11 px-3 rounded-lg border font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    selectedAction === 'Reject'
                      ? 'bg-red-700 text-white border-red-700 shadow-xs'
                      : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Reject Case
                </button>
              </div>
            </div>

            {/* Mandatory Reason if Rejecting (Rule 2 & 16) */}
            {selectedAction === 'Reject' && (
              <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 space-y-2 animate-in fade-in">
                <label className="cf-label block text-xs text-red-900 font-semibold">
                  Reason for Decision (Mandatory for Rejection)
                </label>
                <p className="cf-secondary text-[11px] text-red-700">
                  CareFund strictly requires an authorized reason for any rejection. This reason is permanently recorded in the audit trail.
                </p>
                <textarea
                  rows={2}
                  required
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Specify why this case cannot be approved (e.g. procedure cancelled by hospital, duplicate submission, or unverified provider)..."
                  className="w-full p-2.5 bg-white border border-red-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
                />
              </div>
            )}

            {/* Optional Notes */}
            <div>
              <label className="cf-label block text-xs mb-1">
                Reviewer Decision Notes (Recorded in Audit Trail)
              </label>
              <textarea
                rows={2}
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                placeholder="Add comments on clinical estimate validation, hospital counter-signature, or state scheme coordination..."
                className="w-full p-2.5 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={!selectedAction}
                className="cf-btn-primary h-11 px-6 text-sm"
              >
                <Send className="w-4 h-4" />
                Record Final Human Decision
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Historical Audit Trail of Human Decisions */}
      {caseItem.humanDecisions.length > 0 && (
        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <h4 className="cf-card-heading text-neutral-900 text-xs font-semibold uppercase tracking-wider">
            Decision Audit Trail ({caseItem.humanDecisions.length})
          </h4>
          <div className="space-y-2">
            {caseItem.humanDecisions.map((dec, idx) => (
              <div
                key={idx}
                className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-neutral-900">
                    Decision: <strong className="text-neutral-900">{dec.decision}</strong>
                  </span>
                  <span className="cf-secondary text-[11px] text-neutral-500">{dec.decidedAt}</span>
                </div>
                <p className="text-neutral-600">
                  By: {dec.decidedBy} ({dec.reviewerRole})
                </p>
                {dec.reason && (
                  <p className="text-red-700 bg-red-50 p-1.5 rounded border border-red-200 text-[11px]">
                    <strong>Reason for Rejection:</strong> {dec.reason}
                  </p>
                )}
                {dec.notes && (
                  <p className="text-neutral-600 text-[11px]">
                    <strong>Notes:</strong> {dec.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
