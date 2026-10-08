import React, { useState } from 'react';
import { MedicalCase, DonationRecord, HumanDecision } from '../types/carefund';
import { formatINR } from '../data/mockCases';
import { StatusBadge } from '../components/StatusBadge';
import { InfoBlock } from '../components/InfoBlock';
import { CaseDetailModal } from '../components/CaseDetailModal';
import { HumanDecisionControl } from '../components/HumanDecisionControl';
import { DecisionStatusTrio } from '../components/DecisionStatusTrio';
import { TrustMessageBanner } from '../components/TrustMessageBanner';
import { FourStepReviewStepper } from '../components/FourStepReviewStepper';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileCheck2,
  Scale,
  ClipboardList,
  UserCheck,
  Check,
  Send,
  HelpCircle,
  Search,
  History,
  Bell,
  User,
  Gavel,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  UploadCloud,
} from 'lucide-react';

interface ReviewerPortalViewProps {
  cases: MedicalCase[];
  donations: DonationRecord[];
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onUpdateCase: (updatedCase: MedicalCase) => void;
  onDonateSuccess: (donation: DonationRecord) => void;
}

export const ReviewerPortalView: React.FC<ReviewerPortalViewProps> = ({
  cases,
  donations,
  activeTab,
  onSelectTab,
  onUpdateCase,
  onDonateSuccess,
}) => {
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<MedicalCase | null>(null);
  const [decidingCase, setDecidingCase] = useState<MedicalCase | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [queueSearchQuery, setQueueSearchQuery] = useState('');
  const [queueFilter, setQueueFilter] = useState<'all' | 'submitted' | 'ai-checked' | 'review-required'>('all');
  const [humanReviewCaseId, setHumanReviewCaseId] = useState<string>(cases[0]?.id || 'CF-CHN-2026-00124');
  const [uploadedReviewerFileName, setUploadedReviewerFileName] = useState('');
  const [uploadedReviewerCategory, setUploadedReviewerCategory] = useState('Auditor Clinical Verification Certificate');

  // Key metrics
  const totalActiveCases = cases.length;
  const casesUnderReview = cases.filter(
    (c) =>
      c.status === 'Verification in Progress' ||
      c.status === 'Human Review Required' ||
      c.status === 'AI Screening Completed' ||
      c.status === 'Information Submitted' ||
      c.status === 'Requires More Information'
  ).length;
  const verifiedCasesCount = cases.filter(
    (c) => c.status === 'Hospital Verified' || c.status === 'Approved'
  ).length;
  const inconsistentCases = cases.filter((c) => c.hasInconsistency && !c.isResolved);

  const filteredQueueCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(queueSearchQuery.toLowerCase()) ||
      c.patientName.toLowerCase().includes(queueSearchQuery.toLowerCase()) ||
      c.treatment.toLowerCase().includes(queueSearchQuery.toLowerCase()) ||
      c.hospital.toLowerCase().includes(queueSearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (queueFilter === 'submitted') return c.status === 'Information Submitted';
    if (queueFilter === 'ai-checked')
      return c.status === 'AI Check Completed' || c.status === 'AI Screening Completed';
    if (queueFilter === 'review-required')
      return (
        c.status === 'Human Review Required' ||
        c.status === 'Verification in Progress' ||
        c.status === 'Hospital Verified'
      );

    return true;
  });

  const handleDecisionComplete = (dec: HumanDecision, updated: MedicalCase) => {
    onUpdateCase(updated);
    setFeedbackMessage(
      `Authorized human decision "${dec.decision}" recorded for Case ${updated.id} by ${dec.decidedBy}. Case verified across 4 steps.`
    );
    setDecidingCase(null);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleQuickApprove = (targetCase: MedicalCase) => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const decisionRecord = {
      decision: 'Approve' as const,
      decidedBy: 'Dr. K. Swaminathan, MD',
      reviewerRole: 'Authorized Clinical Reviewer & Auditor',
      decidedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      notes: 'Approved after inspecting hospital uploaded documents, treatment tariffs, and verified patient gap.',
    };

    const updatedTimeline = targetCase.timeline.map((step) => {
      if (step.stepNumber === 3) {
        return {
          ...step,
          status: 'Completed' as const,
          date: step.date || currentDate,
          explanation: step.explanation || 'Hospital clinical desk verified admission order and itemized cost.',
          reviewerRole: step.reviewerRole || 'Hospital Desk Liaison',
        };
      }
      if (step.stepNumber === 4) {
        return {
          ...step,
          status: 'Completed' as const,
          date: currentDate,
          explanation: 'Authorized clinical reviewer made final decision to approve. Verified for community escrow funding.',
          reviewerRole: 'Dr. K. Swaminathan, MD (Authorized Reviewer)',
        };
      }
      return step;
    });

    const updatedDocs = targetCase.documentChecks.map((doc) => ({
      ...doc,
      status: 'Verified' as const,
      note: doc.note.includes('Verified') ? doc.note : `${doc.note} · Verified by Clinical Auditor`,
    }));

    const updatedCase: MedicalCase = {
      ...targetCase,
      status: 'Approved',
      humanReviewState: 'Completed',
      finalDecisionState: 'Approved',
      verifiedByTitle: 'Authorized Clinical Reviewer & Auditor',
      verifierName: 'Dr. K. Swaminathan, MD',
      verificationDate: currentDate,
      timeline: updatedTimeline,
      documentChecks: updatedDocs,
      humanDecisions: [decisionRecord, ...(targetCase.humanDecisions || [])],
      hasInconsistency: false,
      isResolved: true,
      inconsistencyNotes: undefined,
    };

    onUpdateCase(updatedCase);
    setFeedbackMessage(
      `Case ${targetCase.id} verified and approved! All 4 steps completed and files confirmed.`
    );
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleResolveInconsistency = (targetCase: MedicalCase) => {
    const updated: MedicalCase = {
      ...targetCase,
      isResolved: true,
      hasInconsistency: false,
      inconsistencyNotes: undefined,
    };
    onUpdateCase(updated);
    setFeedbackMessage(
      `Discrepancy resolved by Authorized Auditor for Case ${targetCase.id}. Verified against hospital catalog.`
    );
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleVerifySingleDoc = (targetCase: MedicalCase, docIndex: number) => {
    const docToVerify = targetCase.documentChecks[docIndex];
    if (!docToVerify) return;

    const updatedDocs = targetCase.documentChecks.map((doc, idx) => {
      if (idx === docIndex) {
        return {
          ...doc,
          status: 'Verified' as const,
          note: doc.note.includes('Verified')
            ? doc.note
            : `${doc.note} · Verified on web by Authorized Auditor`,
        };
      }
      return doc;
    });

    const updatedCase: MedicalCase = {
      ...targetCase,
      documentChecks: updatedDocs,
    };

    onUpdateCase(updatedCase);
    setFeedbackMessage(`Document "${docToVerify.name}" marked as Verified on web for Case ${targetCase.id}.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleUploadReviewerDocSubmit = (targetCase: MedicalCase, e: React.FormEvent) => {
    e.preventDefault();
    const docName = uploadedReviewerFileName || 'Auditor_Clinical_Verification_and_Clearance_Slip.pdf';
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const newDoc = {
      name: `${uploadedReviewerCategory}: ${docName}`,
      status: 'Verified' as const,
      note: `Uploaded to web and certified by Authorized Auditor Desk on ${currentDate}. Clinical seal attached.`,
    };

    const updatedTimeline = targetCase.timeline.map((step) => {
      if (step.stepNumber === 3) {
        return {
          ...step,
          status: 'Completed' as const,
          date: currentDate,
          explanation: `Clinical reviewer & hospital files (${docName}) verified and uploaded to web.`,
          reviewerRole: 'Authorized Clinical Auditor Desk',
        };
      }
      return step;
    });

    const updatedDocs = [
      newDoc,
      ...targetCase.documentChecks.map((d) => ({
        ...d,
        status: 'Verified' as const,
        note: d.note.includes('Verified') ? d.note : `${d.note} · Verified by Auditor`,
      })),
    ];

    const updatedCase: MedicalCase = {
      ...targetCase,
      timeline: updatedTimeline,
      documentChecks: updatedDocs,
      status: targetCase.status === 'Approved' ? 'Approved' : 'Hospital Verified',
      humanReviewState: 'Completed',
      verificationDate: currentDate,
      verifierName: targetCase.verifierName || 'Dr. K. Swaminathan, MD (Authorized Auditor)',
      verifiedByTitle: targetCase.verifiedByTitle || 'Authorized Clinical Reviewer & Auditor',
    };

    onUpdateCase(updatedCase);
    setUploadedReviewerFileName('');
    setFeedbackMessage(`Auditor verification file "${docName}" uploaded to web and all documents verified for Case ${targetCase.id}!`);
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {feedbackMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: DASHBOARD                                                 */}
      {/* ============================================================== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="cf-title text-neutral-900">Reviewer & Audit Dashboard</h1>
              <p className="cf-body text-neutral-600 mt-1">
                Authorized clinical audit desk. AI assists with initial checks; authorized humans make all final decisions.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold">AI assists · Humans decide</span>
            </div>
          </div>

          <TrustMessageBanner />

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-amber-700 font-medium">Cases Awaiting Review</span>
              <p className="cf-financial-number text-2xl text-amber-700 mt-1">
                {casesUnderReview}
              </p>
              <p className="text-[11px] text-amber-600 mt-1">Requiring authorized human sign-off</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-neutral-500 font-medium">AI Screening Flags</span>
              <p className="cf-financial-number text-2xl text-red-600 mt-1">
                {inconsistentCases.length}
              </p>
              <p className="text-[11px] text-red-600 mt-1">Variances identified for auditor review</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-emerald-700 font-medium">Approved by Humans</span>
              <p className="cf-financial-number text-2xl text-emerald-700 mt-1">
                {verifiedCasesCount}
              </p>
              <p className="text-[11px] text-emerald-600 mt-1">Authorized for community crowdfunding</p>
            </div>

            <div className="cf-card p-5">
              <span className="cf-secondary text-xs text-neutral-500 font-medium">Audited Gap Total</span>
              <p className="cf-financial-number text-2xl text-neutral-900 mt-1">
                {formatINR(cases.reduce((acc, c) => acc + c.verifiedFundingGap, 0))}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">Mathematically verified funding gap</p>
            </div>
          </div>

          {/* Urgent Queue Preview */}
          <div className="cf-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="cf-card-heading text-neutral-900">Cases Pending Final Human Decision</h3>
                <p className="cf-secondary text-xs text-neutral-500 mt-0.5">
                  AI initial check completed. Awaiting authorized clinical reviewer determination.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectTab('final-decisions')}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Final Decision Console</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {cases.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-neutral-500">{c.id}</span>
                      <StatusBadge status={c.status} size="sm" />
                      {c.hasInconsistency && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                          AI Flagged Variance
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 mt-1">
                      {c.patientName}, {c.age}y · {c.treatment}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {c.hospital} · Net Funding Gap: {formatINR(c.verifiedFundingGap)}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setDecidingCase(c);
                        onSelectTab('final-decisions');
                      }}
                      className="cf-btn-primary text-xs py-2 px-3 cursor-pointer"
                    >
                      Take Decision
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCaseForDetail(c)}
                      className="cf-btn-secondary text-xs py-2 px-3 cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: CASES TO REVIEW                                           */}
      {/* ============================================================== */}
      {activeTab === 'cases-to-review' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Cases Awaiting Human Review</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Filter and inspect patient cases through the 4-step verification system.
            </p>
          </div>

          <div className="cf-card p-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search queue by patient, hospital, procedure, or case ID..."
                value={queueSearchQuery}
                onChange={(e) => setQueueSearchQuery(e.target.value)}
                className="cf-input pl-9 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setQueueFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  queueFilter === 'all'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                All Cases ({cases.length})
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('submitted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  queueFilter === 'submitted'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Step 1: Submitted
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('ai-checked')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  queueFilter === 'ai-checked'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Step 2: AI Checked
              </button>
              <button
                type="button"
                onClick={() => setQueueFilter('review-required')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  queueFilter === 'review-required'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                Step 3: Human Review
              </button>
            </div>
          </div>

          <div className="cf-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Case ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Hospital & Treatment</th>
                    <th className="py-3 px-4 text-right">Net Gap</th>
                    <th className="py-3 px-4 text-center">AI Screening</th>
                    <th className="py-3 px-4 text-center">Current Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredQueueCases.map((c) => (
                    <tr key={c.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900">{c.id}</td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-900">
                        {c.patientName}, {c.age}y
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-neutral-800">{c.treatment}</p>
                        <p className="text-[11px] text-neutral-500">{c.hospital}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-neutral-900">
                        {formatINR(c.verifiedFundingGap)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {c.hasInconsistency ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>Variance Flagged</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Clear</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setDecidingCase(c);
                              onSelectTab('final-decisions');
                            }}
                            className="cf-btn-primary text-xs py-1.5 px-2.5 cursor-pointer"
                          >
                            Decide
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedCaseForDetail(c)}
                            className="cf-btn-secondary text-xs py-1.5 px-2.5 cursor-pointer"
                          >
                            Docs
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: AI SCREENING RESULTS                                      */}
      {/* ============================================================== */}
      {activeTab === 'ai-screening' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">AI Screening Results & Discrepancy Review</h1>
            <p className="cf-body text-neutral-600 mt-1">
              AI checks only for missing documents, date mismatches, and cost math. AI does not approve or reject; authorized humans decide.
            </p>
          </div>

          <TrustMessageBanner />

          {/* AI Check Capabilities Explainer */}
          <div className="cf-card p-6 bg-neutral-50/70 border-neutral-200 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">AI Initial Check Scope</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-neutral-200">
                <p className="font-semibold text-neutral-900">1. Missing Information</p>
                <p className="text-neutral-500 mt-0.5">Detects omitted discharge summaries or missing lab sheets.</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-neutral-200">
                <p className="font-semibold text-neutral-900">2. Date Mismatches</p>
                <p className="text-neutral-500 mt-0.5">Flags admission date discrepancies with hospital bills.</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-neutral-200">
                <p className="font-semibold text-neutral-900">3. Amount Mismatches</p>
                <p className="text-neutral-500 mt-0.5">Verifies arithmetic sum of ICU, surgeon, and implants.</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-neutral-200">
                <p className="font-semibold text-neutral-900">4. Duplicate Detection</p>
                <p className="text-neutral-500 mt-0.5">Checks patient MRN against existing cases to prevent dual funding.</p>
              </div>
            </div>
          </div>

          {/* Active Discrepancies */}
          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">Flagged Cases Requiring Human Clinical Review</h3>

            {cases.filter((c) => c.hasInconsistency).length === 0 ? (
              <p className="text-xs text-neutral-500 italic p-4 bg-neutral-50 rounded-lg">
                No active discrepancies flagged by AI.
              </p>
            ) : (
              <div className="space-y-4">
                {cases
                  .filter((c) => c.hasInconsistency)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-5 bg-amber-50/40 rounded-xl border border-amber-200 space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-neutral-500">{item.id}</span>
                          <span className="font-bold text-neutral-900 text-sm">
                            {item.patientName} · {item.treatment}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                          AI Discrepancy Notice
                        </span>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs text-neutral-700">
                        <span className="font-semibold text-amber-900 block mb-0.5">
                          AI Checked Inconsistency Note:
                        </span>
                        <p>{item.inconsistencyNotes || 'Estimate surgical cost differs from Apollo standard tariff by ₹50,000.'}</p>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleResolveInconsistency(item)}
                          className="cf-btn-primary text-xs py-1.5 px-3 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Resolve Inconsistency (Auditor Sign-off)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCaseForDetail(item)}
                          className="cf-btn-secondary text-xs py-1.5 px-3 cursor-pointer"
                        >
                          Inspect Document Details
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: HUMAN REVIEW & 4-STEP DESK                                */}
      {/* ============================================================== */}
      {activeTab === 'human-review' && (() => {
        const inspectedCase = cases.find((c) => c.id === humanReviewCaseId) || cases[0];

        return (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="cf-title text-neutral-900">Human Review Desk</h1>
                <p className="cf-body text-neutral-600 mt-1">
                  Step 3 & 4 in the 4-step system. Inspect files uploaded from hospital and patient, check clinical tariffs, and authorize final decisions.
                </p>
              </div>

              {/* Case selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-600">Select Case:</span>
                <select
                  value={humanReviewCaseId}
                  onChange={(e) => setHumanReviewCaseId(e.target.value)}
                  className="cf-input text-xs py-1.5 font-mono"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} — {c.patientName} ({c.status})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <TrustMessageBanner />

            {/* Stepper demonstration for selected case */}
            {inspectedCase && (
              <div className="cf-card p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-200">
                  <div>
                    <span className="font-mono text-xs text-neutral-500">{inspectedCase.id}</span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-0.5">
                      {inspectedCase.patientName}, {inspectedCase.age}y · {inspectedCase.treatment}
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {inspectedCase.hospital} · Verified Funding Gap: {formatINR(inspectedCase.verifiedFundingGap)}
                    </p>
                  </div>
                  <StatusBadge status={inspectedCase.status} />
                </div>

                <FourStepReviewStepper
                  currentStep={
                    inspectedCase.status === 'Approved'
                      ? 4
                      : inspectedCase.status === 'Hospital Verified'
                      ? 3
                      : 2
                  }
                  status={inspectedCase.status}
                />

                {/* Uploaded Files from Hospital and Patient */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="cf-card-heading text-neutral-900 text-sm">
                      Files Uploaded to Web from Hospital & Patient ({inspectedCase.documentChecks.length})
                    </h4>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Synchronized from Web Desk
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {inspectedCase.documentChecks.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-2.5">
                          <FileText className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-neutral-900">{doc.name}</p>
                            <p className="text-neutral-500 text-[11px] mt-0.5">{doc.note}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              doc.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {doc.status}
                          </span>
                          {doc.status !== 'Verified' && (
                            <button
                              type="button"
                              onClick={() => handleVerifySingleDoc(inspectedCase, idx)}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-medium cursor-pointer"
                            >
                              Verify File
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Upload Verification Files to Web from Reviewer / Receiver */}
                  <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-3 mt-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-neutral-600" />
                        <span>Upload Auditor / Receiver Clearance File to Web</span>
                      </h5>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Official Clearance Seal
                      </span>
                    </div>

                    <form onSubmit={(e) => handleUploadReviewerDocSubmit(inspectedCase, e)} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="cf-label block mb-1">Clearance Category</label>
                          <select
                            value={uploadedReviewerCategory}
                            onChange={(e) => setUploadedReviewerCategory(e.target.value)}
                            className="cf-input text-xs"
                          >
                            <option>Auditor Clinical Verification Certificate</option>
                            <option>Hospital & Receiver Counter-Signed Estimate</option>
                            <option>Escrow Ring-Fencing Approval Slip</option>
                            <option>Second Opinion & Diagnostic Review Form</option>
                          </select>
                        </div>

                        <div>
                          <label className="cf-label block mb-1">File Name</label>
                          <input
                            type="text"
                            placeholder="e.g. CareFund_Auditor_Clearance_CF-CHN-00124.pdf"
                            value={uploadedReviewerFileName}
                            onChange={(e) => setUploadedReviewerFileName(e.target.value)}
                            className="cf-input text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          <label className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded border border-neutral-300 text-[11px] font-medium cursor-pointer">
                            <span>Browse File</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  setUploadedReviewerFileName(e.target.files[0].name);
                                }
                              }}
                            />
                          </label>
                          {!uploadedReviewerFileName && (
                            <button
                              type="button"
                              onClick={() => setUploadedReviewerFileName(`CareFund_Auditor_Clearance_${inspectedCase.id}.pdf`)}
                              className="text-[11px] text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                            >
                              Use standard auditor clearance PDF
                            </button>
                          )}
                          {uploadedReviewerFileName && (
                            <span className="text-[11px] font-medium text-neutral-700">
                              Selected: {uploadedReviewerFileName}
                            </span>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Upload to Web & Mark Verified</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Clinical Review Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-100">
                  <span className="text-xs text-neutral-500">
                    AI assists with screening. Authorized clinical reviewers record binding approval.
                  </span>
                  <div className="flex items-center gap-2">
                    {inspectedCase.status !== 'Approved' && (
                      <button
                        type="button"
                        onClick={() => handleQuickApprove(inspectedCase)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify & Approve Case</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setDecidingCase(inspectedCase);
                        onSelectTab('final-decisions');
                      }}
                      className="cf-btn-primary text-xs py-2 px-4 cursor-pointer"
                    >
                      <span>Decision Console</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* TAB: FINAL DECISION CONSOLE                                    */}
      {/* ============================================================== */}
      {activeTab === 'final-decisions' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Final Decision Console</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Step 4 in the 4-step review system. The authorized human reviewer makes the final decision. AI only assists.
            </p>
          </div>

          <TrustMessageBanner />

          {/* Active Decision Control Workspace */}
          {decidingCase ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-900 text-white rounded-xl">
                <div>
                  <span className="text-xs text-neutral-400 font-mono">{decidingCase.id}</span>
                  <h3 className="text-base font-bold">
                    Making Final Human Decision: {decidingCase.patientName} ({decidingCase.treatment})
                  </h3>
                  <p className="text-xs text-neutral-300">
                    Hospital: {decidingCase.hospital} · Net Funding Gap: {formatINR(decidingCase.verifiedFundingGap)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDecidingCase(null)}
                  className="text-xs px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white cursor-pointer"
                >
                  Change Case
                </button>
              </div>

              <HumanDecisionControl
                medicalCase={decidingCase}
                onDecisionComplete={handleDecisionComplete}
                onCancel={() => setDecidingCase(null)}
              />
            </div>
          ) : (
            <div className="cf-card p-6 space-y-4">
              <h3 className="cf-card-heading text-neutral-900">Select Case for Final Human Decision</h3>
              <div className="space-y-3">
                {cases.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-neutral-500">{c.id}</span>
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        {c.patientName}, {c.age}y · {c.treatment}
                      </h4>
                      <p className="text-xs text-neutral-600">
                        {c.hospital} · Verified Funding Gap: {formatINR(c.verifiedFundingGap)}
                      </p>
                      {/* Documents snippet */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-neutral-500">Uploaded Files:</span>
                        {c.documentChecks.map((doc, dIdx) => (
                          <span
                            key={dIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-white border border-neutral-200 text-neutral-700"
                          >
                            <FileText className="w-3 h-3 text-red-500" />
                            <span className="truncate max-w-[140px]">{doc.name}</span>
                          </span>
                        ))}
                      </div>
                      {c.decision && (
                        <p className="text-[11px] text-emerald-800 font-medium pt-0.5">
                          Decided: {c.decision.decision} on {c.decision.decidedAt} by {c.decision.decidedBy}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.status !== 'Approved' && (
                        <button
                          type="button"
                          onClick={() => handleQuickApprove(c)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify & Approve</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setDecidingCase(c)}
                        className="cf-btn-primary text-xs py-2 px-3 cursor-pointer flex items-center gap-1"
                      >
                        <span>Decision Console</span>
                        <Gavel className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: AUDIT TRAIL                                               */}
      {/* ============================================================== */}
      {activeTab === 'audit-trail' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Immutable Audit Trail</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Timestamped cryptographic log of every submission, AI check, hospital verification, and human decision.
            </p>
          </div>

          <div className="cf-card divide-y divide-neutral-100">
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 mt-0.5">
                <Gavel className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Step 4: Final Human Decision Recorded
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">05 Oct 2026, 04:30 PM</span>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Case CF-CHN-2026-00124 (Kavitha R.) approved by Dr. K. Swaminathan, MD (#REV-094). Funding opened.
                </p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-700 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Step 3: Hospital Liaison Verification Confirmed
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">04 Oct 2026, 06:15 PM</span>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Apollo Greams Road medical social worker verified LVAD admission and estimate #APH-GRE-2026-98124.
                </p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-700 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Step 2: AI Initial Screening Completed
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">04 Oct 2026, 03:30 PM</span>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  All 3 clinical documents checked. Zero date discrepancies. Net gap verified: ₹15,50,000.
                </p>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700 mt-0.5">
                <ClipboardList className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">
                    Step 1: Patient Assistance Request Submitted
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">04 Oct 2026, 02:15 PM</span>
                </div>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Submitted by family of Kavitha R. Admitted at Apollo Hospitals Greams Road Chennai.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: NOTIFICATIONS                                             */}
      {/* ============================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-8">
          <div>
            <h1 className="cf-title text-neutral-900">Reviewer Notifications</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Alerts for new case submissions, hospital verifications, and escalated reviews.
            </p>
          </div>

          <div className="cf-card divide-y divide-neutral-100">
            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-700 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">
                  Priority Case: CF-CHN-2026-00125 (Acute Leukemia) requires expedited human review
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Admitted to Cancer Institute (WIA), Adyar. Chemotherapy cycle scheduled for 10 Oct 2026.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">08 Oct 2026, 09:00 AM</span>
              </div>
            </div>

            <div className="p-4 flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-900">
                  Hospital Verification Completed by Apollo Desk for CF-CHN-2026-00124
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Dr. Balasubramanian uploaded signed schedule of charges. Ready for final review.
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">04 Oct 2026, 06:15 PM</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: PROFILE                                                   */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="space-y-8 max-w-3xl">
          <div>
            <h1 className="cf-title text-neutral-900">Reviewer & Auditor Profile</h1>
            <p className="cf-body text-neutral-600 mt-1">
              Authorized clinical auditor credentials, digital signing authority, and governance identity.
            </p>
          </div>

          <div className="cf-card p-6 space-y-4">
            <h3 className="cf-card-heading text-neutral-900">Clinical Reviewer Credentials</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cf-label block mb-1">Auditor Full Name</label>
                <input
                  type="text"
                  readOnly
                  value="Dr. K. Swaminathan, MD"
                  className="cf-input text-sm bg-neutral-50"
                />
              </div>
              <div>
                <label className="cf-label block mb-1">Medical Registration Number</label>
                <input
                  type="text"
                  readOnly
                  value="TMC-78412 (Tamil Nadu Medical Council)"
                  className="cf-input text-sm font-mono bg-neutral-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="cf-label block mb-1">CareFund Auditor ID</label>
                <input
                  type="text"
                  readOnly
                  value="AUD-CHN-094"
                  className="cf-input text-sm font-mono bg-neutral-50"
                />
              </div>
              <div>
                <label className="cf-label block mb-1">Clinical Designation</label>
                <input
                  type="text"
                  readOnly
                  value="Authorized Clinical Auditor & Governance Chair"
                  className="cf-input text-sm bg-neutral-50"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Authorized to record binding final human approvals, rejections, and audit sign-offs.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      {selectedCaseForDetail && (
        <CaseDetailModal
          medicalCase={selectedCaseForDetail}
          onClose={() => setSelectedCaseForDetail(null)}
          onUpdateCase={onUpdateCase}
        />
      )}
    </div>
  );
};
